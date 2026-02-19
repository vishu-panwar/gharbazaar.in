'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useTheme } from 'next-themes'
import {
  LayoutDashboard,
  Scale,
  FileText,
  MessageSquare,
  DollarSign,
  TrendingUp,
  BookOpen,
  HelpCircle,
  LogOut,
  Menu,
  X,
  Bell,
  Search,
  Sun,
  Moon,
  Monitor,
  Shield,
  Briefcase,
  Gavel,
  FileCheck,
  Users,
  Settings,
  Lock,
  Eye,
  AlertTriangle,
  ShieldCheck
} from 'lucide-react'
import NotificationDropdown from '@/components/NotificationDropdown'
import { AuthUtils } from '@/lib/firebase'
import {
  isAdminRole,
  isServiceOrLegalPartnerRole,
  resolveEffectiveRole,
} from '@/lib/roleRouting'

export default function ServicePartnersLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [mounted, setMounted] = useState(false)

  // Handle hydration
  useEffect(() => {
    setMounted(true)
  }, [])

  // Public pages that don't require authentication
  const publicPages = ['/service-partners/login', '/service-partners/signup', '/service-partners/registration', '/service-partners/forgot-password']
  const isPublicPage = publicPages.includes(pathname)

  useEffect(() => {
    // Skip auth check for public pages
    if (isPublicPage) {
      return
    }

    const requestedRole = typeof window !== 'undefined' ? localStorage.getItem('requested_role') : null
    const hasServicePortalAccess = (rawRole?: string | null) => {
      const effectiveRole = resolveEffectiveRole(rawRole, requestedRole)
      return isServiceOrLegalPartnerRole(effectiveRole) || isAdminRole(effectiveRole)
    }
    const getResolvedRole = (rawRole?: string | null) => resolveEffectiveRole(rawRole, requestedRole) || rawRole

    // PRIORITY 1: Check demo mode first via AuthUtils
    const demoUser = AuthUtils.getCachedUser()
    if (demoUser && demoUser.isDemo) {
      if (!hasServicePortalAccess(demoUser.role)) {
        console.warn('Service Partner Layout: Role mismatch for demo user, redirecting to login')
        router.push('/service-partners/login')
        return
      }
      setUser({
        ...demoUser,
        role: getResolvedRole(demoUser.role),
      })
      return
    }

    // PRIORITY 2: Normal auth check
    const userData = AuthUtils.getCachedUser()
    if (userData) {
      try {
        if (!hasServicePortalAccess(userData.role)) {
          console.warn('Service Partner Layout: Role mismatch for user:', userData.role)
          if (!isPublicPage) {
            router.push('/service-partners/login')
          }
          return
        }

        const resolvedRole = getResolvedRole(userData.role)
        if (resolvedRole && resolvedRole !== userData.role) {
          const resolvedUserData = {
            ...userData,
            role: resolvedRole,
          }
          AuthUtils.cacheUser(resolvedUserData)
          setUser(resolvedUserData)
        } else {
          setUser(userData)
        }
        localStorage.removeItem('requested_role')
      } catch (e) {
        console.error('Service Partner Layout: Parse error:', e)
        router.push('/service-partners/login')
      }
    } else {
      console.log('Service Partner Layout: No user found, redirecting to login')
      router.push('/service-partners/login')
    }
  }, [router, pathname, isPublicPage])

  const handleLogout = () => {
    AuthUtils.clearCache()
    router.push('/')
  }

  const getThemeIcon = () => {
    if (!mounted) return <Monitor size={20} />

    switch (theme) {
      case 'light':
        return <Sun size={20} />
      case 'dark':
        return <Moon size={20} />
      default:
        return <Monitor size={20} />
    }
  }

  const cycleTheme = () => {
    if (!mounted) return

    switch (theme) {
      case 'light':
        setTheme('dark')
        break
      case 'dark':
        setTheme('system')
        break
      default:
        setTheme('light')
        break
    }
  }

  // If it's a public page, just render children without layout
  if (isPublicPage) {
    return <>{children}</>
  }

  const navigation = [
    { name: 'Dashboard', href: '/service-partners', icon: LayoutDashboard },
    { name: 'KYC Verification', href: '/service-partners/kyc', icon: ShieldCheck },
    { name: 'Tasks', href: '/service-partners/cases', icon: Briefcase },
    { name: 'Communications', href: '/service-partners/communications', icon: MessageSquare },
    { name: 'Earnings', href: '/service-partners/earnings', icon: DollarSign },
    { name: 'Performance', href: '/service-partners/performance', icon: TrendingUp },
    { name: 'Notifications', href: '/service-partners/notifications', icon: Bell },
    { name: 'Settings', href: '/service-partners/settings', icon: Settings },
    { name: 'Support', href: '/service-partners/support', icon: HelpCircle },
  ]

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
                  src="/logo.jpeg"
                  alt="GharBazaar Logo"
                  className="h-12 w-12 rounded-2xl shadow-lg object-cover bg-white dark:bg-transparent"
                  style={{ filter: 'none !important', mixBlendMode: 'normal', opacity: 1 }}
                />
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-blue-600 rounded-full border-2 border-white dark:border-gray-950 flex items-center justify-center">
                  <Scale className="w-2 h-2 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">GharBazaar</h1>
                <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">Service Partner</p>
              </div>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all"
            >
              <X size={24} />
            </button>
          </div>

          {/* Verification Status Banner */}
          {user?.verificationStatus !== 'verified' && (
            <div className="mx-4 mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                <span className="text-xs font-medium text-yellow-800 dark:text-yellow-200">
                  {user?.verificationStatus === 'pending' ? 'Verification Pending' : 'Complete Verification'}
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
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/25'
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
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                  {user?.name}
                </p>
                <div className="flex items-center space-x-2">
                  <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                    Service Partner
                  </p>
                  {user?.verificationStatus === 'verified' && (
                    <div className="w-3 h-3 bg-green-500 rounded-full flex items-center justify-center">
                      <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                    </div>
                  )}
                </div>
                {/* Bar ID removed - only relevant for legal partners */}
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
              <span className="font-medium">Secure Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:pl-72">
        {/* Page Content */}
        <main className="p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
