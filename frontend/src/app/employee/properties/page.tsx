'use client'

import {
    Home,
    Clock,
    CheckCircle,
    Eye,
    EyeOff,
    MapPin,
    Bed,
    Bath,
    Square,
    Building2,
    XCircle,
    Search,
    Filter,
    Play,
    Pause,
    AlertTriangle
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { backendApi } from '@/lib/backendApi'
import toast from 'react-hot-toast'
import Link from 'next/link'

export default function EmployeePropertiesPage() {
    const [properties, setProperties] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all')
    const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null)

    useEffect(() => {
        fetchProperties()
    }, [])

    const fetchProperties = async () => {
        try {
            setLoading(true)
            const response = await backendApi.employee.getApprovedProperties()
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

    const handleTogglePause = async (id: string, currentStatus: string) => {
        const action = currentStatus === 'active' ? 'pause' : 'resume'
        try {
            toast.loading(`${action === 'pause' ? 'Pausing' : 'Resuming'} property...`, { id: 'toggle' })
            const response = await backendApi.employee.togglePropertyPause(id)
            if (response.success) {
                toast.success(`Property ${action === 'pause' ? 'paused' : 'resumed'} successfully!`, { id: 'toggle' })
                fetchProperties()
            } else {
                toast.error(response.error || 'Update failed', { id: 'toggle' })
            }
        } catch (error) {
            toast.error('Error updating property', { id: 'toggle' })
        }
    }

    const filteredProperties = properties.filter(p => {
        const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.sellerClientId?.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesStatus = statusFilter === 'all' || p.status === statusFilter
        return matchesSearch && matchesStatus
    })

    const getStatusBadge = (status: string) => {
        if (status === 'active') {
            return (
                <div className="flex items-center space-x-1 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 px-3 py-1 rounded-full text-xs font-semibold">
                    <CheckCircle size={12} />
                    <span>Live</span>
                </div>
            )
        }
        return (
            <div className="flex items-center space-x-1 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 px-3 py-1 rounded-full text-xs font-semibold">
                <Pause size={12} />
                <span>Paused</span>
            </div>
        )
    }

    const selectedProp = properties.find(p => (p._id || p.id) === selectedPropertyId)

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-800 pb-20">
            {/* Header */}
            <div className="bg-slate-900 text-white shadow-2xl">
                <div className="max-w-7xl mx-auto px-6 py-10">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="flex items-center space-x-4">
                            <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg border border-white/10">
                                <Home className="text-white" size={32} />
                            </div>
                            <div>
                                <h1 className="text-3xl font-black tracking-tight">Manage Inventory</h1>
                                <p className="text-blue-100/70 font-medium">Pause or resume live property listings</p>
                            </div>
                        </div>

                        <Link
                            href="/employee/verification"
                            className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-xl font-bold transition-all border border-white/10 flex items-center gap-2"
                        >
                            <Clock size={18} />
                            Pending Verifications
                        </Link>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 -mt-8">
                {/* Controls */}
                <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-gray-200/50 dark:border-gray-700/50 mb-8 flex flex-col lg:flex-row gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search by title, location or seller ID..."
                            className="w-full pl-12 pr-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900 border dark:border-gray-700 outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-2 p-1 bg-gray-100 dark:bg-gray-900 rounded-xl">
                        {(['all', 'active', 'inactive'] as const).map((filter) => (
                            <button
                                key={filter}
                                onClick={() => setStatusFilter(filter)}
                                className={`px-6 py-2 rounded-lg font-bold transition-all ${statusFilter === filter
                                        ? 'bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 shadow-sm'
                                        : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                                    }`}
                            >
                                {filter.charAt(0).toUpperCase() + filter.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                        <p className="text-gray-500 font-bold">Loading inventory...</p>
                    </div>
                ) : filteredProperties.length === 0 ? (
                    <div className="text-center py-20 bg-white/50 dark:bg-gray-800/50 rounded-3xl border-2 border-dashed border-gray-300 dark:border-gray-700">
                        <Search size={48} className="mx-auto text-gray-300 mb-4" />
                        <p className="text-gray-500 text-xl font-bold">No properties match your criteria</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredProperties.map((p) => (
                            <div
                                key={p._id || p.id}
                                className={`group bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg border-2 transition-all hover:shadow-2xl ${p.status === 'active' ? 'border-transparent' : 'border-amber-200 dark:border-amber-900/50 grayscale-[0.3]'
                                    }`}
                            >
                                <div className="relative h-48 bg-gray-100 dark:bg-gray-900">
                                    <img
                                        src={p.photos?.[0] || '/images/property-placeholder.jpg'}
                                        alt={p.title}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute top-4 right-4 shadow-lg">
                                        {getStatusBadge(p.status)}
                                    </div>
                                    {p.status === 'inactive' && (
                                        <div className="absolute inset-0 bg-amber-900/20 flex items-center justify-center">
                                            <div className="bg-amber-600 text-white px-4 py-2 rounded-xl font-black text-xs uppercase tracking-widest flex items-center gap-2 shadow-2xl">
                                                <EyeOff size={16} /> Hidden from Public
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="font-bold text-lg text-gray-900 dark:text-white line-clamp-1">{p.title}</h3>
                                        <p className="font-black text-blue-600">₹{p.price?.toLocaleString()}</p>
                                    </div>

                                    <div className="flex items-center text-gray-500 text-sm mb-4">
                                        <MapPin size={14} className="mr-1" />
                                        <span>{p.city}</span>
                                        <span className="mx-2 text-gray-300">•</span>
                                        <span className="font-medium text-gray-400">ID: {p.sellerClientId || 'NA'}</span>
                                    </div>

                                    <div className="grid grid-cols-3 gap-2 mb-6 text-xs font-bold text-gray-500 dark:text-gray-400">
                                        <div className="bg-gray-50 dark:bg-gray-900 p-2 rounded-lg flex items-center justify-center gap-1">
                                            <Bed size={12} /> {p.bedrooms}
                                        </div>
                                        <div className="bg-gray-50 dark:bg-gray-900 p-2 rounded-lg flex items-center justify-center gap-1">
                                            <Bath size={12} /> {p.bathrooms}
                                        </div>
                                        <div className="bg-gray-50 dark:bg-gray-900 p-2 rounded-lg flex items-center justify-center gap-1">
                                            <Square size={12} /> {p.area}
                                        </div>
                                    </div>

                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleTogglePause(p._id || p.id, p.status)}
                                            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all shadow-md ${p.status === 'active'
                                                    ? 'bg-amber-100 hover:bg-amber-200 text-amber-700'
                                                    : 'bg-green-600 hover:bg-green-700 text-white'
                                                }`}
                                        >
                                            {p.status === 'active' ? (
                                                <><Pause size={18} /> Pause Showing</>
                                            ) : (
                                                <><Play size={18} /> Resume Showing</>
                                            )}
                                        </button>
                                        <button
                                            onClick={() => setSelectedPropertyId(p._id || p.id)}
                                            className="p-3 bg-gray-100 dark:bg-gray-900 text-gray-500 hover:text-blue-500 rounded-xl transition-all"
                                            title="View Details"
                                        >
                                            <Eye size={20} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Details Modal */}
            {selectedProp && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-8 border-b dark:border-gray-800 flex justify-between items-center">
                            <div>
                                <h2 className="text-2xl font-bold dark:text-white">{selectedProp.title}</h2>
                                <div className="flex gap-2 mt-1">
                                    {getStatusBadge(selectedProp.status)}
                                    <span className="text-sm text-gray-500">Verified Listing</span>
                                </div>
                            </div>
                            <button onClick={() => setSelectedPropertyId(null)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full">
                                <XCircle size={28} className="text-gray-500" />
                            </button>
                        </div>

                        <div className="p-8 py-0">
                            {/* Photos Placeholder */}
                            <div className="aspect-video bg-gray-100 dark:bg-gray-800 rounded-2xl mt-8 overflow-hidden">
                                <img
                                    src={selectedProp.photos?.[0] || '/images/property-placeholder.jpg'}
                                    alt="Property"
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            <div className="grid md:grid-cols-2 gap-12 py-8 text-gray-600 dark:text-gray-300">
                                <div className="space-y-4">
                                    <h4 className="font-black text-gray-900 dark:text-white uppercase text-xs tracking-widest">Description</h4>
                                    <p className="leading-relaxed">{selectedProp.description}</p>

                                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-800">
                                        <div className="flex items-center gap-2 text-blue-700 dark:text-blue-400 font-bold text-sm mb-1">
                                            <AlertTriangle size={14} /> Moderation Policy
                                        </div>
                                        <p className="text-xs text-blue-600/80 dark:text-blue-400/80">
                                            Employees can only pause or resume showings. Deletion is restricted to ensure listing history integrity.
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-2xl">
                                        <h4 className="font-bold dark:text-white mb-4">Seller Information</h4>
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black">
                                                {selectedProp.sellerClientId?.slice(-2) || 'S'}
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-900 dark:text-white">{selectedProp.sellerName || 'Verified Seller'}</p>
                                                <p className="text-xs text-gray-500">Client ID: {selectedProp.sellerClientId || 'NA'}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex gap-4">
                                        <button
                                            onClick={() => {
                                                handleTogglePause(selectedProp._id || selectedProp.id, selectedProp.status)
                                                setSelectedPropertyId(null)
                                            }}
                                            className={`flex-1 py-4 rounded-2xl font-black shadow-lg transition-all ${selectedProp.status === 'active'
                                                    ? 'bg-amber-600 hover:bg-amber-700 text-white'
                                                    : 'bg-green-600 hover:bg-green-700 text-white'
                                                }`}
                                        >
                                            {selectedProp.status === 'active' ? 'PAUSE LISTING' : 'RESUME LISTING'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
