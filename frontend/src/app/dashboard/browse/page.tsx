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

  // Sample properties data - Updated with rental properties
  const properties = [
    {
      id: 1,
      title: 'Luxury 4BHK Penthouse with Panoramic Sea Views',
      location: 'Worli, Mumbai',
      price: '₹8.5 Cr',
      priceValue: 85000000,
      listingType: 'sale',
      type: 'Apartment',
      beds: 4,
      baths: 5,
      area: '3200 sq ft',
      image: '/images/property1.jpg',
      featured: true,
      verified: true,
      views: 1234,
      rating: 4.8,
      isFavorite: false
    },
    {
      id: 2,
      title: 'Modern 3BHK Villa with Private Garden',
      location: 'Whitefield, Bangalore',
      price: '₹3.8 Cr',
      priceValue: 38000000,
      listingType: 'sale',
      type: 'Villa',
      beds: 3,
      baths: 4,
      area: '2100 sq ft',
      image: '/images/property2.jpg',
      featured: true,
      verified: true,
      views: 892,
      rating: 4.6,
      isFavorite: true
    },
    {
      id: 3,
      title: 'Spacious 2BHK Apartment with City Views',
      location: 'Gurgaon, Delhi NCR',
      price: '₹1.8 Cr',
      priceValue: 18000000,
      listingType: 'sale',
      type: 'Apartment',
      beds: 2,
      baths: 2,
      area: '1200 sq ft',
      image: '/images/property3.jpg',
      featured: false,
      verified: true,
      views: 567,
      rating: 4.3,
      isFavorite: false
    },
    {
      id: 4,
      title: 'Premium 3BHK Apartment for Rent',
      location: 'Bandra West, Mumbai',
      price: '₹85,000/month',
      priceValue: 85000,
      listingType: 'rent',
      type: 'Apartment',
      beds: 3,
      baths: 3,
      area: '1800 sq ft',
      image: '/images/property4.jpg',
      featured: true,
      verified: true,
      views: 743,
      rating: 4.7,
      isFavorite: false
    },
    {
      id: 5,
      title: 'Furnished 2BHK Flat for Rent',
      location: 'Koramangala, Bangalore',
      price: '₹45,000/month',
      priceValue: 45000,
      listingType: 'rent',
      type: 'Apartment',
      beds: 2,
      baths: 2,
      area: '1100 sq ft',
      image: '/images/property5.jpg',
      featured: false,
      verified: true,
      views: 432,
      rating: 4.4,
      isFavorite: true
    },
    {
      id: 6,
      title: 'Luxury Villa on Rent',
      location: 'DLF Phase 2, Gurgaon',
      price: '₹1,20,000/month',
      priceValue: 120000,
      listingType: 'rent',
      type: 'Villa',
      beds: 4,
      baths: 5,
      area: '3000 sq ft',
      image: '/images/property6.jpg',
      featured: true,
      verified: true,
      views: 891,
      rating: 4.9,
      isFavorite: false
    },
    {
      id: 7,
      title: 'Garden Estate Villa',
      location: 'Gurgaon, Delhi NCR',
      price: '₹5.2 Cr',
      priceValue: 52000000,
      listingType: 'sale',
      type: 'Villa',
      beds: 4,
      baths: 5,
      area: '5000 sq ft',
      image: '/images/property7.jpg',
      featured: false,
      verified: true,
      views: 678,
      rating: 4.6,
      isFavorite: false
    },
    {
      id: 8,
      title: 'Smart Home Apartment',
      location: 'Koramangala, Bangalore',
      price: '₹2.5 Cr',
      priceValue: 25000000,
      listingType: 'sale',
      type: 'Apartment',
      beds: 3,
      baths: 3,
      area: '2200 sq ft',
      image: '/images/property8.jpg',
      featured: false,
      verified: false,
      views: 445,
      rating: 4.5,
      isFavorite: true
    },
    {
      id: 9,
      title: 'Riverside Villa',
      location: 'Pune, Maharashtra',
      price: '₹4.8 Cr',
      priceValue: 48000000,
      listingType: 'sale',
      type: 'Villa',
      beds: 4,
      baths: 4,
      area: '3800 sq ft',
      image: '/images/property6.jpg',
      featured: true,
      verified: true,
      views: 1023,
      rating: 4.8,
      isFavorite: false
    }
  ]

  const [filteredProperties, setFilteredProperties] = useState(properties)
  const { toggleFavorite, isFavorite } = useFavorites()

  const handleToggleFavorite = (id: number) => {
    const property = properties.find(p => p.id === id)
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
      <div className={viewMode === 'grid'
        ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'
        : 'space-y-6'
      }>
        {filteredProperties.map((property) => (
          <PropertyCard
            key={property.id}
            property={property}
            onToggleFavorite={handleToggleFavorite}
            viewMode={viewMode}
          />
        ))}
      </div>

      {/* Load More */}
      <div className="flex justify-center pt-6">
        <button className="bg-white dark:bg-gray-900 border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-8 py-3 rounded-lg font-semibold transition-all">
          Load More Properties
        </button>
      </div>
    </div>
  )
}
