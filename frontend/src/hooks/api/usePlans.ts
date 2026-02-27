import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { backendApi } from '@/lib/backendApi';

// Query Keys
export const planKeys = {
  all: ['plans'] as const,
  list: () => [...planKeys.all, 'list'] as const,
  current: () => [...planKeys.all, 'current'] as const,
  usage: () => [...planKeys.all, 'usage'] as const,
};

/**
 * Hook to fetch available plans
 */
export function usePlans() {
  return useQuery({
    queryKey: planKeys.list(),
    queryFn: async () => {
      return await backendApi.plans.getAll();
    },
    staleTime: 10 * 60 * 1000, // 10 minutes - plans don't change often
  });
}

/**
 * Hook to fetch user's current plan
 */
export function useCurrentPlan() {
  return useQuery({
    queryKey: planKeys.current(),
    queryFn: async () => {
      return await backendApi.plans.getCurrentPlan();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook to fetch plan usage statistics
 */
export function usePlanUsage() {
  return useQuery({
    queryKey: planKeys.usage(),
    queryFn: async () => {
      return await backendApi.plans.getUsage();
    },
    staleTime: 1 * 60 * 1000, // 1 minute
  });
}

/**
 * Hook to purchase a plan
 */
export function usePurchasePlan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ planId, paymentId }: { planId: string; paymentId: string }) => {
      return await backendApi.plans.purchase(planId, paymentId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: planKeys.current() });
      queryClient.invalidateQueries({ queryKey: planKeys.usage() });
    },
  });
}

/**
 * Hook to upgrade plan
 */
export function useUpgradePlan() {
  const purchasePlan = usePurchasePlan();
  return purchasePlan;
}

/**
 * Hook to cancel plan
 */
export function useCancelPlan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (subscriptionId: string) => {
      return await backendApi.subscriptions.cancel(subscriptionId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: planKeys.current() });
    },
  });
}
