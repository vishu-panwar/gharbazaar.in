'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { listingsAPI, bidsAPI } from '@/lib/api'
import { MapPin, Home, Bed, Bath, Maximize, Calendar, Eye, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function ListingDetailPage() {
  const params = useParams()
  const [listing, setListing] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [bidAmount, setBidAmount] = useState('')
  const [bidMessage, setBidMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (params.id) {
      fetchListing()
    }
  }, [params.id])

  const fetchListing = async () => {
    try {
      setLoading(true)
      const response = await listingsAPI.getById(params.id as string)
      setListing(response.data)
      setBidAmount(response.data.price.toString())
    } catch (error) {
      console.error('Failed to fetch listing:', error)
    } finally {
      setLoading(false)
    }
  }

  const handlePlaceBid = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setSubmitting(true)
      await bidsAPI.create(
        listing.id,
        Number(bidAmount),
        bidMessage
      )
      alert('Bid placed successfully!')
      setBidMessage('')
    } catch (error: any) {
      alert(error.response?.data?.error || 'Failed to place bid. Please login first.')
    } finally {
      setSubmitting(false)
    }
  }

  const formatPrice = (price: number, category: string) => {
    if (category === 'rent') {
      return `₹${price.toLocaleString('en-IN')}/month`
    }
    if (price >= 10000000) {
      return `₹${(price / 10000000).toFixed(2)} Crore`
    }
    if (price >= 100000) {
      return `₹${(price / 100000).toFixed(2)} Lakh`
    }
    return `₹${price.toLocaleString('en-IN')}`
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600 dark:text-gray-400">Loading property...</p>
      </div>
    )
  }

  if (!listing) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-4">Property not found</p>
          <Link href="/listings" className="btn-primary">
            Back to Listings
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Link href="/listings" className="inline-flex items-center text-primary-600 hover:underline mb-6">
          <ArrowLeft size={20} className="mr-2" />
          Back to Listings
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <div className="aspect-video bg-gray-200 dark:bg-gray-800 rounded-xl overflow-hidden relative">
              {listing.isFeatured && (
                <span className="absolute top-4 right-4 bg-accent-500 text-white px-3 py-1 rounded-lg z-10">
                  Featured
                </span>
              )}
              {listing.isVerified && (
                <span className="absolute top-4 left-4 bg-green-500 text-white px-3 py-1 rounded-lg z-10">
                  Verified
                </span>
              )}
              <div className="w-full h-full flex items-center justify-center">
                <Home size={96} className="text-gray-400" />
              </div>
            </div>

            {/* Title and Price */}
            <div>
              <h1 className="font-heading font-bold text-3xl md:text-4xl mb-4">
                {listing.title}
              </h1>
              <div className="flex items-center justify-between mb-4">
                <p className="text-3xl font-bold text-primary-600">
                  {formatPrice(listing.price, listing.category)}
                </p>
                <div className="flex items-center text-gray-600 dark:text-gray-400">
                  <Eye size={20} className="mr-2" />
                  {listing.viewCount} views
                </div>
              </div>
              <div className="flex items-center text-gray-600 dark:text-gray-400 mb-4">
                <MapPin size={20} className="mr-2" />
                {listing.location.address}, {listing.location.city}, {listing.location.state} - {listing.location.pincode}
              </div>
            </div>

            {/* Property Specs */}
            {listing.propertySpecs && (
              <div className="card">
                <h2 className="font-heading font-bold text-xl mb-4">Property Details</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {listing.propertySpecs.bedrooms && (
                    <div className="flex items-center space-x-2">
                      <Bed size={20} className="text-primary-600" />
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Bedrooms</p>
                        <p className="font-bold">{listing.propertySpecs.bedrooms}</p>
                      </div>
                    </div>
                  )}
                  {listing.propertySpecs.bathrooms && (
                    <div className="flex items-center space-x-2">
                      <Bath size={20} className="text-primary-600" />
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Bathrooms</p>
                        <p className="font-bold">{listing.propertySpecs.bathrooms}</p>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center space-x-2">
                    <Maximize size={20} className="text-primary-600" />
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Area</p>
                      <p className="font-bold">{listing.propertySpecs.area} {listing.propertySpecs.areaUnit}</p>
                    </div>
                  </div>
                  {listing.propertySpecs.yearBuilt && (
                    <div className="flex items-center space-x-2">
                      <Calendar size={20} className="text-primary-600" />
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Built Year</p>
                        <p className="font-bold">{listing.propertySpecs.yearBuilt}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Description */}
            <div className="card">
              <h2 className="font-heading font-bold text-xl mb-4">Description</h2>
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                {listing.description}
              </p>
            </div>

            {/* Features */}
            {listing.features && listing.features.length > 0 && (
              <div className="card">
                <h2 className="font-heading font-bold text-xl mb-4">Features & Amenities</h2>
                <div className="flex flex-wrap gap-2">
                  {listing.features.map((feature: string, index: number) => (
                    <span
                      key={index}
                      className="bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 px-3 py-1 rounded-full text-sm"
                    >
                      {feature.replace(/-/g, ' ')}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Place Bid */}
            <div className="card sticky top-4">
              <h2 className="font-heading font-bold text-xl mb-4">Place Your Bid</h2>
              <form onSubmit={handlePlaceBid} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Bid Amount (₹)</label>
                  <input
                    type="number"
                    className="input"
                    value={bidAmount}
                    onChange={(e) => setBidAmount(e.target.value)}
                    min={listing.price}
                    required
                  />
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    Minimum: ₹{listing.price.toLocaleString('en-IN')}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Message (Optional)</label>
                  <textarea
                    className="input"
                    rows={3}
                    value={bidMessage}
                    onChange={(e) => setBidMessage(e.target.value)}
                    placeholder="Add a message to the seller..."
                  />
                </div>
                <button
                  type="submit"
                  className="btn-primary w-full"
                  disabled={submitting}
                >
                  {submitting ? 'Placing Bid...' : 'Place Bid'}
                </button>
              </form>
            </div>

            {/* Property Type */}
            <div className="card">
              <h3 className="font-bold mb-2">Property Type</h3>
              <p className="text-gray-600 dark:text-gray-400 capitalize">{listing.type}</p>
              <h3 className="font-bold mt-4 mb-2">Category</h3>
              <p className="text-gray-600 dark:text-gray-400 capitalize">For {listing.category}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
