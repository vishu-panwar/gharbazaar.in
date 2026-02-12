'use client'

import React from 'react'
import KycForm from '@/components/kyc/KycForm'
import { ShieldAlert } from 'lucide-react'

export default function ServicePartnerKyc() {
  return (
    <div className="container mx-auto py-8 px-4 sm:px-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">Professional KYC</h1>
          <p className="mt-2 text-gray-500 font-medium">Professional verification is mandatory for all service providers on GharBazaar.</p>
        </div>
        <div className="flex items-center space-x-3 px-6 py-3 bg-purple-50 dark:bg-purple-900/20 border border-purple-100 dark:border-purple-800 rounded-2xl">
          <ShieldAlert className="text-purple-600 h-5 w-5" />
          <span className="text-sm font-bold text-purple-900 dark:text-purple-400">Provider Badge Access</span>
        </div>
      </div>

      <KycForm />
    </div>
  )
}
