'use client'

import { useState, useEffect } from 'react'
import { listingsAPI } from '@/lib/api'
import Link from 'next/link'
import { MapPin, Home, Search } from 'lucide-react'

export default function ListingsPage() {
  const [listings, setListings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    type: '',
    category: '',
    minPrice: '',
    maxPrice: '',
    city: '',
  })

  useEffect(() => {
    fetchListings()
  }, [])

  const fetchListings = async () => {
    try {
      setLoading(true)
      const params: any = {}
      if (filters.type) params.type = filters.type
      if (filters.category) params.category = filters.category
      if (filters.minPrice) params.minPrice = filters.minPrice
      if (filters.maxPrice) params.maxPrice = filters.maxPrice
      if (filters.city) params.city = filters.city

      const response = await listingsAPI.search(params)
      setListings(response.data || response.properties || [])
    } catch (error) {
      console.error('Failed to fetch listings:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    fetchListings()
  }

  const formatPrice = (price: number, category: string) => {
    if (category === 'rent') {
      return `₹${price.toLocaleString('en-IN')}/month`
    }
    if (price >= 10000000) {
      return `₹${(price / 10000000).toFixed(2)} Cr`
    }
    if (price >= 100000) {
      return `₹${(price / 100000).toFixed(2)} Lac`
    }
    return `₹${price.toLocaleString('en-IN')}`
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Search Bar */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 py-4 sm:py-6">
        <div className="container mx-auto px-4">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
              <input
                type="text"
                placeholder="City"
                className="input"
                value={filters.city}
                onChange={(e) => setFilters({ ...filters, city: e.target.value })}
              />
              <select
                className="input"
                value={filters.type}
                onChange={(e) => setFilters({ ...filters, type: e.target.value })}
              >
                <option value="">All Types</option>
                <option value="plot">Plot</option>
                <option value="home">Home</option>
                <option value="agricultural">Agricultural</option>
                <option value="commercial">Commercial</option>
              </select>
              <select
                className="input"
                value={filters.category}
                onChange={(e) => setFilters({ ...filters, category: e.target.value })}
              >
                <option value="">Buy/Rent</option>
                <option value="sale">For Sale</option>
                <option value="rent">For Rent</option>
              </select>
              <input
                type="number"
                placeholder="Min Price"
                className="input"
                value={filters.minPrice}
                onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
              />
              <button type="submit" className="btn-primary flex items-center justify-center space-x-2 sm:col-span-1 col-span-full">
                <Search size={18} />
                <span>Search</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Listings Grid */}
      <div className="container mx-auto px-4 py-6 sm:py-8">
        <div className="mb-6">
          <h1 className="font-heading font-bold text-2xl sm:text-3xl mb-2">All Properties</h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
            {listings.length} properties found
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400">Loading properties...</p>
          </div>
        ) : listings.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400">No properties found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {listings.map((listing) => (
              <Link
                key={listing.id}
                href={`/listings/${listing.id}`}
                className="card group hover:shadow-lg transition-shadow"
              >
                <div className="aspect-video bg-gray-200 dark:bg-gray-800 rounded-lg mb-3 sm:mb-4 relative overflow-hidden">
                  {listing.isFeatured && (
                    <span className="absolute top-2 right-2 bg-accent-500 text-white text-xs px-2 py-1 rounded z-10">
                      Featured
                    </span>
                  )}
                  {listing.isVerified && (
                    <span className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded z-10">
                      Verified
                    </span>
                  )}
                  <div className="w-full h-full flex items-center justify-center">
                    <Home size={32} className="text-gray-400 sm:w-12 sm:h-12" />
                  </div>
                </div>
                <h3 className="font-heading font-bold text-base sm:text-lg mb-2 group-hover:text-primary-600 line-clamp-2">
                  {listing.title}
                </h3>
                <p className="text-lg sm:text-xl font-bold text-primary-600 mb-2">
                  {formatPrice(listing.price, listing.category)}
                </p>
                <div className="flex items-center text-gray-600 dark:text-gray-400 text-xs sm:text-sm mb-2">
                  <MapPin size={14} className="mr-1 flex-shrink-0" />
                  <span className="truncate">{listing.location.city}, {listing.location.state}</span>
                </div>
                {listing.propertySpecs && (
                  <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                    {listing.propertySpecs.bedrooms && `${listing.propertySpecs.bedrooms} BHK • `}
                    {listing.propertySpecs.area} {listing.propertySpecs.areaUnit}
                  </div>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
