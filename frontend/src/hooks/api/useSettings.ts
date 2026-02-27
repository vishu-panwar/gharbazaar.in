import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { backendApi } from '@/lib/backendApi';

// Types
interface UserSettings {
  theme?: 'light' | 'dark' | 'system';
  language?: 'en' | 'hi' | 'mr';
  currency?: string;
  timezone?: string;
  emailMarketing?: boolean;
  emailTransactional?: boolean;
  emailFrequency?: 'realtime' | 'daily' | 'weekly' | 'never';
  notifications?: {
    push?: boolean;
    email?: boolean;
    sms?: boolean;
  };
  privacy?: {
    profileVisibility?: 'public' | 'private';
    showEmail?: boolean;
    showPhone?: boolean;
  };
  [key: string]: any;
}

// Query Keys
export const settingsKeys = {
  all: ['settings'] as const,
  user: () => [...settingsKeys.all, 'user'] as const,
};

/**
 * Hook to fetch user settings
 */
export function useSettings() {
  return useQuery({
    queryKey: settingsKeys.user(),
    queryFn: async () => {
      return await backendApi.settings.get();
    },
    staleTime: 10 * 60 * 1000, // 10 minutes - settings don't change often
    // Also try localStorage as fallback
    placeholderData: () => {
      if (typeof window === 'undefined') return undefined;
      
      try {
        const stored = localStorage.getItem('user_settings');
        return stored ? JSON.parse(stored) : undefined;
      } catch {
        return undefined;
      }
    },
  });
}

/**
 * Hook to update user settings
 */
export function useUpdateSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<UserSettings>) => {
      return await backendApi.settings.update(data);
    },
    onMutate: async (newSettings) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: settingsKeys.user() });

      // Snapshot previous value
      const previousSettings = queryClient.getQueryData(settingsKeys.user());

      // Optimistically update
      queryClient.setQueryData(settingsKeys.user(), (old: any) => ({
        ...old,
        ...newSettings,
      }));

      // Also save to localStorage for offline access
      if (typeof window !== 'undefined') {
        try {
          const current = queryClient.getQueryData(settingsKeys.user());
          localStorage.setItem('user_settings', JSON.stringify(current));
        } catch (error) {
          console.error('Failed to save settings to localStorage:', error);
        }
      }

      return { previousSettings };
    },
    onError: (err, newSettings, context) => {
      // Rollback on error
      if (context?.previousSettings) {
        queryClient.setQueryData(settingsKeys.user(), context.previousSettings);
      }
    },
    onSuccess: (data) => {
      // Update with server response if available
      if (data) {
        queryClient.setQueryData(settingsKeys.user(), data);
        
        // Sync to localStorage
        if (typeof window !== 'undefined') {
          try {
            localStorage.setItem('user_settings', JSON.stringify(data));
          } catch (error) {
            console.error('Failed to save settings to localStorage:', error);
          }
        }
      }
    },
  });
}

/**
 * Hook to update theme setting
 */
export function useUpdateTheme() {
  const updateSettings = useUpdateSettings();
  
  return {
    ...updateSettings,
    mutate: (theme: 'light' | 'dark' | 'system') => updateSettings.mutate({ theme }),
    mutateAsync: (theme: 'light' | 'dark' | 'system') => updateSettings.mutateAsync({ theme }),
  };
}

/**
 * Hook to update language setting
 */
export function useUpdateLanguage() {
  const updateSettings = useUpdateSettings();
  
  return {
    ...updateSettings,
    mutate: (language: 'en' | 'hi' | 'mr') => updateSettings.mutate({ language }),
    mutateAsync: (language: 'en' | 'hi' | 'mr') => updateSettings.mutateAsync({ language }),
  };
}

/**
 * Hook to update currency setting
 */
export function useUpdateCurrency() {
  const updateSettings = useUpdateSettings();
  
  return {
    ...updateSettings,
    mutate: (currency: string) => updateSettings.mutate({ currency }),
    mutateAsync: (currency: string) => updateSettings.mutateAsync({ currency }),
  };
}

/**
 * Hook to update timezone setting
 */
export function useUpdateTimezone() {
  const updateSettings = useUpdateSettings();
  
  return {
    ...updateSettings,
    mutate: (timezone: string) => updateSettings.mutate({ timezone }),
    mutateAsync: (timezone: string) => updateSettings.mutateAsync({ timezone }),
  };
}

/**
 * Hook to update email preferences
 */
export function useUpdateEmailPreferences() {
  const updateSettings = useUpdateSettings();
  
  return {
    ...updateSettings,
    mutate: (prefs: { 
      emailMarketing?: boolean; 
      emailTransactional?: boolean; 
      emailFrequency?: 'realtime' | 'daily' | 'weekly' | 'never' 
    }) => updateSettings.mutate(prefs),
    mutateAsync: (prefs: { 
      emailMarketing?: boolean; 
      emailTransactional?: boolean; 
      emailFrequency?: 'realtime' | 'daily' | 'weekly' | 'never' 
    }) => updateSettings.mutateAsync(prefs),
  };
}

/**
 * Hook to reset settings to default
 */
export function useResetSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      return await backendApi.settings.reset();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: settingsKeys.user() });
      
      // Clear localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('user_settings');
      }
    },
  });
}
