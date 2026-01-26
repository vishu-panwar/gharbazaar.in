'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import {
  ArrowLeft,
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
  Star,
  CheckCircle,
  Sparkles,
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
  Edit,
  Trash2,
  MoreVertical,
  Share2,
  Camera,
  BarChart3,
  FileText,
  Download,
  Upload,
  Settings,
  Zap,
  Shield,
  Wifi,
  Car,
  Trees,
  Dumbbell,
  ShoppingCart,
  GraduationCap,
  Plane,
  Train,
  Bus,
  Navigation,
  ChevronRight,
  ChevronDown,
  Plus,
  Minus,
  RefreshCw,
  ArrowUpRight,
  Crown
} from 'lucide-react'

// Function to get listing data by ID
function getListingData(id: string) {
  const listings = {
    '1': {
      id: 1,
      title: 'Luxury 4BHK Penthouse with Panoramic Sea Views',
      location: 'Worli, Mumbai',
      price: '₹8.5 Cr',
      originalPrice: '₹9.2 Cr',
      priceValue: 85000000,
      type: 'Apartment',
      beds: 4,
      baths: 5,
      area: '3200 sq ft',
      status: 'active',
      featured: true,
      verified: true,
      views: 1234,
      inquiries: 23,
      favorites: 45,
      rating: 4.8,
      listedDate: '2024-01-15',
      lastUpdated: '2024-01-20',
      description: 'Experience luxury living at its finest in this stunning 4BHK penthouse offering breathtaking panoramic sea views. Located in the prestigious Worli area, this property combines modern architecture with premium amenities to create an unparalleled living experience.',
      detailedDescription: 'This magnificent penthouse spans across 3200 sq ft of meticulously designed space, featuring floor-to-ceiling windows that frame spectacular views of the Arabian Sea. The property boasts premium Italian marble flooring, modular kitchen with imported appliances, and spacious bedrooms with en-suite bathrooms. The master bedroom includes a walk-in closet and private balcony overlooking the sea.',
      specifications: {
        'Property Type': 'Penthouse Apartment',
        'Floor': '45th Floor',
        'Facing': 'West (Sea Facing)',
        'Furnishing': 'Semi-Furnished',
        'Possession': 'Ready to Move',
        'Age of Property': '2 Years',
        'Total Floors': '50',
        'Carpet Area': '2800 sq ft',
        'Built-up Area': '3200 sq ft',
        'Super Area': '3600 sq ft',
        'Parking': '3 Covered',
        'Balconies': '4',
        'Water Supply': '24x7',
        'Power Backup': 'Full',
        'Lift': '4 High Speed'
      },
      amenities: [
        { name: 'Sea View', icon: '🌊' },
        { name: 'Swimming Pool', icon: '🏊' },
        { name: 'Gym & Fitness Center', icon: '💪' },
        { name: 'Covered Parking', icon: '🚗' },
        { name: '24/7 Security', icon: '🛡️' },
        { name: 'Power Backup', icon: '⚡' },
        { name: 'High Speed Elevators', icon: '🏢' },
        { name: 'Concierge Service', icon: '🎩' },
        { name: 'Spa & Wellness', icon: '🧘' },
        { name: 'Business Center', icon: '💼' },
        { name: 'Children Play Area', icon: '🎮' },
        { name: 'Landscaped Gardens', icon: '🌳' }
      ],
      nearbyPlaces: [
        { name: 'Worli Sea Face', distance: '0.2 km', type: 'Recreation', icon: '🌊' },
        { name: 'BKC Business District', distance: '2.5 km', type: 'Business', icon: '🏢' },
        { name: 'Phoenix Mills Mall', distance: '1.8 km', type: 'Shopping', icon: '🛍️' },
        { name: 'Breach Candy Hospital', distance: '3.2 km', type: 'Healthcare', icon: '🏥' },
        { name: 'Bombay Scottish School', distance: '2.1 km', type: 'Education', icon: '🎓' },
        { name: 'Chhatrapati Shivaji Airport', distance: '8.5 km', type: 'Transport', icon: '✈️' },
        { name: 'Worli Metro Station', distance: '1.2 km', type: 'Transport', icon: '🚇' },
        { name: 'Mahalaxmi Race Course', distance: '2.8 km', type: 'Recreation', icon: '🏇' }
      ],
      priceHistory: [
        { date: '2024-01-15', price: '₹9.2 Cr', action: 'Listed', change: null },
        { date: '2024-01-20', price: '₹8.5 Cr', action: 'Price Reduced', change: '-7.6%' }
      ],
      recentInquiries: [
        {
          id: 1,
          name: 'Rajesh Kumar',
          phone: '+91 98765 43210',
          email: 'rajesh@email.com',
          date: '2024-01-22',
          time: '2:30 PM',
          message: 'Interested in viewing this property. Can we schedule a visit this weekend?',
          status: 'new',
          source: 'Website'
        },
        {
          id: 2,
          name: 'Priya Sharma',
          phone: '+91 87654 32109',
          email: 'priya@email.com',
          date: '2024-01-21',
          time: '11:15 AM',
          message: 'Can we schedule a site visit? Also, is there any scope for price negotiation?',
          status: 'responded',
          source: 'Mobile App'
        },
        {
          id: 3,
          name: 'Amit Patel',
          phone: '+91 76543 21098',
          email: 'amit@email.com',
          date: '2024-01-20',
          time: '4:45 PM',
          message: 'What are the maintenance charges? Is the property ready for immediate possession?',
          status: 'responded',
          source: 'Phone Call'
        }
      ],
      mediaItems: [
        { type: 'image', url: '/images/property1-1.jpg', title: 'Living Room' },
        { type: 'image', url: '/images/property1-2.jpg', title: 'Master Bedroom' },
        { type: 'image', url: '/images/property1-3.jpg', title: 'Kitchen' },
        { type: 'image', url: '/images/property1-4.jpg', title: 'Balcony View' },
        { type: 'video', url: '/videos/property1-tour.mp4', title: 'Virtual Tour' }
      ],
      documents: [
        { name: 'Property Title Deed', type: 'PDF', size: '2.4 MB', verified: true },
        { name: 'Building Approval', type: 'PDF', size: '1.8 MB', verified: true },
        { name: 'Property Tax Receipt', type: 'PDF', size: '0.5 MB', verified: true },
        { name: 'Society NOC', type: 'PDF', size: '1.2 MB', verified: false },
        { name: 'Floor Plan', type: 'PDF', size: '3.1 MB', verified: true }
      ],
      analytics: {
        totalViews: 1234,
        uniqueVisitors: 892,
        inquiries: 23,
        favorites: 45,
        shares: 12,
        averageTimeOnPage: '4:32',
        bounceRate: '23%',
        conversionRate: '1.9%',
        viewsThisWeek: 156,
        inquiriesThisWeek: 5
      }
    },
    '2': {
      id: 2,
      title: 'Premium 3BHK Apartment for Rent',
      location: 'Bandra West, Mumbai',
      price: '₹85,000/month',
      originalPrice: '₹95,000/month',
      priceValue: 85000,
      listingType: 'rent',
      type: 'Apartment',
      beds: 3,
      baths: 3,
      area: '1800 sq ft',
      status: 'active',
      featured: true,
      verified: true,
      views: 743,
      inquiries: 18,
      favorites: 32,
      rating: 4.7,
      listedDate: '2024-01-10',
      lastUpdated: '2024-01-18',
      securityDeposit: '₹2,55,000',
      leasePeriod: '11 months minimum',
      maintenanceCharges: '₹8,500/month',
      description: 'Luxurious fully furnished 3BHK apartment in prime Bandra West location. Perfect for working professionals and families. Features premium furniture, modern appliances, and excellent amenities.',
      detailedDescription: 'This premium apartment offers modern living with fully furnished interiors, high-quality appliances, and stunning city views. Located in the heart of Bandra West, it provides easy access to restaurants, shopping centers, and business districts.',
      specifications: {
        'Property Type': 'High-Rise Apartment',
        'Floor': '12th Floor',
        'Facing': 'West',
        'Furnishing': 'Fully Furnished',
        'Possession': 'Immediate',
        'Age of Property': '3 Years',
        'Total Floors': '20',
        'Carpet Area': '1500 sq ft',
        'Built-up Area': '1800 sq ft',
        'Super Area': '2000 sq ft',
        'Parking': '2 Covered',
        'Balconies': '2',
        'Water Supply': '24x7',
        'Power Backup': 'Full',
        'Lift': '2 High Speed'
      },
      amenities: [
        { name: 'Fully Furnished', icon: '🛋️' },
        { name: 'AC in All Rooms', icon: '❄️' },
        { name: 'Modular Kitchen', icon: '🍳' },
        { name: 'Covered Parking', icon: '🚗' },
        { name: '24/7 Security', icon: '🛡️' },
        { name: 'Power Backup', icon: '⚡' },
        { name: 'High Speed Elevators', icon: '🏢' },
        { name: 'Gym & Fitness Center', icon: '💪' },
        { name: 'Swimming Pool', icon: '🏊' },
        { name: 'Children Play Area', icon: '🎮' }
      ],
      nearbyPlaces: [
        { name: 'Bandra Railway Station', distance: '0.5 km', type: 'Transport', icon: '🚊' },
        { name: 'Linking Road Shopping', distance: '0.8 km', type: 'Shopping', icon: '🛍️' },
        { name: 'Lilavati Hospital', distance: '1.2 km', type: 'Healthcare', icon: '🏥' },
        { name: 'St. Andrews College', distance: '1.5 km', type: 'Education', icon: '🎓' },
        { name: 'Chhatrapati Shivaji Airport', distance: '6 km', type: 'Transport', icon: '✈️' },
        { name: 'BKC Business District', distance: '3 km', type: 'Business', icon: '🏢' }
      ],
      priceHistory: [
        { date: '2024-01-10', price: '₹95,000/month', action: 'Listed', change: null },
        { date: '2024-01-18', price: '₹85,000/month', action: 'Price Reduced', change: '-10.5%' }
      ],
      recentInquiries: [
        {
          id: 1,
          name: 'Amit Singh',
          phone: '+91 98765 43211',
          email: 'amit@email.com',
          date: '2024-01-21',
          time: '10:15 AM',
          message: 'Looking for immediate possession. Is the apartment available from February?',
          status: 'new',
          source: 'Website'
        },
        {
          id: 2,
          name: 'Neha Gupta',
          phone: '+91 87654 32108',
          email: 'neha@email.com',
          date: '2024-01-20',
          time: '3:45 PM',
          message: 'Is it available for 11 months lease? Can we schedule a viewing?',
          status: 'responded',
          source: 'Mobile App'
        }
      ],
      mediaItems: [
        { type: 'image', url: '/images/rental1-1.jpg', title: 'Living Room' },
        { type: 'image', url: '/images/rental1-2.jpg', title: 'Master Bedroom' },
        { type: 'image', url: '/images/rental1-3.jpg', title: 'Kitchen' },
        { type: 'image', url: '/images/rental1-4.jpg', title: 'Balcony View' }
      ],
      documents: [
        { name: 'Rental Agreement Template', type: 'PDF', size: '1.2 MB', verified: true },
        { name: 'Society NOC for Rental', type: 'PDF', size: '0.8 MB', verified: true },
        { name: 'Property Tax Receipt', type: 'PDF', size: '0.5 MB', verified: true },
        { name: 'Maintenance Records', type: 'PDF', size: '0.9 MB', verified: true }
      ],
      analytics: {
        totalViews: 743,
        uniqueVisitors: 521,
        inquiries: 18,
        favorites: 32,
        shares: 8,
        averageTimeOnPage: '3:45',
        bounceRate: '28%',
        conversionRate: '2.4%',
        viewsThisWeek: 89,
        inquiriesThisWeek: 4
      }
    }
  }

  return listings[id as keyof typeof listings] || null
}

