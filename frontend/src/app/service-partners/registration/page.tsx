'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  User, 
  Phone, 
  MapPin, 
  Briefcase, 
  Building, 
  ArrowRight,
  ArrowLeft, 
  CheckCircle,
  ShieldCheck,
  Scale,
  Building2,
  Palette,
  Hammer,
  Camera,
  Lightbulb,
  Wrench,
  Plus,
  PenTool
} from 'lucide-react'
import toast from 'react-hot-toast'
import { backendApi } from '@/lib/backendApi'

export default function PartnerRegistrationPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    serviceType: '',
    otherServiceType: '',
    experience: '',
    city: '',
    address: '',
    state: '',
    pincode: '',
    description: ''
  })

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (!userData) {
      router.push('/service-partners/login')
      return
    }
    const parsedUser = JSON.parse(userData)
    setUser(parsedUser)
    
    // Check if user already completed onboarding
    if (parsedUser.onboardingCompleted) {
      toast.success('Welcome back! Redirecting to dashboard...')
      router.push('/service-partners')
      return
    }
    
    // Pre-fill name from Google
    if (parsedUser.name || parsedUser.displayName) {
      setFormData(prev => ({ 
        ...prev, 
        name: parsedUser.name || parsedUser.displayName || '' 
      }))
    }
  }, [router])

  const serviceCategories = [
    { id: 'lawyer', name: 'Lawyer', icon: Scale },
    { id: 'architect', name: 'Architect', icon: Building2 },
    { id: 'designer', name: 'Interior Designer', icon: Palette },
    { id: 'contractor', name: 'Contractor', icon: Hammer },
    { id: 'photographer', name: 'Photographer', icon: Camera },
    { id: 'consultant', name: 'Consultant', icon: Lightbulb },
    { id: 'plumber', name: 'Plumber', icon: Wrench },
    { id: 'electrician', name: 'Electrician', icon: Lightbulb },
    { id: 'other', name: 'Other', icon: Plus }
  ]

  const handleBack = () => {
    // Optionally clear user data to allow re-authentication
    localStorage.removeItem('user')
    router.push('/service-partners/login')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Create service provider profile
      await backendApi.serviceProvider.create({
        ...formData,
        userId: user?.uid,
        // Map frontend fields to backend schema if necessary
        category: formData.serviceType === 'other' ? 'Other' : formData.serviceType,
        specialization: formData.serviceType === 'other' ? formData.otherServiceType : formData.serviceType,
        location: `${formData.city}, ${formData.state}`,
        availability: true,
        verified: false, // Default
        experience: parseInt(formData.experience) || 0,
        rating: 0,
        reviews: 0,
        completedProjects: 0,
        hourlyRate: 0 // Default or add field
      })

      // Refresh user profile to get updated onboarding status
      const profileResponse = await backendApi.auth.verifyToken(localStorage.getItem('auth_token') || '')
      
      if (profileResponse.success && profileResponse.data?.user) {
        localStorage.setItem('user', JSON.stringify(profileResponse.data.user))
      }

      toast.success('Registration complete!')

      // Redirect based on service type
      if (formData.serviceType === 'lawyer') {
        router.push('/legal-partner')
      } else {
        router.push('/service-partners')
      }
    } catch (error: any) {
      console.error('Registration error:', error)
      toast.error(error.message || 'Registration failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-900 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-100 dark:border-gray-700 relative">
          {/* Back Button */}
          <button
            type="button"
            onClick={handleBack}
            className="absolute top-6 left-6 flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors group"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-medium">Back to Login</span>
          </button>

          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <ShieldCheck className="text-white" size={32} />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Complete Your Profile</h1>
            <p className="text-gray-600 dark:text-gray-400">Please provide your professional details to access the dashboard</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all"
                    placeholder="Enter your name"
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all"
                    placeholder="+91 XXXXX XXXXX"
                  />
                </div>
              </div>

              {/* Service Type */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">Type of Service</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {serviceCategories.map((category) => (
                    <button
                      key={category.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, serviceType: category.id })}
                      className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${
                        formData.serviceType === category.id
                          ? 'bg-blue-600 border-blue-600 text-white shadow-md scale-105'
                          : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:border-blue-400'
                      }`}
                    >
                      <category.icon size={24} />
                      <span className="text-xs font-bold">{category.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Other Service Type Input */}
              {formData.serviceType === 'other' && (
                <div className="md:col-span-2 animate-in fade-in slide-in-from-top-2 duration-300">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Specify Your Role</label>
                  <div className="relative">
                    <PenTool className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="text"
                      required
                      value={formData.otherServiceType}
                      onChange={(e) => setFormData({ ...formData, otherServiceType: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 bg-blue-50/50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-900/30 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all text-gray-900 dark:text-white"
                      placeholder="e.g. Plumber, Interior Designer, etc."
                    />
                  </div>
                </div>
              )}

              {/* Experience */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Years of Experience</label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <select
                    required
                    value={formData.experience}
                    onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all appearance-none"
                  >
                    <option value="">Select Experience</option>
                    <option value="0-2">0-2 years</option>
                    <option value="3-5">3-5 years</option>
                    <option value="6-10">6-10 years</option>
                    <option value="10+">10+ years</option>
                  </select>
                </div>
              </div>

              {/* Address */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Full Address</label>
                <div className="relative">
                  <Building className="absolute left-3 top-3 text-gray-400" size={18} />
                  <textarea
                    required
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all min-h-[100px]"
                    placeholder="Enter your full business or residence address"
                  />
                </div>
              </div>

              {/* City */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">City</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all"
                    placeholder="e.g. Mumbai"
                  />
                </div>
              </div>

              {/* State */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">State</label>
                <input
                  type="text"
                  required
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all"
                  placeholder="e.g. Maharashtra"
                />
              </div>

              {/* Pincode */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Pincode</label>
                <input
                  type="text"
                  required
                  pattern="[0-9]{6}"
                  value={formData.pincode}
                  onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all"
                  placeholder="6-digit code"
                />
              </div>

              {/* Description/Bio */}
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Professional Bio (Optional)
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all min-h-[100px] resize-none"
                  placeholder="Tell us about your professional experience and expertise..."
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  This will be displayed on your profile
                </p>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || !formData.serviceType}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg hover:shadow-xl disabled:opacity-50 flex items-center justify-center gap-2 mt-8"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Saving Profile...</span>
                </>
              ) : (
                <>
                  <span>Complete Registration</span>
                  <ArrowRight size={20} />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
