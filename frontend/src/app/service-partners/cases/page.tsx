'use client'

import { useEffect, useMemo, useState } from 'react'
import {
  Briefcase,
  CheckCircle,
  Clock,
  Search,
  XCircle,
  AlertCircle,
  Play,
  Ban,
  Eye,
} from 'lucide-react'
import toast from 'react-hot-toast'
import { backendApi } from '@/lib/backendApi'

type PartnerCase = {
  id: string
  title?: string
  description?: string
  type?: string
  status?: string
  amount?: number
  dueDate?: string
  createdAt?: string
  updatedAt?: string
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
  metadata?: {
    conversationId?: string
    [key: string]: any
  }
}

const statusLabel = (status?: string) => {
  const value = (status || 'open').toLowerCase()
  if (value === 'pending') return 'pending'
  if (value === 'new') return 'new'
  if (value === 'accepted') return 'accepted'
  if (value === 'rejected') return 'rejected'
  if (value === 'in_progress') return 'in progress'
  if (value === 'completed') return 'completed'
  if (value === 'cancelled') return 'cancelled'
  return 'open'
}

const statusBadgeClass = (status?: string) => {
  const value = (status || 'open').toLowerCase()
  if (value === 'pending') return 'bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400'
  if (value === 'completed') return 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
  if (value === 'in_progress') return 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400'
  if (value === 'accepted') return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400'
  if (value === 'rejected') return 'bg-rose-100 text-rose-700 dark:bg-rose-900/20 dark:text-rose-400'
  if (value === 'cancelled') return 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400'
  if (value === 'new') return 'bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400'
  return 'bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-300'
}

