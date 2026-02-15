import { Server, Socket } from 'socket.io';
import { getSocketUser } from '../auth.middleware';
import { prisma } from '../../utils/prisma';

export const registerPresenceHandlers = (io: Server, socket: Socket) => {
    const user = getSocketUser(socket);

    const handleUserOnline = async () => {
        try {
            await prisma.presence.upsert({
                where: { userId: user.userId },
                update: {
                    status: 'online',
                    lastSeen: new Date(),
                    socketId: socket.id
                },
                create: {
                    userId: user.userId,
                    status: 'online',
                    lastSeen: new Date(),
                    socketId: socket.id
                }
            });

            io.emit('presence:user-online', { userId: user.userId, status: 'online' });
        } catch (error) {
            console.error('Error updating online status:', error);
        }
    };

    const handleUserOffline = async () => {
        try {
            await prisma.presence.update({
                where: { userId: user.userId },
                data: {
                    status: 'offline',
                    lastSeen: new Date(),
                    socketId: null
                }
            });

            io.emit('presence:user-offline', {
                userId: user.userId,
                status: 'offline',
                lastSeen: new Date().toISOString()
            });
        } catch (error) {
            console.error('Error updating offline status:', error);
        }
    };

    socket.on('presence:update-status', async (data: { status: 'online' | 'away' | 'offline' }) => {
        try {
            const { status } = data;

            await prisma.presence.update({
                where: { userId: user.userId },
                data: {
                    status,
                    lastSeen: new Date()
                }
            });

            io.emit('presence:status-changed', { userId: user.userId, status });
        } catch (error) {
            console.error('Error updating status:', error);
        }
    });

    socket.on('presence:get-status', async (data: { userIds: string[] }) => {
        try {
            const { userIds } = data;

            const presenceData = await prisma.presence.findMany({
                where: {
                    userId: { in: userIds }
                }
            });

            socket.emit('presence:status-response', { users: presenceData });
        } catch (error) {
            console.error('Error fetching presence:', error);
        }
    });

    socket.on('presence:heartbeat', async () => {
        try {
            await prisma.presence.update({
                where: { userId: user.userId },
                data: { lastSeen: new Date() }
            });
        } catch (error) {
            console.error('Error updating heartbeat:', error);
        }
    });

    handleUserOnline();
    socket.on('disconnect', handleUserOffline);
};

export const getOnlineUsersCount = async (): Promise<number> => {
    try {
        return await prisma.presence.count({
            where: { status: 'online' }
        });
    } catch (error) {
        console.error('Error counting online users:', error);
        return 0;
    }
};
