'use client'

import { useEffect, useMemo, useState } from 'react'
import { RefreshCw } from 'lucide-react'
import toast from 'react-hot-toast'
import { backendApi } from '@/lib/backendApi'

type Lead = {
  id: string
  referralCode?: string
  leadName?: string
  leadContact?: string
  status?: string
  commissionAmount?: number | null
  createdAt?: string
  promoter?: {
    id?: string
    uid?: string
    name?: string
    email?: string
  } | null
}

export default function EmployeeLeadManagementPage() {
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('all')
  const [leads, setLeads] = useState<Lead[]>([])

  const loadLeads = async () => {
    try {
      setLoading(true)
      const response = await backendApi.employee.getLeads(statusFilter)
      if (!response?.success) {
        throw new Error(response?.error || 'Failed to load leads')
      }
      setLeads(response?.data?.leads || [])
    } catch (error: any) {
      toast.error(error?.message || 'Failed to load leads')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadLeads()
  }, [statusFilter])

  const stats = useMemo(() => {
    let total = leads.length
    let converted = 0
    let newLeads = 0
    let commission = 0

    for (const lead of leads) {
      const status = (lead.status || '').toLowerCase()
      if (status === 'converted') converted += 1
      if (status === 'new') newLeads += 1
      commission += Number(lead.commissionAmount || 0)
    }

    return { total, converted, newLeads, commission }
  }, [leads])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Lead Management</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Referral leads submitted by promotional partners
          </p>
        </div>
        <button
          onClick={loadLeads}
          className="inline-flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-950">
          <p className="text-xs text-gray-500">Total Leads</p>
          <p className="text-xl font-semibold">{stats.total}</p>
        </div>
        <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 dark:border-blue-900/40 dark:bg-blue-900/20">
          <p className="text-xs text-blue-700 dark:text-blue-400">New</p>
          <p className="text-xl font-semibold">{stats.newLeads}</p>
        </div>
        <div className="rounded-xl border border-green-200 bg-green-50 p-4 dark:border-green-900/40 dark:bg-green-900/20">
          <p className="text-xs text-green-700 dark:text-green-400">Converted</p>
          <p className="text-xl font-semibold">{stats.converted}</p>
        </div>
        <div className="rounded-xl border border-purple-200 bg-purple-50 p-4 dark:border-purple-900/40 dark:bg-purple-900/20">
          <p className="text-xs text-purple-700 dark:text-purple-400">Commission</p>
          <p className="text-xl font-semibold">INR {stats.commission.toLocaleString('en-IN')}</p>
        </div>
      </div>

      <div className="flex gap-2">
        {['all', 'new', 'contacted', 'converted', 'closed'].map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`rounded-lg px-3 py-2 text-sm capitalize ${
              statusFilter === status
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-200'
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
              <th className="px-4 py-3 text-left font-semibold">Lead</th>
              <th className="px-4 py-3 text-left font-semibold">Promotional Partner</th>
              <th className="px-4 py-3 text-left font-semibold">Status</th>
              <th className="px-4 py-3 text-left font-semibold">Commission</th>
              <th className="px-4 py-3 text-left font-semibold">Created</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td className="px-4 py-6 text-gray-500" colSpan={5}>
                  Loading leads...
                </td>
              </tr>
            )}
            {!loading && leads.length === 0 && (
              <tr>
                <td className="px-4 py-6 text-gray-500" colSpan={5}>
                  No leads found.
                </td>
              </tr>
            )}
            {!loading &&
              leads.map((lead) => (
                <tr key={lead.id} className="border-b border-gray-100 dark:border-gray-900">
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-900 dark:text-gray-100">{lead.leadName || 'Unknown lead'}</p>
                    <p className="text-xs text-gray-500">{lead.leadContact || '-'}</p>
                    <p className="text-xs text-gray-500">Ref: {lead.referralCode || '-'}</p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium">{lead.promoter?.name || 'Unknown partner'}</p>
                    <p className="text-xs text-gray-500">{lead.promoter?.uid || lead.promoter?.email || '-'}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-gray-100 px-2 py-1 text-xs capitalize dark:bg-gray-800">
                      {lead.status || 'new'}
                    </span>
                  </td>
                  <td className="px-4 py-3">INR {Number(lead.commissionAmount || 0).toLocaleString('en-IN')}</td>
                  <td className="px-4 py-3 text-xs text-gray-500">
                    {lead.createdAt ? new Date(lead.createdAt).toLocaleString() : '-'}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

