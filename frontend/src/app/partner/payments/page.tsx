'use client'

import { useEffect, useMemo, useState } from 'react'
import { ArrowDownLeft, ArrowUpRight, RefreshCw, Search, Wallet } from 'lucide-react'
import toast from 'react-hot-toast'
import { backendApi } from '@/lib/backendApi'

type Payout = {
  id: string
  amount?: number | string | null
  status?: string
  method?: string
  reference?: string
  notes?: string
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

export default function PartnerPaymentsPage() {
  const [loading, setLoading] = useState(true)
  const [payouts, setPayouts] = useState<Payout[]>([])
  const [statusFilter, setStatusFilter] = useState('all')
  const [query, setQuery] = useState('')

  const loadPayouts = async () => {
    try {
      setLoading(true)
      const response = await backendApi.partners.getPayouts()
      if (!response?.success) {
        throw new Error(response?.message || response?.error || 'Failed to load payment history')
      }
      setPayouts(Array.isArray(response?.data) ? response.data : [])
    } catch (error: any) {
      toast.error(error?.message || 'Failed to load payment history')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadPayouts()
  }, [])

  const filteredPayouts = useMemo(() => {
    return payouts
      .filter((row) => {
        const status = normalize(row.status)
        const matchesStatus = statusFilter === 'all' || status === statusFilter
        const q = query.trim().toLowerCase()
        const matchesQuery =
          q.length === 0 ||
          (row.reference || '').toLowerCase().includes(q) ||
          (row.method || '').toLowerCase().includes(q) ||
          (row.notes || '').toLowerCase().includes(q)
        return matchesStatus && matchesQuery
      })
      .sort((a, b) => +new Date(b.createdAt || 0) - +new Date(a.createdAt || 0))
  }, [payouts, query, statusFilter])

  const stats = useMemo(() => {
    let paid = 0
    let pending = 0
    let failed = 0

    for (const row of payouts) {
      const amount = toNumber(row.amount)
      const status = normalize(row.status)
      if (status === 'paid') paid += amount
      if (status === 'pending' || status === 'processing') pending += amount
      if (status === 'failed') failed += amount
    }

    return {
      totalTransactions: payouts.length,
      paid,
      pending,
      failed,
      walletBalance: paid - pending,
    }
  }, [payouts])

  const statusOptions = useMemo(() => {
    const set = new Set<string>()
    for (const row of payouts) set.add(normalize(row.status) || 'pending')
    return ['all', ...Array.from(set)]
  }, [payouts])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Payment History</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">Real payout records from partner workflow</p>
        </div>
        <button
          onClick={loadPayouts}
          className="inline-flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
        <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-950">
          <p className="text-xs text-gray-500">Transactions</p>
          <p className="text-xl font-semibold">{stats.totalTransactions}</p>
        </div>
        <div className="rounded-xl border border-green-200 bg-green-50 p-4 dark:border-green-900/30 dark:bg-green-900/20">
          <p className="text-xs text-green-700 dark:text-green-400">Paid</p>
          <p className="text-xl font-semibold">{formatCurrency(stats.paid)}</p>
        </div>
        <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-900/30 dark:bg-yellow-900/20">
          <p className="text-xs text-yellow-700 dark:text-yellow-400">Pending</p>
          <p className="text-xl font-semibold">{formatCurrency(stats.pending)}</p>
        </div>
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-900/30 dark:bg-red-900/20">
          <p className="text-xs text-red-700 dark:text-red-400">Failed</p>
          <p className="text-xl font-semibold">{formatCurrency(stats.failed)}</p>
        </div>
        <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 dark:border-blue-900/30 dark:bg-blue-900/20">
          <p className="text-xs text-blue-700 dark:text-blue-400">Net Paid</p>
          <p className="text-xl font-semibold">{formatCurrency(stats.walletBalance)}</p>
        </div>
      </div>

      <div className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-950 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by reference, method, or notes"
            className="w-full rounded-lg border border-gray-200 bg-white py-2 pl-9 pr-3 text-sm outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-gray-900"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-gray-900"
        >
          {statusOptions.map((status) => (
            <option key={status} value={status}>
              {status === 'all' ? 'All statuses' : status}
            </option>
          ))}
        </select>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-sm">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-300">Amount</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-300">Status</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-300">Method</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-300">Reference</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-300">Period</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-300">Notes</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-300">Created</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td className="px-4 py-8 text-center text-gray-500" colSpan={7}>
                    Loading payment history...
                  </td>
                </tr>
              )}
              {!loading && filteredPayouts.length === 0 && (
                <tr>
                  <td className="px-4 py-8 text-center text-gray-500" colSpan={7}>
                    No payments found.
                  </td>
                </tr>
              )}
              {!loading &&
                filteredPayouts.map((row) => {
                  const status = normalize(row.status) || 'pending'
                  const isCredit = status === 'paid'
                  return (
                    <tr key={row.id} className="border-t border-gray-100 dark:border-gray-800">
                      <td className="px-4 py-3 font-medium text-gray-900 dark:text-gray-100">
                        <span className="inline-flex items-center gap-1">
                          {isCredit ? <ArrowDownLeft size={14} className="text-green-600" /> : <ArrowUpRight size={14} className="text-yellow-600" />}
                          {formatCurrency(toNumber(row.amount))}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex rounded-full bg-gray-100 px-2 py-1 text-xs font-medium capitalize text-gray-700 dark:bg-gray-800 dark:text-gray-200">
                          {status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{row.method || '-'}</td>
                      <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{row.reference || '-'}</td>
                      <td className="px-4 py-3 text-gray-700 dark:text-gray-300">
                        {formatDate(row.periodStart)} - {formatDate(row.periodEnd)}
                      </td>
                      <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{row.notes || '-'}</td>
                      <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{formatDate(row.createdAt)}</td>
                    </tr>
                  )
                })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-950">
        <div className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-200">
          <Wallet size={16} /> Workflow Note
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Payout statuses are controlled through admin operations and are visible to partner, employee, and admin portals consistently.
        </p>
      </div>
    </div>
  )
}
