'use client'

import { useState } from 'react'
import { Megaphone, Send, Users, Shield, User, MapPin, Scale, Trash2, Bell, Info } from 'lucide-react'
import { backendApi } from '@/lib/backendApi'
import toast from 'react-hot-toast'

const TARGET_OPTIONS = [
    { id: 'all', label: 'Everyone', icon: Users, color: 'bg-blue-500' },
    { id: 'buyer', label: 'Buyers', icon: User, color: 'bg-emerald-500' },
    { id: 'seller', label: 'Sellers', icon: Shield, color: 'bg-purple-500' },
    { id: 'employee', label: 'Employees', icon: Shield, color: 'bg-orange-500' },
    { id: 'ground_partner', label: 'Ground Partners', icon: MapPin, color: 'bg-indigo-500' },
    { id: 'legal_partner', label: 'Legal Partners', icon: Scale, color: 'bg-red-500' },
]

export default function AnnouncementsPage() {
    const [title, setTitle] = useState('')
    const [message, setMessage] = useState('')
    const [target, setTarget] = useState('all')
    const [priority, setPriority] = useState('medium')
    const [link, setLink] = useState('')
    const [sending, setSending] = useState(false)

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!title || !message) {
            toast.error('Title and message are required')
            return
        }

        try {
            setSending(true)
            const response = await backendApi.admin.broadcastAnnouncement({
                target,
                title,
                message,
                link,
                priority
            })

            if (response.success) {
                toast.success(response.message || 'Announcement sent successfully!')
                setTitle('')
                setMessage('')
                setLink('')
            } else {
                toast.error(response.error || 'Failed to send announcement')
            }
        } catch (error) {
            console.error('Error sending announcement:', error)
            toast.error('Failed to send announcement')
        } finally {
            setSending(false)
        }
    }

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold flex items-center gap-3">
                    <Megaphone className="text-emerald-500" />
                    Global Announcements
                </h1>
                <p className="text-gray-500 mt-2">Broadcast messages to all users or specific groups across the platform.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Form Section */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-6">
                        <form onSubmit={handleSend} className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold mb-2">Target Audience</label>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                    {TARGET_OPTIONS.map((opt) => (
                                        <button
                                            key={opt.id}
                                            type="button"
                                            onClick={() => setTarget(opt.id)}
                                            className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${target === opt.id
                                                    ? 'border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400'
                                                    : 'border-gray-100 dark:border-gray-700 hover:border-gray-200 dark:hover:border-gray-600'
                                                }`}
                                        >
                                            <opt.icon size={24} className="mb-2" />
                                            <span className="text-xs font-bold">{opt.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold mb-2">Priority</label>
                                    <select
                                        value={priority}
                                        onChange={(e) => setPriority(e.target.value)}
                                        className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-emerald-500 transition-all outline-none"
                                    >
                                        <option value="low">Low</option>
                                        <option value="medium">Medium</option>
                                        <option value="high">High (Urgent)</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold mb-2">Action Link (Optional)</label>
                                    <input
                                        type="text"
                                        value={link}
                                        onChange={(e) => setLink(e.target.value)}
                                        placeholder="e.g. /dashboard/membership"
                                        className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-emerald-500 transition-all outline-none"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold mb-2">Announcement Title</label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="e.g. New Maintenance Update"
                                    className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-emerald-500 transition-all outline-none"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold mb-2">Message Content</label>
                                <textarea
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder="Type your message here..."
                                    className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-emerald-500 transition-all outline-none min-h-[150px]"
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={sending}
                                className="w-full py-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl font-bold shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98]"
                            >
                                {sending ? (
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                ) : (
                                    <>
                                        <Send size={20} />
                                        Send Global Broadcast
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Preview Section */}
                <div className="space-y-6">
                    <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800 shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-3">
                            <div className="bg-red-500 w-2 h-2 rounded-full animate-ping"></div>
                        </div>
                        <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                            <Bell size={18} className="text-yellow-400" />
                            Live Preview
                        </h3>

                        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg border-l-4 border-emerald-500">
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg text-emerald-600 dark:text-emerald-400">
                                    <Megaphone size={20} />
                                </div>
                                <div className="flex-1">
                                    <p className="font-bold text-sm text-gray-900 dark:text-white">{title || 'Your Title Here'}</p>
                                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{message || 'Your broadcast message will appear here precisely as it will look on the user dashboard.'}</p>
                                    <div className="flex items-center gap-2 mt-3">
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${priority === 'high' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'
                                            }`}>
                                            {priority}
                                        </span>
                                        <span className="text-[10px] text-gray-400">Target: {target}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 pt-6 border-t border-gray-800">
                            <div className="flex items-center gap-2 text-gray-400 text-xs">
                                <Info size={14} />
                                <span>Sent messages cannot be unsent.</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-emerald-50 dark:bg-emerald-900/10 rounded-2xl p-5 border border-emerald-100 dark:border-emerald-800">
                        <h4 className="font-bold text-emerald-800 dark:text-emerald-400 text-sm mb-2">Admin Tip</h4>
                        <p className="text-xs text-emerald-700/80 dark:text-emerald-400/60 leading-relaxed">
                            Use announcements for platform updates, new feature launches, or urgent maintenance alerts. High priority messages trigger an active pulse on the user's notification bell.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
