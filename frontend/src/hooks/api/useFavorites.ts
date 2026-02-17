import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { backendApi } from '@/lib/backendApi';

// Query Keys
export const favoriteKeys = {
  all: ['favorites'] as const,
  list: () => [...favoriteKeys.all, 'list'] as const,
  count: () => [...favoriteKeys.all, 'count'] as const,
};

/**
 * Hook to fetch user's favorite properties
 */
export function useFavorites() {
  return useQuery({
    queryKey: favoriteKeys.list(),
    queryFn: async () => {
      return await backendApi.favorites.getAll();
    },
    staleTime: 1 * 60 * 1000, // 1 minute
  });
}

/**
 * Hook to get count of favorites
 */
export function useFavoritesCount() {
  const { data, isLoading } = useFavorites();
  return {
    count: data?.length || 0,
    isLoading,
  };
}

/**
 * Hook to check if a property is favorited
 */
export function useIsFavorite(propertyId: string) {
  const { data: favorites } = useFavorites();
  
  return {
    isFavorite: favorites?.some((fav: any) => fav.propertyId === propertyId || fav.id === propertyId) || false,
  };
}

/**
 * Hook to toggle favorite status (add/remove)
 */
export function useToggleFavorite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (propertyId: string) => {
      return await backendApi.favorites.toggle(propertyId);
    },
    onMutate: async (propertyId) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: favoriteKeys.list() });

      // Snapshot previous value
      const previousFavorites = queryClient.getQueryData(favoriteKeys.list());

      // Optimistically update
      queryClient.setQueryData(favoriteKeys.list(), (old: any) => {
        if (!old) return old;
        
        const exists = old.some((fav: any) => fav.propertyId === propertyId || fav.id === propertyId);
        
        if (exists) {
          // Remove from favorites
          return old.filter((fav: any) => fav.propertyId !== propertyId && fav.id !== propertyId);
        } else {
          // Add to favorites (simplified, actual data will come from server)
          return [...old, { propertyId, createdAt: new Date().toISOString() }];
        }
      });

      return { previousFavorites };
    },
    onError: (err, propertyId, context) => {
      // Rollback on error
      if (context?.previousFavorites) {
        queryClient.setQueryData(favoriteKeys.list(), context.previousFavorites);
      }
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: favoriteKeys.list() });
    },
  });
}

/**
 * Hook to add a property to favorites
 */
export function useAddFavorite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (propertyId: string) => {
      return await backendApi.favorites.add(propertyId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: favoriteKeys.list() });
    },
  });
}

/**
 * Hook to remove a property from favorites
 */
export function useRemoveFavorite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (propertyId: string) => {
      return await backendApi.favorites.remove(propertyId);
    },
    onMutate: async (propertyId) => {
      await queryClient.cancelQueries({ queryKey: favoriteKeys.list() });
      
      const previousFavorites = queryClient.getQueryData(favoriteKeys.list());

      // Optimistically remove
      queryClient.setQueryData(favoriteKeys.list(), (old: any) => {
        if (!old) return old;
        return old.filter((fav: any) => fav.propertyId !== propertyId && fav.id !== propertyId);
      });

      return { previousFavorites };
    },
    onError: (err, propertyId, context) => {
      if (context?.previousFavorites) {
        queryClient.setQueryData(favoriteKeys.list(), context.previousFavorites);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: favoriteKeys.list() });
    },
  });
}

/**
 * Hook to sync favorites from local storage
 */
export function useSyncFavorites() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (propertyIds: string[]) => {
      return await backendApi.favorites.sync(propertyIds);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: favoriteKeys.list() });
    },
  });
}
