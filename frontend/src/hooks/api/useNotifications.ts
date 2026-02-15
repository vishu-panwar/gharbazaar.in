import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { backendApi } from '@/lib/backendApi';

// Types
interface NotificationFilters {
  read?: boolean;
  type?: string;
}

// Query Keys
export const notificationKeys = {
  all: ['notifications'] as const,
  list: (filters?: NotificationFilters) => [...notificationKeys.all, 'list', filters] as const,
  count: () => [...notificationKeys.all, 'count'] as const,
  unreadCount: () => [...notificationKeys.all, 'unreadCount'] as const,
};

/**
 * Hook to fetch all notifications
 */
export function useNotifications(filters?: NotificationFilters) {
  return useQuery({
    queryKey: notificationKeys.list(filters),
    queryFn: async () => {
      return await backendApi.notifications.getAll(filters);
    },
    staleTime: 30 * 1000, // 30 seconds (real-time via Socket.IO)
    refetchInterval: 60 * 1000, // Refetch every minute as backup
  });
}

/**
 * Hook to get unread notification count
 */
export function useUnreadNotificationCount() {
  return useQuery({
    queryKey: notificationKeys.unreadCount(),
    queryFn: async () => {
      const notifications = await backendApi.notifications.getAll({ read: false });
      return notifications?.length || 0;
    },
    staleTime: 30 * 1000,
    refetchInterval: 60 * 1000,
  });
}

/**
 * Hook to mark a notification as read
 */
export function useMarkNotificationAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (notificationId: string) => {
      return await backendApi.notifications.markAsRead(notificationId);
    },
    onMutate: async (notificationId) => {
      // Optimistic update
      await queryClient.cancelQueries({ queryKey: notificationKeys.all });

      queryClient.setQueriesData({ queryKey: notificationKeys.list() }, (old: any) => {
        if (!old) return old;
        return old.map((notif: any) =>
          notif.id === notificationId ? { ...notif, read: true } : notif
        );
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.all });
    },
  });
}

/**
 * Hook to mark all notifications as read
 */
export function useMarkAllNotificationsAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      return await backendApi.notifications.markAllAsRead();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.all });
    },
  });
}

/**
 * Hook to delete a notification
 */
export function useDeleteNotification() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (notificationId: string) => {
      return await backendApi.notifications.delete(notificationId);
    },
    onMutate: async (notificationId) => {
      await queryClient.cancelQueries({ queryKey: notificationKeys.all });

      // Remove from cache
      queryClient.setQueriesData({ queryKey: notificationKeys.list() }, (old: any) => {
        if (!old) return old;
        return old.filter((notif: any) => notif.id !== notificationId);
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.all });
    },
  });
}

/**
 * Hook to delete all notifications
 */
export function useDeleteAllNotifications() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      return await backendApi.notifications.deleteAll();
    },
    onSuccess: () => {
      // Clear notification cache
      queryClient.setQueriesData({ queryKey: notificationKeys.list() }, []);
      queryClient.invalidateQueries({ queryKey: notificationKeys.all });
    },
  });
}

/**
 * Hook to create/send a notification (admin use)
 */
export function useCreateNotification() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      userId?: string;
      title: string;
      message: string;
      type?: string;
      link?: string;
    }) => {
      return await backendApi.notifications.create(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.all });
    },
  });
}
