'use client'

import { useState, useEffect, useRef } from 'react'
import { 
  MessageSquare, 
  Send, 
  Search, 
  Phone, 
  Video, 
  MoreVertical, 
  Paperclip, 
  Image, 
  Smile, 
  Check, 
  CheckCheck,
  Clock,
  User,
  Users,
  Bell,
  BellOff,
  Archive,
  Star,
  Filter,
  Plus,
  Camera,
  Mic,
  MapPin,
  Calendar,
  FileText
} from 'lucide-react'
import toast from 'react-hot-toast'

interface Message {
  id: string
  senderId: string
  senderName: string
  senderRole: 'admin' | 'client' | 'ground-partner' | 'support'
  content: string
  type: 'text' | 'image' | 'file' | 'location' | 'system'
  timestamp: string
  status: 'sent' | 'delivered' | 'read'
  attachments?: {
    type: 'image' | 'file' | 'location'
    url: string
    name: string
  }[]
}

interface Conversation {
  id: string
  participantId: string
  participantName: string
  participantRole: 'admin' | 'client' | 'support'
  participantAvatar?: string
  lastMessage: string
  lastMessageTime: string
  unreadCount: number
  isOnline: boolean
  isPinned: boolean
  isMuted: boolean
  conversationType: 'direct' | 'group' | 'support'
  propertyId?: string
  propertyTitle?: string
}

