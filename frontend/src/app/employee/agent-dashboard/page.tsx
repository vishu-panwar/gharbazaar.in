'use client';

import React, { useState, useEffect } from 'react';
import { MessageSquare, Users, Clock, CheckCircle, X, Send, Loader2, UserCog, Phone, Mail, Globe } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/Toast/ToastProvider';
import io, { Socket } from 'socket.io-client';

interface QueueItem {
    id: string;
    userId: string;
    userName: string;
    userEmail: string;
    conversationHistory: any[];
    reason?: string;
    priority: string;
    addedAt: string;
}

interface ActiveSession {
    id: string;
    userId: string;
    userName: string;
    userEmail: string;
    conversationHistory: any[];
    messages: any[];
    startedAt: string;
}

interface Message {
    role: 'user' | 'agent';
    content: string;
    timestamp: string;
    agentName?: string;
}

export default function AgentDashboard() {
    const { user } = useAuth();
    const toast = useToast();

    const [socket, setSocket] = useState<Socket | null>(null);
    const [connected, setConnected] = useState(false);
    const [status, setStatus] = useState<'available' | 'busy' | 'offline'>('available');
    const [queue, setQueue] = useState<QueueItem[]>([]);
    const [activeSessions, setActiveSessions] = useState<ActiveSession[]>([]);
    const [selectedSession, setSelectedSession] = useState<string | null>(null);
    const [inputMessage, setInputMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [customerTyping, setCustomerTyping] = useState<Record<string, boolean>>({});

    // Connect to Socket.IO
    useEffect(() => {
        if (!user) return;

        const initSocket = async () => {
            // Get Firebase ID token
            const token = localStorage.getItem('auth_token');

            const newSocket = io(process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '') || 'http://localhost:5000', {
                auth: { token },
                reconnection: true,
                reconnectionDelay: 1000,
                reconnectionAttempts: 5,
            });

            newSocket.on('connect', () => {
                setConnected(true);
                // Authenticate as agent
                newSocket.emit('agent_connect', {
                    agentId: user.uid,
                    agentName: user.displayName || user.email,
                    agentEmail: user.email,
                });
            });

            newSocket.on('disconnect', () => {
                setConnected(false);
            });

            newSocket.on('agent_connected', () => {
                toast.success('Connected to chat system');
                // Load initial data
                newSocket.emit('agent_get_queue');
                newSocket.emit('agent_get_sessions');
            });

            newSocket.on('queue_data', (data: { queue: QueueItem[] }) => {
                setQueue(data.queue);
            });

            newSocket.on('active_sessions', (data: { sessions: ActiveSession[] }) => {
                setActiveSessions(data.sessions);
            });

            newSocket.on('chat_accepted', (data: any) => {
                setActiveSessions(prev => [...prev, data]);
                setSelectedSession(data.sessionId);
                toast.success(`Chat accepted with ${data.customer.userName}`);
            });

            newSocket.on('customer_message', (data: { sessionId: string; message: Message }) => {
                setActiveSessions(prev => prev.map(session =>
                    session.id === data.sessionId
                        ? { ...session, messages: [...(session.messages || []), data.message] }
                        : session
                ));
            });

            newSocket.on('customer_typing_status', (data: { sessionId: string; isTyping: boolean }) => {
                setCustomerTyping(prev => ({ ...prev, [data.sessionId]: data.isTyping }));
            });

            newSocket.on('session_ended', (data: { sessionId: string }) => {
                setActiveSessions(prev => prev.filter(s => s.id !== data.sessionId));
                if (selectedSession === data.sessionId) {
                    setSelectedSession(null);
                }
            });

            newSocket.on('error', (error: { message: string }) => {
                toast.error(error.message);
            });

            setSocket(newSocket);
        };

        initSocket();

        return () => {
            socket?.close();
        };
    }, [user]);

    const handleStatusChange = (newStatus: 'available' | 'busy' | 'offline') => {
        setStatus(newStatus);
        socket?.emit('agent_set_status', { status: newStatus });
        toast.success(`Status set to ${newStatus}`);
    };

    const handleAcceptChat = (queueItem: QueueItem) => {
        socket?.emit('agent_accept_chat', { sessionId: queueItem.id });
        setQueue(prev => prev.filter(item => item.id !== queueItem.id));
    };

    const handleSendMessage = () => {
        if (!inputMessage.trim() || !selectedSession) return;

        socket?.emit('agent_send_message', {
            sessionId: selectedSession,
            message: inputMessage,
        });

        // Add message optimistically
        setActiveSessions(prev => prev.map(session =>
            session.id === selectedSession
                ? {
                    ...session,
                    messages: [...(session.messages || []), {
                        role: 'agent',
                        content: inputMessage,
                        timestamp: new Date().toISOString(),
                        agentName: user?.displayName || user?.email,
                    }]
                }
                : session
        ));

        setInputMessage('');
        setIsTyping(false);
        socket?.emit('agent_typing', { sessionId: selectedSession, isTyping: false });
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputMessage(e.target.value);
        if (!isTyping && selectedSession) {
            setIsTyping(true);
            socket?.emit('agent_typing', { sessionId: selectedSession, isTyping: true });
        }
    };

    const handleEndSession = (sessionId: string) => {
        socket?.emit('agent_end_session', { sessionId, resolved: true });
        toast.success('Chat session ended');
    };

    const currentSession = activeSessions.find(s => s.id === selectedSession);

    if (!user) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-gray-600 dark:text-gray-400">Please log in to access the agent dashboard</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Header */}
            <div className="bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800 px-6 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <UserCog size={32} className="text-purple-600" />
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Agent Dashboard</h1>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{user.displayName || user.email}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        {/* Connection Status */}
                        <div className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full ${connected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                                {connected ? 'Connected' : 'Disconnected'}
                            </span>
                        </div>

                        {/* Status Selector */}
                        <select
                            value={status}
                            onChange={(e) => handleStatusChange(e.target.value as any)}
                            className="px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg text-gray-900 dark:text-white border border-gray-300 dark:border-gray-700"
                        >
                            <option value="available">🟢 Available</option>
                            <option value="busy">🟡 Busy</option>
                            <option value="offline">🔴 Offline</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="flex h-[calc(100vh-88px)]">
                {/* Sidebar */}
                <div className="w-80 bg-white dark:bg-gray-950 border-r border-gray-200 dark:border-gray-800 flex flex-col">
                    {/* Queue Section */}
                    <div className="p-4 border-b border-gray-200 dark:border-gray-800">
                        <div className="flex items-center justify-between mb-3">
                            <h2 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                <Clock size={18} className="text-orange-500" />
                                Waiting Queue
                            </h2>
                            <span className="bg-orange-100 dark:bg-orange-900/20 text-orange-600 px-2 py-1 rounded-full text-xs font-medium">
                                {queue.length}
                            </span>
                        </div>

                        {queue.length === 0 ? (
                            <p className="text-sm text-gray-500 dark:text-gray-400">No customers waiting</p>
                        ) : (
                            <div className="space-y-2 max-h-60 overflow-y-auto">
                                {queue.map((item) => (
                                    <div
                                        key={item.id}
                                        className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
                                    >
                                        <div className="flex items-start justify-between mb-2">
                                            <div>
                                                <p className="font-medium text-sm text-gray-900 dark:text-white">{item.userName}</p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">{item.userEmail}</p>
                                            </div>
                                        </div>
                                        {item.reason && (
                                            <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">{item.reason}</p>
                                        )}
                                        <button
                                            onClick={() => handleAcceptChat(item)}
                                            className="w-full px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-medium transition-colors"
                                        >
                                            Accept Chat
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Active Chats */}
                    <div className="flex-1 p-4 overflow-y-auto">
                        <div className="flex items-center justify-between mb-3">
                            <h2 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                <MessageSquare size={18} className="text-green-500" />
                                Active Chats
                            </h2>
                            <span className="bg-green-100 dark:bg-green-900/20 text-green-600 px-2 py-1 rounded-full text-xs font-medium">
                                {activeSessions.length}
                            </span>
                        </div>

                        {activeSessions.length === 0 ? (
                            <p className="text-sm text-gray-500 dark:text-gray-400">No active chats</p>
                        ) : (
                            <div className="space-y-2">
                                {activeSessions.map((session) => (
                                    <button
                                        key={session.id}
                                        onClick={() => setSelectedSession(session.id)}
                                        className={`w-full p-3 rounded-lg text-left transition-colors ${selectedSession === session.id
                                            ? 'bg-purple-100 dark:bg-purple-900/20 border-2 border-purple-600'
                                            : 'bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700'
                                            }`}
                                    >
                                        <div className="flex items-center justify-between mb-1">
                                            <p className="font-medium text-sm text-gray-900 dark:text-white">{session.userName}</p>
                                            {customerTyping[session.id] && (
                                                <span className="text-xs text-purple-600">typing...</span>
                                            )}
                                        </div>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{session.userEmail}</p>
                                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                                            {session.messages?.length || 0} messages
                                        </p>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Chat Area */}
                <div className="flex-1 flex flex-col">
                    {selectedSession && currentSession ? (
                        <>
                            {/* Chat Header */}
                            <div className="px-6 py-4 bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="font-semibold text-gray-900 dark:text-white">{currentSession.userName}</h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">{currentSession.userEmail}</p>
                                    </div>
                                    <button
                                        onClick={() => handleEndSession(selectedSession)}
                                        className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition-colors"
                                    >
                                        End Chat
                                    </button>
                                </div>
                            </div>

                            {/* Messages */}
                            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50 dark:bg-gray-900">
                                {/* Show conversation history first */}
                                {currentSession.conversationHistory?.map((msg: any, i: number) => (
                                    <div key={`history-${i}`} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`max-w-md px-4 py-2 rounded-lg ${msg.role === 'user'
                                            ? 'bg-blue-500 text-white'
                                            : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white'
                                            }`}>
                                            <p className="text-sm">{msg.content}</p>
                                        </div>
                                    </div>
                                ))}

                                {/* Show current session messages */}
                                {currentSession.messages?.map((msg: Message, i: number) => (
                                    <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`max-w-md px-4 py-3 rounded-lg ${msg.role === 'user'
                                            ? 'bg-blue-500 text-white'
                                            : 'bg-purple-600 text-white'
                                            }`}>
                                            {msg.role === 'agent' && (
                                                <p className="text-xs opacity-75 mb-1">{msg.agentName}</p>
                                            )}
                                            <p className="text-sm">{msg.content}</p>
                                            <p className="text-xs opacity-75 mt-1">
                                                {new Date(msg.timestamp).toLocaleTimeString()}
                                            </p>
                                        </div>
                                    </div>
                                ))}

                                {customerTyping[selectedSession] && (
                                    <div className="flex justify-end">
                                        <div className="bg-gray-200 dark:bg-gray-700 px-4 py-3 rounded-lg">
                                            <div className="flex space-x-2">
                                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Input */}
                            <div className="p-4 bg-white dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800">
                                <div className="flex items-center gap-2">
                                    <input
                                        type="text"
                                        value={inputMessage}
                                        onChange={handleInputChange}
                                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                        placeholder="Type your message..."
                                        className="flex-1 px-4 py-3 bg-gray-100 dark:bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 dark:text-white"
                                    />
                                    <button
                                        onClick={handleSendMessage}
                                        disabled={!inputMessage.trim()}
                                        className="p-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                                    >
                                        <Send size={20} />
                                    </button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                            <div className="text-center">
                                <MessageSquare size={64} className="mx-auto mb-4 text-gray-300 dark:text-gray-700" />
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No Chat Selected</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {queue.length > 0
                                        ? 'Accept a chat from the queue or select an active conversation'
                                        : 'Waiting for customers...'}
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
