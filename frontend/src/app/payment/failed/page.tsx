'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  XCircle, 
  RefreshCw, 
  CreditCard, 
  MessageCircle,
  Home,
  Phone,
  Mail,
  AlertTriangle,
  ArrowLeft,
  HelpCircle,
  Shield,
  Clock
} from 'lucide-react'

// Payment Failed Page Component
export default function PaymentFailedPage() {
  const router = useRouter()
  const [paymentResult, setPaymentResult] = useState<any>(null)
  const [isRetrying, setIsRetrying] = useState(false)

  useEffect(() => {
    const result = localStorage.getItem('paymentResult')
    if (result) {
      const data = JSON.parse(result)
      if (!data.success) {
        setPaymentResult(data)
      } else {
        router.push('/payment/success')
      }
    } else {
      router.push('/payment')
    }
  }, [router])

  const handleRetryPayment = () => {
    setIsRetrying(true)
    // Clear the failed payment result
    localStorage.removeItem('paymentResult')
    // Redirect back to payment confirmation
    router.push('/payment/confirm')
  }

  const handleChangePaymentMethod = () => {
    // Clear payment method selection
    localStorage.removeItem('selectedPaymentMethod')
    localStorage.removeItem('paymentResult')
    // Redirect to payment method selection
    router.push('/payment/method')
  }

  const handleContactSupport = () => {
    const message = `Hi, I'm facing issues with my payment. Error: ${paymentResult?.error || 'Payment failed'}. Please help me complete the transaction.`
    window.open(`https://wa.me/919800012345?text=${encodeURIComponent(message)}`, '_blank')
  }

  const handleGoHome = () => {
    router.push('/dashboard')
  }

  if (!paymentResult) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading payment details...</p>
        </div>
      </div>
    )
  }

  const commonIssues = [
    {
      issue: 'Insufficient Balance',
      solution: 'Check your account balance and try again',
      icon: <CreditCard className="w-5 h-5" />
    },
    {
      issue: 'Network Timeout',
      solution: 'Check your internet connection and retry',
      icon: <RefreshCw className="w-5 h-5" />
    },
    {
      issue: 'Bank Server Issues',
      solution: 'Try a different payment method or wait a few minutes',
      icon: <Clock className="w-5 h-5" />
    },
    {
      issue: 'Card Declined',
      solution: 'Contact your bank or try a different card',
      icon: <Shield className="w-5 h-5" />
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-red-600 to-orange-600 rounded-lg flex items-center justify-center">
                <Home className="w-4 h-4 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900 dark:text-white">GharBazaar</h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">Payment Failed</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/30 px-3 py-2 rounded-full">
              <XCircle className="w-4 h-4" />
              <span className="text-sm font-medium">Payment Failed</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Failed Message */}
            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl">
                <XCircle className="w-12 h-12 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Payment Failed
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-400 mb-6">
                We couldn't process your payment. Don't worry, no amount has been charged.
              </p>
              <div className="inline-flex items-center space-x-2 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 px-6 py-3 rounded-full font-semibold">
                <AlertTriangle className="w-5 h-5" />
                <span>Transaction Not Completed</span>
              </div>
            </div>

            {/* Error Details */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">What Went Wrong?</h2>
                <p className="text-gray-600 dark:text-gray-400">Here's what happened with your payment</p>
              </div>
              
              <div className="p-6">
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-xl p-6 mb-6">
                  <div className="flex items-start space-x-3">
                    <XCircle className="w-6 h-6 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-red-800 dark:text-red-200 mb-2">Payment Error</h3>
                      <p className="text-red-700 dark:text-red-300 text-sm">
                        {paymentResult.error || 'An unexpected error occurred during payment processing. Please try again.'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Attempted At</p>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {new Date(paymentResult.timestamp).toLocaleDateString('en-IN', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Status</p>
                    <div className="inline-flex items-center space-x-2 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 px-3 py-1 rounded-full text-sm font-medium">
                      <XCircle className="w-4 h-4" />
                      <span>Failed</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Common Issues & Solutions */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Common Issues & Solutions</h2>
                <p className="text-gray-600 dark:text-gray-400">Here are some common reasons and how to fix them</p>
              </div>
              
              <div className="p-6">
                <div className="space-y-4">
                  {commonIssues.map((item, index) => (
                    <div key={index} className="flex items-start space-x-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                      <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                        <div className="text-blue-600 dark:text-blue-400">
                          {item.icon}
                        </div>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{item.issue}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{item.solution}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Action Panel */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6 sticky top-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">What Can You Do?</h3>
              
              <div className="space-y-4">
                {/* Retry Payment */}
                <button
                  onClick={handleRetryPayment}
                  disabled={isRetrying}
                  className={`w-full flex items-center justify-center space-x-3 py-3 px-4 rounded-xl font-semibold transition-all duration-300 transform ${
                    isRetrying
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white hover:scale-105'
                  }`}
                >
                  {isRetrying ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Retrying...</span>
                    </>
                  ) : (
                    <>
                      <RefreshCw className="w-5 h-5" />
                      <span>Retry Payment</span>
                    </>
                  )}
                </button>

                {/* Change Payment Method */}
                <button
                  onClick={handleChangePaymentMethod}
                  className="w-full flex items-center justify-center space-x-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3 px-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105"
                >
                  <CreditCard className="w-5 h-5" />
                  <span>Change Payment Method</span>
                </button>

                {/* Contact Support */}
                <button
                  onClick={handleContactSupport}
                  className="w-full flex items-center justify-center space-x-3 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white py-3 px-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>Contact Support</span>
                </button>

                {/* Go Back Home */}
                <button
                  onClick={handleGoHome}
                  className="w-full flex items-center justify-center space-x-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white py-3 px-4 rounded-xl font-semibold transition-all duration-300"
                >
                  <ArrowLeft className="w-5 h-5" />
                  <span>Go to Dashboard</span>
                </button>
              </div>

              {/* Reassurance */}
              <div className="mt-8 p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-700">
                <div className="flex items-start space-x-3">
                  <Shield className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2">
                      Your Money is Safe
                    </h4>
                    <p className="text-sm text-green-700 dark:text-green-300">
                      No amount has been deducted from your account. You can safely retry the payment or try a different method.
                    </p>
                  </div>
                </div>
              </div>

              {/* Support Contact */}
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Need Immediate Help?</h4>
                <div className="space-y-3">
                  <a
                    href="mailto:support@gharbazaar.in"
                    className="flex items-center space-x-3 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                  >
                    <Mail className="w-4 h-4" />
                    <span>support@gharbazaar.in</span>
                  </a>
                  <a
                    href="tel:+919800012345"
                    className="flex items-center space-x-3 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                  >
                    <Phone className="w-4 h-4" />
                    <span>+91 98000 12345</span>
                  </a>
                  <div className="flex items-center space-x-3 text-sm text-gray-600 dark:text-gray-400">
                    <Clock className="w-4 h-4" />
                    <span>24/7 Support Available</span>
                  </div>
                </div>
              </div>

              {/* FAQ Link */}
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 text-center">
                <button className="flex items-center space-x-2 text-blue-600 dark:text-blue-400 hover:underline text-sm mx-auto">
                  <HelpCircle className="w-4 h-4" />
                  <span>View Payment FAQ</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}