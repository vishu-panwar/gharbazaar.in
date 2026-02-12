'use client'

import { useState } from 'react'
import { 
  FileCheck,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  Download,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  AlertCircle,
  ThumbsUp,
  ThumbsDown,
  MessageCircle,
  Image as ImageIcon,
  Shield,
  Award,
  TrendingUp,
  Users,
  Crown,
  Zap,
  ArrowUpRight,
  ShieldCheck
} from 'lucide-react'
import { backendApi } from '@/lib/backendApi'
import toast from 'react-hot-toast'
import React, { useEffect } from 'react'

export default function KYCVerificationPage() {
  const [requests, setRequests] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'pending' | 'approved' | 'rejected' | 'all'>('pending')
  const [selectedKYC, setSelectedKYC] = useState<string | null>(null)
  const [reviewComments, setReviewComments] = useState('')
  const [reviewLoading, setReviewLoading] = useState(false)

  useEffect(() => {
    fetchRequests()
  }, [activeTab])

  const fetchRequests = async () => {
    setLoading(true)
    try {
      const status = activeTab === 'all' ? undefined : activeTab
      const response = await backendApi.kyc.getRequests(status)
      if (response.success) {
        setRequests(response.data)
      }
    } catch (error) {
      toast.error('Failed to fetch KYC requests')
    } finally {
      setLoading(false)
    }
  }

  const handleReview = async (id: string, status: 'approved' | 'rejected') => {
    setReviewLoading(true)
    try {
      const response = await backendApi.kyc.review(id, { 
        status, 
        reviewComments 
      })
      if (response.success) {
        toast.success(`KYC ${status} successfully`)
        setReviewComments('')
        setSelectedKYC(null)
        fetchRequests()
      } else {
        toast.error(response.error || 'Failed to process review')
      }
    } catch (error: any) {
      toast.error(error.message || 'Something went wrong')
    } finally {
      setReviewLoading(false)
    }
  }

  const filteredRequests = requests

  const stats = {
    all: requests.length, // This should ideally come from a stats API or be calculated from all
    pending: requests.filter(r => r.status === 'pending').length,
    approved: 0, // Since we delete on approval in the backend implementation, we might need to adjust logic
    rejected: 0
  }

  const selectedRequest = requests.find(r => r.id === selectedKYC)

  const getStatusBadge = (status: string) => {
    const badges = {
      pending: { color: 'yellow', icon: Clock, label: 'Pending' },
      approved: { color: 'green', icon: CheckCircle, label: 'Approved' },
      rejected: { color: 'red', icon: XCircle, label: 'Rejected' }
    }
    const badge = badges[status as keyof typeof badges]
    return (
      <div className={`flex items-center space-x-1 ${
        badge.color === 'yellow' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400' :
        badge.color === 'green' ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' :
        'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
      } px-3 py-1 rounded-full text-xs font-semibold`}>
        <badge.icon size={12} />
        <span>{badge.label}</span>
      </div>
    )
  }

  const getPriorityBadge = (priority: string) => {
    const colors = {
      high: 'bg-red-500',
      medium: 'bg-yellow-500',
      low: 'bg-blue-500'
    }
    return (
      <span className={`inline-block w-2 h-2 rounded-full ${colors[priority as keyof typeof colors]}`} />
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-indigo-600/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-20 right-0 w-80 h-80 bg-gradient-to-bl from-purple-400/20 to-pink-600/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 text-white">
          <div className="max-w-7xl mx-auto px-6 py-12">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-600 rounded-3xl flex items-center justify-center shadow-2xl border-2 border-white/20">
                  <FileCheck className="text-white" size={36} />
                </div>
                <div>
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-green-300 font-semibold text-sm">KYC System Active</span>
                  </div>
                  <h1 className="text-4xl lg:text-6xl font-black leading-tight bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent pb-2">
                    KYC Verification
                  </h1>
                  <p className="text-xl text-blue-100 leading-relaxed">
                    Review and verify user documents with advanced AI assistance
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Enhanced Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { 
              title: 'Total Requests', 
              value: stats.all, 
              icon: FileCheck, 
              gradient: 'from-blue-500 via-blue-600 to-indigo-700', 
              change: '+12 today',
              trend: 'up',
              description: 'All KYC submissions'
            },
            { 
              title: 'Pending Review', 
              value: stats.pending, 
              icon: Clock, 
              gradient: 'from-yellow-500 via-orange-600 to-red-700', 
              change: 'Needs attention',
              trend: 'neutral',
              description: 'Awaiting verification'
            },
            { 
              title: 'Approved', 
              value: stats.approved, 
              icon: CheckCircle, 
              gradient: 'from-green-500 via-emerald-600 to-teal-700', 
              change: '+8 this week',
              trend: 'up',
              description: 'Successfully verified'
            },
            { 
              title: 'Rejected', 
              value: stats.rejected, 
              icon: XCircle, 
              gradient: 'from-red-500 via-pink-600 to-rose-700', 
              change: 'Quality maintained',
              trend: 'down',
              description: 'Failed verification'
            }
          ].map((stat, index) => (
            <div key={index} className="group relative bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-gray-200/50 dark:border-gray-700/50 hover:shadow-3xl transition-all duration-500 hover:-translate-y-2 hover:scale-105 cursor-pointer overflow-hidden">
              {/* Background Gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-3xl`}></div>
              
              {/* Icon */}
              <div className={`relative w-16 h-16 rounded-2xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-xl mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <stat.icon className="text-white" size={28} />
              </div>
              
              {/* Content */}
              <div className="relative">
                <p className="text-gray-600 dark:text-gray-400 text-sm font-semibold mb-2">{stat.title}</p>
                <p className="text-4xl font-black text-gray-900 dark:text-white mb-2 leading-none pb-1">
                  {stat.value}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">{stat.description}</p>
                <div className={`flex items-center space-x-2 text-sm font-semibold ${
                  stat.trend === 'up' ? 'text-green-600' : 
                  stat.trend === 'down' ? 'text-red-600' : 'text-blue-600'
                }`}>
                  <div className={`w-2 h-2 rounded-full ${
                    stat.trend === 'up' ? 'bg-green-500' : 
                    stat.trend === 'down' ? 'bg-red-500' : 'bg-blue-500'
                  } animate-pulse`}></div>
                  <span>{stat.change}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Search & Filter Section */}
        <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-gray-200/50 dark:border-gray-700/50">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 via-pink-500 to-rose-600 rounded-2xl flex items-center justify-center shadow-xl">
                <Search className="text-white" size={28} />
              </div>
              <div>
                <h2 className="text-3xl font-black text-gray-900 dark:text-white leading-[1.2] pb-1">KYC Management</h2>
                <p className="text-gray-600 dark:text-gray-400">Advanced document verification system</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search by name, email, phone, or document type..."
                className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl focus:ring-2 focus:ring-blue-500 text-lg"
              />
            </div>
            <button className="flex items-center space-x-2 px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-2xl font-bold transition-all shadow-lg hover:shadow-xl">
              <Filter size={20} />
              <span>Advanced Filters</span>
            </button>
          </div>

          <div className="flex space-x-2 overflow-x-auto">
            {[
              { key: 'pending', label: 'Pending', count: stats.pending, color: 'yellow' },
              { key: 'approved', label: 'Approved', count: stats.approved, color: 'green' },
              { key: 'rejected', label: 'Rejected', count: stats.rejected, color: 'red' },
              { key: 'all', label: 'All Requests', count: stats.all, color: 'blue' }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`flex-1 min-w-[140px] px-6 py-4 rounded-2xl font-bold transition-all ${
                  activeTab === tab.key
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-xl'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>
        </div>

        {/* KYC List & Detail View */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* KYC List */}
          <div className="xl:col-span-1 space-y-4 max-h-[800px] overflow-y-auto">
            {filteredRequests.map((request) => (
              <div
                key={request.id}
                onClick={() => setSelectedKYC(request.id)}
                className={`group relative bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl p-6 shadow-lg border cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
                  selectedKYC === request.id
                    ? 'border-blue-500 ring-2 ring-blue-500 shadow-2xl'
                    : 'border-gray-200/50 dark:border-gray-700/50 hover:border-blue-300'
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <span className="w-2 h-2 rounded-full bg-blue-500" />
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                      {request.fullName.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 dark:text-white">{request.fullName}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{request.partnerId}</p>
                    </div>
                  </div>
                  {getStatusBadge(request.status)}
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <Mail size={14} className="mr-2" />
                    <span className="truncate">{request.user?.email}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <MapPin size={14} className="mr-2" />
                    <span className="truncate">{request.address}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                  <span className="text-xs text-gray-500">
                    {new Date(request.createdAt).toLocaleDateString()}
                  </span>
                  <div className="flex items-center space-x-2">
                    <div className="w-16 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all ${
                          request.verificationScore >= 80 ? 'bg-green-500' :
                          request.verificationScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${request.verificationScore}%` }}
                      />
                    </div>
                    <span className="text-xs font-semibold text-gray-900 dark:text-white">{request.verificationScore}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Detail View */}
          <div className="xl:col-span-3">
            {selectedRequest ? (
              <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden">
                {/* Header */}
                <div className="p-8 border-b border-gray-200 dark:border-gray-800 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center space-x-6">
                      <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full overflow-hidden shadow-xl">
                        <img src={selectedRequest.profileImage} alt="Profile" className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <h2 className="text-3xl font-black text-gray-900 dark:text-white leading-[1.2] pb-2">
                          {selectedRequest.fullName}
                        </h2>
                        <div className="flex items-center space-x-3 mb-2">
                          {getStatusBadge(selectedRequest.status)}
                          <span className="text-sm text-gray-500">•</span>
                          <span className="text-sm text-gray-600 dark:text-gray-400 font-semibold">
                            Partner ID: {selectedRequest.partnerId}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="flex items-center space-x-3 p-4 bg-white/50 dark:bg-gray-800/50 rounded-2xl">
                       <Mail size={20} className="text-blue-500" />
                       <div>
                         <p className="text-xs text-gray-500 dark:text-gray-400">Email</p>
                         <p className="font-semibold text-gray-900 dark:text-white">{selectedRequest.user?.email}</p>
                       </div>
                     </div>
                     <div className="flex items-center space-x-3 p-4 bg-white/50 dark:bg-gray-800/50 rounded-2xl">
                       <Phone size={20} className="text-green-500" />
                       <div>
                         <p className="text-xs text-gray-500 dark:text-gray-400">Phone</p>
                         <p className="font-semibold text-gray-900 dark:text-white">{selectedRequest.contactNumber}</p>
                       </div>
                     </div>
                     <div className="flex items-center space-x-3 p-4 bg-white/50 dark:bg-gray-800/50 rounded-2xl">
                       <MapPin size={20} className="text-purple-500" />
                       <div>
                         <p className="text-xs text-gray-500 dark:text-gray-400">Address</p>
                         <p className="font-semibold text-gray-900 dark:text-white">{selectedRequest.address}</p>
                       </div>
                     </div>
                  </div>
                </div>

                {/* Documents & Actions */}
                <div className="p-8">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                    <Shield className="mr-3 text-blue-500" size={24} />
                    Submitted Documents
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="group border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-2xl p-6 hover:border-blue-500 transition-all cursor-pointer hover:shadow-lg">
                      <div className="flex flex-col items-center text-center">
                        <div className="w-full h-48 bg-gray-100 dark:bg-gray-900 rounded-xl overflow-hidden mb-4">
                          <img src={selectedRequest.aadharImage} alt="Aadhar" className="w-full h-full object-contain" />
                        </div>
                        <p className="text-lg font-bold text-gray-900 dark:text-white mb-4">Aadhar Card ({selectedRequest.aadharNumber})</p>
                        <div className="flex space-x-3">
                          <a href={selectedRequest.aadharImage} target="_blank" className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-semibold">
                            <Eye size={16} />
                            <span>View Full</span>
                          </a>
                        </div>
                      </div>
                    </div>
                    <div className="group border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-2xl p-6 hover:border-blue-500 transition-all cursor-pointer hover:shadow-lg">
                      <div className="flex flex-col items-center text-center">
                        <div className="w-full h-48 bg-gray-100 dark:bg-gray-900 rounded-xl overflow-hidden mb-4">
                          <img src={selectedRequest.profileImage} alt="Profile" className="w-full h-full object-contain" />
                        </div>
                        <p className="text-lg font-bold text-gray-900 dark:text-white mb-4">Profile Photo</p>
                        <div className="flex space-x-3">
                          <a href={selectedRequest.profileImage} target="_blank" className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-semibold">
                            <Eye size={16} />
                            <span>View Full</span>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Verification Score */}
                  <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-6 mb-8">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <Award className="text-yellow-500" size={24} />
                        <span className="text-lg font-bold text-gray-900 dark:text-white">
                          AI Verification Score
                        </span>
                      </div>
                      <span className="text-3xl font-black text-gray-900 dark:text-white">
                        {selectedRequest.verificationScore}%
                      </span>
                    </div>
                    <div className="w-full h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-1000 ${
                          selectedRequest.verificationScore >= 80 ? 'bg-gradient-to-r from-green-500 to-emerald-600' :
                          selectedRequest.verificationScore >= 60 ? 'bg-gradient-to-r from-yellow-500 to-orange-600' : 
                          'bg-gradient-to-r from-red-500 to-pink-600'
                        }`}
                        style={{ width: `${selectedRequest.verificationScore}%` }}
                      />
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                      {selectedRequest.verificationScore >= 80 ? 'Excellent verification quality' :
                       selectedRequest.verificationScore >= 60 ? 'Good verification quality' : 
                       'Requires manual review'}
                    </p>
                  </div>

                  {/* Actions */}
                  {selectedRequest.status === 'pending' && (
                    <div className="space-y-6">
                      <div>
                        <label className="block text-lg font-bold text-gray-900 dark:text-white mb-3">
                          Verification Comments
                        </label>
                        <textarea
                          rows={4}
                          value={reviewComments}
                          onChange={(e) => setReviewComments(e.target.value)}
                          placeholder="Add your verification notes and feedback..."
                          className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl focus:ring-2 focus:ring-blue-500 text-lg"
                        />
                      </div>
                      
                      <div className="flex gap-4">
                        <button 
                          disabled={reviewLoading}
                          onClick={() => handleReview(selectedRequest.id, 'approved')}
                          className="flex-1 flex items-center justify-center space-x-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-4 rounded-2xl font-bold transition-all shadow-lg hover:shadow-xl disabled:opacity-50"
                        >
                          <ThumbsUp size={24} />
                          <span>Approve KYC</span>
                        </button>
                        <button 
                          disabled={reviewLoading}
                          onClick={() => handleReview(selectedRequest.id, 'rejected')}
                          className="flex-1 flex items-center justify-center space-x-3 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white px-8 py-4 rounded-2xl font-bold transition-all shadow-lg hover:shadow-xl disabled:opacity-50"
                        >
                          <ThumbsDown size={24} />
                          <span>Reject KYC</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Verification Info */}
                  {selectedRequest.status !== 'pending' && (
                    <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                            {selectedRequest.status === 'approved' ? 'Approved' : 'Rejected'} by
                          </p>
                          <p className="text-xl font-bold text-gray-900 dark:text-white">
                            {selectedRequest.verifiedBy}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Date</p>
                          <p className="text-xl font-bold text-gray-900 dark:text-white">
                            {new Date(selectedRequest.verifiedDate!).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      {selectedRequest.rejectionReason && (
                        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Rejection Reason:</p>
                          <p className="text-lg font-semibold text-red-600 dark:text-red-400">
                            {selectedRequest.rejectionReason}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 h-full flex items-center justify-center p-12">
                <div className="text-center">
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <FileCheck size={48} className="text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    Select a KYC Request
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-lg">
                    Choose a request from the list to review and verify documents
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
