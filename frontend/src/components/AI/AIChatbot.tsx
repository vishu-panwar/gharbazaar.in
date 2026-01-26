'use client';

import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Minimize2, Send, User, Bot, Loader2, UserCog, AlertCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useSocket } from '@/contexts/SocketContext';
import { useToast } from '@/components/Toast/ToastProvider';
import { optimizedChatbotApi, debounce } from '@/lib/optimizedApi';
import { backendApi } from '@/lib/backendApi';
import ChatMessage from './ChatMessage';
import QuickActions from './QuickActions';
import AgentRating from './AgentRating';

interface Message {
    role: 'user' | 'assistant' | 'agent';
    content: string;
    timestamp: string;
}

interface AIChatbotProps {
    userRole?: 'buyer' | 'seller' | 'admin';
    currentPage?: string;
    propertyId?: string;
}

export default function AIChatbot({ userRole = 'buyer', currentPage, propertyId }: AIChatbotProps) {
    const { user } = useAuth();
    const { socket, connected } = useSocket();
    const toast = useToast();

    const [isOpen, setIsOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputMessage, setInputMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [isAgentMode, setIsAgentMode] = useState(false);
    const [agentName, setAgentName] = useState('');
    const [showRating, setShowRating] = useState(false);
    const [sessionId, setSessionId] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            optimizedChatbotApi.cancelAll();
        };
    }, []);

    // Welcome message
    useEffect(() => {
        if (isOpen && messages.length === 0) {
            const welcomeMessage: Message = {
                role: 'assistant',
                content: userRole === 'buyer'
                    ? "Hi! I'm your GharBazaar AI assistant. I can help you search for properties, understand pricing, schedule visits, and answer any questions about our platform. How can I help you today?"
                    : "Hi! I'm your GharBazaar AI assistant for sellers. I can help you optimize your listings, understand buyer behavior, manage leads, and improve your property visibility. What would you like to know?",
                timestamp: new Date().toISOString(),
            };
            setMessages([welcomeMessage]);
        }
    }, [isOpen, userRole]);

    // Auto-scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Focus input when opened
    useEffect(() => {
        if (isOpen && !isMinimized) {
            inputRef.current?.focus();
        }
    }, [isOpen, isMinimized]);

    // Listen for agent events via Socket.IO
    useEffect(() => {
        if (!socket || !connected) return;

        // Listen for agent joining
        const handleAgentJoined = (data: any) => {
            if (data.userId === user?.uid) {
                setIsAgentMode(true);
                setAgentName(data.agentName);
                setSessionId(data.sessionId);

                const agentMessage: Message = {
                    role: 'agent',
                    content: data.message,
                    timestamp: new Date().toISOString(),
                };

                setMessages(prev => [...prev, agentMessage]);
            }
        };

        // Listen for agent messages
        const handleAgentMessage = (data: any) => {
            if (data.sessionId === sessionId) {
                setMessages(prev => [...prev, data.message]);
            }
        };

        // Listen for session ended
        const handleSessionEnded = (data: any) => {
            if (data.sessionId === sessionId) {
                setShowRating(true);
                setIsAgentMode(false);
            }
        };

        // Listen for agent typing
        const handleAgentTyping = (data: any) => {
            if (data.sessionId === sessionId) {
                setIsTyping(data.isTyping);
            }
        };

        // Register Socket.IO event listeners
        socket.on('agent_joined', handleAgentJoined);
        socket.on('agent_message', handleAgentMessage);
        socket.on('session_ended', handleSessionEnded);
        socket.on('agent_typing_status', handleAgentTyping);

        return () => {
            // Cleanup listeners
            socket.off('agent_joined', handleAgentJoined);
            socket.off('agent_message', handleAgentMessage);
            socket.off('session_ended', handleSessionEnded);
            socket.off('agent_typing_status', handleAgentTyping);
        };
    }, [socket, connected, user, sessionId]);

    const handleSendMessage = async (message?: string) => {
        const content = message || inputMessage.trim();
        if (!content) return;

        const userMessage: Message = {
            role: 'user',
            content,
            timestamp: new Date().toISOString(),
        };

        // Optimistic UI update
        setMessages(prev => [...prev, userMessage]);
        setInputMessage('');
        setIsTyping(true);
        setError(null);

        try {
            const response = await optimizedChatbotApi.ask({
                question: content,
                conversationHistory: messages.map(m => ({
                    role: m.role === 'agent' ? 'assistant' : m.role,
                    content: m.content,
                })),
                currentPage,
                propertyId,
            });

            if (response.success && response.data) {
                const aiMessage: Message = {
                    role: 'assistant',
                    content: (response.data as any).answer,
                    timestamp: new Date().toISOString(),
                };

                setMessages(prev => [...prev, aiMessage]);

                // Check if escalation needed
                if ((response.data as any).needsEscalation) {
                    setTimeout(() => handleRequestAgent(), 1000);
                }
            } else {
                throw new Error(response.error || 'Failed to get response');
            }
        } catch (error: any) {
            console.error('Chatbot error:', error);
            setError(error?.message || 'Failed to get response');
            toast.error('Failed to send message. Please try again.');

            // Remove the user message on error
            setMessages(prev => prev.filter(m => m !== userMessage));
        } finally {
            setIsTyping(false);
        }
    };

    const handleRequestAgent = async () => {
        try {
            const response = await backendApi.chatbot.requestAgent({
                conversationHistory: messages,
                reason: 'User requested human assistance',
            });

            if (response.success) {
                setIsAgentMode(true);
                setAgentName(response.data.message || 'Agent');

                const agentMessage: Message = {
                    role: 'agent',
                    content: response.data.message || 'An agent will assist you shortly.',
                    timestamp: new Date().toISOString(),
                };

                setMessages(prev => [...prev, agentMessage]);
                toast.success('Connected to human agent');
            }
        } catch (error: any) {
            console.error('Agent handoff error:', error);
            toast.error('Failed to connect to agent');
        }
    };

    const handleEndChat = () => {
        if (isAgentMode) {
            setShowRating(true);
        } else {
            handleClose();
        }
    };

    const handleRatingSubmit = async (rating: number, feedback?: string) => {
        try {
            await backendApi.chatbot.rate({
                sessionId,
                rating,
                feedback,
                type: isAgentMode ? 'agent' : 'ai',
            });

            setShowRating(false);
            toast.success('Thank you for your feedback!');
            handleClose();
        } catch (error) {
            console.error('Rating error:', error);
            toast.error('Failed to submit rating');
        }
    };

    const handleClose = () => {
        setIsOpen(false);
        setMessages([]);
        setIsAgentMode(false);
        setAgentName('');
        setSessionId(null);
    };

    const handleQuickActionClick = (action: string) => {
        handleSendMessage(action);
    };

    if (!user) return null;

    if (showRating) {
        return (
            <AgentRating
                onClose={() => setShowRating(false)}
                onSubmit={handleRatingSubmit}
                agentName={agentName}
            />
        );
    }

    return (
        <>
            {/* Floating Button */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 z-50 group"
                    aria-label="Open AI Assistant"
                >
                    <MessageCircle size={28} className="group-hover:scale-110 transition-transform" />
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse"></span>
                </button>
            )}

            {/* Chat Window */}
            {isOpen && (
                <div
                    className={`fixed bottom-6 right-6 w-[420px] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 flex flex-col overflow-hidden z-50 transition-all duration-300 ${isMinimized ? 'h-16' : 'h-[600px]'
                        }`}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white">
                        <div className="flex items-center gap-3">
                            {isAgentMode ? (
                                <UserCog size={24} className="animate-pulse" />
                            ) : (
                                <Bot size={24} />
                            )}
                            <div>
                                <h3 className="font-semibold">
                                    {isAgentMode ? agentName : 'GharBazaar AI Assistant'}
                                </h3>
                                <p className="text-xs opacity-90">
                                    {isAgentMode ? 'Human Agent' : 'Always here to help'}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setIsMinimized(!isMinimized)}
                                className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
                            >
                                <Minimize2 size={18} />
                            </button>
                            <button
                                onClick={handleEndChat}
                                className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
                            >
                                <X size={18} />
                            </button>
                        </div>
                    </div>

                    {!isMinimized && (
                        <>
                            {/* Messages */}
                            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-800">
                                {messages.map((msg, index) => (
                                    <ChatMessage key={index} message={msg} />
                                ))}

                                {isTyping && (
                                    <div className="flex items-start gap-2">
                                        <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
                                            <Bot size={18} className="text-white" />
                                        </div>
                                        <div className="bg-white dark:bg-gray-700 px-4 py-3 rounded-2xl rounded-tl-none">
                                            <div className="flex space-x-2">
                                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div ref={messagesEndRef} />
                            </div>

                            {/* Quick Actions */}
                            {messages.length <= 1 && (
                                <QuickActions
                                    userRole={userRole}
                                    onClick={handleQuickActionClick}
                                />
                            )}

                            {/* Agent Mode Notice */}
                            {isAgentMode && (
                                <div className="px-4 py-2 bg-green-50 dark:bg-green-900/20 border-t border-green-200 dark:border-green-800 flex items-center gap-2">
                                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                    <span className="text-sm text-green-800 dark:text-green-200">
                                        Connected to human agent
                                    </span>
                                </div>
                            )}

                            {/* Input */}
                            <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
                                <div className="flex items-center gap-2">
                                    <input
                                        ref={inputRef}
                                        type="text"
                                        value={inputMessage}
                                        onChange={(e) => setInputMessage(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                        placeholder="Ask me anything..."
                                        className="flex-1 px-4 py-3 bg-gray-100 dark:bg-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 dark:text-white placeholder-gray-500"
                                        disabled={isTyping}
                                    />
                                    <button
                                        onClick={() => handleSendMessage()}
                                        disabled={!inputMessage.trim() || isTyping}
                                        className="p-3 bg-gradient-to-br from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 disabled:from-gray-300 disabled:to-gray-400 text-white rounded-xl transition-all disabled:cursor-not-allowed"
                                    >
                                        {isTyping ? (
                                            <Loader2 size={20} className="animate-spin" />
                                        ) : (
                                            <Send size={20} />
                                        )}
                                    </button>
                                </div>

                                {!isAgentMode && (
                                    <button
                                        onClick={handleRequestAgent}
                                        className="w-full mt-2 text-sm text-purple-600 dark:text-purple-400 hover:underline"
                                    >
                                        Need to speak with a human agent?
                                    </button>
                                )}
                            </div>
                        </>
                    )}
                </div>
            )}
        </>
    );
}
