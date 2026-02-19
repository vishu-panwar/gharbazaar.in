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
  MessageSquare,
  Building2,
  Palette,
  Hammer,
  Camera,
  PenTool,
  Home,
  Lightbulb,
  Wrench,
  Sparkles,
  Star,
  MapPin,
  Phone,
  Mail,
  ExternalLink,
  Plus
} from 'lucide-react'
import Link from 'next/link'
import { backendApi } from '@/lib/backendApi'
import { getOrCreateSocket } from '@/lib/socket'
import toast from 'react-hot-toast'
import { motion, AnimatePresence } from 'framer-motion'

interface DashboardStats {
  totalTasks: number
  activeTasks: number
  completedTasks: number
  pendingReview: number
  monthlyEarnings: number
  averageRating: number
  completionRate: number
  responseTime: number
}

interface RecentCase {
  id: string
  title: string
  type: string
  status: string
  amount: number
  description?: string
  dueDate?: string
  createdAt: string
  buyerId?: string
  sellerId?: string
  propertyId?: string
  metadata?: any
  buyer?: {
    name: string
    email: string
    phone: string
  }
}

interface ServiceProvider {
  id: string
  name: string
  category: 'lawyer' | 'architect' | 'designer' | 'contractor' | 'photographer' | 'consultant'
  specialization: string
  rating: number
  reviews: number
  completedProjects: number
  hourlyRate: number
  location: string
  verified: boolean
  available: boolean
  image: string
  user?: {
    name: string
    email: string
  }
}

