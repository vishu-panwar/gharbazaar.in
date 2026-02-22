'use client'

import { useEffect, useMemo, useState } from 'react'
import { BarChart3, RefreshCw, TrendingUp } from 'lucide-react'
import toast from 'react-hot-toast'
import { backendApi } from '@/lib/backendApi'

type PartnerCase = {
  id: string
  status?: string
  amount?: number | string | null
  createdAt?: string
}

type Visit = {
  id: string
  status?: string
  createdAt?: string
  scheduledAt?: string
}

type Payout = {
  id: string
  amount?: number | string | null
  status?: string
  createdAt?: string
}

type VerificationReport = {
  id?: string
  _id?: string
  createdAt?: string
}

const normalize = (value?: string) => (value || '').toLowerCase()

const toNumber = (value: unknown) => {
  const n = Number(value)
  return Number.isFinite(n) ? n : 0
}

const formatCurrency = (value: number) => `INR ${value.toLocaleString('en-IN')}`

export default function GroundPartnerPerformancePage() {
  const [loading, setLoading] = useState(true)
  const [cases, setCases] = useState<PartnerCase[]>([])
  const [visits, setVisits] = useState<Visit[]>([])
  const [payouts, setPayouts] = useState<Payout[]>([])
  const [reports, setReports] = useState<VerificationReport[]>([])

  const loadData = async () => {
    try {
      setLoading(true)
      const [caseResponse, visitResponse, payoutResponse, reportResponse] = await Promise.all([
        backendApi.partners.getCases({ type: 'ground' }),
        backendApi.visits.getPartner(),
        backendApi.partners.getPayouts(),
        backendApi.verification.getReports(),
      ])

      if (!caseResponse?.success) {
        throw new Error(caseResponse?.message || caseResponse?.error || 'Failed to load case performance')
      }
      if (!visitResponse?.success) {
        throw new Error(visitResponse?.message || visitResponse?.error || 'Failed to load visit performance')
      }
      if (!payoutResponse?.success) {
        throw new Error(payoutResponse?.message || payoutResponse?.error || 'Failed to load payout performance')
      }
      if (!reportResponse?.success) {
        throw new Error(reportResponse?.message || reportResponse?.error || 'Failed to load reporting performance')
      }

      setCases(Array.isArray(caseResponse?.data) ? caseResponse.data : [])
      setVisits(Array.isArray(visitResponse?.data) ? visitResponse.data : [])
      setPayouts(Array.isArray(payoutResponse?.data) ? payoutResponse.data : [])
      setReports(Array.isArray(reportResponse?.data) ? reportResponse.data : [])
    } catch (error: any) {
      toast.error(error?.message || 'Failed to load performance data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const metrics = useMemo(() => {
    const totalTasks = cases.length
    const completedTasks = cases.filter((row) => normalize(row.status) === 'completed').length
    const activeTasks = cases.filter((row) => ['open', 'in_progress'].includes(normalize(row.status))).length

    const totalVisits = visits.length
    const completedVisits = visits.filter((row) => normalize(row.status) === 'completed').length

    const paidPayouts = payouts.filter((row) => normalize(row.status) === 'paid')
    const totalPaid = paidPayouts.reduce((sum, row) => sum + toNumber(row.amount), 0)
    const pendingPayout = payouts
      .filter((row) => ['pending', 'processing'].includes(normalize(row.status)))
      .reduce((sum, row) => sum + toNumber(row.amount), 0)

    const taskCompletionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0
    const visitCompletionRate = totalVisits > 0 ? (completedVisits / totalVisits) * 100 : 0
    const avgPaidPayout = paidPayouts.length > 0 ? totalPaid / paidPayouts.length : 0

    return {
      totalTasks,
      completedTasks,
      activeTasks,
      totalVisits,
      completedVisits,
      reportsSubmitted: reports.length,
      taskCompletionRate,
      visitCompletionRate,
      totalPaid,
      pendingPayout,
      avgPaidPayout,
    }
  }, [cases, payouts, reports.length, visits])

  const monthlyTrend = useMemo(() => {
    const months: { key: string; label: string; tasks: number; payouts: number }[] = []
    const now = new Date()

    for (let i = 5; i >= 0; i -= 1) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const key = `${date.getFullYear()}-${date.getMonth()}`
      months.push({
        key,
        label: date.toLocaleString('en-IN', { month: 'short', year: '2-digit' }),
        tasks: 0,
        payouts: 0,
      })
    }

    const monthByKey = new Map(months.map((row) => [row.key, row]))

    for (const row of cases) {
      const created = new Date(row.createdAt || 0)
      if (Number.isNaN(created.getTime())) continue
      const key = `${created.getFullYear()}-${created.getMonth()}`
      const month = monthByKey.get(key)
      if (month) month.tasks += 1
    }

    for (const row of payouts) {
      const created = new Date(row.createdAt || 0)
      if (Number.isNaN(created.getTime())) continue
      const key = `${created.getFullYear()}-${created.getMonth()}`
      const month = monthByKey.get(key)
      if (month && normalize(row.status) === 'paid') {
        month.payouts += toNumber(row.amount)
      }
    }

    return months
  }, [cases, payouts])

  const maxTasks = Math.max(1, ...monthlyTrend.map((row) => row.tasks))
  const maxPayout = Math.max(1, ...monthlyTrend.map((row) => row.payouts))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Performance</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Task, visit, reporting, and payout performance from live workflow records
          </p>
        </div>
        <button
          onClick={loadData}
          className="inline-flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
        >
          <RefreshCw size={16} /> Refresh
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
        <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-950">
          <p className="text-xs text-gray-500">Task Completion</p>
          <p className="text-xl font-semibold">{metrics.taskCompletionRate.toFixed(1)}%</p>
        </div>
        <div className="rounded-xl border border-indigo-200 bg-indigo-50 p-4 dark:border-indigo-900/30 dark:bg-indigo-900/20">
          <p className="text-xs text-indigo-700 dark:text-indigo-400">Visit Completion</p>
          <p className="text-xl font-semibold">{metrics.visitCompletionRate.toFixed(1)}%</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-950">
          <p className="text-xs text-gray-500">Reports Submitted</p>
          <p className="text-xl font-semibold">{metrics.reportsSubmitted}</p>
        </div>
        <div className="rounded-xl border border-green-200 bg-green-50 p-4 dark:border-green-900/30 dark:bg-green-900/20">
          <p className="text-xs text-green-700 dark:text-green-400">Total Paid</p>
          <p className="text-xl font-semibold">{formatCurrency(metrics.totalPaid)}</p>
        </div>
        <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-900/30 dark:bg-yellow-900/20">
          <p className="text-xs text-yellow-700 dark:text-yellow-400">Pending Payout</p>
          <p className="text-xl font-semibold">{formatCurrency(metrics.pendingPayout)}</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-950">
          <h2 className="mb-3 text-sm font-semibold text-gray-900 dark:text-gray-100">Operational Metrics</h2>
          <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
            <p>Total tasks: {metrics.totalTasks}</p>
            <p>Completed tasks: {metrics.completedTasks}</p>
            <p>Active tasks: {metrics.activeTasks}</p>
            <p>Total visits: {metrics.totalVisits}</p>
            <p>Completed visits: {metrics.completedVisits}</p>
            <p>Average paid payout: {formatCurrency(metrics.avgPaidPayout)}</p>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-950">
          <h2 className="mb-3 text-sm font-semibold text-gray-900 dark:text-gray-100">Monthly Trend (Last 6 Months)</h2>
          <div className="space-y-3">
            {monthlyTrend.map((row) => (
              <div key={row.key} className="space-y-1">
                <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
                  <span>{row.label}</span>
                  <span>Tasks: {row.tasks} | Paid: {formatCurrency(row.payouts)}</span>
                </div>
                <div className="space-y-1">
                  <div className="h-2 rounded bg-gray-100 dark:bg-gray-800">
                    <div
                      className="h-2 rounded bg-blue-600"
                      style={{ width: `${(row.tasks / maxTasks) * 100}%` }}
                    />
                  </div>
                  <div className="h-2 rounded bg-gray-100 dark:bg-gray-800">
                    <div
                      className="h-2 rounded bg-green-600"
                      style={{ width: `${(row.payouts / maxPayout) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-950">
          <div className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-200">
            <BarChart3 size={16} /> Workflow Health
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Completion ratios are calculated from live task and visit statuses across the shared backend.
          </p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-950">
          <div className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-200">
            <TrendingUp size={16} /> Admin and Employee Visibility
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Performance metrics here align with task moderation, reporting, and payout workflows used by admin and employee portals.
          </p>
        </div>
      </div>

      {loading && <p className="text-sm text-gray-500">Loading performance metrics...</p>}
    </div>
  )
}
