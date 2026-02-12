'use client'

import React from 'react'
import KycForm from '@/components/kyc/KycForm'
import { ShieldAlert } from 'lucide-react'

export default function GroundPartnerKyc() {
  return (
    <div className="container mx-auto py-8 px-4 sm:px-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">KYC Verification</h1>
          <p className="mt-2 text-gray-500 font-medium">Complete your identity verification to start earning rewards.</p>
        </div>
        <div className="flex items-center space-x-3 px-6 py-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800 rounded-2xl">
          <ShieldAlert className="text-amber-600 h-5 w-5" />
          <span className="text-sm font-bold text-amber-900 dark:text-amber-400">Strictly for Partners</span>
        </div>
      </div>

      <KycForm />
    </div>
  )
}
