'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  Home,
  Users,
  Share2,
  TrendingUp,
  Wallet,
  FileText,
  BookOpen,
  HelpCircle,
  LogOut,
  Menu,
  X,
  Bell,
  User,
  Settings,
  IndianRupee,
  Eye,
  Phone
} from 'lucide-react'
import { AuthUtils } from '@/lib/firebase'

export default function PartnerLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [user, setUser] = useState<any>(null)

  // Public pages that don't require authentication
  const publicPages = ['/partner/login', '/partner/signup']
  const isPublicPage = publicPages.includes(pathname)

  useEffect(() => {
    // Skip auth check for public pages
    if (isPublicPage) {
      return
    }

    // PRIORITY 1: Check demo mode first via AuthUtils
    const demoUser = AuthUtils.getCachedUser();
    if (demoUser && demoUser.isDemo) {
      // Check if user is partner
      if (demoUser.role !== 'promo-partner' && demoUser.role !== 'admin') {
        router.push('/login')
        return
      }
      setUser(demoUser)
      return
    }

    // PRIORITY 2: Normal auth check
    const userData = localStorage.getItem('user')
    if (userData) {
      const parsed = JSON.parse(userData)
      // Check if user is partner
      if (parsed.role !== 'partner' && parsed.role !== 'promo-partner' && parsed.role !== 'admin') {
        router.push('/partner/login')
        return
      }
      setUser(parsed)
    } else {
      router.push('/partner/login')
    }
  }, [router, pathname, isPublicPage])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    router.push('/')
  }

  // If it's a public page, just render children without layout
  if (isPublicPage) {
    return <>{children}</>
  }

  const navigation = [
    { name: 'Dashboard', href: '/partner', icon: Home },
    { name: 'Submit Referral', href: '/partner/referrals', icon: Users },
    { name: 'Share Links', href: '/partner/share', icon: Share2 },
    { name: 'Lead Tracking', href: '/partner/leads', icon: TrendingUp },
    { name: 'Earnings', href: '/partner/earnings', icon: Wallet },
    { name: 'Payment History', href: '/partner/payments', icon: FileText },
    { name: 'Training', href: '/partner/training', icon: BookOpen },
    { name: 'Support', href: '/partner/support', icon: HelpCircle },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400'
      case 'pending': return 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400'
      case 'suspended': return 'bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400'
      default: return 'bg-gray-100 text-gray-600 dark:bg-gray-900/20 dark:text-gray-400'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Active'
      case 'pending': return 'Pending'
      case 'suspended': return 'Suspended'
      default: return 'Unknown'
    }
  }

  const getPartnerTypeText = (type: string) => {
    switch (type) {
      case 'influencer': return 'Influencer'
      case 'csc': return 'Jan Seva Kendra'
      case 'community': return 'Community Leader'
      case 'referrer': return 'Local Referrer'
      default: return 'Partner'
    }
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 z-50 h-full w-72 bg-white dark:bg-gray-950 border-r border-gray-200 dark:border-gray-800
        transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
      `}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between px-6 py-6 border-b border-gray-200 dark:border-gray-800">
            <Link href="/" className="flex items-center space-x-4">
              <div className="relative">
                <img
                  src="/images/gharbazaar-logo.jpg"
                  alt="GharBazaar Logo"
                  className="h-12 w-12 rounded-2xl shadow-lg object-cover bg-white dark:bg-transparent"
                  style={{ filter: 'none !important', mixBlendMode: 'normal', opacity: 1 }}
                />
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-gradient-to-r from-blue-600 to-green-600 rounded-full border-2 border-white dark:border-gray-950 flex items-center justify-center">
                  <Users className="w-2 h-2 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">GharBazaar</h1>
                <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">Partner Portal</p>
              </div>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all"
            >
              <X size={24} />
            </button>
          </div>

          {/* Status Banner */}
          {user?.status !== 'active' && (
            <div className="mx-4 mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl">
              <div className="flex items-center space-x-2">
                <Eye className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                <span className="text-xs font-medium text-yellow-800 dark:text-yellow-200">
                  {user?.status === 'pending' ? 'Verification Pending' : 'Account Inactive'}
                </span>
              </div>
            </div>
          )}

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`
                    group flex items-center space-x-3 px-4 py-3 rounded-2xl transition-all duration-300
                    ${isActive
                      ? 'bg-gradient-to-r from-blue-600 to-green-600 text-white shadow-lg shadow-blue-600/25'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-blue-600 dark:hover:text-blue-400'
                    }
                  `}
                >
                  <item.icon size={20} className={`${isActive ? 'text-white' : 'group-hover:scale-110 transition-transform duration-300'}`} />
                  <span className="font-medium">{item.name}</span>
                  {isActive && (
                    <div className="ml-auto w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  )}
                </Link>
              )
            })}
          </nav>

          {/* User Profile */}
          <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-800">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-green-700 rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                  {user?.name}
                </p>
                <div className="flex items-center space-x-2">
                  <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                    {getPartnerTypeText(user?.partnerType)}
                  </p>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(user?.status)}`}>
                    {getStatusText(user?.status)}
                  </span>
                </div>
                <div className="flex items-center space-x-1 mt-1">
                  <Phone className="w-3 h-3 text-gray-400" />
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {user?.phone}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-800">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-lg font-bold text-gray-900 dark:text-white">
                  {user?.referrals || 0}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Referrals</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-green-600 dark:text-green-400 flex items-center justify-center">
                  <IndianRupee size={16} />
                  {user?.earnings || 0}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Earnings</div>
              </div>
            </div>
          </div>

          {/* Logout */}
          <div className="px-4 py-4 border-t border-gray-200 dark:border-gray-800">
            <button
              onClick={handleLogout}
              className="flex items-center space-x-3 px-4 py-3 rounded-2xl text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all w-full"
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
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden text-gray-500 hover:text-gray-700"
              >
                <Menu size={24} />
              </button>

              <div className="hidden sm:block">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Hello, {user?.name?.split(' ')[0]}! 👋
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Send some new referrals today and increase your earnings
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Link
                href="/partner/support"
                className="relative p-3 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-2xl transition-all duration-300 group"
              >
                <Bell size={20} />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white dark:border-gray-950"></span>
              </Link>

              <Link
                href="/partner/profile"
                className="relative p-3 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-2xl transition-all duration-300 group"
              >
                <Settings size={20} />
              </Link>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}