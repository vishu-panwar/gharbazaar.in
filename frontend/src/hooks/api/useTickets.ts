import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { backendApi } from '@/lib/backendApi';

// Types
interface CreateTicketData {
  categoryId: string;
  subCategoryId: string;
  categoryTitle: string;
  subCategoryTitle: string;
  problem: string;
  userRole: string;
}

interface UpdateTicketData {
  status?: 'open' | 'in-progress' | 'resolved' | 'closed';
  priority?: 'low' | 'medium' | 'high';
}

interface TicketFilters {
  status?: string;
  category?: string;
  priority?: string;
}

// Query Keys
export const ticketKeys = {
  all: ['tickets'] as const,
  list: (filters?: TicketFilters) => [...ticketKeys.all, 'list', filters] as const,
  detail: (id: string) => [...ticketKeys.all, 'detail', id] as const,
  messages: (id: string) => [...ticketKeys.all, 'messages', id] as const,
};

/**
 * Hook to fetch user's tickets
 */
export function useTickets(filters?: TicketFilters) {
  return useQuery({
    queryKey: ticketKeys.list(filters),
    queryFn: async () => {
      const response = await backendApi.tickets.getUserTickets();
      if (!filters) return response;

      const tickets = response?.data?.tickets ?? response?.tickets ?? [];
      const filteredTickets = tickets.filter((ticket: any) => {
        if (filters.status && ticket.status !== filters.status) return false;
        if (filters.category && ticket.category !== filters.category) return false;
        if (filters.priority && ticket.priority !== filters.priority) return false;
        return true;
      });

      if (response?.data?.tickets) {
        return { ...response, data: { ...response.data, tickets: filteredTickets } };
      }

      return { ...response, tickets: filteredTickets };
    },
    staleTime: 1 * 60 * 1000, // 1 minute
  });
}

/**
 * Hook to fetch a single ticket
 */
export function useTicket(ticketId: string) {
  return useQuery({
    queryKey: ticketKeys.detail(ticketId),
    queryFn: async () => {
      return await backendApi.tickets.getById(ticketId);
    },
    enabled: !!ticketId,
    staleTime: 30 * 1000, // 30 seconds
  });
}

/**
 * Hook to fetch ticket messages/conversation
 */
export function useTicketMessages(ticketId: string) {
  return useQuery({
    queryKey: ticketKeys.messages(ticketId),
    queryFn: async () => {
      const response = await backendApi.tickets.getById(ticketId);
      return response?.data?.messages ?? response?.messages ?? [];
    },
    enabled: !!ticketId,
    staleTime: 30 * 1000,
    refetchInterval: 30 * 1000, // Poll every 30 seconds
  });
}

/**
 * Hook to create a new ticket
 */
export function useCreateTicket() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateTicketData) => {
      return await backendApi.tickets.create(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ticketKeys.list() });
    },
  });
}

/**
 * Hook to update ticket
 */
export function useUpdateTicket() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ ticketId, data }: { ticketId: string; data: UpdateTicketData }) => {
      if (data.status === 'closed') {
        return await backendApi.tickets.close(ticketId);
      }
      if (data.status === 'in-progress') {
        return await backendApi.tickets.assign(ticketId);
      }
      throw new Error('Ticket updates are not supported by the API.');
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ticketKeys.detail(variables.ticketId) });
      queryClient.invalidateQueries({ queryKey: ticketKeys.list() });
    },
  });
}

/**
 * Hook to add message to ticket
 */
export function useAddTicketMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      ticketId, 
      message, 
      attachments 
    }: { 
      ticketId: string; 
      message: string; 
      attachments?: File[] 
    }) => {
      let finalMessage = message;

      if (attachments?.length) {
        const uploads = await Promise.all(
          attachments.map(async (file) => {
            try {
              return await backendApi.tickets.uploadFile(ticketId, file);
            } catch (error) {
              console.error('Failed to upload ticket attachment:', error);
              return null;
            }
          })
        );

        const attachmentUrls = uploads
          .map((upload: any) => upload?.data?.url || upload?.url)
          .filter(Boolean);

        if (attachmentUrls.length) {
          finalMessage = `${message}\n\nAttachments:\n${attachmentUrls.join('\n')}`;
        }
      }

      return await backendApi.tickets.sendMessage(ticketId, finalMessage);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ticketKeys.messages(variables.ticketId) });
      queryClient.invalidateQueries({ queryKey: ticketKeys.detail(variables.ticketId) });
    },
  });
}

/**
 * Hook to close ticket
 */
export function useCloseTicket() {
  const updateTicket = useUpdateTicket();
  
  return {
    ...updateTicket,
    mutate: (ticketId: string) => updateTicket.mutate({ ticketId, data: { status: 'closed' } }),
    mutateAsync: (ticketId: string) => updateTicket.mutateAsync({ ticketId, data: { status: 'closed' } }),
  };
}
