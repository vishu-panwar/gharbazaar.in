'use client';

/**
 * 👤 PRESENCE CONTEXT
 * 
 * React context for tracking user online/offline status.
 * Integrates with Socket.io to provide real-time presence indicators.
 * 
 * @author GharBazaar Frontend Team
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useSocket } from './SocketContext';
import { useAuth } from './AuthContext';

interface PresenceState {
    onlineUsers: Set<string>;
    userStatus: Record<string, 'online' | 'away' | 'offline'>;
    lastSeen: Record<string, Date>;
}

interface UserPresence {
    userId: string;
    status: 'online' | 'away' | 'offline';
    lastSeen?: Date;
}

interface PresenceContextType extends PresenceState {
    isUserOnline: (userId: string) => boolean;
    getUserStatus: (userId: string) => 'online' | 'away' | 'offline';
    getLastSeen: (userId: string) => Date | null;
    updateMyStatus: (status: 'online' | 'away' | 'offline') => void;
    requestUserStatus: (userIds: string[]) => void;
}

const PresenceContext = createContext<PresenceContextType | undefined>(undefined);

export const usePresence = () => {
    const context = useContext(PresenceContext);
    if (!context) {
        throw new Error('usePresence must be used within a PresenceProvider');
    }
    return context;
};

interface PresenceProviderProps {
    children: ReactNode;
}

export const PresenceProvider: React.FC<PresenceProviderProps> = ({ children }) => {
    const { socket, connected } = useSocket();
    const { user } = useAuth();

    const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set());
    const [userStatus, setUserStatus] = useState<Record<string, 'online' | 'away' | 'offline'>>({});
    const [lastSeen, setLastSeen] = useState<Record<string, Date>>({});

    useEffect(() => {
        if (!socket || !connected || !user) return;

        // Listen for user online events
        socket.on('presence:user-online', (data: { userId: string; status: 'online' }) => {
            setOnlineUsers(prev => new Set(prev).add(data.userId));
            setUserStatus(prev => ({ ...prev, [data.userId]: 'online' }));
        });

        // Listen for user offline events
        socket.on('presence:user-offline', (data: { userId: string; status: 'offline'; lastSeen: string }) => {
            setOnlineUsers(prev => {
                const newSet = new Set(prev);
                newSet.delete(data.userId);
                return newSet;
            });
            setUserStatus(prev => ({ ...prev, [data.userId]: 'offline' }));
            setLastSeen(prev => ({ ...prev, [data.userId]: new Date(data.lastSeen) }));
        });

        // Listen for status changes
        socket.on('presence:status-changed', (data: { userId: string; status: 'online' | 'away' | 'offline' }) => {
            setUserStatus(prev => ({ ...prev, [data.userId]: data.status }));

            if (data.status === 'offline') {
                setOnlineUsers(prev => {
                    const newSet = new Set(prev);
                    newSet.delete(data.userId);
                    return newSet;
                });
            } else {
                setOnlineUsers(prev => new Set(prev).add(data.userId));
            }
        });

        // Listen for status responses
        socket.on('presence:status-response', (data: { users: UserPresence[] }) => {
            const newStatus: Record<string, 'online' | 'away' | 'offline'> = {};
            const newLastSeen: Record<string, Date> = {};
            const newOnline = new Set<string>();

            data.users.forEach(user => {
                newStatus[user.userId] = user.status;
                if (user.status !== 'offline') {
                    newOnline.add(user.userId);
                }
                if (user.lastSeen) {
                    newLastSeen[user.userId] = new Date(user.lastSeen);
                }
            });

            setUserStatus(prev => ({ ...prev, ...newStatus }));
            setLastSeen(prev => ({ ...prev, ...newLastSeen }));
            setOnlineUsers(prev => new Set([...prev, ...newOnline]));
        });

        // Send heartbeat every 30 seconds
        const heartbeatInterval = setInterval(() => {
            if (socket && connected) {
                socket.emit('presence:heartbeat');
            }
        }, 30000);

        return () => {
            clearInterval(heartbeatInterval);
            socket.off('presence:user-online');
            socket.off('presence:user-offline');
            socket.off('presence:status-changed');
            socket.off('presence:status-response');
        };
    }, [socket, connected, user]);

    const isUserOnline = (userId: string): boolean => {
        return onlineUsers.has(userId);
    };

    const getUserStatus = (userId: string): 'online' | 'away' | 'offline' => {
        return userStatus[userId] || 'offline';
    };

    const getLastSeen = (userId: string): Date | null => {
        return lastSeen[userId] || null;
    };

    const updateMyStatus = (status: 'online' | 'away' | 'offline') => {
        if (socket && connected) {
            socket.emit('presence:update-status', { status });
        }
    };

    const requestUserStatus = (userIds: string[]) => {
        if (socket && connected) {
            socket.emit('presence:get-status', { userIds });
        }
    };

    const value: PresenceContextType = {
        onlineUsers,
        userStatus,
        lastSeen,
        isUserOnline,
        getUserStatus,
        getLastSeen,
        updateMyStatus,
        requestUserStatus,
    };

    return <PresenceContext.Provider value={value}>{children}</PresenceContext.Provider>;
};
