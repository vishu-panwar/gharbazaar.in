'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { 
  Shield, 
  CheckCircle, 
  FileText, 
  Home, 
  ArrowRight,
  Lock,
  Award,
  Star,
  IndianRupee,
  Clock,
  Users,
  Verified
} from 'lucide-react'

// Payment Overview Page Component
export default function PaymentPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [selectedService, setSelectedService] = useState<any>(null)

  // Professional real estate services
  const services = [
    {
      id: 'property-due-diligence',
      name: 'Professional Property Due Diligence',
      shortDescription: 'Complete legal & technical verification of your property',
      price: 15000,
      originalPrice: 20000,
      duration: '7-10 business days',
      category: 'Due Diligence',
      popular: true,
      includes: [
        'Document verification & authenticity check',
        'Circle rate & market value analysis',
        'Legal compliance & clearance verification',
        'Technical inspection report',
        'Professional assistance letter',
        'Risk assessment & recommendations',
        'Title deed verification',
        'Encumbrance certificate check'
      ],
      benefits: [
        'Avoid legal disputes',
        'Secure investment',
        'Professional guidance',
        'Peace of mind'
      ],
      icon: <FileText className="w-8 h-8 text-white" />,
      color: 'blue'
    },
    {
      id: 'property-listing-premium',
      name: 'Premium Property Listing Service',
      shortDescription: 'Professional listing with maximum visibility & leads',
      price: 5000,
      originalPrice: 8000,
      duration: 'Valid till sold/rented',
      category: 'Marketing',
      popular: false,
      includes: [
        'Professional photography & virtual tour',
        'Premium listing on all major portals',
        'Social media marketing campaign',
        'Lead management & follow-up',
        'Negotiation assistance',
        'Legal documentation support',
        'Market analysis report',
        'Performance analytics dashboard'
      ],
      benefits: [
        'Faster property sale/rent',
        'Higher visibility',
        'Professional presentation',
        'Expert support'
      ],
      icon: <Home className="w-8 h-8 text-white" />,
      color: 'emerald'
    },
    {
      id: 'end-to-end-assistance',
      name: 'End-to-End Property Transaction',
      shortDescription: 'Complete property buying/selling assistance',
      price: 25000,
      originalPrice: 35000,
      duration: '15-30 business days',
      category: 'Full Service',
      popular: true,
      includes: [
        'Property search & shortlisting',
        'Complete due diligence process',
        'Negotiation & price finalization',
        'Legal documentation & registration',
        'Bank loan facilitation',
        'Home inspection & handover',
        'Post-transaction support',
        'Dedicated relationship manager'
      ],
      benefits: [
        'Hassle-free transaction',
        'Expert guidance',
        'Time saving',
        'Risk mitigation'
      ],
      icon: <Award className="w-8 h-8 text-white" />,
      color: 'purple'
    }
  ]

  useEffect(() => {
    const serviceId = searchParams.get('service')
    if (serviceId) {
      const service = services.find(s => s.id === serviceId)
      if (service) {
        setSelectedService(service)
      }
    } else {
      // Default to first service if none selected
      setSelectedService(services[0])
    }
  }, [searchParams])

  const handleProceedToPayment = () => {
    if (selectedService) {
      router.push(`/payment/details?service=${selectedService.id}`)
    }
  }

  const getColorClasses = (color: string) => {
    const colors = {
      blue: {
        bg: 'from-blue-500 to-blue-600',
        text: 'text-blue-600',
        border: 'border-blue-500',
        light: 'bg-blue-50 dark:bg-blue-900/20'
      },
      emerald: {
        bg: 'from-emerald-500 to-emerald-600',
        text: 'text-emerald-600',
        border: 'border-emerald-500',
        light: 'bg-emerald-50 dark:bg-emerald-900/20'
      },
      purple: {
        bg: 'from-purple-500 to-purple-600',
        text: 'text-purple-600',
        border: 'border-purple-500',
        light: 'bg-purple-50 dark:bg-purple-900/20'
      }
    }
    return colors[color as keyof typeof colors] || colors.blue
  }

  if (!selectedService) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading service details...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                <Home className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">GharBazaar</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">Professional Real Estate Services</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30 px-3 py-2 rounded-full">
              <Shield className="w-4 h-4" />
              <span className="text-sm font-medium">100% Secure</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Service Selection Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6 sticky top-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Our Services</h3>
              <div className="space-y-4">
                {services.map((service) => (
                  <button
                    key={service.id}
                    onClick={() => setSelectedService(service)}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 ${
                      selectedService?.id === service.id
                        ? `${getColorClasses(service.color).border} ${getColorClasses(service.color).light}`
                        : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`w-10 h-10 bg-gradient-to-br ${getColorClasses(service.color).bg} rounded-lg flex items-center justify-center flex-shrink-0`}>
                        {service.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-900 dark:text-white text-sm mb-1">
                          {service.name}
                        </h4>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                          {service.shortDescription}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-bold text-gray-900 dark:text-white">
                            ₹{service.price.toLocaleString()}
                          </span>
                          {service.popular && (
                            <span className="px-2 py-1 text-xs bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-full font-medium">
                              Popular
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
              {/* Service Header */}
              <div className={`${getColorClasses(selectedService.color).light} p-8 border-b border-gray-200 dark:border-gray-700`}>
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-start space-x-4">
                    <div className={`w-16 h-16 bg-gradient-to-br ${getColorClasses(selectedService.color).bg} rounded-2xl flex items-center justify-center shadow-lg`}>
                      {selectedService.icon}
                    </div>
                    <div>
                      <div className="flex items-center space-x-3 mb-2">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                          {selectedService.name}
                        </h2>
                        {selectedService.popular && (
                          <span className="px-3 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-full text-sm font-medium">
                            Most Popular
                          </span>
                        )}
                      </div>
                      <p className="text-gray-600 dark:text-gray-400 text-lg mb-3">
                        {selectedService.shortDescription}
                      </p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>{selectedService.duration}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Award className="w-4 h-4" />
                          <span>{selectedService.category}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Pricing */}
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="flex items-baseline space-x-3">
                        {selectedService.originalPrice && (
                          <span className="text-lg text-gray-400 dark:text-gray-500 line-through">
                            ₹{selectedService.originalPrice.toLocaleString()}
                          </span>
                        )}
                        <span className="text-3xl font-bold text-gray-900 dark:text-white">
                          ₹{selectedService.price.toLocaleString()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        Fixed professional fee • No hidden charges
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-2 text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30 px-3 py-2 rounded-full text-sm font-medium mb-2">
                        <CheckCircle className="w-4 h-4" />
                        <span>100% Transparent Pricing</span>
                      </div>
                      <div className="flex items-center space-x-2 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-3 py-2 rounded-full text-sm font-medium">
                        <Shield className="w-4 h-4" />
                        <span>No Hidden Charges</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* What's Included */}
              <div className="p-8">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">What's Included</h3>
                <div className="grid md:grid-cols-2 gap-4 mb-8">
                  {selectedService.includes.map((item: string, index: number) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className={`w-5 h-5 bg-gradient-to-br ${getColorClasses(selectedService.color).bg} rounded-full flex items-center justify-center flex-shrink-0 mt-0.5`}>
                        <CheckCircle className="w-3 h-3 text-white" />
                      </div>
                      <span className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">{item}</span>
                    </div>
                  ))}
                </div>

                {/* Benefits */}
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Key Benefits</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  {selectedService.benefits.map((benefit: string, index: number) => (
                    <div key={index} className={`${getColorClasses(selectedService.color).light} rounded-xl p-4 text-center`}>
                      <div className={`w-8 h-8 bg-gradient-to-br ${getColorClasses(selectedService.color).bg} rounded-lg flex items-center justify-center mx-auto mb-2`}>
                        <Star className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{benefit}</span>
                    </div>
                  ))}
                </div>

                {/* Trust Indicators */}
                <div className="bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-700 dark:to-gray-800 rounded-xl p-6 mb-8">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 text-center">Why Choose GharBazaar?</h4>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center mx-auto mb-3">
                        <Verified className="w-6 h-6 text-green-600 dark:text-green-400" />
                      </div>
                      <h5 className="font-semibold text-gray-900 dark:text-white mb-2">Trusted by 15,000+</h5>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Property owners across India</p>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mx-auto mb-3">
                        <Shield className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                      </div>
                      <h5 className="font-semibold text-gray-900 dark:text-white mb-2">100% Secure</h5>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Bank-grade security & encryption</p>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center mx-auto mb-3">
                        <Award className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                      </div>
                      <h5 className="font-semibold text-gray-900 dark:text-white mb-2">Professional Team</h5>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Certified real estate experts</p>
                    </div>
                  </div>
                </div>

                {/* CTA Button */}
                <button
                  onClick={handleProceedToPayment}
                  className={`w-full bg-gradient-to-r ${getColorClasses(selectedService.color).bg} hover:shadow-xl text-white py-4 px-8 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-3`}
                >
                  <Lock className="w-5 h-5" />
                  <span>Proceed to Secure Payment</span>
                  <ArrowRight className="w-5 h-5" />
                </button>

                {/* Security Notice */}
                <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-700">
                  <div className="flex items-center space-x-3 text-sm text-green-800 dark:text-green-200">
                    <Shield className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                    <div>
                      <div className="font-semibold mb-1">Your payment is 100% secure</div>
                      <div className="text-xs text-green-700 dark:text-green-300">
                        SSL encrypted • PCI DSS compliant • Powered by Razorpay • No card details stored
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
  )
}