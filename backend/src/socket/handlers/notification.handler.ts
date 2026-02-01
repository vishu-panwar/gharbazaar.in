import { Server, Socket } from 'socket.io';

export const registerNotificationHandlers = (io: Server, socket: Socket) => {
    const user = (socket as any).user;
    if (!user) return;

    // Join a private room for personal notifications
    const notificationRoom = `notifications:${user.uid}`;
    socket.join(notificationRoom);

    // Join role-based rooms for announcements
    if (user.role) {
        socket.join(`role:${user.role}`);
    }

    console.log(`🔔 User ${user.email} joined notification room: ${notificationRoom}`);

    socket.on('mark_notification_read', (notificationId: string) => {
        // This is handled by REST API usually, but we could add socket support here
    });
};

// Helper function to send notification to specific user
export const sendUserNotification = (io: Server, userId: string, notification: any) => {
    io.to(`notifications:${userId}`).emit('new_notification', notification);
};

// Helper function to broadcast to roles
export const broadcastToRole = (io: Server, role: string, announcement: any) => {
    io.to(`role:${role}`).emit('new_announcement', announcement);
};
