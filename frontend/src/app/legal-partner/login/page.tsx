'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Eye, EyeOff, Mail, Lock, Scale, Shield, ArrowLeft, CheckCircle, Award } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '@/contexts/AuthContext'

export default function LegalPartnerLoginPage() {
  const router = useRouter()
  const { login, loginWithGoogle } = useAuth()
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      await login(formData.email, formData.password, 'legal_partner')
    } catch (error: any) {
      toast.error(error.message || 'Login failed')
      setIsLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setIsLoading(true)
    try {
      await loginWithGoogle('legal_partner')
    } catch (error) {
      toast.error('Google login failed. Please try again.')
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 flex relative">
      {/* Back Button */}
      <Link
        href="/"
        className="absolute top-6 left-6 z-50 flex items-center space-x-2 px-4 py-2 bg-indigo-600/90 backdrop-blur-sm rounded-xl text-white hover:bg-indigo-700 transition-all duration-200 group"
      >
        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
        <span className="font-medium">Back to Home</span>
      </Link>

      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-indigo-700 via-blue-700 to-purple-700 relative overflow-hidden pt-20">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full -translate-x-48 -translate-y-48"></div>
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-white rounded-full translate-x-40 translate-y-40"></div>
        </div>

        <div className="relative z-10 flex flex-col justify-center px-12 text-white">
          <div className="flex items-center space-x-4 mb-12">
            <Scale className="w-16 h-16 text-yellow-300" />
            <div>
              <h1 className="text-3xl font-bold">GharBazaar</h1>
              <p className="text-indigo-200 font-medium">Legal Partner Portal</p>
            </div>
          </div>

          <div className="mb-12">
            <h2 className="text-4xl font-bold mb-6 leading-tight">
              Legal Expertise, Trusted Partnership
            </h2>
            <p className="text-xl text-indigo-100 mb-8 leading-relaxed">
              Handle property due diligence, title verification, and RERA compliance with India's leading real estate platform.
            </p>
          </div>

          <div className="space-y-6">
            {[
              { icon: Shield, title: 'Title Verification', desc: 'Comprehensive property title and ownership checks' },
              { icon: CheckCircle, title: 'RERA Compliance', desc: 'Ensure all properties meet regulatory requirements' },
              { icon: Award, title: 'Premium Earnings', desc: 'Competitive fees for legal due diligence services' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{title}</h3>
                  <p className="text-indigo-100">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center space-x-3 mb-8">
            <Scale className="w-12 h-12 text-indigo-600" />
            <div>
              <h1 className="text-2xl font-bold text-indigo-700">GharBazaar</h1>
              <p className="text-indigo-500 text-sm font-medium">Legal Partner Portal</p>
            </div>
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Welcome Back!</h2>
            <p className="text-gray-600 dark:text-gray-400">Sign in to your Legal Partner account</p>
          </div>

          {/* Google Login */}
          <button
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full flex items-center justify-center space-x-3 px-6 py-4 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-2xl hover:border-indigo-300 transition-all mb-6 group disabled:opacity-50"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            <span className="font-medium text-gray-700 dark:text-gray-300 group-hover:text-indigo-600">{isLoading ? 'Signing in...' : 'Continue with Google'}</span>
          </button>

          {/* Divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200 dark:border-gray-700"></div></div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white dark:bg-gray-900 text-gray-500">Or sign in with email</span>
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="legal@gharbazaar.in"
                  className="w-full pl-10 pr-4 py-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-12 py-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-end">
              <Link href="/legal-partner/forgot-password" className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center space-x-2 px-6 py-4 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-2xl hover:from-indigo-700 hover:to-blue-700 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : 'Sign In to Legal Portal'}
            </button>

            {/* Demo Bypass Button */}
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault()
                setIsLoading(true)
                setTimeout(() => {
                  const demoUser = {
                    uid: 'demo-legal-partner',
                    email: 'legal@gharbazaar.in',
                    displayName: 'Demo Legal Partner',
                    role: 'legal_partner'
                  }
                  localStorage.setItem('demo_mode', 'true')
                  localStorage.setItem('demo_user', JSON.stringify(demoUser))
                  localStorage.setItem('auth_token', 'demo-token:legal_partner:demo-legal-partner')
                  toast.success('Bypass successful: Welcome Demo Legal Partner!')
                  window.location.href = '/legal-partner'
                }, 500)
              }}
              disabled={isLoading}
              className="w-full flex items-center justify-center space-x-2 px-6 py-4 bg-gradient-to-r from-slate-600 to-gray-700 hover:from-slate-700 hover:to-gray-800 text-white rounded-2xl transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Bypass Demo Legal Partner
            </button>
          </form>

          {/* Sign Up Link */}
          <div className="text-center mt-8">
            <p className="text-gray-600 dark:text-gray-400">
              New legal partner?{' '}
              <Link href="/legal-partner/signup" className="text-indigo-600 hover:underline font-semibold">
                Apply Now
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
