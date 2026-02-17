'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider } from 'next-themes'
import { Toaster } from 'react-hot-toast'
import { useState } from 'react'
import { AuthProvider } from '@/contexts/AuthContext'
import { LoaderProvider } from '@/components/GlobalLoader'
import { SettingsProvider } from '@/contexts/SettingsContext'
import { FavoritesProvider } from '@/contexts/FavoritesContext'
import { PaymentProvider } from '@/contexts/PaymentContext'
import { SellerSubscriptionProvider } from '@/contexts/SellerSubscriptionContext'
import { SocketProvider } from '@/contexts/SocketContext'
import { LocaleProvider } from '@/contexts/LocaleContext'
import { ToastProvider } from '@/components/Toast/ToastProvider'
import { ModalProvider } from '@/contexts/ModalContext'
import { NotificationProvider } from '@/contexts/NotificationContext'
import LoadingScreen from './LoadingScreen'

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
        refetchOnWindowFocus: false,
      },
    },
  }))

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem storageKey="theme">
        <LocaleProvider>
          <LoaderProvider>
            <AuthProvider loadingComponent={<LoadingScreen />}>
              <SettingsProvider>
                <FavoritesProvider>
                  <PaymentProvider>
                    <SellerSubscriptionProvider>
                      <SocketProvider>
                        <ToastProvider>
                          <ModalProvider>
                            <NotificationProvider>
                              {children}
                            </NotificationProvider>
                          </ModalProvider>
                        </ToastProvider>
                      </SocketProvider>
                    </SellerSubscriptionProvider>
                  </PaymentProvider>
                </FavoritesProvider>
              </SettingsProvider>
              <Toaster position="top-right" />
            </AuthProvider>
          </LoaderProvider>
        </LocaleProvider>
      </ThemeProvider>
    </QueryClientProvider>
  )
}
