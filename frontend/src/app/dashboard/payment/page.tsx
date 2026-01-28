'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { 
  ArrowLeft,
  Shield, 
  Lock, 
  CheckCircle, 
  AlertCircle,
  CreditCard,
  Smartphone,
  QrCode,
  Building2,
  Wallet,
  IndianRupee,
  User,
  Mail,
  Phone,
  Calendar,
  Award,
  Zap,
  Crown,
  Star,
  Gift,
  Loader2,
  Check,
  Eye,
  EyeOff,
  Copy,
  RefreshCw,
  Timer,
  Info
} from 'lucide-react'
import PaymentForm from '@/components/payment/PaymentForm'

export default function DashboardPaymentPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [userDetails, setUserDetails] = useState({
    name: '',
    email: '',
    phone: ''
  })
  const [loading, setLoading] = useState(false)

  // Get payment details from URL params
  const serviceId = searchParams.get('service') || 'basic-monthly'
  const amount = parseInt(searchParams.get('amount') || '99')

  // Service details mapping
  const serviceDetails = {
    'basic-monthly': {
      name: '🚀 Basic Access',
      description: 'Perfect for casual property seekers',
      amount: 99,
      period: 'Per Month',
      features: [
        'Browse unlimited properties',
        'Contact 5 owners per month',
        'Basic search filters',
        'Email support',
        'Mobile app access'
      ],
      color: 'blue',
      icon: <Zap className="w-8 h-8 text-white" />
    },
    'premium-access-6m': {
      name: '🔓 Premium Access',
      description: 'Best value for serious property seekers',
      amount: 500,
      period: '6-Month Plan',
      features: [
        'Unlimited owner contacts',
        'Advanced search filters',
        'Priority customer support',
        'Exclusive property previews',
        'Market reports'
      ],
      color: 'emerald',
      icon: <Crown className="w-8 h-8 text-white" />
    },
    'premium-access-1y': {
      name: '👑 Premium Plus',
      description: 'Ultimate plan for property professionals',
      amount: 900,
      period: '1-Year Plan',
      features: [
        'Everything in Premium',
        'Dedicated relationship manager',
        'VIP property tours',
        'Legal consultation',
        'Investment advisory'
      ],
      color: 'purple',
      icon: <Crown className="w-8 h-8 text-white" />
    },
    'property-listing': {
      name: '🏠 Property Listing',
      description: 'List your property and reach thousands',
      amount: 1000,
      period: 'One-Time Fee',
      features: [
        'Professional listing',
        'Multiple photo uploads',
        'Virtual tour integration',
        'Social media promotion',
        'Lead management'
      ],
      color: 'orange',
      icon: <Building2 className="w-8 h-8 text-white" />
    },
    'assisted-deal': {
      name: '🤝 Deal Assistance',
      description: 'Professional help for transactions',
      amount: 199,
      period: 'Service Fee + 1% Commission',
      features: [
        'Dedicated deal manager',
        'Property verification',
        'Legal documentation',
        'Negotiation assistance',
        'Deal closure support'
      ],
      color: 'red',
      icon: <User className="w-8 h-8 text-white" />
    }
  }

  const currentService = serviceDetails[serviceId as keyof typeof serviceDetails] || serviceDetails['basic-monthly']

  useEffect(() => {
    // Auto-fill user details if available
    const userData = localStorage.getItem('user')
    if (userData) {
      try {
        const user = JSON.parse(userData)
        setUserDetails({
          name: user.displayName || user.name || '',
          email: user.email || '',
          phone: user.phoneNumber || user.phone || ''
        })
      } catch (error) {
        console.error('Error parsing user data:', error)
      }
    }
  }, [])

  const handlePaymentSuccess = (paymentData: any) => {
    console.log('Payment successful:', paymentData)
    
    // Redirect to success page with payment details
    const successUrl = `/dashboard/payment/success?service=${encodeURIComponent(currentService.name)}&amount=${currentService.amount}&txnId=${paymentData.transactionId}&method=${paymentData.method}`
    router.push(successUrl)
  }

  const handlePaymentError = (error: string) => {
    console.error('Payment failed:', error)
    setLoading(false)
    
    // Show error message or redirect to failure page
    alert(`Payment failed: ${error}`)
  }

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'from-blue-500 to-blue-600',
      emerald: 'from-emerald-500 to-emerald-600',
      purple: 'from-purple-500 to-purple-600',
      orange: 'from-orange-500 to-orange-600',
      red: 'from-red-500 to-red-600'
    }
    return colors[color as keyof typeof colors] || colors.blue
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg shadow-lg border-b border-gray-200/50 dark:border-gray-700/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.back()}
                className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                  Complete Your Payment
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Secure payment powered by GharBazaar
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30 px-3 py-1 rounded-full">
                <Shield className="w-4 h-4" />
                <span className="font-medium">256-bit SSL</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Service Summary - Left Column */}
          <div className="lg:col-span-1 space-y-6">
            {/* Selected Plan Card */}
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-xl border border-gray-200 dark:border-gray-700 relative overflow-hidden">
              <div className={`absolute inset-0 bg-gradient-to-br ${getColorClasses(currentService.color)} opacity-[0.02]`}></div>
              
              <div className="relative z-10">
                <div className="text-center mb-6">
                  <div className={`w-20 h-20 bg-gradient-to-br ${getColorClasses(currentService.color)} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg`}>
                    {currentService.icon}
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    {currentService.name}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    {currentService.description}
                  </p>
                </div>

                <div className="text-center mb-6">
                  <div className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                    ₹{currentService.amount.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded-full inline-block">
                    {currentService.period}
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900 dark:text-white text-sm uppercase tracking-wide">
                    What's Included
                  </h4>
                  {currentService.features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className={`w-5 h-5 bg-gradient-to-br ${getColorClasses(currentService.color)} rounded-full flex items-center justify-center flex-shrink-0`}>
                        <Check className="w-3 h-3 text-white" />
                      </div>
                      <span className="text-gray-700 dark:text-gray-300 text-sm font-medium">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Security Notice */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 rounded-2xl p-6 border border-green-200/50 dark:border-green-700/50">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-green-100 dark:bg-green-800 rounded-full flex items-center justify-center">
                  <Shield className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h3 className="font-bold text-green-900 dark:text-green-100">100% Secure Payment</h3>
                  <p className="text-sm text-green-700 dark:text-green-300">Your data is protected</p>
                </div>
              </div>
              <ul className="space-y-2 text-sm text-green-800 dark:text-green-200">
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Bank-grade encryption</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>PCI DSS compliant</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>No data stored</span>
                </li>
              </ul>
            </div>

            {/* Support Info */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
              <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                <Info className="w-5 h-5 mr-2 text-blue-500" />
                Need Help?
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                  <Mail className="w-4 h-4" />
                  <span>support@gharbazaar.in</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                  <Phone className="w-4 h-4" />
                  <span>+91 98000 12345</span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
                  Available 24/7 for payment support
                </p>
              </div>
            </div>
          </div>

          {/* Payment Form - Right Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* User Details Form */}
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-xl border border-gray-200 dark:border-gray-700">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                <User className="w-6 h-6 mr-3 text-blue-500" />
                Your Details
              </h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={userDetails.name}
                    onChange={(e) => setUserDetails({...userDetails, name: e.target.value})}
                    className="w-full px-4 py-4 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-200"
                    placeholder="Enter your full name"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={userDetails.email}
                    onChange={(e) => setUserDetails({...userDetails, email: e.target.value})}
                    className="w-full px-4 py-4 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-200"
                    placeholder="your@email.com"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    value={userDetails.phone}
                    onChange={(e) => setUserDetails({...userDetails, phone: e.target.value})}
                    className="w-full px-4 py-4 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-200"
                    placeholder="+91 98765 43210"
                    required
                  />
                </div>
                
                <div className="md:col-span-2">
                  <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                    <Lock className="w-3 h-3" />
                    <span>Your information is secure and will only be used for payment processing</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Methods */}
            <PaymentForm
              amount={currentService.amount}
              serviceName={currentService.name}
              userDetails={userDetails}
              onPaymentSuccess={handlePaymentSuccess}
              onPaymentError={handlePaymentError}
              loading={loading}
            />
          </div>
        </div>

        {/* Bottom Trust Section */}
        <div className="mt-12 bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 rounded-3xl p-8 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-indigo-500/20 rounded-full -translate-y-16 translate-x-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-emerald-400/20 to-teal-500/20 rounded-full translate-y-12 -translate-x-12"></div>
          
          <div className="relative z-10 text-center">
            <h3 className="text-2xl font-bold mb-4">
              Trusted by 15,000+ Property Seekers
            </h3>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              Join thousands of satisfied customers who chose GharBazaar for transparent, secure property transactions.
            </p>
            
            <div className="grid md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              {[
                { icon: Shield, label: 'Secure Payments', desc: '256-bit encryption' },
                { icon: Award, label: 'Trusted Platform', desc: '15K+ users' },
                { icon: CheckCircle, label: 'Instant Access', desc: 'Immediate activation' },
                { icon: Star, label: '4.8/5 Rating', desc: 'Customer satisfaction' }
              ].map((item, index) => (
                <div key={index} className="text-center">
                  <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <item.icon className="w-6 h-6 text-blue-300" />
                  </div>
                  <div className="font-semibold text-sm">{item.label}</div>
                  <div className="text-xs text-blue-200">{item.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}