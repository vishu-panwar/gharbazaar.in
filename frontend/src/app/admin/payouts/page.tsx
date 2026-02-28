'use client'

import { useEffect, useMemo, useState } from 'react'
import {
  CheckCircle,
  DollarSign,
  Plus,
  RefreshCw,
  Search,
  X,
} from 'lucide-react'
import toast from 'react-hot-toast'
import { backendApi } from '@/lib/backendApi'

type Partner = {
  id: string
  uid: string
  name?: string
  email?: string
  role?: string
}

type Payout = {
  id: string
  partnerId: string
  amount: number
  method?: string
  status?: string
  reference?: string
  notes?: string
  createdAt?: string
  partner?: Partner | null
}

const METHODS = ['bank_transfer', 'upi', 'cheque', 'cash', 'wallet']
const STATUS_OPTIONS = ['pending', 'processing', 'paid', 'failed']

const currency = (value: number) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(value)

const statusBadge = (status?: string) => {
  const s = (status || 'pending').toLowerCase()
  if (s === 'paid') return 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
  if (s === 'processing') return 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400'
  if (s === 'failed') return 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400'
  return 'bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400'
}

const roleLabel = (role?: string) => {
  const map: Record<string, string> = {
    ground_partner: 'Ground',
    promoter_partner: 'Promoter',
    service_partner: 'Service',
    legal_partner: 'Legal',
  }
  return map[role || ''] || (role || 'Partner')
}

