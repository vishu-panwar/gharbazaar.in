'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard,
  Users,
  Home,
  UserCog,
  DollarSign,
  CreditCard,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  Search,
  Shield
} from 'lucide-react'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [user, setUser] = useState<any>(null)

  // Public pages that don't require authentication
  const publicPages = ['/admin/login', '/admin/forgot-password']
  const isPublicPage = publicPages.includes(pathname)

  useEffect(() => {
    // Skip auth check for public pages
    if (isPublicPage) {
      return
    }

    // PRIORITY 1: Check for demo mode FIRST
    const demoMode = localStorage.getItem('demo_mode');
    const demoUserStr = localStorage.getItem('demo_user');

    if (demoMode === 'true' && demoUserStr) {
      try {
        const demoUser = JSON.parse(demoUserStr);
        console.log('Admin Layout: Demo mode active, user:', demoUser);

        // Check if demo user is admin
        if (demoUser.role !== 'admin') {
          console.log('Admin Layout: Demo user is not admin, redirecting to dashboard');
          router.push('/dashboard');
          return;
        }

        // Create mock admin user for demo
        const mockUser = {
          name: demoUser.displayName,
          email: demoUser.email,
          uid: demoUser.uid,
          role: 'admin',
        };

        setUser(mockUser);
        return; // Exit early, don't check normal user
      } catch (e) {
        console.error('Admin Layout: Error parsing demo user:', e);
      }
    }

    // PRIORITY 2: Check for normal user
    const userData = localStorage.getItem('user')
    if (userData) {
      const parsed = JSON.parse(userData)
      // Check if user is admin
      if (parsed.role !== 'admin') {
        router.push('/dashboard')
        return
      }
      setUser(parsed)
    } else {
      router.push('/admin/login')
    }
  }, [router, pathname, isPublicPage])

  // If it's a public page, just render children without layout
  if (isPublicPage) {
    return <>{children}</>
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    router.push('/')
  }

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'User Management', href: '/admin/users', icon: Users },
    { name: 'Listings', href: '/admin/listings', icon: Home },
    { name: 'Employees', href: '/admin/employees', icon: UserCog },
    { name: 'Salary', href: '/admin/salary', icon: DollarSign },
    { name: 'Payments', href: '/admin/payments', icon: CreditCard },
    { name: 'Subscriptions', href: '/admin/subscriptions', icon: CreditCard },
    { name: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
    { name: 'Admin Tools', href: '/admin/tools', icon: Settings },
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
        fixed top-0 left-0 z-50 h-full w-72 bg-gradient-to-b from-purple-900 to-purple-950 border-r border-purple-800
        transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
      `}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-purple-800">
            <Link href="/" className="flex items-center space-x-3">
              <img
                src="/images/gharbazaar-logo.jpg"
                alt="GharBazaar Logo"
                className="h-10 w-auto brightness-0 invert"
              />
              <div>
                <h1 className="text-lg font-bold text-white">GharBazaar</h1>
                <p className="text-xs text-purple-300">Admin Portal</p>
              </div>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-purple-300 hover:text-white"
            >
              <X size={24} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`
                    flex items-center space-x-3 px-4 py-3 rounded-xl transition-all
                    ${isActive
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-600/30'
                      : 'text-purple-200 hover:bg-purple-800/50'
                    }
                  `}
                >
                  <item.icon size={20} />
                  <span className="font-medium">{item.name}</span>
                </Link>
              )
            })}
          </nav>

          {/* User Profile */}
          <div className="px-6 py-4 border-t border-purple-800">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-lg ring-4 ring-purple-800">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">
                  {user?.name}
                </p>
                <p className="text-xs text-purple-300 font-medium">
                  Super Admin
                </p>
              </div>
            </div>
          </div>

          {/* Logout */}
          <div className="px-4 py-4 border-t border-purple-800">
            <button
              onClick={handleLogout}
              className="flex items-center space-x-3 px-4 py-3 rounded-xl text-red-300 hover:bg-red-900/30 transition-all w-full"
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
                    placeholder="Search users, listings, transactions..."
                    className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-800 border-0 rounded-lg focus:ring-2 focus:ring-purple-500 text-sm"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <button className="relative p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all">
                <Bell size={22} />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
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
