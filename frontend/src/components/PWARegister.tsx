'use client'

import { useEffect, useState } from 'react'
import PWAInstallModal from './PWAInstallModal'

const INSTALL_PROMPT_SHOWN_KEY = 'pwaInstallPromptShown_v1'

export default function PWARegister() {
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
      return
    }

    // Keep local development predictable and avoid stale cache issues.
    if (process.env.NODE_ENV !== 'production') {
      navigator.serviceWorker
        .getRegistrations()
        .then((registrations) => {
          registrations.forEach((registration) => registration.unregister())
        })
        .catch(() => {
          // Ignore cleanup errors in development.
        })
      return
    }

    navigator.serviceWorker
      .register('/sw.js')
      .then((registration) => {
        console.log('PWA: Service worker registered', registration.scope)
      })
      .catch((error) => {
        console.error('PWA: Service worker registration failed', error)
      })

    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault()
      ;(window as any).deferredPrompt = e
      console.log('PWA: Install prompt captured')

      try {
        const alreadyShown = localStorage.getItem(INSTALL_PROMPT_SHOWN_KEY)
        if (!alreadyShown) {
          setShowModal(true)
        } else {
          console.log('PWA: Install prompt already shown; skipping modal')
        }
      } catch (err) {
        // Fallback: show once per session when localStorage is unavailable.
        if (!(window as any).__pwa_prompt_fallback_shown) {
          setShowModal(true)
          ;(window as any).__pwa_prompt_fallback_shown = true
        }
      }

      window.dispatchEvent(new CustomEvent('pwa-can-install'))
    }

    const handleAppInstalled = () => {
      try {
        localStorage.setItem(INSTALL_PROMPT_SHOWN_KEY, '1')
      } catch (err) {
        // Ignore localStorage failures.
      }
      ;(window as any).deferredPrompt = null
      console.log('PWA: appinstalled event fired')
      setShowModal(false)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [])

  const handleInstall = async () => {
    const promptEvent = (window as any).deferredPrompt
    if (!promptEvent) {
      setShowModal(false)
      return
    }

    promptEvent.prompt()
    try {
      const { outcome } = await promptEvent.userChoice
      console.log('PWA: User response to install prompt', outcome)
    } catch (err) {
      console.warn('PWA: Error while awaiting userChoice', err)
    }

    ;(window as any).deferredPrompt = null
    try {
      localStorage.setItem(INSTALL_PROMPT_SHOWN_KEY, '1')
    } catch (err) {
      // Ignore localStorage failures.
    }
    setShowModal(false)
  }

  const handleDismiss = () => {
    try {
      localStorage.setItem(INSTALL_PROMPT_SHOWN_KEY, '1')
    } catch (err) {
      // Ignore localStorage failures.
    }
    setShowModal(false)
  }

  return <PWAInstallModal open={showModal} onInstall={handleInstall} onClose={handleDismiss} />
}
