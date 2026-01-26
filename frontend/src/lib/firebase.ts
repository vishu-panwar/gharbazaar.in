// Firebase has been DISABLED to prevent backend connection disruptions
// The backend will handle all authentication and data storage
// These are stub exports to maintain compatibility with existing code

// Stub Firebase initialization - all values are null
const app: any = null
const auth: any = null
const db: any = null
const storage: any = null
const analytics: any = null
const googleProvider: any = null

console.info('Firebase is disabled. Using backend for all operations.')

// PERFORMANCE OPTIMIZATION: Auth utilities
export const AuthUtils = {
  // Get current user synchronously (no waiting)
  getCurrentUser: () => {
    if (!auth) return null
    return auth.currentUser
  },

  // Check if user is logged in (instant)
  isLoggedIn: () => {
    // Check demo mode first
    if (typeof window !== 'undefined' && localStorage.getItem('demo_mode') === 'true') {
      return true;
    }
    const user = AuthUtils.getCurrentUser()
    const cachedUser = typeof window !== 'undefined' ? localStorage.getItem('user') : null
    return !!(user || cachedUser)
  },

  // Get cached user data (instant)
  getCachedUser: () => {
    if (typeof window === 'undefined') return null
    try {
      // Check demo mode first
      if (localStorage.getItem('demo_mode') === 'true') {
        const demoUser = localStorage.getItem('demo_user');
        if (demoUser) {
          const parsed = JSON.parse(demoUser);
          // Map demo user to internal user format if needed
          return {
            uid: parsed.uid,
            email: parsed.email,
            displayName: parsed.displayName,
            role: parsed.role,
            isDemo: true
          };
        }
      }
      const cached = localStorage.getItem('user')
      return cached ? JSON.parse(cached) : null
    } catch {
      return null
    }
  },

  // Cache user data for instant access
  cacheUser: (userData: any) => {
    if (typeof window === 'undefined') return
    localStorage.setItem('user', JSON.stringify(userData))
    localStorage.setItem('userRole', userData.role || 'buyer')
    localStorage.setItem('lastLogin', Date.now().toString())
  },

  // Clear all cached data
  clearCache: () => {
    if (typeof window === 'undefined') return
    localStorage.removeItem('user')
    localStorage.removeItem('userRole')
    localStorage.removeItem('userMode')
    localStorage.removeItem('lastLogin')
    localStorage.removeItem('demo_mode')
    localStorage.removeItem('demo_user')
  },

  // Get user role (instant)
  getUserRole: () => {
    if (typeof window === 'undefined') return 'buyer'
    return localStorage.getItem('userRole') || 'buyer'
  }
}

// Recaptcha Verifier for Phone Auth (DISABLED - Firebase removed)
export const setupRecaptcha = (containerId: string) => {
  console.warn('Firebase is disabled. Recaptcha setup is not available. Use backend authentication instead.')
  return null
}

export { auth, db, storage, analytics, googleProvider }
export default app
