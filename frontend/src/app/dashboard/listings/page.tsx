'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
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
  ArrowUpDown,
  Edit,
  Trash2,
  MoreVertical,
  Calendar,
  Users,
  MessageCircle,
  Phone,
  Mail,
  Clock,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Pause,
  Play,
  Plus,
  BarChart3,
  Camera,
  Share2
} from 'lucide-react'
import { useSellerSubscription } from '@/contexts/SellerSubscriptionContext'

export default function MyListingsPage() {
  const router = useRouter()
  const { canAddListing } = useSellerSubscription()
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    status: 'all',
    propertyType: 'all',
    listingType: 'all', // Added for Sale/Rent filter
    priceRange: 'all',
    sortBy: 'newest'
  })

  const handleAddListing = () => {
    if (canAddListing()) {
      router.push('/dashboard/listings/new')
    } else {
      router.push('/dashboard/seller-pricing')
    }
  }

  // Sample seller listings data with rental properties included
  const listings = [
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
      status: 'active',
      featured: true,
      verified: true,
      views: 1234,
      inquiries: 23,
      favorites: 45,
      rating: 4.8,
      listedDate: '2024-01-15',
      lastUpdated: '2024-01-20',
      description: 'Stunning penthouse with breathtaking sea views, premium amenities, and modern architecture.',
      amenities: ['Sea View', 'Swimming Pool', 'Gym', 'Parking', 'Security', 'Power Backup'],
      nearbyPlaces: ['Worli Sea Face - 0.2 km', 'BKC - 2.5 km', 'Airport - 8 km'],
      priceHistory: [
        { date: '2024-01-15', price: '₹9.2 Cr', action: 'Listed' },
        { date: '2024-01-20', price: '₹8.5 Cr', action: 'Price Reduced' }
      ],
      recentInquiries: [
        { name: 'Rajesh Kumar', phone: '+91 98765 43210', email: 'rajesh@email.com', date: '2024-01-22', message: 'Interested in viewing this property' },
        { name: 'Priya Sharma', phone: '+91 87654 32109', email: 'priya@email.com', date: '2024-01-21', message: 'Can we schedule a site visit?' }
      ]
    },
    {
      id: 2,
      title: 'Premium 3BHK Apartment for Rent',
      location: 'Bandra West, Mumbai',
      price: '₹85,000/month',
      priceValue: 85000,
      listingType: 'rent',
      type: 'Apartment',
      beds: 3,
      baths: 3,
      area: '1800 sq ft',
      image: '/images/property2.jpg',
      status: 'active',
      featured: true,
      verified: true,
      views: 743,
      inquiries: 18,
      favorites: 32,
      rating: 4.7,
      listedDate: '2024-01-10',
      lastUpdated: '2024-01-18',
      description: 'Fully furnished premium apartment in prime Bandra location with modern amenities.',
      amenities: ['Furnished', 'AC', 'Gym', 'Parking', 'Security', 'Power Backup'],
      nearbyPlaces: ['Bandra Station - 0.5 km', 'Linking Road - 0.8 km', 'Airport - 6 km'],
      priceHistory: [
        { date: '2024-01-10', price: '₹90,000/month', action: 'Listed' },
        { date: '2024-01-18', price: '₹85,000/month', action: 'Price Reduced' }
      ],
      recentInquiries: [
        { name: 'Amit Singh', phone: '+91 98765 43211', email: 'amit@email.com', date: '2024-01-21', message: 'Looking for immediate possession' },
        { name: 'Neha Gupta', phone: '+91 87654 32108', email: 'neha@email.com', date: '2024-01-20', message: 'Is it available for 11 months lease?' }
      ]
    },
    {
      id: 3,
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
      status: 'active',
      featured: false,
      verified: true,
      views: 892,
      inquiries: 15,
      favorites: 28,
      rating: 4.6,
      listedDate: '2024-01-10',
      lastUpdated: '2024-01-18',
      description: 'Beautiful villa with private garden, modern interiors, and excellent connectivity.',
      amenities: ['Private Garden', 'Parking', 'Security', 'Power Backup', 'Club House'],
      nearbyPlaces: ['ITPL - 1.5 km', 'Forum Mall - 2 km', 'Airport - 45 km'],
      priceHistory: [
        { date: '2024-01-10', price: '₹3.8 Cr', action: 'Listed' }
      ],
      recentInquiries: [
        { name: 'Amit Patel', phone: '+91 76543 21098', email: 'amit@email.com', date: '2024-01-21', message: 'What is the possession date?' }
      ]
    },
    {
      id: 4,
      title: 'Furnished 2BHK Flat for Rent',
      location: 'Koramangala, Bangalore',
      price: '₹45,000/month',
      priceValue: 45000,
      listingType: 'rent',
      type: 'Apartment',
      beds: 2,
      baths: 2,
      area: '1100 sq ft',
      image: '/images/property4.jpg',
      status: 'active',
      featured: false,
      verified: true,
      views: 432,
      inquiries: 12,
      favorites: 18,
      rating: 4.4,
      listedDate: '2024-01-08',
      lastUpdated: '2024-01-16',
      description: 'Fully furnished apartment in prime Koramangala location with all modern amenities.',
      amenities: ['Furnished', 'AC', 'Parking', 'Security', 'Power Backup'],
      nearbyPlaces: ['Forum Mall - 0.8 km', 'Metro Station - 1.2 km', 'Airport - 40 km'],
      priceHistory: [
        { date: '2024-01-08', price: '₹45,000/month', action: 'Listed' }
      ],
      recentInquiries: [
        { name: 'Ravi Kumar', phone: '+91 98765 43212', email: 'ravi@email.com', date: '2024-01-19', message: 'Available for bachelors?' }
      ]
    },
    {
      id: 5,
      title: 'Spacious 2BHK Apartment with City Views',
      location: 'Gurgaon, Delhi NCR',
      price: '₹1.8 Cr',
      priceValue: 18000000,
      listingType: 'sale',
      type: 'Apartment',
      beds: 2,
      baths: 2,
      area: '1200 sq ft',
      image: '/images/property5.jpg',
      status: 'pending',
      featured: false,
      verified: false,
      views: 567,
      inquiries: 8,
      favorites: 12,
      rating: 4.3,
      listedDate: '2024-01-05',
      lastUpdated: '2024-01-15',
      description: 'Well-designed apartment with city views and modern amenities.',
      amenities: ['City View', 'Gym', 'Parking', 'Security'],
      nearbyPlaces: ['Cyber City - 3 km', 'Metro Station - 1 km', 'Airport - 15 km'],
      priceHistory: [
        { date: '2024-01-05', price: '₹1.8 Cr', action: 'Listed' }
      ],
      recentInquiries: []
    },
    {
      id: 6,
      title: 'Garden Estate Villa',
      location: 'Gurgaon, Delhi NCR',
      price: '₹5.2 Cr',
      priceValue: 52000000,
      listingType: 'sale',
      type: 'Villa',
      beds: 4,
      baths: 5,
      area: '5000 sq ft',
      image: '/images/property4.jpg',
      status: 'sold',
      featured: true,
      verified: true,
      views: 2156,
      inquiries: 67,
      favorites: 89,
      rating: 4.9,
      listedDate: '2023-12-01',
      lastUpdated: '2024-01-10',
      soldDate: '2024-01-10',
      soldPrice: '₹5.0 Cr',
      description: 'Premium villa with extensive garden and luxury amenities.',
      amenities: ['Large Garden', 'Swimming Pool', 'Gym', 'Parking', 'Security', 'Power Backup'],
      nearbyPlaces: ['Golf Course - 0.5 km', 'International School - 2 km', 'Airport - 12 km'],
      priceHistory: [
        { date: '2023-12-01', price: '₹5.5 Cr', action: 'Listed' },
        { date: '2023-12-15', price: '₹5.2 Cr', action: 'Price Reduced' },
        { date: '2024-01-10', price: '₹5.0 Cr', action: 'Sold' }
      ],
      recentInquiries: []
    },
    {
      id: 7,
      title: 'Smart Home Apartment',
      location: 'Koramangala, Bangalore',
      price: '₹2.5 Cr',
      priceValue: 25000000,
      type: 'Apartment',
      beds: 3,
      baths: 3,
      area: '2200 sq ft',
      image: '/images/property5.jpg',
      status: 'inactive',
      featured: false,
      verified: true,
      views: 445,
      inquiries: 5,
      favorites: 8,
      rating: 4.5,
      listedDate: '2024-01-01',
      lastUpdated: '2024-01-12',
      description: 'Modern smart home with automated systems and premium finishes.',
      amenities: ['Smart Home', 'Gym', 'Parking', 'Security', 'Power Backup'],
      nearbyPlaces: ['Forum Mall - 1 km', 'Metro Station - 0.8 km', 'Airport - 35 km'],
      priceHistory: [
        { date: '2024-01-01', price: '₹2.5 Cr', action: 'Listed' }
      ],
      recentInquiries: []
    }
  ]

  const [filteredListings, setFilteredListings] = useState(listings)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200'
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'sold': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'inactive': return 'bg-gray-100 text-gray-800 border-gray-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle2 size={14} />
      case 'pending': return <Clock size={14} />
      case 'sold': return <CheckCircle size={14} />
      case 'inactive': return <Pause size={14} />
      default: return <AlertCircle size={14} />
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white flex items-center">
            <Home className="mr-3 text-green-500" size={28} />
            My Listings
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage your <span className="font-semibold text-gray-900 dark:text-white">{listings.length}</span> property listings
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleAddListing}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-all flex items-center space-x-2 shadow-lg"
          >
            <Plus size={18} />
            <span>Add New Listing</span>
          </button>

          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg transition-all ${viewMode === 'grid'
              ? 'bg-green-600 text-white'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
              }`}
          >
            <Building2 size={20} />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-lg transition-all ${viewMode === 'list'
              ? 'bg-green-600 text-white'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
              }`}
          >
            <List size={20} />
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Listings</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{listings.length}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
              <Home className="text-green-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Active Listings</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {listings.filter(l => l.status === 'active').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
              <CheckCircle2 className="text-blue-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Views</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {listings.reduce((sum, l) => sum + l.views, 0).toLocaleString()}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
              <Eye className="text-purple-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Inquiries</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {listings.reduce((sum, l) => sum + l.inquiries, 0)}
              </p>
            </div>
            <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
              <MessageCircle className="text-orange-600" size={24} />
            </div>
          </div>
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
              placeholder="Search your listings..."
              className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          {/* Quick Filters */}
          <div className="flex gap-2 overflow-x-auto">
            <select
              className="px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500"
              value={filters.listingType}
              onChange={(e) => setFilters({ ...filters, listingType: e.target.value })}
            >
              <option value="all">Sale & Rent</option>
              <option value="sale">For Sale</option>
              <option value="rent">For Rent</option>
            </select>

            <select
              className="px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500"
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="sold">Sold</option>
              <option value="inactive">Inactive</option>
            </select>

            <select
              className="px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500"
              value={filters.propertyType}
              onChange={(e) => setFilters({ ...filters, propertyType: e.target.value })}
            >
              <option value="all">All Types</option>
              <option value="apartment">Apartment</option>
              <option value="villa">Villa</option>
              <option value="house">House</option>
            </select>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-all"
            >
              <SlidersHorizontal size={20} />
              <span className="hidden sm:inline">More Filters</span>
            </button>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-gray-600 dark:text-gray-400">
          Showing <span className="font-semibold text-gray-900 dark:text-white">{filteredListings.length}</span> listings
        </p>
        <div className="flex items-center space-x-2">
          <button className="text-green-600 hover:text-green-700 font-medium flex items-center space-x-1 transition-colors">
            <BarChart3 size={18} />
            <span>Analytics</span>
          </button>
        </div>
      </div>

      {/* Listings Grid/List */}
      <div className={viewMode === 'grid'
        ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'
        : 'space-y-6'
      }>
        {filteredListings.map((listing) => (
          <div
            key={listing.id}
            className="group bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 overflow-hidden hover:shadow-2xl hover:border-green-500 transition-all duration-300"
          >
            {/* Image */}
            <div className="relative h-56 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <Home size={64} className="text-gray-400" />
              </div>

              {/* Status Badge */}
              <div className="absolute top-3 left-3 flex flex-col gap-2">
                {/* Sale/Rent Badge */}
                <div className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center space-x-1 ${listing.listingType === 'rent'
                  ? 'bg-purple-500 text-white'
                  : 'bg-blue-500 text-white'
                  }`}>
                  <span>{listing.listingType === 'rent' ? 'FOR RENT' : 'FOR SALE'}</span>
                </div>

                {/* Status Badge */}
                <div className={`flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(listing.status)}`}>
                  {getStatusIcon(listing.status)}
                  <span className="capitalize">{listing.status}</span>
                </div>
              </div>

              {/* Additional Badges */}
              <div className="absolute top-3 right-3 flex flex-col gap-2">
                {listing.featured && (
                  <div className="bg-yellow-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center space-x-1">
                    <Star size={12} />
                    <span>Featured</span>
                  </div>
                )}
                {listing.verified && (
                  <div className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center space-x-1">
                    <CheckCircle size={12} />
                    <span>Verified</span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="absolute bottom-3 right-3 flex space-x-2">
                <button className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-all">
                  <Camera size={16} className="text-gray-600" />
                </button>
                <button className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-all">
                  <Share2 size={16} className="text-gray-600" />
                </button>
              </div>

              {/* Stats */}
              <div className="absolute bottom-3 left-3 flex space-x-3">
                <div className="bg-black/60 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs flex items-center space-x-1">
                  <Eye size={10} />
                  <span>{listing.views}</span>
                </div>
                <div className="bg-black/60 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs flex items-center space-x-1">
                  <MessageCircle size={10} />
                  <span>{listing.inquiries}</span>
                </div>
                <div className="bg-black/60 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs flex items-center space-x-1">
                  <Heart size={10} />
                  <span>{listing.favorites}</span>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-5">
              <Link href={`/dashboard/listings/${listing.id}`} className="block">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-green-600 transition-colors mb-1">
                      {listing.title}
                    </h3>
                    <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm">
                      <MapPin size={14} className="mr-1" />
                      <span>{listing.location}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1 text-yellow-500">
                    <Star size={14} className="fill-current" />
                    <span className="text-sm font-semibold">{listing.rating}</span>
                  </div>
                </div>

                {/* Property Details */}
                <div className="flex items-center space-x-4 mb-4 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center">
                    <Bed size={16} className="mr-1" />
                    <span>{listing.beds}</span>
                  </div>
                  <div className="flex items-center">
                    <Bath size={16} className="mr-1" />
                    <span>{listing.baths}</span>
                  </div>
                  <div className="flex items-center">
                    <Square size={16} className="mr-1" />
                    <span>{listing.area}</span>
                  </div>
                </div>

                {/* Performance Metrics */}
                <div className="grid grid-cols-3 gap-2 mb-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="text-center">
                    <p className="text-xs text-gray-500 dark:text-gray-400">Views</p>
                    <p className="font-bold text-gray-900 dark:text-white">{listing.views}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-500 dark:text-gray-400">Inquiries</p>
                    <p className="font-bold text-gray-900 dark:text-white">{listing.inquiries}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-500 dark:text-gray-400">Favorites</p>
                    <p className="font-bold text-gray-900 dark:text-white">{listing.favorites}</p>
                  </div>
                </div>

                {/* Price & Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Price</p>
                    <p className="text-xl font-bold text-green-600">{listing.price}</p>
                    {listing.status === 'sold' && listing.soldPrice && (
                      <p className="text-xs text-gray-500">Sold for {listing.soldPrice}</p>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <button className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-all">
                      <Edit size={18} />
                    </button>
                    <span className="bg-green-600 hover:bg-green-700 text-white px-4 py-2.5 rounded-lg font-medium transition-all inline-block text-sm">
                      View Details
                    </span>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Load More */}
      <div className="flex justify-center pt-6">
        <button className="bg-white dark:bg-gray-900 border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white px-8 py-3 rounded-lg font-semibold transition-all">
          Load More Listings
        </button>
      </div>
    </div>
  )
}