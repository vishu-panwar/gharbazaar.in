'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { backendApi } from '@/lib/backendApi'
import {
  Shield,
  ArrowLeft,
  Home,
  CheckCircle,
  FileText,
  MapPin,
  Phone,
  Mail,
  Building2,
  Lock,
  CreditCard,
  Smartphone,
  Wallet,
  QrCode,
  IndianRupee,
  Clock,
  Award,
  AlertTriangle,
  Info
} from 'lucide-react'

// Order Summary & Confirmation Page Component
export default function PaymentConfirmPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [serviceId, setServiceId] = useState<string>('')
  const [customerDetails, setCustomerDetails] = useState<any>(null)
  const [paymentMethod, setPaymentMethod] = useState<string>('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [serviceDetails, setServiceDetails] = useState<any>(null)

  const services = {
    'property-due-diligence': {
      name: 'Professional Property Due Diligence',
      price: 15000,
      tax: 2700, // 18% GST
      description: 'Complete legal & technical verification of your property',
      duration: '7-10 business days'
    },
    'property-listing-premium': {
      name: 'Premium Property Listing Service',
      price: 5000,
      tax: 900, // 18% GST
      description: 'Professional listing with maximum visibility & leads',
      duration: 'Valid till sold/rented'
    },
    'end-to-end-assistance': {
      name: 'End-to-End Property Transaction',
      price: 25000,
      tax: 4500, // 18% GST
      description: 'Complete property buying/selling assistance',
      duration: '15-30 business days'
    }
  }

  const paymentMethodNames = {
    'upi': { name: 'UPI Payment', icon: <Smartphone className="w-5 h-5" /> },
    'cards': { name: 'Debit/Credit Card', icon: <CreditCard className="w-5 h-5" /> },
    'netbanking': { name: 'Net Banking', icon: <Building2 className="w-5 h-5" /> },
    'wallets': { name: 'Digital Wallet', icon: <Wallet className="w-5 h-5" /> }
  }

  useEffect(() => {
    const service = searchParams.get('service')
    if (service) {
      setServiceId(service)
      setServiceDetails(services[service as keyof typeof services])
    } else {
      router.push('/payment')
    }

    // Load customer details and payment method from localStorage
    const details = localStorage.getItem('paymentCustomerDetails')
    const method = localStorage.getItem('selectedPaymentMethod')

    if (details) {
      setCustomerDetails(JSON.parse(details))
    } else {
      router.push(`/payment/details?service=${service}`)
    }

    if (method) {
      setPaymentMethod(method)
    } else {
      router.push(`/payment/method?service=${service}`)
    }
  }, [searchParams, router])

  const handleBack = () => {
    router.push(`/payment/method?service=${serviceId}`)
  }

  const handlePayNow = async () => {
    setIsProcessing(true)

    try {
      // Create order using backendApi
      const orderData = await backendApi.payments.createOrder(
        (serviceDetails.price + serviceDetails.tax) * 100, // amount in paise
        'service_payment',
        {
          service: serviceDetails.name,
          customer: customerDetails.fullName,
          email: customerDetails.email,
          phone: customerDetails.mobile,
          method: paymentMethod,
          serviceType: customerDetails.serviceType,
          propertyLocation: customerDetails.propertyLocation
        }
      )

      if (!orderData.success) {
        throw new Error('Failed to create order')
      }

      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 3000))

      // Generate payment ID and signature
      const paymentId = 'pay_' + Date.now() + Math.random().toString(36).substring(2, 8)
      const signature = 'sig_' + btoa(orderData.order.id + '|' + paymentId).substring(0, 20)

      // Verify payment using backendApi
      const verifyData = await backendApi.payments.verify({
        razorpay_order_id: orderData.order.id,
        razorpay_payment_id: paymentId,
        razorpay_signature: signature
      })

      if (verifyData.success) {
        // Store payment details for success page
        localStorage.setItem('paymentResult', JSON.stringify({
          success: true,
          transactionId: paymentId,
          orderId: orderData.order.id,
          amount: serviceDetails.price + serviceDetails.tax,
          service: serviceDetails.name,
          customer: customerDetails,
          timestamp: new Date().toISOString()
        }))

        router.push('/payment/success')
      } else {
        throw new Error('Payment verification failed')
      }
    } catch (error) {
      console.error('Payment error:', error)
      localStorage.setItem('paymentResult', JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Payment failed',
        timestamp: new Date().toISOString()
      }))
      router.push('/payment/failed')
    } finally {
      setIsProcessing(false)
    }
  }

  if (!serviceDetails || !customerDetails) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading order details...</p>
        </div>
      </div>
    )
  }

  const totalAmount = serviceDetails.price + serviceDetails.tax

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
                disabled={isProcessing}
              >
                <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                  <Home className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-gray-900 dark:text-white">GharBazaar</h1>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Order Confirmation</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30 px-3 py-2 rounded-full">
              <Shield className="w-4 h-4" />
              <span className="text-sm font-medium">Secure Checkout</span>
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
              <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
              <span className="text-sm font-medium text-green-600">Payment Method</span>
            </div>
            <div className="w-16 h-0.5 bg-blue-600"></div>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">3</span>
              </div>
              <span className="text-sm font-medium text-blue-600">Confirmation</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Order Summary */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-8 border-b border-gray-200 dark:border-gray-700">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <FileText className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Order Summary & Confirmation
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    Please review your order details before proceeding with payment
                  </p>
                </div>
              </div>

              <div className="p-8">
                {/* Service Details */}
                <div className="mb-8">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Service Details</h3>
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                          {serviceDetails.name}
                        </h4>
                        <p className="text-gray-600 dark:text-gray-400 mb-3">
                          {serviceDetails.description}
                        </p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                          <div className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span>{serviceDetails.duration}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Award className="w-4 h-4" />
                            <span>Professional Service</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-gray-900 dark:text-white">
                          ₹{serviceDetails.price.toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">Base Amount</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Customer Information */}
                <div className="mb-8">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Customer Information</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                          <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Full Name</p>
                          <p className="font-semibold text-gray-900 dark:text-white">{customerDetails.fullName}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                          <Phone className="w-5 h-5 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Mobile Number</p>
                          <p className="font-semibold text-gray-900 dark:text-white">{customerDetails.mobile}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                          <Mail className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Email Address</p>
                          <p className="font-semibold text-gray-900 dark:text-white">{customerDetails.email}</p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
                          <MapPin className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">City</p>
                          <p className="font-semibold text-gray-900 dark:text-white">{customerDetails.city}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center">
                          <Home className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Property Location</p>
                          <p className="font-semibold text-gray-900 dark:text-white">{customerDetails.propertyLocation}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-teal-100 dark:bg-teal-900/30 rounded-lg flex items-center justify-center">
                          <Award className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Service Type</p>
                          <p className="font-semibold text-gray-900 dark:text-white">{customerDetails.serviceType}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Payment Method */}
                <div className="mb-8">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Payment Method</h3>
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                        {paymentMethodNames[paymentMethod as keyof typeof paymentMethodNames]?.icon}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {paymentMethodNames[paymentMethod as keyof typeof paymentMethodNames]?.name}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Secure payment processing via Razorpay
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Important Disclaimer */}
                <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-xl p-6">
                  <div className="flex items-start space-x-3">
                    <Info className="w-6 h-6 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-amber-800 dark:text-amber-200 mb-2">
                        Important Service Disclaimer
                      </h4>
                      <p className="text-sm text-amber-700 dark:text-amber-300 leading-relaxed">
                        <strong>GharBazaar provides professional real estate assistance services.</strong>
                        Fees are charged on a fixed professional basis for consultation, due diligence,
                        documentation support, and advisory services. This payment is for professional
                        services only and does not guarantee any specific outcome regarding property
                        transactions. All services are subject to our terms and conditions.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6 sticky top-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Payment Summary</h3>

              {/* Amount Breakdown */}
              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Service Fee</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    ₹{serviceDetails.price.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">GST (18%)</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    ₹{serviceDetails.tax.toLocaleString()}
                  </span>
                </div>
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-900 dark:text-white">Total Payable</span>
                    <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      ₹{totalAmount.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Company Details */}
              <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Company Details</h4>
                <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <p><strong>Company:</strong> GharBazaar Technologies Pvt Ltd</p>
                  <p><strong>Address:</strong> 123 Business Park, Sector 18, Gurugram, Haryana 122015</p>
                  <p><strong>GSTIN:</strong> 06AABCG1234M1Z5</p>
                  <p><strong>Support:</strong> support@gharbazaar.in</p>
                  <p><strong>Phone:</strong> +91 98000 12345</p>
                </div>
              </div>

              {/* Pay Now Button */}
              <button
                onClick={handlePayNow}
                disabled={isProcessing}
                className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 transform flex items-center justify-center space-x-3 ${isProcessing
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white hover:scale-105 shadow-xl'
                  }`}
              >
                {isProcessing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Processing Payment...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-5 h-5" />
                    <span>Pay ₹{totalAmount.toLocaleString()} Securely</span>
                  </>
                )}
              </button>

              {/* Security Features */}
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-4 text-center">Security Features</h4>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 text-sm">
                    <Shield className="w-4 h-4 text-green-600 dark:text-green-400" />
                    <span className="text-gray-700 dark:text-gray-300">256-bit SSL encryption</span>
                  </div>
                  <div className="flex items-center space-x-3 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                    <span className="text-gray-700 dark:text-gray-300">PCI DSS compliant</span>
                  </div>
                  <div className="flex items-center space-x-3 text-sm">
                    <Award className="w-4 h-4 text-green-600 dark:text-green-400" />
                    <span className="text-gray-700 dark:text-gray-300">RBI approved gateway</span>
                  </div>
                  <div className="flex items-center space-x-3 text-sm">
                    <Lock className="w-4 h-4 text-green-600 dark:text-green-400" />
                    <span className="text-gray-700 dark:text-gray-300">Zero fraud liability</span>
                  </div>
                </div>
              </div>

              {/* Support */}
              <div className="mt-6 text-center">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                  Need help? Contact our support team
                </p>
                <div className="flex justify-center space-x-4 text-xs">
                  <a href="mailto:support@gharbazaar.in" className="text-blue-600 dark:text-blue-400 hover:underline">
                    Email Support
                  </a>
                  <a href="tel:+919800012345" className="text-blue-600 dark:text-blue-400 hover:underline">
                    Call Support
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}