'use client'

import { useEffect, useMemo, useState } from 'react'
import { MessageSquare, Plus, RefreshCw, Search, Send } from 'lucide-react'
import toast from 'react-hot-toast'
import { backendApi } from '@/lib/backendApi'

type Ticket = {
  _id: string
  userId?: string
  userRole?: string
  categoryTitle?: string
  subCategoryTitle?: string
  problem?: string
  status?: string
  assignedTo?: string
  assignedToName?: string
  createdAt?: string
  updatedAt?: string
}

type TicketMessage = {
  _id: string
  senderId?: string
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

export default function PartnerSupportPage() {
  const [loading, setLoading] = useState(true)
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [selectedTicketId, setSelectedTicketId] = useState<string>('')
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null)
  const [messages, setMessages] = useState<TicketMessage[]>([])
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [messageDraft, setMessageDraft] = useState('')
  const [creatingTicket, setCreatingTicket] = useState(false)
  const [newTicket, setNewTicket] = useState({
    categoryTitle: 'Partner Support',
    subCategoryTitle: 'General Query',
    problem: '',
  })
  const [profile, setProfile] = useState<{ uniqueId?: string } | null>(null)

  // Fetch profile for UID
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await backendApi.user.getProfile()
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

  const loadTicketDetails = async (ticketId: string) => {
    if (!ticketId) {
      setSelectedTicket(null)
      setMessages([])
      return
    }
    try {
      const response = await backendApi.tickets.getById(ticketId)
      if (!response?.success) {
        throw new Error(response?.message || response?.error || 'Failed to load ticket details')
      }
      setSelectedTicket(response?.data?.ticket || null)
      setMessages(Array.isArray(response?.data?.messages) ? response.data.messages : [])
    } catch (error: any) {
      toast.error(error?.message || 'Failed to load ticket details')
    }
  }

  useEffect(() => {
    loadTickets()
  }, [])

  useEffect(() => {
    loadTicketDetails(selectedTicketId)
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

  const categorySummary = useMemo(() => {
    const counts = new Map<string, number>()
    for (const row of tickets) {
      const key = row.categoryTitle || 'General'
      counts.set(key, (counts.get(key) || 0) + 1)
    }
    return Array.from(counts.entries()).map(([category, count]) => ({ category, count }))
  }, [tickets])

  const createTicket = async () => {
    if (!newTicket.problem.trim()) {
      toast.error('Problem description is required')
      return
    }
    try {
      setCreatingTicket(true)
      const response = await backendApi.tickets.create({
        categoryId: toId(newTicket.categoryTitle),
        subCategoryId: toId(newTicket.subCategoryTitle),
        categoryTitle: newTicket.categoryTitle,
        subCategoryTitle: newTicket.subCategoryTitle,
        problem: newTicket.problem,
        userRole: 'promoter_partner',
      })

      if (!response?.success) {
        throw new Error(response?.message || response?.error || 'Failed to create support ticket')
      }

      toast.success('Support ticket created')
      setNewTicket({ categoryTitle: 'Partner Support', subCategoryTitle: 'General Query', problem: '' })
      await loadTickets()
      const createdId = response?.data?.ticket?._id
      if (createdId) setSelectedTicketId(createdId)
    } catch (error: any) {
      toast.error(error?.message || 'Failed to create support ticket')
    } finally {
      setCreatingTicket(false)
    }
  }

  const sendMessage = async () => {
    if (!selectedTicketId || !messageDraft.trim()) return

    try {
      const response = await backendApi.tickets.sendMessage(selectedTicketId, messageDraft.trim())
      if (!response?.success) {
        throw new Error(response?.message || response?.error || 'Failed to send message')
      }
      setMessageDraft('')
      await loadTicketDetails(selectedTicketId)
      await loadTickets()
    } catch (error: any) {
      toast.error(error?.message || 'Failed to send message')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-3">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Support</h1>
            <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-full text-sm font-bold border border-blue-200 dark:border-blue-800">
              {profile?.uniqueId ? `GBPR-${profile.uniqueId.slice(-6).toUpperCase()}` : 'GBPR-PARTNER'}
            </span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Ticket workflow connected with employee and admin support teams
          </p>
        </div>
        <button
          onClick={loadTickets}
          className="inline-flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
        >
          <RefreshCw size={16} />
          Refresh
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

      <div className="grid gap-6 xl:grid-cols-[360px_1fr]">
        <div className="space-y-4 rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-950">
          <div className="space-y-3">
            <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">Create New Ticket</div>
            <input
              value={newTicket.categoryTitle}
              onChange={(e) => setNewTicket((prev) => ({ ...prev, categoryTitle: e.target.value }))}
              placeholder="Category"
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-gray-900"
            />
            <input
              value={newTicket.subCategoryTitle}
              onChange={(e) => setNewTicket((prev) => ({ ...prev, subCategoryTitle: e.target.value }))}
              placeholder="Sub-category"
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-gray-900"
            />
            <textarea
              value={newTicket.problem}
              onChange={(e) => setNewTicket((prev) => ({ ...prev, problem: e.target.value }))}
              rows={4}
              placeholder="Describe the issue"
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-gray-900"
            />
            <button
              onClick={createTicket}
              disabled={creatingTicket}
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400"
            >
              <Plus size={16} /> Create Ticket
            </button>
          </div>

          <div className="border-t border-gray-100 pt-4 dark:border-gray-800">
            <div className="mb-3 text-sm font-semibold text-gray-900 dark:text-gray-100">My Tickets</div>
            <div className="space-y-2">
              <div className="relative">
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
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-gray-900"
              >
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status === 'all' ? 'All statuses' : status}
                  </option>
                ))}
              </select>
            </div>

            <div className="mt-3 max-h-[420px] space-y-2 overflow-y-auto">
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

          <div className="border-t border-gray-100 pt-4 dark:border-gray-800">
            <div className="mb-2 text-sm font-semibold text-gray-900 dark:text-gray-100">Ticket Categories</div>
            <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
              {categorySummary.length === 0 && <p>No category data available.</p>}
              {categorySummary.map((row) => (
                <p key={row.category}>
                  {row.category}: {row.count}
                </p>
              ))}
            </div>
          </div>
        </div>

        <div className="flex min-h-[560px] flex-col rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950">
          {!selectedTicketId && (
            <div className="flex flex-1 flex-col items-center justify-center p-6 text-center text-gray-500">
              <MessageSquare size={32} className="mb-2" />
              Select a ticket to view conversation.
            </div>
          )}

          {selectedTicketId && (
            <>
              <div className="border-b border-gray-100 px-4 py-3 dark:border-gray-800">
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

              <div className="border-t border-gray-100 p-4 dark:border-gray-800">
                <div className="flex gap-2">
                  <input
                    value={messageDraft}
                    onChange={(e) => setMessageDraft(e.target.value)}
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
                    disabled={!messageDraft.trim()}
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
    </div>
  )
}
