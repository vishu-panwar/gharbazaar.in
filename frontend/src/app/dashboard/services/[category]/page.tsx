'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  Star,
  MapPin,
  Phone,
  MessageSquare,
  CheckCircle,
  Filter,
  SlidersHorizontal,
  Award,
  Briefcase,
  Clock,
  IndianRupee,
  Search
} from 'lucide-react'
import Link from 'next/link'
import { getProvidersByCategory } from '../providersData'

export default function ServiceCategoryPage() {
  const params = useParams()
  const router = useRouter()
  const category = params.category as string
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('rating')
  const [showFilters, setShowFilters] = useState(false)

  // Get providers for this category
  const categoryProviders = getProvidersByCategory(category)
  
  // Filter providers based on search
  const filteredProviders = categoryProviders.filter(provider =>
    provider.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    provider.location.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Format category name
  const categoryName = category
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')

  return (
    <div className="space-y-6">
      {/* Back Button & Header - Compact */}
      <div>
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-3 transition-colors text-sm"
        >
          <ArrowLeft size={18} />
          <span>Back to Services</span>
        </button>

        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
          <h1 className="text-2xl font-bold mb-1">{categoryName}</h1>
          <p className="text-sm text-white/90">
            {filteredProviders.length} verified professionals available
          </p>
        </div>
      </div>

      {/* Search & Filters - Compact */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search by name or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          />
        </div>

        <div className="flex gap-2">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          >
            <option value="rating">Highest Rated</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="experience">Most Experienced</option>
          </select>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-3 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all text-sm"
          >
            <SlidersHorizontal size={18} />
            <span className="hidden sm:inline">Filters</span>
          </button>
        </div>
      </div>

      {/* Filters Panel - Compact */}
      {showFilters && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Location
              </label>
              <select className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm">
                <option>All Locations</option>
                <option>Mumbai</option>
                <option>Delhi NCR</option>
                <option>Bangalore</option>
                <option>Pune</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Experience
              </label>
              <select className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm">
                <option>Any Experience</option>
                <option>5+ years</option>
                <option>10+ years</option>
                <option>15+ years</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Availability
              </label>
              <select className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm">
                <option>All</option>
                <option>Available Now</option>
                <option>Busy</option>
              </select>
            </div>
          </div>
        </motion.div>
      )}

      {/* Providers List - Compact */}
      <div className="space-y-3">
        {filteredProviders.map((provider, index) => (
          <motion.div
            key={provider.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 hover:shadow-lg hover:border-blue-300 dark:hover:border-blue-700 transition-all duration-200"
          >
            <div className="flex flex-col lg:flex-row lg:items-center gap-4">
              {/* Avatar - Compact */}
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
                {provider.name.charAt(0)}
              </div>

              {/* Info - Compact */}
              <div className="flex-1 space-y-2.5">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <h3 className="text-base font-bold text-gray-900 dark:text-white">
                        {provider.name}
                      </h3>
                      {provider.verified && (
                        <CheckCircle className="w-4 h-4 text-blue-600" />
                      )}
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {provider.profession} • {provider.experience}
                    </p>
                  </div>

                  <div className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                    provider.available 
                      ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                      : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400'
                  }`}>
                    {provider.available ? '✓ Available' : 'Busy'}
                  </div>
                </div>

                {/* Stats - Compact */}
                <div className="flex flex-wrap gap-3 text-xs">
                  <div className="flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {provider.rating}
                    </span>
                    <span className="text-gray-500 dark:text-gray-400">
                      ({provider.reviews})
                    </span>
                  </div>

                  <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{provider.location}</span>
                  </div>

                  <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                    <Briefcase className="w-3.5 h-3.5" />
                    <span>{provider.completedProjects} projects</span>
                  </div>
                </div>

                {/* Specialties - Compact */}
                <div className="flex flex-wrap gap-1.5">
                  {provider.specialties.slice(0, 4).map((specialty, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 text-xs rounded"
                    >
                      {specialty}
                    </span>
                  ))}
                  {provider.specialties.length > 4 && (
                    <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded">
                      +{provider.specialties.length - 4}
                    </span>
                  )}
                </div>

                {/* Languages - Compact */}
                <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                  <span className="font-medium">Languages:</span>
                  <span>{provider.languages.join(', ')}</span>
                </div>
              </div>

              {/* Price & Actions - Compact */}
              <div className="flex flex-row lg:flex-col items-center lg:items-end justify-between lg:justify-start gap-3 lg:min-w-[180px] pt-3 lg:pt-0 border-t lg:border-t-0 lg:border-l border-gray-200 dark:border-gray-700 lg:pl-4">
                <div className="text-left lg:text-right">
                  <div className="text-lg font-bold text-gray-900 dark:text-white">
                    {provider.price}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {provider.priceType}
                  </div>
                </div>

                <div className="flex lg:flex-col w-auto lg:w-full gap-2">
                  <Link href={`/dashboard/services/provider/${provider.id}`} className="lg:w-full">
                    <button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg text-xs font-medium transition-all whitespace-nowrap">
                      View Profile
                    </button>
                  </Link>
                  
                  <div className="flex gap-1.5">
                    <button className="p-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors">
                      <MessageSquare size={16} />
                    </button>
                    <button className="p-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors">
                      <Phone size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* No Results - Compact */}
      {filteredProviders.length === 0 && (
        <div className="text-center py-10 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-3">
            <Search className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
            No providers found
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Try adjusting your search or filters
          </p>
        </div>
      )}
    </div>
  )
}
