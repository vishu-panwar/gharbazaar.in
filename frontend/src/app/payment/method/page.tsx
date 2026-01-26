'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { 
  Shield, 
  ArrowLeft,
  ArrowRight,
  Home,
  CreditCard,
  Smartphone,
  Building2,
  Wallet,
  QrCode,
  Star,
  CheckCircle,
  Award,
  Zap
} from 'lucide-react'

// Payment Method Selection Page Component
export default function PaymentMethodPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [serviceId, setServiceId] = useState<string>('')
  const [selectedMethod, setSelectedMethod] = useState<string>('')
  const [customerDetails, setCustomerDetails] = useState<any>(null)

  const paymentMethods = [
    {
      id: 'upi',
      name: 'UPI Payment',
      description: 'Pay using Google Pay, PhonePe, Paytm & more',
      icon: <Smartphone className="w-8 h-8" />,
      recommended: true,
      features: ['Instant payment', 'No charges', 'Most secure'],
      logos: ['🔵 GPay', '🟣 PhonePe', '🔵 Paytm', '🟢 BHIM'],
      processingTime: 'Instant',
      color: 'blue'
    },
    {
      id: 'cards',
      name: 'Debit/Credit Cards',
      description: 'Visa, Mastercard, RuPay & American Express',
      icon: <CreditCard className="w-8 h-8" />,
      recommended: false,
      features: ['All major banks', 'EMI available', 'Secure 3D'],
      logos: ['💳 Visa', '💳 Mastercard', '💳 RuPay', '💳 Amex'],
      processingTime: '2-3 minutes',
      color: 'emerald'
    },
    {
      id: 'netbanking',
      name: 'Net Banking',
      description: 'Internet banking from 50+ banks',
      icon: <Building2 className="w-8 h-8" />,
      recommended: false,
      features: ['All major banks', 'Direct debit', 'Trusted method'],
      logos: ['🏦 SBI', '🏦 HDFC', '🏦 ICICI', '🏦 Axis'],
      processingTime: '3-5 minutes',
      color: 'purple'
    },
    {
      id: 'wallets',
      name: 'Digital Wallets',
      description: 'Paytm, Amazon Pay, Mobikwik & more',
      icon: <Wallet className="w-8 h-8" />,
      recommended: false,
      features: ['Quick payment', 'Cashback offers', 'Easy refunds'],
      logos: ['💰 Paytm', '🛒 Amazon', '📱 Mobikwik', '⚡ Freecharge'],
      processingTime: 'Instant',
      color: 'orange'
    }
  ]

  useEffect(() => {
    const service = searchParams.get('service')
    if (service) {
      setServiceId(service)
    } else {
      router.push('/payment')
    }

    // Load customer details from localStorage
    const details = localStorage.getItem('paymentCustomerDetails')
    if (details) {
      setCustomerDetails(JSON.parse(details))
    } else {
      router.push(`/payment/details?service=${service}`)
    }
  }, [searchParams, router])

  const handleBack = () => {
    router.push(`/payment/details?service=${serviceId}`)
  }

  const handleContinue = () => {
    if (selectedMethod) {
      localStorage.setItem('selectedPaymentMethod', selectedMethod)
      router.push(`/payment/confirm?service=${serviceId}`)
    }
  }

  const getColorClasses = (color: string) => {
    const colors = {
      blue: {
        bg: 'from-blue-500 to-blue-600',
        light: 'bg-blue-50 dark:bg-blue-900/20',
        border: 'border-blue-500',
        text: 'text-blue-600'
      },
      emerald: {
        bg: 'from-emerald-500 to-emerald-600',
        light: 'bg-emerald-50 dark:bg-emerald-900/20',
        border: 'border-emerald-500',
        text: 'text-emerald-600'
      },
      purple: {
        bg: 'from-purple-500 to-purple-600',
        light: 'bg-purple-50 dark:bg-purple-900/20',
        border: 'border-purple-500',
        text: 'text-purple-600'
      },
      orange: {
        bg: 'from-orange-500 to-orange-600',
        light: 'bg-orange-50 dark:bg-orange-900/20',
        border: 'border-orange-500',
        text: 'text-orange-600'
      }
    }
    return colors[color as keyof typeof colors] || colors.blue
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleBack}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                  <Home className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-gray-900 dark:text-white">GharBazaar</h1>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Secure Payment</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30 px-3 py-2 rounded-full">
              <Shield className="w-4 h-4" />
              <span className="text-sm font-medium">RBI Compliant</span>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-center space-x-8">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
              <span className="text-sm font-medium text-green-600">Customer Details</span>
            </div>
            <div className="w-16 h-0.5 bg-green-600"></div>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">2</span>
              </div>
              <span className="text-sm font-medium text-blue-600">Payment Method</span>
            </div>
            <div className="w-16 h-0.5 bg-gray-300 dark:bg-gray-600"></div>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
                <span className="text-gray-600 dark:text-gray-400 text-sm font-bold">3</span>
              </div>
              <span className="text-sm text-gray-500 dark:text-gray-400">Confirmation</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Customer Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6 sticky top-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Customer Details</h3>
              {customerDetails && (
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Name</p>
                    <p className="font-semibold text-gray-900 dark:text-white">{customerDetails.fullName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Mobile</p>
                    <p className="font-semibold text-gray-900 dark:text-white">{customerDetails.mobile}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                    <p className="font-semibold text-gray-900 dark:text-white">{customerDetails.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Service Type</p>
                    <p className="font-semibold text-gray-900 dark:text-white">{customerDetails.serviceType}</p>
                  </div>
                </div>
              )}

              {/* Trust Indicators */}
              <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Security Features</h4>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Shield className="w-5 h-5 text-green-600 dark:text-green-400" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">256-bit SSL encryption</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">PCI DSS compliant</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Award className="w-5 h-5 text-green-600 dark:text-green-400" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">RBI approved gateway</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-8 border-b border-gray-200 dark:border-gray-700">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <CreditCard className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Choose Payment Method
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    Select your preferred payment method. All methods are secure and RBI compliant.
                  </p>
                </div>
              </div>

              {/* Payment Options */}
              <div className="p-8">
                <div className="space-y-4">
                  {paymentMethods.map((method) => (
                    <button
                      key={method.id}
                      onClick={() => setSelectedMethod(method.id)}
                      className={`w-full p-6 border-2 rounded-2xl transition-all duration-300 text-left relative overflow-hidden ${
                        selectedMethod === method.id
                          ? `${getColorClasses(method.color).border} ${getColorClasses(method.color).light} shadow-lg scale-105`
                          : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 hover:shadow-md'
                      }`}
                    >
                      {/* Recommended Badge */}
                      {method.recommended && (
                        <div className="absolute top-4 right-4">
                          <div className="flex items-center space-x-1 bg-gradient-to-r from-orange-400 to-red-400 text-white px-3 py-1 rounded-full text-xs font-bold">
                            <Star className="w-3 h-3" />
                            <span>RECOMMENDED</span>
                          </div>
                        </div>
                      )}

                      <div className="flex items-start space-x-4">
                        {/* Icon */}
                        <div className={`w-16 h-16 bg-gradient-to-br ${getColorClasses(method.color).bg} rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0`}>
                          <div className="text-white">
                            {method.icon}
                          </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                              {method.name}
                            </h3>
                            <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                              <Zap className="w-4 h-4" />
                              <span>{method.processingTime}</span>
                            </div>
                          </div>
                          
                          <p className="text-gray-600 dark:text-gray-400 mb-4">
                            {method.description}
                          </p>

                          {/* Features */}
                          <div className="flex flex-wrap gap-2 mb-4">
                            {method.features.map((feature, index) => (
                              <span
                                key={index}
                                className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-xs font-medium"
                              >
                                {feature}
                              </span>
                            ))}
                          </div>

                          {/* Logos */}
                          <div className="flex flex-wrap gap-3">
                            {method.logos.map((logo, index) => (
                              <span
                                key={index}
                                className="text-sm text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-800 px-3 py-1 rounded-lg border border-gray-200 dark:border-gray-600"
                              >
                                {logo}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Selection Indicator */}
                        <div className="flex-shrink-0">
                          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                            selectedMethod === method.id
                              ? `${getColorClasses(method.color).border} ${getColorClasses(method.color).light}`
                              : 'border-gray-300 dark:border-gray-600'
                          }`}>
                            {selectedMethod === method.id && (
                              <div className={`w-3 h-3 bg-gradient-to-br ${getColorClasses(method.color).bg} rounded-full`}></div>
                            )}
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>

                {/* Security Notice */}
                <div className="mt-8 p-6 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border border-green-200 dark:border-green-700">
                  <div className="flex items-start space-x-4">
                    <Shield className="w-8 h-8 text-green-600 dark:text-green-400 flex-shrink-0" />
                    <div>
                      <h4 className="font-bold text-green-800 dark:text-green-200 mb-2">
                        100% Secure Payment Gateway
                      </h4>
                      <p className="text-sm text-green-700 dark:text-green-300 mb-3">
                        Your payment is processed through Razorpay, India's most trusted payment gateway. 
                        We never store your card details or banking information.
                      </p>
                      <div className="flex flex-wrap gap-4 text-xs text-green-600 dark:text-green-400">
                        <span>✓ 256-bit SSL Encryption</span>
                        <span>✓ PCI DSS Level 1 Compliant</span>
                        <span>✓ RBI Approved</span>
                        <span>✓ Zero Fraud Liability</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Continue Button */}
                <button
                  onClick={handleContinue}
                  disabled={!selectedMethod}
                  className={`w-full mt-8 py-4 px-8 rounded-xl font-bold text-lg transition-all duration-300 transform flex items-center justify-center space-x-3 ${
                    selectedMethod
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white hover:scale-105 shadow-xl'
                      : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <span>Continue to Order Summary</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}