'use client'

import { useState } from 'react'
import { 
  User, 
  Phone, 
  MapPin, 
  Home, 
  DollarSign, 
  Send, 
  CheckCircle, 
  AlertCircle, 
  FileText, 
  Clock, 
  Target, 
  Star, 
  Gift, 
  Zap,
  ArrowRight,
  Plus,
  MessageSquare,
  Building,
  Calendar,
  Mail,
  Briefcase,
  IndianRupee,
  TrendingUp,
  Shield,
  Award,
  Users,
  Info,
  ChevronDown,
  Search,
  Filter
} from 'lucide-react'
import toast from 'react-hot-toast'

interface ReferralForm {
  type: 'buyer' | 'seller' | ''
  name: string
  phone: string
  email: string
  city: string
  area: string
  propertyType: string
  budget: string
  timeline: string
  requirements: string
  source: string
  notes: string
  urgency: 'low' | 'medium' | 'high' | 'urgent'
}

export default function ReferralsPage() {
  const [formData, setFormData] = useState<ReferralForm>({
    type: '',
    name: '',
    phone: '',
    email: '',
    city: '',
    area: '',
    propertyType: '',
    budget: '',
    timeline: '',
    requirements: '',
    source: '',
    notes: '',
    urgency: 'medium'
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [generatedLeadId, setGeneratedLeadId] = useState('')
  const [currentStep, setCurrentStep] = useState(1)
  const [validationErrors, setValidationErrors] = useState<string[]>([])

  const propertyTypes = [
    { value: '1bhk', label: '1 BHK Apartment', icon: '🏠' },
    { value: '2bhk', label: '2 BHK Apartment', icon: '🏡' },
    { value: '3bhk', label: '3 BHK Apartment', icon: '🏘️' },
    { value: '4bhk', label: '4+ BHK Apartment', icon: '🏰' },
    { value: 'villa', label: 'Villa/Bungalow', icon: '🏖️' },
    { value: 'plot', label: 'Plot/Land', icon: '🌾' },
    { value: 'commercial', label: 'Commercial Space', icon: '🏢' },
    { value: 'shop', label: 'Shop/Retail', icon: '🏪' },
    { value: 'office', label: 'Office Space', icon: '🏬' },
    { value: 'warehouse', label: 'Warehouse/Godown', icon: '🏭' }
  ]

  const budgetRanges = [
    { value: 'under-10', label: 'Under ₹10 Lakhs', commission: '₹500-₹1,500' },
    { value: '10-25', label: '₹10-25 Lakhs', commission: '₹1,000-₹2,500' },
    { value: '25-50', label: '₹25-50 Lakhs', commission: '₹1,500-₹3,500' },
    { value: '50-100', label: '₹50 Lakhs - ₹1 Crore', commission: '₹2,500-₹5,000' },
    { value: '100-200', label: '₹1-2 Crores', commission: '₹3,500-₹7,500' },
    { value: 'above-200', label: 'Above ₹2 Crores', commission: '₹5,000-₹15,000' }
  ]

  const timelines = [
    { value: 'immediate', label: 'Immediate (Within 1 month)', urgency: 'urgent' },
    { value: '1-3months', label: '1-3 months', urgency: 'high' },
    { value: '3-6months', label: '3-6 months', urgency: 'medium' },
    { value: '6-12months', label: '6-12 months', urgency: 'low' },
    { value: 'flexible', label: 'Flexible timeline', urgency: 'low' }
  ]

  const leadSources = [
    'WhatsApp Contact',
    'Facebook Friend',
    'Instagram Follower',
    'Family Member',
    'Colleague',
    'Neighbor',
    'Community Group',
    'Social Media Post',
    'Direct Approach',
    'Referral from Another Client'
  ]

  const validateStep = (step: number) => {
    const errors: string[] = []
    
    if (step === 1) {
      if (!formData.type) errors.push('Please select customer type')
      if (!formData.name.trim()) errors.push('Customer name is required')
      if (!formData.phone || formData.phone.length !== 10) errors.push('Valid 10-digit phone number is required')
      if (!formData.city.trim()) errors.push('City is required')
    }
    
    if (step === 2) {
      if (!formData.propertyType) errors.push('Property type is required')
      if (!formData.budget) errors.push('Budget range is required')
      if (!formData.timeline) errors.push('Timeline is required')
    }
    
    setValidationErrors(errors)
    return errors.length === 0
  }

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    setCurrentStep(currentStep - 1)
    setValidationErrors([])
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateStep(2)) return

    setIsSubmitting(true)

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2500))

    // Generate lead ID
    const leadId = 'REF' + Date.now()
    setGeneratedLeadId(leadId)
    
    setIsSubmitting(false)
    setShowSuccess(true)
    toast.success('Referral submitted successfully!')

    // Reset form after 5 seconds
    setTimeout(() => {
      setShowSuccess(false)
      setCurrentStep(1)
      setFormData({
        type: '',
        name: '',
        phone: '',
        email: '',
        city: '',
        area: '',
        propertyType: '',
        budget: '',
        timeline: '',
        requirements: '',
        source: '',
        notes: '',
        urgency: 'medium'
      })
      setValidationErrors([])
    }, 5000)
  }

  const getCommissionRange = () => {
    const budget = budgetRanges.find(b => b.value === formData.budget)
    const multiplier = formData.type === 'seller' ? 1.5 : 1
    return budget ? budget.commission : '₹500-₹5,000'
  }

  const shareOnWhatsApp = () => {
    const message = `🏠 Hi! I'm ${formData.name} and I'm looking to ${formData.type === 'buyer' ? 'buy' : 'sell'} a ${formData.propertyType} in ${formData.city}.\n\nBudget: ${budgetRanges.find(b => b.value === formData.budget)?.label}\nTimeline: ${timelines.find(t => t.value === formData.timeline)?.label}\n\nPlease help me connect with GharBazaar for the best deals!\n\n📞 ${formData.phone}`
    
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
  }

  if (showSuccess) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-950 rounded-3xl shadow-2xl p-8 border border-gray-200 dark:border-gray-800 text-center">
          <div className="w-24 h-24 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-white" />
          </div>
          
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Referral Submitted Successfully! 🎉
          </h2>
          
          <p className="text-gray-600 dark:text-gray-400 text-xl mb-8">
            Your referral has been submitted. Our team will contact the customer within 24 hours.
          </p>

          <div className="bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-900/20 dark:to-green-900/20 rounded-2xl p-8 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Target className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-bold text-gray-900 dark:text-white mb-2">Lead ID</h3>
                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{generatedLeadId}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Track your referral</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <IndianRupee className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-bold text-gray-900 dark:text-white mb-2">Potential Earning</h3>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">{getCommissionRange()}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">On successful closure</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-bold text-gray-900 dark:text-white mb-2">Next Step</h3>
                <p className="text-lg font-bold text-purple-600 dark:text-purple-400">24 Hours</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Customer contact</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-6">
              <div className="flex items-center space-x-3 mb-3">
                <Phone className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                <h4 className="font-semibold text-blue-900 dark:text-blue-100">Step 1</h4>
              </div>
              <p className="text-blue-800 dark:text-blue-200 text-sm">Our team calls the customer within 24 hours</p>
            </div>
            
            <div className="bg-green-50 dark:bg-green-900/20 rounded-2xl p-6">
              <div className="flex items-center space-x-3 mb-3">
                <Users className="w-6 h-6 text-green-600 dark:text-green-400" />
                <h4 className="font-semibold text-green-900 dark:text-green-100">Step 2</h4>
              </div>
              <p className="text-green-800 dark:text-green-200 text-sm">Customer gets matched with verified properties</p>
            </div>
            
            <div className="bg-purple-50 dark:bg-purple-900/20 rounded-2xl p-6">
              <div className="flex items-center space-x-3 mb-3">
                <Gift className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                <h4 className="font-semibold text-purple-900 dark:text-purple-100">Step 3</h4>
              </div>
              <p className="text-purple-800 dark:text-purple-200 text-sm">You get paid when deal closes successfully</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => setShowSuccess(false)}
              className="flex-1 bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white font-semibold py-4 px-8 rounded-2xl transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg"
            >
              <Plus size={20} />
              <span>Submit Another Referral</span>
            </button>
            
            <button
              onClick={shareOnWhatsApp}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-4 px-8 rounded-2xl transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg"
            >
              <MessageSquare size={20} />
              <span>Share on WhatsApp</span>
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Submit New Referral
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-xl max-w-3xl mx-auto">
          Help someone find their dream property and earn attractive commissions. Fill in the details below to get started.
        </p>
      </div>

      {/* Progress Indicator */}
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className={`flex items-center space-x-3 ${currentStep >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${currentStep >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
              {currentStep > 1 ? <CheckCircle size={20} /> : '1'}
            </div>
            <span className="font-medium">Customer Details</span>
          </div>
          
          <div className={`w-24 h-1 ${currentStep >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
          
          <div className={`flex items-center space-x-3 ${currentStep >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${currentStep >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
              {currentStep > 2 ? <CheckCircle size={20} /> : '2'}
            </div>
            <span className="font-medium">Property Requirements</span>
          </div>
          
          <div className={`w-24 h-1 ${currentStep >= 3 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
          
          <div className={`flex items-center space-x-3 ${currentStep >= 3 ? 'text-blue-600' : 'text-gray-400'}`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${currentStep >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
              3
            </div>
            <span className="font-medium">Review & Submit</span>
          </div>
        </div>
      </div>

      {/* Commission Info Banner */}
      <div className="bg-gradient-to-r from-green-50 via-blue-50 to-purple-50 dark:from-green-900/20 dark:via-blue-900/20 dark:to-purple-900/20 rounded-3xl p-8 border border-green-200 dark:border-green-800">
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Earn Up to ₹15,000 Per Referral! 💰
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Higher property values = Higher commissions. Premium properties can earn you even more!
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 text-center shadow-sm">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Home className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <h4 className="font-bold text-gray-900 dark:text-white mb-2">Buyer Referrals</h4>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400 mb-1">₹1,000-₹7,500</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Based on property value</p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 text-center shadow-sm">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <DollarSign className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h4 className="font-bold text-gray-900 dark:text-white mb-2">Seller Referrals</h4>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-1">₹2,000-₹15,000</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Higher commission rates</p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 text-center shadow-sm">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Zap className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <h4 className="font-bold text-gray-900 dark:text-white mb-2">Quick Payouts</h4>
            <p className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-1">24-48 Hours</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">After deal closure</p>
          </div>
        </div>
      </div>

      {/* Validation Errors */}
      {validationErrors.length > 0 && (
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-4">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5" />
              <div>
                <h4 className="font-semibold text-red-900 dark:text-red-100 mb-2">Please fix the following errors:</h4>
                <ul className="text-red-800 dark:text-red-200 text-sm space-y-1">
                  {validationErrors.map((error, index) => (
                    <li key={index}>• {error}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-950 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
          <form onSubmit={handleSubmit}>
            
            {/* Step 1: Customer Details */}
            {currentStep === 1 && (
              <div className="p-8">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <User className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Customer Information
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Tell us about your customer and their contact details
                  </p>
                </div>

                <div className="space-y-8">
                  {/* Customer Type */}
                  <div>
                    <label className="block text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4">
                      What is the customer looking for? *
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, type: 'buyer' }))}
                        className={`
                          p-8 rounded-3xl border-2 transition-all duration-300 text-center group
                          ${formData.type === 'buyer'
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-xl scale-105'
                            : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-lg'
                          }
                        `}
                      >
                        <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                          <Home className="w-10 h-10 text-white" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Property Buyer</h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-4">Looking to purchase a property</p>
                        <div className="bg-green-100 dark:bg-green-900/20 rounded-2xl p-3">
                          <p className="text-green-700 dark:text-green-300 font-bold">₹1,000-₹7,500 Commission</p>
                        </div>
                        {formData.type === 'buyer' && (
                          <div className="mt-4">
                            <CheckCircle className="w-8 h-8 text-blue-500 mx-auto" />
                          </div>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, type: 'seller' }))}
                        className={`
                          p-8 rounded-3xl border-2 transition-all duration-300 text-center group
                          ${formData.type === 'seller'
                            ? 'border-green-500 bg-green-50 dark:bg-green-900/20 shadow-xl scale-105'
                            : 'border-gray-200 dark:border-gray-700 hover:border-green-300 dark:hover:border-green-600 hover:shadow-lg'
                          }
                        `}
                      >
                        <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                          <DollarSign className="w-10 h-10 text-white" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Property Seller</h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-4">Looking to sell their property</p>
                        <div className="bg-green-100 dark:bg-green-900/20 rounded-2xl p-3">
                          <p className="text-green-700 dark:text-green-300 font-bold">₹2,000-₹15,000 Commission</p>
                        </div>
                        {formData.type === 'seller' && (
                          <div className="mt-4">
                            <CheckCircle className="w-8 h-8 text-green-500 mx-auto" />
                          </div>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Basic Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                        Customer Full Name *
                      </label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="Enter full name"
                          className="w-full pl-12 pr-4 py-4 text-lg border border-gray-300 dark:border-gray-700 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                        Mobile Number *
                      </label>
                      <div className="relative">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">+91</div>
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData(prev => ({ 
                            ...prev, 
                            phone: e.target.value.replace(/\D/g, '').slice(0, 10) 
                          }))}
                          placeholder="9876543210"
                          className="w-full pl-16 pr-4 py-4 text-lg border border-gray-300 dark:border-gray-700 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                        Email Address (Optional)
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                          placeholder="customer@email.com"
                          className="w-full pl-12 pr-4 py-4 text-lg border border-gray-300 dark:border-gray-700 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                        City *
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                          type="text"
                          value={formData.city}
                          onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                          placeholder="Mumbai, Delhi, Bangalore..."
                          className="w-full pl-12 pr-4 py-4 text-lg border border-gray-300 dark:border-gray-700 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                      Preferred Area/Locality (Optional)
                    </label>
                    <div className="relative">
                      <Building className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                      <input
                        type="text"
                        value={formData.area}
                        onChange={(e) => setFormData(prev => ({ ...prev, area: e.target.value }))}
                        placeholder="Bandra, Koramangala, CP..."
                        className="w-full pl-12 pr-4 py-4 text-lg border border-gray-300 dark:border-gray-700 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                      How do you know this customer?
                    </label>
                    <select
                      value={formData.source}
                      onChange={(e) => setFormData(prev => ({ ...prev, source: e.target.value }))}
                      className="w-full px-4 py-4 text-lg border border-gray-300 dark:border-gray-700 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    >
                      <option value="">Select relationship</option>
                      {leadSources.map((source) => (
                        <option key={source} value={source}>{source}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Property Requirements */}
            {currentStep === 2 && (
              <div className="p-8">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Home className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Property Requirements
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Help us understand what the customer is looking for
                  </p>
                </div>

                <div className="space-y-8">
                  {/* Property Type */}
                  <div>
                    <label className="block text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4">
                      Property Type *
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                      {propertyTypes.map((type) => (
                        <button
                          key={type.value}
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, propertyType: type.value }))}
                          className={`
                            p-4 rounded-2xl border-2 transition-all duration-300 text-center
                            ${formData.propertyType === type.value
                              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-lg'
                              : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-md'
                            }
                          `}
                        >
                          <div className="text-2xl mb-2">{type.icon}</div>
                          <p className="font-medium text-gray-900 dark:text-white text-sm">{type.label}</p>
                          {formData.propertyType === type.value && (
                            <CheckCircle className="w-5 h-5 text-blue-500 mx-auto mt-2" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Budget Range */}
                  <div>
                    <label className="block text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4">
                      Budget Range *
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {budgetRanges.map((budget) => (
                        <button
                          key={budget.value}
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, budget: budget.value }))}
                          className={`
                            p-6 rounded-2xl border-2 transition-all duration-300 text-left
                            ${formData.budget === budget.value
                              ? 'border-green-500 bg-green-50 dark:bg-green-900/20 shadow-lg'
                              : 'border-gray-200 dark:border-gray-700 hover:border-green-300 dark:hover:border-green-600 hover:shadow-md'
                            }
                          `}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-bold text-gray-900 dark:text-white">{budget.label}</h4>
                            {formData.budget === budget.value && (
                              <CheckCircle className="w-5 h-5 text-green-500" />
                            )}
                          </div>
                          <p className="text-sm text-green-600 dark:text-green-400 font-medium">
                            Commission: {budget.commission}
                          </p>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Timeline */}
                  <div>
                    <label className="block text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4">
                      Purchase/Sale Timeline *
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {timelines.map((timeline) => (
                        <button
                          key={timeline.value}
                          type="button"
                          onClick={() => setFormData(prev => ({ 
                            ...prev, 
                            timeline: timeline.value,
                            urgency: timeline.urgency as any
                          }))}
                          className={`
                            p-6 rounded-2xl border-2 transition-all duration-300 text-left
                            ${formData.timeline === timeline.value
                              ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20 shadow-lg'
                              : 'border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600 hover:shadow-md'
                            }
                          `}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-bold text-gray-900 dark:text-white mb-1">{timeline.label}</h4>
                              <span className={`
                                px-2 py-1 rounded-full text-xs font-medium
                                ${timeline.urgency === 'urgent' ? 'bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400' :
                                  timeline.urgency === 'high' ? 'bg-orange-100 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400' :
                                  timeline.urgency === 'medium' ? 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400' :
                                  'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400'
                                }
                              `}>
                                {timeline.urgency} priority
                              </span>
                            </div>
                            {formData.timeline === timeline.value && (
                              <CheckCircle className="w-5 h-5 text-purple-500" />
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Additional Requirements */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                      Specific Requirements (Optional)
                    </label>
                    <textarea
                      rows={4}
                      value={formData.requirements}
                      onChange={(e) => setFormData(prev => ({ ...prev, requirements: e.target.value }))}
                      placeholder="Any specific requirements like parking, floor preference, amenities, etc."
                      className="w-full px-4 py-4 text-lg border border-gray-300 dark:border-gray-700 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    />
                  </div>

                  {/* Additional Notes */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                      Additional Notes (Optional)
                    </label>
                    <textarea
                      rows={3}
                      value={formData.notes}
                      onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                      placeholder="Any other important information about the customer or their preferences..."
                      className="w-full px-4 py-4 text-lg border border-gray-300 dark:border-gray-700 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Review & Submit */}
            {currentStep === 3 && (
              <div className="p-8">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Review & Submit
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Please review all information before submitting the referral
                  </p>
                </div>

                <div className="space-y-6">
                  {/* Customer Summary */}
                  <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-6">
                    <h4 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
                      <User size={20} />
                      <span>Customer Information</span>
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Name</p>
                        <p className="font-semibold text-gray-900 dark:text-white">{formData.name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Phone</p>
                        <p className="font-semibold text-gray-900 dark:text-white">+91 {formData.phone}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Type</p>
                        <p className="font-semibold text-gray-900 dark:text-white capitalize">{formData.type}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Location</p>
                        <p className="font-semibold text-gray-900 dark:text-white">{formData.city}{formData.area && `, ${formData.area}`}</p>
                      </div>
                    </div>
                  </div>

                  {/* Property Summary */}
                  <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-6">
                    <h4 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
                      <Home size={20} />
                      <span>Property Requirements</span>
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Property Type</p>
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {propertyTypes.find(p => p.value === formData.propertyType)?.label}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Budget</p>
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {budgetRanges.find(b => b.value === formData.budget)?.label}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Timeline</p>
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {timelines.find(t => t.value === formData.timeline)?.label}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Expected Commission</p>
                        <p className="font-semibold text-green-600 dark:text-green-400">{getCommissionRange()}</p>
                      </div>
                    </div>
                  </div>

                  {/* Important Notice */}
                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-6 border border-blue-200 dark:border-blue-800">
                    <div className="flex items-start space-x-3">
                      <Info className="w-6 h-6 text-blue-600 dark:text-blue-400 mt-1" />
                      <div>
                        <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                          Important Information
                        </h4>
                        <ul className="text-blue-800 dark:text-blue-200 text-sm space-y-1">
                          <li>• Our team will contact the customer within 24 hours</li>
                          <li>• Commission will be paid only after successful deal closure</li>
                          <li>• Duplicate or fake leads may result in account suspension</li>
                          <li>• Customer consent is required for all communications</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="px-8 py-6 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
              <div className="flex justify-between items-center">
                {currentStep > 1 ? (
                  <button
                    type="button"
                    onClick={handlePrevious}
                    className="flex items-center space-x-2 px-6 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-2xl transition-all"
                  >
                    <ArrowRight size={20} className="rotate-180" />
                    <span>Previous</span>
                  </button>
                ) : (
                  <div></div>
                )}

                {currentStep < 3 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white font-semibold rounded-2xl transition-all duration-300 shadow-lg"
                  >
                    <span>Next Step</span>
                    <ArrowRight size={20} />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold rounded-2xl transition-all duration-300 shadow-lg"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Submitting...</span>
                      </>
                    ) : (
                      <>
                        <Send size={20} />
                        <span>Submit Referral</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Tips Section */}
      <div className="max-w-4xl mx-auto">
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-3xl p-8 border border-yellow-200 dark:border-yellow-800">
          <div className="text-center mb-6">
            <Award className="w-12 h-12 text-yellow-600 dark:text-yellow-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Pro Tips for Better Referrals
            </h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900 dark:text-white">Quality Tips:</h4>
              <ul className="text-gray-700 dark:text-gray-300 space-y-2">
                <li className="flex items-start space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                  <span>Ensure customer is genuinely interested</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                  <span>Provide accurate contact information</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                  <span>Include specific requirements and preferences</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                  <span>Mention realistic budget and timeline</span>
                </li>
              </ul>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900 dark:text-white">Higher Earnings:</h4>
              <ul className="text-gray-700 dark:text-gray-300 space-y-2">
                <li className="flex items-start space-x-2">
                  <TrendingUp className="w-5 h-5 text-blue-500 mt-0.5" />
                  <span>Focus on premium property segments</span>
                </li>
                <li className="flex items-start space-x-2">
                  <TrendingUp className="w-5 h-5 text-blue-500 mt-0.5" />
                  <span>Seller referrals earn higher commissions</span>
                </li>
                <li className="flex items-start space-x-2">
                  <TrendingUp className="w-5 h-5 text-blue-500 mt-0.5" />
                  <span>Urgent timelines get priority processing</span>
                </li>
                <li className="flex items-start space-x-2">
                  <TrendingUp className="w-5 h-5 text-blue-500 mt-0.5" />
                  <span>Multiple referrals unlock bonus rewards</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}