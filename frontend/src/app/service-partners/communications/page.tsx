'use client'

import { useState, useEffect, useRef } from 'react'
import {
  MessageSquare,
  Send,
  Search,
  Filter,
  Phone,
  Video,
  Paperclip,
  MoreVertical,
  Star,
  Archive,
  Trash2,
  Bell,
  BellOff,
  Users,
  User,
  Shield,
  Clock,
  CheckCircle,
  AlertCircle,
  Info,
  FileText,
  Image,
  Download,
  Eye,
  Plus,
  X,
  Smile,
  Calendar,
  Tag,
  Pin,
  Reply,
  Forward,
  Edit,
  Copy,
  Flag,
  Lock,
  Unlock
} from 'lucide-react'
import toast from 'react-hot-toast'

interface Message {
  id: string
  conversationId: string
  senderId: string
  senderName: string
  senderRole: 'legal-partner' | 'admin' | 'compliance' | 'client' | 'system'
  content: string
  timestamp: string
  type: 'text' | 'file' | 'image' | 'system' | 'case-update'
  status: 'sent' | 'delivered' | 'read'
  attachments?: Attachment[]
  replyTo?: string
  isStarred: boolean
  isImportant: boolean
  caseId?: string
  isEncrypted: boolean
}

interface Conversation {
  id: string
  title: string
  participants: Participant[]
  lastMessage: Message
  unreadCount: number
  isPinned: boolean
  isArchived: boolean
  isMuted: boolean
  caseId?: string
  type: 'direct' | 'group' | 'case-discussion' | 'support'
  priority: 'low' | 'normal' | 'high' | 'urgent'
  isEncrypted: boolean
  createdAt: string
  updatedAt: string
}

interface Participant {
  id: string
  name: string
  role: string
  avatar?: string
  isOnline: boolean
  lastSeen?: string
}

interface Attachment {
  id: string
  name: string
  type: string
  size: number
  url: string
}

import { backendApi } from '@/lib/backendApi'

