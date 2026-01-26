'use client'

import { useRouter } from 'next/navigation'
import {
    MapPin,
    Bed,
    Bath,
    Square,
    Heart,
    Eye,
    Home,
    Star,
    CheckCircle
} from 'lucide-react'
import { useFavorites } from '@/contexts/FavoritesContext'
import { usePayment } from '@/contexts/PaymentContext'

// Property Interface
export interface Property {
    id: number
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
}

interface PropertyCardProps {
    property: Property
    onToggleFavorite?: (id: number) => void
    viewMode?: 'grid' | 'list'
}

export default function PropertyCard({
    property,
    onToggleFavorite,
    viewMode = 'grid'
}: PropertyCardProps) {
    const router = useRouter()
    const { isFavorite, toggleFavorite } = useFavorites()
    const { hasPaid } = usePayment()
    const isPropertyFavorited = isFavorite(property.id)

    const handleCardClick = (e: React.MouseEvent) => {
        e.preventDefault()
        if (hasPaid) {
            router.push(`/dashboard/browse/${property.id}`)
        } else {
            router.push('/dashboard/pricing')
        }
    }

    const handleFavoriteClick = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        // Use context's toggleFavorite directly
        toggleFavorite(property)
        // Also call parent callback if provided
        onToggleFavorite?.(property.id)
    }


    // List View
    if (viewMode === 'list') {
        return (
            <div
                onClick={handleCardClick}
                className="group bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 overflow-hidden hover:shadow-2xl hover:border-blue-500 transition-all duration-300 cursor-pointer"
            >
                <div className="flex flex-col md:flex-row">
                    {/* Image */}
                    <div className="relative w-full md:w-80 h-56 md:h-auto flex-shrink-0 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 overflow-hidden">
                        <div className="absolute inset-0 flex items-center justify-center">
                            <Home size={64} className="text-gray-400" />
                        </div>

                        {/* Badges */}
                        <div className="absolute top-3 left-3 flex flex-col gap-2">
                            <div className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center space-x-1 ${property.listingType === 'rent'
                                ? 'bg-purple-500 text-white'
                                : 'bg-blue-500 text-white'
                                }`}>
                                <span>{property.listingType === 'rent' ? 'FOR RENT' : 'FOR SALE'}</span>
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

                        {/* Favorite Button */}
                        <button
                            onClick={handleFavoriteClick}
                            className="absolute top-3 right-3 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-all z-10"
                        >
                            <Heart
                                size={20}
                                className={isPropertyFavorited ? 'fill-red-500 text-red-500' : 'text-gray-600'}
                            />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 p-5">
                        <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors mb-1">
                                    {property.title}
                                </h3>
                                <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm">
                                    <MapPin size={14} className="mr-1" />
                                    <span>{property.location}</span>
                                </div>
                            </div>
                            <div className="flex items-center space-x-1 text-yellow-500 ml-4">
                                <Star size={14} className="fill-current" />
                                <span className="text-sm font-semibold">{property.rating}</span>
                            </div>
                        </div>

                        {/* Property Details */}
                        <div className="flex items-center space-x-4 mb-4 text-sm text-gray-600 dark:text-gray-400">
                            <div className="flex items-center bg-gray-100 dark:bg-gray-800 px-3 py-1.5 rounded-lg">
                                <Bed size={16} className="mr-1 text-blue-500" />
                                <span>{property.beds} Beds</span>
                            </div>
                            <div className="flex items-center bg-gray-100 dark:bg-gray-800 px-3 py-1.5 rounded-lg">
                                <Bath size={16} className="mr-1 text-blue-500" />
                                <span>{property.baths} Baths</span>
                            </div>
                            <div className="flex items-center bg-gray-100 dark:bg-gray-800 px-3 py-1.5 rounded-lg">
                                <Square size={16} className="mr-1 text-blue-500" />
                                <span>{property.area}</span>
                            </div>
                            <div className="flex items-center bg-gray-100 dark:bg-gray-800 px-3 py-1.5 rounded-lg">
                                <Eye size={14} className="mr-1 text-gray-400" />
                                <span>{property.views}</span>
                            </div>
                        </div>

                        {/* Price & CTA */}
                        <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                            <div>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Price</p>
                                <p className="text-xl font-bold text-blue-600">{property.price}</p>
                            </div>
                            <span className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium transition-all inline-block">
                                View Details
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    // Grid View (default)
    return (
        <div
            onClick={handleCardClick}
            className="group bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 overflow-hidden hover:shadow-2xl hover:border-blue-500 transition-all duration-300 cursor-pointer"
        >
            {/* Image */}
            <div className="relative h-56 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                    <Home size={64} className="text-gray-400" />
                </div>

                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-2">
                    {/* Sale/Rent Badge */}
                    <div className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center space-x-1 ${property.listingType === 'rent'
                        ? 'bg-purple-500 text-white'
                        : 'bg-blue-500 text-white'
                        }`}>
                        <span>{property.listingType === 'rent' ? 'FOR RENT' : 'FOR SALE'}</span>
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

                {/* Favorite Button */}
                <button
                    onClick={handleFavoriteClick}
                    className="absolute top-3 right-3 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-all z-10"
                >
                    <Heart
                        size={20}
                        className={isPropertyFavorited ? 'fill-red-500 text-red-500' : 'text-gray-600'}
                    />
                </button>

                {/* Views */}
                <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs flex items-center space-x-1">
                    <Eye size={12} />
                    <span>{property.views}</span>
                </div>
            </div>

            {/* Content */}
            <div className="p-5">
                <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors mb-1">
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
                        <p className="text-xl font-bold text-blue-600">{property.price}</p>
                    </div>
                    <span className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium transition-all inline-block">
                        View Details
                    </span>
                </div>
            </div>
        </div>
    )
}
