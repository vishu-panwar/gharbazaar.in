'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  User,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Upload,
  Camera,
  FileText,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  AlertCircle
} from 'lucide-react'
import toast from 'react-hot-toast'

export default function GroundPartnerRegistrationPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [signupData, setSignupData] = useState<any>(null)

  const [formData, setFormData] = useState({
    // Personal Details
    name: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    address: '',
    city: '',
    state: '',
    pincode: '',

    // Professional Details
    experience: '',
    skills: [] as string[],
    workingAreas: [] as string[],
    vehicleType: '',
    languages: [] as string[],

    // Documents
    aadharNumber: '',
    panNumber: '',
    bankAccount: '',
    ifscCode: '',

    // Verification
    profilePhoto: null as File | null,
    aadharFront: null as File | null,
    aadharBack: null as File | null,
    panCard: null as File | null,
    bankPassbook: null as File | null
  })

  useEffect(() => {
    // Get signup data from localStorage
    const storedSignupData = localStorage.getItem('signupData')
    if (storedSignupData) {
      const parsed = JSON.parse(storedSignupData)
      setSignupData(parsed)
      setFormData(prev => ({
        ...prev,
        name: parsed.name || '',
        email: parsed.email || '',
        phone: parsed.phone || ''
      }))
    } else {
      // Redirect to signup if no data found
      router.push('/ground-partner/signup')
    }
  }, [router])

  const handleFileUpload = (field: string, file: File | null) => {
    setFormData(prev => ({
      ...prev,
      [field]: file
    }))
  }

  const handleArrayField = (field: string, value: string) => {
    setFormData(prev => {
      const current = prev[field as keyof typeof prev]
      if (Array.isArray(current)) {
        return {
          ...prev,
          [field]: current.includes(value)
            ? current.filter(item => item !== value)
            : [...current, value]
        }
      }
      return prev
    })
  }

  const handleSubmit = async () => {
    setIsLoading(true)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Create user data
      const userData = {
        id: '1',
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        role: 'ground-partner',
        city: formData.city,
        zone: 'Western Suburbs',
        verificationStatus: 'pending',
        partnerType: 'Ground Partner',
        registrationComplete: true
      }

      localStorage.setItem('token', 'mock-ground-partner-token')
      localStorage.setItem('user', JSON.stringify(userData))
      localStorage.removeItem('signupData')

      toast.success('Registration completed successfully!')
      router.push('/ground-partner')
    } catch (error) {
      toast.error('Registration failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const skillOptions = [
    'Property Photography', 'Site Measurement', 'Legal Documentation',
    'Client Coordination', 'Market Research', 'Property Inspection'
  ]

  const languageOptions = [
    'Hindi', 'English', 'Marathi', 'Gujarati', 'Tamil', 'Telugu', 'Bengali'
  ]

  const cityOptions = [
    'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata', 'Pune', 'Ahmedabad'
  ]

  if (!signupData) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <img
              src="/images/gharbazaar-logo.jpg"
              alt="GharBazaar Logo"
              className="h-16 w-16 rounded-2xl shadow-lg object-cover"
            />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Complete Your Registration
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Just a few more steps to become a verified ground partner
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`
                  w-10 h-10 rounded-full flex items-center justify-center font-semibold
                  ${step <= currentStep
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                  }
                `}>
                  {step < currentStep ? <CheckCircle size={20} /> : step}
                </div>
                {step < 4 && (
                  <div className={`
                    flex-1 h-1 mx-4
                    ${step < currentStep ? 'bg-blue-500' : 'bg-gray-200 dark:bg-gray-700'}
                  `} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
            <span>Personal Details</span>
            <span>Professional Info</span>
            <span>Documents</span>
            <span>Verification</span>
          </div>
        </div>

        {/* Form Content */}
        <div className="bg-white dark:bg-gray-950 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 p-8">
          {/* Step 1: Personal Details */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <User className="w-12 h-12 text-blue-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Personal Details</h2>
                <p className="text-gray-600 dark:text-gray-400">Tell us about yourself</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full py-3 px-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.dateOfBirth}
                    onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                    className="w-full py-3 px-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Gender
                  </label>
                  <select
                    required
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    className="w-full py-3 px-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full py-3 px-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="+91 98765 43210"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full py-3 px-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Enter your email"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Address
                  </label>
                  <textarea
                    required
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full py-3 px-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Enter your complete address"
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    City
                  </label>
                  <select
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full py-3 px-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  >
                    <option value="">Select City</option>
                    {cityOptions.map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Pincode
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.pincode}
                    onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                    className="w-full py-3 px-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Enter pincode"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Professional Details */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <MapPin className="w-12 h-12 text-blue-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Professional Information</h2>
                <p className="text-gray-600 dark:text-gray-400">Tell us about your work experience</p>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Experience in Real Estate (Years)
                  </label>
                  <select
                    required
                    value={formData.experience}
                    onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                    className="w-full py-3 px-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  >
                    <option value="">Select Experience</option>
                    <option value="0-1">0-1 Years (Fresher)</option>
                    <option value="1-3">1-3 Years</option>
                    <option value="3-5">3-5 Years</option>
                    <option value="5+">5+ Years</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Skills & Services (Select all that apply)
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {skillOptions.map(skill => (
                      <label key={skill} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.skills.includes(skill)}
                          onChange={() => handleArrayField('skills', skill)}
                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300">{skill}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Vehicle Type
                  </label>
                  <select
                    required
                    value={formData.vehicleType}
                    onChange={(e) => setFormData({ ...formData, vehicleType: e.target.value })}
                    className="w-full py-3 px-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  >
                    <option value="">Select Vehicle</option>
                    <option value="bike">Two Wheeler (Bike/Scooter)</option>
                    <option value="car">Four Wheeler (Car)</option>
                    <option value="public">Public Transport</option>
                    <option value="none">No Vehicle</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Languages Known
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {languageOptions.map(language => (
                      <label key={language} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.languages.includes(language)}
                          onChange={() => handleArrayField('languages', language)}
                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300">{language}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Documents */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <FileText className="w-12 h-12 text-blue-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Document Details</h2>
                <p className="text-gray-600 dark:text-gray-400">Provide your document information</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Aadhar Number
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.aadharNumber}
                    onChange={(e) => setFormData({ ...formData, aadharNumber: e.target.value })}
                    className="w-full py-3 px-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Enter 12-digit Aadhar number"
                    maxLength={12}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    PAN Number
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.panNumber}
                    onChange={(e) => setFormData({ ...formData, panNumber: e.target.value.toUpperCase() })}
                    className="w-full py-3 px-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Enter PAN number"
                    maxLength={10}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Bank Account Number
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.bankAccount}
                    onChange={(e) => setFormData({ ...formData, bankAccount: e.target.value })}
                    className="w-full py-3 px-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Enter bank account number"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    IFSC Code
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.ifscCode}
                    onChange={(e) => setFormData({ ...formData, ifscCode: e.target.value.toUpperCase() })}
                    className="w-full py-3 px-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Enter IFSC code"
                    maxLength={11}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Document Upload */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <Upload className="w-12 h-12 text-blue-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Upload Documents</h2>
                <p className="text-gray-600 dark:text-gray-400">Upload clear photos of your documents</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { key: 'profilePhoto', label: 'Profile Photo', icon: Camera },
                  { key: 'aadharFront', label: 'Aadhar Card (Front)', icon: FileText },
                  { key: 'aadharBack', label: 'Aadhar Card (Back)', icon: FileText },
                  { key: 'panCard', label: 'PAN Card', icon: FileText },
                  { key: 'bankPassbook', label: 'Bank Passbook/Cheque', icon: FileText }
                ].map(({ key, label, icon: Icon }) => (
                  <div key={key} className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      {label} {key === 'profilePhoto' ? '' : '*'}
                    </label>
                    <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-6 text-center hover:border-blue-500 transition-colors">
                      <Icon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(key, e.target.files?.[0] || null)}
                        className="hidden"
                        id={key}
                        required={key !== 'profilePhoto'}
                      />
                      <label htmlFor={key} className="cursor-pointer">
                        <span className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                          Click to upload
                        </span>
                        <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 5MB</p>
                      </label>
                      {formData[key as keyof typeof formData] && (
                        <p className="text-xs text-green-600 mt-2">
                          ✓ File uploaded
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                      Document Guidelines
                    </h4>
                    <ul className="text-sm text-yellow-700 dark:text-yellow-300 mt-1 space-y-1">
                      <li>• Ensure all documents are clear and readable</li>
                      <li>• Photos should be well-lit with no shadows</li>
                      <li>• All four corners of documents should be visible</li>
                      <li>• File size should not exceed 5MB per document</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-8 border-t border-gray-200 dark:border-gray-800">
            <button
              onClick={prevStep}
              disabled={currentStep === 1}
              className="flex items-center space-x-2 px-6 py-3 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ArrowLeft size={20} />
              <span>Previous</span>
            </button>

            {currentStep < 4 ? (
              <button
                onClick={nextStep}
                className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <span>Next</span>
                <ArrowRight size={20} />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className="flex items-center space-x-2 px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <span>Complete Registration</span>
                    <CheckCircle size={20} />
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Need help? Contact our support team at{' '}
            <Link href="mailto:Gharbazaarofficial@zohomail.in" className="text-blue-600 hover:text-blue-700 font-medium">
              Gharbazaarofficial@zohomail.in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
