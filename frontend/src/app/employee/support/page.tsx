'use client'

import { useState } from 'react'
import {
  MessageSquare,
  Search,
  Send,
  Paperclip,
  Phone,
  Video,
  MoreVertical,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  User,
  Filter,
  Star,
  Archive,
  Trash2,
  Tag,
  Image as ImageIcon,
  Smile,
  Shield,
  Award,
  TrendingUp,
  Users,
  Crown,
  Zap,
  ArrowUpRight,
  Building2,
  Headphones,
  MessageCircle,
  Bell,
  Settings,
  Eye,
  Download
} from 'lucide-react'
import toast from 'react-hot-toast'

export default function ChatSupportPage() {
  const [selectedChat, setSelectedChat] = useState<any>(null)
  const [message, setMessage] = useState('')
  const [filter, setFilter] = useState('active')

  const chats = [
    {
      id: 1,
      userId: 'USR001',
      userName: 'Rajesh Kumar',
      avatar: 'RK',
      lastMessage: 'I need help with my property listing verification',
      timestamp: '2 min ago',
      status: 'active',
      unread: 3,
      priority: 'high',
      category: 'listing',
      userType: 'Premium Seller',
      location: 'Mumbai, Maharashtra',
      messages: [
        {
          id: 1,
          sender: 'user',
          text: 'Hello, I need help with my property listing verification process',
          timestamp: '10:30 AM',
        },
        {
          id: 2,
          sender: 'agent',
          text: 'Hello Rajesh! I\'d be happy to help you with the verification. What specific issue are you facing?',
          timestamp: '10:31 AM',
        },
        {
          id: 3,
          sender: 'user',
          text: 'I uploaded all required documents but the status still shows pending. It\'s been 3 days now.',
          timestamp: '10:32 AM',
        },
        {
          id: 4,
          sender: 'agent',
          text: 'I understand your concern. Let me check your verification status right away.',
          timestamp: '10:33 AM',
        },
      ],
    },
    {
      id: 2,
      userId: 'USR002',
      userName: 'Priya Sharma',
      avatar: 'PS',
      lastMessage: 'Payment issue with premium subscription',
      timestamp: '15 min ago',
      status: 'active',
      unread: 1,
      priority: 'medium',
      category: 'payment',
      userType: 'Premium Buyer',
      location: 'Bangalore, Karnataka',
      messages: [
        {
          id: 1,
          sender: 'user',
          text: 'My payment failed but the amount was deducted from my account',
          timestamp: '10:15 AM',
        },
        {
          id: 2,
          sender: 'agent',
          text: 'I understand your concern about the payment. Let me check your transaction details immediately.',
          timestamp: '10:16 AM',
        },
        {
          id: 3,
          sender: 'user',
          text: 'Transaction ID: TXN123456789. Please help me resolve this quickly.',
          timestamp: '10:17 AM',
        },
      ],
    },
    {
      id: 3,
      userId: 'USR003',
      userName: 'Amit Patel',
      avatar: 'AP',
      lastMessage: 'Thank you for the excellent support!',
      timestamp: '1 hour ago',
      status: 'resolved',
      unread: 0,
      priority: 'low',
      category: 'general',
      userType: 'Basic User',
      location: 'Pune, Maharashtra',
      messages: [
        {
          id: 1,
          sender: 'user',
          text: 'How do I verify my KYC documents?',
          timestamp: '9:00 AM',
        },
        {
          id: 2,
          sender: 'agent',
          text: 'You can verify your KYC by going to Settings > KYC Verification and uploading the required documents.',
          timestamp: '9:01 AM',
        },
        {
          id: 3,
          sender: 'user',
          text: 'Perfect! I found it. Thank you for the excellent support!',
          timestamp: '9:05 AM',
        },
      ],
    },
    {
      id: 4,
      userId: 'USR004',
      userName: 'Sneha Reddy',
      avatar: 'SR',
      lastMessage: 'Property search filters not working properly',
      timestamp: '2 hours ago',
      status: 'pending',
      unread: 2,
      priority: 'medium',
      category: 'technical',
      userType: 'Premium Buyer',
      location: 'Hyderabad, Telangana',
      messages: [
        {
          id: 1,
          sender: 'user',
          text: 'The property search filters are not working properly on the mobile app',
          timestamp: '8:30 AM',
        },
        {
          id: 2,
          sender: 'agent',
          text: 'Thank you for reporting this issue. Can you please tell me which specific filters are not working?',
          timestamp: '8:32 AM',
        },
      ],
    }
  ]

  const stats = {
    activeChats: 24,
    resolvedToday: 67,
    avgResponseTime: '1.8 min',
    satisfaction: 4.9,
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
      case 'pending':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
      case 'resolved':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-500'
      case 'medium':
        return 'bg-yellow-500'
      case 'low':
        return 'bg-blue-500'
      default:
        return 'bg-gray-500'
    }
  }

  const getUserTypeBadge = (userType: string) => {
    const badges = {
      'Premium Seller': { color: 'from-green-500 to-emerald-600', icon: Crown },
      'Premium Buyer': { color: 'from-blue-500 to-indigo-600', icon: Crown },
      'Basic User': { color: 'from-gray-500 to-gray-600', icon: User }
    }
    const badge = badges[userType as keyof typeof badges] || badges['Basic User']
    return { ...badge }
  }

  const handleSendMessage = () => {
    if (!message.trim()) return
    toast.success('Message sent successfully')
    setMessage('')
  }

  const handleResolveChat = () => {
    toast.success('Chat marked as resolved')
  }

  const filteredChats = chats.filter((chat) =>
    filter === 'all' ? true : chat.status === filter
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-purple-400/20 to-pink-600/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-20 right-0 w-80 h-80 bg-gradient-to-bl from-blue-400/20 to-indigo-600/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 bg-gradient-to-r from-slate-900 via-purple-900 to-indigo-900 text-white">
          <div className="max-w-7xl mx-auto px-6 py-12">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500 via-pink-500 to-indigo-600 rounded-3xl flex items-center justify-center shadow-2xl border-2 border-white/20">
                  <MessageSquare className="text-white" size={36} />
                </div>
                <div>
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-green-300 font-semibold text-sm">Support System Active</span>
                  </div>
                  <h1 className="text-4xl lg:text-6xl font-black leading-tight bg-gradient-to-r from-white via-purple-100 to-pink-100 bg-clip-text text-transparent pb-2">
                    Customer Support
                  </h1>
                  <p className="text-xl text-purple-100 leading-relaxed">
                    Advanced AI-powered customer support and ticket management
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
              title: 'Active Chats', 
              value: stats.activeChats, 
              icon: MessageSquare, 
              gradient: 'from-purple-500 via-pink-600 to-rose-700', 
              change: '+8 new today',
              trend: 'up',
              description: 'Live conversations'
            },
            { 
              title: 'Resolved Today', 
              value: stats.resolvedToday, 
              icon: CheckCircle, 
              gradient: 'from-green-500 via-emerald-600 to-teal-700', 
              change: '+15 from yesterday',
              trend: 'up',
              description: 'Successfully closed'
            },
            { 
              title: 'Avg Response', 
              value: stats.avgResponseTime, 
              icon: Clock, 
              gradient: 'from-blue-500 via-indigo-600 to-purple-700', 
              change: '30s faster',
              trend: 'up',
              description: 'Response time'
            },
            { 
              title: 'Satisfaction', 
              value: stats.satisfaction, 
              icon: Star, 
              gradient: 'from-yellow-500 via-orange-600 to-red-700', 
              change: '+0.2 this week',
              trend: 'up',
              description: 'Customer rating'
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

        {/* Chat Interface */}
        <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden h-[800px] flex">
          {/* Chat List Sidebar */}
          <div className="w-96 border-r border-gray-200/50 dark:border-gray-700/50 flex flex-col">
            {/* Search & Filter Header */}
            <div className="p-6 border-b border-gray-200/50 dark:border-gray-700/50 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
                  <Search className="text-white" size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">Support Tickets</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Manage conversations</p>
                </div>
              </div>
              
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Search conversations..."
                  className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl focus:ring-2 focus:ring-purple-500 text-sm"
                />
              </div>
              
              <div className="flex items-center space-x-2 overflow-x-auto">
                {[
                  { key: 'all', label: 'All', count: chats.length },
                  { key: 'active', label: 'Active', count: chats.filter(c => c.status === 'active').length },
                  { key: 'pending', label: 'Pending', count: chats.filter(c => c.status === 'pending').length },
                  { key: 'resolved', label: 'Resolved', count: chats.filter(c => c.status === 'resolved').length }
                ].map((status) => (
                  <button
                    key={status.key}
                    onClick={() => setFilter(status.key)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                      filter === status.key
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {status.label} ({status.count})
                  </button>
                ))}
              </div>
            </div>

            {/* Chat List */}
            <div className="flex-1 overflow-y-auto">
              {filteredChats.map((chat) => (
                <div
                  key={chat.id}
                  onClick={() => setSelectedChat(chat)}
                  className={`p-6 border-b border-gray-200/50 dark:border-gray-700/50 cursor-pointer transition-all hover:bg-gray-50 dark:hover:bg-gray-800/50 ${
                    selectedChat?.id === chat.id
                      ? 'bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-l-4 border-l-purple-500'
                      : ''
                  }`}
                >
                  <div className="flex items-start space-x-4">
                    <div className="relative">
                      <div className={`w-14 h-14 bg-gradient-to-br ${getUserTypeBadge(chat.userType).color} rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg`}>
                        {chat.avatar}
                      </div>
                      {chat.unread > 0 && (
                        <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg">
                          {chat.unread}
                        </div>
                      )}
                      <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full ${getPriorityColor(chat.priority)}`}></div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <p className="font-bold text-gray-900 dark:text-white truncate">
                            {chat.userName}
                          </p>
                          <div className="flex items-center space-x-1">
                            {getUserTypeBadge(chat.userType).icon === Crown && (
                              <Crown size={14} className="text-yellow-500" />
                            )}
                          </div>
                        </div>
                        <span className="text-xs text-gray-500">{chat.timestamp}</span>
                      </div>
                      
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-xs text-gray-600 dark:text-gray-400">{chat.userType}</span>
                        <span className="text-xs text-gray-400">•</span>
                        <span className="text-xs text-gray-600 dark:text-gray-400">{chat.location}</span>
                      </div>
                      
                      <p className="text-sm text-gray-600 dark:text-gray-400 truncate mb-3">
                        {chat.lastMessage}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(chat.status)}`}>
                          {chat.status}
                        </span>
                        <span className="text-xs text-gray-500 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
                          {chat.category}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 flex flex-col">
            {selectedChat ? (
              <>
                {/* Chat Header */}
                <div className="p-6 border-b border-gray-200/50 dark:border-gray-700/50 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`w-16 h-16 bg-gradient-to-br ${getUserTypeBadge(selectedChat.userType).color} rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg`}>
                        {selectedChat.avatar}
                      </div>
                      <div>
                        <div className="flex items-center space-x-2 mb-1">
                          <p className="text-xl font-bold text-gray-900 dark:text-white">
                            {selectedChat.userName}
                          </p>
                          {getUserTypeBadge(selectedChat.userType).icon === Crown && (
                            <Crown size={18} className="text-yellow-500" />
                          )}
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(selectedChat.status)}`}>
                            {selectedChat.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                          {selectedChat.userId} • {selectedChat.userType}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {selectedChat.location} • {selectedChat.category}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <button className="p-3 hover:bg-white/50 dark:hover:bg-gray-800/50 rounded-xl transition-all">
                        <Phone size={20} className="text-gray-600 dark:text-gray-400" />
                      </button>
                      <button className="p-3 hover:bg-white/50 dark:hover:bg-gray-800/50 rounded-xl transition-all">
                        <Video size={20} className="text-gray-600 dark:text-gray-400" />
                      </button>
                      <button
                        onClick={handleResolveChat}
                        className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl font-bold transition-all shadow-lg hover:shadow-xl"
                      >
                        Resolve
                      </button>
                      <button className="p-3 hover:bg-white/50 dark:hover:bg-gray-800/50 rounded-xl transition-all">
                        <MoreVertical size={20} className="text-gray-600 dark:text-gray-400" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gradient-to-br from-gray-50/50 to-white dark:from-gray-900/50 dark:to-gray-800">
                  {selectedChat.messages.map((msg: any) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.sender === 'agent' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-md ${
                        msg.sender === 'agent'
                          ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                          : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700'
                      } rounded-2xl px-6 py-4 shadow-lg`}>
                        <p className="text-sm leading-relaxed">{msg.text}</p>
                        <p className={`text-xs mt-2 ${
                          msg.sender === 'agent'
                            ? 'text-purple-100'
                            : 'text-gray-500 dark:text-gray-400'
                        }`}>
                          {msg.timestamp}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Message Input */}
                <div className="p-6 border-t border-gray-200/50 dark:border-gray-700/50 bg-white/50 dark:bg-gray-800/50">
                  <div className="flex items-center space-x-3">
                    <button className="p-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-all">
                      <Paperclip size={20} className="text-gray-600 dark:text-gray-400" />
                    </button>
                    <button className="p-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-all">
                      <ImageIcon size={20} className="text-gray-600 dark:text-gray-400" />
                    </button>
                    <button className="p-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-all">
                      <Smile size={20} className="text-gray-600 dark:text-gray-400" />
                    </button>
                    <input
                      type="text"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder="Type your message..."
                      className="flex-1 px-6 py-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl focus:ring-2 focus:ring-purple-500 text-lg"
                    />
                    <button
                      onClick={handleSendMessage}
                      className="p-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-2xl transition-all shadow-lg hover:shadow-xl"
                    >
                      <Send size={20} />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <MessageSquare size={48} className="text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    Select a Conversation
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-lg">
                    Choose a support ticket from the list to start helping customers
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
