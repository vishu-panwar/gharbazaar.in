'use client'

import { usePathname } from 'next/navigation'
import { Header } from './Header'
import { Footer } from './Footer'
import FloatingNavbar from '../FloatingNavbar'
import PageTransition from '../PageTransition'

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

  // Dashboard pages (have their own layout)
  const isDashboardPage = pathname.startsWith('/dashboard')

  // Don't show header/footer for auth, admin, employee, ground-partner, legal-partner, partner, or dashboard pages
  if (isAuthPage || isAdminPage || isEmployeePage || isGroundPartnerPage || isLegalPartnerPage || isPartnerPage || isDashboardPage) {
    return <>{children}</>
  }

  return (
    <div className="flex flex-col min-h-screen">
      <FloatingNavbar />
      <Header />
      <main className="flex-1">
        <PageTransition>{children}</PageTransition>
      </main>
      <Footer />
    </div>
  )
}
