'use client'
import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'
import toast from 'react-hot-toast'
import { backendApi, isBackendUnavailableError } from '@/lib/backendApi'
import { useSocket } from './SocketContext'
import { useAuth } from './AuthContext'

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

const NotificationContext = createContext<NotificationContextType>({
    notifications: [],
    unreadCount: 0,
    loading: false,
    fetchNotifications: async () => { },
    markAsRead: async () => { },
    markAllAsRead: async () => { },
    createNotification: async () => { },
})

export const useNotifications = () => {
    const context = useContext(NotificationContext)
    if (!context) {
        throw new Error('useNotifications must be used within NotificationProvider')
    }
    return context
}

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
    const { user } = useAuth()
    const { socket, connected } = useSocket()
    const [notifications, setNotifications] = useState<Notification[]>([])
    const [unreadCount, setUnreadCount] = useState(0)
    const [loading, setLoading] = useState(false)

    // Fetch notifications from API
    const fetchNotifications = useCallback(async () => {
        try {
            setLoading(true)

            const response = await backendApi.notifications.getAll()

            if (response && response.success) {
                const data = response.data ?? response

                // defensive checks in case API returns unexpected shape
                const notificationsFromApi = Array.isArray(data.notifications) ? data.notifications : []
                const unreadFromApi = typeof data.unreadCount === 'number' ? data.unreadCount : 0

                setNotifications(notificationsFromApi)
                setUnreadCount(unreadFromApi)
            } else {
                // Log unexpected response shape for easier debugging
                if (!response) console.warn('fetchNotifications: no response from backendApi.notifications.getAll()')
                else if (!response.success) console.warn('fetchNotifications: response.success is false', response)
            }
        } catch (error) {
            if (isBackendUnavailableError(error)) {
                setNotifications([])
                setUnreadCount(0)
                return
            }
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
                setNotifications((prev: Notification[]) =>
                    prev.map(notif =>
                        notif.id === notificationId ? { ...notif, read: true } : notif
                    )
                )
                setUnreadCount((prev: number) => Math.max(0, prev - 1))
            }
        } catch (error) {
            if (isBackendUnavailableError(error)) return
            console.error('Error marking notification as read:', error)
        }
    }, [])

    // Mark all notifications as read
    const markAllAsRead = useCallback(async () => {
        try {
            const response = await backendApi.notifications.markAllAsRead()

            if (response.success) {
                // Update local state
                setNotifications((prev: Notification[]) =>
                    prev.map(notif => ({ ...notif, read: true }))
                )
                setUnreadCount(0)

                toast.success('All notifications marked as read')
            }
        } catch (error) {
            if (isBackendUnavailableError(error)) return
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
            if (isBackendUnavailableError(error)) return
            console.error('Error creating notification:', error)
        }
    }, [fetchNotifications])

    // Fetch notifications on mount
    useEffect(() => {
        if (user) {
            fetchNotifications()
        }
    }, [fetchNotifications, user])

    // Listen for real-time notifications via Socket.io
    useEffect(() => {
        if (socket && connected) {
            const handleNewNotification = (notification: any) => {
                const newNotif: Notification = {
                    id: notification._id || notification.id,
                    type: notification.type || 'system',
                    title: notification.title,
                    message: notification.message,
                    link: notification.link,
                    read: notification.isRead || false,
                    createdAt: notification.createdAt || new Date().toISOString(),
                    metadata: notification.metadata
                };

                setNotifications((prev: Notification[]) => [newNotif, ...prev]);
                if (!newNotif.read) {
                    setUnreadCount((prev: number) => prev + 1);
                }

                // Show a toast for the new notification
                toast.success(newNotif.title, {
                    icon: '🔔',
                    duration: 5000,
                });
            };

            const handleNewAnnouncement = (announcement: any) => {
                // Check if this announcement is for us
                if (announcement.target === 'all' || announcement.target === user?.role) {
                    const newNotif: Notification = {
                        id: `announcement-${Date.now()}`,
                        type: 'system',
                        title: announcement.title,
                        message: announcement.message,
                        link: announcement.link,
                        read: false,
                        createdAt: announcement.createdAt || new Date().toISOString(),
                        metadata: { priority: announcement.priority }
                    };

                    setNotifications((prev: Notification[]) => [newNotif, ...prev]);
                    setUnreadCount((prev: number) => prev + 1);

                    toast(newNotif.title, {
                        icon: '📢',
                        duration: 8000,
                        style: {
                            border: '1px solid #10b981',
                            padding: '16px',
                            color: '#065f46',
                            background: '#ecfdf5',
                        },
                    });
                }
            };

            socket.on('new_notification', handleNewNotification);
            socket.on('new_announcement', handleNewAnnouncement);

            return () => {
                socket.off('new_notification', handleNewNotification);
                socket.off('new_announcement', handleNewAnnouncement);
            };
        }
    }, [socket, connected, user]);

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
