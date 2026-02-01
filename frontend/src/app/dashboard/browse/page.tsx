'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Search,
  Filter,
  MapPin,
  Bed,
  Bath,
  Square,
  Heart,
  Eye,
  Home,
  Building2,
  TrendingUp,
  DollarSign,
  SlidersHorizontal,
  X,
  ChevronDown,
  Star,
  CheckCircle,
  Sparkles,
  Map,
  List,
  ArrowUpDown
} from 'lucide-react'
import PropertyCard, { Property } from '@/components/PropertyCard'
import { useFavorites } from '@/contexts/FavoritesContext'

// Mock data fallback when backend has no properties
function getMockProperties() {
  return [
    {
      _id: 'mock1',
      title: 'Luxury 3BHK Apartment in Bandra West',
      location: 'Bandra West, Mumbai',
      price: 25000000,
      propertyType: 'Apartment',
      listingType: 'sale',
      bedrooms: 3,
      bathrooms: 2,
      area: '1450 sq ft',
      photos: ['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop'],
      description: 'Spacious apartment with sea view',
      status: 'active',
      views: 245,
      likes: 12
    },
    {
      _id: 'mock2',
      title: 'Modern 2BHK Flat in Andheri East',
      location: 'Andheri East, Mumbai',
      price: 45000,
      propertyType: 'Apartment',
      listingType: 'rent',
      bedrooms: 2,
      bathrooms: 2,
      area: '950 sq ft',
      photos: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop'],
      description: 'Fully furnished with modern amenities',
      status: 'active',
      views: 189,
      likes: 8
    },
    {
      _id: 'mock3',
      title: 'Premium Villa in Lonavala',
      location: 'Lonavala, Maharashtra',
      price: 35000000,
      propertyType: 'Villa',
      listingType: 'sale',
      bedrooms: 4,
      bathrooms: 3,
      area: '2500 sq ft',
      photos: ['https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&h=600&fit=crop'],
      description: 'Beautiful villa with mountain view',
      status: 'active',
      views: 156,
      likes: 15
    },
    {
      _id: 'mock4',
      title: 'Spacious 1BHK in Powai',
      location: 'Powai, Mumbai',
      price: 35000,
      propertyType: 'Apartment',
      listingType: 'rent',
      bedrooms: 1,
      bathrooms: 1,
      area: '650 sq ft',
      photos: ['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop'],
      description: 'Near IT parks and malls',
      status: 'active',
      views: 92,
      likes: 5
    },
    {
      _id: 'mock5',
      title: '4BHK Penthouse in Worli',
      location: 'Worli, Mumbai',
      price: 85000000,
      propertyType: 'Penthouse',
      listingType: 'sale',
      bedrooms: 4,
      bathrooms: 4,
      area: '3200 sq ft',
      photos: ['https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=600&fit=crop'],
      description: 'Ultra-luxury with private terrace',
      status: 'active',
      views: 421,
      likes: 28
    }
  ]
}

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
        const fetchedProperties = response?.properties || response?.data || []
        
        // If no properties from backend, use mock data for testing
        if (fetchedProperties.length === 0) {
          console.warn('No properties from backend, using mock data')
          setProperties(getMockProperties())
        } else {
          setProperties(fetchedProperties)
        }
      } catch (err: any) {
        console.error('Fetch properties error:', err)
        setError(err.message || 'Failed to load properties')
        // Use mock data as fallback on error
        setProperties(getMockProperties())
      } finally {
        setLoading(false)
      }
    }

    fetchProperties()
  }, [filters.listingType, filters.propertyType, filters.sortBy]) // Re-fetch on certain filter changes


  const filteredProperties = properties
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
              className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={filters.location}
              onChange={(e) => setFilters({ ...filters, location: e.target.value })}
            />
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
