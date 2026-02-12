// Firebase-like Auth Utilities for GharBazaar
// This is a simple localStorage-based auth helper that replaces Firebase

export interface SimpleUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  name?: string | null;
  photoURL: string | null;
  emailVerified?: boolean;
  phoneNumber?: string | null;
  role?: string;
  onboardingCompleted?: boolean;
  buyerClientId?: string;
  sellerClientId?: string;
  isDemo?: boolean;
  partnerType?: string;
}

const CACHED_USER_KEY = 'user';
const CACHED_TOKEN_KEY = 'auth_token';

// Get cached user from localStorage
export const getCachedUser = (): SimpleUser | null => {
  if (typeof window === 'undefined') return null;
  
  try {
    const userStr = localStorage.getItem(CACHED_USER_KEY);
    if (userStr) {
      return JSON.parse(userStr);
    }
  } catch (error) {
    console.error('Error getting cached user:', error);
  }
  return null;
};

// Cache user in localStorage
export const cacheUser = (user: SimpleUser): void => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(CACHED_USER_KEY, JSON.stringify(user));
  } catch (error) {
    console.error('Error caching user:', error);
  }
};

// Clear cached user
export const clearCache = (): void => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.removeItem(CACHED_USER_KEY);
    localStorage.removeItem(CACHED_TOKEN_KEY);
    localStorage.removeItem('demo_mode');
    localStorage.removeItem('demo_user');
    localStorage.removeItem('userRole');
  } catch (error) {
    console.error('Error clearing cache:', error);
  }
};

// Get cached token from localStorage
export const getCachedToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  
  try {
    return localStorage.getItem(CACHED_TOKEN_KEY);
  } catch (error) {
    console.error('Error getting cached token:', error);
  }
  return null;
};

// Cache token in localStorage
export const cacheToken = (token: string): void => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(CACHED_TOKEN_KEY, token);
  } catch (error) {
    console.error('Error caching token:', error);
  }
};

// Clear token only (keep user)
export const clearToken = (): void => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.removeItem(CACHED_TOKEN_KEY);
  } catch (error) {
    console.error('Error clearing token:', error);
  }
};

// Firebase-like sign out helper (placeholder)
export const firebaseSignOut = async (): Promise<void> => {
  // Since we're not using Firebase, this is just a placeholder
  clearCache();
};

// Demo mode helpers
export const isDemoMode = (): boolean => {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem('demo_mode') === 'true';
};

export const setDemoMode = (enabled: boolean): void => {
  if (typeof window === 'undefined') return;
  
  if (enabled) {
    localStorage.setItem('demo_mode', 'true');
  } else {
    localStorage.removeItem('demo_mode');
  }
};

// Check if user is logged in (has token and user data)
export const isLoggedIn = (): boolean => {
  if (typeof window === 'undefined') return false;
  return !!getCachedToken() && !!getCachedUser();
};

// Export all utilities as a single object
export const AuthUtils = {
  getCachedUser,
  cacheUser,
  clearCache,
  getCachedToken,
  cacheToken,
  clearToken,
  firebaseSignOut,
  isDemoMode,
  setDemoMode,
  isLoggedIn,
};

export default AuthUtils;
