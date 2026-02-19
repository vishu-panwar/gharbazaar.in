'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
    Mail,
    ArrowLeft,
    Loader2,
    CheckCircle,
    Shield,
    Clock,
    Lock
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

export default function ForgotPasswordPage() {
    const router = useRouter()
    const { resetPassword } = useAuth()

    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState('')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')

        // Validate email
        if (!email) {
            setError('Please enter your email address')
            return
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)) {
            setError('Please enter a valid email address')
            return
        }

        setLoading(true)

        try {
            await resetPassword(email)
            setSuccess(true)
        } catch (err: any) {
            setError(err.message || 'Failed to send reset email. Please try again.')
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen w-screen flex items-center justify-center relative bg-gradient-to-br from-teal-50 via-emerald-50 to-blue-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>

            {/* Go Back Button */}
            <Link
                href="/login"
                className="absolute top-6 left-6 z-50 flex items-center space-x-2 px-4 py-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl text-gray-700 dark:text-gray-200 hover:bg-white dark:hover:bg-gray-800 transition-all duration-200 shadow-lg group"
            >
                <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                <span className="font-medium">Back to Login</span>
            </Link>

            {/* Main Card */}
            <div className="relative z-10 w-full max-w-md mx-4">
                <div className="bg-white dark:bg-gray-900 rounded-3xl p-8 lg:p-10 shadow-2xl">
                    {/* Logo */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center space-x-3 mb-6">
                            <div className="w-14 h-14 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-xl overflow-hidden p-1">
                                <img
                                    src="/logo.jpeg"
                                    alt="GharBazaar Logo"
                                    className="w-12 h-12 object-contain rounded-lg"
                                />
                            </div>
                            <h1 className="text-2xl font-bold bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent">
                                GharBazaar
                            </h1>
                        </div>

                        {!success ? (
                            <>
                                <div className="w-16 h-16 bg-gradient-to-br from-teal-100 to-emerald-100 dark:from-teal-900/30 dark:to-emerald-900/30 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                    <Lock className="text-teal-600 dark:text-teal-400" size={32} />
                                </div>
                                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
                                    Forgot Password?
                                </h2>
                                <p className="text-gray-600 dark:text-gray-400 text-base">
                                    No worries! Enter your email and we'll send you a secure reset link.
                                </p>
                            </>
                        ) : (
                            <>
                                <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                    <CheckCircle className="text-green-600 dark:text-green-400" size={32} />
                                </div>
                                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
                                    Check Your Email
                                </h2>
                                <p className="text-gray-600 dark:text-gray-400 text-base">
                                    We've sent a password reset link to <span className="font-semibold text-gray-900 dark:text-white">{email}</span>
                                </p>
                            </>
                        )}
                    </div>

                    {!success ? (
                        <>
                            {/* Form */}
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Email Field */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                        Email Address
                                    </label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all text-gray-900 dark:text-white placeholder:text-gray-400 text-base"
                                            placeholder="Enter your email"
                                            required
                                            disabled={loading}
                                        />
                                    </div>
                                </div>

                                {/* Error Message */}
                                {error && (
                                    <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-xl p-4">
                                        <p className="text-sm text-red-600 dark:text-red-400 font-medium">{error}</p>
                                    </div>
                                )}

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white py-4 rounded-xl font-semibold text-lg transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="animate-spin" size={20} />
                                            <span>Sending Reset Link...</span>
                                        </>
                                    ) : (
                                        <span>Send Reset Link</span>
                                    )}
                                </button>
                            </form>

                            {/* Security Info */}
                            <div className="mt-8 space-y-3">
                                <div className="flex items-start space-x-3 text-sm text-gray-600 dark:text-gray-400">
                                    <Shield className="text-teal-600 dark:text-teal-400 flex-shrink-0 mt-0.5" size={18} />
                                    <p>Your security is our priority. The reset link is valid for 1 hour.</p>
                                </div>
                                <div className="flex items-start space-x-3 text-sm text-gray-600 dark:text-gray-400">
                                    <Clock className="text-teal-600 dark:text-teal-400 flex-shrink-0 mt-0.5" size={18} />
                                    <p>Didn't receive the email? Check your spam folder or try again.</p>
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
                            {/* Success State */}
                            <div className="space-y-6">
                                {/* Instructions */}
                                <div className="bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800 rounded-xl p-5">
                                    <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">What's next?</h3>
                                    <ol className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
                                        <li className="flex items-start">
                                            <span className="font-bold mr-2">1.</span>
                                            <span>Check your email inbox (and spam folder)</span>
                                        </li>
                                        <li className="flex items-start">
                                            <span className="font-bold mr-2">2.</span>
                                            <span>Click the secure reset link we sent you</span>
                                        </li>
                                        <li className="flex items-start">
                                            <span className="font-bold mr-2">3.</span>
                                            <span>Create a new strong password</span>
                                        </li>
                                        <li className="flex items-start">
                                            <span className="font-bold mr-2">4.</span>
                                            <span>Sign in with your new password</span>
                                        </li>
                                    </ol>
                                </div>

                                {/* Actions */}
                                <div className="flex flex-col space-y-3">
                                    <button
                                        onClick={() => router.push('/login')}
                                        className="w-full bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white py-4 rounded-xl font-semibold text-lg transition-all duration-200 shadow-lg hover:shadow-xl"
                                    >
                                        Return to Login
                                    </button>
                                    <button
                                        onClick={() => {
                                            setSuccess(false)
                                            setEmail('')
                                            setError('')
                                        }}
                                        className="text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 font-medium text-sm transition-colors"
                                    >
                                        Didn't receive the email? Try again
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </div>

                {/* Footer */}
                <div className="text-center mt-6">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        Remember your password?{' '}
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
    )
}

