'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Scale,
  Building2,
  Palette,
  PaintBucket,
  HardHat,
  Compass,
  Search as SearchIcon,
  TruckIcon,
  Zap,
  Sofa,
  Ruler,
  Shield,
  Star,
  MapPin,
  Phone,
  MessageSquare,
  CheckCircle,
  Filter,
  ArrowRight,
  Briefcase,
  Award,
  Clock,
  IndianRupee,
  Plus,
  X,
  Upload,
  User
} from 'lucide-react'
import Link from 'next/link'
import { backendApi } from '@/lib/backendApi'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

// Service Categories
const serviceCategories = [
  {
    id: 'lawyer',
    name: 'Property Lawyer',
    icon: Scale,
    description: 'Sale deed, registry, legal check, dispute resolution',
    color: 'from-blue-600 to-blue-800',
    providers: 24
  },
  {
    id: 'architect',
    name: 'Architect',
    icon: Building2,
    description: 'Floor plans, approvals, construction guidance',
    color: 'from-purple-600 to-purple-800',
    providers: 18
  },
  {
    id: 'interior-designer',
    name: 'Interior Designer',
    icon: Palette,
    description: 'Home, office, shop design',
    color: 'from-pink-600 to-pink-800',
    providers: 32
  },
  {
    id: 'painter',
    name: 'Painter',
    icon: PaintBucket,
    description: 'Interior & exterior painting',
    color: 'from-orange-600 to-orange-800',
    providers: 45
  },
  {
    id: 'contractor',
    name: 'Civil Contractor',
    icon: HardHat,
    description: 'Construction & renovation',
    color: 'from-yellow-600 to-yellow-800',
    providers: 28
  },
  {
    id: 'inspector',
    name: 'Property Inspector',
    icon: SearchIcon,
    description: 'Structural & legal inspection',
    color: 'from-cyan-600 to-cyan-800',
    providers: 12
  },
  {
    id: 'movers',
    name: 'Packers & Movers',
    icon: TruckIcon,
    description: 'Safe relocation services',
    color: 'from-indigo-600 to-indigo-800',
    providers: 38
  },
  {
    id: 'electrician',
    name: 'Electrician / Plumber',
    icon: Zap,
    description: 'Electrical & plumbing work',
    color: 'from-red-600 to-red-800',
    providers: 52
  },
  {
    id: 'furniture',
    name: 'Modular Kitchen & Furniture',
    icon: Sofa,
    description: 'Custom furniture solutions',
    color: 'from-teal-600 to-teal-800',
    providers: 22
  },
  {
    id: 'surveyor',
    name: 'Surveyor / Valuation Expert',
    icon: Ruler,
    description: 'Property measurement & valuation',
    color: 'from-violet-600 to-violet-800',
    providers: 10
  },
]

