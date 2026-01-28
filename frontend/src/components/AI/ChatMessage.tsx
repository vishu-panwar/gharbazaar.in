'use client';

import React from 'react';
import { Bot, User, UserCog } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface Message {
    role: 'user' | 'assistant' | 'agent';
    content: string;
    timestamp: string;
}

interface ChatMessageProps {
    message: Message;
}

export default function ChatMessage({ message }: ChatMessageProps) {
    const isUser = message.role === 'user';
    const isAgent = message.role === 'agent';

    const formatTime = (timestamp: string) => {
        return new Date(timestamp).toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
        });
    };

    return (
        <div className={`flex items-start gap-2 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
            {/* Avatar */}
            <div
                className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${isUser
                        ? 'bg-blue-500'
                        : isAgent
                            ? 'bg-green-500'
                            : 'bg-gradient-to-br from-purple-500 to-indigo-600'
                    }`}
            >
                {isUser ? (
                    <User size={18} className="text-white" />
                ) : isAgent ? (
                    <UserCog size={18} className="text-white" />
                ) : (
                    <Bot size={18} className="text-white" />
                )}
            </div>

            {/* Message Bubble */}
            <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} max-w-[280px]`}>
                <div
                    className={`px-4 py-3 rounded-2xl ${isUser
                            ? 'bg-blue-500 text-white rounded-tr-none'
                            : isAgent
                                ? 'bg-green-500 text-white rounded-tl-none'
                                : 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-tl-none shadow-sm'
                        }`}
                >
                    {isUser ? (
                        <p className="break-words">{message.content}</p>
                    ) : (
                        <div className="prose prose-sm dark:prose-invert max-w-none">
                            <ReactMarkdown
                                components={{
                                    p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                                    ul: ({ children }) => <ul className="list-disc pl-4 mb-2">{children}</ul>,
                                    ol: ({ children }) => <ol className="list-decimal pl-4 mb-2">{children}</ol>,
                                    li: ({ children }) => <li className="mb-1">{children}</li>,
                                    code: ({ children }) => (
                                        <code className="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded text-sm">
                                            {children}
                                        </code>
                                    ),
                                    strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                                }}
                            >
                                {message.content}
                            </ReactMarkdown>
                        </div>
                    )}
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400 mt-1 px-1">
                    {formatTime(message.timestamp)}
                </span>
            </div>
        </div>
    );
}
