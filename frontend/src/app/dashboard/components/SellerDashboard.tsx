'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  Eye, 
  Heart, 
  Gavel, 
  MapPin, 
  Bed, 
  Bath, 
  Square, 
  Award,
  Zap,
  ChevronRight,
  Sparkles,
  Users,
  Calculator,
  PlayCircle,
  Compass,
  Bookmark,
  Wallet,
  TrendingUp,
  Home,
  MessageCircle,
  Clock,
  CheckCircle,
  Star,
  ArrowUpRight,
  Filter,
  Bell,
  Building2,
  Plus,
  Phone,
  Calendar,
  DollarSign,
  Search,
  Target,
  Shield,
  Briefcase,
  Camera,
  FileText,
  Map,
  Lightbulb,
  Rocket,
  Crown,
  Gift,
  Headphones,
  BarChart3,
  Activity,
  Upload,
  Edit,
  TrendingDown,
  Package,
  Percent,
  Key,
  UserCheck
} from 'lucide-react'

interface SellerDashboardProps {
  user: any
  currentTime: Date
}

export default function SellerDashboard({ user, currentTime }: SellerDashboardProps) {
  const userName = user?.name || user?.displayName || user?.email?.split('@')[0] || 'User'
  const [activeTab, setActiveTab] = useState('overview')
  const [searchQuery, setSearchQuery] = useState('')

  const getGreeting = () => {
    const hour = currentTime.getHours()
    if (hour < 12) return 'Good Morning'
    if (hour < 17) return 'Good Afternoon'
    return 'Good Evening'
  }

  // Enhanced Seller Stats
  const sellerStats = [
    { 
      title: 'Active Listings', 
      value: '24', 
      icon: Building2, 
      gradient: 'from-blue-500 via-blue-600 to-indigo-700', 
      change: '+3 this week',
      trend: 'up',
      description: 'Properties for sale'
    },
    { 
      title: 'Total Views', 
      value: '12.8K', 
      icon: Eye, 
      gradient: 'from-green-500 via-emerald-600 to-teal-700', 
      change: '+1.2K this month',
      trend: 'up',
      description: 'Property impressions'
    },
    { 
      title: 'Inquiries Received', 
      value: '156', 
      icon: MessageCircle, 
      gradient: 'from-orange-500 via-amber-600 to-yellow-700', 
      change: '+23 new leads',
      trend: 'up',
      description: 'Buyer interest'
    },
    { 
      title: 'Sales Revenue', 
      value: '₹8.2Cr', 
      icon: DollarSign, 
      gradient: 'from-purple-500 via-violet-600 to-indigo-700', 
      change: '+₹1.5Cr this quarter',
      trend: 'up',
      description: 'Total earnings'
    }
  ]

  // Premium Seller Properties
  const sellerProperties = [
    { 
      id: 1,
      title: 'Luxury Penthouse', 
      location: 'Worli, Mumbai', 
      price: '₹12.5 Cr', 
      originalPrice: '₹14.2 Cr',
      beds: 4, 
      baths: 5, 
      area: '4200 sq ft',
      type: 'Penthouse',
      status: 'active',
      views: 2847,
      inquiries: 23,
      likes: 156,
      daysListed: 15,
      priceReduced: true,
      featured: true,
      verified: true,
      virtualTour: true,
      photos: 45,
      lastUpdated: '2 days ago'
    },
    { 
      id: 2,
      title: 'Garden Paradise Villa', 
      location: 'Whitefield, Bangalore', 
      price: '₹4.8 Cr', 
      originalPrice: null,
      beds: 5, 
      baths: 6, 
      area: '5500 sq ft',
      type: 'Villa',
      status: 'active',
      views: 1923,
      inquiries: 18,
      likes: 89,
      daysListed: 8,
      priceReduced: false,
      featured: true,
      verified: true,
      virtualTour: false,
      photos: 32,
      lastUpdated: '1 day ago'
    },
    { 
      id: 3,
      title: 'Marina Bay Residences', 
      location: 'Marine Drive, Mumbai', 
      price: '₹8.9 Cr', 
      originalPrice: null,
      beds: 3, 
      baths: 4, 
      area: '3400 sq ft',
      type: 'Apartment',
      status: 'under_offer',
      views: 3156,
      inquiries: 45,
      likes: 234,
      daysListed: 22,
      priceReduced: false,
      featured: true,
      verified: true,
      virtualTour: true,
      photos: 38,
      lastUpdated: '3 hours ago'
    }
  ]

  // Market Performance Data
  const marketPerformance = [
    {
      location: 'Mumbai',
      avgDays: '45 days',
      successRate: '92%',
      avgPrice: '₹18,500/sq ft',
      demand: 'High',
      recommendation: 'Premium Pricing'
    },
    {
      location: 'Bangalore',
      avgDays: '38 days',
      successRate: '88%',
      avgPrice: '₹8,200/sq ft',
      demand: 'Very High',
      recommendation: 'Quick Sale'
    },
    {
      location: 'Pune',
      avgDays: '52 days',
      successRate: '85%',
      avgPrice: '₹6,800/sq ft',
      demand: 'Medium',
      recommendation: 'Competitive Pricing'
    }
  ]

  // Smart Seller Alerts
  const sellerAlerts = [
    {
      id: 1,
      type: 'high_interest',
      title: 'High Interest Property!',
      property: 'Marina Bay Residences',
      message: '5 new inquiries in last 24 hours',
      time: '2 hours ago',
      urgent: true,
      icon: TrendingUp,
      color: 'green'
    },
    {
      id: 2,
      type: 'price_suggestion',
      title: 'Price Optimization',
      property: 'Luxury Penthouse',
      message: 'Consider reducing price by 8% for faster sale',
      time: '4 hours ago',
      urgent: false,
      icon: Target,
      color: 'orange'
    },
    {
      id: 3,
      type: 'viewing_scheduled',
      title: 'Site Visit Scheduled',
      property: 'Garden Paradise Villa',
      message: 'Premium buyer visit tomorrow at 3 PM',
      time: '1 day ago',
      urgent: false,
      icon: Calendar,
      color: 'blue'
    }
  ]

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { color: 'green', label: 'Active', icon: CheckCircle },
      under_offer: { color: 'orange', label: 'Under Offer', icon: Clock },
      sold: { color: 'blue', label: 'Sold', icon: Award },
      draft: { color: 'gray', label: 'Draft', icon: Edit }
    }
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.draft
    return (
      <div className={`flex items-center space-x-1 bg-${config.color}-100 dark:bg-${config.color}-900/30 text-${config.color}-600 dark:text-${config.color}-400 px-2 py-1 rounded-full text-xs font-semibold`}>
        <config.icon size={10} />
        <span>{config.label}</span>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-emerald-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-800">
      {/* Ultra-Modern Hero Section */}
      <div className="relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-green-400/20 to-emerald-600/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-20 right-0 w-80 h-80 bg-gradient-to-bl from-blue-400/20 to-indigo-600/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
          <div className="absolute bottom-0 left-1/3 w-72 h-72 bg-gradient-to-tr from-purple-400/15 to-violet-600/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '4s'}}></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 bg-gradient-to-r from-slate-900 via-green-900 to-emerald-900 text-white">
          <div className="max-w-7xl mx-auto px-6 py-12">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
              {/* Welcome Section */}
              <div className="lg:col-span-2">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-green-500 via-emerald-500 to-teal-600 rounded-3xl flex items-center justify-center shadow-2xl border-2 border-white/20">
                    <Building2 className="text-white" size={36} />
                  </div>
                  <div>
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-green-300 font-semibold text-sm">Premium Seller Active</span>
                    </div>
                    <h1 className="text-4xl lg:text-6xl font-black leading-tight bg-gradient-to-r from-white via-green-100 to-emerald-100 bg-clip-text text-transparent pb-2">
                      {getGreeting()}, {userName}! 
                    </h1>
                  </div>
                </div>
                
                <p className="text-xl text-green-100 mb-8 leading-relaxed max-w-2xl">
                  Your property portfolio is performing excellently. You have <span className="font-bold text-white">23 new inquiries</span> and <span className="font-bold text-yellow-300">₹1.2Cr in negotiations</span> this week.
                </p>
                
                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/dashboard/listings" className="group bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 hover:from-green-700 hover:via-emerald-700 hover:to-teal-700 px-8 py-4 rounded-2xl font-bold transition-all flex items-center justify-center space-x-3 shadow-2xl hover:shadow-3xl hover:scale-105">
                    <Building2 size={24} />
                    <span>Manage Listings</span>
                    <ArrowUpRight size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </Link>
                  
                  <Link href="/dashboard/listings/new" className="group bg-white/10 hover:bg-white/20 backdrop-blur-xl px-8 py-4 rounded-2xl font-bold transition-all flex items-center justify-center space-x-3 border border-white/20 hover:scale-105">
                    <Plus size={24} />
                    <span>Add Property</span>
                    <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm">New</span>
                  </Link>
                </div>
              </div>
              
              {/* Compact Plan Widget */}
              <div className="lg:col-span-1">
                <div className="bg-white/10 backdrop-blur-2xl rounded-3xl p-6 border border-white/20 shadow-2xl">
                  {/* Plan Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-emerald-500 rounded-xl flex items-center justify-center">
                        <Crown className="text-white" size={16} />
                      </div>
                      <div>
                        <h3 className="text-white font-bold text-sm leading-[1.1] pb-1">Premium Seller Plan</h3>
                        <p className="text-green-200 text-xs">Active Subscription</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-black text-white leading-[1.1] pb-1">₹4,999</p>
                      <p className="text-green-200 text-xs">per month</p>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-green-200 text-xs">Plan Progress</span>
                      <span className="text-white font-bold text-xs">75%</span>
                    </div>
                    <div className="w-full bg-white/20 rounded-full h-2 overflow-hidden">
                      <div className="bg-gradient-to-r from-green-400 to-emerald-500 h-full rounded-full transition-all duration-1000 ease-out" style={{width: '75%'}}></div>
                    </div>
                  </div>
                  
                  {/* Compact Stats */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between p-2 bg-white/10 rounded-xl">
                      <div className="flex items-center space-x-2">
                        <Calendar className="text-yellow-400" size={14} />
                        <span className="text-green-200 text-xs">Days Left</span>
                      </div>
                      <span className="font-bold text-yellow-300 text-sm">18</span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-white/10 rounded-xl">
                      <div className="flex items-center space-x-2">
                        <Building2 className="text-blue-400" size={14} />
                        <span className="text-green-200 text-xs">Listings</span>
                      </div>
                      <span className="font-bold text-blue-300 text-sm">24/50</span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-white/10 rounded-xl">
                      <div className="flex items-center space-x-2">
                        <MessageCircle className="text-purple-400" size={14} />
                        <span className="text-green-200 text-xs">Support</span>
                      </div>
                      <span className="font-bold text-purple-300 text-sm">24/7</span>
                    </div>
                  </div>

                  {/* Compact Renew Button */}
                  <Link href="/dashboard/pricing" className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-2 rounded-xl font-bold transition-all flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl hover:scale-105 text-sm">
                    <Zap size={14} />
                    <span>Upgrade Plan</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Dashboard Content */}
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Enhanced Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {sellerStats.map((stat, index) => (
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

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Left Column - Property Management */}
          <div className="xl:col-span-3 space-y-8">
            {/* Property Management Section */}
            <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-gray-200/50 dark:border-gray-700/50">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 via-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-xl">
                    <Building2 className="text-white" size={28} />
                  </div>
                  <div>
                    <h2 className="text-3xl font-black text-gray-900 dark:text-white leading-[1.2] pb-1">Property Manager</h2>
                    <p className="text-gray-600 dark:text-gray-400">Optimize your listings for maximum visibility</p>
                  </div>
                </div>
                <div className="hidden lg:flex items-center space-x-2 bg-green-100 dark:bg-green-900/30 px-4 py-2 rounded-full">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-green-700 dark:text-green-300 font-semibold text-sm">All Systems Active</span>
                </div>
              </div>
              
              {/* Quick Actions */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {[
                  { title: 'Add Property', icon: Plus, value: 'New Listing', color: 'green', action: 'Create' },
                  { title: 'Bulk Upload', icon: Upload, value: 'Multiple', color: 'blue', action: 'Import' },
                  { title: 'Price Analysis', icon: BarChart3, value: 'Market Data', color: 'purple', action: 'Analyze' },
                  { title: 'Performance', icon: TrendingUp, value: 'Analytics', color: 'orange', action: 'View' }
                ].map((action, index) => (
                  <div key={index} className="group bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-2xl p-6 hover:shadow-xl transition-all cursor-pointer hover:scale-105 border border-gray-200 dark:border-gray-600">
                    <div className={`w-12 h-12 bg-gradient-to-br ${
                      action.color === 'green' ? 'from-green-500 to-emerald-600' :
                      action.color === 'blue' ? 'from-blue-500 to-indigo-600' :
                      action.color === 'purple' ? 'from-purple-500 to-pink-600' :
                      'from-orange-500 to-red-600'
                    } rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
                      <action.icon className="text-white" size={20} />
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1 font-semibold">{action.title}</p>
                    <p className="font-bold text-gray-900 dark:text-white text-lg mb-2 leading-[1.1] pb-1">{action.value}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{action.action}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* My Properties Showcase */}
            <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-gray-200/50 dark:border-gray-700/50">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl">
                    <Home className="text-white" size={28} />
                  </div>
                  <div>
                    <h2 className="text-3xl font-black text-gray-900 dark:text-white leading-[1.2] pb-1">My Properties</h2>
                    <p className="text-gray-600 dark:text-gray-400">Manage and track your listings</p>
                  </div>
                </div>
                <Link href="/dashboard/listings" className="group bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg hover:shadow-xl flex items-center space-x-2">
                  <span>View All</span>
                  <ArrowUpRight size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </Link>
              </div>
              
              {/* Horizontal Scrollable Container */}
              <div className="overflow-x-auto pb-4">
                <div className="flex space-x-6 min-w-max">
                  {sellerProperties.map((property) => (
                    <div key={property.id} className="group relative bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-xl hover:shadow-3xl transition-all duration-500 hover:-translate-y-2 border border-gray-200 dark:border-gray-700 hover:border-green-500 w-96 flex-shrink-0">
                      {/* Property Image - Top */}
                      <div className="relative h-48 bg-gradient-to-br from-gray-200 to-gray-400 dark:from-gray-600 dark:to-gray-800 overflow-hidden">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Building2 size={48} className="text-gray-400" />
                        </div>
                        
                        {/* Badges */}
                        <div className="absolute top-3 left-3 flex flex-col gap-2">
                          {property.verified && (
                            <div className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center space-x-1 shadow-lg">
                              <CheckCircle size={10} />
                              <span>Verified</span>
                            </div>
                          )}
                          {property.featured && (
                            <div className="bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg">
                              Featured
                            </div>
                          )}
                          {property.priceReduced && (
                            <div className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg">
                              Price Reduced
                            </div>
                          )}
                        </div>

                        {/* Status */}
                        <div className="absolute top-3 right-3">
                          {getStatusBadge(property.status)}
                        </div>

                        {/* Actions */}
                        <div className="absolute bottom-3 right-3 flex space-x-2">
                          <button className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-all shadow-lg group-hover:scale-110">
                            <Edit size={14} className="text-gray-600 hover:text-blue-500 transition-colors" />
                          </button>
                          {property.virtualTour && (
                            <button className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center hover:bg-green-600 transition-all shadow-lg group-hover:scale-110">
                              <PlayCircle size={14} />
                            </button>
                          )}
                        </div>

                        {/* Stats */}
                        <div className="absolute bottom-3 left-3 flex space-x-2">
                          <div className="bg-black/60 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs flex items-center space-x-1">
                            <Eye size={10} />
                            <span>{property.views}</span>
                          </div>
                          <div className="bg-black/60 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs flex items-center space-x-1">
                            <MessageCircle size={10} />
                            <span>{property.inquiries}</span>
                          </div>
                        </div>
                      </div>

                      {/* Property Details - Bottom */}
                      <div className="p-5">
                        <div className="mb-4">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-green-600 transition-colors leading-[1.2] pb-1 truncate">
                              {property.title}
                            </h3>
                            <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-2 py-1 rounded-full text-xs font-semibold flex-shrink-0">
                              {property.type}
                            </span>
                          </div>
                          <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm mb-3">
                            <MapPin size={14} className="mr-1 flex-shrink-0" />
                            <span className="truncate">{property.location}</span>
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

                        {/* Performance Metrics */}
                        <div className="flex justify-between mb-4 text-xs">
                          <div className="text-center">
                            <p className="font-bold text-gray-900 dark:text-white">{property.daysListed}</p>
                            <p className="text-gray-500">Days Listed</p>
                          </div>
                          <div className="text-center">
                            <p className="font-bold text-gray-900 dark:text-white">{property.photos}</p>
                            <p className="text-gray-500">Photos</p>
                          </div>
                          <div className="text-center">
                            <p className="font-bold text-gray-900 dark:text-white">{property.likes}</p>
                            <p className="text-gray-500">Likes</p>
                          </div>
                        </div>
                        
                        {/* Price & Action */}
                        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                          <div className="mb-3">
                            {property.originalPrice && (
                              <p className="text-sm text-gray-400 line-through mb-1">{property.originalPrice}</p>
                            )}
                            <p className="text-2xl font-black text-green-600 leading-[1.1] pb-1">{property.price}</p>
                            <p className="text-xs text-gray-500">Last updated: {property.lastUpdated}</p>
                          </div>
                          <Link href={`/dashboard/listings/${property.id}`} className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-4 py-3 rounded-xl font-bold transition-all flex items-center justify-center space-x-2 group shadow-lg hover:shadow-xl text-sm">
                            <span>Manage</span>
                            <ArrowUpRight size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="xl:col-span-1 space-y-6">

            {/* Smart Alerts */}
            <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-gray-200/50 dark:border-gray-700/50">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center leading-[1.2] pb-1">
                  <Bell className="mr-2 text-green-500" size={20} />
                  Smart Alerts
                </h3>
                <span className="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-3 py-1 rounded-full text-xs font-bold">
                  {sellerAlerts.filter(alert => alert.urgent).length} Urgent
                </span>
              </div>
              
              <div className="space-y-4">
                {sellerAlerts.map((alert) => (
                  <div key={alert.id} className={`p-4 rounded-2xl border-l-4 transition-all cursor-pointer hover:shadow-lg ${
                    alert.urgent 
                      ? 'border-red-500 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30' 
                      : `border-${alert.color}-500 bg-${alert.color}-50 dark:bg-${alert.color}-900/20 hover:bg-${alert.color}-100 dark:hover:bg-${alert.color}-900/30`
                  }`}>
                    <div className="flex items-start space-x-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        alert.urgent 
                          ? 'bg-red-500' 
                          : alert.color === 'green' ? 'bg-green-500' :
                            alert.color === 'blue' ? 'bg-blue-500' : 
                            alert.color === 'orange' ? 'bg-orange-500' : 'bg-gray-500'
                      } shadow-lg`}>
                        <alert.icon className="text-white" size={18} />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-gray-900 dark:text-white text-sm mb-1 leading-[1.2] pb-1">{alert.title}</h4>
                        <p className="text-gray-700 dark:text-gray-300 text-sm mb-2">{alert.message}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{alert.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <button className="w-full mt-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-3 rounded-xl font-bold transition-all shadow-lg hover:shadow-xl">
                View All Alerts
              </button>
            </div>

            {/* Quick Actions */}
            <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-gray-200/50 dark:border-gray-700/50">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center leading-[1.2] pb-1">
                <Zap className="mr-2 text-yellow-500" size={20} />
                Quick Actions
              </h3>
              
              <div className="space-y-3">
                {[
                  { text: 'Add New Property', icon: Plus, gradient: 'from-green-500 to-emerald-600', emoji: '🏠' },
                  { text: 'Price Calculator', icon: Calculator, gradient: 'from-blue-500 to-indigo-600', emoji: '💰' },
                  { text: 'Market Analysis', icon: BarChart3, gradient: 'from-purple-500 to-pink-600', emoji: '📊' },
                  { text: 'Expert Support', icon: Headphones, gradient: 'from-orange-500 to-red-600', emoji: '🎧' }
                ].map((action, index) => (
                  <button key={index} className={`w-full text-left p-4 rounded-2xl bg-gradient-to-r ${action.gradient} text-white hover:scale-105 transition-all group shadow-xl hover:shadow-2xl`}>
                    <div className="flex items-center space-x-4">
                      <span className="text-2xl">{action.emoji}</span>
                      <div className="w-10 h-10 bg-white/20 backdrop-blur-xl rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                        <action.icon className="text-white" size={18} />
                      </div>
                      <span className="font-bold">{action.text}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Compact GharBazaar Promotion Section */}
        <div className="mt-12 relative overflow-hidden">
          {/* Background Elements */}
          <div className="absolute inset-0 bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 rounded-2xl"></div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
          
          <div className="relative bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 rounded-2xl p-8 text-white shadow-2xl">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              {/* Left Content */}
              <div className="flex-1">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-16 h-16 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center">
                    <Building2 className="text-white" size={28} />
                  </div>
                  <div>
                    <h2 className="text-3xl font-black text-white leading-[1.1] pb-1">GharBazaar</h2>
                    <p className="text-green-100">Sell Smarter, Earn More</p>
                  </div>
                </div>
                
                <p className="text-lg text-green-100 mb-6 leading-relaxed">
                  Join <span className="font-bold text-white">10,000+ sellers</span> who have successfully sold properties worth <span className="font-bold text-white">₹5,000+ Crores</span> on our platform.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/dashboard/listings" className="group bg-white/20 hover:bg-white/30 backdrop-blur-xl px-6 py-3 rounded-xl font-bold transition-all flex items-center justify-center space-x-2 border border-white/20 hover:scale-105">
                    <Plus size={20} />
                    <span>List Your Property</span>
                    <ArrowUpRight size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </Link>
                  
                  <button className="group bg-white text-green-600 hover:bg-green-50 px-6 py-3 rounded-xl font-bold transition-all flex items-center justify-center space-x-2 hover:scale-105">
                    <PlayCircle size={20} />
                    <span>Success Stories</span>
                  </button>
                </div>
              </div>

              {/* Right Stats */}
              <div className="flex-shrink-0">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/15 backdrop-blur-2xl rounded-2xl p-4 text-center border border-white/20">
                    <div className="w-12 h-12 bg-yellow-500 rounded-xl flex items-center justify-center mx-auto mb-2">
                      <DollarSign className="text-white" size={20} />
                    </div>
                    <p className="text-2xl font-black text-white leading-[1.1] pb-1">₹5K+</p>
                    <p className="text-green-200 text-sm">Crores Sold</p>
                  </div>
                  
                  <div className="bg-white/15 backdrop-blur-2xl rounded-2xl p-4 text-center border border-white/20">
                    <div className="flex items-center justify-center mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="text-yellow-400 fill-current" size={16} />
                      ))}
                    </div>
                    <p className="text-2xl font-black text-white leading-[1.1] pb-1">4.8</p>
                    <p className="text-yellow-200 text-sm">Seller Rating</p>
                  </div>
                  
                  <div className="bg-white/15 backdrop-blur-2xl rounded-2xl p-4 text-center border border-white/20">
                    <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center mx-auto mb-2">
                      <Clock className="text-white" size={20} />
                    </div>
                    <p className="text-2xl font-black text-white leading-[1.1] pb-1">45</p>
                    <p className="text-blue-200 text-sm">Avg Days</p>
                  </div>
                  
                  <div className="bg-white/15 backdrop-blur-2xl rounded-2xl p-4 text-center border border-white/20">
                    <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center mx-auto mb-2">
                      <Percent className="text-white" size={20} />
                    </div>
                    <p className="text-2xl font-black text-white leading-[1.1] pb-1">92%</p>
                    <p className="text-purple-200 text-sm">Success Rate</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}