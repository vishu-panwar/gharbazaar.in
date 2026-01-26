'use client';

import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Minimize2, Send, User, Bot, ArrowLeft, FileUp, Paperclip, Image as ImageIcon, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useSocket } from '@/contexts/SocketContext';
import { useToast } from '@/components/Toast/ToastProvider';
import { backendApi } from '@/lib/backendApi';
import { faqKnowledgeBase, getCategoriesByRole, getCategory, getSubCategory, type FAQCategory, type FAQSubCategory } from '@/lib/faqKnowledgeBase';

type ChatMode = 'categories' | 'subcategories' | 'resolution' | 'agent-request' | 'agent-chat';

interface Message {
    role: 'user' | 'bot' | 'agent';
    content: string;
    timestamp: Date;
}

interface TicketData {
    id?: string;
    categoryId: string;
    subCategoryId: string;
    categoryTitle: string;
    subCategoryTitle: string;
    userProblem?: string;
}

interface SupportChatbotProps {
    userRole?: 'buyer' | 'seller';
}

export default function SupportChatbot({ userRole = 'buyer' }: SupportChatbotProps) {
    const { user } = useAuth();
    const { socket, connected } = useSocket();
    const toast = useToast();

    // UI State
    const [isOpen, setIsOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [hasUnreadMessage, setHasUnreadMessage] = useState(false);
    const [isBlinking, setIsBlinking] = useState(false);

    // Chat State
    const [chatMode, setChatMode] = useState<ChatMode>('categories');
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputMessage, setInputMessage] = useState('');

    // Navigation State
    const [selectedCategory, setSelectedCategory] = useState<FAQCategory | null>(null);
    const [selectedSubCategory, setSelectedSubCategory] = useState<FAQSubCategory | null>(null);

    // Agent/Ticket State
    const [ticketData, setTicketData] = useState<TicketData | null>(null);
    const [isAgentConnected, setIsAgentConnected] = useState(false);
    const [agentName, setAgentName] = useState('');
    const [uploadingFile, setUploadingFile] = useState(false);

    // Feedback State
    const [showFeedback, setShowFeedback] = useState(false);
    const [feedbackRating, setFeedbackRating] = useState(0);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Auto-scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Focus input when opened
    useEffect(() => {
        if (isOpen && !isMinimized && chatMode === 'agent-chat') {
            inputRef.current?.focus();
        }
    }, [isOpen, isMinimized, chatMode]);

    // Welcome message
    useEffect(() => {
        if (isOpen && messages.length === 0) {
            addBotMessage(`Hi! I'm here to help you with any questions or issues. I have solutions for common problems organized by category. Let's find what you're looking for!`);
        }
    }, [isOpen]);

    // Socket.IO listeners for agent communication
    useEffect(() => {
        if (!socket || !connected) return;

        const handleTicketAssigned = (data: any) => {
            if (data.userId === user?.uid) {
                setIsAgentConnected(true);
                setAgentName(data.agentName || 'Support Agent');
                setChatMode('agent-chat');
                addBotMessage(`${data.agentName || 'A support agent'} has joined the conversation and will assist you shortly.`, 'agent');
            }
        };

        const handleAgentMessage = (data: any) => {
            if (data.ticketId === ticketData?.id) {
                addBotMessage(data.message, 'agent');

                // Show notification if chatbot is closed
                if (!isOpen) {
                    setHasUnreadMessage(true);
                    setIsBlinking(true);
                }
            }
        };

        const handleTicketClosed = (data: any) => {
            if (data.ticketId === ticketData?.id) {
                setShowFeedback(true);
                setIsAgentConnected(false);
            }
        };

        socket.on('ticket:assigned', handleTicketAssigned);
        socket.on('ticket:message', handleAgentMessage);
        socket.on('ticket:closed', handleTicketClosed);

        return () => {
            socket.off('ticket:assigned', handleTicketAssigned);
            socket.off('ticket:message', handleAgentMessage);
            socket.off('ticket:closed', handleTicketClosed);
        };
    }, [socket, connected, user, ticketData, isOpen]);

    const addBotMessage = (content: string, role: 'bot' | 'agent' = 'bot') => {
        setMessages(prev => [...prev, {
            role,
            content,
            timestamp: new Date()
        }]);
    };

    const addUserMessage = (content: string) => {
        setMessages(prev => [...prev, {
            role: 'user',
            content,
            timestamp: new Date()
        }]);
    };

    const handleCategoryClick = (category: FAQCategory) => {
        setSelectedCategory(category);
        setChatMode('subcategories');
        addUserMessage(category.title);
        addBotMessage(`Great! Here are specific topics within ${category.title}:`);
    };

    const handleSubCategoryClick = (subCategory: FAQSubCategory) => {
        setSelectedSubCategory(subCategory);
        setChatMode('resolution');
        addUserMessage(subCategory.title);
        addBotMessage(subCategory.resolution);
    };

    const handleHelpful = () => {
        addUserMessage('That was helpful, thanks!');
        addBotMessage('Glad I could help! Feel free to ask if you have any other questions.');

        // Reset to categories after 2 seconds
        setTimeout(() => {
            resetChat();
        }, 2000);
    };

    const handleAgentHelp = () => {
        if (!selectedCategory || !selectedSubCategory) return;

        setTicketData({
            categoryId: selectedCategory.id,
            subCategoryId: selectedSubCategory.id,
            categoryTitle: selectedCategory.title,
            subCategoryTitle: selectedSubCategory.title,
        });

        setChatMode('agent-request');
        addUserMessage('I need to speak with an agent');
        addBotMessage('I understand you need further assistance. Please describe your problem in detail so our support team can help you better.');
    };

    const handleSubmitProblem = async () => {
        if (!inputMessage.trim() || !ticketData) return;

        const problem = inputMessage.trim();
        addUserMessage(problem);
        setInputMessage('');

        try {
            // Create ticket via API
            const response = await backendApi.tickets.create({
                categoryId: ticketData.categoryId,
                subCategoryId: ticketData.subCategoryId,
                categoryTitle: ticketData.categoryTitle,
                subCategoryTitle: ticketData.subCategoryTitle,
                problem,
                userRole
            });

            if (!response.success) throw new Error(response.error || 'Failed to create ticket');

            const ticket = response.data.ticket;
            const ticketId = ticket._id || ticket.id;

            setTicketData(prev => prev ? { ...prev, id: ticketId, userProblem: problem } : null);

            addBotMessage('Thank you! I\'ve created a support ticket and notified our team. An agent will join this conversation shortly to assist you.');

            setChatMode('agent-chat');
        } catch (error) {
            console.error('Error creating ticket:', error);
            toast.error('Failed to create support ticket. Please try again.');
        }
    };

    const handleSendAgentMessage = async () => {
        if (!inputMessage.trim() || !ticketData?.id) return;

        const message = inputMessage.trim();
        addUserMessage(message);
        setInputMessage('');

        try {
            await backendApi.tickets.sendMessage(ticketData.id, message);
        } catch (error) {
            console.error('Error sending message:', error);
            toast.error('Failed to send message');
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !ticketData?.id) return;

        setUploadingFile(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await backendApi.tickets.uploadFile(ticketData.id, file);

            if (!response.success) throw new Error(response.error || 'Upload failed');

            addUserMessage(`📎 Sent file: ${file.name}`);
            toast.success('File uploaded successfully');
        } catch (error) {
            console.error('Error uploading file:', error);
            toast.error('Failed to upload file');
        } finally {
            setUploadingFile(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const handleSubmitFeedback = async () => {
        if (!ticketData?.id || feedbackRating === 0) return;

        try {
            await backendApi.tickets.submitFeedback(ticketData.id, feedbackRating);

            toast.success('Thank you for your feedback!');
            setShowFeedback(false);
            resetChat();
            setIsOpen(false);
        } catch (error) {
            console.error('Error submitting feedback:', error);
            toast.error('Failed to submit feedback');
        }
    };

    const resetChat = () => {
        setChatMode('categories');
        setMessages([]);
        setSelectedCategory(null);
        setSelectedSubCategory(null);
        setTicketData(null);
        setIsAgentConnected(false);
        setAgentName('');
    };

    const handleOpen = () => {
        setIsOpen(true);
        setHasUnreadMessage(false);
        setIsBlinking(false);
    };

    const handleClose = () => {
        if (chatMode === 'agent-chat' && isAgentConnected) {
            if (confirm('You have an active chat with an agent. Are you sure you want to close?')) {
                setIsOpen(false);
            }
        } else {
            setIsOpen(false);
        }
    };

    const handleBack = () => {
        if (chatMode === 'subcategories') {
            setChatMode('categories');
            setSelectedCategory(null);
        } else if (chatMode === 'resolution') {
            setChatMode('subcategories');
            setSelectedSubCategory(null);
        }
    };

    // Don't show chatbot if user not logged in
    if (!user) return null;

    // Don't show outside dashboard
    if (typeof window !== 'undefined' && !window.location.pathname.includes('/dashboard')) {
        return null;
    }

    const categories = getCategoriesByRole(userRole);

    // Feedback Modal
    if (showFeedback) {
        return (
            <div className="fixed bottom-6 right-6 w-[400px] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 p-6 z-50">
                <h3 className="text-lg font-semibold mb-4">How was your experience?</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Please rate your experience with our support agent
                </p>

                <div className="flex justify-center gap-2 mb-6">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            onClick={() => setFeedbackRating(star)}
                            className="text-3xl transition-transform hover:scale-110"
                        >
                            {star <= feedbackRating ? '⭐' : '☆'}
                        </button>
                    ))}
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={() => { setShowFeedback(false); resetChat(); }}
                        className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                        Skip
                    </button>
                    <button
                        onClick={handleSubmitFeedback}
                        disabled={feedbackRating === 0}
                        className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-lg hover:from-purple-600 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Submit
                    </button>
                </div>
            </div>
        );
    }

    return (
        <>
            {/* Floating Button */}
            {!isOpen && (
                <button
                    onClick={handleOpen}
                    data-chatbot-trigger
                    className={`fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 z-50 ${isBlinking ? 'animate-pulse' : ''
                        }`}
                    aria-label="Open Support Chat"
                >
                    <MessageCircle size={28} />
                    {hasUnreadMessage && (
                        <span className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full border-2 border-white flex items-center justify-center text-xs font-bold">
                            1
                        </span>
                    )}
                </button>
            )}

            {/* Chat Window */}
            {isOpen && (
                <div
                    className={`fixed bottom-4 right-4 w-[400px] bg-white dark:bg-gray-900 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 flex flex-col overflow-hidden z-50 transition-all duration-300 ${isMinimized ? 'h-14' : 'h-[550px]'
                        }`}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between px-3 py-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white">
                        <div className="flex items-center gap-2">
                            {(chatMode === 'subcategories' || chatMode === 'resolution') && !isAgentConnected && (
                                <button onClick={handleBack} className="p-0.5 hover:bg-white/20 rounded transition-all">
                                    <ArrowLeft size={18} />
                                </button>
                            )}
                            <Bot size={20} />
                            <div>
                                <h3 className="text-sm font-semibold">
                                    {isAgentConnected ? agentName : 'Support Assistant'}
                                </h3>
                                <p className="text-[10px] opacity-90">
                                    {isAgentConnected ? 'Human Agent' : 'Quick Help & Support'}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <button
                                onClick={() => setIsMinimized(!isMinimized)}
                                className="p-1 hover:bg-white/20 rounded transition-colors"
                            >
                                <Minimize2 size={16} />
                            </button>
                            <button
                                onClick={handleClose}
                                className="p-1 hover:bg-white/20 rounded transition-colors"
                            >
                                <X size={16} />
                            </button>
                        </div>
                    </div>

                    {!isMinimized && (
                        <>
                            {/* Unified Scrollable Content Area */}
                            <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-gray-50 dark:bg-gray-800 custom-scrollbar">
                                {/* Messages */}
                                {messages.map((msg, index) => (
                                    <div
                                        key={index}
                                        className={`flex items-start gap-1.5 ${msg.role === 'user' ? 'flex-row-reverse' : ''
                                            }`}
                                    >
                                        <div
                                            className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'user'
                                                ? 'bg-indigo-500'
                                                : msg.role === 'agent'
                                                    ? 'bg-green-500'
                                                    : 'bg-gradient-to-br from-purple-500 to-indigo-600'
                                                }`}
                                        >
                                            {msg.role === 'user' ? (
                                                <User size={16} className="text-white" />
                                            ) : (
                                                <Bot size={16} className="text-white" />
                                            )}
                                        </div>
                                        <div
                                            className={`max-w-[75%] px-3 py-2 rounded-xl text-sm whitespace-pre-wrap leading-relaxed ${msg.role === 'user'
                                                ? 'bg-indigo-500 text-white rounded-tr-none shadow-sm'
                                                : 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-tl-none shadow-sm border border-gray-100 dark:border-gray-600'
                                                }`}
                                        >
                                            {msg.content}
                                        </div>
                                    </div>
                                ))}

                                {/* Categories Grid */}
                                {chatMode === 'categories' && (
                                    <div className="grid grid-cols-2 gap-1.5 mt-3">
                                        {categories.map((category) => (
                                            <button
                                                key={category.id}
                                                onClick={() => handleCategoryClick(category)}
                                                className="group p-2 bg-white dark:bg-gray-700 hover:bg-gradient-to-br hover:from-purple-50 hover:to-indigo-50 dark:hover:from-gray-600 dark:hover:to-gray-600 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-purple-300 dark:hover:border-purple-500 text-left transition-all duration-200 shadow-sm hover:shadow-md"
                                            >
                                                <div className="text-xl mb-0.5 group-hover:scale-105 transition-transform duration-200">{category.icon}</div>
                                                <div className="text-[10px] font-semibold text-gray-900 dark:text-white leading-tight">
                                                    {category.title}
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                )}

                                {/* Subcategories List */}
                                {chatMode === 'subcategories' && selectedCategory && (
                                    <div className="space-y-1.5 mt-3">
                                        {selectedCategory.subCategories.map((sub) => (
                                            <button
                                                key={sub.id}
                                                onClick={() => handleSubCategoryClick(sub)}
                                                className="w-full p-2.5 bg-white dark:bg-gray-700 hover:bg-gradient-to-r hover:from-purple-50 hover:to-indigo-50 dark:hover:from-gray-600 dark:hover:to-gray-600 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-purple-300 dark:hover:border-purple-500 text-left transition-all duration-200 shadow-sm hover:shadow-md"
                                            >
                                                <span className="text-xs font-medium text-gray-900 dark:text-white leading-relaxed">
                                                    {sub.title}
                                                </span>
                                            </button>
                                        ))}
                                    </div>
                                )}

                                {/* Resolution Actions */}
                                {chatMode === 'resolution' && (
                                    <div className="flex gap-2 mt-3">
                                        <button
                                            onClick={handleHelpful}
                                            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-sm bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-lg transition-all duration-200 shadow-sm hover:shadow-md font-medium"
                                        >
                                            <CheckCircle size={16} />
                                            Helpful
                                        </button>
                                        <button
                                            onClick={handleAgentHelp}
                                            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-sm bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-lg transition-all duration-200 shadow-sm hover:shadow-md font-medium"
                                        >
                                            <AlertCircle size={16} />
                                            Agent Help
                                        </button>
                                    </div>
                                )}

                                <div ref={messagesEndRef} />
                            </div>

                            {/* Input Area */}
                            <div className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
                                {/* Problem Description Input */}
                                {chatMode === 'agent-request' && (
                                    <div className="p-2.5">
                                        <div className="flex items-center gap-1.5">
                                            <input
                                                ref={inputRef}
                                                type="text"
                                                value={inputMessage}
                                                onChange={(e) => setInputMessage(e.target.value)}
                                                onKeyPress={(e) => e.key === 'Enter' && handleSubmitProblem()}
                                                placeholder="Describe your problem..."
                                                className="flex-1 px-3 py-2 text-sm bg-gray-100 dark:bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 dark:text-white"
                                            />
                                            <button
                                                onClick={handleSubmitProblem}
                                                disabled={!inputMessage.trim()}
                                                className="p-2 bg-gradient-to-br from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-all"
                                            >
                                                <Send size={18} />
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* Agent Chat Input */}
                                {chatMode === 'agent-chat' && (
                                    <div className="p-2.5">
                                        {isAgentConnected && (
                                            <div className="mb-2 px-2.5 py-1.5 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-center gap-1.5 text-xs text-green-800 dark:text-green-200">
                                                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                                                Connected to {agentName}
                                            </div>
                                        )}
                                        <div className="flex items-center gap-1.5">
                                            <input
                                                type="file"
                                                ref={fileInputRef}
                                                onChange={handleFileUpload}
                                                className="hidden"
                                                accept="image/*,video/*,.pdf,.doc,.docx"
                                            />
                                            <button
                                                onClick={() => fileInputRef.current?.click()}
                                                disabled={uploadingFile}
                                                className="p-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50"
                                            >
                                                <Paperclip size={18} />
                                            </button>
                                            <input
                                                ref={inputRef}
                                                type="text"
                                                value={inputMessage}
                                                onChange={(e) => setInputMessage(e.target.value)}
                                                onKeyPress={(e) => e.key === 'Enter' && handleSendAgentMessage()}
                                                placeholder="Type your message..."
                                                className="flex-1 px-3 py-2 text-sm bg-gray-100 dark:bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 dark:text-white"
                                            />
                                            <button
                                                onClick={handleSendAgentMessage}
                                                disabled={!inputMessage.trim()}
                                                className="p-2 bg-gradient-to-br from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-all"
                                            >
                                                <Send size={18} />
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div>
            )}
        </>
    );
}
