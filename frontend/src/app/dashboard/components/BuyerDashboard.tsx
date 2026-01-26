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
  Activity
} from 'lucide-react'

interface BuyerDashboardProps {
  user: any
  currentTime: Date
}

export default function BuyerDashboard({ user, currentTime }: BuyerDashboardProps) {
  const userName = user?.name || user?.displayName || user?.email?.split('@')[0] || 'User'
  const [activeTab, setActiveTab] = useState('overview')
  const [searchQuery, setSearchQuery] = useState('')

  const getGreeting = () => {
    const hour = currentTime.getHours()
    if (hour < 12) return 'Good Morning'
    if (hour < 17) return 'Good Afternoon'
    return 'Good Evening'
  }

  // Enhanced Buyer Stats with more details
  const buyerStats = [
    { 
      title: 'Properties Explored', 
      value: '347', 
      icon: Eye, 
      gradient: 'from-blue-500 via-blue-600 to-indigo-700', 
      change: '+23 this week',
      trend: 'up',
      description: 'Total properties viewed'
    },
    { 
      title: 'Wishlist Collection', 
      value: '42', 
      icon: Heart, 
      gradient: 'from-pink-500 via-rose-600 to-red-700', 
      change: '+8 new saves',
      trend: 'up',
      description: 'Saved favorites'
    },
    { 
      title: 'Active Negotiations', 
      value: '12', 
      icon: Gavel, 
      gradient: 'from-orange-500 via-amber-600 to-yellow-700', 
      change: '5 pending offers',
      trend: 'neutral',
      description: 'Ongoing deals'
    },
    { 
      title: 'Budget Allocated', 
      value: '₹3.2Cr', 
      icon: Wallet, 
      gradient: 'from-green-500 via-emerald-600 to-teal-700', 
      change: 'Recently updated',
      trend: 'up',
      description: 'Investment ready'
    }
  ]

  // Premium Property Recommendations
  const premiumProperties = [
    { 
      id: 1,
      title: 'Skyline Penthouse', 
      location: 'Bandra West, Mumbai', 
      price: '₹12.5 Cr', 
      originalPrice: '₹14.2 Cr',
      beds: 4, 
      baths: 5, 
      area: '4200 sq ft',
      type: 'Penthouse',
      featured: true,
      verified: true,
      views: 2847,
      likes: 156,
      matchScore: 95,
      amenities: ['Sea View', 'Private Pool', 'Gym', 'Parking'],
      readyToMove: true,
      newListing: false,
      priceDropped: true,
      virtualTour: true
    },
    { 
      id: 2,
      title: 'Garden Paradise Villa', 
      location: 'Whitefield, Bangalore', 
      price: '₹4.8 Cr', 
      originalPrice: '₹5.2 Cr',
      beds: 5, 
      baths: 6, 
      area: '5500 sq ft',
      type: 'Villa',
      featured: true,
      verified: true,
      views: 1923,
      likes: 89,
      matchScore: 88,
      amenities: ['Garden', 'Club House', 'Security', 'Power Backup'],
      readyToMove: false,
      newListing: true,
      priceDropped: false,
      virtualTour: true
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
      featured: true,
      verified: true,
      views: 3156,
      likes: 234,
      matchScore: 92,
      amenities: ['Sea View', 'Concierge', 'Spa', 'Valet'],
      readyToMove: true,
      newListing: false,
      priceDropped: false,
      virtualTour: false
    }
  ]

  // Market Insights Data
  const marketInsights = [
    {
      location: 'Mumbai',
      priceChange: '+12.5%',
      trend: 'up',
      avgPrice: '₹18,500/sq ft',
      inventory: 'Low',
      recommendation: 'Buy Now'
    },
    {
      location: 'Bangalore',
      priceChange: '+8.2%',
      trend: 'up',
      avgPrice: '₹8,200/sq ft',
      inventory: 'Medium',
      recommendation: 'Good Time'
    },
    {
      location: 'Pune',
      priceChange: '+5.8%',
      trend: 'up',
      avgPrice: '₹6,800/sq ft',
      inventory: 'High',
      recommendation: 'Wait & Watch'
    }
  ]

  // Smart Alerts
  const smartAlerts = [
    {
      id: 1,
      type: 'price_drop',
      title: 'Price Drop Alert!',
      property: 'Skyline Penthouse',
      message: 'Price reduced by ₹1.7Cr - Now ₹12.5Cr',
      time: '2 hours ago',
      urgent: true,
      icon: TrendingUp,
      color: 'red'
    },
    {
      id: 2,
      type: 'new_match',
      title: 'Perfect Match Found!',
      property: 'Garden Paradise Villa',
      message: '95% match with your preferences',
      time: '4 hours ago',
      urgent: false,
      icon: Target,
      color: 'green'
    },
    {
      id: 3,
      type: 'viewing_scheduled',
      title: 'Viewing Confirmed',
      property: 'Marina Bay Residences',
      message: 'Site visit scheduled for tomorrow 3 PM',
      time: '1 day ago',
      urgent: false,
      icon: Calendar,
      color: 'blue'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-800">
      {/* Ultra-Modern Hero Section */}
      <div className="relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-indigo-600/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-20 right-0 w-80 h-80 bg-gradient-to-bl from-purple-400/20 to-pink-600/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
          <div className="absolute bottom-0 left-1/3 w-72 h-72 bg-gradient-to-tr from-emerald-400/15 to-teal-600/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '4s'}}></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 text-white">
          <div className="max-w-7xl mx-auto px-6 py-12">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
              {/* Welcome Section */}
              <div className="lg:col-span-2">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-600 rounded-3xl flex items-center justify-center shadow-2xl border-2 border-white/20">
                    <Crown className="text-white" size={36} />
                  </div>
                  <div>
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-green-300 font-semibold text-sm">Premium Buyer Active</span>
                    </div>
                    <h1 className="text-4xl lg:text-6xl font-black leading-tight bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent pb-2">
                      {getGreeting()}, {userName}! 
                    </h1>
                  </div>
                </div>
                
                <p className="text-xl text-blue-100 mb-8 leading-relaxed max-w-2xl">
                  Your personalized property journey continues. We've found <span className="font-bold text-white">47 new matches</span> and <span className="font-bold text-yellow-300">3 price drops</span> in your preferred locations.
                </p>
                
                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/dashboard/browse" className="group bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 px-8 py-4 rounded-2xl font-bold transition-all flex items-center justify-center space-x-3 shadow-2xl hover:shadow-3xl hover:scale-105">
                    <Search size={24} />
                    <span>Explore Properties</span>
                    <ArrowUpRight size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </Link>
                  
                  <Link href="/dashboard/favorites" className="group bg-white/10 hover:bg-white/20 backdrop-blur-xl px-8 py-4 rounded-2xl font-bold transition-all flex items-center justify-center space-x-3 border border-white/20 hover:scale-105">
                    <Heart size={24} />
                    <span>My Wishlist</span>
                    <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm">42</span>
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
                        <h3 className="text-white font-bold text-sm leading-[1.1] pb-1">Premium Buyer Plan</h3>
                        <p className="text-green-200 text-xs">Active Subscription</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-black text-white leading-[1.1] pb-1">₹1,999</p>
                      <p className="text-blue-200 text-xs">per month</p>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-blue-200 text-xs">Plan Progress</span>
                      <span className="text-white font-bold text-xs">68%</span>
                    </div>
                    <div className="w-full bg-white/20 rounded-full h-2 overflow-hidden">
                      <div className="bg-gradient-to-r from-green-400 to-emerald-500 h-full rounded-full transition-all duration-1000 ease-out" style={{width: '68%'}}></div>
                    </div>
                  </div>
                  
                  {/* Compact Stats */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between p-2 bg-white/10 rounded-xl">
                      <div className="flex items-center space-x-2">
                        <Calendar className="text-yellow-400" size={14} />
                        <span className="text-blue-200 text-xs">Days Left</span>
                      </div>
                      <span className="font-bold text-yellow-300 text-sm">12</span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-white/10 rounded-xl">
                      <div className="flex items-center space-x-2">
                        <Eye className="text-blue-400" size={14} />
                        <span className="text-blue-200 text-xs">Viewed</span>
                      </div>
                      <span className="font-bold text-blue-300 text-sm">347/500</span>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-white/10 rounded-xl">
                      <div className="flex items-center space-x-2">
                        <MessageCircle className="text-purple-400" size={14} />
                        <span className="text-blue-200 text-xs">Consultations</span>
                      </div>
                      <span className="font-bold text-purple-300 text-sm">8/15</span>
                    </div>
                  </div>

                  {/* Compact Renew Button */}
                  <Link href="/dashboard/pricing" className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-2 rounded-xl font-bold transition-all flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl hover:scale-105 text-sm">
                    <Zap size={14} />
                    <span>Renew Plan</span>
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
          {buyerStats.map((stat, index) => (
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
          {/* Left Column - Property Discovery */}
          <div className="xl:col-span-3 space-y-8">
            {/* AI-Powered Search Section */}
            <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-gray-200/50 dark:border-gray-700/50">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 via-pink-500 to-rose-600 rounded-2xl flex items-center justify-center shadow-xl">
                    <Sparkles className="text-white animate-spin" size={28} />
                  </div>
                  <div>
                    <h2 className="text-3xl font-black text-gray-900 dark:text-white leading-[1.2] pb-1">AI Property Finder</h2>
                    <p className="text-gray-600 dark:text-gray-400">Powered by advanced machine learning</p>
                  </div>
                </div>
                <div className="hidden lg:flex items-center space-x-2 bg-green-100 dark:bg-green-900/30 px-4 py-2 rounded-full">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-green-700 dark:text-green-300 font-semibold text-sm">AI Active</span>
                </div>
              </div>
              
              {/* Enhanced Search Bar */}
              <div className="relative mb-8">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-2xl blur-xl"></div>
                <div className="relative bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-xl">
                  <div className="flex items-center space-x-4 mb-4">
                    <Compass className="text-blue-500" size={24} />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Describe your dream property... e.g., 'Modern 3BHK with sea view in Mumbai under 8 crores'"
                      className="flex-1 text-lg bg-transparent border-none outline-none text-gray-900 dark:text-white placeholder-gray-500"
                    />
                    <button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg hover:shadow-xl flex items-center space-x-2">
                      <Search size={20} />
                      <span>Find</span>
                    </button>
                  </div>
                  
                  {/* Smart Suggestions */}
                  <div className="flex flex-wrap gap-3">
                    {['Sea View Apartments', '3BHK Under ₹5Cr', 'Ready to Move', 'Luxury Villas', 'Investment Properties'].map((suggestion, index) => (
                      <button key={index} className="bg-gray-100 dark:bg-gray-700 hover:bg-blue-100 dark:hover:bg-blue-900/30 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-full text-sm font-medium transition-all hover:scale-105">
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Quick Filters */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { title: 'Budget Range', icon: Wallet, value: '₹2-8 Cr', color: 'green', count: '1,247' },
                  { title: 'Property Type', icon: Home, value: 'Apartment', color: 'blue', count: '856' },
                  { title: 'Location', icon: MapPin, value: 'Mumbai', color: 'purple', count: '2,134' },
                  { title: 'Bedrooms', icon: Bed, value: '3-4 BHK', color: 'orange', count: '967' }
                ].map((filter, index) => (
                  <div key={index} className="group bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-2xl p-6 hover:shadow-xl transition-all cursor-pointer hover:scale-105 border border-gray-200 dark:border-gray-600">
                    <div className={`w-12 h-12 bg-gradient-to-br ${
                      filter.color === 'green' ? 'from-green-500 to-emerald-600' :
                      filter.color === 'blue' ? 'from-blue-500 to-indigo-600' :
                      filter.color === 'purple' ? 'from-purple-500 to-pink-600' :
                      'from-orange-500 to-red-600'
                    } rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
                      <filter.icon className="text-white" size={20} />
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1 font-semibold">{filter.title}</p>
                    <p className="font-bold text-gray-900 dark:text-white text-lg mb-2 leading-[1.1] pb-1">{filter.value}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{filter.count} properties</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Premium Properties Showcase */}
            <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-gray-200/50 dark:border-gray-700/50">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 via-orange-500 to-red-600 rounded-2xl flex items-center justify-center shadow-xl">
                    <Crown className="text-white" size={28} />
                  </div>
                  <div>
                    <h2 className="text-3xl font-black text-gray-900 dark:text-white leading-[1.2] pb-1">Handpicked for You</h2>
                    <p className="text-gray-600 dark:text-gray-400">AI-curated premium properties</p>
                  </div>
                </div>
                <Link href="/dashboard/browse" className="group bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg hover:shadow-xl flex items-center space-x-2">
                  <span>View All</span>
                  <ArrowUpRight size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </Link>
              </div>
              
              {/* Horizontal Scrollable Container */}
              <div className="overflow-x-auto pb-4">
                <div className="flex space-x-6 min-w-max">
                  {premiumProperties.map((property) => (
                    <div key={property.id} className="group relative bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-xl hover:shadow-3xl transition-all duration-500 hover:-translate-y-2 border border-gray-200 dark:border-gray-700 hover:border-blue-500 w-96 flex-shrink-0">
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
                          {property.newListing && (
                            <div className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg animate-pulse">
                              New
                            </div>
                          )}
                          {property.priceDropped && (
                            <div className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg">
                              Price Drop
                            </div>
                          )}
                        </div>

                        {/* Match Score */}
                        <div className="absolute top-3 right-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg">
                          {property.matchScore}% Match
                        </div>

                        {/* Actions */}
                        <div className="absolute bottom-3 right-3 flex space-x-2">
                          <button className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-all shadow-lg group-hover:scale-110">
                            <Heart size={14} className="text-gray-600 hover:text-red-500 transition-colors" />
                          </button>
                          {property.virtualTour && (
                            <button className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center hover:bg-blue-600 transition-all shadow-lg group-hover:scale-110">
                              <PlayCircle size={14} />
                            </button>
                          )}
                        </div>

                        {/* Views & Likes */}
                        <div className="absolute bottom-3 left-3 flex space-x-2">
                          <div className="bg-black/60 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs flex items-center space-x-1">
                            <Eye size={10} />
                            <span>{property.views}</span>
                          </div>
                          <div className="bg-black/60 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs flex items-center space-x-1">
                            <Heart size={10} />
                            <span>{property.likes}</span>
                          </div>
                        </div>
                      </div>

                      {/* Property Details - Bottom */}
                      <div className="p-5">
                        <div className="mb-4">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors leading-[1.2] pb-1 truncate">
                              {property.title}
                            </h3>
                            <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-full text-xs font-semibold flex-shrink-0">
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

                        {/* Amenities */}
                        <div className="flex flex-wrap gap-1 mb-4">
                          {property.amenities.slice(0, 2).map((amenity, index) => (
                            <span key={index} className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-full text-xs font-medium">
                              {amenity}
                            </span>
                          ))}
                          {property.amenities.length > 2 && (
                            <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-full text-xs font-medium">
                              +{property.amenities.length - 2}
                            </span>
                          )}
                        </div>
                        
                        {/* Price & Action */}
                        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                          <div className="mb-3">
                            {property.originalPrice && (
                              <p className="text-sm text-gray-400 line-through mb-1">{property.originalPrice}</p>
                            )}
                            <p className="text-2xl font-black text-blue-600 leading-[1.1] pb-1">{property.price}</p>
                            <p className="text-xs text-gray-500">₹{Math.round(parseFloat(property.price.replace('₹', '').replace('Cr', '')) * 10000000 / parseFloat(property.area.replace(' sq ft', '').replace(',', '')))} per sq ft</p>
                          </div>
                          <Link href={`/dashboard/browse/${property.id}`} className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 py-3 rounded-xl font-bold transition-all flex items-center justify-center space-x-2 group shadow-lg hover:shadow-xl text-sm">
                            <span>Explore</span>
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
                  <Bell className="mr-2 text-blue-500" size={20} />
                  Smart Alerts
                </h3>
                <span className="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-3 py-1 rounded-full text-xs font-bold">
                  {smartAlerts.filter(alert => alert.urgent).length} Urgent
                </span>
              </div>
              
              <div className="space-y-4">
                {smartAlerts.map((alert) => (
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
                            alert.color === 'blue' ? 'bg-blue-500' : 'bg-gray-500'
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
              
              <button className="w-full mt-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 rounded-xl font-bold transition-all shadow-lg hover:shadow-xl">
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
                  { text: 'Schedule Site Visit', icon: Calendar, gradient: 'from-blue-500 to-indigo-600', emoji: '📅' },
                  { text: 'EMI Calculator', icon: Calculator, gradient: 'from-green-500 to-emerald-600', emoji: '🧮' },
                  { text: 'Virtual Tour', icon: PlayCircle, gradient: 'from-purple-500 to-pink-600', emoji: '🎥' },
                  { text: 'Expert Consultation', icon: Headphones, gradient: 'from-orange-500 to-red-600', emoji: '👨‍💼' }
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
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-2xl"></div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
          
          <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-2xl p-8 text-white shadow-2xl">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              {/* Left Content */}
              <div className="flex-1">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-16 h-16 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center">
                    <Home className="text-white" size={28} />
                  </div>
                  <div>
                    <h2 className="text-3xl font-black text-white leading-[1.1] pb-1">GharBazaar</h2>
                    <p className="text-blue-100">Your Dream Home Awaits</p>
                  </div>
                </div>
                
                <p className="text-lg text-blue-100 mb-6 leading-relaxed">
                  Join <span className="font-bold text-white">50,000+ families</span> who found their perfect home through our AI-powered platform.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/dashboard/browse" className="group bg-white/20 hover:bg-white/30 backdrop-blur-xl px-6 py-3 rounded-xl font-bold transition-all flex items-center justify-center space-x-2 border border-white/20 hover:scale-105">
                    <Search size={20} />
                    <span>Start Your Journey</span>
                    <ArrowUpRight size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </Link>
                  
                  <button className="group bg-white text-blue-600 hover:bg-blue-50 px-6 py-3 rounded-xl font-bold transition-all flex items-center justify-center space-x-2 hover:scale-105">
                    <PlayCircle size={20} />
                    <span>Watch Demo</span>
                  </button>
                </div>
              </div>

              {/* Right Stats */}
              <div className="flex-shrink-0">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/15 backdrop-blur-2xl rounded-2xl p-4 text-center border border-white/20">
                    <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center mx-auto mb-2">
                      <Users className="text-white" size={20} />
                    </div>
                    <p className="text-2xl font-black text-white leading-[1.1] pb-1">50K+</p>
                    <p className="text-green-200 text-sm">Happy Customers</p>
                  </div>
                  
                  <div className="bg-white/15 backdrop-blur-2xl rounded-2xl p-4 text-center border border-white/20">
                    <div className="flex items-center justify-center mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="text-yellow-400 fill-current" size={16} />
                      ))}
                    </div>
                    <p className="text-2xl font-black text-white leading-[1.1] pb-1">4.9</p>
                    <p className="text-yellow-200 text-sm">Rating</p>
                  </div>
                  
                  <div className="bg-white/15 backdrop-blur-2xl rounded-2xl p-4 text-center border border-white/20">
                    <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center mx-auto mb-2">
                      <Shield className="text-white" size={20} />
                    </div>
                    <p className="text-2xl font-black text-white leading-[1.1] pb-1">100%</p>
                    <p className="text-blue-200 text-sm">Verified</p>
                  </div>
                  
                  <div className="bg-white/15 backdrop-blur-2xl rounded-2xl p-4 text-center border border-white/20">
                    <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center mx-auto mb-2">
                      <Award className="text-white" size={20} />
                    </div>
                    <p className="text-2xl font-black text-white leading-[1.1] pb-1">24/7</p>
                    <p className="text-purple-200 text-sm">Support</p>
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