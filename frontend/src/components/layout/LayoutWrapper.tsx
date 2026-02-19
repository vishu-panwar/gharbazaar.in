'use client'

import { usePathname } from 'next/navigation'
import FloatingNavbar from '../FloatingNavbar'
import MobileBottomNav from './MobileBottomNav'
import PageTransition from '../PageTransition'
import { Footer } from './Footer'

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  // Pages that should not have header and footer
  const authPages = ['/login', '/signup']
  const isAuthPage = authPages.includes(pathname)

  // Admin portal pages (have their own layout)
  const isAdminPage = pathname.startsWith('/admin')

  // Employee portal pages (have their own layout)
  const isEmployeePage = pathname.startsWith('/employee')

  // Ground Partner portal pages (have their own layout)
  const isGroundPartnerPage = pathname.startsWith('/ground-partner')

  // Legal Partner portal pages (have their own layout)
  const isLegalPartnerPage = pathname.startsWith('/legal-partner')

  // Partner portal pages (have their own layout)
  const isPartnerPage = pathname.startsWith('/partner')

  // Service Partners portal pages (have their own layout)
  const isServicePartnerPage = pathname.startsWith('/service-partners')

  // Dashboard pages (have their own layout)
  const isDashboardPage = pathname.startsWith('/dashboard')

  // Don't show header/footer for auth, admin, employee, ground-partner, legal-partner, partner, service-partners, or dashboard pages
  if (isAuthPage || isAdminPage || isEmployeePage || isGroundPartnerPage || isLegalPartnerPage || isPartnerPage || isServicePartnerPage || isDashboardPage) {
    return <>{children}</>
  }

  return (
    <div className="flex flex-col min-h-screen">
      <FloatingNavbar />
      <main className="flex-1 overflow-x-hidden">
        <PageTransition>{children}</PageTransition>
      </main>
      <MobileBottomNav />
      <Footer />
    </div>
  )
}