export default function CommunicationsPage() {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilter, setActiveFilter] = useState('all')
  const [isLoading, setIsLoading] = useState(true)
  const [showNewChatModal, setShowNewChatModal] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    async function fetchConversations() {
      try {
        setIsLoading(true)
        const response = await backendApi.chat.getConversations()
        if (response?.success) {
          const mappedConversations: Conversation[] = (response.data?.conversations || []).map((conv: any) => ({
            id: conv.id,
            title: conv.title || 'Chat',
            participants: conv.participants || [],
            lastMessage: conv.lastMessage || { content: 'No messages yet' },
            unreadCount: conv.unreadCount || 0,
            isPinned: false,
            isArchived: false,
            isMuted: false,
            type: conv.type || 'direct',
            priority: 'normal',
            isEncrypted: false,
            createdAt: conv.createdAt,
            updatedAt: conv.updatedAt
          }))
          setConversations(mappedConversations)
          if (mappedConversations.length > 0) {
            setSelectedConversation(mappedConversations[0])
          }
        }
      } catch (error) {
        console.error('Error fetching conversations:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchConversations()
  }, [])

  useEffect(() => {
    if (!selectedConversation) return

    async function fetchMessages() {
      try {
        const response = await backendApi.chat.getMessages(selectedConversation!.id)
        if (response?.success) {
          const mappedMessages: Message[] = (response.data?.messages || []).map((msg: any) => ({
            id: msg.id,
            conversationId: selectedConversation!.id,
            senderId: msg.senderId,
            senderName: msg.sender?.name || 'User',
            senderRole: (msg.sender?.role?.toLowerCase() as any) || 'client',
            content: msg.content,
            timestamp: msg.createdAt,
            type: 'text',
            status: 'read',
            isStarred: false,
            isImportant: false,
            isEncrypted: false
          }))
          setMessages(mappedMessages)
        }
      } catch (error) {
        console.error('Error fetching messages:', error)
      }
    }
    fetchMessages()

    // Poll for new messages every 5 seconds (simplistic real-time fallback)
    const interval = setInterval(fetchMessages, 5000)
    return () => clearInterval(interval)
  }, [selectedConversation])

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return

    try {
      const response = await backendApi.chat.sendMessage(selectedConversation.id, newMessage)
      if (response?.success) {
        setNewMessage('')
        // fetchMessages will trigger via polling or we can manually append
        setMessages(prev => [...prev, {
          id: response.data.message.id,
          conversationId: selectedConversation.id,
          senderId: 'me', // Generic
          senderName: 'Me',
          senderRole: 'legal-partner',
          content: newMessage,
          timestamp: new Date().toISOString(),
          type: 'text',
          status: 'sent',
          isStarred: false,
          isImportant: false,
          isEncrypted: false
        }])
      }
    } catch (error) {
      toast.error('Failed to send message')
    }
  }

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const filteredConversations = conversations.filter(conv => {
    if (activeFilter === 'unread' && conv.unreadCount === 0) return false
    if (activeFilter === 'pinned' && !conv.isPinned) return false
    if (activeFilter === 'archived' && !conv.isArchived) return false
    if (activeFilter === 'case-discussions' && conv.type !== 'case-discussion') return false

    if (searchQuery) {
      return conv.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        conv.participants.some(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
    }

    return true
  })

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'text-blue-600 dark:text-blue-400'
      case 'legal-partner': return 'text-green-600 dark:text-green-400'
      case 'compliance': return 'text-purple-600 dark:text-purple-400'
      case 'client': return 'text-orange-600 dark:text-orange-400'
      case 'support': return 'text-gray-600 dark:text-gray-400'
      default: return 'text-gray-600 dark:text-gray-400'
    }
  }

  const getMessageTypeIcon = (type: string) => {
    switch (type) {
      case 'case-update': return <AlertCircle size={16} className="text-blue-500" />
      case 'system': return <Info size={16} className="text-gray-500" />
      case 'file': return <FileText size={16} className="text-green-500" />
      case 'image': return <Image size={16} className="text-purple-500" />
      default: return null
    }
  }

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)

    if (diffInHours < 24) {
      return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading communications...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-[calc(100vh-12rem)] flex flex-col space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Communications</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Secure messaging with case teams and compliance
          </p>
        </div>
        <button
          onClick={() => setShowNewChatModal(true)}
          className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl hover:shadow-lg transition-all duration-300"
        >
          <Plus size={20} />
          <span>New Chat</span>
        </button>
      </div>

      {/* Main Chat Interface */}
      <div className="flex-1 bg-white dark:bg-gray-950 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
        <div className="flex h-full">
          {/* Conversations Sidebar */}
          <div className="w-80 border-r border-gray-200 dark:border-gray-800 flex flex-col">
            {/* Search and Filters */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-800">
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search conversations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>

              <div className="flex flex-wrap gap-2">
                {[
                  { id: 'all', label: 'All', count: conversations.length },
                  { id: 'unread', label: 'Unread', count: conversations.filter(c => c.unreadCount > 0).length },
                  { id: 'pinned', label: 'Pinned', count: conversations.filter(c => c.isPinned).length },
                  { id: 'case-discussions', label: 'Cases', count: conversations.filter(c => c.type === 'case-discussion').length }
                ].map(filter => (
                  <button
                    key={filter.id}
                    onClick={() => setActiveFilter(filter.id)}
                    className={`
                      flex items-center space-x-1 px-3 py-1 rounded-lg text-sm font-medium transition-all
                      ${activeFilter === filter.id
                        ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                      }
                    `}
                  >
                    <span>{filter.label}</span>
                    {filter.count > 0 && (
                      <span className="px-1.5 py-0.5 bg-gray-200 dark:bg-gray-700 rounded text-xs">
                        {filter.count}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Conversations List */}
            <div className="flex-1 overflow-y-auto">
              {filteredConversations.length === 0 ? (
                <div className="p-8 text-center">
                  <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600 dark:text-gray-400">No conversations found</p>
                </div>
              ) : (
                <div className="space-y-1 p-2">
                  {filteredConversations.map(conversation => (
                    <button
                      key={conversation.id}
                      onClick={() => setSelectedConversation(conversation)}
                      className={`
                        w-full p-3 rounded-xl text-left transition-all hover:bg-gray-50 dark:hover:bg-gray-900
                        ${selectedConversation?.id === conversation.id
                          ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800'
                          : ''
                        }
                      `}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center space-x-2 flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 dark:text-white truncate text-sm">
                            {conversation.title}
                          </h3>
                          {conversation.isPinned && (
                            <Pin size={14} className="text-blue-500 flex-shrink-0" />
                          )}
                          {conversation.isEncrypted && (
                            <Lock size={14} className="text-green-500 flex-shrink-0" />
                          )}
                        </div>
                        <div className="flex items-center space-x-1 flex-shrink-0">
                          {conversation.unreadCount > 0 && (
                            <span className="px-2 py-1 bg-blue-500 text-white rounded-full text-xs font-bold">
                              {conversation.unreadCount}
                            </span>
                          )}
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {formatTime(conversation.updatedAt)}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 mb-2">
                        {getMessageTypeIcon(conversation.lastMessage.type)}
                        <p className="text-sm text-gray-600 dark:text-gray-400 truncate flex-1">
                          {conversation.lastMessage.content}
                        </p>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className={`text-xs font-medium ${getRoleColor(conversation.lastMessage.senderRole)}`}>
                            {conversation.lastMessage.senderName}
                          </span>
                          {conversation.caseId && (
                            <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded text-xs">
                              {conversation.caseId}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center space-x-1">
                          {conversation.priority === 'urgent' && (
                            <Flag size={12} className="text-red-500" />
                          )}
                          {conversation.isMuted && (
                            <BellOff size={12} className="text-gray-400" />
                          )}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 flex flex-col">
            {selectedConversation ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b border-gray-200 dark:border-gray-800">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div>
                        <h2 className="font-semibold text-gray-900 dark:text-white">
                          {selectedConversation.title}
                        </h2>
                        <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                          <Users size={14} />
                          <span>{selectedConversation.participants.length} participants</span>
                          {selectedConversation.caseId && (
                            <>
                              <span>•</span>
                              <span>Case: {selectedConversation.caseId}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all">
                        <Phone size={20} />
                      </button>
                      <button className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all">
                        <Video size={20} />
                      </button>
                      <button className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all">
                        <MoreVertical size={20} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages
                    .filter(msg => msg.conversationId === selectedConversation.id)
                    .map(message => (
                      <div key={message.id} className={`
                        flex ${message.senderRole === 'legal-partner' ? 'justify-end' : 'justify-start'}
                      `}>
                        <div className={`
                          max-w-xs lg:max-w-md px-4 py-3 rounded-2xl
                          ${message.senderRole === 'legal-partner'
                            ? 'bg-blue-600 text-white'
                            : message.type === 'system' || message.type === 'case-update'
                              ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700'
                              : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white'
                          }
                        `}>
                          {message.senderRole !== 'legal-partner' && (
                            <div className="flex items-center space-x-2 mb-2">
                              <span className={`text-xs font-medium ${getRoleColor(message.senderRole)}`}>
                                {message.senderName}
                              </span>
                              {message.isEncrypted && (
                                <Lock size={12} className="text-green-500" />
                              )}
                              {message.isImportant && (
                                <Flag size={12} className="text-red-500" />
                              )}
                            </div>
                          )}

                          <div className="flex items-start space-x-2">
                            {getMessageTypeIcon(message.type)}
                            <p className="text-sm">{message.content}</p>
                          </div>

                          {message.attachments && message.attachments.length > 0 && (
                            <div className="mt-2 space-y-2">
                              {message.attachments.map(attachment => (
                                <div key={attachment.id} className="flex items-center space-x-2 p-2 bg-white/10 rounded-lg">
                                  <FileText size={16} />
                                  <span className="text-sm flex-1">{attachment.name}</span>
                                  <button className="p-1 hover:bg-white/20 rounded">
                                    <Download size={14} />
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}

                          <div className="flex items-center justify-between mt-2">
                            <span className={`text-xs ${message.senderRole === 'legal-partner' ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'
                              }`}>
                              {formatTime(message.timestamp)}
                            </span>
                            {message.senderRole === 'legal-partner' && (
                              <div className="flex items-center space-x-1">
                                {message.status === 'sent' && <Clock size={12} className="text-blue-200" />}
                                {message.status === 'delivered' && <CheckCircle size={12} className="text-blue-200" />}
                                {message.status === 'read' && <CheckCircle size={12} className="text-green-300" />}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input */}
                <div className="p-4 border-t border-gray-200 dark:border-gray-800">
                  <div className="flex items-end space-x-3">
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="p-3 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all"
                    >
                      <Paperclip size={20} />
                    </button>
                    <div className="flex-1 relative">
                      <textarea
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault()
                            sendMessage()
                          }
                        }}
                        placeholder="Type your message..."
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                        rows={1}
                      />
                    </div>
                    <button
                      onClick={sendMessage}
                      disabled={!newMessage.trim()}
                      className="p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      <Send size={20} />
                    </button>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files?.length) {
                        toast.success(`${e.target.files.length} file(s) attached`)
                      }
                    }}
                  />
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    Select a conversation
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Choose a conversation from the sidebar to start messaging
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* New Chat Modal */}
      {showNewChatModal && (
        <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-950 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 max-w-md w-full">
            <div className="p-6 border-b border-gray-200 dark:border-gray-800">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">New Chat</h2>
                <button
                  onClick={() => setShowNewChatModal(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div className="space-y-3">
                <button className="w-full flex items-center space-x-3 p-4 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/40 rounded-xl transition-all">
                  <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  <div className="text-left">
                    <h3 className="font-semibold text-gray-900 dark:text-white">Case Discussion</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Start a case-related conversation</p>
                  </div>
                </button>

                <button className="w-full flex items-center space-x-3 p-4 bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/40 rounded-xl transition-all">
                  <Shield className="w-6 h-6 text-green-600 dark:text-green-400" />
                  <div className="text-left">
                    <h3 className="font-semibold text-gray-900 dark:text-white">Compliance Query</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Contact compliance team</p>
                  </div>
                </button>

                <button className="w-full flex items-center space-x-3 p-4 bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/40 rounded-xl transition-all">
                  <MessageSquare className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  <div className="text-left">
                    <h3 className="font-semibold text-gray-900 dark:text-white">Support Ticket</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Get technical support</p>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}