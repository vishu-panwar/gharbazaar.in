'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useSocket } from '@/contexts/SocketContext';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/Toast/ToastProvider';
import { Send, Paperclip, Image as ImageIcon, Smile, MoreVertical, Phone, Video, Download, FileText, Check } from 'lucide-react';
import { backendApi } from '@/lib/backendApi';
import EmojiPicker from './EmojiPicker';
import FileUpload from './FileUpload';
import MessageActions from './MessageActions';
import ImagePreview from './ImagePreview';

interface Message {
    id: string;
    conversationId: string;
    senderId: string;
    senderEmail: string;
    content: string;
    type: 'text' | 'image' | 'file';
    read: boolean;
    edited?: boolean;
    deleted?: boolean;
    fileUrl?: string;
    thumbnailUrl?: string;
    fileName?: string;
    fileSize?: number;
    createdAt: string;
}

interface ChatWindowProps {
    conversationId: string;
    otherUser: {
        id: string;
        name: string;
        email?: string;
        avatar?: string;
        onlineStatus?: string;
    };
    onClose?: () => void;
}

export default function ChatWindow({ conversationId, otherUser, onClose }: ChatWindowProps) {
    const { user } = useAuth();
    const toast = useToast();
    const {
        sendMessage,
        sendTyping,
        markAsRead,
        editMessage,
        deleteMessage,
        joinConversation,
        leaveConversation,
        onNewMessage,
        onTyping,
        onMessageEdited,
        onMessageDeleted
    } = useSocket();

    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [loading, setLoading] = useState(true);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [showFileUpload, setShowFileUpload] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isUploading, setIsUploading] = useState(false);
    const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
    const [editingContent, setEditingContent] = useState('');
    const [previewImage, setPreviewImage] = useState<string | null>(null);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const typingTimeoutRef = useRef<NodeJS.Timeout>();

    // Fetch existing messages
    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const response = await backendApi.chat.getMessages(conversationId);

                if (response.success) {
                    setMessages(response.data.messages || []);
                } else {
                    toast.error('Failed to load messages');
                }
            } catch (error) {
                console.error('Error fetching messages:', error);
                toast.error('Unable to load conversation. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchMessages();
    }, [conversationId, user]);

    // Join conversation and listen for events
    useEffect(() => {
        joinConversation(conversationId);

        const handleNewMessage = (message: Message) => {
            if (message.conversationId === conversationId) {
                setMessages(prev => [...prev, message]);
                scrollToBottom();

                // Mark as read if from other user
                if (message.senderId !== user?.uid) {
                    markAsRead(conversationId);
                }
            }
        };

        const handleTyping = (data: { userId: string; isTyping: boolean }) => {
            if (data.userId !== user?.uid) {
                setIsTyping(data.isTyping);
            }
        };

        const handleMessageEdited = (updatedMessage: Message) => {
            setMessages(prev => prev.map(msg =>
                msg.id === updatedMessage.id ? { ...msg, ...updatedMessage } : msg
            ));
        };

        const handleMessageDeleted = (data: { id: string; conversationId: string }) => {
            setMessages(prev => prev.map(msg =>
                msg.id === data.id ? { ...msg, content: '[Message deleted]', deleted: true } : msg
            ));
        };

        const unsubMessage = onNewMessage(handleNewMessage);
        const unsubTyping = onTyping(handleTyping);
        const unsubEdited = onMessageEdited?.(handleMessageEdited);
        const unsubDeleted = onMessageDeleted?.(handleMessageDeleted);

        return () => {
            leaveConversation(conversationId);
            if (unsubMessage) unsubMessage();
            if (unsubTyping) unsubTyping();
            if (unsubEdited) unsubEdited();
            if (unsubDeleted) unsubDeleted();
        };
    }, [conversationId, user, joinConversation, leaveConversation, onNewMessage, onTyping, onMessageEdited, onMessageDeleted, markAsRead]);

    // Auto-scroll to bottom
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleSend = () => {
        if (!newMessage.trim()) return;

        try {
            sendMessage(conversationId, newMessage);
            setNewMessage('');
            sendTyping(conversationId, false);
            setShowEmojiPicker(false);
        } catch (error) {
            console.error('Error sending message:', error);
            toast.error('Failed to send message. Please try again.');
        }
    };

    const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewMessage(e.target.value);

        // Send typing indicator
        sendTyping(conversationId, true);

        // Clear previous timeout
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }

        // Set timeout to stop typing
        typingTimeoutRef.current = setTimeout(() => {
            sendTyping(conversationId, false);
        }, 1000);
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (editingMessageId) {
                handleSaveEdit();
            } else {
                handleSend();
            }
        }
    };

    const handleEmojiSelect = (emoji: string) => {
        setNewMessage(prev => prev + emoji);
        setShowEmojiPicker(false);
    };

    const handleFileSelect = async (file: File) => {
        setIsUploading(true);
        setShowFileUpload(false);

        try {
            const response = await backendApi.chat.uploadFile(
                file,
                conversationId,
                (progress) => setUploadProgress(progress)
            ) as any;

            if (response.success) {
                // Send message with file attachment
                const fileMessage = {
                    conversationId,
                    content: `📎 ${response.data.metadata.fileName}`,
                    type: response.data.metadata.fileType === 'image' ? 'image' : 'file',
                    fileUrl: response.data.url,
                    thumbnailUrl: response.data.thumbnailUrl,
                    fileName: response.data.metadata.fileName,
                    fileSize: response.data.metadata.fileSize,
                };

                // Use REST API for file messages
                await backendApi.chat.sendMessage(conversationId, JSON.stringify(fileMessage));
                toast.success('File uploaded successfully');
            }
        } catch (error) {
            console.error('Error uploading file:', error);
            toast.error('Failed to upload file');
        } finally {
            setIsUploading(false);
            setUploadProgress(0);
        }
    };

    const handleEditMessage = (messageId: string, content: string) => {
        setEditingMessageId(messageId);
        setEditingContent(content);
        setNewMessage(content);
    };

    const handleSaveEdit = async () => {
        if (!editingMessageId || !newMessage.trim()) return;

        try {
            editMessage(editingMessageId, newMessage);
            setEditingMessageId(null);
            setEditingContent('');
            setNewMessage('');
            toast.success('Message updated');
        } catch (error) {
            console.error('Error editing message:', error);
            toast.error('Failed to edit message');
        }
    };

    const handleCancelEdit = () => {
        setEditingMessageId(null);
        setEditingContent('');
        setNewMessage('');
    };

    const handleDeleteMessage = async (messageId: string) => {
        if (!confirm('Are you sure you want to delete this message?')) return;

        try {
            deleteMessage(messageId);
            toast.success('Message deleted');
        } catch (error) {
            console.error('Error deleting message:', error);
            toast.error('Failed to delete message');
        }
    };

    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
        });
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        if (date.toDateString() === today.toDateString()) {
            return 'Today';
        } else if (date.toDateString() === yesterday.toDateString()) {
            return 'Yesterday';
        } else {
            return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        }
    };

    const formatFileSize = (bytes: number) => {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    };

    return (
        <div className="flex flex-col h-full bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                <div className="flex items-center space-x-3">
                    <div className="relative">
                        <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-white font-semibold">
                            {otherUser.name.charAt(0).toUpperCase()}
                        </div>
                        {otherUser.onlineStatus === 'online' && (
                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full"></div>
                        )}
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">{otherUser.name}</h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            {otherUser.onlineStatus === 'online' ? 'Online' : 'Offline'}
                        </p>
                    </div>
                </div>

                <div className="flex items-center space-x-2">
                    <button className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors">
                        <Phone size={20} className="text-gray-600 dark:text-gray-400" />
                    </button>
                    <button className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors">
                        <Video size={20} className="text-gray-600 dark:text-gray-400" />
                    </button>
                    <button className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors">
                        <MoreVertical size={20} className="text-gray-600 dark:text-gray-400" />
                    </button>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50 dark:bg-gray-900">
                {loading ? (
                    <div className="flex items-center justify-center h-full">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
                    </div>
                ) : messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center">
                        <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
                            <Send size={32} className="text-gray-400" />
                        </div>
                        <p className="text-gray-500 dark:text-gray-400">No messages yet</p>
                        <p className="text-sm text-gray-400 dark:text-gray-500">Send a message to start the conversation</p>
                    </div>
                ) : (
                    <>
                        {messages.map((msg, index) => {
                            const isOwnMessage = msg.senderId === user?.uid;
                            const showDate = index === 0 || formatDate(messages[index - 1].createdAt) !== formatDate(msg.createdAt);

                            return (
                                <div key={msg.id}>
                                    {showDate && (
                                        <div className="flex justify-center my-4">
                                            <span className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded-full text-xs text-gray-600 dark:text-gray-400">
                                                {formatDate(msg.createdAt)}
                                            </span>
                                        </div>
                                    )}
                                    <div className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} group`}>
                                        <div className="flex items-start gap-2 max-w-xl">
                                            <div
                                                className={`px-4 py-2 rounded-2xl ${isOwnMessage
                                                    ? 'bg-green-500 text-white rounded-br-none'
                                                    : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 rounded-bl-none'
                                                    }`}
                                            >
                                                {msg.type === 'image' && msg.thumbnailUrl ? (
                                                    <div className="mb-2">
                                                        <img
                                                            src={msg.thumbnailUrl}
                                                            alt={msg.fileName || 'Image'}
                                                            className="max-w-sm rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                                                            onClick={() => setPreviewImage(msg.fileUrl || msg.thumbnailUrl || '')}
                                                        />
                                                    </div>
                                                ) : msg.type === 'file' && msg.fileUrl ? (
                                                    <a
                                                        href={msg.fileUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="flex items-center gap-2 p-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                                                    >
                                                        <FileText size={24} className="text-blue-500" />
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-sm font-medium truncate">{msg.fileName}</p>
                                                            {msg.fileSize && (
                                                                <p className="text-xs text-gray-500">{formatFileSize(msg.fileSize)}</p>
                                                            )}
                                                        </div>
                                                        <Download size={16} />
                                                    </a>
                                                ) : null}

                                                <p className={`break-words ${msg.deleted ? 'italic text-gray-500' : ''}`}>
                                                    {msg.content}
                                                    {msg.edited && !msg.deleted && (
                                                        <span className="text-xs ml-2 opacity-70">(edited)</span>
                                                    )}
                                                </p>

                                                <div className={`flex items-center justify-end mt-1 space-x-1 ${isOwnMessage ? 'text-green-100' : 'text-gray-500 dark:text-gray-400'
                                                    }`}>
                                                    <span className="text-xs">{formatTime(msg.createdAt)}</span>
                                                    {isOwnMessage && (
                                                        <span className="text-xs">
                                                            {msg.read ? '✓✓' : '✓'}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            {isOwnMessage && !msg.deleted && (
                                                <MessageActions
                                                    messageId={msg.id}
                                                    content={msg.content}
                                                    onEdit={() => handleEditMessage(msg.id, msg.content)}
                                                    onDelete={() => handleDeleteMessage(msg.id)}
                                                />
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                        {isTyping && (
                            <div className="flex justify-start">
                                <div className="bg-white dark:bg-gray-800 px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-700">
                                    <div className="flex space-x-2">
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </>
                )}
            </div>

            {/* Upload Progress */}
            {isUploading && (
                <div className="px-6 py-2 bg-blue-50 dark:bg-blue-900/20 border-t border-blue-200 dark:border-blue-800">
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-blue-600 dark:text-blue-400">Uploading file...</span>
                        <span className="text-blue-600 dark:text-blue-400">{Math.round(uploadProgress)}%</span>
                    </div>
                    <div className="mt-1 h-1 bg-blue-200 dark:bg-blue-800 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-blue-500 transition-all duration-300"
                            style={{ width: `${uploadProgress}%` }}
                        />
                    </div>
                </div>
            )}

            {/* Edit Mode Banner */}
            {editingMessageId && (
                <div className="px-6 py-2 bg-yellow-50 dark:bg-yellow-900/20 border-t border-yellow-200 dark:border-yellow-800 flex items-center justify-between">
                    <span className="text-sm text-yellow-800 dark:text-yellow-200">Editing message</span>
                    <button
                        onClick={handleCancelEdit}
                        className="text-sm text-yellow-600 dark:text-yellow-400 hover:underline"
                    >
                        Cancel
                    </button>
                </div>
            )}

            {/* Input */}
            <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                <div className="flex items-end space-x-2 relative">
                    <button
                        onClick={() => setShowFileUpload(!showFileUpload)}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    >
                        <Paperclip size={20} className="text-gray-600 dark:text-gray-400" />
                    </button>
                    <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                        <ImageIcon size={20} className="text-gray-600 dark:text-gray-400" />
                    </button>
                    <div className="flex-1 relative">
                        <input
                            type="text"
                            value={newMessage}
                            onChange={handleTyping}
                            onKeyPress={handleKeyPress}
                            placeholder={editingMessageId ? "Edit your message..." : "Type a message..."}
                            className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                        />
                    </div>
                    <div className="relative">
                        <button
                            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                        >
                            <Smile size={20} className="text-gray-600 dark:text-gray-400" />
                        </button>
                        {showEmojiPicker && (
                            <EmojiPicker
                                onEmojiSelect={handleEmojiSelect}
                                onClose={() => setShowEmojiPicker(false)}
                            />
                        )}
                    </div>
                    <button
                        onClick={editingMessageId ? handleSaveEdit : handleSend}
                        disabled={!newMessage.trim()}
                        className="p-3 bg-green-500 hover:bg-green-600 disabled:bg-gray-300 dark:disabled:bg-gray-600 text-white rounded-lg transition-colors disabled:cursor-not-allowed"
                    >
                        {editingMessageId ? <Check size={20} /> : <Send size={20} />}
                    </button>

                    {showFileUpload && (
                        <FileUpload
                            conversationId={conversationId}
                            onFileSelect={handleFileSelect}
                            onCancel={() => setShowFileUpload(false)}
                        />
                    )}
                </div>
            </div>

            {/* Image Preview Modal */}
            {previewImage && (
                <ImagePreview
                    imageUrl={previewImage}
                    onClose={() => setPreviewImage(null)}
                />
            )}
        </div>
    );
}
