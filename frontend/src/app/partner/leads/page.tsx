'use client'

import { useState, useEffect } from 'react'
import {
  TrendingUp,
  Search,
  Filter,
  Eye,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Clock,
  IndianRupee,
  User,
  Building,
  CheckCircle,
  XCircle,
  AlertCircle,
  RefreshCw,
  Download,
  MessageSquare,
  ExternalLink,
  Star,
  Target,
  Users,
  Award,
  Zap,
  ArrowRight,
  ChevronDown,
  ChevronRight,
  Activity,
  BarChart3,
  PieChart,
  TrendingDown,
  Plus,
  Edit,
  Trash2,
  MoreVertical,
  Send,
  FileText,
  Home,
  Heart,
  ThumbsUp,
  Share2,
  Bell,
  Gift,
  Sparkles,
  Crown,
  Shield,
  Briefcase,
  Globe,
  X
} from 'lucide-react'
import toast from 'react-hot-toast'

interface Lead {
  id: string
  customerName: string
  phone: string
  email?: string
  type: 'buyer' | 'seller'
  propertyType: string
  location: string
  budget?: string
  status: 'submitted' | 'contacted' | 'verified' | 'interested' | 'converted' | 'closed' | 'rejected'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  submittedAt: string
  lastUpdated: string
  commission: number
  expectedCommission: number
  notes?: string
  source: string
  timeline: TimelineEvent[]
  assignedTo?: string
  tags: string[]
}
interface TimelineEvent {
  id: string
  type: 'status_change' | 'note_added' | 'call_made' | 'email_sent' | 'meeting_scheduled' | 'document_shared'
  title: string
  description: string
  timestamp: string
  user: string
  metadata?: any
}

interface LeadStats {
  totalLeads: number
  activeLeads: number
  convertedLeads: number
  totalCommission: number
  conversionRate: number
  avgResponseTime: string
  thisMonthLeads: number
  lastMonthLeads: number
}

interface FilterOptions {
  status: string[]
  type: string[]
  priority: string[]
  dateRange: string
  location: string[]
}

