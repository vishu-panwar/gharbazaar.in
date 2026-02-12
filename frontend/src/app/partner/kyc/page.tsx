'use client'

import React from 'react'
import KycForm from '@/components/kyc/KycForm'
import { ShieldAlert } from 'lucide-react'

export default function PartnerKyc() {
  return (
    <div className="container mx-auto py-8 px-4 sm:px-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">Trust & Verification</h1>
          <p className="mt-2 text-gray-500 font-medium">Verify your identity to build trust with clients and increase your earnings.</p>
        </div>
        <div className="flex items-center space-x-3 px-6 py-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-2xl">
          <ShieldAlert className="text-blue-600 h-5 w-5" />
          <span className="text-sm font-bold text-blue-900 dark:text-blue-400">Secure Verification</span>
        </div>
      </div>

      <KycForm />
    </div>
  )
}
