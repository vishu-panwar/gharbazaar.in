'use client'

import { useState } from 'react'
import {
  Phone,
  Search,
  Plus,
  Eye,
  Edit,
  CheckCircle,
  XCircle,
  Clock,
  User,
  Mail,
  MapPin,
  Calendar,
  TrendingUp,
  DollarSign,
  MessageSquare,
  Star,
  Filter,
  Download,
  Send,
  PhoneCall,
  Video,
  FileText,
  Sparkles,
  Target,
  Zap,
  Users,
} from 'lucide-react'
import toast from 'react-hot-toast'

export default function LeadManagementPage() {
  const [filter, setFilter] = useState('new')
  const [selectedLead, setSelectedLead] = useState<any>(null)
  const [showModal, setShowModal] = useState(false)
  const [note, setNote] = useState('')

  const leads = [
    {
      id: 1,
      leadId: 'LEAD001',
      name: 'Rajesh Kumar',
      email: 'rajesh@example.com',
      phone: '+91 98765 43210',
      location: 'Mumbai, Maharashtra',
      interest: 'Buying 3 BHK Apartment',
      budget: '50-70 Lakhs',
      status: 'new',
      priority: 'high',
      source: 'Website',
      assignedDate: '2024-01-20',
      lastContact: null,
      score: 85,
      notes: 2,
    },
    {
      id: 2,
      leadId: 'LEAD002',
      name: 'Priya Sharma',
      email: 'priya@example.com',
      phone: '+91 98765 43211',
      location: 'Bangalore, Karnataka',
      interest: 'Selling Villa',
      budget: '1-1.5 Cr',
      status: 'contacted',
      priority: 'medium',
      source: 'Referral',
      assignedDate: '2024-01-19',
      lastContact: '2024-01-20',
      score: 72,
      notes: 5,
    },
    {
      id: 3,
      leadId: 'LEAD003',
      name: 'Amit Patel',
      email: 'amit@example.com',
      phone: '+91 98765 43212',
      location: 'Pune, Maharashtra',
      interest: 'Renting Office Space',
      budget: '50k-1L per month',
      status: 'qualified',
      priority: 'high',
      source: 'Google Ads',
      assignedDate: '2024-01-18',
      lastContact: '2024-01-20',
      score: 90,
      notes: 8,
    },
    {
      id: 4,
      leadId: 'LEAD004',
      name: 'Sneha Reddy',
      email: 'sneha@example.com',
      phone: '+91 98765 43213',
      location: 'Hyderabad, Telangana',
      interest: 'Buying Plot',
      budget: '30-40 Lakhs',
      status: 'converted',
      priority: 'low',
      source: 'Social Media',
      assignedDate: '2024-01-15',
      lastContact: '2024-01-19',
      convertedDate: '2024-01-19',
      score: 95,
      notes: 12,
    },
  ]

  const stats = {
    totalLeads: 156,
    newLeads: 23,
    qualified: 45,
    converted: 34,
    conversionRate: 21.8,
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
      case 'contacted':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
      case 'qualified':
        return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
      case 'converted':
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
      case 'lost':
        return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
    }
  }

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

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-orange-600'
    return 'text-red-600'
  }

  const handleViewLead = (lead: any) => {
    setSelectedLead(lead)
    setShowModal(true)
  }

  const handleAddNote = () => {
    if (!note.trim()) return
    toast.success('Note added')
    setNote('')
  }

  const handleConvertLead = () => {
    toast.success('Lead marked as converted')
    setShowModal(false)
  }

  const filteredLeads = leads.filter((lead) =>
    filter === 'all' ? true : lead.status === filter
  )

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-3xl p-8 text-white">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full animate-pulse"></div>
          <div className="absolute top-1/2 -left-8 w-32 h-32 bg-white/5 rounded-full animate-bounce"></div>
          <div className="absolute bottom-4 right-1/3 w-16 h-16 bg-white/10 rounded-full animate-pulse delay-1000"></div>
          <div className="absolute top-8 left-1/4 w-20 h-20 bg-white/5 rounded-full animate-bounce delay-500"></div>
        </div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl">
                  <Users size={32} className="text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold">Lead Management</h1>
                  <p className="text-indigo-100 text-lg">Track and convert potential customers into sales</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                  <Target className="text-indigo-200" size={20} />
                  <span className="text-indigo-100">Smart Tracking</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Zap className="text-indigo-200" size={20} />
                  <span className="text-indigo-100">Quick Actions</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Sparkles className="text-indigo-200" size={20} />
                  <span className="text-indigo-100">AI Scoring</span>
                </div>
              </div>
            </div>
            
            <button
              onClick={() => toast.success('Creating new lead...')}
              className="flex items-center space-x-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-8 py-4 rounded-2xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl border border-white/20"
            >
              <Plus size={24} />
              <span className="text-lg">New Lead</span>
            </button>
          </div>
        </div>
      </div>

      {/* Enhanced Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        <div className="group bg-white dark:bg-gray-950 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl group-hover:scale-110 transition-transform duration-300">
              <Phone size={24} className="text-white" />
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.totalLeads}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Leads</p>
            </div>
          </div>
          <div className="h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-purple-500 to-purple-600 rounded-full w-full"></div>
          </div>
        </div>

        <div className="group bg-white dark:bg-gray-950 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl group-hover:scale-110 transition-transform duration-300">
              <Star size={24} className="text-white" />
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.newLeads}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">New Leads</p>
            </div>
          </div>
          <div className="h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full w-3/4"></div>
          </div>
        </div>

        <div className="group bg-white dark:bg-gray-950 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl group-hover:scale-110 transition-transform duration-300">
              <CheckCircle size={24} className="text-white" />
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.qualified}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Qualified</p>
            </div>
          </div>
          <div className="h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-orange-500 to-orange-600 rounded-full w-2/3"></div>
          </div>
        </div>

        <div className="group bg-white dark:bg-gray-950 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl group-hover:scale-110 transition-transform duration-300">
              <DollarSign size={24} className="text-white" />
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.converted}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Converted</p>
            </div>
          </div>
          <div className="h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-green-500 to-green-600 rounded-full w-1/2"></div>
          </div>
        </div>

        <div className="group bg-white dark:bg-gray-950 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-gradient-to-br from-pink-500 to-pink-600 rounded-2xl group-hover:scale-110 transition-transform duration-300">
              <TrendingUp size={24} className="text-white" />
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.conversionRate}%</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Conversion Rate</p>
            </div>
          </div>
          <div className="h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-pink-500 to-pink-600 rounded-full w-1/4"></div>
          </div>
        </div>
      </div>

      {/* Advanced Search & Filter Section */}
      <div className="bg-white dark:bg-gray-950 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm backdrop-blur-sm">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="flex-1 max-w-2xl">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search leads by name, email, phone, or location..."
                className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 text-lg"
              />
            </div>
          </div>

          <div className="flex items-center space-x-3 overflow-x-auto">
            {['all', 'new', 'contacted', 'qualified', 'converted'].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-6 py-3 rounded-2xl text-sm font-semibold transition-all duration-300 capitalize whitespace-nowrap ${
                  filter === status
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-500/25'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Premium Lead Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredLeads.map((lead) => (
          <div
            key={lead.id}
            className="group bg-white dark:bg-gray-950 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 backdrop-blur-sm"
          >
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                  {lead.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white text-lg">{lead.name}</h3>
                  <p className="text-sm text-gray-500 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full inline-block">{lead.leadId}</p>
                </div>
              </div>
              <div className="flex flex-col items-end space-y-2">
                <span
                  className={`px-4 py-2 rounded-2xl text-sm font-bold capitalize shadow-sm ${getStatusColor(
                    lead.status
                  )}`}
                >
                  {lead.status}
                </span>
                <span
                  className={`px-4 py-2 rounded-2xl text-sm font-bold capitalize shadow-sm ${getPriorityColor(
                    lead.priority
                  )}`}
                >
                  {lead.priority}
                </span>
              </div>
            </div>

            <div className="space-y-3 mb-6 pb-6 border-b border-gray-200 dark:border-gray-800">
              <div className="flex items-center space-x-3 text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-900 p-3 rounded-xl">
                <Mail size={16} className="text-indigo-500" />
                <span className="truncate font-medium">{lead.email}</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-900 p-3 rounded-xl">
                <Phone size={16} className="text-green-500" />
                <span className="font-medium">{lead.phone}</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-900 p-3 rounded-xl">
                <MapPin size={16} className="text-red-500" />
                <span className="font-medium">{lead.location}</span>
              </div>
            </div>

            <div className="mb-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 rounded-xl p-4">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 font-medium">Interest & Budget</p>
              <p className="font-semibold text-gray-900 dark:text-white text-lg mb-1">{lead.interest}</p>
              <p className="text-sm text-indigo-600 dark:text-indigo-400 font-bold bg-indigo-100 dark:bg-indigo-900/30 px-3 py-1 rounded-full inline-block">
                {lead.budget}
              </p>
            </div>

            <div className="flex items-center justify-between mb-6">
              <div className="flex-1 mr-4">
                <p className="text-xs text-gray-500 mb-2 font-medium">AI Lead Score</p>
                <div className="flex items-center space-x-3">
                  <div className="flex-1 bg-gray-200 dark:bg-gray-800 rounded-full h-3 overflow-hidden">
                    <div
                      className={`h-3 rounded-full transition-all duration-500 ${
                        lead.score >= 80
                          ? 'bg-gradient-to-r from-green-500 to-green-600'
                          : lead.score >= 60
                            ? 'bg-gradient-to-r from-orange-500 to-orange-600'
                            : 'bg-gradient-to-r from-red-500 to-red-600'
                      }`}
                      style={{ width: `${lead.score}%` }}
                    />
                  </div>
                  <span className={`text-sm font-bold ${getScoreColor(lead.score)}`}>
                    {lead.score}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500 mb-1 font-medium">Notes</p>
                <div className="flex items-center space-x-1">
                  <MessageSquare size={16} className="text-gray-400" />
                  <p className="text-sm font-bold text-gray-900 dark:text-white">{lead.notes}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleViewLead(lead)}
                className="flex-1 flex items-center justify-center space-x-2 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white py-3 rounded-2xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <Eye size={18} />
                <span>View Details</span>
              </button>
              <button
                onClick={() => toast.success('Calling...')}
                className="flex items-center justify-center bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white p-3 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl"
                title="Call Lead"
              >
                <PhoneCall size={18} />
              </button>
              <button
                onClick={() => toast.success('Opening email...')}
                className="flex items-center justify-center bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white p-3 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl"
                title="Email Lead"
              >
                <Mail size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Premium Lead Detail Modal */}
      {showModal && selectedLead && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-gray-950 rounded-3xl max-w-5xl w-full my-8 border border-gray-200 dark:border-gray-800 shadow-2xl overflow-hidden">
            {/* Enhanced Header */}
            <div className="sticky top-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-8 z-10 rounded-t-3xl">
              <div className="flex items-center justify-between text-white">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl">
                    <Users size={32} className="text-white" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold">{selectedLead.name}</h2>
                    <p className="text-indigo-100 text-lg">{selectedLead.leadId}</p>
                    <div className="flex items-center space-x-4 mt-2">
                      <span className="flex items-center space-x-1 text-indigo-200">
                        <Phone size={16} />
                        <span>{selectedLead.phone}</span>
                      </span>
                      <span className="flex items-center space-x-1 text-indigo-200">
                        <Mail size={16} />
                        <span>{selectedLead.email}</span>
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-3 hover:bg-white/20 backdrop-blur-sm rounded-2xl transition-all duration-300"
                >
                  <XCircle size={28} />
                </button>
              </div>
            </div>

            <div className="p-8 space-y-8 max-h-[calc(100vh-200px)] overflow-y-auto">
              {/* Lead Overview Cards */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
                  <h3 className="font-bold text-xl mb-4 flex items-center space-x-2">
                    <Target size={24} className="text-indigo-600" />
                    <span>Lead Information</span>
                  </h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white dark:bg-gray-950 rounded-xl p-4 border border-gray-200 dark:border-gray-800">
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 font-medium">Interest</p>
                        <p className="font-semibold text-gray-900 dark:text-white text-lg">{selectedLead.interest}</p>
                      </div>
                      <div className="bg-white dark:bg-gray-950 rounded-xl p-4 border border-gray-200 dark:border-gray-800">
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 font-medium">Budget</p>
                        <p className="font-semibold text-indigo-600 dark:text-indigo-400 text-lg">{selectedLead.budget}</p>
                      </div>
                      <div className="bg-white dark:bg-gray-950 rounded-xl p-4 border border-gray-200 dark:border-gray-800">
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 font-medium">Source</p>
                        <p className="font-semibold text-gray-900 dark:text-white text-lg">{selectedLead.source}</p>
                      </div>
                      <div className="bg-white dark:bg-gray-950 rounded-xl p-4 border border-gray-200 dark:border-gray-800">
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 font-medium">Location</p>
                        <p className="font-semibold text-gray-900 dark:text-white text-lg">{selectedLead.location}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white dark:bg-gray-950 rounded-xl p-4 border border-gray-200 dark:border-gray-800">
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 font-medium">Status</p>
                        <span
                          className={`px-4 py-2 rounded-2xl text-sm font-bold capitalize ${getStatusColor(
                            selectedLead.status
                          )}`}
                        >
                          {selectedLead.status}
                        </span>
                      </div>
                      <div className="bg-white dark:bg-gray-950 rounded-xl p-4 border border-gray-200 dark:border-gray-800">
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 font-medium">Priority</p>
                        <span
                          className={`px-4 py-2 rounded-2xl text-sm font-bold capitalize ${getPriorityColor(
                            selectedLead.priority
                          )}`}
                        >
                          {selectedLead.priority}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="bg-gradient-to-br from-indigo-50 to-purple-100 dark:from-indigo-900/20 dark:to-purple-800/20 rounded-2xl p-6 border border-indigo-200 dark:border-indigo-800">
                    <div className="flex items-center space-x-3 text-indigo-600 dark:text-indigo-400 mb-4">
                      <div className="p-2 bg-indigo-600 rounded-xl">
                        <Sparkles size={20} className="text-white" />
                      </div>
                      <p className="text-lg font-bold">AI Lead Score</p>
                    </div>
                    <div className="text-center">
                      <p className="text-4xl font-bold text-indigo-700 dark:text-indigo-300 mb-2">
                        {selectedLead.score}
                      </p>
                      <div className="w-full bg-indigo-200 dark:bg-indigo-900/30 rounded-full h-4 mb-2">
                        <div
                          className="h-4 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500"
                          style={{ width: `${selectedLead.score}%` }}
                        />
                      </div>
                      <p className="text-sm text-indigo-600 dark:text-indigo-400 font-medium">
                        {selectedLead.score >= 80 ? 'High Quality' : selectedLead.score >= 60 ? 'Medium Quality' : 'Needs Attention'}
                      </p>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-2xl p-6 border border-green-200 dark:border-green-800">
                    <div className="flex items-center space-x-3 text-green-600 dark:text-green-400 mb-4">
                      <div className="p-2 bg-green-600 rounded-xl">
                        <Calendar size={20} className="text-white" />
                      </div>
                      <p className="text-lg font-bold">Timeline</p>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Assigned Date</p>
                        <p className="font-bold text-gray-900 dark:text-white text-lg">
                          {selectedLead.assignedDate}
                        </p>
                      </div>
                      {selectedLead.lastContact && (
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Last Contact</p>
                          <p className="font-bold text-green-700 dark:text-green-300 text-lg">
                            {selectedLead.lastContact}
                          </p>
                        </div>
                      )}
                      {selectedLead.convertedDate && (
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Converted Date</p>
                          <p className="font-bold text-green-700 dark:text-green-300 text-lg">
                            {selectedLead.convertedDate}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions Section */}
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="font-bold text-xl mb-6 flex items-center space-x-2">
                  <Zap size={24} className="text-indigo-600" />
                  <span>Quick Actions</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button
                    onClick={() => toast.success('Calling...')}
                    className="flex items-center justify-center space-x-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-4 rounded-2xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    <PhoneCall size={20} />
                    <span>Call Lead</span>
                  </button>
                  <button
                    onClick={() => toast.success('Opening email...')}
                    className="flex items-center justify-center space-x-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 py-4 rounded-2xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    <Mail size={20} />
                    <span>Send Email</span>
                  </button>
                  <button
                    onClick={() => toast.success('Starting video call...')}
                    className="flex items-center justify-center space-x-3 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white px-6 py-4 rounded-2xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    <Video size={20} />
                    <span>Video Call</span>
                  </button>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800">
                <h3 className="font-bold text-lg mb-4 flex items-center space-x-2">
                  <FileText size={20} />
                  <span>Notes & Activity ({selectedLead.notes})</span>
                </h3>
                <div className="space-y-4 mb-4">
                  <div className="bg-white dark:bg-gray-950 rounded-lg p-4 border border-gray-200 dark:border-gray-800">
                    <div className="flex items-start space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        Y
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <p className="font-semibold text-gray-900 dark:text-white">You</p>
                          <span className="text-xs text-gray-500">2 hours ago</span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Had a call with the lead. They are interested in viewing properties next
                          week.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-gray-950 rounded-lg p-4 border border-gray-200 dark:border-gray-800">
                    <div className="flex items-start space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-700 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        Y
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <p className="font-semibold text-gray-900 dark:text-white">You</p>
                          <span className="text-xs text-gray-500">1 day ago</span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Sent property brochures via email. Awaiting response.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200 dark:border-gray-800 pt-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      Y
                    </div>
                    <div className="flex-1">
                      <textarea
                        rows={3}
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        placeholder="Add a note or activity..."
                        className="w-full px-4 py-3 bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-blue-500 resize-none"
                      />
                      <div className="flex items-center justify-end mt-2">
                        <button
                          onClick={handleAddNote}
                          className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-all"
                        >
                          <Send size={16} />
                          <span>Add Note</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3 pt-6 border-t border-gray-200 dark:border-gray-800">
                {selectedLead.status !== 'converted' && (
                  <>
                    <button
                      onClick={handleConvertLead}
                      className="flex-1 flex items-center justify-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-semibold transition-all"
                    >
                      <CheckCircle size={20} />
                      <span>Mark as Converted</span>
                    </button>
                    <button
                      onClick={() => toast.success('Status updated')}
                      className="flex-1 flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-all"
                    >
                      <Edit size={20} />
                      <span>Update Status</span>
                    </button>
                  </>
                )}
                <button
                  onClick={() => toast.success('Lead marked as lost')}
                  className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold transition-all"
                >
                  Mark as Lost
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
