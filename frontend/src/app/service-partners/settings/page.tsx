'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { Bell, CheckCircle, Moon, RefreshCw, Save, Sun, User } from 'lucide-react'
import { useTheme } from 'next-themes'
import toast from 'react-hot-toast'
import { backendApi } from '@/lib/backendApi'

type UserProfile = {
  uid?: string
  id?: string
  name?: string
  displayName?: string
  email?: string
  phone?: string
  address?: string
}

type ProviderProfile = {
  id: string
  category?: string
  specialization?: string
  hourlyRate?: number
  location?: string
  description?: string
  available?: boolean
  verified?: boolean
  user?: {
    name?: string
    email?: string
  }
}

type NotificationItem = {
  id: string
  type?: string
  title?: string
  message?: string
  isRead?: boolean
  createdAt?: string
}

const formatDate = (value?: string) => {
  if (!value) return '-'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '-'
  return date.toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })
}

export default function ServicePartnerSettingsPage() {
  const { theme, setTheme } = useTheme()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [providerProfile, setProviderProfile] = useState<ProviderProfile | null>(null)
  const [notifications, setNotifications] = useState<NotificationItem[]>([])
  const [form, setForm] = useState({
    displayName: '',
    phoneNumber: '',
    location: '',
    bio: '',
    category: '',
    specialization: '',
    hourlyRate: '',
    available: true,
  })

  const loadSettings = async () => {
    try {
      setLoading(true)

      const [profileResponse, providerResponse, notificationResponse] = await Promise.all([
        backendApi.user.getProfile(),
        backendApi.serviceProvider.getMyProfile().catch(() => null),
        backendApi.notifications.getAll({ limit: 10 }),
      ])

      if (profileResponse?.success) {
        const profileData = profileResponse?.data || profileResponse?.user || profileResponse
        setUserProfile(profileData)
      }

      if (providerResponse?.success) {
        const providerData = providerResponse?.data
        setProviderProfile(providerData)
      } else {
        setProviderProfile(null)
      }

      if (notificationResponse?.success) {
        const rows = Array.isArray(notificationResponse?.data?.notifications)
          ? notificationResponse.data.notifications
          : Array.isArray(notificationResponse?.notifications)
            ? notificationResponse.notifications
            : []
        setNotifications(rows)
      }

      const providerData = providerResponse?.success ? providerResponse.data : null
      const profileData = profileResponse?.success ? (profileResponse?.data || profileResponse?.user || profileResponse) : null

      setForm({
        displayName: profileData?.displayName || profileData?.name || providerData?.user?.name || '',
        phoneNumber: profileData?.phone || profileData?.phoneNumber || '',
        location: providerData?.location || profileData?.address || '',
        bio: providerData?.description || '',
        category: providerData?.category || '',
        specialization: providerData?.specialization || '',
        hourlyRate: providerData?.hourlyRate ? String(providerData.hourlyRate) : '',
        available: providerData?.available ?? true,
      })
    } catch (error: any) {
      toast.error(error?.message || 'Failed to load settings')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadSettings()
  }, [])

  const unreadCount = useMemo(() => notifications.filter((row) => !row.isRead).length, [notifications])

  const saveSettings = async () => {
    try {
      setSaving(true)

      const userUpdatePayload = {
        displayName: form.displayName,
        phoneNumber: form.phoneNumber,
        location: form.location,
        bio: form.bio,
      }

      const profileUpdateResponse = await backendApi.user.updateProfile(userUpdatePayload)
      if (profileUpdateResponse?.success === false) {
        throw new Error(profileUpdateResponse?.message || profileUpdateResponse?.error || 'Failed to update user profile')
      }

      if (providerProfile?.id) {
        const providerUpdatePayload = {
          category: form.category,
          specialization: form.specialization,
          hourlyRate: form.hourlyRate ? Number(form.hourlyRate) : undefined,
          location: form.location,
          description: form.bio,
          available: form.available,
        }

        const providerUpdateResponse = await backendApi.serviceProvider.update(providerProfile.id, providerUpdatePayload)
        if (providerUpdateResponse?.success === false) {
          throw new Error(providerUpdateResponse?.message || providerUpdateResponse?.error || 'Failed to update service profile')
        }
      }

      toast.success('Settings updated')
      await loadSettings()
    } catch (error: any) {
      toast.error(error?.message || 'Failed to save settings')
    } finally {
      setSaving(false)
    }
  }

  const markAllRead = async () => {
    try {
      const response = await backendApi.notifications.markAllAsRead()
      if (!response?.success) {
        throw new Error(response?.message || response?.error || 'Failed to mark notifications as read')
      }
      toast.success('Notifications marked as read')
      await loadSettings()
    } catch (error: any) {
      toast.error(error?.message || 'Failed to mark notifications as read')
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-96 items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-16 w-16 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
          <p className="text-gray-600 dark:text-gray-400">Loading settings...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Manage profile, service availability, and notification visibility from real backend data
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={loadSettings}
            className="inline-flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
          >
            <RefreshCw size={16} /> Refresh
          </button>
          <button
            onClick={saveSettings}
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400"
          >
            <Save size={16} /> Save
          </button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4 rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-950">
          <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Profile and Service Details</h2>

          <div className="grid gap-3">
            <label className="text-xs font-medium text-gray-600 dark:text-gray-300">Display Name</label>
            <input
              value={form.displayName}
              onChange={(e) => setForm((prev) => ({ ...prev, displayName: e.target.value }))}
              className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-gray-900"
            />

            <label className="text-xs font-medium text-gray-600 dark:text-gray-300">Phone</label>
            <input
              value={form.phoneNumber}
              onChange={(e) => setForm((prev) => ({ ...prev, phoneNumber: e.target.value }))}
              className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-gray-900"
            />

            <label className="text-xs font-medium text-gray-600 dark:text-gray-300">Location</label>
            <input
              value={form.location}
              onChange={(e) => setForm((prev) => ({ ...prev, location: e.target.value }))}
              className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-gray-900"
            />

            <label className="text-xs font-medium text-gray-600 dark:text-gray-300">Bio</label>
            <textarea
              value={form.bio}
              onChange={(e) => setForm((prev) => ({ ...prev, bio: e.target.value }))}
              rows={4}
              className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-gray-900"
            />

            <label className="text-xs font-medium text-gray-600 dark:text-gray-300">Category</label>
            <input
              value={form.category}
              onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value }))}
              className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-gray-900"
              placeholder="lawyer, architect, designer, contractor, photographer, consultant"
            />

            <label className="text-xs font-medium text-gray-600 dark:text-gray-300">Specialization</label>
            <input
              value={form.specialization}
              onChange={(e) => setForm((prev) => ({ ...prev, specialization: e.target.value }))}
              className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-gray-900"
            />

            <label className="text-xs font-medium text-gray-600 dark:text-gray-300">Hourly Rate</label>
            <input
              type="number"
              value={form.hourlyRate}
              onChange={(e) => setForm((prev) => ({ ...prev, hourlyRate: e.target.value }))}
              className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-gray-900"
            />

            <label className="inline-flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
              <input
                type="checkbox"
                checked={form.available}
                onChange={(e) => setForm((prev) => ({ ...prev, available: e.target.checked }))}
              />
              Available for new service requests
            </label>
          </div>

          {!providerProfile && (
            <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-3 text-sm text-yellow-800 dark:border-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-200">
              Service provider profile not found. Complete onboarding from{' '}
              <Link href="/service-partners/registration" className="underline">
                registration page
              </Link>
              .
            </div>
          )}

          {providerProfile?.verified && (
            <div className="inline-flex items-center gap-2 rounded-lg bg-green-50 px-3 py-2 text-sm font-medium text-green-700 dark:bg-green-900/20 dark:text-green-300">
              <CheckCircle size={16} /> Service profile verified
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-950">
            <h2 className="mb-3 text-sm font-semibold text-gray-900 dark:text-gray-100">Appearance</h2>
            <div className="flex gap-2">
              <button
                onClick={() => setTheme('light')}
                className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium ${theme === 'light'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700'
                  }`}
              >
                <Sun size={16} /> Light
              </button>
              <button
                onClick={() => setTheme('dark')}
                className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium ${theme === 'dark'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700'
                  }`}
              >
                <Moon size={16} /> Dark
              </button>
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-950">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Recent Notifications</h2>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 dark:bg-blue-900/20 dark:text-blue-300">
                  <Bell size={12} /> {unreadCount} unread
                </span>
                <button
                  onClick={markAllRead}
                  className="rounded bg-gray-100 px-2 py-1 text-xs font-medium hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
                >
                  Mark all read
                </button>
              </div>
            </div>

            <div className="max-h-[300px] space-y-2 overflow-y-auto">
              {notifications.length === 0 && <p className="text-sm text-gray-500">No recent notifications.</p>}
              {notifications.map((row) => (
                <div key={row.id} className="rounded-lg border border-gray-200 p-3 dark:border-gray-700">
                  <div className="mb-1 flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{row.title || row.type || 'Notification'}</p>
                    <span className="text-xs text-gray-500">{formatDate(row.createdAt)}</span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{row.message || '-'}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-4 text-sm text-gray-600 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-400">
            Profile and service settings are persisted to backend user and service provider records, and notification data is loaded from the live notification API.
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-4 text-xs text-gray-500 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-400">
        Signed in as {userProfile?.email || providerProfile?.user?.email || 'unknown user'}
      </div>
    </div>
  )
}
