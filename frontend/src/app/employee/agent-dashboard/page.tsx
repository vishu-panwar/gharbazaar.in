'use client';

import React, { useState, useEffect } from 'react';
import { MessageSquare, Users, Clock, CheckCircle, X, Send, Loader2, UserCog, Phone, Mail, Globe } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/Toast/ToastProvider';
import { CONFIG } from '@/config';
import { useSocket } from '@/contexts/SocketContext';

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

    const { socket, connected } = useSocket();
    const [status, setStatus] = useState<'available' | 'busy' | 'offline'>('available');
    const [queue, setQueue] = useState<QueueItem[]>([]);
    const [activeSessions, setActiveSessions] = useState<ActiveSession[]>([]);
    const [selectedSession, setSelectedSession] = useState<string | null>(null);
    const [inputMessage, setInputMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [customerTyping, setCustomerTyping] = useState<Record<string, boolean>>({});
    const [pendingProperties, setPendingProperties] = useState<any[]>([]);
    const [activeTab, setActiveTab] = useState<'chat' | 'approvals'>('chat');

    // Connect to Socket.IO
    useEffect(() => {
        if (!user) return;

        const setup = async () => {
            if (!socket || !user) return;

            // On connect, authenticate the agent and request queue
            const onConnect = () => {
                socket.emit('agent_connect', {
                    agentId: user.uid,
                    agentName: user.displayName || user.email,
                    agentEmail: user.email,
                });
            };

            const onAgentConnected = () => {
                toast.success('Connected to chat system');
                socket.emit('agent_get_queue');
                socket.emit('agent_get_sessions');
            };

            const onQueueData = (data: { queue: QueueItem[] }) => setQueue(data.queue);
            const onActiveSessions = (data: { sessions: ActiveSession[] }) => setActiveSessions(data.sessions);
            const onChatAccepted = (data: any) => {
                setActiveSessions(prev => [...prev, data]);
                setSelectedSession(data.sessionId);
                toast.success(`Chat accepted with ${data.customer.userName}`);
            };
            const onCustomerMessage = (data: { sessionId: string; message: Message }) => {
                setActiveSessions(prev => prev.map(session =>
                    session.id === data.sessionId
                        ? { ...session, messages: [...(session.messages || []), data.message] }
                        : session
                ));
            };
            const onCustomerTyping = (data: { sessionId: string; isTyping: boolean }) => setCustomerTyping(prev => ({ ...prev, [data.sessionId]: data.isTyping }));
            const onSessionEnded = (data: { sessionId: string }) => {
                setActiveSessions(prev => prev.filter(s => s.id !== data.sessionId));
                if (selectedSession === data.sessionId) setSelectedSession(null);
            };
            const onError = (error: { message: string }) => toast.error(error.message);

            socket.on('connect', onConnect);
            socket.on('agent_connected', onAgentConnected);
            socket.on('queue_data', onQueueData);
            socket.on('active_sessions', onActiveSessions);
            socket.on('chat_accepted', onChatAccepted);
            socket.on('customer_message', onCustomerMessage);
            socket.on('customer_typing_status', onCustomerTyping);
            socket.on('session_ended', onSessionEnded);
            socket.on('error', onError);

            return () => {
                socket.off('connect', onConnect);
                socket.off('agent_connected', onAgentConnected);
                socket.off('queue_data', onQueueData);
                socket.off('active_sessions', onActiveSessions);
                socket.off('chat_accepted', onChatAccepted);
                socket.off('customer_message', onCustomerMessage);
                socket.off('customer_typing_status', onCustomerTyping);
                socket.off('session_ended', onSessionEnded);
                socket.off('error', onError);
            };
        };

        const cleanupPromise = setup();

        return () => {
            // cleanupPromise may return a cleanup function, but socket listeners are removed in returned function above
        };
    }, [user]);

    useEffect(() => {
        if (activeTab === 'approvals') {
            fetchPendingProperties();
        }
    }, [activeTab]);

    const fetchPendingProperties = async () => {
        try {
            const { backendApi } = await import('@/lib/backendApi');
            const res = await backendApi.employee.getPendingProperties();
            if (res.success) {
                setPendingProperties(res.data.properties);
            }
        } catch (error) {
            console.error('Failed to fetch pending properties', error);
            // toast.error('Failed to load pending approvals');
        }
    };

    const handleApproveProperty = async (id: string) => {
        try {
            const { backendApi } = await import('@/lib/backendApi');
            const res = await backendApi.employee.approveProperty(id);
            if (res.success) {
                toast.success('Property approved successfully');
                setPendingProperties(prev => prev.filter(p => p._id !== id));
            }
        } catch (error) {
            toast.error('Failed to approve property');
        }
    };

    const handleRejectProperty = async (id: string) => {
        const reason = prompt('Enter rejection reason:');
        if (!reason) return;

        try {
            const { backendApi } = await import('@/lib/backendApi');
            const res = await backendApi.employee.rejectProperty(id, reason);
            if (res.success) {
                toast.success('Property rejected');
                setPendingProperties(prev => prev.filter(p => p._id !== id));
            }
        } catch (error) {
            toast.error('Failed to reject property');
        }
    };

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

                {/* Tabs */}
                <div className="flex space-x-4 mt-6 border-b border-gray-200 dark:border-gray-800">
                    <button
                        onClick={() => setActiveTab('chat')}
                        className={`pb-2 px-4 font-medium ${activeTab === 'chat' ? 'text-purple-600 border-b-2 border-purple-600' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        Live Chat
                    </button>
                    <button
                        onClick={() => setActiveTab('approvals')}
                        className={`pb-2 px-4 font-medium ${activeTab === 'approvals' ? 'text-purple-600 border-b-2 border-purple-600' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        Pending Approvals
                        {pendingProperties.length > 0 && (
                            <span className="ml-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">{pendingProperties.length}</span>
                        )}
                    </button>
                </div>
            </div>

            {activeTab === 'chat' ? (
                <div className="flex h-[calc(100vh-140px)]">
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
            ) : (
                <div className="p-6 h-[calc(100vh-140px)] overflow-y-auto">
                    <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">Pending Property Approvals</h2>

                    {pendingProperties.length === 0 ? (
                        <div className="text-center py-10 text-gray-500">No pending properties to review.</div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {pendingProperties.map((property) => (
                                <div key={property._id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col">
                                    <div className="h-48 bg-gray-200 relative">
                                        {property.photos?.[0] ? (
                                            <img src={property.photos[0]} alt={property.title} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="flex items-center justify-center h-full text-gray-400">No Image</div>
                                        )}
                                        <div className="absolute top-2 right-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded shadow">Pending</div>
                                    </div>
                                    <div className="p-4 flex-1">
                                        <h3 className="font-bold text-lg mb-1 truncate text-gray-900 dark:text-white">{property.title}</h3>
                                        <p className="text-sm text-gray-500 mb-2 truncate">{property.location}, {property.city}</p>
                                        <div className="flex justify-between items-center mb-4">
                                            <span className="font-bold text-purple-600">₹{property.price.toLocaleString()}</span>
                                            <span className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-gray-600 dark:text-gray-300 capitalize">{property.propertyType}</span>
                                        </div>
                                        <p className="text-xs text-gray-500 mb-4 line-clamp-2">{property.description}</p>

                                        <div className="flex gap-2 mt-auto">
                                            <button
                                                onClick={() => handleApproveProperty(property._id)}
                                                className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg text-sm font-medium transition-colors"
                                            >
                                                Approve
                                            </button>
                                            <button
                                                onClick={() => handleRejectProperty(property._id)}
                                                className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg text-sm font-medium transition-colors"
                                            >
                                                Reject
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
