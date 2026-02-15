'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import { useLocale } from '@/contexts/LocaleContext';
import {
  useSettings,
  useUpdateTheme,
  useUpdateLanguage,
  useUpdateCurrency,
  useUpdateTimezone,
  useUpdateEmailPreferences,
} from '@/hooks/api';
import { LoadingSkeleton } from '@/components/LoadingSkeleton';
import {
  Settings as SettingsIcon,
  Bell,
  Lock,
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
  Clock,
  DollarSign,
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function SettingsPage() {
  const router = useRouter();
  const { theme: currentTheme, setTheme } = useTheme();
  const { language, currency, setLanguage: setLocalLanguage, setCurrency: setLocalCurrency } = useLocale();
  const { data: settings, isLoading } = useSettings();
  const updateTheme = useUpdateTheme();
  const updateLanguage = useUpdateLanguage();
  const updateCurrency = useUpdateCurrency();
  const updateTimezone = useUpdateTimezone();
  const updateEmailPreferences = useUpdateEmailPreferences();

  const [activeSection, setActiveSection] = useState('preferences');

  const sections = [
    { id: 'preferences', label: 'Preferences', icon: SettingsIcon },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'privacy', label: 'Privacy & Security', icon: Shield },
    { id: 'billing', label: 'Billing & Payments', icon: CreditCard },
    { id: 'help', label: 'Help & Support', icon: HelpCircle },
  ];

  const handleThemeChange = async (theme: 'light' | 'dark' | 'system') => {
    try {
      // Apply theme immediately via next-themes
      setTheme(theme);
      // Also save to backend
      await updateTheme.mutateAsync(theme);
      toast.success(`Theme changed to ${theme}`);
    } catch (error) {
      toast.error('Failed to update theme');
    }
  };

  const handleLanguageChange = async (lang: string) => {
    try {
      const newLang = lang as 'en' | 'hi' | 'mr';
      // Apply language immediately via LocaleContext
      setLocalLanguage(newLang);
      // Also save to backend
      await updateLanguage.mutateAsync(newLang);
      toast.success('Language updated');
    } catch (error) {
      toast.error('Failed to update language');
    }
  };

  const handleCurrencyChange = async (curr: string) => {
    try {
      // Apply currency immediately via LocaleContext  
      setLocalCurrency(curr as 'INR' | 'USD' | 'GBP');
      // Also save to backend
      await updateCurrency.mutateAsync(curr);
      toast.success('Currency updated');
    } catch (error) {
      toast.error('Failed to update currency');
    }
  };

  const handleTimezoneChange = async (timezone: string) => {
    try {
      await updateTimezone.mutateAsync(timezone);
      toast.success('Timezone updated');
    } catch (error) {
      toast.error('Failed to update timezone');
    }
  };

  const handleNotificationToggle = async (key: string, value: boolean) => {
    try {
      await updateEmailPreferences.mutateAsync({ [key]: value } as any);
      toast.success('Notification preferences updated');
    } catch (error) {
      toast.error('Failed to update notifications');
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Settings</h1>
        <LoadingSkeleton variant="dashboard" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Settings</h1>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 space-y-2">
            {sections.map((section) => {
              const Icon = section.icon;
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${activeSection === section.id
                    ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon size={20} />
                    <span className="font-semibold">{section.label}</span>
                  </div>
                  <ChevronRight size={16} />
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6">
            {/* Preferences Section */}
            {activeSection === 'preferences' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Preferences</h2>

                {/* Theme */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                    Theme
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {['light', 'dark', 'system'].map((theme) => (
                      <button
                        key={theme}
                        onClick={() => handleThemeChange(theme as any)}
                        className={`p-4 rounded-lg border-2 transition-all ${settings?.theme === theme
                          ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-blue-300'
                          }`}
                      >
                        {theme === 'light' && <Sun className="mx-auto mb-2" size={24} />}
                        {theme === 'dark' && <Moon className="mx-auto mb-2" size={24} />}
                        {theme === 'system' && <SettingsIcon className="mx-auto mb-2" size={24} />}
                        <p className="text-sm font-semibold capitalize">{theme}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Language */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                    Language
                  </label>
                  <select
                    value={language}
                    onChange={(e) => handleLanguageChange(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="en">English</option>
                    <option value="hi">हिन्दी (Hindi)</option>
                    <option value="mr">मराठी (Marathi)</option>
                  </select>
                </div>

                {/* Currency */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                    Currency
                  </label>
                  <select
                    value={currency}
                    onChange={(e) => handleCurrencyChange(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="INR">₹ INR - Indian Rupee</option>
                    <option value="USD">$ USD - US Dollar</option>
                    <option value="EUR">€ EUR - Euro</option>
                    <option value="GBP">£ GBP - British Pound</option>
                    <option value="AED">د.إ AED - UAE Dirham</option>
                    <option value="CAD">C$ CAD - Canadian Dollar</option>
                    <option value="AUD">A$ AUD - Australian Dollar</option>
                  </select>
                </div>

                {/* Timezone */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                    Timezone
                  </label>
                  <select
                    value={settings?.timezone || 'Asia/Kolkata'}
                    onChange={(e) => handleTimezoneChange(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Asia/Kolkata">IST - India Standard Time</option>
                    <option value="America/New_York">EST - Eastern Standard Time</option>
                    <option value="America/Los_Angeles">PST - Pacific Standard Time</option>
                    <option value="Europe/London">GMT - Greenwich Mean Time</option>
                    <option value="Asia/Dubai">GST - Gulf Standard Time</option>
                    <option value="Asia/Singapore">SGT - Singapore Time</option>
                    <option value="Australia/Sydney">AEDT - Australian Eastern Time</option>
                    <option value="Asia/Tokyo">JST - Japan Standard Time</option>
                    <option value="Europe/Paris">CET - Central European Time</option>
                    <option value="America/Toronto">CET - Canada Eastern Time</option>
                  </select>
                </div>
              </div>
            )}

            {/* Notifications Section */}
            {activeSection === 'notifications' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Notifications</h2>

                <div className="space-y-4">
                  {[
                    { key: 'email', label: 'Email Notifications', icon: Mail },
                    { key: 'push', label: 'Push Notifications', icon: Bell },
                    { key: 'sms', label: 'SMS Notifications', icon: Smartphone },
                  ].map((channel) => (
                    <div key={channel.key} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <channel.icon size={20} className="text-gray-600 dark:text-gray-400" />
                        <span className="font-semibold text-gray-900 dark:text-white">
                          {channel.label}
                        </span>
                      </div>
                      <button
                        onClick={() => handleNotificationToggle(channel.key, !settings?.notifications?.[channel.key])}
                        className={`relative w-14 h-8 rounded-full transition-colors ${settings?.notifications?.[channel.key]
                          ? 'bg-green-600'
                          : 'bg-gray-300 dark:bg-gray-600'
                          }`}
                      >
                        <span
                          className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${settings?.notifications?.[channel.key] ? 'translate-x-6' : ''
                            }`}
                        />
                      </button>
                    </div>
                  ))}

                  <hr className="border-gray-200 dark:border-gray-700" />

                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Notification Types
                  </h3>

                  {[
                    { key: 'newProperties', label: 'New property listings' },
                    { key: 'priceChanges', label: 'Price changes on saved properties' },
                    { key: 'bidUpdates', label: 'Bid and offer updates' },
                    { key: 'messages', label: 'New messages' },
                    { key: 'newsletter', label: 'Newsletter and promotions' },
                  ].map((notif) => (
                    <div key={notif.key} className="flex items-center justify-between p-4">
                      <span className="text-gray-900 dark:text-white">{notif.label}</span>
                      <button
                        onClick={() => handleNotificationToggle(notif.key, !settings?.notifications?.[notif.key])}
                        className={`relative w-14 h-8 rounded-full transition-colors ${settings?.notifications?.[notif.key]
                          ? 'bg-green-600'
                          : 'bg-gray-300 dark:bg-gray-600'
                          }`}
                      >
                        <span
                          className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${settings?.notifications?.[notif.key] ? 'translate-x-6' : ''
                            }`}
                        />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Privacy Section */}
            {activeSection === 'privacy' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Privacy & Security
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Manage your privacy settings and account security
                </p>

                <button
                  onClick={() => router.push('/dashboard/security')}
                  className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Lock size={20} />
                    <span className="font-semibold">Change Password</span>
                  </div>
                  <ChevronRight size={20} />
                </button>
              </div>
            )}

            {/* Billing Section */}
            {activeSection === 'billing' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Billing & Payments
                </h2>

                <button
                  onClick={() => router.push('/dashboard/pricing')}
                  className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-colors text-white"
                >
                  <div className="flex items-center gap-3">
                    <CreditCard size={20} />
                    <span className="font-semibold">View Plans & Pricing</span>
                  </div>
                  <ChevronRight size={20} />
                </button>
              </div>
            )}

            {/* Help Section */}
            {activeSection === 'help' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Help & Support
                </h2>

                <button
                  onClick={() => router.push('/dashboard/help')}
                  className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <HelpCircle size={20} />
                    <span className="font-semibold">Help Center</span>
                  </div>
                  <ChevronRight size={20} />
                </button>

                <button
                  onClick={() => router.push('/dashboard/kyc')}
                  className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <MessageCircle size={20} />
                    <span className="font-semibold">Contact Support</span>
                  </div>
                  <ChevronRight size={20} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
