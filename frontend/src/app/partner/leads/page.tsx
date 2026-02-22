'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { CheckCircle, IndianRupee, RefreshCw, Search, TrendingUp, Users } from 'lucide-react'
import toast from 'react-hot-toast'
import { backendApi } from '@/lib/backendApi'

type Referral = {
  id: string
  referralCode?: string
  leadName?: string
  leadContact?: string
  status?: string
  commissionAmount?: number | string | null
  createdAt?: string
  metadata?: Record<string, any>
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

const normalizeStatus = (value?: string) => (value || 'new').toLowerCase()

export default function PartnerLeadsPage() {
  const [loading, setLoading] = useState(true)
  const [referrals, setReferrals] = useState<Referral[]>([])
  const [statusFilter, setStatusFilter] = useState('all')
  const [query, setQuery] = useState('')

  const loadReferrals = async () => {
    try {
      setLoading(true)
      const response = await backendApi.partners.getReferrals()
      if (!response?.success) {
        throw new Error(response?.message || response?.error || 'Failed to load leads')
      }
      const rows = Array.isArray(response?.data) ? response.data : []
      setReferrals(rows)
    } catch (error: any) {
      toast.error(error?.message || 'Failed to load leads')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadReferrals()
  }, [])

  const filteredReferrals = useMemo(() => {
    return referrals.filter((row) => {
      const status = normalizeStatus(row.status)
      const matchesStatus = statusFilter === 'all' || status === statusFilter
      const q = query.trim().toLowerCase()
      const matchesQuery =
        q.length === 0 ||
        (row.leadName || '').toLowerCase().includes(q) ||
        (row.leadContact || '').toLowerCase().includes(q) ||
        (row.referralCode || '').toLowerCase().includes(q)
      return matchesStatus && matchesQuery
    })
  }, [query, referrals, statusFilter])

  const stats = useMemo(() => {
    let converted = 0
    let active = 0
    let totalCommission = 0

    for (const row of referrals) {
      const status = normalizeStatus(row.status)
      if (status === 'converted') {
        converted += 1
      }
      if (status === 'new' || status === 'contacted') {
        active += 1
      }
      totalCommission += toNumber(row.commissionAmount)
    }

    return {
      total: referrals.length,
      active,
      converted,
      totalCommission,
    }
  }, [referrals])

  const availableStatuses = useMemo(() => {
    const set = new Set<string>()
    for (const row of referrals) {
      set.add(normalizeStatus(row.status))
    }
    return ['all', ...Array.from(set)]
  }, [referrals])

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Lead Tracking</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Live referral leads from promotional partner workflow
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/partner/referrals" className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
            Submit Referral
          </Link>
          <button
            onClick={loadReferrals}
            className="inline-flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
          >
            <RefreshCw size={16} />
            Refresh
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-950">
          <p className="text-xs text-gray-500">Total Leads</p>
          <p className="text-xl font-semibold">{stats.total}</p>
        </div>
        <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 dark:border-blue-900/30 dark:bg-blue-900/20">
          <p className="text-xs text-blue-700 dark:text-blue-400">Active</p>
          <p className="text-xl font-semibold">{stats.active}</p>
        </div>
        <div className="rounded-xl border border-green-200 bg-green-50 p-4 dark:border-green-900/30 dark:bg-green-900/20">
          <p className="text-xs text-green-700 dark:text-green-400">Converted</p>
          <p className="text-xl font-semibold">{stats.converted}</p>
        </div>
        <div className="rounded-xl border border-purple-200 bg-purple-50 p-4 dark:border-purple-900/30 dark:bg-purple-900/20">
          <p className="text-xs text-purple-700 dark:text-purple-400">Commission</p>
          <p className="text-xl font-semibold">{formatCurrency(stats.totalCommission)}</p>
        </div>
      </div>

      <div className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-950 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by lead name, contact, or referral code"
            className="w-full rounded-lg border border-gray-200 bg-white py-2 pl-9 pr-3 text-sm outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-gray-900"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-gray-900"
        >
          {availableStatuses.map((status) => (
            <option key={status} value={status}>
              {status === 'all' ? 'All statuses' : status}
            </option>
          ))}
        </select>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-sm">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-300">Lead</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-300">Contact</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-300">Referral Code</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-300">Status</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-300">Commission</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-300">Created</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td className="px-4 py-8 text-center text-gray-500" colSpan={6}>
                    Loading leads...
                  </td>
                </tr>
              )}
              {!loading && filteredReferrals.length === 0 && (
                <tr>
                  <td className="px-4 py-8 text-center text-gray-500" colSpan={6}>
                    No leads found for current filters.
                  </td>
                </tr>
              )}
              {!loading &&
                filteredReferrals.map((row) => {
                  const status = normalizeStatus(row.status)
                  return (
                    <tr key={row.id} className="border-t border-gray-100 dark:border-gray-800">
                      <td className="px-4 py-3 font-medium text-gray-900 dark:text-gray-100">{row.leadName || '-'}</td>
                      <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{row.leadContact || '-'}</td>
                      <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{row.referralCode || '-'}</td>
                      <td className="px-4 py-3">
                        <span className="inline-flex rounded-full bg-gray-100 px-2 py-1 text-xs font-medium capitalize text-gray-700 dark:bg-gray-800 dark:text-gray-200">
                          {status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{formatCurrency(toNumber(row.commissionAmount))}</td>
                      <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{formatDate(row.createdAt)}</td>
                    </tr>
                  )
                })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-950">
          <div className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-200">
            <Users size={16} /> Lead Flow
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            New referrals are automatically visible to employee and admin workflows for follow-up.
          </p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-950">
          <div className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-200">
            <TrendingUp size={16} /> Conversion Tracking
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Lead statuses update as the team processes referrals through contacting and conversion.
          </p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-950">
          <div className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-200">
            <IndianRupee size={16} /> Commission Sync
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Commission values shown here come directly from referral records shared with admin/employee review.
          </p>
        </div>
      </div>
    </div>
  )
}
