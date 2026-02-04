import type { Metadata, Viewport } from 'next'
import { Inter, Manrope } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/providers'
import { LayoutWrapper } from '@/components/layout/LayoutWrapper'
import { Suspense } from 'react'
import LoadingScreen from '@/components/LoadingScreen'
import PWARegister from '@/components/PWARegister'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const manrope = Manrope({ subsets: ['latin'], variable: '--font-manrope' })

export const metadata: Metadata = {
  title: 'GharBazaar - Premium Local Real Estate Marketplace',
  description: 'List, browse, and bid on properties across India. Trusted platform for buying, selling, and renting real estate.',
  keywords: 'real estate, property, India, buy, sell, rent, plots, homes',
  icons: {
    icon: [
      { url: '/images/gharbazaar-logo.jpg', type: 'image/jpeg' }
    ],
    shortcut: '/images/gharbazaar-logo.jpg',
    apple: '/images/gharbazaar-logo.jpg',
  },
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'GharBazaar',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#2563eb' },
    { media: '(prefers-color-scheme: dark)', color: '#1e40af' }
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{
          __html: `
            try {
              const theme = localStorage.getItem('theme') || 
                (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
              if (theme === 'dark') {
                document.documentElement.classList.add('dark');
              } else {
                document.documentElement.classList.remove('dark');
              }
            } catch (e) {}
          `
        }} />
      </head>
      <body className={`${inter.variable} ${manrope.variable} font-sans`} suppressHydrationWarning>
        <PWARegister />
        <Providers>
          <Suspense fallback={<LoadingScreen />}>
            <LayoutWrapper>{children}</LayoutWrapper>
          </Suspense>
        </Providers>
      </body>
    </html>
  )
}
