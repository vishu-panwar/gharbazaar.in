'use client'

import { useState, useEffect } from 'react'
import { 
  BookOpen, 
  Play, 
  CheckCircle, 
  Clock, 
  Star, 
  Award, 
  Users, 
  Target, 
  Download, 
  Search, 
  PlayCircle, 
  FileText, 
  Video, 
  User, 
  GraduationCap, 
  Trophy, 
  Share2,
  Zap
} from 'lucide-react'

export default function TrainingPage() {
  const [activeTab, setActiveTab] = useState('modules')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setIsLoading(false)
    }, 1000)
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading training modules...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Partner Training Center
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-xl max-w-3xl mx-auto">
          Enhance your skills, learn best practices, and become a top-performing partner
        </p>
      </div>

      {/* Progress Overview */}
      <div className="bg-gradient-to-br from-blue-600 to-purple-700 rounded-3xl p-8 text-white shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold mb-2">Your Learning Journey</h2>
            <p className="text-blue-100">Keep learning to unlock new opportunities</p>
          </div>
          <div className="p-4 bg-white/20 rounded-2xl">
            <GraduationCap className="w-10 h-10" />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div>
            <p className="text-blue-100 text-sm mb-1">Modules Completed</p>
            <p className="text-3xl font-bold">2/8</p>
            <div className="w-full bg-white/20 rounded-full h-2 mt-2">
              <div className="bg-white h-2 rounded-full transition-all duration-1000" style={{ width: '25%' }}></div>
            </div>
          </div>
          <div>
            <p className="text-blue-100 text-sm mb-1">Hours Completed</p>
            <p className="text-2xl font-semibold">1.0h / 5.2h</p>
          </div>
          <div>
            <p className="text-blue-100 text-sm mb-1">Current Streak</p>
            <p className="text-2xl font-semibold">3 days</p>
          </div>
          <div>
            <p className="text-blue-100 text-sm mb-1">Average Score</p>
            <p className="text-2xl font-semibold">85%</p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Trophy className="w-5 h-5" />
            <span>Rank #45 among partners</span>
          </div>
          <div className="flex items-center space-x-2">
            <Award className="w-5 h-5" />
            <span>1 certificates earned</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 rounded-2xl p-1">
        <button
          onClick={() => setActiveTab('modules')}
          className={`flex-1 flex items-center justify-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all ${
            activeTab === 'modules'
              ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
          }`}
        >
          <BookOpen size={20} />
          <span>Training Modules</span>
        </button>
        <button
          onClick={() => setActiveTab('certificates')}
          className={`flex-1 flex items-center justify-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all ${
            activeTab === 'certificates'
              ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
          }`}
        >
          <Award size={20} />
          <span>Certificates</span>
        </button>
      </div>

      {/* Training Modules Tab */}
      {activeTab === 'modules' && (
        <div className="space-y-6">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search training modules..."
              className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>

          {/* Sample Modules */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {/* Module 1 */}
            <div className="bg-white dark:bg-gray-950 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-all cursor-pointer overflow-hidden">
              <div className="relative h-48 bg-gradient-to-br from-blue-500 to-purple-600">
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="absolute top-4 left-4 flex space-x-2">
                  <span className="inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400">
                    <Video className="w-4 h-4" />
                    <span>Video</span>
                  </span>
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400">
                    Beginner
                  </span>
                </div>
                <div className="absolute top-4 right-4">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-white" />
                  </div>
                </div>
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex items-center justify-between text-white mb-2">
                    <span className="text-sm font-medium">25 min</span>
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 fill-current text-yellow-400" />
                      <span className="text-sm">4.8</span>
                    </div>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-2">
                    <div className="bg-white h-2 rounded-full transition-all duration-500" style={{ width: '100%' }}></div>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                  Getting Started as a GharBazaar Partner
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                  Learn the basics of being a successful partner, understanding commission structure, and platform navigation.
                </p>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">Priya Sharma</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">1250</span>
                  </div>
                </div>

                <button className="w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-xl font-medium transition-all bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400">
                  <CheckCircle className="w-5 h-5" />
                  <span>Completed</span>
                </button>
              </div>
            </div>

            {/* Module 2 */}
            <div className="bg-white dark:bg-gray-950 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-all cursor-pointer overflow-hidden">
              <div className="relative h-48 bg-gradient-to-br from-green-500 to-blue-600">
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="absolute top-4 left-4 flex space-x-2">
                  <span className="inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400">
                    <Video className="w-4 h-4" />
                    <span>Video</span>
                  </span>
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400">
                    Beginner
                  </span>
                </div>
                <div className="absolute top-4 right-4">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                    <Clock className="w-5 h-5 text-white" />
                  </div>
                </div>
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex items-center justify-between text-white mb-2">
                    <span className="text-sm font-medium">35 min</span>
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 fill-current text-yellow-400" />
                      <span className="text-sm">4.9</span>
                    </div>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-2">
                    <div className="bg-white h-2 rounded-full transition-all duration-500" style={{ width: '60%' }}></div>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                  Effective Customer Communication
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                  Master the art of talking to potential buyers and sellers. Learn what to say and what to avoid.
                </p>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">Rajesh Kumar</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">980</span>
                  </div>
                </div>

                <button className="w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-xl font-medium transition-all bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400">
                  <PlayCircle className="w-5 h-5" />
                  <span>Continue (60%)</span>
                </button>
              </div>
            </div>

            {/* Module 3 */}
            <div className="bg-white dark:bg-gray-950 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-all cursor-pointer overflow-hidden">
              <div className="relative h-48 bg-gradient-to-br from-purple-500 to-pink-600">
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="absolute top-4 left-4 flex space-x-2">
                  <span className="inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
                    <FileText className="w-4 h-4" />
                    <span>Document</span>
                  </span>
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400">
                    Intermediate
                  </span>
                </div>
                <div className="absolute top-4 right-4">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                    <Clock className="w-5 h-5 text-white" />
                  </div>
                </div>
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex items-center justify-between text-white mb-2">
                    <span className="text-sm font-medium">45 min</span>
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 fill-current text-yellow-400" />
                      <span className="text-sm">4.7</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                  Legal Compliance & RERA Guidelines
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                  Understand legal boundaries, RERA compliance, and how to stay within regulatory guidelines.
                </p>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">Advocate Meera Shah</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">750</span>
                  </div>
                </div>

                <button className="w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-xl font-medium transition-all bg-blue-600 hover:bg-blue-700 text-white">
                  <Play className="w-5 h-5" />
                  <span>Start Learning</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Certificates Tab */}
      {activeTab === 'certificates' && (
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Your Certificates
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Showcase your achievements and professional development
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-2xl border-2 border-yellow-200 dark:border-yellow-800 p-8 shadow-lg">
              <div className="text-center">
                <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  GharBazaar Partner Foundation
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Earned on Dec 15, 2024
                </p>
                <div className="bg-white dark:bg-gray-800 rounded-xl p-4 mb-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600 dark:text-gray-400">Score</p>
                      <p className="font-bold text-gray-900 dark:text-white">92%</p>
                    </div>
                    <div>
                      <p className="text-gray-600 dark:text-gray-400">Valid Until</p>
                      <p className="font-bold text-gray-900 dark:text-white">Dec 15, 2025</p>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-4 font-mono">
                  Credential ID: GB-CERT-2024-001234
                </p>
                <div className="flex space-x-2">
                  <button className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all">
                    <Download className="w-4 h-4" />
                    <span>Download</span>
                  </button>
                  <button className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl transition-all">
                    <Share2 className="w-4 h-4" />
                    <span>Share</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}