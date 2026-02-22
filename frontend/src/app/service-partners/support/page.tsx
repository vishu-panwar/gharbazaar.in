'use client'

import { useEffect, useMemo, useState } from 'react'
import { MessageSquare, Plus, RefreshCw, Search, Send } from 'lucide-react'
import toast from 'react-hot-toast'
import { backendApi } from '@/lib/backendApi'

type Ticket = {
  _id: string
  categoryTitle?: string
  subCategoryTitle?: string
  problem?: string
  status?: string
  assignedToName?: string
  createdAt?: string
}

type TicketMessage = {
  _id: string
  senderType?: string
  message?: string
  timestamp?: string
}

const normalize = (value?: string) => (value || '').toLowerCase()

const formatDate = (value?: string) => {
  if (!value) return '-'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '-'
  return date.toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })
}

const toId = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, '_')

export default function ServicePartnerSupportPage() {
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [selectedTicketId, setSelectedTicketId] = useState('')
  const [messages, setMessages] = useState<TicketMessage[]>([])
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [draft, setDraft] = useState('')
  const [form, setForm] = useState({
    categoryTitle: 'Service Partner Support',
    subCategoryTitle: 'General Query',
    problem: '',
  })

  const loadTickets = async () => {
    try {
      setLoading(true)
      const response = await backendApi.tickets.getUserTickets()
      if (!response?.success) {
        throw new Error(response?.message || response?.error || 'Failed to load support tickets')
      }
      const rows = Array.isArray(response?.data?.tickets) ? response.data.tickets : []
      setTickets(rows)
      if (!selectedTicketId && rows.length > 0) {
        setSelectedTicketId(rows[0]._id)
      }
    } catch (error: any) {
      toast.error(error?.message || 'Failed to load support tickets')
    } finally {
      setLoading(false)
    }
  }

  const loadDetails = async (ticketId: string) => {
    if (!ticketId) {
      setMessages([])
      return
    }

    try {
      const response = await backendApi.tickets.getById(ticketId)
      if (!response?.success) {
        throw new Error(response?.message || response?.error || 'Failed to load ticket conversation')
      }
      setMessages(Array.isArray(response?.data?.messages) ? response.data.messages : [])
    } catch (error: any) {
      toast.error(error?.message || 'Failed to load ticket conversation')
    }
  }

  useEffect(() => {
    loadTickets()
  }, [])

  useEffect(() => {
    loadDetails(selectedTicketId)
  }, [selectedTicketId])

  const filteredTickets = useMemo(() => {
    return tickets.filter((row) => {
      const status = normalize(row.status)
      const matchesStatus = statusFilter === 'all' || status === statusFilter
      const q = query.trim().toLowerCase()
      const matchesQuery =
        q.length === 0 ||
        (row.problem || '').toLowerCase().includes(q) ||
        (row.categoryTitle || '').toLowerCase().includes(q) ||
        (row.subCategoryTitle || '').toLowerCase().includes(q)
      return matchesStatus && matchesQuery
    })
  }, [query, statusFilter, tickets])

  const stats = useMemo(() => {
    return {
      total: tickets.length,
      open: tickets.filter((row) => normalize(row.status) === 'open').length,
      assigned: tickets.filter((row) => normalize(row.status) === 'assigned').length,
      closed: tickets.filter((row) => normalize(row.status) === 'closed').length,
    }
  }, [tickets])

  const statusOptions = useMemo(() => {
    const set = new Set<string>()
    for (const row of tickets) set.add(normalize(row.status) || 'open')
    return ['all', ...Array.from(set)]
  }, [tickets])

  const selectedTicket = useMemo(() => tickets.find((row) => row._id === selectedTicketId), [selectedTicketId, tickets])

  const createTicket = async () => {
    if (!form.problem.trim()) {
      toast.error('Issue description is required')
      return
    }

    try {
      setCreating(true)
      const response = await backendApi.tickets.create({
        categoryId: toId(form.categoryTitle),
        subCategoryId: toId(form.subCategoryTitle),
        categoryTitle: form.categoryTitle,
        subCategoryTitle: form.subCategoryTitle,
        problem: form.problem,
        userRole: 'service_partner',
      })
      if (!response?.success) {
        throw new Error(response?.message || response?.error || 'Failed to create support ticket')
      }
      toast.success('Support ticket created')
      setForm({ categoryTitle: 'Service Partner Support', subCategoryTitle: 'General Query', problem: '' })
      await loadTickets()
      const createdId = response?.data?.ticket?._id
      if (createdId) setSelectedTicketId(createdId)
    } catch (error: any) {
      toast.error(error?.message || 'Failed to create support ticket')
    } finally {
      setCreating(false)
    }
  }

  const sendMessage = async () => {
    if (!selectedTicketId || !draft.trim()) return

    try {
      const response = await backendApi.tickets.sendMessage(selectedTicketId, draft.trim())
      if (!response?.success) {
        throw new Error(response?.message || response?.error || 'Failed to send message')
      }
      setDraft('')
      await loadDetails(selectedTicketId)
      await loadTickets()
    } catch (error: any) {
      toast.error(error?.message || 'Failed to send message')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Support Center</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Service partner support tickets managed with employee and admin teams
          </p>
        </div>
        <button
          onClick={loadTickets}
          className="inline-flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
        >
          <RefreshCw size={16} /> Refresh
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-950">
          <p className="text-xs text-gray-500">Total Tickets</p>
          <p className="text-xl font-semibold">{stats.total}</p>
        </div>
        <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 dark:border-blue-900/30 dark:bg-blue-900/20">
          <p className="text-xs text-blue-700 dark:text-blue-400">Open</p>
          <p className="text-xl font-semibold">{stats.open}</p>
        </div>
        <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-900/30 dark:bg-yellow-900/20">
          <p className="text-xs text-yellow-700 dark:text-yellow-400">Assigned</p>
          <p className="text-xl font-semibold">{stats.assigned}</p>
        </div>
        <div className="rounded-xl border border-green-200 bg-green-50 p-4 dark:border-green-900/30 dark:bg-green-900/20">
          <p className="text-xs text-green-700 dark:text-green-400">Closed</p>
          <p className="text-xl font-semibold">{stats.closed}</p>
        </div>
      </div>

      <div className="grid min-h-[620px] gap-6 rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-950 lg:grid-cols-[360px_1fr]">
        <div className="space-y-4">
          <div className="space-y-2">
            <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Create Ticket</h2>
            <input
              value={form.categoryTitle}
              onChange={(e) => setForm((prev) => ({ ...prev, categoryTitle: e.target.value }))}
              placeholder="Category"
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-gray-900"
            />
            <input
              value={form.subCategoryTitle}
              onChange={(e) => setForm((prev) => ({ ...prev, subCategoryTitle: e.target.value }))}
              placeholder="Sub-category"
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-gray-900"
            />
            <textarea
              value={form.problem}
              onChange={(e) => setForm((prev) => ({ ...prev, problem: e.target.value }))}
              rows={4}
              placeholder="Describe your issue"
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-gray-900"
            />
            <button
              onClick={createTicket}
              disabled={creating}
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400"
            >
              <Plus size={16} /> Create
            </button>
          </div>

          <div className="border-t border-gray-100 pt-3 dark:border-gray-800">
            <div className="relative mb-2">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search tickets"
                className="w-full rounded-lg border border-gray-200 bg-white py-2 pl-9 pr-3 text-sm outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-gray-900"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="mb-2 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-gray-900"
            >
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {status === 'all' ? 'All statuses' : status}
                </option>
              ))}
            </select>

            <div className="max-h-[420px] space-y-2 overflow-y-auto">
              {loading && <p className="text-sm text-gray-500">Loading tickets...</p>}
              {!loading && filteredTickets.length === 0 && <p className="text-sm text-gray-500">No tickets found.</p>}
              {!loading &&
                filteredTickets.map((row) => (
                  <button
                    key={row._id}
                    onClick={() => setSelectedTicketId(row._id)}
                    className={`w-full rounded-lg border p-3 text-left ${selectedTicketId === row._id
                        ? 'border-blue-500 bg-blue-50 dark:border-blue-700 dark:bg-blue-900/20'
                        : 'border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-900'
                      }`}
                  >
                    <p className="line-clamp-1 text-sm font-medium text-gray-900 dark:text-gray-100">{row.problem || '-'}</p>
                    <div className="mt-1 flex items-center justify-between text-xs text-gray-500">
                      <span className="capitalize">{normalize(row.status) || 'open'}</span>
                      <span>{formatDate(row.createdAt)}</span>
                    </div>
                  </button>
                ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col rounded-lg border border-gray-200 dark:border-gray-800">
          {!selectedTicketId && (
            <div className="flex flex-1 flex-col items-center justify-center p-6 text-center text-gray-500">
              <MessageSquare size={32} className="mb-2" />
              Select a ticket to view conversation.
            </div>
          )}

          {selectedTicketId && (
            <>
              <div className="border-b border-gray-200 px-4 py-3 dark:border-gray-800">
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{selectedTicket?.problem || 'Ticket Conversation'}</p>
                <p className="text-xs text-gray-500">
                  Status: {normalize(selectedTicket?.status) || 'open'}
                  {selectedTicket?.assignedToName ? ` | Assigned: ${selectedTicket.assignedToName}` : ''}
                </p>
              </div>

              <div className="flex-1 space-y-3 overflow-y-auto p-4">
                {messages.length === 0 && <p className="text-sm text-gray-500">No messages yet.</p>}
                {messages.map((row) => {
                  const isStaff = normalize(row.senderType) === 'employee'
                  return (
                    <div key={row._id} className={`flex ${isStaff ? 'justify-start' : 'justify-end'}`}>
                      <div className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${isStaff
                          ? 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100'
                          : 'bg-blue-600 text-white'
                        }`}>
                        <p>{row.message || '-'}</p>
                        <p className={`mt-1 text-xs ${isStaff ? 'text-gray-500' : 'text-blue-100'}`}>{formatDate(row.timestamp)}</p>
                      </div>
                    </div>
                  )
                })}
              </div>

              <div className="border-t border-gray-200 p-4 dark:border-gray-800">
                <div className="flex gap-2">
                  <input
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        sendMessage()
                      }
                    }}
                    placeholder="Type your response"
                    className="flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-gray-900"
                  />
                  <button
                    onClick={sendMessage}
                    disabled={!draft.trim()}
                    className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400"
                  >
                    <Send size={16} /> Send
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-4 text-sm text-gray-600 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-400">
        Service partner support uses the same ticket backend used across buyer, seller, partner, employee, and admin portals.
      </div>
    </div>
  )
}
