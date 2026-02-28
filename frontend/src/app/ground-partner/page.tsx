'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { CheckSquare, DollarSign, MapPin, RefreshCw, Ticket } from 'lucide-react'
import toast from 'react-hot-toast'
import { backendApi } from '@/lib/backendApi'

type PartnerCase = {
  id: string
  title?: string
  type?: string
  status?: string
  amount?: number | string | null
  dueDate?: string
  createdAt?: string
  property?: { title?: string; location?: string }
}

type PartnerVisit = {
  id: string
  status?: string
  scheduledAt?: string
  createdAt?: string
  property?: { title?: string; location?: string; price?: number | string | null }
}

type Payout = {
  id: string
  amount?: number | string | null
  status?: string
  createdAt?: string
}

type TicketItem = {
  _id: string
  status?: string
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

export default function GroundPartnerDashboardPage() {
  const [loading, setLoading] = useState(true)
  const [cases, setCases] = useState<PartnerCase[]>([])
  const [visits, setVisits] = useState<PartnerVisit[]>([])
  const [payouts, setPayouts] = useState<Payout[]>([])
  const [tickets, setTickets] = useState<TicketItem[]>([])
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

  const loadDashboard = async () => {
    try {
      setLoading(true)
      const [caseResponse, visitResponse, payoutResponse, ticketResponse] = await Promise.all([
        backendApi.partners.getCases({ type: 'ground' }),
        backendApi.visits.getPartner(),
        backendApi.partners.getPayouts(),
        backendApi.tickets.getUserTickets(),
      ])

      if (!caseResponse?.success) {
        throw new Error(caseResponse?.message || caseResponse?.error || 'Failed to load tasks')
      }
      if (!visitResponse?.success) {
        throw new Error(visitResponse?.message || visitResponse?.error || 'Failed to load visits')
      }
      if (!payoutResponse?.success) {
        throw new Error(payoutResponse?.message || payoutResponse?.error || 'Failed to load payouts')
      }
      if (!ticketResponse?.success) {
        throw new Error(ticketResponse?.message || ticketResponse?.error || 'Failed to load tickets')
      }

      setCases(Array.isArray(caseResponse?.data) ? caseResponse.data : [])
      setVisits(Array.isArray(visitResponse?.data) ? visitResponse.data : [])
      setPayouts(Array.isArray(payoutResponse?.data) ? payoutResponse.data : [])
      setTickets(Array.isArray(ticketResponse?.data?.tickets) ? ticketResponse.data.tickets : [])
    } catch (error: any) {
      toast.error(error?.message || 'Failed to load dashboard')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadDashboard()
  }, [])

  const stats = useMemo(() => {
    const now = new Date()
    const month = now.getMonth()
    const year = now.getFullYear()

    let paidThisMonth = 0
    let pendingPayout = 0
    for (const payout of payouts) {
      const amount = toNumber(payout.amount)
      const status = normalize(payout.status)
      const created = new Date(payout.createdAt || 0)

      if (status === 'paid' && created.getMonth() === month && created.getFullYear() === year) {
        paidThisMonth += amount
      }
      if (status === 'pending' || status === 'processing') {
        pendingPayout += amount
      }
    }

    return {
      totalTasks: cases.length,
      activeTasks: cases.filter((row) => ['open', 'in_progress'].includes(normalize(row.status))).length,
      totalVisits: visits.length,
      scheduledVisits: visits.filter((row) => ['scheduled', 'pending', 'in_progress'].includes(normalize(row.status))).length,
      paidThisMonth,
      pendingPayout,
      openTickets: tickets.filter((row) => ['open', 'assigned'].includes(normalize(row.status))).length,
    }
  }, [cases, payouts, tickets, visits])

  const latestTasks = useMemo(
    () => [...cases].sort((a, b) => +new Date(b.createdAt || 0) - +new Date(a.createdAt || 0)).slice(0, 6),
    [cases]
  )

  const latestVisits = useMemo(
    () => [...visits].sort((a, b) => +new Date(b.scheduledAt || b.createdAt || 0) - +new Date(a.scheduledAt || a.createdAt || 0)).slice(0, 6),
    [visits]
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-3">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Ground Partner Dashboard</h1>
            <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-full text-sm font-bold border border-blue-200 dark:border-blue-800">
              {profile?.uniqueId ? `GBPR-${profile.uniqueId.slice(-6).toUpperCase()}` : 'GBPR-PARTNER'}
            </span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Real workflow data for tasks, visits, support, and payouts
          </p>
        </div>
        <button
          onClick={loadDashboard}
          className="inline-flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-7">
        <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-950">
          <p className="text-xs text-gray-500">Total Tasks</p>
          <p className="text-xl font-semibold">{stats.totalTasks}</p>
        </div>
        <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 dark:border-blue-900/30 dark:bg-blue-900/20">
          <p className="text-xs text-blue-700 dark:text-blue-400">Active Tasks</p>
          <p className="text-xl font-semibold">{stats.activeTasks}</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-950">
          <p className="text-xs text-gray-500">Total Visits</p>
          <p className="text-xl font-semibold">{stats.totalVisits}</p>
        </div>
        <div className="rounded-xl border border-indigo-200 bg-indigo-50 p-4 dark:border-indigo-900/30 dark:bg-indigo-900/20">
          <p className="text-xs text-indigo-700 dark:text-indigo-400">Scheduled Visits</p>
          <p className="text-xl font-semibold">{stats.scheduledVisits}</p>
        </div>
        <div className="rounded-xl border border-green-200 bg-green-50 p-4 dark:border-green-900/30 dark:bg-green-900/20">
          <p className="text-xs text-green-700 dark:text-green-400">Paid This Month</p>
          <p className="text-xl font-semibold">{formatCurrency(stats.paidThisMonth)}</p>
        </div>
        <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-900/30 dark:bg-yellow-900/20">
          <p className="text-xs text-yellow-700 dark:text-yellow-400">Pending Payout</p>
          <p className="text-xl font-semibold">{formatCurrency(stats.pendingPayout)}</p>
        </div>
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-900/30 dark:bg-red-900/20">
          <p className="text-xs text-red-700 dark:text-red-400">Open Tickets</p>
          <p className="text-xl font-semibold">{stats.openTickets}</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-950">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Recent Tasks</h2>
            <Link href="/ground-partner/tasks" className="text-xs text-blue-600 hover:underline dark:text-blue-400">
              View all
            </Link>
          </div>
          {loading && <p className="text-sm text-gray-500">Loading tasks...</p>}
          {!loading && latestTasks.length === 0 && <p className="text-sm text-gray-500">No tasks assigned yet.</p>}
          <div className="space-y-2">
            {latestTasks.map((row) => (
              <div key={row.id} className="rounded-lg bg-gray-50 p-3 text-sm dark:bg-gray-900">
                <div className="flex items-start justify-between gap-2">
                  <p className="font-medium text-gray-900 dark:text-gray-100">{row.title || row.property?.title || 'Task'}</p>
                  <span className="rounded-full bg-gray-200 px-2 py-1 text-xs capitalize dark:bg-gray-800">
                    {normalize(row.status) || 'open'}
                  </span>
                </div>
                <p className="mt-1 text-xs text-gray-500">Due: {formatDate(row.dueDate)}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-950">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Recent Visits</h2>
            <Link href="/ground-partner/visits" className="text-xs text-blue-600 hover:underline dark:text-blue-400">
              View all
            </Link>
          </div>
          {loading && <p className="text-sm text-gray-500">Loading visits...</p>}
          {!loading && latestVisits.length === 0 && <p className="text-sm text-gray-500">No partner visits found.</p>}
          <div className="space-y-2">
            {latestVisits.map((row) => (
              <div key={row.id} className="rounded-lg bg-gray-50 p-3 text-sm dark:bg-gray-900">
                <div className="flex items-start justify-between gap-2">
                  <p className="font-medium text-gray-900 dark:text-gray-100">{row.property?.title || 'Site visit'}</p>
                  <span className="rounded-full bg-gray-200 px-2 py-1 text-xs capitalize dark:bg-gray-800">
                    {normalize(row.status) || 'pending'}
                  </span>
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  {row.property?.location || '-'} | {formatDate(row.scheduledAt || row.createdAt)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Link href="/ground-partner/tasks" className="rounded-xl border border-gray-200 bg-white p-4 hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-950 dark:hover:bg-gray-900">
          <div className="mb-1 flex items-center gap-2 text-sm font-medium text-gray-900 dark:text-gray-100">
            <CheckSquare size={16} /> Task Queue
          </div>
          <p className="text-xs text-gray-500">Manage status updates on assigned ground cases.</p>
        </Link>
        <Link href="/ground-partner/visits" className="rounded-xl border border-gray-200 bg-white p-4 hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-950 dark:hover:bg-gray-900">
          <div className="mb-1 flex items-center gap-2 text-sm font-medium text-gray-900 dark:text-gray-100">
            <MapPin size={16} /> Site Visits
          </div>
          <p className="text-xs text-gray-500">Schedule and complete partner-assigned visits.</p>
        </Link>
        <Link href="/ground-partner/earnings" className="rounded-xl border border-gray-200 bg-white p-4 hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-950 dark:hover:bg-gray-900">
          <div className="mb-1 flex items-center gap-2 text-sm font-medium text-gray-900 dark:text-gray-100">
            <DollarSign size={16} /> Earnings
          </div>
          <p className="text-xs text-gray-500">Track payout records controlled by admin.</p>
        </Link>
        <Link href="/ground-partner/support" className="rounded-xl border border-gray-200 bg-white p-4 hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-950 dark:hover:bg-gray-900">
          <div className="mb-1 flex items-center gap-2 text-sm font-medium text-gray-900 dark:text-gray-100">
            <Ticket size={16} /> Support
          </div>
          <p className="text-xs text-gray-500">Open tickets handled by employee/admin team.</p>
        </Link>
      </div>
    </div>
  )
}
