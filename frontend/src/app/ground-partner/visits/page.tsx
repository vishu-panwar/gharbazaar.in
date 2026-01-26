'use client'

import { useState, useEffect } from 'react'
import { 
  MapPin, 
  Calendar, 
  Clock, 
  Camera, 
  Navigation, 
  CheckCircle, 
  AlertCircle, 
  Phone, 
  Mail,
  User,
  Home,
  Filter,
  Search,
  Plus,
  Eye,
  Upload,
  FileText,
  Star,
  Route,
  Compass,
  Timer,
  Target
} from 'lucide-react'
import toast from 'react-hot-toast'

interface SiteVisit {
  id: string
  propertyId: string
  propertyTitle: string
  propertyType: string
  address: string
  city: string
  clientName: string
  clientPhone: string
  clientEmail: string
  scheduledDate: string
  scheduledTime: string
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled'
  priority: 'low' | 'medium' | 'high'
  visitType: 'verification' | 'inspection' | 'documentation' | 'photography'
  estimatedDuration: string
  coordinates: {
    lat: number
    lng: number
  }
  distance: string
  earnings: number
  notes?: string
  completedAt?: string
  photos?: string[]
  rating?: number
}

export default function SiteVisitsPage() {
  const [visits, setVisits] = useState<SiteVisit[]>([])
  const [filteredVisits, setFilteredVisits] = useState<SiteVisit[]>([])
  const [selectedVisit, setSelectedVisit] = useState<SiteVisit | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [activeTab, setActiveTab] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [isLoading, setIsLoading] = useState(true)

  // Mock data
  useEffect(() => {
    const mockVisits: SiteVisit[] = [
      {
        id: 'V001',
        propertyId: 'P001',
        propertyTitle: '3BHK Apartment in Bandra West',
        propertyType: 'Apartment',
        address: 'Hill Road, Bandra West, Mumbai',
        city: 'Mumbai',
        clientName: 'Priya Sharma',
        clientPhone: '+91 98765 43210',
        clientEmail: 'priya.sharma@email.com',
        scheduledDate: '2024-12-31',
        scheduledTime: '10:00',
        status: 'scheduled',
        priority: 'high',
        visitType: 'verification',
        estimatedDuration: '2 hours',
        coordinates: { lat: 19.0596, lng: 72.8295 },
        distance: '2.5 km',
        earnings: 800
      },
      {
        id: 'V002',
        propertyId: 'P002',
        propertyTitle: '2BHK Villa in Andheri East',
        propertyType: 'Villa',
        address: 'Chakala, Andheri East, Mumbai',
        city: 'Mumbai',
        clientName: 'Rahul Gupta',
        clientPhone: '+91 87654 32109',
        clientEmail: 'rahul.gupta@email.com',
        scheduledDate: '2024-12-30',
        scheduledTime: '14:30',
        status: 'in-progress',
        priority: 'medium',
        visitType: 'inspection',
        estimatedDuration: '1.5 hours',
        coordinates: { lat: 19.1136, lng: 72.8697 },
        distance: '5.2 km',
        earnings: 600
      },
      {
        id: 'V003',
        propertyId: 'P003',
        propertyTitle: 'Commercial Space in Lower Parel',
        propertyType: 'Commercial',
        address: 'Senapati Bapat Marg, Lower Parel, Mumbai',
        city: 'Mumbai',
        clientName: 'Amit Patel',
        clientPhone: '+91 76543 21098',
        clientEmail: 'amit.patel@email.com',
        scheduledDate: '2024-12-29',
        scheduledTime: '11:00',
        status: 'completed',
        priority: 'low',
        visitType: 'photography',
        estimatedDuration: '1 hour',
        coordinates: { lat: 19.0176, lng: 72.8562 },
        distance: '3.8 km',
        earnings: 500,
        completedAt: '2024-12-29T12:30:00Z',
        rating: 5,
        photos: ['photo1.jpg', 'photo2.jpg', 'photo3.jpg']
      }
    ]

    setTimeout(() => {
      setVisits(mockVisits)
      setFilteredVisits(mockVisits)
      setIsLoading(false)
    }, 1000)
  }, [])

  // Filter visits based on search and filters
  useEffect(() => {
    let filtered = visits

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(visit => 
        visit.propertyTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        visit.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        visit.clientName.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Filter by status
    if (filterStatus !== 'all') {
      filtered = filtered.filter(visit => visit.status === filterStatus)
    }

    // Filter by active tab
    if (activeTab !== 'all') {
      const today = new Date().toISOString().split('T')[0]
      switch (activeTab) {
        case 'today':
          filtered = filtered.filter(visit => visit.scheduledDate === today)
          break
        case 'upcoming':
          filtered = filtered.filter(visit => 
            visit.scheduledDate > today && visit.status === 'scheduled'
          )
          break
        case 'completed':
          filtered = filtered.filter(visit => visit.status === 'completed')
          break
      }
    }

    setFilteredVisits(filtered)
  }, [visits, searchQuery, filterStatus, activeTab])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
      case 'in-progress': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
      case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
      case 'cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 dark:text-red-400'
      case 'medium': return 'text-yellow-600 dark:text-yellow-400'
      case 'low': return 'text-green-600 dark:text-green-400'
      default: return 'text-gray-600 dark:text-gray-400'
    }
  }

  const handleStartVisit = (visitId: string) => {
    setVisits(prev => prev.map(visit => 
      visit.id === visitId 
        ? { ...visit, status: 'in-progress' as const }
        : visit
    ))
    toast.success('Site visit started!')
  }

  const handleCompleteVisit = (visitId: string) => {
    setVisits(prev => prev.map(visit => 
      visit.id === visitId 
        ? { 
            ...visit, 
            status: 'completed' as const,
            completedAt: new Date().toISOString()
          }
        : visit
    ))
    toast.success('Site visit completed!')
  }

  const openGoogleMaps = (coordinates: { lat: number, lng: number }, address: string) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${coordinates.lat},${coordinates.lng}&destination_place_id=${encodeURIComponent(address)}`
    window.open(url, '_blank')
  }

  const tabs = [
    { id: 'all', label: 'All Visits', count: visits.length },
    { id: 'today', label: 'Today', count: visits.filter(v => v.scheduledDate === new Date().toISOString().split('T')[0]).length },
    { id: 'upcoming', label: 'Upcoming', count: visits.filter(v => v.status === 'scheduled').length },
    { id: 'completed', label: 'Completed', count: visits.filter(v => v.status === 'completed').length }
  ]

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading site visits...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Site Visits</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage your property site visits and inspections
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex items-center space-x-3">
          <button className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-medium rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl">
            <Plus size={20} />
            <span>Request Visit</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-950 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Visits</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{visits.length}</p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-2xl">
              <MapPin className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-950 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Completed</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {visits.filter(v => v.status === 'completed').length}
              </p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-2xl">
              <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-950 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">In Progress</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {visits.filter(v => v.status === 'in-progress').length}
              </p>
            </div>
            <div className="p-3 bg-yellow-100 dark:bg-yellow-900/20 rounded-2xl">
              <Timer className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-950 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Earnings</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                ₹{visits.reduce((sum, v) => sum + v.earnings, 0).toLocaleString()}
              </p>
            </div>
            <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-2xl">
              <Target className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white dark:bg-gray-950 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all
                ${activeTab === tab.id
                  ? 'bg-blue-500 text-white shadow-lg'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                }
              `}
            >
              <span>{tab.label}</span>
              <span className={`
                px-2 py-1 rounded-full text-xs font-bold
                ${activeTab === tab.id
                  ? 'bg-white/20 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                }
              `}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search visits, properties, or clients..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
          
          <div className="flex items-center space-x-3">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            >
              <option value="all">All Status</option>
              <option value="scheduled">Scheduled</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
            
            <button className="p-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all">
              <Filter size={20} className="text-gray-600 dark:text-gray-400" />
            </button>
          </div>
        </div>
      </div>

      {/* Visits List */}
      <div className="space-y-4">
        {filteredVisits.length === 0 ? (
          <div className="bg-white dark:bg-gray-950 rounded-2xl p-12 border border-gray-200 dark:border-gray-800 shadow-sm text-center">
            <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No visits found</h3>
            <p className="text-gray-600 dark:text-gray-400">
              {searchQuery || filterStatus !== 'all' 
                ? 'Try adjusting your search or filters'
                : 'You don\'t have any site visits scheduled yet'
              }
            </p>
          </div>
        ) : (
          filteredVisits.map(visit => (
            <div key={visit.id} className="bg-white dark:bg-gray-950 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-all">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {visit.propertyTitle}
                        </h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(visit.status)}`}>
                          {visit.status.replace('-', ' ').toUpperCase()}
                        </span>
                        <span className={`text-sm font-medium ${getPriorityColor(visit.priority)}`}>
                          {visit.priority.toUpperCase()} PRIORITY
                        </span>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                        <div className="flex items-center space-x-1">
                          <MapPin size={16} />
                          <span>{visit.address}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar size={16} />
                          <span>{new Date(visit.scheduledDate).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock size={16} />
                          <span>{visit.scheduledTime}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                        <User size={16} className="text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{visit.clientName}</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">{visit.clientPhone}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                        <Home size={16} className="text-green-600 dark:text-green-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{visit.propertyType}</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">{visit.visitType}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                        <Target size={16} className="text-purple-600 dark:text-purple-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">₹{visit.earnings}</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">{visit.estimatedDuration}</p>
                      </div>
                    </div>
                  </div>

                  {visit.status === 'completed' && visit.rating && (
                    <div className="flex items-center space-x-2 mb-4">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Rating:</span>
                      <div className="flex items-center space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={16}
                            className={i < visit.rating! ? 'text-yellow-400 fill-current' : 'text-gray-300 dark:text-gray-600'}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row lg:flex-col gap-3 mt-4 lg:mt-0 lg:ml-6">
                  <button
                    onClick={() => openGoogleMaps(visit.coordinates, visit.address)}
                    className="flex items-center justify-center space-x-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/40 rounded-xl transition-all"
                  >
                    <Navigation size={16} />
                    <span>Navigate</span>
                  </button>

                  <button
                    onClick={() => {
                      setSelectedVisit(visit)
                      setShowModal(true)
                    }}
                    className="flex items-center justify-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-xl transition-all"
                  >
                    <Eye size={16} />
                    <span>Details</span>
                  </button>

                  {visit.status === 'scheduled' && (
                    <button
                      onClick={() => handleStartVisit(visit.id)}
                      className="flex items-center justify-center space-x-2 px-4 py-2 bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/40 rounded-xl transition-all"
                    >
                      <Timer size={16} />
                      <span>Start</span>
                    </button>
                  )}

                  {visit.status === 'in-progress' && (
                    <button
                      onClick={() => handleCompleteVisit(visit.id)}
                      className="flex items-center justify-center space-x-2 px-4 py-2 bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 hover:bg-purple-200 dark:hover:bg-purple-900/40 rounded-xl transition-all"
                    >
                      <CheckCircle size={16} />
                      <span>Complete</span>
                    </button>
                  )}

                  <a
                    href={`tel:${visit.clientPhone}`}
                    className="flex items-center justify-center space-x-2 px-4 py-2 bg-orange-100 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 hover:bg-orange-200 dark:hover:bg-orange-900/40 rounded-xl transition-all"
                  >
                    <Phone size={16} />
                    <span>Call</span>
                  </a>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Visit Details Modal */}
      {showModal && selectedVisit && (
        <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-950 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 dark:border-gray-800">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Visit Details
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Property Info */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Property Information</h3>
                <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Property:</span>
                    <span className="font-medium text-gray-900 dark:text-white">{selectedVisit.propertyTitle}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Type:</span>
                    <span className="font-medium text-gray-900 dark:text-white">{selectedVisit.propertyType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Address:</span>
                    <span className="font-medium text-gray-900 dark:text-white text-right">{selectedVisit.address}</span>
                  </div>
                </div>
              </div>

              {/* Client Info */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Client Information</h3>
                <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Name:</span>
                    <span className="font-medium text-gray-900 dark:text-white">{selectedVisit.clientName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Phone:</span>
                    <a href={`tel:${selectedVisit.clientPhone}`} className="font-medium text-blue-600 dark:text-blue-400 hover:underline">
                      {selectedVisit.clientPhone}
                    </a>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Email:</span>
                    <a href={`mailto:${selectedVisit.clientEmail}`} className="font-medium text-blue-600 dark:text-blue-400 hover:underline">
                      {selectedVisit.clientEmail}
                    </a>
                  </div>
                </div>
              </div>

              {/* Visit Details */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Visit Details</h3>
                <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Date & Time:</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {new Date(selectedVisit.scheduledDate).toLocaleDateString()} at {selectedVisit.scheduledTime}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Visit Type:</span>
                    <span className="font-medium text-gray-900 dark:text-white capitalize">{selectedVisit.visitType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Duration:</span>
                    <span className="font-medium text-gray-900 dark:text-white">{selectedVisit.estimatedDuration}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Earnings:</span>
                    <span className="font-medium text-green-600 dark:text-green-400">₹{selectedVisit.earnings}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Status:</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedVisit.status)}`}>
                      {selectedVisit.status.replace('-', ' ').toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Photos (if completed) */}
              {selectedVisit.status === 'completed' && selectedVisit.photos && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Visit Photos</h3>
                  <div className="grid grid-cols-3 gap-3">
                    {selectedVisit.photos.map((photo, index) => (
                      <div key={index} className="aspect-square bg-gray-200 dark:bg-gray-800 rounded-xl flex items-center justify-center">
                        <Camera className="w-8 h-8 text-gray-400" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200 dark:border-gray-800">
                <button
                  onClick={() => openGoogleMaps(selectedVisit.coordinates, selectedVisit.address)}
                  className="flex items-center justify-center space-x-2 px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-xl transition-all"
                >
                  <Navigation size={20} />
                  <span>Get Directions</span>
                </button>
                
                <a
                  href={`tel:${selectedVisit.clientPhone}`}
                  className="flex items-center justify-center space-x-2 px-4 py-3 bg-green-500 hover:bg-green-600 text-white font-medium rounded-xl transition-all"
                >
                  <Phone size={20} />
                  <span>Call Client</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}