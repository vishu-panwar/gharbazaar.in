'use client'

import { useEffect } from 'react'

export default function PWARegister() {
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

    // Handle install prompt
    const handleBeforeInstallPrompt = (e: any) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later.
      (window as any).deferredPrompt = e;
      console.log('✅ PWA: Install prompt CAPTURED!');
      // Simple alert to help the developer see when it's ready
      window.alert('🚀 GharBazaar is ready to be installed! Look for the "Install" icon in your browser address bar.');
      window.dispatchEvent(new CustomEvent('pwa-can-install'));
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  // The bis_skin_checked error in your console is caused by the Brave browser extension
  // and is not a bug in our code. It is safe to ignore.
  return null;
}