export default function ListingDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [listing, setListing] = useState<any>(null)
  const [activeTab, setActiveTab] = useState('overview')
  const [showInquiryDetails, setShowInquiryDetails] = useState<number | null>(null)

  useEffect(() => {
    if (params.id) {
      const listingData = getListingData(params.id as string)
      if (listingData) {
        setListing(listingData)
      } else {
        router.push('/dashboard/listings')
      }
    }
  }, [params.id, router])

  if (!listing) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading listing details...</p>
        </div>
      </div>
    )
  }

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
      case 'active': return <CheckCircle2 size={16} />
      case 'pending': return <Clock size={16} />
      case 'sold': return <CheckCircle size={16} />
      case 'inactive': return <Pause size={16} />
      default: return <AlertCircle size={16} />
    }
  }

  const getInquiryStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-red-100 text-red-800'
      case 'responded': return 'bg-green-100 text-green-800'
      case 'follow-up': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all"
          >
            <ArrowLeft size={24} className="text-gray-600 dark:text-gray-400" />
          </button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
              {listing.title}
            </h1>
            <div className="flex items-center space-x-4 mt-2">
              <div className="flex items-center text-gray-600 dark:text-gray-400">
                <MapPin size={16} className="mr-1" />
                <span>{listing.location}</span>
              </div>
              <div className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-semibold border ${getStatusColor(listing.status)}`}>
                {getStatusIcon(listing.status)}
                <span className="capitalize">{listing.status}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-all">
            <Share2 size={20} />
          </button>
          <button className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-all">
            <Edit size={20} />
          </button>
          <button className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all">
            <Trash2 size={20} />
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
        <div className="bg-white dark:bg-gray-900 rounded-xl p-4 shadow-lg border border-gray-200 dark:border-gray-800">
          <div className="flex items-center space-x-2">
            <Eye className="text-blue-500" size={20} />
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Views</p>
              <p className="text-lg font-bold text-gray-900 dark:text-white">{listing.views}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-xl p-4 shadow-lg border border-gray-200 dark:border-gray-800">
          <div className="flex items-center space-x-2">
            <MessageCircle className="text-green-500" size={20} />
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Inquiries</p>
              <p className="text-lg font-bold text-gray-900 dark:text-white">{listing.inquiries}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-xl p-4 shadow-lg border border-gray-200 dark:border-gray-800">
          <div className="flex items-center space-x-2">
            <Heart className="text-red-500" size={20} />
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Favorites</p>
              <p className="text-lg font-bold text-gray-900 dark:text-white">{listing.favorites}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-xl p-4 shadow-lg border border-gray-200 dark:border-gray-800">
          <div className="flex items-center space-x-2">
            <Star className="text-yellow-500" size={20} />
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Rating</p>
              <p className="text-lg font-bold text-gray-900 dark:text-white">{listing.rating}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-xl p-4 shadow-lg border border-gray-200 dark:border-gray-800">
          <div className="flex items-center space-x-2">
            <Calendar className="text-purple-500" size={20} />
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Listed</p>
              <p className="text-lg font-bold text-gray-900 dark:text-white">
                {new Date(listing.listedDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-xl p-4 shadow-lg border border-gray-200 dark:border-gray-800">
          <div className="flex items-center space-x-2">
            <DollarSign className="text-green-500" size={20} />
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Price</p>
              <p className="text-lg font-bold text-green-600">{listing.price}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Left Column - Main Content */}
        <div className="xl:col-span-2 space-y-6">
          {/* Property Image Gallery */}
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
            <div className="h-96 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center">
              <Home size={96} className="text-gray-400" />
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {listing.mediaItems.length} Photos & Videos
                </p>
                <button className="text-green-600 hover:text-green-700 font-medium flex items-center space-x-1">
                  <Camera size={16} />
                  <span>View All</span>
                </button>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800">
            <div className="border-b border-gray-200 dark:border-gray-700">
              <nav className="flex space-x-8 px-6">
                {[
                  { id: 'overview', name: 'Overview', icon: Home },
                  { id: 'specifications', name: 'Specifications', icon: FileText },
                  { id: 'amenities', name: 'Amenities', icon: Sparkles },
                  { id: 'location', name: 'Location', icon: MapPin },
                  { id: 'analytics', name: 'Analytics', icon: BarChart3 }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 py-4 border-b-2 font-medium text-sm transition-all ${activeTab === tab.id
                        ? 'border-green-500 text-green-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                      }`}
                  >
                    <tab.icon size={16} />
                    <span>{tab.name}</span>
                  </button>
                ))}
              </nav>
            </div>

            <div className="p-6">
              {/* Overview Tab */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Description</h3>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                      {listing.description}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                      {listing.detailedDescription}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <Bed className="mx-auto mb-2 text-gray-600" size={24} />
                      <p className="text-sm text-gray-600 dark:text-gray-400">Bedrooms</p>
                      <p className="text-lg font-bold text-gray-900 dark:text-white">{listing.beds}</p>
                    </div>
                    <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <Bath className="mx-auto mb-2 text-gray-600" size={24} />
                      <p className="text-sm text-gray-600 dark:text-gray-400">Bathrooms</p>
                      <p className="text-lg font-bold text-gray-900 dark:text-white">{listing.baths}</p>
                    </div>
                    <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <Square className="mx-auto mb-2 text-gray-600" size={24} />
                      <p className="text-sm text-gray-600 dark:text-gray-400">Area</p>
                      <p className="text-lg font-bold text-gray-900 dark:text-white">{listing.area}</p>
                    </div>
                    <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <Building2 className="mx-auto mb-2 text-gray-600" size={24} />
                      <p className="text-sm text-gray-600 dark:text-gray-400">Type</p>
                      <p className="text-lg font-bold text-gray-900 dark:text-white">{listing.type}</p>
                    </div>
                  </div>

                  {/* Rental-specific Information */}
                  {listing.listingType === 'rent' && (
                    <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-6 border border-purple-200 dark:border-purple-800">
                      <h3 className="text-lg font-semibold text-purple-900 dark:text-purple-100 mb-4">Rental Details</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="text-center">
                          <p className="text-sm text-purple-600 dark:text-purple-400 mb-1">Security Deposit</p>
                          <p className="text-lg font-bold text-purple-900 dark:text-purple-100">{listing.securityDeposit}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm text-purple-600 dark:text-purple-400 mb-1">Lease Period</p>
                          <p className="text-lg font-bold text-purple-900 dark:text-purple-100">{listing.leasePeriod}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm text-purple-600 dark:text-purple-400 mb-1">Maintenance</p>
                          <p className="text-lg font-bold text-purple-900 dark:text-purple-100">{listing.maintenanceCharges}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Specifications Tab */}
              {activeTab === 'specifications' && (
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Property Specifications</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(listing.specifications).map(([key, value]: [string, any]) => (
                      <div key={key} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <span className="text-gray-600 dark:text-gray-400 font-medium">{key}</span>
                        <span className="text-gray-900 dark:text-white font-semibold">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Amenities Tab */}
              {activeTab === 'amenities' && (
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Amenities & Features</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    {listing.amenities.map((amenity: any, index: number) => (
                      <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <span className="text-2xl">{amenity.icon}</span>
                        <span className="text-gray-900 dark:text-white font-medium">{amenity.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Location Tab */}
              {activeTab === 'location' && (
                <div className="space-y-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Location & Nearby Places</h3>

                  <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <MapPin size={48} className="mx-auto mb-2 text-gray-400" />
                      <p className="text-gray-500">Interactive Map View</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {['Recreation', 'Business', 'Shopping', 'Healthcare', 'Education', 'Transport'].map((category) => {
                      const places = listing.nearbyPlaces.filter((place: any) => place.type === category)
                      if (places.length === 0) return null

                      return (
                        <div key={category}>
                          <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                            <span className="mr-2">{places[0]?.icon}</span>
                            {category}
                          </h4>
                          <div className="space-y-2">
                            {places.map((place: any, index: number) => (
                              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                <span className="text-gray-900 dark:text-white">{place.name}</span>
                                <span className="text-sm text-gray-500 dark:text-gray-400">{place.distance}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Analytics Tab */}
              {activeTab === 'analytics' && (
                <div className="space-y-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Performance Analytics</h3>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <p className="text-sm text-blue-600 dark:text-blue-400">Total Views</p>
                      <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">{listing.analytics.totalViews}</p>
                    </div>
                    <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <p className="text-sm text-green-600 dark:text-green-400">Unique Visitors</p>
                      <p className="text-2xl font-bold text-green-700 dark:text-green-300">{listing.analytics.uniqueVisitors}</p>
                    </div>
                    <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                      <p className="text-sm text-purple-600 dark:text-purple-400">Avg. Time</p>
                      <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">{listing.analytics.averageTimeOnPage}</p>
                    </div>
                    <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                      <p className="text-sm text-orange-600 dark:text-orange-400">Conversion</p>
                      <p className="text-2xl font-bold text-orange-700 dark:text-orange-300">{listing.analytics.conversionRate}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-3">This Week</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Views</span>
                          <span className="font-semibold text-gray-900 dark:text-white">{listing.analytics.viewsThisWeek}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Inquiries</span>
                          <span className="font-semibold text-gray-900 dark:text-white">{listing.analytics.inquiriesThisWeek}</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Engagement</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Bounce Rate</span>
                          <span className="font-semibold text-gray-900 dark:text-white">{listing.analytics.bounceRate}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Shares</span>
                          <span className="font-semibold text-gray-900 dark:text-white">{listing.analytics.shares}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="xl:col-span-1 space-y-6">
          {/* Price & Actions */}
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 p-6">
            <div className="text-center mb-6">
              {listing.originalPrice && (
                <p className="text-lg text-gray-400 line-through mb-1">{listing.originalPrice}</p>
              )}
              <p className="text-3xl font-black text-green-600 mb-2">{listing.price}</p>
              <p className="text-sm text-gray-500">
                ₹{Math.round(listing.priceValue / parseFloat(listing.area.replace(' sq ft', '').replace(',', '')))} per sq ft{listing.listingType === 'rent' ? '/month' : ''}
              </p>
              {listing.listingType === 'rent' && (
                <div className="mt-3 space-y-1">
                  <p className="text-xs text-gray-500">Security: {listing.securityDeposit}</p>
                  <p className="text-xs text-gray-500">Maintenance: {listing.maintenanceCharges}</p>
                </div>
              )}
            </div>

            <div className="space-y-3">
              <button className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold transition-all">
                Edit Listing
              </button>
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition-all">
                Boost Listing
              </button>
              <button className="w-full border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 py-3 rounded-lg font-semibold transition-all">
                Share Listing
              </button>
            </div>
          </div>

          {/* Recent Inquiries */}
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Recent Inquiries</h3>
              <span className="bg-red-100 text-red-600 px-2 py-1 rounded-full text-xs font-semibold">
                {listing.recentInquiries.filter((inq: any) => inq.status === 'new').length} New
              </span>
            </div>

            <div className="space-y-4">
              {listing.recentInquiries.slice(0, 3).map((inquiry: any) => (
                <div key={inquiry.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">{inquiry.name}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{inquiry.date} • {inquiry.time}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getInquiryStatusColor(inquiry.status)}`}>
                      {inquiry.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{inquiry.message}</p>
                  <div className="flex space-x-2">
                    <button className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-3 rounded-lg text-sm font-medium transition-all">
                      Respond
                    </button>
                    <button className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-all">
                      <Phone size={16} />
                    </button>
                    <button className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-all">
                      <Mail size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <Link href="/dashboard/inquiries" className="block text-center text-green-600 hover:text-green-700 font-medium mt-4">
              View All Inquiries
            </Link>
          </div>

          {/* Price History */}
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 p-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Price History</h3>
            <div className="space-y-3">
              {listing.priceHistory.map((entry: any, index: number) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">{entry.price}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{entry.action}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(entry.date).toLocaleDateString()}
                    </p>
                    {entry.change && (
                      <p className={`text-sm font-semibold ${entry.change.startsWith('-') ? 'text-red-600' : 'text-green-600'}`}>
                        {entry.change}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Documents */}
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 p-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Documents</h3>
            <div className="space-y-3">
              {listing.documents.map((doc: any, index: number) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <FileText className="text-gray-400" size={20} />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white text-sm">{doc.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{doc.type} • {doc.size}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {doc.verified && (
                      <CheckCircle className="text-green-500" size={16} />
                    )}
                    <button className="p-1 text-gray-600 hover:text-green-600 transition-all">
                      <Download size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-4 border-2 border-dashed border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-green-500 hover:text-green-600 py-3 rounded-lg font-medium transition-all flex items-center justify-center space-x-2">
              <Upload size={18} />
              <span>Upload Document</span>
            </button>
          </div>
        </div>
      </div>

      {/* SELLER-FOCUSED PRICING CAROUSEL - EXACT PLANS FROM PRICING PAGE */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 py-8 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-white mb-2">Seller Services & Plans</h2>
            <p className="text-green-100">Maximize your property's potential with our premium services</p>
          </div>

          <div className="relative">
            <div className="flex space-x-4 animate-scroll">
              {/* Property Due Diligence Service */}
              <div className="flex-shrink-0 w-80 bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mr-4">
                    <Shield size={24} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">Property Due Diligence</h3>
                    <p className="text-green-100 text-sm">₹15,000 <span className="line-through text-xs">₹20,000</span></p>
                  </div>
                </div>
                <p className="text-white text-sm mb-4">Complete legal & technical verification</p>
                <button
                  onClick={() => router.push('/dashboard/pricing')}
                  className="w-full bg-white text-blue-600 py-2 rounded-lg font-semibold hover:bg-blue-50 transition-all text-sm"
                >
                  Get Due Diligence
                </button>
              </div>

              {/* End-to-End Assistance Service */}
              <div className="flex-shrink-0 w-80 bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mr-4">
                    <Users size={24} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">End-to-End Assistance</h3>
                    <p className="text-green-100 text-sm">₹25,000 <span className="line-through text-xs">₹35,000</span></p>
                  </div>
                </div>
                <p className="text-white text-sm mb-4">Full property selling support</p>
                <button
                  onClick={() => router.push('/dashboard/pricing')}
                  className="w-full bg-white text-purple-600 py-2 rounded-lg font-semibold hover:bg-purple-50 transition-all text-sm"
                >
                  Get Full Service
                </button>
              </div>

              {/* GharBazaar Managed Seller Plan */}
              <div className="flex-shrink-0 w-80 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-xl p-6 border border-purple-300/30">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mr-4">
                    <Crown size={24} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">Managed Seller Plan</h3>
                    <p className="text-purple-100 text-sm">₹1,999 + 1%</p>
                  </div>
                </div>
                <p className="text-white text-sm mb-4">We bring qualified sellers to you</p>
                <button
                  onClick={() => router.push('/dashboard/pricing')}
                  className="w-full bg-white text-purple-600 py-2 rounded-lg font-semibold hover:bg-purple-50 transition-all text-sm"
                >
                  Get Qualified Sellers
                </button>
              </div>

              {/* Duplicate cards for seamless loop - EXACT SAME 3 CARDS */}
              <div className="flex-shrink-0 w-80 bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mr-4">
                    <Shield size={24} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">Property Due Diligence</h3>
                    <p className="text-green-100 text-sm">₹15,000 <span className="line-through text-xs">₹20,000</span></p>
                  </div>
                </div>
                <p className="text-white text-sm mb-4">Complete legal & technical verification</p>
                <button
                  onClick={() => router.push('/dashboard/pricing')}
                  className="w-full bg-white text-blue-600 py-2 rounded-lg font-semibold hover:bg-blue-50 transition-all text-sm"
                >
                  Get Due Diligence
                </button>
              </div>

              <div className="flex-shrink-0 w-80 bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mr-4">
                    <Users size={24} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">End-to-End Assistance</h3>
                    <p className="text-green-100 text-sm">₹25,000 <span className="line-through text-xs">₹35,000</span></p>
                  </div>
                </div>
                <p className="text-white text-sm mb-4">Full property selling support</p>
                <button
                  onClick={() => router.push('/dashboard/pricing')}
                  className="w-full bg-white text-purple-600 py-2 rounded-lg font-semibold hover:bg-purple-50 transition-all text-sm"
                >
                  Get Full Service
                </button>
              </div>

              <div className="flex-shrink-0 w-80 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-xl p-6 border border-purple-300/30">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mr-4">
                    <Crown size={24} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">Managed Seller Plan</h3>
                    <p className="text-purple-100 text-sm">₹1,999 + 1%</p>
                  </div>
                </div>
                <p className="text-white text-sm mb-4">We bring qualified sellers to you</p>
                <button
                  onClick={() => router.push('/dashboard/pricing')}
                  className="w-full bg-white text-purple-600 py-2 rounded-lg font-semibold hover:bg-purple-50 transition-all text-sm"
                >
                  Get Qualified Sellers
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}