export default function MessagesPage() {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null)
  const [newMessage, setNewMessage] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [filteredConversations, setFilteredConversations] = useState<Conversation[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Mock data
  useEffect(() => {
    const mockConversations: Conversation[] = [
      {
        id: 'C001',
        participantId: 'admin1',
        participantName: 'GharBazaar Admin',
        participantRole: 'admin',
        lastMessage: 'New property verification task assigned to you',
        lastMessageTime: '2024-12-31T10:30:00Z',
        unreadCount: 2,
        isOnline: true,
        isPinned: true,
        isMuted: false,
        conversationType: 'direct'
      },
      {
        id: 'C002',
        participantId: 'client1',
        participantName: 'Priya Sharma',
        participantRole: 'client',
        lastMessage: 'Thank you for the detailed site visit report!',
        lastMessageTime: '2024-12-30T16:45:00Z',
        unreadCount: 0,
        isOnline: false,
        isPinned: false,
        isMuted: false,
        conversationType: 'direct',
        propertyId: 'P001',
        propertyTitle: '3BHK Apartment in Bandra West'
      },
      {
        id: 'C003',
        participantId: 'support1',
        participantName: 'Support Team',
        participantRole: 'support',
        lastMessage: 'Your payment has been processed successfully',
        lastMessageTime: '2024-12-30T14:20:00Z',
        unreadCount: 1,
        isOnline: true,
        isPinned: false,
        isMuted: false,
        conversationType: 'support'
      },
      {
        id: 'C004',
        participantId: 'client2',
        participantName: 'Rahul Gupta',
        participantRole: 'client',
        lastMessage: 'Can you visit the property tomorrow at 2 PM?',
        lastMessageTime: '2024-12-29T18:30:00Z',
        unreadCount: 0,
        isOnline: true,
        isPinned: false,
        isMuted: false,
        conversationType: 'direct',
        propertyId: 'P002',
        propertyTitle: '2BHK Villa in Andheri East'
      }
    ]

    const mockMessages: Message[] = [
      {
        id: 'M001',
        senderId: 'admin1',
        senderName: 'GharBazaar Admin',
        senderRole: 'admin',
        content: 'Hello! We have a new property verification task for you.',
        type: 'text',
        timestamp: '2024-12-31T10:25:00Z',
        status: 'read'
      },
      {
        id: 'M002',
        senderId: 'ground-partner1',
        senderName: 'You',
        senderRole: 'ground-partner',
        content: 'Sure, I can handle that. What are the details?',
        type: 'text',
        timestamp: '2024-12-31T10:26:00Z',
        status: 'delivered'
      },
      {
        id: 'M003',
        senderId: 'admin1',
        senderName: 'GharBazaar Admin',
        senderRole: 'admin',
        content: 'New property verification task assigned to you',
        type: 'text',
        timestamp: '2024-12-31T10:30:00Z',
        status: 'sent'
      }
    ]

    setTimeout(() => {
      setConversations(mockConversations)
      setFilteredConversations(mockConversations)
      setMessages(mockMessages)
      setSelectedConversation(mockConversations[0])
      setIsLoading(false)
    }, 1000)
  }, [])

  // Filter conversations based on search
  useEffect(() => {
    if (searchQuery) {
      const filtered = conversations.filter(conv => 
        conv.participantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        conv.lastMessage.toLowerCase().includes(searchQuery.toLowerCase()) ||
        conv.propertyTitle?.toLowerCase().includes(searchQuery.toLowerCase())
      )
      setFilteredConversations(filtered)
    } else {
      setFilteredConversations(conversations)
    }
  }, [conversations, searchQuery])

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return

    const message: Message = {
      id: `M${Date.now()}`,
      senderId: 'ground-partner1',
      senderName: 'You',
      senderRole: 'ground-partner',
      content: newMessage,
      type: 'text',
      timestamp: new Date().toISOString(),
      status: 'sent'
    }

    setMessages(prev => [...prev, message])
    setNewMessage('')

    // Update conversation last message
    setConversations(prev => prev.map(conv => 
      conv.id === selectedConversation.id 
        ? { ...conv, lastMessage: newMessage, lastMessageTime: new Date().toISOString() }
        : conv
    ))

    toast.success('Message sent!')
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)

    if (diffInHours < 24) {
      return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    } else if (diffInHours < 48) {
      return 'Yesterday'
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'text-red-600 dark:text-red-400'
      case 'client': return 'text-blue-600 dark:text-blue-400'
      case 'support': return 'text-green-600 dark:text-green-400'
      default: return 'text-gray-600 dark:text-gray-400'
    }
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return <Star size={12} />
      case 'support': return <Users size={12} />
      default: return <User size={12} />
    }
  }

  const markAsRead = (conversationId: string) => {
    setConversations(prev => prev.map(conv => 
      conv.id === conversationId 
        ? { ...conv, unreadCount: 0 }
        : conv
    ))
  }

  const togglePin = (conversationId: string) => {
    setConversations(prev => prev.map(conv => 
      conv.id === conversationId 
        ? { ...conv, isPinned: !conv.isPinned }
        : conv
    ))
  }

  const toggleMute = (conversationId: string) => {
    setConversations(prev => prev.map(conv => 
      conv.id === conversationId 
        ? { ...conv, isMuted: !conv.isMuted }
        : conv
    ))
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading messages...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-[calc(100vh-12rem)] flex bg-white dark:bg-gray-950 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
      {/* Conversations Sidebar */}
      <div className="w-full md:w-1/3 lg:w-1/4 border-r border-gray-200 dark:border-gray-800 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Messages</h2>
            <button className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all">
              <Plus size={20} />
            </button>
          </div>
          
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
            />
          </div>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto">
          {filteredConversations.length === 0 ? (
            <div className="p-8 text-center">
              <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400">No conversations found</p>
            </div>
          ) : (
            <div className="space-y-1 p-2">
              {filteredConversations
                .sort((a, b) => {
                  // Sort by pinned first, then by last message time
                  if (a.isPinned && !b.isPinned) return -1
                  if (!a.isPinned && b.isPinned) return 1
                  return new Date(b.lastMessageTime).getTime() - new Date(a.lastMessageTime).getTime()
                })
                .map(conversation => (
                  <div
                    key={conversation.id}
                    onClick={() => {
                      setSelectedConversation(conversation)
                      markAsRead(conversation.id)
                    }}
                    className={`
                      p-3 rounded-xl cursor-pointer transition-all hover:bg-gray-50 dark:hover:bg-gray-800
                      ${selectedConversation?.id === conversation.id 
                        ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800' 
                        : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                      }
                    `}
                  >
                    <div className="flex items-start space-x-3">
                      {/* Avatar */}
                      <div className="relative">
                        <div className={`
                          w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-white
                          ${conversation.participantRole === 'admin' ? 'bg-red-500' :
                            conversation.participantRole === 'client' ? 'bg-blue-500' :
                            conversation.participantRole === 'support' ? 'bg-green-500' :
                            'bg-gray-500'
                          }
                        `}>
                          {conversation.participantName.charAt(0).toUpperCase()}
                        </div>
                        {conversation.isOnline && (
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-gray-950"></div>
                        )}
                        {conversation.isPinned && (
                          <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-500 rounded-full flex items-center justify-center">
                            <Star size={10} className="text-white fill-current" />
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center space-x-2">
                            <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                              {conversation.participantName}
                            </h3>
                            <div className={`flex items-center space-x-1 ${getRoleColor(conversation.participantRole)}`}>
                              {getRoleIcon(conversation.participantRole)}
                            </div>
                            {conversation.isMuted && (
                              <BellOff size={12} className="text-gray-400" />
                            )}
                          </div>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {formatTime(conversation.lastMessageTime)}
                          </span>
                        </div>

                        {conversation.propertyTitle && (
                          <p className="text-xs text-blue-600 dark:text-blue-400 mb-1 truncate">
                            📍 {conversation.propertyTitle}
                          </p>
                        )}

                        <div className="flex items-center justify-between">
                          <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                            {conversation.lastMessage}
                          </p>
                          {conversation.unreadCount > 0 && (
                            <span className="ml-2 px-2 py-1 bg-blue-500 text-white text-xs rounded-full min-w-[20px] text-center">
                              {conversation.unreadCount}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
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
            <div className="p-4 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className={`
                      w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-white
                      ${selectedConversation.participantRole === 'admin' ? 'bg-red-500' :
                        selectedConversation.participantRole === 'client' ? 'bg-blue-500' :
                        selectedConversation.participantRole === 'support' ? 'bg-green-500' :
                        'bg-gray-500'
                      }
                    `}>
                      {selectedConversation.participantName.charAt(0).toUpperCase()}
                    </div>
                    {selectedConversation.isOnline && (
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-900"></div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {selectedConversation.participantName}
                    </h3>
                    <div className="flex items-center space-x-2">
                      <span className={`text-xs ${getRoleColor(selectedConversation.participantRole)} capitalize`}>
                        {selectedConversation.participantRole}
                      </span>
                      {selectedConversation.isOnline && (
                        <span className="text-xs text-green-600 dark:text-green-400">• Online</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all">
                    <Phone size={20} />
                  </button>
                  <button className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all">
                    <Video size={20} />
                  </button>
                  <div className="relative">
                    <button className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all">
                      <MoreVertical size={20} />
                    </button>
                  </div>
                </div>
              </div>

              {selectedConversation.propertyTitle && (
                <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                  <div className="flex items-center space-x-2">
                    <MapPin size={16} className="text-blue-600 dark:text-blue-400" />
                    <span className="text-sm font-medium text-blue-900 dark:text-blue-100">
                      {selectedConversation.propertyTitle}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map(message => (
                <div
                  key={message.id}
                  className={`flex ${message.senderRole === 'ground-partner' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`
                    max-w-xs lg:max-w-md px-4 py-2 rounded-2xl
                    ${message.senderRole === 'ground-partner'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white'
                    }
                  `}>
                    {message.senderRole !== 'ground-partner' && (
                      <div className="flex items-center space-x-2 mb-1">
                        <span className={`text-xs font-medium ${getRoleColor(message.senderRole)}`}>
                          {message.senderName}
                        </span>
                        {getRoleIcon(message.senderRole)}
                      </div>
                    )}
                    <p className="text-sm">{message.content}</p>
                    <div className={`
                      flex items-center justify-end space-x-1 mt-1
                      ${message.senderRole === 'ground-partner' ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'}
                    `}>
                      <span className="text-xs">{formatTime(message.timestamp)}</span>
                      {message.senderRole === 'ground-partner' && (
                        <div>
                          {message.status === 'sent' && <Check size={12} />}
                          {message.status === 'delivered' && <CheckCheck size={12} />}
                          {message.status === 'read' && <CheckCheck size={12} className="text-blue-200" />}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
              <div className="flex items-end space-x-3">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all"
                    >
                      <Paperclip size={20} />
                    </button>
                    <button className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all">
                      <Camera size={20} />
                    </button>
                    <button className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all">
                      <MapPin size={20} />
                    </button>
                  </div>
                  
                  <div className="relative">
                    <textarea
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Type a message..."
                      className="w-full px-4 py-3 pr-12 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                      rows={1}
                    />
                    <button
                      onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg transition-all"
                    >
                      <Smile size={20} />
                    </button>
                  </div>
                </div>

                <button
                  onClick={sendMessage}
                  disabled={!newMessage.trim()}
                  className="p-3 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 dark:disabled:bg-gray-700 text-white rounded-xl transition-all disabled:cursor-not-allowed"
                >
                  <Send size={20} />
                </button>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files?.[0]) {
                    toast.success('File attached!')
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
  )
}