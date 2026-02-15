import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { backendApi } from '@/lib/backendApi';

// Types  
interface PaymentFilters {
  period?: string; // '7d', '30d', '90d', '1y'
  status?: string;
  type?: string;
}

interface CreatePaymentData {
  amount: number;
  propertyId?: string;
  contractId?: string;
  type: 'property' | 'subscription' | 'service' | 'payout';
  method?: string;
}

// Query Keys
export const paymentKeys = {
  all: ['payments'] as const,
  list: (filters?: PaymentFilters) => [...paymentKeys.all, 'list', filters] as const,
  earnings: (filters?: PaymentFilters) => [...paymentKeys.all, 'earnings', filters] as const,
  payouts: () => [...paymentKeys.all, 'payouts'] as const,
  partnerEarnings: (filters?: PaymentFilters) => [...paymentKeys.all, 'partner', filters] as const,
  detail: (id: string) => [...paymentKeys.all, 'detail', id] as const,
};

/**
 * Hook to fetch user's earnings
 */
export function useEarnings(filters?: PaymentFilters) {
  return useQuery({
    queryKey: paymentKeys.earnings(filters),
    queryFn: async () => {
      return await backendApi.payments.getEarnings(filters);
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

/**
 * Hook to get total earnings amount
 */
export function useTotalEarnings(period?: string) {
  const { data, isLoading } = useEarnings({ period });
  
  const total = data?.reduce((sum: number, payment: any) => sum + (payment.amount || 0), 0) || 0;
  
  return {
    total,
    isLoading,
  };
}

/**
 * Hook to fetch partner earnings
 */
export function usePartnerEarnings(filters?: PaymentFilters) {
  return useQuery({
    queryKey: paymentKeys.partnerEarnings(filters),
    queryFn: async () => {
      return await backendApi.payments.getPartnerEarnings(filters);
    },
    staleTime: 2 * 60 * 1000,
  });
}

/**
 * Hook to fetch payment history
 */
export function usePayments(filters?: PaymentFilters) {
  return useQuery({
    queryKey: paymentKeys.list(filters),
    queryFn: async () => {
      return await backendApi.payments.getAll(filters);
    },
    staleTime: 2 * 60 * 1000,
  });
}

/**
 * Hook to fetch a single payment
 */
export function usePayment(paymentId: string) {
  return useQuery({
    queryKey: paymentKeys.detail(paymentId),
    queryFn: async () => {
      return await backendApi.payments.getById(paymentId);
    },
    enabled: !!paymentId,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Hook to fetch payout history
 */
export function usePayouts() {
  return useQuery({
    queryKey: paymentKeys.payouts(),
    queryFn: async () => {
      return await backendApi.payments.getPayouts();
    },
    staleTime: 2 * 60 * 1000,
  });
}

/**
 * Hook to create a payment
 */
export function useCreatePayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreatePaymentData) => {
      return await backendApi.payments.create(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: paymentKeys.all });
    },
  });
}

/**
 * Hook to request a payout
 */
export function useRequestPayout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { amount: number; method?: string; accountDetails?: any }) => {
      return await backendApi.payments.requestPayout(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: paymentKeys.payouts() });
      queryClient.invalidateQueries({ queryKey: paymentKeys.earnings() });
    },
  });
}

/**
 * Hook to verify payment
 */
export function useVerifyPayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ paymentId, transactionId }: { paymentId: string; transactionId: string }) => {
      return await backendApi.payments.verify(paymentId, transactionId);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: paymentKeys.detail(variables.paymentId) });
      queryClient.invalidateQueries({ queryKey: paymentKeys.list() });
    },
  });
}
