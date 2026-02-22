'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useTheme } from 'next-themes'
import {
  LayoutDashboard,
  Users,
  MapPin,
  FileCheck,
  MessageSquare,
  DollarSign,
  TrendingUp,
  BookOpen,
  HelpCircle,
  LogOut,
  Menu,
  X,
  Search,
  Sun,
  Moon,
  Monitor,
  Camera,
  Navigation,
  CheckSquare,
  Upload,
  Award,
  Settings,
  ShieldCheck
} from 'lucide-react'
import NotificationDropdown from '@/components/NotificationDropdown'
import { AuthUtils } from '@/lib/firebase'

export default function GroundPartnerLayout({ children }: { children: React.ReactNode }) {
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
  const publicPages = ['/ground-partner/login', '/ground-partner/signup', '/ground-partner/registration', '/ground-partner/forgot-password']
  const isPublicPage = publicPages.includes(pathname)

  useEffect(() => {
    // Skip auth check for public pages
    if (isPublicPage) {
      return
    }

    // PRIORITY 1: Check demo mode first via AuthUtils
    const demoUser = AuthUtils.getCachedUser();
    if (demoUser && demoUser.isDemo) {
      // Check if user is ground partner
      const role = demoUser.role?.toLowerCase() || ''
      if (role !== 'ground-partner' && role !== 'ground_partner' && role !== 'admin') {
        console.warn('Ground Partner Layout: Role mismatch for demo user, redirecting to dashboard');
        router.push('/dashboard')
        return
      }
      setUser(demoUser)
      return
    }

    // PRIORITY 2: Normal auth check
    const userData = AuthUtils.getCachedUser()
    if (userData) {
      try {
        // Check if user is ground partner
        const role = (userData.role || '').toLowerCase();
        const isRole = (val: string, targets: string[]) => targets.includes(val);
        
        if (!isRole(role, ['ground-partner', 'ground_partner', 'admin'])) {
          console.warn('Ground Partner Layout: Role mismatch for user:', role);
          if (!isPublicPage) {
            router.push('/dashboard')
          }
          return
        }
        setUser(userData)
      } catch (e) {
        console.error('Ground Partner Layout: Error in auth check:', e);
        router.push('/ground-partner/login')
      }
    } else {
      router.push('/ground-partner/login')
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
    { name: 'Dashboard', href: '/ground-partner', icon: LayoutDashboard },
    { name: 'KYC Verification', href: '/ground-partner/kyc', icon: ShieldCheck },
    { name: 'My Tasks', href: '/ground-partner/tasks', icon: CheckSquare },
    { name: 'Site Visits', href: '/ground-partner/visits', icon: MapPin },
    { name: 'Reports', href: '/ground-partner/reports', icon: FileCheck },
    { name: 'Messages', href: '/ground-partner/messages', icon: MessageSquare },
    { name: 'Earnings', href: '/ground-partner/earnings', icon: DollarSign },
    { name: 'Performance', href: '/ground-partner/performance', icon: TrendingUp },
    { name: 'Learning', href: '/ground-partner/learning', icon: BookOpen },
    { name: 'Support', href: '/ground-partner/support', icon: HelpCircle },
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
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-blue-500 rounded-full border-2 border-white dark:border-gray-950"></div>
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">GharBazaar</h1>
                <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">Ground Partner</p>
              </div>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all"
            >
              <X size={24} />
            </button>
          </div>

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
                      ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg shadow-blue-500/25'
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

          {/* User Profile & Theme Toggle */}
          <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-800 space-y-4">
            {/* Theme Toggle in Sidebar */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Theme</span>
              <button
                onClick={cycleTheme}
                className="flex items-center space-x-2 px-3 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-xl transition-all duration-300"
                title={`Switch theme (current: ${theme || 'system'})`}
              >
                {getThemeIcon()}
                <span className="text-xs font-medium text-gray-600 dark:text-gray-400 capitalize">
                  {mounted ? (theme || 'system') : 'system'}
                </span>
              </button>
            </div>

            {/* User Profile */}
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                  {user?.name}
                </p>
                <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                  Ground Partner • {user?.city || 'Mumbai'}
                </p>
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
            <div className="flex items-center space-x-4 flex-1">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden text-gray-500 hover:text-gray-700"
              >
                <Menu size={24} />
              </button>

              <div className="hidden sm:flex items-center flex-1 max-w-md">
                <div className="relative w-full">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Search tasks, properties..."
                    className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-800 border-0 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={cycleTheme}
                className="relative p-3 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-2xl transition-all duration-300 group"
                title={`Current theme: ${theme || 'system'}`}
              >
                <div className="relative">
                  {getThemeIcon()}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
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
    </div>
  )
}
