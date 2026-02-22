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
import PropertyCard from '@/components/PropertyCard'
import { usePayment } from '@/contexts/PaymentContext'
import { backendApi } from '@/lib/backendApi'
import { useAuth } from '@/contexts/AuthContext'
import toast from 'react-hot-toast'

export default function MyListingsPage() {
  const router = useRouter()
  const { hasPaid, currentPlan, hasFeature } = usePayment()
  const { user } = useAuth()
  const [listings, setListings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    status: 'all',
    propertyType: 'all',
    listingType: 'all',
    priceRange: 'all',
    sortBy: 'newest'
  })

  useEffect(() => {
    const fetchListings = async () => {
      if (!user) return
      try {
        setLoading(true)
        const response = await backendApi.properties.getUserProperties(user.uid)
        if (response.success) {
          setListings(response.properties || [])
        }
      } catch (error) {
        console.error('Error fetching listings:', error)
        toast.error('Failed to load listings')
      } finally {
        setLoading(false)
      }
    }

    fetchListings()
  }, [user])

  const handleAddListing = () => {
    const planType = currentPlan?.type || ''
    const canAddByPlan =
      hasPaid &&
      (planType === 'seller' || planType === 'combined') &&
      hasFeature('listingLimit')

    if (canAddByPlan) {
      router.push('/dashboard/listings/new')
    } else {
      router.push('/dashboard/seller-pricing')
    }
  }

  // Sample seller listings data with rental properties included
  const [filteredListings, setFilteredListings] = useState<any[]>([])

  useEffect(() => {
    let result = [...listings]

    if (filters.status !== 'all') {
      result = result.filter(l => l.status === filters.status)
    }
    if (filters.propertyType !== 'all') {
      result = result.filter(l => l.propertyType?.toLowerCase() === filters.propertyType.toLowerCase())
    }
    if (filters.listingType !== 'all') {
      result = result.filter(l => l.listingType === filters.listingType)
    }

    setFilteredListings(result)
  }, [listings, filters])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200'
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'sold': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'paused': return 'bg-amber-100 text-amber-800 border-amber-200'
      case 'cancelled': return 'bg-gray-100 text-gray-800 border-gray-200'
      case 'deleted': return 'bg-red-900 text-white border-red-700'
      case 'inactive': return 'bg-gray-100 text-gray-800 border-gray-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle2 size={14} />
      case 'pending': return <Clock size={14} />
      case 'sold': return <CheckCircle size={14} />
      case 'paused': return <Pause size={14} />
      case 'cancelled': return <XCircle size={14} />
      case 'deleted': return <Trash2 size={14} />
      case 'inactive': return <AlertCircle size={14} />
      default: return <AlertCircle size={14} />
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this listing?')) return

    try {
      const response = await backendApi.properties.delete(id)
      if (response.success) {
        toast.success('Listing deleted successfully')
        setListings(listings.filter(l => (l._id || l.id) !== id))
      }
    } catch (error) {
      console.error('Error deleting listing:', error)
      toast.error('Failed to delete listing')
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
              <option value="paused">Paused</option>
              <option value="cancelled">Cancelled</option>
              <option value="deleted">Deleted</option>
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
          <div key={listing._id || listing.id} className="relative group">
            <PropertyCard
                viewMode={viewMode}
                property={{
                ...listing,
                id: listing._id || listing.id,
                image: listing.photos?.[0] || listing.image,
                beds: listing.bedrooms || listing.beds || 0,
                baths: listing.bathrooms || listing.baths || 0,
                area: listing.area || listing.size || 'N/A',
                views: listing.views || 0,
                rating: listing.rating || 4.5
                }}
            />
            {/* Seller Actions Overlay */}
            <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                 {listing.status === 'active' && (
                    <Link
                        href={`/dashboard/listings/${listing._id || listing.id}/edit`}
                        className="p-2 bg-white text-gray-700 hover:text-green-600 rounded-full shadow-lg transition-colors"
                        title="Edit Listing"
                    >
                        <Edit size={16} />
                    </Link>
                )}
                {listing.status !== 'deleted' && (
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            handleDelete(listing._id || listing.id);
                        }}
                        className="p-2 bg-white text-gray-700 hover:text-red-600 rounded-full shadow-lg transition-colors"
                        title="Delete Listing"
                    >
                        <Trash2 size={16} />
                    </button>
                )}
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
