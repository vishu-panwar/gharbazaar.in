import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { backendApi } from '@/lib/backendApi';

// Types
interface CreateBidData {
  propertyId: string;
  amount: number;
  message?: string;
  validUntil?: string;
}

interface UpdateBidData {
  status?: 'pending' | 'accepted' | 'rejected' | 'countered';
  counterAmount?: number;
  message?: string;
}

// Query Keys
export const bidKeys = {
  all: ['bids'] as const,
  buyer: () => [...bidKeys.all, 'buyer'] as const,
  seller: () => [...bidKeys.all, 'seller'] as const,
  property: (propertyId: string) => [...bidKeys.all, 'property', propertyId] as const,
  detail: (id: string) => [...bidKeys.all, 'detail', id] as const,
};

/**
 * Hook to fetch buyer's bids
 */
export function useBuyerBids(filters?: { status?: string; limit?: number }) {
  return useQuery({
    queryKey: [...bidKeys.buyer(), filters],
    queryFn: async () => {
      return await backendApi.bids.getBuyerBids(filters);
    },
    staleTime: 1 * 60 * 1000, // 1 minute
  });
}

/**
 * Hook to fetch seller's received bids/offers
 */
export function useSellerBids(filters?: { status?: string; limit?: number }) {
  return useQuery({
    queryKey: [...bidKeys.seller(), filters],
    queryFn: async () => {
      return await backendApi.bids.getSellerBids(filters);
    },
    staleTime: 1 * 60 * 1000,
  });
}

/**
 * Hook to get count of active bids for buyer
 */
export function useActiveBidsCount() {
  const { data } = useBuyerBids({ status: 'pending' });
  return {
    count: data?.length || 0,
  };
}

/**
 * Hook to get count of offers for seller
 */
export function useOfferCount() {
  const { data } = useSellerBids({ status: 'pending' });
  return {
    count: data?.length || 0,
  };
}

/**
 * Hook to fetch bids for a specific property
 */
export function usePropertyBids(propertyId: string) {
  return useQuery({
    queryKey: bidKeys.property(propertyId),
    queryFn: async () => {
      return await backendApi.bids.getPropertyBids(propertyId);
    },
    enabled: !!propertyId,
    staleTime: 1 * 60 * 1000,
  });
}

/**
 * Hook to fetch a single bid
 */
export function useBid(bidId: string) {
  return useQuery({
    queryKey: bidKeys.detail(bidId),
    queryFn: async () => {
      return await backendApi.bids.getBidById(bidId);
    },
    enabled: !!bidId,
    staleTime: 1 * 60 * 1000,
  });
}

/**
 * Hook to create a new bid
 */
export function useCreateBid() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateBidData) => {
      return await backendApi.bids.create(data);
    },
    onSuccess: (_, variables) => {
      // Invalidate buyer bids and property bids
      queryClient.invalidateQueries({ queryKey: bidKeys.buyer() });
      queryClient.invalidateQueries({ queryKey: bidKeys.property(variables.propertyId) });
    },
  });
}

/**
 * Hook to update bid status (accept/reject/counter)
 */
export function useUpdateBidStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ bidId, data }: { bidId: string; data: UpdateBidData }) => {
      return await backendApi.bids.updateStatus(bidId, data);
    },
    onSuccess: (_, variables) => {
      // Invalidate all bid queries
      queryClient.invalidateQueries({ queryKey: bidKeys.all });
      queryClient.invalidateQueries({ queryKey: bidKeys.detail(variables.bidId) });
    },
  });
}

/**
 * Hook to accept a bid
 */
export function useAcceptBid() {
  const updateBid = useUpdateBidStatus();
  
  return {
    ...updateBid,
    mutate: (bidId: string) => updateBid.mutate({ bidId, data: { status: 'accepted' } }),
    mutateAsync: (bidId: string) => updateBid.mutateAsync({ bidId, data: { status: 'accepted' } }),
  };
}

/**
 * Hook to reject a bid
 */
export function useRejectBid() {
  const updateBid = useUpdateBidStatus();
  
  return {
    ...updateBid,
    mutate: ({ bidId, message }: { bidId: string; message?: string }) => 
      updateBid.mutate({ bidId, data: { status: 'rejected', message } }),
    mutateAsync: ({ bidId, message }: { bidId: string; message?: string }) => 
      updateBid.mutateAsync({ bidId, data: { status: 'rejected', message } }),
  };
}

/**
 * Hook to counter a bid
 */
export function useCounterBid() {
  const updateBid = useUpdateBidStatus();
  
  return {
    ...updateBid,
    mutate: ({ bidId, counterAmount, message }: { bidId: string; counterAmount: number; message?: string }) => 
      updateBid.mutate({ bidId, data: { status: 'countered', counterAmount, message } }),
    mutateAsync: ({ bidId, counterAmount, message }: { bidId: string; counterAmount: number; message?: string }) => 
      updateBid.mutateAsync({ bidId, data: { status: 'countered', counterAmount, message } }),
  };
}

/**
 * Hook to withdraw/cancel a bid
 */
export function useWithdrawBid() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (bidId: string) => {
      return await backendApi.bids.withdraw(bidId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bidKeys.all });
    },
  });
}
