'use client'

import { useEffect, useMemo, useState } from 'react'
import { BookOpen, RefreshCw } from 'lucide-react'
import toast from 'react-hot-toast'
import { backendApi } from '@/lib/backendApi'

type PartnerCase = {
  id: string
  status?: string
  title?: string
  createdAt?: string
}

type Visit = {
  id: string
  status?: string
  scheduledAt?: string
  createdAt?: string
  property?: { title?: string }
}

type VerificationReport = {
  id?: string
  _id?: string
  reportType?: string
  recommendation?: string
  createdAt?: string
}

const normalize = (value?: string) => (value || '').toLowerCase()

const formatDate = (value?: string) => {
  if (!value) return '-'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '-'
  return date.toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })
}

export default function GroundPartnerLearningPage() {
  const [loading, setLoading] = useState(true)
  const [cases, setCases] = useState<PartnerCase[]>([])
  const [visits, setVisits] = useState<Visit[]>([])
  const [reports, setReports] = useState<VerificationReport[]>([])

  const loadData = async () => {
    try {
      setLoading(true)
      const [caseResponse, visitResponse, reportResponse] = await Promise.all([
        backendApi.partners.getCases({ type: 'ground' }),
        backendApi.visits.getPartner(),
        backendApi.verification.getReports(),
      ])

      if (!caseResponse?.success) {
        throw new Error(caseResponse?.message || caseResponse?.error || 'Failed to load case data')
      }
      if (!visitResponse?.success) {
        throw new Error(visitResponse?.message || visitResponse?.error || 'Failed to load visit data')
      }
      if (!reportResponse?.success) {
        throw new Error(reportResponse?.message || reportResponse?.error || 'Failed to load report data')
      }

      setCases(Array.isArray(caseResponse?.data) ? caseResponse.data : [])
      setVisits(Array.isArray(visitResponse?.data) ? visitResponse.data : [])
      setReports(Array.isArray(reportResponse?.data) ? reportResponse.data : [])
    } catch (error: any) {
      toast.error(error?.message || 'Failed to load learning insights')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const insights = useMemo(() => {
    const totalTasks = cases.length
    const completedTasks = cases.filter((row) => normalize(row.status) === 'completed').length
    const totalVisits = visits.length
    const completedVisits = visits.filter((row) => normalize(row.status) === 'completed').length

    const taskCompletion = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0
    const visitCompletion = totalVisits > 0 ? (completedVisits / totalVisits) * 100 : 0
    const reportCoverage = completedVisits > 0 ? (reports.length / completedVisits) * 100 : 0

    const recommendations: { title: string; reason: string; priority: 'high' | 'medium' | 'low' }[] = []

    if (taskCompletion < 70) {
      recommendations.push({
        title: 'Task Execution Discipline',
        reason: `Task completion is ${taskCompletion.toFixed(1)}%. Improve task closure turnaround and status updates.`,
        priority: 'high',
      })
    }
    if (visitCompletion < 70) {
      recommendations.push({
        title: 'Site Visit Follow-through',
        reason: `Visit completion is ${visitCompletion.toFixed(1)}%. Prioritize scheduled visits and avoid backlog.`,
        priority: 'high',
      })
    }
    if (reportCoverage < 80) {
      recommendations.push({
        title: 'Report Submission Quality',
        reason: `Report coverage is ${reportCoverage.toFixed(1)}% against completed visits. Submit reports consistently.`,
        priority: 'medium',
      })
    }
    if (recommendations.length === 0) {
      recommendations.push({
        title: 'Maintain Current Cadence',
        reason: 'Operational metrics are stable. Focus on faster report turnaround and richer findings quality.',
        priority: 'low',
      })
    }

    return {
      taskCompletion,
      visitCompletion,
      reportCoverage,
      recommendations,
    }
  }, [cases, reports.length, visits])

  const recentActivity = useMemo(() => {
    const rows: { type: string; label: string; status: string; createdAt?: string }[] = []

    for (const row of cases.slice(0, 6)) {
      rows.push({
        type: 'Task',
        label: row.title || 'Ground task',
        status: normalize(row.status) || 'open',
        createdAt: row.createdAt,
      })
    }

    for (const row of visits.slice(0, 6)) {
      rows.push({
        type: 'Visit',
        label: row.property?.title || 'Site visit',
        status: normalize(row.status) || 'pending',
        createdAt: row.scheduledAt || row.createdAt,
      })
    }

    for (const row of reports.slice(0, 6)) {
      rows.push({
        type: 'Report',
        label: row.reportType || 'Verification report',
        status: normalize(row.recommendation) || 'submitted',
        createdAt: row.createdAt,
      })
    }

    return rows.sort((a, b) => +new Date(b.createdAt || 0) - +new Date(a.createdAt || 0)).slice(0, 12)
  }, [cases, reports, visits])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Learning Insights</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Skill recommendations generated from your live workflow performance
          </p>
        </div>
        <button
          onClick={loadData}
          className="inline-flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
        >
          <RefreshCw size={16} /> Refresh
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 dark:border-blue-900/30 dark:bg-blue-900/20">
          <p className="text-xs text-blue-700 dark:text-blue-400">Task Completion</p>
          <p className="text-xl font-semibold">{insights.taskCompletion.toFixed(1)}%</p>
        </div>
        <div className="rounded-xl border border-indigo-200 bg-indigo-50 p-4 dark:border-indigo-900/30 dark:bg-indigo-900/20">
          <p className="text-xs text-indigo-700 dark:text-indigo-400">Visit Completion</p>
          <p className="text-xl font-semibold">{insights.visitCompletion.toFixed(1)}%</p>
        </div>
        <div className="rounded-xl border border-green-200 bg-green-50 p-4 dark:border-green-900/30 dark:bg-green-900/20">
          <p className="text-xs text-green-700 dark:text-green-400">Report Coverage</p>
          <p className="text-xl font-semibold">{insights.reportCoverage.toFixed(1)}%</p>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-950">
        <h2 className="mb-3 text-sm font-semibold text-gray-900 dark:text-gray-100">Priority Recommendations</h2>
        <div className="space-y-2">
          {insights.recommendations.map((row) => (
            <div key={row.title} className="rounded-lg border border-gray-200 p-3 dark:border-gray-700">
              <div className="mb-1 flex items-center gap-2 text-sm font-medium text-gray-900 dark:text-gray-100">
                <BookOpen size={14} />
                {row.title}
                <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium capitalize text-gray-700 dark:bg-gray-800 dark:text-gray-200">
                  {row.priority}
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">{row.reason}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-950">
        <h2 className="mb-3 text-sm font-semibold text-gray-900 dark:text-gray-100">Recent Activity Driving Insights</h2>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-sm">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="px-3 py-2 text-left font-medium text-gray-600 dark:text-gray-300">Type</th>
                <th className="px-3 py-2 text-left font-medium text-gray-600 dark:text-gray-300">Item</th>
                <th className="px-3 py-2 text-left font-medium text-gray-600 dark:text-gray-300">Status</th>
                <th className="px-3 py-2 text-left font-medium text-gray-600 dark:text-gray-300">Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td className="px-3 py-6 text-center text-gray-500" colSpan={4}>
                    Loading learning feed...
                  </td>
                </tr>
              )}
              {!loading && recentActivity.length === 0 && (
                <tr>
                  <td className="px-3 py-6 text-center text-gray-500" colSpan={4}>
                    No activity yet.
                  </td>
                </tr>
              )}
              {!loading &&
                recentActivity.map((row, index) => (
                  <tr key={`${row.type}-${index}`} className="border-t border-gray-100 dark:border-gray-800">
                    <td className="px-3 py-2 text-gray-700 dark:text-gray-300">{row.type}</td>
                    <td className="px-3 py-2 text-gray-700 dark:text-gray-300">{row.label}</td>
                    <td className="px-3 py-2">
                      <span className="inline-flex rounded-full bg-gray-100 px-2 py-1 text-xs font-medium capitalize text-gray-700 dark:bg-gray-800 dark:text-gray-200">
                        {row.status}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-gray-700 dark:text-gray-300">{formatDate(row.createdAt)}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-4 text-sm text-gray-600 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-400">
        Learning recommendations update automatically from live task, visit, and report workflows used across ground, employee, and admin portals.
      </div>
    </div>
  )
}
