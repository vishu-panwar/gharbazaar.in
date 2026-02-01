'use client'

import { useState } from 'react'
import { 
  Home, 
  Search, 
  Eye, 
  CheckCircle,
  XCircle,
  Flag,
  Star,
  TrendingUp,
  MapPin,
  IndianRupee,
  User,
  Calendar,
  Clock,
  Image as ImageIcon
} from 'lucide-react'
import toast from 'react-hot-toast'

export default function ListingManagementPage() {
  const [filter, setFilter] = useState('all')
  const [selectedListing, setSelectedListing] = useState<any>(null)
  const [showModal, setShowModal] = useState(false)

  const listings = [
    {
      id: 1,
      listingId: 'LST001',
      title: '3 BHK Apartment in Bandra',
      owner: 'Rajesh Kumar',
      ownerId: 'USR001',
      type: 'Apartment',
      city: 'Mumbai',
      location: 'Bandra West, Mumbai',
      price: 25000000,
      status: 'pending',
      views: 245,
      inquiries: 18,
      bids: 5,
      postedDate: '2024-01-20',
      verificationStatus: 'pending',
      images: 8,
      featured: false
    },
    {
      id: 2,
      listingId: 'LST002',
      title: 'Luxury Villa in North Goa',
      owner: 'Priya Sharma',
      ownerId: 'USR002',
      type: 'Villa',
      city: 'Goa',
      location: 'Anjuna, Goa',
      price: 42000000,
      status: 'approved',
      views: 589,
      inquiries: 34,
      bids: 12,
      postedDate: '2024-01-18',
      verificationStatus: 'verified',
      images: 15,
      featured: true
    },
    {
      id: 3,
      listingId: 'LST003',
      title: 'Commercial Space in Andheri',
      owner: 'Amit Patel',
      ownerId: 'USR003',
      type: 'Commercial',
      city: 'Mumbai',
      location: 'Andheri East, Mumbai',
      price: 18000000,
      status: 'rejected',
      views: 89,
      inquiries: 3,
      bids: 0,
      postedDate: '2024-01-15',
      verificationStatus: 'rejected',
      images: 4,
      featured: false
    },
  ]

  const stats = {
    total: 1456,
    pending: 23,
    approved: 1398,
    rejected: 35
  }

  const formatPrice = (price: number) => {
    if (price >= 10000000) {
      return `₹${(price / 10000000).toFixed(2)} Cr`
    } else if (price >= 100000) {
      return `₹${(price / 100000).toFixed(2)} L`
    }
    return `₹${price.toLocaleString()}`
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
      case 'pending':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
      case 'rejected':
        return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
    }
  }

  const handleApprove = (id: number) => {
    toast.success('Listing approved successfully')
    setShowModal(false)
  }

  const handleReject = (id: number) => {
    toast.error('Listing rejected')
    setShowModal(false)
  }

  const handleFeature = (id: number) => {
    toast.success('Listing featured')
  }

  const filteredListings = listings.filter(listing => 
    filter === 'all' ? true : listing.status === filter
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Listing Management</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Manage all property listings
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <Home size={32} className="opacity-80" />
            <div className="text-right">
              <p className="text-3xl font-bold">{stats.total.toLocaleString()}</p>
              <p className="text-sm opacity-80">Total Listings</p>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <Clock size={32} className="opacity-80" />
            <div className="text-right">
              <p className="text-3xl font-bold">{stats.pending}</p>
              <p className="text-sm opacity-80">Pending Approval</p>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <CheckCircle size={32} className="opacity-80" />
            <div className="text-right">
              <p className="text-3xl font-bold">{stats.approved.toLocaleString()}</p>
              <p className="text-sm opacity-80">Approved</p>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <XCircle size={32} className="opacity-80" />
            <div className="text-right">
              <p className="text-3xl font-bold">{stats.rejected}</p>
              <p className="text-sm opacity-80">Rejected</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-950 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search listings..."
              className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div className="flex items-center space-x-2">
            {['all', 'pending', 'approved', 'rejected'].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`
                  px-4 py-2 rounded-lg text-sm font-medium transition-all capitalize
                  ${filter === status 
                    ? 'bg-purple-600 text-white shadow-lg' 
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                  }
                `}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Listings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredListings.map((listing) => (
          <div
            key={listing.id}
            className="bg-white dark:bg-gray-950 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-xl transition-all group"
          >
            {/* Image */}
            <div className="relative h-48 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30">
              <div className="absolute inset-0 flex items-center justify-center">
                <ImageIcon size={48} className="text-purple-300 dark:text-purple-700" />
              </div>
              <div className="absolute top-3 left-3">
                <span className={`px-3 py-1 rounded-lg text-xs font-bold capitalize ${getStatusColor(listing.status)}`}>
                  {listing.status}
                </span>
              </div>
              {listing.featured && (
                <div className="absolute top-3 right-3 bg-yellow-500 text-white px-3 py-1 rounded-lg flex items-center space-x-1">
                  <Star size={14} fill="white" />
                  <span className="text-xs font-bold">Featured</span>
                </div>
              )}
              <div className="absolute bottom-3 right-3 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm px-3 py-1 rounded-lg">
                <p className="text-sm font-bold text-purple-600">{formatPrice(listing.price)}</p>
              </div>
            </div>

            {/* Content */}
            <div className="p-5">
              <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2 line-clamp-1">
                {listing.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center space-x-1 mb-3">
                <MapPin size={14} />
                <span className="line-clamp-1">{listing.location}</span>
              </p>

              <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200 dark:border-gray-800">
                <div className="text-center">
                  <p className="text-lg font-bold text-gray-900 dark:text-white">{listing.views}</p>
                  <p className="text-xs text-gray-500">Views</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-gray-900 dark:text-white">{listing.inquiries}</p>
                  <p className="text-xs text-gray-500">Inquiries</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-gray-900 dark:text-white">{listing.bids}</p>
                  <p className="text-xs text-gray-500">Bids</p>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-4">
                <span className="flex items-center space-x-1">
                  <User size={14} />
                  <span>{listing.owner}</span>
                </span>
                <span className="flex items-center space-x-1">
                  <Calendar size={14} />
                  <span>{listing.postedDate}</span>
                </span>
              </div>

              <button
                onClick={() => {
                  setSelectedListing(listing)
                  setShowModal(true)
                }}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg font-medium transition-all"
              >
                Review Listing
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Detail Modal */}
      {showModal && selectedListing && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-950 rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto border border-gray-200 dark:border-gray-800 shadow-2xl">
            <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-pink-600 p-6 z-10">
              <div className="flex items-center justify-between text-white">
                <div>
                  <h2 className="text-2xl font-bold">{selectedListing.title}</h2>
                  <p className="text-purple-100">{selectedListing.listingId}</p>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 hover:bg-white/20 rounded-lg transition-all"
                >
                  <XCircle size={24} />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Quick Stats */}
              <div className="grid grid-cols-4 gap-4">
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
                  <p className="text-sm text-blue-600 dark:text-blue-400 mb-1">Views</p>
                  <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">{selectedListing.views}</p>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4 border border-green-200 dark:border-green-800">
                  <p className="text-sm text-green-600 dark:text-green-400 mb-1">Inquiries</p>
                  <p className="text-2xl font-bold text-green-700 dark:text-green-300">{selectedListing.inquiries}</p>
                </div>
                <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4 border border-purple-200 dark:border-purple-800">
                  <p className="text-sm text-purple-600 dark:text-purple-400 mb-1">Bids</p>
                  <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">{selectedListing.bids}</p>
                </div>
                <div className="bg-orange-50 dark:bg-orange-900/20 rounded-xl p-4 border border-orange-200 dark:border-orange-800">
                  <p className="text-sm text-orange-600 dark:text-orange-400 mb-1">Images</p>
                  <p className="text-2xl font-bold text-orange-700 dark:text-orange-300">{selectedListing.images}</p>
                </div>
              </div>

              {/* Listing Info */}
              <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800">
                <h3 className="font-bold text-lg mb-4">Listing Information</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Property Type</p>
                    <p className="font-semibold">{selectedListing.type}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Price</p>
                    <p className="font-semibold text-purple-600">{formatPrice(selectedListing.price)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Location</p>
                    <p className="font-semibold">{selectedListing.location}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Owner</p>
                    <p className="font-semibold">{selectedListing.owner}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Posted Date</p>
                    <p className="font-semibold">{selectedListing.postedDate}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Status</p>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold capitalize ${getStatusColor(selectedListing.status)}`}>
                      {selectedListing.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center space-x-3 pt-6 border-t border-gray-200 dark:border-gray-800">
                <button
                  onClick={() => handleApprove(selectedListing.id)}
                  className="flex-1 flex items-center justify-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-semibold transition-all"
                >
                  <CheckCircle size={20} />
                  <span>Approve</span>
                </button>
                <button
                  onClick={() => handleReject(selectedListing.id)}
                  className="flex-1 flex items-center justify-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-semibold transition-all"
                >
                  <XCircle size={20} />
                  <span>Reject</span>
                </button>
                <button
                  onClick={() => handleFeature(selectedListing.id)}
                  className="flex items-center justify-center space-x-2 bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-3 rounded-xl font-semibold transition-all"
                >
                  <Star size={20} />
                  <span>Feature</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
