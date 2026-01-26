'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  Users, 
  IndianRupee, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Eye, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar, 
  Star, 
  Award, 
  Target, 
  Zap, 
  Crown, 
  Gift, 
  Sparkles, 
  ArrowRight, 
  Plus, 
  BarChart3, 
  PieChart, 
  Activity, 
  Briefcase, 
  Globe, 
  MessageSquare, 
  Share2, 
  Download, 
  RefreshCw, 
  Bell, 
  Wallet, 
  Building, 
  Home, 
  User, 
  BookOpen, 
  PlayCircle, 
  ExternalLink,
  TrendingDown,
  ArrowUp,
  ArrowDown
} from 'lucide-react'

interface DashboardStats {
  totalReferrals: number
  activeLeads: number
  convertedLeads: number
  totalEarnings: number
  thisMonthEarnings: number
  lastMonthEarnings: number
  pendingPayments: number
  conversionRate: number
  avgResponseTime: string
  partnerRank: number
  totalPartners: number
}

interface RecentLead {
  id: string
  customerName: string
  type: 'buyer' | 'seller'
  propertyType: string
  location: string
  status: 'submitted' | 'contacted' | 'interested' | 'converted' | 'rejected'
  expectedCommission: number
  submittedAt: string
}

interface QuickAction {
  title: string
  description: string
  icon: any
  href: string
  color: string
}

