'use client'

import { useEffect, useMemo, useState } from 'react'
import { RefreshCw } from 'lucide-react'
import toast from 'react-hot-toast'
import { backendApi } from '@/lib/backendApi'

type Subscription = {
  id: string
  status: string
  startDate?: string
  endDate?: string
  createdAt?: string
  plan?: {
    id?: string
    name?: string
    displayName?: string
    price?: number
    durationDays?: number
  } | null
  user?: {
    id?: string
    uid?: string
    name?: string
    email?: string
    role?: string
  } | null
}

const formatCurrency = (amount?: number) => `INR ${Number(amount || 0).toLocaleString('en-IN')}`

export default function SubscriptionManagementPage() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('all')
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  const loadSubscriptions = async () => {
    try {
      setLoading(true)
      const response = await backendApi.admin.getSubscriptions(statusFilter === 'all' ? undefined : statusFilter)
      if (!response?.success) {
        throw new Error(response?.error || 'Failed to load subscriptions')
      }
      setSubscriptions(response?.data?.subscriptions || [])
    } catch (error: any) {
      toast.error(error?.message || 'Failed to load subscriptions')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadSubscriptions()
  }, [statusFilter])

  const stats = useMemo(() => {
    let total = subscriptions.length
    let active = 0
    let paused = 0
    let cancelled = 0
    let monthlyRevenue = 0

    for (const subscription of subscriptions) {
      const status = (subscription.status || '').toLowerCase()
      const price = Number(subscription.plan?.price || 0)

      if (status === 'active') {
        active += 1
        monthlyRevenue += price
      }
      if (status === 'paused') paused += 1
      if (status === 'cancelled') cancelled += 1
    }

    return { total, active, paused, cancelled, monthlyRevenue }
  }, [subscriptions])

  const updateStatus = async (id: string, status: string) => {
    try {
      setUpdatingId(id)
      const response = await backendApi.admin.updateSubscriptionStatus(id, status)
      if (!response?.success) {
        throw new Error(response?.error || 'Failed to update subscription')
      }
      toast.success(`Subscription marked as ${status}`)
      await loadSubscriptions()
    } catch (error: any) {
      toast.error(error?.message || 'Failed to update subscription')
    } finally {
      setUpdatingId(null)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Subscriptions</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">Manage live plans and user subscriptions</p>
        </div>
        <button
          onClick={loadSubscriptions}
          className="inline-flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
        <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-950">
          <p className="text-xs text-gray-500">Total</p>
          <p className="text-xl font-semibold">{stats.total}</p>
        </div>
        <div className="rounded-xl border border-green-200 bg-green-50 p-4 dark:border-green-900/40 dark:bg-green-900/20">
          <p className="text-xs text-green-700 dark:text-green-400">Active</p>
          <p className="text-xl font-semibold">{stats.active}</p>
        </div>
        <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-900/40 dark:bg-yellow-900/20">
          <p className="text-xs text-yellow-700 dark:text-yellow-400">Paused</p>
          <p className="text-xl font-semibold">{stats.paused}</p>
        </div>
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-900/40 dark:bg-red-900/20">
          <p className="text-xs text-red-700 dark:text-red-400">Cancelled</p>
          <p className="text-xl font-semibold">{stats.cancelled}</p>
        </div>
        <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 dark:border-blue-900/40 dark:bg-blue-900/20">
          <p className="text-xs text-blue-700 dark:text-blue-400">Active Revenue</p>
          <p className="text-xl font-semibold">{formatCurrency(stats.monthlyRevenue)}</p>
        </div>
      </div>

      <div className="flex gap-2">
        {['all', 'active', 'paused', 'expired', 'cancelled'].map((status) => (
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
              <th className="px-4 py-3 text-left font-semibold">User</th>
              <th className="px-4 py-3 text-left font-semibold">Plan</th>
              <th className="px-4 py-3 text-left font-semibold">Status</th>
              <th className="px-4 py-3 text-left font-semibold">Validity</th>
              <th className="px-4 py-3 text-left font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td className="px-4 py-6 text-gray-500" colSpan={5}>
                  Loading subscriptions...
                </td>
              </tr>
            )}
            {!loading && subscriptions.length === 0 && (
              <tr>
                <td className="px-4 py-6 text-gray-500" colSpan={5}>
                  No subscriptions found.
                </td>
              </tr>
            )}
            {!loading &&
              subscriptions.map((subscription) => (
                <tr key={subscription.id} className="border-b border-gray-100 dark:border-gray-900">
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-900 dark:text-gray-100">{subscription.user?.name || 'Unknown'}</p>
                    <p className="text-xs text-gray-500">{subscription.user?.email || subscription.user?.uid || '-'}</p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium">{subscription.plan?.displayName || subscription.plan?.name || 'N/A'}</p>
                    <p className="text-xs text-gray-500">{formatCurrency(subscription.plan?.price)}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-gray-100 px-2 py-1 text-xs capitalize dark:bg-gray-800">
                      {subscription.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-500">
                    <p>Start: {subscription.startDate ? new Date(subscription.startDate).toLocaleDateString() : '-'}</p>
                    <p>End: {subscription.endDate ? new Date(subscription.endDate).toLocaleDateString() : '-'}</p>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => updateStatus(subscription.id, 'active')}
                        disabled={updatingId === subscription.id}
                        className="rounded bg-green-600 px-2 py-1 text-xs font-medium text-white hover:bg-green-700 disabled:opacity-50"
                      >
                        Activate
                      </button>
                      <button
                        onClick={() => updateStatus(subscription.id, 'paused')}
                        disabled={updatingId === subscription.id}
                        className="rounded bg-yellow-600 px-2 py-1 text-xs font-medium text-white hover:bg-yellow-700 disabled:opacity-50"
                      >
                        Pause
                      </button>
                      <button
                        onClick={() => updateStatus(subscription.id, 'cancelled')}
                        disabled={updatingId === subscription.id}
                        className="rounded bg-red-600 px-2 py-1 text-xs font-medium text-white hover:bg-red-700 disabled:opacity-50"
                      >
                        Cancel
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

