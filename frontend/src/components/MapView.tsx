'use client'

import { useState, useEffect, useCallback } from 'react'
import { Loader } from 'lucide-react'

interface MapViewProps {
    properties: any[]
    center?: { lat: number; lng: number }
    zoom?: number
    onPropertySelect?: (property: any) => void
    searchBounds?: boolean
}

// Declare Mappls global types
declare global {
    interface Window {
        mappls: any
        initMap1?: () => void
    }
}

export default function MapView({
    properties,
    center = { lat: 28.6139, lng: 77.2090 }, // Default: New Delhi
    zoom = 12,
    onPropertySelect,
    searchBounds = false
}: MapViewProps) {
    const [map, setMap] = useState<any | null>(null)
    const [markers, setMarkers] = useState<any[]>([])
    const [mapLoaded, setMapLoaded] = useState(false)
    const [selectedProperty, setSelectedProperty] = useState<any>(null)
    const [loadError, setLoadError] = useState<string>('')

    // Load Mappls Script
    useEffect(() => {
        if (typeof window === 'undefined') return

        // Check if Mappls SDK already loaded
        if (window.mappls) {
            setMapLoaded(true)
            return
        }

        const apiKey = process.env.NEXT_PUBLIC_MAPPLS_API_KEY

        if (!apiKey || apiKey === 'your_mappls_api_key_here') {
            setLoadError('Mappls API key not configured')
            console.error('Mappls API key not found. Please add NEXT_PUBLIC_MAPPLS_API_KEY to your .env.local file')
            return
        }

        // Define callback for Mappls initialization
        window.initMap1 = () => {
            setMapLoaded(true)
        }

        const script = document.createElement('script')
        script.src = `https://apis.mappls.com/advancedmaps/api/${apiKey}/map_sdk?layer=vector&v=3.0&callback=initMap1`
        script.async = true
        script.defer = true
        script.onerror = () => {
            setLoadError('Failed to load Mappls SDK')
            console.error('Failed to load Mappls SDK')
        }

        document.head.appendChild(script)

        return () => {
            // Cleanup
            if (script.parentNode) {
                script.parentNode.removeChild(script)
            }
            delete window.initMap1
        }
    }, [])

    // Initialize map
    useEffect(() => {
        if (!mapLoaded || map || !window.mappls) return

        const mapElement = document.getElementById('mappls-map')
        if (!mapElement) return

        try {
            // Initialize Mappls Map
            const mapplsMap = new window.mappls.Map('mappls-map', {
                center: [center.lat, center.lng],
                zoom: zoom,
                zoomControl: true,
                location: true,
                search: false
            })

            setMap(mapplsMap)
        } catch (error) {
            console.error('Error initializing Mappls map:', error)
            setLoadError('Failed to initialize map')
        }
    }, [mapLoaded, center, zoom, map])

    // Add markers for properties
    useEffect(() => {
        if (!map || !mapLoaded || !window.mappls) return

        // Clear existing markers
        markers.forEach(marker => {
            if (marker.remove) marker.remove()
        })

        const newMarkers: any[] = []

        properties.forEach(property => {
            if (!property.latitude || !property.longitude) return

            try {
                // Create custom marker HTML
                const markerElement = document.createElement('div')
                markerElement.innerHTML = `
                    <svg width="40" height="50" xmlns="http://www.w3.org/2000/svg">
                        <path d="M20 0C9 0 0 9 0 20c0 15 20 30 20 30s20-15 20-30C40 9 31 0 20 0z" fill="#2563eb"/>
                        <circle cx="20" cy="20" r="8" fill="white"/>
                        <text x="20" y="25" font-size="10" fill="#2563eb" text-anchor="middle">₹</text>
                    </svg>
                `
                markerElement.style.cursor = 'pointer'

                // Create marker
                const marker = new window.mappls.Marker({
                    map: map,
                    position: { lat: property.latitude, lng: property.longitude },
                    title: property.title,
                    html: markerElement.innerHTML,
                    width: 40,
                    height: 50
                })

                // Create popup content
                const popupContent = `
                    <div style="padding: 8px; min-width: 200px;">
                        <h3 style="font-weight: bold; font-size: 14px; margin-bottom: 4px;">${property.title}</h3>
                        <p style="color: #666; font-size: 12px; margin-bottom: 4px;">${property.city}, ${property.state}</p>
                        <p style="font-weight: bold; color: #2563eb;">₹${property.price?.toLocaleString('en-IN')}</p>
                        <p style="font-size: 12px; color: #888; margin-top: 4px;">${property.bedrooms || 'N/A'} BHK • ${property.area || 'N/A'} sq.ft</p>
                    </div>
                `

                // Add click listener
                marker.addListener('click', () => {
                    // Create popup
                    const popup = new window.mappls.Popup({
                        offset: [0, -35],
                        closeButton: true,
                        closeOnClick: true,
                        maxWidth: '300px'
                    })
                        .setLngLat([property.longitude, property.latitude])
                        .setHTML(popupContent)
                        .addTo(map)

                    setSelectedProperty(property)
                    if (onPropertySelect) {
                        onPropertySelect(property)
                    }
                })

                newMarkers.push(marker)
            } catch (error) {
                console.error('Error creating marker:', error)
            }
        })

        setMarkers(newMarkers)
    }, [properties, map, mapLoaded, onPropertySelect])

    // Fit bounds to show all markers
    useEffect(() => {
        if (!map || !mapLoaded || markers.length === 0 || !window.mappls) return

        try {
            // Create bounds
            const bounds = new window.mappls.LatLngBounds()

            properties.forEach(property => {
                if (property.latitude && property.longitude) {
                    bounds.extend([property.latitude, property.longitude])
                }
            })

            // Fit map to bounds with padding
            map.fitBounds(bounds, { padding: 50 })
        } catch (error) {
            console.error('Error fitting bounds:', error)
        }
    }, [markers, map, mapLoaded, properties])

    if (loadError) {
        return (
            <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg">
                <div className="text-center p-8">
                    <div className="text-6xl mb-4">🗺️</div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                        {loadError}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                        To view the interactive map, please configure your Mappls (Ola Maps) API key.
                    </p>
                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 text-left max-w-md mx-auto">
                        <p className="text-sm text-blue-800 dark:text-blue-200">
                            <strong>Setup Instructions:</strong><br />
                            1. Get API key from <a href="https://apis.mappls.com/console/" target="_blank" rel="noopener noreferrer" className="underline">Mappls Console</a><br />
                            2. Add to .env.local: NEXT_PUBLIC_MAPPLS_API_KEY=your_key<br />
                            3. Restart the development server
                        </p>
                    </div>
                </div>
            </div>
        )
    }

    if (!mapLoaded) {
        return (
            <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg">
                <div className="text-center">
                    <Loader className="animate-spin mx-auto mb-2 text-blue-600" size={32} />
                    <p className="text-gray-600 dark:text-gray-400">Loading Ola Maps...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="relative w-full h-full">
            <div
                id="mappls-map"
                className="w-full h-full rounded-lg overflow-hidden shadow-lg"
            />

            {selectedProperty && (
                <div className="absolute bottom-4 left-4 right-4 bg-white dark:bg-gray-800 rounded-lg shadow-xl p-4 max-w-sm">
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            <h4 className="font-bold text-sm mb-1">{selectedProperty.title}</h4>
                            <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                                {selectedProperty.city}, {selectedProperty.state}
                            </p>
                            <p className="font-bold text-blue-600">
                                ₹{selectedProperty.price?.toLocaleString('en-IN')}
                            </p>
                        </div>
                        <button
                            onClick={() => setSelectedProperty(null)}
                            className="text-gray-400 hover:text-gray-600"
                        >
                            ✕
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}
