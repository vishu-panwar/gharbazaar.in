'use client'

import { useEffect, useMemo, useState } from 'react'
import { IndianRupee, RefreshCw, TrendingUp, Wallet } from 'lucide-react'
import toast from 'react-hot-toast'
import { backendApi } from '@/lib/backendApi'

type Referral = {
  id: string
  leadName?: string
  status?: string
  commissionAmount?: number | string | null
  createdAt?: string
}

type Payout = {
  id: string
  amount?: number | string | null
  status?: string
  method?: string
  reference?: string
  periodStart?: string
  periodEnd?: string
  createdAt?: string
}

const toNumber = (value: unknown) => {
  const n = Number(value)
  return Number.isFinite(n) ? n : 0
}

const formatCurrency = (value: number) => `INR ${value.toLocaleString('en-IN')}`

const formatDate = (value?: string) => {
  if (!value) return '-'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '-'
  return date.toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })
}

const normalize = (value?: string) => (value || '').toLowerCase()

export default function PartnerEarningsPage() {
  const [loading, setLoading] = useState(true)
  const [referrals, setReferrals] = useState<Referral[]>([])
  const [payouts, setPayouts] = useState<Payout[]>([])
  const [profile, setProfile] = useState<{ uniqueId?: string } | null>(null)

  // Fetch profile for UID
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await backendApi.user.getProfile()
        if (response?.success) {
          setProfile({
            uniqueId: response.data.uid
          })
        }
      } catch (error) {
        console.error('Failed to load profile:', error)
      }
    }
    loadProfile()
  }, [])

  const loadData = async () => {
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

      setReferrals(Array.isArray(referralResponse?.data) ? referralResponse.data : [])
      setPayouts(Array.isArray(payoutResponse?.data) ? payoutResponse.data : [])
    } catch (error: any) {
      toast.error(error?.message || 'Failed to load earnings data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const stats = useMemo(() => {
    let convertedCommission = 0
    let totalReferralCommission = 0

    for (const row of referrals) {
      const amount = toNumber(row.commissionAmount)
      totalReferralCommission += amount
      if (normalize(row.status) === 'converted') {
        convertedCommission += amount
      }
    }

    let paidPayout = 0
    let pendingPayout = 0
    for (const payout of payouts) {
      const amount = toNumber(payout.amount)
      const status = normalize(payout.status)
      if (status === 'paid') {
        paidPayout += amount
      } else if (status === 'pending' || status === 'processing') {
        pendingPayout += amount
      }
    }

    return {
      convertedCommission,
      totalReferralCommission,
      paidPayout,
      pendingPayout,
      convertedLeads: referrals.filter((row) => normalize(row.status) === 'converted').length,
    }
  }, [payouts, referrals])

  const latestReferrals = useMemo(
    () => [...referrals].sort((a, b) => +new Date(b.createdAt || 0) - +new Date(a.createdAt || 0)).slice(0, 10),
    [referrals]
  )

  const latestPayouts = useMemo(
    () => [...payouts].sort((a, b) => +new Date(b.createdAt || 0) - +new Date(a.createdAt || 0)).slice(0, 10),
    [payouts]
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-3">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Earnings</h1>
            <span className="px-3 py-0.5 bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-full text-xs font-bold border border-blue-200 dark:border-blue-800">
              {profile?.uniqueId ? `GBPR-${profile.uniqueId.slice(-6).toUpperCase()}` : 'GBPR-PARTNER'}
            </span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Real-time commission and payout data connected to admin and employee workflows
          </p>
        </div>
        <button
          onClick={loadData}
          className="inline-flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
        <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-950">
          <p className="text-xs text-gray-500">Converted Leads</p>
          <p className="text-xl font-semibold">{stats.convertedLeads}</p>
        </div>
        <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 dark:border-blue-900/30 dark:bg-blue-900/20">
          <p className="text-xs text-blue-700 dark:text-blue-400">Converted Commission</p>
          <p className="text-xl font-semibold">{formatCurrency(stats.convertedCommission)}</p>
        </div>
        <div className="rounded-xl border border-purple-200 bg-purple-50 p-4 dark:border-purple-900/30 dark:bg-purple-900/20">
          <p className="text-xs text-purple-700 dark:text-purple-400">All Referral Commission</p>
          <p className="text-xl font-semibold">{formatCurrency(stats.totalReferralCommission)}</p>
        </div>
        <div className="rounded-xl border border-green-200 bg-green-50 p-4 dark:border-green-900/30 dark:bg-green-900/20">
          <p className="text-xs text-green-700 dark:text-green-400">Paid Payout</p>
          <p className="text-xl font-semibold">{formatCurrency(stats.paidPayout)}</p>
        </div>
        <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-900/30 dark:bg-yellow-900/20">
          <p className="text-xs text-yellow-700 dark:text-yellow-400">Pending Payout</p>
          <p className="text-xl font-semibold">{formatCurrency(stats.pendingPayout)}</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950">
          <div className="border-b border-gray-100 px-4 py-3 dark:border-gray-800">
            <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Recent Referral Earnings</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] text-sm">
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-300">Lead</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-300">Status</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-300">Commission</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-300">Created</th>
                </tr>
              </thead>
              <tbody>
                {loading && (
                  <tr>
                    <td className="px-4 py-8 text-center text-gray-500" colSpan={4}>
                      Loading referral earnings...
                    </td>
                  </tr>
                )}
                {!loading && latestReferrals.length === 0 && (
                  <tr>
                    <td className="px-4 py-8 text-center text-gray-500" colSpan={4}>
                      No referral earnings found.
                    </td>
                  </tr>
                )}
                {!loading &&
                  latestReferrals.map((row) => (
                    <tr key={row.id} className="border-t border-gray-100 dark:border-gray-800">
                      <td className="px-4 py-3 font-medium text-gray-900 dark:text-gray-100">{row.leadName || '-'}</td>
                      <td className="px-4 py-3">
                        <span className="inline-flex rounded-full bg-gray-100 px-2 py-1 text-xs font-medium capitalize text-gray-700 dark:bg-gray-800 dark:text-gray-200">
                          {normalize(row.status) || 'new'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{formatCurrency(toNumber(row.commissionAmount))}</td>
                      <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{formatDate(row.createdAt)}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950">
          <div className="border-b border-gray-100 px-4 py-3 dark:border-gray-800">
            <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Recent Payouts</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] text-sm">
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-300">Amount</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-300">Status</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-300">Method</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-300">Reference</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-300">Created</th>
                </tr>
              </thead>
              <tbody>
                {loading && (
                  <tr>
                    <td className="px-4 py-8 text-center text-gray-500" colSpan={5}>
                      Loading payouts...
                    </td>
                  </tr>
                )}
                {!loading && latestPayouts.length === 0 && (
                  <tr>
                    <td className="px-4 py-8 text-center text-gray-500" colSpan={5}>
                      No payouts found.
                    </td>
                  </tr>
                )}
                {!loading &&
                  latestPayouts.map((row) => (
                    <tr key={row.id} className="border-t border-gray-100 dark:border-gray-800">
                      <td className="px-4 py-3 font-medium text-gray-900 dark:text-gray-100">{formatCurrency(toNumber(row.amount))}</td>
                      <td className="px-4 py-3">
                        <span className="inline-flex rounded-full bg-gray-100 px-2 py-1 text-xs font-medium capitalize text-gray-700 dark:bg-gray-800 dark:text-gray-200">
                          {normalize(row.status) || 'pending'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{row.method || '-'}</td>
                      <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{row.reference || '-'}</td>
                      <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{formatDate(row.createdAt)}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-950">
          <div className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-200">
            <TrendingUp size={16} /> Referral Performance
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Converted referral commissions are visible here and auditable by admin and employee teams.
          </p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-950">
          <div className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-200">
            <Wallet size={16} /> Payout Workflow
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Payout records reflect the admin-managed partner payment process in real time.
          </p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-950">
          <div className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-200">
            <IndianRupee size={16} /> Financial Consistency
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Commission and payout values are shown from backend data without seeded mock transactions.
          </p>
        </div>
      </div>
    </div>
  )
}
