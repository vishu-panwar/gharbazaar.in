'use client'

import { useState } from 'react'
import {
  Check,
  Star,
  Shield,
  Zap,
  Users,
  Award,
  IndianRupee,
  ArrowRight,
  CheckCircle,
  Eye,
  Crown,
  Sparkles,
  Gift,
  User,
  Lock,
  Target
} from 'lucide-react'
import PaymentForm from '@/components/payment/PaymentForm'
import { usePayment } from '@/contexts/PaymentContext'

export default function DashboardPricingPage() {
  const { setPaid } = usePayment()
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
  const [showPaymentForm, setShowPaymentForm] = useState(false)
  const [currentPlan, setCurrentPlan] = useState<any>(null)
  const [userDetails, setUserDetails] = useState({
    name: '',
    email: '',
    phone: ''
  })

  // Buyer Access Plans
  const buyerPlans = [
    {
      id: 'basic-buyer',
      name: '🚀 Basic Buyer Access',
      price: 599,
      period: '1 Month',
      description: 'Perfect for casual property seekers',
      color: 'blue',
      popular: false,
      features: [
        'Browse properties',
        'Owner contacts',
        'Email support',
        'Support manager',
        'Add two favourites'
      ],
      buttonText: 'Start Basic Plan',
      badge: 'AFFORDABLE'
    },
    {
      id: 'smart-buyer',
      name: '⭐ Smart Buyer Plan',
      price: 2999,
      period: '6 Months',
      description: 'Perfect for agents and professionals',
      color: 'emerald',
      popular: true,
      features: [
        'Browse properties',
        'Owner contacts',
        'Email support',
        'Support manager',
        'Add two favourites'
      ],
      buttonText: 'Get Smart Plan',
      badge: 'MOST POPULAR'
    },
    {
      id: 'pro-buyer',
      name: '👑 Pro Buyer Plan',
      price: 4999,
      period: '1 Year',
      description: 'Perfect for investors & committed buyers',
      color: 'purple',
      popular: false,
      features: [
        'Browse properties',
        'Owner contacts',
        'Email support',
        'Support manager',
        'Add two favourites'
      ],
      buttonText: 'Get Pro Plan',
      badge: 'BEST VALUE'
    }
  ]

  // Professional Services
  const professionalServices = [
    {
      id: 'property-due-diligence',
      name: '🔍 Property Due Diligence',
      price: 24999,
      originalPrice: 35000,
      period: 'One-Time Service',
      description: 'Complete legal & technical verification',
      color: 'blue',
      popular: true,
      features: [
        'Document verification & authenticity check',
        'Circle rate & market value analysis',
        'Legal compliance & clearance verification',
        'Technical inspection report',
        'Professional assistance letter',
        'Risk assessment & recommendations'
      ],
      buttonText: 'Get Due Diligence',
      savings: '₹10,001 saved',
      badge: 'MOST TRUSTED'
    },
    {
      id: 'end-to-end-assistance',
      name: '🤝 End-to-End Assistance',
      price: 39999,
      originalPrice: 55000,
      period: 'Complete Transaction',
      description: 'Full property buying support',
      color: 'purple',
      popular: false,
      features: [
        'Complete due diligence process',
        'Negotiation & price finalization',
        'Legal documentation & registration',
        'Dedicated lawyer',
        'Professional assistance letter',
        'Home inspection & handover'
      ],
      buttonText: 'Get Full Service',
      savings: '₹15,001 saved',
      badge: 'PREMIUM'
    }
  ]

  // GharBazaar Managed Seller Plan (Special)
  const managedSellerPlan = {
    id: 'managed-seller',
    name: 'GharBazaar Managed Seller Plan',
    price: 1999,
    commission: '1%',
    period: 'Complete Seller Matching',
    description: 'We bring qualified sellers to you',
    color: 'purple',
    highlight: true,
    features: [
      'Access to verified seller database',
      'Targeted seller matching for your requirements',
      'Pre-qualified seller introductions',
      'Dedicated seller relationship manager',
      'Priority seller notifications',
      'Complete seller screening & verification'
    ],
    buttonText: 'Get Qualified Sellers',
    badge: 'PREMIUM SELLER ACCESS'
  }

  const handleSelectPlan = (plan: any) => {
    setSelectedPlan(plan.id)
    setCurrentPlan(plan)
    setShowPaymentForm(true)
  }

  const handlePaymentSuccess = (paymentData: any) => {
    // Mark user as paid to unlock property access
    setPaid()
    setShowPaymentForm(false)
    alert(`🎉 Payment Successful! You now have access to property details. Transaction ID: ${paymentData.transactionId}`)
    setCurrentPlan(null)
    setSelectedPlan(null)
  }

  const handlePaymentError = (error: string) => {
    alert(`❌ Payment Failed: ${error}`)
  }

  const handleBackToPlans = () => {
    setShowPaymentForm(false)
    setCurrentPlan(null)
    setSelectedPlan(null)
  }

  const getColorClasses = (color: string) => {
    const colors = {
      blue: {
        bg: 'from-blue-500 to-blue-600',
        text: 'text-blue-600',
        button: 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800'
      },
      emerald: {
        bg: 'from-emerald-500 to-emerald-600',
        text: 'text-emerald-600',
        button: 'bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800'
      },
      purple: {
        bg: 'from-purple-500 to-purple-600',
        text: 'text-purple-600',
        button: 'bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800'
      },
      indigo: {
        bg: 'from-indigo-500 to-indigo-600',
        text: 'text-indigo-600',
        button: 'bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800'
      }
    }
    return colors[color as keyof typeof colors] || colors.blue
  }

  const getPlanIcon = (planId: string) => {
    if (planId === 'basic-buyer') return <Zap className="text-white" size={32} />
    if (planId === 'smart-buyer') return <Star className="text-white" size={32} />
    if (planId === 'pro-buyer') return <Crown className="text-white" size={32} />
    if (planId === 'property-due-diligence') return <Shield className="text-white" size={32} />
    if (planId === 'end-to-end-assistance') return <Users className="text-white" size={32} />
    if (planId === 'managed-seller') return <Award className="text-white" size={32} />
    return <Star className="text-white" size={32} />
  }

  return (
    <div className="space-y-8">
      {showPaymentForm && currentPlan ? (
        <div className="space-y-8">
          {/* Payment Header */}
          <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 rounded-3xl p-8 border border-blue-100/50 dark:border-gray-700/50">
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={handleBackToPlans}
                className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-700 px-4 py-2 rounded-lg"
              >
                <ArrowRight className="w-5 h-5 rotate-180" />
                <span>Back to Plans</span>
              </button>
              <div className="flex items-center space-x-2 text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30 px-4 py-2 rounded-full">
                <Shield className="w-4 h-4" />
                <span className="font-medium">Secure Payment</span>
              </div>
            </div>

            <div className="text-center">
              <div className={`w-20 h-20 bg-gradient-to-br ${getColorClasses(currentPlan?.color || 'blue').bg} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg`}>
                {getPlanIcon(currentPlan?.id || 'basic-buyer')}
              </div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Complete Your Payment
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-2">
                {currentPlan?.name || 'Selected Plan'}
              </p>
              <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                ₹{currentPlan?.price?.toLocaleString() || '0'}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                {currentPlan?.period || 'N/A'}
              </div>
            </div>
          </div>

          {/* Payment Form */}
          <PaymentForm
            amount={currentPlan?.price || 0}
            serviceName={currentPlan?.name || 'Selected Plan'}
            userDetails={userDetails}
            onPaymentSuccess={handlePaymentSuccess}
            onPaymentError={handlePaymentError}
            loading={false}
          />
        </div>
      ) : (
        <>
          {/* Header */}
          <div className="relative bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 rounded-3xl p-12 border border-blue-100/50 dark:border-gray-700/50 overflow-hidden">
            <div className="relative z-10 text-center">
              <div className="inline-flex items-center space-x-3 bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl px-8 py-4 rounded-2xl mb-8 shadow-xl border border-white/20 dark:border-gray-700/20">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                  <IndianRupee className="text-white" size={20} />
                </div>
                <div className="text-left">
                  <div className="text-blue-700 dark:text-blue-300 font-bold text-sm">BUYER PLANS</div>
                  <div className="text-gray-600 dark:text-gray-400 text-xs">No hidden charges • Cancel anytime</div>
                </div>
              </div>

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-gray-900 dark:text-white mb-6 leading-tight">
                <span className="block">Choose Your</span>
                <span className="block bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-400 dark:via-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
                  Perfect Plan
                </span>
              </h1>

              <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed font-medium">
                Start from just <span className="font-bold text-blue-600 dark:text-blue-400">₹599/month</span> with complete transparency.
              </p>
            </div>
          </div>

          {/* Buyer Plans */}
          <div className="space-y-8">
            <div className="text-center">
              <div className="inline-flex items-center space-x-2 bg-blue-100 dark:bg-blue-900/30 px-6 py-3 rounded-full mb-6">
                <Users className="text-blue-600 dark:text-blue-400" size={20} />
                <span className="text-blue-700 dark:text-blue-300 font-semibold">BUYER ACCESS PLANS</span>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Choose Your Buyer Plan
              </h2>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {buyerPlans.map((plan, index) => (
                <div
                  key={plan.id}
                  className={`group relative bg-white dark:bg-gray-900 rounded-3xl overflow-hidden transition-all duration-500 hover:scale-[1.02] cursor-pointer ${plan.popular
                    ? 'shadow-2xl shadow-emerald-500/20 ring-2 ring-emerald-500/30'
                    : 'shadow-xl hover:shadow-2xl border border-gray-100 dark:border-gray-800'
                    }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-1 -right-1 z-20">
                      <div className={`bg-gradient-to-r ${getColorClasses(plan.color).bg} text-white px-6 py-2 rounded-bl-2xl rounded-tr-3xl shadow-lg`}>
                        <div className="flex items-center space-x-1 text-sm font-bold">
                          <Crown className="w-4 h-4" />
                          <span>MOST POPULAR</span>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="absolute top-6 left-6 z-10">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getColorClasses(plan.color).text} bg-${plan.color}-50 dark:bg-${plan.color}-900/20`}>
                      {plan.badge}
                    </span>
                  </div>

                  <div className="relative z-10 p-8 pt-16">
                    <div className={`w-20 h-20 bg-gradient-to-br ${getColorClasses(plan.color).bg} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg`}>
                      {getPlanIcon(plan.id)}
                    </div>

                    <div className="text-center mb-6">
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        {plan.name}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">
                        {plan.description}
                      </p>
                    </div>

                    <div className="text-center mb-8">
                      <div className="flex items-baseline justify-center space-x-2 mb-2">
                        <span className="text-sm text-gray-500 font-medium">₹</span>
                        <span className={`text-5xl font-bold ${getColorClasses(plan.color).text}`}>
                          {plan.price.toLocaleString()}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-300 font-medium bg-gray-50 dark:bg-gray-800 px-4 py-2 rounded-full inline-block">
                        {plan.period}
                      </div>
                    </div>

                    <div className="mb-8">
                      <ul className="space-y-3">
                        {plan.features.map((feature, idx) => (
                          <li key={idx} className="flex items-start space-x-3 text-sm">
                            <div className={`w-5 h-5 bg-gradient-to-br ${getColorClasses(plan.color).bg} rounded-full flex items-center justify-center flex-shrink-0 mt-0.5`}>
                              <Check className="w-3 h-3 text-white" />
                            </div>
                            <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <button
                      onClick={() => handleSelectPlan(plan)}
                      className={`block w-full text-center ${getColorClasses(plan.color).button} text-white py-4 rounded-2xl font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-xl`}
                    >
                      <div className="flex items-center justify-center space-x-3">
                        <span>{plan.buttonText}</span>
                        <ArrowRight className="w-5 h-5" />
                      </div>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Professional Services */}
          <div className="space-y-8 mt-16">
            <div className="text-center">
              <div className="inline-flex items-center space-x-2 bg-purple-100 dark:bg-purple-900/30 px-6 py-3 rounded-full mb-6">
                <Award className="text-purple-600 dark:text-purple-400" size={20} />
                <span className="text-purple-700 dark:text-purple-300 font-semibold">PROFESSIONAL SERVICES</span>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Expert Property Services
              </h2>
            </div>

            <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {professionalServices.map((service, index) => (
                <div
                  key={service.id}
                  className={`group relative bg-white dark:bg-gray-900 rounded-3xl overflow-hidden transition-all duration-500 hover:scale-[1.02] cursor-pointer ${service.popular
                    ? 'shadow-2xl shadow-blue-500/20 ring-2 ring-blue-500/30'
                    : 'shadow-xl hover:shadow-2xl border border-gray-100 dark:border-gray-800'
                    }`}
                >
                  {service.popular && (
                    <div className="absolute -top-1 -right-1 z-20">
                      <div className={`bg-gradient-to-r ${getColorClasses(service.color).bg} text-white px-6 py-2 rounded-bl-2xl rounded-tr-3xl shadow-lg`}>
                        <div className="flex items-center space-x-1 text-sm font-bold">
                          <Crown className="w-4 h-4" />
                          <span>{service.badge}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="absolute top-6 left-6 z-10">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getColorClasses(service.color).text} bg-${service.color}-50 dark:bg-${service.color}-900/20`}>
                      {service.badge}
                    </span>
                  </div>

                  <div className="relative z-10 p-8 pt-16">
                    <div className={`w-20 h-20 bg-gradient-to-br ${getColorClasses(service.color).bg} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg`}>
                      {getPlanIcon(service.id)}
                    </div>

                    <div className="text-center mb-6">
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        {service.name}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">
                        {service.description}
                      </p>
                    </div>

                    <div className="text-center mb-8">
                      {service.originalPrice && (
                        <div className="text-lg text-gray-400 line-through mb-2">
                          ₹{service.originalPrice.toLocaleString()}
                        </div>
                      )}
                      <div className="flex items-baseline justify-center space-x-2 mb-2">
                        <span className="text-sm text-gray-500 font-medium">₹</span>
                        <span className={`text-5xl font-bold ${getColorClasses(service.color).text}`}>
                          {service.price.toLocaleString()}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-300 font-medium bg-gray-50 dark:bg-gray-800 px-4 py-2 rounded-full inline-block">
                        {service.period}
                      </div>

                      {service.savings && (
                        <div className="mt-4 inline-flex items-center space-x-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-4 py-2 rounded-full text-sm font-semibold">
                          <Sparkles className="w-4 h-4" />
                          <span>{service.savings}</span>
                        </div>
                      )}
                    </div>

                    <div className="mb-8">
                      <ul className="space-y-3">
                        {service.features.map((feature, idx) => (
                          <li key={idx} className="flex items-start space-x-3 text-sm">
                            <div className={`w-5 h-5 bg-gradient-to-br ${getColorClasses(service.color).bg} rounded-full flex items-center justify-center flex-shrink-0 mt-0.5`}>
                              <Check className="w-3 h-3 text-white" />
                            </div>
                            <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <button
                      onClick={() => handleSelectPlan(service)}
                      className={`block w-full text-center ${getColorClasses(service.color).button} text-white py-4 rounded-2xl font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-xl`}
                    >
                      <div className="flex items-center justify-center space-x-3">
                        <span>{service.buttonText}</span>
                        <ArrowRight className="w-5 h-5" />
                      </div>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* GharBazaar Managed Seller Plan - Premium Horizontal Section */}
          <div className="space-y-8 mt-20">
            {/* Section Header */}
            <div className="text-center relative">
              <div className="absolute inset-0 flex items-center justify-center opacity-10">
                <div className="w-96 h-96 bg-gradient-to-r from-purple-500 to-blue-600 rounded-full blur-3xl"></div>
              </div>

              <div className="relative z-10">
                <div className="inline-flex items-center space-x-3 bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/40 dark:to-blue-900/40 backdrop-blur-xl px-8 py-4 rounded-2xl mb-8 shadow-xl border border-purple-200/50 dark:border-purple-700/50">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                    <Target className="text-white" size={24} />
                  </div>
                  <div className="text-left">
                    <div className="text-purple-700 dark:text-purple-300 font-bold text-lg">PREMIUM SELLER SOLUTION</div>
                    <div className="text-gray-600 dark:text-gray-400 text-sm">Find qualified sellers faster</div>
                  </div>
                </div>

                <h2 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-4 leading-tight">
                  <span className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 dark:from-purple-400 dark:via-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
                    GharBazaar Managed Seller Plan
                  </span>
                </h2>

                <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
                  We find and bring qualified sellers directly to you with our premium seller network
                </p>
              </div>
            </div>

            {/* Premium Plan Card */}
            <div className="relative max-w-7xl mx-auto">
              {/* Background Effects */}
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-indigo-500/10 rounded-3xl blur-xl"></div>
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 via-blue-500 to-indigo-500 rounded-3xl opacity-20 blur-sm"></div>

              <div className="relative bg-white dark:bg-gray-900 rounded-3xl overflow-hidden shadow-2xl border border-purple-100/50 dark:border-purple-800/50">
                {/* Premium Badge */}
                <div className="absolute -top-2 -right-2 z-30">
                  <div className="bg-gradient-to-r from-purple-500 via-blue-500 to-indigo-500 text-white px-8 py-4 rounded-bl-3xl rounded-tr-3xl shadow-2xl">
                    <div className="flex items-center space-x-2 text-sm font-bold">
                      <Crown className="w-5 h-5" />
                      <span>PREMIUM SELLER ACCESS</span>
                      <Sparkles className="w-5 h-5" />
                    </div>
                  </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-purple-500 via-blue-500 to-indigo-500"></div>

                <div className="p-8 lg:p-16">
                  <div className="grid lg:grid-cols-5 gap-12 items-center">
                    {/* Left: Plan Overview (2 columns) */}
                    <div className="lg:col-span-2 text-center lg:text-left">
                      {/* Icon & Title */}
                      <div className="flex flex-col lg:flex-row items-center lg:items-start space-y-6 lg:space-y-0 lg:space-x-6 mb-8">
                        <div className="relative">
                          <div className="w-28 h-28 bg-gradient-to-br from-indigo-500 via-purple-500 to-blue-500 rounded-3xl flex items-center justify-center shadow-2xl">
                            <Award className="text-white" size={48} />
                          </div>
                          <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                            <Crown className="text-white" size={16} />
                          </div>
                        </div>

                        <div className="flex-1">
                          <h3 className="text-3xl lg:text-4xl font-black text-gray-900 dark:text-white mb-3 leading-tight">
                            Managed Seller
                          </h3>
                          <div className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 dark:from-emerald-400 dark:to-green-400 bg-clip-text text-transparent mb-2">
                            Access Plan
                          </div>
                          <p className="text-lg text-gray-600 dark:text-gray-300 font-medium">
                            We bring qualified sellers to you
                          </p>
                        </div>
                      </div>

                      {/* Pricing Card */}
                      <div className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/30 dark:to-blue-900/30 rounded-3xl p-8 shadow-xl border border-purple-200/50 dark:border-purple-700/50 mb-8">
                        <div className="text-center">
                          <div className="text-sm font-semibold text-purple-600 dark:text-purple-400 mb-3 uppercase tracking-wide">
                            Performance-Based Pricing
                          </div>

                          <div className="flex items-center justify-center space-x-3 mb-4">
                            <div className="text-center">
                              <div className="flex items-baseline justify-center space-x-1">
                                <span className="text-lg text-gray-500 font-medium">₹</span>
                                <span className="text-5xl font-black text-purple-600 dark:text-purple-400">
                                  {managedSellerPlan.price.toLocaleString()}
                                </span>
                              </div>
                              <div className="text-sm text-gray-600 dark:text-gray-300 font-medium">
                                Setup Fee
                              </div>
                            </div>

                            <div className="text-3xl font-bold text-gray-400">+</div>

                            <div className="text-center">
                              <div className="text-5xl font-black text-blue-600 dark:text-blue-400">
                                {managedSellerPlan.commission}
                              </div>
                              <div className="text-sm text-gray-600 dark:text-gray-300 font-medium">
                                Success Fee
                              </div>
                            </div>
                          </div>

                          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-4 space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-600 dark:text-gray-300">Initial Setup:</span>
                              <span className="font-bold text-gray-900 dark:text-white">₹{managedSellerPlan.price.toLocaleString()}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-600 dark:text-gray-300">Success Commission:</span>
                              <span className="font-bold text-gray-900 dark:text-white">{managedSellerPlan.commission} only on match</span>
                            </div>
                          </div>

                          <div className="mt-4 inline-flex items-center space-x-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-semibold">
                            <Shield className="w-4 h-4" />
                            <span>Pay success fee only when we deliver sellers</span>
                          </div>
                        </div>
                      </div>

                      {/* CTA Button */}
                      <button
                        onClick={() => handleSelectPlan(managedSellerPlan)}
                        className="group w-full bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 hover:from-purple-700 hover:via-blue-700 hover:to-indigo-700 text-white py-6 rounded-2xl font-bold text-xl transition-all duration-500 shadow-2xl hover:shadow-3xl transform hover:scale-[1.02] relative overflow-hidden"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <div className="relative flex items-center justify-center space-x-3">
                          <Target className="w-6 h-6" />
                          <span>{managedSellerPlan.buttonText}</span>
                          <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform duration-300" />
                        </div>
                      </button>
                    </div>

                    {/* Right: Features Grid (3 columns) */}
                    <div className="lg:col-span-3">
                      <div className="mb-8">
                        <h4 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 text-center lg:text-left">
                          What You Get
                        </h4>
                        <p className="text-gray-600 dark:text-gray-300 text-center lg:text-left">
                          Access to our premium seller network and qualified properties
                        </p>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        {managedSellerPlan.features.map((feature, idx) => (
                          <div key={idx} className="group relative bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-800 dark:to-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-purple-100/50 dark:border-purple-800/30 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
                            <div className="flex items-start space-x-4">
                              <div className="relative">
                                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                                  <Check className="w-6 h-6 text-white" />
                                </div>
                                <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                              </div>
                              <div className="flex-1">
                                <span className="text-gray-800 dark:text-gray-200 font-semibold leading-relaxed block">
                                  {feature}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Trust Indicators */}
                      <div className="mt-8 grid grid-cols-3 gap-4">
                        <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-2xl border border-purple-100 dark:border-purple-800/30">
                          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">1000+</div>
                          <div className="text-xs text-gray-600 dark:text-gray-300 font-medium">Verified Sellers</div>
                        </div>
                        <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl border border-blue-100 dark:border-blue-800/30">
                          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">10</div>
                          <div className="text-xs text-gray-600 dark:text-gray-300 font-medium">Days Avg Match</div>
                        </div>
                        <div className="text-center p-4 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-2xl border border-indigo-100 dark:border-indigo-800/30">
                          <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">98%</div>
                          <div className="text-xs text-gray-600 dark:text-gray-300 font-medium">Match Success</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}