export default function AdminPayoutsPage() {
  const [payouts, setPayouts] = useState<Payout[]>([])
  const [partners, setPartners] = useState<Partner[]>([])
  const [loading, setLoading] = useState(true)
  const [actionId, setActionId] = useState<string | null>(null)
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [showCreate, setShowCreate] = useState(false)

  // Create form state
  const [form, setForm] = useState({
    partnerId: '',
    amount: '',
    method: 'bank_transfer',
    status: 'pending',
    reference: '',
    notes: '',
  })
  const [creating, setCreating] = useState(false)

  const loadData = async () => {
    try {
      setLoading(true)
      const [payoutResp, partnerResp] = await Promise.all([
        backendApi.adminPayouts.getAll(),
        backendApi.adminPayouts.getPartners(),
      ])
      if (payoutResp?.success) setPayouts(Array.isArray(payoutResp.data) ? payoutResp.data : [])
      if (partnerResp?.success) setPartners(Array.isArray(partnerResp.data) ? partnerResp.data : [])
    } catch (error: any) {
      toast.error(error?.message || 'Failed to load payouts')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadData() }, [])

  const filtered = useMemo(() => {
    return payouts.filter((p) => {
      const matchesStatus = statusFilter === 'all' || (p.status || 'pending').toLowerCase() === statusFilter
      if (!matchesStatus) return false
      if (!query) return true
      const haystack = [p.partner?.name, p.partner?.email, p.reference, p.notes, p.id]
        .filter(Boolean).join(' ').toLowerCase()
      return haystack.includes(query.toLowerCase())
    })
  }, [payouts, query, statusFilter])

  const totals = useMemo(() => {
    const total = payouts.reduce((s, p) => s + Number(p.amount || 0), 0)
    const paid = payouts.filter(p => (p.status || '').toLowerCase() === 'paid').reduce((s, p) => s + Number(p.amount || 0), 0)
    const pending = payouts.filter(p => ['pending', 'processing'].includes((p.status || '').toLowerCase())).reduce((s, p) => s + Number(p.amount || 0), 0)
    return { total, paid, pending }
  }, [payouts])

  const handleApprove = async (id: string) => {
    try {
      setActionId(id)
      const response = await backendApi.adminPayouts.approve(id, { status: 'paid' })
      if (!response?.success) throw new Error(response?.error || 'Failed to approve')
      toast.success('Payout marked as paid')
      await loadData()
    } catch (error: any) {
      toast.error(error?.message || 'Failed to approve payout')
    } finally {
      setActionId(null)
    }
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.partnerId || !form.amount || Number(form.amount) <= 0) {
      toast.error('Partner and a valid amount are required')
      return
    }
    try {
      setCreating(true)
      const response = await backendApi.adminPayouts.create({
        partnerId: form.partnerId,
        amount: Number(form.amount),
        method: form.method || undefined,
        status: form.status || 'pending',
        reference: form.reference || undefined,
        notes: form.notes || undefined,
      })
      if (!response?.success) throw new Error(response?.error || 'Failed to create payout')
      toast.success('Payout created successfully')
      setShowCreate(false)
      setForm({ partnerId: '', amount: '', method: 'bank_transfer', status: 'pending', reference: '', notes: '' })
      await loadData()
    } catch (error: any) {
      toast.error(error?.message || 'Failed to create payout')
    } finally {
      setCreating(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Partner Payouts</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">Create and manage partner commission payouts</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={loadData}
            className="inline-flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
          >
            <RefreshCw size={16} />
            Refresh
          </button>
          <button
            onClick={() => setShowCreate(true)}
            className="inline-flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700"
          >
            <Plus size={16} />
            Create Payout
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-950">
          <p className="text-xs text-gray-500">Total Dispatched</p>
          <p className="text-xl font-semibold text-gray-900 dark:text-white">{currency(totals.total)}</p>
        </div>
        <div className="rounded-xl border border-green-200 bg-green-50 p-4 dark:border-green-900/30 dark:bg-green-900/20">
          <p className="text-xs text-green-700 dark:text-green-400">Paid</p>
          <p className="text-xl font-semibold">{currency(totals.paid)}</p>
        </div>
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-900/30 dark:bg-amber-900/20">
          <p className="text-xs text-amber-700 dark:text-amber-400">Pending / Processing</p>
          <p className="text-xl font-semibold">{currency(totals.pending)}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-950 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by partner name, reference, or notes"
            className="w-full rounded-lg border border-gray-200 bg-white py-2 pl-9 pr-3 text-sm outline-none focus:border-purple-500 dark:border-gray-700 dark:bg-gray-900"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-purple-500 dark:border-gray-700 dark:bg-gray-900"
        >
          <option value="all">All statuses</option>
          {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {/* Payouts table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-sm">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-300">Partner</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-300">Role</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-300">Amount</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-300">Method</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-300">Status</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-300">Reference</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-300">Date</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td className="px-4 py-8 text-center text-gray-500" colSpan={8}>Loading payouts...</td>
                </tr>
              )}
              {!loading && filtered.length === 0 && (
                <tr>
                  <td className="px-4 py-8 text-center text-gray-500" colSpan={8}>No payouts found.</td>
                </tr>
              )}
              {!loading && filtered.map((payout) => (
                <tr key={payout.id} className="border-t border-gray-100 dark:border-gray-800">
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-900 dark:text-gray-100">{payout.partner?.name || 'Unknown'}</p>
                    <p className="text-xs text-gray-500">{payout.partner?.email || '-'}</p>
                  </td>
                  <td className="px-4 py-3 text-gray-700 dark:text-gray-300 capitalize">
                    {roleLabel(payout.partner?.role)}
                  </td>
                  <td className="px-4 py-3 font-semibold text-gray-900 dark:text-gray-100">
                    {currency(Number(payout.amount || 0))}
                  </td>
                  <td className="px-4 py-3 text-gray-700 dark:text-gray-300 uppercase text-xs">
                    {(payout.method || 'bank_transfer').replace('_', ' ')}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${statusBadge(payout.status)}`}>
                      {(payout.status || 'pending').toUpperCase()}
                    </span>
                  </td>
                  <td className="max-w-[160px] truncate px-4 py-3 text-gray-700 dark:text-gray-300" title={payout.reference || '-'}>
                    {payout.reference || '-'}
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-500">
                    {payout.createdAt ? new Date(payout.createdAt).toLocaleDateString('en-IN') : '-'}
                  </td>
                  <td className="px-4 py-3">
                    {['pending', 'processing'].includes((payout.status || '').toLowerCase()) && (
                      <button
                        onClick={() => handleApprove(payout.id)}
                        disabled={actionId === payout.id}
                        className="inline-flex items-center gap-1 rounded bg-green-600 px-2 py-1 text-xs font-medium text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        <CheckCircle size={12} />
                        {actionId === payout.id ? 'Marking...' : 'Mark Paid'}
                      </button>
                    )}
                    {(payout.status || '').toLowerCase() === 'paid' && (
                      <span className="text-xs text-green-600 dark:text-green-400">✓ Paid</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Payout Modal */}
      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl dark:bg-gray-950">
            <div className="mb-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <DollarSign size={20} className="text-purple-600" />
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Create Payout</h2>
              </div>
              <button onClick={() => setShowCreate(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Partner *</label>
                <select
                  value={form.partnerId}
                  onChange={(e) => setForm(prev => ({ ...prev, partnerId: e.target.value }))}
                  className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-purple-500 dark:border-gray-700 dark:bg-gray-900"
                  required
                >
                  <option value="">Select partner</option>
                  {partners.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name || p.email} — {roleLabel(p.role)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Amount (INR) *</label>
                <input
                  type="number"
                  min={1}
                  step={1}
                  value={form.amount}
                  onChange={(e) => setForm(prev => ({ ...prev, amount: e.target.value }))}
                  placeholder="e.g. 2500"
                  className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-purple-500 dark:border-gray-700 dark:bg-gray-900"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Method</label>
                  <select
                    value={form.method}
                    onChange={(e) => setForm(prev => ({ ...prev, method: e.target.value }))}
                    className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-purple-500 dark:border-gray-700 dark:bg-gray-900"
                  >
                    {METHODS.map(m => <option key={m} value={m}>{m.replace('_', ' ')}</option>)}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm(prev => ({ ...prev, status: e.target.value }))}
                    className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-purple-500 dark:border-gray-700 dark:bg-gray-900"
                  >
                    {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Reference / Transaction ID</label>
                <input
                  type="text"
                  value={form.reference}
                  onChange={(e) => setForm(prev => ({ ...prev, reference: e.target.value }))}
                  placeholder="UTR number or transaction ID"
                  className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-purple-500 dark:border-gray-700 dark:bg-gray-900"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Notes</label>
                <textarea
                  rows={2}
                  value={form.notes}
                  onChange={(e) => setForm(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Optional internal notes"
                  className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-purple-500 dark:border-gray-700 dark:bg-gray-900"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreate(false)}
                  className="flex-1 rounded-lg border border-gray-200 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="flex-1 rounded-lg bg-purple-600 py-2 text-sm font-medium text-white hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {creating ? 'Creating...' : 'Create Payout'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