export default function ServicePartnerCasesPage() {
  const [cases, setCases] = useState<PartnerCase[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedCase, setSelectedCase] = useState<PartnerCase | null>(null)
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null)

  const loadCases = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await backendApi.partners.getCases()

      if (!response?.success) {
        throw new Error(response?.error || 'Failed to fetch partner cases')
      }

      const records = Array.isArray(response.data) ? response.data : []
      setCases(records)
      if (records.length > 0) {
        setSelectedCase((prev) => prev && records.find((item: PartnerCase) => item.id === prev.id) ? prev : records[0])
      } else {
        setSelectedCase(null)
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to load tasks')
      setCases([])
      setSelectedCase(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCases()
  }, [])

  const filteredCases = useMemo(() => {
    return cases.filter((caseItem) => {
      const normalizedStatus = (caseItem.status || 'open').toLowerCase()
      const matchesStatus = statusFilter === 'all' || normalizedStatus === statusFilter

      if (!matchesStatus) return false
      if (!query) return true

      const haystack = [
        caseItem.title,
        caseItem.description,
        caseItem.property?.title,
        caseItem.property?.location,
        caseItem.buyer?.name,
        caseItem.id,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()

      return haystack.includes(query.toLowerCase())
    })
  }, [cases, query, statusFilter])

  const summary = useMemo(() => {
    const countBy = (status: string[]) =>
      cases.filter((item) => status.includes((item.status || 'open').toLowerCase())).length

    return {
      total: cases.length,
      active: countBy(['open', 'new', 'pending', 'accepted', 'in_progress']),
      pendingOffers: countBy(['pending', 'new', 'open']),
      completed: countBy(['completed']),
      closed: countBy(['cancelled', 'rejected']),
    }
  }, [cases])

  const updateCaseStatus = async (caseId: string, status: string) => {
    try {
      setActionLoadingId(caseId)
      const response = await backendApi.partners.updateCase(caseId, { status })

      if (!response?.success) {
        throw new Error(response?.error || 'Failed to update case')
      }

      toast.success(`Case moved to ${statusLabel(status)}`)
      await loadCases()
    } catch (err: any) {
      toast.error(err?.message || 'Failed to update case')
    } finally {
      setActionLoadingId(null)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Task Cases</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Track and update your assigned service-partner tasks.</p>
        </div>

        <button
          onClick={loadCases}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium"
        >
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
        <div className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl p-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">Total</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{summary.total}</p>
        </div>
        <div className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl p-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">Active</p>
          <p className="text-2xl font-bold text-blue-600">{summary.active}</p>
        </div>
        <div className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl p-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">Pending Offers</p>
          <p className="text-2xl font-bold text-amber-600">{summary.pendingOffers}</p>
        </div>
        <div className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl p-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">Completed</p>
          <p className="text-2xl font-bold text-green-600">{summary.completed}</p>
        </div>
        <div className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl p-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">Closed</p>
          <p className="text-2xl font-bold text-red-600">{summary.closed}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl">
          <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search by title, buyer, property, or case id"
                className="w-full pl-9 pr-3 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className="px-3 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg"
            >
              <option value="all">All Status</option>
              <option value="open">Open</option>
              <option value="new">New</option>
              <option value="pending">Pending Offer</option>
              <option value="accepted">Accepted</option>
              <option value="rejected">Rejected</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <div className="divide-y divide-gray-200 dark:divide-gray-800">
            {loading ? (
              <div className="p-8 text-center">
                <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
              </div>
            ) : error ? (
              <div className="p-6 text-red-600 dark:text-red-400">{error}</div>
            ) : filteredCases.length === 0 ? (
              <div className="p-10 text-center text-gray-500 dark:text-gray-400">No cases found.</div>
            ) : (
              filteredCases.map((caseItem) => (
                <button
                  key={caseItem.id}
                  onClick={() => setSelectedCase(caseItem)}
                  className={`w-full text-left p-4 hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors ${selectedCase?.id === caseItem.id ? 'bg-blue-50 dark:bg-blue-900/10' : ''}`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">{caseItem.title || 'Service Task'}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                        {caseItem.description || 'No description available.'}
                      </p>
                      <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                        {caseItem.property?.title || 'Property not linked'}
                      </div>
                    </div>

                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusBadgeClass(caseItem.status)}`}>
                      {statusLabel(caseItem.status)}
                    </span>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl p-5">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Case Details</h2>

          {!selectedCase ? (
            <div className="text-gray-500 dark:text-gray-400 text-sm">Select a case to view details.</div>
          ) : (
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">{selectedCase.title || 'Service Task'}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{selectedCase.description || 'No description available.'}</p>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Status</span>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusBadgeClass(selectedCase.status)}`}>
                    {statusLabel(selectedCase.status)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Type</span>
                  <span className="text-gray-900 dark:text-white">{selectedCase.type || 'General'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Amount</span>
                  <span className="text-gray-900 dark:text-white">Rs {Number(selectedCase.amount || 0).toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Due</span>
                  <span className="text-gray-900 dark:text-white">
                    {selectedCase.dueDate ? new Date(selectedCase.dueDate).toLocaleDateString() : 'Not set'}
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-gray-200 dark:border-gray-800 text-sm space-y-2">
                <p className="text-gray-500 dark:text-gray-400">Property</p>
                <p className="text-gray-900 dark:text-white">{selectedCase.property?.title || 'Not linked'}</p>
                <p className="text-gray-600 dark:text-gray-400">{selectedCase.property?.location || 'Location unavailable'}</p>
              </div>

              <div className="pt-2 border-t border-gray-200 dark:border-gray-800 text-sm space-y-2">
                <p className="text-gray-500 dark:text-gray-400">Buyer</p>
                <p className="text-gray-900 dark:text-white">{selectedCase.buyer?.name || 'N/A'}</p>
                <p className="text-gray-600 dark:text-gray-400">{selectedCase.buyer?.phone || selectedCase.buyer?.email || 'No contact available'}</p>
              </div>

              {selectedCase.metadata?.conversationId && (
                <a
                  href={`/service-partners/communications?id=${encodeURIComponent(selectedCase.metadata.conversationId)}`}
                  className="inline-flex items-center justify-center gap-2 px-3 py-2.5 bg-slate-800 hover:bg-slate-900 text-white rounded-lg"
                >
                  <Eye size={16} />
                  <span>Open Chat</span>
                </a>
              )}

              <div className="pt-2 border-t border-gray-200 dark:border-gray-800 grid grid-cols-1 gap-2">
                {['open', 'new', 'pending'].includes((selectedCase.status || 'open').toLowerCase()) && (
                  <button
                    disabled={actionLoadingId === selectedCase.id}
                    onClick={() => updateCaseStatus(selectedCase.id, 'accepted')}
                    className="inline-flex items-center justify-center gap-2 px-3 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg disabled:opacity-60"
                  >
                    <CheckCircle size={16} />
                    <span>{actionLoadingId === selectedCase.id ? 'Updating...' : 'Accept Offer'}</span>
                  </button>
                )}

                {['open', 'new', 'pending'].includes((selectedCase.status || 'open').toLowerCase()) && (
                  <button
                    disabled={actionLoadingId === selectedCase.id}
                    onClick={() => updateCaseStatus(selectedCase.id, 'rejected')}
                    className="inline-flex items-center justify-center gap-2 px-3 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg disabled:opacity-60"
                  >
                    <XCircle size={16} />
                    <span>{actionLoadingId === selectedCase.id ? 'Updating...' : 'Reject Offer'}</span>
                  </button>
                )}

                {(selectedCase.status || '').toLowerCase() === 'accepted' && (
                  <button
                    disabled={actionLoadingId === selectedCase.id}
                    onClick={() => updateCaseStatus(selectedCase.id, 'in_progress')}
                    className="inline-flex items-center justify-center gap-2 px-3 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg disabled:opacity-60"
                  >
                    <Play size={16} />
                    <span>{actionLoadingId === selectedCase.id ? 'Updating...' : 'Start Work'}</span>
                  </button>
                )}

                {(selectedCase.status || '').toLowerCase() === 'in_progress' && (
                  <button
                    disabled={actionLoadingId === selectedCase.id}
                    onClick={() => updateCaseStatus(selectedCase.id, 'completed')}
                    className="inline-flex items-center justify-center gap-2 px-3 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg disabled:opacity-60"
                  >
                    <CheckCircle size={16} />
                    <span>{actionLoadingId === selectedCase.id ? 'Updating...' : 'Mark Completed'}</span>
                  </button>
                )}

                {!['completed', 'cancelled', 'rejected'].includes((selectedCase.status || '').toLowerCase()) && (
                  <button
                    disabled={actionLoadingId === selectedCase.id}
                    onClick={() => updateCaseStatus(selectedCase.id, 'cancelled')}
                    className="inline-flex items-center justify-center gap-2 px-3 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg disabled:opacity-60"
                  >
                    <Ban size={16} />
                    <span>{actionLoadingId === selectedCase.id ? 'Updating...' : 'Cancel Case'}</span>
                  </button>
                )}

                {['completed', 'cancelled', 'rejected'].includes((selectedCase.status || '').toLowerCase()) && (
                  <div className="inline-flex items-center gap-2 text-sm px-3 py-2.5 bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-300 rounded-lg">
                    <Eye size={16} />
                    <span>Case is closed for updates</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}


