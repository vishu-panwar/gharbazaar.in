'use client'

import { MapPin, Home } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { listingsAPI } from '@/lib/api'

export function FeaturedListings() {
  const [listings, setListings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const response = await listingsAPI.search({ limit: 6 })
        setListings(response.data || response.properties || [])
      } catch (error) {
        console.error('Failed to fetch listings:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchListings()
  }, [])

  if (loading) {
    return (
      <section className="container mx-auto px-4">
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400">Loading properties...</p>
        </div>
      </section>
    )
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
    <section className="container mx-auto px-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-8 text-center sm:text-left">
        <div className="mb-4 sm:mb-0">
          <h2 className="font-heading font-bold text-2xl sm:text-3xl md:text-4xl mb-2">
            Featured Properties
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
            Handpicked properties from verified sellers
          </p>
        </div>
        <Link href="/listings" className="text-primary-600 hover:underline font-medium text-sm sm:text-base whitespace-nowrap">
          View All →
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {listings.map((listing) => (
          <Link key={listing.id} href={`/listings/${listing.id}`} className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-200/50 dark:border-gray-700/50 group hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
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
            <p className="text-xl sm:text-2xl font-bold text-primary-600 mb-2">
              {formatPrice(listing.price, listing.category)}
            </p>
            <div className="flex items-center text-gray-600 dark:text-gray-400 text-xs sm:text-sm mb-1">
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
    </section>
  )
}
