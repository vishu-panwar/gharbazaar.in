'use client'

import { useState, useEffect } from 'react'
import { 
  Briefcase, 
  FileCheck, 
  Clock, 
  DollarSign, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  Scale,
  Shield,
  Calendar,
  Eye,
  ArrowRight,
  FileText,
  Users,
  Award,
  Target,
  Activity,
  Bell,
  Gavel,
  BookOpen,
  MessageSquare
} from 'lucide-react'
import Link from 'next/link'

interface DashboardStats {
  totalCases: number
  activeCases: number
  completedCases: number
  pendingReview: number
  monthlyEarnings: number
  averageRating: number
  completionRate: number
  responseTime: number
}

interface RecentCase {
  id: string
  title: string
  propertyType: string
  clientType: string
  priority: 'low' | 'medium' | 'high' | 'urgent'
  status: 'assigned' | 'under-review' | 'clarification-needed' | 'approved' | 'rejected'
  dueDate: string
  assignedDate: string
  location: string
  fee: number
}

interface Notification {
  id: string
  type: 'case-assigned' | 'document-uploaded' | 'payment-processed' | 'system-update'
  title: string
  message: string
  timestamp: string
  read: boolean
  priority: 'low' | 'medium' | 'high'
}

export default function LegalPartnerDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [recentCases, setRecentCases] = useState<RecentCase[]>([])
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Get user data
    const userData = localStorage.getItem('user')
    if (userData) {
      setUser(JSON.parse(userData))
    }

    // Mock data
    const mockStats: DashboardStats = {
      totalCases: 47,
      activeCases: 8,
      completedCases: 39,
      pendingReview: 3,
      monthlyEarnings: 125000,
      averageRating: 4.8,
      completionRate: 96.2,
      responseTime: 4.2
    }

    const mockRecentCases: RecentCase[] = [
      {
        id: 'LC001',
        title: 'Property Title Verification - Bandra Apartment',
        propertyType: 'Residential Apartment',
        clientType: 'Individual Buyer',
        priority: 'high',
        status: 'assigned',
        dueDate: '2025-01-05T00:00:00Z',
        assignedDate: '2024-12-30T10:00:00Z',
        location: 'Bandra West, Mumbai',
        fee: 15000
      },
      {
        id: 'LC002',
        title: 'RERA Compliance Check - Commercial Complex',
        propertyType: 'Commercial',
        clientType: 'Developer',
        priority: 'urgent',
        status: 'under-review',
        dueDate: '2025-01-02T00:00:00Z',
        assignedDate: '2024-12-28T14:30:00Z',
        location: 'Andheri East, Mumbai',
        fee: 25000
      },
      {
        id: 'LC003',
        title: 'Legal Due Diligence - Villa Purchase',
        propertyType: 'Villa',
        clientType: 'Individual Buyer',
        priority: 'medium',
        status: 'clarification-needed',
        dueDate: '2025-01-08T00:00:00Z',
        assignedDate: '2024-12-25T09:15:00Z',
        location: 'Juhu, Mumbai',
        fee: 20000
      }
    ]

    const mockNotifications: Notification[] = [
      {
        id: 'N001',
        type: 'case-assigned',
        title: 'New Case Assigned',
        message: 'Property verification case for Bandra apartment has been assigned to you.',
        timestamp: '2024-12-30T10:00:00Z',
        read: false,
        priority: 'high'
      },
      {
        id: 'N002',
        type: 'document-uploaded',
        title: 'Documents Updated',
        message: 'Additional documents have been uploaded for case LC002.',
        timestamp: '2024-12-29T16:45:00Z',
        read: false,
        priority: 'medium'
      },
      {
        id: 'N003',
        type: 'payment-processed',
        title: 'Payment Processed',
        message: 'Payment of ₹18,000 for case LC001 has been processed.',
        timestamp: '2024-12-29T11:20:00Z',
        read: true,
        priority: 'low'
      }
    ]

    setTimeout(() => {
      setStats(mockStats)
      setRecentCases(mockRecentCases)
      setNotifications(mockNotifications)
      setIsLoading(false)
    }, 1000)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'assigned': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
      case 'under-review': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
      case 'clarification-needed': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400'
      case 'approved': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
      case 'rejected': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low': return 'text-green-600 dark:text-green-400'
      case 'medium': return 'text-yellow-600 dark:text-yellow-400'
      case 'high': return 'text-orange-600 dark:text-orange-400'
      case 'urgent': return 'text-red-600 dark:text-red-400'
      default: return 'text-gray-600 dark:text-gray-400'
    }
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'case-assigned': return <Briefcase size={16} />
      case 'document-uploaded': return <FileText size={16} />
      case 'payment-processed': return <DollarSign size={16} />
      case 'system-update': return <Bell size={16} />
      default: return <Bell size={16} />
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 rounded-2xl p-8 text-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-4 right-4 w-32 h-32 bg-white rounded-full"></div>
          <div className="absolute bottom-4 left-4 w-24 h-24 bg-white rounded-full"></div>
        </div>
        
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center space-x-6">
            {/* Crown Icon */}
            <div className="p-4 bg-white/20 backdrop-blur-sm rounded-2xl border border-white/30">
              <Scale className="w-12 h-12 text-white" />
            </div>
            
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                <span className="text-green-200 text-sm font-medium">Legal Partner Active</span>
              </div>
              <h1 className="text-4xl font-bold mb-1">
                Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 18 ? 'Afternoon' : 'Evening'}, Advocate!
              </h1>
              <h2 className="text-4xl font-bold mb-3">
                {user?.name || 'Legal Partner'}
              </h2>
              <p className="text-blue-100 text-lg mb-1">
                Your legal expertise continues to make a difference. We've assigned <span className="text-yellow-300 font-semibold">{stats?.activeCases} new cases</span> and <span className="text-yellow-300 font-semibold">{stats?.pendingReview} priority reviews</span> in your specialized areas.
              </p>
              
              <div className="flex items-center space-x-6 mt-4">
                <Link 
                  href="/legal-partner/cases"
                  className="flex items-center space-x-2 px-6 py-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl border border-white/30 transition-all duration-300"
                >
                  <Briefcase size={20} />
                  <span className="font-medium">Review Cases</span>
                </Link>
                
                <Link 
                  href="/legal-partner/due-diligence"
                  className="flex items-center space-x-2 px-6 py-3 bg-transparent hover:bg-white/10 border-2 border-white/30 hover:border-white/50 rounded-xl transition-all duration-300"
                >
                  <FileCheck size={20} />
                  <span className="font-medium">Due Diligence</span>
                  {stats?.pendingReview && stats.pendingReview > 0 && (
                    <span className="px-2 py-1 bg-red-500 text-white rounded-full text-xs font-bold">
                      {stats.pendingReview}
                    </span>
                  )}
                </Link>
              </div>
            </div>
          </div>

          {/* Stats Panel */}
          <div className="hidden lg:block">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 p-6 min-w-[280px]">
              <div className="flex items-center space-x-2 mb-4">
                <Award className="w-5 h-5 text-yellow-300" />
                <span className="text-white font-semibold">Legal Partner Status</span>
              </div>
              
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-blue-100 text-sm">Success Rate</span>
                    <span className="text-white font-bold">{stats?.completionRate}%</span>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-green-400 to-green-300 h-2 rounded-full transition-all duration-1000"
                      style={{ width: `${stats?.completionRate}%` }}
                    ></div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">{stats?.totalCases}</div>
                    <div className="text-blue-200 text-xs">Total Cases</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">{stats?.averageRating}</div>
                    <div className="text-blue-200 text-xs">Avg Rating</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-lg font-bold text-yellow-300">₹{(stats?.monthlyEarnings || 0) / 1000}k</div>
                    <div className="text-blue-200 text-xs">This Month</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-green-300">{stats?.responseTime}h</div>
                    <div className="text-blue-200 text-xs">Response Time</div>
                  </div>
                </div>
              </div>

              <Link 
                href="/legal-partner/performance"
                className="flex items-center justify-center space-x-2 w-full mt-4 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-xl transition-all duration-300 font-medium"
              >
                <TrendingUp size={16} />
                <span>View Performance</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-950 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Cases</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats?.activeCases}</p>
              <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">
                {stats?.pendingReview} pending review
              </p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-2xl">
              <Briefcase className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-950 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Completed Cases</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats?.completedCases}</p>
              <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                {stats?.completionRate}% success rate
              </p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-2xl">
              <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-950 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Monthly Earnings</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                ₹{stats?.monthlyEarnings?.toLocaleString()}
              </p>
              <p className="text-sm text-purple-600 dark:text-purple-400 mt-1">
                This month
              </p>
            </div>
            <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-2xl">
              <DollarSign className="w-8 h-8 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-950 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Response Time</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats?.responseTime}h</p>
              <p className="text-sm text-orange-600 dark:text-orange-400 mt-1">
                Average response
              </p>
            </div>
            <div className="p-3 bg-orange-100 dark:bg-orange-900/20 rounded-2xl">
              <Clock className="w-8 h-8 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Cases */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-950 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
          <div className="p-6 border-b border-gray-200 dark:border-gray-800">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Recent Cases</h3>
              <Link 
                href="/legal-partner/cases"
                className="flex items-center space-x-1 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
              >
                <span>View All</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
          
          <div className="p-6 space-y-4">
            {recentCases.map(case_ => (
              <div key={case_.id} className="p-4 bg-gray-50 dark:bg-gray-900 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all cursor-pointer">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                      {case_.title}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {case_.propertyType} • {case_.clientType}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(case_.status)}`}>
                      {case_.status.replace('-', ' ').toUpperCase()}
                    </span>
                    <span className={`text-sm font-medium ${getPriorityColor(case_.priority)} capitalize`}>
                      {case_.priority}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center space-x-4">
                    <span>📍 {case_.location}</span>
                    <span>💰 ₹{case_.fee.toLocaleString()}</span>
                  </div>
                  <span>Due: {new Date(case_.dueDate).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Notifications & Quick Actions */}
        <div className="space-y-6">
          {/* Notifications */}
          <div className="bg-white dark:bg-gray-950 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
            <div className="p-6 border-b border-gray-200 dark:border-gray-800">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Notifications</h3>
                <span className="px-2 py-1 bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-full text-xs font-medium">
                  {notifications.filter(n => !n.read).length} new
                </span>
              </div>
            </div>
            
            <div className="p-6 space-y-3 max-h-96 overflow-y-auto">
              {notifications.slice(0, 5).map(notification => (
                <div key={notification.id} className={`p-3 rounded-xl border transition-all ${
                  notification.read 
                    ? 'bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800' 
                    : 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
                }`}>
                  <div className="flex items-start space-x-3">
                    <div className={`p-2 rounded-lg ${
                      notification.read 
                        ? 'bg-gray-200 dark:bg-gray-700' 
                        : 'bg-blue-100 dark:bg-blue-900/40'
                    }`}>
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 dark:text-white text-sm">
                        {notification.title}
                      </h4>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                        {new Date(notification.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white dark:bg-gray-950 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
            <div className="p-6 border-b border-gray-200 dark:border-gray-800">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Quick Actions</h3>
            </div>
            
            <div className="p-6 space-y-3">
              <Link 
                href="/legal-partner/cases"
                className="flex items-center space-x-3 p-3 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/40 rounded-xl transition-all"
              >
                <Briefcase className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <span className="font-medium text-blue-900 dark:text-blue-100">View All Cases</span>
              </Link>
              
              <Link 
                href="/legal-partner/due-diligence"
                className="flex items-center space-x-3 p-3 bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/40 rounded-xl transition-all"
              >
                <FileCheck className="w-5 h-5 text-green-600 dark:text-green-400" />
                <span className="font-medium text-green-900 dark:text-green-100">Due Diligence</span>
              </Link>
              
              <Link 
                href="/legal-partner/documents"
                className="flex items-center space-x-3 p-3 bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/40 rounded-xl transition-all"
              >
                <FileText className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                <span className="font-medium text-purple-900 dark:text-purple-100">Documents</span>
              </Link>
              
              <Link 
                href="/legal-partner/communications"
                className="flex items-center space-x-3 p-3 bg-orange-50 dark:bg-orange-900/20 hover:bg-orange-100 dark:hover:bg-orange-900/40 rounded-xl transition-all"
              >
                <MessageSquare className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                <span className="font-medium text-orange-900 dark:text-orange-100">Messages</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Overview */}
      <div className="bg-white dark:bg-gray-950 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
        <div className="p-6 border-b border-gray-200 dark:border-gray-800">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">Performance Overview</h3>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
              <Scale className="w-8 h-8 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats?.totalCases}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Total Cases</div>
            </div>
            
            <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
              <Award className="w-8 h-8 text-green-600 dark:text-green-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats?.averageRating}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Average Rating</div>
            </div>
            
            <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
              <Target className="w-8 h-8 text-purple-600 dark:text-purple-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats?.completionRate}%</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Success Rate</div>
            </div>
            
            <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-xl">
              <Activity className="w-8 h-8 text-orange-600 dark:text-orange-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats?.responseTime}h</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Avg Response</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}