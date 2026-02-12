'use client'

import { useState } from 'react'
import {
  Scale,
  Building2,
  Palette,
  Hammer,
  Camera,
  Lightbulb,
  Sparkles,
  Star,
  MapPin,
  Phone,
  Mail,
  CheckCircle,
  Search,
  Filter,
  ArrowRight,
  Award,
  TrendingUp,
  Users,
  Briefcase,
  Clock,
  DollarSign,
  ExternalLink,
  MessageSquare,
  Heart,
  Share2
} from 'lucide-react'
import Link from 'next/link'

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
}

export default function ServicesPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [sortBy, setSortBy] = useState('rating')

  const serviceProviders: ServiceProvider[] = [
    {
      id: 'SP001',
      name: 'Adv. Rajesh Kumar',
      category: 'lawyer',
      specialization: 'Property Law & RERA Compliance',
      rating: 4.9,
      reviews: 156,
      completedProjects: 234,
      hourlyRate: 5000,
      location: 'Mumbai, Maharashtra',
      verified: true,
      available: true,
      image: 'https://images.unsplash.com/photo-1556157382-97eda2d62296?w=400',
      description: 'Expert in property law with 15+ years of experience in RERA compliance and real estate litigation.',
      skills: ['Property Law', 'RERA', 'Title Verification', 'Legal Due Diligence'],
      experience: 15
    },
    {
      id: 'SP002',
      name: 'Ar. Priya Sharma',
      category: 'architect',
      specialization: 'Residential & Commercial Design',
      rating: 4.8,
      reviews: 89,
      completedProjects: 127,
      hourlyRate: 3500,
      location: 'Pune, Maharashtra',
      verified: true,
      available: true,
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400',
      description: 'Award-winning architect specializing in sustainable and modern design solutions.',
      skills: ['Residential Design', 'Commercial Design', 'Sustainable Architecture', '3D Modeling'],
      experience: 12
    },
    {
      id: 'SP003',
      name: 'Vikram Patel',
      category: 'designer',
      specialization: 'Interior Design & Space Planning',
      rating: 4.7,
      reviews: 112,
      completedProjects: 198,
      hourlyRate: 2500,
      location: 'Mumbai, Maharashtra',
      verified: true,
      available: false,
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
      description: 'Creative interior designer with expertise in luxury residential and commercial spaces.',
      skills: ['Interior Design', 'Space Planning', 'Furniture Design', 'Color Consultation'],
      experience: 10
    },
    {
      id: 'SP004',
      name: 'Ramesh Builders',
      category: 'contractor',
      specialization: 'Construction & Renovation',
      rating: 4.6,
      reviews: 203,
      completedProjects: 456,
      hourlyRate: 1500,
      location: 'Thane, Maharashtra',
      verified: true,
      available: true,
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
      description: 'Reliable construction company with proven track record in residential and commercial projects.',
      skills: ['Construction', 'Renovation', 'Project Management', 'Quality Control'],
      experience: 20
    },
    {
      id: 'SP005',
      name: 'Lens & Light Studio',
      category: 'photographer',
      specialization: 'Real Estate Photography',
      rating: 4.9,
      reviews: 178,
      completedProjects: 892,
      hourlyRate: 2000,
      location: 'Mumbai, Maharashtra',
      verified: true,
      available: true,
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
      description: 'Professional photography studio specializing in real estate and architectural photography.',
      skills: ['Real Estate Photography', 'Drone Photography', 'Virtual Tours', 'Video Production'],
      experience: 8
    },
    {
      id: 'SP006',
      name: 'Dr. Amit Desai',
      category: 'consultant',
      specialization: 'Vastu & Property Consultation',
      rating: 4.5,
      reviews: 67,
      completedProjects: 145,
      hourlyRate: 3000,
      location: 'Navi Mumbai, Maharashtra',
      verified: false,
      available: true,
      image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400',
      description: 'Certified Vastu consultant helping clients make informed property decisions.',
      skills: ['Vastu Shastra', 'Property Consultation', 'Feng Shui', 'Energy Analysis'],
      experience: 18
    },
    {
      id: 'SP007',
      name: 'Adv. Meera Iyer',
      category: 'lawyer',
      specialization: 'Real Estate Litigation',
      rating: 4.8,
      reviews: 134,
      completedProjects: 189,
      hourlyRate: 4500,
      location: 'Bangalore, Karnataka',
      verified: true,
      available: true,
      image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400',
      description: 'Experienced litigator specializing in property disputes and real estate matters.',
      skills: ['Litigation', 'Property Disputes', 'Contract Law', 'Arbitration'],
      experience: 14
    },
    {
      id: 'SP008',
      name: 'Ar. Karan Mehta',
      category: 'architect',
      specialization: 'Luxury Villa Design',
      rating: 4.9,
      reviews: 76,
      completedProjects: 98,
      hourlyRate: 4000,
      location: 'Goa',
      verified: true,
      available: true,
      image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400',
      description: 'Specialist in luxury villa and resort design with international experience.',
      skills: ['Villa Design', 'Resort Architecture', 'Landscape Design', 'Luxury Interiors'],
      experience: 11
    }
  ]

  const serviceCategories = [
    { id: 'all', name: 'All Services', icon: Sparkles, color: 'from-purple-500 to-pink-600', count: serviceProviders.length },
    { id: 'lawyer', name: 'Legal Services', icon: Scale, color: 'from-blue-500 to-indigo-600', count: serviceProviders.filter(p => p.category === 'lawyer').length },
    { id: 'architect', name: 'Architecture', icon: Building2, color: 'from-green-500 to-emerald-600', count: serviceProviders.filter(p => p.category === 'architect').length },
    { id: 'designer', name: 'Interior Design', icon: Palette, color: 'from-orange-500 to-red-600', count: serviceProviders.filter(p => p.category === 'designer').length },
    { id: 'contractor', name: 'Construction', icon: Hammer, color: 'from-yellow-500 to-orange-600', count: serviceProviders.filter(p => p.category === 'contractor').length },
    { id: 'photographer', name: 'Photography', icon: Camera, color: 'from-pink-500 to-rose-600', count: serviceProviders.filter(p => p.category === 'photographer').length },
    { id: 'consultant', name: 'Consultation', icon: Lightbulb, color: 'from-cyan-500 to-blue-600', count: serviceProviders.filter(p => p.category === 'consultant').length }
  ]

  const filteredProviders = serviceProviders
    .filter(p => selectedCategory === 'all' || p.category === selectedCategory)
    .filter(p => 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.specialization.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.location.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating
      if (sortBy === 'reviews') return b.reviews - a.reviews
      if (sortBy === 'projects') return b.completedProjects - a.completedProjects
      if (sortBy === 'rate-low') return a.hourlyRate - b.hourlyRate
      if (sortBy === 'rate-high') return b.hourlyRate - a.hourlyRate
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
          { label: 'Total Providers', value: serviceProviders.length, icon: Users, gradient: 'from-blue-500 to-indigo-600' },
          { label: 'Verified', value: serviceProviders.filter(p => p.verified).length, icon: CheckCircle, gradient: 'from-green-500 to-emerald-600' },
          { label: 'Available Now', value: serviceProviders.filter(p => p.available).length, icon: Clock, gradient: 'from-orange-500 to-red-600' },
          { label: 'Avg Rating', value: '4.7', icon: Star, gradient: 'from-yellow-500 to-orange-600' }
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

      {/* Search & Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-2 shadow-sm">
        <div className="flex flex-col lg:flex-row gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search by name, specialization, or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            />
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`px-2.5 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                showFilters
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700'
              }`}
            >
              <Filter size={14} />
              <span className="hidden sm:inline">Filters</span>
            </button>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-2.5 py-2 text-xs bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 font-medium"
            >
              <option value="rating">Highest Rated</option>
              <option value="reviews">Most Reviews</option>
              <option value="projects">Most Projects</option>
              <option value="rate-low">Rate: Low to High</option>
              <option value="rate-high">Rate: High to Low</option>
            </select>
          </div>
        </div>

        {showFilters && (
          <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
            <div className="flex gap-2 flex-wrap">
              <label className="flex items-center gap-1.5 text-xs">
                <input type="checkbox" className="rounded" />
                <span>Verified Only</span>
              </label>
              <label className="flex items-center gap-1.5 text-xs">
                <input type="checkbox" className="rounded" />
                <span>Available Now</span>
              </label>
              <label className="flex items-center gap-1.5 text-xs">
                <input type="checkbox" className="rounded" />
                <span>Top Rated (4.5+)</span>
              </label>
            </div>
          </div>
        )}
      </div>

      {/* Category Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-3">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {serviceCategories.map(category => {
            const Icon = category.icon
            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === category.id
                    ? 'bg-gradient-to-r ' + category.color + ' text-white shadow-md'
                    : 'bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800'
                }`}
              >
                <Icon size={14} />
                <span>{category.name}</span>
                <span className={`px-1.5 py-0.5 rounded-full text-xs font-bold ${
                  selectedCategory === category.id
                    ? 'bg-white/20'
                    : 'bg-gray-200 dark:bg-gray-800'
                }`}>
                  {category.count}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Results */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Showing <span className="font-bold text-gray-900 dark:text-white">{filteredProviders.length}</span> providers
        </p>
      </div>

      {/* Providers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProviders.map(provider => (
          <div key={provider.id} className="group bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-2xl transition-all hover:-translate-y-1">
            {/* Image */}
            <div className="relative h-40 overflow-hidden">
              <img 
                src={provider.image} 
                alt={provider.name}
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
                    {provider.name}
                  </h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                    {provider.specialization}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 mb-3">
                <div className="flex items-center gap-0.5">
                  <Star size={12} className="fill-yellow-500 text-yellow-500" />
                  <span className="text-sm font-bold text-gray-900 dark:text-white">{provider.rating}</span>
                  <span className="text-xs text-gray-500">({provider.reviews})</span>
                </div>
                <span className="text-xs text-gray-500">•</span>
                <span className="text-xs text-gray-600 dark:text-gray-400">{provider.experience} yrs exp</span>
              </div>

              <p className="text-xs text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                {provider.description}
              </p>

              {/* Skills */}
              <div className="flex flex-wrap gap-1 mb-3">
                {provider.skills.slice(0, 3).map((skill, i) => (
                  <span key={i} className="px-2 py-0.5 bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 rounded text-xs font-medium">
                    {skill}
                  </span>
                ))}
                {provider.skills.length > 3 && (
                  <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 rounded text-xs font-medium">
                    +{provider.skills.length - 3}
                  </span>
                )}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
                <div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Rate</div>
                  <div className="text-base font-bold text-purple-600">₹{provider.hourlyRate}/hr</div>
                </div>
                <div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Projects</div>
                  <div className="text-base font-bold text-gray-900 dark:text-white">{provider.completedProjects}</div>
                </div>
                <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-bold transition-all shadow-md hover:shadow-lg">
                  Contact
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

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
