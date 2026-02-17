import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { backendApi } from '@/lib/backendApi';

// Types
interface CreateContractData {
  propertyId: string;
  buyerId: string;
  sellerId: string;
  amount: number;
  terms?: string;
  [key: string]: any;
}

// Query Keys
export const contractKeys = {
  all: ['contracts'] as const,
  list: (filters?: { status?: string }) => [...contractKeys.all, 'list', filters] as const,
  detail: (id: string) => [...contractKeys.all, 'detail', id] as const,
  property: (propertyId: string) => [...contractKeys.all, 'property', propertyId] as const,
};

/**
 * Hook to fetch user's contracts
 */
export function useMyContracts(filters?: { status?: string }) {
  return useQuery({
    queryKey: contractKeys.list(filters),
    queryFn: async () => {
      return await backendApi.contracts.getMyContracts(filters);
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

/**
 * Hook to fetch a single contract
 */
export function useContract(contractId: string) {
  return useQuery({
    queryKey: contractKeys.detail(contractId),
    queryFn: async () => {
      return await backendApi.contracts.getById(contractId);
    },
    enabled: !!contractId,
    staleTime: 2 * 60 * 1000,
  });
}

/**
 * Hook to fetch contracts for a property
 */
export function usePropertyContracts(propertyId: string) {
  return useQuery({
    queryKey: contractKeys.property(propertyId),
    queryFn: async () => {
      return await backendApi.contracts.getByProperty(propertyId);
    },
    enabled: !!propertyId,
    staleTime: 2 * 60 * 1000,
  });
}

/**
 * Hook to create a new contract
 */
export function useCreateContract() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateContractData) => {
      return await backendApi.contracts.create(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: contractKeys.all });
    },
  });
}

/**
 * Hook to update contract
 */
export function useUpdateContract() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ contractId, data }: { contractId: string; data: Partial<CreateContractData> }) => {
      return await backendApi.contracts.update(contractId, data);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: contractKeys.detail(variables.contractId) });
      queryClient.invalidateQueries({ queryKey: contractKeys.list() });
    },
  });
}

/**
 * Hook to sign a contract
 */
export function useSignContract() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (contractId: string) => {
      return await backendApi.contracts.sign(contractId);
    },
    onSuccess: (_, contractId) => {
      queryClient.invalidateQueries({ queryKey: contractKeys.detail(contractId) });
      queryClient.invalidateQueries({ queryKey: contractKeys.list() });
    },
  });
}

/**
 * Hook to cancel a contract
 */
export function useCancelContract() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ contractId, reason }: { contractId: string; reason?: string }) => {
      return await backendApi.contracts.cancel(contractId, reason);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: contractKeys.detail(variables.contractId) });
      queryClient.invalidateQueries({ queryKey: contractKeys.list() });
    },
  });
}
