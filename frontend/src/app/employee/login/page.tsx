'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Shield,
  Briefcase,
  CheckCircle,
  ArrowLeft,
  Loader2
} from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '@/contexts/AuthContext'

export default function EmployeeLoginPage() {
  const router = useRouter()
  const { loginWithGoogle } = useAuth()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    otp: ''
  })
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [show2FA, setShow2FA] = useState(false)

  const handleGoogleLogin = async () => {
    setLoading(true)
    try {
      await loginWithGoogle('employee')
    } catch (error: any) {
      toast.error(error.message || 'Google login failed')
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setLoading(true)

      // Simulate API call
      setTimeout(() => {
        // Mock employee data
        const employeeData = {
          id: 1,
          name: 'Employee User',
          email: formData.email,
          role: 'employee',
          department: 'KYC Verification',
          staffId: 'EMP001',
          onboardingCompleted: true
        }

        localStorage.setItem('token', 'employee-token-123')
        localStorage.setItem('user', JSON.stringify(employeeData))

        toast.success('Welcome back! Login successful!')
        router.push('/employee')
      }, 1500)
    } catch (error: any) {
      toast.error('Login failed. Please check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center px-6 sm:px-8 lg:px-12 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-md w-full space-y-6 py-12">
          {/* Back to Home */}
          <Link
            href="/"
            className="inline-flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 mb-4"
          >
            <ArrowLeft size={20} />
            <span>Back to Home</span>
          </Link>

          {/* Logo */}
          <div className="mb-0">
            <div className="flex items-center space-x-3 mb-4">
              <img
                src="/images/gharbazaar-logo.jpg"
                alt="GharBazaar Logo"
                className="h-12 w-auto"
              />
              <div>
                <h2 className="text-xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">GharBazaar</h2>
                <p className="text-xs text-blue-600 font-medium">Employee Portal</p>
              </div>
            </div>
          </div>

          {/* Header */}
          <div className="mb-6">
            <h1 className="font-heading font-bold text-3xl mb-2 text-gray-900 dark:text-white">Employee Sign In</h1>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Access your employee dashboard securely
            </p>
          </div>

          {/* Google Login */}
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full flex items-center justify-center space-x-3 px-6 py-3 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed group shadow-sm hover:shadow-md"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            <span className="font-semibold text-gray-700 dark:text-gray-200">
              Sign in with Google
            </span>
          </button>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300 dark:border-gray-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-gray-50 dark:bg-gray-900 text-gray-500 font-medium">Or email / ID</span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email / Staff ID */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">
                Employee Email / Staff ID
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  id="email"
                  type="text"
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 dark:text-white placeholder-gray-400"
                  placeholder="name@gharbazaar.in"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Password
                </label>
                <Link href="/employee/forgot-password" className="text-xs text-blue-600 hover:text-blue-700 font-medium">
                  Forgot?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  className="w-full pl-10 pr-10 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 dark:text-white placeholder-gray-400"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>


            {/* 2FA OTP (Optional) */}
            {show2FA && (
              <div>
                <label htmlFor="otp" className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  2FA Code (Optional)
                </label>
                <input
                  id="otp"
                  type="text"
                  maxLength={6}
                  className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 dark:text-white placeholder-gray-400"
                  placeholder="Enter 6-digit code"
                  value={formData.otp}
                  onChange={(e) => setFormData({ ...formData, otp: e.target.value })}
                />
              </div>
            )}

            {/* Forgot Password & 2FA Toggle */}
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setShow2FA(!show2FA)}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                {show2FA ? 'Hide 2FA' : 'Enable 2FA'}
              </button>
              <Link href="/employee/forgot-password" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                Forgot Password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3.5 px-6 rounded-lg transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Signing in...</span>
                </div>
              ) : (
                'Sign In to Employee Portal'
              )}
            </button>

            {/* Demo Credentials */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
              <p className="text-sm text-blue-800 dark:text-blue-300 font-medium mb-2">
                🔐 Demo Employee Account
              </p>
              <p className="text-xs text-blue-600 dark:text-blue-400">
                Email: Gharbazaarofficial@zohomail.in<br />
                Password: employee123<br />
                Staff ID: EMP001
              </p>
            </div>

            {/* Apply Link */}
            <div className="text-center pt-4 border-t border-gray-200 dark:border-gray-800">
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Not an employee yet?{' '}
                <Link href="/employee/apply" className="text-blue-600 hover:text-blue-700 font-semibold">
                  Apply Now
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>

      {/* Right Side - Info Panel */}
      <div className="hidden lg:flex lg:flex-1 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 relative overflow-hidden">
        {/* Decorative Background */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '32px 32px'
          }}></div>
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center items-center px-12 text-white w-full">
          <div className="max-w-md w-full space-y-8">
            {/* Icon */}
            <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-8">
              <Briefcase size={40} />
            </div>

            <div className="text-center">
              <h2 className="text-4xl font-bold mb-4">
                Employee Portal
              </h2>
              <p className="text-xl text-blue-100 mb-8">
                Manage verifications, support users, and help build India's most trusted real estate platform
              </p>
            </div>

            {/* Features */}
            <div className="space-y-4">
              <div className="flex items-start space-x-3 bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <CheckCircle size={24} className="text-green-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold mb-1">Secure Access</h3>
                  <p className="text-sm text-blue-100">Role-based authentication with 2FA support</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <CheckCircle size={24} className="text-green-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold mb-1">Dedicated Dashboard</h3>
                  <p className="text-sm text-blue-100">Separate system for employee operations</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <CheckCircle size={24} className="text-green-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold mb-1">Performance Tracking</h3>
                  <p className="text-sm text-blue-100">Monitor your daily tasks and achievements</p>
                </div>
              </div>
            </div>

            {/* Support */}
            <div className="mt-12 text-center">
              <p className="text-sm text-blue-200 mb-2">Need help?</p>
              <Link href="/employee/support" className="text-white font-semibold hover:underline">
                Contact IT Support
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

