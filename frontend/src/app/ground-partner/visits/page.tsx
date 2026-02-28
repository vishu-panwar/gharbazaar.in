'use client'

import { useEffect, useMemo, useState } from 'react'
import { MapPin, RefreshCw, Search } from 'lucide-react'
import toast from 'react-hot-toast'
import { backendApi } from '@/lib/backendApi'

type Visit = {
  id: string
  status?: string
  scheduledAt?: string
  createdAt?: string
  notes?: string
  address?: string
  feedback?: string
  property?: {
    id?: string
    title?: string
    location?: string
    price?: number | string | null
    photos?: string[]
  }
  displayId?: string
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

export default function GroundPartnerVisitsPage() {
  const [loading, setLoading] = useState(true)
  const [updatingId, setUpdatingId] = useState('')
  const [visits, setVisits] = useState<Visit[]>([])
  const [statusFilter, setStatusFilter] = useState('all')
  const [query, setQuery] = useState('')

  const loadVisits = async () => {
    try {
      setLoading(true)
      const response = await backendApi.visits.getPartner()
      if (!response?.success) {
        throw new Error(response?.message || response?.error || 'Failed to load partner visits')
      }
      setVisits(
        (Array.isArray(response?.data) ? response.data : []).map((v: any) => ({
          ...v,
          displayId: `VIS-${v.id?.slice(-6).toUpperCase()}`
        }))
      )
    } catch (error: any) {
      toast.error(error?.message || 'Failed to load partner visits')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadVisits()
  }, [])

  const filteredVisits = useMemo(() => {
    return [...visits]
      .filter((row) => {
        const status = normalize(row.status)
        const matchesStatus = statusFilter === 'all' || status === statusFilter
        const q = query.trim().toLowerCase()
        const matchesQuery =
          q.length === 0 ||
          (row.property?.title || '').toLowerCase().includes(q) ||
          (row.property?.location || '').toLowerCase().includes(q) ||
          (row.address || '').toLowerCase().includes(q)
        return matchesStatus && matchesQuery
      })
      .sort((a, b) => +new Date(b.scheduledAt || b.createdAt || 0) - +new Date(a.scheduledAt || a.createdAt || 0))
  }, [query, statusFilter, visits])

  const stats = useMemo(() => {
    return {
      total: visits.length,
      scheduled: visits.filter((row) => normalize(row.status) === 'scheduled').length,
      inProgress: visits.filter((row) => normalize(row.status) === 'in_progress').length,
      completed: visits.filter((row) => normalize(row.status) === 'completed').length,
      cancelled: visits.filter((row) => normalize(row.status) === 'cancelled').length,
    }
  }, [visits])

  const statusOptions = useMemo(() => {
    const set = new Set<string>()
    for (const row of visits) set.add(normalize(row.status) || 'pending')
    return ['all', ...Array.from(set)]
  }, [visits])

  const updateStatus = async (id: string, status: string) => {
    try {
      setUpdatingId(id)
      const response = await backendApi.visits.update(id, { status })
      if (!response?.success) {
        throw new Error(response?.message || response?.error || 'Failed to update visit status')
      }
      toast.success(`Visit marked as ${status.replace('_', ' ')}`)
      await loadVisits()
    } catch (error: any) {
      toast.error(error?.message || 'Failed to update visit status')
    } finally {
      setUpdatingId('')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Site Visits</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">Partner-assigned visits with live status updates</p>
        </div>
        <button
          onClick={loadVisits}
          className="inline-flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
        <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-950">
          <p className="text-xs text-gray-500">Total Visits</p>
          <p className="text-xl font-semibold">{stats.total}</p>
        </div>
        <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 dark:border-blue-900/30 dark:bg-blue-900/20">
          <p className="text-xs text-blue-700 dark:text-blue-400">Scheduled</p>
          <p className="text-xl font-semibold">{stats.scheduled}</p>
        </div>
        <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-900/30 dark:bg-yellow-900/20">
          <p className="text-xs text-yellow-700 dark:text-yellow-400">In Progress</p>
          <p className="text-xl font-semibold">{stats.inProgress}</p>
        </div>
        <div className="rounded-xl border border-green-200 bg-green-50 p-4 dark:border-green-900/30 dark:bg-green-900/20">
          <p className="text-xs text-green-700 dark:text-green-400">Completed</p>
          <p className="text-xl font-semibold">{stats.completed}</p>
        </div>
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-900/30 dark:bg-red-900/20">
          <p className="text-xs text-red-700 dark:text-red-400">Cancelled</p>
          <p className="text-xl font-semibold">{stats.cancelled}</p>
        </div>
      </div>

      <div className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-950 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by property title or location"
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
          <table className="w-full min-w-[980px] text-sm">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-300">Property</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-300">Location</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-300">Status</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-300">Scheduled</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-300">Price</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-300">Notes</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td className="px-4 py-8 text-center text-gray-500" colSpan={7}>
                    Loading partner visits...
                  </td>
                </tr>
              )}
              {!loading && filteredVisits.length === 0 && (
                <tr>
                  <td className="px-4 py-8 text-center text-gray-500" colSpan={7}>
                    No visits found for current filters.
                  </td>
                </tr>
              )}
              {!loading &&
                filteredVisits.map((row) => {
                  const status = normalize(row.status) || 'pending'
                  const isBusy = updatingId === row.id
                  return (
                    <tr key={row.id} className="border-t border-gray-100 dark:border-gray-800">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-500 rounded">
                            {row.displayId || row.id}
                          </span>
                          <span className="font-medium text-gray-900 dark:text-gray-100">{row.property?.title || 'Site visit'}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-700 dark:text-gray-300">
                        <div className="flex items-center gap-1">
                          <MapPin size={14} />
                          <span>{row.address || row.property?.location || '-'}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex rounded-full bg-gray-100 px-2 py-1 text-xs font-medium capitalize text-gray-700 dark:bg-gray-800 dark:text-gray-200">
                          {status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{formatDate(row.scheduledAt || row.createdAt)}</td>
                      <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{formatCurrency(toNumber(row.property?.price))}</td>
                      <td className="max-w-[220px] truncate px-4 py-3 text-gray-700 dark:text-gray-300" title={row.notes || row.feedback || '-'}>
                        {row.notes || row.feedback || '-'}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button
                            onClick={() => updateStatus(row.id, 'in_progress')}
                            disabled={isBusy || status === 'in_progress' || status === 'completed' || status === 'cancelled'}
                            className="rounded bg-blue-600 px-2 py-1 text-xs font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400"
                          >
                            Start
                          </button>
                          <button
                            onClick={() => updateStatus(row.id, 'completed')}
                            disabled={isBusy || status === 'completed' || status === 'cancelled'}
                            className="rounded bg-green-600 px-2 py-1 text-xs font-medium text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-gray-400"
                          >
                            Complete
                          </button>
                          <button
                            onClick={() => updateStatus(row.id, 'cancelled')}
                            disabled={isBusy || status === 'completed' || status === 'cancelled'}
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
        Visit updates are shared with buyer, seller, employee, and admin portals through the same backend workflow.
      </div>
    </div>
  )
}
