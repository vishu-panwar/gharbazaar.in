'use client'

import { useState } from 'react'
import { 
  MessageCircle,
  Search,
  Filter,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Star,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Home,
  User,
  Send,
  Archive,
  Trash2,
  MoreVertical,
  TrendingUp
} from 'lucide-react'

export default function InquiriesPage() {
  const [activeTab, setActiveTab] = useState<'all' | 'new' | 'replied' | 'archived'>('all')
  const [selectedInquiry, setSelectedInquiry] = useState<number | null>(null)
  const [replyText, setReplyText] = useState('')

  // Sample inquiries data
  const inquiries = [
    {
      id: 1,
      name: 'Rahul Sharma',
      email: 'rahul.sharma@email.com',
      phone: '+91 98765 43210',
      property: 'Luxury Penthouse',
      propertyLocation: 'Worli, Mumbai',
      message: 'I am very interested in this property. Can we schedule a visit this weekend? Also, is the price negotiable?',
      status: 'new',
      priority: 'high',
      date: '2024-12-01T10:30:00',
      budget: '₹8-9 Cr',
      source: 'Website',
      rating: 5
    },
    {
      id: 2,
      name: 'Priya Patel',
      email: 'priya.patel@email.com',
      phone: '+91 98765 43211',
      property: 'Modern Villa',
      propertyLocation: 'Whitefield, Bangalore',
      message: 'Looking for more details about the amenities and nearby facilities. Can you share the floor plan?',
      status: 'replied',
      priority: 'medium',
      date: '2024-11-30T15:45:00',
      budget: '₹3.5-4 Cr',
      source: 'Google',
      rating: 4
    },
    {
      id: 3,
      name: 'Amit Kumar',
      email: 'amit.kumar@email.com',
      phone: '+91 98765 43212',
      property: 'Garden Estate',
      propertyLocation: 'Gurgaon, Delhi NCR',
      message: 'Is this property available for immediate possession? What are the payment terms?',
      status: 'new',
      priority: 'high',
      date: '2024-12-01T09:15:00',
      budget: '₹5-5.5 Cr',
      source: 'Facebook',
      rating: 5
    },
    {
      id: 4,
      name: 'Sneha Reddy',
      email: 'sneha.reddy@email.com',
      phone: '+91 98765 43213',
      property: 'Sea View Apartment',
      propertyLocation: 'Marine Drive, Mumbai',
      message: 'I would like to know about the maintenance charges and parking availability.',
      status: 'replied',
      priority: 'low',
      date: '2024-11-29T14:20:00',
      budget: '₹6-6.5 Cr',
      source: 'Instagram',
      rating: 4
    },
    {
      id: 5,
      name: 'Vikram Singh',
      email: 'vikram.singh@email.com',
      phone: '+91 98765 43214',
      property: 'Smart Home Apartment',
      propertyLocation: 'Koramangala, Bangalore',
      message: 'Can you provide virtual tour? I am currently out of the city.',
      status: 'archived',
      priority: 'medium',
      date: '2024-11-25T11:30:00',
      budget: '₹2.5-3 Cr',
      source: 'Website',
      rating: 3
    }
  ]

  const filteredInquiries = activeTab === 'all' 
    ? inquiries 
    : inquiries.filter(inq => inq.status === activeTab)

  const stats = {
    all: inquiries.length,
    new: inquiries.filter(i => i.status === 'new').length,
    replied: inquiries.filter(i => i.status === 'replied').length,
    archived: inquiries.filter(i => i.status === 'archived').length
  }

  const getStatusBadge = (status: string) => {
    const badges = {
      new: { color: 'red', icon: AlertCircle, label: 'New' },
      replied: { color: 'green', icon: CheckCircle, label: 'Replied' },
      archived: { color: 'gray', icon: Archive, label: 'Archived' }
    }
    const badge = badges[status as keyof typeof badges]
    return (
      <div className={`flex items-center space-x-1 bg-${badge.color}-100 dark:bg-${badge.color}-900/30 text-${badge.color}-600 dark:text-${badge.color}-400 px-3 py-1 rounded-full text-xs font-semibold`}>
        <badge.icon size={12} />
        <span>{badge.label}</span>
      </div>
    )
  }

  const getPriorityBadge = (priority: string) => {
    const colors = {
      high: 'red',
      medium: 'yellow',
      low: 'blue'
    }
    return (
      <span className={`inline-block w-2 h-2 rounded-full bg-${colors[priority as keyof typeof colors]}-500`} />
    )
  }

  const selectedInquiryData = inquiries.find(i => i.id === selectedInquiry)

  const handleReply = () => {
    if (replyText.trim()) {
      console.log('Reply sent:', replyText)
      setReplyText('')
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white flex items-center">
            <MessageCircle className="mr-3 text-purple-500" size={28} />
            Inquiries
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage and respond to property inquiries
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total', value: stats.all, icon: MessageCircle, color: 'blue' },
          { label: 'New', value: stats.new, icon: AlertCircle, color: 'red' },
          { label: 'Replied', value: stats.replied, icon: CheckCircle, color: 'green' },
          { label: 'Archived', value: stats.archived, icon: Archive, color: 'gray' }
        ].map((stat, index) => (
          <div key={index} className="bg-white dark:bg-gray-900 rounded-xl p-5 shadow-lg border border-gray-200 dark:border-gray-800">
            <div className="flex items-center justify-between mb-2">
              <div className={`w-10 h-10 bg-${stat.color}-100 dark:bg-${stat.color}-900/30 rounded-lg flex items-center justify-center`}>
                <stat.icon className={`text-${stat.color}-600`} size={20} />
              </div>
              <span className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Search & Tabs */}
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 p-4">
        <div className="flex flex-col lg:flex-row gap-4 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search inquiries..."
              className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <button className="flex items-center space-x-2 px-4 py-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-all">
            <Filter size={20} />
            <span>Filters</span>
          </button>
        </div>

        <div className="flex space-x-2 overflow-x-auto">
          {[
            { key: 'all', label: 'All', count: stats.all },
            { key: 'new', label: 'New', count: stats.new },
            { key: 'replied', label: 'Replied', count: stats.replied },
            { key: 'archived', label: 'Archived', count: stats.archived }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex-1 min-w-[100px] px-4 py-3 rounded-lg font-medium transition-all ${
                activeTab === tab.key
                  ? 'bg-purple-600 text-white shadow-lg'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>
      </div>

      {/* Inquiries List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* List */}
        <div className="lg:col-span-1 space-y-3 max-h-[600px] overflow-y-auto">
          {filteredInquiries.map((inquiry) => (
            <div
              key={inquiry.id}
              onClick={() => setSelectedInquiry(inquiry.id)}
              className={`bg-white dark:bg-gray-900 rounded-xl p-4 shadow-lg border cursor-pointer transition-all ${
                selectedInquiry === inquiry.id
                  ? 'border-purple-500 ring-2 ring-purple-500'
                  : 'border-gray-200 dark:border-gray-800 hover:border-purple-300'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-2">
                  {getPriorityBadge(inquiry.priority)}
                  <h3 className="font-bold text-gray-900 dark:text-white">{inquiry.name}</h3>
                </div>
                {getStatusBadge(inquiry.status)}
              </div>

              <div className="space-y-2 mb-3">
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <Home size={14} className="mr-2" />
                  <span className="truncate">{inquiry.property}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <Clock size={14} className="mr-2" />
                  <span>{new Date(inquiry.date).toLocaleDateString('en-IN', { 
                    day: 'numeric', 
                    month: 'short',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}</span>
                </div>
              </div>

              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                {inquiry.message}
              </p>

              {inquiry.status === 'new' && (
                <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                  <span className="text-xs font-semibold text-red-600 dark:text-red-400">
                    Needs Response
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Detail View */}
        <div className="lg:col-span-2">
          {selectedInquiryData ? (
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
              {/* Header */}
              <div className="p-6 border-b border-gray-200 dark:border-gray-800">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {selectedInquiryData.name.charAt(0)}
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                        {selectedInquiryData.name}
                      </h2>
                      <div className="flex items-center space-x-2 mt-1">
                        {getStatusBadge(selectedInquiryData.status)}
                        <span className="text-xs text-gray-500">•</span>
                        <span className="text-xs text-gray-600 dark:text-gray-400">
                          {selectedInquiryData.source}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all">
                      <Archive size={20} />
                    </button>
                    <button className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all">
                      <Trash2 size={20} />
                    </button>
                    <button className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all">
                      <MoreVertical size={20} />
                    </button>
                  </div>
                </div>

                {/* Contact Info */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center space-x-2 text-sm">
                    <Mail size={16} className="text-gray-400" />
                    <span className="text-gray-900 dark:text-white">{selectedInquiryData.email}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <Phone size={16} className="text-gray-400" />
                    <span className="text-gray-900 dark:text-white">{selectedInquiryData.phone}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <Star size={16} className="text-yellow-500 fill-yellow-500" />
                    <span className="text-gray-900 dark:text-white">{selectedInquiryData.rating}/5 Rating</span>
                  </div>
                </div>
              </div>

              {/* Property Info */}
              <div className="p-6 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  Property Interested In
                </h3>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-bold text-gray-900 dark:text-white text-lg">
                      {selectedInquiryData.property}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center mt-1">
                      <MapPin size={14} className="mr-1" />
                      {selectedInquiryData.propertyLocation}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500 dark:text-gray-400">Budget</p>
                    <p className="font-bold text-purple-600">{selectedInquiryData.budget}</p>
                  </div>
                </div>
              </div>

              {/* Message */}
              <div className="p-6">
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  Message
                </h3>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                  <p className="text-gray-900 dark:text-white leading-relaxed">
                    {selectedInquiryData.message}
                  </p>
                  <div className="flex items-center space-x-2 mt-4 text-xs text-gray-500 dark:text-gray-400">
                    <Calendar size={12} />
                    <span>
                      Received on {new Date(selectedInquiryData.date).toLocaleDateString('en-IN', { 
                        day: 'numeric', 
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                </div>
              </div>

              {/* Reply Section */}
              <div className="p-6 border-t border-gray-200 dark:border-gray-800">
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  Quick Reply
                </h3>
                <div className="space-y-3">
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Type your reply..."
                    rows={4}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 resize-none"
                  />
                  <div className="flex items-center justify-between">
                    <div className="flex space-x-2">
                      <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                        Use Template
                      </button>
                      <button className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 font-medium">
                        Schedule Visit
                      </button>
                    </div>
                    <div className="flex space-x-2">
                      <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-white rounded-lg font-medium transition-all">
                        <Phone size={18} />
                        <span>Call</span>
                      </button>
                      <button
                        onClick={handleReply}
                        disabled={!replyText.trim()}
                        className="flex items-center space-x-2 px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Send size={18} />
                        <span>Send Reply</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 h-full flex items-center justify-center p-12">
              <div className="text-center">
                <MessageCircle size={64} className="mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  Select an inquiry
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Choose an inquiry from the list to view details and respond
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold mb-2">Response Performance</h3>
            <p className="text-purple-100">Keep up the great work! Your response rate is excellent.</p>
          </div>
          <div className="grid grid-cols-3 gap-6">
            <div className="text-center">
              <p className="text-3xl font-bold">2.5h</p>
              <p className="text-sm text-purple-100">Avg Response Time</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold">94%</p>
              <p className="text-sm text-purple-100">Response Rate</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold">4.6</p>
              <p className="text-sm text-purple-100">Avg Rating</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
