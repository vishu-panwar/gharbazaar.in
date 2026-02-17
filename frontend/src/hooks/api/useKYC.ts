import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { backendApi } from '@/lib/backendApi';

// Types
interface KYCSubmitData {
  aadhaarNumber: string;
  panNumber: string;
  aadhaarDocument: File;
  panDocument: File;
  addressProof?: File;
}

// Query Keys
export const kycKeys = {
  all: ['kyc'] as const,
  status: () => [...kycKeys.all, 'status'] as const,
  documents: () => [...kycKeys.all, 'documents'] as const,
  pending: () => [...kycKeys.all, 'pending'] as const,
};

/**
 * Hook to fetch KYC status
 */
export function useKYCStatus() {
  return useQuery({
    queryKey: kycKeys.status(),
    queryFn: async () => {
      return await backendApi.kyc.getStatus();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes - KYC doesn't change often
  });
}

/**
 * Hook to fetch KYC documents
 */
export function useKYCDocuments() {
  return useQuery({
    queryKey: kycKeys.documents(),
    queryFn: async () => {
      return await backendApi.kyc.getDocuments();
    },
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Hook to submit KYC documents
 */
export function useSubmitKYC() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: KYCSubmitData) => {
      return await backendApi.kyc.submit(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: kycKeys.status() });
      queryClient.invalidateQueries({ queryKey: kycKeys.documents() });
    },
  });
}

/**
 * Hook to fetch pending KYC submissions (employee/admin)
 */
export function usePendingKYC() {
  return useQuery({
    queryKey: kycKeys.pending(),
    queryFn: async () => {
      return await backendApi.kyc.getPending();
    },
    staleTime: 1 * 60 * 1000, // 1 minute
  });
}

/**
 * Hook to verify KYC (employee/admin)
 */
export function useVerifyKYC() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      userId, 
      status, 
      comments 
    }: { 
      userId: string; 
      status: 'approved' | 'rejected'; 
      comments?: string 
    }) => {
      return await backendApi.kyc.verify(userId, status, comments);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: kycKeys.pending() });
    },
  });
}
