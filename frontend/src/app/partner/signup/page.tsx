'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  User,
  Phone,
  Mail,
  MapPin,
  Building,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  Users,
  Shield,
  Award,
  Star,
  TrendingUp,
  IndianRupee,
  Globe,
  Smartphone,
  MessageSquare,
  Zap,
  Crown,
  Gift,
  Sparkles,
  UserCheck,
  Briefcase,
  Home,
  Target
} from 'lucide-react'
import toast from 'react-hot-toast'

interface FormData {
  // Step 1: Basic Info
  fullName: string
  phone: string
  email: string
  password: string
  confirmPassword: string

  // Step 2: Partner Details
  partnerType: 'influencer' | 'csc' | 'community' | 'referrer'
  city: string
  state: string
  experience: string

  // Step 3: Verification
  agreeToTerms: boolean
  agreeToPrivacy: boolean
  agreeToCommission: boolean
}

export default function PartnerSignupPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
    partnerType: 'influencer',
    city: '',
    state: '',
    experience: '',
    agreeToTerms: false,
    agreeToPrivacy: false,
    agreeToCommission: false
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
  }

  const handleGoogleSignup = () => {
    setIsLoading(true)
    // Simulate Google OAuth
    setTimeout(() => {
      const userData = {
        id: 'P003',
        name: 'Amit Singh',
        phone: '+91 87654 32109',
        email: 'amit.singh@gmail.com',
        role: 'partner',
        partnerType: 'influencer',
        status: 'pending',
        joinedDate: new Date().toISOString(),
        referrals: 0,
        earnings: 0,
        city: 'Bangalore',
        state: 'Karnataka'
      }

      localStorage.setItem('user', JSON.stringify(userData))
      localStorage.setItem('token', 'mock-google-signup-token')

      toast.success('Account created successfully with Google!')
      router.push('/partner')
      setIsLoading(false)
    }, 2000)
  }

  const validateStep = (step: number) => {
    switch (step) {
      case 1:
        if (!formData.fullName || !formData.phone || !formData.email || !formData.password || !formData.confirmPassword) {
          toast.error('Please fill all required fields')
          return false
        }
        if (formData.password !== formData.confirmPassword) {
          toast.error('Passwords do not match')
          return false
        }
        if (formData.password.length < 6) {
          toast.error('Password must be at least 6 characters')
          return false
        }
        return true
      case 2:
        if (!formData.partnerType || !formData.city || !formData.state) {
          toast.error('Please fill all required fields')
          return false
        }
        return true
      case 3:
        if (!formData.agreeToTerms || !formData.agreeToPrivacy || !formData.agreeToCommission) {
          toast.error('Please agree to all terms and conditions')
          return false
        }
        return true
      default:
        return true
    }
  }

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1)
    }
  }

  const handlePrevious = () => {
    setCurrentStep(prev => prev - 1)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateStep(3)) return

    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      const userData = {
        id: 'P004',
        name: formData.fullName,
        phone: formData.phone,
        email: formData.email,
        role: 'partner',
        partnerType: formData.partnerType,
        status: 'pending',
        joinedDate: new Date().toISOString(),
        referrals: 0,
        earnings: 0,
        city: formData.city,
        state: formData.state
      }

      localStorage.setItem('user', JSON.stringify(userData))
      localStorage.setItem('token', 'mock-signup-token')

      toast.success('Account created successfully!')
      router.push('/partner')
      setIsLoading(false)
    }, 2000)
  }

  const partnerTypes = [
    {
      id: 'influencer',
      title: 'Social Media Influencer',
      description: 'Content creators with social media following',
      icon: MessageSquare,
      color: 'from-pink-500 to-purple-600'
    },
    {
      id: 'csc',
      title: 'Jan Seva Kendra / CSC',
      description: 'Common Service Center operators',
      icon: Building,
      color: 'from-blue-500 to-indigo-600'
    },
    {
      id: 'community',
      title: 'Community Leader',
      description: 'Local community leaders and organizers',
      icon: Users,
      color: 'from-green-500 to-emerald-600'
    },
    {
      id: 'referrer',
      title: 'Local Referrer',
      description: 'Individual referral partners',
      icon: UserCheck,
      color: 'from-orange-500 to-red-600'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 via-purple-600 to-green-600 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full -translate-x-48 -translate-y-48"></div>
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-white rounded-full translate-x-40 translate-y-40"></div>
          <div className="absolute top-1/2 left-1/4 w-60 h-60 bg-white rounded-full -translate-y-1/2"></div>
        </div>

        <div className="relative z-10 flex flex-col justify-center px-12 text-white">
          {/* Logo */}
          <div className="flex items-center space-x-4 mb-12">
            <div className="relative">
              <img
                src="/logo.jpeg"
                alt="GharBazaar Logo"
                className="h-16 w-16 rounded-3xl shadow-2xl object-cover border-4 border-white/20"
              />
              <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full border-2 border-white flex items-center justify-center">
                <Crown className="w-3 h-3 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-3xl font-bold">GharBazaar</h1>
              <p className="text-blue-100 font-medium">Partner Program</p>
            </div>
          </div>

          {/* Hero Content */}
          <div className="mb-12">
            <h2 className="text-4xl font-bold mb-6 leading-tight">
              Start Your Journey as a Partner
            </h2>
            <p className="text-xl text-blue-100 mb-8 leading-relaxed">
              Join India's fastest-growing property platform and start earning substantial commissions from day one.
            </p>
          </div>

          {/* Benefits */}
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                <Gift className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Zero Investment Required</h3>
                <p className="text-blue-100">Start earning without any upfront costs</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                <Target className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Flexible Working</h3>
                <p className="text-blue-100">Work at your own pace and schedule</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                <Briefcase className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Professional Support</h3>
                <p className="text-blue-100">Complete training and ongoing assistance</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Growth Potential</h3>
                <p className="text-blue-100">Unlimited earning potential with tier upgrades</p>
              </div>
            </div>
          </div>

          {/* Success Stories */}
          <div className="mt-12 bg-white/10 rounded-3xl p-6 backdrop-blur-sm">
            <h3 className="text-lg font-semibold mb-4">Partner Success</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold mb-1">₹50K+</div>
                <div className="text-blue-200 text-sm">Avg Monthly Earnings</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold mb-1">95%</div>
                <div className="text-blue-200 text-sm">Partner Satisfaction</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Signup Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center space-x-3 mb-8">
            <img
              src="/logo.jpeg"
              alt="GharBazaar Logo"
              className="h-12 w-12 rounded-2xl shadow-lg object-cover"
            />
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                GharBazaar
              </h1>
              <p className="text-blue-600 dark:text-blue-400 font-medium text-sm">Partner Program</p>
            </div>
          </div>

          {/* Progress Indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              {[1, 2, 3].map((step) => (
                <div key={step} className="flex items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${step <= currentStep
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                    }`}>
                    {step < currentStep ? <CheckCircle className="w-5 h-5" /> : step}
                  </div>
                  {step < 3 && (
                    <div className={`w-16 h-1 mx-2 ${step < currentStep ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                      }`}></div>
                  )}
                </div>
              ))}
            </div>
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                {currentStep === 1 && 'Create Your Account'}
                {currentStep === 2 && 'Partner Information'}
                {currentStep === 3 && 'Terms & Verification'}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Step {currentStep} of 3
              </p>
            </div>
          </div>

          {/* Google Signup Button - Only on Step 1 */}
          {currentStep === 1 && (
            <>
              <button
                onClick={handleGoogleSignup}
                disabled={isLoading}
                className="w-full flex items-center justify-center space-x-3 px-6 py-4 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-2xl hover:border-blue-300 dark:hover:border-blue-600 transition-all mb-6 group disabled:opacity-50"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                <span className="font-medium text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                  {isLoading ? 'Creating account...' : 'Continue with Google'}
                </span>
              </button>

              {/* Divider */}
              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400">
                    Or create manually
                  </span>
                </div>
              </div>
            </>
          )}

          {/* Form Steps */}
          <form onSubmit={currentStep === 3 ? handleSubmit : (e) => e.preventDefault()}>
            {/* Step 1: Basic Information */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Full Name *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      placeholder="Enter your full name"
                      className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Phone Number *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+91 98765 43210"
                      className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="your.email@example.com"
                      className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Password *
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="Create a strong password"
                      className="w-full pl-4 pr-12 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Confirm Password *
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      placeholder="Confirm your password"
                      className="w-full pl-4 pr-12 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Partner Details */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Partner Type *
                  </label>
                  <div className="grid grid-cols-1 gap-3">
                    {partnerTypes.map((type) => (
                      <label key={type.id} className="cursor-pointer">
                        <input
                          type="radio"
                          name="partnerType"
                          value={type.id}
                          checked={formData.partnerType === type.id}
                          onChange={handleInputChange}
                          className="sr-only"
                        />
                        <div className={`p-4 border-2 rounded-xl transition-all ${formData.partnerType === type.id
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600'
                          }`}>
                          <div className="flex items-center space-x-3">
                            <div className={`w-10 h-10 bg-gradient-to-r ${type.color} rounded-xl flex items-center justify-center`}>
                              <type.icon className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900 dark:text-white">{type.title}</h3>
                              <p className="text-sm text-gray-600 dark:text-gray-400">{type.description}</p>
                            </div>
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      City *
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        placeholder="Your city"
                        className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      State *
                    </label>
                    <select
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      required
                    >
                      <option value="">Select State</option>
                      <option value="Maharashtra">Maharashtra</option>
                      <option value="Delhi">Delhi</option>
                      <option value="Karnataka">Karnataka</option>
                      <option value="Gujarat">Gujarat</option>
                      <option value="Tamil Nadu">Tamil Nadu</option>
                      <option value="Uttar Pradesh">Uttar Pradesh</option>
                      <option value="West Bengal">West Bengal</option>
                      <option value="Rajasthan">Rajasthan</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Experience Level
                  </label>
                  <select
                    name="experience"
                    value={formData.experience}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  >
                    <option value="">Select Experience</option>
                    <option value="beginner">Beginner (0-1 years)</option>
                    <option value="intermediate">Intermediate (1-3 years)</option>
                    <option value="experienced">Experienced (3+ years)</option>
                  </select>
                </div>
              </div>
            )}

            {/* Step 3: Terms & Verification */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    🎉 Almost Done!
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 mb-4">
                    Please review and accept our terms to complete your registration as a GharBazaar partner.
                  </p>
                </div>

                <div className="space-y-4">
                  <label className="flex items-start space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      name="agreeToTerms"
                      checked={formData.agreeToTerms}
                      onChange={handleInputChange}
                      className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      required
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      I agree to the{' '}
                      <Link href="/terms" className="text-blue-600 dark:text-blue-400 hover:underline">
                        Terms of Service
                      </Link>{' '}
                      and understand my role as a referral partner
                    </span>
                  </label>

                  <label className="flex items-start space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      name="agreeToPrivacy"
                      checked={formData.agreeToPrivacy}
                      onChange={handleInputChange}
                      className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      required
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      I agree to the{' '}
                      <Link href="/privacy" className="text-blue-600 dark:text-blue-400 hover:underline">
                        Privacy Policy
                      </Link>{' '}
                      and consent to data processing
                    </span>
                  </label>

                  <label className="flex items-start space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      name="agreeToCommission"
                      checked={formData.agreeToCommission}
                      onChange={handleInputChange}
                      className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      required
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      I understand the commission structure and agree to work as a referral partner only (not as a broker)
                    </span>
                  </label>
                </div>

                <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-xl p-4">
                  <div className="flex items-start space-x-3">
                    <Shield className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-semibold text-yellow-800 dark:text-yellow-200 mb-1">
                        Important Note
                      </h4>
                      <p className="text-sm text-yellow-700 dark:text-yellow-300">
                        As a partner, you will act only as a referral source. You cannot negotiate deals, collect payments, or make legal commitments on behalf of GharBazaar.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex space-x-4 mt-8">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={handlePrevious}
                  className="flex-1 flex items-center justify-center space-x-2 px-6 py-4 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-2xl hover:bg-gray-300 dark:hover:bg-gray-600 transition-all"
                >
                  <ArrowLeft size={20} />
                  <span>Previous</span>
                </button>
              )}

              {currentStep < 3 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="flex-1 flex items-center justify-center space-x-2 px-6 py-4 bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-2xl hover:from-blue-700 hover:to-green-700 transition-all font-semibold"
                >
                  <span>Next</span>
                  <ArrowRight size={20} />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 flex items-center justify-center space-x-2 px-6 py-4 bg-gradient-to-r from-blue-600 to-green-600 text-white rounded-2xl hover:from-blue-700 hover:to-green-700 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <span>Create Account</span>
                      <CheckCircle size={20} />
                    </>
                  )}
                </button>
              )}
            </div>
          </form>

          {/* Login Link */}
          <div className="text-center mt-6">
            <p className="text-gray-600 dark:text-gray-400">
              Already have an account?{' '}
              <Link href="/partner/login" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
