'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import {
  ArrowLeft, Play, Pause, SkipForward, SkipBack, Volume2, VolumeX,
  Maximize2, Settings, Eye, Share2, Heart, Download, MapPin,
  Phone, Calendar, MessageCircle, Navigation, Compass, Route,
  Clock, Star, Home, Building2, Trees, Car
} from 'lucide-react'

export default function PropertyVirtualTourPage() {
  const params = useParams()
  const router = useRouter()
  const propertyId = params.id

  const [isPlaying, setIsPlaying] = useState(false)
  const [currentStop, setCurrentStop] = useState(0)
  const [isMuted, setIsMuted] = useState(false)
  const [showMap, setShowMap] = useState(true)
  const [tourProgress, setTourProgress] = useState(15)

  const tourStops = [
    {
      id: 1,
      name: 'Property Entrance',
      description: 'Grand entrance with 24/7 security and valet parking',
      duration: '2:30',
      type: 'entrance',
      icon: Building2,
      completed: true
    },
    {
      id: 2,
      name: 'Lobby & Reception',
      description: 'Luxurious marble lobby with concierge services',
      duration: '1:45',
      type: 'lobby',
      icon: Home,
      completed: true
    },
    {
      id: 3,
      name: 'Elevator Journey',
      description: 'High-speed elevator to the 25th floor penthouse',
      duration: '0:45',
      type: 'elevator',
      icon: Navigation,
      completed: false,
      current: true
    },
    {
      id: 4,
      name: 'Penthouse Entry',
      description: 'Private elevator access directly to your penthouse',
      duration: '1:20',
      type: 'entry',
      icon: Home,
      completed: false
    },
    {
      id: 5,
      name: 'Living Spaces',
      description: 'Spacious living room with panoramic sea views',
      duration: '3:15',
      type: 'living',
      icon: Home,
      completed: false
    },
    {
      id: 6,
      name: 'Master Suite',
      description: 'Luxurious master bedroom with walk-in closet',
      duration: '2:45',
      type: 'bedroom',
      icon: Home,
      completed: false
    },
    {
      id: 7,
      name: 'Kitchen & Dining',
      description: 'Modern kitchen with imported appliances',
      duration: '2:00',
      type: 'kitchen',
      icon: Home,
      completed: false
    },
    {
      id: 8,
      name: 'Balcony Views',
      description: 'Private balcony overlooking the Arabian Sea',
      duration: '1:30',
      type: 'balcony',
      icon: Eye,
      completed: false
    },
    {
      id: 9,
      name: 'Building Amenities',
      description: 'Swimming pool, gym, and recreational facilities',
      duration: '4:00',
      type: 'amenities',
      icon: Trees,
      completed: false
    },
    {
      id: 10,
      name: 'Parking & Exit',
      description: 'Covered parking spaces and property exit',
      duration: '1:15',
      type: 'parking',
      icon: Car,
      completed: false
    }
  ]

  const currentStopData = tourStops[currentStop]
  const totalDuration = tourStops.reduce((acc, stop) => {
    const [min, sec] = stop.duration.split(':').map(Number)
    return acc + min * 60 + sec
  }, 0)

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

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
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">Virtual Property Tour</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Tour Player */}
          <div className="lg:col-span-3">
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
              {/* Tour Player */}
              <div className="relative aspect-video bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <Route size={64} className="text-white mx-auto mb-4" />
                    <p className="text-white text-xl font-semibold mb-2">{currentStopData.name}</p>
                    <p className="text-purple-200 mb-4">{currentStopData.description}</p>
                    <div className="flex items-center justify-center space-x-4 text-purple-200">
                      <div className="flex items-center space-x-1">
                        <Clock size={16} />
                        <span className="text-sm">{currentStopData.duration}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MapPin size={16} />
                        <span className="text-sm">Stop {currentStop + 1} of {tourStops.length}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tour Progress Overlay */}
                <div className="absolute top-4 left-4 right-4">
                  <div className="bg-black/60 backdrop-blur-sm rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white text-sm font-medium">Tour Progress</span>
                      <span className="text-white text-sm">{tourProgress}% Complete</span>
                    </div>
                    <div className="w-full bg-white/20 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${tourProgress}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Tour Controls */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={() => setCurrentStop(Math.max(0, currentStop - 1))}
                        disabled={currentStop === 0}
                        className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <SkipBack size={24} className="text-white" />
                      </button>
                      <button
                        onClick={() => setIsPlaying(!isPlaying)}
                        className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-all"
                      >
                        {isPlaying ? <Pause size={28} className="text-white" /> : <Play size={28} className="text-white ml-1" />}
                      </button>
                      <button
                        onClick={() => setCurrentStop(Math.min(tourStops.length - 1, currentStop + 1))}
                        disabled={currentStop === tourStops.length - 1}
                        className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <SkipForward size={24} className="text-white" />
                      </button>
                      <span className="text-white text-sm ml-4">
                        {formatTime(Math.floor(totalDuration * tourProgress / 100))} / {formatTime(totalDuration)}
                      </span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setIsMuted(!isMuted)}
                        className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-all"
                      >
                        {isMuted ? <VolumeX size={20} className="text-white" /> : <Volume2 size={20} className="text-white" />}
                      </button>
                      <button
                        onClick={() => setShowMap(!showMap)}
                        className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-all"
                      >
                        <Compass size={20} className="text-white" />
                      </button>
                      <button className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-all">
                        <Settings size={20} className="text-white" />
                      </button>
                      <button className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-all">
                        <Maximize2 size={20} className="text-white" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Current Stop Info */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <currentStopData.icon size={24} className="text-blue-600" />
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {currentStopData.name}
                      </h2>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      {currentStopData.description}
                    </p>
                    <div className="flex items-center space-x-6 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Clock size={16} />
                        <span>Duration: {currentStopData.duration}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Navigation size={16} />
                        <span>Stop {currentStop + 1} of {tourStops.length}</span>
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
                    <button className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 transition-all">
                      <Download size={20} className="text-gray-600 dark:text-gray-400" />
                    </button>
                  </div>
                </div>

                {/* Status Badge */}
                <div className="flex items-center space-x-2">
                  {currentStopData.completed && (
                    <div className="inline-flex items-center px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full text-sm font-semibold">
                      <Star size={14} className="mr-1" />
                      Completed
                    </div>
                  )}
                  {currentStopData.current && (
                    <div className="inline-flex items-center px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-sm font-semibold">
                      <Play size={14} className="mr-1" />
                      Current Stop
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Tour Navigation */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 p-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Tour Stops</h3>
              <div className="space-y-3">
                {tourStops.map((stop, index) => {
                  const IconComponent = stop.icon
                  return (
                    <button
                      key={stop.id}
                      onClick={() => setCurrentStop(index)}
                      className={`w-full text-left p-4 rounded-xl transition-all ${currentStop === index
                          ? 'bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800'
                          : 'bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="relative flex-shrink-0">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${stop.completed
                              ? 'bg-green-100 dark:bg-green-900/30'
                              : stop.current
                                ? 'bg-blue-100 dark:bg-blue-900/30'
                                : 'bg-gray-100 dark:bg-gray-700'
                            }`}>
                            <IconComponent size={16} className={
                              stop.completed
                                ? 'text-green-600 dark:text-green-400'
                                : stop.current
                                  ? 'text-blue-600 dark:text-blue-400'
                                  : 'text-gray-500'
                            } />
                          </div>
                          <div className="absolute -top-1 -right-1 text-xs font-bold text-gray-500">
                            {index + 1}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-gray-900 dark:text-white text-sm truncate">
                            {stop.name}
                          </h4>
                          <p className="text-xs text-gray-500 mt-1">
                            {stop.duration} • {stop.type}
                          </p>
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Tour Stats */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl p-6 border border-purple-200 dark:border-purple-800">
              <h3 className="text-lg font-bold text-purple-900 dark:text-purple-100 mb-4">Tour Information</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-purple-700 dark:text-purple-300">Total Duration</span>
                  <span className="font-semibold text-purple-900 dark:text-purple-100">{formatTime(totalDuration)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-purple-700 dark:text-purple-300">Total Stops</span>
                  <span className="font-semibold text-purple-900 dark:text-purple-100">{tourStops.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-purple-700 dark:text-purple-300">Completed</span>
                  <span className="font-semibold text-purple-900 dark:text-purple-100">
                    {tourStops.filter(stop => stop.completed).length} stops
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-purple-700 dark:text-purple-300">Progress</span>
                  <span className="font-semibold text-purple-900 dark:text-purple-100">{tourProgress}%</span>
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