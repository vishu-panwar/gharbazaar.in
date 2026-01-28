'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { 
  ArrowLeft, Play, Pause, Volume2, VolumeX, Maximize2, Download,
  Clock, Eye, Share2, Heart, Star, Calendar, Phone, MessageCircle
} from 'lucide-react'

export default function PropertyVideosPage() {
  const params = useParams()
  const router = useRouter()
  const propertyId = params.id

  const [currentVideo, setCurrentVideo] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)

  const videos = [
    {
      id: 1,
      title: 'Property Walkthrough',
      duration: '3:45',
      description: 'Complete walkthrough of the luxury penthouse showcasing all rooms, amenities, and stunning sea views.',
      thumbnail: '/api/placeholder/800/450',
      views: 1234,
      uploadDate: '2024-12-20',
      quality: '4K Ultra HD'
    },
    {
      id: 2,
      title: 'Neighborhood Tour',
      duration: '2:30',
      description: 'Explore the prestigious Worli neighborhood, nearby amenities, and connectivity options.',
      thumbnail: '/api/placeholder/800/450',
      views: 856,
      uploadDate: '2024-12-18',
      quality: '1080p HD'
    },
    {
      id: 3,
      title: 'Amenities Showcase',
      duration: '4:12',
      description: 'Detailed tour of building amenities including swimming pool, gym, clubhouse, and recreational facilities.',
      thumbnail: '/api/placeholder/800/450',
      views: 692,
      uploadDate: '2024-12-15',
      quality: '4K Ultra HD'
    },
    {
      id: 4,
      title: 'Sunset Views from Balcony',
      duration: '1:45',
      description: 'Experience the breathtaking sunset views from the penthouse balcony overlooking the Arabian Sea.',
      thumbnail: '/api/placeholder/800/450',
      views: 1567,
      uploadDate: '2024-12-22',
      quality: '4K Ultra HD'
    }
  ]

  const currentVideoData = videos[currentVideo]

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
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">Property Videos</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Video Player */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
              {/* Video Player */}
              <div className="relative aspect-video bg-black">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                  <div className="text-center">
                    <Play size={64} className="text-white mx-auto mb-4" />
                    <p className="text-white text-lg font-semibold">{currentVideoData.title}</p>
                    <p className="text-gray-300">{currentVideoData.quality} • {currentVideoData.duration}</p>
                  </div>
                </div>
                
                {/* Video Controls */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={() => setIsPlaying(!isPlaying)}
                        className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-all"
                      >
                        {isPlaying ? <Pause size={24} className="text-white" /> : <Play size={24} className="text-white ml-1" />}
                      </button>
                      <span className="text-white text-sm">0:00 / {currentVideoData.duration}</span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setIsMuted(!isMuted)}
                        className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-all"
                      >
                        {isMuted ? <VolumeX size={20} className="text-white" /> : <Volume2 size={20} className="text-white" />}
                      </button>
                      <button
                        onClick={() => setIsFullscreen(!isFullscreen)}
                        className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-all"
                      >
                        <Maximize2 size={20} className="text-white" />
                      </button>
                    </div>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="mt-3">
                    <div className="w-full bg-white/20 rounded-full h-1">
                      <div className="bg-blue-500 h-1 rounded-full" style={{ width: '25%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Video Info */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                      {currentVideoData.title}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      {currentVideoData.description}
                    </p>
                    <div className="flex items-center space-x-6 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Eye size={16} />
                        <span>{currentVideoData.views.toLocaleString()} views</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar size={16} />
                        <span>{new Date(currentVideoData.uploadDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock size={16} />
                        <span>{currentVideoData.duration}</span>
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
                
                {/* Quality Badge */}
                <div className="inline-flex items-center px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-sm font-semibold">
                  <Star size={14} className="mr-1" />
                  {currentVideoData.quality}
                </div>
              </div>
            </div>
          </div>

          {/* Video Playlist */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 p-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Video Playlist</h3>
              <div className="space-y-4">
                {videos.map((video, index) => (
                  <button
                    key={video.id}
                    onClick={() => setCurrentVideo(index)}
                    className={`w-full text-left p-4 rounded-xl transition-all ${
                      currentVideo === index
                        ? 'bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800'
                        : 'bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="relative flex-shrink-0">
                        <div className="w-20 h-12 bg-gradient-to-br from-gray-300 to-gray-400 dark:from-gray-600 dark:to-gray-700 rounded-lg flex items-center justify-center">
                          <Play size={16} className="text-gray-500 ml-0.5" />
                        </div>
                        <div className="absolute bottom-1 right-1 bg-black/80 text-white text-xs px-1 rounded">
                          {video.duration}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-900 dark:text-white text-sm truncate">
                          {video.title}
                        </h4>
                        <p className="text-xs text-gray-500 mt-1">
                          {video.views.toLocaleString()} views • {video.quality}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
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