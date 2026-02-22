'use client'

import { useEffect, useMemo, useState } from 'react'
import { BookOpen, CheckCircle, Clock, GraduationCap, Target } from 'lucide-react'
import { backendApi } from '@/lib/backendApi'

type Referral = {
  id: string
  status?: string
  createdAt?: string
}

type Payout = {
  amount?: number
  status?: string
}

type Notification = {
  id: string
  title?: string
  message?: string
  isRead?: boolean
  createdAt?: string
}

const percent = (value: number) => `${value.toFixed(1)}%`

export default function TrainingPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [referrals, setReferrals] = useState<Referral[]>([])
  const [payouts, setPayouts] = useState<Payout[]>([])
  const [notifications, setNotifications] = useState<Notification[]>([])

  const loadData = async () => {
    try {
      setLoading(true)
      setError(null)

      const [referralsResponse, payoutsResponse, notificationsResponse] = await Promise.all([
        backendApi.partners.getReferrals(),
        backendApi.partners.getPayouts(),
        backendApi.notifications.getAll({ limit: 50 }),
      ])

      if (!referralsResponse?.success) throw new Error(referralsResponse?.error || 'Failed to load referrals')
      if (!payoutsResponse?.success) throw new Error(payoutsResponse?.error || 'Failed to load payouts')
      if (!notificationsResponse?.success) throw new Error(notificationsResponse?.error || 'Failed to load notifications')

      setReferrals(Array.isArray(referralsResponse.data) ? referralsResponse.data : [])
      setPayouts(Array.isArray(payoutsResponse.data) ? payoutsResponse.data : [])

      const records = Array.isArray(notificationsResponse.notifications)
        ? notificationsResponse.notifications
        : Array.isArray(notificationsResponse.data?.notifications)
          ? notificationsResponse.data.notifications
          : []
      setNotifications(records)
    } catch (err: any) {
      setError(err?.message || 'Failed to load training dashboard')
      setReferrals([])
      setPayouts([])
      setNotifications([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const stats = useMemo(() => {
    const totalReferrals = referrals.length
    const converted = referrals.filter((referral) => (referral.status || '').toLowerCase() === 'converted').length
    const contacted = referrals.filter((referral) => ['contacted', 'converted'].includes((referral.status || '').toLowerCase())).length
    const conversionRate = totalReferrals > 0 ? (converted / totalReferrals) * 100 : 0
    const contactRate = totalReferrals > 0 ? (contacted / totalReferrals) * 100 : 0

    const paidPayout = payouts
      .filter((payout) => (payout.status || '').toLowerCase() === 'paid')
      .reduce((sum, payout) => sum + Number(payout.amount || 0), 0)

    const unreadNotifications = notifications.filter((notification) => !notification.isRead).length

    return {
      totalReferrals,
      converted,
      conversionRate,
      contactRate,
      paidPayout,
      unreadNotifications,
    }
  }, [referrals, payouts, notifications])

  const recommendations = useMemo(() => {
    const items: string[] = []

    if (stats.totalReferrals < 5) {
      items.push('Submit at least 5 qualified referrals to unlock consistent lead patterns.')
    }
    if (stats.contactRate < 60) {
      items.push('Increase follow-up speed on new referrals to improve contacted ratio.')
    }
    if (stats.conversionRate < 20) {
      items.push('Improve qualification criteria before referral submission to raise conversion rate.')
    }
    if (stats.unreadNotifications > 0) {
      items.push('Review unread policy and campaign notifications from admin.')
    }
    if (items.length === 0) {
      items.push('Current performance is healthy. Continue maintaining referral quality and response speed.')
    }

    return items
  }, [stats])

  const recentNotifications = useMemo(
    () =>
      [...notifications]
        .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
        .slice(0, 5),
    [notifications]
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Training Center</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Live enablement view based on your referral and payout performance.</p>
        </div>

        <button
          onClick={loadData}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium"
        >
          Refresh
        </button>
      </div>

      {loading ? (
        <div className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl p-10 text-center">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      ) : error ? (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 text-red-700 dark:text-red-300">
          {error}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl p-4">
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Referrals</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalReferrals}</p>
            </div>
            <div className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl p-4">
              <p className="text-sm text-gray-500 dark:text-gray-400">Conversion Rate</p>
              <p className="text-2xl font-bold text-green-600">{percent(stats.conversionRate)}</p>
            </div>
            <div className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl p-4">
              <p className="text-sm text-gray-500 dark:text-gray-400">Contacted Rate</p>
              <p className="text-2xl font-bold text-blue-600">{percent(stats.contactRate)}</p>
            </div>
            <div className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl p-4">
              <p className="text-sm text-gray-500 dark:text-gray-400">Paid Payout</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(stats.paidPayout)}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <Target size={18} className="text-blue-600" />
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recommended Actions</h2>
              </div>

              <div className="space-y-3">
                {recommendations.map((item) => (
                  <div key={item} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                    <CheckCircle size={15} className="mt-0.5 text-green-600" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <BookOpen size={18} className="text-blue-600" />
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Admin Updates</h2>
              </div>

              {recentNotifications.length === 0 ? (
                <p className="text-sm text-gray-500 dark:text-gray-400">No notifications available.</p>
              ) : (
                <div className="space-y-3">
                  {recentNotifications.map((notification) => (
                    <div key={notification.id} className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{notification.title || 'Notification'}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{notification.message || '-'}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                        {notification.createdAt ? new Date(notification.createdAt).toLocaleString() : '-'}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <GraduationCap size={18} className="text-blue-600" />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Workflow Milestones</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
              <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-900">
                <p className="text-gray-500 dark:text-gray-400">Qualified Referrals</p>
                <p className="font-semibold text-gray-900 dark:text-white mt-1">{stats.converted} converted leads</p>
              </div>
              <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-900">
                <p className="text-gray-500 dark:text-gray-400">Unread Alerts</p>
                <p className="font-semibold text-gray-900 dark:text-white mt-1">{stats.unreadNotifications}</p>
              </div>
              <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-900">
                <p className="text-gray-500 dark:text-gray-400">Follow-up Health</p>
                <p className="font-semibold text-gray-900 dark:text-white mt-1">{percent(stats.contactRate)}</p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

