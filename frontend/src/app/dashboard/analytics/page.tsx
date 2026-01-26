'use client'

import { useState } from 'react'
import { 
  BarChart3,
  TrendingUp,
  TrendingDown,
  Eye,
  MessageCircle,
  Heart,
  Users,
  Calendar,
  MapPin,
  Clock,
  Target,
  Crown,
  Activity,
  DollarSign,
  Home,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
  Building2,
  Key,
  FileText,
  Shield,
  Zap,
  Star,
  CheckCircle,
  AlertCircle
} from 'lucide-react'

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d')
  const [selectedProperty, setSelectedProperty] = useState<'all' | string>('all')
  const [propertyType, setPropertyType] = useState<'all' | 'sale' | 'rent'>('all')

  // Enhanced analytics data with sale/rent differentiation
  const overallStats = [
    { 
      label: 'Total Views', 
      value: '12.5K', 
      change: '+18.2%', 
      trend: 'up', 
      icon: Eye, 
      color: 'blue',
      chartData: [45, 52, 48, 65, 72, 68, 85],
      saleData: { value: '8.2K', change: '+15.3%' },
      rentData: { value: '4.3K', change: '+24.1%' }
    },
    { 
      label: 'Total Inquiries', 
      value: '342', 
      change: '+12.5%', 
      trend: 'up', 
      icon: MessageCircle, 
      color: 'purple',
      chartData: [12, 15, 18, 22, 19, 25, 28],
      saleData: { value: '198', change: '+8.7%' },
      rentData: { value: '144', change: '+18.9%' }
    },
    { 
      label: 'Favorites', 
      value: '1.2K', 
      change: '+8.3%', 
      trend: 'up', 
      icon: Heart, 
      color: 'red',
      chartData: [30, 35, 32, 40, 45, 48, 52],
      saleData: { value: '756', change: '+6.2%' },
      rentData: { value: '444', change: '+12.1%' }
    },
    { 
      label: 'Conversion Rate', 
      value: '4.8%', 
      change: '-2.1%', 
      trend: 'down', 
      icon: Target, 
      color: 'green',
      chartData: [5.2, 5.0, 4.9, 5.1, 4.7, 4.8, 4.8],
      saleData: { value: '3.9%', change: '-3.2%' },
      rentData: { value: '6.2%', change: '+1.8%' }
    }
  ]

  // Enhanced property performance with sale/rent data
  const propertyPerformance = [
    {
      id: 1,
      name: 'Luxury Penthouse',
      location: 'Worli, Mumbai',
      type: 'sale',
      price: '₹8.5 Cr',
      views: 1234,
      inquiries: 23,
      favorites: 45,
      conversionRate: 5.2,
      avgTimeOnPage: '3:45',
      bounceRate: 32,
      leadQuality: 'High',
      status: 'Active'
    },
    {
      id: 2,
      name: 'Premium 3BHK Apartment',
      location: 'Bandra West, Mumbai',
      type: 'rent',
      price: '₹85,000/month',
      views: 743,
      inquiries: 18,
      favorites: 32,
      conversionRate: 6.8,
      avgTimeOnPage: '4:12',
      bounceRate: 25,
      leadQuality: 'High',
      status: 'Active'
    },
    {
      id: 3,
      name: 'Modern Villa',
      location: 'Whitefield, Bangalore',
      type: 'sale',
      price: '₹3.8 Cr',
      views: 892,
      inquiries: 15,
      favorites: 28,
      conversionRate: 4.8,
      avgTimeOnPage: '3:30',
      bounceRate: 35,
      leadQuality: 'Medium',
      status: 'Active'
    },
    {
      id: 4,
      name: 'Furnished 2BHK Flat',
      location: 'Koramangala, Bangalore',
      type: 'rent',
      price: '₹45,000/month',
      views: 432,
      inquiries: 12,
      favorites: 18,
      conversionRate: 7.2,
      avgTimeOnPage: '3:15',
      bounceRate: 28,
      leadQuality: 'Medium',
      status: 'Active'
    },
    {
      id: 5,
      name: 'Luxury Villa on Rent',
      location: 'DLF Phase 2, Gurgaon',
      type: 'rent',
      price: '₹1,20,000/month',
      views: 891,
      inquiries: 21,
      favorites: 35,
      conversionRate: 8.1,
      avgTimeOnPage: '4:45',
      bounceRate: 22,
      leadQuality: 'High',
      status: 'Active'
    },
    {
      id: 6,
      name: 'Garden Estate',
      location: 'Gurgaon, Delhi NCR',
      type: 'sale',
      price: '₹1.8 Cr',
      views: 456,
      inquiries: 9,
      favorites: 15,
      conversionRate: 3.9,
      avgTimeOnPage: '2:30',
      bounceRate: 45,
      leadQuality: 'Low',
      status: 'Active'
    }
  ]

  // Rental-specific metrics
  const rentalMetrics = [
    { label: 'Avg. Lease Duration', value: '11.2 months', icon: Calendar, color: 'purple' },
    { label: 'Tenant Retention', value: '78%', icon: Users, color: 'green' },
    { label: 'Avg. Security Deposit', value: '₹1.8L', icon: Shield, color: 'blue' },
    { label: 'Rental Yield', value: '6.2%', icon: TrendingUp, color: 'orange' }
  ]

  // Sale-specific metrics
  const saleMetrics = [
    { label: 'Avg. Days on Market', value: '45 days', icon: Calendar, color: 'blue' },
    { label: 'Price Appreciation', value: '+12.5%', icon: TrendingUp, color: 'green' },
    { label: 'Negotiation Rate', value: '68%', icon: DollarSign, color: 'purple' },
    { label: 'Closing Success', value: '82%', icon: CheckCircle, color: 'emerald' }
  ]

  const visitorDemographics = [
    { location: 'Mumbai', percentage: 35, count: 4375, saleCount: 2625, rentCount: 1750 },
    { location: 'Bangalore', percentage: 28, count: 3500, saleCount: 1750, rentCount: 1750 },
    { location: 'Delhi NCR', percentage: 22, count: 2750, saleCount: 1650, rentCount: 1100 },
    { location: 'Pune', percentage: 10, count: 1250, saleCount: 750, rentCount: 500 },
    { location: 'Others', percentage: 5, count: 625, saleCount: 375, rentCount: 250 }
  ]

  const trafficSources = [
    { source: 'Direct', percentage: 42, count: 5250, color: 'blue' },
    { source: 'Search', percentage: 31, count: 3875, color: 'green' },
    { source: 'Social Media', percentage: 18, count: 2250, color: 'purple' },
    { source: 'Referral', percentage: 9, count: 1125, color: 'orange' }
  ]

  const peakHours = [
    { hour: '9 AM', views: 45, saleViews: 28, rentViews: 17 },
    { hour: '12 PM', views: 78, saleViews: 45, rentViews: 33 },
    { hour: '3 PM', views: 92, saleViews: 52, rentViews: 40 },
    { hour: '6 PM', views: 125, saleViews: 68, rentViews: 57 },
    { hour: '9 PM', views: 98, saleViews: 55, rentViews: 43 }
  ]

  // Filter properties based on type
  const filteredProperties = propertyType === 'all' 
    ? propertyPerformance 
    : propertyPerformance.filter(prop => prop.type === propertyType)

  const getLeadQualityColor = (quality: string) => {
    switch (quality) {
      case 'High': return 'text-green-600 bg-green-100 dark:bg-green-900/30'
      case 'Medium': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30'
      case 'Low': return 'text-red-600 bg-red-100 dark:bg-red-900/30'
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-900/30'
    }
  }

  const getPropertyTypeColor = (type: string) => {
    return type === 'rent' 
      ? 'text-purple-600 bg-purple-100 dark:bg-purple-900/30' 
      : 'text-blue-600 bg-blue-100 dark:bg-blue-900/30'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white flex items-center">
            <BarChart3 className="mr-3 text-purple-500" size={28} />
            Analytics Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Track your property performance and insights across sales & rentals
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <select
            value={propertyType}
            onChange={(e) => setPropertyType(e.target.value as any)}
            className="px-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg focus:ring-2 focus:ring-purple-500"
          >
            <option value="all">All Properties</option>
            <option value="sale">Sale Properties</option>
            <option value="rent">Rental Properties</option>
          </select>
          
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as any)}
            className="px-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg focus:ring-2 focus:ring-purple-500"
          >
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
            <option value="1y">Last Year</option>
          </select>
          
          <button className="flex items-center space-x-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-all">
            <Filter size={18} />
            <span>Filter</span>
          </button>
        </div>
      </div>

      {/* Overall Stats with Sale/Rent Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {overallStats.map((stat, index) => (
          <div key={index} className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 bg-${stat.color}-100 dark:bg-${stat.color}-900/30 rounded-xl flex items-center justify-center`}>
                <stat.icon className={`text-${stat.color}-600`} size={24} />
              </div>
              <div className={`flex items-center space-x-1 ${
                stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
              }`}>
                {stat.trend === 'up' ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                <span className="text-sm font-semibold">{stat.change}</span>
              </div>
            </div>
            
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{stat.label}</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white mb-4">{stat.value}</p>
            
            {/* Sale/Rent Breakdown */}
            <div className="grid grid-cols-2 gap-2 mb-4">
              <div className="text-center p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">Sale</p>
                <p className="text-sm font-bold text-blue-700 dark:text-blue-300">{stat.saleData.value}</p>
                <p className="text-xs text-blue-600 dark:text-blue-400">{stat.saleData.change}</p>
              </div>
              <div className="text-center p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <p className="text-xs text-purple-600 dark:text-purple-400 font-medium">Rent</p>
                <p className="text-sm font-bold text-purple-700 dark:text-purple-300">{stat.rentData.value}</p>
                <p className="text-xs text-purple-600 dark:text-purple-400">{stat.rentData.change}</p>
              </div>
            </div>
            
            {/* Mini Chart */}
            <div className="flex items-end space-x-1 h-8">
              {stat.chartData.map((value, i) => (
                <div
                  key={i}
                  className={`flex-1 bg-${stat.color}-200 dark:bg-${stat.color}-800 rounded-t`}
                  style={{ height: `${(value / Math.max(...stat.chartData)) * 100}%` }}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Sale vs Rent Specific Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sale Metrics */}
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
            <Building2 className="mr-2 text-blue-500" size={24} />
            Sale Property Metrics
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {saleMetrics.map((metric, index) => (
              <div key={index} className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className={`w-10 h-10 bg-${metric.color}-100 dark:bg-${metric.color}-900/30 rounded-lg flex items-center justify-center mx-auto mb-2`}>
                  <metric.icon className={`text-${metric.color}-600`} size={20} />
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{metric.label}</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">{metric.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Rental Metrics */}
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
            <Key className="mr-2 text-purple-500" size={24} />
            Rental Property Metrics
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {rentalMetrics.map((metric, index) => (
              <div key={index} className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className={`w-10 h-10 bg-${metric.color}-100 dark:bg-${metric.color}-900/30 rounded-lg flex items-center justify-center mx-auto mb-2`}>
                  <metric.icon className={`text-${metric.color}-600`} size={20} />
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{metric.label}</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">{metric.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Enhanced Property Performance Table */}
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
            <Home className="mr-2 text-green-500" size={24} />
            Property Performance
            {propertyType !== 'all' && (
              <span className={`ml-3 px-3 py-1 rounded-full text-sm font-semibold ${
                propertyType === 'rent' 
                  ? 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400' 
                  : 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
              }`}>
                {propertyType === 'rent' ? 'Rental Properties' : 'Sale Properties'}
              </span>
            )}
          </h2>
          <select
            value={selectedProperty}
            onChange={(e) => setSelectedProperty(e.target.value)}
            className="px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500"
          >
            <option value="all">All Properties</option>
            {filteredProperties.map(prop => (
              <option key={prop.id} value={prop.id}>{prop.name}</option>
            ))}
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Property</th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Type</th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Price</th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Views</th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Inquiries</th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Conv. Rate</th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Lead Quality</th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredProperties.map((property) => (
                <tr key={property.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  <td className="py-4 px-4">
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">{property.name}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
                        <MapPin size={12} className="mr-1" />
                        {property.location}
                      </p>
                    </div>
                  </td>
                  <td className="text-center py-4 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getPropertyTypeColor(property.type)}`}>
                      {property.type === 'rent' ? 'RENT' : 'SALE'}
                    </span>
                  </td>
                  <td className="text-center py-4 px-4">
                    <span className="font-semibold text-gray-900 dark:text-white text-sm">{property.price}</span>
                  </td>
                  <td className="text-center py-4 px-4">
                    <span className="font-semibold text-gray-900 dark:text-white">{property.views}</span>
                  </td>
                  <td className="text-center py-4 px-4">
                    <span className="font-semibold text-gray-900 dark:text-white">{property.inquiries}</span>
                  </td>
                  <td className="text-center py-4 px-4">
                    <span className={`font-semibold ${
                      property.conversionRate >= 6 ? 'text-green-600' : 
                      property.conversionRate >= 4 ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {property.conversionRate}%
                    </span>
                  </td>
                  <td className="text-center py-4 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getLeadQualityColor(property.leadQuality)}`}>
                      {property.leadQuality}
                    </span>
                  </td>
                  <td className="text-center py-4 px-4">
                    <span className="flex items-center justify-center">
                      <CheckCircle size={16} className="text-green-500" />
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Enhanced Visitor Demographics with Sale/Rent Split */}
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
            <MapPin className="mr-2 text-blue-500" size={24} />
            Visitor Demographics
          </h2>
          
          <div className="space-y-4">
            {visitorDemographics.map((demo, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{demo.location}</span>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">{demo.percentage}%</span>
                </div>
                <div className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transition-all"
                    style={{ width: `${demo.percentage}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mt-1">
                  <span>Total: {demo.count.toLocaleString()}</span>
                  <div className="flex space-x-3">
                    <span className="text-blue-600">Sale: {demo.saleCount}</span>
                    <span className="text-purple-600">Rent: {demo.rentCount}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Traffic Sources */}
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
            <Activity className="mr-2 text-green-500" size={24} />
            Traffic Sources
          </h2>
          
          <div className="space-y-4">
            {trafficSources.map((source, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 bg-${source.color}-500 rounded-full`} />
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">{source.source}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{source.count.toLocaleString()} visits</p>
                  </div>
                </div>
                <span className="text-2xl font-bold text-gray-900 dark:text-white">{source.percentage}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Enhanced Peak Hours with Sale/Rent Split */}
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
          <Clock className="mr-2 text-orange-500" size={24} />
          Peak Viewing Hours
          <span className="ml-4 text-sm font-normal text-gray-500">
            Blue: Sale Properties | Purple: Rental Properties
          </span>
        </h2>
        
        <div className="flex items-end justify-between space-x-4 h-64">
          {peakHours.map((hour, index) => (
            <div key={index} className="flex-1 flex flex-col items-center">
              <div className="w-full flex flex-col items-center justify-end flex-1 space-y-1">
                {/* Sale Views Bar */}
                <div 
                  className="w-full bg-gradient-to-t from-blue-500 to-blue-300 rounded-t-lg transition-all hover:from-blue-600 hover:to-blue-400 cursor-pointer relative group"
                  style={{ height: `${(hour.saleViews / Math.max(...peakHours.map(h => h.views))) * 100}%` }}
                >
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-blue-900 text-white px-2 py-1 rounded text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    Sale: {hour.saleViews}
                  </div>
                </div>
                {/* Rent Views Bar */}
                <div 
                  className="w-full bg-gradient-to-t from-purple-500 to-purple-300 transition-all hover:from-purple-600 hover:to-purple-400 cursor-pointer relative group"
                  style={{ height: `${(hour.rentViews / Math.max(...peakHours.map(h => h.views))) * 100}%` }}
                >
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-purple-900 text-white px-2 py-1 rounded text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    Rent: {hour.rentViews}
                  </div>
                </div>
              </div>
              <p className="text-sm font-medium text-gray-900 dark:text-white mt-3">{hour.hour}</p>
              <p className="text-xs text-gray-500">Total: {hour.views}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Enhanced AI-Powered Insights for Sale vs Rent */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-6 text-white">
        <h2 className="text-xl font-bold mb-4 flex items-center">
          <Crown className="mr-2" size={24} />
          AI-Powered Insights & Recommendations
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <TrendingUp size={24} className="mb-2" />
            <h3 className="font-semibold mb-1">Peak Performance</h3>
            <p className="text-sm text-purple-100">Rental properties are converting 38% better than sales this month</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <Target size={24} className="mb-2" />
            <h3 className="font-semibold mb-1">Optimization Tip</h3>
            <p className="text-sm text-purple-100">Add virtual tours to increase rental inquiries by 45%</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <Users size={24} className="mb-2" />
            <h3 className="font-semibold mb-1">Market Insight</h3>
            <p className="text-sm text-purple-100">Rental demand peaks at 6 PM, sales at 3 PM on weekdays</p>
          </div>
        </div>

        {/* Specific Recommendations */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-blue-500/20 backdrop-blur-sm rounded-lg p-4 border border-blue-400/30">
            <h3 className="font-semibold mb-2 flex items-center">
              <Building2 size={20} className="mr-2" />
              Sale Properties
            </h3>
            <ul className="text-sm text-blue-100 space-y-1">
              <li>• Best posting time: 2-4 PM on weekdays</li>
              <li>• Add price history to build trust</li>
              <li>• Focus on Mumbai & Bangalore markets</li>
            </ul>
          </div>
          <div className="bg-purple-500/20 backdrop-blur-sm rounded-lg p-4 border border-purple-400/30">
            <h3 className="font-semibold mb-2 flex items-center">
              <Key size={20} className="mr-2" />
              Rental Properties
            </h3>
            <ul className="text-sm text-purple-100 space-y-1">
              <li>• Best posting time: 6-8 PM on weekdays</li>
              <li>• Highlight furnished amenities</li>
              <li>• Target young professionals (25-35)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
