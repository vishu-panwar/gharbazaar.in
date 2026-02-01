'use client'

import { useState, useEffect } from 'react'
import { 
  User, 
  Lock, 
  Bell, 
  Shield, 
  CreditCard, 
  Globe, 
  Eye, 
  EyeOff, 
  Camera, 
  Edit3, 
  Save, 
  X, 
  Check, 
  AlertTriangle, 
  Info, 
  Smartphone, 
  Mail, 
  Monitor, 
  Moon, 
  Sun, 
  Palette, 
  Download, 
  Trash2, 
  Key, 
  FileText, 
  Calendar, 
  MapPin, 
  Phone, 
  Building, 
  Scale, 
  Award, 
  Clock, 
  Languages, 
  Volume2, 
  VolumeX 
} from 'lucide-react'
import { useTheme } from 'next-themes'
import toast from 'react-hot-toast'

interface UserProfile {
  name: string
  email: string
  phone: string
  barCouncilId: string
  practiceAreas: string[]
  experience: number
  location: string
  bio: string
  avatar?: string
  verificationStatus: 'pending' | 'verified' | 'rejected'
}

interface SecuritySettings {
  twoFactorEnabled: boolean
  loginAlerts: boolean
  sessionTimeout: number
  allowedDevices: string[]
}

interface NotificationPreferences {
  email: boolean
  push: boolean
  sms: boolean
  desktop: boolean
  categories: {
    cases: boolean
    payments: boolean
    documents: boolean
    messages: boolean
    system: boolean
    compliance: boolean
  }
  quietHours: {
    enabled: boolean
    startTime: string
    endTime: string
  }
}

interface PrivacySettings {
  profileVisibility: 'public' | 'partners-only' | 'private'
  showContactInfo: boolean
  allowDirectMessages: boolean
  dataSharing: boolean
}

