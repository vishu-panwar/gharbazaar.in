'use client'

import { useState, useEffect, useRef } from 'react'
import { Bell, X, Check, CheckCheck, Trash2 } from 'lucide-react'
import { useNotifications } from '@/contexts/NotificationContext'

// Simple date formatting utility
function formatDistanceToNow(date: Date): string {
    const now = new Date()
    const diffInMs = now.getTime() - date.getTime()
    const diffInMins = Math.floor(diffInMs / (1000 * 60))
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60))
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))

    if (diffInMins < 1) return 'just now'
    if (diffInMins === 1) return '1 minute ago'
    if (diffInMins < 60) return `${diffInMins} minutes ago`
    if (diffInHours === 1) return '1 hour ago'
    if (diffInHours < 24) return `${diffInHours} hours ago`
    if (diffInDays === 1) return '1 day ago'
    if (diffInDays < 30) return `${diffInDays} days ago`
    return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(date)
}

export default function NotificationDropdown() {
    const [isOpen, setIsOpen] = useState(false)
    const { notifications, unreadCount, loading, markAsRead, markAllAsRead } = useNotifications()
    const dropdownRef = useRef<HTMLDivElement>(null)

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside)
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [isOpen])

    const getNotificationIcon = (type: string) => {
        switch (type) {
            case 'message':
                return '💬'
            case 'offer':
                return '💰'
            case 'inquiry':
                return '❓'
            case 'payment':
                return '💳'
            case 'alert':
                return '⚠️'
            default:
                return '🔔'
        }
    }

    const getNotificationColor = (type: string) => {
        switch (type) {
            case 'message':
                return 'bg-blue-100 dark:bg-blue-900/30'
            case 'offer':
                return 'bg-green-100 dark:bg-green-900/30'
            case 'inquiry':
                return 'bg-purple-100 dark:bg-purple-900/30'
            case 'payment':
                return 'bg-yellow-100 dark:bg-yellow-900/30'
            case 'alert':
                return 'bg-red-100 dark:bg-red-900/30'
            default:
                return 'bg-gray-100 dark:bg-gray-700'
        }
    }

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Bell Icon Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all"
            >
                <Bell size={22} />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute right-0 top-full mt-2 w-96 bg-white dark:bg-gray-800 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 z-50 max-h-[600px] overflow-hidden flex flex-col">
                    {/* Header */}
                    <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                        <div>
                            <h3 className="font-bold text-lg">Notifications</h3>
                            {unreadCount > 0 && (
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    {unreadCount} unread
                                </p>
                            )}
                        </div>
                        <div className="flex items-center space-x-2">
                            {unreadCount > 0 && (
                                <button
                                    onClick={markAllAsRead}
                                    className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center space-x-1"
                                    title="Mark all as read"
                                >
                                    <CheckCheck size={14} />
                                    <span>Mark all read</span>
                                </button>
                            )}
                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                            >
                                <X size={18} />
                            </button>
                        </div>
                    </div>

                    {/* Notifications List */}
                    <div className="overflow-y-auto flex-1">
                        {loading && notifications.length === 0 ? (
                            <div className="flex items-center justify-center py-12">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                            </div>
                        ) : notifications.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                <Bell size={48} className="text-gray-300 dark:text-gray-600 mb-2" />
                                <p className="text-gray-500 dark:text-gray-400 font-medium">
                                    No notifications yet
                                </p>
                                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                                    We'll notify you when something new happens
                                </p>
                            </div>
                        ) : (
                            <div className="divide-y divide-gray-100 dark:divide-gray-700">
                                {notifications.map(notification => (
                                    <div
                                        key={notification.id}
                                        className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition-colors ${!notification.read ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''
                                            }`}
                                        onClick={() => {
                                            if (!notification.read) {
                                                markAsRead(notification.id)
                                            }
                                            if (notification.link) {
                                                window.location.href = notification.link
                                            }
                                        }}
                                    >
                                        <div className="flex items-start space-x-3">
                                            {/* Icon */}
                                            <div className={`flex-shrink-0 w-10 h-10 rounded-full ${getNotificationColor(notification.type)} flex items-center justify-center text-lg`}>
                                                {getNotificationIcon(notification.type)}
                                            </div>

                                            {/* Content */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between">
                                                    <p className={`text-sm font-semibold ${!notification.read ? 'text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300'}`}>
                                                        {notification.title}
                                                    </p>
                                                    {!notification.read && (
                                                        <span className="ml-2 w-2 h-2 bg-blue-600 rounded-full flex-shrink-0"></span>
                                                    )}
                                                </div>
                                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                                                    {notification.message}
                                                </p>
                                                <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                                                    {formatDistanceToNow(new Date(notification.createdAt))}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    {notifications.length > 0 && (
                        <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700">
                            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium w-full text-center">
                                View all notifications
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
