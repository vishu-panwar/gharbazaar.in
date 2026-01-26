'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  CheckSquare,
  MapPin,
  Camera,
  DollarSign,
  TrendingUp,
  Clock,
  Star,
  Award,
  Navigation,
  FileCheck,
  MessageSquare,
  Bell,
  Calendar,
  Target,
  Zap,
  Shield,
  Users,
  Activity
} from 'lucide-react'

export default function GroundPartnerDashboard() {
  const [user, setUser] = useState<any>(null)
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (userData) {
      setUser(JSON.parse(userData))
    }
  }, [])

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

  // Dashboard Stats
  const stats = [
    {
      label: 'Active Tasks',
      value: '8',
      change: '+3 today',
      icon: CheckSquare,
      color: 'blue',
      trend: 'up'
    },
    {
      label: 'Completed Visits',
      value: '24',
      change: '+6 this week',
      icon: MapPin,
      color: 'green',
      trend: 'up'
    },
    {
      label: 'This Month Earnings',
      value: '₹18,500',
      change: '+12%',
      icon: DollarSign,
      color: 'emerald',
      trend: 'up'
    },
    {
      label: 'Success Rate',
      value: '94%',
      change: '+2%',
      icon: Award,
      color: 'purple',
      trend: 'up'
    }
  ]

  // Today's Tasks
  const todayTasks = [
    {
      id: 1,
      type: 'Site Visit',
      property: '3BHK Apartment, Bandra West',
      client: 'Priya Sharma',
      time: '10:00 AM',
      priority: 'high',
      status: 'pending',
      address: 'Hill Road, Bandra West, Mumbai'
    },
    {
      id: 2,
      type: 'Documentation',
      property: 'Commercial Space, Andheri',
      client: 'Rajesh Patel',
      time: '2:00 PM',
      priority: 'medium',
      status: 'in-progress',
      address: 'Andheri East, Mumbai'
    },
    {
      id: 3,
      type: 'Verification',
      property: '2BHK Flat, Powai',
      client: 'Amit Kumar',
      time: '4:30 PM',
      priority: 'low',
      status: 'pending',
      address: 'Hiranandani, Powai, Mumbai'
    }
  ]

  // Recent Activities
  const recentActivities = [
    {
      id: 1,
      action: 'Completed site visit',
      property: 'Villa in Juhu',
      time: '2 hours ago',
      icon: CheckSquare,
      color: 'green'
    },
    {
      id: 2,
      action: 'Uploaded verification report',
      property: 'Office Space, BKC',
      time: '4 hours ago',
      icon: FileCheck,
      color: 'blue'
    },
    {
      id: 3,
      action: 'Received new task',
      property: 'Apartment in Worli',
      time: '6 hours ago',
      icon: Bell,
      color: 'orange'
    }
  ]

  // Performance Metrics
  const performanceMetrics = [
    { label: 'Tasks Completed', value: '156', period: 'This Month' },
    { label: 'Client Rating', value: '4.8/5', period: 'Average' },
    { label: 'Response Time', value: '12 mins', period: 'Average' },
    { label: 'Area Coverage', value: '15 km²', period: 'Active Zone' }
  ]

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
      case 'medium':
        return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
      case 'low':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
      case 'in-progress':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
      case 'pending':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
    }
  }

  return (
    <div className="space-y-8">
      {/* Premium Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-blue-700 rounded-3xl p-8 text-white">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full animate-pulse"></div>
          <div className="absolute top-1/2 -left-8 w-32 h-32 bg-white/5 rounded-full animate-bounce"></div>
          <div className="absolute bottom-4 right-1/3 w-16 h-16 bg-white/10 rounded-full animate-pulse delay-1000"></div>
          <div className="absolute top-8 left-1/4 w-20 h-20 bg-white/5 rounded-full animate-bounce delay-500"></div>
        </div>

        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl">
                  <img
                    src="/images/gharbazaar-logo.jpg"
                    alt="GharBazaar Logo"
                    className="h-8 w-8 rounded-xl object-cover"
                  />
                </div>
                <div>
                  <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-white text-sm font-medium">Ground Partner</span>
                  </div>
                  <h1 className="text-4xl font-bold">{getGreeting()}, {user?.name || 'Partner'}! 🏠</h1>
                  <p className="text-blue-100 text-lg">Ready to make a difference in real estate today</p>
                </div>
              </div>

              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                  <Shield className="text-blue-200" size={20} />
                  <span className="text-blue-100">Verified Partner</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Zap className="text-blue-200" size={20} />
                  <span className="text-blue-100">Quick Response</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Target className="text-blue-200" size={20} />
                  <span className="text-blue-100">High Performance</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/ground-partner/tasks" className="flex items-center space-x-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-8 py-4 rounded-2xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl border border-white/20">
                  <CheckSquare size={24} />
                  <span className="text-lg">View Tasks</span>
                </Link>
                <Link href="/ground-partner/visits" className="flex items-center space-x-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white px-8 py-4 rounded-2xl font-semibold transition-all duration-300 border border-white/20">
                  <MapPin size={24} />
                  <span className="text-lg">Site Visits</span>
                </Link>
              </div>
            </div>

            <div className="hidden lg:flex flex-col items-end space-y-4">
              <div className="text-right bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <p className="text-3xl font-bold text-white mb-1">
                  {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
                <p className="text-blue-200 text-sm">Local Time</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                <p className="text-white text-sm">Zone: <span className="font-bold">{user?.zone || 'Western Suburbs'}</span></p>
                <p className="text-blue-200 text-xs">Active in <span className="font-bold text-white">{user?.city || 'Mumbai'}</span></p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="group bg-white dark:bg-gray-950 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 bg-gradient-to-br ${stat.color === 'blue' ? 'from-blue-500 to-blue-600' :
                  stat.color === 'green' ? 'from-green-500 to-green-600' :
                    stat.color === 'emerald' ? 'from-emerald-500 to-emerald-600' :
                      'from-purple-500 to-purple-600'
                } rounded-2xl group-hover:scale-110 transition-transform duration-300`}>
                <stat.icon size={24} className="text-white" />
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <p className={`text-sm font-medium ${stat.trend === 'up' ? 'text-green-600' : 'text-blue-600'}`}>
                {stat.change}
              </p>
              <div className="h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden w-16">
                <div className={`h-full bg-gradient-to-r ${stat.color === 'blue' ? 'from-blue-500 to-blue-600' :
                    stat.color === 'green' ? 'from-green-500 to-green-600' :
                      stat.color === 'emerald' ? 'from-emerald-500 to-emerald-600' :
                        'from-purple-500 to-purple-600'
                  } rounded-full w-3/4`}></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Today's Tasks */}
        <div className="xl:col-span-2 space-y-8">
          <div className="bg-white dark:bg-gray-950 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm backdrop-blur-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl mr-3">
                  <Calendar size={24} className="text-white" />
                </div>
                Today's Tasks
              </h2>
              <Link href="/ground-partner/tasks" className="text-blue-600 hover:text-blue-700 font-semibold text-sm bg-blue-50 dark:bg-blue-900/20 px-4 py-2 rounded-xl transition-all">
                View All
              </Link>
            </div>

            <div className="space-y-4">
              {todayTasks.map((task) => (
                <div key={task.id} className="group bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 hover:shadow-lg hover:border-blue-500 transition-all duration-300">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${getPriorityColor(task.priority)}`}>
                          {task.priority}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(task.status)}`}>
                          {task.status}
                        </span>
                      </div>
                      <h3 className="font-bold text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors text-lg">
                        {task.type} - {task.property}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        Client: <span className="font-medium">{task.client}</span>
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-500 mt-1 flex items-center">
                        <MapPin size={14} className="mr-1" />
                        {task.address}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center bg-gray-100 dark:bg-gray-800 px-3 py-2 rounded-xl">
                      <Clock size={16} className="mr-2" />
                      {task.time}
                    </span>
                    <div className="flex space-x-2">
                      <button className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white px-4 py-2 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl text-sm">
                        Start Task
                      </button>
                      <button className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-xl font-semibold transition-all text-sm">
                        Navigate
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activities */}
          <div className="bg-white dark:bg-gray-950 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm backdrop-blur-sm">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center mb-6">
              <div className="p-2 bg-gradient-to-br from-green-500 to-green-600 rounded-xl mr-3">
                <Activity size={24} className="text-white" />
              </div>
              Recent Activity
            </h2>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-4 p-4 rounded-2xl hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 dark:hover:from-gray-900 dark:hover:to-gray-800 transition-all duration-300 border border-transparent hover:border-gray-200 dark:hover:border-gray-700">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${activity.color === 'green' ? 'bg-gradient-to-br from-green-500 to-green-600' :
                      activity.color === 'blue' ? 'bg-gradient-to-br from-blue-500 to-blue-600' :
                        'bg-gradient-to-br from-orange-500 to-orange-600'
                    }`}>
                    <activity.icon size={20} className="text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-lg font-bold text-gray-900 dark:text-white">
                      {activity.action}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {activity.property}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-2 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full inline-block">
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          {/* Quick Actions */}
          <div className="bg-white dark:bg-gray-950 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm backdrop-blur-sm">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
              <div className="p-2 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl mr-3">
                <Zap size={24} className="text-white" />
              </div>
              Quick Actions
            </h2>
            <div className="space-y-4">
              <Link href="/ground-partner/visits" className="group flex items-center space-x-4 p-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1">
                <div className="p-2 bg-white/20 rounded-xl">
                  <MapPin size={20} />
                </div>
                <span className="font-semibold text-lg">Start Site Visit</span>
              </Link>
              <Link href="/ground-partner/reports" className="group flex items-center space-x-4 p-4 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1">
                <div className="p-2 bg-white/20 rounded-xl">
                  <FileCheck size={20} />
                </div>
                <span className="font-semibold text-lg">Upload Report</span>
              </Link>
              <Link href="/ground-partner/messages" className="group flex items-center space-x-4 p-4 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1">
                <div className="p-2 bg-white/20 rounded-xl">
                  <MessageSquare size={20} />
                </div>
                <span className="font-semibold text-lg">Messages</span>
              </Link>
            </div>
          </div>

          {/* Performance Summary */}
          <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-blue-700 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold flex items-center">
                <div className="p-2 bg-white/20 backdrop-blur-sm rounded-xl mr-3">
                  <TrendingUp size={24} />
                </div>
                Performance
              </h2>
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            </div>

            <div className="space-y-4">
              {performanceMetrics.map((metric, index) => (
                <div key={index} className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-blue-100 text-sm font-medium">{metric.label}</span>
                    <span className="text-xs px-2 py-1 bg-green-400 text-green-900 rounded-full font-bold">
                      {metric.period}
                    </span>
                  </div>
                  <p className="text-2xl font-bold">{metric.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Earnings Overview */}
          <div className="bg-white dark:bg-gray-950 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm backdrop-blur-sm">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
              <div className="p-2 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl mr-3">
                <DollarSign size={24} className="text-white" />
              </div>
              Earnings
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20 rounded-2xl border border-emerald-200 dark:border-emerald-800">
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">This Month</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">24 tasks completed</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-emerald-600">₹18,500</p>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-2xl border border-blue-200 dark:border-blue-800">
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">Pending</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Payment processing</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-blue-600">₹3,200</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
