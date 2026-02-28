'use client'

import { useEffect, useMemo, useState } from 'react'
import { FileCheck, RefreshCw, Search } from 'lucide-react'
import toast from 'react-hot-toast'
import { backendApi } from '@/lib/backendApi'

type VerificationTask = {
  id?: string
  _id?: string
  taskType?: string
  status?: string
  notes?: string
  propertyId?:
    | string
    | {
        _id?: string
        id?: string
        title?: string
        location?: string
      }
  createdAt?: string
}

type VerificationReport = {
  id?: string
  _id?: string
  taskId?: string
  propertyId?: string
  reportType?: string
  findings?: string
  recommendation?: string
  notes?: string
  createdAt?: string
}

const normalize = (value?: string) => (value || '').toLowerCase()

const getEntityId = (value: any) => String(value?.id || value?._id || value || '')

const formatDate = (value?: string) => {
  if (!value) return '-'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '-'
  return date.toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })
}

export default function GroundPartnerReportsPage() {
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [tasks, setTasks] = useState<VerificationTask[]>([])
  const [reports, setReports] = useState<VerificationReport[]>([])
  const [query, setQuery] = useState('')
  const [form, setForm] = useState({
    taskId: '',
    reportType: 'verification',
    recommendation: 'needs_followup',
    findings: '',
    notes: '',
    taskStatus: 'none',
  })
  const [profile, setProfile] = useState<{ uniqueId?: string } | null>(null)

  // Fetch profile for UID
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await backendApi.user.getProfile()
        if (response?.success) {
          setProfile({
            uniqueId: response.data.uid
          })
        }
      } catch (error) {
        console.error('Failed to load profile:', error)
      }
    }
    loadProfile()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const [taskResponse, reportResponse] = await Promise.all([
        backendApi.verification.getTasks(),
        backendApi.verification.getReports(),
      ])

      if (!taskResponse?.success) {
        throw new Error(taskResponse?.message || taskResponse?.error || 'Failed to load verification tasks')
      }
      if (!reportResponse?.success) {
        throw new Error(reportResponse?.message || reportResponse?.error || 'Failed to load reports')
      }

      setTasks(Array.isArray(taskResponse?.data) ? taskResponse.data : [])
      setReports(Array.isArray(reportResponse?.data) ? reportResponse.data : [])
    } catch (error: any) {
      toast.error(error?.message || 'Failed to load reports data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const taskOptions = useMemo(() => {
    return tasks
      .map((task) => {
        const taskId = getEntityId(task)
        const propertyObj = typeof task.propertyId === 'object' ? task.propertyId : null
        const propertyId = propertyObj ? getEntityId(propertyObj) : String(task.propertyId || '')
        return {
          taskId,
          propertyId,
          label: `${propertyObj?.title || 'Property task'} (${normalize(task.status) || 'assigned'})`,
        }
      })
      .filter((row) => row.taskId && row.propertyId)
  }, [tasks])

  useEffect(() => {
    if (!form.taskId && taskOptions.length > 0) {
      setForm((prev) => ({ ...prev, taskId: taskOptions[0].taskId }))
    }
  }, [form.taskId, taskOptions])

  const selectedTask = useMemo(() => taskOptions.find((row) => row.taskId === form.taskId), [form.taskId, taskOptions])

  const filteredReports = useMemo(() => {
    const q = query.trim().toLowerCase()
    return [...reports]
      .filter((row) => {
        if (!q) return true
        return (
          (row.reportType || '').toLowerCase().includes(q) ||
          (row.recommendation || '').toLowerCase().includes(q) ||
          (row.findings || '').toLowerCase().includes(q) ||
          String(row.taskId || '').toLowerCase().includes(q)
        )
      })
      .sort((a, b) => +new Date(b.createdAt || 0) - +new Date(a.createdAt || 0))
  }, [query, reports])

  const createReport = async () => {
    if (!selectedTask?.taskId || !selectedTask?.propertyId) {
      toast.error('Select a valid verification task')
      return
    }
    if (!form.findings.trim()) {
      toast.error('Findings are required')
      return
    }

    try {
      setSubmitting(true)
      const response = await backendApi.verification.createReport({
        taskId: selectedTask.taskId,
        propertyId: selectedTask.propertyId,
        reportType: form.reportType,
        findings: form.findings,
        recommendation: form.recommendation,
        notes: form.notes,
      })

      if (!response?.success) {
        throw new Error(response?.message || response?.error || 'Failed to create report')
      }

      if (form.taskStatus !== 'none') {
        await backendApi.verification.updateTask(selectedTask.taskId, { status: form.taskStatus })
      }

      toast.success('Verification report submitted')
      setForm((prev) => ({
        ...prev,
        findings: '',
        notes: '',
        recommendation: 'needs_followup',
        taskStatus: 'none',
      }))
      await loadData()
    } catch (error: any) {
      toast.error(error?.message || 'Failed to submit report')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-3">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Verification Reports</h1>
            <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-full text-sm font-bold border border-blue-200 dark:border-blue-800">
              {profile?.uniqueId ? `GBPR-${profile.uniqueId.slice(-6).toUpperCase()}` : 'GBPR-PARTNER'}
            </span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Site verification reports linked to tasks and property workflows
          </p>
        </div>
        <button
          onClick={loadData}
          className="inline-flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
        >
          <RefreshCw size={16} /> Refresh
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-3 rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-950">
          <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Create Report</h2>

          <select
            value={form.taskId}
            onChange={(e) => setForm((prev) => ({ ...prev, taskId: e.target.value }))}
            className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-gray-900"
          >
            {taskOptions.map((task) => (
              <option key={task.taskId} value={task.taskId}>
                {task.label}
              </option>
            ))}
          </select>

          <div className="grid grid-cols-2 gap-3">
            <select
              value={form.reportType}
              onChange={(e) => setForm((prev) => ({ ...prev, reportType: e.target.value }))}
              className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-gray-900"
            >
              <option value="verification">Verification</option>
              <option value="site_visit">Site Visit</option>
              <option value="inspection">Inspection</option>
              <option value="documentation">Documentation</option>
            </select>

            <select
              value={form.recommendation}
              onChange={(e) => setForm((prev) => ({ ...prev, recommendation: e.target.value }))}
              className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-gray-900"
            >
              <option value="approve">Approve</option>
              <option value="reject">Reject</option>
              <option value="needs_followup">Needs Follow-up</option>
            </select>
          </div>

          <textarea
            value={form.findings}
            onChange={(e) => setForm((prev) => ({ ...prev, findings: e.target.value }))}
            rows={5}
            placeholder="Inspection findings"
            className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-gray-900"
          />

          <textarea
            value={form.notes}
            onChange={(e) => setForm((prev) => ({ ...prev, notes: e.target.value }))}
            rows={3}
            placeholder="Additional notes"
            className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-gray-900"
          />

          <select
            value={form.taskStatus}
            onChange={(e) => setForm((prev) => ({ ...prev, taskStatus: e.target.value }))}
            className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-gray-900"
          >
            <option value="none">Do not change task status</option>
            <option value="in_review">Set task: in_review</option>
            <option value="verified">Set task: verified</option>
            <option value="rejected">Set task: rejected</option>
          </select>

          <button
            onClick={createReport}
            disabled={submitting || !taskOptions.length}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400"
          >
            <FileCheck size={16} /> Submit Report
          </button>
        </div>

        <div className="space-y-3 rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-950">
          <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Task Snapshot</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">Verification tasks loaded: {tasks.length}</p>
          <div className="max-h-[320px] space-y-2 overflow-y-auto">
            {tasks.length === 0 && <p className="text-sm text-gray-500">No verification tasks available.</p>}
            {tasks.map((task) => {
              const taskId = getEntityId(task)
              const propertyObj = typeof task.propertyId === 'object' ? task.propertyId : null
              return (
                <div key={taskId} className="rounded-lg border border-gray-200 p-3 text-sm dark:border-gray-700">
                  <p className="font-medium text-gray-900 dark:text-gray-100">{propertyObj?.title || 'Property task'}</p>
                  <p className="text-xs text-gray-500">Task ID: {taskId}</p>
                  <p className="text-xs text-gray-500">Status: {normalize(task.status) || 'assigned'}</p>
                  <p className="text-xs text-gray-500">Location: {propertyObj?.location || '-'}</p>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-950 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by type, recommendation, findings, or task ID"
            className="w-full rounded-lg border border-gray-200 bg-white py-2 pl-9 pr-3 text-sm outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-gray-900"
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[920px] text-sm">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-300">Task ID</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-300">Type</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-300">Recommendation</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-300">Findings</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-300">Notes</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600 dark:text-gray-300">Created</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td className="px-4 py-8 text-center text-gray-500" colSpan={6}>
                    Loading reports...
                  </td>
                </tr>
              )}
              {!loading && filteredReports.length === 0 && (
                <tr>
                  <td className="px-4 py-8 text-center text-gray-500" colSpan={6}>
                    No reports found.
                  </td>
                </tr>
              )}
              {!loading &&
                filteredReports.map((row) => (
                  <tr key={getEntityId(row)} className="border-t border-gray-100 dark:border-gray-800">
                    <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{row.taskId || '-'}</td>
                    <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{row.reportType || '-'}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex rounded-full bg-gray-100 px-2 py-1 text-xs font-medium capitalize text-gray-700 dark:bg-gray-800 dark:text-gray-200">
                        {normalize(row.recommendation) || '-'}
                      </span>
                    </td>
                    <td className="max-w-[220px] truncate px-4 py-3 text-gray-700 dark:text-gray-300" title={row.findings || '-'}>
                      {row.findings || '-'}
                    </td>
                    <td className="max-w-[220px] truncate px-4 py-3 text-gray-700 dark:text-gray-300" title={row.notes || '-'}>
                      {row.notes || '-'}
                    </td>
                    <td className="px-4 py-3 text-gray-700 dark:text-gray-300">{formatDate(row.createdAt)}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-4 text-sm text-gray-600 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-400">
        Verification reports and task status changes update property moderation workflow used by employee and admin portals.
      </div>
    </div>
  )
}
