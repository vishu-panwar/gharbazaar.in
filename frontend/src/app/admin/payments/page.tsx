'use client'

import { useEffect, useMemo, useState } from 'react'
import { RefreshCw } from 'lucide-react'
import toast from 'react-hot-toast'
import { backendApi } from '@/lib/backendApi'

type AdminPayment = {
  _id?: string
  id?: string
  userId?: string
  amount?: number
  currency?: string
  status?: string
  serviceId?: string
  razorpayOrderId?: string
  razorpayPaymentId?: string
  createdAt?: string
  user?: {
    uid?: string
    name?: string
    email?: string
    role?: string
  } | null
}

const formatCurrency = (amount?: number, currency?: string) =>
  `${currency || 'INR'} ${Number(amount || 0).toLocaleString('en-IN')}`

export default function PaymentManagementPage() {
  const [payments, setPayments] = useState<AdminPayment[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('all')

  const loadPayments = async () => {
    try {
      setLoading(true)
      const response = await backendApi.admin.getPayments()
      if (!response?.success) {
        throw new Error(response?.error || 'Failed to load payments')
      }
      setPayments(response?.data?.payments || [])
    } catch (error: any) {
      toast.error(error?.message || 'Failed to load payments')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadPayments()
  }, [])

  const filteredPayments = useMemo(() => {
    if (statusFilter === 'all') return payments
    return payments.filter((payment) => (payment.status || '').toLowerCase() === statusFilter)
  }, [payments, statusFilter])

  const stats = useMemo(() => {
    let total = 0
    let captured = 0
    let pending = 0
    let failed = 0

    for (const payment of payments) {
      const status = (payment.status || '').toLowerCase()
      const amount = Number(payment.amount || 0)
      total += amount

      if (status === 'captured' || status === 'completed') captured += amount
      if (status === 'created' || status === 'authorized' || status === 'pending') pending += 1
      if (status === 'failed') failed += 1
    }

    return {
      totalVolume: total,
      capturedRevenue: captured,
      pendingCount: pending,
      failedCount: failed,
    }
  }, [payments])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Payments</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">System-wide transaction visibility for admin</p>
        </div>
        <button
          onClick={loadPayments}
          className="inline-flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-950">
          <p className="text-xs text-gray-500">Total Volume</p>
          <p className="text-xl font-semibold">{formatCurrency(stats.totalVolume)}</p>
        </div>
        <div className="rounded-xl border border-green-200 bg-green-50 p-4 dark:border-green-900/40 dark:bg-green-900/20">
          <p className="text-xs text-green-700 dark:text-green-400">Captured Revenue</p>
          <p className="text-xl font-semibold">{formatCurrency(stats.capturedRevenue)}</p>
        </div>
        <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-900/40 dark:bg-yellow-900/20">
          <p className="text-xs text-yellow-700 dark:text-yellow-400">Pending Count</p>
          <p className="text-xl font-semibold">{stats.pendingCount}</p>
        </div>
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-900/40 dark:bg-red-900/20">
          <p className="text-xs text-red-700 dark:text-red-400">Failed Count</p>
          <p className="text-xl font-semibold">{stats.failedCount}</p>
        </div>
      </div>

      <div className="flex gap-2">
        {['all', 'captured', 'created', 'authorized', 'failed', 'refunded'].map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`rounded-lg px-4 py-2 text-sm font-medium capitalize ${
              statusFilter === status
                ? 'bg-purple-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950">
        <table className="min-w-full text-sm">
          <thead className="border-b border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900">
            <tr>
              <th className="px-4 py-3 text-left font-semibold">Transaction</th>
              <th className="px-4 py-3 text-left font-semibold">User</th>
              <th className="px-4 py-3 text-left font-semibold">Amount</th>
              <th className="px-4 py-3 text-left font-semibold">Status</th>
              <th className="px-4 py-3 text-left font-semibold">Created</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td className="px-4 py-6 text-gray-500" colSpan={5}>
                  Loading payments...
                </td>
              </tr>
            )}
            {!loading && filteredPayments.length === 0 && (
              <tr>
                <td className="px-4 py-6 text-gray-500" colSpan={5}>
                  No payments found.
                </td>
              </tr>
            )}
            {!loading &&
              filteredPayments.map((payment) => (
                <tr key={payment._id || payment.id} className="border-b border-gray-100 dark:border-gray-900">
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-900 dark:text-gray-100">
                      {payment.razorpayPaymentId || payment.razorpayOrderId || payment._id || payment.id}
                    </p>
                    <p className="text-xs text-gray-500">Service: {payment.serviceId || 'N/A'}</p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium">{payment.user?.name || payment.userId || 'Unknown'}</p>
                    <p className="text-xs text-gray-500">{payment.user?.email || payment.user?.uid || '-'}</p>
                  </td>
                  <td className="px-4 py-3">{formatCurrency(payment.amount, payment.currency)}</td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-gray-100 px-2 py-1 text-xs capitalize dark:bg-gray-800">
                      {payment.status || 'unknown'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-500">
                    {payment.createdAt ? new Date(payment.createdAt).toLocaleString() : '-'}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

