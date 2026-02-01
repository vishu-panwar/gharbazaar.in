'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { 
  CheckCircle,
  Download,
  ArrowRight,
  Home,
  Receipt,
  Star,
  Gift,
  Sparkles,
  Calendar,
  Clock,
  Mail,
  Phone,
  Award,
  Shield,
  Zap,
  Crown,
  Building2,
  User,
  Eye
} from 'lucide-react'

export default function PaymentSuccessPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [showConfetti, setShowConfetti] = useState(true)

  // Get payment details from URL params
  const service = searchParams.get('service') || 'Premium Access'
  const amount = searchParams.get('amount') || '500'
  const txnId = searchParams.get('txnId') || 'GHB' + Date.now()
  const method = searchParams.get('method') || 'UPI'

  useEffect(() => {
    // Hide confetti after 3 seconds
    const timer = setTimeout(() => {
      setShowConfetti(false)
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  const generateReceipt = () => {
    // This would generate and download a PDF receipt
    console.log('Generating receipt for transaction:', txnId)
    alert('Receipt download will be implemented with PDF generation')
  }

  const getServiceIcon = (serviceName: string) => {
    if (serviceName.includes('Basic')) return <Zap className="w-8 h-8 text-white" />
    if (serviceName.includes('Premium')) return <Crown className="w-8 h-8 text-white" />
    if (serviceName.includes('Property')) return <Building2 className="w-8 h-8 text-white" />
    if (serviceName.includes('Deal')) return <User className="w-8 h-8 text-white" />
    return <Star className="w-8 h-8 text-white" />
  }

  const getServiceColor = (serviceName: string) => {
    if (serviceName.includes('Basic')) return 'from-blue-500 to-blue-600'
    if (serviceName.includes('Premium')) return 'from-emerald-500 to-emerald-600'
    if (serviceName.includes('Property')) return 'from-orange-500 to-orange-600'
    if (serviceName.includes('Deal')) return 'from-red-500 to-red-600'
    return 'from-purple-500 to-purple-600'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden">
      {/* Confetti Effect */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-bounce"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`
              }}
            >
              <div className={`w-2 h-2 rounded-full ${
                ['bg-green-400', 'bg-blue-400', 'bg-purple-400', 'bg-yellow-400', 'bg-pink-400'][Math.floor(Math.random() * 5)]
              }`}></div>
            </div>
          ))}
        </div>
      )}

      {/* Background Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-green-400/20 to-emerald-500/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-teal-400/20 to-blue-500/20 rounded-full blur-3xl"></div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Success Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full shadow-2xl mb-6 animate-pulse">
            <CheckCircle className="w-12 h-12 text-white" />
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Payment Successful! 🎉
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-6">
            Welcome to GharBazaar! Your subscription is now active.
          </p>
          
          <div className="inline-flex items-center space-x-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-6 py-3 rounded-full font-semibold">
            <Sparkles className="w-5 h-5" />
            <span>Transaction ID: {txnId}</span>
          </div>
        </div>

        {/* Payment Details Card */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className={`w-16 h-16 bg-gradient-to-br ${getServiceColor(service)} rounded-2xl flex items-center justify-center shadow-lg`}>
                  {getServiceIcon(service)}
                </div>
                <div>
                  <h2 className="text-2xl font-bold">{service}</h2>
                  <p className="text-green-100">Successfully activated</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold">₹{parseInt(amount).toLocaleString()}</div>
                <div className="text-green-100 text-sm">Paid via {method}</div>
              </div>
            </div>
          </div>

          <div className="p-8">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Transaction Details */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                  <Receipt className="w-5 h-5 mr-2 text-blue-500" />
                  Transaction Details
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700">
                    <span className="text-gray-600 dark:text-gray-400">Transaction ID</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{txnId}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700">
                    <span className="text-gray-600 dark:text-gray-400">Payment Method</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{method}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700">
                    <span className="text-gray-600 dark:text-gray-400">Date & Time</span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {new Date().toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700">
                    <span className="text-gray-600 dark:text-gray-400">Status</span>
                    <span className="inline-flex items-center space-x-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-3 py-1 rounded-full text-sm font-semibold">
                      <CheckCircle className="w-4 h-4" />
                      <span>Completed</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* What's Next */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                  <Gift className="w-5 h-5 mr-2 text-purple-500" />
                  What's Next?
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-sm font-bold">1</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-blue-900 dark:text-blue-100">Access Activated</h4>
                      <p className="text-blue-700 dark:text-blue-300 text-sm">Your subscription is now active and ready to use</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3 p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl border border-emerald-200 dark:border-emerald-800">
                    <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-sm font-bold">2</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-emerald-900 dark:text-emerald-100">Start Exploring</h4>
                      <p className="text-emerald-700 dark:text-emerald-300 text-sm">Browse properties and contact owners directly</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-200 dark:border-purple-800">
                    <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-sm font-bold">3</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-purple-900 dark:text-purple-100">Get Support</h4>
                      <p className="text-purple-700 dark:text-purple-300 text-sm">24/7 customer support for all your queries</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <button
            onClick={generateReceipt}
            className="flex items-center justify-center space-x-3 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-white px-6 py-4 rounded-2xl font-semibold transition-all shadow-lg hover:shadow-xl border border-gray-200 dark:border-gray-700"
          >
            <Download className="w-5 h-5" />
            <span>Download Receipt</span>
          </button>
          
          <Link
            href="/dashboard/browse"
            className="flex items-center justify-center space-x-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-4 rounded-2xl font-semibold transition-all shadow-lg hover:shadow-xl"
          >
            <Eye className="w-5 h-5" />
            <span>Browse Properties</span>
          </Link>
          
          <Link
            href="/dashboard"
            className="flex items-center justify-center space-x-3 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white px-6 py-4 rounded-2xl font-semibold transition-all shadow-lg hover:shadow-xl"
          >
            <Home className="w-5 h-5" />
            <span>Go to Dashboard</span>
          </Link>
        </div>

        {/* Support Section */}
        <div className="bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 rounded-3xl p-8 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-indigo-500/20 rounded-full -translate-y-16 translate-x-16"></div>
          
          <div className="relative z-10">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold mb-4">
                Need Help? We're Here for You! 🤝
              </h3>
              <p className="text-blue-100 max-w-2xl mx-auto">
                Our support team is available 24/7 to help you make the most of your GharBazaar experience.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
                <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-semibold mb-2">Email Support</h4>
                <p className="text-blue-200 text-sm mb-2">support@gharbazaar.in</p>
                <p className="text-xs text-blue-300">Response within 2 hours</p>
              </div>
              
              <div className="text-center p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
                <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Phone className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-semibold mb-2">Phone Support</h4>
                <p className="text-blue-200 text-sm mb-2">+91 98000 12345</p>
                <p className="text-xs text-blue-300">Available 24/7</p>
              </div>
              
              <div className="text-center p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
                <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-semibold mb-2">Premium Support</h4>
                <p className="text-blue-200 text-sm mb-2">Dedicated manager</p>
                <p className="text-xs text-blue-300">For premium users</p>
              </div>
            </div>
          </div>
        </div>

        {/* Thank You Message */}
        <div className="text-center mt-12">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 text-green-700 dark:text-green-300 px-8 py-4 rounded-2xl border border-green-200 dark:border-green-700">
            <Star className="w-6 h-6" />
            <span className="text-lg font-bold">Thank you for choosing GharBazaar!</span>
            <Star className="w-6 h-6" />
          </div>
          <p className="text-gray-600 dark:text-gray-400 mt-4 max-w-2xl mx-auto">
            You're now part of India's most transparent property platform. Start your property journey with confidence!
          </p>
        </div>
      </div>
    </div>
  )
}