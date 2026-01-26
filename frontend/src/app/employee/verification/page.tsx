'use client'

import { useState } from 'react'
import { 
  Home,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  MapPin,
  Bed,
  Bath,
  Square,
  Calendar,
  User,
  Phone,
  Camera,
  FileText,
  AlertCircle,
  ThumbsUp,
  ThumbsDown,
  Shield,
  Award,
  TrendingUp,
  Users,
  Crown,
  Zap,
  ArrowUpRight,
  Building2,
  Star,
  Download,
  MessageCircle
} from 'lucide-react'

export default function PropertyVerificationPage() {
  const [activeTab, setActiveTab] = useState<'pending' | 'approved' | 'rejected' | 'all'>('pending')
  const [selectedProperty, setSelectedProperty] = useState<number | null>(null)

  const properties = [
    {
      id: 1,
      title: 'Luxury Penthouse',
      location: 'Worli, Mumbai',
      owner: 'Rahul Sharma',
      phone: '+91 98765 43210',
      price: '₹8.5 Cr',
      status: 'pending',
      submittedDate: '2024-12-01T10:30:00',
      beds: 4,
      baths: 5,
      area: '3200 sq ft',
      priority: 'high',
      documents: ['Title Deed', 'Tax Receipt', 'NOC', 'Building Plan'],
      images: 5,
      verificationScore: 75,
      propertyType: 'Penthouse',
      featured: true
    },
    {
      id: 2,
      title: 'Modern Villa',
      location: 'Whitefield, Bangalore',
      owner: 'Priya Patel',
      phone: '+91 98765 43211',
      price: '₹3.8 Cr',
      status: 'pending',
      submittedDate: '2024-12-01T09:15:00',
      beds: 5,
      baths: 6,
      area: '4500 sq ft',
      priority: 'medium',
      documents: ['Title Deed', 'Building Plan', 'NOC'],
      images: 8,
      verificationScore: 85,
      propertyType: 'Villa',
      featured: false
    },
    {
      id: 3,
      title: 'Sea View Apartment',
      location: 'Marine Drive, Mumbai',
      owner: 'Amit Kumar',
      phone: '+91 98765 43212',
      price: '₹6.2 Cr',
      status: 'approved',
      submittedDate: '2024-11-30T14:20:00',
      beds: 3,
      baths: 4,
      area: '2800 sq ft',
      priority: 'low',
      documents: ['Title Deed', 'Tax Receipt', 'NOC', 'Building Plan'],
      images: 12,
      verificationScore: 95,
      verifiedBy: 'You',
      verifiedDate: '2024-11-30T16:00:00',
      propertyType: 'Apartment',
      featured: true
    },
    {
      id: 4,
      title: 'Garden Villa',
      location: 'Gurgaon, Delhi NCR',
      owner: 'Sneha Reddy',
      phone: '+91 98765 43213',
      price: '₹4.2 Cr',
      status: 'rejected',
      submittedDate: '2024-11-29T11:30:00',
      beds: 4,
      baths: 5,
      area: '3800 sq ft',
      priority: 'medium',
      documents: ['Title Deed', 'Tax Receipt'],
      images: 6,
      verificationScore: 45,
      verifiedBy: 'You',
      verifiedDate: '2024-11-29T12:00:00',
      rejectionReason: 'Incomplete documentation',
      propertyType: 'Villa',
      featured: false
    }
  ]

  const filteredProperties = activeTab === 'all' 
    ? properties 
    : properties.filter(p => p.status === activeTab)

  const stats = {
    all: properties.length,
    pending: properties.filter(p => p.status === 'pending').length,
    approved: properties.filter(p => p.status === 'approved').length,
    rejected: properties.filter(p => p.status === 'rejected').length
  }

  const selectedProp = properties.find(p => p.id === selectedProperty)

  const getStatusBadge = (status: string) => {
    const badges = {
      pending: { color: 'yellow', icon: Clock, label: 'Pending' },
      approved: { color: 'green', icon: CheckCircle, label: 'Approved' },
      rejected: { color: 'red', icon: XCircle, label: 'Rejected' }
    }
    const badge = badges[status as keyof typeof badges]
    return (
      <div className={`flex items-center space-x-1 ${
        badge.color === 'yellow' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400' :
        badge.color === 'green' ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' :
        'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
      } px-3 py-1 rounded-full text-xs font-semibold`}>
        <badge.icon size={12} />
        <span>{badge.label}</span>
      </div>
    )
  }

  const getPriorityBadge = (priority: string) => {
    const colors = {
      high: 'bg-red-500',
      medium: 'bg-yellow-500',
      low: 'bg-blue-500'
    }
    return (
      <span className={`inline-block w-2 h-2 rounded-full ${colors[priority as keyof typeof colors]}`} />
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-green-400/20 to-emerald-600/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-20 right-0 w-80 h-80 bg-gradient-to-bl from-blue-400/20 to-teal-600/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 bg-gradient-to-r from-slate-900 via-green-900 to-emerald-900 text-white">
          <div className="max-w-7xl mx-auto px-6 py-12">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-20 h-20 bg-gradient-to-br from-green-500 via-emerald-500 to-teal-600 rounded-3xl flex items-center justify-center shadow-2xl border-2 border-white/20">
                  <Home className="text-white" size={36} />
                </div>
                <div>
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-green-300 font-semibold text-sm">Verification System Active</span>
                  </div>
                  <h1 className="text-4xl lg:text-6xl font-black leading-tight bg-gradient-to-r from-white via-green-100 to-emerald-100 bg-clip-text text-transparent pb-2">
                    Property Verification
                  </h1>
                  <p className="text-xl text-green-100 leading-relaxed">
                    Advanced AI-powered property verification and document validation
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Enhanced Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { 
              title: 'Total Properties', 
              value: stats.all, 
              icon: Home, 
              gradient: 'from-green-500 via-emerald-600 to-teal-700', 
              change: '+15 today',
              trend: 'up',
              description: 'All submissions'
            },
            { 
              title: 'Pending Review', 
              value: stats.pending, 
              icon: Clock, 
              gradient: 'from-yellow-500 via-orange-600 to-red-700', 
              change: 'Needs attention',
              trend: 'neutral',
              description: 'Awaiting verification'
            },
            { 
              title: 'Approved', 
              value: stats.approved, 
              icon: CheckCircle, 
              gradient: 'from-green-500 via-emerald-600 to-teal-700', 
              change: '+12 this week',
              trend: 'up',
              description: 'Successfully verified'
            },
            { 
              title: 'Rejected', 
              value: stats.rejected, 
              icon: XCircle, 
              gradient: 'from-red-500 via-pink-600 to-rose-700', 
              change: 'Quality maintained',
              trend: 'down',
              description: 'Failed verification'
            }
          ].map((stat, index) => (
            <div key={index} className="group relative bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-gray-200/50 dark:border-gray-700/50 hover:shadow-3xl transition-all duration-500 hover:-translate-y-2 hover:scale-105 cursor-pointer overflow-hidden">
              {/* Background Gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-3xl`}></div>
              
              {/* Icon */}
              <div className={`relative w-16 h-16 rounded-2xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-xl mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <stat.icon className="text-white" size={28} />
              </div>
              
              {/* Content */}
              <div className="relative">
                <p className="text-gray-600 dark:text-gray-400 text-sm font-semibold mb-2">{stat.title}</p>
                <p className="text-4xl font-black text-gray-900 dark:text-white mb-2 leading-none pb-1">
                  {stat.value}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">{stat.description}</p>
                <div className={`flex items-center space-x-2 text-sm font-semibold ${
                  stat.trend === 'up' ? 'text-green-600' : 
                  stat.trend === 'down' ? 'text-red-600' : 'text-blue-600'
                }`}>
                  <div className={`w-2 h-2 rounded-full ${
                    stat.trend === 'up' ? 'bg-green-500' : 
                    stat.trend === 'down' ? 'bg-red-500' : 'bg-blue-500'
                  } animate-pulse`}></div>
                  <span>{stat.change}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Search & Filter Section */}
        <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-gray-200/50 dark:border-gray-700/50">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 via-teal-500 to-green-600 rounded-2xl flex items-center justify-center shadow-xl">
                <Search className="text-white" size={28} />
              </div>
              <div>
                <h2 className="text-3xl font-black text-gray-900 dark:text-white leading-[1.2] pb-1">Property Management</h2>
                <p className="text-gray-600 dark:text-gray-400">Advanced verification and validation system</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search by property title, location, owner name, or type..."
                className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl focus:ring-2 focus:ring-green-500 text-lg"
              />
            </div>
            <button className="flex items-center space-x-2 px-6 py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-2xl font-bold transition-all shadow-lg hover:shadow-xl">
              <Filter size={20} />
              <span>Advanced Filters</span>
            </button>
          </div>

          <div className="flex space-x-2 overflow-x-auto">
            {[
              { key: 'pending', label: 'Pending', count: stats.pending, color: 'yellow' },
              { key: 'approved', label: 'Approved', count: stats.approved, color: 'green' },
              { key: 'rejected', label: 'Rejected', count: stats.rejected, color: 'red' },
              { key: 'all', label: 'All Properties', count: stats.all, color: 'blue' }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`flex-1 min-w-[140px] px-6 py-4 rounded-2xl font-bold transition-all ${
                  activeTab === tab.key
                    ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-xl'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>
        </div>

        {/* Properties Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {filteredProperties.map((property) => (
            <div
              key={property.id}
              onClick={() => setSelectedProperty(property.id)}
              className={`group relative bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl overflow-hidden shadow-2xl border cursor-pointer transition-all duration-500 hover:shadow-3xl hover:-translate-y-2 ${
                selectedProperty === property.id
                  ? 'border-green-500 ring-2 ring-green-500 shadow-3xl'
                  : 'border-gray-200/50 dark:border-gray-700/50 hover:border-green-300'
              }`}
            >
              {/* Property Image */}
              <div className="relative h-56 bg-gradient-to-br from-gray-200 to-gray-400 dark:from-gray-600 dark:to-gray-800 overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Building2 size={64} className="text-gray-400" />
                </div>
                
                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  {getPriorityBadge(property.priority)}
                  {property.featured && (
                    <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center space-x-1 shadow-lg">
                      <Crown size={10} />
                      <span>Featured</span>
                    </div>
                  )}
                </div>

                {/* Status Badge */}
                <div className="absolute top-4 right-4">
                  {getStatusBadge(property.status)}
                </div>

                {/* Images Count */}
                <div className="absolute bottom-4 left-4 flex items-center space-x-2 bg-black/60 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs">
                  <Camera size={12} />
                  <span>{property.images} photos</span>
                </div>

                {/* Verification Score */}
                <div className="absolute bottom-4 right-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg">
                  {property.verificationScore}% Score
                </div>
              </div>

              {/* Property Details */}
              <div className="p-6">
                <div className="mb-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-green-600 transition-colors leading-[1.2] pb-1">
                      {property.title}
                    </h3>
                    <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-2 py-1 rounded-full text-xs font-semibold">
                      {property.propertyType}
                    </span>
                  </div>
                  <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm mb-3">
                    <MapPin size={14} className="mr-1" />
                    <span>{property.location}</span>
                  </div>
                </div>

                {/* Owner Info */}
                <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-4 mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {property.owner.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white text-sm">{property.owner}</p>
                      <p className="text-gray-500 dark:text-gray-400 text-xs">{property.phone}</p>
                    </div>
                  </div>
                </div>
                
                {/* Property Features */}
                <div className="flex items-center justify-between mb-4 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center space-x-1">
                    <Bed size={14} />
                    <span>{property.beds}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Bath size={14} />
                    <span>{property.baths}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Square size={14} />
                    <span className="text-xs">{property.area}</span>
                  </div>
                </div>

                {/* Documents Count */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                    <FileText size={14} />
                    <span>{property.documents.length} documents</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-16 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all ${
                          property.verificationScore >= 80 ? 'bg-green-500' :
                          property.verificationScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${property.verificationScore}%` }}
                      />
                    </div>
                    <span className="text-xs font-semibold text-gray-900 dark:text-white">{property.verificationScore}%</span>
                  </div>
                </div>
                
                {/* Price & Action */}
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Property Value</p>
                      <p className="text-2xl font-black text-green-600 leading-[1.1] pb-1">{property.price}</p>
                    </div>
                    {property.status === 'pending' && (
                      <button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-4 py-2 rounded-xl font-bold transition-all shadow-lg hover:shadow-xl flex items-center space-x-2">
                        <Shield size={16} />
                        <span>Verify</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Detail Modal */}
      {selectedProp && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-3xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto border border-gray-200/50 dark:border-gray-700/50">
            {/* Header */}
            <div className="p-8 border-b border-gray-200 dark:border-gray-800 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center space-x-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-3xl shadow-xl">
                    {selectedProp.title.charAt(0)}
                  </div>
                  <div>
                    <h2 className="text-3xl font-black text-gray-900 dark:text-white leading-[1.2] pb-2">
                      {selectedProp.title}
                    </h2>
                    <div className="flex items-center space-x-3 mb-2">
                      {getStatusBadge(selectedProp.status)}
                      <span className="text-sm text-gray-500">•</span>
                      <span className="text-sm text-gray-600 dark:text-gray-400 font-semibold">
                        {selectedProp.propertyType}
                      </span>
                    </div>
                    <div className="flex items-center text-gray-600 dark:text-gray-400">
                      <MapPin size={16} className="mr-2" />
                      <span>{selectedProp.location}</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedProperty(null)}
                  className="w-12 h-12 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full flex items-center justify-center transition-all"
                >
                  <XCircle size={24} className="text-gray-600 dark:text-gray-400" />
                </button>
              </div>

              {/* Property Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center space-x-3 p-4 bg-white/50 dark:bg-gray-800/50 rounded-2xl">
                  <Bed size={20} className="text-green-500" />
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Bedrooms</p>
                    <p className="font-bold text-gray-900 dark:text-white">{selectedProp.beds}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-4 bg-white/50 dark:bg-gray-800/50 rounded-2xl">
                  <Bath size={20} className="text-blue-500" />
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Bathrooms</p>
                    <p className="font-bold text-gray-900 dark:text-white">{selectedProp.baths}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-4 bg-white/50 dark:bg-gray-800/50 rounded-2xl">
                  <Square size={20} className="text-purple-500" />
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Area</p>
                    <p className="font-bold text-gray-900 dark:text-white">{selectedProp.area}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-4 bg-white/50 dark:bg-gray-800/50 rounded-2xl">
                  <Camera size={20} className="text-orange-500" />
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Photos</p>
                    <p className="font-bold text-gray-900 dark:text-white">{selectedProp.images}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-8 space-y-8">
              {/* Owner Details */}
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-6">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                  <User className="mr-3 text-green-500" size={24} />
                  Owner Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                      {selectedProp.owner.charAt(0)}
                    </div>
                    <div>
                      <p className="text-lg font-bold text-gray-900 dark:text-white">{selectedProp.owner}</p>
                      <p className="text-gray-600 dark:text-gray-400">Property Owner</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone size={20} className="text-blue-500" />
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Contact Number</p>
                      <p className="font-semibold text-gray-900 dark:text-white">{selectedProp.phone}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Documents */}
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                  <FileText className="mr-3 text-blue-500" size={24} />
                  Submitted Documents
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedProp.documents.map((doc, index) => (
                    <div key={index} className="group flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-2xl hover:shadow-lg transition-all cursor-pointer">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                          <FileText className="text-white" size={20} />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-white">{doc}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Document verified</p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 font-semibold">
                          <Eye size={16} />
                          <span>View</span>
                        </button>
                        <button className="flex items-center space-x-1 text-green-600 hover:text-green-700 font-semibold">
                          <Download size={16} />
                          <span>Download</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Verification Score */}
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <Award className="text-yellow-500" size={24} />
                    <span className="text-2xl font-bold text-gray-900 dark:text-white">
                      AI Verification Score
                    </span>
                  </div>
                  <span className="text-4xl font-black text-gray-900 dark:text-white">
                    {selectedProp.verificationScore}%
                  </span>
                </div>
                <div className="w-full h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mb-4">
                  <div 
                    className={`h-full transition-all duration-1000 ${
                      selectedProp.verificationScore >= 80 ? 'bg-gradient-to-r from-green-500 to-emerald-600' :
                      selectedProp.verificationScore >= 60 ? 'bg-gradient-to-r from-yellow-500 to-orange-600' : 
                      'bg-gradient-to-r from-red-500 to-pink-600'
                    }`}
                    style={{ width: `${selectedProp.verificationScore}%` }}
                  />
                </div>
                <p className="text-lg text-gray-600 dark:text-gray-400">
                  {selectedProp.verificationScore >= 80 ? 'Excellent verification quality - Ready for approval' :
                   selectedProp.verificationScore >= 60 ? 'Good verification quality - Minor issues to review' : 
                   'Requires manual review - Multiple issues detected'}
                </p>
              </div>

              {/* Actions */}
              {selectedProp.status === 'pending' && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-lg font-bold text-gray-900 dark:text-white mb-3">
                      Verification Comments
                    </label>
                    <textarea
                      rows={4}
                      placeholder="Add your verification notes and feedback..."
                      className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl focus:ring-2 focus:ring-green-500 text-lg"
                    />
                  </div>
                  
                  <div className="flex gap-4">
                    <button className="flex-1 flex items-center justify-center space-x-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-4 rounded-2xl font-bold transition-all shadow-lg hover:shadow-xl">
                      <ThumbsUp size={24} />
                      <span>Approve Property</span>
                    </button>
                    <button className="flex-1 flex items-center justify-center space-x-3 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white px-8 py-4 rounded-2xl font-bold transition-all shadow-lg hover:shadow-xl">
                      <ThumbsDown size={24} />
                      <span>Reject Property</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Verification Info */}
              {selectedProp.status !== 'pending' && (
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                        {selectedProp.status === 'approved' ? 'Approved' : 'Rejected'} by
                      </p>
                      <p className="text-xl font-bold text-gray-900 dark:text-white">
                        {selectedProp.verifiedBy}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Date</p>
                      <p className="text-xl font-bold text-gray-900 dark:text-white">
                        {new Date(selectedProp.verifiedDate!).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  {selectedProp.rejectionReason && (
                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Rejection Reason:</p>
                      <p className="text-lg font-semibold text-red-600 dark:text-red-400">
                        {selectedProp.rejectionReason}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
