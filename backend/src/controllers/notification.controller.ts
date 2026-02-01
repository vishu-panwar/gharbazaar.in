
import { Request, Response } from 'express';
import Notification from '../models/notification.model';

export const getNotifications = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.userId;
        if (!userId) {
            return res.status(401).json({ success: false, error: 'Unauthorized' });
        }

        const { limit = 20, unreadOnly = false } = req.query;
        const query: any = { userId };

        if (unreadOnly === 'true') {
            query.isRead = false;
        }

        const notifications = await Notification.find(query)
            .sort({ createdAt: -1 })
            .limit(Number(limit));

        const unreadCount = await Notification.countDocuments({ userId, isRead: false });

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
        const userId = (req as any).user?.userId;
        const { id } = req.params;

        const notification = await Notification.findOneAndUpdate(
            { _id: id, userId },
            { isRead: true },
            { new: true }
        );

        if (!notification) {
            return res.status(404).json({ success: false, error: 'Notification not found' });
        }

        res.json({ success: true, data: notification });
    } catch (error) {
        console.error('markAsRead error:', error);
        res.status(500).json({ success: false, error: 'Failed to mark notification as read' });
    }
};

export const markAllAsRead = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.userId;
        await Notification.updateMany({ userId, isRead: false }, { isRead: true });
        res.json({ success: true, message: 'All notifications marked as read' });
    } catch (error) {
        console.error('markAllAsRead error:', error);
        res.status(500).json({ success: false, error: 'Failed to mark all as read' });
    }
};

export const deleteNotification = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.userId;
        const { id } = req.params;

        const result = await Notification.deleteOne({ _id: id, userId });
        if (result.deletedCount === 0) {
            return res.status(404).json({ success: false, error: 'Notification not found' });
        }

        res.json({ success: true, message: 'Notification deleted' });
    } catch (error) {
        console.error('deleteNotification error:', error);
        res.status(500).json({ success: false, error: 'Failed to delete notification' });
    }
};
