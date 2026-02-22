'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { RefreshCw } from 'lucide-react'
import toast from 'react-hot-toast'
import { backendApi } from '@/lib/backendApi'

type Ticket = {
  _id?: string
  id?: string
  userId?: string
  categoryTitle?: string
  subCategoryTitle?: string
  problem?: string
  status?: string
  createdAt?: string
  updatedAt?: string
}

export default function EmployeeIssuesPage() {
  const [loading, setLoading] = useState(true)
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [statusFilter, setStatusFilter] = useState('all')

  const loadIssues = async () => {
    try {
      setLoading(true)
      const response = await backendApi.employee.getTickets('all')
      if (!response?.success) {
        throw new Error(response?.error || 'Failed to load issues')
      }
      setTickets(response?.data?.tickets || [])
    } catch (error: any) {
      toast.error(error?.message || 'Failed to load issues')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadIssues()
  }, [])

  const issueTickets = useMemo(() => {
    const activeStates = new Set(['open', 'assigned', 'in_progress', 'pending'])
    const source = tickets.filter((ticket) => activeStates.has((ticket.status || '').toLowerCase()))
    if (statusFilter === 'all') return source
    return source.filter((ticket) => (ticket.status || '').toLowerCase() === statusFilter)
  }, [tickets, statusFilter])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Issues and Reports</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Live view of unresolved support issues from buyers and sellers
          </p>
        </div>
        <button
          onClick={loadIssues}
          className="inline-flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      <div className="flex gap-2">
        {['all', 'open', 'assigned', 'in_progress', 'pending'].map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`rounded-lg px-3 py-2 text-sm capitalize ${
              statusFilter === status
                ? 'bg-orange-600 text-white'
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
              <th className="px-4 py-3 text-left font-semibold">Category</th>
              <th className="px-4 py-3 text-left font-semibold">Problem</th>
              <th className="px-4 py-3 text-left font-semibold">User</th>
              <th className="px-4 py-3 text-left font-semibold">Status</th>
              <th className="px-4 py-3 text-left font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td className="px-4 py-6 text-gray-500" colSpan={5}>
                  Loading issues...
                </td>
              </tr>
            )}
            {!loading && issueTickets.length === 0 && (
              <tr>
                <td className="px-4 py-6 text-gray-500" colSpan={5}>
                  No unresolved issues found.
                </td>
              </tr>
            )}
            {!loading &&
              issueTickets.map((ticket) => (
                <tr key={ticket._id || ticket.id} className="border-b border-gray-100 dark:border-gray-900">
                  <td className="px-4 py-3">
                    <p className="font-medium">{ticket.categoryTitle || 'General'}</p>
                    <p className="text-xs text-gray-500">{ticket.subCategoryTitle || '-'}</p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="line-clamp-2 max-w-xl">{ticket.problem || '-'}</p>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-500">{ticket.userId || '-'}</td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-gray-100 px-2 py-1 text-xs capitalize dark:bg-gray-800">
                      {ticket.status || 'open'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href="/employee/support"
                      className="rounded bg-blue-600 px-3 py-1 text-xs font-medium text-white hover:bg-blue-700"
                    >
                      Open in Support
                    </Link>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

