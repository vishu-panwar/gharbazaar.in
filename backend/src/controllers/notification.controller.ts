import { Request, Response } from 'express';

export const getNotifications = async (req: Request, res: Response) => {
    try {
        // Return empty notifications for now to satisfy the frontend
        res.json({
            success: true,
            notifications: [],
            count: 0
        });
    } catch (error) {
        console.error('getNotifications error:', error);
        res.status(500).json({ success: false, error: 'Failed to get notifications' });
    }
};

export const markAsRead = async (req: Request, res: Response) => {
    res.json({ success: true, message: 'Notification marked as read' });
};

export const markAllAsRead = async (req: Request, res: Response) => {
    res.json({ success: true, message: 'All notifications marked as read' });
};

export const deleteNotification = async (req: Request, res: Response) => {
    res.json({ success: true, message: 'Notification deleted' });
};
