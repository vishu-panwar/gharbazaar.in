'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { Socket } from 'socket.io-client';
import { getOrCreateSocket, disconnectSocket } from '@/lib/socket';
import { useAuth } from './AuthContext';
import { CONFIG } from '@/config';

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
    sendMessage: (conversationId: string, content: string) => void;
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

    useEffect(() => {
        if (!user) {
            // Disconnect if no user
            if (socket) {
                disconnectSocket();
                setSocket(null);
                setConnected(false);
            }
            return;
        }

        // Get auth token from localStorage
        const initSocket = async () => {
            try {
                // Get token from localStorage (set by backend login)
                const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;

                // Allow connections without token for demo mode
                if (!token) {
                    console.warn('No auth token found, connecting in demo mode');
                }

                const newSocket = getOrCreateSocket(token || undefined);

                // Attach client-side listeners just once
                newSocket.on('connect', () => {
                    console.log('✅ Socket connected');
                    setConnected(true);
                });

                newSocket.on('disconnect', () => {
                    console.log('❌ Socket disconnected');
                    setConnected(false);
                });

                newSocket.on('error', (error: any) => {
                    console.error('Socket error:', error);
                });

                newSocket.on('admin:force_logout', async (data: { userId: string }) => {
                    if (user && (data.userId === user.uid || data.userId === user.userId)) {
                        console.warn('⚠️ Force logout triggered by admin');
                        localStorage.removeItem('auth_token');
                        localStorage.removeItem('user');
                        localStorage.removeItem('cached_user');
                        window.location.href = '/login?reason=deleted';
                    }
                });

                setSocket(newSocket);
            } catch (error) {
                console.error('Failed to initialize socket:', error);
            }
        };

        initSocket();

        return () => {
            // Do not forcibly disconnect shared socket here — other providers may need it.
            setSocket((s) => s);
        };
    }, [user]);

    const joinConversation = useCallback((conversationId: string) => {
        if (socket && connected) {
            socket.emit('join_conversation', conversationId);
            console.log(`📨 Joined conversation: ${conversationId}`);
        }
    }, [socket, connected]);

    const leaveConversation = useCallback((conversationId: string) => {
        if (socket && connected) {
            socket.emit('leave_conversation', conversationId);
            console.log(`📤 Left conversation: ${conversationId}`);
        }
    }, [socket, connected]);

    const sendMessage = useCallback((conversationId: string, content: string) => {
        if (socket && connected) {
            socket.emit('send_message', {
                conversationId,
                content,
                type: 'text',
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
