'use client'

import { useEffect, useMemo, useState } from 'react'
import { BarChart3, CheckCircle, Clock, DollarSign, TrendingUp } from 'lucide-react'
import { backendApi } from '@/lib/backendApi'

type PartnerCase = {
  id: string
  title?: string
  description?: string
  status?: string
  amount?: number
  createdAt?: string
  updatedAt?: string
  type?: string
}

type Payout = {
  id: string
  amount: number
  status?: string
  createdAt?: string
}

const currency = (value: number) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
  }).format(value)

export default function ServicePartnerPerformancePage() {
  const [cases, setCases] = useState<PartnerCase[]>([])
  const [payouts, setPayouts] = useState<Payout[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadData = async () => {
    try {
      setLoading(true)
      setError(null)

      const [caseResponse, payoutResponse] = await Promise.all([
        backendApi.partners.getCases(),
        backendApi.partners.getPayouts(),
      ])

      if (!caseResponse?.success) {
        throw new Error(caseResponse?.error || 'Failed to fetch cases')
      }
      if (!payoutResponse?.success) {
        throw new Error(payoutResponse?.error || 'Failed to fetch payouts')
      }

      setCases(Array.isArray(caseResponse.data) ? caseResponse.data : [])
      setPayouts(Array.isArray(payoutResponse.data) ? payoutResponse.data : [])
    } catch (err: any) {
      setError(err?.message || 'Failed to load performance data')
      setCases([])
      setPayouts([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const metrics = useMemo(() => {
    const totalCases = cases.length
    const completedCases = cases.filter((item) => (item.status || '').toLowerCase() === 'completed').length
    const inProgressCases = cases.filter((item) => ['open', 'new', 'in_progress'].includes((item.status || '').toLowerCase())).length
    const cancelledCases = cases.filter((item) => (item.status || '').toLowerCase() === 'cancelled').length
    const completionRate = totalCases > 0 ? (completedCases / totalCases) * 100 : 0

    const totalCaseValue = cases.reduce((sum, item) => sum + Number(item.amount || 0), 0)
    const avgCaseValue = totalCases > 0 ? totalCaseValue / totalCases : 0

    const totalPayout = payouts.reduce((sum, payout) => sum + Number(payout.amount || 0), 0)
    const paidPayout = payouts
      .filter((payout) => (payout.status || '').toLowerCase() === 'paid')
      .reduce((sum, payout) => sum + Number(payout.amount || 0), 0)

    return {
      totalCases,
      completedCases,
      inProgressCases,
      cancelledCases,
      completionRate,
      totalCaseValue,
      avgCaseValue,
      totalPayout,
      paidPayout,
    }
  }, [cases, payouts])

  const monthlyPayouts = useMemo(() => {
    const map = new Map<string, number>()
    const now = new Date()

    for (let i = 5; i >= 0; i -= 1) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const key = `${date.getFullYear()}-${date.getMonth()}`
      map.set(key, 0)
    }

    payouts.forEach((payout) => {
      if (!payout.createdAt) return
      const date = new Date(payout.createdAt)
      const key = `${date.getFullYear()}-${date.getMonth()}`
      if (!map.has(key)) return
      map.set(key, (map.get(key) || 0) + Number(payout.amount || 0))
    })

    return Array.from(map.entries()).map(([key, amount]) => {
      const [year, month] = key.split('-').map(Number)
      return {
        label: new Date(year, month, 1).toLocaleString('default', { month: 'short' }),
        amount,
      }
    })
  }, [payouts])

  const maxMonthlyPayout = Math.max(1, ...monthlyPayouts.map((item) => item.amount))

  const recentCases = useMemo(
    () => [...cases].sort((a, b) => new Date(b.updatedAt || b.createdAt || 0).getTime() - new Date(a.updatedAt || a.createdAt || 0).getTime()).slice(0, 8),
    [cases]
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Performance Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Metrics are computed from real partner cases and payout records.</p>
        </div>

        <button
          onClick={loadData}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium"
        >
          Refresh
        </button>
      </div>

      {loading ? (
        <div className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl p-12 text-center">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      ) : error ? (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 text-red-700 dark:text-red-300">{error}</div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
            <div className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl p-4">
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Cases</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{metrics.totalCases}</p>
            </div>
            <div className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl p-4">
              <p className="text-sm text-gray-500 dark:text-gray-400">Completion Rate</p>
              <p className="text-2xl font-bold text-blue-600">{metrics.completionRate.toFixed(1)}%</p>
            </div>
            <div className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl p-4">
              <p className="text-sm text-gray-500 dark:text-gray-400">In Progress</p>
              <p className="text-2xl font-bold text-amber-600">{metrics.inProgressCases}</p>
            </div>
            <div className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl p-4">
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Payout</p>
              <p className="text-2xl font-bold text-green-600">{currency(metrics.totalPayout)}</p>
            </div>
            <div className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl p-4">
              <p className="text-sm text-gray-500 dark:text-gray-400">Avg Case Value</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{currency(metrics.avgCaseValue)}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <BarChart3 size={18} className="text-blue-600" />
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Last 6 Months Payout Trend</h2>
              </div>

              <div className="space-y-3">
                {monthlyPayouts.map((entry) => (
                  <div key={entry.label} className="flex items-center gap-3">
                    <div className="w-10 text-sm text-gray-500 dark:text-gray-400">{entry.label}</div>
                    <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-600"
                        style={{ width: `${(entry.amount / maxMonthlyPayout) * 100}%` }}
                      />
                    </div>
                    <div className="w-28 text-right text-sm font-medium text-gray-900 dark:text-white">{currency(entry.amount)}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl p-5">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Case Outcome Split</h2>

              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <span className="inline-flex items-center gap-2 text-green-700 dark:text-green-300"><CheckCircle size={15} /> Completed</span>
                  <strong className="text-green-700 dark:text-green-300">{metrics.completedCases}</strong>
                </div>

                <div className="flex items-center justify-between p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                  <span className="inline-flex items-center gap-2 text-amber-700 dark:text-amber-300"><Clock size={15} /> Active</span>
                  <strong className="text-amber-700 dark:text-amber-300">{metrics.inProgressCases}</strong>
                </div>

                <div className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                  <span className="inline-flex items-center gap-2 text-red-700 dark:text-red-300">Cancelled</span>
                  <strong className="text-red-700 dark:text-red-300">{metrics.cancelledCases}</strong>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-gray-200 dark:border-gray-800 text-sm text-gray-600 dark:text-gray-400">
                Paid payout total: <span className="font-semibold text-gray-900 dark:text-white">{currency(metrics.paidPayout)}</span>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl">
            <div className="p-4 border-b border-gray-200 dark:border-gray-800">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Cases</h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-900/50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Case</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Type</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Amount</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Updated</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                  {recentCases.length === 0 ? (
                    <tr>
                      <td className="px-4 py-8 text-center text-gray-500 dark:text-gray-400" colSpan={5}>
                        No case records available.
                      </td>
                    </tr>
                  ) : (
                    recentCases.map((caseItem) => (
                      <tr key={caseItem.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/40">
                        <td className="px-4 py-3">
                          <p className="font-medium text-gray-900 dark:text-white">{caseItem.title || 'Service Case'}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{caseItem.id}</p>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">{caseItem.type || 'General'}</td>
                        <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">{(caseItem.status || 'open').replace('_', ' ')}</td>
                        <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">{currency(Number(caseItem.amount || 0))}</td>
                        <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{new Date(caseItem.updatedAt || caseItem.createdAt || Date.now()).toLocaleDateString()}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  )
}


