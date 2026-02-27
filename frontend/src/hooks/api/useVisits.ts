import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { backendApi } from '@/lib/backendApi';

// Types
interface ScheduleVisitData {
  propertyId: string;
  scheduledDate: string;
  notes?: string;
  type?: 'in-person' | 'virtual';
}

interface UpdateVisitData {
  status?: 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'no-show';
  notes?: string;
  feedback?: string;
}

// Query Keys
export const visitKeys = {
  all: ['visits'] as const,
  list: (filters?: { status?: string }) => [...visitKeys.all, 'list', filters] as const,
  upcoming: () => [...visitKeys.all, 'upcoming'] as const,
  history: () => [...visitKeys.all, 'history'] as const,
  myVisits: () => [...visitKeys.all, 'myVisits'] as const,
  detail: (id: string) => [...visitKeys.all, 'detail', id] as const,
};

/**
 * Hook to fetch upcoming visits
 */
export function useUpcomingVisits() {
  return useQuery({
    queryKey: visitKeys.upcoming(),
    queryFn: async () => {
      return await backendApi.visits.getBuyer('scheduled');
    },
    staleTime: 1 * 60 * 1000, // 1 minute
  });
}

/**
 * Hook to get count of upcoming visits
 */
export function useUpcomingCount() {
  const { data, isLoading } = useUpcomingVisits();
  return {
    count: data?.length || 0,
    isLoading,
  };
}

/**
 * Hook to fetch visit history
 */
export function useVisitHistory() {
  return useQuery({
    queryKey: visitKeys.history(),
    queryFn: async () => {
      return await backendApi.visits.getBuyer('completed');
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook to fetch all visits (for ground partners)
 */
export function useMyVisits(filters?: { status?: string }) {
  return useQuery({
    queryKey: visitKeys.list(filters),
    queryFn: async () => {
      return await backendApi.visits.getPartner(filters?.status);
    },
    staleTime: 1 * 60 * 1000,
  });
}

/**
 * Hook to fetch a single visit
 */
export function useVisit(visitId: string) {
  return useQuery({
    queryKey: visitKeys.detail(visitId),
    queryFn: async () => {
      const response = await backendApi.visits.getBuyer();
      const visits = response?.data ?? response?.visits ?? [];
      return visits.find((visit: any) => visit.id === visitId);
    },
    enabled: !!visitId,
    staleTime: 1 * 60 * 1000,
  });
}

/**
 * Hook to schedule a visit
 */
export function useScheduleVisit() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: ScheduleVisitData) => {
      return await backendApi.visits.create({
        propertyId: data.propertyId,
        scheduledAt: data.scheduledDate,
        notes: data.notes,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: visitKeys.all });
    },
  });
}

/**
 * Hook to update visit status
 */
export function useUpdateVisitStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ visitId, data }: { visitId: string; data: UpdateVisitData }) => {
      return await backendApi.visits.update(visitId, {
        status: data.status,
        notes: data.notes,
        feedback: data.feedback,
      });
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: visitKeys.detail(variables.visitId) });
      queryClient.invalidateQueries({ queryKey: visitKeys.all });
    },
  });
}

/**
 * Hook to cancel a visit
 */
export function useCancelVisit() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ visitId, reason }: { visitId: string; reason?: string }) => {
      return await backendApi.visits.update(visitId, {
        status: 'cancelled',
        notes: reason,
      });
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: visitKeys.detail(variables.visitId) });
      queryClient.invalidateQueries({ queryKey: visitKeys.all });
    },
  });
}

/**
 * Hook to complete visit and submit report (ground partner)
 */
export function useCompleteVisit() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      visitId, 
      report, 
      photos 
    }: { 
      visitId: string; 
      report: string; 
      photos?: File[] 
    }) => {
      void photos;
      return await backendApi.visits.update(visitId, {
        status: 'completed',
        feedback: report,
      });
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: visitKeys.detail(variables.visitId) });
      queryClient.invalidateQueries({ queryKey: visitKeys.all });
    },
  });
}

/**
 * Hook to check-in to visit (ground partner)
 */
export function useCheckInVisit() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ visitId, location }: { visitId: string; location?: { lat: number; lng: number } }) => {
      return await backendApi.visits.update(visitId, {
        status: 'confirmed',
        notes: location ? `Checked in at ${location.lat}, ${location.lng}` : 'Checked in',
      });
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: visitKeys.detail(variables.visitId) });
    },
  });
}
