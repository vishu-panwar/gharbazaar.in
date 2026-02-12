'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FileCheck,
  Upload,
  User,
  Phone,
  MapPin,
  CreditCard,
  CheckCircle,
  AlertCircle,
  Loader2,
  Image as ImageIcon,
  ArrowRight,
  ShieldCheck,
  X,
  Clock
} from 'lucide-react'
import { backendApi } from '@/lib/backendApi'
import toast from 'react-hot-toast'

interface KycFormProps {
  onSuccess?: () => void
}

export default function KycForm({ onSuccess }: KycFormProps) {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [kycStatus, setKycStatus] = useState<any>(null)
  
  const [formData, setFormData] = useState({
    fullName: '',
    contactNumber: '',
    address: '',
    aadharNumber: ''
  })
  
  const [profileImage, setProfileImage] = useState<File | null>(null)
  const [aadharImage, setAadharImage] = useState<File | null>(null)
  
  const [previews, setPreviews] = useState({
    profile: '',
    aadhar: ''
  })

  useEffect(() => {
    fetchKycStatus()
  }, [])

  const fetchKycStatus = async () => {
    try {
      const response = await backendApi.kyc.getStatus()
      if (response.success) {
        setKycStatus(response.data)
      }
    } catch (error) {
      console.error('Failed to fetch KYC status:', error)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'profile' | 'aadhar') => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      if (field === 'profile') {
        setProfileImage(file)
        setPreviews(prev => ({ ...prev, profile: URL.createObjectURL(file) }))
      } else {
        setAadharImage(file)
        setPreviews(prev => ({ ...prev, aadhar: URL.createObjectURL(file) }))
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!profileImage || !aadharImage) {
      toast.error('Please upload both profile and Aadhar images')
      return
    }

    setLoading(true)
    try {
      const data = new FormData()
      data.append('fullName', formData.fullName)
      data.append('contactNumber', formData.contactNumber)
      data.append('address', formData.address)
      data.append('aadharNumber', formData.aadharNumber)
      data.append('profileImage', profileImage)
      data.append('aadharImage', aadharImage)

      const response = await backendApi.kyc.submit(data)
      if (response.success) {
        toast.success('KYC submitted successfully for review!')
        setStep(3) // Success step
        fetchKycStatus()
        if (onSuccess) onSuccess()
      } else {
        toast.error(response.error || 'Submission failed')
      }
    } catch (error: any) {
      toast.error(error.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  // Loading state
  if (kycStatus === null) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-white dark:bg-gray-900 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-800">
        <Loader2 className="h-8 w-8 text-blue-600 animate-spin mb-4" />
        <p className="text-gray-500 font-medium">Loading KYC details...</p>
      </div>
    )
  }

  // If already approved
  if (kycStatus.isVerified || kycStatus.status === 'approved') {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-8 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-3xl border border-green-200 dark:border-green-800 shadow-lg text-center"
      >
        <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-500/25">
          <ShieldCheck className="text-white h-10 w-10" />
        </div>
        <h3 className="text-2xl font-bold text-green-900 dark:text-green-400 mb-2">Account Verified</h3>
        <p className="text-green-700 dark:text-green-500/80 mb-6">Your KYC verification is complete. You can now access all partner features.</p>
        <div className="inline-flex items-center space-x-2 px-4 py-2 bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400 rounded-xl font-bold border border-green-200 dark:border-green-800">
          <span>ID: {kycStatus.kycId}</span>
        </div>
      </motion.div>
    )
  }

  // If pending review
  if (kycStatus.status === 'submitted') {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-8 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-3xl border border-blue-200 dark:border-blue-800 shadow-lg text-center"
      >
        <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-500/25">
          <Clock className="text-white h-10 w-10 animate-pulse" />
        </div>
        <h3 className="text-2xl font-bold text-blue-900 dark:text-blue-400 mb-2">Verification In Progress</h3>
        <p className="text-blue-700 dark:text-blue-500/80 mb-4">Our team is currently reviewing your documents. This usually takes 24-48 hours.</p>
        <div className="flex flex-col space-y-2 p-4 bg-white/50 dark:bg-gray-800/50 rounded-2xl border border-blue-100 dark:border-blue-900/50 max-w-sm mx-auto">
          <div className="flex justify-between text-sm font-medium">
            <span className="text-gray-500">Submitted on:</span>
            <span className="text-gray-900 dark:text-white">{new Date(kycStatus.request?.createdAt).toLocaleDateString()}</span>
          </div>
          <div className="flex justify-between text-sm font-medium">
            <span className="text-gray-500">Reference ID:</span>
            <span className="text-gray-900 dark:text-white">{kycStatus.request?.partnerId}</span>
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Form Steps Header */}
      <div className="flex items-center justify-between mb-8 px-4">
        {[
          { icon: User, label: 'Profile' },
          { icon: CreditCard, label: 'Verification' },
          { icon: CheckCircle, label: 'Finish' }
        ].map((s, i) => (
          <div key={i} className="flex flex-col items-center flex-1 relative">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 shadow-lg z-10 ${
              step > i + 1 ? 'bg-green-500 text-white' : 
              step === i + 1 ? 'bg-blue-600 text-white shadow-blue-500/25 scale-110' : 
              'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600'
            }`}>
              {step > i + 1 ? <CheckCircle size={24} /> : <s.icon size={24} />}
            </div>
            <span className={`mt-3 text-sm font-bold ${step === i + 1 ? 'text-blue-600' : 'text-gray-500'}`}>{s.label}</span>
            {i < 2 && (
              <div className={`absolute top-6 left-[60%] w-[80%] h-0.5 transition-all duration-500 hidden sm:block ${
                step > i + 1 ? 'bg-green-500' : 'bg-gray-200 dark:bg-gray-800'
              }`} />
            )}
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-[2.5rem] shadow-2xl shadow-blue-500/5 p-8 sm:p-12 overflow-hidden relative">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div>
                <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-2">Basic Information</h2>
                <p className="text-gray-500">Provide your official details for the verification process.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">Full Name (As per Aadhar)</label>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={20} />
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      placeholder="Enter your full name"
                      className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">Contact Number</label>
                  <div className="relative group">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={20} />
                    <input
                      type="tel"
                      name="contactNumber"
                      value={formData.contactNumber}
                      onChange={handleInputChange}
                      placeholder="e.g. +91 98765 43210"
                      className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium"
                    />
                  </div>
                </div>

                <div className="md:col-span-2 space-y-2">
                  <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">Current Address</label>
                  <div className="relative group">
                    <MapPin className="absolute left-4 top-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={20} />
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      rows={3}
                      placeholder="Enter your complete permanent address"
                      className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium resize-none"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <button
                  disabled={!formData.fullName || !formData.contactNumber || !formData.address}
                  onClick={() => setStep(2)}
                  className="group flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-2xl font-bold transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span>Next Step</span>
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div>
                <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-2">Document Verification</h2>
                <p className="text-gray-500">Upload your professional photo and Aadhar card for identity validation.</p>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">Aadhar Card Number</label>
                  <div className="relative group">
                    <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={20} />
                    <input
                      type="text"
                      name="aadharNumber"
                      value={formData.aadharNumber}
                      onChange={handleInputChange}
                      placeholder="12-digit Aadhar number"
                      className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Profile Image */}
                  <div className="space-y-3">
                    <p className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">Profile Photo</p>
                    <div className={`relative border-2 border-dashed rounded-3xl p-6 transition-all ${previews.profile ? 'border-blue-500 bg-blue-50/10' : 'border-gray-200 dark:border-gray-800 hover:border-blue-400'}`}>
                      {previews.profile ? (
                        <div className="relative group">
                          <img src={previews.profile} className="w-full h-48 object-cover rounded-2xl shadow-md" alt="Profile" />
                          <button 
                            onClick={() => { setProfileImage(null); setPreviews(prev => ({...prev, profile: ''})) }}
                            className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ) : (
                        <label className="flex flex-col items-center justify-center h-48 cursor-pointer">
                          <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-2xl flex items-center justify-center mb-4">
                            <ImageIcon size={32} />
                          </div>
                          <span className="text-sm font-bold text-gray-900 dark:text-white">Upload Photo</span>
                          <span className="text-xs text-gray-500 mt-2 text-center">Clear face centered,<br/>max 5MB</span>
                          <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileChange(e, 'profile')} />
                        </label>
                      )}
                    </div>
                  </div>

                  {/* Aadhar Image */}
                  <div className="space-y-3">
                    <p className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">Aadhar Copy</p>
                    <div className={`relative border-2 border-dashed rounded-3xl p-6 transition-all ${previews.aadhar ? 'border-blue-500 bg-blue-50/10' : 'border-gray-200 dark:border-gray-800 hover:border-blue-400'}`}>
                      {previews.aadhar ? (
                        <div className="relative group">
                          <img src={previews.aadhar} className="w-full h-48 object-cover rounded-2xl shadow-md" alt="Aadhar" />
                          <button 
                            onClick={() => { setAadharImage(null); setPreviews(prev => ({...prev, aadhar: ''})) }}
                            className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ) : (
                        <label className="flex flex-col items-center justify-center h-48 cursor-pointer">
                          <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 text-purple-600 rounded-2xl flex items-center justify-center mb-4">
                            <CreditCard size={32} />
                          </div>
                          <span className="text-sm font-bold text-gray-900 dark:text-white">Upload Aadhar</span>
                          <span className="text-xs text-gray-500 mt-2 text-center">Both sides visible,<br/>clear text</span>
                          <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileChange(e, 'aadhar')} />
                        </label>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-between pt-4 gap-4">
                <button
                  onClick={() => setStep(1)}
                  className="px-8 py-4 text-gray-600 dark:text-gray-400 font-bold hover:bg-gray-100 dark:hover:bg-gray-900 rounded-2xl transition-all"
                >
                  Back
                </button>
                <button
                  disabled={loading || !formData.aadharNumber || !profileImage || !aadharImage}
                  onClick={handleSubmit}
                  className="flex-1 flex items-center justify-center space-x-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-4 rounded-2xl font-bold transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden relative"
                >
                  {loading ? (
                    <>
                      <Loader2 size={24} className="animate-spin" />
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <Upload size={20} />
                      <span>Submit Verification</span>
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-12"
            >
              <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-green-500/30">
                <CheckCircle className="text-white h-12 w-12" />
              </div>
              <h2 className="text-4xl font-black text-gray-900 dark:text-white mb-4">Documents Received!</h2>
              <p className="text-xl text-gray-500 max-w-md mx-auto leading-relaxed mb-8">
                Your KYC submission is successful. Our review team will verify your details shortly. You will be notified once complete.
              </p>
              <button
                onClick={() => window.location.reload()}
                className="px-8 py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-2xl font-bold transition-all shadow-lg"
              >
                Go to Dashboard
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Info Card */}
        {step < 3 && (
          <div className="mt-12 p-6 bg-blue-50 dark:bg-blue-900/20 rounded-3xl border border-blue-100 dark:border-blue-900/50 flex items-start space-x-4">
            <AlertCircle className="text-blue-600 shrink-0 mt-1" size={24} />
            <div className="text-sm">
              <h4 className="font-bold text-blue-900 dark:text-blue-400 mb-1">Security Standards</h4>
              <p className="text-blue-700/70 dark:text-blue-500/70 leading-relaxed">
                Your data is encrypted and used only for internal identity verification. We never share your personal documents with third parties without your explicit consent.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
