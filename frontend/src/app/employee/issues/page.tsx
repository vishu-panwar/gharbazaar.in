'use client'

import { useState } from 'react'
import {
  AlertCircle,
  Search,
  Plus,
  Eye,
  Edit,
  CheckCircle,
  XCircle,
  Clock,
  User,
  Calendar,
  Tag,
  MessageSquare,
  Paperclip,
  Send,
  Filter,
  Download,
  TrendingUp,
  AlertTriangle,
  FileText,
  Sparkles,
  Shield,
  Zap,
} from 'lucide-react'
import toast from 'react-hot-toast'

export default function IssuesPage() {
  const [filter, setFilter] = useState('open')
  const [selectedIssue, setSelectedIssue] = useState<any>(null)
  const [showModal, setShowModal] = useState(false)
  const [comment, setComment] = useState('')

  const issues = [
    {
      id: 1,
      ticketId: 'TKT001',
      title: 'Payment not reflecting in account',
      description: 'Made payment 2 days ago but subscription not activated',
      user: 'Rajesh Kumar',
      userId: 'USR001',
      category: 'payment',
      priority: 'high',
      status: 'open',
      createdDate: '2024-01-20',
      assignedTo: 'You',
      comments: 3,
      attachments: 2,
    },
    {
      id: 2,
      ticketId: 'TKT002',
      title: 'Unable to upload property images',
      description: 'Getting error when trying to upload photos',
      user: 'Priya Sharma',
      userId: 'USR002',
      category: 'technical',
      priority: 'medium',
      status: 'in-progress',
      createdDate: '2024-01-19',
      assignedTo: 'You',
      comments: 5,
      attachments: 1,
    },
    {
      id: 3,
      ticketId: 'TKT003',
      title: 'KYC verification taking too long',
      description: 'Submitted documents 5 days ago, still pending',
      user: 'Amit Patel',
      userId: 'USR003',
      category: 'kyc',
      priority: 'low',
      status: 'resolved',
      createdDate: '2024-01-15',
      resolvedDate: '2024-01-18',
      assignedTo: 'You',
      comments: 8,
      attachments: 0,
    },
    {
      id: 4,
      ticketId: 'TKT004',
      title: 'Listing not appearing in search',
      description: 'Published listing but not visible to buyers',
      user: 'Sneha Reddy',
      userId: 'USR004',
      category: 'listing',
      priority: 'high',
      status: 'open',
      createdDate: '2024-01-20',
      assignedTo: 'You',
      comments: 1,
      attachments: 3,
    },
  ]

  const stats = {
    totalIssues: 156,
    open: 23,
    inProgress: 12,
    resolved: 121,
    avgResolutionTime: '4.2 hours',
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
      case 'in-progress':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
      case 'resolved':
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
      case 'closed':
        return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
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

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'payment':
        return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
      case 'technical':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
      case 'kyc':
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
      case 'listing':
        return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
    }
  }

  const handleViewIssue = (issue: any) => {
    setSelectedIssue(issue)
    setShowModal(true)
  }

  const handleAddComment = () => {
    if (!comment.trim()) return
    toast.success('Comment added')
    setComment('')
  }

  const handleResolveIssue = () => {
    toast.success('Issue marked as resolved')
    setShowModal(false)
  }

  const filteredIssues = issues.filter((issue) =>
    filter === 'all' ? true : issue.status === filter
  )

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-orange-600 via-red-600 to-pink-600 rounded-3xl p-8 text-white">
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
                  <AlertTriangle size={32} className="text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold">Issues & Reports</h1>
                  <p className="text-orange-100 text-lg">Track and resolve customer issues efficiently</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                  <Shield className="text-orange-200" size={20} />
                  <span className="text-orange-100">24/7 Support</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Zap className="text-orange-200" size={20} />
                  <span className="text-orange-100">Quick Resolution</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Sparkles className="text-orange-200" size={20} />
                  <span className="text-orange-100">Smart Tracking</span>
                </div>
              </div>
            </div>
            
            <button
              onClick={() => toast.success('Creating new ticket...')}
              className="flex items-center space-x-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-8 py-4 rounded-2xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl border border-white/20"
            >
              <Plus size={24} />
              <span className="text-lg">New Ticket</span>
            </button>
          </div>
        </div>
      </div>

      {/* Enhanced Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        <div className="group bg-white dark:bg-gray-950 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl group-hover:scale-110 transition-transform duration-300">
              <AlertCircle size={24} className="text-white" />
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.totalIssues}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Issues</p>
            </div>
          </div>
          <div className="h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-purple-500 to-purple-600 rounded-full w-full"></div>
          </div>
        </div>

        <div className="group bg-white dark:bg-gray-950 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl group-hover:scale-110 transition-transform duration-300">
              <AlertTriangle size={24} className="text-white" />
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.open}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Open</p>
            </div>
          </div>
          <div className="h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-red-500 to-red-600 rounded-full w-3/4"></div>
          </div>
        </div>

        <div className="group bg-white dark:bg-gray-950 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl group-hover:scale-110 transition-transform duration-300">
              <Clock size={24} className="text-white" />
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.inProgress}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">In Progress</p>
            </div>
          </div>
          <div className="h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full w-1/2"></div>
          </div>
        </div>

        <div className="group bg-white dark:bg-gray-950 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl group-hover:scale-110 transition-transform duration-300">
              <CheckCircle size={24} className="text-white" />
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.resolved}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Resolved</p>
            </div>
          </div>
          <div className="h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-green-500 to-green-600 rounded-full w-full"></div>
          </div>
        </div>

        <div className="group bg-white dark:bg-gray-950 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl group-hover:scale-110 transition-transform duration-300">
              <TrendingUp size={24} className="text-white" />
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.avgResolutionTime}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Avg Resolution</p>
            </div>
          </div>
          <div className="h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-orange-500 to-orange-600 rounded-full w-4/5"></div>
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
                placeholder="Search issues by ticket ID, user, or description..."
                className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300 text-lg"
              />
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {['all', 'open', 'in-progress', 'resolved'].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-6 py-3 rounded-2xl text-sm font-semibold transition-all duration-300 capitalize ${
                  filter === status
                    ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg shadow-orange-500/25'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {status.replace('-', ' ')}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Premium Issues Table */}
      <div className="bg-white dark:bg-gray-950 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm backdrop-blur-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 border-b border-gray-200 dark:border-gray-700">
              <tr>
                <th className="px-8 py-5 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Ticket Details
                </th>
                <th className="px-8 py-5 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  User Information
                </th>
                <th className="px-8 py-5 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-8 py-5 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Priority
                </th>
                <th className="px-8 py-5 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-8 py-5 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Created Date
                </th>
                <th className="px-8 py-5 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
              {filteredIssues.map((issue) => (
                <tr
                  key={issue.id}
                  className="hover:bg-gradient-to-r hover:from-orange-50 hover:to-red-50 dark:hover:from-orange-900/10 dark:hover:to-red-900/10 transition-all duration-300"
                >
                  <td className="px-8 py-6">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl">
                          <FileText size={16} className="text-white" />
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 dark:text-white text-lg">
                            {issue.ticketId}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-1 max-w-xs">
                            {issue.title}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4 ml-11">
                        <span className="flex items-center space-x-1 text-xs text-gray-500 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full">
                          <MessageSquare size={12} />
                          <span>{issue.comments}</span>
                        </span>
                        {issue.attachments > 0 && (
                          <span className="flex items-center space-x-1 text-xs text-gray-500 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full">
                            <Paperclip size={12} />
                            <span>{issue.attachments}</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
                        {issue.user.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white text-lg">{issue.user}</p>
                        <p className="text-sm text-gray-500 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full inline-block">{issue.userId}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span
                      className={`px-4 py-2 rounded-2xl text-sm font-bold capitalize shadow-sm ${getCategoryColor(
                        issue.category
                      )}`}
                    >
                      {issue.category}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <span
                      className={`px-4 py-2 rounded-2xl text-sm font-bold capitalize shadow-sm ${getPriorityColor(
                        issue.priority
                      )}`}
                    >
                      {issue.priority}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <span
                      className={`px-4 py-2 rounded-2xl text-sm font-bold capitalize shadow-sm ${getStatusColor(
                        issue.status
                      )}`}
                    >
                      {issue.status.replace('-', ' ')}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center space-x-2">
                      <Calendar size={16} className="text-gray-400" />
                      <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">{issue.createdDate}</p>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <button
                      onClick={() => handleViewIssue(issue)}
                      className="p-3 hover:bg-gradient-to-r hover:from-orange-500 hover:to-red-500 hover:text-white bg-gray-100 dark:bg-gray-800 rounded-2xl transition-all duration-300 group"
                      title="View Details"
                    >
                      <Eye size={20} className="text-orange-600 group-hover:text-white transition-colors" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Premium Issue Detail Modal */}
      {showModal && selectedIssue && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-gray-950 rounded-3xl max-w-5xl w-full my-8 border border-gray-200 dark:border-gray-800 shadow-2xl overflow-hidden">
            {/* Enhanced Header */}
            <div className="sticky top-0 bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 p-8 z-10 rounded-t-3xl">
              <div className="flex items-center justify-between text-white">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl">
                    <AlertTriangle size={32} className="text-white" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold">{selectedIssue.ticketId}</h2>
                    <p className="text-orange-100 text-lg">{selectedIssue.title}</p>
                    <div className="flex items-center space-x-4 mt-2">
                      <span className="flex items-center space-x-1 text-orange-200">
                        <User size={16} />
                        <span>{selectedIssue.user}</span>
                      </span>
                      <span className="flex items-center space-x-1 text-orange-200">
                        <Calendar size={16} />
                        <span>{selectedIssue.createdDate}</span>
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
              {/* Issue Overview Cards */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
                  <h3 className="font-bold text-xl mb-4 flex items-center space-x-2">
                    <FileText size={24} className="text-orange-600" />
                    <span>Issue Details</span>
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 font-medium">Description</p>
                      <p className="text-gray-900 dark:text-white text-lg leading-relaxed">{selectedIssue.description}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white dark:bg-gray-950 rounded-xl p-4 border border-gray-200 dark:border-gray-800">
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 font-medium">Status</p>
                        <span
                          className={`px-4 py-2 rounded-2xl text-sm font-bold capitalize ${getStatusColor(
                            selectedIssue.status
                          )}`}
                        >
                          {selectedIssue.status.replace('-', ' ')}
                        </span>
                      </div>
                      <div className="bg-white dark:bg-gray-950 rounded-xl p-4 border border-gray-200 dark:border-gray-800">
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 font-medium">Priority</p>
                        <span
                          className={`px-4 py-2 rounded-2xl text-sm font-bold capitalize ${getPriorityColor(
                            selectedIssue.priority
                          )}`}
                        >
                          {selectedIssue.priority}
                        </span>
                      </div>
                      <div className="bg-white dark:bg-gray-950 rounded-xl p-4 border border-gray-200 dark:border-gray-800">
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 font-medium">Category</p>
                        <span
                          className={`px-4 py-2 rounded-2xl text-sm font-bold capitalize ${getCategoryColor(
                            selectedIssue.category
                          )}`}
                        >
                          {selectedIssue.category}
                        </span>
                      </div>
                      <div className="bg-white dark:bg-gray-950 rounded-xl p-4 border border-gray-200 dark:border-gray-800">
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 font-medium">Assigned To</p>
                        <p className="font-semibold text-gray-900 dark:text-white text-lg">
                          {selectedIssue.assignedTo}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-2xl p-6 border border-blue-200 dark:border-blue-800">
                    <div className="flex items-center space-x-3 text-blue-600 dark:text-blue-400 mb-4">
                      <div className="p-2 bg-blue-600 rounded-xl">
                        <User size={20} className="text-white" />
                      </div>
                      <p className="text-lg font-bold">Reported By</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl flex items-center justify-center text-white font-bold text-lg">
                        {selectedIssue.user.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 dark:text-white text-lg">
                          {selectedIssue.user}
                        </p>
                        <p className="text-sm text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30 px-2 py-1 rounded-full inline-block">{selectedIssue.userId}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-2xl p-6 border border-green-200 dark:border-green-800">
                    <div className="flex items-center space-x-3 text-green-600 dark:text-green-400 mb-4">
                      <div className="p-2 bg-green-600 rounded-xl">
                        <Calendar size={20} className="text-white" />
                      </div>
                      <p className="text-lg font-bold">Timeline</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600 dark:text-gray-400">Created</p>
                      <p className="font-bold text-gray-900 dark:text-white text-lg">
                        {selectedIssue.createdDate}
                      </p>
                      {selectedIssue.resolvedDate && (
                        <>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-3">Resolved</p>
                          <p className="font-bold text-green-700 dark:text-green-300 text-lg">
                            {selectedIssue.resolvedDate}
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {selectedIssue.attachments > 0 && (
                <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4 border border-gray-200 dark:border-gray-800">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                      <Paperclip size={18} />
                      <p className="text-sm font-medium">Attachments ({selectedIssue.attachments})</p>
                    </div>
                    <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                      View All
                    </button>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-2 px-3 py-2 bg-white dark:bg-gray-950 rounded-lg border border-gray-200 dark:border-gray-800">
                      <FileText size={16} className="text-gray-400" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        screenshot.png
                      </span>
                      <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded">
                        <Download size={14} className="text-gray-600" />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800">
                <h3 className="font-bold text-lg mb-4 flex items-center space-x-2">
                  <MessageSquare size={20} />
                  <span>Comments ({selectedIssue.comments})</span>
                </h3>
                <div className="space-y-4 mb-4">
                  <div className="bg-white dark:bg-gray-950 rounded-lg p-4 border border-gray-200 dark:border-gray-800">
                    <div className="flex items-start space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {selectedIssue.user.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <p className="font-semibold text-gray-900 dark:text-white">
                            {selectedIssue.user}
                          </p>
                          <span className="text-xs text-gray-500">2 hours ago</span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {selectedIssue.description}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                    <div className="flex items-start space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-700 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        Y
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <p className="font-semibold text-gray-900 dark:text-white">You</p>
                          <span className="text-xs text-gray-500">1 hour ago</span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          I'm looking into this issue. Will update you shortly.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200 dark:border-gray-800 pt-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-700 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      Y
                    </div>
                    <div className="flex-1">
                      <textarea
                        rows={3}
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Add a comment..."
                        className="w-full px-4 py-3 bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-blue-500 resize-none"
                      />
                      <div className="flex items-center justify-between mt-2">
                        <button className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                          <Paperclip size={16} />
                          <span>Attach file</span>
                        </button>
                        <button
                          onClick={handleAddComment}
                          className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-all"
                        >
                          <Send size={16} />
                          <span>Comment</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3 pt-6 border-t border-gray-200 dark:border-gray-800">
                {selectedIssue.status !== 'resolved' && (
                  <>
                    <button
                      onClick={handleResolveIssue}
                      className="flex-1 flex items-center justify-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-semibold transition-all"
                    >
                      <CheckCircle size={20} />
                      <span>Mark as Resolved</span>
                    </button>
                    <button
                      onClick={() => toast.success('Status updated to In Progress')}
                      className="flex-1 flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-all"
                    >
                      <Clock size={20} />
                      <span>In Progress</span>
                    </button>
                  </>
                )}
                <button
                  onClick={() => toast.success('Ticket escalated')}
                  className="px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-semibold transition-all"
                >
                  Escalate
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}