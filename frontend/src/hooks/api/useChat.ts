import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import { backendApi } from '@/lib/backendApi';

// Types
interface SendMessageData {
  conversationId: string;
  message: string;
  type?: 'text' | 'image' | 'file';
  metadata?: any;
}

interface CreateConversationData {
  participantIds: string[];
  propertyId?: string;
  type?: 'direct' | 'property' | 'support';
}

// Query Keys
export const chatKeys = {
  all: ['chat'] as const,
  conversations: () => [...chatKeys.all, 'conversations'] as const,
  conversation: (id: string) => [...chatKeys.all, 'conversation', id] as const,
  messages: (conversationId: string) => [...chatKeys.all, 'messages', conversationId] as const,
};

/**
 * Hook to fetch all conversations
 */
export function useConversations() {
  return useQuery({
    queryKey: chatKeys.conversations(),
    queryFn: async () => {
      return await backendApi.chat.getAllConversations();
    },
    staleTime: 30 * 1000, // 30 seconds (real-time via Socket.IO)
    refetchInterval: 30 * 1000, // Refetch every 30 seconds as backup
  });
}

/**
 * Hook to fetch a single conversation
 */
export function useConversation(conversationId: string) {
  return useQuery({
    queryKey: chatKeys.conversation(conversationId),
    queryFn: async () => {
      return await backendApi.chat.getConversation(conversationId);
    },
    enabled: !!conversationId,
    staleTime: 30 * 1000,
  });
}

/**
 * Hook to fetch messages for a conversation
 */
export function useMessages(conversationId: string) {
  return useQuery({
    queryKey: chatKeys.messages(conversationId),
    queryFn: async () => {
      return await backendApi.chat.getMessages(conversationId);
    },
    enabled: !!conversationId,
    staleTime: 10 * 1000, // 10 seconds (real-time via Socket.IO)
  });
}

/**
 * Hook to fetch messages with infinite scroll
 */
export function useInfiniteMessages(conversationId: string) {
  return useInfiniteQuery({
    queryKey: [...chatKeys.messages(conversationId), 'infinite'],
    queryFn: async ({ pageParam = 1 }) => {
      return await backendApi.chat.getMessages(conversationId, { page: pageParam });
    },
    getNextPageParam: (lastPage, pages) => {
      if (lastPage.hasMore) {
        return pages.length + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
    enabled: !!conversationId,
    staleTime: 10 * 1000,
  });
}

/**
 * Hook to send a message
 */
export function useSendMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: SendMessageData) => {
      return await backendApi.chat.sendMessage(
        data.conversationId,
        data.message,
        data.type,
        data.metadata
      );
    },
    onMutate: async (data) => {
      // Optimistic update
      await queryClient.cancelQueries({ queryKey: chatKeys.messages(data.conversationId) });

      const previousMessages = queryClient.getQueryData(chatKeys.messages(data.conversationId));

      // Add optimistic message
      queryClient.setQueryData(chatKeys.messages(data.conversationId), (old: any) => {
        if (!old) return old;
        
        const optimisticMessage = {
          id: `temp-${Date.now()}`,
          message: data.message,
          type: data.type || 'text',
          createdAt: new Date().toISOString(),
          status: 'sending',
        };

        return Array.isArray(old) ? [...old, optimisticMessage] : { ...old, messages: [...(old.messages || []), optimisticMessage] };
      });

      return { previousMessages };
    },
    onError: (err, data, context) => {
      // Rollback on error
      if (context?.previousMessages) {
        queryClient.setQueryData(chatKeys.messages(data.conversationId), context.previousMessages);
      }
    },
    onSuccess: (_, data) => {
      // Update conversation list to show latest message
      queryClient.invalidateQueries({ queryKey: chatKeys.conversations() });
      queryClient.invalidateQueries({ queryKey: chatKeys.messages(data.conversationId) });
    },
  });
}

/**
 * Hook to create a new conversation
 */
export function useCreateConversation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateConversationData) => {
      return await backendApi.chat.createConversation(
        data.participantIds,
        data.propertyId,
        data.type
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: chatKeys.conversations() });
    },
  });
}

/**
 * Hook to mark messages as read
 */
export function useMarkAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (conversationId: string) => {
      return await backendApi.chat.markAsRead(conversationId);
    },
    onSuccess: (_, conversationId) => {
      // Update conversation to show read status
      queryClient.invalidateQueries({ queryKey: chatKeys.conversation(conversationId) });
      queryClient.invalidateQueries({ queryKey: chatKeys.conversations() });
    },
  });
}

/**
 * Hook to upload chat file
 */
export function useUploadChatFile() {
  return useMutation({
    mutationFn: async ({ conversationId, file }: { conversationId: string; file: File }) => {
      return await backendApi.chat.uploadFile(file, conversationId);
    },
  });
}

/**
 * Hook to delete a message
 */
export function useDeleteMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ conversationId, messageId }: { conversationId: string; messageId: string }) => {
      return await backendApi.chat.deleteMessage(messageId);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: chatKeys.messages(variables.conversationId) });
    },
  });
}

/**
 * Hook to get unread conversation count
 */
export function useUnreadCount() {
  const { data: conversations } = useConversations();
  
  const count = conversations?.filter((conv: any) => conv.unreadCount > 0).length || 0;
  
  return { count };
}
