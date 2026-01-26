'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Heart,
  Home,
  MapPin,
  Bed,
  Bath,
  Square,
  Eye,
  Star,
  CheckCircle,
  Trash2,
  Share2,
  MessageCircle,
  Grid,
  List as ListIcon,
  ExternalLink,
  Copy,
  X,
  Check,
  Calendar,
  Clock,
  Phone,
  Mail,
  Send,
  User,
  Facebook,
  Twitter
} from 'lucide-react'
import { useFavorites } from '@/contexts/FavoritesContext'
import { Property } from '@/components/PropertyCard'

export default function FavoritesPage() {
  const { favorites, removeFavorite, clearAllFavorites, getFavoritesCount } = useFavorites()
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showShareModal, setShowShareModal] = useState(false)
  const [shareProperty, setShareProperty] = useState<Property | null>(null)
  const [copied, setCopied] = useState(false)
  const [showClearConfirm, setShowClearConfirm] = useState(false)

  // Schedule Visit Modal State
  const [showScheduleModal, setShowScheduleModal] = useState(false)
  const [scheduleForm, setScheduleForm] = useState({
    name: '',
    phone: '',
    email: '',
    date: '',
    time: '',
    message: ''
  })
  const [scheduleSuccess, setScheduleSuccess] = useState(false)

  // Contact Sellers Modal State
  const [showContactModal, setShowContactModal] = useState(false)
  const [contactForm, setContactForm] = useState({
    name: '',
    phone: '',
    email: '',
    message: ''
  })
  const [contactSuccess, setContactSuccess] = useState(false)

  const handleShare = (property: Property) => {
    setShareProperty(property)
    setShowShareModal(true)
  }

  const copyLink = () => {
    if (shareProperty) {
      const link = `${window.location.origin}/dashboard/browse/${shareProperty.id}`
      navigator.clipboard.writeText(link)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const shareViaWhatsApp = () => {
    if (shareProperty) {
      const text = `Check out this property: ${shareProperty.title} - ${shareProperty.price}\n${window.location.origin}/dashboard/browse/${shareProperty.id}`
      window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank')
    }
  }

  const shareViaEmail = () => {
    if (shareProperty) {
      const subject = `Check out this property: ${shareProperty.title}`
      const body = `I found this property on GharBazaar:\n\n${shareProperty.title}\nLocation: ${shareProperty.location}\nPrice: ${shareProperty.price}\n\nView here: ${window.location.origin}/dashboard/browse/${shareProperty.id}`
      window.open(`mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`)
    }
  }

  const shareViaFacebook = () => {
    if (shareProperty) {
      const url = `${window.location.origin}/dashboard/browse/${shareProperty.id}`
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank')
    }
  }

  const shareViaTwitter = () => {
    if (shareProperty) {
      const text = `Check out this property: ${shareProperty.title} - ${shareProperty.price}`
      const url = `${window.location.origin}/dashboard/browse/${shareProperty.id}`
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank')
    }
  }

  const shareAll = () => {
    const text = favorites.map(p => `${p.title} - ${p.price}`).join('\n')
    const fullText = `My Favorite Properties on GharBazaar:\n\n${text}`
    navigator.clipboard.writeText(fullText)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleScheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Simulate form submission
    console.log('Schedule Visit Request:', scheduleForm)
    console.log('Properties:', favorites.map(p => p.title))
    setScheduleSuccess(true)
    setTimeout(() => {
      setScheduleSuccess(false)
      setShowScheduleModal(false)
      setScheduleForm({ name: '', phone: '', email: '', date: '', time: '', message: '' })
    }, 2000)
  }

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Simulate form submission
    console.log('Contact Sellers Request:', contactForm)
    console.log('Properties:', favorites.map(p => p.title))
    setContactSuccess(true)
    setTimeout(() => {
      setContactSuccess(false)
      setShowContactModal(false)
      setContactForm({ name: '', phone: '', email: '', message: '' })
    }, 2000)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white flex items-center">
            <Heart className="mr-3 text-red-500 fill-red-500" size={28} />
            My Favorites
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {getFavoritesCount()} saved properties
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {favorites.length > 0 && (
            <>
              <button
                onClick={shareAll}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all text-sm font-medium"
              >
                <Share2 size={16} />
                <span>{copied ? 'Copied!' : 'Share All'}</span>
              </button>
              <button
                onClick={() => setShowClearConfirm(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/40 rounded-lg transition-all text-sm font-medium"
              >
                <Trash2 size={16} />
                <span>Clear All</span>
              </button>
            </>
          )}
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg transition-all ${viewMode === 'grid'
                ? 'bg-red-600 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
              }`}
          >
            <Grid size={20} />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-lg transition-all ${viewMode === 'list'
                ? 'bg-red-600 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
              }`}
          >
            <ListIcon size={20} />
          </button>
        </div>
      </div>

      {/* Stats Bar */}
      {favorites.length > 0 && (
        <div className="bg-gradient-to-r from-red-500 to-pink-500 rounded-xl p-4 text-white">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold">{favorites.length}</p>
              <p className="text-red-100 text-sm">Total Saved</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">
                {favorites.filter(f => f.listingType === 'sale').length}
              </p>
              <p className="text-red-100 text-sm">For Sale</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">
                {favorites.filter(f => f.listingType === 'rent').length}
              </p>
              <p className="text-red-100 text-sm">For Rent</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">
                {favorites.filter(f => f.verified).length}
              </p>
              <p className="text-red-100 text-sm">Verified</p>
            </div>
          </div>
        </div>
      )}

      {/* Favorites Grid/List */}
      {favorites.length === 0 ? (
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 p-12 text-center">
          <Heart size={64} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            No favorites yet
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Start adding properties to your favorites by clicking the heart icon on any property card
          </p>
          <Link
            href="/dashboard/browse"
            className="inline-flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-all"
          >
            <Home size={20} />
            <span>Browse Properties</span>
          </Link>
        </div>
      ) : (
        <div className={viewMode === 'grid'
          ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'
          : 'space-y-6'
        }>
          {favorites.map((property) => (
            <div
              key={property.id}
              className="group bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 overflow-hidden hover:shadow-2xl hover:border-red-500 transition-all duration-300"
            >
              {/* Image */}
              <div className="relative h-56 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Home size={64} className="text-gray-400" />
                </div>

                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-2">
                  <div className={`px-3 py-1 rounded-full text-xs font-semibold ${property.listingType === 'rent'
                      ? 'bg-purple-500 text-white'
                      : 'bg-blue-500 text-white'
                    }`}>
                    {property.listingType === 'rent' ? 'FOR RENT' : 'FOR SALE'}
                  </div>
                  {property.featured && (
                    <div className="bg-yellow-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center space-x-1">
                      <Star size={12} />
                      <span>Featured</span>
                    </div>
                  )}
                  {property.verified && (
                    <div className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center space-x-1">
                      <CheckCircle size={12} />
                      <span>Verified</span>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="absolute bottom-3 right-3 flex space-x-2">
                  <button
                    onClick={() => removeFavorite(property.id)}
                    className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-red-500 hover:text-white transition-all group/btn"
                    title="Remove from favorites"
                  >
                    <Trash2 size={18} />
                  </button>
                  <button
                    onClick={() => handleShare(property)}
                    className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-blue-500 hover:text-white transition-all"
                    title="Share property"
                  >
                    <Share2 size={18} />
                  </button>
                </div>

                {/* Favorite Icon - Click to remove */}
                <button
                  onClick={() => removeFavorite(property.id)}
                  className="absolute top-3 right-3 w-10 h-10 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center transition-all"
                  title="Remove from favorites"
                >
                  <Heart size={20} className="text-white fill-white" />
                </button>
              </div>

              {/* Content */}
              <div className="p-5">
                <Link href={`/dashboard/browse/${property.id}`} className="block">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-red-600 transition-colors mb-1">
                        {property.title}
                      </h3>
                      <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm">
                        <MapPin size={14} className="mr-1" />
                        <span>{property.location}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1 text-yellow-500">
                      <Star size={14} className="fill-current" />
                      <span className="text-sm font-semibold">{property.rating}</span>
                    </div>
                  </div>

                  {/* Property Details */}
                  <div className="flex items-center space-x-4 mb-4 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center">
                      <Bed size={16} className="mr-1" />
                      <span>{property.beds}</span>
                    </div>
                    <div className="flex items-center">
                      <Bath size={16} className="mr-1" />
                      <span>{property.baths}</span>
                    </div>
                    <div className="flex items-center">
                      <Square size={16} className="mr-1" />
                      <span>{property.area}</span>
                    </div>
                  </div>

                  {/* Price & CTA */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Price</p>
                      <p className="text-xl font-bold text-red-600">{property.price}</p>
                    </div>
                    <div className="flex gap-2">
                      <span className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-all flex items-center space-x-1">
                        <Eye size={16} />
                        <span>View</span>
                      </span>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Share Modal */}
      {showShareModal && shareProperty && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Share Property</h3>
                <button
                  onClick={() => setShowShareModal(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 mb-6">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-1">{shareProperty.title}</h4>
                <p className="text-gray-500 text-sm">{shareProperty.location}</p>
                <p className="text-red-600 font-bold mt-2">{shareProperty.price}</p>
              </div>

              <div className="space-y-3">
                <button
                  onClick={copyLink}
                  className="w-full flex items-center justify-center space-x-3 p-4 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-xl transition-colors"
                >
                  {copied ? <Check size={20} className="text-green-500" /> : <Copy size={20} />}
                  <span className="font-medium">{copied ? 'Copied!' : 'Copy Link'}</span>
                </button>

                <button
                  onClick={shareViaWhatsApp}
                  className="w-full flex items-center justify-center space-x-3 p-4 bg-green-500 hover:bg-green-600 text-white rounded-xl transition-colors"
                >
                  <MessageCircle size={20} />
                  <span className="font-medium">Share via WhatsApp</span>
                </button>

                <button
                  onClick={shareViaEmail}
                  className="w-full flex items-center justify-center space-x-3 p-4 bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition-colors"
                >
                  <Mail size={20} />
                  <span className="font-medium">Share via Email</span>
                </button>

                <div className="flex gap-3">
                  <button
                    onClick={shareViaFacebook}
                    className="flex-1 flex items-center justify-center space-x-2 p-4 bg-[#1877F2] hover:bg-[#1864D9] text-white rounded-xl transition-colors"
                  >
                    <Facebook size={20} />
                    <span className="font-medium">Facebook</span>
                  </button>
                  <button
                    onClick={shareViaTwitter}
                    className="flex-1 flex items-center justify-center space-x-2 p-4 bg-[#1DA1F2] hover:bg-[#1A91DA] text-white rounded-xl transition-colors"
                  >
                    <Twitter size={20} />
                    <span className="font-medium">Twitter</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Clear All Confirmation Modal */}
      {showClearConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-sm p-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 size={32} className="text-red-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Clear All Favorites?</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                This will remove all {favorites.length} properties from your favorites. This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowClearConfirm(false)}
                  className="flex-1 py-3 px-4 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    clearAllFavorites()
                    setShowClearConfirm(false)
                  }}
                  className="flex-1 py-3 px-4 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition-colors"
                >
                  Clear All
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Schedule Visit Modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-lg my-8">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
                  <Calendar className="mr-2 text-red-500" size={24} />
                  Schedule Visits
                </h3>
                <button
                  onClick={() => setShowScheduleModal(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {scheduleSuccess ? (
                <div className="text-center py-8">
                  <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check size={40} className="text-green-500" />
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Visit Scheduled!</h4>
                  <p className="text-gray-600 dark:text-gray-400">
                    We'll contact you shortly to confirm your visit schedule.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleScheduleSubmit} className="space-y-4">
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 mb-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Scheduling visits for:</p>
                    <div className="flex flex-wrap gap-2">
                      {favorites.slice(0, 3).map(p => (
                        <span key={p.id} className="text-xs bg-red-100 dark:bg-red-900/30 text-red-600 px-2 py-1 rounded-full">
                          {p.title.slice(0, 20)}...
                        </span>
                      ))}
                      {favorites.length > 3 && (
                        <span className="text-xs bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-2 py-1 rounded-full">
                          +{favorites.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name *</label>
                      <div className="relative">
                        <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          type="text"
                          required
                          value={scheduleForm.name}
                          onChange={(e) => setScheduleForm({ ...scheduleForm, name: e.target.value })}
                          className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-red-500"
                          placeholder="Your name"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone Number *</label>
                      <div className="relative">
                        <Phone size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          type="tel"
                          required
                          value={scheduleForm.phone}
                          onChange={(e) => setScheduleForm({ ...scheduleForm, phone: e.target.value })}
                          className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-red-500"
                          placeholder="+91 9876543210"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Address *</label>
                    <div className="relative">
                      <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="email"
                        required
                        value={scheduleForm.email}
                        onChange={(e) => setScheduleForm({ ...scheduleForm, email: e.target.value })}
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-red-500"
                        placeholder="you@example.com"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Preferred Date *</label>
                      <div className="relative">
                        <Calendar size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          type="date"
                          required
                          value={scheduleForm.date}
                          onChange={(e) => setScheduleForm({ ...scheduleForm, date: e.target.value })}
                          min={new Date().toISOString().split('T')[0]}
                          className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-red-500"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Preferred Time *</label>
                      <div className="relative">
                        <Clock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <select
                          required
                          value={scheduleForm.time}
                          onChange={(e) => setScheduleForm({ ...scheduleForm, time: e.target.value })}
                          className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-red-500"
                        >
                          <option value="">Select time</option>
                          <option value="09:00">9:00 AM</option>
                          <option value="10:00">10:00 AM</option>
                          <option value="11:00">11:00 AM</option>
                          <option value="12:00">12:00 PM</option>
                          <option value="14:00">2:00 PM</option>
                          <option value="15:00">3:00 PM</option>
                          <option value="16:00">4:00 PM</option>
                          <option value="17:00">5:00 PM</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Additional Message</label>
                    <textarea
                      rows={3}
                      value={scheduleForm.message}
                      onChange={(e) => setScheduleForm({ ...scheduleForm, message: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-red-500 resize-none"
                      placeholder="Any specific requirements or questions..."
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-red-600 hover:bg-red-700 text-white py-4 rounded-xl font-semibold transition-colors flex items-center justify-center space-x-2"
                  >
                    <Calendar size={20} />
                    <span>Schedule Visit</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Contact Sellers Modal */}
      {showContactModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-lg my-8">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
                  <MessageCircle className="mr-2 text-blue-500" size={24} />
                  Contact Sellers
                </h3>
                <button
                  onClick={() => setShowContactModal(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {contactSuccess ? (
                <div className="text-center py-8">
                  <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check size={40} className="text-green-500" />
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Message Sent!</h4>
                  <p className="text-gray-600 dark:text-gray-400">
                    Sellers will get back to you within 24 hours.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 mb-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Contacting sellers for:</p>
                    <div className="flex flex-wrap gap-2">
                      {favorites.slice(0, 3).map(p => (
                        <span key={p.id} className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-600 px-2 py-1 rounded-full">
                          {p.title.slice(0, 20)}...
                        </span>
                      ))}
                      {favorites.length > 3 && (
                        <span className="text-xs bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-2 py-1 rounded-full">
                          +{favorites.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name *</label>
                    <div className="relative">
                      <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        required
                        value={contactForm.name}
                        onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500"
                        placeholder="Your name"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone Number *</label>
                      <div className="relative">
                        <Phone size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          type="tel"
                          required
                          value={contactForm.phone}
                          onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                          className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500"
                          placeholder="+91 9876543210"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Address *</label>
                      <div className="relative">
                        <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          type="email"
                          required
                          value={contactForm.email}
                          onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                          className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500"
                          placeholder="you@example.com"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Your Message *</label>
                    <textarea
                      rows={4}
                      required
                      value={contactForm.message}
                      onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 resize-none"
                      placeholder="Hi, I'm interested in these properties. Please share more details about pricing, availability, and any offers..."
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-semibold transition-colors flex items-center justify-center space-x-2"
                  >
                    <Send size={20} />
                    <span>Send Message</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      {favorites.length > 0 && (
        <div className="bg-gradient-to-r from-red-600 to-pink-600 rounded-xl p-6 text-white">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold mb-2">Love these properties?</h3>
              <p className="text-red-100">Schedule visits or contact sellers directly</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowScheduleModal(true)}
                className="bg-white text-red-600 hover:bg-red-50 px-6 py-3 rounded-lg font-semibold transition-all flex items-center space-x-2"
              >
                <Calendar size={18} />
                <span>Schedule Visits</span>
              </button>
              <button
                onClick={() => setShowContactModal(true)}
                className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-6 py-3 rounded-lg font-semibold transition-all flex items-center space-x-2"
              >
                <MessageCircle size={18} />
                <span>Contact Sellers</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
