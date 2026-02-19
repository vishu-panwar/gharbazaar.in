'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Info, IndianRupee, Phone, Plus } from 'lucide-react'

export default function MobileBottomNav() {
  const pathname = usePathname()

  const navItems = [
    { label: 'Home', icon: Home, href: '/' },
    { label: 'Founder', icon: Info, href: '/founder' },
    { label: 'Pricing', icon: IndianRupee, href: '/pricing' },
    { label: 'Contact', icon: Phone, href: '/contact' },
  ]

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-gray-900/95 border-t border-gray-200 dark:border-gray-800 px-4 pb-[env(safe-area-inset-bottom,16px)] pt-2 z-[9999] shadow-[0_-4px_20px_rgba(0,0,0,0.15)] h-[70px]">
      <div className="flex items-center justify-between max-w-lg mx-auto relative">
        {/* Left side items */}
        <div className="flex w-2/5 justify-around items-center">
          {navItems.slice(0, 2).map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center justify-center space-y-1 transition-colors ${
                  isActive ? 'text-emerald-500' : 'text-gray-500 dark:text-gray-400'
                }`}
              >
                <Icon size={22} />
                <span className="text-[10px] font-medium">{item.label}</span>
              </Link>
            )
          })}
        </div>

        {/* Center elevated button */}
        <div className="absolute left-1/2 -top-8 -translate-x-1/2 flex flex-col items-center">
            {/* The white background cutout effect */}
            <div className="bg-white dark:bg-gray-900 absolute -top-1 w-16 h-16 rounded-full -z-10 shadow-[0_-4px_10px_rgba(0,0,0,0.05)] border-t border-gray-200 dark:border-gray-800" />
            
            <Link
                href="/login"
                className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center text-white shadow-lg shadow-emerald-500/30 hover:bg-emerald-600 transition-all active:scale-90"
            >
                <Plus size={24} />
            </Link>
            <span className="text-[10px] font-medium text-gray-500 dark:text-gray-400 mt-1">Sell/Rent</span>
        </div>

        {/* Right side items */}
        <div className="flex w-2/5 justify-around items-center">
          {navItems.slice(2).map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center justify-center space-y-1 transition-colors ${
                  isActive ? 'text-emerald-500' : 'text-gray-500 dark:text-gray-400'
                }`}
              >
                <Icon size={22} />
                <span className="text-[10px] font-medium">{item.label}</span>
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
