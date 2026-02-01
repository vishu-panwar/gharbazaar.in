'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  MapPin,
  Bed,
  Bath,
  Square,
  Star,
  CheckCircle,
  Filter,
  List,
  Building2,
  Eye,
  Heart,
  Home,
  X
} from 'lucide-react'

// Property interface
interface Property {
  id: number
  title: string
  location: string
  price: string
  priceValue: number
  type: string
  beds: number
  baths: number
  area: string
  featured: boolean
  verified: boolean
  views: number
  rating: number
  isFavorite: boolean
  coordinates: {
    lat: number
    lng: number
  }
}

// Sample properties with coordinates
const properties: Property[] = [
  {
    id: 1,
    title: 'Luxury Penthouse',
    location: 'Worli, Mumbai',
    price: '₹8.5 Cr',
    priceValue: 85000000,
    type: 'Apartment',
    beds: 4,
    baths: 5,
    area: '3200 sq ft',
    featured: true,
    verified: true,
    views: 1234,
    rating: 4.8,
    isFavorite: false,
    coordinates: { lat: 19.0176, lng: 72.8562 }
  },
  {
    id: 2,
    title: 'Modern Villa',
    location: 'Whitefield, Bangalore',
    price: '₹3.8 Cr',
    priceValue: 38000000,
    type: 'Villa',
    beds: 5,
    baths: 6,
    area: '4500 sq ft',
    featured: true,
    verified: true,
    views: 892,
    rating: 4.9,
    isFavorite: true,
    coordinates: { lat: 12.9698, lng: 77.7500 }
  },
  {
    id: 3,
    title: 'Sea View Apartment',
    location: 'Marine Drive, Mumbai',
    price: '₹6.2 Cr',
    priceValue: 62000000,
    type: 'Apartment',
    beds: 3,
    baths: 4,
    area: '2800 sq ft',
    featured: false,
    verified: true,
    views: 2156,
    rating: 4.7,
    isFavorite: false,
    coordinates: { lat: 18.9441, lng: 72.8262 }
  },
  {
    id: 4,
    title: 'Garden Estate',
    location: 'Gurgaon, Delhi NCR',
    price: '₹5.2 Cr',
    priceValue: 52000000,
    type: 'Villa',
    beds: 4,
    baths: 5,
    area: '5000 sq ft',
    featured: false,
    verified: true,
    views: 678,
    rating: 4.6,
    isFavorite: false,
    coordinates: { lat: 28.4595, lng: 77.0266 }
  },
  {
    id: 5,
    title: 'Smart Home Apartment',
    location: 'Koramangala, Bangalore',
    price: '₹2.5 Cr',
    priceValue: 25000000,
    type: 'Apartment',
    beds: 3,
    baths: 3,
    area: '2200 sq ft',
    featured: false,
    verified: false,
    views: 445,
    rating: 4.5,
    isFavorite: true,
    coordinates: { lat: 12.9352, lng: 77.6245 }
  },
  {
    id: 6,
    title: 'Riverside Villa',
    location: 'Pune, Maharashtra',
    price: '₹4.8 Cr',
    priceValue: 48000000,
    type: 'Villa',
    beds: 4,
    baths: 4,
    area: '3800 sq ft',
    featured: true,
    verified: true,
    views: 1023,
    rating: 4.8,
    isFavorite: false,
    coordinates: { lat: 18.5204, lng: 73.8567 }
  }
]

// Declare Mappls global types
declare global {
  interface Window {
    mappls: any
    initMap2?: () => void
  }
}

