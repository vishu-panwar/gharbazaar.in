'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
    User,
    Phone,
    MapPin,
    Building,
    Home,
    UserCheck,
    ArrowRight,
    Loader2
} from 'lucide-react'
import toast from 'react-hot-toast'
import { backendApi } from '@/lib/backendApi'
import { AuthUtils } from '@/lib/firebase'

export default function EmployeeOnboardingPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [user, setUser] = useState<any>(null)
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        address: '',
        branch: '',
        office: '',
        branchManagerName: ''
    })

    useEffect(() => {
        const cachedUser = AuthUtils.getCachedUser()
        if (!cachedUser || cachedUser.role !== 'employee') {
            router.push('/employee/login')
            return
        }

        if (cachedUser.onboardingCompleted) {
            router.push('/employee')
            return
        }

        setUser(cachedUser)
        setFormData(prev => ({ ...prev, name: cachedUser.name || cachedUser.displayName || '' }))
    }, [router])

    const validatePhone = (phone: string) => {
        const phoneRegex = /^(?:(?:\+|0{0,2})91[\s-]?)?[6789]\d{9}$/;
        return phoneRegex.test(phone)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!validatePhone(formData.phone)) {
            toast.error('Please enter a valid Indian phone number')
            return
        }

        try {
            setLoading(true)
            const token = localStorage.getItem('auth_token')
            if (!token) throw new Error('Authentication token not found')

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'}/api/employee/onboarding`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            })

            const result = await response.json()

            if (result.success) {
                toast.success('Onboarding completed!')
                // Update local cache
                const updatedUser = { ...user, ...result.data.user }
                AuthUtils.cacheUser(updatedUser)
                router.push('/employee')
            } else {
                toast.error(result.error || 'Failed to complete onboarding')
            }
        } catch (error: any) {
            console.error('Onboarding error:', error)
            toast.error(error.message || 'An error occurred during onboarding')
        } finally {
            setLoading(false)
        }
    }

    if (!user) return null

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-4">
            <div className="max-w-2xl w-full bg-white dark:bg-slate-800 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                <div className="md:flex">
                    {/* Left Sidebar - Info */}
                    <div className="md:w-1/3 bg-blue-600 p-8 text-white flex flex-col justify-between">
                        <div>
                            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-6">
                                <UserCheck size={28} />
                            </div>
                            <h1 className="text-2xl font-bold mb-4">Complete Your Profile</h1>
                            <p className="text-blue-100 text-sm leading-relaxed">
                                We need a few more details to set up your employee workstation and verify your branch location.
                            </p>
                        </div>
                        <div className="mt-8 pt-8 border-t border-white/20">
                            <div className="flex items-center space-x-3 text-sm text-blue-100">
                                <Building size={16} />
                                <span>Official Employee Portal</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Side - Form */}
                    <div className="md:w-2/3 p-8 md:p-12">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-4">
                                <h2 className="text-xl font-bold text-slate-900 dark:text-white pb-2 border-b border-slate-100 dark:border-slate-700">
                                    Personal Details
                                </h2>

                                {/* Full Name */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                        Full Name
                                    </label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                        <input
                                            type="text"
                                            required
                                            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                                            placeholder="John Doe"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        />
                                    </div>
                                </div>

                                {/* Phone Number */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                        Phone Number (India)
                                    </label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                        <input
                                            type="tel"
                                            required
                                            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                                            placeholder="+91 9876543210"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        />
                                    </div>
                                </div>

                                {/* Address */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                        Permanent Address
                                    </label>
                                    <div className="relative">
                                        <MapPin className="absolute left-3 top-3 text-slate-400" size={18} />
                                        <textarea
                                            required
                                            rows={2}
                                            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all outline-none resize-none"
                                            placeholder="Your full address"
                                            value={formData.address}
                                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4 pt-4">
                                <h2 className="text-xl font-bold text-slate-900 dark:text-white pb-2 border-b border-slate-100 dark:border-slate-700">
                                    Office Details
                                </h2>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Branch */}
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                            Branch
                                        </label>
                                        <div className="relative">
                                            <Building className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                            <input
                                                type="text"
                                                required
                                                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                                                placeholder="Main City Branch"
                                                value={formData.branch}
                                                onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    {/* Office */}
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                            Office/Floor
                                        </label>
                                        <div className="relative">
                                            <Home className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                            <input
                                                type="text"
                                                required
                                                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                                                placeholder="Level 4, Block B"
                                                value={formData.office}
                                                onChange={(e) => setFormData({ ...formData, office: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Manager Name */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                        Branch Manager Name
                                    </label>
                                    <div className="relative">
                                        <UserCheck className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                        <input
                                            type="text"
                                            required
                                            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                                            placeholder="Manager Name"
                                            value={formData.branchManagerName}
                                            onChange={(e) => setFormData({ ...formData, branchManagerName: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-blue-500/30 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center space-x-2 disabled:bg-slate-400 disabled:shadow-none"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="animate-spin" size={20} />
                                        <span>Submitting...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>Complete Onboarding</span>
                                        <ArrowRight size={20} />
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}
