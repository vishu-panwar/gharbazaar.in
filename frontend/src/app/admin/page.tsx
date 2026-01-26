'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  LayoutDashboard,
  Users,
  Home,
  Briefcase,
  DollarSign,
  CreditCard,
  Crown,
  BarChart3,
  Settings,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  Activity,
  Eye,
  UserPlus,
  ShoppingCart,
  Calendar,
  Award,
  Zap,
  Clock
} from 'lucide-react'

export default function AdminDashboardPage() {
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const getGreeting = () => {
    const hour = currentTime.getHours()
    if (hour < 12) return 'Good Morning'
    if (hour < 17) return 'Good Afternoon'
    return 'Good Evening'
  }

  // Admin Stats
  const stats = [
    { 
      label: 'Total Users', 
      value: '12,458', 
      change: '+12.5%', 
      trend: 'up',
      icon: Users, 
      color: 'blue',
      link: '/admin/users'
    },
    { 
      label: 'Active Listings', 
      value: '3,847', 
      change: '+8.2%', 
      trend: 'up',
      icon: Home, 
      color: 'green',
      link: '/admin/listings'
    },
    { 
      label: 'Total Revenue', 
      value: '₹45.2Cr', 
      change: '+18.7%', 
      trend: 'up',
      icon: DollarSign, 
      color: 'purple',
      link: '/admin/payments'
    },
    { 
      label: 'Employees', 
      value: '156', 
      change: '+5', 
      trend: 'up',
      icon: Briefcase, 
      color: 'orange',
      link: '/admin/employees'
    }
  ]

  // Quick Stats
  const quickStats = [
    { label: 'Today\'s Revenue', value: '₹12.5L', icon: DollarSign, color: 'green' },
    { label: 'New Users', value: '234', icon: UserPlus, color: 'blue' },
    { label: 'Active Sessions', value: '1,847', icon: Activity, color: 'purple' },
    { label: 'Pending Approvals', value: '45', icon: Clock, color: 'orange' }
  ]

  // Recent Activities
  const recentActivities = [
    {
      id: 1,
      type: 'user',
      title: 'New User Registration',
      description: 'Rahul Sharma joined as buyer',
      time: '5 minutes ago',
      icon: UserPlus,
      color: 'blue'
    },
    {
      id: 2,
      type: 'listing',
      title: 'New Property Listed',
      description: 'Luxury Penthouse in Worli',
      time: '15 minutes ago',
      icon: Home,
      color: 'green'
    },
    {
      id: 3,
      type: 'payment',
      title: 'Payment Received',
      description: '₹2.5L from subscription',
      time: '1 hour ago',
      icon: CreditCard,
      color: 'purple'
    },
    {
      id: 4,
      type: 'employee',
      title: 'Employee Added',
      description: 'New support team member',
      time: '2 hours ago',
      icon: Briefcase,
      color: 'orange'
    }
  ]

  // Top Performers
  const topPerformers = [
    { name: 'Priya Sharma', role: 'Sales Lead', performance: 95, revenue: '₹8.5L' },
    { name: 'Amit Kumar', role: 'Support Head', performance: 92, revenue: '₹6.2L' },
    { name: 'Sneha Reddy', role: 'Verification', performance: 88, revenue: '₹4.8L' }
  ]

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-900 rounded-2xl sm:rounded-3xl shadow-2xl">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-pink-500 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        </div>
        
        <div className="relative z-10 p-6 sm:p-8 lg:p-10">
          <div className="flex flex-col lg:flex-row items-start justify-between">
            <div className="flex-1">
              <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-4">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-white text-sm font-medium">Admin Portal</span>
              </div>
              
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2">
                {getGreeting()}, Admin! 👑
              </h1>
              <p className="text-purple-100 mb-6 text-sm sm:text-base lg:text-lg">
                Platform Overview: <span className="font-bold text-white">12,458 users</span>, <span className="font-bold text-white">3,847 listings</span>, <span className="font-bold text-white">₹45.2Cr revenue</span>
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <Link href="/admin/users" className="group bg-white text-purple-600 hover:bg-purple-50 px-6 py-3 rounded-xl font-semibold transition-all flex items-center justify-center space-x-2 shadow-lg">
                  <Users size={20} />
                  <span>Manage Users</span>
                </Link>
                <Link href="/admin/analytics" className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-6 py-3 rounded-xl font-semibold transition-all flex items-center justify-center space-x-2">
                  <BarChart3 size={20} />
                  <span>View Analytics</span>
                </Link>
              </div>
            </div>
            
            <div className="hidden lg:flex flex-col items-end space-y-4 mt-8 lg:mt-0">
              <div className="text-right bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                <p className="text-3xl font-bold text-white mb-1">
                  {currentTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </p>
                <p className="text-purple-200 text-sm">System Time</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {stats.map((stat, index) => (
          <Link
            key={index}
            href={stat.link}
            className="group bg-white dark:bg-gray-900 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-200 dark:border-gray-800 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 cursor-pointer"
          >
            <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-${stat.color}-100 dark:bg-${stat.color}-900/30 flex items-center justify-center shadow-lg mb-3 sm:mb-4 group-hover:scale-110 transition-transform`}>
              <stat.icon className={`text-${stat.color}-600`} size={20} />
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm font-medium mb-1">{stat.label}</p>
            <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-1">
              {stat.value}
            </p>
            <div className="flex items-center space-x-1">
              {stat.trend === 'up' ? (
                <TrendingUp size={14} className="text-green-600" />
              ) : (
                <TrendingDown size={14} className="text-red-600" />
              )}
              <p className={`text-xs font-medium ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                {stat.change}
              </p>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {quickStats.map((stat, index) => (
          <div key={index} className="bg-white dark:bg-gray-900 rounded-xl p-4 shadow-lg border border-gray-200 dark:border-gray-800">
            <div className="flex items-center justify-between">
              <div className={`w-10 h-10 bg-${stat.color}-100 dark:bg-${stat.color}-900/30 rounded-lg flex items-center justify-center`}>
                <stat.icon className={`text-${stat.color}-600`} size={18} />
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 sm:gap-8">
        {/* Recent Activities */}
        <div className="xl:col-span-2">
          <div className="bg-white dark:bg-gray-900 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-200 dark:border-gray-800">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white flex items-center">
                <Activity className="mr-2 text-purple-500" size={24} />
                Recent Activities
              </h2>
              <Link href="/admin/analytics" className="text-purple-600 hover:text-purple-700 font-medium text-sm">
                View All
              </Link>
            </div>
            
            <div className="space-y-3">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-4 p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  <div className={`w-10 h-10 rounded-full bg-${activity.color}-100 dark:bg-${activity.color}-900/30 flex items-center justify-center flex-shrink-0`}>
                    <activity.icon size={18} className={`text-${activity.color}-600`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      {activity.title}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      {activity.description}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-800">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
              <Zap className="mr-2 text-yellow-500" size={20} />
              Quick Actions
            </h2>
            <div className="space-y-3">
              <Link href="/admin/users" className="flex items-center space-x-3 p-4 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-xl hover:shadow-lg transition-all group">
                <Users size={20} />
                <span className="font-semibold">Manage Users</span>
                <ArrowUpRight size={16} className="ml-auto group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </Link>
              <Link href="/admin/listings" className="flex items-center space-x-3 p-4 bg-gradient-to-r from-green-500 to-green-700 text-white rounded-xl hover:shadow-lg transition-all group">
                <Home size={20} />
                <span className="font-semibold">Manage Listings</span>
                <ArrowUpRight size={16} className="ml-auto group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </Link>
              <Link href="/admin/employees" className="flex items-center space-x-3 p-4 bg-gradient-to-r from-orange-500 to-orange-700 text-white rounded-xl hover:shadow-lg transition-all group">
                <Briefcase size={20} />
                <span className="font-semibold">Manage Employees</span>
                <ArrowUpRight size={16} className="ml-auto group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </Link>
              <Link href="/admin/payments" className="flex items-center space-x-3 p-4 bg-gradient-to-r from-purple-500 to-purple-700 text-white rounded-xl hover:shadow-lg transition-all group">
                <CreditCard size={20} />
                <span className="font-semibold">View Payments</span>
                <ArrowUpRight size={16} className="ml-auto group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </Link>
            </div>
          </div>
          
          {/* Top Performers */}
          <div className="bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-900 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold flex items-center">
                <Award className="mr-2" size={20} />
                Top Performers
              </h2>
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            </div>
            
            <div className="space-y-4">
              {topPerformers.map((performer, index) => (
                <div key={index} className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="font-semibold">{performer.name}</p>
                      <p className="text-xs text-purple-200">{performer.role}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg">{performer.performance}%</p>
                      <p className="text-xs text-purple-200">{performer.revenue}</p>
                    </div>
                  </div>
                  <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-green-400 rounded-full transition-all"
                      style={{ width: `${performer.performance}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
