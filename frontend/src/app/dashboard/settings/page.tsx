'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useLocale } from '@/contexts/LocaleContext'
import {
  Settings as SettingsIcon,
  Bell,
  Lock,
  Eye,
  Globe,
  Moon,
  Sun,
  Shield,
  CreditCard,
  HelpCircle,
  LogOut,
  ChevronRight,
  Mail,
  MessageCircle,
  Smartphone,
  Check,
  X,
  AlertCircle,
  Key,
  Trash2,
  Download
} from 'lucide-react'

export default function SettingsPage() {
  const router = useRouter()
  const { language, currency, setLanguage, setCurrency } = useLocale()
  const [activeSection, setActiveSection] = useState('notifications')

  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      push: true,
      sms: false,
      newProperties: true,
      priceChanges: true,
      bidUpdates: true,
      messages: true,
      newsletter: false
    },
    privacy: {
      profileVisibility: 'public',
      showEmail: false,
      showPhone: false,
      activityStatus: true
    },
    preferences: {
      theme: 'system',
      emailFrequency: 'daily'
    }
  })

  const sections = [
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'privacy', label: 'Privacy & Security', icon: Shield },
    { id: 'preferences', label: 'Preferences', icon: SettingsIcon },
    { id: 'billing', label: 'Billing & Payments', icon: CreditCard },
    { id: 'help', label: 'Help & Support', icon: HelpCircle }
  ]

  const toggleNotification = (key: string) => {
    setSettings({
      ...settings,
      notifications: {
        ...settings.notifications,
        [key]: !settings.notifications[key as keyof typeof settings.notifications]
      }
    })
  }

  // Open chatbot for support
  const openChatbot = () => {
    // Trigger chatbot - it should be available globally from SupportChatbot component
    const chatbotButton = document.querySelector('[data-chatbot-trigger]') as HTMLButtonElement
    if (chatbotButton) {
      chatbotButton.click()
    } else {
      // Fallback: navigate to dashboard where chatbot is always available
      router.push('/dashboard')
      setTimeout(() => {
        const btn = document.querySelector('[data-chatbot-trigger]') as HTMLButtonElement
        btn?.click()
      }, 500)
    }
  }

  // Download user data as PDF
  const handleDownloadData = async () => {
    try {
      // In a real implementation, this would fetch actual user data from the backend
      // For now, we'll create a simple text file with user data structure
      const userData = {
        profile: {
          name: 'User Name',
          email: 'user@email.com',
          phone: '+91 XXXXX XXXXX',
          role: 'Buyer/Seller',
          memberSince: new Date().toLocaleDateString()
        },
        properties: [],
        messages: [],
        transactions: [],
        favorites: [],
        searches: [],
        supportTickets: [],
        accountActivity: []
      }

      const dataText = `GHARBAZAAR USER DATA EXPORT
Generated on: ${new Date().toLocaleString()}

=== PROFILE INFORMATION ===
Name: ${userData.profile.name}
Email: ${userData.profile.email}
Phone: ${userData.profile.phone}
Role: ${userData.profile.role}
Member Since: ${userData.profile.memberSince}

=== PROPERTY LISTINGS ===
Total Properties: ${userData.properties.length}
[Property details would be listed here]

=== MESSAGES ===
Total Conversations: ${userData.messages.length}
[Message history would be listed here]

=== TRANSACTIONS ===
Total Transactions: ${userData.transactions.length}
[Transaction history would be listed here]

=== FAVORITES ===
Total Saved Properties: ${userData.favorites.length}
[Favorited properties would be listed here]

=== SEARCH HISTORY ===
Total Searches: ${userData.searches.length}
[Search history would be listed here]

=== SUPPORT TICKETS ===
Total Tickets: ${userData.supportTickets.length}
[Support ticket history would be listed here]

=== ACCOUNT ACTIVITY ===
[Login history and account changes would be listed here]

This file contains all data associated with your GharBazaar account.
For questions, contact privacy@gharbazaar.in`

      // Create and download the file
      const blob = new Blob([dataText], { type: 'text/plain' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `gharbazaar-data-export-${new Date().getTime()}.txt`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)

      alert('Your data has been downloaded successfully!')
    } catch (error) {
      console.error('Error downloading data:', error)
      alert('Failed to download data. Please try again.')
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white flex items-center">
          <SettingsIcon className="mr-3 text-blue-500" size={28} />
          Settings
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Manage your account settings and preferences
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 p-2">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all mb-1 ${activeSection === section.id
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
              >
                <div className="flex items-center space-x-3">
                  <section.icon size={20} />
                  <span className="font-medium">{section.label}</span>
                </div>
                <ChevronRight size={16} />
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          {/* Notifications */}
          {activeSection === 'notifications' && (
            <div className="space-y-6">
              <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 p-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                  Notification Preferences
                </h2>

                {/* Notification Channels */}
                <div className="mb-8">
                  <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
                    Notification Channels
                  </h3>
                  <div className="space-y-4">
                    {[
                      { key: 'email', label: 'Email Notifications', icon: Mail, description: 'Receive notifications via email' },
                      { key: 'push', label: 'Push Notifications', icon: Bell, description: 'Receive push notifications in browser' },
                      { key: 'sms', label: 'SMS Notifications', icon: Smartphone, description: 'Receive important updates via SMS' }
                    ].map((channel) => (
                      <div key={channel.key} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                            <channel.icon size={20} className="text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">{channel.label}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{channel.description}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => toggleNotification(channel.key)}
                          className={`relative w-12 h-6 rounded-full transition-all ${settings.notifications[channel.key as keyof typeof settings.notifications]
                            ? 'bg-blue-600'
                            : 'bg-gray-300 dark:bg-gray-600'
                            }`}
                        >
                          <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${settings.notifications[channel.key as keyof typeof settings.notifications]
                            ? 'translate-x-6'
                            : 'translate-x-0'
                            }`} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Notification Types */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
                    What to Notify
                  </h3>
                  <div className="space-y-3">
                    {[
                      { key: 'newProperties', label: 'New Properties', description: 'Get notified about new listings matching your preferences' },
                      { key: 'priceChanges', label: 'Price Changes', description: 'Alert me when prices change on saved properties' },
                      { key: 'bidUpdates', label: 'Bid Updates', description: 'Updates on your active bids and auctions' },
                      { key: 'messages', label: 'Messages', description: 'New messages from sellers and agents' },
                      { key: 'newsletter', label: 'Newsletter', description: 'Weekly newsletter with market insights' }
                    ].map((type) => (
                      <div key={type.key} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                        <div className="flex-1">
                          <p className="font-medium text-gray-900 dark:text-white">{type.label}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{type.description}</p>
                        </div>
                        <button
                          onClick={() => toggleNotification(type.key)}
                          className={`ml-4 relative w-12 h-6 rounded-full transition-all ${settings.notifications[type.key as keyof typeof settings.notifications]
                            ? 'bg-green-600'
                            : 'bg-gray-300 dark:bg-gray-600'
                            }`}
                        >
                          <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${settings.notifications[type.key as keyof typeof settings.notifications]
                            ? 'translate-x-6'
                            : 'translate-x-0'
                            }`} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Privacy & Security */}
          {activeSection === 'privacy' && (
            <div className="space-y-6">
              <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 p-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                  Privacy & Security
                </h2>

                {/* Profile Visibility */}
                <div className="mb-8">
                  <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
                    Profile Visibility
                  </h3>
                  <select
                    value={settings.privacy.profileVisibility}
                    onChange={(e) => setSettings({
                      ...settings,
                      privacy: { ...settings.privacy, profileVisibility: e.target.value }
                    })}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="public">Public - Anyone can see your profile</option>
                    <option value="private">Private - Only you can see your profile</option>
                    <option value="contacts">Contacts Only - Only people you've contacted</option>
                  </select>
                </div>

                {/* Contact Information */}
                <div className="mb-8">
                  <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
                    Contact Information
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Mail size={20} className="text-gray-400" />
                        <span className="text-gray-900 dark:text-white">Show email address</span>
                      </div>
                      <button
                        onClick={() => setSettings({
                          ...settings,
                          privacy: { ...settings.privacy, showEmail: !settings.privacy.showEmail }
                        })}
                        className={`relative w-12 h-6 rounded-full transition-all ${settings.privacy.showEmail ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                          }`}
                      >
                        <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${settings.privacy.showEmail ? 'translate-x-6' : 'translate-x-0'
                          }`} />
                      </button>
                    </div>
                    <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Smartphone size={20} className="text-gray-400" />
                        <span className="text-gray-900 dark:text-white">Show phone number</span>
                      </div>
                      <button
                        onClick={() => setSettings({
                          ...settings,
                          privacy: { ...settings.privacy, showPhone: !settings.privacy.showPhone }
                        })}
                        className={`relative w-12 h-6 rounded-full transition-all ${settings.privacy.showPhone ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                          }`}
                      >
                        <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${settings.privacy.showPhone ? 'translate-x-6' : 'translate-x-0'
                          }`} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Security Actions */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
                    Security
                  </h3>
                  <div className="space-y-3">
                    <button className="w-full flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-all">
                      <div className="flex items-center space-x-3">
                        <Key size={20} className="text-blue-600" />
                        <span className="text-gray-900 dark:text-white font-medium">Change Password</span>
                      </div>
                      <ChevronRight size={20} className="text-gray-400" />
                    </button>
                    <button className="w-full flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-all">
                      <div className="flex items-center space-x-3">
                        <Shield size={20} className="text-green-600" />
                        <span className="text-gray-900 dark:text-white font-medium">Two-Factor Authentication</span>
                      </div>
                      <ChevronRight size={20} className="text-gray-400" />
                    </button>
                    <button
                      onClick={handleDownloadData}
                      className="w-full flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
                    >
                      <div className="flex items-center space-x-3">
                        <Download size={20} className="text-purple-600" />
                        <span className="text-gray-900 dark:text-white font-medium">Download My Data</span>
                      </div>
                      <ChevronRight size={20} className="text-gray-400" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Danger Zone */}
              <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-xl p-6">
                <h3 className="text-lg font-bold text-red-600 dark:text-red-400 mb-4 flex items-center">
                  <AlertCircle size={20} className="mr-2" />
                  Danger Zone
                </h3>
                <div className="space-y-3">
                  <button className="w-full flex items-center justify-between p-4 bg-white dark:bg-gray-900 border border-red-200 dark:border-red-800 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30 transition-all">
                    <div className="flex items-center space-x-3">
                      <Trash2 size={20} className="text-red-600" />
                      <div className="text-left">
                        <p className="text-gray-900 dark:text-white font-medium">Delete Account</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Permanently delete your account and all data</p>
                      </div>
                    </div>
                    <ChevronRight size={20} className="text-gray-400" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Preferences */}
          {activeSection === 'preferences' && (
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                Preferences
              </h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Language
                  </label>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value as any)}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="en">English</option>
                    <option value="hi">हिंदी (Hindi)</option>
                    <option value="mr">मराठी (Marathi)</option>
                    <option value="ta">தமிழ் (Tamil)</option>
                  </select>
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    Changes will apply across the entire website
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Currency
                  </label>
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value as any)}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="INR">₹ INR - Indian Rupee (Crores/Lakhs)</option>
                    <option value="USD">$ USD - US Dollar (Million)</option>
                    <option value="GBP">£ GBP - British Pound (Million)</option>
                  </select>
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    All prices will be converted throughout the website
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Theme
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { value: 'light', label: 'Light', icon: Sun },
                      { value: 'dark', label: 'Dark', icon: Moon },
                      { value: 'system', label: 'System', icon: SettingsIcon }
                    ].map((theme) => (
                      <button
                        key={theme.value}
                        onClick={() => setSettings({
                          ...settings,
                          preferences: { ...settings.preferences, theme: theme.value }
                        })}
                        className={`p-4 border-2 rounded-lg transition-all ${settings.preferences.theme === theme.value
                          ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                          }`}
                      >
                        <theme.icon size={24} className="mx-auto mb-2 text-gray-700 dark:text-gray-300" />
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{theme.label}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email Frequency
                  </label>
                  <select
                    value={settings.preferences.emailFrequency}
                    onChange={(e) => setSettings({
                      ...settings,
                      preferences: { ...settings.preferences, emailFrequency: e.target.value }
                    })}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="realtime">Real-time</option>
                    <option value="daily">Daily Digest</option>
                    <option value="weekly">Weekly Summary</option>
                    <option value="never">Never</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Billing & Payments */}
          {activeSection === 'billing' && (
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                Billing & Payments
              </h2>
              <div className="text-center py-12">
                <CreditCard size={64} className="mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                  No Payment Methods
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Add a payment method to unlock premium features
                </p>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-all">
                  Add Payment Method
                </button>
              </div>
            </div>
          )}

          {/* Help & Support */}
          {activeSection === 'help' && (
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                Help & Support
              </h2>
              <div className="space-y-3">
                <button
                  onClick={() => router.push('/dashboard/help')}
                  className="w-full flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
                >
                  <div className="flex items-center space-x-3">
                    <HelpCircle size={20} className="text-blue-600" />
                    <span className="text-gray-900 dark:text-white font-medium">Help Center</span>
                  </div>
                  <ChevronRight size={20} className="text-gray-400" />
                </button>
                <button
                  onClick={openChatbot}
                  className="w-full flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
                >
                  <div className="flex items-center space-x-3">
                    <MessageCircle size={20} className="text-green-600" />
                    <span className="text-gray-900 dark:text-white font-medium">Contact Support</span>
                  </div>
                  <ChevronRight size={20} className="text-gray-400" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
