'use client'

import { useState, useEffect } from 'react'
import { 
  Bell, 
  BellOff, 
  Check, 
  X, 
  Eye, 
  EyeOff, 
  Filter, 
  Search, 
  Calendar, 
  Clock, 
  User, 
  FileText, 
  DollarSign, 
  AlertTriangle, 
  CheckCircle, 
  Info, 
  MessageSquare, 
  Briefcase, 
  Settings, 
  Trash2, 
  Archive, 
  Star, 
  Flag,
  MoreVertical,
  RefreshCw,
  Volume2,
  VolumeX,
  Smartphone,
  Mail,
  Monitor
} from 'lucide-react'
import toast from 'react-hot-toast'

interface Notification {
  id: string
  type: 'case-assigned' | 'document-uploaded' | 'payment-processed' | 'system-update' | 'message-received' | 'deadline-reminder' | 'compliance-alert'
  title: string
  message: string
  timestamp: string
  read: boolean
  priority: 'low' | 'medium' | 'high' | 'urgent'
  category: 'cases' | 'payments' | 'documents' | 'messages' | 'system' | 'compliance'
  actionUrl?: string
  metadata?: {
    caseId?: string
    amount?: number
    clientName?: string
    dueDate?: string
  }
}

interface NotificationSettings {
  emailNotifications: boolean
  pushNotifications: boolean
  smsNotifications: boolean
  desktopNotifications: boolean
  categories: {
    cases: boolean
    payments: boolean
    documents: boolean
    messages: boolean
    system: boolean
    compliance: boolean
  }
  quietHours: {
    enabled: boolean
    startTime: string
    endTime: string
  }
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [filteredNotifications, setFilteredNotifications] = useState<Notification[]>([])
  const [settings, setSettings] = useState<NotificationSettings | null>(null)
  const [activeTab, setActiveTab] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedNotifications, setSelectedNotifications] = useState<string[]>([])
  const [showSettings, setShowSettings] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Mock data
  useEffect(() => {
    const mockNotifications: Notification[] = [
      {
        id: 'N001',
        type: 'case-assigned',
        title: 'New Case Assigned',
        message: 'Property verification case for Bandra apartment has been assigned to you.',
        timestamp: '2024-12-31T10:00:00Z',
        read: false,
        priority: 'high',
        category: 'cases',
        actionUrl: '/legal-partner/cases/LC001',
        metadata: {
          caseId: 'LC001',
          clientName: 'Mr. Arjun Mehta'
        }
      },
      {
        id: 'N002',
        type: 'document-uploaded',
        title: 'Documents Updated',
        message: 'Additional documents have been uploaded for case LC002.',
        timestamp: '2024-12-31T09:30:00Z',
        read: false,
        priority: 'medium',
        category: 'documents',
        actionUrl: '/legal-partner/documents',
        metadata: {
          caseId: 'LC002'
        }
      },
      {
        id: 'N003',
        type: 'payment-processed',
        title: 'Payment Received',
        message: 'Payment of ₹25,000 for case LC001 has been processed successfully.',
        timestamp: '2024-12-31T08:15:00Z',
        read: true,
        priority: 'low',
        category: 'payments',
        actionUrl: '/legal-partner/earnings',
        metadata: {
          amount: 25000,
          caseId: 'LC001'
        }
      },
      {
        id: 'N004',
        type: 'deadline-reminder',
        title: 'Deadline Approaching',
        message: 'Legal opinion for case LC003 is due in 2 days.',
        timestamp: '2024-12-31T07:45:00Z',
        read: false,
        priority: 'urgent',
        category: 'cases',
        actionUrl: '/legal-partner/cases/LC003',
        metadata: {
          caseId: 'LC003',
          dueDate: '2025-01-02T00:00:00Z'
        }
      },
      {
        id: 'N005',
        type: 'message-received',
        title: 'New Message',
        message: 'You have received a new message from the compliance team.',
        timestamp: '2024-12-30T16:20:00Z',
        read: true,
        priority: 'medium',
        category: 'messages',
        actionUrl: '/legal-partner/communications'
      },
      {
        id: 'N006',
        type: 'system-update',
        title: 'System Maintenance',
        message: 'Scheduled maintenance will occur on Jan 5th from 2:00 AM to 4:00 AM.',
        timestamp: '2024-12-30T14:00:00Z',
        read: true,
        priority: 'low',
        category: 'system'
      },
      {
        id: 'N007',
        type: 'compliance-alert',
        title: 'RERA Update Required',
        message: 'New RERA guidelines require immediate attention for ongoing cases.',
        timestamp: '2024-12-30T11:30:00Z',
        read: false,
        priority: 'high',
        category: 'compliance',
        actionUrl: '/legal-partner/knowledge'
      }
    ]

    const mockSettings: NotificationSettings = {
      emailNotifications: true,
      pushNotifications: true,
      smsNotifications: false,
      desktopNotifications: true,
      categories: {
        cases: true,
        payments: true,
        documents: true,
        messages: true,
        system: false,
        compliance: true
      },
      quietHours: {
        enabled: true,
        startTime: '22:00',
        endTime: '08:00'
      }
    }

    setTimeout(() => {
      setNotifications(mockNotifications)
      setFilteredNotifications(mockNotifications)
      setSettings(mockSettings)
      setIsLoading(false)
    }, 1000)
  }, [])

  // Filter notifications
  useEffect(() => {
    let filtered = notifications

    if (activeTab !== 'all') {
      if (activeTab === 'unread') {
        filtered = filtered.filter(n => !n.read)
      } else {
        filtered = filtered.filter(n => n.category === activeTab)
      }
    }

    if (searchQuery) {
      filtered = filtered.filter(n => 
        n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.message.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    setFilteredNotifications(filtered)
  }, [notifications, activeTab, searchQuery])

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'case-assigned': return <Briefcase size={20} className="text-blue-500" />
      case 'document-uploaded': return <FileText size={20} className="text-green-500" />
      case 'payment-processed': return <DollarSign size={20} className="text-purple-500" />
      case 'deadline-reminder': return <Clock size={20} className="text-red-500" />
      case 'message-received': return <MessageSquare size={20} className="text-indigo-500" />
      case 'system-update': return <Settings size={20} className="text-gray-500" />
      case 'compliance-alert': return <AlertTriangle size={20} className="text-orange-500" />
      default: return <Bell size={20} className="text-gray-500" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'border-l-red-500 bg-red-50 dark:bg-red-900/20'
      case 'high': return 'border-l-orange-500 bg-orange-50 dark:bg-orange-900/20'
      case 'medium': return 'border-l-yellow-500 bg-yellow-50 dark:bg-yellow-900/20'
      case 'low': return 'border-l-green-500 bg-green-50 dark:bg-green-900/20'
      default: return 'border-l-gray-500 bg-gray-50 dark:bg-gray-900/20'
    }
  }

  const markAsRead = (notificationId: string) => {
    setNotifications(prev => prev.map(n => 
      n.id === notificationId ? { ...n, read: true } : n
    ))
    toast.success('Marked as read')
  }

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
    toast.success('All notifications marked as read')
  }

  const deleteNotification = (notificationId: string) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId))
    toast.success('Notification deleted')
  }

  const toggleNotificationSetting = (key: keyof NotificationSettings) => {
    if (settings) {
      setSettings(prev => prev ? { ...prev, [key]: !prev[key] } : null)
      toast.success('Settings updated')
    }
  }

  const toggleCategorySetting = (category: keyof NotificationSettings['categories']) => {
    if (settings) {
      setSettings(prev => prev ? {
        ...prev,
        categories: { ...prev.categories, [category]: !prev.categories[category] }
      } : null)
      toast.success('Category settings updated')
    }
  }

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)

    if (diffInHours < 1) {
      return 'Just now'
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`
    } else {
      return date.toLocaleDateString()
    }
  }

  const tabs = [
    { id: 'all', label: 'All', count: notifications.length },
    { id: 'unread', label: 'Unread', count: notifications.filter(n => !n.read).length },
    { id: 'cases', label: 'Cases', count: notifications.filter(n => n.category === 'cases').length },
    { id: 'payments', label: 'Payments', count: notifications.filter(n => n.category === 'payments').length },
    { id: 'documents', label: 'Documents', count: notifications.filter(n => n.category === 'documents').length },
    { id: 'messages', label: 'Messages', count: notifications.filter(n => n.category === 'messages').length }
  ]

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading notifications...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Notifications</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Stay updated with your legal cases and important alerts
          </p>
        </div>
        <div className="flex items-center space-x-3 mt-4 sm:mt-0">
          <button
            onClick={markAllAsRead}
            className="flex items-center space-x-2 px-4 py-2 bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/40 rounded-xl transition-all"
          >
            <CheckCircle size={20} />
            <span>Mark All Read</span>
          </button>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/40 rounded-xl transition-all"
          >
            <Settings size={20} />
            <span>Settings</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-950 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{notifications.length}</p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-2xl">
              <Bell className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-950 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Unread</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {notifications.filter(n => !n.read).length}
              </p>
            </div>
            <div className="p-3 bg-red-100 dark:bg-red-900/20 rounded-2xl">
              <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-950 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">High Priority</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {notifications.filter(n => n.priority === 'high' || n.priority === 'urgent').length}
              </p>
            </div>
            <div className="p-3 bg-orange-100 dark:bg-orange-900/20 rounded-2xl">
              <Flag className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-950 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Today</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {notifications.filter(n => {
                  const today = new Date().toDateString()
                  return new Date(n.timestamp).toDateString() === today
                }).length}
              </p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-2xl">
              <Calendar className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Notifications List */}
        <div className="lg:col-span-3">
          <div className="bg-white dark:bg-gray-950 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
            {/* Tabs */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-800">
              <div className="flex flex-wrap gap-2 mb-4">
                {tabs.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                      flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all
                      ${activeTab === tab.id
                        ? 'bg-blue-600 text-white shadow-lg'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                      }
                    `}
                  >
                    <span>{tab.label}</span>
                    <span className={`
                      px-2 py-1 rounded-full text-xs font-bold
                      ${activeTab === tab.id
                        ? 'bg-white/20 text-white'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                      }
                    `}>
                      {tab.count}
                    </span>
                  </button>
                ))}
              </div>

              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search notifications..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Notifications */}
            <div className="divide-y divide-gray-200 dark:divide-gray-800">
              {filteredNotifications.length === 0 ? (
                <div className="p-12 text-center">
                  <Bell className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No notifications</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    You're all caught up! No notifications match your current filters.
                  </p>
                </div>
              ) : (
                filteredNotifications.map(notification => (
                  <div
                    key={notification.id}
                    className={`
                      p-6 border-l-4 transition-all hover:bg-gray-50 dark:hover:bg-gray-900/50
                      ${getPriorityColor(notification.priority)}
                      ${!notification.read ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''}
                    `}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4 flex-1">
                        <div className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                          {getNotificationIcon(notification.type)}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <h4 className="font-semibold text-gray-900 dark:text-white">
                              {notification.title}
                            </h4>
                            {!notification.read && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            )}
                          </div>
                          
                          <p className="text-gray-600 dark:text-gray-400 mb-2">
                            {notification.message}
                          </p>
                          
                          <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                            <span>{formatTime(notification.timestamp)}</span>
                            <span className="capitalize">{notification.category}</span>
                            <span className={`
                              px-2 py-1 rounded-full text-xs font-medium
                              ${notification.priority === 'urgent' ? 'bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400' :
                                notification.priority === 'high' ? 'bg-orange-100 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400' :
                                notification.priority === 'medium' ? 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400' :
                                'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400'
                              }
                            `}>
                              {notification.priority}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        {!notification.read && (
                          <button
                            onClick={() => markAsRead(notification.id)}
                            className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/20 rounded-lg transition-all"
                            title="Mark as read"
                          >
                            <Eye size={16} />
                          </button>
                        )}
                        
                        <button
                          onClick={() => deleteNotification(notification.id)}
                          className="p-2 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-lg transition-all"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Settings Panel */}
        <div className="lg:col-span-1">
          {showSettings && settings && (
            <div className="bg-white dark:bg-gray-950 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
              <div className="p-6 border-b border-gray-200 dark:border-gray-800">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Notification Settings</h3>
              </div>
              
              <div className="p-6 space-y-6">
                {/* Delivery Methods */}
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-3">Delivery Methods</h4>
                  <div className="space-y-3">
                    <label className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Mail size={16} className="text-gray-500" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">Email</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.emailNotifications}
                        onChange={() => toggleNotificationSetting('emailNotifications')}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                      />
                    </label>
                    
                    <label className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Smartphone size={16} className="text-gray-500" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">Push</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.pushNotifications}
                        onChange={() => toggleNotificationSetting('pushNotifications')}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                      />
                    </label>
                    
                    <label className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Monitor size={16} className="text-gray-500" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">Desktop</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.desktopNotifications}
                        onChange={() => toggleNotificationSetting('desktopNotifications')}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                      />
                    </label>
                  </div>
                </div>

                {/* Categories */}
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-3">Categories</h4>
                  <div className="space-y-3">
                    {Object.entries(settings.categories).map(([category, enabled]) => (
                      <label key={category} className="flex items-center justify-between">
                        <span className="text-sm text-gray-700 dark:text-gray-300 capitalize">
                          {category}
                        </span>
                        <input
                          type="checkbox"
                          checked={enabled}
                          onChange={() => toggleCategorySetting(category as keyof NotificationSettings['categories'])}
                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                        />
                      </label>
                    ))}
                  </div>
                </div>

                {/* Quiet Hours */}
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-3">Quiet Hours</h4>
                  <label className="flex items-center justify-between mb-3">
                    <span className="text-sm text-gray-700 dark:text-gray-300">Enable Quiet Hours</span>
                    <input
                      type="checkbox"
                      checked={settings.quietHours.enabled}
                      onChange={() => setSettings(prev => prev ? {
                        ...prev,
                        quietHours: { ...prev.quietHours, enabled: !prev.quietHours.enabled }
                      } : null)}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                    />
                  </label>
                  
                  {settings.quietHours.enabled && (
                    <div className="space-y-2">
                      <div>
                        <label className="text-xs text-gray-500 dark:text-gray-400">From</label>
                        <input
                          type="time"
                          value={settings.quietHours.startTime}
                          onChange={(e) => setSettings(prev => prev ? {
                            ...prev,
                            quietHours: { ...prev.quietHours, startTime: e.target.value }
                          } : null)}
                          className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg text-sm"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-gray-500 dark:text-gray-400">To</label>
                        <input
                          type="time"
                          value={settings.quietHours.endTime}
                          onChange={(e) => setSettings(prev => prev ? {
                            ...prev,
                            quietHours: { ...prev.quietHours, endTime: e.target.value }
                          } : null)}
                          className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg text-sm"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}