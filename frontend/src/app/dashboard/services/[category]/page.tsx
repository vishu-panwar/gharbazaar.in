'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, CheckCircle, MapPin, Phone, Search, Star } from 'lucide-react'
import { backendApi } from '@/lib/backendApi'
import toast from 'react-hot-toast'

type ProviderRecord = {
  id: string
  category?: string
  specialization?: string
  rating?: number
  reviews?: number
  hourlyRate?: number
  location?: string
  completedProjects?: number
  available?: boolean
  verified?: boolean
  user?: {
    name?: string
    phone?: string
  }
}

const normalize = (value: string) => value.toLowerCase().replace(/[\s_-]/g, '')

export default function ServiceCategoryPage() {
  const params = useParams()
  const router = useRouter()
  const category = String(params.category || '')

  const [providers, setProviders] = useState<ProviderRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<'rating' | 'price-low' | 'price-high'>('rating')

  useEffect(() => {
    let mounted = true

    const loadProviders = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await backendApi.serviceProvider.list({ category, verified: true })
        let records: ProviderRecord[] = response?.providers || []

        if (!Array.isArray(records) || records.length === 0) {
          const fallback = await backendApi.serviceProvider.list({ verified: true })
          records = (fallback?.providers || []).filter((provider: ProviderRecord) =>
            normalize(provider.category || '').includes(normalize(category)) ||
            normalize(category).includes(normalize(provider.category || ''))
          )
        }

        if (mounted) {
          setProviders(records)
        }
      } catch (err: any) {
        if (!mounted) return
        setError(err?.message || 'Failed to load providers')
        setProviders([])
      } finally {
        if (mounted) setLoading(false)
      }
    }

    loadProviders()
    return () => {
      mounted = false
    }
  }, [category])

  const categoryName = useMemo(
    () =>
      category
        .split('-')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' '),
    [category]
  )

  const filteredProviders = useMemo(() => {
    const bySearch = providers.filter((provider) => {
      const name = provider.user?.name || ''
      const specialization = provider.specialization || ''
      const location = provider.location || ''
      const q = searchQuery.toLowerCase()
      return (
        name.toLowerCase().includes(q) ||
        specialization.toLowerCase().includes(q) ||
        location.toLowerCase().includes(q)
      )
    })

    return bySearch.sort((a, b) => {
      if (sortBy === 'price-low') return Number(a.hourlyRate || 0) - Number(b.hourlyRate || 0)
      if (sortBy === 'price-high') return Number(b.hourlyRate || 0) - Number(a.hourlyRate || 0)
      return Number(b.rating || 0) - Number(a.rating || 0)
    })
  }, [providers, searchQuery, sortBy])

  const handleCall = (phone?: string) => {
    if (!phone) {
      toast.error('Phone number not available')
      return
    }
    window.location.href = `tel:${phone}`
  }

  return (
    <div className="space-y-6">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
      >
        <ArrowLeft size={18} />
        <span>Back to Services</span>
      </button>

      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl p-6 text-white">
        <h1 className="text-2xl font-bold">{categoryName}</h1>
        <p className="text-white/90 mt-1">{filteredProviders.length} verified professionals</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="sm:col-span-2 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search by name, specialization, or location"
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg"
          />
        </div>

        <select
          value={sortBy}
          onChange={(event) => setSortBy(event.target.value as 'rating' | 'price-low' | 'price-high')}
          className="px-3 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg"
        >
          <option value="rating">Highest Rated</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
        </select>
      </div>

      {loading ? (
        <div className="flex items-center justify-center min-h-64">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : error ? (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 text-red-700 dark:text-red-300">
          {error}
        </div>
      ) : filteredProviders.length === 0 ? (
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-10 text-center text-gray-600 dark:text-gray-400">
          No providers found for this category.
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredProviders.map((provider) => (
            <div
              key={provider.id}
              className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {provider.user?.name || 'Service Provider'}
                    </h3>
                    {provider.verified && <CheckCircle size={16} className="text-blue-600" />}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{provider.specialization || provider.category || 'General Services'}</p>
                  <div className="mt-2 flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                    <span className="inline-flex items-center gap-1">
                      <Star size={14} className="text-yellow-500" />
                      {Number(provider.rating || 0).toFixed(1)} ({provider.reviews || 0})
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <MapPin size={14} />
                      {provider.location || 'Location not set'}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-lg font-bold text-gray-900 dark:text-white">Rs {Number(provider.hourlyRate || 0).toLocaleString()}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">per hour</div>
                  <div className={`mt-2 text-xs font-medium ${provider.available ? 'text-green-600' : 'text-amber-600'}`}>
                    {provider.available ? 'Available' : 'Unavailable'}
                  </div>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-2">
                <Link
                  href={`/dashboard/services/provider/${provider.id}`}
                  className="flex-1 text-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium"
                >
                  View Profile
                </Link>
                <button
                  onClick={() => handleCall(provider.user?.phone)}
                  className="px-3 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg"
                  title="Call"
                >
                  <Phone size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}