export default function SettingsPage() {
  const { theme, setTheme } = useTheme()
  const [activeTab, setActiveTab] = useState('profile')
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [showPasswordForm, setShowPasswordForm] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Form states
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [security, setSecurity] = useState<SecuritySettings | null>(null)
  const [notifications, setNotifications] = useState<NotificationPreferences | null>(null)
  const [privacy, setPrivacy] = useState<PrivacySettings | null>(null)
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: ''
  })

  useEffect(() => {
    setMounted(true)
  }, [])

  // Mock data loading
  useEffect(() => {
    const mockProfile: UserProfile = {
      name: 'Priya Sharma',
      email: 'priya.sharma@legalpartner.com',
      phone: '+91 98765 43210',
      barCouncilId: 'MH/2018/12345',
      practiceAreas: ['Property Law', 'Real Estate', 'Contract Law', 'RERA Compliance'],
      experience: 8,
      location: 'Mumbai, Maharashtra',
      bio: 'Experienced legal professional specializing in property law and real estate transactions with over 8 years of practice.',
      verificationStatus: 'verified'
    }

    const mockSecurity: SecuritySettings = {
      twoFactorEnabled: true,
      loginAlerts: true,
      sessionTimeout: 30,
      allowedDevices: ['Chrome on Windows', 'Safari on iPhone']
    }

    const mockNotifications: NotificationPreferences = {
      email: true,
      push: true,
      sms: false,
      desktop: true,
      categories: {
        cases: true,
        payments: true,
        documents: true,
        messages: true,
        system: false,
        compliance: true
      },
      quietHours: {
        enabled: true,
        startTime: '22:00',
        endTime: '08:00'
      }
    }

    const mockPrivacy: PrivacySettings = {
      profileVisibility: 'partners-only',
      showContactInfo: false,
      allowDirectMessages: true,
      dataSharing: false
    }

    setTimeout(() => {
      setProfile(mockProfile)
      setSecurity(mockSecurity)
      setNotifications(mockNotifications)
      setPrivacy(mockPrivacy)
      setIsLoading(false)
    }, 1000)
  }, [])

  const handleSave = async () => {
    setIsSaving(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    setIsSaving(false)
    toast.success('Settings saved successfully!')
  }

  const handlePasswordChange = async () => {
    if (passwords.new !== passwords.confirm) {
      toast.error('New passwords do not match')
      return
    }
    
    setIsSaving(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    setIsSaving(false)
    setShowPasswordForm(false)
    setPasswords({ current: '', new: '', confirm: '' })
    toast.success('Password updated successfully!')
  }

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'privacy', label: 'Privacy', icon: Lock },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'billing', label: 'Billing', icon: CreditCard }
  ]

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading settings...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage your account preferences and security settings
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-xl font-medium transition-all mt-4 sm:mt-0"
        >
          {isSaving ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Saving...</span>
            </>
          ) : (
            <>
              <Save size={20} />
              <span>Save Changes</span>
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-950 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
            <div className="p-6">
              <nav className="space-y-2">
                {tabs.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                      w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all
                      ${activeTab === tab.id
                        ? 'bg-blue-600 text-white shadow-lg'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                      }
                    `}
                  >
                    <tab.icon size={20} />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3">
          <div className="bg-white dark:bg-gray-950 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
            
            {/* Profile Tab */}
            {activeTab === 'profile' && profile && (
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Profile Information</h2>
                  <div className="flex items-center space-x-2">
                    <div className={`
                      px-3 py-1 rounded-full text-sm font-medium
                      ${profile.verificationStatus === 'verified' 
                        ? 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400'
                        : profile.verificationStatus === 'pending'
                        ? 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400'
                        : 'bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400'
                      }
                    `}>
                      {profile.verificationStatus === 'verified' ? 'Verified' : 
                       profile.verificationStatus === 'pending' ? 'Pending Verification' : 'Verification Failed'}
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  {/* Avatar */}
                  <div className="flex items-center space-x-6">
                    <div className="relative">
                      <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-lg">
                        {profile.name.charAt(0).toUpperCase()}
                      </div>
                      <button className="absolute -bottom-2 -right-2 p-2 bg-blue-600 text-white rounded-xl shadow-lg hover:bg-blue-700 transition-all">
                        <Camera size={16} />
                      </button>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{profile.name}</h3>
                      <p className="text-gray-600 dark:text-gray-400">{profile.email}</p>
                      <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">Legal Partner</p>
                    </div>
                  </div>

                  {/* Form Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={profile.name}
                        onChange={(e) => setProfile(prev => prev ? { ...prev, name: e.target.value } : null)}
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={profile.email}
                        onChange={(e) => setProfile(prev => prev ? { ...prev, email: e.target.value } : null)}
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={profile.phone}
                        onChange={(e) => setProfile(prev => prev ? { ...prev, phone: e.target.value } : null)}
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Bar Council ID
                      </label>
                      <input
                        type="text"
                        value={profile.barCouncilId}
                        onChange={(e) => setProfile(prev => prev ? { ...prev, barCouncilId: e.target.value } : null)}
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Experience (Years)
                      </label>
                      <input
                        type="number"
                        value={profile.experience}
                        onChange={(e) => setProfile(prev => prev ? { ...prev, experience: parseInt(e.target.value) } : null)}
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Location
                      </label>
                      <input
                        type="text"
                        value={profile.location}
                        onChange={(e) => setProfile(prev => prev ? { ...prev, location: e.target.value } : null)}
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Bio
                    </label>
                    <textarea
                      rows={4}
                      value={profile.bio}
                      onChange={(e) => setProfile(prev => prev ? { ...prev, bio: e.target.value } : null)}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                      placeholder="Tell us about your legal expertise and experience..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Practice Areas
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {profile.practiceAreas.map((area, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg text-sm font-medium"
                        >
                          {area}
                        </span>
                      ))}
                      <button className="px-3 py-1 border-2 border-dashed border-gray-300 dark:border-gray-700 text-gray-500 dark:text-gray-400 rounded-lg text-sm font-medium hover:border-blue-500 hover:text-blue-500 transition-all">
                        + Add Area
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && security && (
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Security Settings</h2>
                
                <div className="space-y-6">
                  {/* Password */}
                  <div className="p-6 bg-gray-50 dark:bg-gray-900 rounded-xl">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">Password</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Last changed 30 days ago</p>
                      </div>
                      <button
                        onClick={() => setShowPasswordForm(!showPasswordForm)}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all"
                      >
                        Change Password
                      </button>
                    </div>

                    {showPasswordForm && (
                      <div className="space-y-4 mt-4 pt-4 border-t border-gray-200 dark:border-gray-800">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Current Password
                          </label>
                          <input
                            type="password"
                            value={passwords.current}
                            onChange={(e) => setPasswords(prev => ({ ...prev, current: e.target.value }))}
                            className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            New Password
                          </label>
                          <input
                            type="password"
                            value={passwords.new}
                            onChange={(e) => setPasswords(prev => ({ ...prev, new: e.target.value }))}
                            className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Confirm New Password
                          </label>
                          <input
                            type="password"
                            value={passwords.confirm}
                            onChange={(e) => setPasswords(prev => ({ ...prev, confirm: e.target.value }))}
                            className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          />
                        </div>
                        <div className="flex space-x-3">
                          <button
                            onClick={handlePasswordChange}
                            disabled={isSaving}
                            className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white rounded-lg font-medium transition-all"
                          >
                            {isSaving ? 'Updating...' : 'Update Password'}
                          </button>
                          <button
                            onClick={() => setShowPasswordForm(false)}
                            className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-all"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Two-Factor Authentication */}
                  <div className="p-6 bg-gray-50 dark:bg-gray-900 rounded-xl">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">Two-Factor Authentication</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Add an extra layer of security to your account</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={security.twoFactorEnabled}
                          onChange={(e) => setSecurity(prev => prev ? { ...prev, twoFactorEnabled: e.target.checked } : null)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>

                  {/* Login Alerts */}
                  <div className="p-6 bg-gray-50 dark:bg-gray-900 rounded-xl">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">Login Alerts</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Get notified of new login attempts</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={security.loginAlerts}
                          onChange={(e) => setSecurity(prev => prev ? { ...prev, loginAlerts: e.target.checked } : null)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>

                  {/* Session Timeout */}
                  <div className="p-6 bg-gray-50 dark:bg-gray-900 rounded-xl">
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Session Timeout</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Automatically log out after inactivity</p>
                      <select
                        value={security.sessionTimeout}
                        onChange={(e) => setSecurity(prev => prev ? { ...prev, sessionTimeout: parseInt(e.target.value) } : null)}
                        className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      >
                        <option value={15}>15 minutes</option>
                        <option value={30}>30 minutes</option>
                        <option value={60}>1 hour</option>
                        <option value={120}>2 hours</option>
                        <option value={0}>Never</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && notifications && (
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Notification Preferences</h2>
                
                <div className="space-y-6">
                  {/* Delivery Methods */}
                  <div className="p-6 bg-gray-50 dark:bg-gray-900 rounded-xl">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Delivery Methods</h3>
                    <div className="space-y-4">
                      <label className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Mail size={20} className="text-gray-500" />
                          <div>
                            <span className="font-medium text-gray-900 dark:text-white">Email Notifications</span>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Receive notifications via email</p>
                          </div>
                        </div>
                        <input
                          type="checkbox"
                          checked={notifications.email}
                          onChange={(e) => setNotifications(prev => prev ? { ...prev, email: e.target.checked } : null)}
                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                        />
                      </label>

                      <label className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Smartphone size={20} className="text-gray-500" />
                          <div>
                            <span className="font-medium text-gray-900 dark:text-white">Push Notifications</span>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Receive push notifications on mobile</p>
                          </div>
                        </div>
                        <input
                          type="checkbox"
                          checked={notifications.push}
                          onChange={(e) => setNotifications(prev => prev ? { ...prev, push: e.target.checked } : null)}
                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                        />
                      </label>

                      <label className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Monitor size={20} className="text-gray-500" />
                          <div>
                            <span className="font-medium text-gray-900 dark:text-white">Desktop Notifications</span>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Show desktop notifications</p>
                          </div>
                        </div>
                        <input
                          type="checkbox"
                          checked={notifications.desktop}
                          onChange={(e) => setNotifications(prev => prev ? { ...prev, desktop: e.target.checked } : null)}
                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                        />
                      </label>
                    </div>
                  </div>

                  {/* Categories */}
                  <div className="p-6 bg-gray-50 dark:bg-gray-900 rounded-xl">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Notification Categories</h3>
                    <div className="space-y-4">
                      {Object.entries(notifications.categories).map(([category, enabled]) => (
                        <label key={category} className="flex items-center justify-between">
                          <span className="font-medium text-gray-900 dark:text-white capitalize">
                            {category}
                          </span>
                          <input
                            type="checkbox"
                            checked={enabled}
                            onChange={(e) => setNotifications(prev => prev ? {
                              ...prev,
                              categories: { ...prev.categories, [category]: e.target.checked }
                            } : null)}
                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                          />
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Privacy Tab */}
            {activeTab === 'privacy' && privacy && (
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Privacy Settings</h2>
                
                <div className="space-y-6">
                  <div className="p-6 bg-gray-50 dark:bg-gray-900 rounded-xl">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Profile Visibility</h3>
                    <div className="space-y-3">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="profileVisibility"
                          value="public"
                          checked={privacy.profileVisibility === 'public'}
                          onChange={(e) => setPrivacy(prev => prev ? { ...prev, profileVisibility: e.target.value as any } : null)}
                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                        />
                        <span className="ml-3 text-gray-900 dark:text-white">Public - Visible to everyone</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="profileVisibility"
                          value="partners-only"
                          checked={privacy.profileVisibility === 'partners-only'}
                          onChange={(e) => setPrivacy(prev => prev ? { ...prev, profileVisibility: e.target.value as any } : null)}
                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                        />
                        <span className="ml-3 text-gray-900 dark:text-white">Partners Only - Visible to verified partners</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="profileVisibility"
                          value="private"
                          checked={privacy.profileVisibility === 'private'}
                          onChange={(e) => setPrivacy(prev => prev ? { ...prev, profileVisibility: e.target.value as any } : null)}
                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                        />
                        <span className="ml-3 text-gray-900 dark:text-white">Private - Only visible to you</span>
                      </label>
                    </div>
                  </div>

                  <div className="p-6 bg-gray-50 dark:bg-gray-900 rounded-xl">
                    <div className="space-y-4">
                      <label className="flex items-center justify-between">
                        <div>
                          <span className="font-medium text-gray-900 dark:text-white">Show Contact Information</span>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Allow others to see your contact details</p>
                        </div>
                        <input
                          type="checkbox"
                          checked={privacy.showContactInfo}
                          onChange={(e) => setPrivacy(prev => prev ? { ...prev, showContactInfo: e.target.checked } : null)}
                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                        />
                      </label>

                      <label className="flex items-center justify-between">
                        <div>
                          <span className="font-medium text-gray-900 dark:text-white">Allow Direct Messages</span>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Let other partners send you direct messages</p>
                        </div>
                        <input
                          type="checkbox"
                          checked={privacy.allowDirectMessages}
                          onChange={(e) => setPrivacy(prev => prev ? { ...prev, allowDirectMessages: e.target.checked } : null)}
                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                        />
                      </label>

                      <label className="flex items-center justify-between">
                        <div>
                          <span className="font-medium text-gray-900 dark:text-white">Data Sharing</span>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Share anonymized data for platform improvement</p>
                        </div>
                        <input
                          type="checkbox"
                          checked={privacy.dataSharing}
                          onChange={(e) => setPrivacy(prev => prev ? { ...prev, dataSharing: e.target.checked } : null)}
                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                        />
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Appearance Tab */}
            {activeTab === 'appearance' && mounted && (
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Appearance Settings</h2>
                
                <div className="space-y-6">
                  <div className="p-6 bg-gray-50 dark:bg-gray-900 rounded-xl">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Theme</h3>
                    <div className="grid grid-cols-3 gap-4">
                      <button
                        onClick={() => setTheme('light')}
                        className={`
                          p-4 rounded-xl border-2 transition-all
                          ${theme === 'light' 
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                          }
                        `}
                      >
                        <Sun className="w-8 h-8 mx-auto mb-2 text-yellow-500" />
                        <p className="font-medium text-gray-900 dark:text-white">Light</p>
                      </button>

                      <button
                        onClick={() => setTheme('dark')}
                        className={`
                          p-4 rounded-xl border-2 transition-all
                          ${theme === 'dark' 
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                          }
                        `}
                      >
                        <Moon className="w-8 h-8 mx-auto mb-2 text-blue-500" />
                        <p className="font-medium text-gray-900 dark:text-white">Dark</p>
                      </button>

                      <button
                        onClick={() => setTheme('system')}
                        className={`
                          p-4 rounded-xl border-2 transition-all
                          ${theme === 'system' 
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                          }
                        `}
                      >
                        <Monitor className="w-8 h-8 mx-auto mb-2 text-gray-500" />
                        <p className="font-medium text-gray-900 dark:text-white">System</p>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Billing Tab */}
            {activeTab === 'billing' && (
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Billing & Subscription</h2>
                
                <div className="space-y-6">
                  <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100">Professional Plan</h3>
                        <p className="text-blue-700 dark:text-blue-300">₹2,999/month • Billed monthly</p>
                        <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">Next billing: January 31, 2025</p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">₹2,999</div>
                        <div className="text-sm text-blue-600 dark:text-blue-400">per month</div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-6 bg-gray-50 dark:bg-gray-900 rounded-xl">
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Payment Method</h4>
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded flex items-center justify-center">
                          <CreditCard className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">•••• •••• •••• 4242</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Expires 12/26</p>
                        </div>
                      </div>
                      <button className="mt-4 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium">
                        Update Payment Method
                      </button>
                    </div>

                    <div className="p-6 bg-gray-50 dark:bg-gray-900 rounded-xl">
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Billing Address</h4>
                      <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                        <p>Priya Sharma</p>
                        <p>123 Legal Street</p>
                        <p>Mumbai, Maharashtra 400001</p>
                        <p>India</p>
                      </div>
                      <button className="mt-4 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium">
                        Update Address
                      </button>
                    </div>
                  </div>

                  <div className="p-6 bg-gray-50 dark:bg-gray-900 rounded-xl">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Recent Invoices</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between py-2">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">December 2024</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Professional Plan</p>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className="text-gray-900 dark:text-white font-medium">₹2,999</span>
                          <button className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300">
                            <Download size={16} />
                          </button>
                        </div>
                      </div>
                      <div className="flex items-center justify-between py-2">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">November 2024</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Professional Plan</p>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className="text-gray-900 dark:text-white font-medium">₹2,999</span>
                          <button className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300">
                            <Download size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}