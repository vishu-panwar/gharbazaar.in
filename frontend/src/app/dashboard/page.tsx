'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
<<<<<<< HEAD
import { useAuth } from '@/contexts/AuthContext'
=======
>>>>>>> 27e598ded527a2c61948df157c36da50b6ff83d8
import BuyerDashboard from './components/BuyerDashboard'
import SellerDashboard from './components/SellerDashboard'

export default function DashboardPage() {
  const router = useRouter()
<<<<<<< HEAD
  const { user: authUser, loading: authLoading } = useAuth()
  const [user, setUser] = useState<any>(null)
  const [userMode, setUserMode] = useState<'buyer' | 'seller'>('buyer')
  const [currentTime, setCurrentTime] = useState(new Date())
=======
  const [user, setUser] = useState<any>(null)
  const [userMode, setUserMode] = useState<'buyer' | 'seller'>('buyer')
  const [currentTime, setCurrentTime] = useState(new Date())
  const [loading, setLoading] = useState(true)
>>>>>>> 27e598ded527a2c61948df157c36da50b6ff83d8
  const [mounted, setMounted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Ensure component is mounted
  useEffect(() => {
    setMounted(true)
  }, [])

<<<<<<< HEAD
  // Sync with AuthContext or Demo Mode
  useEffect(() => {
    if (!mounted) return

    // 1. Priority: Normal Auth - Use data from AuthContext
    if (authUser) {
      // Check if we need to update user state (always update if authUser object is different)
      // This ensures name/email updates propagate even if UID is the same
      if (!user || user.uid !== authUser.uid || user.name !== authUser.name || user.email !== authUser.email) {
        console.log('Dashboard: Syncing with authenticated user:', authUser.email)
        setUser(authUser)
      }

      // Load/Sync user mode
      const savedMode = localStorage.getItem('userMode') as 'buyer' | 'seller'
      const targetMode = savedMode || (authUser.role as 'buyer' | 'seller') || 'buyer'

      if (targetMode !== userMode) {
        console.log('Dashboard: Syncing user mode to', targetMode)
        setUserMode(targetMode)
      }
      return
    }

    // 2. Fallback: Check demo mode
    const demoMode = localStorage.getItem('demo_mode')
    const demoUserStr = localStorage.getItem('demo_user')

    if (demoMode === 'true' && demoUserStr) {
      try {
        const demoUser = JSON.parse(demoUserStr)
        if (!user || user.uid !== demoUser.uid) {
          setUser({
            name: demoUser.displayName || demoUser.name,
            email: demoUser.email,
            uid: demoUser.uid,
            role: demoUser.role,
          })
          setUserMode(demoUser.role === 'seller' ? 'seller' : 'buyer')
        }
        return
      } catch (e) {
        console.error('Dashboard: Error parsing demo user:', e)
      }
    }

    // 3. Redirect if not loading
    if (!authLoading) {
      console.log('Dashboard: No authenticated user, redirecting...')
      router.push('/login')
    }
  }, [mounted, authUser, authLoading, router])
=======
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
>>>>>>> 27e598ded527a2c61948df157c36da50b6ff83d8

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

<<<<<<< HEAD
  if (authLoading) {
=======
  if (loading) {
>>>>>>> 27e598ded527a2c61948df157c36da50b6ff83d8
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
