'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { backendApi } from '@/lib/backendApi'
import { AuthUtils } from '@/lib/firebase'
import toast from 'react-hot-toast'
import { Loader2 } from 'lucide-react'

/**
 * Google OAuth Callback Page
 * Exchanges authorization code for a token and fetches user data
 */
export default function GoogleCallbackPage() {
    const router = useRouter()
    const searchParams = useSearchParams()

    useEffect(() => {
        const handleGoogleCallback = async () => {
            const code = searchParams.get('code')
            const error = searchParams.get('error')

            if (error) {
                console.error('Google OAuth error:', error)
                toast.error('Login failed: ' + error)
                router.push('/login')
                return
            }

            if (!code) {
                console.log('No code found in params yet...')
                return
            }

            try {
                console.log('📡 [Step 1] Exchanging OAuth code for token...')
                const requestedRole = localStorage.getItem('requested_role') || undefined
                const response = await backendApi.auth.googleLogin(code, requestedRole)

                // Clear requested role
                localStorage.removeItem('requested_role')

                // The access_token according to backend requirements
                const token = response.token || response.data?.token || response.access_token || (typeof response === 'string' ? response : null)

                if (!token) {
                    console.error('❌ Login Error: No token in response', response)
                    throw new Error('Authentication failed: No token received')
                }

                console.log('✅ [Step 1] Token received and stored')
                localStorage.setItem('auth_token', token)

                console.log('📡 [Step 2] Fetching profile from /users via verifyToken...')
                const verifyRes = await backendApi.auth.verifyToken(token)

                let userData = null
                if (verifyRes.success && verifyRes.data?.user) {
                    userData = verifyRes.data.user
                    console.log('✅ [Step 2] Profile verified successfully', userData.email)
                } else {
                    console.warn('⚠️ [Step 2] Profile verification failed or returned incomplete data. Error:', verifyRes.error)

                    // Fallback to Robust JWT decode
                    if (token && token.includes('.')) {
                        try {
                            const base64Url = token.split('.')[1]
                            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
                            const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
                                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
                            }).join(''))

                            const payload = JSON.parse(jsonPayload)

                            // Robust mapping (Same as backendApi.ts)
                            const email = payload.email || payload.emailAddress || payload.unique_name || 'user@example.com'
                            const name = payload.name || payload.displayName || payload.fullName ||
                                (payload.given_name && payload.family_name ? `${payload.given_name} ${payload.family_name}` : null) ||
                                payload.given_name || payload.nickname || email.split('@')[0] || 'User'

                            userData = {
                                uid: String(payload.sub || payload.id || payload._id || payload.uid || payload.oid || 'jwt-user'),
                                email: email,
                                name: name,
                                displayName: name,
                                role: (payload.role || 'buyer').toLowerCase(),
                                photoURL: payload.picture || payload.photoURL || payload.avatar || null,
                                onboardingCompleted: payload.onboardingCompleted || false
                            }
                            console.log('📝 Locally mapped OAuth user:', userData.displayName)
                        } catch (e) {
                            console.error('❌ Failed to decode OAuth token JWT:', e)
                        }
                    }
                }

                // Final save and redirect
                AuthUtils.cacheUser(userData)
                console.log('💾 [Step 3] User cached, redirecting...')

                toast.success(`Welcome back! Logging you in...`)

                // Use location.replace to force a clean slate for the auth context
                setTimeout(() => {
                    const user = userData as any;
                    if (user && user.role === 'employee' && !user.onboardingCompleted) {
                        window.location.replace('/employee/onboarding')
                    } else if (user && user.role === 'employee') {
                        window.location.replace('/employee')
                    } else {
                        window.location.replace('/dashboard')
                    }
                }, 500)


            } catch (error: any) {
                console.error('❌ Final Callback Catch:', error)
                toast.error(error.message || 'Login failed')
                router.push('/login')
            }
        }

        handleGoogleCallback()
    }, [searchParams, router])

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#0f172a] text-white">
            <div className="p-12 rounded-3xl bg-[#1e293b] shadow-2xl border border-slate-700 flex flex-col items-center max-w-sm w-full">
                <div className="relative mb-8">
                    <Loader2 className="w-16 h-16 animate-spin text-blue-500" />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-4 h-4 bg-blue-500 rounded-full animate-pulse"></div>
                    </div>
                </div>
                <h2 className="text-2xl font-bold mb-2">Syncing your account</h2>
                <p className="text-slate-400 text-center text-sm leading-relaxed">
                    We're fetching your profile details from our secure servers. Please wait a moment.
                </p>
                <div className="w-full mt-10 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-blue-600 to-cyan-400 animate-[loading_1.5s_infinite] w-1/2"></div>
                </div>
            </div>
            <style jsx>{`
                @keyframes loading {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(200%); }
                }
            `}</style>
        </div>
    )
}
