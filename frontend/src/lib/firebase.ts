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
  },

  // Google Auth using Google Identity Services (no Firebase needed)
  createGoogleProvider: () => {
    console.info('Loading Google Identity Services...')
    if (typeof window === 'undefined') {
      throw new Error('Google login must be in browser environment')
    }

    return new Promise((resolve, reject) => {
      // Check if Google Identity Services is already loaded
      if ((window as any).google?.accounts) {
        resolve({ type: 'gsi', google: (window as any).google })
        return
      }

      // Load Google Identity Services SDK
      const script = document.createElement('script')
      script.src = 'https://accounts.google.com/gsi/client'
      script.async = true
      script.defer = true
      script.onload = () => {
        console.info('Google Identity Services loaded')
        resolve({ type: 'gsi', google: (window as any).google })
      }
      script.onerror = () => reject(new Error('Failed to load Google Identity Services'))
      document.head.appendChild(script)
    })
  },

  // Sign in with Google using Identity Services
  signInWithPopup: async (providerData: any) => {
    if (typeof window === 'undefined') {
      throw new Error('Google login must be in browser environment')
    }

    const google = providerData.google
    if (!google?.accounts) {
      throw new Error('Google Identity Services not initialized')
    }

    // Get Google OAuth client ID from environment
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID
    if (!clientId) {
      throw new Error('Google Client ID not configured. Please set NEXT_PUBLIC_GOOGLE_CLIENT_ID in your .env.local file')
    }

    return new Promise((resolve, reject) => {
      // Initialize Google OAuth client
      const client = google.accounts.oauth2.initTokenClient({
        client_id: clientId,
        scope: 'openid email profile',
        callback: async (response: any) => {
          if (response.error) {
            reject(new Error(response.error))
            return
          }

          // Response contains the access_token
          // We need to get user info and construct a credential-like object
          try {
            const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
              headers: { Authorization: `Bearer ${response.access_token}` }
            })
            const userInfo = await userInfoResponse.json()

            resolve({
              user: {
                uid: userInfo.sub,
                email: userInfo.email,
                displayName: userInfo.name,
                photoURL: userInfo.picture,
                emailVerified: userInfo.email_verified
              },
              credential: {
                accessToken: response.access_token,
                idToken: response.access_token // For backend verification
              }
            })
          } catch (error) {
            reject(error)
          }
        }
      })

      // Request access token (triggers popup)
      client.requestAccessToken()
    })
  },

  // Get ID token from user (for Identity Services, we use the access token)
  getIdToken: async (user: any) => {
    // For Google Identity Services, we return the credential's idToken
    // The backend will verify this with Google
    if (!user || !user.credential || !user.credential.idToken) {
      throw new Error('Invalid user credential')
    }
    return user.credential.idToken
  }
}

// Recaptcha Verifier for Phone Auth (DISABLED - Firebase removed)
export const setupRecaptcha = (containerId: string) => {
  console.warn('Firebase is disabled. Recaptcha setup is not available. Use backend authentication instead.')
  return null
}

export { auth, db, storage, analytics, googleProvider }
export default app
