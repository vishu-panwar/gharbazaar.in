'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { AuthUtils } from '@/lib/firebase'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import Loader from '@/components/ui/Loader'
import { backendApi } from '@/lib/backendApi'

// Simple User type (no Firebase dependency)
interface SimpleUser {
  uid: string
  email: string | null
  displayName: string | null
  name?: string | null
  photoURL: string | null
  emailVerified?: boolean
  phoneNumber?: string | null
  role?: string
  onboardingCompleted?: boolean
}

interface AuthContextType {
  user: SimpleUser | null
  loading: boolean
  authLoading: boolean
  signup: (email: string, password: string, name: string) => Promise<void>
  login: (email: string, password: string) => Promise<void>
  loginWithGoogle: (role?: string) => Promise<void>
  loginWithPhone: (phoneNumber: string) => Promise<any>
  logout: () => Promise<void>
  resetPassword: (email: string) => Promise<void>
  updateUserProfile: (displayName: string, photoURL?: string) => Promise<void>
  sendVerificationEmail: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

export const AuthProvider = ({
  children,
  loadingComponent
}: {
  children: ReactNode
  loadingComponent?: ReactNode
}) => {
  const [user, setUser] = useState<SimpleUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [authLoading, setAuthLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Check for existing authentication on mount
    const initAuth = async () => {
      try {
        console.log('🔄 Initializing Auth State...')

        // 1. Check if we have an auth token (Priority)
        const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null

        if (token) {
          console.log('🎫 Found auth token, verifying...')
          await verifyTokenWithBackend(token)
          // Note: verifyTokenWithBackend sets loading to false
          return
        }

        // 2. Check demo mode first
        if (typeof window !== 'undefined') {
          const demoMode = localStorage.getItem('demo_mode')
          const demoUserStr = localStorage.getItem('demo_user')

          if (demoMode === 'true' && demoUserStr) {
            try {
              const demoUser = JSON.parse(demoUserStr)
              setUser({
                uid: demoUser.uid,
                email: demoUser.email,
                displayName: demoUser.displayName,
                name: demoUser.displayName,
                photoURL: null,
                emailVerified: true,
              })
              localStorage.setItem('userRole', demoUser.role || 'buyer')
              setLoading(false)
              return
            } catch (e) {
              console.error('Demo mode parse error:', e)
            }
          }
        }

        // 3. Check cached user from localStorage as fallback
        const cachedUser = AuthUtils.getCachedUser()
        if (cachedUser) {
          console.log('👤 Found cached user:', cachedUser.email)
          setUser(cachedUser)
          setLoading(false)
          return
        }

        // No auth found
        setLoading(false)
      } catch (error) {
        console.error('❌ Auth initialization error:', error)
        setLoading(false)
      }
    }

    initAuth()
  }, [])

  // Verify token with backend
  const verifyTokenWithBackend = async (token: string) => {
    try {
      console.log('📡 Verifying token with backend...')
      const response = await backendApi.auth.verifyToken(token)

      if (response.success && response.data) {
        const userData = response.data.user
        console.log('✅ Token verified! User:', userData.name || userData.email)
        setUser(userData)
        AuthUtils.cacheUser(userData)
      } else {
        console.warn('⚠️ Token verification failed:', response.error)

        // STRICTER LOGOUT POLICY:
        // Only clear if explicitly 401 (Unauthorized) or 403 (Forbidden)
        if (response.status === 401 || response.status === 403) {
          console.log('🚪 Clearing session due to auth failure (401/403)')
          localStorage.removeItem('auth_token')
          AuthUtils.clearCache()
          setUser(null)
        } else {
          console.log('⏳ Server error or Network issue, keeping session alive with cache')
          // Try to keep user logged in with cache if verification simply failed (e.g. 500 or network)
          const cached = AuthUtils.getCachedUser()
          if (cached) {
            console.log('👤 Restoring from cache due to verification error')
            setUser(cached)
          }
        }
      }
    } catch (error) {
      console.error('❌ Token verification exception:', error)
      // Do NOT clear session on exception (network error etc), just use cache if possible
      const cached = AuthUtils.getCachedUser()
      if (cached) {
        setUser(cached)
      }
    } finally {
      setLoading(false)
    }
  }

  // Login with backend API
  const login = async (email: string, password: string) => {
    try {
      setAuthLoading(true)
      const response = await backendApi.auth.login(email, password)

      if (!response.success) {
        throw new Error(response.error || 'Login failed')
      }

      // Store token and user data
      const { token, user: userData } = response.data
      localStorage.setItem('auth_token', token)
      localStorage.removeItem('demo_mode')
      localStorage.removeItem('demo_user')

      // Cache user data
      AuthUtils.cacheUser(userData)
      setUser(userData)

      toast.success('Welcome back!')

      // Navigate to dashboard
      setTimeout(() => {
        router.push('/dashboard')
        setAuthLoading(false)
      }, 1500)

    } catch (error: any) {
      setAuthLoading(false)
      console.error('Login error:', error)
      throw new Error(error.message || 'Failed to login')
    }
  }

