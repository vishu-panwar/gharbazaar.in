'use client';

import React, { useState } from 'react';
import ConversationsList from '@/components/Chat/ConversationsList';
import ChatWindow from '@/components/Chat/ChatWindow';
import { X } from 'lucide-react';

export default function ChatPage() {
    const [selectedConversation, setSelectedConversation] = useState<any>(null);

    return (
        <div className="h-[calc(100vh-4rem)] flex bg-gray-100 dark:bg-gray-950 rounded-xl overflow-hidden">
            {/* Sidebar - Conversations List */}
            <div className={`${selectedConversation ? 'hidden md:block' : 'block'} w-full md:w-96 border-r border-gray-200 dark:border-gray-700`}>
                <ConversationsList
                    onSelect={(conv) => setSelectedConversation(conv)}
                    selectedId={selectedConversation?.id}
                />
            </div>

            {/* Main - Chat Window */}
            <div className={`${selectedConversation ? 'block' : 'hidden md:flex'} flex-1 md:flex flex-col`}>
                {selectedConversation ? (
                    <>
                        {/* Mobile back button */}
                        <div className="md:hidden p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
                            <button
                                onClick={() => setSelectedConversation(null)}
                                className="text-green-600 hover:text-green-700 flex items-center"
                            >
                                <X size={20} className="mr-2" />
                                Back to conversations
                            </button>
                        </div>
                        <ChatWindow
                            conversationId={selectedConversation.id}
                            otherUser={selectedConversation.otherUser}
                            onClose={() => setSelectedConversation(null)}
                        />
                    </>
                ) : (
                    <div className="hidden md:flex items-center justify-center h-full bg-white dark:bg-gray-900">
                        <div className="text-center">
                            <div className="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg
                                    className="w-12 h-12 text-gray-400"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                                    />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                Select a conversation
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400">
                                Choose a conversation from the list to start messaging
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
