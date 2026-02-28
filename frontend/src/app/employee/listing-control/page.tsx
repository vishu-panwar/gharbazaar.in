'use client'

import {
    Home, CheckCircle, XCircle, Clock, MapPin, Bed, Bath, Square,
    Shield, ShieldCheck, Calendar, CalendarPlus, Search, Eye, Building2,
    Loader2, ChevronRight
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { backendApi } from '@/lib/backendApi'
import toast from 'react-hot-toast'
import Link from 'next/link'

export default function ListingControlPage() {
    const [properties, setProperties] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('active')

    // Schedule visit modal state
    const [scheduleTargetId, setScheduleTargetId] = useState<string | null>(null)
    const [scheduledAt, setScheduledAt] = useState('')
    const [visitNotes, setVisitNotes] = useState('')
    const [scheduleLoading, setScheduleLoading] = useState(false)

    // Verify modal state
    const [verifyTargetId, setVerifyTargetId] = useState<string | null>(null)
    const [verifyLoading, setVerifyLoading] = useState(false)

    useEffect(() => {
        fetchProperties()
    }, [])

    const fetchProperties = async () => {
        try {
            setLoading(true)
            const res = await backendApi.employee.getApprovedProperties()
            if (res.success) {
                setProperties(res.data.properties || [])
            } else {
                toast.error(res.error || 'Failed to fetch properties')
            }
        } catch (e) {
            toast.error('Network error')
        } finally {
            setLoading(false)
        }
    }

    const handleScheduleVisit = async () => {
        if (!scheduleTargetId || !scheduledAt) {
            toast.error('Please select a date/time')
            return
        }
        setScheduleLoading(true)
        try {
            const res = await backendApi.employee.scheduleVisit({
                propertyId: scheduleTargetId,
                scheduledAt,
                notes: visitNotes || undefined,
            })
            if (res.success) {
                toast.success('Site visit scheduled! Seller notified.')
                setScheduleTargetId(null)
                setScheduledAt('')
                setVisitNotes('')
            } else {
                toast.error(res.error || 'Failed to schedule visit')
            }
        } catch (e) {
            toast.error('Error scheduling visit')
        } finally {
            setScheduleLoading(false)
        }
    }

    const handleVerify = async () => {
        if (!verifyTargetId) return
        setVerifyLoading(true)
        try {
            const res = await backendApi.employee.verifyProperty(verifyTargetId)
            if (res.success) {
                toast.success('Property marked as physically verified!')
                setVerifyTargetId(null)
                fetchProperties()
            } else {
                toast.error(res.error || 'Failed to verify property')
            }
        } catch (e) {
            toast.error('Error verifying property')
        } finally {
            setVerifyLoading(false)
        }
    }

    const filtered = properties.filter(p => {
        const matchesSearch =
            p.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.sellerClientId?.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesStatus = statusFilter === 'all' || p.status === statusFilter
        return matchesSearch && matchesStatus
    })

    const getStatusBadge = (status: string, verified: boolean) => {
        if (status === 'active' && verified) {
            return (
                <div className="flex items-center space-x-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-3 py-1 rounded-full text-xs font-bold">
                    <ShieldCheck size={12} />
                    <span>Verified + Live</span>
                </div>
            )
        }
        if (status === 'active') {
            return (
                <div className="flex items-center space-x-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-3 py-1 rounded-full text-xs font-semibold">
                    <CheckCircle size={12} />
                    <span>Live</span>
                </div>
            )
        }
        return (
            <div className="flex items-center space-x-1 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 px-3 py-1 rounded-full text-xs font-semibold">
                <Clock size={12} />
                <span>Paused</span>
            </div>
        )
    }

    const scheduleTarget = properties.find(p => (p._id || p.id) === scheduleTargetId)
    const verifyTarget = properties.find(p => (p._id || p.id) === verifyTargetId)

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-800 pb-20">
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-900 via-purple-900 to-slate-900 text-white shadow-2xl">
                <div className="max-w-7xl mx-auto px-6 py-10">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="flex items-center space-x-4">
                            <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg border border-white/10">
                                <Shield className="text-white" size={32} />
                            </div>
                            <div>
                                <h1 className="text-3xl font-black tracking-tight">Listing Control Centre</h1>
                                <p className="text-indigo-200/70 font-medium">Schedule site visits & mark physical verification</p>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <Link
                                href="/employee/verification"
                                className="px-5 py-3 bg-white/10 hover:bg-white/20 rounded-xl font-bold transition-all border border-white/10 flex items-center gap-2 text-sm"
                            >
                                <Clock size={16} />
                                Pending Verification
                            </Link>
                            <Link
                                href="/employee/properties"
                                className="px-5 py-3 bg-white/10 hover:bg-white/20 rounded-xl font-bold transition-all border border-white/10 flex items-center gap-2 text-sm"
                            >
                                <Home size={16} />
                                Manage Inventory
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-8">
                {/* Stats Bar */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    {[
                        { label: 'Total Listings', value: properties.length, color: 'from-blue-500 to-indigo-600' },
                        { label: 'Live', value: properties.filter(p => p.status === 'active').length, color: 'from-green-500 to-emerald-600' },
                        { label: 'Paused', value: properties.filter(p => p.status === 'inactive').length, color: 'from-amber-500 to-orange-600' },
                        { label: 'Verified', value: properties.filter(p => p.verified).length, color: 'from-purple-500 to-indigo-600' },
                    ].map((s, i) => (
                        <div key={i} className="bg-white/90 dark:bg-gray-800/90 rounded-2xl p-5 shadow-lg border border-gray-200/50 dark:border-gray-700/50">
                            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center text-white shadow-md mb-3`}>
                                <Home size={18} />
                            </div>
                            <p className="text-2xl font-black text-gray-900 dark:text-white">{s.value}</p>
                            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mt-1">{s.label}</p>
                        </div>
                    ))}
                </div>

                {/* Controls */}
                <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-2xl p-5 shadow-lg border border-gray-200/50 dark:border-gray-700/50 mb-6 flex flex-col lg:flex-row gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search by title, city or seller ID..."
                            className="w-full pl-11 pr-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900 border dark:border-gray-700 outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-2 p-1 bg-gray-100 dark:bg-gray-900 rounded-xl">
                        {(['all', 'active', 'inactive'] as const).map(f => (
                            <button
                                key={f}
                                onClick={() => setStatusFilter(f)}
                                className={`px-5 py-2 rounded-lg font-bold transition-all text-sm ${statusFilter === f
                                    ? 'bg-white dark:bg-gray-800 text-indigo-600 dark:text-indigo-400 shadow-sm'
                                    : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                                    }`}
                            >
                                {f.charAt(0).toUpperCase() + f.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Properties Grid */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4" />
                        <p className="text-gray-500 font-bold">Loading listings...</p>
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="text-center py-20 bg-white/50 dark:bg-gray-800/50 rounded-3xl border-2 border-dashed border-gray-300 dark:border-gray-700">
                        <Building2 size={48} className="mx-auto text-gray-300 mb-4" />
                        <p className="text-gray-500 text-xl font-bold">No matching listings</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {filtered.map(p => (
                            <div
                                key={p._id || p.id}
                                className="group bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg border-2 border-transparent hover:border-indigo-300 dark:hover:border-indigo-600 transition-all hover:shadow-2xl hover:-translate-y-1"
                            >
                                <div className="relative h-44 bg-gray-100 dark:bg-gray-900">
                                    <img
                                        src={p.photos?.[0] || '/images/property-placeholder.jpg'}
                                        alt={p.title}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute top-3 right-3">
                                        {getStatusBadge(p.status, p.verified)}
                                    </div>
                                    {p.verified && (
                                        <div className="absolute bottom-3 left-3 bg-emerald-500/90 backdrop-blur-sm text-white px-2 py-1 rounded-lg text-xs font-bold flex items-center gap-1">
                                            <ShieldCheck size={12} />
                                            Physically Verified
                                        </div>
                                    )}
                                </div>
                                <div className="p-5">
                                    <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-1 line-clamp-1">{p.title}</h3>
                                    <div className="flex items-center text-gray-500 text-sm mb-3">
                                        <MapPin size={13} className="mr-1" />
                                        <span className="truncate">{p.city}</span>
                                        <span className="mx-2 text-gray-300">•</span>
                                        <span className="font-bold text-indigo-600">₹{p.price?.toLocaleString()}</span>
                                    </div>
                                    <div className="grid grid-cols-3 gap-2 text-xs font-bold text-gray-500 mb-4">
                                        <div className="bg-gray-50 dark:bg-gray-900 p-2 rounded-lg flex items-center justify-center gap-1"><Bed size={11} />{p.bedrooms ?? '–'}</div>
                                        <div className="bg-gray-50 dark:bg-gray-900 p-2 rounded-lg flex items-center justify-center gap-1"><Bath size={11} />{p.bathrooms ?? '–'}</div>
                                        <div className="bg-gray-50 dark:bg-gray-900 p-2 rounded-lg flex items-center justify-center gap-1"><Square size={11} />{p.area ?? '–'}</div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => { setScheduleTargetId(p._id || p.id); setScheduledAt(''); setVisitNotes('') }}
                                            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-indigo-100 hover:bg-indigo-200 dark:bg-indigo-900/30 dark:hover:bg-indigo-800/50 text-indigo-700 dark:text-indigo-300 rounded-xl font-bold text-sm transition-all"
                                        >
                                            <CalendarPlus size={15} />
                                            Schedule Visit
                                        </button>
                                        {!p.verified && (
                                            <button
                                                onClick={() => setVerifyTargetId(p._id || p.id)}
                                                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-emerald-100 hover:bg-emerald-200 dark:bg-emerald-900/30 dark:hover:bg-emerald-800/50 text-emerald-700 dark:text-emerald-300 rounded-xl font-bold text-sm transition-all"
                                            >
                                                <ShieldCheck size={15} />
                                                Mark Verified
                                            </button>
                                        )}
                                        {p.verified && (
                                            <div className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-gray-100 dark:bg-gray-900 text-gray-400 rounded-xl font-bold text-sm">
                                                <ShieldCheck size={15} />
                                                Verified ✓
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Schedule Visit Modal */}
            {scheduleTargetId && scheduleTarget && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl max-w-lg w-full p-8">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center">
                                <CalendarPlus className="text-indigo-600" size={24} />
                            </div>
                            <div>
                                <h2 className="text-xl font-black dark:text-white">Schedule Site Visit</h2>
                                <p className="text-sm text-gray-500 line-clamp-1">{scheduleTarget.title}</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                                    Visit Date & Time *
                                </label>
                                <input
                                    type="datetime-local"
                                    value={scheduledAt}
                                    onChange={e => setScheduledAt(e.target.value)}
                                    min={new Date().toISOString().slice(0, 16)}
                                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border dark:border-gray-700 rounded-2xl focus:ring-2 focus:ring-indigo-500 dark:text-white outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                                    Notes (optional)
                                </label>
                                <textarea
                                    rows={3}
                                    value={visitNotes}
                                    onChange={e => setVisitNotes(e.target.value)}
                                    placeholder="Any instructions for the site visit..."
                                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border dark:border-gray-700 rounded-2xl focus:ring-2 focus:ring-indigo-500 dark:text-white outline-none resize-none"
                                />
                            </div>
                        </div>

                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={() => { setScheduleTargetId(null) }}
                                className="flex-1 py-3 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-2xl font-bold hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleScheduleVisit}
                                disabled={scheduleLoading || !scheduledAt}
                                className="flex-1 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-2xl font-bold transition-all shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {scheduleLoading ? <Loader2 size={18} className="animate-spin" /> : <Calendar size={18} />}
                                Schedule Visit
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Verify Confirmation Modal */}
            {verifyTargetId && verifyTarget && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl max-w-md w-full p-8 text-center">
                        <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-5">
                            <ShieldCheck className="text-emerald-600" size={40} />
                        </div>
                        <h2 className="text-2xl font-black dark:text-white mb-2">Mark as Physically Verified?</h2>
                        <p className="text-gray-600 dark:text-gray-400 mb-2 font-semibold">{verifyTarget.title}</p>
                        <p className="text-sm text-gray-500 mb-8">
                            This will add a verified badge to the property listing and notify the seller.
                            Only mark properties you have physically inspected.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setVerifyTargetId(null)}
                                className="flex-1 py-3 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-2xl font-bold hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleVerify}
                                disabled={verifyLoading}
                                className="flex-1 py-3 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white rounded-2xl font-bold transition-all shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {verifyLoading ? <Loader2 size={18} className="animate-spin" /> : <ShieldCheck size={18} />}
                                Confirm Verification
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