export default function ServicePartnersDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [recentTasks, setRecentTasks] = useState<RecentCase[]>([])
  const [serviceProviders, setServiceProviders] = useState<ServiceProvider[]>([])
  const [providerProfile, setProviderProfile] = useState<any>(null)
  const [kycInfo, setKycInfo] = useState<{ status: string | null; hasRequest: boolean }>({
    status: null,
    hasRequest: false,
  })
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedTask, setSelectedTask] = useState<RecentCase | null>(null)
  const [showTaskModal, setShowTaskModal] = useState(false)

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true)
        // Get user data from local storage
        const storedUser = localStorage.getItem('user')
        const user = storedUser ? JSON.parse(storedUser) : null
        setUser(user)

        // Fetch real provider profile
        const profileResponse = await backendApi.serviceProvider.getMyProfile()
        if (profileResponse?.success) {
          setProviderProfile(profileResponse.data)
        }

        // Fetch KYC status for partner portal visibility
        const kycResponse = await backendApi.kyc.getStatus()
        if (kycResponse?.success) {
          setKycInfo({
            status: kycResponse.data?.status || null,
            hasRequest: Boolean(kycResponse.data?.request),
          })
        }

        // Fetch real tasks
        const casesResponse = await backendApi.partners.getCases()
        if (casesResponse?.success) {
          setRecentTasks(casesResponse.data)
          
          // Update stats based on real data
          const tasks = casesResponse.data
          setStats({
            totalTasks: tasks.length,
            activeTasks: tasks.filter((t: any) => t.status !== 'completed' && t.status !== 'cancelled').length,
            completedTasks: tasks.filter((t: any) => t.status === 'completed').length,
            pendingReview: tasks.filter((t: any) => t.status === 'open').length,
            monthlyEarnings: tasks.reduce((acc: number, t: any) => acc + (t.amount || 0), 0),
            averageRating: profileResponse.data?.rating || 0,
            completionRate: tasks.length > 0 ? Math.round((tasks.filter((t: any) => t.status === 'completed').length / tasks.length) * 100) : 0,
            responseTime: 2 // Mock response time
          })
        }

        // Fetch real service providers for the "Professional Services" section
        const providersResponse = await backendApi.serviceProvider.list({ limit: 6 } as any)
        if (providersResponse?.success) {
          setServiceProviders(providersResponse.providers || [])
        }

        // Setup Socket
        if (user) {
          const socket = getOrCreateSocket()
          socket.emit('subscribe_notifications') // Joins room notifications:UID
          
          socket.on('new_notification', (notification) => {
            console.log('🔔 New Notification:', notification)
            toast.success(notification.message, {
              duration: 5000,
              icon: '🚀'
            })
            
            // If it's a new booking, refresh tasks
            if (notification.type === 'new_booking') {
              fetchData()
            }
          })

          return () => {
            socket.off('new_notification')
          }
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  const serviceCategories = [
    { id: 'all', name: 'All Services', icon: Sparkles, color: 'from-purple-500 to-pink-600' },
    { id: 'lawyer', name: 'Legal Services', icon: Scale, color: 'from-blue-500 to-indigo-600' },
    { id: 'architect', name: 'Architecture', icon: Building2, color: 'from-green-500 to-emerald-600' },
    { id: 'designer', name: 'Interior Design', icon: Palette, color: 'from-orange-500 to-red-600' },
    { id: 'contractor', name: 'Construction', icon: Hammer, color: 'from-yellow-500 to-orange-600' },
    { id: 'photographer', name: 'Photography', icon: Camera, color: 'from-pink-500 to-rose-600' },
    { id: 'consultant', name: 'Consultation', icon: Lightbulb, color: 'from-cyan-500 to-blue-600' }
  ]

  const filteredProviders = selectedCategory === 'all' 
    ? serviceProviders 
    : serviceProviders.filter(p => p.category === selectedCategory)

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

  const handleCaseClick = (task: RecentCase) => {
    setSelectedTask(task)
    setShowTaskModal(true)
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
    <div className="space-y-4">
      {/* Ultra-Compact Welcome Header */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 rounded-lg p-4 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-2 right-2 w-24 h-24 bg-white rounded-full"></div>
          <div className="absolute bottom-2 left-2 w-16 h-16 bg-white rounded-full"></div>
        </div>
        
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 backdrop-blur-sm rounded-lg border border-white/30">
              <Scale className="w-8 h-8 text-white" />
            </div>
            
            <div>
              <div className="flex items-center gap-1.5 mb-1">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-green-200 text-xs font-medium">
                  {providerProfile?.specialization || providerProfile?.category || 'Service Partner'} Active
                </span>
              </div>
              <h1 className="text-2xl font-bold mb-0.5">
                Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 18 ? 'Afternoon' : 'Evening'}, {providerProfile?.user?.name || user?.name || 'Partner'}!
              </h1>
              <p className="text-blue-100 text-sm">
                <span className="text-yellow-300 font-semibold">{stats?.activeTasks} active tasks</span> • <span className="text-yellow-300 font-semibold">{stats?.pendingReview} priority reviews</span>
              </p>
              {kycInfo.status === 'approved' && (
                <p className="mt-1 text-xs font-semibold text-emerald-300">KYC approved</p>
              )}
              {kycInfo.hasRequest && (kycInfo.status === 'pending' || kycInfo.status === 'submitted') && (
                <Link href="/service-partners/kyc" className="mt-1 inline-block text-xs font-semibold text-amber-200 hover:text-amber-100 underline underline-offset-2">
                  KYC pending employee approval
                </Link>
              )}
              {kycInfo.status === 'rejected' && (
                <Link href="/service-partners/kyc" className="mt-1 inline-block text-xs font-semibold text-red-200 hover:text-red-100 underline underline-offset-2">
                  KYC rejected. Resubmit documents
                </Link>
              )}
            </div>
          </div>

          <div className="hidden lg:block">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 p-4 min-w-[240px]">
              <div className="flex items-center gap-1.5 mb-3">
                <Award className="w-4 h-4 text-yellow-300" />
                <span className="text-white font-semibold text-sm">Partner Status</span>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="text-center">
                  <div className="text-xl font-bold text-white">{stats?.totalTasks}</div>
                  <div className="text-blue-200 text-xs">Total Tasks</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-white">{stats?.averageRating}</div>
                  <div className="text-blue-200 text-xs">Avg Rating</div>
                </div>
                <div className="text-center">
                  <div className="text-base font-bold text-yellow-300">₹{(stats?.monthlyEarnings || 0) / 1000}k</div>
                  <div className="text-blue-200 text-xs">This Month</div>
                </div>
                <div className="text-center">
                  <div className="text-base font-bold text-green-300">{stats?.responseTime}h</div>
                  <div className="text-blue-200 text-xs">Response</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Ultra-Compact Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
        {[
          { label: 'Active Tasks', value: stats?.activeTasks, sub: `${stats?.pendingReview} pending`, icon: Briefcase, gradient: 'from-blue-500 to-indigo-600' },
          { label: 'Completed', value: stats?.completedTasks, sub: `${stats?.completionRate}% success`, icon: CheckCircle, gradient: 'from-green-500 to-emerald-600' },
          { label: 'Earnings', value: `₹${(stats?.monthlyEarnings || 0) / 1000}k`, sub: 'This month', icon: DollarSign, gradient: 'from-purple-500 to-pink-600' },
          { label: 'Response', value: `${stats?.responseTime}h`, sub: 'Average time', icon: Clock, gradient: 'from-orange-500 to-red-600' }
        ].map((stat, i) => (
          <div key={i} className="group relative bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all">
            <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-5 transition-opacity rounded-lg`}></div>
            
            <div className="relative flex items-center justify-between mb-1">
              <div className={`w-8 h-8 bg-gradient-to-br ${stat.gradient} rounded-lg flex items-center justify-center shadow-md`}>
                <stat.icon className="text-white" size={14} />
              </div>
            </div>

            <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-0.5">{stat.label}</p>
            <p className="text-xl font-black text-gray-900 dark:text-white mb-0.5">{stat.value}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{stat.sub}</p>
          </div>
        ))}
      </div>

      {/* Services Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Professional Services</h3>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">Connect with verified service providers</p>
            </div>
            <Link 
              href="/service-partners/services"
              className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 hover:text-blue-700 text-xs font-semibold"
            >
              <span>View All</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>

        {/* Category Filters */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {serviceCategories.map(category => {
              const Icon = category.icon
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                    selectedCategory === category.id
                      ? 'bg-gradient-to-r ' + category.color + ' text-white shadow-md'
                      : 'bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800'
                  }`}
                >
                  <Icon size={14} />
                  <span>{category.name}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Service Providers Grid */}
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredProviders.length > 0 ? (
              filteredProviders.slice(0, 6).map(provider => (
                <div key={provider.id} className="group bg-gray-50 dark:bg-gray-900 rounded-lg p-3 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all hover:-translate-y-0.5">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="relative">
                      <img 
                        src={provider.image || 'https://via.placeholder.com/150'} 
                        alt={provider.name}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      {provider.verified && (
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-600 rounded-full flex items-center justify-center">
                          <CheckCircle size={10} className="text-white" />
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-sm text-gray-900 dark:text-white truncate">{provider.name || provider.user?.name}</h4>
                      <p className="text-xs text-gray-600 dark:text-gray-400 truncate">{provider.specialization}</p>
                      
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex items-center gap-0.5">
                          <Star size={10} className="fill-yellow-500 text-yellow-500" />
                          <span className="text-xs font-bold text-gray-900 dark:text-white">{provider.rating || 0}</span>
                          <span className="text-xs text-gray-500">({provider.reviews || 0})</span>
                        </div>
                        {provider.available ? (
                          <span className="px-1.5 py-0.5 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded text-xs font-semibold">
                            Available
                          </span>
                        ) : (
                          <span className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-900/20 text-gray-700 dark:text-gray-400 rounded text-xs font-semibold">
                            Busy
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
                    <div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">Rate</div>
                      <div className="text-sm font-bold text-gray-900 dark:text-white">₹{provider.hourlyRate || 0}/hr</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">Projects</div>
                      <div className="text-sm font-bold text-gray-900 dark:text-white">{provider.completedProjects || 0}</div>
                    </div>
                    <button className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition-all">
                      Contact
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full py-10 text-center bg-gray-50 dark:bg-gray-900 rounded-xl border border-dashed border-gray-300 dark:border-gray-700">
                <Users size={40} className="mx-auto text-gray-400 mb-3 opacity-20" />
                <p className="text-gray-500 dark:text-gray-400 text-sm">No service providers available in this category.</p>
              </div>
            )}
          </div>

          {filteredProviders.length > 6 && (
            <div className="mt-3 text-center">
              <Link
                href="/service-partners/services"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-gray-100 dark:bg-gray-900 hover:bg-gray-200 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg text-xs font-semibold transition-all"
              >
                <span>View All {filteredProviders.length} Providers</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Recent Tasks */}
        <div className="bg-white dark:bg-gray-950 rounded-3xl shadow-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
          <div className="p-6 border-b border-gray-200 dark:border-gray-800">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-gray-900 dark:text-white">Recent Tasks</h3>
              <Link 
                href="/service-partners/cases"
                className="flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:text-blue-700 text-xs font-semibold"
              >
                <span>View All</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
          
          <div className="p-4 space-y-3">
            {recentTasks.length > 0 ? (
              recentTasks.map(case_ => (
                <div 
                  key={case_.id} 
                  onClick={() => handleCaseClick(case_)}
                  className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all cursor-pointer border border-gray-200 dark:border-gray-700"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm text-gray-900 dark:text-white mb-1">
                        {case_.title}
                      </h4>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        Requested by {case_.buyer?.name || 'Client'}
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${getStatusColor(case_.status)}`}>
                        {case_.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <DollarSign size={10} />
                        ₹{case_.amount?.toLocaleString() || 'N/A'}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={10} />
                        {new Date(case_.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-10">
                <p className="text-gray-500 text-sm">No tasks assigned yet.</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-base font-bold text-gray-900 dark:text-white">Quick Actions</h3>
          </div>
          
          <div className="p-4 space-y-2">
            {[
              { href: '/service-partners/cases', icon: Briefcase, label: 'View All Tasks', color: 'blue' },
              { href: '/service-partners/communications', icon: MessageSquare, label: 'Messages', color: 'orange' },
              { href: '/service-partners/earnings', icon: DollarSign, label: 'Earnings', color: 'emerald' },
              { href: '/service-partners/performance', icon: TrendingUp, label: 'Performance', color: 'pink' }
            ].map((action, i) => {
              const Icon = action.icon
              return (
                <Link 
                  key={i}
                  href={action.href}
                  className={`flex items-center gap-2 p-2 bg-${action.color}-50 dark:bg-${action.color}-900/20 hover:bg-${action.color}-100 dark:hover:bg-${action.color}-900/40 rounded-lg transition-all`}
                >
                  <Icon className={`w-4 h-4 text-${action.color}-600 dark:text-${action.color}-400`} />
                  <span className={`font-medium text-${action.color}-900 dark:text-${action.color}-100 text-xs`}>{action.label}</span>
                </Link>
              )
            })}
          </div>
        </div>
      </div>
      {/* Task Detail Modal */}
      <AnimatePresence>
        {showTaskModal && selectedTask && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white dark:bg-gray-900 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-200 dark:border-gray-800"
            >
              <div className="sticky top-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md p-6 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between z-10">
                <div>
                  <h2 className="text-2xl font-black text-gray-900 dark:text-white">Task Details</h2>
                  <p className="text-sm text-gray-500 font-medium">#{selectedTask.id.slice(0, 8)}</p>
                </div>
                <button
                  onClick={() => setShowTaskModal(false)}
                  className="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-500 hover:text-gray-900 dark:hover:text-white transition-all shadow-sm"
                >
                  ✕
                </button>
              </div>

              <div className="p-6 space-y-8">
                {/* Header Info */}
                <div className="flex flex-wrap gap-4 items-center justify-between">
                  <div className="space-y-1">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">{selectedTask.title}</h3>
                    <div className="flex items-center gap-3">
                      <span className={`px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider ${getStatusColor(selectedTask.status)}`}>
                        {selectedTask.status.replace('_', ' ')}
                      </span>
                      <span className="text-sm text-gray-500 font-medium flex items-center gap-1">
                        <Calendar size={14} />
                        {new Date(selectedTask.createdAt).toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-500 font-medium">Estimated Fee</div>
                    <div className="text-2xl font-black text-blue-600 dark:text-blue-400">₹{selectedTask.amount?.toLocaleString() || 'N/A'}</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Client Info */}
                  <div className="p-5 bg-blue-50/50 dark:bg-blue-900/10 rounded-2xl border border-blue-100 dark:border-blue-800/30">
                    <div className="flex items-center gap-2 mb-4">
                      <Users className="w-5 h-5 text-blue-600" />
                      <h4 className="font-bold text-gray-900 dark:text-white">Client Information</h4>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <div className="text-xs text-gray-500 font-bold uppercase tracking-widest mb-1">Name</div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">{selectedTask.buyer?.name || 'N/A'}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 font-bold uppercase tracking-widest mb-1">Email</div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white truncate">{selectedTask.buyer?.email || 'N/A'}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 font-bold uppercase tracking-widest mb-1">Phone</div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">{selectedTask.buyer?.phone || 'N/A'}</div>
                      </div>
                    </div>
                  </div>

                  {/* Booking Details */}
                  <div className="p-5 bg-purple-50/50 dark:bg-purple-900/10 rounded-2xl border border-purple-100 dark:border-purple-800/30">
                    <div className="flex items-center gap-2 mb-4">
                      <FileText className="w-5 h-5 text-purple-600" />
                      <h4 className="font-bold text-gray-900 dark:text-white">Request Details</h4>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <div className="text-xs text-gray-500 font-bold uppercase tracking-widest mb-1">Service Type</div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">{selectedTask.metadata?.name || 'Standard'}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 font-bold uppercase tracking-widest mb-1">Property Type</div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">{selectedTask.metadata?.address || 'N/A'}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Buyer Message */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-indigo-600" />
                    <h4 className="font-bold text-gray-900 dark:text-white">Client Message</h4>
                  </div>
                  <div className="p-5 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-200 dark:border-gray-700 italic text-gray-700 dark:text-gray-300">
                    "{selectedTask.description || 'No message provided by client.'}"
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-4 pt-4">
                  <button 
                    onClick={() => {
                      setShowTaskModal(false);
                      const buyerId = selectedTask.buyerId || (selectedTask as any).buyer?.id;
                      if (!buyerId) {
                        toast.error('Buyer information not available');
                        return;
                      }
                      window.location.href = `/dashboard/messages?chatWith=${buyerId}&name=${encodeURIComponent(selectedTask.buyer?.name || 'Buyer')}`;
                    }}
                    className="flex-1 min-w-[200px] h-14 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-2xl font-black text-lg transition-all shadow-xl shadow-blue-500/20 active:scale-95 flex items-center justify-center gap-2"
                  >
                    <MessageSquare size={24} />
                    Message Client
                  </button>
                  <button className="flex-1 min-w-[200px] h-14 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-2xl font-black text-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all active:scale-95">
                    Update Status
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
