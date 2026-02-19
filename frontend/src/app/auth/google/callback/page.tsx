'use client'

import { useEffect, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { backendApi } from '@/lib/backendApi'
import { AuthUtils } from '@/lib/firebase'
import {
  isAdminRole,
  isEmployeeRole,
  isGroundPartnerRole,
  isLegalPartnerRole,
  isPromoterPartnerRole,
  isServiceOrLegalPartnerRole,
  normalizeRole,
  resolveEffectiveRole,
} from '@/lib/roleRouting'

export default function GoogleCallbackPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const handledRef = useRef(false)

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
        return
      }

      if (handledRef.current) {
        console.log('Google callback already handled - ignoring duplicate invocation')
        return
      }
      handledRef.current = true

      try {
        const requestedRole = localStorage.getItem('requested_role')
        const response = await backendApi.auth.googleLogin(code, requestedRole || undefined)

        const token =
          response.token ||
          response.data?.token ||
          response.access_token ||
          (typeof response === 'string' ? response : null)

        if (!token) {
          throw new Error('Authentication failed: No token received')
        }

        localStorage.setItem('auth_token', token)
        const verifyRes = await backendApi.auth.verifyToken(token)

        let userData: any = null
        if (verifyRes.success && verifyRes.data?.user) {
          userData = verifyRes.data.user
        } else if (token.includes('.')) {
          try {
            const base64Url = token.split('.')[1]
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
            const jsonPayload = decodeURIComponent(
              atob(base64)
                .split('')
                .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
            )
            const payload = JSON.parse(jsonPayload)

            const email = payload.email || payload.emailAddress || payload.unique_name || 'user@example.com'
            const name =
              payload.name ||
              payload.displayName ||
              payload.fullName ||
              (payload.given_name && payload.family_name ? `${payload.given_name} ${payload.family_name}` : null) ||
              payload.given_name ||
              payload.nickname ||
              email.split('@')[0] ||
              'User'

            userData = {
              uid: String(payload.sub || payload.id || payload._id || payload.uid || payload.oid || 'jwt-user'),
              email,
              name,
              displayName: name,
              role: (payload.role || 'buyer').toLowerCase(),
              photoURL: payload.picture || payload.photoURL || payload.avatar || null,
              onboardingCompleted: payload.onboardingCompleted || false,
            }
          } catch (decodeError) {
            console.error('OAuth JWT decode failed:', decodeError)
          }
        }

        const effectiveRole = resolveEffectiveRole(userData?.role, requestedRole)
        const resolvedUserData =
          effectiveRole && normalizeRole(userData?.role) !== effectiveRole
            ? { ...userData, role: effectiveRole }
            : userData

        if (resolvedUserData) {
          AuthUtils.cacheUser(resolvedUserData)
        }

        toast.success('Welcome back! Logging you in...')

        setTimeout(() => {
          const user = resolvedUserData as any
          const redirectRole = resolveEffectiveRole(user?.role, requestedRole)

          if (isServiceOrLegalPartnerRole(redirectRole)) {
            if (!user?.onboardingCompleted) {
              window.location.replace('/service-partners/kyc')
            } else if (
              localStorage.getItem('gharbazaar_partner_type') === 'Lawyer' ||
              user?.partnerType === 'Lawyer' ||
              isLegalPartnerRole(redirectRole)
            ) {
              window.location.replace('/legal-partner')
            } else {
              window.location.replace('/service-partners')
            }
          } else if (isEmployeeRole(redirectRole)) {
            if (!user?.onboardingCompleted) {
              window.location.replace('/employee/onboarding')
            } else {
              window.location.replace('/employee')
            }
          } else if (isGroundPartnerRole(redirectRole)) {
            window.location.replace('/ground-partner')
          } else if (isPromoterPartnerRole(redirectRole)) {
            window.location.replace('/partner')
          } else if (isAdminRole(redirectRole)) {
            window.location.replace('/dashboard')
          } else {
            window.location.replace('/dashboard')
          }
        }, 500)
      } catch (callbackError: any) {
        localStorage.removeItem('requested_role')
        console.error('Final callback catch:', callbackError)
        toast.error(callbackError.message || 'Login failed')
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
          We&apos;re fetching your profile details from our secure servers. Please wait a moment.
        </p>
        <div className="w-full mt-10 h-1.5 bg-slate-800 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-blue-600 to-cyan-400 animate-[loading_1.5s_infinite] w-1/2"></div>
        </div>
      </div>
      <style jsx>{`
        @keyframes loading {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(200%);
          }
        }
      `}</style>
    </div>
  )
}
