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
  ArrowLeft
} from 'lucide-react'
import toast from 'react-hot-toast'

export default function EmployeeLoginPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    otp: ''
  })
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [show2FA, setShow2FA] = useState(false)

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
          staffId: 'EMP001'
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
          <div className="mb-8">
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
          <div className="mb-8">
            <h1 className="font-heading font-bold text-3xl mb-2 text-gray-900 dark:text-white">Employee Sign In</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Access your employee dashboard
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email / Staff ID */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                Employee Email / Staff ID
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  id="email"
                  type="text"
                  required
                  className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 dark:text-white placeholder-gray-400"
                  placeholder="Gharbazaarofficial@zohomail.in or EMP001"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  className="w-full pl-10 pr-12 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 dark:text-white placeholder-gray-400"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
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

