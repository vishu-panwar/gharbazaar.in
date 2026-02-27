import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { backendApi } from '@/lib/backendApi';

// Query Keys
export const employeeKeys = {
  all: ['employee'] as const,
  stats: () => [...employeeKeys.all, 'stats'] as const,
  leads: (filters?: any) => [...employeeKeys.all, 'leads', filters] as const,
  attendance: () => [...employeeKeys.all, 'attendance'] as const,
  salary: () => [...employeeKeys.all, 'salary'] as const,
  pendingProperties: () => [...employeeKeys.all, 'pendingProperties'] as const,
};

/**
 * Hook to fetch employee dashboard stats
 */
export function useEmployeeStats() {
  return useQuery({
    queryKey: employeeKeys.stats(),
    queryFn: async () => {
      return await backendApi.employee.getStats();
    },
    staleTime: 1 * 60 * 1000, // 1 minute
  });
}

/**
 * Hook to fetch employee leads
 */
export function useEmployeeLeads(filters?: { status?: string }) {
  return useQuery({
    queryKey: employeeKeys.leads(filters),
    queryFn: async () => {
      return await backendApi.employee.getLeads(filters);
    },
    staleTime: 1 * 60 * 1000,
  });
}

/**
 * Hook to fetch attendance records
 */
export function useAttendance() {
  return useQuery({
    queryKey: employeeKeys.attendance(),
    queryFn: async () => {
      return await backendApi.employee.getAttendance();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook to mark attendance (check-in/check-out)
 */
export function useMarkAttendance() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (type: 'check-in' | 'check-out') => {
      return await backendApi.employee.markAttendance({ type });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: employeeKeys.attendance() });
      queryClient.invalidateQueries({ queryKey: employeeKeys.stats() });
    },
  });
}

/**
 * Hook to fetch salary history
 */
export function useSalaryHistory() {
  return useQuery({
    queryKey: employeeKeys.salary(),
    queryFn: async () => {
      return await backendApi.employee.getSalaryHistory();
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Hook to fetch properties pending verification
 */
export function usePendingProperties() {
  return useQuery({
    queryKey: employeeKeys.pendingProperties(),
    queryFn: async () => {
      return await backendApi.employee.getPendingProperties();
    },
    staleTime: 1 * 60 * 1000,
  });
}

/**
 * Hook to approve/reject property (employee)
 */
export function useVerifyProperty() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      propertyId, 
      status, 
      comments 
    }: { 
      propertyId: string; 
      status: 'approved' | 'rejected'; 
      comments?: string 
    }) => {
      return await backendApi.employee.verifyProperty(propertyId, status, comments);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: employeeKeys.pendingProperties() });
    },
  });
}