export default function PartnerDashboard() {
  const [user, setUser] = useState<any>(null)
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [recentLeads, setRecentLeads] = useState<RecentLead[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Get user data
    const userData = localStorage.getItem('user')
    if (userData) {
      setUser(JSON.parse(userData))
    }

    // Mock dashboard data
    const mockStats: DashboardStats = {
      totalReferrals: 45,
      activeLeads: 12,
      convertedLeads: 8,
      totalEarnings: 185000,
      thisMonthEarnings: 45000,
      lastMonthEarnings: 32000,
      pendingPayments: 15000,
      conversionRate: 17.8,
      avgResponseTime: '2.5 hours',
      partnerRank: 23,
      totalPartners: 1250
    }

    const mockRecentLeads: RecentLead[] = [
      {
        id: 'LD001',
        customerName: 'Rajesh Kumar',
        type: 'buyer',
        propertyType: '2 BHK Apartment',
        location: 'Andheri West, Mumbai',
        status: 'interested',
        expectedCommission: 25000,
        submittedAt: '2024-12-29T10:30:00Z'
      },
      {
        id: 'LD002',
        customerName: 'Priya Patel',
        type: 'seller',
        propertyType: '3 BHK Villa',
        location: 'Bandra East, Mumbai',
        status: 'converted',
        expectedCommission: 75000,
        submittedAt: '2024-12-28T14:20:00Z'
      },
      {
        id: 'LD003',
        customerName: 'Suresh Gupta',
        type: 'buyer',
        propertyType: '1 BHK Apartment',
        location: 'Thane West, Mumbai',
        status: 'contacted',
        expectedCommission: 15000,
        submittedAt: '2024-12-27T16:45:00Z'
      }
    ]

    setTimeout(() => {
      setStats(mockStats)
      setRecentLeads(mockRecentLeads)
      setIsLoading(false)
    }, 1000)
  }, [])

  const quickActions: QuickAction[] = [
    {
      title: 'Submit New Referral',
      description: 'Add a new buyer or seller lead',
      icon: Plus,
      href: '/partner/referrals',
      color: 'from-blue-500 to-blue-600'
    },
    {
      title: 'Share Links',
      description: 'Get your referral links to share',
      icon: Share2,
      href: '/partner/share',
      color: 'from-green-500 to-green-600'
    },
    {
      title: 'Track Leads',
      description: 'Monitor your lead progress',
      icon: Eye,
      href: '/partner/leads',
      color: 'from-purple-500 to-purple-600'
    },
    {
      title: 'View Earnings',
      description: 'Check your commission details',
      icon: IndianRupee,
      href: '/partner/earnings',
      color: 'from-yellow-500 to-yellow-600'
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'submitted': return 'bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
      case 'contacted': return 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400'
      case 'interested': return 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400'
      case 'converted': return 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400'
      case 'rejected': return 'bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400'
      default: return 'bg-gray-100 text-gray-600 dark:bg-gray-900/20 dark:text-gray-400'
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Just now'
    if (diffInHours < 24) return `${diffInHours}h ago`
    if (diffInHours < 48) return 'Yesterday'
    return date.toLocaleDateString()
  }

  const calculateGrowth = () => {
    if (!stats) return 0
    if (stats.lastMonthEarnings === 0) return 100
    return ((stats.thisMonthEarnings - stats.lastMonthEarnings) / stats.lastMonthEarnings * 100)
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
      {/* Welcome Section */}
      <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-green-600 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-40 h-40 bg-white rounded-full -translate-x-20 -translate-y-20"></div>
          <div className="absolute bottom-0 right-0 w-60 h-60 bg-white rounded-full translate-x-20 translate-y-20"></div>
        </div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <Crown className="w-8 h-8 text-yellow-300" />
                <h1 className="text-3xl font-bold">Good Evening, Partner!</h1>
              </div>
              <p className="text-xl text-blue-100 mb-1">{user?.name}</p>
              <p className="text-blue-200">Ready to earn more commissions today?</p>
            </div>
            <div className="text-right">
              <div className="bg-white/20 rounded-2xl p-4 backdrop-blur-sm">
                <div className="flex items-center space-x-2 mb-2">
                  <Award className="w-5 h-5 text-yellow-300" />
                  <span className="text-sm font-medium">Partner Rank</span>
                </div>
                <p className="text-2xl font-bold">#{stats?.partnerRank}</p>
                <p className="text-xs text-blue-200">of {stats?.totalPartners} partners</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-sm">
              <div className="flex items-center space-x-3">
                <Users className="w-8 h-8 text-blue-200" />
                <div>
                  <p className="text-2xl font-bold">{stats?.totalReferrals}</p>
                  <p className="text-sm text-blue-200">Total Referrals</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-sm">
              <div className="flex items-center space-x-3">
                <Activity className="w-8 h-8 text-green-200" />
                <div>
                  <p className="text-2xl font-bold">{stats?.activeLeads}</p>
                  <p className="text-sm text-green-200">Active Leads</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-sm">
              <div className="flex items-center space-x-3">
                <Target className="w-8 h-8 text-purple-200" />
                <div>
                  <p className="text-2xl font-bold">{stats?.conversionRate}%</p>
                  <p className="text-sm text-purple-200">Conversion Rate</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-sm">
              <div className="flex items-center space-x-3">
                <IndianRupee className="w-8 h-8 text-yellow-200" />
                <div>
                  <p className="text-2xl font-bold">₹{stats?.totalEarnings?.toLocaleString()}</p>
                  <p className="text-sm text-yellow-200">Total Earnings</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {quickActions.map((action, index) => (
          <Link key={index} href={action.href}>
            <div className="group bg-white dark:bg-gray-950 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 hover:shadow-lg transition-all cursor-pointer">
              <div className={`w-12 h-12 bg-gradient-to-r ${action.color} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <action.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {action.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                {action.description}
              </p>
              <div className="flex items-center text-blue-600 dark:text-blue-400 group-hover:translate-x-1 transition-transform">
                <span className="text-sm font-medium">Get Started</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Earnings Card */}
        <div className="bg-white dark:bg-gray-950 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-2xl">
                <Wallet className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">This Month</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Earnings</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                ₹{stats?.thisMonthEarnings?.toLocaleString()}
              </p>
              <div className="flex items-center space-x-1">
                {calculateGrowth() >= 0 ? (
                  <ArrowUp className="w-4 h-4 text-green-500" />
                ) : (
                  <ArrowDown className="w-4 h-4 text-red-500" />
                )}
                <span className={`text-sm ${calculateGrowth() >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {Math.abs(calculateGrowth()).toFixed(1)}%
                </span>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Pending</span>
              <span className="font-medium text-gray-900 dark:text-white">₹{stats?.pendingPayments?.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Performance Card */}
        <div className="bg-white dark:bg-gray-950 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-2xl">
                <BarChart3 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Performance</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">This month</p>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Conversion Rate</span>
              <span className="font-semibold text-gray-900 dark:text-white">{stats?.conversionRate}%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-1000"
                style={{ width: `${stats?.conversionRate}%` }}
              ></div>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Avg Response</span>
              <span className="font-medium text-gray-900 dark:text-white">{stats?.avgResponseTime}</span>
            </div>
          </div>
        </div>

        {/* Quick Stats Card */}
        <div className="bg-white dark:bg-gray-950 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-2xl">
              <TrendingUp className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Quick Stats</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Overview</p>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Active Leads</span>
              <span className="font-semibold text-gray-900 dark:text-white">{stats?.activeLeads}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Converted</span>
              <span className="font-semibold text-green-600 dark:text-green-400">{stats?.convertedLeads}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Total Referrals</span>
              <span className="font-semibold text-gray-900 dark:text-white">{stats?.totalReferrals}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Leads */}
        <div className="bg-white dark:bg-gray-950 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Recent Leads</h3>
            <Link href="/partner/leads" className="text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium">
              View All
            </Link>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentLeads.map((lead) => (
                <div key={lead.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-xl">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h4 className="font-semibold text-gray-900 dark:text-white">{lead.customerName}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        lead.type === 'buyer' 
                          ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
                          : 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400'
                      }`}>
                        {lead.type}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{lead.propertyType}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{lead.location}</p>
                  </div>
                  <div className="text-right">
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mb-2 ${getStatusColor(lead.status)}`}>
                      {lead.status}
                    </span>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      ₹{lead.expectedCommission.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{formatDate(lead.submittedAt)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Training & Resources */}
        <div className="bg-white dark:bg-gray-950 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Training & Resources</h3>
            <Link href="/partner/training" className="text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium">
              View All
            </Link>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                <div className="p-3 bg-blue-600 rounded-xl">
                  <PlayCircle className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 dark:text-white">Customer Communication</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Continue your training</p>
                  <div className="w-full bg-blue-200 dark:bg-blue-800 rounded-full h-2 mt-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '60%' }}></div>
                  </div>
                </div>
                <span className="text-sm font-medium text-blue-600 dark:text-blue-400">60%</span>
              </div>

              <div className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-xl">
                <div className="p-3 bg-green-600 rounded-xl">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 dark:text-white">Partner Handbook</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Complete guide for partners</p>
                </div>
                <ExternalLink className="w-5 h-5 text-gray-400" />
              </div>

              <div className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-xl">
                <div className="p-3 bg-purple-600 rounded-xl">
                  <MessageSquare className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 dark:text-white">Partner Community</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Connect with other partners</p>
                </div>
                <ExternalLink className="w-5 h-5 text-gray-400" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tips & Announcements */}
      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-2xl border border-yellow-200 dark:border-yellow-800 p-6">
        <div className="flex items-start space-x-4">
          <div className="p-3 bg-yellow-500 rounded-2xl">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
              💡 Partner Tip of the Day
            </h3>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Follow up with your leads within 2 hours of submission to increase conversion rates by 40%. 
              Quick response time shows professionalism and builds trust with potential customers.
            </p>
            <div className="flex items-center space-x-4">
              <Link href="/partner/training" className="text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium">
                Learn More Tips
              </Link>
              <Link href="/partner/share" className="text-green-600 dark:text-green-400 hover:underline text-sm font-medium">
                Get Share Links
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}