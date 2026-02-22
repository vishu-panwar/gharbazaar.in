'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Search,
  Home,
  Building2,
  SlidersHorizontal,
  X,
  Sparkles,
  Map,
  List,
} from 'lucide-react'
import PropertyCard, { Property } from '@/components/PropertyCard'
import { useFavorites } from '@/contexts/FavoritesContext'

export default function BrowsePropertiesPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    propertyType: 'all',
    listingType: 'all', // Added for Sale/Rent filter
    priceRange: 'all',
    bedrooms: 'all',
    location: '',
    sortBy: 'newest'
  })

  const [properties, setProperties] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch properties from backend
  useEffect(() => {
    let cancelled = false
    const handler = setTimeout(() => {
      async function fetchProperties() {
        try {
          setLoading(true)
          setError(null)
          const { backendApi } = await import('@/lib/backendApi')

          // Build query from filters
          const query: any = {
            limit: 20,
            status: 'active'
          }

          if (filters.listingType !== 'all') query.listingType = filters.listingType
          if (filters.propertyType !== 'all') query.propertyType = filters.propertyType
          if (filters.location) query.location = filters.location

          const response = await backendApi.properties.search(query)
          const fetchedProperties =
            response?.properties ||
            response?.data?.properties ||
            response?.data ||
            []

          if (cancelled) return

          setProperties(Array.isArray(fetchedProperties) ? fetchedProperties : [])
        } catch (err: any) {
          if (cancelled) return
          console.error('Fetch properties error:', err)
          setError(err.message || 'Failed to load properties')
          setProperties([])
        } finally {
          if (!cancelled) setLoading(false)
        }
      }

      fetchProperties()
    }, 350) // debounce 350ms

    return () => {
      cancelled = true
      clearTimeout(handler)
    }
  }, [filters.listingType, filters.propertyType, filters.sortBy, filters.location]) // Re-fetch on filter changes

  const filteredProperties = [...properties]
    .filter((property) => {
      const price = Number(property.price || 0)
      if (filters.priceRange === '0-50' && price > 5000000) return false
      if (filters.priceRange === '50-100' && (price < 5000000 || price > 10000000)) return false
      if (filters.priceRange === '100-500' && (price < 10000000 || price > 50000000)) return false
      if (filters.priceRange === '500+' && price < 50000000) return false

      const bedrooms = Number(property.bedrooms || 0)
      if (filters.bedrooms !== 'all' && bedrooms < Number(filters.bedrooms)) return false
      return true
    })
    .sort((a, b) => {
      if (filters.sortBy === 'price-low') return Number(a.price || 0) - Number(b.price || 0)
      if (filters.sortBy === 'price-high') return Number(b.price || 0) - Number(a.price || 0)
      if (filters.sortBy === 'popular') return Number(b.views || 0) - Number(a.views || 0)
      return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
    })
  const { toggleFavorite, isFavorite } = useFavorites()

  const handleToggleFavorite = (id: string | number) => {
    const property = properties.find(p => (p._id || p.id) === id)
    if (property) {
      // Convert to the format expected by FavoritesContext
      toggleFavorite(property as Property)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white flex items-center">
            <Sparkles className="mr-3 text-blue-500" size={28} />
            Browse Properties
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Discover your dream property from {properties.length} listings
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg transition-all ${viewMode === 'grid'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
              }`}
          >
            <Building2 size={20} />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-lg transition-all ${viewMode === 'list'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
              }`}
          >
            <List size={20} />
          </button>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by location, property name..."
              className="w-full pl-12 pr-12 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={filters.location}
              onChange={(e) => setFilters({ ...filters, location: e.target.value })}
            />

            {filters.location && (
              <button
                aria-label="Clear search"
                onClick={() => setFilters({ ...filters, location: '' })}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                <X size={18} />
              </button>
            )}
          </div>

          {/* Quick Filters */}
          <div className="flex gap-2 overflow-x-auto">
            <select
              className="px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500"
              value={filters.listingType}
              onChange={(e) => setFilters({ ...filters, listingType: e.target.value })}
            >
              <option value="all">Sale & Rent</option>
              <option value="sale">For Sale</option>
              <option value="rent">For Rent</option>
            </select>

            <select
              className="px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500"
              value={filters.propertyType}
              onChange={(e) => setFilters({ ...filters, propertyType: e.target.value })}
            >
              <option value="all">All Types</option>
              <option value="apartment">Apartment</option>
              <option value="villa">Villa</option>
              <option value="house">House</option>
            </select>

            <select
              className="px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500"
              value={filters.priceRange}
              onChange={(e) => setFilters({ ...filters, priceRange: e.target.value })}
            >
              <option value="all">All Prices</option>
              <option value="0-50">Under ₹50L</option>
              <option value="50-100">₹50L - ₹1Cr</option>
              <option value="100-500">₹1Cr - ₹5Cr</option>
              <option value="500+">Above ₹5Cr</option>
            </select>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all"
            >
              <SlidersHorizontal size={20} />
              <span className="hidden sm:inline">More Filters</span>
            </button>
          </div>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Bedrooms
                </label>
                <select
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg"
                  value={filters.bedrooms}
                  onChange={(e) => setFilters({ ...filters, bedrooms: e.target.value })}
                >
                  <option value="all">Any</option>
                  <option value="1">1+</option>
                  <option value="2">2+</option>
                  <option value="3">3+</option>
                  <option value="4">4+</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Sort By
                </label>
                <select
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg"
                  value={filters.sortBy}
                  onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
                >
                  <option value="newest">Newest First</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="popular">Most Popular</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-gray-600 dark:text-gray-400">
          Showing <span className="font-semibold text-gray-900 dark:text-white">{filteredProperties.length}</span> properties
        </p>
        <Link
          href="/dashboard/map"
          className="text-blue-600 hover:text-blue-700 font-medium flex items-center space-x-1 transition-colors"
        >
          <Map size={18} />
          <span>Map View</span>
        </Link>
      </div>

      {/* Properties Grid/List */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400 font-medium">Fetching properties...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-8 text-center text-red-600 dark:text-red-400">
          <p>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all"
          >
            Retry
          </button>
        </div>
      ) : properties.length === 0 ? (
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 p-20 text-center">
          <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
            <Home className="text-gray-400" size={40} />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">No properties found</h3>
          <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
            Try adjusting your filters or search criteria to find what you're looking for.
          </p>
        </div>
      ) : (
        <div className={viewMode === 'grid'
          ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'
          : 'space-y-6'
        }>
          {filteredProperties.map((property) => (
            <PropertyCard
              key={property._id || property.id}
              property={{
                id: property.id as number | undefined,
                _id: property._id as string | undefined,
                title: (property.title || 'Untitled Property') as string,
                location: (property.location || 'Location not specified') as string,
                price: property.price ? `₹${property.price.toLocaleString()}` : 'Price not set',
                type: (property.propertyType || property.type || 'Property') as string,
                beds: (property.bedrooms || property.beds || 0) as number,
                baths: (property.bathrooms || property.baths || 0) as number,
                area: (property.area || property.size || 'N/A') as string,
                image: (property.images?.[0] || property.photos?.[0] || '/images/property1.jpg') as string,
                featured: !!property.featured,
                verified: !!property.verified,
                views: (property.views || 0) as number,
                rating: (property.rating || 4.5) as number,
                priceValue: (property.price || 0) as number,
                listingType: (property.listingType || 'sale') as string,
                isFavorite: !!isFavorite(property._id || property.id)
              }}
              onToggleFavorite={handleToggleFavorite}
              viewMode={viewMode}
            />
          ))}
        </div>
      )}

      {/* Load More */}
      <div className="flex justify-center pt-6">
        <button className="bg-white dark:bg-gray-900 border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-8 py-3 rounded-lg font-semibold transition-all">
          Load More Properties
        </button>
      </div>
    </div>
  )
}
