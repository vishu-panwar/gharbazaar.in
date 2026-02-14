'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useTheme } from 'next-themes'
import {
  LayoutDashboard,
  Home,
  MessageSquare,
  Heart,
  Gavel,
  User,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  Search,
  Plus,
  ShoppingCart,
  Store,
  Eye,
  TrendingUp,
  FileText,
  DollarSign,
  CreditCard,
  Sun,
  Moon,
  Mail,
  Briefcase,
  ShieldCheck,
  ArrowRight
} from 'lucide-react'
import NotificationDropdown from '@/components/NotificationDropdown'
import { useAuth } from '@/contexts/AuthContext'
import { AuthUtils } from '@/lib/firebase'
import { useLoader } from '@/components/GlobalLoader'
import ModeChangeToast from '@/components/ModeChangeToast'
import { useSellerSubscription } from '@/contexts/SellerSubscriptionContext'
import SupportChatbot from '@/components/AI/SupportChatbot'
import { ChatbotErrorBoundary } from '@/components/AI/ChatbotErrorBoundary'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const { user: authUser, logout: authLogout } = useAuth()
  const { showLoader } = useLoader()
  const { theme, setTheme } = useTheme()
  const { canAddListing } = useSellerSubscription()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [userMode, setUserMode] = useState<'buyer' | 'seller'>('buyer')
  const [showModeToast, setShowModeToast] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Ensure component is mounted (fixes hydration issues)
  useEffect(() => {
    setMounted(true)
  }, [])

  // PERFORMANCE OPTIMIZATION: Instant auth check
  useEffect(() => {
    if (!mounted) return

    const initDashboard = () => {
      // 1. INSTANT: Check if user is logged in
      if (!AuthUtils.isLoggedIn()) {
        router.push('/login')
        return
      }

      // 2. INSTANT: Get cached user data (now handles demo mode via AuthUtils)
      const user = AuthUtils.getCachedUser()
      if (user) {
        setUser(user)

        // SAFETY REDIRECT: Kick partners out of client dashboard
        const role = (user.role || '').toLowerCase();
        const isRole = (val: string, targets: string[]) => targets.includes(val);

        if (isRole(role, ['ground_partner', 'ground-partner'])) {
          console.log('🚪 Partitioning: Ground Partner detected in client dashboard, redirecting...');
          router.push('/ground-partner');
          return;
        }
        if (isRole(role, ['promoter_partner', 'promoter-partner', 'promo-partner', 'partner'])) {
          console.log('🚪 Partitioning: Promoter Partner detected in client dashboard, redirecting...');
          router.push('/partner');
          return;
        }
        if (isRole(role, ['legal_partner', 'service-partners', 'service_partner'])) {
          console.log('🚪 Partitioning: Service Partner detected in client dashboard, redirecting...');
          router.push('/service-partners');
          return;
        }
        if (isRole(role, ['employee'])) {
          console.log('🚪 Partitioning: Employee detected in client dashboard, redirecting...');
          router.push('/employee');
          return;
        }

        // If demo mode, set mode based on role
        if (user.isDemo) {
          const role = user.role === 'seller' ? 'seller' : 'buyer'
          setUserMode(role)
          localStorage.setItem('userMode', role)
        }
      } else {
        // Fallback: create demo user for development (legacy check)
        const legacyDemoUser = {
          uid: 'demo-user',
          email: 'Gharbazaarofficial@zohomail.in',
          displayName: 'Demo User',
          photoURL: null,
        }
        setUser(legacyDemoUser)
        AuthUtils.cacheUser(legacyDemoUser)
      }

      // 3. INSTANT: Load user mode (for non-demo or if already set)
      const savedMode = localStorage.getItem('userMode') as 'buyer' | 'seller'
      if (savedMode) {
        setUserMode(savedMode)
      }
    }

    initDashboard()
  }, [mounted, router])

  // Sync with AuthContext user when it changes
  useEffect(() => {
    if (authUser && (!user || user.uid !== authUser.uid || user.name !== authUser.name || user.email !== authUser.email)) {
      console.log('DashboardLayout: Syncing with AuthContext user:', authUser.email)
      setUser(authUser)
    }
  }, [authUser, user])

  // Listen for mode changes from layout
  useEffect(() => {
    const handleModeChange = (event: any) => {
      setUserMode(event.detail.mode)
    }

    window.addEventListener('userModeChange', handleModeChange)
    return () => window.removeEventListener('userModeChange', handleModeChange)
  }, [])

  // OPTIMIZED LOGOUT: Immediate action
  const handleLogout = async () => {
    try {
      await authLogout()
    } catch (error) {
      console.error('Logout error:', error)
      // Force logout even on error
      AuthUtils.clearCache()
      router.push('/')
    }
  }

  // Navigation with loader
  const navigateWithLoader = (path: string, message?: string) => {
    showLoader(message || 'Loading...', 1000)
    setTimeout(() => {
      router.push(path)
    }, 200)
  }

  // Handle Add Listing - check subscription first
  const handleAddListing = () => {
    if (canAddListing()) {
      router.push('/dashboard/listings/new')
    } else {
      router.push('/dashboard/seller-pricing')
    }
  }

  // Buyer Navigation
  const buyerNavigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'KYC Verification', href: '/dashboard/kyc', icon: ShieldCheck },
    { name: 'Browse Properties', href: '/dashboard/browse', icon: Eye },
    { name: 'My Proposals', href: '/dashboard/proposals', icon: Gavel },
    { name: 'Favorites', href: '/dashboard/favorites', icon: Heart },
    { name: 'Services', href: '/dashboard/services', icon: Briefcase },
    { name: 'Messages', href: '/dashboard/messages', icon: MessageSquare },
    { name: 'Pricing Plans', href: '/dashboard/pricing', icon: DollarSign },
    { name: 'Profile', href: '/dashboard/profile', icon: User },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings },
  ]

  // Seller Navigation
  const sellerNavigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'KYC Verification', href: '/dashboard/kyc', icon: ShieldCheck },
    { name: 'My Listings', href: '/dashboard/listings', icon: Home },
    { name: 'Offer Letters', href: '/dashboard/offer-letters', icon: Mail },
    { name: 'Analytics', href: '/dashboard/analytics', icon: TrendingUp },
    { name: 'Inquiries', href: '/dashboard/inquiries', icon: MessageSquare },
    { name: 'Contracts', href: '/dashboard/contracts', icon: FileText },
    { name: 'Earnings', href: '/dashboard/earnings', icon: DollarSign },
    { name: 'Pricing Plans', href: '/dashboard/seller-pricing', icon: CreditCard },
    { name: 'Profile', href: '/dashboard/profile', icon: User },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings },
  ]

  const navigation = userMode === 'buyer' ? buyerNavigation : sellerNavigation

  // Don't render anything until mounted (prevents hydration issues)
  if (!mounted) {
    return null
  }

  // Show minimal loading if no user
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Mode Change Toast */}
      <ModeChangeToast mode={userMode} show={showModeToast} />

      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 z-50 h-full w-64 sm:w-72 bg-white dark:bg-gray-950 border-r border-gray-200 dark:border-gray-800
        transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
      `}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200 dark:border-gray-800">
            <Link href="/" className="flex items-center space-x-2 sm:space-x-3">
              <img
                src="/images/gharbazaar-logo.jpg"
                alt="GharBazaar Logo"
                className="h-8 sm:h-10 w-8 sm:w-10 object-contain rounded-lg"
                onError={(e) => {
                  // Fallback if logo doesn't exist
                  e.currentTarget.style.display = 'none'
                }}
              />
              <div>
                <h1 className="text-base sm:text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                  GharBazaar
                </h1>
              </div>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-gray-500 hover:text-gray-700"
            >
              <X size={24} />
            </button>
          </div>

          {/* Mode Toggle Buttons */}
          <div className="px-3 sm:px-4 py-4 border-b border-gray-200 dark:border-gray-800">
            <div className="flex gap-1 sm:gap-2 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl">
              <button
                onClick={() => {
                  if (userMode !== 'buyer') {
                    setUserMode('buyer')
                    localStorage.setItem('userMode', 'buyer')
                    window.dispatchEvent(new CustomEvent('userModeChange', { detail: { mode: 'buyer' } }))
                    setShowModeToast(true)
                    router.push('/dashboard')
                  }
                }}
                className={`flex-1 flex items-center justify-center space-x-1 sm:space-x-2 py-2.5 px-2 sm:px-3 rounded-lg font-medium transition-all text-sm sm:text-base ${userMode === 'buyer'
                  ? 'bg-white dark:bg-gray-700 text-blue-600 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                  }`}
              >
                <ShoppingCart size={16} className="sm:w-[18px] sm:h-[18px]" />
                <span className="hidden sm:inline">Buyer</span>
                <span className="sm:hidden">Buy</span>
              </button>
              <button
                onClick={() => {
                  if (userMode !== 'seller') {
                    setUserMode('seller')
                    localStorage.setItem('userMode', 'seller')
                    window.dispatchEvent(new CustomEvent('userModeChange', { detail: { mode: 'seller' } }))
                    setShowModeToast(true)
                    router.push('/dashboard')
                  }
                }}
                className={`flex-1 flex items-center justify-center space-x-1 sm:space-x-2 py-2.5 px-2 sm:px-3 rounded-lg font-medium transition-all text-sm sm:text-base ${userMode === 'seller'
                  ? 'bg-white dark:bg-gray-700 text-green-600 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                  }`}
              >
                <Store size={16} className="sm:w-[18px] sm:h-[18px]" />
                <span className="hidden sm:inline">Seller</span>
                <span className="sm:hidden">Sell</span>
              </button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 sm:px-4 py-6 space-y-1 overflow-y-auto">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              const activeColor = userMode === 'buyer' ? 'bg-blue-600 shadow-blue-600/30' : 'bg-green-600 shadow-green-600/30'
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={(e) => {
                    console.log('Navigation clicked:', item.name, item.href)
                    setSidebarOpen(false)
                  }}
                  className={`
                    flex items-center space-x-2 sm:space-x-3 px-3 sm:px-4 py-3 rounded-xl transition-all text-sm sm:text-base cursor-pointer
                    ${isActive
                      ? `${activeColor} text-white shadow-lg`
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }
                  `}
                >
                  <item.icon size={18} className="sm:w-5 sm:h-5 flex-shrink-0" />
                  <span className="font-medium truncate">{item.name}</span>
                </Link>
              )
            })}
          </nav>

          {/* User Profile */}
          <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-800">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center text-white font-bold text-lg">
                {user?.displayName?.charAt(0).toUpperCase() || user?.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                  {user?.name || user?.displayName || 'User'}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {user?.email}
                </p>
              </div>
            </div>
          </div>

          {/* Logout */}
          <div className="px-4 py-4 border-t border-gray-200 dark:border-gray-800">
            <button
              onClick={handleLogout}
              className="flex items-center space-x-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all w-full"
            >
              <LogOut size={20} />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:pl-72">
        {/* Top Header */}
        <header className="sticky top-0 z-30 bg-white/80 dark:bg-gray-950/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 py-4">
            {/* Left: Mobile menu */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <Menu size={24} />
              </button>

              {/* Mobile Theme Toggle */}
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="sm:hidden p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all duration-200 transform hover:scale-105"
                title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                <div className="transition-transform duration-300 ease-in-out">
                  {mounted ? (theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />) : <div className="w-5 h-5" />}
                </div>
              </button>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center space-x-3">
              {userMode === 'seller' && (
                <button
                  onClick={handleAddListing}
                  className="hidden sm:flex items-center space-x-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium transition-all shadow-lg shadow-green-500/30"
                >
                  <Plus size={18} />
                  <span>Add Listing</span>
                </button>
              )}

              {/* Theme Toggle */}
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="hidden sm:flex p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all duration-200 transform hover:scale-105"
                title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                <div className="transition-transform duration-300 ease-in-out">
                  {mounted ? (theme === 'dark' ? <Sun size={22} /> : <Moon size={22} />) : <div className="w-5 h-5" />}
                </div>
              </button>

              <NotificationDropdown />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>

      {/* Mobile FAB */}
      {userMode === 'seller' && (
        <button
          onClick={handleAddListing}
          className="lg:hidden fixed bottom-6 right-6 w-14 h-14 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-2xl flex items-center justify-center z-40 transition-all"
        >
          <Plus size={24} />
        </button>
      )}

      {/* Support Chatbot */}
      <ChatbotErrorBoundary>
        <SupportChatbot userRole={userMode} />
      </ChatbotErrorBoundary>
    </div>
  )
}
