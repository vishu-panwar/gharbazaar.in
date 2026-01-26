'use client'

import { useState } from 'react'
import { 
  DollarSign,
  TrendingUp,
  TrendingDown,
  Calendar,
  Download,
  Filter,
  Home,
  CreditCard,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle,
  Clock,
  AlertCircle,
  Eye,
  BarChart3,
  PieChart,
  Building2,
  Key,
  Users,
  Target,
  Percent,
  Receipt,
  FileText,
  Star,
  MapPin
} from 'lucide-react'

export default function EarningsPage() {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y' | 'all'>('30d')
  const [viewMode, setViewMode] = useState<'overview' | 'transactions'>('overview')
  const [userRole, setUserRole] = useState<'seller' | 'renter'>('seller')

  // Sample earnings data for sellers
  const sellerEarningsStats = [
    {
      label: 'Total Sales Revenue',
      value: '₹45.2Cr',
      change: '+18.5%',
      trend: 'up',
      icon: DollarSign,
      color: 'green',
      description: 'Total property sales value'
    },
    {
      label: 'Commission Earned',
      value: '₹2.26Cr',
      change: '+12.3%',
      trend: 'up',
      icon: TrendingUp,
      color: 'blue',
      description: 'Your commission (5%)'
    },
    {
      label: 'Properties Sold',
      value: '18',
      change: '+6',
      trend: 'up',
      icon: Building2,
      color: 'purple',
      description: 'This month'
    },
    {
      label: 'Avg Deal Value',
      value: '₹2.51Cr',
      change: '+8.2%',
      trend: 'up',
      icon: Target,
      color: 'orange',
      description: 'Per property'
    }
  ]

  // Sample earnings data for renters (property owners)
  const renterEarningsStats = [
    {
      label: 'Total Rental Income',
      value: '₹12.8L',
      change: '+15.2%',
      trend: 'up',
      icon: DollarSign,
      color: 'green',
      description: 'Monthly rental collection'
    },
    {
      label: 'Occupancy Rate',
      value: '92%',
      change: '+5%',
      trend: 'up',
      icon: Users,
      color: 'blue',
      description: 'Properties occupied'
    },
    {
      label: 'Active Properties',
      value: '24',
      change: '+3',
      trend: 'up',
      icon: Key,
      color: 'purple',
      description: 'Rental properties'
    },
    {
      label: 'Avg Rent/SqFt',
      value: '₹45',
      change: '+12%',
      trend: 'up',
      icon: Target,
      color: 'orange',
      description: 'Per square foot'
    }
  ]

  const currentStats = userRole === 'seller' ? sellerEarningsStats : renterEarningsStats

  const formatCurrency = (amount: number) => {
    if (amount >= 10000000) {
      return `₹${(amount / 10000000).toFixed(1)}Cr`
    } else if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(1)}L`
    } else {
      return `₹${(amount / 1000).toFixed(0)}K`
    }
  }

  const getStatusBadge = (status: string) => {
    const badges = {
      completed: { color: 'green', icon: CheckCircle, label: 'Completed' },
      pending: { color: 'yellow', icon: Clock, label: 'Pending' },
      failed: { color: 'red', icon: AlertCircle, label: 'Failed' },
      active: { color: 'green', icon: CheckCircle, label: 'Active' },
      vacant: { color: 'gray', icon: AlertCircle, label: 'Vacant' }
    }
    const badge = badges[status as keyof typeof badges]
    return (
      <div className={`flex items-center space-x-1 bg-${badge.color}-100 dark:bg-${badge.color}-900/30 text-${badge.color}-600 dark:text-${badge.color}-400 px-3 py-1 rounded-full text-xs font-semibold`}>
        <badge.icon size={12} />
        <span>{badge.label}</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white flex items-center">
            <DollarSign className="mr-3 text-green-500" size={28} />
            {userRole === 'seller' ? 'Sales Earnings' : 'Rental Income'}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {userRole === 'seller' 
              ? 'Track your property sales and commissions' 
              : 'Monitor your rental income and property performance'
            }
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          {/* User Role Selector */}
          <select
            value={userRole}
            onChange={(e) => setUserRole(e.target.value as 'seller' | 'renter')}
            className="px-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg focus:ring-2 focus:ring-green-500 text-gray-900 dark:text-white"
          >
            <option value="seller">🏢 Property Seller</option>
            <option value="renter">🏠 Property Owner</option>
          </select>
          
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as any)}
            className="px-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg focus:ring-2 focus:ring-green-500 text-gray-900 dark:text-white"
          >
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
            <option value="1y">Last Year</option>
            <option value="all">All Time</option>
          </select>
          
          <button className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-all">
            <Download size={18} />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {currentStats.map((stat, index) => (
          <div key={index} className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 p-6 hover:shadow-xl transition-all">
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
            <p className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{stat.value}</p>
            <p className="text-xs text-gray-500 dark:text-gray-500">{stat.description}</p>
          </div>
        ))}
      </div>

      {/* Performance Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {userRole === 'seller' ? (
          <>
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Commission Rate</h3>
                <Percent className="text-green-500" size={24} />
              </div>
              <p className="text-3xl font-bold text-green-600 mb-2">5.2%</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Average commission earned</p>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Closing Time</h3>
                <Clock className="text-blue-500" size={24} />
              </div>
              <p className="text-3xl font-bold text-blue-600 mb-2">45 days</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Average deal closure</p>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Success Rate</h3>
                <Target className="text-purple-500" size={24} />
              </div>
              <p className="text-3xl font-bold text-purple-600 mb-2">94%</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Deal conversion rate</p>
            </div>
          </>
        ) : (
          <>
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Rental Yield</h3>
                <TrendingUp className="text-green-500" size={24} />
              </div>
              <p className="text-3xl font-bold text-green-600 mb-2">8.2%</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Annual rental yield</p>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Lease Duration</h3>
                <Calendar className="text-blue-500" size={24} />
              </div>
              <p className="text-3xl font-bold text-blue-600 mb-2">11 months</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Average lease period</p>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Tenant Retention</h3>
                <Users className="text-purple-500" size={24} />
              </div>
              <p className="text-3xl font-bold text-purple-600 mb-2">89%</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Renewal success rate</p>
            </div>
          </>
        )}
      </div>

      {/* Action Card */}
      <div className={`bg-gradient-to-r ${
        userRole === 'seller' 
          ? 'from-green-600 to-emerald-600' 
          : 'from-blue-600 to-indigo-600'
      } rounded-xl p-6 text-white`}>
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold mb-2">
              {userRole === 'seller' ? 'Available for Withdrawal' : 'Rental Collection Summary'}
            </h3>
            <p className={userRole === 'seller' ? 'text-green-100' : 'text-blue-100'}>
              {userRole === 'seller' 
                ? 'Your commission earnings are ready to be withdrawn'
                : 'This month\'s rental income collection status'
              }
            </p>
          </div>
          <div className="flex items-center space-x-6">
            <div className="text-center">
              <p className="text-4xl font-bold">
                {userRole === 'seller' ? '₹8.5L' : '₹12.8L'}
              </p>
              <p className={`text-sm ${userRole === 'seller' ? 'text-green-100' : 'text-blue-100'}`}>
                {userRole === 'seller' ? 'Pending Amount' : 'This Month'}
              </p>
            </div>
            <button className={`bg-white ${
              userRole === 'seller' ? 'text-green-600 hover:bg-green-50' : 'text-blue-600 hover:bg-blue-50'
            } px-8 py-3 rounded-lg font-semibold transition-all shadow-lg`}>
              {userRole === 'seller' ? 'Withdraw Now' : 'View Details'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}