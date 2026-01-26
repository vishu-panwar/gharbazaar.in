'use client'

import { useState } from 'react'
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  Home,
  DollarSign,
  Eye,
  MousePointer,
  Calendar,
  Download,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Target,
  Zap,
  Clock,
  MapPin,
  CreditCard,
  UserPlus,
  ShoppingCart,
} from 'lucide-react'
import toast from 'react-hot-toast'

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState('7days')
  const [selectedMetric, setSelectedMetric] = useState('revenue')

  const overviewStats = {
    totalRevenue: 2456789,
    revenueGrowth: 15.3,
    totalUsers: 12456,
    userGrowth: 8.7,
    totalListings: 3456,
    listingGrowth: 12.4,
    activeSubscriptions: 1234,
    subscriptionGrowth: 18.9,
  }

  const revenueData = [
    { month: 'Jan', revenue: 185000, target: 180000 },
    { month: 'Feb', revenue: 195000, target: 190000 },
    { month: 'Mar', revenue: 210000, target: 200000 },
    { month: 'Apr', revenue: 225000, target: 220000 },
    { month: 'May', revenue: 240000, target: 240000 },
    { month: 'Jun', revenue: 265000, target: 260000 },
  ]

  const userGrowthData = [
    { month: 'Jan', users: 8500, active: 7200 },
    { month: 'Feb', users: 9200, active: 7800 },
    { month: 'Mar', users: 9800, active: 8300 },
    { month: 'Apr', users: 10500, active: 8900 },
    { month: 'May', users: 11200, active: 9500 },
    { month: 'Jun', users: 12456, active: 10600 },
  ]

  const topCities = [
    { city: 'Mumbai', users: 3456, listings: 1234, revenue: 567890, growth: 12.5 },
    { city: 'Delhi', users: 2890, listings: 987, revenue: 456789, growth: 10.3 },
    { city: 'Bangalore', users: 2345, listings: 876, revenue: 389012, growth: 15.7 },
    { city: 'Pune', users: 1890, listings: 654, revenue: 298765, growth: 8.9 },
    { city: 'Hyderabad', users: 1567, listings: 543, revenue: 234567, growth: 11.2 },
  ]

  const subscriptionBreakdown = [
    { plan: 'Basic', subscribers: 567, percentage: 46, revenue: 566433, color: 'blue' },
    { plan: 'Premium', subscribers: 456, percentage: 37, revenue: 1367544, color: 'purple' },
    { plan: 'Enterprise', subscribers: 211, percentage: 17, revenue: 21098889, color: 'orange' },
  ]

  const trafficSources = [
    { source: 'Direct', visitors: 45678, percentage: 38, conversion: 4.5 },
    { source: 'Organic Search', visitors: 34567, percentage: 29, conversion: 5.2 },
    { source: 'Social Media', visitors: 23456, percentage: 19, conversion: 3.8 },
    { source: 'Referral', visitors: 12345, percentage: 10, conversion: 6.1 },
    { source: 'Email', visitors: 4567, percentage: 4, conversion: 7.3 },
  ]

  const recentActivity = [
    {
      type: 'user_signup',
      message: 'New user registration',
      count: 234,
      time: '2 hours ago',
      trend: 'up',
    },
    {
      type: 'listing_created',
      message: 'New listings posted',
      count: 89,
      time: '3 hours ago',
      trend: 'up',
    },
    {
      type: 'subscription',
      message: 'New subscriptions',
      count: 45,
      time: '5 hours ago',
      trend: 'up',
    },
    {
      type: 'payment',
      message: 'Payments processed',
      count: 156,
      time: '6 hours ago',
      trend: 'up',
    },
  ]

  const handleExport = () => {
    toast.success('Exporting analytics data...')
  }

  const formatCurrency = (amount: number) => {
    if (amount >= 10000000) {
      return `₹${(amount / 10000000).toFixed(2)}Cr`
    } else if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(2)}L`
    }
    return `₹${amount.toLocaleString()}`
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Analytics Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Comprehensive business insights and metrics
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-4 py-2 bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg text-sm"
          >
            <option value="today">Today</option>
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
            <option value="90days">Last 90 Days</option>
            <option value="year">This Year</option>
          </select>
          <button
            onClick={handleExport}
            className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-semibold transition-all"
          >
            <Download size={18} />
            <span>Export</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-950 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl">
              <DollarSign size={24} className="text-green-600" />
            </div>
            <div
              className={`flex items-center space-x-1 text-sm px-2 py-1 rounded-full ${
                overviewStats.revenueGrowth >= 0
                  ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                  : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
              }`}
            >
              {overviewStats.revenueGrowth >= 0 ? (
                <TrendingUp size={14} />
              ) : (
                <TrendingDown size={14} />
              )}
              <span className="font-bold">{Math.abs(overviewStats.revenueGrowth)}%</span>
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
            {formatCurrency(overviewStats.totalRevenue)}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Total Revenue</p>
        </div>

        <div className="bg-white dark:bg-gray-950 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
              <Users size={24} className="text-blue-600" />
            </div>
            <div
              className={`flex items-center space-x-1 text-sm px-2 py-1 rounded-full ${
                overviewStats.userGrowth >= 0
                  ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                  : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
              }`}
            >
              {overviewStats.userGrowth >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
              <span className="font-bold">{Math.abs(overviewStats.userGrowth)}%</span>
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
            {overviewStats.totalUsers.toLocaleString()}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Total Users</p>
        </div>

        <div className="bg-white dark:bg-gray-950 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
              <Home size={24} className="text-purple-600" />
            </div>
            <div
              className={`flex items-center space-x-1 text-sm px-2 py-1 rounded-full ${
                overviewStats.listingGrowth >= 0
                  ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                  : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
              }`}
            >
              {overviewStats.listingGrowth >= 0 ? (
                <TrendingUp size={14} />
              ) : (
                <TrendingDown size={14} />
              )}
              <span className="font-bold">{Math.abs(overviewStats.listingGrowth)}%</span>
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
            {overviewStats.totalListings.toLocaleString()}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Total Listings</p>
        </div>

        <div className="bg-white dark:bg-gray-950 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-xl">
              <CreditCard size={24} className="text-orange-600" />
            </div>
            <div
              className={`flex items-center space-x-1 text-sm px-2 py-1 rounded-full ${
                overviewStats.subscriptionGrowth >= 0
                  ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                  : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
              }`}
            >
              {overviewStats.subscriptionGrowth >= 0 ? (
                <TrendingUp size={14} />
              ) : (
                <TrendingDown size={14} />
              )}
              <span className="font-bold">{Math.abs(overviewStats.subscriptionGrowth)}%</span>
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
            {overviewStats.activeSubscriptions.toLocaleString()}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Active Subscriptions</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-950 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Revenue Trend</h2>
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <span className="text-sm text-gray-600 dark:text-gray-400">Revenue</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-sm text-gray-600 dark:text-gray-400">Target</span>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            {revenueData.map((data, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {data.month}
                  </span>
                  <div className="flex items-center space-x-3">
                    <span className="text-sm font-bold text-purple-600">
                      {formatCurrency(data.revenue)}
                    </span>
                    <span className="text-xs text-gray-500">
                      Target: {formatCurrency(data.target)}
                    </span>
                  </div>
                </div>
                <div className="relative h-8 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
                  <div
                    className="absolute h-full bg-blue-200 dark:bg-blue-900/30 rounded-lg"
                    style={{ width: `${(data.target / 300000) * 100}%` }}
                  />
                  <div
                    className="absolute h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg"
                    style={{ width: `${(data.revenue / 300000) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-950 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">User Growth</h2>
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-sm text-gray-600 dark:text-gray-400">Total</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600 dark:text-gray-400">Active</span>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            {userGrowthData.map((data, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {data.month}
                  </span>
                  <div className="flex items-center space-x-3">
                    <span className="text-sm font-bold text-blue-600">
                      {data.users.toLocaleString()}
                    </span>
                    <span className="text-xs text-gray-500">
                      Active: {data.active.toLocaleString()}
                    </span>
                  </div>
                </div>
                <div className="relative h-8 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
                  <div
                    className="absolute h-full bg-blue-500 rounded-lg"
                    style={{ width: `${(data.users / 15000) * 100}%` }}
                  />
                  <div
                    className="absolute h-full bg-green-500 rounded-lg"
                    style={{ width: `${(data.active / 15000) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-gray-950 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
            Top Performing Cities
          </h2>
          <div className="space-y-4">
            {topCities.map((city, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-xl hover:shadow-md transition-all"
              >
                <div className="flex items-center space-x-4">
                  <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg text-white font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <MapPin size={16} className="text-gray-400" />
                      <h3 className="font-bold text-gray-900 dark:text-white">{city.city}</h3>
                    </div>
                    <div className="flex items-center space-x-4 mt-1">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {city.users.toLocaleString()} users
                      </span>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {city.listings.toLocaleString()} listings
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-green-600">{formatCurrency(city.revenue)}</p>
                  <div className="flex items-center space-x-1 text-sm text-green-600 mt-1">
                    <TrendingUp size={14} />
                    <span>{city.growth}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-950 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
            Subscription Breakdown
          </h2>
          <div className="space-y-4">
            {subscriptionBreakdown.map((plan, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        plan.color === 'blue'
                          ? 'bg-blue-500'
                          : plan.color === 'purple'
                            ? 'bg-purple-500'
                            : 'bg-orange-500'
                      }`}
                    />
                    <span className="font-medium text-gray-900 dark:text-white">{plan.plan}</span>
                  </div>
                  <span className="text-sm font-bold text-gray-900 dark:text-white">
                    {plan.percentage}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-3 mb-2">
                  <div
                    className={`h-3 rounded-full ${
                      plan.color === 'blue'
                        ? 'bg-blue-500'
                        : plan.color === 'purple'
                          ? 'bg-purple-500'
                          : 'bg-orange-500'
                    }`}
                    style={{ width: `${plan.percentage}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">
                    {plan.subscribers} subscribers
                  </span>
                  <span className="font-bold text-green-600">{formatCurrency(plan.revenue)}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-800">
            <div className="flex items-center justify-between">
              <span className="font-bold text-gray-900 dark:text-white">Total Revenue</span>
              <span className="text-xl font-bold text-purple-600">
                {formatCurrency(
                  subscriptionBreakdown.reduce((sum, plan) => sum + plan.revenue, 0)
                )}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-950 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Traffic Sources</h2>
          <div className="space-y-4">
            {trafficSources.map((source, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                      {source.source === 'Direct' && <MousePointer size={18} className="text-purple-600" />}
                      {source.source === 'Organic Search' && <Target size={18} className="text-purple-600" />}
                      {source.source === 'Social Media' && <Users size={18} className="text-purple-600" />}
                      {source.source === 'Referral' && <ArrowUpRight size={18} className="text-purple-600" />}
                      {source.source === 'Email' && <Activity size={18} className="text-purple-600" />}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{source.source}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {source.visitors.toLocaleString()} visitors
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900 dark:text-white">{source.percentage}%</p>
                    <p className="text-sm text-green-600">{source.conversion}% conv.</p>
                  </div>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-2">
                  <div
                    className="h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                    style={{ width: `${source.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-950 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Recent Activity</h2>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-xl"
              >
                <div className="flex items-center space-x-3">
                  <div
                    className={`p-2 rounded-lg ${
                      activity.type === 'user_signup'
                        ? 'bg-blue-100 dark:bg-blue-900/30'
                        : activity.type === 'listing_created'
                          ? 'bg-purple-100 dark:bg-purple-900/30'
                          : activity.type === 'subscription'
                            ? 'bg-orange-100 dark:bg-orange-900/30'
                            : 'bg-green-100 dark:bg-green-900/30'
                    }`}
                  >
                    {activity.type === 'user_signup' && <UserPlus size={18} className="text-blue-600" />}
                    {activity.type === 'listing_created' && <Home size={18} className="text-purple-600" />}
                    {activity.type === 'subscription' && <CreditCard size={18} className="text-orange-600" />}
                    {activity.type === 'payment' && <ShoppingCart size={18} className="text-green-600" />}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{activity.message}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <Clock size={14} className="text-gray-400" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {activity.time}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {activity.count}
                  </p>
                  <div className="flex items-center space-x-1 text-green-600 text-sm mt-1">
                    <TrendingUp size={14} />
                    <span>Active</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <Eye size={32} className="opacity-80" />
            <ArrowUpRight size={24} />
          </div>
          <p className="text-3xl font-bold mb-1">456.7K</p>
          <p className="text-sm opacity-80">Total Page Views</p>
          <div className="flex items-center space-x-1 text-sm mt-2 bg-white/20 px-2 py-1 rounded-full w-fit">
            <TrendingUp size={14} />
            <span>12.5%</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <Target size={32} className="opacity-80" />
            <ArrowUpRight size={24} />
          </div>
          <p className="text-3xl font-bold mb-1">4.8%</p>
          <p className="text-sm opacity-80">Conversion Rate</p>
          <div className="flex items-center space-x-1 text-sm mt-2 bg-white/20 px-2 py-1 rounded-full w-fit">
            <TrendingUp size={14} />
            <span>0.8%</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <Clock size={32} className="opacity-80" />
            <ArrowDownRight size={24} />
          </div>
          <p className="text-3xl font-bold mb-1">3m 24s</p>
          <p className="text-sm opacity-80">Avg. Session Duration</p>
          <div className="flex items-center space-x-1 text-sm mt-2 bg-white/20 px-2 py-1 rounded-full w-fit">
            <TrendingDown size={14} />
            <span>5.2%</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <Zap size={32} className="opacity-80" />
            <ArrowUpRight size={24} />
          </div>
          <p className="text-3xl font-bold mb-1">89.3%</p>
          <p className="text-sm opacity-80">Customer Satisfaction</p>
          <div className="flex items-center space-x-1 text-sm mt-2 bg-white/20 px-2 py-1 rounded-full w-fit">
            <TrendingUp size={14} />
            <span>3.1%</span>
          </div>
        </div>
      </div>
    </div>
  )
}
