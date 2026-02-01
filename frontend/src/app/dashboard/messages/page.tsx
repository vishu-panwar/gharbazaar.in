'use client';

import { useState } from 'react';
import { MessageCircle } from 'lucide-react';
import dynamic from 'next/dynamic';

// Dynamically import with error handling
const ChatWindow = dynamic(() => import('@/components/Chat/ChatWindow'), {
  loading: () => <div className="flex items-center justify-center h-full"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div></div>,
  ssr: false
});

const ConversationsList = dynamic(() => import('@/components/Chat/ConversationsList'), {
  loading: () => <div className="flex items-center justify-center h-full"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div></div>,
  ssr: false
});

const ChatErrorBoundary = dynamic(() => import('@/components/Chat/ChatErrorBoundary'), {
  loading: () => <div>Loading...</div>,
  ssr: false
});

const ConnectionStatus = dynamic(() => import('@/components/Chat/ConnectionStatus'), {
  loading: () => null,
  ssr: false
});

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

export default function MessagesPage() {
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);

  return (
    <ChatErrorBoundary>
      <ConnectionStatus />

      <style jsx>{`
                .messages-scroll::-webkit-scrollbar {
                    width: 12px;
                }
                .messages-scroll::-webkit-scrollbar-track {
                    background: #f3f4f6;
                    border-radius: 10px;
                }
                .messages-scroll::-webkit-scrollbar-thumb {
                    background: #9ca3af;
                    border-radius: 10px;
                    border: 2px solid #f3f4f6;
                }
                .messages-scroll::-webkit-scrollbar-thumb:hover {
                    background: #6b7280;
                }
                .dark .messages-scroll::-webkit-scrollbar-track {
                    background: #1f2937;
                }
                .dark .messages-scroll::-webkit-scrollbar-thumb {
                    background: #4b5563;
                    border-color: #1f2937;
                }
                .dark .messages-scroll::-webkit-scrollbar-thumb:hover {
                    background: #6b7280;
                }
            `}</style>

      <div className="h-[calc(100vh-8rem)] flex bg-gray-50 dark:bg-gray-900">
        {/* Left Panel - Conversations List */}
        <div className="w-96 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
          <ConversationsList
            onSelect={setSelectedConversation}
            selectedId={selectedConversation?.id}
          />
        </div>

        {/* Right Panel - Chat Window or Empty State */}
        <div className="flex-1 flex flex-col">
          {selectedConversation ? (
            <ChatWindow
              conversationId={selectedConversation.id}
              otherUser={selectedConversation.otherUser}
            />
          ) : (
            /* Empty State */
            <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-900">
              <div className="text-center max-w-md">
                <div className="w-24 h-24 bg-gray-200 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
                  <MessageCircle size={48} className="text-gray-400 dark:text-gray-600" />
                </div>

                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Select a conversation
                </h3>

                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Choose a message from the list to start chatting with sellers and agents
                </p>

                <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
                  <h4 className="text-gray-900 dark:text-white font-semibold mb-2">
                    💡 Tips for messaging:
                  </h4>
                  <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1 text-left">
                    <li>• Be specific about your requirements</li>
                    <li>• Ask about viewing schedules</li>
                    <li>• Inquire about pricing and negotiations</li>
                    <li>• Request property documents</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </ChatErrorBoundary>
  );
}