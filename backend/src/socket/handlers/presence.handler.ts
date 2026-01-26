import { Server, Socket } from 'socket.io';
import { getSocketUser } from '../auth.middleware';
import Presence from '../../models/presence.model';
import { isMongoDBAvailable } from '../../utils/memoryStore';

const memoryPresence = new Map<string, any>();

export const registerPresenceHandlers = (io: Server, socket: Socket) => {
    const user = getSocketUser(socket);

    const handleUserOnline = async () => {
        try {
            let presence;
            if (isMongoDBAvailable()) {
                presence = await Presence.findOneAndUpdate(
                    { userId: user.userId },
                    { userId: user.userId, status: 'online', lastSeen: new Date(), socketId: socket.id },
                    { upsert: true, new: true }
                );
            } else {
                presence = { userId: user.userId, status: 'online', lastSeen: new Date(), socketId: socket.id };
                memoryPresence.set(user.userId, presence);
            }

            io.emit('presence:user-online', { userId: user.userId, status: 'online' });
        } catch (error) {
            console.error('Error updating online status:', error);
        }
    };

    const handleUserOffline = async () => {
        try {
            if (isMongoDBAvailable()) {
                await Presence.findOneAndUpdate(
                    { userId: user.userId },
                    { status: 'offline', lastSeen: new Date(), socketId: null }
                );
            } else {
                const presence = memoryPresence.get(user.userId);
                if (presence) {
                    presence.status = 'offline';
                    presence.lastSeen = new Date();
                    presence.socketId = null;
                }
            }

            io.emit('presence:user-offline', {
                userId: user.userId,
                status: 'offline',
                lastSeen: new Date().toISOString(),
            });
        } catch (error) {
            console.error('Error updating offline status:', error);
        }
    };

    socket.on('presence:update-status', async (data: { status: 'online' | 'away' | 'offline' }) => {
        try {
            const { status } = data;

            if (isMongoDBAvailable()) {
                await Presence.findOneAndUpdate(
                    { userId: user.userId },
                    { status, lastSeen: new Date() }
                );
            } else {
                const presence = memoryPresence.get(user.userId);
                if (presence) {
                    presence.status = status;
                    presence.lastSeen = new Date();
                }
            }

            io.emit('presence:status-changed', { userId: user.userId, status });
        } catch (error) {
            console.error('Error updating status:', error);
        }
    });

    socket.on('presence:get-status', async (data: { userIds: string[] }) => {
        try {
            const { userIds } = data;

            let presenceData = [];
            if (isMongoDBAvailable()) {
                presenceData = await Presence.find({ userId: { $in: userIds } });
            } else {
                presenceData = userIds.map(id => memoryPresence.get(id)).filter(p => p !== undefined);
            }

            socket.emit('presence:status-response', { users: presenceData });
        } catch (error) {
            console.error('Error fetching presence:', error);
        }
    });

    socket.on('presence:heartbeat', async () => {
        try {
            if (isMongoDBAvailable()) {
                await Presence.findOneAndUpdate(
                    { userId: user.userId },
                    { lastSeen: new Date() }
                );
            } else {
                const presence = memoryPresence.get(user.userId);
                if (presence) presence.lastSeen = new Date();
            }
        } catch (error) {
            console.error('Error updating heartbeat:', error);
        }
    });

    handleUserOnline();
    socket.on('disconnect', handleUserOffline);
};

export const getOnlineUsersCount = async (): Promise<number> => {
    try {
        if (isMongoDBAvailable()) {
            return await Presence.countDocuments({ status: 'online' });
        } else {
            return Array.from(memoryPresence.values()).filter((p: any) => p.status === 'online').length;
        }
    } catch (error) {
        console.error('Error counting online users:', error);
        return 0;
    }
};
