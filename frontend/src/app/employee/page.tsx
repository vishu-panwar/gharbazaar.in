'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Users,
  FileCheck,
  MessageCircle,
  AlertCircle,
  Phone,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  Award,
  Target,
  Activity,
  Calendar,
  BarChart3,
  Home,
  Eye,
  Star,
  Zap,
  Sparkles,
  Shield,
  Briefcase,
  Loader2,
  Pause,
} from 'lucide-react'
import toast from 'react-hot-toast'
import { backendApi } from '@/lib/backendApi'

export default function EmployeeDashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [attendance, setAttendance] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (userData) {
      const parsedUser = JSON.parse(userData)
      setUser(parsedUser)
      fetchTodayAttendance(parsedUser.uid)
    }
  }, [])

  const fetchTodayAttendance = async (uid?: string) => {
    try {
      const today = new Date().toISOString().split('T')[0]
      const res = await backendApi.attendance.getHistory({
        userId: uid || user?.uid,
        startDate: today,
        endDate: today
      })
      if (res.success && res.data.records.length > 0) {
        setAttendance(res.data.records[0])
      }
    } catch (error) {
      console.error('Error fetching attendance:', error)
    }
  }

  const handleMarkAttendance = async (type: 'check-in' | 'check-out') => {
    setLoading(true)
    try {
      const res = await backendApi.attendance.mark({
        checkOut: type === 'check-out',
        status: 'present'
      })
      if (res.success) {
        setAttendance(res.data.attendance)
        toast.success(type === 'check-in' ? 'Checked in successfully' : 'Checked out successfully')
      } else {
        toast.error(res.error || 'Failed to mark attendance')
      }
    } catch (error) {
      console.error('Attendance error:', error)
      toast.error('Connection error')
    } finally {
      setLoading(true)
      // Small delay to prevent double clicking
      setTimeout(() => setLoading(false), 1000)
    }
  }

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

  // Employee Stats
  const stats = [
    {
      label: 'Pending Tasks',
      value: '24',
      change: '+3 today',
      icon: Clock,
      color: 'orange',
      trend: 'up'
    },
    {
      label: 'Completed Today',
      value: '18',
      change: '+12%',
      icon: CheckCircle,
      color: 'green',
      trend: 'up'
    },
    {
      label: 'Active Tickets',
      value: '12',
      change: '-2 from yesterday',
      icon: MessageCircle,
      color: 'blue',
      trend: 'down'
    },
    {
      label: 'Performance Score',
      value: '94%',
      change: '+5%',
      icon: Award,
      color: 'purple',
      trend: 'up'
    }
  ]

  // Recent Activities
  const recentActivities = [
    {
      id: 1,
      type: 'kyc',
      title: 'KYC Verified',
      description: 'Verified KYC for Rahul Sharma',
      time: '10 minutes ago',
      icon: FileCheck,
      color: 'green'
    },
    {
      id: 2,
      type: 'support',
      title: 'Ticket Resolved',
      description: 'Resolved support ticket #1234',
      time: '25 minutes ago',
      icon: CheckCircle,
      color: 'blue'
    },
    {
      id: 3,
      type: 'lead',
      title: 'Lead Assigned',
      description: 'New lead assigned from Mumbai',
      time: '1 hour ago',
      icon: Phone,
      color: 'purple'
    },
    {
      id: 4,
      type: 'verification',
      title: 'Property Verified',
      description: 'Verified property in Worli',
      time: '2 hours ago',
      icon: Home,
      color: 'orange'
    }
  ]

  // Pending Tasks
  const pendingTasks = [
    {
      id: 1,
      title: 'Verify KYC Documents',
      user: 'Priya Patel',
      priority: 'high',
      dueTime: '30 mins',
      type: 'KYC'
    },
    {
      id: 2,
      title: 'Property Inspection',
      user: 'Amit Kumar',
      priority: 'medium',
      dueTime: '2 hours',
      type: 'Verification'
    },
    {
      id: 3,
      title: 'Support Ticket',
      user: 'Sneha Reddy',
      priority: 'high',
      dueTime: '1 hour',
      type: 'Support'
    }
  ]

  // Performance Metrics
  const performanceMetrics = [
    { label: 'Avg Response Time', value: '12 mins', status: 'good' },
    { label: 'Resolution Rate', value: '92%', status: 'excellent' },
    { label: 'Customer Rating', value: '4.8/5', status: 'excellent' },
    { label: 'Tasks Completed', value: '156', status: 'good' }
  ]

  return (
    <div className="space-y-8">
      {/* Premium Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-cyan-600 via-blue-600 to-indigo-700 rounded-3xl p-8 text-white">
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
                    src="/logo.jpeg"
                    alt="GharBazaar Logo"
                    className="h-8 w-8 rounded-xl object-cover"
                  />
                </div>
                <div>
                  <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-white text-sm font-medium">Employee Portal</span>
                  </div>
                  <h1 className="text-4xl font-bold">{getGreeting()}, {user?.name || 'Employee'}! 👋</h1>
                  <p className="text-cyan-100 text-lg">Manage your tasks and track performance efficiently</p>
                </div>
              </div>

              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                  <Shield className="text-cyan-200" size={20} />
                  <span className="text-cyan-100">Secure Access</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Zap className="text-cyan-200" size={20} />
                  <span className="text-cyan-100">Quick Actions</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Sparkles className="text-cyan-200" size={20} />
                  <span className="text-cyan-100">Smart Dashboard</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/employee/kyc" className="flex items-center justify-center space-x-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-8 py-4 rounded-2xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl border border-white/20">
                  <FileCheck size={24} />
                  <span className="text-lg">Verify KYC</span>
                </Link>
                {attendance?.checkIn && !attendance?.checkOut ? (
                  <button
                    onClick={() => handleMarkAttendance('check-out')}
                    disabled={loading}
                    className="flex items-center justify-center space-x-3 bg-red-500 hover:bg-red-600 backdrop-blur-sm text-white px-8 py-4 rounded-2xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl border border-white/20"
                  >
                    <XCircle size={24} />
                    <span className="text-lg">Check Out</span>
                  </button>
                ) : (
                  <button
                    onClick={() => handleMarkAttendance('check-in')}
                    disabled={loading || attendance?.checkOut}
                    className="flex items-center justify-center space-x-3 bg-green-500 hover:bg-green-600 disabled:bg-gray-400 backdrop-blur-sm text-white px-8 py-4 rounded-2xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl border border-white/20"
                  >
                    <CheckCircle size={24} />
                    <span className="text-lg">{attendance?.checkOut ? 'Attendance Marked' : 'Check In Today'}</span>
                  </button>
                )}
              </div>
            </div>

            <div className="hidden lg:flex flex-col items-end space-y-4">
              <div className="text-right bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <p className="text-3xl font-bold text-white mb-1">
                  {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </p>
                <p className="text-cyan-200 text-sm">Local Time</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20 min-w-[200px]">
                {attendance?.checkIn ? (
                  <div className="text-right">
                    <p className="text-white text-sm">Checked in at <span className="font-bold">{new Date(attendance.checkIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span></p>
                    {attendance.checkOut && (
                      <p className="text-cyan-200 text-xs">Checked out at <span className="font-bold text-white">{new Date(attendance.checkOut).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span></p>
                    )}
                  </div>
                ) : (
                  <p className="text-white text-sm">Shift hasn't started yet</p>
                )}
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
              <div className={`p-3 bg-gradient-to-br ${stat.color === 'orange' ? 'from-orange-500 to-orange-600' :
                stat.color === 'green' ? 'from-green-500 to-green-600' :
                  stat.color === 'blue' ? 'from-blue-500 to-blue-600' :
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
                <div className={`h-full bg-gradient-to-r ${stat.color === 'orange' ? 'from-orange-500 to-orange-600' :
                  stat.color === 'green' ? 'from-green-500 to-green-600' :
                    stat.color === 'blue' ? 'from-blue-500 to-blue-600' :
                      'from-purple-500 to-purple-600'
                  } rounded-full w-3/4`}></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Pending Tasks */}
        <div className="xl:col-span-2 space-y-8">
          <div className="bg-white dark:bg-gray-950 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm backdrop-blur-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
                <div className="p-2 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl mr-3">
                  <Target size={24} className="text-white" />
                </div>
                Pending Tasks
              </h2>
              <Link href="/employee/kyc" className="text-cyan-600 hover:text-cyan-700 font-semibold text-sm bg-cyan-50 dark:bg-cyan-900/20 px-4 py-2 rounded-xl transition-all">
                View All
              </Link>
            </div>

            <div className="space-y-4">
              {pendingTasks.map((task) => (
                <div key={task.id} className="group bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 hover:shadow-lg hover:border-cyan-500 transition-all duration-300">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className={`p-2 rounded-xl ${task.type === 'KYC' ? 'bg-blue-100 dark:bg-blue-900/30' :
                          task.type === 'Verification' ? 'bg-green-100 dark:bg-green-900/30' :
                            'bg-purple-100 dark:bg-purple-900/30'
                          }`}>
                          {task.type === 'KYC' ? <FileCheck size={16} className="text-blue-600" /> :
                            task.type === 'Verification' ? <Home size={16} className="text-green-600" /> :
                              <MessageCircle size={16} className="text-purple-600" />}
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${task.priority === 'high'
                          ? 'bg-red-100 dark:bg-red-900/30 text-red-600'
                          : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600'
                          }`}>
                          {task.priority}
                        </span>
                      </div>
                      <h3 className="font-bold text-gray-900 dark:text-white group-hover:text-cyan-600 transition-colors text-lg">
                        {task.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        User: <span className="font-medium">{task.user}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center bg-gray-100 dark:bg-gray-800 px-3 py-2 rounded-xl">
                      <Clock size={16} className="mr-2" />
                      Due in {task.dueTime}
                    </span>
                    <button className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white px-6 py-3 rounded-2xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl">
                      Start Task
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activities */}
          <div className="bg-white dark:bg-gray-950 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm backdrop-blur-sm">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center mb-6">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl mr-3">
                <Activity size={24} className="text-white" />
              </div>
              Recent Activity
            </h2>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-4 p-4 rounded-2xl hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 dark:hover:from-gray-900 dark:hover:to-gray-800 transition-all duration-300 border border-transparent hover:border-gray-200 dark:hover:border-gray-700">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${activity.color === 'green' ? 'bg-gradient-to-br from-green-500 to-green-600' :
                    activity.color === 'blue' ? 'bg-gradient-to-br from-blue-500 to-blue-600' :
                      activity.color === 'purple' ? 'bg-gradient-to-br from-purple-500 to-purple-600' :
                        'bg-gradient-to-br from-orange-500 to-orange-600'
                    }`}>
                    <activity.icon size={20} className="text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-lg font-bold text-gray-900 dark:text-white">
                      {activity.title}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {activity.description}
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
              <Link href="/employee/kyc" className="group flex items-center space-x-4 p-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1">
                <div className="p-2 bg-white/20 rounded-xl">
                  <FileCheck size={20} />
                </div>
                <span className="font-semibold text-lg">Verify KYC</span>
              </Link>
              <Link href="/employee/verification" className="group flex items-center space-x-4 p-4 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1">
                <div className="p-2 bg-white/20 rounded-xl">
                  <Home size={20} />
                </div>
                <span className="font-semibold text-lg">Verify Property</span>
              </Link>
              <Link href="/employee/support" className="group flex items-center space-x-4 p-4 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1">
                <div className="p-2 bg-white/20 rounded-xl">
                  <MessageCircle size={20} />
                </div>
                <span className="font-semibold text-lg">Support Tickets</span>
              </Link>
              <Link href="/employee/properties" className="group flex items-center space-x-4 p-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1">
                <div className="p-2 bg-white/20 rounded-xl">
                  <Pause size={20} />
                </div>
                <span className="font-semibold text-lg">Manage Inventory</span>
              </Link>
              <Link href="/employee/leads" className="group flex items-center space-x-4 p-4 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1">
                <div className="p-2 bg-white/20 rounded-xl">
                  <Phone size={20} />
                </div>
                <span className="font-semibold text-lg">Manage Leads</span>
              </Link>
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="bg-gradient-to-br from-cyan-600 via-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold flex items-center">
                <div className="p-2 bg-white/20 backdrop-blur-sm rounded-xl mr-3">
                  <BarChart3 size={24} />
                </div>
                Performance
              </h2>
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            </div>

            <div className="space-y-4">
              {performanceMetrics.map((metric, index) => (
                <div key={index} className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-cyan-100 text-sm font-medium">{metric.label}</span>
                    <span className={`text-xs px-3 py-1 rounded-full font-bold ${metric.status === 'excellent'
                      ? 'bg-green-400 text-green-900'
                      : 'bg-yellow-400 text-yellow-900'
                      }`}>
                      {metric.status}
                    </span>
                  </div>
                  <p className="text-2xl font-bold">{metric.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Today's Schedule */}
          <div className="bg-white dark:bg-gray-950 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm backdrop-blur-sm">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
              <div className="p-2 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl mr-3">
                <Calendar size={24} className="text-white" />
              </div>
              Today's Schedule
            </h2>
            <div className="space-y-4">
              <div className="flex items-start space-x-4 p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-2xl border border-blue-200 dark:border-blue-800">
                <div className="bg-blue-600 text-white font-bold text-sm px-3 py-2 rounded-xl">10:00</div>
                <div className="flex-1">
                  <p className="text-lg font-bold text-gray-900 dark:text-white">Team Meeting</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Daily standup</p>
                </div>
              </div>
              <div className="flex items-start space-x-4 p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-2xl border border-green-200 dark:border-green-800">
                <div className="bg-green-600 text-white font-bold text-sm px-3 py-2 rounded-xl">14:00</div>
                <div className="flex-1">
                  <p className="text-lg font-bold text-gray-900 dark:text-white">Property Visit</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Worli, Mumbai</p>
                </div>
              </div>
              <div className="flex items-start space-x-4 p-4 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-2xl border border-purple-200 dark:border-purple-800">
                <div className="bg-purple-600 text-white font-bold text-sm px-3 py-2 rounded-xl">16:00</div>
                <div className="flex-1">
                  <p className="text-lg font-bold text-gray-900 dark:text-white">Training Session</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">New features</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

