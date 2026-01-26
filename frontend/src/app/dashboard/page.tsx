'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import BuyerDashboard from './components/BuyerDashboard'
import SellerDashboard from './components/SellerDashboard'

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [userMode, setUserMode] = useState<'buyer' | 'seller'>('buyer')
  const [currentTime, setCurrentTime] = useState(new Date())
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Ensure component is mounted
  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    try {
      // PRIORITY 1: Check for demo mode FIRST
      const demoMode = localStorage.getItem('demo_mode');
      const demoUserStr = localStorage.getItem('demo_user');

      if (demoMode === 'true' && demoUserStr) {
        try {
          const demoUser = JSON.parse(demoUserStr);
          console.log('Dashboard: Demo mode active, user:', demoUser);

          // Create user object from demo data
          const mockUser = {
            name: demoUser.displayName,
            email: demoUser.email,
            uid: demoUser.uid,
            role: demoUser.role,
          };

          setUser(mockUser);
          setUserMode(demoUser.role === 'seller' ? 'seller' : 'buyer');
          setLoading(false);
          return; // Exit early, don't check normal user
        } catch (e) {
          console.error('Dashboard: Error parsing demo user:', e);
        }
      }

      // PRIORITY 2: Check for normal user in localStorage
      const storedUser = localStorage.getItem('user')
      console.log('Dashboard: Checking user...', storedUser ? 'Found' : 'Not found')

      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser)
          console.log('Dashboard: User parsed successfully', parsedUser)
          setUser(parsedUser)
        } catch (error) {
          console.error('Dashboard: Error parsing user:', error)
          setError('Failed to load user data')
          localStorage.removeItem('user')
        }
      } else {
        console.log('Dashboard: No user found, redirecting to login')
        // No user, redirect to login after a short delay
        setTimeout(() => {
          router.push('/login')
        }, 100)
      }

      // Load user mode
      const savedMode = localStorage.getItem('userMode') as 'buyer' | 'seller'
      console.log('Dashboard: User mode:', savedMode || 'buyer (default)')
      if (savedMode) {
        setUserMode(savedMode)
      }

      setLoading(false)
    } catch (error) {
      console.error('Dashboard: Initialization error:', error)
      setError('Failed to initialize dashboard')
      setLoading(false)
    }
  }, [mounted, router])

  // Listen for mode changes from layout
  useEffect(() => {
    const handleModeChange = (event: any) => {
      console.log('Dashboard: Mode changed to', event.detail.mode)
      setUserMode(event.detail.mode)
    }

    window.addEventListener('userModeChange', handleModeChange)
    return () => window.removeEventListener('userModeChange', handleModeChange)
  }, [])

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  // Don't render anything until mounted (prevents hydration issues)
  if (!mounted) {
    return null
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400 font-medium">Loading dashboard...</p>
          <p className="text-xs text-gray-500 mt-2">Please wait</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">⚠️</span>
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Error Loading Dashboard</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
          <button
            onClick={() => router.push('/login')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-all"
          >
            Go to Login
          </button>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400 font-medium">Redirecting to login...</p>
        </div>
      </div>
    )
  }

  console.log('Dashboard: Rendering', userMode, 'dashboard for user:', user.name)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto">
        {userMode === 'buyer' ? (
          <BuyerDashboard user={user} currentTime={currentTime} />
        ) : (
          <SellerDashboard user={user} currentTime={currentTime} />
        )}
      </div>
    </div>
  )
}
