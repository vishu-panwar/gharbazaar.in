import { MapPin, Home, Eye } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { listingsAPI } from '@/lib/api'
import PropertyCard from '@/components/PropertyCard'

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
          <PropertyCard
            key={listing._id || listing.id}
            property={{
              ...listing,
              id: listing._id || listing.id,
              beds: listing.propertySpecs?.bedrooms || 0,
              baths: listing.propertySpecs?.bathrooms || 0,
              area: listing.propertySpecs?.area ? `${listing.propertySpecs.area} ${listing.propertySpecs.areaUnit || 'sqft'}` : 'N/A',
              price: formatPrice(listing.price, listing.listingType),
              priceValue: listing.price,
              image: listing.images?.[0] || '',
              location: `${listing.city || ''}, ${listing.location || ''}`.trim().replace(/^, |, $/g, '') || 'India'
            }}
          />
        ))}
      </div>
    </section>
  )
}
