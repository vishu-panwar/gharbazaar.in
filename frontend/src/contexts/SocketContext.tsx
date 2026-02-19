'use client';

import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { Socket } from 'socket.io-client';
import { getOrCreateSocket, disconnectSocket } from '@/lib/socket';
import { useAuth } from './AuthContext';

interface Message {
    id: string;
    conversationId: string;
    senderId: string;
    senderEmail: string;
    content: string;
    type: 'text' | 'image' | 'file';
    read: boolean;
    createdAt: string;
}

interface SocketContextType {
    socket: Socket | null;
    connected: boolean;
    joinConversation: (conversationId: string) => void;
    leaveConversation: (conversationId: string) => void;
    sendMessage: (conversationId: string, content: string, data?: any) => void;
    sendTyping: (conversationId: string, isTyping: boolean) => void;
    markAsRead: (conversationId: string) => void;
    editMessage: (messageId: string, content: string) => void;
    deleteMessage: (messageId: string) => void;
    onNewMessage: (callback: (message: Message) => void) => (() => void) | undefined;
    onTyping: (callback: (data: { userId: string; isTyping: boolean }) => void) => (() => void) | undefined;
    onMessagesRead: (callback: (data: { conversationId: string; userId: string }) => void) => (() => void) | undefined;
    onMessageEdited: (callback: (message: Message) => void) => (() => void) | undefined;
    onMessageDeleted: (callback: (data: { id: string; conversationId: string }) => void) => (() => void) | undefined;
    onPropertyViewUpdate: (callback: (data: { propertyId: string; views: number }) => void) => (() => void) | undefined;
}

const SocketContext = createContext<SocketContextType | null>(null);

