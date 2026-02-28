'use client'

import { useEffect, useMemo, useState } from 'react'
import { DollarSign, RefreshCw, TrendingUp } from 'lucide-react'
import toast from 'react-hot-toast'
import { backendApi } from '@/lib/backendApi'

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

type PartnerCase = {
  id: string
  status?: string
  amount?: number | string | null
  createdAt?: string
}

const normalize = (value?: string) => (value || '').toLowerCase()

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

export default function GroundPartnerEarningsPage() {
  const [loading, setLoading] = useState(true)
  const [payouts, setPayouts] = useState<Payout[]>([])
  const [cases, setCases] = useState<PartnerCase[]>([])
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
      const [payoutResponse, caseResponse] = await Promise.all([
        backendApi.partners.getPayouts(),
        backendApi.partners.getCases({ type: 'ground' }),
      ])

      if (!payoutResponse?.success) {
        throw new Error(payoutResponse?.message || payoutResponse?.error || 'Failed to load payouts')
      }
      if (!caseResponse?.success) {
        throw new Error(caseResponse?.message || caseResponse?.error || 'Failed to load task value')
      }

      setPayouts(Array.isArray(payoutResponse?.data) ? payoutResponse.data : [])
      setCases(Array.isArray(caseResponse?.data) ? caseResponse.data : [])
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
    const now = new Date()
    const month = now.getMonth()
    const year = now.getFullYear()

    let paidTotal = 0
    let pendingTotal = 0
    let paidThisMonth = 0

    for (const payout of payouts) {
      const amount = toNumber(payout.amount)
      const status = normalize(payout.status)
      const created = new Date(payout.createdAt || 0)

      if (status === 'paid') {
        paidTotal += amount
        if (created.getMonth() === month && created.getFullYear() === year) {
          paidThisMonth += amount
        }
      }
      if (status === 'pending' || status === 'processing') {
        pendingTotal += amount
      }
    }

    const completedTasks = cases.filter((row) => normalize(row.status) === 'completed').length
    const totalTaskValue = cases.reduce((sum, row) => sum + toNumber(row.amount), 0)

    return {
      paidTotal,
      pendingTotal,
      paidThisMonth,
      completedTasks,
      totalTaskValue,
      payouts: payouts.length,
    }
  }, [cases, payouts])

  const recentPayouts = useMemo(
    () => [...payouts].sort((a, b) => +new Date(b.createdAt || 0) - +new Date(a.createdAt || 0)).slice(0, 12),
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
          <p className="text-sm text-gray-600 dark:text-gray-400">Live payout records and completed task values</p>
        </div>
        <button
          onClick={loadData}
          className="inline-flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
        >
          <RefreshCw size={16} /> Refresh
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-6">
        <div className="rounded-xl border border-green-200 bg-green-50 p-4 dark:border-green-900/30 dark:bg-green-900/20">
          <p className="text-xs text-green-700 dark:text-green-400">Paid Total</p>
          <p className="text-xl font-semibold">{formatCurrency(stats.paidTotal)}</p>
        </div>
        <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-900/30 dark:bg-yellow-900/20">
          <p className="text-xs text-yellow-700 dark:text-yellow-400">Pending Total</p>
          <p className="text-xl font-semibold">{formatCurrency(stats.pendingTotal)}</p>
        </div>
        <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 dark:border-blue-900/30 dark:bg-blue-900/20">
          <p className="text-xs text-blue-700 dark:text-blue-400">Paid This Month</p>
          <p className="text-xl font-semibold">{formatCurrency(stats.paidThisMonth)}</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-950">
          <p className="text-xs text-gray-500">Completed Tasks</p>
          <p className="text-xl font-semibold">{stats.completedTasks}</p>
        </div>
        <div className="rounded-xl border border-purple-200 bg-purple-50 p-4 dark:border-purple-900/30 dark:bg-purple-900/20">
          <p className="text-xs text-purple-700 dark:text-purple-400">Task Value</p>
          <p className="text-xl font-semibold">{formatCurrency(stats.totalTaskValue)}</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-950">
          <p className="text-xs text-gray-500">Payout Records</p>
          <p className="text-xl font-semibold">{stats.payouts}</p>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950">
        <div className="border-b border-gray-100 px-4 py-3 dark:border-gray-800">
          <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Payout History</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[880px] text-sm">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-300">Amount</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-300">Status</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-300">Method</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-300">Reference</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-300">Period</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-300">Created</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td className="px-4 py-8 text-center text-gray-500" colSpan={6}>
                    Loading payout history...
                  </td>
                </tr>
              )}
              {!loading && recentPayouts.length === 0 && (
                <tr>
                  <td className="px-4 py-8 text-center text-gray-500" colSpan={6}>
                    No payout records available.
                  </td>
                </tr>
              )}
              {!loading &&
                recentPayouts.map((row) => (
                  <tr key={row.id} className="border-t border-gray-100 dark:border-gray-800">
                    <td className="px-4 py-3 font-medium text-gray-900 dark:text-gray-100">{formatCurrency(toNumber(row.amount))}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex rounded-full bg-gray-100 px-2 py-1 text-xs font-medium capitalize text-gray-700 dark:bg-gray-800 dark:text-gray-200">
                        {normalize(row.status) || 'pending'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{row.method || '-'}</td>
                    <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{row.reference || '-'}</td>
                    <td className="px-4 py-3 text-gray-700 dark:text-gray-300">
                      {formatDate(row.periodStart)} - {formatDate(row.periodEnd)}
                    </td>
                    <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{formatDate(row.createdAt)}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-950">
          <div className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-200">
            <TrendingUp size={16} /> Performance Link
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Payout visibility here is tied to completed ground tasks and admin-side payout processing.
          </p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-950">
          <div className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-200">
            <DollarSign size={16} /> Shared Financial Workflow
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Values are sourced from backend payouts and partner cases, not seeded static entries.
          </p>
        </div>
      </div>
    </div>
  )
}
