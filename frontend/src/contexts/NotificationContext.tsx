'use client'

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react'
import toast from 'react-hot-toast'
import { backendApi } from '@/lib/backendApi'

interface Notification {
    id: string
    type: 'message' | 'offer' | 'inquiry' | 'payment' | 'system' | 'alert'
    title: string
    message: string
    link?: string
    read: boolean
    createdAt: string
    metadata?: any
}

interface NotificationContextType {
    notifications: Notification[]
    unreadCount: number
    loading: boolean
    fetchNotifications: () => Promise<void>
    markAsRead: (notificationId: string) => Promise<void>
    markAllAsRead: () => Promise<void>
    createNotification: (notification: Partial<Notification>) => Promise<void>
}

const NotificationContext = createContext<NotificationContextType>({} as NotificationContextType)

export const useNotifications = () => {
    const context = useContext(NotificationContext)
    if (!context) {
        throw new Error('useNotifications must be used within NotificationProvider')
    }
    return context
}

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
    const [notifications, setNotifications] = useState<Notification[]>([])
    const [unreadCount, setUnreadCount] = useState(0)
    const [loading, setLoading] = useState(false)

    // Fetch notifications from API
    const fetchNotifications = useCallback(async () => {
        try {
            setLoading(true)

            const response = await backendApi.notifications.getAll()

            if (response.success) {
                setNotifications(response.data.notifications || [])
                setUnreadCount(response.data.unreadCount || 0)
            }
        } catch (error) {
            console.error('Error fetching notifications:', error)
        } finally {
            setLoading(false)
        }
    }, [])

    // Mark notification as read
    const markAsRead = useCallback(async (notificationId: string) => {
        try {
            const response = await backendApi.notifications.markAsRead(notificationId)

            if (response.success) {
                // Update local state
                setNotifications(prev =>
                    prev.map(notif =>
                        notif.id === notificationId ? { ...notif, read: true } : notif
                    )
                )
                setUnreadCount(prev => Math.max(0, prev - 1))
            }
        } catch (error) {
            console.error('Error marking notification as read:', error)
        }
    }, [])

    // Mark all notifications as read
    const markAllAsRead = useCallback(async () => {
        try {
            const response = await backendApi.notifications.markAllAsRead()

            if (response.success) {
                // Update local state
                setNotifications(prev =>
                    prev.map(notif => ({ ...notif, read: true }))
                )
                setUnreadCount(0)

                toast.success('All notifications marked as read')
            }
        } catch (error) {
            console.error('Error marking all notifications as read:', error)
            toast.error('Failed to mark notifications as read')
        }
    }, [])

    // Create notification
    const createNotification = useCallback(async (notification: Partial<Notification>) => {
        try {
            const response = await backendApi.notifications.create({
                type: notification.type || 'system',
                title: notification.title || '',
                message: notification.message || '',
                link: notification.link,
                metadata: notification.metadata,
            })

            if (response.success) {
                // Refresh notifications
                await fetchNotifications()
            }
        } catch (error) {
            console.error('Error creating notification:', error)
        }
    }, [fetchNotifications])

    // Fetch notifications on mount
    useEffect(() => {
        fetchNotifications()
    }, [fetchNotifications])

    // Poll for new notifications every 30 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            fetchNotifications()
        }, 30000) // 30 seconds

        return () => clearInterval(interval)
    }, [fetchNotifications])

    const value = {
        notifications,
        unreadCount,
        loading,
        fetchNotifications,
        markAsRead,
        markAllAsRead,
        createNotification,
    }

    return (
        <NotificationContext.Provider value={value}>
            {children}
        </NotificationContext.Provider>
    )
}
