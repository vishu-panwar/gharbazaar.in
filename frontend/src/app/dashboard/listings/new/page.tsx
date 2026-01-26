'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Upload, 
  X, 
  MapPin, 
  Home, 
  Building2, 
  Store, 
  TreePine,
  Warehouse,
  IndianRupee,
  Check,
  Calendar,
  Shield,
  FileText,
  Camera,
  Users,
  Car,
  Wifi,
  Zap,
  Droplets,
  Wind,
  Sun,
  Moon,
  Bed,
  Bath,
  Square,
  ArrowLeft,
  ArrowRight,
  CreditCard,
  Clock,
  Key,
  UserCheck,
  Phone,
  Mail,
  Globe,
  Tag,
  DollarSign,
  Percent,
  Calculator,
  TrendingUp,
  AlertCircle,
  Info,
  CheckCircle2,
  Star,
  Award,
  Target,
  Sparkles,
  Eye
} from 'lucide-react'
import toast from 'react-hot-toast'

export default function NewListingPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [showThankYou, setShowThankYou] = useState(false)
  const [images, setImages] = useState<File[]>([])
  const [documents, setDocuments] = useState<File[]>([])
  const [formData, setFormData] = useState({
    // Basic Details
    listingType: '', // 'sale' or 'rent'
    propertyType: '',
    title: '',
    description: '',
    
    // Pricing
    price: '',
    priceType: 'fixed', // 'fixed', 'negotiable'
    securityDeposit: '', // For rent
    maintenanceCharges: '', // For rent
    leasePeriod: '', // For rent
    
    // Location
    address: '',
    locality: '',
    city: '',
    state: '',
    pincode: '',
    landmark: '',
    
    // Property Details
    squareFeet: '',
    carpetArea: '',
    bedrooms: '',
    bathrooms: '',
    balconies: '',
    floors: '',
    totalFloors: '',
    facing: '',
    furnishing: '', // 'unfurnished', 'semi-furnished', 'fully-furnished'
    parking: '',
    
    // Availability & Legal
    availability: 'immediate',
    ageOfProperty: '',
    ownershipType: '', // 'freehold', 'leasehold', 'cooperative'
    approvedBy: '', // 'rera', 'municipal', 'development-authority'
    
    // Amenities & Features
    amenities: [] as string[],
    nearbyPlaces: [] as string[],
    
    // Contact & Additional
    contactName: '',
    contactPhone: '',
    contactEmail: '',
    alternatePhone: '',
    preferredCallTime: '',
    
    // Additional for Rent
    tenantPreference: '', // 'family', 'bachelor', 'company', 'any'
    rentNegotiable: false,
    
    // Additional for Sale
    pricePerSqft: '',
    expectedPrice: '',
    bookingAmount: '',
    
    // Marketing
    featured: false,
    verified: false,
    virtualTour: false,
    videoTour: false,
  })

  const propertyTypes = [
    { value: 'apartment', label: 'Apartment', icon: Building2, desc: 'Flats, condos, penthouses' },
    { value: 'house', label: 'Independent House', icon: Home, desc: 'Villas, bungalows, row houses' },
    { value: 'plot', label: 'Plot/Land', icon: TreePine, desc: 'Residential & commercial plots' },
    { value: 'commercial', label: 'Commercial', icon: Store, desc: 'Offices, shops, warehouses' },
    { value: 'agricultural', label: 'Agricultural', icon: Warehouse, desc: 'Farm land, agricultural plots' },
  ]

  const amenitiesList = [
    // Basic Amenities
    { name: 'Parking', icon: Car, category: 'basic' },
    { name: 'Lift/Elevator', icon: ArrowRight, category: 'basic' },
    { name: 'Power Backup', icon: Zap, category: 'basic' },
    { name: 'Water Supply', icon: Droplets, category: 'basic' },
    { name: 'Security', icon: Shield, category: 'basic' },
    { name: 'CCTV', icon: Camera, category: 'basic' },
    
    // Luxury Amenities
    { name: 'Swimming Pool', icon: Droplets, category: 'luxury' },
    { name: 'Gym/Fitness Center', icon: Users, category: 'luxury' },
    { name: 'Club House', icon: Home, category: 'luxury' },
    { name: 'Garden/Park', icon: TreePine, category: 'luxury' },
    { name: 'Play Area', icon: Users, category: 'luxury' },
    { name: 'Jogging Track', icon: Users, category: 'luxury' },
    
    // Modern Amenities
    { name: 'WiFi', icon: Wifi, category: 'modern' },
    { name: 'Air Conditioning', icon: Wind, category: 'modern' },
    { name: 'Gas Pipeline', icon: Zap, category: 'modern' },
    { name: 'Intercom', icon: Phone, category: 'modern' },
    { name: 'Fire Safety', icon: Shield, category: 'modern' },
    { name: 'Waste Management', icon: Users, category: 'modern' },
  ]

  const nearbyPlacesList = [
    'Metro Station', 'Bus Stop', 'Railway Station', 'Airport',
    'Hospital', 'School', 'College', 'Shopping Mall',
    'Market', 'Bank', 'ATM', 'Pharmacy',
    'Restaurant', 'Park', 'Temple', 'Gym'
  ]

  const facingOptions = ['North', 'South', 'East', 'West', 'North-East', 'North-West', 'South-East', 'South-West']
  const furnishingOptions = [
    { value: 'unfurnished', label: 'Unfurnished', desc: 'No furniture or appliances' },
    { value: 'semi-furnished', label: 'Semi-Furnished', desc: 'Basic furniture and appliances' },
    { value: 'fully-furnished', label: 'Fully-Furnished', desc: 'Complete furniture and appliances' }
  ]
  const ownershipTypes = [
    { value: 'freehold', label: 'Freehold', desc: 'Complete ownership rights' },
    { value: 'leasehold', label: 'Leasehold', desc: 'Leased from government/authority' },
    { value: 'cooperative', label: 'Cooperative Society', desc: 'Society-based ownership' }
  ]
  const approvalTypes = [
    { value: 'rera', label: 'RERA Approved', desc: 'Real Estate Regulatory Authority' },
    { value: 'municipal', label: 'Municipal Approved', desc: 'Local municipal corporation' },
    { value: 'development-authority', label: 'Development Authority', desc: 'State development authority' }
  ]

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (images.length + files.length > 20) {
      toast.error('Maximum 20 images allowed')
      return
    }
    setImages([...images, ...files])
  }

  const handleDocumentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (documents.length + files.length > 10) {
      toast.error('Maximum 10 documents allowed')
      return
    }
    setDocuments([...documents, ...files])
  }

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index))
  }

  const removeDocument = (index: number) => {
    setDocuments(documents.filter((_, i) => i !== index))
  }

  const toggleAmenity = (amenity: string) => {
    if (formData.amenities.includes(amenity)) {
      setFormData({
        ...formData,
        amenities: formData.amenities.filter(a => a !== amenity)
      })
    } else {
      setFormData({
        ...formData,
        amenities: [...formData.amenities, amenity]
      })
    }
  }

  const toggleNearbyPlace = (place: string) => {
    if (formData.nearbyPlaces.includes(place)) {
      setFormData({
        ...formData,
        nearbyPlaces: formData.nearbyPlaces.filter(p => p !== place)
      })
    } else {
      setFormData({
        ...formData,
        nearbyPlaces: [...formData.nearbyPlaces, place]
      })
    }
  }

  const calculatePricePerSqft = () => {
    if (formData.price && formData.squareFeet) {
      const pricePerSqft = Math.round(parseInt(formData.price) / parseInt(formData.squareFeet))
      setFormData({ ...formData, pricePerSqft: pricePerSqft.toString() })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (step < 6) {
      setStep(step + 1)
      return
    }

    // Validate required fields
    if (!formData.listingType || !formData.propertyType || !formData.title || !formData.price) {
      toast.error('Please fill all required fields')
      return
    }

    if (images.length === 0) {
      toast.error('Please upload at least one image')
      return
    }

    // Show payment processing
    setLoading(true)
    
    // Simulate API call and payment processing
    setTimeout(() => {
      setLoading(false)
      setShowThankYou(true)
      toast.success(`${formData.listingType === 'rent' ? 'Rental' : 'Sale'} listing created successfully!`)
    }, 3000)
  }

  const getStepTitle = (stepNum: number) => {
    switch (stepNum) {
      case 1: return 'Listing Type & Property Details'
      case 2: return 'Location & Property Specifications'
      case 3: return 'Pricing & Availability'
      case 4: return 'Amenities & Additional Details'
      case 5: return 'Images, Documents & Contact'
      case 6: return 'Review & Payment'
      default: return 'Property Details'
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Thank You Page */}
      {showThankYou ? (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-800 -m-6">
          <div className="max-w-4xl mx-auto p-8">
            {/* Success Animation */}
            <div className="text-center mb-8">
              <div className="relative inline-block">
                <div className="w-32 h-32 bg-gradient-to-br from-green-500 via-emerald-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl animate-pulse">
                  <CheckCircle2 className="text-white" size={64} />
                </div>
                <div className="absolute -top-4 -right-4 w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center animate-bounce">
                  <Sparkles className="text-white" size={24} />
                </div>
              </div>
              
              <h1 className="text-4xl lg:text-5xl font-black text-gray-900 dark:text-white mb-4 leading-tight">
                🎉 Thank You for Choosing Us!
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-400 mb-2">
                Your {formData.listingType === 'rent' ? 'rental' : 'sale'} listing has been successfully created
              </p>
              <p className="text-lg text-green-600 font-semibold">
                "{formData.title}" is now live on GharBazaar!
              </p>
            </div>

            {/* Plan Status & Limits */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Current Plan Details */}
              <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-xl border border-gray-200 dark:border-gray-800">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 via-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <Award className="text-white" size={32} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Premium Seller Plan</h3>
                    <p className="text-green-600 font-semibold">Active Subscription</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
                    <div className="flex items-center space-x-3">
                      <Building2 className="text-green-600" size={20} />
                      <span className="font-semibold text-gray-900 dark:text-white">Listings Used</span>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-green-600">25/50</p>
                      <p className="text-xs text-gray-500">25 remaining</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                    <div className="flex items-center space-x-3">
                      <Calendar className="text-blue-600" size={20} />
                      <span className="font-semibold text-gray-900 dark:text-white">Plan Validity</span>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-blue-600">18 Days</p>
                      <p className="text-xs text-gray-500">Until renewal</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
                    <div className="flex items-center space-x-3">
                      <Star className="text-purple-600" size={20} />
                      <span className="font-semibold text-gray-900 dark:text-white">Featured Listings</span>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-purple-600">3/10</p>
                      <p className="text-xs text-gray-500">7 remaining</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-orange-50 dark:bg-orange-900/20 rounded-xl">
                    <div className="flex items-center space-x-3">
                      <Shield className="text-orange-600" size={20} />
                      <span className="font-semibold text-gray-900 dark:text-white">Verified Badges</span>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-orange-600">Unlimited</p>
                      <p className="text-xs text-gray-500">Premium feature</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* What's Next */}
              <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-xl border border-gray-200 dark:border-gray-800">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <TrendingUp className="text-white" size={32} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">What's Next?</h3>
                    <p className="text-gray-600 dark:text-gray-400">Your listing is now live!</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-start space-x-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                    <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center font-bold text-sm">1</div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">Listing is Live</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Your property is now visible to thousands of buyers</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                    <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-sm">2</div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">Expect Inquiries</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">You'll start receiving calls and messages within 24 hours</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                    <div className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center font-bold text-sm">3</div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">Track Performance</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Monitor views, inquiries, and analytics in your dashboard</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                    <div className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold text-sm">4</div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">Close the Deal</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Use our tools to negotiate and finalize the {formData.listingType === 'rent' ? 'rental' : 'sale'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={() => router.push('/dashboard')}
                className="group bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 hover:from-green-700 hover:via-emerald-700 hover:to-teal-700 text-white px-8 py-4 rounded-2xl font-bold transition-all flex items-center space-x-3 shadow-2xl hover:shadow-3xl hover:scale-105"
              >
                <Home size={24} />
                <span>Go to Dashboard</span>
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
              
              <button
                onClick={() => router.push('/dashboard/listings')}
                className="group bg-white dark:bg-gray-800 border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white px-8 py-4 rounded-2xl font-bold transition-all flex items-center space-x-3 shadow-lg hover:shadow-xl hover:scale-105"
              >
                <Building2 size={24} />
                <span>View My Listings</span>
              </button>
            </div>

            {/* Additional Info */}
            <div className="mt-8 text-center">
              <div className="inline-flex items-center space-x-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-6 py-3 rounded-full">
                <Info size={20} />
                <span className="font-semibold">Need help? Contact our support team 24/7</span>
              </div>
            </div>

            {/* Confetti Animation */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
              <div className="absolute top-0 left-1/4 w-2 h-2 bg-yellow-400 rounded-full animate-ping" style={{animationDelay: '0s'}}></div>
              <div className="absolute top-10 right-1/4 w-2 h-2 bg-green-400 rounded-full animate-ping" style={{animationDelay: '0.5s'}}></div>
              <div className="absolute top-20 left-1/3 w-2 h-2 bg-blue-400 rounded-full animate-ping" style={{animationDelay: '1s'}}></div>
              <div className="absolute top-5 right-1/3 w-2 h-2 bg-purple-400 rounded-full animate-ping" style={{animationDelay: '1.5s'}}></div>
              <div className="absolute top-32 left-1/5 w-2 h-2 bg-pink-400 rounded-full animate-ping" style={{animationDelay: '2s'}}></div>
              <div className="absolute top-16 right-1/5 w-2 h-2 bg-indigo-400 rounded-full animate-ping" style={{animationDelay: '2.5s'}}></div>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 text-white rounded-2xl p-8">
        <div className="flex items-center space-x-4 mb-4">
          <div className="w-16 h-16 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center">
            <Building2 className="text-white" size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Add New Property Listing</h1>
            <p className="text-green-100 mt-1">
              Create a detailed listing to attract the right buyers or tenants
            </p>
          </div>
        </div>
        
        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
          <div className="bg-white/10 backdrop-blur-xl rounded-xl p-4">
            <div className="flex items-center space-x-3">
              <Eye className="text-yellow-300" size={20} />
              <div>
                <p className="text-sm text-green-100">Average Views</p>
                <p className="font-bold text-white">2,500+</p>
              </div>
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-xl rounded-xl p-4">
            <div className="flex items-center space-x-3">
              <Users className="text-blue-300" size={20} />
              <div>
                <p className="text-sm text-green-100">Inquiries</p>
                <p className="font-bold text-white">15-25</p>
              </div>
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-xl rounded-xl p-4">
            <div className="flex items-center space-x-3">
              <Clock className="text-purple-300" size={20} />
              <div>
                <p className="text-sm text-green-100">Avg. Sale Time</p>
                <p className="font-bold text-white">45 days</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-800">
        <div className="flex items-center justify-between overflow-x-auto pb-2">
          {[
            { num: 1, label: 'Property Type', icon: Building2 },
            { num: 2, label: 'Location & Details', icon: MapPin },
            { num: 3, label: 'Pricing', icon: DollarSign },
            { num: 4, label: 'Amenities', icon: Star },
            { num: 5, label: 'Media & Contact', icon: Camera },
            { num: 6, label: 'Review & Pay', icon: CreditCard }
          ].map((s, idx) => (
            <div key={s.num} className="flex items-center flex-shrink-0">
              <div className="flex flex-col items-center space-y-2">
                <div className={`
                  w-12 h-12 rounded-full flex items-center justify-center font-bold transition-all
                  ${step >= s.num 
                    ? 'bg-green-600 text-white shadow-lg' 
                    : 'bg-gray-200 dark:bg-gray-800 text-gray-500'
                  }
                `}>
                  {step > s.num ? <Check size={20} /> : <s.icon size={20} />}
                </div>
                <span className={`
                  font-medium text-xs text-center whitespace-nowrap
                  ${step >= s.num ? 'text-gray-900 dark:text-white' : 'text-gray-500'}
                `}>
                  {s.label}
                </span>
              </div>
              {idx < 5 && (
                <div className={`
                  w-16 h-1 mx-4 rounded-full transition-all
                  ${step > s.num ? 'bg-green-600' : 'bg-gray-200 dark:bg-gray-800'}
                `} />
              )}
            </div>
          ))}
        </div>
        
        {/* Current Step Title */}
        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Step {step}: {getStepTitle(step)}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
            {step === 1 && "Choose your listing type and property category"}
            {step === 2 && "Provide location details and property specifications"}
            {step === 3 && "Set pricing and availability information"}
            {step === 4 && "Select amenities and additional features"}
            {step === 5 && "Upload images, documents and contact details"}
            {step === 6 && "Review your listing and complete payment"}
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Step 1: Listing Type & Property Details */}
        {step === 1 && (
          <div className="space-y-6">
            {/* Listing Type Selection */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-800">
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  What type of listing is this?
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Choose whether you want to sell or rent your property
                </p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, listingType: 'sale' })}
                  className={`
                    p-8 rounded-2xl border-2 transition-all text-left group hover:scale-105
                    ${formData.listingType === 'sale'
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-lg'
                      : 'border-gray-200 dark:border-gray-800 hover:border-blue-300'
                    }
                  `}
                >
                  <div className="flex items-center space-x-4 mb-4">
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all ${
                      formData.listingType === 'sale' 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-500 group-hover:bg-blue-100 group-hover:text-blue-500'
                    }`}>
                      <Home size={32} />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-gray-900 dark:text-white">For Sale</h4>
                      <p className="text-gray-600 dark:text-gray-400">Sell your property</p>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center space-x-2">
                      <Check size={16} className="text-green-500" />
                      <span>One-time transaction</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Check size={16} className="text-green-500" />
                      <span>Complete ownership transfer</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Check size={16} className="text-green-500" />
                      <span>Higher listing visibility</span>
                    </div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, listingType: 'rent' })}
                  className={`
                    p-8 rounded-2xl border-2 transition-all text-left group hover:scale-105
                    ${formData.listingType === 'rent'
                      ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20 shadow-lg'
                      : 'border-gray-200 dark:border-gray-800 hover:border-purple-300'
                    }
                  `}
                >
                  <div className="flex items-center space-x-4 mb-4">
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all ${
                      formData.listingType === 'rent' 
                        ? 'bg-purple-500 text-white' 
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-500 group-hover:bg-purple-100 group-hover:text-purple-500'
                    }`}>
                      <Key size={32} />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-gray-900 dark:text-white">For Rent</h4>
                      <p className="text-gray-600 dark:text-gray-400">Rent your property</p>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center space-x-2">
                      <Check size={16} className="text-green-500" />
                      <span>Monthly rental income</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Check size={16} className="text-green-500" />
                      <span>Retain property ownership</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Check size={16} className="text-green-500" />
                      <span>Flexible lease terms</span>
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* Property Type Selection */}
            {formData.listingType && (
              <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-800">
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Property Type
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Select the type of property you want to {formData.listingType === 'rent' ? 'rent out' : 'sell'}
                  </p>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {propertyTypes.map((type) => (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, propertyType: type.value })}
                      className={`
                        p-6 rounded-xl border-2 transition-all text-center group hover:scale-105
                        ${formData.propertyType === type.value
                          ? 'border-green-500 bg-green-50 dark:bg-green-900/20 shadow-lg'
                          : 'border-gray-200 dark:border-gray-800 hover:border-green-300'
                        }
                      `}
                    >
                      <type.icon size={40} className={`mx-auto mb-3 transition-all ${
                        formData.propertyType === type.value 
                          ? 'text-green-600' 
                          : 'text-gray-500 group-hover:text-green-500'
                      }`} />
                      <div className="font-bold text-gray-900 dark:text-white mb-1">{type.label}</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">{type.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Basic Property Info */}
            {formData.propertyType && (
              <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-800">
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Basic Information
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Provide basic details about your property
                  </p>
                </div>
                
                <div className="space-y-6">
                  {/* Title */}
                  <div>
                    <label className="block text-sm font-semibold mb-3 text-gray-700 dark:text-gray-300">
                      Property Title *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder={`e.g., ${formData.propertyType === 'apartment' ? '3 BHK Luxury Apartment in Bandra' : 
                        formData.propertyType === 'house' ? 'Beautiful 4 BHK Villa with Garden' :
                        formData.propertyType === 'plot' ? 'Prime Residential Plot in Gurgaon' :
                        'Premium Commercial Space'} ${formData.listingType === 'rent' ? 'for Rent' : 'for Sale'}`}
                      className="w-full px-4 py-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent text-lg"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-semibold mb-3 text-gray-700 dark:text-gray-300">
                      Property Description *
                    </label>
                    <textarea
                      required
                      rows={6}
                      placeholder={`Describe your property in detail... Include key features, location advantages, and what makes it special. ${
                        formData.listingType === 'rent' 
                          ? 'Mention tenant preferences, lease terms, and any special conditions.'
                          : 'Highlight investment potential, appreciation prospects, and unique selling points.'
                      }`}
                      className="w-full px-4 py-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                    <p className="text-xs text-gray-500 mt-2">
                      {formData.description.length}/500 characters (minimum 100 recommended)
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step 2: Location & Property Specifications */}
        {step === 2 && (
          <div className="space-y-6">
            {/* Location Details */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-800">
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Location Details
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Provide accurate location information for better visibility
                </p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-semibold mb-3 text-gray-700 dark:text-gray-300">
                    Full Address *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Building name, street address"
                    className="w-full px-4 py-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold mb-3 text-gray-700 dark:text-gray-300">
                    Locality/Area *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Bandra West, Koramangala"
                    className="w-full px-4 py-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    value={formData.locality}
                    onChange={(e) => setFormData({ ...formData, locality: e.target.value })}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold mb-3 text-gray-700 dark:text-gray-300">
                    City *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="City"
                    className="w-full px-4 py-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold mb-3 text-gray-700 dark:text-gray-300">
                    State *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="State"
                    className="w-full px-4 py-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold mb-3 text-gray-700 dark:text-gray-300">
                    Pincode *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Pincode"
                    className="w-full px-4 py-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    value={formData.pincode}
                    onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold mb-3 text-gray-700 dark:text-gray-300">
                    Nearby Landmark
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Near Metro Station, Mall"
                    className="w-full px-4 py-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    value={formData.landmark}
                    onChange={(e) => setFormData({ ...formData, landmark: e.target.value })}
                  />
                </div>
              </div>
            </div>

            {/* Property Specifications */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-800">
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Property Specifications
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Detailed specifications help buyers understand your property better
                </p>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                <div>
                  <label className="block text-sm font-semibold mb-3 text-gray-700 dark:text-gray-300">
                    Total Area (sq ft) *
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="e.g., 1200"
                    className="w-full px-4 py-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    value={formData.squareFeet}
                    onChange={(e) => {
                      setFormData({ ...formData, squareFeet: e.target.value })
                      calculatePricePerSqft()
                    }}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold mb-3 text-gray-700 dark:text-gray-300">
                    Carpet Area (sq ft)
                  </label>
                  <input
                    type="number"
                    placeholder="e.g., 1000"
                    className="w-full px-4 py-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    value={formData.carpetArea}
                    onChange={(e) => setFormData({ ...formData, carpetArea: e.target.value })}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold mb-3 text-gray-700 dark:text-gray-300">
                    Bedrooms
                  </label>
                  <input
                    type="number"
                    placeholder="e.g., 3"
                    className="w-full px-4 py-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    value={formData.bedrooms}
                    onChange={(e) => setFormData({ ...formData, bedrooms: e.target.value })}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold mb-3 text-gray-700 dark:text-gray-300">
                    Bathrooms
                  </label>
                  <input
                    type="number"
                    placeholder="e.g., 2"
                    className="w-full px-4 py-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    value={formData.bathrooms}
                    onChange={(e) => setFormData({ ...formData, bathrooms: e.target.value })}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold mb-3 text-gray-700 dark:text-gray-300">
                    Balconies
                  </label>
                  <input
                    type="number"
                    placeholder="e.g., 2"
                    className="w-full px-4 py-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    value={formData.balconies}
                    onChange={(e) => setFormData({ ...formData, balconies: e.target.value })}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold mb-3 text-gray-700 dark:text-gray-300">
                    Floor Number
                  </label>
                  <input
                    type="number"
                    placeholder="e.g., 5"
                    className="w-full px-4 py-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    value={formData.floors}
                    onChange={(e) => setFormData({ ...formData, floors: e.target.value })}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold mb-3 text-gray-700 dark:text-gray-300">
                    Total Floors
                  </label>
                  <input
                    type="number"
                    placeholder="e.g., 15"
                    className="w-full px-4 py-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    value={formData.totalFloors}
                    onChange={(e) => setFormData({ ...formData, totalFloors: e.target.value })}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold mb-3 text-gray-700 dark:text-gray-300">
                    Parking Spaces
                  </label>
                  <input
                    type="number"
                    placeholder="e.g., 1"
                    className="w-full px-4 py-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    value={formData.parking}
                    onChange={(e) => setFormData({ ...formData, parking: e.target.value })}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                <div>
                  <label className="block text-sm font-semibold mb-3 text-gray-700 dark:text-gray-300">
                    Facing Direction
                  </label>
                  <select
                    className="w-full px-4 py-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    value={formData.facing}
                    onChange={(e) => setFormData({ ...formData, facing: e.target.value })}
                  >
                    <option value="">Select Facing</option>
                    {facingOptions.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold mb-3 text-gray-700 dark:text-gray-300">
                    Furnishing Status
                  </label>
                  <select
                    className="w-full px-4 py-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    value={formData.furnishing}
                    onChange={(e) => setFormData({ ...formData, furnishing: e.target.value })}
                  >
                    <option value="">Select Furnishing</option>
                    {furnishingOptions.map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold mb-3 text-gray-700 dark:text-gray-300">
                    Age of Property
                  </label>
                  <select
                    className="w-full px-4 py-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    value={formData.ageOfProperty}
                    onChange={(e) => setFormData({ ...formData, ageOfProperty: e.target.value })}
                  >
                    <option value="">Select Age</option>
                    <option value="0-1">0-1 Years (New)</option>
                    <option value="1-5">1-5 Years</option>
                    <option value="5-10">5-10 Years</option>
                    <option value="10-15">10-15 Years</option>
                    <option value="15+">15+ Years</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Pricing & Availability */}
        {step === 3 && (
          <div className="space-y-6">
            {/* Pricing Section */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-800">
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {formData.listingType === 'rent' ? 'Rental Pricing' : 'Sale Pricing'}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Set competitive pricing to attract {formData.listingType === 'rent' ? 'tenants' : 'buyers'}
                </p>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Main Price */}
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold mb-3 text-gray-700 dark:text-gray-300">
                      {formData.listingType === 'rent' ? 'Monthly Rent (₹) *' : 'Sale Price (₹) *'}
                    </label>
                    <div className="relative">
                      <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                      <input
                        type="number"
                        required
                        placeholder={formData.listingType === 'rent' ? 'e.g., 45000' : 'e.g., 8500000'}
                        className="w-full pl-12 pr-4 py-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent text-lg font-semibold"
                        value={formData.price}
                        onChange={(e) => {
                          setFormData({ ...formData, price: e.target.value })
                          calculatePricePerSqft()
                        }}
                      />
                    </div>
                    {formData.price && formData.squareFeet && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                        ₹{Math.round(parseInt(formData.price) / parseInt(formData.squareFeet))}/sq ft
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold mb-3 text-gray-700 dark:text-gray-300">
                      Price Type
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, priceType: 'fixed' })}
                        className={`p-4 rounded-xl border-2 transition-all ${
                          formData.priceType === 'fixed'
                            ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                            : 'border-gray-200 dark:border-gray-800'
                        }`}
                      >
                        <div className="text-center">
                          <Target className="mx-auto mb-2 text-green-500" size={24} />
                          <p className="font-semibold">Fixed Price</p>
                          <p className="text-xs text-gray-500">Non-negotiable</p>
                        </div>
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, priceType: 'negotiable' })}
                        className={`p-4 rounded-xl border-2 transition-all ${
                          formData.priceType === 'negotiable'
                            ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                            : 'border-gray-200 dark:border-gray-800'
                        }`}
                      >
                        <div className="text-center">
                          <Calculator className="mx-auto mb-2 text-blue-500" size={24} />
                          <p className="font-semibold">Negotiable</p>
                          <p className="text-xs text-gray-500">Open to offers</p>
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
                
                {/* Additional Pricing Fields */}
                <div className="space-y-6">
                  {formData.listingType === 'rent' ? (
                    <>
                      <div>
                        <label className="block text-sm font-semibold mb-3 text-gray-700 dark:text-gray-300">
                          Security Deposit (₹)
                        </label>
                        <div className="relative">
                          <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                          <input
                            type="number"
                            placeholder="e.g., 90000"
                            className="w-full pl-12 pr-4 py-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            value={formData.securityDeposit}
                            onChange={(e) => setFormData({ ...formData, securityDeposit: e.target.value })}
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-semibold mb-3 text-gray-700 dark:text-gray-300">
                          Maintenance Charges (₹/month)
                        </label>
                        <div className="relative">
                          <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                          <input
                            type="number"
                            placeholder="e.g., 3000"
                            className="w-full pl-12 pr-4 py-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            value={formData.maintenanceCharges}
                            onChange={(e) => setFormData({ ...formData, maintenanceCharges: e.target.value })}
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-semibold mb-3 text-gray-700 dark:text-gray-300">
                          Preferred Lease Period
                        </label>
                        <select
                          className="w-full px-4 py-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          value={formData.leasePeriod}
                          onChange={(e) => setFormData({ ...formData, leasePeriod: e.target.value })}
                        >
                          <option value="">Select Period</option>
                          <option value="11months">11 Months</option>
                          <option value="1year">1 Year</option>
                          <option value="2years">2 Years</option>
                          <option value="3years">3 Years</option>
                          <option value="flexible">Flexible</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-semibold mb-3 text-gray-700 dark:text-gray-300">
                          Tenant Preference
                        </label>
                        <select
                          className="w-full px-4 py-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          value={formData.tenantPreference}
                          onChange={(e) => setFormData({ ...formData, tenantPreference: e.target.value })}
                        >
                          <option value="">No Preference</option>
                          <option value="family">Family Only</option>
                          <option value="bachelor">Bachelors Only</option>
                          <option value="company">Company Lease</option>
                          <option value="any">Any</option>
                        </select>
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <label className="block text-sm font-semibold mb-3 text-gray-700 dark:text-gray-300">
                          Expected Price (₹)
                        </label>
                        <div className="relative">
                          <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                          <input
                            type="number"
                            placeholder="Your ideal selling price"
                            className="w-full pl-12 pr-4 py-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            value={formData.expectedPrice}
                            onChange={(e) => setFormData({ ...formData, expectedPrice: e.target.value })}
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-semibold mb-3 text-gray-700 dark:text-gray-300">
                          Booking Amount (₹)
                        </label>
                        <div className="relative">
                          <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                          <input
                            type="number"
                            placeholder="e.g., 500000"
                            className="w-full pl-12 pr-4 py-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            value={formData.bookingAmount}
                            onChange={(e) => setFormData({ ...formData, bookingAmount: e.target.value })}
                          />
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Availability & Legal */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-800">
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Availability & Legal Details
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Legal compliance and availability information
                </p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-semibold mb-3 text-gray-700 dark:text-gray-300">
                    Availability *
                  </label>
                  <select
                    required
                    className="w-full px-4 py-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    value={formData.availability}
                    onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
                  >
                    <option value="immediate">Immediate</option>
                    <option value="1month">Within 1 Month</option>
                    <option value="3months">Within 3 Months</option>
                    <option value="6months">Within 6 Months</option>
                    <option value="1year">Within 1 Year</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold mb-3 text-gray-700 dark:text-gray-300">
                    Ownership Type
                  </label>
                  <select
                    className="w-full px-4 py-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    value={formData.ownershipType}
                    onChange={(e) => setFormData({ ...formData, ownershipType: e.target.value })}
                  >
                    <option value="">Select Type</option>
                    {ownershipTypes.map(type => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold mb-3 text-gray-700 dark:text-gray-300">
                    Approved By
                  </label>
                  <select
                    className="w-full px-4 py-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    value={formData.approvedBy}
                    onChange={(e) => setFormData({ ...formData, approvedBy: e.target.value })}
                  >
                    <option value="">Select Authority</option>
                    {approvalTypes.map(type => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Amenities & Additional Details */}
        {step === 4 && (
          <div className="space-y-6">
            {/* Amenities Selection */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-800">
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Property Amenities
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Select all amenities available in your property
                </p>
              </div>
              
              {/* Categorized Amenities */}
              <div className="space-y-8">
                {['basic', 'luxury', 'modern'].map(category => (
                  <div key={category}>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 capitalize">
                      {category} Amenities
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                      {amenitiesList.filter(amenity => amenity.category === category).map((amenity) => (
                        <button
                          key={amenity.name}
                          type="button"
                          onClick={() => toggleAmenity(amenity.name)}
                          className={`
                            p-4 rounded-xl border-2 transition-all text-left group hover:scale-105
                            ${formData.amenities.includes(amenity.name)
                              ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                              : 'border-gray-200 dark:border-gray-800 hover:border-green-300'
                            }
                          `}
                        >
                          <div className="flex items-center space-x-3">
                            <amenity.icon size={20} className={`${
                              formData.amenities.includes(amenity.name) 
                                ? 'text-green-600' 
                                : 'text-gray-500 group-hover:text-green-500'
                            }`} />
                            <span className="font-medium text-sm">{amenity.name}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Nearby Places */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-800">
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Nearby Places
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Highlight important places near your property
                </p>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {nearbyPlacesList.map((place) => (
                  <button
                    key={place}
                    type="button"
                    onClick={() => toggleNearbyPlace(place)}
                    className={`
                      p-4 rounded-xl border-2 transition-all text-center hover:scale-105
                      ${formData.nearbyPlaces.includes(place)
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600'
                        : 'border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 hover:border-blue-300'
                      }
                    `}
                  >
                    <span className="font-medium text-sm">{place}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 5: Images, Documents & Contact */}
        {step === 5 && (
          <div className="space-y-6">
            {/* Images Upload */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-800">
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Property Images
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Upload high-quality images to attract more {formData.listingType === 'rent' ? 'tenants' : 'buyers'} (Max 20 images)
                </p>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {images.map((image, index) => (
                  <div key={index} className="relative aspect-square rounded-xl overflow-hidden border-2 border-gray-200 dark:border-gray-800 group">
                    <img
                      src={URL.createObjectURL(image)}
                      alt={`Upload ${index + 1}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all shadow-lg"
                    >
                      <X size={16} />
                    </button>
                    {index === 0 && (
                      <div className="absolute bottom-2 left-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                        Cover Photo
                      </div>
                    )}
                  </div>
                ))}
                {images.length < 20 && (
                  <label className="aspect-square rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-700 hover:border-green-500 transition-all cursor-pointer flex flex-col items-center justify-center group hover:bg-green-50 dark:hover:bg-green-900/10">
                    <Upload size={32} className="text-gray-400 group-hover:text-green-500 mb-2 transition-colors" />
                    <span className="text-sm text-gray-500 group-hover:text-green-600 font-medium">Upload Image</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                  </label>
                )}
              </div>
              
              {images.length === 0 && (
                <div className="text-center py-8 border-2 border-dashed border-red-300 rounded-xl bg-red-50 dark:bg-red-900/10">
                  <AlertCircle className="mx-auto text-red-500 mb-2" size={32} />
                  <p className="text-red-600 font-semibold">At least one image is required</p>
                </div>
              )}
            </div>

            {/* Contact Information */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-800">
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Contact Information
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Provide contact details for interested {formData.listingType === 'rent' ? 'tenants' : 'buyers'}
                </p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold mb-3 text-gray-700 dark:text-gray-300">
                    Contact Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Your full name"
                    className="w-full px-4 py-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    value={formData.contactName}
                    onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold mb-3 text-gray-700 dark:text-gray-300">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    className="w-full px-4 py-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    value={formData.contactPhone}
                    onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold mb-3 text-gray-700 dark:text-gray-300">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="your.email@example.com"
                    className="w-full px-4 py-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    value={formData.contactEmail}
                    onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold mb-3 text-gray-700 dark:text-gray-300">
                    Alternate Phone
                  </label>
                  <input
                    type="tel"
                    placeholder="+91 87654 32109"
                    className="w-full px-4 py-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    value={formData.alternatePhone}
                    onChange={(e) => setFormData({ ...formData, alternatePhone: e.target.value })}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 6: Review & Payment */}
        {step === 6 && (
          <div className="space-y-6">
            {/* Payment Section */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-800">
              <div className="text-center">
                <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CreditCard size={40} className="text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Complete Your Listing
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  One-time payment to publish your {formData.listingType === 'rent' ? 'rental' : 'sale'} listing
                </p>
                
                <div className="text-5xl font-bold text-green-600 mb-8">
                  ₹1,000
                </div>
                
                <div className="max-w-md mx-auto space-y-4 text-left">
                  <div className="flex items-start space-x-3">
                    <CheckCircle2 size={20} className="text-green-600 mt-0.5" />
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">Unlimited Views</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Your listing will be visible to all users</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle2 size={20} className="text-green-600 mt-0.5" />
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">Direct Inquiries</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Receive messages from interested {formData.listingType === 'rent' ? 'tenants' : 'buyers'}</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle2 size={20} className="text-green-600 mt-0.5" />
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">Active Until {formData.listingType === 'rent' ? 'Rented' : 'Sold'}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">No time limit on your listing</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle2 size={20} className="text-green-600 mt-0.5" />
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">Analytics Dashboard</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Track views, inquiries, and performance</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between">
          {step > 1 && (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="flex items-center space-x-2 px-6 py-3 border-2 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
            >
              <ArrowLeft size={20} />
              <span>Back</span>
            </button>
          )}
          <button
            type="submit"
            disabled={loading}
            className={`
              flex items-center space-x-2 px-8 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed
              ${step === 1 ? 'ml-auto' : ''}
            `}
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Processing...</span>
              </>
            ) : step === 6 ? (
              <>
                <CreditCard size={20} />
                <span>Pay & Publish</span>
              </>
            ) : (
              <>
                <span>Continue</span>
                <ArrowRight size={20} />
              </>
            )}
          </button>
        </div>
      </form>
        </div>
      )}
    </div>
  )
}
