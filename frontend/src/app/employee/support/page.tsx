'use client'

import { useEffect, useMemo, useState } from 'react'
import { RefreshCw, Send } from 'lucide-react'
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
  assignedTo?: string
  createdAt?: string
  updatedAt?: string
}

type TicketMessage = {
  _id?: string
  id?: string
  senderId?: string
  senderType?: string
  message?: string
  timestamp?: string
  createdAt?: string
}

export default function EmployeeSupportPage() {
  const [loading, setLoading] = useState(true)
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null)
  const [messages, setMessages] = useState<TicketMessage[]>([])
  const [messageInput, setMessageInput] = useState('')
  const [sending, setSending] = useState(false)

  const loadTickets = async () => {
    try {
      setLoading(true)
      const response = await backendApi.employee.getTickets(statusFilter)
      if (!response?.success) {
        throw new Error(response?.error || 'Failed to load tickets')
      }
      const nextTickets = response?.data?.tickets || []
      setTickets(nextTickets)
      if (!selectedTicketId && nextTickets.length > 0) {
        setSelectedTicketId(nextTickets[0]._id || nextTickets[0].id || null)
      }
    } catch (error: any) {
      toast.error(error?.message || 'Failed to load tickets')
    } finally {
      setLoading(false)
    }
  }

  const loadTicketDetails = async (ticketId: string) => {
    try {
      const response = await backendApi.tickets.getById(ticketId)
      if (!response?.success) {
        throw new Error(response?.error || 'Failed to load ticket details')
      }
      setMessages(response?.data?.messages || [])
    } catch (error: any) {
      toast.error(error?.message || 'Failed to load messages')
      setMessages([])
    }
  }

  useEffect(() => {
    loadTickets()
  }, [statusFilter])

  useEffect(() => {
    if (selectedTicketId) {
      loadTicketDetails(selectedTicketId)
    } else {
      setMessages([])
    }
  }, [selectedTicketId])

  const selectedTicket = useMemo(
    () => tickets.find((ticket) => (ticket._id || ticket.id) === selectedTicketId) || null,
    [tickets, selectedTicketId]
  )

  const sendMessage = async () => {
    if (!selectedTicketId || !messageInput.trim()) return
    try {
      setSending(true)
      const response = await backendApi.tickets.sendMessage(selectedTicketId, messageInput.trim())
      if (!response?.success) {
        throw new Error(response?.error || 'Failed to send message')
      }
      setMessageInput('')
      await loadTicketDetails(selectedTicketId)
      await loadTickets()
    } catch (error: any) {
      toast.error(error?.message || 'Failed to send message')
    } finally {
      setSending(false)
    }
  }

  const assignToMe = async () => {
    if (!selectedTicketId) return
    try {
      const response = await backendApi.tickets.assign(selectedTicketId)
      if (!response?.success) {
        throw new Error(response?.error || 'Failed to assign ticket')
      }
      toast.success('Ticket assigned')
      await loadTickets()
      await loadTicketDetails(selectedTicketId)
    } catch (error: any) {
      toast.error(error?.message || 'Failed to assign ticket')
    }
  }

  const closeTicket = async () => {
    if (!selectedTicketId) return
    try {
      const response = await backendApi.tickets.close(selectedTicketId)
      if (!response?.success) {
        throw new Error(response?.error || 'Failed to close ticket')
      }
      toast.success('Ticket closed')
      await loadTickets()
      await loadTicketDetails(selectedTicketId)
    } catch (error: any) {
      toast.error(error?.message || 'Failed to close ticket')
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Support Tickets</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">Respond to buyer and seller support requests</p>
        </div>
        <button
          onClick={loadTickets}
          className="inline-flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      <div className="flex gap-2">
        {['all', 'open', 'assigned', 'in_progress', 'resolved', 'closed'].map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`rounded-lg px-3 py-2 text-sm capitalize ${
              statusFilter === status
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-200'
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950">
          <div className="border-b border-gray-200 px-4 py-3 text-sm font-semibold dark:border-gray-800">
            Tickets ({tickets.length})
          </div>
          <div className="max-h-[520px] overflow-auto">
            {loading && <p className="px-4 py-6 text-sm text-gray-500">Loading tickets...</p>}
            {!loading && tickets.length === 0 && <p className="px-4 py-6 text-sm text-gray-500">No tickets found.</p>}
            {!loading &&
              tickets.map((ticket) => {
                const ticketId = ticket._id || ticket.id || ''
                return (
                  <button
                    key={ticketId}
                    onClick={() => setSelectedTicketId(ticketId)}
                    className={`w-full border-b border-gray-100 px-4 py-3 text-left transition hover:bg-gray-50 dark:border-gray-900 dark:hover:bg-gray-900 ${
                      selectedTicketId === ticketId ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                    }`}
                  >
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{ticket.categoryTitle || 'General'}</p>
                    <p className="line-clamp-2 text-xs text-gray-500">{ticket.problem || '-'}</p>
                    <p className="mt-1 text-xs capitalize text-blue-600 dark:text-blue-400">{ticket.status || 'open'}</p>
                  </button>
                )
              })}
          </div>
        </div>

        <div className="lg:col-span-2 rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950">
          {!selectedTicket && <p className="px-4 py-6 text-sm text-gray-500">Select a ticket to view details.</p>}
          {selectedTicket && (
            <div className="space-y-4 p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {selectedTicket.categoryTitle || 'Support'} • {selectedTicket.subCategoryTitle || 'General'}
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">User: {selectedTicket.userId || 'N/A'}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={assignToMe}
                    className="rounded bg-blue-600 px-3 py-2 text-xs font-medium text-white hover:bg-blue-700"
                  >
                    Assign to Me
                  </button>
                  <button
                    onClick={closeTicket}
                    className="rounded bg-green-600 px-3 py-2 text-xs font-medium text-white hover:bg-green-700"
                  >
                    Close Ticket
                  </button>
                </div>
              </div>

              <div className="rounded-lg bg-gray-50 p-3 text-sm dark:bg-gray-900">{selectedTicket.problem}</div>

              <div className="max-h-[320px] space-y-2 overflow-auto rounded-lg border border-gray-200 p-3 dark:border-gray-800">
                {messages.length === 0 && <p className="text-sm text-gray-500">No messages yet.</p>}
                {messages.map((message) => (
                  <div
                    key={message._id || message.id}
                    className={`rounded-lg px-3 py-2 text-sm ${
                      (message.senderType || '').toLowerCase() === 'employee'
                        ? 'ml-10 bg-blue-50 text-blue-900 dark:bg-blue-900/20 dark:text-blue-100'
                        : 'mr-10 bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-gray-100'
                    }`}
                  >
                    <p>{message.message}</p>
                    <p className="mt-1 text-xs text-gray-500">{new Date(message.timestamp || message.createdAt || '').toLocaleString()}</p>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <input
                  value={messageInput}
                  onChange={(event) => setMessageInput(event.target.value)}
                  placeholder="Type a response..."
                  className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-900"
                />
                <button
                  onClick={sendMessage}
                  disabled={sending || !messageInput.trim()}
                  className="inline-flex items-center gap-1 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                >
                  <Send size={14} />
                  Send
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

