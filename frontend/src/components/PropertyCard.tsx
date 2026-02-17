'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import {
    MapPin,
    Bed,
    Bath,
    Square,
    Heart,
    Eye,
    Home,
    Star,
    CheckCircle,
    Clock,
    XCircle,
    AlertCircle,
    Pause
} from 'lucide-react'

import { useFavorites } from '@/contexts/FavoritesContext'
import { usePayment } from '@/contexts/PaymentContext'
import { useAuth } from '@/contexts/AuthContext'
import { useSocket } from '@/contexts/SocketContext'
import { useLocale } from '@/contexts/LocaleContext'

// Property Interface
export interface Property {
    id?: number
    _id?: string
    title: string
    location: string
    price: string
    priceValue: number
    listingType: string
    type: string
    beds: number
    baths: number
    area: string
    image: string
    featured: boolean
    verified: boolean
    views: number
    rating: number
    isFavorite: boolean
    status?: 'active' | 'pending' | 'rejected' | 'sold' | 'inactive' | 'paused' | 'cancelled'
}

interface PropertyCardProps {
    property: Property
    onToggleFavorite?: (id: string | number) => void
    viewMode?: 'grid' | 'list'
}

export default function PropertyCard({
    property,
    onToggleFavorite,
    viewMode = 'grid'
}: PropertyCardProps) {
    const router = useRouter()
    const pathname = usePathname()

    const { isFavorite, toggleFavorite } = useFavorites()
    const { hasPaid, hasFeature } = usePayment()
    const { user } = useAuth()
    const { onPropertyViewUpdate } = useSocket()
    const { formatPrice } = useLocale()
    const [liveViews, setLiveViews] = useState(property.views || 0)

    const propertyId = property._id || property.id

    // Format price using LocaleContext if priceValue exists
    const displayPrice = property.priceValue ? formatPrice(property.priceValue) : property.price

    // Update live views count from socket
    useEffect(() => {
        if (!propertyId) return

        const unsubscribe = onPropertyViewUpdate((data) => {
            if (data.propertyId === propertyId.toString()) {
                setLiveViews(data.views)
            }
        })

        return () => {
            if (unsubscribe) unsubscribe()
        }
    }, [propertyId, onPropertyViewUpdate])

    // Update local state if property prop changes (e.g. on initial load)
    useEffect(() => {
        if (property.views !== undefined) {
            setLiveViews(property.views)
        }
    }, [property.views])
    const isPropertyFavorited = isFavorite(propertyId)

    const handleCardClick = (e: React.MouseEvent) => {
        e.preventDefault()
        if (!propertyId) return

        // 🔐 Buyer plan check
        if (!hasPaid) {
            router.push('/dashboard/pricing')
            return
        }

        // ⚠️ Feature-level soft restriction
        if (!hasFeature?.('contactAccess')) {
            console.warn('Limited access: contact feature not available')
            // Allow viewing but restrict actions inside detail page
        }

        // 🧭 Context-aware routing
        if (pathname.includes('/dashboard') || user) {
            const targetPath = pathname.includes('/dashboard/listings')
                ? `/dashboard/listings/${propertyId}`
                : `/dashboard/browse/${propertyId}`
            router.push(targetPath)
        } else {
            router.push(`/listings/${propertyId}`)
        }
    }

    const handleFavoriteClick = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()

        toggleFavorite(property)

        if (propertyId) {
            onToggleFavorite?.(propertyId)
        }
    }

    // =========================
    // LIST VIEW
    // =========================
    if (viewMode === 'list') {
        return (
            <div
                onClick={handleCardClick}
                className="group bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 overflow-hidden hover:shadow-2xl hover:border-blue-500 transition-all duration-300 cursor-pointer"
            >
                <div className="flex flex-col md:flex-row">
                    {/* Image */}
                    <div className="relative w-full md:w-80 h-56 md:h-auto bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 overflow-hidden">
                        {property.image ? (
                            <img
                                src={property.image}
                                alt={property.title}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                        ) : (
                            <div className="absolute inset-0 flex items-center justify-center">
                                <Home size={64} className="text-gray-400" />
                            </div>
                        )}

                        {/* Badges */}
                        <div className="absolute top-3 left-3 flex flex-col gap-2">
                            <div className={`px-3 py-1 rounded-full text-xs font-semibold ${property.listingType === 'rent'
                                ? 'bg-purple-500 text-white'
                                : 'bg-blue-500 text-white'
                                }`}>
                                {property.listingType === 'rent' ? 'FOR RENT' : 'FOR SALE'}
                            </div>

                            {property.featured && (
                                <div className="bg-yellow-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                                    <Star size={12} /> Featured
                                </div>
                            )}

                            {property.verified && (
                                <div className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 shadow-md">
                                    <CheckCircle size={12} /> Verified
                                </div>
                            )}

                            {property.status && property.status !== 'active' && (
                                <div className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 shadow-md ${property.status === 'pending' ? 'bg-yellow-500 text-white' :
                                    property.status === 'rejected' ? 'bg-red-500 text-white' :
                                        property.status === 'inactive' || property.status === 'paused' ? 'bg-amber-500 text-white' :
                                            property.status === 'cancelled' ? 'bg-gray-600 text-white' :
                                                'bg-gray-500 text-white'
                                    }`}>
                                    {property.status === 'pending' ? <Clock size={12} /> :
                                        property.status === 'rejected' ? <XCircle size={12} /> :
                                            property.status === 'inactive' || property.status === 'paused' ? <Pause size={12} /> :
                                                <AlertCircle size={12} />}
                                    {property.status === 'inactive' || property.status === 'paused' ? 'PAUSED' :
                                        property.status === 'cancelled' ? 'CANCELLED' :
                                            property.status.toUpperCase()}
                                </div>
                            )}
                        </div>

                        {/* Favorite */}
                        <button
                            onClick={handleFavoriteClick}
                            className="absolute top-3 right-3 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center z-10"
                        >
                            <Heart
                                size={20}
                                className={isPropertyFavorited ? 'fill-red-500 text-red-500' : 'text-gray-600'}
                            />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 p-5">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                            {property.title}
                        </h3>

                        <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm mb-3">
                            <MapPin size={14} className="mr-1" />
                            {property.location}
                        </div>

                        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
                            <span className="flex items-center"><Bed size={14} className="mr-1" /> {property.beds}</span>
                            <span className="flex items-center"><Bath size={14} className="mr-1" /> {property.baths}</span>
                            <span className="flex items-center"><Square size={14} className="mr-1" /> {property.area}</span>
                            <span className="flex items-center"><Eye size={14} className="mr-1" /> {liveViews}</span>
                        </div>

                        <div className="flex justify-between items-center border-t pt-4">
                            <div>
                                <p className="text-xs text-gray-500">Price</p>
                                <p className="text-xl font-bold text-blue-600">{displayPrice}</p>
                            </div>
                            <span className="bg-blue-600 text-white px-6 py-2 rounded-lg">
                                View Details
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    // =========================
    // GRID VIEW (DEFAULT)
    // =========================
    return (
        <div
            onClick={handleCardClick}
            className="group bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 overflow-hidden hover:shadow-2xl hover:border-blue-500 transition-all duration-300 cursor-pointer"
        >
            {/* Image */}
            <div className="relative h-56 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 overflow-hidden">
                {property.image ? (
                    <img
                        src={property.image}
                        alt={property.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Home size={64} className="text-gray-400" />
                    </div>
                )}

                {/* Status Badges for Grid View */}
                <div className="absolute top-3 left-3 flex flex-col gap-2">
                    {property.status && property.status !== 'active' && (
                        <div className={`px-2 py-1 rounded-lg text-[10px] font-black tracking-wider flex items-center gap-1 shadow-lg ${property.status === 'pending' ? 'bg-yellow-500 text-white' :
                            property.status === 'rejected' ? 'bg-red-500 text-white' :
                                property.status === 'inactive' || property.status === 'paused' ? 'bg-amber-500 text-white' :
                                    property.status === 'cancelled' ? 'bg-gray-600 text-white' :
                                        'bg-gray-500 text-white'
                            }`}>
                            {property.status === 'pending' ? <Clock size={10} /> :
                                property.status === 'rejected' ? <XCircle size={10} /> :
                                    property.status === 'inactive' || property.status === 'paused' ? <Pause size={10} /> :
                                        <AlertCircle size={10} />}
                            {property.status === 'inactive' || property.status === 'paused' ? 'PAUSED' :
                                property.status === 'cancelled' ? 'CANCELLED' :
                                    property.status.toUpperCase()}
                        </div>
                    )}
                    {property.verified && (
                        <div className="bg-green-500 text-white px-2 py-1 rounded-lg text-[10px] font-black tracking-wider flex items-center gap-1 shadow-lg">
                            <CheckCircle size={10} /> VERIFIED
                        </div>
                    )}
                </div>

                {/* Favorite */}
                <button
                    onClick={handleFavoriteClick}
                    className="absolute top-3 right-3 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center z-10"
                >
                    <Heart
                        size={20}
                        className={isPropertyFavorited ? 'fill-red-500 text-red-500' : 'text-gray-600'}
                    />
                </button>

                <div className="absolute bottom-3 right-3 bg-black/60 text-white px-3 py-1 rounded-full text-xs flex items-center gap-1">
                    <Eye size={12} /> {liveViews}
                </div>
            </div>

            {/* Content */}
            <div className="p-5">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                    {property.title}
                </h3>

                <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm mb-3">
                    <MapPin size={14} className="mr-1" />
                    {property.location}
                </div>

                <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
                    <span className="flex items-center"><Bed size={14} className="mr-1" /> {property.beds}</span>
                    <span className="flex items-center"><Bath size={14} className="mr-1" /> {property.baths}</span>
                    <span className="flex items-center"><Square size={14} className="mr-1" /> {property.area}</span>
                </div>

                <div className="flex justify-between items-center border-t pt-4">
                    <div>
                        <p className="text-xs text-gray-500">Price</p>
                        <p className="text-xl font-bold text-blue-600">{displayPrice}</p>
                    </div>
                    <span className="bg-blue-600 text-white px-6 py-2 rounded-lg">
                        View Details
                    </span>
                </div>
            </div>
        </div>
    )
}
