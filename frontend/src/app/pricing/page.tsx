'use client'

import { useState, Fragment } from 'react'
import Link from 'next/link'
import InteractiveBackground from '@/components/InteractiveBackground'
import PricingBackground from '@/components/backgrounds/PricingBackground'
import { motion } from 'framer-motion'
import {
  Check,
  X,
  Star,
  HelpCircle,
  Shield,
  Zap,
  Users,
  ChevronDown,
  ChevronUp,
  Home,
  Award,
  IndianRupee,
  ArrowRight,
  CheckCircle,
  Building2,
  UserCheck,
  Eye,
  Heart,
  Target,
  Search,
  Unlock,
  Calculator,
  Crown,
  FileText,
  Clock,
  Phone,
  Mail,
  MapPin,
  TrendingUp,
  Sparkles,
  Gift,
  ShieldCheck,
  CheckCircle2,
  Lock,
  CreditCard,
  Percent
} from 'lucide-react'

export default function PricingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  // Buyer Access Plans
  const buyerPlans = [
    {
      id: 'basic-buyer',
      name: 'Basic Buyer Access',
      price: 599,
      period: '1 month',
      description: 'Ideal for casual property seekers',
      popular: false,
      badge: 'AFFORDABLE',
      color: 'blue',
      features: [
        'Browse properties',
        'Owner contacts',
        'Email support',
        'Support manager',
        'Add two favourites'
      ]
    },
    {
      id: 'smart-buyer',
      name: 'Smart Buyer Plan',
      price: 2999,
      period: '6 months',
      description: 'Ideal for serious buyers',
      popular: true,
      badge: 'MOST POPULAR',
      color: 'emerald',
      features: [
        'Browse properties',
        'Owner contacts',
        'Email support',
        'Support manager',
        'Add two favourites'
      ]
    },
    {
      id: 'pro-buyer',
      name: 'Pro Buyer Plan',
      price: 4999,
      period: '1 year',
      description: 'Ideal for investors & committed buyers',
      popular: false,
      badge: 'BEST VALUE',
      color: 'purple',
      features: [
        'Browse properties',
        'Owner contacts',
        'Email support',
        'Support manager',
        'Add two favourites'
      ]
    }
  ]

  // Seller Plans
  const sellerPlans = [
    {
      id: 'basic-seller',
      name: 'Basic Seller Plan',
      price: 999,
      period: '1 property',
      description: 'Perfect for individual property owners',
      popular: false,
      badge: 'AFFORDABLE',
      color: 'blue',
      features: [
        'List 1 property',
        'Basic property photos (5 per listing)',
        'Standard listing visibility',
        'Email support',
        'Basic analytics dashboard',
        'Mobile app access'
      ]
    },
    {
      id: 'premium-seller',
      name: 'Premium Seller Plan',
      price: 19999,
      period: '24 properties for 6 months',
      description: 'Perfect for serious property sellers',
      popular: true,
      badge: 'MOST POPULAR',
      color: 'emerald',
      features: [
        'List up to 24 properties',
        'Professional photography (15 photos per listing)',
        'Premium listing placement',
        'Priority customer support',
        'Advanced analytics & insights',
        'Virtual tour integration'
      ]
    },
    {
      id: 'pro-seller',
      name: 'Pro Seller Plan',
      price: 49999,
      period: '60 properties for 1 year',
      description: 'Perfect for property dealers & investors',
      popular: false,
      badge: 'BEST VALUE',
      color: 'purple',
      features: [
        'List up to 60 properties',
        'Professional photography + drone shots',
        'Featured listing placement',
        'Dedicated account manager',
        'Complete market analysis',
        'Lead generation tools'
      ]
    }
  ]

  // Professional Services
  const professionalServices = [
    {
      id: 'property-marketing',
      name: 'Professional Marketing Package',
      price: 16999,
      originalPrice: 25000,
      period: 'one-time service',
      description: 'Complete property marketing solution',
      popular: true,
      badge: 'MOST POPULAR',
      color: 'blue',
      savings: '₹8,001 Saved',
      features: [
        'Professional photography (20+ photos)',
        'Drone aerial shots & video',
        'Virtual 360° tour creation',
        'Social media marketing content',
        'Property brochure design',
        'Online listing optimization'
      ]
    },
    {
      id: 'due-diligence',
      name: 'Property Due Diligence',
      price: 24999,
      originalPrice: 35000,
      period: 'one-time service',
      description: 'Complete legal & technical verification',
      popular: false,
      badge: 'MOST TRUSTED',
      color: 'blue',
      savings: '₹10,001 Saved',
      features: [
        'Document verification & authenticity check',
        'Circle rate & market value analysis',
        'Legal compliance verification',
        'Technical inspection report',
        'Professional assistance letter',
        'Risk assessment & recommendations'
      ]
    },
    {
      id: 'end-to-end',
      name: 'End-to-End Assistance',
      price: 39999,
      originalPrice: 55000,
      period: 'complete transaction',
      description: 'Full property transaction support',
      popular: false,
      badge: 'PREMIUM',
      color: 'purple',
      savings: '₹15,001 Saved',
      features: [
        'Complete due diligence process',
        'Negotiation & price finalization',
        'Legal documentation & registration',
        'Dedicated lawyer',
        'Professional assistance letter',
        'Home inspection & handover'
      ]
    },
    {
      id: 'managed-seller',
      name: 'GharBazaar Managed Seller Plan',
      price: 1999,
      commission: '1%',
      period: 'complete seller assistance',
      description: 'Hands-free selling experience',
      popular: false,
      badge: 'HANDS-FREE SELLER',
      color: 'indigo',
      highlight: true,
      features: [
        'Dedicated GharBazaar relationship manager',
        'Property listing & premium marketing',
        'Buyer screening & site visit coordination',
        'Complete negotiation handling',
        'End-to-end documentation & compliance support',
        'Sale/rent coordination till closure'
      ]
    }
  ]

  // Comparison table data
  const comparisonFeatures = [
    {
      category: 'Access & Browsing',
      features: [
        { name: 'Property Browsing', basic: true, smart: true, pro: true },
        { name: 'Advanced Filters', basic: false, smart: true, pro: true },
        { name: 'Save Properties', basic: '10', smart: '30', pro: 'Unlimited' },
        { name: 'Owner Contacts', basic: '5/month', smart: '20/month', pro: 'Unlimited' }
      ]
    },
    {
      category: 'Support & Features',
      features: [
        { name: 'Email Support', basic: true, smart: true, pro: true },
        { name: 'Priority Support', basic: false, smart: true, pro: true },
        { name: 'Market Insights', basic: false, smart: 'Basic', pro: 'Advanced' },
        { name: 'Dedicated Manager', basic: false, smart: false, pro: true }
      ]
    }
  ]

  // FAQs
  const faqs = [
    {
      question: 'What is the difference between buyer plans?',
      answer: 'Basic plan allows 5 owner contacts per month, Smart plan allows 20 contacts with advanced filters, and Pro plan offers unlimited contacts with dedicated support and market insights.'
    },
    {
      question: 'Can I upgrade or downgrade my plan anytime?',
      answer: 'Yes, you can upgrade your plan anytime. For downgrades, changes will take effect at the end of your current billing cycle.'
    },
    {
      question: 'What does the Managed Seller Plan include?',
      answer: 'Our Managed Seller Plan includes a ₹1,999 fixed fee plus 1% commission only on successful transactions. You get a dedicated manager who handles everything from listing to closing.'
    },
    {
      question: 'Are there any hidden charges?',
      answer: 'No, we believe in complete transparency. All prices shown are final with no hidden charges or surprise fees.'
    },
    {
      question: 'How does the due diligence service work?',
      answer: 'Our due diligence service includes complete document verification, legal compliance check, market analysis, and a detailed report within 7-10 business days.'
    },
    {
      question: 'Can I cancel my subscription anytime?',
      answer: 'Yes, you can cancel your subscription anytime. You will continue to have access until the end of your current billing period.'
    }
  ]

  const getColorClasses = (color: string) => {
    const colors = {
      blue: {
        bg: 'from-blue-500 to-blue-600',
        text: 'text-blue-600',
        border: 'border-blue-500',
        light: 'bg-blue-50 dark:bg-blue-900/20',
        button: 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800'
      },
      emerald: {
        bg: 'from-emerald-500 to-emerald-600',
        text: 'text-emerald-600',
        border: 'border-emerald-500',
        light: 'bg-emerald-50 dark:bg-emerald-900/20',
        button: 'bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800'
      },
      purple: {
        bg: 'from-purple-500 to-purple-600',
        text: 'text-purple-600',
        border: 'border-purple-500',
        light: 'bg-purple-50 dark:bg-purple-900/20',
        button: 'bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800'
      },
      orange: {
        bg: 'from-orange-500 to-orange-600',
        text: 'text-orange-600',
        border: 'border-orange-500',
        light: 'bg-orange-50 dark:bg-orange-900/20',
        button: 'bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800'
      },
      indigo: {
        bg: 'from-indigo-500 to-indigo-600',
        text: 'text-indigo-600',
        border: 'border-indigo-500',
        light: 'bg-indigo-50 dark:bg-indigo-900/20',
        button: 'bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800'
      }
    }
    return colors[color as keyof typeof colors] || colors.blue
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Hero Section */}
      <section className="relative h-screen overflow-hidden">
        {/* Background villa image from home page */}
        <PricingBackground />

        {/* Very Light Gradient - Just to make text readable */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent z-[1]"></div>

        {/* Content */}
        <div className="relative z-10 h-full max-w-[1400px] mx-auto px-8">
          <div className="h-full grid lg:grid-cols-12 gap-8 items-center pt-28">

            {/* LEFT SIDE - Shifted Right */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-8 space-y-5 lg:pl-12 xl:pl-16"
            >

              <motion.div
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.05 }}
                className="inline-flex items-center space-x-2 bg-emerald-500/10 backdrop-blur-sm px-4 py-2 rounded-full border border-emerald-400/30 mb-2"
              >
                <Shield className="text-emerald-400" size={16} />
                <span className="text-white text-xs font-semibold uppercase tracking-wider">Secure Payments</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-black leading-tight text-white focus-visible:outline-none"
              >
                Simple, Transparent Pricing
                <span className="block home-glow mt-1">
                  for Every Property Need
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.15 }}
                className="text-xs sm:text-sm text-gray-400 max-w-lg leading-relaxed"
              >
                Choose a plan that fits your role – Buyer, Seller, or Full-Service Client.
                No hidden charges. No monthly surprises. Just honest property deals.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.35, delay: 0.2 }}
                className="flex flex-wrap gap-3 pt-2"
              >
                <Link
                  href="#plans"
                  className="btn-emerald inline-flex items-center space-x-2 px-6 py-2.5 text-sm"
                >
                  <Search size={16} />
                  <span>View Our Plans</span>
                </Link>
                <Link
                  href="/contact"
                  className="btn-emerald-outline inline-flex items-center space-x-2 px-6 py-2.5 text-sm"
                >
                  <Phone size={16} />
                  <span>Talk to Expert</span>
                </Link>
              </motion.div>

              {/* Minimal Trust Indicator */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.25 }}
                className="flex items-center space-x-4 pt-8"
              >
                <div className="flex items-center space-x-2 px-4 py-2 bg-emerald-500/10 backdrop-blur-sm rounded-full border border-emerald-400/30">
                  <CheckCircle className="text-emerald-400" size={16} />
                  <span className="text-white text-xs font-semibold">Secure Transactions</span>
                </div>
                <div className="flex items-center space-x-2 px-4 py-2 bg-emerald-500/10 backdrop-blur-sm rounded-full border border-emerald-400/30">
                  <UserCheck className="text-emerald-400" size={16} />
                  <span className="text-white text-xs font-semibold">Professional Support</span>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Buyer Access Plans */}
      <section id="plans" className="py-20 bg-white dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 bg-blue-100 dark:bg-blue-900/30 px-6 py-3 rounded-full mb-6">
              <Users className="text-blue-600 dark:text-blue-400" size={20} />
              <span className="text-blue-700 dark:text-blue-300 font-semibold">FOR BUYERS</span>
            </div>
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Buyer Access Plans
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Find your perfect property with plans designed for every type of buyer
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {buyerPlans.map((plan, index) => (
              <div
                key={plan.id}
                className={`relative bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-xl border transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 ${plan.popular
                  ? 'border-2 border-emerald-500 ring-4 ring-emerald-500/20'
                  : 'border border-gray-200 dark:border-gray-700'
                  }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-0 right-0 flex justify-center">
                    <span className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-sm px-6 py-2 rounded-full font-bold shadow-lg">
                      ⭐ {plan.badge}
                    </span>
                  </div>
                )}

                <div className="text-center mb-8">
                  <div className={`w-20 h-20 bg-gradient-to-br ${getColorClasses(plan.color).bg} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg`}>
                    <Search className="text-white" size={40} />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{plan.name}</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">{plan.description}</p>

                  <div className="text-center">
                    <div className="text-5xl font-bold text-gray-900 dark:text-white mb-2">₹{plan.price}</div>
                    <p className="text-gray-600 dark:text-gray-300 font-medium">per {plan.period}</p>
                  </div>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center space-x-3">
                      <CheckCircle className="text-green-500 flex-shrink-0" size={20} />
                      <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href="/login"
                  className={`block w-full text-center ${getColorClasses(plan.color).button} text-white py-4 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl`}
                >
                  Start {plan.name.split(' ')[0]} Plan
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Seller Plans */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 bg-orange-100 dark:bg-orange-900/30 px-6 py-3 rounded-full mb-6">
              <Building2 className="text-orange-600 dark:text-orange-400" size={20} />
              <span className="text-orange-700 dark:text-orange-300 font-semibold">FOR SELLERS</span>
            </div>
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Seller & Owner Listing Plans
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Get maximum visibility for your property with our listing plans
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {sellerPlans.map((plan, index) => (
              <div
                key={plan.id}
                className={`relative bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-xl border transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 ${plan.popular
                  ? 'border-2 border-emerald-500 ring-4 ring-emerald-500/20'
                  : 'border border-gray-200 dark:border-gray-700'
                  }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-0 right-0 flex justify-center">
                    <span className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-sm px-6 py-2 rounded-full font-bold shadow-lg">
                      🏠 {plan.badge}
                    </span>
                  </div>
                )}

                <div className="text-center mb-8">
                  <div className={`w-20 h-20 bg-gradient-to-br ${getColorClasses(plan.color).bg} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg`}>
                    <Home className="text-white" size={40} />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{plan.name}</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">{plan.description}</p>

                  <div className="text-center">
                    {(plan as any).originalPrice && (
                      <div className="text-lg text-gray-400 dark:text-gray-500 line-through mb-2">
                        ₹{(plan as any).originalPrice.toLocaleString()}
                      </div>
                    )}
                    <div className="text-5xl font-bold text-gray-900 dark:text-white mb-2">₹{plan.price.toLocaleString()}</div>
                    <p className="text-gray-600 dark:text-gray-300 font-medium">{plan.period}</p>
                    {(plan as any).savings && (
                      <div className="mt-3 inline-flex items-center space-x-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-3 py-1 rounded-full text-sm font-semibold">
                        <Gift className="w-4 h-4" />
                        <span>{(plan as any).savings}</span>
                      </div>
                    )}
                  </div>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center space-x-3">
                      <CheckCircle className="text-green-500 flex-shrink-0" size={20} />
                      <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href="/login"
                  className={`block w-full text-center ${getColorClasses(plan.color).button} text-white py-4 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl`}
                >
                  List Your Property
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Professional Services */}
      <section className="py-20 bg-white dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 bg-purple-100 dark:bg-purple-900/30 px-6 py-3 rounded-full mb-6">
              <Award className="text-purple-600 dark:text-purple-400" size={20} />
              <span className="text-purple-700 dark:text-purple-300 font-semibold">PROFESSIONAL SERVICES</span>
            </div>
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Professional Real Estate Services
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Expert assistance for your property transactions and legal requirements
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 mb-20">
            {professionalServices.filter(service => service.id !== 'managed-seller').map((service, index) => (
              <div
                key={service.id}
                className={`relative bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-xl border transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 ${service.popular
                  ? 'border-2 border-blue-500 ring-4 ring-blue-500/20'
                  : 'border border-gray-200 dark:border-gray-700'
                  }`}
              >
                {service.popular && (
                  <div className="absolute -top-4 left-0 right-0 flex justify-center">
                    <span className="bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm px-6 py-2 rounded-full font-bold shadow-lg">
                      🔍 {service.badge}
                    </span>
                  </div>
                )}

                <div className="text-center mb-8">
                  <div className={`w-20 h-20 bg-gradient-to-br ${getColorClasses(service.color).bg} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg`}>
                    {service.id === 'property-marketing' && <Sparkles className="text-white" size={40} />}
                    {service.id === 'due-diligence' && <FileText className="text-white" size={40} />}
                    {service.id === 'end-to-end' && <Users className="text-white" size={40} />}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{service.name}</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">{service.description}</p>

                  <div className="text-center">
                    {service.originalPrice && (
                      <div className="text-lg text-gray-400 dark:text-gray-500 line-through mb-2">
                        ₹{service.originalPrice.toLocaleString()}
                      </div>
                    )}
                    <div className="text-5xl font-bold text-gray-900 dark:text-white mb-2">₹{service.price.toLocaleString()}</div>
                    <p className="text-gray-600 dark:text-gray-300 font-medium">{service.period}</p>
                    {service.savings && (
                      <div className="mt-3 inline-flex items-center space-x-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-3 py-1 rounded-full text-sm font-semibold">
                        <Gift className="w-4 h-4" />
                        <span>{service.savings}</span>
                      </div>
                    )}
                  </div>
                </div>

                <ul className="space-y-4 mb-8">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center space-x-3">
                      <CheckCircle className="text-green-500 flex-shrink-0" size={20} />
                      <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href="/login"
                  className={`block w-full text-center ${getColorClasses(service.color).button} text-white py-4 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl`}
                >
                  {service.id === 'property-marketing' ? 'Get Marketing Package' :
                    service.id === 'due-diligence' ? 'Get Due Diligence' : 'Get Full Service'}
                </Link>
              </div>
            ))}
          </div>

          {/* Let's GharBazaar Handle Everything - Clean Header */}
          <div className="text-center py-20 bg-white dark:bg-gray-950">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              {/* Simple Badge */}
              <div className="inline-flex items-center space-x-2 bg-blue-100 dark:bg-blue-900/30 px-6 py-2 rounded-full mb-6">
                <Sparkles className="text-blue-600 dark:text-blue-400" size={18} />
                <span className="text-blue-700 dark:text-blue-300 font-semibold text-sm">PREMIUM MANAGED SERVICES</span>
              </div>

              {/* Clean Heading */}
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">
                Let's
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent"> GharBazaar Handle </span>
                Everything
              </h2>

              {/* Simple Subtitle */}
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
                Sit back and relax while our expert team takes care of your entire property journey
              </p>
            </div>
          </div>

          {/* GharBazaar Managed Plans - Premium Horizontal Sections */}
          <div className="space-y-16">
            {/* GharBazaar Managed Seller Plan */}
            <div className="space-y-8">
              {/* Section Header */}
              <div className="text-center relative">
                <div className="absolute inset-0 flex items-center justify-center opacity-10">
                  <div className="w-96 h-96 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full blur-3xl"></div>
                </div>

                <div className="relative z-10">
                  <div className="inline-flex items-center space-x-3 bg-gradient-to-r from-purple-100 to-indigo-100 dark:from-purple-900/40 dark:to-indigo-900/40 backdrop-blur-xl px-8 py-4 rounded-2xl mb-8 shadow-xl border border-purple-200/50 dark:border-purple-700/50">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                      <Award className="text-white" size={24} />
                    </div>
                    <div className="text-left">
                      <div className="text-purple-700 dark:text-purple-300 font-bold text-lg">PREMIUM SELLER SOLUTION</div>
                      <div className="text-gray-600 dark:text-gray-400 text-sm">Find qualified sellers faster</div>
                    </div>
                  </div>

                  <h2 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-4 leading-tight">
                    <span className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 dark:from-purple-400 dark:via-indigo-400 dark:to-blue-400 bg-clip-text text-transparent">
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
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-indigo-500/10 to-blue-500/10 rounded-3xl blur-xl"></div>
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500 rounded-3xl opacity-20 blur-sm"></div>

                <div className="relative bg-white dark:bg-gray-900 rounded-3xl overflow-hidden shadow-2xl border border-purple-100/50 dark:border-purple-800/50">
                  {/* Premium Badge */}
                  <div className="absolute -top-2 -right-2 z-30">
                    <div className="bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500 text-white px-8 py-4 rounded-bl-3xl rounded-tr-3xl shadow-2xl">
                      <div className="flex items-center space-x-2 text-sm font-bold">
                        <Crown className="w-5 h-5" />
                        <span>PREMIUM SELLER ACCESS</span>
                        <Sparkles className="w-5 h-5" />
                      </div>
                    </div>
                  </div>

                  {/* Decorative Elements */}
                  <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500"></div>

                  <div className="p-8 lg:p-16">
                    <div className="grid lg:grid-cols-5 gap-12 items-center">
                      {/* Left: Plan Overview (2 columns) */}
                      <div className="lg:col-span-2 text-center lg:text-left">
                        {/* Icon & Title */}
                        <div className="flex flex-col lg:flex-row items-center lg:items-start space-y-6 lg:space-y-0 lg:space-x-6 mb-8">
                          <div className="relative">
                            <div className="w-28 h-28 bg-gradient-to-br from-purple-500 via-indigo-500 to-blue-500 rounded-3xl flex items-center justify-center shadow-2xl">
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
                            <div className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-400 dark:to-indigo-400 bg-clip-text text-transparent mb-2">
                              Access Plan
                            </div>
                            <p className="text-lg text-gray-600 dark:text-gray-300 font-medium">
                              We bring qualified sellers to you
                            </p>
                          </div>
                        </div>

                        {/* Pricing Card */}
                        <div className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/30 dark:to-indigo-900/30 rounded-3xl p-8 shadow-xl border border-purple-200/50 dark:border-purple-700/50 mb-8">
                          <div className="text-center">
                            <div className="text-sm font-semibold text-purple-600 dark:text-purple-400 mb-3 uppercase tracking-wide">
                              Performance-Based Pricing
                            </div>

                            <div className="flex items-center justify-center space-x-3 mb-4">
                              <div className="text-center">
                                <div className="flex items-baseline justify-center space-x-1">
                                  <span className="text-lg text-gray-500 font-medium">₹</span>
                                  <span className="text-5xl font-black text-purple-600 dark:text-purple-400">
                                    1,999
                                  </span>
                                </div>
                                <div className="text-sm text-gray-600 dark:text-gray-300 font-medium">
                                  Setup Fee
                                </div>
                              </div>

                              <div className="text-3xl font-bold text-gray-400">+</div>

                              <div className="text-center">
                                <div className="text-5xl font-black text-indigo-600 dark:text-indigo-400">
                                  1%
                                </div>
                                <div className="text-sm text-gray-600 dark:text-gray-300 font-medium">
                                  Success Fee
                                </div>
                              </div>
                            </div>

                            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-4 space-y-2">
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-600 dark:text-gray-300">Initial Setup:</span>
                                <span className="font-bold text-gray-900 dark:text-white">₹1,999</span>
                              </div>
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-600 dark:text-gray-300">Success Commission:</span>
                                <span className="font-bold text-gray-900 dark:text-white">1% only on match</span>
                              </div>
                            </div>

                            <div className="mt-4 inline-flex items-center space-x-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-4 py-2 rounded-full text-sm font-semibold">
                              <Shield className="w-4 h-4" />
                              <span>Pay success fee only when we deliver sellers</span>
                            </div>
                          </div>
                        </div>

                        {/* CTA Button */}
                        <Link
                          href="/login"
                          className="group w-full bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-700 hover:via-indigo-700 hover:to-blue-700 text-white py-6 rounded-2xl font-bold text-xl transition-all duration-500 shadow-2xl hover:shadow-3xl transform hover:scale-[1.02] relative overflow-hidden block text-center"
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                          <div className="relative flex items-center justify-center space-x-3">
                            <Award className="w-6 h-6" />
                            <span>Get Qualified Sellers</span>
                            <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform duration-300" />
                          </div>
                        </Link>
                      </div>

                      {/* Right: Features Grid (3 columns) */}
                      <div className="lg:col-span-3">
                        <div className="mb-8">
                          <h4 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 text-center lg:text-left">
                            What You Get
                          </h4>
                          <p className="text-gray-600 dark:text-gray-300 text-center lg:text-left">
                            Access to our premium seller network and qualified leads
                          </p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                          {[
                            'Access to verified seller database',
                            'Targeted seller matching for your needs',
                            'Pre-qualified seller introductions',
                            'Dedicated seller relationship manager',
                            'Priority seller notifications',
                            'Complete seller screening & verification'
                          ].map((feature, idx) => (
                            <div key={idx} className="group relative bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-800 dark:to-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-purple-100/50 dark:border-purple-800/30 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
                              <div className="flex items-start space-x-4">
                                <div className="relative">
                                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                                    <Check className="w-6 h-6 text-white" />
                                  </div>
                                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-purple-400 to-indigo-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
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
                          <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-2xl border border-purple-100 dark:border-purple-800/30">
                            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">300+</div>
                            <div className="text-xs text-gray-600 dark:text-gray-300 font-medium">Verified Sellers</div>
                          </div>
                          <div className="text-center p-4 bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 rounded-2xl border border-indigo-100 dark:border-indigo-800/30">
                            <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">12</div>
                            <div className="text-xs text-gray-600 dark:text-gray-300 font-medium">Days Avg Match</div>
                          </div>
                          <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-2xl border border-blue-100 dark:border-blue-800/30">
                            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">92%</div>
                            <div className="text-xs text-gray-600 dark:text-gray-300 font-medium">Match Success</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* GharBazaar Managed Buyer Plan */}
            <div className="space-y-8">
              {/* Section Header */}
              <div className="text-center relative">
                <div className="absolute inset-0 flex items-center justify-center opacity-10">
                  <div className="w-96 h-96 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full blur-3xl"></div>
                </div>

                <div className="relative z-10">
                  <div className="inline-flex items-center space-x-3 bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/40 dark:to-emerald-900/40 backdrop-blur-xl px-8 py-4 rounded-2xl mb-8 shadow-xl border border-green-200/50 dark:border-green-700/50">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                      <Target className="text-white" size={24} />
                    </div>
                    <div className="text-left">
                      <div className="text-green-700 dark:text-green-300 font-bold text-lg">PREMIUM BUYER SOLUTION</div>
                      <div className="text-gray-600 dark:text-gray-400 text-sm">Find qualified buyers faster</div>
                    </div>
                  </div>

                  <h2 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-4 leading-tight">
                    <span className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 dark:from-green-400 dark:via-emerald-400 dark:to-teal-400 bg-clip-text text-transparent">
                      GharBazaar Managed Buyer Plan
                    </span>
                  </h2>

                  <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
                    We find and bring qualified buyers directly to you with our premium buyer network
                  </p>
                </div>
              </div>

              {/* Premium Plan Card */}
              <div className="relative max-w-7xl mx-auto">
                {/* Background Effects */}
                <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 via-emerald-500/10 to-teal-500/10 rounded-3xl blur-xl"></div>
                <div className="absolute -inset-1 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 rounded-3xl opacity-20 blur-sm"></div>

                <div className="relative bg-white dark:bg-gray-900 rounded-3xl overflow-hidden shadow-2xl border border-green-100/50 dark:border-green-800/50">
                  {/* Premium Badge */}
                  <div className="absolute -top-2 -right-2 z-30">
                    <div className="bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 text-white px-8 py-4 rounded-bl-3xl rounded-tr-3xl shadow-2xl">
                      <div className="flex items-center space-x-2 text-sm font-bold">
                        <Crown className="w-5 h-5" />
                        <span>PREMIUM BUYER ACCESS</span>
                        <Sparkles className="w-5 h-5" />
                      </div>
                    </div>
                  </div>

                  {/* Decorative Elements */}
                  <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500"></div>

                  <div className="p-8 lg:p-16">
                    <div className="grid lg:grid-cols-5 gap-12 items-center">
                      {/* Left: Plan Overview (2 columns) */}
                      <div className="lg:col-span-2 text-center lg:text-left">
                        {/* Icon & Title */}
                        <div className="flex flex-col lg:flex-row items-center lg:items-start space-y-6 lg:space-y-0 lg:space-x-6 mb-8">
                          <div className="relative">
                            <div className="w-28 h-28 bg-gradient-to-br from-green-500 via-emerald-500 to-teal-500 rounded-3xl flex items-center justify-center shadow-2xl">
                              <Target className="text-white" size={48} />
                            </div>
                            <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                              <Crown className="text-white" size={16} />
                            </div>
                          </div>

                          <div className="flex-1">
                            <h3 className="text-3xl lg:text-4xl font-black text-gray-900 dark:text-white mb-3 leading-tight">
                              Managed Buyer
                            </h3>
                            <div className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-400 bg-clip-text text-transparent mb-2">
                              Access Plan
                            </div>
                            <p className="text-lg text-gray-600 dark:text-gray-300 font-medium">
                              We bring qualified buyers to you
                            </p>
                          </div>
                        </div>

                        {/* Pricing Card */}
                        <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 rounded-3xl p-8 shadow-xl border border-green-200/50 dark:border-green-700/50 mb-8">
                          <div className="text-center">
                            <div className="text-sm font-semibold text-green-600 dark:text-green-400 mb-3 uppercase tracking-wide">
                              Performance-Based Pricing
                            </div>

                            <div className="flex items-center justify-center space-x-3 mb-4">
                              <div className="text-center">
                                <div className="flex items-baseline justify-center space-x-1">
                                  <span className="text-lg text-gray-500 font-medium">₹</span>
                                  <span className="text-5xl font-black text-green-600 dark:text-green-400">
                                    1,999
                                  </span>
                                </div>
                                <div className="text-sm text-gray-600 dark:text-gray-300 font-medium">
                                  Setup Fee
                                </div>
                              </div>

                              <div className="text-3xl font-bold text-gray-400">+</div>

                              <div className="text-center">
                                <div className="text-5xl font-black text-emerald-600 dark:text-emerald-400">
                                  1%
                                </div>
                                <div className="text-sm text-gray-600 dark:text-gray-300 font-medium">
                                  Success Fee
                                </div>
                              </div>
                            </div>

                            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-4 space-y-2">
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-600 dark:text-gray-300">Initial Setup:</span>
                                <span className="font-bold text-gray-900 dark:text-white">₹1,999</span>
                              </div>
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-600 dark:text-gray-300">Success Commission:</span>
                                <span className="font-bold text-gray-900 dark:text-white">1% only on match</span>
                              </div>
                            </div>

                            <div className="mt-4 inline-flex items-center space-x-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-4 py-2 rounded-full text-sm font-semibold">
                              <Shield className="w-4 h-4" />
                              <span>Pay success fee only when we deliver buyers</span>
                            </div>
                          </div>
                        </div>

                        {/* CTA Button */}
                        <Link
                          href="/login"
                          className="group w-full bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 hover:from-green-700 hover:via-emerald-700 hover:to-teal-700 text-white py-6 rounded-2xl font-bold text-xl transition-all duration-500 shadow-2xl hover:shadow-3xl transform hover:scale-[1.02] relative overflow-hidden block text-center"
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                          <div className="relative flex items-center justify-center space-x-3">
                            <Target className="w-6 h-6" />
                            <span>Get Qualified Buyers</span>
                            <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform duration-300" />
                          </div>
                        </Link>
                      </div>

                      {/* Right: Features Grid (3 columns) */}
                      <div className="lg:col-span-3">
                        <div className="mb-8">
                          <h4 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 text-center lg:text-left">
                            What You Get
                          </h4>
                          <p className="text-gray-600 dark:text-gray-300 text-center lg:text-left">
                            Access to our premium buyer network and qualified leads
                          </p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                          {[
                            'Access to verified buyer database',
                            'Targeted buyer matching for your property',
                            'Pre-qualified buyer introductions',
                            'Dedicated buyer relationship manager',
                            'Priority buyer notifications',
                            'Complete buyer screening & verification'
                          ].map((feature, idx) => (
                            <div key={idx} className="group relative bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-800 dark:to-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-green-100/50 dark:border-green-800/30 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
                              <div className="flex items-start space-x-4">
                                <div className="relative">
                                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                                    <Check className="w-6 h-6 text-white" />
                                  </div>
                                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
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
                          <div className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl border border-green-100 dark:border-green-800/30">
                            <div className="text-2xl font-bold text-green-600 dark:text-green-400">500+</div>
                            <div className="text-xs text-gray-600 dark:text-gray-300 font-medium">Verified Buyers</div>
                          </div>
                          <div className="text-center p-4 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-2xl border border-emerald-100 dark:border-emerald-800/30">
                            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">15</div>
                            <div className="text-xs text-gray-600 dark:text-gray-300 font-medium">Days Avg Match</div>
                          </div>
                          <div className="text-center p-4 bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-900/20 dark:to-cyan-900/20 rounded-2xl border border-teal-100 dark:border-teal-800/30">
                            <div className="text-2xl font-bold text-teal-600 dark:text-teal-400">95%</div>
                            <div className="text-xs text-gray-600 dark:text-gray-300 font-medium">Match Success</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 bg-blue-100 dark:bg-blue-900/30 px-6 py-3 rounded-full mb-6">
              <Calculator className="text-blue-600 dark:text-blue-400" size={20} />
              <span className="text-blue-700 dark:text-blue-300 font-semibold">PLAN COMPARISON</span>
            </div>
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Compare Buyer Plans
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Find the perfect plan that matches your property search needs
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-200 dark:border-gray-700">
                    <th className="text-left py-6 px-6 font-bold text-gray-900 dark:text-white text-lg">Features</th>
                    <th className="text-center py-6 px-6">
                      <div className="flex flex-col items-center">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-2 shadow-lg">
                          <Search className="text-white" size={20} />
                        </div>
                        <div className="font-bold text-blue-600 dark:text-blue-400">Basic</div>
                        <div className="text-sm text-gray-500">₹99/month</div>
                      </div>
                    </th>
                    <th className="text-center py-6 px-6">
                      <div className="flex flex-col items-center">
                        <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center mb-2 shadow-lg">
                          <Star className="text-white" size={20} />
                        </div>
                        <div className="font-bold text-emerald-600 dark:text-emerald-400">Smart</div>
                        <div className="text-sm text-gray-500">₹499/6mo</div>
                      </div>
                    </th>
                    <th className="text-center py-6 px-6">
                      <div className="flex flex-col items-center">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-2 shadow-lg">
                          <Crown className="text-white" size={20} />
                        </div>
                        <div className="font-bold text-purple-600 dark:text-purple-400">Pro</div>
                        <div className="text-sm text-gray-500">₹899/year</div>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonFeatures.map((category, categoryIndex) => (
                    <Fragment key={category.category}>
                      <tr key={`category-${categoryIndex}`} className="bg-gray-50 dark:bg-gray-700">
                        <td colSpan={4} className="py-4 px-6 font-bold text-gray-900 dark:text-white text-sm uppercase tracking-wide">
                          {category.category}
                        </td>
                      </tr>
                      {category.features.map((feature, featureIndex) => (
                        <tr key={`feature-${categoryIndex}-${featureIndex}`} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                          <td className="py-4 px-6 font-semibold text-gray-900 dark:text-white">{feature.name}</td>
                          <td className="py-4 px-6 text-center">
                            {typeof feature.basic === 'boolean' ? (
                              feature.basic ? (
                                <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto">
                                  <Check className="text-green-600 dark:text-green-400" size={16} />
                                </div>
                              ) : (
                                <div className="w-8 h-8 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto">
                                  <X className="text-red-500 dark:text-red-400" size={16} />
                                </div>
                              )
                            ) : (
                              <span className="text-sm font-medium text-blue-700 dark:text-blue-300 bg-blue-100 dark:bg-blue-900/30 px-3 py-1 rounded-full">
                                {feature.basic}
                              </span>
                            )}
                          </td>
                          <td className="py-4 px-6 text-center">
                            {typeof feature.smart === 'boolean' ? (
                              feature.smart ? (
                                <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto">
                                  <Check className="text-green-600 dark:text-green-400" size={16} />
                                </div>
                              ) : (
                                <div className="w-8 h-8 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto">
                                  <X className="text-red-500 dark:text-red-400" size={16} />
                                </div>
                              )
                            ) : (
                              <span className="text-sm font-medium text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-900/30 px-3 py-1 rounded-full">
                                {feature.smart}
                              </span>
                            )}
                          </td>
                          <td className="py-4 px-6 text-center">
                            {typeof feature.pro === 'boolean' ? (
                              feature.pro ? (
                                <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto">
                                  <Check className="text-green-600 dark:text-green-400" size={16} />
                                </div>
                              ) : (
                                <div className="w-8 h-8 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto">
                                  <X className="text-red-500 dark:text-red-400" size={16} />
                                </div>
                              )
                            ) : (
                              <span className="text-sm font-medium text-purple-700 dark:text-purple-300 bg-purple-100 dark:bg-purple-900/30 px-3 py-1 rounded-full">
                                {feature.pro}
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Transparency Section */}
      <section className="py-20 bg-white dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 bg-green-100 dark:bg-green-900/30 px-6 py-3 rounded-full mb-6">
              <Shield className="text-green-600 dark:text-green-400" size={20} />
              <span className="text-green-700 dark:text-green-300 font-semibold">TRUST & TRANSPARENCY</span>
            </div>
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Why Choose GharBazaar?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed">
              Experience India's most transparent and professional real estate platform
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {[
              {
                icon: Shield,
                title: 'No Hidden Charges',
                description: 'Complete transparency in all charges and pricing',
                color: 'emerald',
                stats: '100% Transparent'
              },
              {
                icon: ShieldCheck,
                title: 'Secure Payments',
                description: 'Bank-grade security with SSL encryption',
                color: 'blue',
                stats: 'RBI Compliant'
              },
              {
                icon: Users,
                title: 'Trusted by Thousands',
                description: 'Join 15,000+ satisfied property seekers',
                color: 'purple',
                stats: '15K+ Users'
              },
              {
                icon: Award,
                title: 'Professional Service',
                description: 'Certified real estate experts at your service',
                color: 'orange',
                stats: 'Expert Team'
              }
            ].map((item, index) => (
              <div key={index} className="text-center p-8 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-3xl border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all">
                <div className={`w-16 h-16 bg-gradient-to-br ${getColorClasses(item.color).bg} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg`}>
                  <item.icon className="text-white" size={32} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{item.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">{item.description}</p>
                <div className={`inline-flex items-center px-3 py-1 ${getColorClasses(item.color).light} ${getColorClasses(item.color).text} rounded-full text-sm font-semibold`}>
                  {item.stats}
                </div>
              </div>
            ))}
          </div>

          {/* Legal Text */}
          <div className="bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-8 border border-gray-200 dark:border-gray-700">
            <div className="text-center">
              <div className="flex items-center justify-center space-x-2 mb-4">
                <FileText className="text-gray-600 dark:text-gray-400" size={24} />
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Legal Disclaimer</h3>
              </div>
              <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed max-w-4xl mx-auto">
                "GharBazaar provides professional real estate assistance and brokerage services. Buyer subscription plans provide platform access only. All services are delivered transparently as per selected plans. No hidden charges. Secure payment gateway powered by Razorpay. Clear refund & support policy available."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 bg-blue-100 dark:bg-blue-900/30 px-6 py-3 rounded-full mb-6">
              <HelpCircle className="text-blue-600 dark:text-blue-400" size={20} />
              <span className="text-blue-700 dark:text-blue-300 font-semibold">FREQUENTLY ASKED QUESTIONS</span>
            </div>
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Got Questions? We Have Answers
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Everything you need to know about our transparent pricing
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <h3 className="font-bold text-lg text-gray-900 dark:text-white pr-4">
                    {faq.question}
                  </h3>
                  {openFaq === index ? (
                    <ChevronUp className="text-blue-600 dark:text-blue-400 flex-shrink-0" size={24} />
                  ) : (
                    <ChevronDown className="text-gray-400 flex-shrink-0" size={24} />
                  )}
                </button>
                {openFaq === index && (
                  <div className="px-6 pb-6 text-gray-700 dark:text-gray-300 leading-relaxed">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-blue-600 via-emerald-600 to-purple-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Ready to Find Your Perfect Property?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands who chose transparency over traditional brokerage
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/login"
              className="bg-white hover:bg-gray-50 text-blue-600 px-8 py-4 rounded-xl font-semibold transition-all flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl"
            >
              <Search size={20} />
              <span>Start Searching Properties</span>
            </Link>
            <Link
              href="/login"
              className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-8 py-4 rounded-xl font-semibold transition-all flex items-center justify-center space-x-2"
            >
              <Building2 size={20} />
              <span>List Your Property</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}