'use client'

import { useEffect, useState } from 'react'
import PWAInstallModal from './PWAInstallModal'

export default function PWARegister() {
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return;

    // Register service worker
    navigator.serviceWorker
      .register('/sw.js')
      .then((registration) => {
        console.log('✅ PWA: Service Worker registered!', registration.scope);

        // Diagnostic: Check if active
        if (registration.active) {
          console.log('✅ PWA: Service Worker is ACTIVE');
        } else {
          console.log('⏳ PWA: Service Worker is installing/waiting...');
        }
      })
      .catch((error) => {
        console.error('❌ PWA: Service Worker registration failed:', error);
      });

    const shownKey = 'pwaInstallPromptShown_v1'

    // Handle install prompt
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault()
      ;(window as any).deferredPrompt = e
      console.log('✅ PWA: Install prompt CAPTURED!')

      try {
        const alreadyShown = localStorage.getItem(shownKey)
        if (!alreadyShown) {
          setShowModal(true)
          // we DON'T set the flag here — set it when user installs or explicitly dismisses
        } else {
          console.log('PWA: install prompt previously shown; skipping modal')
        }
      } catch (err) {
        // fallback: show once per session
        if (!(window as any).__pwa_prompt_fallback_shown) {
          setShowModal(true)
          ;(window as any).__pwa_prompt_fallback_shown = true
        }
      }

      window.dispatchEvent(new CustomEvent('pwa-can-install'))
    }

    const handleAppInstalled = () => {
      try {
        localStorage.setItem(shownKey, '1')
      } catch (err) {
        /* ignore */
      }
      ;(window as any).deferredPrompt = null
      console.log('✅ PWA: appinstalled event fired')
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
      console.log('User response to the install prompt:', outcome)
    } catch (err) {
      console.warn('Error while awaiting userChoice', err)
    }
    ;(window as any).deferredPrompt = null
    try {
      localStorage.setItem('pwaInstallPromptShown_v1', '1')
    } catch (err) {
      /* ignore */
    }
    setShowModal(false)
  }

  const handleDismiss = () => {
    try {
      localStorage.setItem('pwaInstallPromptShown_v1', '1')
    } catch (err) {
      /* ignore */
    }
    setShowModal(false)
  }

  return (
    <>
      <PWAInstallModal open={showModal} onInstall={handleInstall} onClose={handleDismiss} />
    </>
  )
}
