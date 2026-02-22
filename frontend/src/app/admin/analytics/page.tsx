'use client'

import { useEffect, useMemo, useState } from 'react'
import { CreditCard, Download, DollarSign, Home, TrendingDown, TrendingUp, Users } from 'lucide-react'
import { backendApi } from '@/lib/backendApi'

type OverviewStats = {
  totalRevenue: number
  revenueGrowth: number
  totalUsers: number
  userGrowth: number
  totalListings: number
  listingGrowth: number
  activeSubscriptions: number
  subscriptionGrowth: number
}

type RevenuePoint = {
  month: string
  revenue: number
  target?: number
}

type UserGrowthPoint = {
  month: string
  users: number
  active?: number
}

type CityPoint = {
  city: string
  users?: number
  listings?: number
  revenue?: number
  growth?: number
}

type ActivityPoint = {
  type?: string
  message: string
  count?: number
  time?: string
}

const defaultOverview: OverviewStats = {
  totalRevenue: 0,
  revenueGrowth: 0,
  totalUsers: 0,
  userGrowth: 0,
  totalListings: 0,
  listingGrowth: 0,
  activeSubscriptions: 0,
  subscriptionGrowth: 0,
}

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
  }).format(amount)

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [dateRange, setDateRange] = useState('7days')

  const [overviewStats, setOverviewStats] = useState<OverviewStats>(defaultOverview)
  const [revenueData, setRevenueData] = useState<RevenuePoint[]>([])
  const [userGrowthData, setUserGrowthData] = useState<UserGrowthPoint[]>([])
  const [topCities, setTopCities] = useState<CityPoint[]>([])
  const [recentActivity, setRecentActivity] = useState<ActivityPoint[]>([])

  const loadAnalytics = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await backendApi.analytics.getAdminDashboard()
      if (!response?.success || !response?.data) {
        throw new Error(response?.error || 'Failed to fetch analytics')
      }

      const data = response.data
      setOverviewStats({ ...defaultOverview, ...(data.overviewStats || {}) })
      setRevenueData(Array.isArray(data.revenueData) ? data.revenueData : [])
      setUserGrowthData(Array.isArray(data.userGrowthData) ? data.userGrowthData : [])
      setTopCities(Array.isArray(data.topCities) ? data.topCities : [])
      setRecentActivity(Array.isArray(data.recentActivity) ? data.recentActivity : [])
    } catch (err: any) {
      setError(err?.message || 'Failed to load analytics')
      setOverviewStats(defaultOverview)
      setRevenueData([])
      setUserGrowthData([])
      setTopCities([])
      setRecentActivity([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadAnalytics()
  }, [dateRange])

  const exportAnalytics = () => {
    const payload = {
      generatedAt: new Date().toISOString(),
      dateRange,
      overviewStats,
      revenueData,
      userGrowthData,
      topCities,
      recentActivity,
    }

    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = `admin-analytics-${Date.now()}.json`
    anchor.click()
    URL.revokeObjectURL(url)
  }

  const overviewCards = useMemo(
    () => [
      {
        title: 'Total Revenue',
        value: formatCurrency(overviewStats.totalRevenue),
        growth: overviewStats.revenueGrowth,
        icon: DollarSign,
      },
      {
        title: 'Total Users',
        value: overviewStats.totalUsers.toLocaleString(),
        growth: overviewStats.userGrowth,
        icon: Users,
      },
      {
        title: 'Total Listings',
        value: overviewStats.totalListings.toLocaleString(),
        growth: overviewStats.listingGrowth,
        icon: Home,
      },
      {
        title: 'Active Subscriptions',
        value: overviewStats.activeSubscriptions.toLocaleString(),
        growth: overviewStats.subscriptionGrowth,
        icon: CreditCard,
      },
    ],
    [overviewStats]
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Analytics Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Live platform analytics for admin operations.</p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={dateRange}
            onChange={(event) => setDateRange(event.target.value)}
            className="px-3 py-2.5 bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg"
          >
            <option value="today">Today</option>
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
            <option value="90days">Last 90 Days</option>
            <option value="year">This Year</option>
          </select>

          <button
            onClick={exportAnalytics}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
          >
            <Download size={16} />
            <span>Export</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl p-12 text-center">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      ) : error ? (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 text-red-700 dark:text-red-300">
          {error}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {overviewCards.map((card) => (
              <div key={card.title} className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{card.title}</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{card.value}</p>
                    <div className={`mt-2 inline-flex items-center gap-1 text-xs font-medium ${card.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {card.growth >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                      <span>{Math.abs(card.growth)}%</span>
                    </div>
                  </div>
                  <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/20 text-blue-600">
                    <card.icon size={18} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl p-5">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Revenue Trend</h2>
              {revenueData.length === 0 ? (
                <p className="text-sm text-gray-500 dark:text-gray-400">No revenue trend data returned by backend.</p>
              ) : (
                <div className="space-y-3">
                  {revenueData.map((entry) => (
                    <div key={entry.month} className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">{entry.month}</span>
                      <span className="font-medium text-gray-900 dark:text-white">{formatCurrency(entry.revenue)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl p-5">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">User Growth</h2>
              {userGrowthData.length === 0 ? (
                <p className="text-sm text-gray-500 dark:text-gray-400">No user growth data returned by backend.</p>
              ) : (
                <div className="space-y-3">
                  {userGrowthData.map((entry) => (
                    <div key={entry.month} className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">{entry.month}</span>
                      <span className="font-medium text-gray-900 dark:text-white">{entry.users.toLocaleString()} users</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl p-5">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Top Cities</h2>
              {topCities.length === 0 ? (
                <p className="text-sm text-gray-500 dark:text-gray-400">No city analytics available yet.</p>
              ) : (
                <div className="space-y-3">
                  {topCities.map((city, index) => (
                    <div key={`${city.city}-${index}`} className="flex items-center justify-between text-sm">
                      <span className="text-gray-900 dark:text-white">{city.city}</span>
                      <span className="text-gray-600 dark:text-gray-400">{(city.listings || city.users || 0).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl p-5">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Activity</h2>
              {recentActivity.length === 0 ? (
                <p className="text-sm text-gray-500 dark:text-gray-400">No recent activity returned by backend.</p>
              ) : (
                <div className="space-y-3">
                  {recentActivity.map((activity, index) => (
                    <div key={`${activity.message}-${index}`} className="text-sm">
                      <p className="font-medium text-gray-900 dark:text-white">{activity.message}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Count: {activity.count || 0} • {activity.time || 'No timestamp'}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}


