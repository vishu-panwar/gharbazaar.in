'use client'

import {
  Home,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Clock,
  MapPin,
  Bed,
  Bath,
  Square,
  User,
  Phone,
  Camera,
  FileText,
  ThumbsUp,
  ThumbsDown,
  Shield,
  Award,
  Crown,
  Building2,
  Eye
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { backendApi } from '@/lib/backendApi'
import toast from 'react-hot-toast'

export default function PropertyVerificationPage() {
  const [activeTab, setActiveTab] = useState<'pending' | 'approved' | 'rejected' | 'all'>('pending')
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null)
  const [properties, setProperties] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [rejectionReason, setRejectionReason] = useState('')
  const [comments, setComments] = useState('')

  useEffect(() => {
    fetchProperties()
  }, [])

  const fetchProperties = async () => {
    try {
      setLoading(true)
      const response = await backendApi.employee.getPendingProperties()
      if (response.success) {
        setProperties(response.data.properties || [])
      } else {
        toast.error(response.error || 'Failed to fetch properties')
      }
    } catch (error) {
      console.error('Fetch error:', error)
      toast.error('Network error while fetching properties')
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (id: string) => {
    try {
      toast.loading('Approving property...', { id: 'approve' })
      const response = await backendApi.employee.approveProperty(id)
      if (response.success) {
        toast.success('Property approved successfully!', { id: 'approve' })
        setSelectedPropertyId(null)
        fetchProperties()
      } else {
        toast.error(response.error || 'Approval failed', { id: 'approve' })
      }
    } catch (error) {
      toast.error('Error approving property', { id: 'approve' })
    }
  }

  const handleReject = async (id: string) => {
    if (!rejectionReason && !comments) {
      toast.error('Please provide a reason for rejection')
      return
    }
    try {
      toast.loading('Rejecting property...', { id: 'reject' })
      const response = await backendApi.employee.rejectProperty(id, rejectionReason || comments)
      if (response.success) {
        toast.success('Property rejected', { id: 'reject' })
        setSelectedPropertyId(null)
        setRejectionReason('')
        setComments('')
        fetchProperties()
      } else {
        toast.error(response.error || 'Rejection failed', { id: 'reject' })
      }
    } catch (error) {
      toast.error('Error rejecting property', { id: 'reject' })
    }
  }

  const filteredProperties = activeTab === 'all'
    ? properties
    : properties.filter(p => {
      if (activeTab === 'approved') return p.status === 'active' || p.status === 'approved'
      return p.status === activeTab
    })

  const stats = {
    all: properties.length,
    pending: properties.filter(p => p.status === 'pending').length,
    approved: properties.filter(p => p.status === 'approved' || p.status === 'active').length,
    rejected: properties.filter(p => p.status === 'rejected').length
  }

  const selectedProp = properties.find(p => (p._id || p.id) === selectedPropertyId)

  const getStatusBadge = (status: string) => {
    const badges = {
      pending: { color: 'yellow', icon: Clock, label: 'Pending' },
      active: { color: 'green', icon: CheckCircle, label: 'Approved' },
      approved: { color: 'green', icon: CheckCircle, label: 'Approved' },
      rejected: { color: 'red', icon: XCircle, label: 'Rejected' },
      inactive: { color: 'gray', icon: Clock, label: 'Inactive' },
      sold: { color: 'blue', icon: CheckCircle, label: 'Sold' }
    }
    const badge = badges[status as keyof typeof badges] || badges.inactive
    return (
      <div className={`flex items-center space-x-1 ${badge.color === 'yellow' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400' :
          badge.color === 'green' ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' :
            badge.color === 'red' ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400' :
              'bg-gray-100 dark:bg-gray-900/30 text-gray-600 dark:text-gray-400'
        } px-3 py-1 rounded-full text-xs font-semibold`}>
        <badge.icon size={12} />
        <span>{badge.label}</span>
      </div>
    )
  }

  const getPriorityBadge = (priority: string) => {
    const colors = {
      high: 'bg-red-500',
      medium: 'bg-yellow-500',
      low: 'bg-blue-500'
    }
    return (
      <span className={`inline-block w-2 h-2 rounded-full ${colors[priority as keyof typeof colors] || 'bg-gray-400'}`} />
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-green-400/20 to-emerald-600/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-20 right-0 w-80 h-80 bg-gradient-to-bl from-blue-400/20 to-teal-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="relative z-10 bg-gradient-to-r from-slate-900 via-green-900 to-emerald-900 text-white">
          <div className="max-w-7xl mx-auto px-6 py-12">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-20 h-20 bg-gradient-to-br from-green-500 via-emerald-500 to-teal-600 rounded-3xl flex items-center justify-center shadow-2xl border-2 border-white/20">
                  <Home className="text-white" size={36} />
                </div>
                <div>
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-green-300 font-semibold text-sm">Verification System Active</span>
                  </div>
                  <h1 className="text-4xl lg:text-6xl font-black leading-tight bg-gradient-to-r from-white via-green-100 to-emerald-100 bg-clip-text text-transparent pb-2">
                    Property Verification
                  </h1>
                  <p className="text-xl text-green-100 leading-relaxed">
                    Advanced AI-powered property verification and document validation
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              title: 'Total Properties', value: stats.all, icon: Home, gradient: 'from-green-500 via-emerald-600'
            },
            {
              title: 'Pending Review', value: stats.pending, icon: Clock, gradient: 'from-yellow-500 via-orange-600'
            },
            {
              title: 'Approved', value: stats.approved, icon: CheckCircle, gradient: 'from-green-500 via-emerald-600'
            },
            {
              title: 'Rejected', value: stats.rejected, icon: XCircle, gradient: 'from-red-500 via-pink-600'
            }
          ].map((stat, index) => (
            <div key={index} className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-gray-200/50 dark:border-gray-700/50">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-xl mb-4 text-white`}>
                <stat.icon size={24} />
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm font-semibold mb-1">{stat.title}</p>
              <p className="text-3xl font-black text-gray-900 dark:text-white leading-none">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-gray-200/50 dark:border-gray-700/50">
          <div className="flex space-x-2 overflow-x-auto">
            {['pending', 'approved', 'rejected', 'all'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`flex-1 min-w-[120px] px-6 py-3 rounded-2xl font-bold transition-all ${activeTab === tab
                    ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-xl'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
              >
                {tab.toUpperCase()} ({stats[tab as keyof typeof stats]})
              </button>
            ))}
          </div>
        </div>

        {/* Properties Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white/50 dark:bg-gray-800/50 rounded-3xl border border-dashed border-gray-300 dark:border-gray-700">
            <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400 font-bold">Synchronizing property data...</p>
          </div>
        ) : filteredProperties.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white/50 dark:bg-gray-800/50 rounded-3xl border border-dashed border-gray-300 dark:border-gray-700">
            <Home size={64} className="text-gray-300 dark:text-gray-600 mb-4" />
            <p className="text-gray-600 dark:text-gray-400 font-bold">No properties found in this category</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {filteredProperties.map((property) => (
              <div
                key={property._id || property.id}
                onClick={() => setSelectedPropertyId(property._id || property.id)}
                className={`group bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl overflow-hidden shadow-2xl border cursor-pointer transition-all duration-500 hover:shadow-3xl hover:-translate-y-2 ${selectedPropertyId === (property._id || property.id)
                    ? 'border-green-500 ring-2 ring-green-500'
                    : 'border-gray-200/50 dark:border-gray-700/50'
                  }`}
              >
                <div className="relative h-48 bg-gray-200 dark:bg-gray-700 overflow-hidden">
                  {property.photos?.[0] ? (
                    <img src={property.photos[0]} alt={property.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex items-center justify-center h-full"><Building2 size={48} className="text-gray-400" /></div>
                  )}
                  <div className="absolute top-4 right-4">{getStatusBadge(property.status)}</div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{property.title}</h3>
                  <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm mb-4">
                    <MapPin size={14} className="mr-1" />
                    <span>{property.location}</span>
                  </div>

                  <div className="flex items-center justify-between mb-4 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center space-x-1"><Bed size={14} /><span>{property.bedrooms}</span></div>
                    <div className="flex items-center space-x-1"><Bath size={14} /><span>{property.bathrooms}</span></div>
                    <div className="flex items-center space-x-1"><Square size={14} /><span>{property.area}</span></div>
                  </div>

                  <div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-xl font-black text-green-600">₹{property.price?.toLocaleString()}</p>
                    {property.status === 'pending' && (
                      <div className="bg-green-100 text-green-700 px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1">
                        <Shield size={12} /> Verify
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {selectedProp && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-8 border-b dark:border-gray-800 flex justify-between items-center">
              <h2 className="text-2xl font-bold dark:text-white">{selectedProp.title}</h2>
              <button onClick={() => setSelectedPropertyId(null)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
                <XCircle size={28} className="text-gray-500" />
              </button>
            </div>

            <div className="p-8 space-y-6">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <p className="text-gray-600 dark:text-gray-400">{selectedProp.description}</p>
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-2xl flex items-center gap-4">
                    <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">
                      {(selectedProp.ownerName || 'U').charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold dark:text-white">{selectedProp.ownerName || 'Property Owner'}</p>
                      <p className="text-sm text-gray-500">Employee ID Ref: {selectedProp.sellerClientId || 'NA'}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-bold dark:text-white flex items-center gap-2"><FileText size={18} /> Documents</h4>
                  <div className="grid grid-cols-1 gap-2">
                    {(selectedProp.documents || []).length > 0 ? selectedProp.documents.map((doc: any, i: number) => (
                      <div key={i} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
                        <span className="text-sm dark:text-gray-300">{doc}</span>
                        <Eye size={16} className="text-blue-500 cursor-pointer" />
                      </div>
                    )) : <p className="text-gray-500 italic text-sm">No documents provided</p>}
                  </div>
                </div>
              </div>

              {selectedProp.status === 'pending' && (
                <div className="pt-6 border-t dark:border-gray-800 space-y-4">
                  <label className="block font-bold dark:text-white">Verification Notes</label>
                  <textarea
                    className="w-full p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl border dark:border-gray-700 outline-none focus:ring-2 focus:ring-green-500 dark:text-white"
                    rows={3}
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                    placeholder="Add internal notes about this property..."
                  ></textarea>
                  <div className="flex gap-4">
                    <button
                      onClick={() => handleApprove(selectedProp._id || selectedProp.id)}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2"
                    >
                      <ThumbsUp size={20} /> Approve
                    </button>
                    <button
                      onClick={() => handleReject(selectedProp._id || selectedProp.id)}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2"
                    >
                      <ThumbsDown size={20} /> Reject
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
