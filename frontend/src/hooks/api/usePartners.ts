import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { backendApi } from '@/lib/backendApi';

// Types
type PartnerType = 'promo' | 'legal' | 'ground' | 'service';

interface PartnerFilters {
  type?: PartnerType;
  status?: string;
}

// Query Keys
export const partnerKeys = {
  all: ['partners'] as const,
  stats: (type?: PartnerType) => [...partnerKeys.all, 'stats', type] as const,
  leads: (filters?: any) => [...partnerKeys.all, 'leads', filters] as const,
  referrals: () => [...partnerKeys.all, 'referrals'] as const,
  cases: (filters?: any) => [...partnerKeys.all, 'cases', filters] as const,
  performance: () => [...partnerKeys.all, 'performance'] as const,
};

/**
 * Hook to fetch partner dashboard stats
 */
export function usePartnerStats(type?: PartnerType) {
  return useQuery({
    queryKey: partnerKeys.stats(type),
    queryFn: async () => {
      return await backendApi.partners.getStats(type);
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

/**
 * Hook to fetch partner leads
 */
export function usePartnerLeads(filters?: { status?: string; dateRange?: string }) {
  return useQuery({
    queryKey: partnerKeys.leads(filters),
    queryFn: async () => {
      return await backendApi.partners.getLeads(filters);
    },
    staleTime: 1 * 60 * 1000, // 1 minute
  });
}

/**
 * Hook to fetch referrals (promo partner)
 */
export function useReferrals() {
  return useQuery({
    queryKey: partnerKeys.referrals(),
    queryFn: async () => {
      return await backendApi.partners.getReferrals();
    },
    staleTime: 2 * 60 * 1000,
  });
}

/**
 * Hook to fetch cases (legal/service partner)
 */
export function useCases(filters?: { status?: string }) {
  return useQuery({
    queryKey: partnerKeys.cases(filters),
    queryFn: async () => {
      return await backendApi.partners.getCases(filters);
    },
    staleTime: 1 * 60 * 1000,
  });
}

/**
 * Hook to fetch partner performance metrics
 */
export function usePartnerPerformance() {
  return useQuery({
    queryKey: partnerKeys.performance(),
    queryFn: async () => {
      return await backendApi.partners.getPerformance();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook to update case status
 */
export function useUpdateCaseStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ caseId, status, notes }: { caseId: string; status: string; notes?: string }) => {
      return await backendApi.partners.updateCaseStatus(caseId, status, notes);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: partnerKeys.cases() });
    },
  });
}