export default function MapViewPage() {
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null)
  const [hoveredProperty, setHoveredProperty] = useState<Property | null>(null)
  const [showSidebar, setShowSidebar] = useState(true)
  const [map, setMap] = useState<any | null>(null)
  const [markers, setMarkers] = useState<any[]>([])
  const [mapLoaded, setMapLoaded] = useState(false)

  // Initialize Mappls Map
  const initializeMap = useCallback(() => {
    if (typeof window === 'undefined' || !window.mappls) return

    const mapElement = document.getElementById('map')
    if (!mapElement) return

    try {
      // Center map on India
      const mapplsMap = new window.mappls.Map('map', {
        center: [20.5937, 78.9629],
        zoom: 5,
        zoomControl: true,
        location: true,
        search: false
      })

      setMap(mapplsMap)

      // Create markers for each property
      const newMarkers = properties.map((property) => {
        const markerColor = property.featured ? '#f59e0b' : '#3b82f6'

        // Create custom marker HTML
        const markerHTML = `
          <svg width="40" height="50" viewBox="0 0 40 50" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 0C8.95 0 0 8.95 0 20c0 15 20 30 20 30s20-15 20-30C40 8.95 31.05 0 20 0z" fill="${markerColor}"/>
            <circle cx="20" cy="20" r="8" fill="white"/>
            <text x="20" y="25" text-anchor="middle" fill="${markerColor}" font-size="12" font-weight="bold">₹</text>
          </svg>
        `

        const marker = new window.mappls.Marker({
          map: mapplsMap,
          position: { lat: property.coordinates.lat, lng: property.coordinates.lng },
          title: property.title,
          html: markerHTML,
          width: 40,
          height: 50
        })

        // Add hover listeners
        marker.addListener('mouseover', () => {
          setHoveredProperty(property)
        })

        marker.addListener('mouseout', () => {
          setHoveredProperty(null)
        })

        marker.addListener('click', () => {
          setSelectedProperty(property)
          mapplsMap.panTo([property.coordinates.lat, property.coordinates.lng])
          mapplsMap.setZoom(15)
        })

        return marker
      })

      setMarkers(newMarkers)
    } catch (error) {
      console.error('Error initializing Mappls map:', error)
    }
  }, [])

  // Load Mappls script
  useEffect(() => {
    // Check if Mappls API key is available
    if (!process.env.NEXT_PUBLIC_MAPPLS_API_KEY || process.env.NEXT_PUBLIC_MAPPLS_API_KEY === 'your_mappls_api_key_here') {
      // Show fallback message
      const mapElement = document.getElementById('map')
      if (mapElement) {
        mapElement.innerHTML = `
          <div class="flex items-center justify-center h-full bg-gray-100 dark:bg-gray-800">
            <div class="text-center p-8">
              <div class="text-6xl mb-4">🗺️</div>
              <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">Mappls (Ola Maps) API Key Required</h3>
              <p class="text-gray-600 dark:text-gray-400 mb-4">To view the interactive map, please configure your Mappls API key in the environment variables.</p>
              <div class="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 text-left">
                <p class="text-sm text-yellow-800 dark:text-yellow-200">
                  <strong>Setup Instructions:</strong><br/>
                  1. Get API key from <a href="https://apis.mappls.com/console/" target="_blank" class="underline">Mappls Console</a><br/>
                  2. Add to .env.local: NEXT_PUBLIC_MAPPLS_API_KEY=your_key<br/>
                  3. Restart the development server
                </p>
              </div>
            </div>
          </div>
        `
      }
      return
    }

    if (window.mappls) {
      initializeMap()
      return
    }

    // Define callback
    window.initMap2 = () => {
      setMapLoaded(true)
      initializeMap()
    }

    const script = document.createElement('script')
    script.src = `https://apis.mappls.com/advancedmaps/api/${process.env.NEXT_PUBLIC_MAPPLS_API_KEY}/map_sdk?layer=vector&v=3.0&callback=initMap2`
    script.async = true
    script.defer = true
    script.onerror = () => {
      const mapElement = document.getElementById('map')
      if (mapElement) {
        mapElement.innerHTML = `
          <div class="flex items-center justify-center h-full bg-gray-100 dark:bg-gray-800">
            <div class="text-center p-8">
              <div class="text-6xl mb-4">❌</div>
              <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">Failed to Load Mappls (Ola Maps)</h3>
              <p class="text-gray-600 dark:text-gray-400">Please check your API key and internet connection.</p>
            </div>
          </div>
        `
      }
    }
    document.head.appendChild(script)

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script)
      }
      delete window.initMap2
    }
  }, [initializeMap])

  const toggleFavorite = (id: number) => {
    // This would typically update the backend
    console.log('Toggle favorite for property:', id)
  }

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 p-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link
            href="/dashboard/browse"
            className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Back to Browse</span>
          </Link>
          <div className="h-6 w-px bg-gray-300 dark:bg-gray-600"></div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
            <MapPin className="mr-2 text-blue-500" size={24} />
            Map View - Powered by Ola Maps
          </h1>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowSidebar(!showSidebar)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all"
          >
            <List size={18} />
            <span className="hidden sm:inline">{showSidebar ? 'Hide' : 'Show'} List</span>
          </button>
        </div>
      </div>

      <div className="flex-1 flex">
        {/* Sidebar */}
        {showSidebar && (
          <div className="w-80 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 overflow-y-auto">
            <div className="p-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Properties ({properties.length})
              </h2>

              <div className="space-y-4">
                {properties.map((property) => (
                  <div
                    key={property.id}
                    className={`p-4 rounded-lg border cursor-pointer transition-all ${selectedProperty?.id === property.id
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                      }`}
                    onClick={() => {
                      setSelectedProperty(property)
                      if (map) {
                        map.panTo([property.coordinates.lat, property.coordinates.lng])
                        map.setZoom(15)
                      }
                    }}
                  >
                    {/* Property Image Placeholder */}
                    <div className="relative h-32 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 rounded-lg mb-3 overflow-hidden">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Home size={32} className="text-gray-400" />
                      </div>

                      {/* Badges */}
                      <div className="absolute top-2 left-2 flex flex-col gap-1">
                        {property.featured && (
                          <div className="bg-yellow-500 text-white px-2 py-1 rounded text-xs font-semibold flex items-center space-x-1">
                            <Star size={10} />
                            <span>Featured</span>
                          </div>
                        )}
                        {property.verified && (
                          <div className="bg-green-500 text-white px-2 py-1 rounded text-xs font-semibold flex items-center space-x-1">
                            <CheckCircle size={10} />
                            <span>Verified</span>
                          </div>
                        )}
                      </div>

                      {/* Favorite Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleFavorite(property.id)
                        }}
                        className="absolute top-2 right-2 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-all"
                      >
                        <Heart
                          size={16}
                          className={property.isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'}
                        />
                      </button>
                    </div>

                    {/* Property Info */}
                    <div>
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-1">
                            {property.title}
                          </h3>
                          <div className="flex items-center text-gray-600 dark:text-gray-400 text-xs">
                            <MapPin size={12} className="mr-1" />
                            <span>{property.location}</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-1 text-yellow-500">
                          <Star size={12} className="fill-current" />
                          <span className="text-xs font-semibold">{property.rating}</span>
                        </div>
                      </div>

                      {/* Property Details */}
                      <div className="flex items-center space-x-3 mb-3 text-xs text-gray-600 dark:text-gray-400">
                        <div className="flex items-center">
                          <Bed size={12} className="mr-1" />
                          <span>{property.beds}</span>
                        </div>
                        <div className="flex items-center">
                          <Bath size={12} className="mr-1" />
                          <span>{property.baths}</span>
                        </div>
                        <div className="flex items-center">
                          <Square size={12} className="mr-1" />
                          <span>{property.area}</span>
                        </div>
                      </div>

                      {/* Price */}
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-lg font-bold text-blue-600">{property.price}</p>
                        </div>
                        <div className="flex items-center text-gray-500 text-xs">
                          <Eye size={12} className="mr-1" />
                          <span>{property.views}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Map Container */}
        <div className="flex-1 relative">
          <div id="map" className="w-full h-full"></div>

          {/* Map Controls */}
          <div className="absolute top-4 right-4 flex flex-col space-y-2 z-10">
            <button
              onClick={() => {
                if (map) {
                  map.setCenter([20.5937, 78.9629])
                  map.setZoom(5)
                }
              }}
              className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-2 shadow-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
              title="Reset View"
            >
              <Home size={20} className="text-gray-600 dark:text-gray-400" />
            </button>

            <button
              onClick={() => {
                if (map && properties.length > 0 && window.mappls) {
                  const bounds = new window.mappls.LatLngBounds()
                  properties.forEach(property => {
                    bounds.extend([property.coordinates.lat, property.coordinates.lng])
                  })
                  map.fitBounds(bounds, { padding: 50 })
                }
              }}
              className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-2 shadow-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
              title="Fit All Properties"
            >
              <Building2 size={20} className="text-gray-600 dark:text-gray-400" />
            </button>
          </div>

          {/* Legend */}
          <div className="absolute bottom-20 right-4 bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-800 p-3 z-10">
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Legend</h4>
            <div className="space-y-2 text-xs">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                <span className="text-gray-600 dark:text-gray-400">Regular Property</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
                <span className="text-gray-600 dark:text-gray-400">Featured Property</span>
              </div>
            </div>
          </div>

          {/* Hover Popup */}
          {hoveredProperty && (
            <div className="absolute top-4 left-4 bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-800 p-4 max-w-sm z-10">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-1">
                    {hoveredProperty.title}
                  </h3>
                  <div className="flex items-center text-gray-600 dark:text-gray-400 text-xs">
                    <MapPin size={12} className="mr-1" />
                    <span>{hoveredProperty.location}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-1 text-yellow-500">
                  <Star size={12} className="fill-current" />
                  <span className="text-xs font-semibold">{hoveredProperty.rating}</span>
                </div>
              </div>

              <div className="flex items-center space-x-3 mb-2 text-xs text-gray-600 dark:text-gray-400">
                <div className="flex items-center">
                  <Bed size={12} className="mr-1" />
                  <span>{hoveredProperty.beds}</span>
                </div>
                <div className="flex items-center">
                  <Bath size={12} className="mr-1" />
                  <span>{hoveredProperty.baths}</span>
                </div>
                <div className="flex items-center">
                  <Square size={12} className="mr-1" />
                  <span>{hoveredProperty.area}</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <p className="text-lg font-bold text-blue-600">{hoveredProperty.price}</p>
                <Link
                  href={`/dashboard/browse/${hoveredProperty.id}`}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs font-medium transition-all"
                >
                  View Details
                </Link>
              </div>
            </div>
          )}

          {/* Selected Property Details */}
          {selectedProperty && (
            <div className="absolute bottom-4 left-4 right-4 bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-800 p-4 z-10">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                    {selectedProperty.title}
                  </h3>
                  <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm">
                    <MapPin size={14} className="mr-1" />
                    <span>{selectedProperty.location}</span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedProperty(null)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="flex items-center space-x-4 mb-4 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center">
                  <Bed size={16} className="mr-1" />
                  <span>{selectedProperty.beds} beds</span>
                </div>
                <div className="flex items-center">
                  <Bath size={16} className="mr-1" />
                  <span>{selectedProperty.baths} baths</span>
                </div>
                <div className="flex items-center">
                  <Square size={16} className="mr-1" />
                  <span>{selectedProperty.area}</span>
                </div>
                <div className="flex items-center space-x-1 text-yellow-500">
                  <Star size={14} className="fill-current" />
                  <span className="font-semibold">{selectedProperty.rating}</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Price</p>
                  <p className="text-2xl font-bold text-blue-600">{selectedProperty.price}</p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => toggleFavorite(selectedProperty.id)}
                    className="flex items-center space-x-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
                  >
                    <Heart
                      size={16}
                      className={selectedProperty.isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600 dark:text-gray-400'}
                    />
                    <span className="text-sm">Save</span>
                  </button>
                  <Link
                    href={`/dashboard/browse/${selectedProperty.id}`}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-all"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}