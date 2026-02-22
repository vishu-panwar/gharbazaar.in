'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { RefreshCw } from 'lucide-react'
import toast from 'react-hot-toast'
import { backendApi } from '@/lib/backendApi'

type Referral = {
  id: string
  referralCode?: string
  leadName?: string
  leadContact?: string
  status?: string
  commissionAmount?: number | null
  createdAt?: string
}

type Payout = {
  id: string
  amount?: number
  status?: string
  createdAt?: string
  method?: string
  reference?: string
}

export default function PartnerDashboardPage() {
  const [loading, setLoading] = useState(true)
  const [referrals, setReferrals] = useState<Referral[]>([])
  const [payouts, setPayouts] = useState<Payout[]>([])

  const loadDashboard = async () => {
    try {
      setLoading(true)
      const [referralResponse, payoutResponse] = await Promise.all([
        backendApi.partners.getReferrals(),
        backendApi.partners.getPayouts(),
      ])

      if (!referralResponse?.success) {
        throw new Error(referralResponse?.message || referralResponse?.error || 'Failed to load referrals')
      }
      if (!payoutResponse?.success) {
        throw new Error(payoutResponse?.message || payoutResponse?.error || 'Failed to load payouts')
      }

      setReferrals(referralResponse?.data || [])
      setPayouts(payoutResponse?.data || [])
    } catch (error: any) {
      toast.error(error?.message || 'Failed to load partner dashboard')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadDashboard()
  }, [])

  const stats = useMemo(() => {
    let total = referrals.length
    let converted = 0
    let active = 0
    let pendingPayout = 0
    let paidPayout = 0

    for (const referral of referrals) {
      const status = (referral.status || '').toLowerCase()
      if (status === 'converted') converted += 1
      if (['new', 'contacted'].includes(status)) active += 1
    }

    for (const payout of payouts) {
      const status = (payout.status || '').toLowerCase()
      const amount = Number(payout.amount || 0)
      if (status === 'paid') paidPayout += amount
      if (status === 'pending' || status === 'processing') pendingPayout += amount
    }

    return { total, converted, active, pendingPayout, paidPayout }
  }, [referrals, payouts])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Promotional Partner Dashboard</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Live referral and payout data connected with admin and employee workflows
          </p>
        </div>
        <button
          onClick={loadDashboard}
          className="inline-flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
        <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-950">
          <p className="text-xs text-gray-500">Total Referrals</p>
          <p className="text-xl font-semibold">{stats.total}</p>
        </div>
        <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 dark:border-blue-900/40 dark:bg-blue-900/20">
          <p className="text-xs text-blue-700 dark:text-blue-400">Active Leads</p>
          <p className="text-xl font-semibold">{stats.active}</p>
        </div>
        <div className="rounded-xl border border-green-200 bg-green-50 p-4 dark:border-green-900/40 dark:bg-green-900/20">
          <p className="text-xs text-green-700 dark:text-green-400">Converted</p>
          <p className="text-xl font-semibold">{stats.converted}</p>
        </div>
        <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-900/40 dark:bg-yellow-900/20">
          <p className="text-xs text-yellow-700 dark:text-yellow-400">Pending Payout</p>
          <p className="text-xl font-semibold">INR {stats.pendingPayout.toLocaleString('en-IN')}</p>
        </div>
        <div className="rounded-xl border border-purple-200 bg-purple-50 p-4 dark:border-purple-900/40 dark:bg-purple-900/20">
          <p className="text-xs text-purple-700 dark:text-purple-400">Paid Earnings</p>
          <p className="text-xl font-semibold">INR {stats.paidPayout.toLocaleString('en-IN')}</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-950">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Recent Referrals</h2>
            <Link href="/partner/leads" className="text-xs text-blue-600 hover:underline dark:text-blue-400">
              View all leads
            </Link>
          </div>
          {loading && <p className="text-sm text-gray-500">Loading...</p>}
          {!loading && referrals.length === 0 && <p className="text-sm text-gray-500">No referrals available.</p>}
          {!loading && referrals.length > 0 && (
            <div className="space-y-2">
              {referrals.slice(0, 6).map((referral) => (
                <div key={referral.id} className="rounded-lg bg-gray-50 p-3 text-sm dark:bg-gray-900">
                  <div className="flex items-center justify-between">
                    <p className="font-medium">{referral.leadName || 'Unknown lead'}</p>
                    <span className="rounded-full bg-gray-200 px-2 py-1 text-xs capitalize dark:bg-gray-800">
                      {referral.status || 'new'}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">{referral.leadContact || '-'}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-950">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Payouts</h2>
            <Link href="/partner/payments" className="text-xs text-blue-600 hover:underline dark:text-blue-400">
              View payment history
            </Link>
          </div>
          {loading && <p className="text-sm text-gray-500">Loading...</p>}
          {!loading && payouts.length === 0 && <p className="text-sm text-gray-500">No payouts found.</p>}
          {!loading && payouts.length > 0 && (
            <div className="space-y-2">
              {payouts.slice(0, 6).map((payout) => (
                <div key={payout.id} className="rounded-lg bg-gray-50 p-3 text-sm dark:bg-gray-900">
                  <div className="flex items-center justify-between">
                    <p className="font-medium">INR {Number(payout.amount || 0).toLocaleString('en-IN')}</p>
                    <span className="rounded-full bg-gray-200 px-2 py-1 text-xs capitalize dark:bg-gray-800">
                      {payout.status || 'pending'}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">{payout.reference || payout.method || '-'}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