export default function ServicesPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [providers, setProviders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddServiceModal, setShowAddServiceModal] = useState(false)
  const [isSubmittingService, setIsSubmittingService] = useState(false)
  const [serviceImage, setServiceImage] = useState<File | null>(null)
  const [serviceImagePreview, setServiceImagePreview] = useState('')
  const [serviceFormData, setServiceFormData] = useState({
    name: '',
    address: '',
    experience: '',
    profession: ''
  })

  const fetchProviders = async () => {
    try {
      setLoading(true)
      const response = await backendApi.serviceProvider.list()
      if (response?.success) {
        setProviders(response.providers || [])
        return
      }
      setProviders([])
    } catch (error) {
      console.error('Error fetching providers:', error)
      setProviders([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProviders()
  }, [])

  const resolveImageUrl = (imagePath?: string) => {
    if (!imagePath) return ''
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) return imagePath

    const rawApiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'
    const apiHost = rawApiUrl.replace(/\/api(\/v1)?\/?$/, '')
    return `${apiHost}${imagePath.startsWith('/') ? imagePath : `/${imagePath}`}`
  }

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null
    setServiceImage(file)
    setServiceImagePreview(file ? URL.createObjectURL(file) : '')
  }

  const handleAddService = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!serviceFormData.name || !serviceFormData.address || !serviceFormData.experience || !serviceFormData.profession) {
      toast.error('Please fill all required fields')
      return
    }

    setIsSubmittingService(true)
    try {
      const formData = new FormData()
      formData.append('name', serviceFormData.name)
      formData.append('address', serviceFormData.address)
      formData.append('experience', serviceFormData.experience)
      formData.append('profession', serviceFormData.profession)
      if (serviceImage) {
        formData.append('profileImage', serviceImage)
      }

      const response = await backendApi.serviceProvider.create(formData)
      if (!response?.success) {
        const backendDetails = response?.details ? ` ${response.details}` : ''
        throw new Error((response?.error || 'Failed to add service') + backendDetails)
      }

      toast.success('Service added successfully')
      setShowAddServiceModal(false)
      setServiceImage(null)
      setServiceImagePreview('')
      setServiceFormData({
        name: '',
        address: '',
        experience: '',
        profession: ''
      })
      await fetchProviders()
    } catch (error: any) {
      toast.error(error?.message || 'Failed to add service')
    } finally {
      setIsSubmittingService(false)
    }
  }

  // Filter providers based on search and category
  const filteredProviders = providers.filter(provider => {
    const providerName = provider.user?.name || provider.name || ''
    const providerCategory = provider.category || provider.profession || ''
    const providerLocation = provider.location || ''
    const normalizedProviderCategory = providerCategory.toLowerCase().replace(/[\s_-]/g, '')
    const normalizedSelectedCategory = selectedCategory.toLowerCase().replace(/[\s_-]/g, '')

    const matchesSearch = providerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         providerCategory.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         providerLocation.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesCategory = selectedCategory === 'all' || 
                           normalizedProviderCategory.includes(normalizedSelectedCategory) ||
                           normalizedSelectedCategory.includes(normalizedProviderCategory)
    
    return matchesSearch && matchesCategory
  })

  const handleCall = (phone: string) => {
    if (!phone) {
      toast.error('Phone number not available')
      return
    }
    
    // Check if mobile
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
    if (isMobile) {
      window.location.href = `tel:${phone}`
    } else {
      navigator.clipboard.writeText(phone)
      toast.success('Phone number copied to clipboard!')
    }
  }

  const handleMessage = async (provider: any) => {
    try {
      if (!provider.userId) {
        toast.error('Provider ID not found')
        return
      }

      const response = await backendApi.chat.createConversation({
        otherUserId: provider.userId,
        type: 'direct'
      })

      if (response?.success) {
        router.push(`/dashboard/messages?id=${response.data.id}`)
      } else {
        toast.error(response?.error || 'Failed to start conversation')
      }
    } catch (error) {
      console.error('Error starting conversation:', error)
      toast.error('Failed to start chat')
    }
  }

  return (
    <div className="space-y-6">
      {/* Header - More Compact */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 p-6 text-white">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <Shield className="w-6 h-6" />
                <h1 className="text-2xl font-bold">Professional Services</h1>
              </div>
              <p className="text-sm text-white/90 max-w-2xl">
                Hire verified professionals for your property needs
              </p>
            </div>
            <div className="hidden md:flex items-center space-x-3">
              <div className="flex items-center space-x-1 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs">
                <CheckCircle className="w-4 h-4" />
                <span>Verified</span>
              </div>
              <div className="flex items-center space-x-1 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs">
                <Shield className="w-4 h-4" />
                <span>Secure</span>
              </div>
              <Link href="/service-partners/login">
                <button className="flex items-center space-x-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm px-4 py-2 rounded-lg text-sm font-medium transition-all border border-white/30 hover:border-white/50">
                  <Briefcase className="w-4 h-4" />
                  <span>Become a Service Partner</span>
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Search & Filter - Compact */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={() => setShowAddServiceModal(true)}
          className="flex items-center justify-center space-x-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all text-sm font-semibold"
        >
          <Plus size={18} />
          <span>Add Service</span>
        </button>
        <div className="flex-1 relative">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search professionals..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          />
        </div>
        <button className="flex items-center justify-center space-x-2 px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all text-sm">
          <Filter size={18} />
          <span className="font-medium">Filters</span>
        </button>
      </div>


      {/* Category Filter Tabs - Hidden on Mobile in favor of Grid above */}
      <div className="hidden md:block relative">
        <div className="flex overflow-x-auto gap-2 pb-2 scrollbar-hide">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all text-sm ${
              selectedCategory === 'all'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
            }`}
          >
            All Services
          </button>
          {serviceCategories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all text-sm ${
                selectedCategory === category.id
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Featured Professionals */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Professional Experts</h2>
          {selectedCategory !== 'all' && (
            <button 
              onClick={() => setSelectedCategory('all')}
              className="text-xs text-blue-600 font-medium"
            >
              View All
            </button>
          )}
        </div>
        
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-500 dark:text-gray-400 animate-pulse">Loading professionals...</p>
          </div>
        ) : filteredProviders.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredProviders.map((provider, index) => (
              <motion.div
                key={provider.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 hover:shadow-lg hover:border-blue-300 dark:hover:border-blue-700 transition-all duration-200"
              >
                <div className="flex gap-4">
                  {/* Avatar - Compact */}
                  {resolveImageUrl(provider.profileImage || provider.image) ? (
                    <img
                      src={resolveImageUrl(provider.profileImage || provider.image)}
                      alt={provider.user?.name || provider.name || 'Provider'}
                      className="w-16 h-16 rounded-xl object-cover flex-shrink-0 shadow-inner"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold flex-shrink-0 shadow-inner">
                      {(provider.user?.name || provider.name || 'P').charAt(0)}
                    </div>
                  )}

                  {/* Info - Compact */}
                  <div className="flex-1 min-w-0">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <h3 className="text-base font-bold text-gray-900 dark:text-white truncate">
                            {provider.user?.name || provider.name}
                          </h3>
                          {provider.verified && (
                            <CheckCircle className="w-4 h-4 text-blue-600 flex-shrink-0" />
                          )}
                        </div>
                        <p className="text-xs text-blue-600 dark:text-blue-400 font-medium truncate">
                          {provider.specialization || provider.category || provider.profession}
                        </p>
                      </div>
                      <div className="flex items-center space-x-1 bg-yellow-50 dark:bg-yellow-900/20 px-2 py-0.5 rounded-lg border border-yellow-100 dark:border-yellow-800">
                        <Star className="w-3.5 h-3.5 text-yellow-500 fill-current" />
                        <span className="text-xs font-bold text-yellow-700 dark:text-yellow-400">{provider.rating || 'New'}</span>
                      </div>
                    </div>

                    {/* Meta Grid */}
                    <div className="grid grid-cols-2 gap-y-2 gap-x-4 mb-4">
                      <div className="flex items-center space-x-2 text-xs text-gray-600 dark:text-gray-400">
                        <Briefcase className="w-3.5 h-3.5 text-blue-500" />
                        <span>{provider.experience || '3+'} yrs exp.</span>
                      </div>
                      <div className="flex items-center space-x-2 text-xs text-gray-600 dark:text-gray-400">
                        <MapPin className="w-3.5 h-3.5 text-red-500" />
                        <span className="truncate">{provider.location || 'Pan India'}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-xs text-gray-600 dark:text-gray-400">
                        <IndianRupee className="w-3.5 h-3.5 text-green-500" />
                        <span>{provider.hourlyRate || '500'}/{provider.priceType === 'per project' ? 'proj' : 'hr'}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-xs text-gray-600 dark:text-gray-400">
                        <Award className="w-3.5 h-3.5 text-purple-500" />
                        <span>{provider.completedProjects || 50}+ Projects</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 pt-3 border-t border-gray-100 dark:border-gray-800">
                      <button
                        onClick={() => handleCall(provider.user?.phone || provider.phone)}
                        className="flex-1 flex items-center justify-center space-x-2 py-2 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl transition-all text-sm font-medium border border-gray-100 dark:border-gray-700"
                      >
                        <Phone className="w-4 h-4" />
                        <span>Call</span>
                      </button>
                      <button
                        onClick={() => handleMessage(provider)}
                        className="flex-1 flex items-center justify-center space-x-2 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all text-sm font-medium shadow-md shadow-blue-600/20"
                      >
                        <MessageSquare className="w-4 h-4" />
                        <span>Message</span>
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-2xl border border-dashed border-gray-300 dark:border-gray-700">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
              <SearchIcon size={32} />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">No professionals found</h3>
            <p className="text-gray-500 dark:text-gray-400">Try adjusting your search or category filter</p>
            <button
              onClick={() => {
                setSearchQuery('')
                setSelectedCategory('all')
              }}
              className="mt-6 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-all"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>

      {showAddServiceModal && (
        <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-2xl w-full max-w-xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Add Service</h3>
              <button
                onClick={() => {
                  setShowAddServiceModal(false)
                  setServiceImage(null)
                  setServiceImagePreview('')
                }}
                className="p-2 text-gray-500 hover:text-gray-900 dark:hover:text-white rounded-lg"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddService} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    type="text"
                    value={serviceFormData.name}
                    onChange={(e) => setServiceFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full pl-10 pr-3 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg"
                    placeholder="Your full name"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Address</label>
                <input
                  type="text"
                  value={serviceFormData.address}
                  onChange={(e) => setServiceFormData(prev => ({ ...prev, address: e.target.value }))}
                  className="w-full px-3 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg"
                  placeholder="City, area or full address"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Experience (Years)</label>
                  <input
                    type="number"
                    min={0}
                    value={serviceFormData.experience}
                    onChange={(e) => setServiceFormData(prev => ({ ...prev, experience: e.target.value }))}
                    className="w-full px-3 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg"
                    placeholder="e.g. 5"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Profession</label>
                  <input
                    type="text"
                    value={serviceFormData.profession}
                    onChange={(e) => setServiceFormData(prev => ({ ...prev, profession: e.target.value }))}
                    className="w-full px-3 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg"
                    placeholder="e.g. Property Lawyer"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Image</label>
                <label className="w-full border border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 flex items-center gap-3 cursor-pointer hover:border-blue-500 transition-colors">
                  <Upload size={18} className="text-gray-500" />
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    {serviceImage ? serviceImage.name : 'Upload profile image'}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
                {serviceImagePreview && (
                  <img
                    src={serviceImagePreview}
                    alt="Preview"
                    className="mt-3 w-20 h-20 rounded-lg object-cover border border-gray-200 dark:border-gray-700"
                  />
                )}
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddServiceModal(false)}
                  className="flex-1 py-2.5 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingService}
                  className="flex-1 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold disabled:opacity-60"
                >
                  {isSubmittingService ? 'Saving...' : 'Save Service'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Trust Banner - Compact */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-xl p-5 border border-green-200 dark:border-green-800">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-500 rounded-xl flex items-center justify-center text-white flex-shrink-0">
              <Shield size={24} />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900 dark:text-white mb-0.5">
                100% Verified Professionals
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                All providers verified with proper documentation
              </p>
            </div>
          </div>
          <button className="px-5 py-2 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white rounded-lg text-sm font-medium transition-all whitespace-nowrap">
            Learn More
          </button>
        </div>
      </div>
    </div>
  )
}
