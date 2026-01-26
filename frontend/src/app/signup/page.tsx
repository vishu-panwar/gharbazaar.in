'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  Loader2,
  Home,
  ArrowRight,
  ArrowLeft,
  Shield,
  Users,
  DollarSign
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { useLoader } from '@/components/GlobalLoader'
import InteractiveBackground from '@/components/InteractiveBackground'

export default function SignupPage() {
  const router = useRouter()
  const { signup, loginWithGoogle } = useAuth()
  const { showLoader } = useLoader()

  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)


  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    agreeToTerms: false,
  })

  // Password strength checker
  const getPasswordStrength = (password: string) => {
    let strength = 0
    if (password.length >= 8) strength++
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++
    if (/\d/.test(password)) strength++
    if (/[^a-zA-Z\d]/.test(password)) strength++
    return strength
  }

  const passwordStrength = getPasswordStrength(formData.password)
  const strengthLabels = ['Weak', 'Fair', 'Good', 'Strong']
  const strengthColors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500']

  // Handle Email Signup
  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.email || !formData.password) {
      alert('Please fill in all fields')
      return
    }

    if (passwordStrength < 2) {
      alert('Please use a stronger password')
      return
    }

    if (!formData.agreeToTerms) {
      alert('Please agree to the terms and conditions')
      return
    }

    setLoading(true)
    showLoader('Creating your account...', 2000)

    try {
      await signup(formData.email, formData.password, formData.name)
      // Signup function already handles navigation with loader
    } catch (error: any) {
      alert(error.message || 'Signup failed')
      setLoading(false)
    }
  }

  // Handle Google Signup
  const handleGoogleSignup = async () => {
    setLoading(true)
    showLoader('Signing up with Google...', 2000)
    try {
      await loginWithGoogle()
      // LoginWithGoogle function already handles navigation with loader
    } catch (error: any) {
      alert(error.message || 'Google signup failed')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row relative bg-white dark:bg-gray-950">
      {/* Go Back Button - Fixed for permanent visibility */}
      <Link
        href="/"
        className="fixed top-4 left-4 sm:top-6 sm:left-6 z-[100] flex items-center space-x-2 px-4 py-2 bg-white/30 dark:bg-black/30 backdrop-blur-md rounded-xl text-white border border-white/20 hover:bg-white/40 transition-all duration-200 group shadow-lg"
      >
        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
        <span className="font-medium text-sm sm:text-base">Back to Home</span>
      </Link>

      {/* Left Side - Brand Section (50%) */}
      <div className="hidden lg:flex w-1/2 relative flex-col justify-center px-12 overflow-hidden bg-gradient-to-br from-emerald-600 via-teal-600 to-green-700">
        {/* Background Bubble Pattern (Exact replica of Partner Portal) */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full -translate-x-48 -translate-y-48"></div>
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-white rounded-full translate-x-40 translate-y-40"></div>
          <div className="absolute top-1/2 left-1/4 w-60 h-60 bg-white rounded-full -translate-y-1/2"></div>
        </div>

        <div className="relative z-10 text-center text-white px-6 lg:px-12">
          {/* Logo Section */}
          <div className="mb-8 lg:mb-12">
            <div className="w-16 h-16 lg:w-24 lg:h-24 mx-auto mb-4 lg:mb-6">
              <div className="w-full h-full bg-white/20 backdrop-blur-md rounded-2xl lg:rounded-3xl flex items-center justify-center shadow-2xl overflow-hidden border border-white/30">
                <img
                  src="/images/gharbazaar-logo.jpg"
                  alt="GharBazaar Logo"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <h1 className="text-3xl lg:text-5xl font-bold mb-2 lg:mb-4 tracking-tight">GharBazaar</h1>
            <p className="text-lg lg:text-xl text-emerald-100 font-light">
              India's Leading Property Platform
            </p>
          </div>

          {/* Main Content */}
          <div className="mb-8 lg:mb-12">
            <h2 className="text-2xl lg:text-3xl font-bold mb-4 lg:mb-6 leading-tight">
              Join the Revolution!
            </h2>
            <p className="text-base lg:text-lg text-emerald-50/80 mb-6 lg:mb-8 leading-relaxed max-w-md mx-auto font-medium">
              Create your account and experience transparent property deals without brokers or hidden fees.
            </p>
          </div>

          {/* Trust Points */}
          <div className="space-y-3 lg:space-y-4 max-w-sm mx-auto">
            <div className="flex items-center space-x-3 lg:space-x-4 bg-white/10 backdrop-blur-sm rounded-xl p-3 lg:p-4">
              <Shield className="text-teal-200" size={20} />
              <div className="text-left">
                <p className="font-semibold text-sm lg:text-base">Bank-Level Security</p>
                <p className="text-xs lg:text-sm text-teal-200">Your data is protected</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 lg:space-x-4 bg-white/10 backdrop-blur-sm rounded-xl p-3 lg:p-4">
              <Users className="text-emerald-200" size={20} />
              <div className="text-left">
                <p className="font-semibold text-sm lg:text-base">Join 10,000+ Users</p>
                <p className="text-xs lg:text-sm text-emerald-200">Trusted community</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 lg:space-x-4 bg-white/10 backdrop-blur-sm rounded-xl p-3 lg:p-4">
              <DollarSign className="text-blue-200" size={20} />
              <div className="text-left">
                <p className="font-semibold text-sm lg:text-base">Transparent Pricing</p>
                <p className="text-xs lg:text-sm text-blue-200">No hidden charges</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Signup Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-8 lg:p-12 xl:p-16 py-12 lg:py-24 bg-emerald-50/30 dark:bg-gray-950">
        <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-3xl p-6 sm:p-8 xl:p-10 shadow-2xl overflow-visible border border-emerald-100 dark:border-gray-800">
          {/* Mobile Logo (Hidden on Desktop) */}
          <div className="lg:hidden text-center mb-6">
            <div className="inline-flex items-center justify-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-xl overflow-hidden p-1">
                <img
                  src="/images/gharbazaar-logo.jpg"
                  alt="GharBazaar Logo"
                  className="w-full h-full object-cover rounded-xl"
                />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent">
                GharBazaar
              </h1>
            </div>
          </div>

          {/* Form Header */}
          <div className="text-center mb-6 mt-4">
            <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-3">
              Create Account
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm lg:text-base">
              Start your property journey today!
            </p>
          </div>

          {/* Signup Form */}
          <div className="space-y-4 lg:space-y-5">
            {/* Google Signup */}
            <button
              onClick={handleGoogleSignup}
              disabled={loading}
              className="w-full flex items-center justify-center space-x-3 px-4 lg:px-6 py-3 lg:py-4 bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 rounded-xl lg:rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-400 dark:hover:border-gray-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl group"
            >
              <svg width="20" height="20" className="lg:w-6 lg:h-6" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              <span className="font-semibold text-gray-700 dark:text-gray-200 text-base lg:text-lg">
                Sign up with Google
              </span>
            </button>

            {/* Divider */}
            <div className="relative my-4 lg:my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-gray-50 dark:bg-gray-900 text-gray-500 dark:text-gray-400 font-medium">
                  Or create with email
                </span>
              </div>
            </div>

            {/* Email Form */}
            <form onSubmit={handleEmailSignup} className="space-y-4 lg:space-y-5">
              {/* Name Field */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 lg:left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full pl-10 lg:pl-12 pr-4 py-3 lg:py-3 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl lg:rounded-2xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all text-gray-900 dark:text-white placeholder:text-gray-400 text-sm lg:text-base"
                    placeholder="Enter your full name"
                    required
                  />
                </div>
              </div>

              {/* Email Field */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 lg:left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full pl-10 lg:pl-12 pr-4 py-3 lg:py-3 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl lg:rounded-2xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all text-gray-900 dark:text-white placeholder:text-gray-400 text-sm lg:text-base"
                    placeholder="you@example.com"
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 lg:left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full pl-10 lg:pl-12 pr-12 lg:pr-14 py-3 lg:py-3 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl lg:rounded-2xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all text-gray-900 dark:text-white placeholder:text-gray-400 text-sm lg:text-base"
                    placeholder="Create a strong password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 lg:right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                {/* Password Strength Indicator */}
                {formData.password && (
                  <div className="mt-2">
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${strengthColors[passwordStrength - 1]} transition-all duration-300`}
                          style={{ width: `${(passwordStrength / 4) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                        {strengthLabels[passwordStrength - 1]}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Terms Checkbox */}
              <div className="flex items-start space-x-3 pt-2">
                <input
                  type="checkbox"
                  id="terms"
                  checked={formData.agreeToTerms}
                  onChange={(e) => setFormData({ ...formData, agreeToTerms: e.target.checked })}
                  className="mt-1 w-4 h-4 lg:w-5 lg:h-5 text-teal-600 border-gray-300 rounded focus:ring-teal-500 cursor-pointer"
                  required
                />
                <label htmlFor="terms" className="text-xs lg:text-sm text-gray-600 dark:text-gray-400 cursor-pointer">
                  I agree to the{' '}
                  <Link href="/terms" className="text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 font-medium transition-colors">
                    Terms & Privacy Policy
                  </Link>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white py-3 lg:py-4 rounded-xl lg:rounded-2xl font-semibold text-base lg:text-lg transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 group"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    <span>Creating Account...</span>
                  </>
                ) : (
                  <>
                    <span>Create Account</span>
                    <ArrowRight size={20} className="lg:w-6 lg:h-6 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

            {/* Login Link */}
            <div className="text-center pt-4 lg:pt-6">
              <p className="text-sm lg:text-base text-gray-600 dark:text-gray-400">
                Already have an account?{' '}
                <Link
                  href="/login"
                  className="text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 font-semibold transition-colors"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}