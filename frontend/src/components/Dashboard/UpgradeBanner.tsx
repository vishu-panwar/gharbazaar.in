'use client'

import Link from 'next/link'
import { Crown, ArrowRight, Zap } from 'lucide-react'
import { usePayment } from '@/contexts/PaymentContext'

interface UpgradeBannerProps {
  variant?: 'full' | 'compact' | 'minimal'
  message?: string
  ctaText?: string
}

export default function UpgradeBanner({ 
  variant = 'full',
  message,
  ctaText = 'Upgrade Now'
}: UpgradeBannerProps) {
  const { hasPaid, currentPlan } = usePayment()

  // Don't show if user already has a paid plan
  if (hasPaid && currentPlan) return null

  if (variant === 'minimal') {
    return (
      <Link 
        href="/dashboard/pricing"
        className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-lg font-semibold hover:from-amber-600 hover:to-orange-700 transition-all shadow-lg hover:shadow-xl"
      >
        <Crown size={18} />
        <span>{ctaText}</span>
      </Link>
    )
  }

  if (variant === 'compact') {
    return (
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg flex items-center justify-center flex-shrink-0">
              <Crown size={20} className="text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                {message || 'Unlock full access to all properties'}
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Contact sellers, place bids, and more
              </p>
            </div>
          </div>
          <Link
            href="/dashboard/pricing"
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all whitespace-nowrap"
          >
            {ctaText}
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    )
  }

  // Full variant (default)
  return (
    <div className="bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-700 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/10 rounded-full translate-y-24 -translate-x-24" />
      
      <div className="relative z-10">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-amber-300 to-orange-500 rounded-xl flex items-center justify-center">
              <Crown size={24} className="text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">
                No Active Plan
              </h3>
              <p className="text-blue-100 text-sm">
                Unlock premium features today
              </p>
            </div>
          </div>
        </div>

        <p className="text-white/90 mb-4">
          {message || 'Get unlimited access to property details, seller contacts, bidding, and exclusive listings with our premium plans.'}
        </p>

        <div className="flex flex-wrap gap-3">
          <Link
            href="/dashboard/pricing"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-indigo-600 rounded-lg font-bold hover:bg-blue-50 transition-all shadow-lg hover:shadow-xl"
          >
            <Zap size={18} />
            View Plans & Pricing
            <ArrowRight size={18} />
          </Link>
          <Link
            href="/dashboard/browse"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-sm text-white border border-white/30 rounded-lg font-semibold hover:bg-white/20 transition-all"
          >
            Browse Properties
          </Link>
        </div>

        <div className="mt-4 pt-4 border-t border-white/20">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-white">500+</p>
              <p className="text-xs text-blue-100">Properties</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-white">24/7</p>
              <p className="text-xs text-blue-100">Support</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-white">100%</p>
              <p className="text-xs text-blue-100">Verified</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
