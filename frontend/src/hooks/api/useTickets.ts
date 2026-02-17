import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { backendApi } from '@/lib/backendApi';

// Types
interface CreateTicketData {
  subject: string;
  message: string;
  category?: string;
  priority?: 'low' | 'medium' | 'high';
  attachments?: File[];
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
      return await backendApi.tickets.getAll(filters);
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
      return await backendApi.tickets.getMessages(ticketId);
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
      return await backendApi.tickets.update(ticketId, data);
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
      return await backendApi.tickets.addMessage(ticketId, message, attachments);
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
