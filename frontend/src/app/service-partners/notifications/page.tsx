'use client'

import { useEffect, useMemo, useState } from 'react'
import { Bell, CheckCircle, Search, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { backendApi } from '@/lib/backendApi'

type NotificationRecord = {
  id: string
  type?: string
  title?: string
  message?: string
  priority?: string
  isRead?: boolean
  createdAt?: string
  link?: string
}

const priorityClass = (priority?: string) => {
  const value = (priority || 'medium').toLowerCase()
  if (value === 'high') return 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400'
  if (value === 'low') return 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
  return 'bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400'
}

export default function ServicePartnerNotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [query, setQuery] = useState('')
  const [activeTab, setActiveTab] = useState<'all' | 'unread'>('all')

  const loadNotifications = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await backendApi.notifications.getAll()
      if (!response?.success) {
        throw new Error(response?.error || 'Failed to load notifications')
      }

      const records = Array.isArray(response.notifications)
        ? response.notifications
        : Array.isArray(response.data?.notifications)
          ? response.data.notifications
          : []

      setNotifications(records)
    } catch (err: any) {
      setError(err?.message || 'Failed to load notifications')
      setNotifications([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadNotifications()
  }, [])

  const filteredNotifications = useMemo(() => {
    return notifications.filter((notification) => {
      if (activeTab === 'unread' && notification.isRead) return false

      if (!query) return true
      const haystack = `${notification.title || ''} ${notification.message || ''} ${notification.type || ''}`.toLowerCase()
      return haystack.includes(query.toLowerCase())
    })
  }, [notifications, query, activeTab])

  const unreadCount = useMemo(
    () => notifications.filter((notification) => !notification.isRead).length,
    [notifications]
  )

  const markAsRead = async (id: string) => {
    try {
      const response = await backendApi.notifications.markAsRead(id)
      if (!response?.success) throw new Error(response?.error || 'Failed to mark as read')

      setNotifications((prev) =>
        prev.map((notification) => (notification.id === id ? { ...notification, isRead: true } : notification))
      )
    } catch (err: any) {
      toast.error(err?.message || 'Failed to mark notification as read')
    }
  }

  const markAllAsRead = async () => {
    try {
      const response = await backendApi.notifications.markAllAsRead()
      if (!response?.success) throw new Error(response?.error || 'Failed to mark all as read')

      setNotifications((prev) => prev.map((notification) => ({ ...notification, isRead: true })))
      toast.success('All notifications marked as read')
    } catch (err: any) {
      toast.error(err?.message || 'Failed to mark all as read')
    }
  }

  const deleteNotification = async (id: string) => {
    try {
      const response = await backendApi.notifications.delete(id)
      if (!response?.success) throw new Error(response?.error || 'Failed to delete notification')

      setNotifications((prev) => prev.filter((notification) => notification.id !== id))
    } catch (err: any) {
      toast.error(err?.message || 'Failed to delete notification')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Notifications</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">System, case, and payment updates in real time.</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={markAllAsRead}
            className="px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium"
          >
            Mark All Read
          </button>
          <button
            onClick={loadNotifications}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium"
          >
            Refresh
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl p-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">Total</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{notifications.length}</p>
        </div>
        <div className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl p-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">Unread</p>
          <p className="text-2xl font-bold text-red-600">{unreadCount}</p>
        </div>
        <div className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl p-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">Read</p>
          <p className="text-2xl font-bold text-green-600">{notifications.length - unreadCount}</p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl">
        <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search notifications"
              className="w-full pl-9 pr-3 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg"
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2.5 rounded-lg text-sm font-medium ${activeTab === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300'}`}
            >
              All
            </button>
            <button
              onClick={() => setActiveTab('unread')}
              className={`px-4 py-2.5 rounded-lg text-sm font-medium ${activeTab === 'unread' ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300'}`}
            >
              Unread
            </button>
          </div>
        </div>

        <div className="divide-y divide-gray-200 dark:divide-gray-800">
          {loading ? (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400">Loading notifications...</div>
          ) : error ? (
            <div className="p-6 text-red-600 dark:text-red-400">{error}</div>
          ) : filteredNotifications.length === 0 ? (
            <div className="p-10 text-center text-gray-500 dark:text-gray-400">No notifications to show.</div>
          ) : (
            filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 ${!notification.isRead ? 'bg-blue-50/60 dark:bg-blue-900/10' : ''}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-900">
                      <Bell size={16} className="text-gray-600 dark:text-gray-300" />
                    </div>

                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-medium text-gray-900 dark:text-white">{notification.title || 'Notification'}</p>
                        {!notification.isRead && <span className="w-2 h-2 rounded-full bg-blue-600" />}
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${priorityClass(notification.priority)}`}>
                          {(notification.priority || 'medium').toUpperCase()}
                        </span>
                      </div>

                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{notification.message || '-'}</p>
                      <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                        {(notification.type || 'system').replace('_', ' ')} • {notification.createdAt ? new Date(notification.createdAt).toLocaleString() : '-'}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    {!notification.isRead && (
                      <button
                        onClick={() => markAsRead(notification.id)}
                        className="p-2 text-green-600 hover:bg-green-100 dark:hover:bg-green-900/20 rounded-lg"
                        title="Mark as read"
                      >
                        <CheckCircle size={16} />
                      </button>
                    )}

                    <button
                      onClick={() => deleteNotification(notification.id)}
                      className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-lg"
                      title="Delete notification"
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
  )
}


