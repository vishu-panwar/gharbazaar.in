import { useQuery } from '@tanstack/react-query';
import { backendApi } from '@/lib/backendApi';

// Types
interface AnalyticsFilters {
  period?: '7d' | '30d' | '90d' | '1y' | 'all';
  startDate?: string;
  endDate?: string;
}

// Query Keys
export const analyticsKeys = {
  all: ['analytics'] as const,
  platform: (filters?: AnalyticsFilters) => [...analyticsKeys.all, 'platform', filters] as const,
  property: (propertyId?: string) => [...analyticsKeys.all, 'property', propertyId] as const,
  propertyStats: (filters?: AnalyticsFilters) => [...analyticsKeys.all, 'propertyStats', filters] as const,
  user: (filters?: AnalyticsFilters) => [...analyticsKeys.all, 'user', filters] as const,
  revenue: (filters?: AnalyticsFilters) => [...analyticsKeys.all, 'revenue', filters] as const,
};

/**
 * Hook to fetch platform-wide analytics (admin)
 */
export function usePlatformStats(filters?: AnalyticsFilters) {
  return useQuery({
    queryKey: analyticsKeys.platform(filters),
    queryFn: async () => {
      return await backendApi.analytics.getPlatformStats(filters);
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook to fetch property performance analytics
 */
export function usePropertyStats(filters?: AnalyticsFilters) {
  return useQuery({
    queryKey: analyticsKeys.propertyStats(filters),
    queryFn: async () => {
      return await backendApi.analytics.getPropertyStats(filters);
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

/**
 * Hook to fetch single property analytics
 */
export function usePropertyAnalytics(propertyId: string) {
  return useQuery({
    queryKey: analyticsKeys.property(propertyId),
    queryFn: async () => {
      return await backendApi.analytics.getPropertyAnalytics(propertyId);
    },
    enabled: !!propertyId,
    staleTime: 2 * 60 * 1000,
  });
}

/**
 * Hook to fetch user stats (for seller/partner)
 */
export function useUserStats(filters?: AnalyticsFilters) {
  return useQuery({
    queryKey: analyticsKeys.user(filters),
    queryFn: async () => {
      return await backendApi.analytics.getUserStats(filters);
    },
    staleTime: 2 * 60 * 1000,
  });
}

/**
 * Hook to fetch revenue analytics
 */
export function useRevenueStats(filters?: AnalyticsFilters) {
  return useQuery({
    queryKey: analyticsKeys.revenue(filters),
    queryFn: async () => {
      return await backendApi.analytics.getRevenueStats(filters);
    },
    staleTime: 5 * 60 * 1000,
  });
}
