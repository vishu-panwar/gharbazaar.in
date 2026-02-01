import { Server as HTTPServer } from 'http';
import { Server, Socket } from 'socket.io';
import config from '../config';
import { authenticateSocket } from './auth.middleware';
import { registerChatHandlers } from './handlers/chat.handler';
import { registerTicketHandlers } from './handlers/ticket.handler';
import { registerPresenceHandlers } from './handlers/presence.handler';
import { registerAgentHandlers } from './handlers/agent.handler';
import { registerNotificationHandlers } from './handlers/notification.handler';

export const initializeSocket = (httpServer: HTTPServer): Server => {
    console.log('🔌 Initializing Socket.IO server...');

    const io = new Server(httpServer, {
        cors: {
            origin: config.allowedOrigins,
            methods: ['GET', 'POST'],
            credentials: true,
        },
        pingTimeout: config.socket.pingTimeout,
        pingInterval: config.socket.pingInterval,
        allowEIO3: true,
        transports: ['websocket', 'polling'],
    });

    io.use(authenticateSocket);

    io.on('connection', (socket: Socket) => {
        const user = (socket as any).user;

        console.log(`\n✅ New socket connection:`);
        console.log(`   User: ${user.email}`);
        console.log(`   Socket ID: ${socket.id}`);
        console.log(`   Role: ${user.role || 'user'}`);

        registerChatHandlers(io, socket);
        registerTicketHandlers(io, socket);
        registerPresenceHandlers(io, socket);
        registerAgentHandlers(io, socket);
        registerNotificationHandlers(io, socket);

        socket.on('disconnect', (reason) => {
            console.log(`\n❌ Socket disconnected:`);
            console.log(`   User: ${user.email}`);
            console.log(`   Socket ID: ${socket.id}`);
            console.log(`   Reason: ${reason}`);
        });

        socket.on('error', (error) => {
            console.error(`\n❌ Socket error for ${user.email}:`, error);
        });
    });

    io.engine.on('connection_error', (err) => {
        console.error('❌ Connection error:', err);
    });

    console.log('✅ Socket.IO server initialized successfully');
    console.log(`📡 CORS allowed origins: ${config.allowedOrigins.join(', ')}`);
    console.log(`⏱️  Ping timeout: ${config.socket.pingTimeout}ms`);
    console.log(`💓 Ping interval: ${config.socket.pingInterval}ms\n`);

    return io;
};

export const getSocketStats = (io: Server) => {
    const sockets = io.sockets.sockets;
    const connectedUsers = Array.from(sockets.values()).map((socket: any) => ({
        socketId: socket.id,
        userId: socket.user?.userId,
        email: socket.user?.email,
        connected: socket.connected,
    }));

    return {
        totalConnections: sockets.size,
        connectedUsers,
        rooms: Array.from(io.sockets.adapter.rooms.keys()),
    };
};
