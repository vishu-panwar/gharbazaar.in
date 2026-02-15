import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { backendApi } from '@/lib/backendApi';

// Types
interface LoginCredentials {
  email: string;
  password: string;
}

interface SignupData {
  email: string;
  password: string;
  name: string;
  role?: string;
}

interface UpdateProfileData {
  name?: string;
  phone?: string;
  address?: string;
  dateOfBirth?: string;
  gender?: string;
  profilePhoto?: string;
}

interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

// Query Keys
export const authKeys = {
  profile: ['auth', 'profile'] as const,
  user: (id: string) => ['auth', 'user', id] as const,
};

/**
 * Hook to fetch current user profile
 */
export function useProfile() {
  return useQuery({
    queryKey: authKeys.profile,
    queryFn: async () => {
      const token = localStorage.getItem('auth_token');
      if (!token) throw new Error('No auth token');
      const response = await backendApi.auth.verifyToken(token);
      return response.data?.user || response.user;
    },
    enabled: typeof window !== 'undefined' && !!localStorage.getItem('auth_token'),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });
}

/**
 * Hook to handle user login
 */
export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      return await backendApi.auth.login(credentials.email, credentials.password);
    },
    onSuccess: (data) => {
      // Update profile cache
      if (data.user) {
        queryClient.setQueryData(authKeys.profile, data.user);
      }
      // Invalidate to refetch with token
      queryClient.invalidateQueries({ queryKey: authKeys.profile });
    },
  });
}

/**
 * Hook to handle user signup/registration
 */
export function useSignup() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: SignupData) => {
      return await backendApi.auth.register({
        email: data.email,
        password: data.password,
        displayName: data.name,
        role: data.role,
      });
    },
    onSuccess: (data) => {
      // Update profile cache
      if (data.user) {
        queryClient.setQueryData(authKeys.profile, data.user);
      }
      queryClient.invalidateQueries({ queryKey: authKeys.profile });
    },
  });
}

/**
 * Hook to handle Google OAuth login
 */
export function useGoogleLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ authCode, role }: { authCode: string; role?: string }) => {
      return await backendApi.auth.googleLogin(authCode, role);
    },
    onSuccess: (data) => {
      if (data.user) {
        queryClient.setQueryData(authKeys.profile, data.user);
      }
      queryClient.invalidateQueries({ queryKey: authKeys.profile });
    },
  });
}

/**
 * Hook to handle user logout
 */
export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      // Call logout endpoint if exists
      try {
        await backendApi.auth.logout();
      } catch (error) {
        // Logout locally even if backend call fails
        console.error('Logout error:', error);
      }
    },
    onSuccess: () => {
      // Clear token
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token');
      }
      // Clear all caches
      queryClient.clear();
    },
  });
}

/**
 * Hook to verify email with token
 */
export function useVerifyEmail() {
  return useMutation({
    mutationFn: async (token: string) => {
      return await backendApi.auth.verifyEmail(token);
    },
  });
}

/**
 * Hook to request password reset
 */
export function useForgotPassword() {
  return useMutation({
    mutationFn: async (email: string) => {
      return await backendApi.auth.forgotPassword(email);
    },
  });
}

/**
 * Hook to reset password with token
 */
export function useResetPassword() {
  return useMutation({
    mutationFn: async ({ token, newPassword }: { token: string; newPassword: string }) => {
      return await backendApi.auth.resetPassword(token, newPassword);
    },
  });
}

/**
 * Hook to update user profile
 */
export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateProfileData) => {
      return await backendApi.users.updateProfile(data);
    },
    onSuccess: (data) => {
      // Optimistically update the cache
      queryClient.setQueryData(authKeys.profile, data);
      queryClient.invalidateQueries({ queryKey: authKeys.profile });
    },
  });
}

/**
 * Hook to change password
 */
export function useChangePassword() {
  return useMutation({
    mutationFn: async (data: ChangePasswordData) => {
      return await backendApi.users.changePassword(data.currentPassword, data.newPassword);
    },
  });
}
