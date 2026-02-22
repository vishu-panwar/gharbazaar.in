'use client'

import { useEffect, useMemo, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import {
  ArrowLeft,
  Calendar,
  CheckCircle,
  MapPin,
  MessageSquare,
  Phone,
  Send,
  Star,
  User,
} from 'lucide-react'
import toast from 'react-hot-toast'
import { backendApi } from '@/lib/backendApi'

type ProviderProfile = {
  id: string
  userId?: string
  category?: string
  specialization?: string
  description?: string
  location?: string
  rating?: number
  reviews?: number
  completedProjects?: number
  hourlyRate?: number
  verified?: boolean
  available?: boolean
  skills?: string[]
  portfolio?: string[]
  experience?: number
  user?: {
    name?: string
    email?: string
    phone?: string
  }
}

export default function ProviderProfilePage() {
  const params = useParams()
  const router = useRouter()
  const providerId = String(params.id || '')

  const [provider, setProvider] = useState<ProviderProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [bookingOpen, setBookingOpen] = useState(false)
  const [submittingBooking, setSubmittingBooking] = useState(false)
  const [chatLoading, setChatLoading] = useState(false)

  const [bookingForm, setBookingForm] = useState({
    name: '',
    phone: '',
    address: '',
    preferredDate: '',
    notes: '',
  })

  useEffect(() => {
    let mounted = true

    const loadProvider = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await backendApi.serviceProvider.getById(providerId)
        const record = response?.data || response?.provider || null

        if (!mounted) return
        if (!record) {
          setError('Provider not found')
          return
        }

        setProvider(record)
      } catch (err: any) {
        if (!mounted) return
        setError(err?.message || 'Failed to load provider profile')
      } finally {
        if (mounted) setLoading(false)
      }
    }

    if (providerId) {
      loadProvider()
    } else {
      setError('Invalid provider id')
      setLoading(false)
    }

    return () => {
      mounted = false
    }
  }, [providerId])

  const profileTitle = useMemo(() => provider?.user?.name || 'Service Provider', [provider])

  const handleCall = () => {
    if (!provider?.user?.phone) {
      toast.error('Phone number not available')
      return
    }
    window.location.href = `tel:${provider.user.phone}`
  }

  const handleChat = async () => {
    if (!provider?.userId) {
      toast.error('Unable to start chat with this provider')
      return
    }

    try {
      setChatLoading(true)
      const response = await backendApi.chat.createConversation({
        otherUserId: provider.userId,
        type: 'direct',
      })

      if (!response?.success) {
        throw new Error(response?.error || 'Unable to start conversation')
      }

      const conversationId =
        response?.data?.conversation?.id ||
        response?.data?.id ||
        ''

      if (!conversationId) {
        throw new Error('Conversation id not returned by server')
      }

      router.push(`/dashboard/messages?id=${conversationId}`)
    } catch (err: any) {
      toast.error(err?.message || 'Failed to start chat')
    } finally {
      setChatLoading(false)
    }
  }

  const handleBookProvider = async () => {
    if (!provider) return
    if (!bookingForm.name || !bookingForm.phone || !bookingForm.address || !bookingForm.notes) {
      toast.error('Please fill all required booking details')
      return
    }

    try {
      setSubmittingBooking(true)
      const response = await backendApi.serviceProvider.book(provider.id, {
        formData: bookingForm,
        message: bookingForm.notes,
      })

      if (!response?.success) {
        throw new Error(response?.error || 'Booking request failed')
      }

      toast.success('Booking request sent successfully')
      const conversationId = response?.data?.conversationId
      setBookingOpen(false)
      setBookingForm({
        name: '',
        phone: '',
        address: '',
        preferredDate: '',
        notes: '',
      })

      if (conversationId) {
        router.push(`/dashboard/messages?id=${encodeURIComponent(conversationId)}`)
      }
    } catch (err: any) {
      toast.error(err?.message || 'Failed to submit booking request')
    } finally {
      setSubmittingBooking(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (error || !provider) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 text-center max-w-md">
          <p className="text-red-600 dark:text-red-400">{error || 'Provider not found'}</p>
          <button
            onClick={() => router.back()}
            className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
          >
            Go Back
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
      >
        <ArrowLeft size={18} />
        <span>Back to Providers</span>
      </button>

      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden">
        <div className="h-28 bg-gradient-to-r from-blue-600 to-indigo-700" />

        <div className="px-6 pb-6">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between -mt-10 gap-4">
            <div className="flex items-end gap-4">
              <div className="w-20 h-20 rounded-2xl bg-blue-600 text-white flex items-center justify-center text-2xl font-bold border-4 border-white dark:border-gray-900">
                {profileTitle.charAt(0).toUpperCase()}
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{profileTitle}</h1>
                  {provider.verified && <CheckCircle size={18} className="text-blue-600" />}
                </div>
                <p className="text-gray-600 dark:text-gray-400">
                  {provider.specialization || provider.category || 'Service Professional'}
                </p>
                <div className="mt-1 flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                  <span className="inline-flex items-center gap-1">
                    <Star size={14} className="text-yellow-500" />
                    {Number(provider.rating || 0).toFixed(1)} ({provider.reviews || 0} reviews)
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <MapPin size={14} />
                    {provider.location || 'Location not set'}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={handleCall}
                className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg"
              >
                <Phone size={16} />
                <span>Call</span>
              </button>
              <button
                onClick={handleChat}
                disabled={chatLoading}
                className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg disabled:opacity-60"
              >
                <MessageSquare size={16} />
                <span>{chatLoading ? 'Starting...' : 'Chat'}</span>
              </button>
              <button
                onClick={() => setBookingOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
              >
                <Calendar size={16} />
                <span>Book Service</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-3">
              <p className="text-xs text-gray-500 dark:text-gray-400">Hourly Rate</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">Rs {Number(provider.hourlyRate || 0).toLocaleString()}</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-3">
              <p className="text-xs text-gray-500 dark:text-gray-400">Experience</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">{provider.experience || 0} yrs</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-3">
              <p className="text-xs text-gray-500 dark:text-gray-400">Projects</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">{provider.completedProjects || 0}</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-3">
              <p className="text-xs text-gray-500 dark:text-gray-400">Availability</p>
              <p className={`text-lg font-semibold ${provider.available ? 'text-green-600' : 'text-amber-600'}`}>
                {provider.available ? 'Available' : 'Unavailable'}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">About</h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            {provider.description || 'No description shared by this provider yet.'}
          </p>

          <h3 className="text-base font-semibold text-gray-900 dark:text-white mt-6 mb-3">Skills</h3>
          {provider.skills && provider.skills.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {provider.skills.map((skill) => (
                <span
                  key={skill}
                  className="px-3 py-1 rounded-full text-sm bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300"
                >
                  {skill}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400">No skills listed.</p>
          )}
        </div>

        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Contact</h2>
          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-2">
              <User size={16} className="mt-0.5 text-gray-500" />
              <div>
                <p className="text-gray-500 dark:text-gray-400">Name</p>
                <p className="text-gray-900 dark:text-white">{provider.user?.name || 'Not available'}</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Phone size={16} className="mt-0.5 text-gray-500" />
              <div>
                <p className="text-gray-500 dark:text-gray-400">Phone</p>
                <p className="text-gray-900 dark:text-white">{provider.user?.phone || 'Not available'}</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <MapPin size={16} className="mt-0.5 text-gray-500" />
              <div>
                <p className="text-gray-500 dark:text-gray-400">Location</p>
                <p className="text-gray-900 dark:text-white">{provider.location || 'Not available'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {bookingOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl max-w-xl w-full">
            <div className="p-5 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Book {profileTitle}</h3>
              <button
                onClick={() => setBookingOpen(false)}
                className="text-gray-500 hover:text-gray-800 dark:hover:text-gray-200"
              >
                x
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  value={bookingForm.name}
                  onChange={(event) => setBookingForm((prev) => ({ ...prev, name: event.target.value }))}
                  placeholder="Your name"
                  className="px-3 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg"
                />
                <input
                  value={bookingForm.phone}
                  onChange={(event) => setBookingForm((prev) => ({ ...prev, phone: event.target.value }))}
                  placeholder="Phone number"
                  className="px-3 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg"
                />
              </div>

              <input
                value={bookingForm.address}
                onChange={(event) => setBookingForm((prev) => ({ ...prev, address: event.target.value }))}
                placeholder="Property address"
                className="w-full px-3 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg"
              />

              <input
                type="date"
                value={bookingForm.preferredDate}
                onChange={(event) => setBookingForm((prev) => ({ ...prev, preferredDate: event.target.value }))}
                className="w-full px-3 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg"
              />

              <textarea
                rows={4}
                value={bookingForm.notes}
                onChange={(event) => setBookingForm((prev) => ({ ...prev, notes: event.target.value }))}
                placeholder="Describe your requirement"
                className="w-full px-3 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg resize-none"
              />

              <div className="flex gap-3">
                <button
                  onClick={() => setBookingOpen(false)}
                  className="flex-1 px-4 py-2.5 bg-gray-100 dark:bg-gray-800 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={handleBookProvider}
                  disabled={submittingBooking}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg disabled:opacity-60"
                >
                  <Send size={16} />
                  <span>{submittingBooking ? 'Submitting...' : 'Submit Request'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}


