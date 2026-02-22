'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { FileCheck2, Home, RefreshCw, Ticket, Users } from 'lucide-react'
import toast from 'react-hot-toast'
import { backendApi } from '@/lib/backendApi'

type EmployeeStats = {
  activeTickets: number
  resolvedToday: number
  averageResponseTime: number
  totalAssigned: number
}

type KycRequest = {
  id: string
  fullName?: string
  status?: string
  createdAt?: string
  user?: { uid?: string; name?: string; email?: string; role?: string } | null
}

type Property = {
  id: string
  title?: string
  city?: string
  status?: string
  createdAt?: string
  seller?: { uid?: string; name?: string } | null
}

type Lead = {
  id: string
  leadName?: string
  leadContact?: string
  status?: string
  createdAt?: string
  promoter?: { uid?: string; name?: string } | null
}

export default function EmployeeDashboardPage() {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<EmployeeStats>({
    activeTickets: 0,
    resolvedToday: 0,
    averageResponseTime: 0,
    totalAssigned: 0,
  })
  const [pendingKyc, setPendingKyc] = useState<KycRequest[]>([])
  const [pendingProperties, setPendingProperties] = useState<Property[]>([])
  const [leads, setLeads] = useState<Lead[]>([])

  const loadDashboard = async () => {
    try {
      setLoading(true)

      const [statsResponse, kycResponse, propertiesResponse, leadsResponse] = await Promise.all([
        backendApi.employee.getStats(),
        backendApi.kyc.getRequests('pending'),
        backendApi.employee.getPendingProperties(),
        backendApi.employee.getLeads('all'),
      ])

      if (statsResponse?.success) {
        setStats(statsResponse?.data?.stats || stats)
      }

      if (kycResponse?.success) {
        setPendingKyc((kycResponse?.data || []).slice(0, 8))
      }

      if (propertiesResponse?.success) {
        setPendingProperties((propertiesResponse?.data?.properties || []).slice(0, 8))
      }

      if (leadsResponse?.success) {
        setLeads((leadsResponse?.data?.leads || []).slice(0, 8))
      }
    } catch (error: any) {
      toast.error(error?.message || 'Failed to load dashboard')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadDashboard()
  }, [])

  const quickStats = useMemo(
    () => [
      { label: 'Pending KYC', value: pendingKyc.length, href: '/employee/kyc', icon: FileCheck2 },
      { label: 'Pending Properties', value: pendingProperties.length, href: '/employee/verification', icon: Home },
      { label: 'Open Tickets', value: stats.activeTickets, href: '/employee/support', icon: Ticket },
      { label: 'Referral Leads', value: leads.length, href: '/employee/leads', icon: Users },
    ],
    [pendingKyc.length, pendingProperties.length, stats.activeTickets, leads.length]
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Employee Dashboard</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Moderation, support, and referral operations overview
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

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {quickStats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="rounded-xl border border-gray-200 bg-white p-4 transition hover:shadow dark:border-gray-800 dark:bg-gray-950"
          >
            <div className="mb-2 inline-flex rounded-lg bg-blue-50 p-2 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
              <stat.icon size={18} />
            </div>
            <p className="text-xs text-gray-500">{stat.label}</p>
            <p className="text-2xl font-semibold">{stat.value}</p>
          </Link>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-950">
          <h2 className="mb-3 text-sm font-semibold text-gray-900 dark:text-gray-100">Pending KYC</h2>
          {loading && <p className="text-sm text-gray-500">Loading...</p>}
          {!loading && pendingKyc.length === 0 && <p className="text-sm text-gray-500">No pending KYC requests.</p>}
          {!loading && pendingKyc.length > 0 && (
            <div className="space-y-2">
              {pendingKyc.slice(0, 5).map((request) => (
                <div key={request.id} className="rounded-lg bg-gray-50 p-3 text-sm dark:bg-gray-900">
                  <p className="font-medium">{request.fullName || request.user?.name || 'Unknown User'}</p>
                  <p className="text-xs text-gray-500">{request.user?.uid || request.user?.email || '-'}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-950">
          <h2 className="mb-3 text-sm font-semibold text-gray-900 dark:text-gray-100">Pending Property Verification</h2>
          {loading && <p className="text-sm text-gray-500">Loading...</p>}
          {!loading && pendingProperties.length === 0 && <p className="text-sm text-gray-500">No pending properties.</p>}
          {!loading && pendingProperties.length > 0 && (
            <div className="space-y-2">
              {pendingProperties.slice(0, 5).map((property) => (
                <div key={property.id} className="rounded-lg bg-gray-50 p-3 text-sm dark:bg-gray-900">
                  <p className="font-medium">{property.title || 'Untitled Property'}</p>
                  <p className="text-xs text-gray-500">
                    {property.city || 'N/A'} • Seller: {property.seller?.name || property.seller?.uid || '-'}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-950">
          <h2 className="mb-3 text-sm font-semibold text-gray-900 dark:text-gray-100">Ticket Operations</h2>
          <div className="space-y-2 text-sm">
            <div className="rounded-lg bg-gray-50 p-3 dark:bg-gray-900">
              <p className="text-xs text-gray-500">Active Tickets</p>
              <p className="text-xl font-semibold">{stats.activeTickets}</p>
            </div>
            <div className="rounded-lg bg-gray-50 p-3 dark:bg-gray-900">
              <p className="text-xs text-gray-500">Resolved Today</p>
              <p className="text-xl font-semibold">{stats.resolvedToday}</p>
            </div>
            <div className="rounded-lg bg-gray-50 p-3 dark:bg-gray-900">
              <p className="text-xs text-gray-500">Total Assigned</p>
              <p className="text-xl font-semibold">{stats.totalAssigned}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

