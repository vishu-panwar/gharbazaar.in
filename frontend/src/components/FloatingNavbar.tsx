'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect, useRef } from 'react'
import { ChevronDown, Moon, Sun, Menu, X } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useAuth } from '@/contexts/AuthContext'
import NotificationDropdown from './NotificationDropdown'

export default function FloatingNavbar() {
    const pathname = usePathname()
    const { theme, setTheme } = useTheme()
    const { user, loading } = useAuth()
    const [mounted, setMounted] = useState(false)
    const [isPortalsOpen, setIsPortalsOpen] = useState(false)
    const [isPartnerOpen, setIsPartnerOpen] = useState(false)
    const [isMobilePortalsOpen, setIsMobilePortalsOpen] = useState(false)
    const [isMobilePartnerOpen, setIsMobilePartnerOpen] = useState(false)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const portalsRef = useRef<HTMLDivElement>(null)
    const partnerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        setMounted(true)

        const handleClick = (e: MouseEvent) => {
            if (portalsRef.current && !portalsRef.current.contains(e.target as Node)) {
                setIsPortalsOpen(false)
            }
            if (partnerRef.current && !partnerRef.current.contains(e.target as Node)) {
                setIsPartnerOpen(false)
            }
        }

        document.addEventListener('mousedown', handleClick)
        return () => document.removeEventListener('mousedown', handleClick)
    }, [])

    // Close dropdowns when navigating to a new page
    useEffect(() => {
        setIsPortalsOpen(false)
        setIsPartnerOpen(false)
        setIsMobilePortalsOpen(false)
        setIsMobilePartnerOpen(false)
        setIsMobileMenuOpen(false)
    }, [pathname])

    // Prevent scrolling when mobile menu is open
    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = ''
        }
        return () => {
            document.body.style.overflow = ''
        }
    }, [isMobileMenuOpen])

    return (
        <>
            <nav className="navbar-floating-pill">
                <Link href="/" className="flex items-center space-x-2">
                    <span className="text-emerald-400 font-bold">GharBazaar</span>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden lg:flex items-center space-x-1">
                    <Link href="/" className={`nav-link ${pathname === '/' ? 'active' : ''}`}>Home</Link>
                    <Link href="/about" className={`nav-link ${pathname === '/about' ? 'active' : ''}`}>About</Link>

                    {/* Portals Dropdown */}
                    <div className="relative" ref={portalsRef}>
                        <button onClick={() => setIsPortalsOpen(!isPortalsOpen)} className={`nav-link ${pathname.startsWith('/dashboard') ? 'active' : ''} flex items-center space-x-1`}>
                            <span>Portals</span>
                            <ChevronDown size={14} className={`transition-transform ${isPortalsOpen ? 'rotate-180' : ''}`} />
                        </button>
                        {isPortalsOpen && (
                            <div className="absolute top-full left-0 mt-2 w-48 bg-gray-900/95 backdrop-blur-xl rounded-xl border border-emerald-500/20 py-2 z-50">
                                <Link href="/dashboard" onClick={() => setIsPortalsOpen(false)} className="block px-4 py-2 text-sm text-white hover:bg-emerald-500/10 hover:text-emerald-400">Client Portal</Link>
                            </div>
                        )}
                    </div>

                    {/* Partner Portal Dropdown */}
                    <div className="relative" ref={partnerRef}>
                        <button onClick={() => setIsPartnerOpen(!isPartnerOpen)} className={`nav-link ${pathname.startsWith('/partner') || pathname.startsWith('/ground-partner') || pathname.startsWith('/legal-partner') ? 'active' : ''} flex items-center space-x-1`}>
                            <span>Partner Portal</span>
                            <ChevronDown size={14} className={`transition-transform ${isPartnerOpen ? 'rotate-180' : ''}`} />
                        </button>
                        {isPartnerOpen && (
                            <div className="absolute top-full left-0 mt-2 w-48 bg-gray-900/95 backdrop-blur-xl rounded-xl border border-emerald-500/20 py-2 z-50">
                                <Link href="/ground-partner" onClick={() => setIsPartnerOpen(false)} className="block px-4 py-2 text-sm text-white hover:bg-emerald-500/10 hover:text-emerald-400">Ground Partners</Link>
                                <Link href="/legal-partner" onClick={() => setIsPartnerOpen(false)} className="block px-4 py-2 text-sm text-white hover:bg-emerald-500/10 hover:text-emerald-400">Legal Partners</Link>
                                <Link href="/partner" onClick={() => setIsPartnerOpen(false)} className="block px-4 py-2 text-sm text-white hover:bg-emerald-500/10 hover:text-emerald-400">Promoter Partners</Link>
                            </div>
                        )}
                    </div>

                    <Link href="/founder" className={`nav-link ${pathname === '/founder' ? 'active' : ''}`}>Founder</Link>
                    <Link href="/pricing" className={`nav-link ${pathname === '/pricing' ? 'active' : ''}`}>Pricing</Link>
                    <Link href="/contact" className={`nav-link ${pathname === '/contact' ? 'active' : ''}`}>Contact</Link>
                </div>

                <div className="flex items-center space-x-2">
                    {/* Theme Toggle */}
                    <button
                        onClick={() => {
                            console.log('BUTTON CLICKED!');
                            const html = document.documentElement;
                            const isDark = html.classList.contains('dark');
                            console.log('Current has dark class:', isDark);

                            if (isDark) {
                                html.classList.remove('dark');
                                localStorage.setItem('theme', 'light');
                                console.log('Switched to LIGHT mode');
                            } else {
                                html.classList.add('dark');
                                localStorage.setItem('theme', 'dark');
                                console.log('Switched to DARK mode');
                            }
                        }}
                        className="p-2 rounded-full hover:bg-emerald-500/20 text-emerald-400 transition-all duration-200 hover:scale-110 cursor-pointer"
                        aria-label="Toggle theme"
                        style={{ zIndex: 9999, position: 'relative' }}
                    >
                        {mounted && (theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />)}
                    </button>

                    {/* Desktop Auth Buttons */}
                    <div className="hidden lg:flex items-center space-x-2">
                        {user ? (
                            <Link href="/dashboard" className="btn-emerald text-sm">Dashboard</Link>
                        ) : (
                            <>
                                <Link href="/login" className="btn-emerald-outline text-sm">Login</Link>
                                <Link href="/signup" className="btn-emerald text-sm">Register</Link>
                            </>
                        )}
                    </div>

                    {/* Notification Bell */}
                    {user && (
                        <div className="flex items-center">
                            <NotificationDropdown />
                        </div>
                    )}

                    {/* Mobile Hamburger Button */}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="lg:hidden p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 transition-colors"
                        aria-label="Toggle menu"
                    >
                        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </nav>

            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[1100] lg:hidden" onClick={() => setIsMobileMenuOpen(false)} />
            )}

            {/* Mobile Menu Panel */}
            <div className={`fixed top-0 right-0 h-full w-64 max-w-[85vw] bg-gray-900/98 backdrop-blur-xl border-l border-emerald-500/20 z-[1150] transform transition-transform duration-300 ease-in-out lg:hidden ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="flex flex-col h-full p-6">
                    {/* Mobile Menu Header */}
                    <div className="flex items-center justify-between mb-8">
                        <span className="text-emerald-400 font-bold text-xl">GharBazaar</span>
                        <button
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="p-2 rounded-full hover:bg-gray-800 text-gray-400 transition-colors"
                        >
                            <X size={24} />
                        </button>
                    </div>

                    {/* Mobile Navigation Links */}
                    <div className="flex-1 overflow-y-auto space-y-2">
                        <Link href="/" className={`block px-4 py-3 rounded-lg text-white hover:bg-emerald-500/10 hover:text-emerald-400 transition-colors ${pathname === '/' ? 'bg-emerald-500/20 text-emerald-400' : ''}`}>Home</Link>
                        <Link href="/about" className={`block px-4 py-3 rounded-lg text-white hover:bg-emerald-500/10 hover:text-emerald-400 transition-colors ${pathname === '/about' ? 'bg-emerald-500/20 text-emerald-400' : ''}`}>About</Link>

                        {/* Mobile Portals Section */}
                        <div>
                            <button onClick={() => setIsMobilePortalsOpen(!isMobilePortalsOpen)} className="w-full flex items-center justify-between px-4 py-3 rounded-lg text-white hover:bg-emerald-500/10 hover:text-emerald-400 transition-colors">
                                <span>Portals</span>
                                <ChevronDown size={16} className={`transition-transform ${isMobilePortalsOpen ? 'rotate-180' : ''}`} />
                            </button>
                            {isMobilePortalsOpen && (
                                <div className="ml-4 mt-1 space-y-1">
                                    <Link href="/dashboard" onClick={() => setIsMobileMenuOpen(false)} className="block px-4 py-2 rounded-lg text-sm text-gray-300 hover:bg-emerald-500/10 hover:text-emerald-400 transition-colors">Client Portal</Link>
                                </div>
                            )}
                        </div>

                        {/* Mobile Partner Portal Section */}
                        <div>
                            <button onClick={() => setIsMobilePartnerOpen(!isMobilePartnerOpen)} className="w-full flex items-center justify-between px-4 py-3 rounded-lg text-white hover:bg-emerald-500/10 hover:text-emerald-400 transition-colors">
                                <span>Partner Portal</span>
                                <ChevronDown size={16} className={`transition-transform ${isMobilePartnerOpen ? 'rotate-180' : ''}`} />
                            </button>
                            {isMobilePartnerOpen && (
                                <div className="ml-4 mt-1 space-y-1">
                                    <Link href="/ground-partner" onClick={() => setIsMobileMenuOpen(false)} className="block px-4 py-2 rounded-lg text-sm text-gray-300 hover:bg-emerald-500/10 hover:text-emerald-400 transition-colors">Ground Partners</Link>
                                    <Link href="/legal-partner" onClick={() => setIsMobileMenuOpen(false)} className="block px-4 py-2 rounded-lg text-sm text-gray-300 hover:bg-emerald-500/10 hover:text-emerald-400 transition-colors">Legal Partners</Link>
                                    <Link href="/partner" onClick={() => setIsMobileMenuOpen(false)} className="block px-4 py-2 rounded-lg text-sm text-gray-300 hover:bg-emerald-500/10 hover:text-emerald-400 transition-colors">Promoter Partners</Link>
                                </div>
                            )}
                        </div>

                        <Link href="/founder" className={`block px-4 py-3 rounded-lg text-white hover:bg-emerald-500/10 hover:text-emerald-400 transition-colors ${pathname === '/founder' ? 'bg-emerald-500/20 text-emerald-400' : ''}`}>Founder</Link>
                        <Link href="/pricing" className={`block px-4 py-3 rounded-lg text-white hover:bg-emerald-500/10 hover:text-emerald-400 transition-colors ${pathname === '/pricing' ? 'bg-emerald-500/20 text-emerald-400' : ''}`}>Pricing</Link>
                        <Link href="/contact" className={`block px-4 py-3 rounded-lg text-white hover:bg-emerald-500/10 hover:text-emerald-400 transition-colors ${pathname === '/contact' ? 'bg-emerald-500/20 text-emerald-400' : ''}`}>Contact</Link>
                    </div>

                    {/* Mobile Auth Buttons */}
                    <div className="border-t border-gray-800 pt-6 space-y-3">
                        {user ? (
                            <Link href="/dashboard" className="btn-emerald w-full text-center block">Dashboard</Link>
                        ) : (
                            <>
                                <Link href="/login" className="btn-emerald-outline w-full text-center block">Login</Link>
                                <Link href="/signup" className="btn-emerald w-full text-center block">Register</Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}