  // Signup with backend API
  const signup = async (email: string, password: string, name: string) => {
    try {
      setAuthLoading(true)
      const response = await backendApi.auth.register({
        email,
        password,
        displayName: name,
      })

      if (!response.success) {
        throw new Error(response.error || 'Signup failed')
      }

      // Store token and user data
      const { token, user: userData } = response.data
      localStorage.setItem('auth_token', token)
      localStorage.removeItem('demo_mode')
      localStorage.removeItem('demo_user')

      // Cache user data
      AuthUtils.cacheUser(userData)
      setUser(userData)

      toast.success('Account created! Welcome to GharBazaar.')

      // Navigate to dashboard
      setTimeout(() => {
        router.push('/dashboard')
        setAuthLoading(false)
      }, 1500)

    } catch (error: any) {
      setAuthLoading(false)
      console.error('Signup error:', error)
      throw new Error(error.message || 'Failed to create account')
    }
  }

  // Login with Google (redirect to Google, then backend handles code)
  const loginWithGoogle = async (role?: string) => {
    try {
      setAuthLoading(true)
      localStorage.removeItem('demo_mode')
      localStorage.removeItem('demo_user')

      if (role) {
        localStorage.setItem('requested_role', role)
      } else {
        localStorage.removeItem('requested_role')
      }


      // Get Google Client ID
      const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID
      if (!clientId || clientId.includes('your-google-client-id')) {
        toast.error('Google login not configured')
        setAuthLoading(false)
        return
      }

      // Build Google OAuth URL (redirect to Google, not backend)
      const redirectUri = `${window.location.origin}/auth/google/callback`
      const scope = 'https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile openid'
      const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
        `client_id=${encodeURIComponent(clientId)}` +
        `&redirect_uri=${encodeURIComponent(redirectUri)}` +
        `&response_type=code` +
        `&scope=${encodeURIComponent(scope)}` +
        `&access_type=offline` +
        `&prompt=select_account`

      // Redirect to Google's OAuth page
      window.location.href = googleAuthUrl

    } catch (error: any) {
      setAuthLoading(false)
      console.error('Google login error:', error)
      toast.error(error.message || 'Google login failed')
      throw error
    }
  }

  // Login with Phone (placeholder)
  const loginWithPhone = async (phoneNumber: string): Promise<any> => {
    toast.error('Phone login is not yet implemented with backend API')
    // TODO: Implement phone auth with backend
    throw new Error('Not implemented')
  }

  // Logout
  const logout = async () => {
    try {
      // Call backend logout endpoint
      await backendApi.auth.logout()
    } catch (error) {
      console.error('Backend logout error:', error)
    } finally {
      // Clear local data regardless of backend response
      localStorage.removeItem('auth_token')
      localStorage.removeItem('demo_mode')
      localStorage.removeItem('demo_user')
      AuthUtils.clearCache()
      setUser(null)

      toast.success('Logged out successfully')
      router.push('/')
    }
  }

  // Reset Password
  const resetPassword = async (email: string) => {
    try {
      const response = await backendApi.auth.forgotPassword(email)

      if (!response.success) {
        throw new Error(response.error || 'Failed to send reset email')
      }

      toast.success('Password reset email sent!')
    } catch (error: any) {
      console.error('Reset password error:', error)
      throw new Error(error.message || 'Failed to send reset email')
    }
  }

  // Update User Profile
  const updateUserProfile = async (displayName: string, photoURL?: string) => {
    try {
      const response = await backendApi.user.updateProfile({
        displayName,
        ...(photoURL && { photoURL }),
      })

      if (!response.success) {
        throw new Error(response.error || 'Failed to update profile')
      }

      // Update cached user
      const cachedUser = AuthUtils.getCachedUser()
      if (cachedUser) {
        const updatedUser = { ...cachedUser, displayName, photoURL }
        AuthUtils.cacheUser(updatedUser)
        setUser(updatedUser)
      }

      toast.success('Profile updated!')
    } catch (error: any) {
      console.error('Update profile error:', error)
      throw new Error(error.message || 'Failed to update profile')
    }
  }

  // Send Verification Email (placeholder)
  const sendVerificationEmail = async () => {
    toast.error('Email verification not yet implemented with backend API')
    // TODO: Implement with backend
    throw new Error('Not implemented')
  }

  const value = {
    user,
    loading,
    authLoading,
    signup,
    login,
    loginWithGoogle,
    loginWithPhone,
    logout,
    resetPassword,
    updateUserProfile,
    sendVerificationEmail,
  }

  return (
    <AuthContext.Provider value={value}>
      {/* Authentication Loader */}
      <Loader
        isVisible={authLoading}
        message="Signing you in securely..."
        duration={1500}
      />

      {loading ? (loadingComponent || null) : children}
    </AuthContext.Provider>
  )
}
