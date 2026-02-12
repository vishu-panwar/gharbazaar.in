'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  Star,
  MapPin,
  Phone,
  MessageSquare,
  CheckCircle,
  Award,
  Briefcase,
  Clock,
  IndianRupee,
  Calendar,
  FileText,
  Shield,
  Languages,
  Mail,
  Globe,
  Download,
  Image as ImageIcon,
  Video,
  ThumbsUp,
  Share2
} from 'lucide-react'
import { toast } from 'react-hot-toast'
import { allProviders } from '../../providersData'

export default function ProviderProfilePage() {
  const params = useParams()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('overview')
  const [showBookingModal, setShowBookingModal] = useState(false)

  // Get provider by ID
  const providerId = parseInt(params.id as string)
  const provider = allProviders.find(p => p.id === providerId)

  // If provider not found, show error
  if (!provider) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Provider Not Found
          </h1>
          <button
            onClick={() => router.back()}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all"
          >
            Go Back
          </button>
        </div>
      </div>
    )
  }

  // Mock additional data (can be moved to providersData.ts later)
  const mockProvider = {
    ...provider,
    responseTime: '2 hours',
    email: `${provider.name.toLowerCase().replace(/\s+/g, '.')}@example.com`,
    phone: '+91 98765 43210',
    website: `www.${provider.name.toLowerCase().replace(/\s+/g, '')}.com`,
    bio: `Experienced ${provider.profession.toLowerCase()} with over ${provider.experience} of expertise. Successfully completed ${provider.completedProjects || 100}+ projects with a 95% success rate.`,
    certifications: [
      'Professional Certification',
      'Industry Expert',
      'Verified Specialist'
    ],
    services: [
      { name: 'Standard Service', price: provider.price, type: provider.priceType },
      { name: 'Premium Service', price: '₹' + (parseInt(provider.price.replace(/[^0-9]/g, '')) * 1.5), type: 'Fixed' },
      { name: 'Consultation', price: '₹' + (parseInt(provider.price.replace(/[^0-9]/g, '')) * 0.6), type: 'Per Hour' }
    ],
    portfolio: [
      { type: 'image', title: 'Project 1', url: null },
      { type: 'image', title: 'Project 2', url: null },
      { type: 'document', title: 'Certificate', url: null }
    ],
    reviewsList: [
      {
        id: 1,
        name: 'Amit Sharma',
        rating: 5,
        date: '2 weeks ago',
        comment: 'Excellent service! Very professional and knowledgeable.',
        helpful: 24
      },
      {
        id: 2,
        name: 'Priya Patel',
        rating: 5,
        date: '1 month ago',
        comment: 'Highly recommended! Very responsive and trustworthy.',
        helpful: 18
      },
      {
        id: 3,
        name: 'Rahul Verma',
        rating: 4,
        date: '2 months ago',
        comment: 'Good experience overall. Professional approach.',
        helpful: 12
      }
    ]
  }

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'services', label: 'Services & Pricing' },
    { id: 'portfolio', label: 'Portfolio' },
    { id: 'reviews', label: 'Reviews' },
  ]

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href)
    toast.success('Link copied to clipboard!')
  }

  const handleChat = async () => {
    try {
      // In a real app, you might want to create a conversation first via API
      // For now, we'll just redirect to the messages page
      router.push(`/dashboard/messages?chatWith=${provider.id}&name=${encodeURIComponent(provider.name)}`)
    } catch (error) {
      toast.error('Failed to start chat')
    }
  }

  const [bookingLoading, setBookingLoading] = useState(false)
  const [bookingForm, setBookingForm] = useState({
    name: '',
    phone: '',
    address: '',
    date: '',
    time: '',
    notes: ''
  })

  // ... previous handlers (handleShare, handleChat)

  const handleConfirmBooking = async () => {
    try {
      setBookingLoading(true)
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1'}/service-providers/${provider.id}/book`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          formData: bookingForm,
          message: bookingForm.notes
        })
      })

      const data = await response.json()

      if (data.success) {
        toast.success('Your booking request has been sent!')
        setShowBookingModal(false)
      } else {
        toast.error(data.error || 'Failed to send booking request')
      }
    } catch (error) {
      console.error('Booking error:', error)
      toast.error('An error occurred while booking. Please try again.')
    } finally {
      setBookingLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
      >
        <ArrowLeft size={20} />
        <span>Back to Providers</span>
      </button>

      {/* Profile Header */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        {/* Cover */}
        <div className="h-32 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600"></div>

        <div className="px-6 pb-6">
          {/* Avatar & Basic Info */}
          <div className="flex flex-col md:flex-row md:items-end md:justify-between -mt-16 mb-6">
            <div className="flex flex-col sm:flex-row sm:items-end gap-4 mb-4 md:mb-0">
              <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-5xl font-bold border-4 border-white dark:border-gray-800 shadow-xl">
                {mockProvider.name.charAt(0)}
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    {mockProvider.name}
                  </h1>
                  {mockProvider.verified && (
                    <CheckCircle className="w-6 h-6 text-blue-600" />
                  )}
                </div>
                <p className="text-lg text-gray-600 dark:text-gray-400">
                  {mockProvider.profession} • {mockProvider.experience}
                </p>
                <div className="flex flex-wrap gap-3">
                  <div className="flex items-center space-x-1">
                    <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {mockProvider.rating}
                    </span>
                    <span className="text-gray-500 dark:text-gray-400">
                      ({mockProvider.reviews} reviews)
                    </span>
                  </div>
                  <div className="flex items-center space-x-1 text-gray-600 dark:text-gray-400">
                    <MapPin className="w-5 h-5" />
                    <span>{mockProvider.location}</span>
                  </div>
                  <div className="flex items-center space-x-1 text-gray-600 dark:text-gray-400">
                    <Briefcase className="w-5 h-5" />
                    <span>{mockProvider.completedProjects} projects</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3">
              <button 
                onClick={handleShare}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-xl transition-colors"
                title="Copy Link"
              >
                <Share2 size={18} />
                <span>Share</span>
              </button>
              <button 
                onClick={handleChat}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-xl transition-colors"
              >
                <MessageSquare size={18} />
                <span>Chat</span>
              </button>
              <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-xl transition-colors">
                <Phone size={18} />
                <span>Call</span>
              </button>
              <button
                onClick={() => setShowBookingModal(true)}
                className="flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-medium transition-all shadow-lg shadow-blue-500/30"
              >
                <Calendar size={18} />
                <span>Hire Now</span>
              </button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {mockProvider.completedProjects}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Projects Done</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {mockProvider.rating}★
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Rating</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {mockProvider.responseTime}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Response Time</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                Available
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Status</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="flex overflow-x-auto border-b border-gray-200 dark:border-gray-700">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-4 font-medium whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">About</h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {mockProvider.bio}
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Specialties</h3>
                <div className="flex flex-wrap gap-2">
                  {mockProvider.specialties.map((specialty, idx) => (
                    <span
                      key={idx}
                      className="px-4 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded-lg font-medium"
                    >
                      {specialty}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Contact Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl">
                    <Mail className="w-5 h-5 text-gray-400" />
                    <div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">Email</div>
                      <div className="font-medium text-gray-900 dark:text-white">{mockProvider.email}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl">
                    <Phone className="w-5 h-5 text-gray-400" />
                    <div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">Phone</div>
                      <div className="font-medium text-gray-900 dark:text-white">{mockProvider.phone}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl">
                    <Globe className="w-5 h-5 text-gray-400" />
                    <div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">Website</div>
                      <div className="font-medium text-gray-900 dark:text-white">{mockProvider.website}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl">
                    <Languages className="w-5 h-5 text-gray-400" />
                    <div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">Languages</div>
                      <div className="font-medium text-gray-900 dark:text-white">
                        {mockProvider.languages.join(', ')}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Certifications</h3>
                <div className="space-y-2">
                  {mockProvider.certifications.map((cert, idx) => (
                    <div key={idx} className="flex items-center space-x-2 text-gray-700 dark:text-gray-300">
                      <Award className="w-5 h-5 text-blue-600" />
                      <span>{cert}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Services Tab */}
          {activeTab === 'services' && (
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Services & Pricing</h3>
              {mockProvider.services.map((service, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors"
                >
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">{service.name}</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{service.type}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-gray-900 dark:text-white">{service.price}</div>
                    <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                      Book Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Portfolio Tab */}
          {activeTab === 'portfolio' && (
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Past Work</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {mockProvider.portfolio.map((item, idx) => (
                  <div
                    key={idx}
                    className="aspect-video bg-gray-100 dark:bg-gray-900/50 rounded-xl flex flex-col items-center justify-center space-y-2 hover:bg-gray-200 dark:hover:bg-gray-900 transition-colors cursor-pointer"
                  >
                    {item.type === 'image' ? (
                      <ImageIcon className="w-12 h-12 text-gray-400" />
                    ) : (
                      <FileText className="w-12 h-12 text-gray-400" />
                    )}
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {item.title}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Reviews Tab */}
          {activeTab === 'reviews' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Client Reviews</h3>
                <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors">
                  Write a Review
                </button>
              </div>

              <div className="space-y-4">
                {mockProvider.reviewsList?.map((review) => (
                  <div
                    key={review.id}
                    className="p-6 bg-gray-50 dark:bg-gray-900/50 rounded-xl"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                          {review.name.charAt(0)}
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white">{review.name}</h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{review.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < review.rating
                                ? 'text-yellow-500 fill-yellow-500'
                                : 'text-gray-300 dark:text-gray-600'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 mb-3">{review.comment}</p>
                    <button className="flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                      <ThumbsUp className="w-4 h-4" />
                      <span>Helpful ({review.helpful})</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Documents Tab */}
          {activeTab === 'documents' && (
            <div className="space-y-4">
              <div className="flex items-center space-x-2 mb-4">
                <Shield className="w-6 h-6 text-green-600" />
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  Verified Documents
                </h3>
              </div>
              <div className="space-y-3">
                {['Aadhaar Card', 'Bar Council License', 'GST Certificate', 'Professional Certificate'].map((doc, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800"
                  >
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="font-medium text-gray-900 dark:text-white">{doc}</span>
                    </div>
                    <button className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 font-medium">
                      <Download size={16} />
                      <span>View</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Booking Modal */}
      {showBookingModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Book {mockProvider.name}
                </h2>
                <button
                  onClick={() => setShowBookingModal(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Select Service
                </label>
                <select 
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500"
                  value={bookingForm.name}
                  onChange={(e) => setBookingForm({ ...bookingForm, name: e.target.value })}
                >
                  <option value="">Select a service</option>
                  {mockProvider.services.map((service, idx) => (
                    <option key={idx} value={service.name}>{service.name} - {service.price}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Property Type
                </label>
                <select 
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500"
                  value={bookingForm.address}
                  onChange={(e) => setBookingForm({ ...bookingForm, address: e.target.value })}
                >
                  <option>Residential</option>
                  <option>Commercial</option>
                  <option>Industrial</option>
                  <option>Agricultural</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  placeholder="Enter property location"
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500"
                  value={bookingForm.phone}
                  onChange={(e) => setBookingForm({ ...bookingForm, phone: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Budget Range
                  </label>
                  <input
                    type="text"
                    placeholder="₹ 50,000 - 1,00,000"
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Timeline
                  </label>
                  <select className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500">
                    <option>Urgent (1-3 days)</option>
                    <option>Normal (1 week)</option>
                    <option>Flexible (2+ weeks)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  rows={4}
                  placeholder="Describe your requirements..."
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 resize-none"
                  value={bookingForm.notes}
                  onChange={(e) => setBookingForm({ ...bookingForm, notes: e.target.value })}
                ></textarea>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowBookingModal(false)}
                  className="flex-1 px-6 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-xl font-medium transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleConfirmBooking}
                  disabled={bookingLoading}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-medium transition-all shadow-lg shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {bookingLoading ? 'Sending...' : 'Confirm Booking'}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
