'use client';

import { useState, Suspense } from 'react';
import dynamic from 'next/dynamic';
import { MessageSquare } from 'lucide-react';
import { useSearchParams } from 'next/navigation';

const ChatWindow = dynamic(() => import('@/components/Chat/ChatWindow'), {
  loading: () => (
    <div className="flex items-center justify-center h-full">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
    </div>
  ),
  ssr: false,
});

const ConversationsList = dynamic(() => import('@/components/Chat/ConversationsList'), {
  loading: () => (
    <div className="flex items-center justify-center h-full">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
    </div>
  ),
  ssr: false,
});

const ChatErrorBoundary = dynamic(() => import('@/components/Chat/ChatErrorBoundary'), {
  loading: () => <div>Loading...</div>,
  ssr: false,
});

const ConnectionStatus = dynamic(() => import('@/components/Chat/ConnectionStatus'), {
  loading: () => null,
  ssr: false,
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

function ServicePartnerCommunicationsContent() {
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const searchParams = useSearchParams();
  const conversationId = searchParams.get('id');

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Communications</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Real-time buyer chat with Socket.IO and saved history.
        </p>
      </div>

      <div className="h-[calc(100vh-14rem)] flex flex-col md:flex-row bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
        <div className="w-full md:w-96 border-b md:border-b-0 md:border-r border-gray-200 dark:border-gray-700 flex flex-col">
          <ConversationsList
            onSelect={setSelectedConversation}
            selectedId={selectedConversation?.id || conversationId || undefined}
          />
        </div>

        <div className="flex-1 flex flex-col bg-gray-50 dark:bg-gray-900">
          {selectedConversation ? (
            <ChatWindow
              conversationId={selectedConversation.id}
              otherUser={selectedConversation.otherUser}
            />
          ) : (
            <div className="flex-1 flex items-center justify-center px-6">
              <div className="text-center max-w-md">
                <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageSquare className="text-gray-400" size={36} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  Select a conversation
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Open a buyer chat to respond to service offers in real time.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ServicePartnerCommunicationsPage() {
  return (
    <ChatErrorBoundary>
      <ConnectionStatus />
      <Suspense
        fallback={
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
          </div>
        }
      >
        <ServicePartnerCommunicationsContent />
      </Suspense>
    </ChatErrorBoundary>
  );
}
