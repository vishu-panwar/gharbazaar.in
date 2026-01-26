'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { 
  ArrowLeft, RotateCcw, ZoomIn, ZoomOut, Maximize2, Move3D,
  Eye, Share2, Heart, Download, Info, Settings, Compass,
  Phone, Calendar, MessageCircle, Home, Navigation
} from 'lucide-react'

export default function Property360ViewPage() {
  const params = useParams()
  const router = useRouter()
  const propertyId = params.id

  const [currentRoom, setCurrentRoom] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showControls, setShowControls] = useState(true)
  const [zoom, setZoom] = useState(100)

  const rooms = [
    {
      id: 1,
      name: 'Living Room',
      description: 'Spacious living area with panoramic sea views and premium Italian marble flooring',
      thumbnail: '/api/placeholder/200/150',
      hotspots: 5,
      featured: true
    },
    {
      id: 2,
      name: 'Master Bedroom',
      description: 'Luxurious master suite with walk-in closet and en-suite bathroom',
      thumbnail: '/api/placeholder/200/150',
      hotspots: 3,
      featured: false
    },
    {
      id: 3,
      name: 'Kitchen',
      description: 'Modern modular kitchen with imported appliances and breakfast counter',
      thumbnail: '/api/placeholder/200/150',
      hotspots: 4,
      featured: false
    },
    {
      id: 4,
      name: 'Balcony',
      description: 'Private balcony with stunning Arabian Sea views and outdoor seating',
      thumbnail: '/api/placeholder/200/150',
      hotspots: 2,
      featured: true
    },
    {
      id: 5,
      name: 'Dining Area',
      description: 'Elegant dining space perfect for entertaining guests',
      thumbnail: '/api/placeholder/200/150',
      hotspots: 2,
      featured: false
    }
  ]

  const currentRoomData = rooms[currentRoom]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Navigation Bar */}
      <div className="sticky top-0 z-40 bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={() => router.back()}
              className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              <ArrowLeft size={20} />
              <span className="font-medium">Back to Property</span>
            </button>
            
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">360° Virtual Tour</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main 360° Viewer */}
          <div className="lg:col-span-3">
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
              {/* 360° Viewer */}
              <div className="relative aspect-video bg-gradient-to-br from-blue-900 to-purple-900">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <Move3D size={64} className="text-white mx-auto mb-4" />
                    <p className="text-white text-xl font-semibold mb-2">{currentRoomData.name}</p>
                    <p className="text-blue-200 mb-4">Click and drag to explore • Use mouse wheel to zoom</p>
                    <div className="flex items-center justify-center space-x-2 text-blue-200">
                      <Compass size={16} />
                      <span className="text-sm">Interactive 360° Experience</span>
                    </div>
                  </div>
                </div>

                {/* Hotspots */}
                <div className="absolute top-1/4 left-1/3 w-4 h-4 bg-blue-500 rounded-full animate-pulse cursor-pointer hover:scale-125 transition-transform">
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 hover:opacity-100 transition-opacity whitespace-nowrap">
                    Premium Furniture
                  </div>
                </div>
                <div className="absolute top-1/2 right-1/4 w-4 h-4 bg-green-500 rounded-full animate-pulse cursor-pointer hover:scale-125 transition-transform">
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 hover:opacity-100 transition-opacity whitespace-nowrap">
                    Sea View
                  </div>
                </div>
                <div className="absolute bottom-1/3 left-1/4 w-4 h-4 bg-purple-500 rounded-full animate-pulse cursor-pointer hover:scale-125 transition-transform">
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 hover:opacity-100 transition-opacity whitespace-nowrap">
                    Smart Features
                  </div>
                </div>

                {/* 360° Controls */}
                {showControls && (
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="bg-black/80 backdrop-blur-sm rounded-xl p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <button className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-all">
                            <RotateCcw size={20} className="text-white" />
                          </button>
                          <div className="flex items-center space-x-2">
                            <button 
                              onClick={() => setZoom(Math.max(50, zoom - 25))}
                              className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-all"
                            >
                              <ZoomOut size={16} className="text-white" />
                            </button>
                            <span className="text-white text-sm min-w-[3rem] text-center">{zoom}%</span>
                            <button 
                              onClick={() => setZoom(Math.min(200, zoom + 25))}
                              className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-all"
                            >
                              <ZoomIn size={16} className="text-white" />
                            </button>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => setShowControls(!showControls)}
                            className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-all"
                          >
                            <Settings size={20} className="text-white" />
                          </button>
                          <button
                            onClick={() => setIsFullscreen(!isFullscreen)}
                            className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-all"
                          >
                            <Maximize2 size={20} className="text-white" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Room Info */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                      {currentRoomData.name}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      {currentRoomData.description}
                    </p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Eye size={16} />
                        <span>{currentRoomData.hotspots} interactive hotspots</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Navigation size={16} />
                        <span>360° Navigation</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    <button className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 transition-all">
                      <Heart size={20} className="text-gray-600 dark:text-gray-400" />
                    </button>
                    <button className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 transition-all">
                      <Share2 size={20} className="text-gray-600 dark:text-gray-400" />
                    </button>
                  </div>
                </div>
                
                {currentRoomData.featured && (
                  <div className="inline-flex items-center px-3 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 rounded-full text-sm font-semibold">
                    <Home size={14} className="mr-1" />
                    Featured Room
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Room Navigation */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 p-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Explore Rooms</h3>
              <div className="space-y-3">
                {rooms.map((room, index) => (
                  <button
                    key={room.id}
                    onClick={() => setCurrentRoom(index)}
                    className={`w-full text-left p-4 rounded-xl transition-all ${
                      currentRoom === index
                        ? 'bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800'
                        : 'bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="relative flex-shrink-0">
                        <div className="w-16 h-12 bg-gradient-to-br from-gray-300 to-gray-400 dark:from-gray-600 dark:to-gray-700 rounded-lg flex items-center justify-center">
                          <Move3D size={16} className="text-gray-500" />
                        </div>
                        {room.featured && (
                          <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-500 rounded-full"></div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-900 dark:text-white text-sm">
                          {room.name}
                        </h4>
                        <p className="text-xs text-gray-500 mt-1">
                          {room.hotspots} hotspots • 360° view
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Instructions */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-6 border border-blue-200 dark:border-blue-800">
              <h3 className="text-lg font-bold text-blue-900 dark:text-blue-100 mb-4">How to Navigate</h3>
              <div className="space-y-3 text-sm text-blue-800 dark:text-blue-200">
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Click and drag to look around the room</span>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Use mouse wheel or zoom controls to get closer</span>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Click on colored dots to see details</span>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Switch between rooms using the sidebar</span>
                </div>
              </div>
            </div>

            {/* Contact Actions */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 p-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Interested in this property?</h3>
              <div className="space-y-3">
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition-all flex items-center justify-center space-x-2">
                  <Phone size={18} />
                  <span>Contact Owner</span>
                </button>
                <button className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-semibold transition-all flex items-center justify-center space-x-2">
                  <Calendar size={18} />
                  <span>Schedule Site Visit</span>
                </button>
                <button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-xl font-semibold transition-all flex items-center justify-center space-x-2">
                  <MessageCircle size={18} />
                  <span>Send Message</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}