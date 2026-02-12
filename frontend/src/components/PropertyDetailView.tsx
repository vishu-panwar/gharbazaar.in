'use client'

import { useState, useEffect, useRef } from 'react'
import { useParams, useRouter, usePathname } from 'next/navigation'
import { propertyApi, bidApi } from '@/lib/api'
import { MapPin, Home, Bed, Bath, Maximize, Calendar, Eye, ArrowLeft, Lock, Star, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import { usePayment } from '@/contexts/PaymentContext'
import { useAuth } from '@/contexts/AuthContext'
import { useModal } from '@/contexts/ModalContext'
import { useSocket } from '@/contexts/SocketContext'

interface PropertyDetailViewProps {
    isDashboard?: boolean
    backPath?: string
}

export default function PropertyDetailView({ isDashboard = false, backPath = '/listings' }: PropertyDetailViewProps) {
    const params = useParams()
    const router = useRouter()
    const pathname = usePathname()
    const { hasPaid, hasFeature } = usePayment()
    const { user } = useAuth()
    const { showAlert } = useModal()
    const { onPropertyViewUpdate } = useSocket()
    const [listing, setListing] = useState<any>(null)
    const [liveViews, setLiveViews] = useState(0)
    const [loading, setLoading] = useState(true)
    const [bidAmount, setBidAmount] = useState('')
    const [bidMessage, setBidMessage] = useState('')
    const [submitting, setSubmitting] = useState(false)
    const trackedRef = useRef<string | null>(null)

    useEffect(() => {
        if (params.id) {
            fetchListing()
        }
    }, [params.id])

    const fetchListing = async () => {
        try {
            setLoading(true)
            const response = await propertyApi.getById(params.id as string)
            const data = response?.data || response
            setListing(data)
            setLiveViews(data?.views || 0)
            if (data?.price) {
                setBidAmount(data.price.toString())
            }

            // Track real-time view (Deduplicated)
            if (params.id && trackedRef.current !== params.id) {
                trackedRef.current = params.id as string
                propertyApi.trackView(params.id as string).catch(console.error)
            }
        } catch (error) {
            console.error('Failed to fetch listing:', error)
        } finally {
            setLoading(false)
        }
    }

    // Subscribe to real-time view updates
    useEffect(() => {
        if (!params.id) return

        const unsubscribe = onPropertyViewUpdate((data) => {
            if (data.propertyId === params.id) {
                setLiveViews(data.views)
            }
        })

        return () => {
            if (unsubscribe) unsubscribe()
        }
    }, [params.id, onPropertyViewUpdate])

    const handlePlaceBid = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            setSubmitting(true)
            await bidApi.placeBid({
                propertyId: listing.id || listing._id,
                amount: Number(bidAmount),
                message: bidMessage
            })
            showAlert({
                title: 'Inquiry Sent',
                message: 'Your inquiry has been sent to the owner successfully!',
                type: 'success'
            })
            setBidMessage('')
        } catch (error: any) {
            showAlert({
                title: 'Submission Failed',
                message: error.response?.data?.error || 'Failed to send inquiry. Please login first.',
                type: 'error'
            })
        } finally {
            setSubmitting(false)
        }
    }

    const formatPrice = (price: number, category: string) => {
        if (category === 'rent') {
            return `₹${price.toLocaleString('en-IN')}/month`
        }
        if (price >= 10000000) {
            return `₹${(price / 10000000).toFixed(2)} Crore`
        }
        if (price >= 100000) {
            return `₹${(price / 100000).toFixed(2)} Lakh`
        }
        return `₹${price.toLocaleString('en-IN')}`
    }

    if (loading) {
        return (
            <div className="min-h-[50vh] flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-gray-600 dark:text-gray-400">Loading property...</p>
                </div>
            </div>
        )
    }

    if (!listing) {
        return (
            <div className="min-h-[50vh] flex items-center justify-center">
                <div className="text-center">
                    <p className="text-gray-600 dark:text-gray-400 mb-4">Property not found</p>
                    <button onClick={() => router.push(backPath)} className="btn-primary">
                        Go Back
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className={`${isDashboard ? '' : 'min-h-screen bg-gray-50 dark:bg-gray-950 py-8'}`}>
            <div className={`${isDashboard ? '' : 'container mx-auto px-4'}`}>
                {/* Back Button */}
                <button
                    onClick={() => router.push(backPath)}
                    className="inline-flex items-center text-primary-600 hover:underline mb-6 group"
                >
                    <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform" />
                    Back
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Image Gallery */}
                        <div className="aspect-video bg-gray-200 dark:bg-gray-800 rounded-2xl overflow-hidden relative shadow-inner">
                            {listing.featured && (
                                <span className="absolute top-4 right-4 bg-accent-500 text-white px-3 py-1 rounded-lg z-10 flex items-center space-x-1 shadow-lg">
                                    <Star size={16} className="fill-current" />
                                    <span className="font-bold text-xs">Featured</span>
                                </span>
                            )}
                            {listing.isVerified && (
                                <span className="absolute top-4 left-4 bg-green-500 text-white px-3 py-1 rounded-lg z-10 flex items-center space-x-1 shadow-lg">
                                    <CheckCircle size={16} />
                                    <span className="font-bold text-xs">Verified</span>
                                </span>
                            )}
                            <div className="w-full h-full flex items-center justify-center">
                                {listing.images?.[0] ? (
                                    <img src={listing.images[0]} alt={listing.title} className="w-full h-full object-cover" />
                                ) : (
                                    <Home size={96} className="text-gray-400 opacity-50" />
                                )}
                            </div>
                        </div>

                        {/* Title and Price */}
                        <div className="space-y-4">
                            <h1 className="font-heading font-bold text-3xl md:text-4xl text-gray-900 dark:text-white">
                                {listing.title}
                            </h1>
                            <div className="flex flex-wrap items-center justify-between gap-4">
                                <p className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
                                    {formatPrice(listing.price, listing.category)}
                                </p>
                                <div className="flex items-center bg-gray-100 dark:bg-gray-800 px-3 py-1.5 rounded-lg text-gray-600 dark:text-gray-400">
                                    <Eye size={18} className="mr-2" />
                                    <span className="font-medium">{liveViews} views</span>
                                </div>
                            </div>
                            <div className="flex items-center text-gray-600 dark:text-gray-400">
                                <MapPin size={20} className="mr-2 text-primary-500" />
                                <span className={hasPaid ? '' : 'blur-sm select-none'}>
                                    {hasPaid ? (
                                        `${listing.location?.address || 'N/A'}, ${listing.location?.city || 'N/A'}`
                                    ) : (
                                        'Address hidden, buy a plan to see location'
                                    )}
                                </span>
                            </div>
                        </div>

                        {/* Property Specs */}
                        <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-xl border border-gray-100 dark:border-gray-800">
                            <h2 className="font-heading font-bold text-xl mb-6 text-gray-900 dark:text-white">Property Details</h2>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600">
                                        <Bed size={20} />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Beds</p>
                                        <p className="font-bold text-gray-900 dark:text-white">{listing.bedrooms || listing.beds || 0}</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center text-purple-600">
                                        <Bath size={20} />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Baths</p>
                                        <p className="font-bold text-gray-900 dark:text-white">{listing.bathrooms || listing.baths || 0}</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 rounded-xl bg-green-50 dark:bg-green-900/30 flex items-center justify-center text-green-600">
                                        <Maximize size={20} />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Area</p>
                                        <p className="font-bold text-gray-900 dark:text-white">{listing.area || 'N/A'}</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 rounded-xl bg-orange-50 dark:bg-orange-900/30 flex items-center justify-center text-orange-600">
                                        <Calendar size={20} />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Status</p>
                                        <p className="font-bold text-gray-900 dark:text-white capitalize">{listing.status}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-xl border border-gray-100 dark:border-gray-800">
                            <h2 className="font-heading font-bold text-xl mb-4 text-gray-900 dark:text-white">Description</h2>
                            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line leading-relaxed">
                                {listing.description}
                            </p>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Place Bid */}
                        <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-2xl border border-gray-100 dark:border-gray-800 sticky top-24">
                            <h2 className="font-heading font-bold text-xl mb-6 text-gray-900 dark:text-white">Place Your Bid</h2>
                            {hasFeature('contactAccess') ? (
                                <form onSubmit={handlePlaceBid} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Bid Amount (₹)</label>
                                        <input
                                            type="number"
                                            className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary-500 transition-all font-bold text-lg"
                                            value={bidAmount}
                                            onChange={(e) => setBidAmount(e.target.value)}
                                            min={listing.price}
                                            required
                                        />
                                        <p className="text-xs text-gray-500 mt-2 italic font-medium">
                                            Minimum base: ₹{listing.price?.toLocaleString('en-IN')}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Message (Optional)</label>
                                        <textarea
                                            className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary-500 transition-all resize-none"
                                            rows={4}
                                            value={bidMessage}
                                            onChange={(e) => setBidMessage(e.target.value)}
                                            placeholder="I'm interested in this property..."
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        className="w-full bg-gradient-to-r from-primary-600 to-purple-600 hover:from-primary-700 hover:to-purple-700 text-white py-4 rounded-xl font-bold shadow-lg hover:shadow-primary-500/25 transition-all disabled:opacity-50"
                                        disabled={submitting}
                                    >
                                        {submitting ? 'Sending Request...' : 'Send Inquiry'}
                                    </button>
                                </form>
                            ) : (
                                <div className="text-center py-6">
                                    <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mx-auto mb-4 text-primary-600">
                                        <Lock size={32} />
                                    </div>
                                    <h3 className="font-bold text-gray-900 dark:text-white mb-2">Premium Feature</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                                        Contact seller and send inquiries are restricted to plan members. Upgrade to unlock this feature.
                                    </p>
                                    <Link
                                        href={isDashboard || user ? "/dashboard/pricing" : "/pricing"}
                                        className="w-full bg-gradient-to-r from-primary-600 to-purple-600 text-white py-3 rounded-xl font-bold shadow-lg inline-block transition-all"
                                    >
                                        Upgrade Now
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* Owner Info */}
                        <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-xl border border-gray-100 dark:border-gray-800">
                            <h3 className="font-bold text-gray-900 dark:text-white mb-4">Posted By</h3>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 font-bold">
                                    {listing.owner?.name?.[0] || 'O'}
                                </div>
                                <div>
                                    <p className="font-bold text-gray-900 dark:text-white">{listing.owner?.name || 'Owner'}</p>
                                    {listing.owner?.isVerified && (
                                        <p className="text-xs text-green-600 font-bold flex items-center gap-1">
                                            <CheckCircle size={12} /> Verified Seller
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
