'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useSocket } from '@/contexts/SocketContext';
import { MessageCircle, Search, User, Clock } from 'lucide-react';

interface Conversation {
    id: string;
    participants: string[];
    type: string;
    lastMessage: string;
    lastMessageAt: string;
    otherUser: {
        id: string;
        name: string;
        email: string;
        avatar?: string;
        onlineStatus?: string;
    };
    unreadCount: number;
}

interface ConversationsListProps {
    onSelect: (conversation: Conversation) => void;
    selectedId?: string;
}

export default function ConversationsList({ onSelect, selectedId }: ConversationsListProps) {
    const { user } = useAuth();
    const { socket, connected } = useSocket();
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchConversations();
    }, [user]);

    const fetchConversations = async () => {
        if (!user) return;

        try {
            const token = localStorage.getItem('auth_token');
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/chat/conversations`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                }
            );

            const data = await response.json();
            if (data.success) {
                setConversations(data.data.conversations || []);
            }
        } catch (error) {
            console.error('Error fetching conversations:', error);
        } finally {
            setLoading(false);
        }
    };

    // Listen for new messages via Socket.IO
    useEffect(() => {
        if (!socket || !connected) return;

        const handleMessageNotification = (data: {
            conversationId: string;
            message: any;
        }) => {
            // Update conversation list with new message
            setConversations(prev => {
                const updated = prev.map(conv => {
                    if (conv.id === data.conversationId) {
                        return {
                            ...conv,
                            lastMessage: data.message.content,
                            lastMessageAt: data.message.createdAt,
                            unreadCount: selectedId !== data.conversationId ? conv.unreadCount + 1 : conv.unreadCount,
                        };
                    }
                    return conv;
                });

                // Sort by lastMessageAt
                return updated.sort((a, b) =>
                    new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime()
                );
            });
        };

        socket.on('message_notification', handleMessageNotification);

        return () => {
            socket.off('message_notification', handleMessageNotification);
        };
    }, [socket, connected, selectedId]);

    const filteredConversations = conversations.filter(conv =>
        conv.otherUser.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        conv.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const hours = diff / (1000 * 60 * 60);

        if (hours < 1) {
            const minutes = Math.floor(diff / (1000 * 60));
            return `${minutes}m ago`;
        } else if (hours < 24) {
            return `${Math.floor(hours)}h ago`;
        } else {
            const days = Math.floor(hours / 24);
            return days === 1 ? 'Yesterday' : `${days}d ago`;
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full bg-white dark:bg-gray-900">
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                    <MessageCircle className="mr-2 text-green-500" size={28} />
                    Messages
                </h2>

                {/* Search */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search conversations..."
                        className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900 dark:text-white placeholder-gray-500"
                    />
                </div>
            </div>

            {/* Conversations */}
            <div className="flex-1 overflow-y-auto">
                {filteredConversations.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center px-4">
                        <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
                            <MessageCircle size={32} className="text-gray-400" />
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 font-medium">No conversations yet</p>
                        <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                            Start chatting with sellers or support
                        </p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-200 dark:divide-gray-700">
                        {filteredConversations.map((conv) => (
                            <button
                                key={conv.id}
                                onClick={() => onSelect(conv)}
                                className={`w-full px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-left ${selectedId === conv.id ? 'bg-green-50 dark:bg-green-900/20' : ''
                                    }`}
                            >
                                <div className="flex items-center space-x-3">
                                    {/* Avatar */}
                                    <div className="relative flex-shrink-0">
                                        <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                                            {conv.otherUser.name.charAt(0).toUpperCase()}
                                        </div>
                                        {conv.otherUser.onlineStatus === 'online' && (
                                            <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white dark:border-gray-900 rounded-full"></div>
                                        )}
                                        {conv.unreadCount > 0 && (
                                            <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                                                {conv.unreadCount > 9 ? '9+' : conv.unreadCount}
                                            </div>
                                        )}
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between mb-1">
                                            <h3 className={`font-semibold truncate ${conv.unreadCount > 0
                                                ? 'text-gray-900 dark:text-white'
                                                : 'text-gray-700 dark:text-gray-300'
                                                }`}>
                                                {conv.otherUser.name}
                                            </h3>
                                            <span className="text-xs text-gray-500 dark:text-gray-400 flex-shrink-0 ml-2">
                                                {formatTime(conv.lastMessageAt)}
                                            </span>
                                        </div>
                                        <p className={`text-sm truncate ${conv.unreadCount > 0
                                            ? 'text-gray-900 dark:text-white font-medium'
                                            : 'text-gray-600 dark:text-gray-400'
                                            }`}>
                                            {conv.lastMessage || 'No messages yet'}
                                        </p>
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
