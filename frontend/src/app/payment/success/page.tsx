'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  CheckCircle, 
  Download, 
  MessageCircle, 
  Mail,
  Home,
  Phone,
  Calendar,
  FileText,
  Clock,
  Award,
  ArrowRight,
  Copy,
  Check,
  Smartphone
} from 'lucide-react'

// Payment Success Page Component
export default function PaymentSuccessPage() {
  const router = useRouter()
  const [paymentResult, setPaymentResult] = useState<any>(null)
  const [copied, setCopied] = useState(false)
  const [showTimeline, setShowTimeline] = useState(false)

  useEffect(() => {
    const result = localStorage.getItem('paymentResult')
    if (result) {
      const data = JSON.parse(result)
      if (data.success) {
        setPaymentResult(data)
        // Show timeline after a delay for better UX
        setTimeout(() => setShowTimeline(true), 1000)
      } else {
        router.push('/payment/failed')
      }
    } else {
      router.push('/payment')
    }
  }, [router])

  const copyTransactionId = () => {
    if (paymentResult?.transactionId) {
      navigator.clipboard.writeText(paymentResult.transactionId)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const downloadInvoice = () => {
    // In a real implementation, this would generate and download a PDF invoice
    alert('Invoice download will be available shortly. You will receive it via email.')
  }

  const goToDashboard = () => {
    router.push('/dashboard')
  }

  const contactSupport = () => {
    window.open('https://wa.me/919800012345?text=Hi, I need help with my recent payment. Transaction ID: ' + paymentResult?.transactionId, '_blank')
  }

  if (!paymentResult) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading payment details...</p>
        </div>
      </div>
    )
  }

  const nextSteps = [
    {
      step: 1,
      title: 'Document Review',
      description: 'Our team will review your requirements and property documents',
      timeline: 'Within 24 hours',
      status: 'pending'
    },
    {
      step: 2,
      title: 'Due Diligence Process',
      description: 'Comprehensive verification and analysis of your property',
      timeline: '3-5 business days',
      status: 'upcoming'
    },
    {
      step: 3,
      title: 'Report Generation',
      description: 'Detailed due diligence report with findings and recommendations',
      timeline: '6-8 business days',
      status: 'upcoming'
    },
    {
      step: 4,
      title: 'Assistance Letter',
      description: 'Professional assistance letter and consultation call',
      timeline: '7-10 business days',
      status: 'upcoming'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-green-600 to-emerald-600 rounded-lg flex items-center justify-center">
                <Home className="w-4 h-4 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900 dark:text-white">GharBazaar</h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">Payment Successful</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30 px-3 py-2 rounded-full">
              <CheckCircle className="w-4 h-4" />
              <span className="text-sm font-medium">Payment Confirmed</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Success Message */}
        <div className="text-center mb-12">
          <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl animate-pulse">
            <CheckCircle className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Payment Successful! 🎉
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-6">
            Thank you for choosing GharBazaar. Your payment has been processed successfully.
          </p>
          <div className="inline-flex items-center space-x-2 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 px-6 py-3 rounded-full font-semibold">
            <Award className="w-5 h-5" />
            <span>Service Activated</span>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Payment Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Transaction Details */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Transaction Details</h2>
                <p className="text-gray-600 dark:text-gray-400">Keep this information for your records</p>
              </div>
              
              <div className="p-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Transaction ID</p>
                      <div className="flex items-center space-x-2">
                        <p className="font-mono font-semibold text-gray-900 dark:text-white">
                          {paymentResult.transactionId}
                        </p>
                        <button
                          onClick={copyTransactionId}
                          className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                        >
                          {copied ? (
                            <Check className="w-4 h-4 text-green-600" />
                          ) : (
                            <Copy className="w-4 h-4 text-gray-400" />
                          )}
                        </button>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Service</p>
                      <p className="font-semibold text-gray-900 dark:text-white">{paymentResult.service}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Amount Paid</p>
                      <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                        ₹{paymentResult.amount?.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Payment Date</p>
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
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Customer</p>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {paymentResult.customer?.fullName}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Status</p>
                      <div className="inline-flex items-center space-x-2 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 px-3 py-1 rounded-full text-sm font-medium">
                        <CheckCircle className="w-4 h-4" />
                        <span>Completed</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Next Steps Timeline */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">What Happens Next?</h2>
                <p className="text-gray-600 dark:text-gray-400">Your service timeline and next steps</p>
              </div>
              
              <div className="p-6">
                <div className="space-y-6">
                  {nextSteps.map((step, index) => (
                    <div
                      key={step.step}
                      className={`flex items-start space-x-4 transition-all duration-500 ${
                        showTimeline ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
                      }`}
                      style={{ transitionDelay: `${index * 200}ms` }}
                    >
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                        step.status === 'pending' 
                          ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' 
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                      }`}>
                        <span className="font-bold text-sm">{step.step}</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold text-gray-900 dark:text-white">{step.title}</h3>
                          <div className="flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-400">
                            <Clock className="w-4 h-4" />
                            <span>{step.timeline}</span>
                          </div>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">{step.description}</p>
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
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Quick Actions</h3>
              
              <div className="space-y-4">
                {/* Download Invoice */}
                <button
                  onClick={downloadInvoice}
                  className="w-full flex items-center justify-center space-x-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3 px-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105"
                >
                  <Download className="w-5 h-5" />
                  <span>Download Invoice</span>
                </button>

                {/* WhatsApp Confirmation */}
                <button
                  onClick={() => window.open(`https://wa.me/919800012345?text=Hi, I just completed payment for ${paymentResult.service}. Transaction ID: ${paymentResult.transactionId}`, '_blank')}
                  className="w-full flex items-center justify-center space-x-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-3 px-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>WhatsApp Confirmation</span>
                </button>

                {/* Go to Dashboard */}
                <button
                  onClick={goToDashboard}
                  className="w-full flex items-center justify-center space-x-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white py-3 px-4 rounded-xl font-semibold transition-all duration-300"
                >
                  <Home className="w-5 h-5" />
                  <span>Go to Dashboard</span>
                </button>
              </div>

              {/* Confirmation Notice */}
              <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-700">
                <div className="flex items-start space-x-3">
                  <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
                      Email & SMS Confirmation
                    </h4>
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      You will receive payment confirmation and service details via email and SMS within 5 minutes.
                    </p>
                  </div>
                </div>
              </div>

              {/* Support Contact */}
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Need Help?</h4>
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
                  <button
                    onClick={contactSupport}
                    className="flex items-center space-x-3 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                  >
                    <Smartphone className="w-4 h-4" />
                    <span>WhatsApp Support</span>
                  </button>
                </div>
              </div>

              {/* Company Info */}
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <Home className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="font-bold text-gray-900 dark:text-white mb-2">GharBazaar</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                    Professional Real Estate Services<br />
                    Trusted by 15,000+ customers across India
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}