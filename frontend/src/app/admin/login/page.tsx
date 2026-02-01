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
  CheckCircle,
  ArrowLeft,
  Smartphone
} from 'lucide-react'
import toast from 'react-hot-toast'

export default function AdminLoginPage() {
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
        // Mock admin data
        const adminData = {
          id: 1,
          name: 'Super Admin',
          email: formData.email,
          role: 'admin',
          permissions: 'all'
        }

        localStorage.setItem('token', 'admin-token-123')
        localStorage.setItem('user', JSON.stringify(adminData))

        toast.success('Welcome back, Admin!')
        router.push('/admin')
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
            className="inline-flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-purple-600 mb-4"
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
                <p className="text-xs text-purple-600 font-medium">Admin Portal</p>
              </div>
            </div>
          </div>

          {/* Header */}
          <div className="mb-8">
            <h1 className="font-heading font-bold text-3xl mb-2 text-gray-900 dark:text-white">Super Admin Login</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Access the complete control panel
            </p>
          </div>

          {/* Security Notice */}
          <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-xl p-4 mb-6">
            <div className="flex items-start space-x-3">
              <Shield size={20} className="text-purple-600 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-purple-900 dark:text-purple-300 mb-1">
                  Secure Admin Access
                </p>
                <p className="text-xs text-purple-700 dark:text-purple-400">
                  This portal is protected with 2FA and session monitoring
                </p>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                Admin Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  id="email"
                  type="email"
                  required
                  className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-gray-900 dark:text-white placeholder-gray-400"
                  placeholder="Gharbazaarofficial@zohomail.in"
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
                  className="w-full pl-10 pr-12 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-gray-900 dark:text-white placeholder-gray-400"
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

            {/* 2FA OTP */}
            {show2FA && (
              <div>
                <label htmlFor="otp" className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  2FA Authentication Code
                </label>
                <div className="relative">
                  <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    id="otp"
                    type="text"
                    maxLength={6}
                    className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-gray-900 dark:text-white placeholder-gray-400"
                    placeholder="Enter 6-digit code"
                    value={formData.otp}
                    onChange={(e) => setFormData({ ...formData, otp: e.target.value })}
                  />
                </div>
              </div>
            )}

            {/* Forgot Password & 2FA Toggle */}
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setShow2FA(!show2FA)}
                className="text-sm text-purple-600 hover:text-purple-700 font-medium"
              >
                {show2FA ? 'Hide 2FA' : 'Enable 2FA'}
              </button>
              <Link href="/admin/forgot-password" className="text-sm text-purple-600 hover:text-purple-700 font-medium">
                Forgot Password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3.5 px-6 rounded-lg transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Authenticating...</span>
                </div>
              ) : (
                'Sign In to Admin Portal'
              )}
            </button>

            {/* Demo Credentials */}
            <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-xl p-4">
              <p className="text-sm text-purple-800 dark:text-purple-300 font-medium mb-2">
                🔐 Demo Admin Account
              </p>
              <p className="text-xs text-purple-600 dark:text-purple-400">
                Email: Gharbazaarofficial@zohomail.in<br />
                Password: admin123
              </p>
            </div>
          </form>
        </div>
      </div>

      {/* Right Side - Info Panel */}
      <div className="hidden lg:flex lg:flex-1 bg-gradient-to-br from-purple-600 via-purple-700 to-pink-600 relative overflow-hidden">
        {/* Decorative Background */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '32px 32px'
          }}></div>
        </div>

        {/* Floating Shapes */}
        <div className="absolute top-20 right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-pink-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center items-center px-12 text-white w-full">
          <div className="max-w-md w-full space-y-8">
            {/* Icon */}
            <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center mx-auto mb-8 ring-4 ring-white/30">
              <Shield size={48} />
            </div>

            <div className="text-center">
              <h2 className="text-4xl font-bold mb-4">
                Super Admin Portal
              </h2>
              <p className="text-xl text-purple-100 mb-8">
                Complete control over GharBazaar platform with advanced analytics and management tools
              </p>
            </div>

            {/* Features */}
            <div className="space-y-4">
              <div className="flex items-start space-x-3 bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <CheckCircle size={24} className="text-green-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold mb-1">Full Platform Control</h3>
                  <p className="text-sm text-purple-100">Manage users, listings, employees, and revenue</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <CheckCircle size={24} className="text-green-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold mb-1">Advanced Analytics</h3>
                  <p className="text-sm text-purple-100">Real-time insights and performance metrics</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <CheckCircle size={24} className="text-green-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold mb-1">Security & Monitoring</h3>
                  <p className="text-sm text-purple-100">System logs, fraud detection, and alerts</p>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 pt-8 border-t border-white/20">
              <div className="text-center">
                <div className="text-3xl font-bold mb-1">10K+</div>
                <div className="text-xs text-purple-200">Users</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold mb-1">1.5K</div>
                <div className="text-xs text-purple-200">Listings</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold mb-1">₹12L</div>
                <div className="text-xs text-purple-200">Revenue</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

