'use client';

import { useEffect, useState } from 'react';
import { isDemoMode, isDemoModeAvailable, disableDemoMode, getDemoUser } from '@/lib/demoMode';
import { AlertTriangle, X } from 'lucide-react';

/**
 * Demo Mode Banner
 * 
 * Displays a prominent warning banner when demo mode is active.
 * Only shows in development environment when NEXT_PUBLIC_ENABLE_DEMO=true
 */
export function DemoBanner() {
  const [isDemo, setIsDemo] = useState(false);
  const [demoUser, setDemoUser] = useState<any>(null);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Only check in client-side
    if (typeof window === 'undefined') return;

    const demoActive = isDemoMode();
    setIsDemo(demoActive);

    if (demoActive) {
      const user = getDemoUser();
      setDemoUser(user);
    }
  }, []);

  // Don't show if:
  // - Demo mode not available
  // - Demo mode not active  
  // - User dismissed the banner
  if (!isDemoModeAvailable() || !isDemo || isDismissed) {
    return null;
  }

  const handleDisableDemo = () => {
    disableDemoMode();
    setIsDemo(false);
    // Reload to apply changes
    window.location.reload();
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-yellow-500 text-yellow-900 border-b-2 border-yellow-600 shadow-lg">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1">
            <AlertTriangle className="w-5 h-5 flex-shrink-0" />
            <div className="flex-1">
              <p className="font-semibold text-sm md:text-base">
                🚨 DEMO MODE ACTIVE
              </p>
              <p className="text-xs md:text-sm">
                You are logged in as <strong>{demoUser?.displayName}</strong> ({demoUser?.role}). 
                This is a demo account for testing purposes only.
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={handleDisableDemo}
              className="px-3 py-1 bg-yellow-900 text-yellow-100 rounded text-xs md:text-sm font-medium hover:bg-yellow-800 transition-colors whitespace-nowrap"
            >
              Exit Demo
            </button>
            <button
              onClick={() => setIsDismissed(true)}
              className="p-1 hover:bg-yellow-600 rounded transition-colors"
              aria-label="Dismiss banner"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Wrapper to add padding when demo banner is visible
 */
export function DemoModeWrapper({ children }: { children: React.ReactNode }) {
  const [isDemo, setIsDemo] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsDemo(isDemoMode());
    }
  }, []);

  return (
    <>
      <DemoBanner />
      <div className={isDemo ? 'pt-16' : ''}>
        {children}
      </div>
    </>
  );
}
