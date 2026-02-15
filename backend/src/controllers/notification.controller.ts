import { Request, Response } from 'express';
import { prisma } from '../utils/prisma';

export const getNotifications = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.userId || (req as any).user?.id;
        if (!userId) {
            return res.status(401).json({ success: false, error: 'Unauthorized' });
        }

        const { limit = 20, unreadOnly = false } = req.query;

        // Use Prisma to find notifications
        const notifications = await prisma.notification.findMany({
            where: {
                userId,
                ...(unreadOnly === 'true' ? { isRead: false } : {})
            },
            orderBy: {
                createdAt: 'desc'
            },
            take: Number(limit)
        });

        const unreadCount = await prisma.notification.count({
            where: { userId, isRead: false }
        });

        res.json({
            success: true,
            notifications,
            count: notifications.length,
            unreadCount
        });
    } catch (error) {
        console.error('getNotifications error:', error);
        res.status(500).json({ success: false, error: 'Failed to get notifications' });
    }
};

export const markAsRead = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.userId || (req as any).user?.id;
        const { id } = req.params;

        const notification = await prisma.notification.updateMany({
            where: { id, userId },
            data: {
                isRead: true,
                readAt: new Date()
            }
        });

        if (notification.count === 0) {
            return res.status(404).json({ success: false, error: 'Notification not found' });
        }

        // Get the updated record
        const updated = await prisma.notification.findUnique({
            where: { id }
        });

        res.json({ success: true, data: updated });
    } catch (error) {
        console.error('markAsRead error:', error);
        res.status(500).json({ success: false, error: 'Failed to mark notification as read' });
    }
};

export const markAllAsRead = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.userId || (req as any).user?.id;
        await prisma.notification.updateMany({
            where: { userId, isRead: false },
            data: {
                isRead: true,
                readAt: new Date()
            }
        });
        res.json({ success: true, message: 'All notifications marked as read' });
    } catch (error) {
        console.error('markAllAsRead error:', error);
        res.status(500).json({ success: false, error: 'Failed to mark all as read' });
    }
};

export const deleteNotification = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.userId || (req as any).user?.id;
        const { id } = req.params;

        const result = await prisma.notification.deleteMany({
            where: { id, userId }
        });

        if (result.count === 0) {
            return res.status(404).json({ success: false, error: 'Notification not found' });
        }

        res.json({ success: true, message: 'Notification deleted' });
    } catch (error) {
        console.error('deleteNotification error:', error);
        res.status(500).json({ success: false, error: 'Failed to delete notification' });
    }
};
