'use client'

import { useEffect, useMemo, useState } from 'react'
import { Copy, ExternalLink, RefreshCw, Search, Share2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { backendApi } from '@/lib/backendApi'

type Referral = {
  id: string
  referralCode?: string
  leadName?: string
  leadContact?: string
  status?: string
  commissionAmount?: number | string | null
  createdAt?: string
}

type CodeSummary = {
  code: string
  leads: number
  converted: number
  commission: number
  latestLeadAt?: string
}

const toNumber = (value: unknown) => {
  const n = Number(value)
  return Number.isFinite(n) ? n : 0
}

const normalize = (value?: string) => (value || '').toLowerCase()

const formatCurrency = (value: number) => `INR ${value.toLocaleString('en-IN')}`

const formatDate = (value?: string) => {
  if (!value) return '-'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '-'
  return date.toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })
}

export default function PartnerSharePage() {
  const [loading, setLoading] = useState(true)
  const [referrals, setReferrals] = useState<Referral[]>([])
  const [query, setQuery] = useState('')
  const [selectedCode, setSelectedCode] = useState('')

  const loadReferrals = async () => {
    try {
      setLoading(true)
      const response = await backendApi.partners.getReferrals()
      if (!response?.success) {
        throw new Error(response?.message || response?.error || 'Failed to load referral links')
      }
      const rows = Array.isArray(response?.data) ? response.data : []
      setReferrals(rows)
    } catch (error: any) {
      toast.error(error?.message || 'Failed to load referral links')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadReferrals()
  }, [])

  const codeSummaries = useMemo<CodeSummary[]>(() => {
    const map = new Map<string, CodeSummary>()

    for (const row of referrals) {
      const code = (row.referralCode || '').trim() || 'unassigned'
      const current = map.get(code) || { code, leads: 0, converted: 0, commission: 0 }
      current.leads += 1
      if (normalize(row.status) === 'converted') current.converted += 1
      current.commission += toNumber(row.commissionAmount)

      if (!current.latestLeadAt || +new Date(row.createdAt || 0) > +new Date(current.latestLeadAt || 0)) {
        current.latestLeadAt = row.createdAt
      }
      map.set(code, current)
    }

    return Array.from(map.values()).sort((a, b) => b.leads - a.leads)
  }, [referrals])

  useEffect(() => {
    if (!selectedCode && codeSummaries.length > 0) {
      setSelectedCode(codeSummaries[0].code)
    }
  }, [codeSummaries, selectedCode])

  const filteredCodes = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return codeSummaries
    return codeSummaries.filter((row) => row.code.toLowerCase().includes(q))
  }, [codeSummaries, query])

  const baseUrl = useMemo(() => {
    if (typeof window === 'undefined') return 'https://gharbazaar.in'
    return window.location.origin
  }, [])

  const selectedLink = useMemo(() => {
    if (!selectedCode) return ''
    return `${baseUrl}/signup?ref=${encodeURIComponent(selectedCode)}`
  }, [baseUrl, selectedCode])

  const selectedSummary = useMemo(() => {
    return codeSummaries.find((row) => row.code === selectedCode)
  }, [codeSummaries, selectedCode])

  const shareText = useMemo(() => {
    return `Discover verified properties and expert support on GharBazaar. Use my referral code ${selectedCode} while signing up.`
  }, [selectedCode])

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast.success(`${label} copied`)
    } catch {
      toast.error(`Unable to copy ${label.toLowerCase()}`)
    }
  }

  const openShareWindow = (platform: 'whatsapp' | 'facebook' | 'linkedin' | 'email') => {
    if (!selectedLink) return
    const encodedText = encodeURIComponent(`${shareText} ${selectedLink}`)
    const encodedUrl = encodeURIComponent(selectedLink)

    let url = ''
    if (platform === 'whatsapp') {
      url = `https://wa.me/?text=${encodedText}`
    }
    if (platform === 'facebook') {
      url = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`
    }
    if (platform === 'linkedin') {
      url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`
    }
    if (platform === 'email') {
      url = `mailto:?subject=${encodeURIComponent('Join GharBazaar')}&body=${encodedText}`
    }

    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer')
    }
  }

  const totals = useMemo(() => {
    return codeSummaries.reduce(
      (acc, row) => {
        acc.codes += 1
        acc.leads += row.leads
        acc.converted += row.converted
        acc.commission += row.commission
        return acc
      },
      { codes: 0, leads: 0, converted: 0, commission: 0 }
    )
  }, [codeSummaries])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Share Links</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Referral links generated from real referral code usage
          </p>
        </div>
        <button
          onClick={loadReferrals}
          className="inline-flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-950">
          <p className="text-xs text-gray-500">Active Referral Codes</p>
          <p className="text-xl font-semibold">{totals.codes}</p>
        </div>
        <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 dark:border-blue-900/30 dark:bg-blue-900/20">
          <p className="text-xs text-blue-700 dark:text-blue-400">Total Leads</p>
          <p className="text-xl font-semibold">{totals.leads}</p>
        </div>
        <div className="rounded-xl border border-green-200 bg-green-50 p-4 dark:border-green-900/30 dark:bg-green-900/20">
          <p className="text-xs text-green-700 dark:text-green-400">Converted Leads</p>
          <p className="text-xl font-semibold">{totals.converted}</p>
        </div>
        <div className="rounded-xl border border-purple-200 bg-purple-50 p-4 dark:border-purple-900/30 dark:bg-purple-900/20">
          <p className="text-xs text-purple-700 dark:text-purple-400">Commission</p>
          <p className="text-xl font-semibold">{formatCurrency(totals.commission)}</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4 rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-950">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search referral codes"
              className="w-full rounded-lg border border-gray-200 bg-white py-2 pl-9 pr-3 text-sm outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-gray-900"
            />
          </div>

          <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th className="px-3 py-2 text-left font-medium text-gray-600 dark:text-gray-300">Code</th>
                  <th className="px-3 py-2 text-left font-medium text-gray-600 dark:text-gray-300">Leads</th>
                  <th className="px-3 py-2 text-left font-medium text-gray-600 dark:text-gray-300">Converted</th>
                  <th className="px-3 py-2 text-left font-medium text-gray-600 dark:text-gray-300">Commission</th>
                </tr>
              </thead>
              <tbody>
                {loading && (
                  <tr>
                    <td className="px-3 py-6 text-center text-gray-500" colSpan={4}>
                      Loading referral codes...
                    </td>
                  </tr>
                )}
                {!loading && filteredCodes.length === 0 && (
                  <tr>
                    <td className="px-3 py-6 text-center text-gray-500" colSpan={4}>
                      No referral codes found.
                    </td>
                  </tr>
                )}
                {!loading &&
                  filteredCodes.map((row) => (
                    <tr
                      key={row.code}
                      className={`cursor-pointer border-t border-gray-100 dark:border-gray-800 ${selectedCode === row.code ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}
                      onClick={() => setSelectedCode(row.code)}
                    >
                      <td className="px-3 py-2 font-medium text-gray-900 dark:text-gray-100">{row.code}</td>
                      <td className="px-3 py-2 text-gray-700 dark:text-gray-300">{row.leads}</td>
                      <td className="px-3 py-2 text-gray-700 dark:text-gray-300">{row.converted}</td>
                      <td className="px-3 py-2 text-gray-700 dark:text-gray-300">{formatCurrency(row.commission)}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-4 rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-950">
          <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Selected Share Link</h2>
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-3 text-sm text-gray-700 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300">
            {selectedLink || 'Select a referral code to generate link'}
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => copyToClipboard(selectedLink, 'Link')}
              disabled={!selectedLink}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400"
            >
              <Copy size={16} /> Copy Link
            </button>
            <button
              onClick={() => copyToClipboard(selectedCode, 'Referral code')}
              disabled={!selectedCode}
              className="inline-flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-2 text-sm font-medium hover:bg-gray-200 disabled:cursor-not-allowed dark:bg-gray-800 dark:hover:bg-gray-700"
            >
              <Copy size={16} /> Copy Code
            </button>
            <button
              onClick={() => openShareWindow('whatsapp')}
              disabled={!selectedLink}
              className="rounded-lg bg-green-600 px-3 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-gray-400"
            >
              WhatsApp
            </button>
            <button
              onClick={() => openShareWindow('facebook')}
              disabled={!selectedLink}
              className="rounded-lg bg-blue-500 px-3 py-2 text-sm font-medium text-white hover:bg-blue-600 disabled:cursor-not-allowed disabled:bg-gray-400"
            >
              Facebook
            </button>
            <button
              onClick={() => openShareWindow('linkedin')}
              disabled={!selectedLink}
              className="rounded-lg bg-sky-600 px-3 py-2 text-sm font-medium text-white hover:bg-sky-700 disabled:cursor-not-allowed disabled:bg-gray-400"
            >
              LinkedIn
            </button>
            <button
              onClick={() => openShareWindow('email')}
              disabled={!selectedLink}
              className="rounded-lg bg-gray-700 px-3 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-400"
            >
              Email
            </button>
          </div>

          {selectedSummary && (
            <div className="rounded-lg border border-gray-200 p-3 text-sm dark:border-gray-700">
              <p className="font-medium text-gray-900 dark:text-gray-100">Code Performance</p>
              <div className="mt-2 grid grid-cols-2 gap-2 text-gray-700 dark:text-gray-300">
                <span>Leads: {selectedSummary.leads}</span>
                <span>Converted: {selectedSummary.converted}</span>
                <span>Commission: {formatCurrency(selectedSummary.commission)}</span>
                <span>Last lead: {formatDate(selectedSummary.latestLeadAt)}</span>
              </div>
            </div>
          )}

          <div className="rounded-lg border border-gray-200 p-3 text-sm dark:border-gray-700">
            <p className="mb-1 font-medium text-gray-900 dark:text-gray-100">Share Message</p>
            <p className="text-gray-700 dark:text-gray-300">{shareText}</p>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-4 text-sm text-gray-600 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-400">
        Shared referral links route prospects into the same backend referral and conversion pipeline tracked by employee and admin portals.
      </div>
    </div>
  )
}
