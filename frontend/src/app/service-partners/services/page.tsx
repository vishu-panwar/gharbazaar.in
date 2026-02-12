'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  Sparkles, 
  Scale, 
  Building2, 
  Palette, 
  Hammer, 
  Camera, 
  Lightbulb,
  Search,
  Filter,
  Users,
  ArrowRight,
  CheckCircle,
  Clock,
  Star,
  Heart,
  Share2
} from 'lucide-react'
import { backendApi } from '@/lib/backendApi'

interface ServiceProvider {
  id: string
  name: string
  category: 'lawyer' | 'architect' | 'designer' | 'contractor' | 'photographer' | 'consultant'
  specialization: string
  rating: number
  reviews: number
  completedProjects: number
  hourlyRate: number
  location: string
  verified: boolean
  available: boolean
  image: string
  description: string
  skills: string[]
  experience: number
  user?: {
    name: string
    email: string
  }
}

export default function ServicesPage() {
  const [serviceProviders, setServiceProviders] = useState<ServiceProvider[]>([])
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [sortBy, setSortBy] = useState('rating')

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        const [providersRes, statsRes] = await Promise.all([
          backendApi.serviceProvider.list(),
          backendApi.serviceProvider.getStats()
        ])

        if (providersRes?.success) {
          setServiceProviders(providersRes.providers || [])
        }
        if (statsRes?.success) {
          setStats(statsRes.stats)
        }
      } catch (error) {
        console.error('Error fetching services data:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const serviceCategories = [
    { 
      id: 'all', 
      name: 'All Services', 
      icon: Sparkles, 
      color: 'from-purple-500 to-pink-600', 
      count: stats?.total || serviceProviders.length 
    },
    { 
      id: 'lawyer', 
      name: 'Legal Services', 
      icon: Scale, 
      color: 'from-blue-500 to-indigo-600', 
      count: stats?.byCategory?.find((s: any) => s._id === 'lawyer')?.count || 0
    },
    { 
      id: 'architect', 
      name: 'Architecture', 
      icon: Building2, 
      color: 'from-green-500 to-emerald-600', 
      count: stats?.byCategory?.find((s: any) => s._id === 'architect')?.count || 0
    },
    { 
      id: 'designer', 
      name: 'Interior Design', 
      icon: Palette, 
      color: 'from-orange-500 to-red-600', 
      count: stats?.byCategory?.find((s: any) => s._id === 'designer')?.count || 0
    },
    { 
      id: 'contractor', 
      name: 'Construction', 
      icon: Hammer, 
      color: 'from-yellow-500 to-orange-600', 
      count: stats?.byCategory?.find((s: any) => s._id === 'contractor')?.count || 0
    },
    { 
      id: 'photographer', 
      name: 'Photography', 
      icon: Camera, 
      color: 'from-pink-500 to-rose-600', 
      count: stats?.byCategory?.find((s: any) => s._id === 'photographer')?.count || 0
    },
    { 
      id: 'consultant', 
      name: 'Consultation', 
      icon: Lightbulb, 
      color: 'from-cyan-500 to-blue-600', 
      count: stats?.byCategory?.find((s: any) => s._id === 'consultant')?.count || 0
    }
  ]

  const filteredProviders = serviceProviders
    .filter(p => selectedCategory === 'all' || p.category === selectedCategory)
    .filter(p => {
      const nameMatch = (p.name || p.user?.name || '').toLowerCase().includes(searchQuery.toLowerCase())
      const specMatch = (p.specialization || '').toLowerCase().includes(searchQuery.toLowerCase())
      const locMatch = (p.location || '').toLowerCase().includes(searchQuery.toLowerCase())
      return nameMatch || specMatch || locMatch
    })
    .sort((a, b) => {
      if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0)
      if (sortBy === 'reviews') return (b.reviews || 0) - (a.reviews || 0)
      if (sortBy === 'projects') return (b.completedProjects || 0) - (a.completedProjects || 0)
      if (sortBy === 'rate-low') return (a.hourlyRate || 0) - (b.hourlyRate || 0)
      if (sortBy === 'rate-high') return (b.hourlyRate || 0) - (a.hourlyRate || 0)
      return 0
    })

  return (
    <div className="space-y-4">
      {/* Compact Header */}
      <div className="relative bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 rounded-lg p-4 shadow-lg overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-2 right-2 w-24 h-24 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-2 left-2 w-16 h-16 bg-white rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 backdrop-blur-xl rounded-lg flex items-center justify-center">
              <Users className="text-white" size={20} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white">Professional Services</h1>
              <p className="text-purple-100 text-xs">
                Connect with <span className="font-bold text-white">{serviceProviders.length}+ verified</span> service providers
              </p>
            </div>
          </div>

          <Link
            href="/service-partners/services/register"
            className="group bg-white hover:bg-gray-50 text-purple-600 px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shadow-md hover:shadow-lg"
          >
            <Sparkles size={14} />
            <span>Register as Provider</span>
            <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
        {[
          { label: 'Total Providers', value: stats?.total || serviceProviders.length, icon: Users, gradient: 'from-blue-500 to-indigo-600' },
          { label: 'Verified', value: stats?.verified || serviceProviders.filter(p => p.verified).length, icon: CheckCircle, gradient: 'from-green-500 to-emerald-600' },
          { label: 'Available Now', value: stats?.available || serviceProviders.filter(p => p.available).length, icon: Clock, gradient: 'from-orange-500 to-red-600' },
          { label: 'Avg Rating', value: stats?.avgRating || '4.7', icon: Star, gradient: 'from-yellow-500 to-orange-600' }
        ].map((stat, i) => (
          <div key={i} className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-1">
              <div className={`w-8 h-8 bg-gradient-to-br ${stat.gradient} rounded-lg flex items-center justify-center shadow-md`}>
                <stat.icon className="text-white" size={14} />
              </div>
            </div>
            <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-0.5">{stat.label}</p>
            <p className="text-xl font-black text-gray-900 dark:text-white">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* ... (Search & Filters and Category Tabs remain same) ... */}

      {/* Results */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Showing <span className="font-bold text-gray-900 dark:text-white">{filteredProviders.length}</span> providers
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1,2,3,4,5,6].map(i => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 h-96 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProviders.map(provider => (
            <div key={provider.id} className="group bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-2xl transition-all hover:-translate-y-1">
              {/* Image */}
              <div className="relative h-40 overflow-hidden">
                <img 
                  src={provider.image || 'https://via.placeholder.com/400x300?text=Service+Provider'} 
                  alt={provider.name || provider.user?.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                
                {/* Badges */}
                <div className="absolute top-2 right-2 flex flex-col gap-1.5">
                  {provider.verified && (
                    <span className="px-2 py-1 rounded-full text-xs font-bold bg-blue-600 text-white flex items-center gap-1 shadow-lg">
                      <CheckCircle size={10} />
                      Verified
                    </span>
                  )}
                  {provider.available ? (
                    <span className="px-2 py-1 rounded-full text-xs font-bold bg-green-600 text-white shadow-lg">
                      Available
                    </span>
                  ) : (
                    <span className="px-2 py-1 rounded-full text-xs font-bold bg-gray-600 text-white shadow-lg">
                      Busy
                    </span>
                  )}
                </div>

                {/* Quick Actions */}
                <div className="absolute bottom-2 right-2 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-all">
                  <button className="p-2 bg-white dark:bg-gray-900 rounded-lg shadow-xl hover:bg-pink-600 hover:text-white transition-all">
                    <Heart size={14} />
                  </button>
                  <button className="p-2 bg-white dark:bg-gray-900 rounded-lg shadow-xl hover:bg-blue-600 hover:text-white transition-all">
                    <Share2 size={14} />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h3 className="font-bold text-base text-gray-900 dark:text-white mb-1 group-hover:text-purple-600 transition-colors">
                      {provider.name || provider.user?.name}
                    </h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                      {provider.specialization || 'Professional Service Provider'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-3">
                  <div className="flex items-center gap-0.5">
                    <Star size={12} className="fill-yellow-500 text-yellow-500" />
                    <span className="text-sm font-bold text-gray-900 dark:text-white">{provider.rating || 0}</span>
                    <span className="text-xs text-gray-500">({provider.reviews || 0})</span>
                  </div>
                  <span className="text-xs text-gray-500">•</span>
                  <span className="text-xs text-gray-600 dark:text-gray-400">{provider.experience || 0} yrs exp</span>
                </div>

                <p className="text-xs text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                  {provider.description || `Highly skilled professional specializing in ${provider.specialization || provider.category}.`}
                </p>

                {/* Skills */}
                <div className="flex flex-wrap gap-1 mb-3">
                  {(provider.skills || []).slice(0, 3).map((skill, i) => (
                    <span key={i} className="px-2 py-0.5 bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 rounded text-xs font-medium">
                      {skill}
                    </span>
                  ))}
                  {(provider.skills || []).length > 3 && (
                    <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 rounded text-xs font-medium">
                      +{(provider.skills || []).length - 3}
                    </span>
                  )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
                  <div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Rate</div>
                    <div className="text-base font-bold text-purple-600">₹{provider.hourlyRate || 0}/hr</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Projects</div>
                    <div className="text-base font-bold text-gray-900 dark:text-white">{provider.completedProjects || 0}</div>
                  </div>
                  <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-bold transition-all shadow-md hover:shadow-lg">
                    Contact
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {filteredProviders.length === 0 && (
        <div className="text-center py-20">
          <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl">
            <Users className="text-purple-600" size={32} />
          </div>
          <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-3">No providers found</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
            Try adjusting your filters or search query
          </p>
          <button
            onClick={() => {
              setSearchQuery('')
              setSelectedCategory('all')
            }}
            className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg hover:shadow-xl"
          >
            <span>Clear Filters</span>
          </button>
        </div>
      )}
    </div>
  )
}