export function SocketProvider({ children }: { children: React.ReactNode }) {
    const { user } = useAuth();
    const [socket, setSocket] = useState<Socket | null>(null);
    const [connected, setConnected] = useState(false);
    const currentUserIdRef = useRef<string | null>(null);

    useEffect(() => {
        currentUserIdRef.current = user?.uid || null;
    }, [user?.uid]);

    const handleSocketConnect = useCallback(() => {
        console.log('Socket connected');
        setConnected(true);
    }, []);

    const handleSocketDisconnect = useCallback(() => {
        console.log('Socket disconnected');
        setConnected(false);
    }, []);

    const handleSocketError = useCallback((error: any) => {
        console.error('Socket error:', error);
    }, []);

    const handleForceLogout = useCallback((data: { userId: string }) => {
        if (currentUserIdRef.current && data.userId === currentUserIdRef.current) {
            console.warn('Force logout triggered by admin');
            localStorage.removeItem('auth_token');
            localStorage.removeItem('user');
            localStorage.removeItem('cached_user');
            window.location.href = '/login?reason=deleted';
        }
    }, []);

    useEffect(() => {
        if (!user) {
            disconnectSocket();
            setSocket(null);
            setConnected(false);
            return;
        }

        let activeSocket: Socket | null = null;

        try {
            const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;

            if (!token) {
                console.warn('No auth token found, connecting in demo mode');
            }

            const newSocket = getOrCreateSocket(token || undefined);
            activeSocket = newSocket;

            // Prevent duplicate listeners in React Strict Mode.
            newSocket.off('connect', handleSocketConnect);
            newSocket.off('disconnect', handleSocketDisconnect);
            newSocket.off('error', handleSocketError);
            newSocket.off('admin:force_logout', handleForceLogout);

            newSocket.on('connect', handleSocketConnect);
            newSocket.on('disconnect', handleSocketDisconnect);
            newSocket.on('error', handleSocketError);
            newSocket.on('admin:force_logout', handleForceLogout);

            setSocket(newSocket);
            setConnected(newSocket.connected);
        } catch (error) {
            console.error('Failed to initialize socket:', error);
        }

        return () => {
            if (!activeSocket) return;
            activeSocket.off('connect', handleSocketConnect);
            activeSocket.off('disconnect', handleSocketDisconnect);
            activeSocket.off('error', handleSocketError);
            activeSocket.off('admin:force_logout', handleForceLogout);
        };
    }, [user, handleSocketConnect, handleSocketDisconnect, handleSocketError, handleForceLogout]);

    const joinConversation = useCallback((conversationId: string) => {
        if (socket && connected) {
            socket.emit('join_conversation', conversationId);
            console.log(`Joined conversation: ${conversationId}`);
        }
    }, [socket, connected]);

    const leaveConversation = useCallback((conversationId: string) => {
        if (socket && connected) {
            socket.emit('leave_conversation', conversationId);
            console.log(`Left conversation: ${conversationId}`);
        }
    }, [socket, connected]);

    const sendMessage = useCallback((conversationId: string, content: string, data: any = {}) => {
        if (socket && connected) {
            socket.emit('send_message', {
                conversationId,
                content,
                type: data.type || 'text',
                ...data
            });
        }
    }, [socket, connected]);

    const sendTyping = useCallback((conversationId: string, isTyping: boolean) => {
        if (socket && connected) {
            socket.emit('typing', { conversationId, isTyping });
        }
    }, [socket, connected]);

    const markAsRead = useCallback((conversationId: string) => {
        if (socket && connected) {
            socket.emit('mark_as_read', { conversationId });
        }
    }, [socket, connected]);

    const onNewMessage = useCallback((callback: (message: Message) => void) => {
        if (socket) {
            socket.on('new_message', callback);
            return () => {
                socket.off('new_message', callback);
            };
        }
        return undefined;
    }, [socket]);

    const onTyping = useCallback((callback: (data: { userId: string; isTyping: boolean }) => void) => {
        if (socket) {
            socket.on('user_typing', callback);
            return () => {
                socket.off('user_typing', callback);
            };
        }
        return undefined;
    }, [socket]);

    const onMessagesRead = useCallback((callback: (data: { conversationId: string; userId: string }) => void) => {
        if (socket) {
            socket.on('messages_read', callback);
            return () => {
                socket.off('messages_read', callback);
            };
        }
        return undefined;
    }, [socket]);

    const editMessage = useCallback((messageId: string, content: string) => {
        if (socket && connected) {
            socket.emit('edit_message', { messageId, content });
        }
    }, [socket, connected]);

    const deleteMessage = useCallback((messageId: string) => {
        if (socket && connected) {
            socket.emit('delete_message', { messageId });
        }
    }, [socket, connected]);

    const onMessageEdited = useCallback((callback: (message: Message) => void) => {
        if (socket) {
            socket.on('message_edited', callback);
            return () => {
                socket.off('message_edited', callback);
            };
        }
        return undefined;
    }, [socket]);

    const onMessageDeleted = useCallback((callback: (data: { id: string; conversationId: string }) => void) => {
        if (socket) {
            socket.on('message_deleted', callback);
            return () => {
                socket.off('message_deleted', callback);
            };
        }
        return undefined;
    }, [socket]);

    const onPropertyViewUpdate = useCallback((callback: (data: { propertyId: string; views: number }) => void) => {
        if (socket) {
            socket.on('property:view_update', callback);
            return () => {
                socket.off('property:view_update', callback);
            };
        }
        return undefined;
    }, [socket]);

    const value: SocketContextType = {
        socket,
        connected,
        joinConversation,
        leaveConversation,
        sendMessage,
        sendTyping,
        markAsRead,
        editMessage,
        deleteMessage,
        onNewMessage,
        onTyping,
        onMessagesRead,
        onMessageEdited,
        onMessageDeleted,
        onPropertyViewUpdate,
    };

    return (
        <SocketContext.Provider value={value}>
            {children}
        </SocketContext.Provider>
    );
}

export function useSocket() {
    const context = useContext(SocketContext);
    if (!context) {
        throw new Error('useSocket must be used within SocketProvider');
    }
    return context;
}
