'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  Phone,
  MapPin,
  Scale,
  Shield,
  Gavel,
  FileCheck,
  Users,
  CheckCircle,
  Building,
  Calendar,
  Award,
  ArrowRight,
  Check
} from 'lucide-react'
import toast from 'react-hot-toast'

export default function LegalPartnerSignupPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    // Personal Information
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',

    // Professional Information
    barCouncilId: '',
    barCouncilState: '',
    practiceAreas: [] as string[],
    experience: '',
    currentFirm: '',

    // Location & Preferences
    city: '',
    state: '',
    preferredLanguages: [] as string[],

    // Terms & Verification
    agreeToTerms: false,
    agreeToPrivacy: false,
    verifyEmail: false
  })
  const [isLoading, setIsLoading] = useState(false)
  const [otpSent, setOtpSent] = useState(false)
  const [otpCode, setOtpCode] = useState('')

  const practiceAreaOptions = [
    'Property Law',
    'RERA Compliance',
    'Real Estate Litigation',
    'Documentation & Registration',
    'Due Diligence',
    'Title Verification',
    'Commercial Real Estate',
    'Residential Property',
    'Land Acquisition',
    'Property Disputes',
    'Conveyancing',
    'Mortgage & Loans'
  ]

  const languageOptions = [
    'English',
    'Hindi',
    'Marathi',
    'Gujarati',
    'Tamil',
    'Telugu',
    'Kannada',
    'Bengali',
    'Punjabi',
    'Malayalam'
  ]

  const indianStates = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
    'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
    'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
    'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
    'Delhi', 'Jammu and Kashmir', 'Ladakh'
  ]

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleArrayToggle = (field: 'practiceAreas' | 'preferredLanguages', value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(item => item !== value)
        : [...prev[field], value]
    }))
  }

  const validateStep = (step: number) => {
    switch (step) {
      case 1:
        return formData.fullName && formData.email && formData.phone &&
          formData.password && formData.confirmPassword &&
          formData.password === formData.confirmPassword
      case 2:
        return formData.barCouncilId && formData.barCouncilState &&
          formData.practiceAreas.length > 0 && formData.experience
      case 3:
        return formData.city && formData.state && formData.preferredLanguages.length > 0
      case 4:
        return formData.agreeToTerms && formData.agreeToPrivacy
      default:
        return false
    }
  }

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 4))
    } else {
      toast.error('Please fill in all required fields')
    }
  }

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1))
  }

  const sendOTP = async () => {
    if (!formData.email) {
      toast.error('Please enter your email address')
      return
    }

    setIsLoading(true)
    try {
      // Simulate OTP sending
      await new Promise(resolve => setTimeout(resolve, 1500))
      setOtpSent(true)
      toast.success('OTP sent to your email address')
    } catch (error) {
      toast.error('Failed to send OTP. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!otpSent) {
      await sendOTP()
      return
    }

    if (!otpCode || otpCode.length !== 6) {
      toast.error('Please enter the 6-digit OTP')
      return
    }

    setIsLoading(true)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))

      toast.success('Registration successful! Please wait for verification.')
      router.push('/legal-partner/login?message=registration-success')
    } catch (error) {
      toast.error('Registration failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignup = async () => {
    setIsLoading(true)
    try {
      // Simulate Google OAuth
      await new Promise(resolve => setTimeout(resolve, 2000))
      toast.success('Google signup successful! Please complete your profile.')
      router.push('/legal-partner/registration')
    } catch (error) {
      toast.error('Google signup failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const features = [
    {
      icon: Scale,
      title: 'Legal Due Diligence',
      description: 'Comprehensive property legal verification and compliance checks'
    },
    {
      icon: FileCheck,
      title: 'Document Review',
      description: 'Secure document management with version control and audit trails'
    },
    {
      icon: Shield,
      title: 'Confidential & Secure',
      description: 'Bank-grade security with end-to-end encryption for all legal data'
    }
  ]

  const benefits = [
    'Earn ₹15,000 - ₹75,000 per case',
    'Flexible working hours',
    'Professional growth opportunities',
    'Secure payment processing',
    'Comprehensive legal resources',
    'Dedicated support team'
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex">
      {/* Left Side - Features */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-700 via-indigo-700 to-blue-800 p-12 text-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full"></div>
          <div className="absolute top-1/3 right-20 w-24 h-24 bg-white rounded-full"></div>
          <div className="absolute bottom-20 left-1/3 w-40 h-40 bg-white rounded-full"></div>
        </div>

        <div className="relative z-10 flex flex-col justify-center">
          <div className="mb-8">
            <div className="flex items-center space-x-4 mb-6">
              <img
                src="/images/gharbazaar-logo.jpg"
                alt="GharBazaar Logo"
                className="h-16 w-16 rounded-2xl shadow-lg object-cover"
              />
              <div>
                <h1 className="text-3xl font-bold">GharBazaar</h1>
                <p className="text-blue-200">Legal Partner Portal</p>
              </div>
            </div>
            <h2 className="text-4xl font-bold mb-4">
              Join India's Premier Legal Network
            </h2>
            <p className="text-xl text-blue-100 leading-relaxed mb-6">
              Partner with us to provide expert legal services for real estate transactions across India.
            </p>
          </div>

          <div className="space-y-6 mb-8">
            {features.map((feature, index) => (
              <div key={index} className="flex items-start space-x-4">
                <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl">
                  <feature.icon size={24} className="text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-blue-100">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 p-6">
            <h3 className="text-xl font-semibold mb-4">Partner Benefits</h3>
            <div className="grid grid-cols-1 gap-3">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <CheckCircle size={16} className="text-green-300 flex-shrink-0" />
                  <span className="text-blue-100 text-sm">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Signup Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="max-w-md w-full">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <img
                src="/images/gharbazaar-logo.jpg"
                alt="GharBazaar Logo"
                className="h-16 w-16 rounded-2xl shadow-lg object-cover"
              />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Legal Partner Portal
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Join India's premier legal network
            </p>
          </div>

          <div className="bg-white dark:bg-gray-950 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 p-8">
            <div className="hidden lg:block mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Apply for Partnership
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Create your legal partner account
              </p>
            </div>

            {/* Progress Steps */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                {[1, 2, 3, 4].map((step) => (
                  <div key={step} className="flex items-center">
                    <div className={`
                      w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                      ${step <= currentStep
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                      }
                    `}>
                      {step < currentStep ? <Check size={16} /> : step}
                    </div>
                    {step < 4 && (
                      <div className={`
                        w-12 h-1 mx-2
                        ${step < currentStep ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'}
                      `} />
                    )}
                  </div>
                ))}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400 text-center">
                Step {currentStep} of 4: {
                  currentStep === 1 ? 'Personal Information' :
                    currentStep === 2 ? 'Professional Details' :
                      currentStep === 3 ? 'Location & Preferences' :
                        'Terms & Verification'
                }
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Step 1: Personal Information */}
              {currentStep === 1 && (
                <>
                  {/* Google Signup Button */}
                  <button
                    type="button"
                    onClick={handleGoogleSignup}
                    disabled={isLoading}
                    className="w-full flex items-center justify-center space-x-3 py-3 px-4 bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-300 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed mb-6"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    <span className="font-medium text-gray-700 dark:text-gray-300">
                      Continue with Google
                    </span>
                  </button>

                  {/* Divider */}
                  <div className="relative mb-6">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-4 bg-white dark:bg-gray-950 text-gray-500 dark:text-gray-400">
                        Or continue with email
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Full Name *
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                      <input
                        type="text"
                        required
                        value={formData.fullName}
                        onChange={(e) => handleInputChange('fullName', e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="Enter your full name"
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
                        required
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="Enter your email address"
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
                        required
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="+91 98765 43210"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Password *
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={formData.password}
                        onChange={(e) => handleInputChange('password', e.target.value)}
                        className="w-full pl-10 pr-12 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="Create a strong password"
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
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        required
                        value={formData.confirmPassword}
                        onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                        className="w-full pl-10 pr-12 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="Confirm your password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      >
                        {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                    {formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword && (
                      <p className="text-red-500 text-sm mt-1">Passwords do not match</p>
                    )}
                  </div>
                </>
              )}

              {/* Step 2: Professional Information */}
              {currentStep === 2 && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Bar Council Registration ID *
                    </label>
                    <div className="relative">
                      <Award className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                      <input
                        type="text"
                        required
                        value={formData.barCouncilId}
                        onChange={(e) => handleInputChange('barCouncilId', e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="e.g., MH/2015/123456"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Bar Council State *
                    </label>
                    <select
                      required
                      value={formData.barCouncilState}
                      onChange={(e) => handleInputChange('barCouncilState', e.target.value)}
                      className="w-full py-3 px-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    >
                      <option value="">Select Bar Council State</option>
                      {indianStates.map(state => (
                        <option key={state} value={state}>{state}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Years of Experience *
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                      <select
                        required
                        value={formData.experience}
                        onChange={(e) => handleInputChange('experience', e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      >
                        <option value="">Select Experience</option>
                        <option value="0-2">0-2 years</option>
                        <option value="3-5">3-5 years</option>
                        <option value="6-10">6-10 years</option>
                        <option value="11-15">11-15 years</option>
                        <option value="16-20">16-20 years</option>
                        <option value="20+">20+ years</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Current Law Firm/Practice
                    </label>
                    <div className="relative">
                      <Building className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                      <input
                        type="text"
                        value={formData.currentFirm}
                        onChange={(e) => handleInputChange('currentFirm', e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="Enter your current firm name"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      Practice Areas * (Select at least one)
                    </label>
                    <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
                      {practiceAreaOptions.map(area => (
                        <label key={area} className="flex items-center space-x-2 p-2 hover:bg-gray-50 dark:hover:bg-gray-900 rounded-lg cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.practiceAreas.includes(area)}
                            onChange={() => handleArrayToggle('practiceAreas', area)}
                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-700 dark:text-gray-300">{area}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* Step 3: Location & Preferences */}
              {currentStep === 3 && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        City *
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                          type="text"
                          required
                          value={formData.city}
                          onChange={(e) => handleInputChange('city', e.target.value)}
                          className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          placeholder="Enter your city"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        State *
                      </label>
                      <select
                        required
                        value={formData.state}
                        onChange={(e) => handleInputChange('state', e.target.value)}
                        className="w-full py-3 px-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      >
                        <option value="">Select State</option>
                        {indianStates.map(state => (
                          <option key={state} value={state}>{state}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      Preferred Languages * (Select at least one)
                    </label>
                    <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
                      {languageOptions.map(language => (
                        <label key={language} className="flex items-center space-x-2 p-2 hover:bg-gray-50 dark:hover:bg-gray-900 rounded-lg cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.preferredLanguages.includes(language)}
                            onChange={() => handleArrayToggle('preferredLanguages', language)}
                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-700 dark:text-gray-300">{language}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* Step 4: Terms & Verification */}
              {currentStep === 4 && (
                <>
                  <div className="space-y-4">
                    <label className="flex items-start space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.agreeToTerms}
                        onChange={(e) => handleInputChange('agreeToTerms', e.target.checked)}
                        className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 mt-0.5"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        I agree to the{' '}
                        <Link href="/terms" className="text-blue-600 hover:text-blue-700 font-medium">
                          Terms of Service
                        </Link>{' '}
                        and{' '}
                        <Link href="/partner-agreement" className="text-blue-600 hover:text-blue-700 font-medium">
                          Partner Agreement
                        </Link>
                      </span>
                    </label>

                    <label className="flex items-start space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.agreeToPrivacy}
                        onChange={(e) => handleInputChange('agreeToPrivacy', e.target.checked)}
                        className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 mt-0.5"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        I agree to the{' '}
                        <Link href="/privacy" className="text-blue-600 hover:text-blue-700 font-medium">
                          Privacy Policy
                        </Link>{' '}
                        and consent to data processing
                      </span>
                    </label>
                  </div>

                  {otpSent && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Email Verification Code *
                      </label>
                      <input
                        type="text"
                        required
                        value={otpCode}
                        onChange={(e) => setOtpCode(e.target.value)}
                        className="w-full py-3 px-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-center text-lg tracking-widest font-mono"
                        placeholder="000000"
                        maxLength={6}
                      />
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                        Enter the 6-digit code sent to {formData.email}
                      </p>
                    </div>
                  )}

                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
                    <div className="flex items-start space-x-3">
                      <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-blue-800 dark:text-blue-200">Verification Process</h4>
                        <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">
                          After registration, our team will verify your credentials within 24-48 hours.
                          You'll receive an email confirmation once approved.
                        </p>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Navigation Buttons */}
              <div className="flex items-center justify-between pt-6">
                {currentStep > 1 && (
                  <button
                    type="button"
                    onClick={prevStep}
                    className="px-6 py-3 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-xl transition-all"
                  >
                    Previous
                  </button>
                )}

                {currentStep < 4 ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="ml-auto flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    <span>Next</span>
                    <ArrowRight size={20} />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isLoading || !validateStep(4)}
                    className="ml-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <div className="flex items-center">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        {otpSent ? 'Verifying...' : 'Sending OTP...'}
                      </div>
                    ) : (
                      otpSent ? 'Complete Registration' : 'Send Verification Code'
                    )}
                  </button>
                )}
              </div>
            </form>

            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-800">
              <p className="text-center text-sm text-gray-600 dark:text-gray-400">
                Already have an account?{' '}
                <Link href="/legal-partner/login" className="text-blue-600 hover:text-blue-700 font-medium">
                  Sign in here
                </Link>
              </p>
            </div>
          </div>

          {/* Footer Links */}
          <div className="mt-8 text-center space-y-2">
            <div className="flex items-center justify-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
              <Link href="/ground-partner" className="hover:text-blue-600 transition-colors">
                Ground Partner
              </Link>
              <span>•</span>
              <Link href="/promoter-partner" className="hover:text-blue-600 transition-colors">
                Promoter Partner
              </Link>
              <span>•</span>
              <Link href="/" className="hover:text-blue-600 transition-colors">
                Home
              </Link>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Join 500+ verified legal partners across India
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
