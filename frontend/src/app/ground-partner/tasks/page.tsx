'use client'

import { useEffect, useMemo, useState } from 'react'
import { CheckSquare, RefreshCw, Search } from 'lucide-react'
import toast from 'react-hot-toast'
import { backendApi } from '@/lib/backendApi'

type PartnerCase = {
  id: string
  title?: string
  description?: string
  type?: string
  status?: string
  amount?: number | string | null
  dueDate?: string
  createdAt?: string
  property?: {
    id?: string
    title?: string
    location?: string
  }
  buyer?: {
    name?: string
    email?: string
    phone?: string
  }
  displayId?: string
  clientUniqueId?: string
}

const normalize = (value?: string) => (value || '').toLowerCase()

const toNumber = (value: unknown) => {
  const n = Number(value)
  return Number.isFinite(n) ? n : 0
}

const formatDate = (value?: string) => {
  if (!value) return '-'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '-'
  return date.toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })
}

const formatCurrency = (value: number) => `INR ${value.toLocaleString('en-IN')}`

export default function GroundPartnerTasksPage() {
  const [loading, setLoading] = useState(true)
  const [updatingId, setUpdatingId] = useState('')
  const [cases, setCases] = useState<PartnerCase[]>([])
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const loadCases = async () => {
    try {
      setLoading(true)
      const response = await backendApi.partners.getCases({ type: 'ground' })
      if (!response?.success) {
        throw new Error(response?.message || response?.error || 'Failed to load task queue')
      }
      setCases(
        (Array.isArray(response?.data) ? response.data : []).map((c: any) => ({
          ...c,
          displayId: `GRN-${c.id?.slice(-6).toUpperCase()}`,
          clientUniqueId: c.buyer?.uid || c.seller?.uid || c.metadata?.clientUniqueId
        }))
      )
    } catch (error: any) {
      toast.error(error?.message || 'Failed to load task queue')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCases()
  }, [])

  const filteredCases = useMemo(() => {
    return [...cases]
      .filter((row) => {
        const status = normalize(row.status)
        const matchesStatus = statusFilter === 'all' || status === statusFilter
        const q = query.trim().toLowerCase()
        const matchesQuery =
          q.length === 0 ||
          (row.title || '').toLowerCase().includes(q) ||
          (row.description || '').toLowerCase().includes(q) ||
          (row.property?.title || '').toLowerCase().includes(q) ||
          (row.property?.location || '').toLowerCase().includes(q) ||
          (row.buyer?.name || '').toLowerCase().includes(q)
        return matchesStatus && matchesQuery
      })
      .sort((a, b) => +new Date(b.createdAt || 0) - +new Date(a.createdAt || 0))
  }, [cases, query, statusFilter])

  const stats = useMemo(() => {
    return {
      total: cases.length,
      open: cases.filter((row) => normalize(row.status) === 'open').length,
      inProgress: cases.filter((row) => normalize(row.status) === 'in_progress').length,
      completed: cases.filter((row) => normalize(row.status) === 'completed').length,
      value: cases.reduce((sum, row) => sum + toNumber(row.amount), 0),
    }
  }, [cases])

  const statusOptions = useMemo(() => {
    const set = new Set<string>()
    for (const row of cases) set.add(normalize(row.status) || 'open')
    return ['all', ...Array.from(set)]
  }, [cases])

  const updateStatus = async (id: string, status: string) => {
    try {
      setUpdatingId(id)
      const response = await backendApi.partners.updateCase(id, { status })
      if (!response?.success) {
        throw new Error(response?.message || response?.error || 'Failed to update task status')
      }
      toast.success(`Task marked as ${status.replace('_', ' ')}`)
      await loadCases()
    } catch (error: any) {
      toast.error(error?.message || 'Failed to update task status')
    } finally {
      setUpdatingId('')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Task Queue</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Ground partner tasks synced through partner case workflow
          </p>
        </div>
        <button
          onClick={loadCases}
          className="inline-flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
        <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-950">
          <p className="text-xs text-gray-500">Total Tasks</p>
          <p className="text-xl font-semibold">{stats.total}</p>
        </div>
        <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 dark:border-blue-900/30 dark:bg-blue-900/20">
          <p className="text-xs text-blue-700 dark:text-blue-400">Open</p>
          <p className="text-xl font-semibold">{stats.open}</p>
        </div>
        <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-900/30 dark:bg-yellow-900/20">
          <p className="text-xs text-yellow-700 dark:text-yellow-400">In Progress</p>
          <p className="text-xl font-semibold">{stats.inProgress}</p>
        </div>
        <div className="rounded-xl border border-green-200 bg-green-50 p-4 dark:border-green-900/30 dark:bg-green-900/20">
          <p className="text-xs text-green-700 dark:text-green-400">Completed</p>
          <p className="text-xl font-semibold">{stats.completed}</p>
        </div>
        <div className="rounded-xl border border-purple-200 bg-purple-50 p-4 dark:border-purple-900/30 dark:bg-purple-900/20">
          <p className="text-xs text-purple-700 dark:text-purple-400">Task Value</p>
          <p className="text-xl font-semibold">{formatCurrency(stats.value)}</p>
        </div>
      </div>

      <div className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-950 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search task title, property, location, or buyer"
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
          <table className="w-full min-w-[1080px] text-sm">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-300">Task</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-300">Property</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-300">Buyer</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-300">Status</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-300">Due</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-300">Value</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td className="px-4 py-8 text-center text-gray-500" colSpan={7}>
                    Loading task queue...
                  </td>
                </tr>
              )}
              {!loading && filteredCases.length === 0 && (
                <tr>
                  <td className="px-4 py-8 text-center text-gray-500" colSpan={7}>
                    No tasks found for current filters.
                  </td>
                </tr>
              )}
              {!loading &&
                filteredCases.map((row) => {
                  const status = normalize(row.status) || 'open'
                  const isBusy = updatingId === row.id
                  return (
                    <tr key={row.id} className="border-t border-gray-100 dark:border-gray-800">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-[10px] font-bold px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-500 rounded">
                            {row.displayId || row.id}
                          </span>
                          <p className="font-medium text-gray-900 dark:text-gray-100">{row.title || 'Ground task'}</p>
                        </div>
                        <p className="line-clamp-1 text-xs text-gray-500">{row.description || '-'}</p>
                      </td>
                      <td className="px-4 py-3 text-gray-700 dark:text-gray-300">
                        <p>{row.property?.title || '-'}</p>
                        <p className="text-xs text-gray-500">{row.property?.location || '-'}</p>
                      </td>
                      <td className="px-4 py-3 text-gray-700 dark:text-gray-300">
                        <div className="flex items-center gap-2">
                          <p>{row.buyer?.name || '-'}</p>
                          {row.clientUniqueId && (
                            <span className="text-[10px] font-bold px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-500 rounded">
                              {row.clientUniqueId}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500">{row.buyer?.phone || row.buyer?.email || '-'}</p>
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex rounded-full bg-gray-100 px-2 py-1 text-xs font-medium capitalize text-gray-700 dark:bg-gray-800 dark:text-gray-200">
                          {status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{formatDate(row.dueDate)}</td>
                      <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{formatCurrency(toNumber(row.amount))}</td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button
                            onClick={() => updateStatus(row.id, 'in_progress')}
                            disabled={isBusy || status === 'in_progress' || status === 'completed'}
                            className="rounded bg-blue-600 px-2 py-1 text-xs font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400"
                          >
                            Start
                          </button>
                          <button
                            onClick={() => updateStatus(row.id, 'completed')}
                            disabled={isBusy || status === 'completed'}
                            className="rounded bg-green-600 px-2 py-1 text-xs font-medium text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-gray-400"
                          >
                            Complete
                          </button>
                          <button
                            onClick={() => updateStatus(row.id, 'cancelled')}
                            disabled={isBusy || status === 'cancelled' || status === 'completed'}
                            className="rounded bg-red-600 px-2 py-1 text-xs font-medium text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-gray-400"
                          >
                            Cancel
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-4 text-sm text-gray-600 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-400">
        Task status updates propagate to employee and admin dashboards through the shared partner case workflow.
      </div>
    </div>
  )
}