export default function LeadTrackingPage() {
  const [user, setUser] = useState<any>(null)
  const [leads, setLeads] = useState<Lead[]>([])
  const [stats, setStats] = useState<LeadStats | null>(null)
  const [filteredLeads, setFilteredLeads] = useState<Lead[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedFilters, setSelectedFilters] = useState<FilterOptions>({
    status: [],
    type: [],
    priority: [],
    dateRange: 'all',
    location: []
  })
  const [isLoading, setIsLoading] = useState(true)
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
  const [showFilters, setShowFilters] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sortBy, setSortBy] = useState('lastUpdated')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  useEffect(() => {
    // Get user data
    const userData = localStorage.getItem('user')
    if (userData) {
      setUser(JSON.parse(userData))
    }

    // Mock data
    const mockLeads: Lead[] = [
      {
        id: 'LD001',
        customerName: 'Rajesh Kumar',
        phone: '+91 98765 43210',
        email: 'rajesh.kumar@email.com',
        type: 'buyer',
        propertyType: '2 BHK Apartment',
        location: 'Andheri West, Mumbai',
        budget: '₹80L - ₹1.2Cr',
        status: 'interested',
        priority: 'high',
        submittedAt: '2024-12-25T10:30:00Z',
        lastUpdated: '2024-12-29T14:20:00Z',
        commission: 0,
        expectedCommission: 25000,
        notes: 'Looking for ready-to-move property near metro station',
        source: 'WhatsApp Share',
        assignedTo: 'Priya Sharma',
        tags: ['metro-nearby', 'ready-to-move', 'urgent'],
        timeline: [
          {
            id: 'T001',
            type: 'status_change',
            title: 'Lead Submitted',
            description: 'New lead submitted via WhatsApp referral',
            timestamp: '2024-12-25T10:30:00Z',
            user: 'System'
          },
          {
            id: 'T002',
            type: 'call_made',
            title: 'Initial Contact',
            description: 'Called customer, confirmed interest in 2BHK apartments',
            timestamp: '2024-12-25T15:45:00Z',
            user: 'Priya Sharma'
          },
          {
            id: 'T003',
            type: 'status_change',
            title: 'Status Updated',
            description: 'Lead status changed to Interested',
            timestamp: '2024-12-29T14:20:00Z',
            user: 'Priya Sharma'
          }
        ]
      },
      {
        id: 'LD002',
        customerName: 'Priya Patel',
        phone: '+91 87654 32109',
        email: 'priya.patel@email.com',
        type: 'seller',
        propertyType: '3 BHK Villa',
        location: 'Bandra East, Mumbai',
        budget: '₹2.5Cr - ₹3Cr',
        status: 'converted',
        priority: 'medium',
        submittedAt: '2024-12-20T09:15:00Z',
        lastUpdated: '2024-12-28T11:30:00Z',
        commission: 75000,
        expectedCommission: 75000,
        notes: 'Property sold successfully, commission received',
        source: 'Facebook Share',
        assignedTo: 'Amit Singh',
        tags: ['villa', 'premium', 'converted'],
        timeline: [
          {
            id: 'T004',
            type: 'status_change',
            title: 'Lead Submitted',
            description: 'New seller lead from Facebook campaign',
            timestamp: '2024-12-20T09:15:00Z',
            user: 'System'
          },
          {
            id: 'T005',
            type: 'call_made',
            title: 'Property Evaluation',
            description: 'Conducted property visit and valuation',
            timestamp: '2024-12-21T14:00:00Z',
            user: 'Amit Singh'
          },
          {
            id: 'T006',
            type: 'status_change',
            title: 'Deal Closed',
            description: 'Property sold, commission processed',
            timestamp: '2024-12-28T11:30:00Z',
            user: 'Amit Singh'
          }
        ]
      },
      {
        id: 'LD003',
        customerName: 'Suresh Gupta',
        phone: '+91 76543 21098',
        type: 'buyer',
        propertyType: '1 BHK Apartment',
        location: 'Thane West, Mumbai',
        budget: '₹45L - ₹60L',
        status: 'contacted',
        priority: 'medium',
        submittedAt: '2024-12-28T16:45:00Z',
        lastUpdated: '2024-12-29T10:15:00Z',
        commission: 0,
        expectedCommission: 15000,
        notes: 'First-time buyer, needs guidance on home loan',
        source: 'Instagram Share',
        assignedTo: 'Neha Verma',
        tags: ['first-time-buyer', 'home-loan'],
        timeline: [
          {
            id: 'T007',
            type: 'status_change',
            title: 'Lead Submitted',
            description: 'New buyer lead from Instagram story',
            timestamp: '2024-12-28T16:45:00Z',
            user: 'System'
          },
          {
            id: 'T008',
            type: 'call_made',
            title: 'Initial Discussion',
            description: 'Discussed requirements and budget',
            timestamp: '2024-12-29T10:15:00Z',
            user: 'Neha Verma'
          }
        ]
      },
      {
        id: 'LD004',
        customerName: 'Meera Shah',
        phone: '+91 65432 10987',
        email: 'meera.shah@email.com',
        type: 'buyer',
        propertyType: '2 BHK Apartment',
        location: 'Powai, Mumbai',
        budget: '₹1Cr - ₹1.5Cr',
        status: 'verified',
        priority: 'high',
        submittedAt: '2024-12-27T12:20:00Z',
        lastUpdated: '2024-12-29T09:45:00Z',
        commission: 0,
        expectedCommission: 30000,
        notes: 'IT professional, looking for property near tech parks',
        source: 'LinkedIn Share',
        assignedTo: 'Rohit Kumar',
        tags: ['it-professional', 'tech-park', 'verified'],
        timeline: [
          {
            id: 'T009',
            type: 'status_change',
            title: 'Lead Submitted',
            description: 'Professional lead from LinkedIn network',
            timestamp: '2024-12-27T12:20:00Z',
            user: 'System'
          },
          {
            id: 'T010',
            type: 'document_shared',
            title: 'Documents Verified',
            description: 'Income and identity documents verified',
            timestamp: '2024-12-29T09:45:00Z',
            user: 'Rohit Kumar'
          }
        ]
      },
      {
        id: 'LD005',
        customerName: 'Vikram Joshi',
        phone: '+91 54321 09876',
        type: 'seller',
        propertyType: '2 BHK Apartment',
        location: 'Goregaon West, Mumbai',
        budget: '₹95L - ₹1.1Cr',
        status: 'rejected',
        priority: 'low',
        submittedAt: '2024-12-24T14:30:00Z',
        lastUpdated: '2024-12-26T16:20:00Z',
        commission: 0,
        expectedCommission: 0,
        notes: 'Customer decided not to sell at current market rates',
        source: 'WhatsApp Share',
        assignedTo: 'Kavya Reddy',
        tags: ['rejected', 'market-rates'],
        timeline: [
          {
            id: 'T011',
            type: 'status_change',
            title: 'Lead Submitted',
            description: 'Seller inquiry via WhatsApp',
            timestamp: '2024-12-24T14:30:00Z',
            user: 'System'
          },
          {
            id: 'T012',
            type: 'status_change',
            title: 'Lead Rejected',
            description: 'Customer not interested in current market valuation',
            timestamp: '2024-12-26T16:20:00Z',
            user: 'Kavya Reddy'
          }
        ]
      }
    ]

    const mockStats: LeadStats = {
      totalLeads: 45,
      activeLeads: 28,
      convertedLeads: 8,
      totalCommission: 185000,
      conversionRate: 17.8,
      avgResponseTime: '2.5 hours',
      thisMonthLeads: 15,
      lastMonthLeads: 12
    }

    setTimeout(() => {
      setLeads(mockLeads)
      setFilteredLeads(mockLeads)
      setStats(mockStats)
      setIsLoading(false)
    }, 1000)
  }, [])

  // Filter and search logic
  useEffect(() => {
    let filtered = leads.filter(lead => {
      // Search filter
      const searchMatch = !searchQuery ||
        lead.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.phone.includes(searchQuery) ||
        lead.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.propertyType.toLowerCase().includes(searchQuery.toLowerCase())

      // Status filter
      const statusMatch = selectedFilters.status.length === 0 ||
        selectedFilters.status.includes(lead.status)

      // Type filter
      const typeMatch = selectedFilters.type.length === 0 ||
        selectedFilters.type.includes(lead.type)

      // Priority filter
      const priorityMatch = selectedFilters.priority.length === 0 ||
        selectedFilters.priority.includes(lead.priority)

      return searchMatch && statusMatch && typeMatch && priorityMatch
    })

    // Sort leads
    filtered.sort((a, b) => {
      let aValue, bValue

      switch (sortBy) {
        case 'customerName':
          aValue = a.customerName.toLowerCase()
          bValue = b.customerName.toLowerCase()
          break
        case 'submittedAt':
          aValue = new Date(a.submittedAt).getTime()
          bValue = new Date(b.submittedAt).getTime()
          break
        case 'lastUpdated':
          aValue = new Date(a.lastUpdated).getTime()
          bValue = new Date(b.lastUpdated).getTime()
          break
        case 'commission':
          aValue = a.expectedCommission
          bValue = b.expectedCommission
          break
        default:
          aValue = new Date(a.lastUpdated).getTime()
          bValue = new Date(b.lastUpdated).getTime()
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

    setFilteredLeads(filtered)
  }, [leads, searchQuery, selectedFilters, sortBy, sortOrder])
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'submitted': return 'bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
      case 'contacted': return 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400'
      case 'verified': return 'bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400'
      case 'interested': return 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400'
      case 'converted': return 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400'
      case 'closed': return 'bg-gray-100 text-gray-600 dark:bg-gray-900/20 dark:text-gray-400'
      case 'rejected': return 'bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400'
      default: return 'bg-gray-100 text-gray-600 dark:bg-gray-900/20 dark:text-gray-400'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'submitted': return <Clock className="w-4 h-4" />
      case 'contacted': return <Phone className="w-4 h-4" />
      case 'verified': return <Shield className="w-4 h-4" />
      case 'interested': return <Heart className="w-4 h-4" />
      case 'converted': return <CheckCircle className="w-4 h-4" />
      case 'closed': return <XCircle className="w-4 h-4" />
      case 'rejected': return <XCircle className="w-4 h-4" />
      default: return <AlertCircle className="w-4 h-4" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-500'
      case 'high': return 'bg-orange-500'
      case 'medium': return 'bg-yellow-500'
      case 'low': return 'bg-green-500'
      default: return 'bg-gray-500'
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

  const handleFilterChange = (filterType: keyof FilterOptions, value: string) => {
    setSelectedFilters(prev => {
      const currentValues = prev[filterType] as string[]
      const newValues = currentValues.includes(value)
        ? currentValues.filter(v => v !== value)
        : [...currentValues, value]

      return {
        ...prev,
        [filterType]: newValues
      }
    })
  }

  const clearFilters = () => {
    setSelectedFilters({
      status: [],
      type: [],
      priority: [],
      dateRange: 'all',
      location: []
    })
    setSearchQuery('')
  }

  const exportLeads = () => {
    // In a real app, this would generate and download a CSV/Excel file
    toast.success('Lead data exported successfully!')
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading leads...</p>
        </div>
      </div>
    )
  }
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Lead Tracking
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-xl max-w-3xl mx-auto">
          Monitor your referrals, track progress, and manage customer relationships
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-950 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Leads</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats?.totalLeads}</p>
              <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">
                +{stats?.thisMonthLeads} this month
              </p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-2xl">
              <Users className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-950 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Leads</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats?.activeLeads}</p>
              <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                {stats?.avgResponseTime} avg response
              </p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-2xl">
              <Activity className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-950 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Conversions</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats?.convertedLeads}</p>
              <p className="text-sm text-purple-600 dark:text-purple-400 mt-1">
                {stats?.conversionRate}% rate
              </p>
            </div>
            <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-2xl">
              <Target className="w-8 h-8 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-950 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Earnings</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">₹{stats?.totalCommission?.toLocaleString()}</p>
              <p className="text-sm text-yellow-600 dark:text-yellow-400 mt-1">From conversions</p>
            </div>
            <div className="p-3 bg-yellow-100 dark:bg-yellow-900/20 rounded-2xl">
              <IndianRupee className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search leads by name, phone, location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>

        {/* View Toggle */}
        <div className="flex bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
          <button
            onClick={() => setViewMode('grid')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${viewMode === 'grid'
                ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-gray-600 dark:text-gray-400'
              }`}
          >
            Grid
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${viewMode === 'list'
                ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-gray-600 dark:text-gray-400'
              }`}
          >
            List
          </button>
        </div>

        {/* Filter Toggle */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center space-x-2 px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:border-blue-300 dark:hover:border-blue-600 transition-all"
        >
          <Filter size={20} />
          <span>Filters</span>
          {(selectedFilters.status.length > 0 || selectedFilters.type.length > 0 || selectedFilters.priority.length > 0) && (
            <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
          )}
        </button>

        {/* Export */}
        <button
          onClick={exportLeads}
          className="flex items-center space-x-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all"
        >
          <Download size={20} />
          <span>Export</span>
        </button>
      </div>
      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-white dark:bg-gray-950 rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Filters</h3>
            <button
              onClick={clearFilters}
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
            >
              Clear All
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Status
              </label>
              <div className="space-y-2">
                {['submitted', 'contacted', 'verified', 'interested', 'converted', 'closed', 'rejected'].map((status) => (
                  <label key={status} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={selectedFilters.status.includes(status)}
                      onChange={() => handleFilterChange('status', status)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300 capitalize">
                      {status}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Type Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Type
              </label>
              <div className="space-y-2">
                {['buyer', 'seller'].map((type) => (
                  <label key={type} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={selectedFilters.type.includes(type)}
                      onChange={() => handleFilterChange('type', type)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300 capitalize">
                      {type}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Priority Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Priority
              </label>
              <div className="space-y-2">
                {['urgent', 'high', 'medium', 'low'].map((priority) => (
                  <label key={priority} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={selectedFilters.priority.includes(priority)}
                      onChange={() => handleFilterChange('priority', priority)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300 capitalize">
                      {priority}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Sort Options */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="lastUpdated">Last Updated</option>
                <option value="submittedAt">Date Submitted</option>
                <option value="customerName">Customer Name</option>
                <option value="commission">Expected Commission</option>
              </select>
              <div className="flex mt-2 space-x-2">
                <button
                  onClick={() => setSortOrder('desc')}
                  className={`flex-1 px-3 py-1 text-xs rounded ${sortOrder === 'desc'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                    }`}
                >
                  Desc
                </button>
                <button
                  onClick={() => setSortOrder('asc')}
                  className={`flex-1 px-3 py-1 text-xs rounded ${sortOrder === 'asc'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                    }`}
                >
                  Asc
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <p className="text-gray-600 dark:text-gray-400">
          Showing {filteredLeads.length} of {leads.length} leads
        </p>
        <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
          <RefreshCw className="w-4 h-4" />
          <span>Last updated: {formatDate(new Date().toISOString())}</span>
        </div>
      </div>

      {/* Leads Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredLeads.map((lead) => (
            <div
              key={lead.id}
              className="bg-white dark:bg-gray-950 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-all cursor-pointer"
              onClick={() => setSelectedLead(lead)}
            >
              {/* Lead Header */}
              <div className="p-6 border-b border-gray-200 dark:border-gray-800">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                        {lead.customerName}
                      </h3>
                      <div className={`w-3 h-3 rounded-full ${getPriorityColor(lead.priority)}`}></div>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 mb-2">
                      <Phone className="w-4 h-4" />
                      <span>{lead.phone}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                      <MapPin className="w-4 h-4" />
                      <span>{lead.location}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(lead.status)}`}>
                      {getStatusIcon(lead.status)}
                      <span className="capitalize">{lead.status}</span>
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Type:</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${lead.type === 'buyer'
                        ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
                        : 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400'
                      }`}>
                      {lead.type === 'buyer' ? 'Buyer' : 'Seller'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Property:</span>
                    <span className="font-medium text-gray-900 dark:text-white">{lead.propertyType}</span>
                  </div>
                  {lead.budget && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Budget:</span>
                      <span className="font-medium text-gray-900 dark:text-white">{lead.budget}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Lead Stats */}
              <div className="p-6">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center">
                    <p className="text-lg font-bold text-gray-900 dark:text-white">
                      ₹{lead.expectedCommission.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Expected</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-green-600 dark:text-green-400">
                      ₹{lead.commission.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Earned</p>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-4">
                  <span>Submitted: {formatDate(lead.submittedAt)}</span>
                  <span>Updated: {formatDate(lead.lastUpdated)}</span>
                </div>

                {lead.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-4">
                    {lead.tags.slice(0, 3).map((tag, index) => (
                      <span key={index} className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-lg text-xs">
                        {tag}
                      </span>
                    ))}
                    {lead.tags.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-lg text-xs">
                        +{lead.tags.length - 3}
                      </span>
                    )}
                  </div>
                )}

                <div className="flex items-center space-x-2 text-sm">
                  <User className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600 dark:text-gray-400">
                    Assigned to: <span className="font-medium">{lead.assignedTo || 'Unassigned'}</span>
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* List View */
        <div className="bg-white dark:bg-gray-950 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Type & Property
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Commission
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Last Updated
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                {filteredLeads.map((lead) => (
                  <tr
                    key={lead.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-900/50 cursor-pointer"
                    onClick={() => setSelectedLead(lead)}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${getPriorityColor(lead.priority)}`}></div>
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {lead.customerName}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {lead.phone}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 dark:text-white">{lead.propertyType}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400 capitalize">{lead.type}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(lead.status)}`}>
                        {getStatusIcon(lead.status)}
                        <span className="capitalize">{lead.status}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        ₹{lead.expectedCommission.toLocaleString()}
                      </div>
                      {lead.commission > 0 && (
                        <div className="text-sm text-green-600 dark:text-green-400">
                          ₹{lead.commission.toLocaleString()} earned
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                      {formatDate(lead.lastUpdated)}
                    </td>
                    <td className="px-6 py-4">
                      <button className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {/* Lead Detail Modal */}
      {selectedLead && (
        <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-950 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
              <div className="flex items-center space-x-4">
                <div className={`w-4 h-4 rounded-full ${getPriorityColor(selectedLead.priority)}`}></div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {selectedLead.customerName}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">Lead ID: {selectedLead.id}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedLead(null)}
                className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex h-[calc(90vh-120px)]">
              {/* Left Panel - Lead Details */}
              <div className="flex-1 p-6 overflow-y-auto">
                {/* Status and Priority */}
                <div className="flex items-center space-x-4 mb-6">
                  <span className={`inline-flex items-center space-x-2 px-3 py-2 rounded-xl text-sm font-medium ${getStatusColor(selectedLead.status)}`}>
                    {getStatusIcon(selectedLead.status)}
                    <span className="capitalize">{selectedLead.status}</span>
                  </span>
                  <span className={`px-3 py-2 rounded-xl text-sm font-medium ${selectedLead.type === 'buyer'
                      ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
                      : 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400'
                    }`}>
                    {selectedLead.type === 'buyer' ? 'Buyer' : 'Seller'}
                  </span>
                  <span className={`px-3 py-2 rounded-xl text-sm font-medium capitalize ${selectedLead.priority === 'urgent' ? 'bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400' :
                      selectedLead.priority === 'high' ? 'bg-orange-100 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400' :
                        selectedLead.priority === 'medium' ? 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400' :
                          'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400'
                    }`}>
                    {selectedLead.priority} Priority
                  </span>
                </div>

                {/* Contact Information */}
                <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-6 mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Contact Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-3">
                      <Phone className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Phone</p>
                        <p className="font-medium text-gray-900 dark:text-white">{selectedLead.phone}</p>
                      </div>
                    </div>
                    {selectedLead.email && (
                      <div className="flex items-center space-x-3">
                        <Mail className="w-5 h-5 text-green-600 dark:text-green-400" />
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Email</p>
                          <p className="font-medium text-gray-900 dark:text-white">{selectedLead.email}</p>
                        </div>
                      </div>
                    )}
                    <div className="flex items-center space-x-3">
                      <MapPin className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Location</p>
                        <p className="font-medium text-gray-900 dark:text-white">{selectedLead.location}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <User className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Assigned To</p>
                        <p className="font-medium text-gray-900 dark:text-white">{selectedLead.assignedTo || 'Unassigned'}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Property Details */}
                <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-6 mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Property Requirements</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-3">
                      <Building className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Property Type</p>
                        <p className="font-medium text-gray-900 dark:text-white">{selectedLead.propertyType}</p>
                      </div>
                    </div>
                    {selectedLead.budget && (
                      <div className="flex items-center space-x-3">
                        <IndianRupee className="w-5 h-5 text-green-600 dark:text-green-400" />
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Budget Range</p>
                          <p className="font-medium text-gray-900 dark:text-white">{selectedLead.budget}</p>
                        </div>
                      </div>
                    )}
                    <div className="flex items-center space-x-3">
                      <Share2 className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Source</p>
                        <p className="font-medium text-gray-900 dark:text-white">{selectedLead.source}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Calendar className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Submitted</p>
                        <p className="font-medium text-gray-900 dark:text-white">{formatDate(selectedLead.submittedAt)}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Commission Details */}
                <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-2xl p-6 mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Commission Details</h3>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="text-center">
                      <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                        ₹{selectedLead.expectedCommission.toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Expected Commission</p>
                    </div>
                    <div className="text-center">
                      <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                        ₹{selectedLead.commission.toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Earned Commission</p>
                    </div>
                  </div>
                </div>

                {/* Notes */}
                {selectedLead.notes && (
                  <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-6 mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Notes</h3>
                    <p className="text-gray-700 dark:text-gray-300">{selectedLead.notes}</p>
                  </div>
                )}

                {/* Tags */}
                {selectedLead.tags.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedLead.tags.map((tag, index) => (
                        <span key={index} className="px-3 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-xl text-sm">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Right Panel - Timeline */}
              <div className="w-96 border-l border-gray-200 dark:border-gray-800 p-6 overflow-y-auto">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Activity Timeline</h3>
                <div className="space-y-4">
                  {selectedLead.timeline.map((event, index) => (
                    <div key={event.id} className="relative">
                      {index !== selectedLead.timeline.length - 1 && (
                        <div className="absolute left-4 top-8 w-0.5 h-full bg-gray-200 dark:bg-gray-700"></div>
                      )}
                      <div className="flex items-start space-x-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${event.type === 'status_change' ? 'bg-blue-100 dark:bg-blue-900/20' :
                            event.type === 'call_made' ? 'bg-green-100 dark:bg-green-900/20' :
                              event.type === 'email_sent' ? 'bg-purple-100 dark:bg-purple-900/20' :
                                event.type === 'note_added' ? 'bg-yellow-100 dark:bg-yellow-900/20' :
                                  event.type === 'document_shared' ? 'bg-orange-100 dark:bg-orange-900/20' :
                                    'bg-gray-100 dark:bg-gray-900/20'
                          }`}>
                          {event.type === 'status_change' && <Activity className="w-4 h-4 text-blue-600 dark:text-blue-400" />}
                          {event.type === 'call_made' && <Phone className="w-4 h-4 text-green-600 dark:text-green-400" />}
                          {event.type === 'email_sent' && <Mail className="w-4 h-4 text-purple-600 dark:text-purple-400" />}
                          {event.type === 'note_added' && <FileText className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />}
                          {event.type === 'document_shared' && <Share2 className="w-4 h-4 text-orange-600 dark:text-orange-400" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {event.title}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {event.description}
                          </p>
                          <div className="flex items-center space-x-2 mt-2 text-xs text-gray-500 dark:text-gray-400">
                            <Clock className="w-3 h-3" />
                            <span>{formatDate(event.timestamp)}</span>
                            <span>•</span>
                            <span>{event.user}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Quick Actions */}
                <div className="mt-8 space-y-3">
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white">Quick Actions</h4>
                  <button className="w-full flex items-center space-x-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all">
                    <Phone className="w-4 h-4" />
                    <span>Call Customer</span>
                  </button>
                  <button className="w-full flex items-center space-x-2 px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl transition-all">
                    <MessageSquare className="w-4 h-4" />
                    <span>Send WhatsApp</span>
                  </button>
                  <button className="w-full flex items-center space-x-2 px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl transition-all">
                    <Mail className="w-4 h-4" />
                    <span>Send Email</span>
                  </button>
                  <button className="w-full flex items-center space-x-2 px-4 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-xl transition-all">
                    <FileText className="w-4 h-4" />
                    <span>Add Note</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {filteredLeads.length === 0 && (
        <div className="text-center py-12">
          <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            No leads found
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {searchQuery || selectedFilters.status.length > 0 || selectedFilters.type.length > 0 || selectedFilters.priority.length > 0
              ? 'Try adjusting your search or filters'
              : 'Start by submitting your first referral to see leads here'
            }
          </p>
          {!(searchQuery || selectedFilters.status.length > 0 || selectedFilters.type.length > 0 || selectedFilters.priority.length > 0) && (
            <button
              onClick={() => window.location.href = '/partner/referrals'}
              className="inline-flex items-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all"
            >
              <Plus className="w-5 h-5" />
              <span>Submit First Referral</span>
            </button>
          )}
        </div>
      )}
    </div>
  )
}