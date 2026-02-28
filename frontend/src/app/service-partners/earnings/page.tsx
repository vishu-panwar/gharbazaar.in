'use client'

import { useEffect, useMemo, useState } from 'react'
import { Calendar, CheckCircle, Clock, DollarSign, Search, XCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import { backendApi } from '@/lib/backendApi'

type Payout = {
  id: string
  amount: number
  method?: string
  status?: string
  reference?: string
  notes?: string
  periodStart?: string
  periodEnd?: string
  createdAt?: string
  updatedAt?: string
}

const currency = (value: number) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
  }).format(value)

const statusClass = (status?: string) => {
  const value = (status || 'pending').toLowerCase()
  if (value === 'paid') return 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
  if (value === 'processing') return 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400'
  if (value === 'failed') return 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400'
  return 'bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400'
}

export default function ServicePartnerEarningsPage() {
  const [payouts, setPayouts] = useState<Payout[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [profile, setProfile] = useState<{ uniqueId?: string } | null>(null)

  // Fetch profile for UID
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await backendApi.serviceProvider.getMyProfile()
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

  const loadPayouts = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await backendApi.partners.getPayouts()

      if (!response?.success) {
        throw new Error(response?.error || 'Failed to load payouts')
      }

      const records = Array.isArray(response.data) ? response.data : []
      setPayouts(records)
    } catch (err: any) {
      setError(err?.message || 'Failed to load payouts')
      setPayouts([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadPayouts()
  }, [])

  const filteredPayouts = useMemo(() => {
    return payouts.filter((payout) => {
      const matchesStatus = statusFilter === 'all' || (payout.status || 'pending').toLowerCase() === statusFilter
      if (!matchesStatus) return false
      if (!query) return true

      const haystack = [
        payout.id,
        payout.reference,
        payout.method,
        payout.notes,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()

      return haystack.includes(query.toLowerCase())
    })
  }, [payouts, query, statusFilter])

  const totals = useMemo(() => {
    const total = payouts.reduce((sum, payout) => sum + Number(payout.amount || 0), 0)
    const paid = payouts
      .filter((payout) => (payout.status || '').toLowerCase() === 'paid')
      .reduce((sum, payout) => sum + Number(payout.amount || 0), 0)
    const pending = payouts
      .filter((payout) => ['pending', 'processing'].includes((payout.status || '').toLowerCase()))
      .reduce((sum, payout) => sum + Number(payout.amount || 0), 0)

    const thisMonth = payouts
      .filter((payout) => {
        if (!payout.createdAt) return false
        const date = new Date(payout.createdAt)
        const now = new Date()
        return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()
      })
      .reduce((sum, payout) => sum + Number(payout.amount || 0), 0)

    return {
      total,
      paid,
      pending,
      thisMonth,
    }
  }, [payouts])

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <div className="flex items-center space-x-3">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Earnings & Payouts</h1>
            <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-full text-sm font-bold border border-blue-200 dark:border-blue-800">
              {profile?.uniqueId ? `GBPR-${profile.uniqueId.slice(-6).toUpperCase()}` : 'GBPR-PARTNER'}
            </span>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Live payout history from partner finance workflow.</p>
        </div>

        <button
          onClick={loadPayouts}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium"
        >
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl p-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">Total Earnings</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{currency(totals.total)}</p>
        </div>
        <div className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl p-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">Paid</p>
          <p className="text-2xl font-bold text-green-600">{currency(totals.paid)}</p>
        </div>
        <div className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl p-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">Pending / Processing</p>
          <p className="text-2xl font-bold text-amber-600">{currency(totals.pending)}</p>
        </div>
        <div className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl p-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">This Month</p>
          <p className="text-2xl font-bold text-blue-600">{currency(totals.thisMonth)}</p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl">
        <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by reference, method, or notes"
              className="w-full pl-9 pr-3 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            className="px-3 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="paid">Paid</option>
            <option value="failed">Failed</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-900/50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Payout</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Amount</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Method</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
              {loading ? (
                <tr>
                  <td className="px-4 py-8 text-center text-gray-500 dark:text-gray-400" colSpan={5}>
                    Loading payouts...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td className="px-4 py-8 text-center text-red-600 dark:text-red-400" colSpan={5}>
                    {error}
                  </td>
                </tr>
              ) : filteredPayouts.length === 0 ? (
                <tr>
                  <td className="px-4 py-8 text-center text-gray-500 dark:text-gray-400" colSpan={5}>
                    No payouts found.
                  </td>
                </tr>
              ) : (
                filteredPayouts.map((payout) => (
                  <tr key={payout.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/40">
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-900 dark:text-white">{payout.reference || `Payout ${payout.id.slice(0, 8)}`}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{payout.notes || 'No notes'}</p>
                    </td>
                    <td className="px-4 py-3 font-semibold text-gray-900 dark:text-white">{currency(Number(payout.amount || 0))}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusClass(payout.status)}`}>
                        {(payout.status || 'pending').toUpperCase()}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">{(payout.method || 'bank-transfer').toUpperCase()}</td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                      {payout.createdAt ? new Date(payout.createdAt).toLocaleDateString() : '-'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
        <div className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl p-4 flex items-start gap-2">
          <DollarSign size={16} className="mt-0.5 text-blue-600" />
          <p className="text-gray-600 dark:text-gray-400">Amounts are shown directly from backend payout records.</p>
        </div>
        <div className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl p-4 flex items-start gap-2">
          <Clock size={16} className="mt-0.5 text-amber-600" />
          <p className="text-gray-600 dark:text-gray-400">Pending and processing payouts are included in outstanding totals.</p>
        </div>
        <div className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl p-4 flex items-start gap-2">
          <CheckCircle size={16} className="mt-0.5 text-green-600" />
          <p className="text-gray-600 dark:text-gray-400">Use Admin portal to create and approve payout entries.</p>
        </div>
      </div>
    </div>
  )
}


