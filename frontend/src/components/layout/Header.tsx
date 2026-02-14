'use client'

import Link from 'next/link'
import { useTheme } from 'next-themes'
import {
  Sun,
  Moon,
  User,
  Menu,
  LayoutDashboard,
  LogOut,
  X,
  Heart,
  MessageSquare,
  Bell,
  Search,
  Building2,
  ChevronDown,
  Users,
  Shield,
  UserPlus,
  UserCheck,
  Scale,
  Megaphone
} from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useLoader } from '@/components/GlobalLoader'

export function Header() {
  const { theme, setTheme } = useTheme()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isPortalsOpen, setIsPortalsOpen] = useState(false)
  const [isPartnerPortalOpen, setIsPartnerPortalOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [mounted, setMounted] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const { showLoader } = useLoader()
  const portalsRef = useRef<HTMLDivElement>(null)
  const partnerPortalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMounted(true)

    // Ensure theme is properly initialized
    const savedTheme = localStorage.getItem('theme')
    if (!savedTheme) {
      // Detect system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      setTheme(prefersDark ? 'dark' : 'light')
    }
  }, [])

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (userData) {
      setUser(JSON.parse(userData))
    }

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (portalsRef.current && !portalsRef.current.contains(event.target as Node)) {
        setIsPortalsOpen(false)
      }
      if (partnerPortalRef.current && !partnerPortalRef.current.contains(event.target as Node)) {
        setIsPartnerPortalOpen(false)
      }
    }

    window.addEventListener('scroll', handleScroll)
    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      window.removeEventListener('scroll', handleScroll)
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
    router.push('/')
  }

  const navigateWithLoader = (path: string, message?: string) => {
    showLoader(message || 'Loading page...', 1200)
    setTimeout(() => {
      router.push(path)
    }, 300)
  }

  const getDashboardLink = () => {
    if (!user) return '/dashboard'
    switch (user.role) {
      case 'admin':
        return '/admin'
      case 'employee':
        return '/employee'
      default:
        return '/dashboard'
    }
  }

  const isActive = (path: string) => pathname === path

  // Always hide - FloatingNavbar is used on all pages
  return null

  return (
    <>
      <header className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled
        ? 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl shadow-lg border-b border-gray-200 dark:border-gray-700'
        : 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800'
        }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-3 group flex-shrink-0 mr-6">
              <div className="xl:block">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-teal-600 via-emerald-600 to-blue-600 bg-clip-text text-transparent whitespace-nowrap">
                  GharBazaar
                </h1>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-1">
              <Link
                href="/"
                className={`px-4 py-2 rounded-lg font-medium transition-all ${isActive('/')
                  ? 'text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-900/30'
                  : 'text-gray-700 dark:text-gray-200 hover:text-teal-600 dark:hover:text-teal-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
              >
                Home
              </Link>

              <Link
                href="/about"
                className={`px-4 py-2 rounded-lg font-medium transition-all ${isActive('/about')
                  ? 'text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-900/30'
                  : 'text-gray-700 dark:text-gray-200 hover:text-teal-600 dark:hover:text-teal-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
              >
                About
              </Link>

              {/* Portals Dropdown */}
              <div className="relative" ref={portalsRef}>
                <button
                  onClick={() => setIsPortalsOpen(!isPortalsOpen)}
                  className="flex items-center space-x-1 px-4 py-2 rounded-lg font-medium text-gray-700 dark:text-gray-200 hover:text-teal-600 dark:hover:text-teal-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
                >
                  <span>Portals</span>
                  <ChevronDown size={16} className={`transition-transform ${isPortalsOpen ? 'rotate-180' : ''}`} />
                </button>

                {isPortalsOpen && (
                  <div className="absolute top-full left-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 py-2 z-50">
                    <Link
                      href="/dashboard"
                      onClick={() => {
                        setIsPortalsOpen(false)
                        showLoader('Loading client dashboard...', 1500)
                      }}
                      className="flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
                    >
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center">
                        <Users className="text-white" size={20} />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">Client Portal</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">Browse & manage properties</p>
                      </div>
                    </Link>

                  </div>
                )}
              </div>

              {/* Partner Portal Dropdown */}
              <div className="relative" ref={partnerPortalRef}>
                <button
                  onClick={() => setIsPartnerPortalOpen(!isPartnerPortalOpen)}
                  className="flex items-center space-x-1 px-4 py-2 rounded-lg font-medium text-gray-700 dark:text-gray-200 hover:text-teal-600 dark:hover:text-teal-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
                >
                  <span>Partner Portal</span>
                  <ChevronDown size={16} className={`transition-transform ${isPartnerPortalOpen ? 'rotate-180' : ''}`} />
                </button>

                {isPartnerPortalOpen && (
                  <div className="absolute top-full left-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 py-2 z-50">
                    <Link
                      href="/ground-partner"
                      onClick={() => {
                        setIsPartnerPortalOpen(false)
                        showLoader('Loading ground partner portal...', 1500)
                      }}
                      className="flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
                    >
                      <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-lg flex items-center justify-center">
                        <Users className="text-white" size={20} />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">Ground Partners</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">Field operations & client management</p>
                      </div>
                    </Link>

                    <Link
                      href="/partner"
                      onClick={() => {
                        setIsPartnerPortalOpen(false)
                        showLoader('Loading partner portal...', 1500)
                      }}
                      className="flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
                    >
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-700 rounded-lg flex items-center justify-center">
                        <Megaphone className="text-white" size={20} />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">Promoter Partners</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">Marketing & brand promotion</p>
                      </div>
                    </Link>
                  </div>
                )}
              </div>

              <Link
                href="/founder"
                className={`px-4 py-2 rounded-lg font-medium transition-all ${isActive('/founder')
                  ? 'text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-900/30'
                  : 'text-gray-700 dark:text-gray-200 hover:text-teal-600 dark:hover:text-teal-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
              >
                Founder
              </Link>

              <Link
                href="/pricing"
                className={`px-4 py-2 rounded-lg font-medium transition-all ${isActive('/pricing')
                  ? 'text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-900/30'
                  : 'text-gray-700 dark:text-gray-200 hover:text-teal-600 dark:hover:text-teal-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
              >
                Pricing
              </Link>

              <Link
                href="/contact"
                className={`px-4 py-2 rounded-lg font-medium transition-all ${isActive('/contact')
                  ? 'text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-900/30'
                  : 'text-gray-700 dark:text-gray-200 hover:text-teal-600 dark:hover:text-teal-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
              >
                Contact
              </Link>
            </nav>

            {/* Right Actions */}
            <div className="flex items-center space-x-4 ml-4">
              {/* Theme Toggle */}
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="relative p-2.5 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-yellow-300 transition-all group"
                title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {mounted ? (
                  theme === 'dark' ? (
                    <Sun size={20} className="text-yellow-400" />
                  ) : (
                    <Moon size={20} className="text-gray-600" />
                  )
                ) : (
                  <div className="w-5 h-5" />
                )}
                <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-teal-400 to-blue-400 opacity-0 group-hover:opacity-20 transition-opacity" />
              </button>

              {user ? (
                <>
                  {/* Dashboard Link */}
                  <Link
                    href={getDashboardLink()}
                    className="hidden lg:flex items-center space-x-2 px-4 py-2.5 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all font-medium"
                  >
                    <LayoutDashboard size={18} />
                    <span>Dashboard</span>
                  </Link>

                  {/* User Menu */}
                  <div className="hidden lg:flex items-center space-x-3 pl-3 border-l border-gray-200 dark:border-gray-700">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-teal-500 via-emerald-600 to-blue-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                        {user.name?.charAt(0).toUpperCase()}
                      </div>
                      <div className="hidden xl:block">
                        <div className="text-sm font-semibold text-gray-900 dark:text-white">
                          {user.name}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                          {user.role}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"
                      title="Logout"
                    >
                      <LogOut size={18} />
                    </button>
                  </div>
                </>
              ) : (
                <>
                  {/* Login Button */}
                  <button
                    onClick={() => navigateWithLoader('/login', 'Loading login page...')}
                    className="hidden lg:flex items-center space-x-1.5 px-4 py-2 bg-white hover:bg-gray-50 text-teal-700 border border-teal-200 rounded-lg font-semibold transition-all shadow-sm hover:shadow-md text-sm"
                  >
                    <User size={16} />
                    <span>Login</span>
                  </button>

                  {/* Register Button */}
                  <button
                    onClick={() => navigateWithLoader('/signup', 'Loading signup page...')}
                    className="hidden lg:flex items-center space-x-1.5 px-4 py-2 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl text-sm"
                  >
                    <UserPlus size={16} />
                    <span>Register</span>
                  </button>
                </>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100 text-gray-600"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 bg-white">
            <div className="max-w-7xl mx-auto px-4 py-6 space-y-1">
              <Link
                href="/"
                className="block px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/about"
                className="block px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>

              {/* Mobile Portals Section */}
              <div className="px-4 py-2">
                <p className="text-sm font-semibold text-gray-900 mb-2">Portals</p>
                <div className="space-y-1 ml-2">
                  <Link
                    href="/dashboard"
                    onClick={() => {
                      setIsMenuOpen(false)
                      showLoader('Loading client dashboard...', 1500)
                    }}
                    className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-50 transition-all"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center">
                      <Users className="text-white" size={16} />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 text-sm">Client Portal</p>
                      <p className="text-xs text-gray-600">Browse & manage properties</p>
                    </div>
                  </Link>

                </div>
              </div>

              {/* Mobile Partner Portal Section */}
              <div className="px-4 py-2">
                <p className="text-sm font-semibold text-gray-900 mb-2">Partner Portal</p>
                <div className="space-y-1 ml-2">
                  <Link
                    href="/ground-partner"
                    onClick={() => {
                      setIsMenuOpen(false)
                      showLoader('Loading ground partner portal...', 1500)
                    }}
                    className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-50 transition-all"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-lg flex items-center justify-center">
                      <Users className="text-white" size={16} />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 text-sm">Ground Partners</p>
                      <p className="text-xs text-gray-600">Field operations & client management</p>
                    </div>
                  </Link>

                  <Link
                    href="/partner"
                    onClick={() => {
                      setIsMenuOpen(false)
                      showLoader('Loading partner portal...', 1500)
                    }}
                    className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-50 transition-all"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-700 rounded-lg flex items-center justify-center">
                      <Megaphone className="text-white" size={16} />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 text-sm">Promoter Partners</p>
                      <p className="text-xs text-gray-600">Marketing & brand promotion</p>
                    </div>
                  </Link>
                </div>
              </div>

              <Link
                href="/founder"
                className="block px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Founder
              </Link>
              <Link
                href="/pricing"
                className="block px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Pricing
              </Link>
              <Link
                href="/contact"
                className="block px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>

              <div className="border-t border-gray-200 my-4"></div>

              {user ? (
                <>
                  <div className="flex items-center space-x-3 px-4 py-3 bg-gray-50 rounded-lg">
                    <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {user.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">
                        {user.name}
                      </div>
                      <div className="text-sm text-gray-500 capitalize">
                        {user.role}
                      </div>
                    </div>
                  </div>

                  <Link
                    href={getDashboardLink()}
                    className="flex items-center space-x-3 px-4 py-3 rounded-lg text-teal-600 bg-teal-50 font-semibold"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <LayoutDashboard size={20} />
                    <span>Dashboard</span>
                  </Link>

                  <button
                    onClick={() => {
                      handleLogout()
                      setIsMenuOpen(false)
                    }}
                    className="flex items-center space-x-3 w-full px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 font-semibold"
                  >
                    <LogOut size={20} />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => {
                      navigateWithLoader('/login', 'Loading login page...')
                      setIsMenuOpen(false)
                    }}
                    className="flex items-center justify-center space-x-2 px-4 py-3 rounded-lg bg-white text-teal-700 border border-teal-200 font-semibold"
                  >
                    <User size={18} />
                    <span>Login</span>
                  </button>
                  <button
                    onClick={() => {
                      navigateWithLoader('/signup', 'Loading signup page...')
                      setIsMenuOpen(false)
                    }}
                    className="flex items-center justify-center space-x-2 px-4 py-3 rounded-lg bg-gradient-to-r from-teal-600 to-emerald-600 text-white font-semibold"
                  >
                    <UserPlus size={18} />
                    <span>Register</span>
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </header>
    </>
  )
}
