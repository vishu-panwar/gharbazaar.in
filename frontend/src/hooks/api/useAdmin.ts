import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { backendApi } from '@/lib/backendApi';

// Types
interface AdminFilters {
  role?: string;
  status?: string;
  verified?: boolean;
}

// Query Keys
export const adminKeys = {
  all: ['admin'] as const,
  dashboard: () => [...adminKeys.all, 'dashboard'] as const,
  users: (filters?: AdminFilters) => [...adminKeys.all, 'users', filters] as const,
  user: (id: string) => [...adminKeys.all, 'user', id] as const,
  properties: (filters?: any) => [...adminKeys.all, 'properties', filters] as const,
  employees: (filters?: any) => [...adminKeys.all, 'employees', filters] as const,
  payments: (filters?: any) => [...adminKeys.all, 'payments', filters] as const,
  subscriptions: () => [...adminKeys.all, 'subscriptions'] as const,
};

/**
 * Hook to fetch admin dashboard stats
 */
export function useAdminDashboard() {
  return useQuery({
    queryKey: adminKeys.dashboard(),
    queryFn: async () => {
      return await backendApi.admin.getDashboard();
    },
    staleTime: 1 * 60 * 1000, // 1 minute
  });
}

/**
 * Hook to fetch all users
 */
export function useAdminUsers(filters?: AdminFilters) {
  return useQuery({
    queryKey: adminKeys.users(filters),
    queryFn: async () => {
      return await backendApi.admin.getUsers(filters);
    },
    staleTime: 2 * 60 * 1000,
  });
}

/**
 * Hook to fetch single user (admin view)
 */
export function useAdminUser(userId: string) {
  return useQuery({
    queryKey: adminKeys.user(userId),
    queryFn: async () => {
      return await backendApi.admin.getUser(userId);
    },
    enabled: !!userId,
    staleTime: 2 * 60 * 1000,
  });
}

/**
 * Hook to fetch all properties (admin)
 */
export function useAdminProperties(filters?: any) {
  return useQuery({
    queryKey: adminKeys.properties(filters),
    queryFn: async () => {
      return await backendApi.admin.getProperties(filters);
    },
    staleTime: 2 * 60 * 1000,
  });
}

/**
 * Hook to fetch all employees
 */
export function useEmployees(filters?: any) {
  return useQuery({
    queryKey: adminKeys.employees(filters),
    queryFn: async () => {
      return await backendApi.admin.getEmployees(filters);
    },
    staleTime: 2 * 60 * 1000,
  });
}

/**
 * Hook to fetch all payments (admin)
 */
export function useAdminPayments(filters?: any) {
  return useQuery({
    queryKey: adminKeys.payments(filters),
    queryFn: async () => {
      return await backendApi.admin.getPayments(filters);
    },
    staleTime: 2 * 60 * 1000,
  });
}

/**
 * Hook to fetch all subscriptions
 */
export function useAdminSubscriptions() {
  return useQuery({
    queryKey: adminKeys.subscriptions(),
    queryFn: async () => {
      return await backendApi.admin.getSubscriptions();
    },
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Hook to manage user (ban, activate, verify, change role)
 */
export function useManageUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      userId, 
      action, 
      data 
    }: { 
      userId: string; 
      action: 'ban' | 'activate' | 'verify' | 'changeRole'; 
      data?: any 
    }) => {
      return await backendApi.admin.manageUser(userId, action, data);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: adminKeys.user(variables.userId) });
      queryClient.invalidateQueries({ queryKey: adminKeys.users() });
    },
  });
}

/**
 * Hook to approve/reject property
 */
export function useManageProperty() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      propertyId, 
      action, 
      reason 
    }: { 
      propertyId: string; 
      action: 'approve' | 'reject' | 'feature'; 
      reason?: string 
    }) => {
      return await backendApi.admin.manageProperty(propertyId, action, reason);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.properties() });
    },
  });
}
