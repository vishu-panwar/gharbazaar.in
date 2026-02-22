'use client'

import { useEffect, useMemo, useState } from 'react'
import { CheckCircle2, RefreshCw, Trash2, XCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import { backendApi } from '@/lib/backendApi'

type Listing = {
  id: string
  title: string
  city?: string
  price?: number
  status?: string
  propertyType?: string
  createdAt?: string
  seller?: {
    uid?: string
    name?: string
    email?: string
  }
}

const formatCurrency = (value?: number) => {
  const amount = Number(value || 0)
  return `Rs ${amount.toLocaleString('en-IN')}`
}

export default function ListingManagementPage() {
  const [listings, setListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('all')
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  const loadListings = async () => {
    try {
      setLoading(true)
      const response = await backendApi.admin.getAllProperties()
      if (!response?.success) {
        throw new Error(response?.error || 'Failed to load listings')
      }
      setListings(response?.data?.properties || [])
    } catch (error: any) {
      toast.error(error?.message || 'Failed to load listings')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadListings()
  }, [])

  const filteredListings = useMemo(() => {
    if (statusFilter === 'all') return listings
    return listings.filter((listing) => (listing.status || '').toLowerCase() === statusFilter)
  }, [listings, statusFilter])

  const stats = useMemo(() => {
    const counts = {
      total: listings.length,
      pending: 0,
      active: 0,
      rejected: 0,
    }
    for (const listing of listings) {
      const status = (listing.status || '').toLowerCase()
      if (status === 'pending') counts.pending += 1
      if (status === 'active') counts.active += 1
      if (status === 'rejected') counts.rejected += 1
    }
    return counts
  }, [listings])

  const updateStatus = async (id: string, status: string) => {
    try {
      setUpdatingId(id)
      const response = await backendApi.admin.updatePropertyStatus(id, status)
      if (!response?.success) {
        throw new Error(response?.error || 'Status update failed')
      }
      toast.success(`Listing marked as ${status}`)
      await loadListings()
    } catch (error: any) {
      toast.error(error?.message || 'Failed to update listing')
    } finally {
      setUpdatingId(null)
    }
  }

  const deleteListing = async (id: string) => {
    try {
      setUpdatingId(id)
      const response = await backendApi.admin.deleteProperty(id)
      if (!response?.success) {
        throw new Error(response?.error || 'Delete failed')
      }
      toast.success('Listing deleted')
      await loadListings()
    } catch (error: any) {
      toast.error(error?.message || 'Failed to delete listing')
    } finally {
      setUpdatingId(null)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Listings</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">Admin moderation for seller listings</p>
        </div>
        <button
          onClick={loadListings}
          className="inline-flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-950">
          <p className="text-xs text-gray-500">Total</p>
          <p className="text-2xl font-semibold">{stats.total}</p>
        </div>
        <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-900/40 dark:bg-yellow-900/20">
          <p className="text-xs text-yellow-700 dark:text-yellow-400">Pending</p>
          <p className="text-2xl font-semibold">{stats.pending}</p>
        </div>
        <div className="rounded-xl border border-green-200 bg-green-50 p-4 dark:border-green-900/40 dark:bg-green-900/20">
          <p className="text-xs text-green-700 dark:text-green-400">Active</p>
          <p className="text-2xl font-semibold">{stats.active}</p>
        </div>
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-900/40 dark:bg-red-900/20">
          <p className="text-xs text-red-700 dark:text-red-400">Rejected</p>
          <p className="text-2xl font-semibold">{stats.rejected}</p>
        </div>
      </div>

      <div className="flex gap-2">
        {['all', 'pending', 'active', 'rejected'].map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`rounded-lg px-4 py-2 text-sm font-medium capitalize ${
              statusFilter === status
                ? 'bg-purple-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700'
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
              <th className="px-4 py-3 text-left font-semibold">Listing</th>
              <th className="px-4 py-3 text-left font-semibold">Seller</th>
              <th className="px-4 py-3 text-left font-semibold">Price</th>
              <th className="px-4 py-3 text-left font-semibold">Status</th>
              <th className="px-4 py-3 text-left font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td className="px-4 py-6 text-gray-500" colSpan={5}>
                  Loading listings...
                </td>
              </tr>
            )}
            {!loading && filteredListings.length === 0 && (
              <tr>
                <td className="px-4 py-6 text-gray-500" colSpan={5}>
                  No listings found.
                </td>
              </tr>
            )}
            {!loading &&
              filteredListings.map((listing) => (
                <tr key={listing.id} className="border-b border-gray-100 dark:border-gray-900">
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-900 dark:text-gray-100">{listing.title}</p>
                    <p className="text-xs text-gray-500">
                      {listing.propertyType || 'property'} • {listing.city || 'N/A'}
                    </p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium">{listing.seller?.name || 'Unknown'}</p>
                    <p className="text-xs text-gray-500">{listing.seller?.uid || 'N/A'}</p>
                  </td>
                  <td className="px-4 py-3">{formatCurrency(Number(listing.price || 0))}</td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-gray-100 px-2 py-1 text-xs capitalize dark:bg-gray-800">
                      {listing.status || 'unknown'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => updateStatus(listing.id, 'active')}
                        disabled={updatingId === listing.id}
                        className="inline-flex items-center gap-1 rounded bg-green-600 px-2 py-1 text-xs font-medium text-white hover:bg-green-700 disabled:opacity-50"
                      >
                        <CheckCircle2 size={14} />
                        Approve
                      </button>
                      <button
                        onClick={() => updateStatus(listing.id, 'rejected')}
                        disabled={updatingId === listing.id}
                        className="inline-flex items-center gap-1 rounded bg-red-600 px-2 py-1 text-xs font-medium text-white hover:bg-red-700 disabled:opacity-50"
                      >
                        <XCircle size={14} />
                        Reject
                      </button>
                      <button
                        onClick={() => deleteListing(listing.id)}
                        disabled={updatingId === listing.id}
                        className="inline-flex items-center gap-1 rounded bg-gray-800 px-2 py-1 text-xs font-medium text-white hover:bg-black disabled:opacity-50"
                      >
                        <Trash2 size={14} />
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

