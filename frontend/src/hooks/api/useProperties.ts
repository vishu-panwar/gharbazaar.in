import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import { backendApi } from '@/lib/backendApi';

// Types
interface PropertyFilters {
  type?: string;
  minPrice?: number;
  maxPrice?: number;
  location?: string;
  bedrooms?: number;
  status?: string;
  userId?: string;
}

interface PropertyData {
  title: string;
  description: string;
  type: string;
  price: number;
  location: string;
  address: string;
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
  images?: string[];
  amenities?: string[];
  [key: string]: any;
}

// Query Keys
export const propertyKeys = {
  all: ['properties'] as const,
  lists: () => [...propertyKeys.all, 'list'] as const,
  list: (filters?: PropertyFilters) => [...propertyKeys.lists(), { filters }] as const,
  details: () => [...propertyKeys.all, 'detail'] as const,
  detail: (id: string) => [...propertyKeys.details(), id] as const,
  myListings: (userId?: string) => [...propertyKeys.all, 'myListings', userId] as const,
  insights: (id: string) => [...propertyKeys.all, 'insights', id] as const,
  views: (id: string) => [...propertyKeys.all, 'views', id] as const,
};

/**
 * Hook to fetch properties with filters and pagination
 */
export function useProperties(filters?: PropertyFilters, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: propertyKeys.list(filters),
    queryFn: async () => {
      return await backendApi.properties.search(filters);
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    enabled: options?.enabled ?? true,
  });
}

/**
 * Hook to fetch properties with infinite scroll
 */
export function useInfiniteProperties(filters?: PropertyFilters) {
  return useInfiniteQuery({
    queryKey: [...propertyKeys.list(filters), 'infinite'],
    queryFn: async ({ pageParam = 1 }) => {
      return await backendApi.properties.search({ ...filters, page: pageParam });
    },
    getNextPageParam: (lastPage, pages) => {
      if (lastPage.hasMore) {
        return pages.length + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
    staleTime: 2 * 60 * 1000,
  });
}

/**
 * Hook to fetch a single property by ID
 */
export function useProperty(id: string, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: propertyKeys.detail(id),
    queryFn: async () => {
      return await backendApi.properties.getById(id);
    },
    enabled: options?.enabled ?? !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook to fetch user's own listings
 */
export function useMyListings(userId?: string) {
  return useQuery({
    queryKey: propertyKeys.myListings(userId),
    queryFn: async () => {
      return await backendApi.properties.search({ userId });
    },
    enabled: !!userId || typeof window !== 'undefined',
    staleTime: 2 * 60 * 1000,
  });
}

/**
 * Hook to get count of user's listings
 */
export function useMyListingsCount() {
  const { data } = useMyListings();
  return {
    count: data?.length || 0,
    isLoading: !data,
  };
}

/**
 * Hook to create a new property listing
 */
export function useCreateProperty() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: PropertyData) => {
      return await backendApi.properties.create(data);
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: propertyKeys.lists() });
      queryClient.invalidateQueries({ queryKey: propertyKeys.myListings() });
    },
  });
}

/**
 * Hook to update a property listing
 */
export function useUpdateProperty() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<PropertyData> }) => {
      return await backendApi.properties.update(id, data);
    },
    onSuccess: (_, variables) => {
      // Invalidate specific property and lists
      queryClient.invalidateQueries({ queryKey: propertyKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: propertyKeys.lists() });
      queryClient.invalidateQueries({ queryKey: propertyKeys.myListings() });
    },
  });
}

/**
 * Hook to update property status (ACTIVE/INACTIVE)
 */
export function useUpdatePropertyStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ propertyId, status }: { propertyId: string; status: string }) => {
      return await backendApi.properties.update(propertyId, { status });
    },
    onSuccess: (_, variables) => {
      // Invalidate specific property and lists
      queryClient.invalidateQueries({ queryKey: propertyKeys.detail(variables.propertyId) });
      queryClient.invalidateQueries({ queryKey: propertyKeys.lists() });
      queryClient.invalidateQueries({ queryKey: propertyKeys.myListings() });
    },
  });
}


/**
 * Hook to delete a property listing
 */
export function useDeleteProperty() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      return await backendApi.properties.delete(id);
    },
    onSuccess: (_, id) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: propertyKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: propertyKeys.lists() });
      queryClient.invalidateQueries({ queryKey: propertyKeys.myListings() });
    },
  });
}

/**
 * Hook to fetch property insights/analytics
 */
export function usePropertyInsights(id: string) {
  return useQuery({
    queryKey: propertyKeys.insights(id),
    queryFn: async () => {
      return await backendApi.properties.getById(id);
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Hook to fetch property views
 */
export function usePropertyViews(id: string) {
  return useQuery({
    queryKey: propertyKeys.views(id),
    queryFn: async () => {
      return await backendApi.properties.getById(id);
    },
    enabled: !!id,
    staleTime: 1 * 60 * 1000, // 1 minute
  });
}

/**
 * Hook to track property view
 */
export function useTrackPropertyView() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (propertyId: string) => {
      return await backendApi.properties.trackView(propertyId);
    },
    onSuccess: (_, propertyId) => {
      // Invalidate views for this property
      queryClient.invalidateQueries({ queryKey: propertyKeys.views(propertyId) });
      queryClient.invalidateQueries({ queryKey: propertyKeys.insights(propertyId) });
    },
  });
}

/**
 * Hook to upload property images
 */
export function useUploadPropertyImages() {
  return useMutation({
    mutationFn: async ({ propertyId, files }: { propertyId: string; files: File[] }) => {
      const uploadPromises = files.map(file => backendApi.properties.uploadImage(file));
      return await Promise.all(uploadPromises);
    },
  });
}
