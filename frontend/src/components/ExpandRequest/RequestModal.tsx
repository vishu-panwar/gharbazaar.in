'use client'

import { useState, useEffect } from 'react'
import { X, MapPin, Send, Loader2, CheckCircle2 } from 'lucide-react'
import { backendApi } from '@/lib/backendApi'
import toast from 'react-hot-toast'

interface ExpandRequestModalProps {
    isOpen: boolean
    onClose: () => void
    userName?: string
    userEmail?: string
}

// Indian states list
const INDIAN_STATES = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
    'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
    'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
    'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
    'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu',
    'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry'
]

export default function ExpandRequestModal({ isOpen, onClose, userName = '', userEmail = '' }: ExpandRequestModalProps) {
    const [formData, setFormData] = useState({
        name: userName,
        city: '',
        state: '',
        additionalInfo: ''
    })
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)

    // Update name when userName prop changes
    useEffect(() => {
        setFormData(prev => ({ ...prev, name: userName }))
    }, [userName])

    // Close modal on success after delay
    useEffect(() => {
        if (success) {
            const timer = setTimeout(() => {
                onClose()
                setSuccess(false)
            }, 2000)
            return () => clearTimeout(timer)
        }
    }, [success, onClose])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!formData.name || !formData.city || !formData.state) {
            toast.error('Please fill in all required fields')
            return
        }

        try {
            setLoading(true)
            const response = await backendApi.expandRequests.create(formData)

            if (response.success) {
                setSuccess(true)
                toast.success('Request submitted successfully! 🎉')
                // Reset form
                setFormData({
                    name: userName,
                    city: '',
                    state: '',
                    additionalInfo: ''
                })
            } else {
                toast.error(response.error || 'Failed to submit request')
            }
        } catch (error: any) {
            toast.error(error.message || 'Something went wrong')
        } finally {
            setLoading(false)
        }
    }

    if (!isOpen) return null

    const handleCloseClick = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        onClose()
    }

    const handleModalClick = (e: React.MouseEvent) => {
        // Prevent clicks inside modal from closing it
        e.stopPropagation()
    }

    return (
        <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200"
            onClick={onClose}
        >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

            {/* Modal */}
            <div 
                className="relative w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300"
                onClick={handleModalClick}
            >
                {/* Close button - Outside header */}
                <button
                    type="button"
                    onClick={handleCloseClick}
                    className="absolute top-3 right-3 p-1.5 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all z-50 shadow-lg"
                    aria-label="Close modal"
                >
                    <X className="w-4 h-4 text-gray-700 dark:text-gray-300" />
                </button>

                {/* Gradient Header */}
                <div className="relative bg-gradient-to-br from-orange-500 via-pink-500 to-purple-600 p-5 text-white">
                    {/* Animated background */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer pointer-events-none" />

                    {/* Header content */}
                    <div className="relative z-10">
                        <div className="flex items-center space-x-2 mb-1">
                            <div className="p-2 bg-white/20 rounded-full backdrop-blur-sm">
                                <MapPin className="w-5 h-5" />
                            </div>
                            <h2 className="text-xl font-bold">Expand Request</h2>
                        </div>
                        <p className="text-white/90 text-xs">
                            Help us bring GharBazaar to your city! 🚀
                        </p>
                    </div>
                </div>

                {/* Success State */}
                {success && (
                    <div className="absolute inset-0 bg-white dark:bg-gray-900 flex items-center justify-center z-20">
                        <div className="text-center animate-in zoom-in duration-500">
                            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                                <CheckCircle2 className="w-10 h-10 text-green-600 dark:text-green-400" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                                Request Submitted!
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                We'll review your request soon
                            </p>
                        </div>
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-5 space-y-4">
                    {/* Name Field */}
                    <div>
                        <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                            Your Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-3 py-2 text-sm rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-purple-500 dark:focus:border-purple-400 focus:ring-2 focus:ring-purple-200 dark:focus:ring-purple-900/30 transition-all outline-none"
                            placeholder="Enter your name"
                            required
                        />
                    </div>

                    {/* City Field */}
                    <div>
                        <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                            City <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={formData.city}
                            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                            className="w-full px-3 py-2 text-sm rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-purple-500 dark:focus:border-purple-400 focus:ring-2 focus:ring-purple-200 dark:focus:ring-purple-900/30 transition-all outline-none"
                            placeholder="Enter your city"
                            required
                        />
                    </div>

                    {/* State Dropdown */}
                    <div>
                        <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                            State <span className="text-red-500">*</span>
                        </label>
                        <select
                            value={formData.state}
                            onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                            className="w-full px-3 py-2 text-sm rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-purple-500 dark:focus:border-purple-400 focus:ring-2 focus:ring-purple-200 dark:focus:ring-purple-900/30 transition-all outline-none"
                            required
                        >
                            <option value="">Select your state</option>
                            {INDIAN_STATES.map((state) => (
                                <option key={state} value={state}>
                                    {state}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Additional Info (Optional) */}
                    <div>
                        <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                            Additional Information <span className="text-gray-400 text-xs">(Optional)</span>
                        </label>
                        <textarea
                            value={formData.additionalInfo}
                            onChange={(e) => setFormData({ ...formData, additionalInfo: e.target.value })}
                            className="w-full px-3 py-2 text-sm rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-purple-500 dark:focus:border-purple-400 focus:ring-2 focus:ring-purple-200 dark:focus:ring-purple-900/30 transition-all outline-none resize-none"
                            placeholder="Any specific requirements or suggestions..."
                            rows={2}
                            maxLength={500}
                        />
                        <p className="text-xs text-gray-400 mt-0.5">
                            {formData.additionalInfo.length}/500 characters
                        </p>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600 hover:from-orange-600 hover:via-pink-600 hover:to-purple-700 text-white font-semibold py-2.5 px-4 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 text-sm"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                <span>Submitting...</span>
                            </>
                        ) : (
                            <>
                                <Send className="w-4 h-4" />
                                <span>Submit Request</span>
                            </>
                        )}
                    </button>

                    {/* Info Text */}
                    <p className="text-center text-xs text-gray-500 dark:text-gray-400 -mt-1">
                        Currently operating in <span className="font-semibold">Saharanpur</span> and <span className="font-semibold">Roorkee</span>
                    </p>
                </form>
            </div>
        </div>
    )
}
