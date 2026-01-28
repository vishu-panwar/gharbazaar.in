'use client'

import { useState } from 'react'
import {
  Settings,
  Database,
  Mail,
  Bell,
  FileText,
  Download,
  Upload,
  Trash2,
  RefreshCw,
  Shield,
  Key,
  Server,
  Activity,
  AlertTriangle,
  CheckCircle,
  Code,
  Terminal,
  Zap,
  Globe,
  Lock,
  Unlock,
  Users,
  MessageSquare,
  Send,
  Search,
  Filter,
  Calendar,
  Clock,
  BarChart3,
  Eye,
} from 'lucide-react'
import toast from 'react-hot-toast'

export default function AdminToolsPage() {
  const [activeTab, setActiveTab] = useState('system')
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [confirmAction, setConfirmAction] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const systemStats = {
    uptime: '45 days 12 hours',
    cpuUsage: 45,
    memoryUsage: 62,
    diskUsage: 38,
    activeConnections: 1234,
    requestsPerMinute: 567,
    errorRate: 0.02,
    responseTime: 145,
  }

  const databaseStats = {
    totalRecords: 125678,
    users: 12456,
    listings: 3456,
    transactions: 45678,
    size: '2.4 GB',
    lastBackup: '2 hours ago',
    backupSize: '1.8 GB',
  }

  const recentLogs = [
    {
      id: 1,
      type: 'info',
      message: 'User authentication successful',
      timestamp: '2024-01-20 14:30:45',
      user: 'system',
    },
    {
      id: 2,
      type: 'warning',
      message: 'High memory usage detected',
      timestamp: '2024-01-20 14:25:12',
      user: 'system',
    },
    {
      id: 3,
      type: 'error',
      message: 'Payment gateway timeout',
      timestamp: '2024-01-20 14:20:33',
      user: 'payment-service',
    },
    {
      id: 4,
      type: 'success',
      message: 'Database backup completed',
      timestamp: '2024-01-20 14:15:00',
      user: 'backup-service',
    },
  ]

  const handleConfirmAction = (action: any) => {
    setConfirmAction(action)
    setShowConfirmModal(true)
  }

  const executeAction = async () => {
    setLoading(true)
    setTimeout(() => {
      toast.success(confirmAction.successMessage)
      setLoading(false)
      setShowConfirmModal(false)
    }, 2000)
  }

  const handleClearCache = () => {
    handleConfirmAction({
      title: 'Clear Cache',
      message: 'Are you sure you want to clear all cached data? This may temporarily slow down the system.',
      successMessage: 'Cache cleared successfully',
    })
  }

  const handleDatabaseBackup = () => {
    toast.success('Database backup initiated')
  }

  const handleDatabaseRestore = () => {
    handleConfirmAction({
      title: 'Restore Database',
      message: 'Are you sure you want to restore the database? This will overwrite current data.',
      successMessage: 'Database restored successfully',
    })
  }

  const handleSendNotification = () => {
    toast.success('Notification sent to all users')
  }

  const handleExportData = () => {
    toast.success('Exporting data...')
  }

  const handleImportData = () => {
    toast.success('Import process started')
  }

  const getLogTypeColor = (type: string) => {
    switch (type) {
      case 'error':
        return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
      case 'warning':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
      case 'success':
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
      default:
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Tools</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          System management and administrative utilities
        </p>
      </div>

      <div className="bg-white dark:bg-gray-950 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
        <div className="flex items-center space-x-1 p-2 border-b border-gray-200 dark:border-gray-800 overflow-x-auto">
          {[
            { id: 'system', label: 'System', icon: Server },
            { id: 'database', label: 'Database', icon: Database },
            { id: 'notifications', label: 'Notifications', icon: Bell },
            { id: 'security', label: 'Security', icon: Shield },
            { id: 'logs', label: 'Logs', icon: FileText },
          ].map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-3 rounded-xl font-medium transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-purple-600 text-white shadow-lg'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                <Icon size={18} />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </div>

        <div className="p-6">
          {activeTab === 'system' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
                  <div className="flex items-center justify-between mb-4">
                    <Activity size={24} className="text-blue-600" />
                    <span className="text-sm font-medium text-blue-600">CPU</span>
                  </div>
                  <p className="text-3xl font-bold text-blue-700 dark:text-blue-300 mb-2">
                    {systemStats.cpuUsage}%
                  </p>
                  <div className="w-full bg-blue-200 dark:bg-blue-900/30 rounded-full h-2">
                    <div
                      className="h-2 bg-blue-600 rounded-full"
                      style={{ width: `${systemStats.cpuUsage}%` }}
                    />
                  </div>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl p-6 border border-purple-200 dark:border-purple-800">
                  <div className="flex items-center justify-between mb-4">
                    <Server size={24} className="text-purple-600" />
                    <span className="text-sm font-medium text-purple-600">Memory</span>
                  </div>
                  <p className="text-3xl font-bold text-purple-700 dark:text-purple-300 mb-2">
                    {systemStats.memoryUsage}%
                  </p>
                  <div className="w-full bg-purple-200 dark:bg-purple-900/30 rounded-full h-2">
                    <div
                      className="h-2 bg-purple-600 rounded-full"
                      style={{ width: `${systemStats.memoryUsage}%` }}
                    />
                  </div>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl p-6 border border-green-200 dark:border-green-800">
                  <div className="flex items-center justify-between mb-4">
                    <Database size={24} className="text-green-600" />
                    <span className="text-sm font-medium text-green-600">Disk</span>
                  </div>
                  <p className="text-3xl font-bold text-green-700 dark:text-green-300 mb-2">
                    {systemStats.diskUsage}%
                  </p>
                  <div className="w-full bg-green-200 dark:bg-green-900/30 rounded-full h-2">
                    <div
                      className="h-2 bg-green-600 rounded-full"
                      style={{ width: `${systemStats.diskUsage}%` }}
                    />
                  </div>
                </div>

                <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-xl p-6 border border-orange-200 dark:border-orange-800">
                  <div className="flex items-center justify-between mb-4">
                    <Clock size={24} className="text-orange-600" />
                    <span className="text-sm font-medium text-orange-600">Uptime</span>
                  </div>
                  <p className="text-lg font-bold text-orange-700 dark:text-orange-300">
                    {systemStats.uptime}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800">
                  <h3 className="font-bold text-lg mb-4">System Performance</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Active Connections</span>
                      <span className="font-bold text-gray-900 dark:text-white">
                        {systemStats.activeConnections.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Requests/min</span>
                      <span className="font-bold text-gray-900 dark:text-white">
                        {systemStats.requestsPerMinute}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Error Rate</span>
                      <span className="font-bold text-green-600">{systemStats.errorRate}%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Avg Response Time</span>
                      <span className="font-bold text-gray-900 dark:text-white">
                        {systemStats.responseTime}ms
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800">
                  <h3 className="font-bold text-lg mb-4">Quick Actions</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={handleClearCache}
                      className="flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg font-medium transition-all"
                    >
                      <RefreshCw size={18} />
                      <span>Clear Cache</span>
                    </button>
                    <button
                      onClick={() => toast.success('System restarted')}
                      className="flex items-center justify-center space-x-2 bg-orange-600 hover:bg-orange-700 text-white px-4 py-3 rounded-lg font-medium transition-all"
                    >
                      <Zap size={18} />
                      <span>Restart</span>
                    </button>
                    <button
                      onClick={() => toast.success('Maintenance mode enabled')}
                      className="flex items-center justify-center space-x-2 bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-3 rounded-lg font-medium transition-all"
                    >
                      <Settings size={18} />
                      <span>Maintenance</span>
                    </button>
                    <button
                      onClick={() => toast.success('Health check completed')}
                      className="flex items-center justify-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg font-medium transition-all"
                    >
                      <Activity size={18} />
                      <span>Health Check</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'database' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl p-6 border border-purple-200 dark:border-purple-800">
                  <Database size={32} className="text-purple-600 mb-4" />
                  <p className="text-3xl font-bold text-purple-700 dark:text-purple-300 mb-1">
                    {databaseStats.totalRecords.toLocaleString()}
                  </p>
                  <p className="text-sm text-purple-600">Total Records</p>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
                  <Server size={32} className="text-blue-600 mb-4" />
                  <p className="text-3xl font-bold text-blue-700 dark:text-blue-300 mb-1">
                    {databaseStats.size}
                  </p>
                  <p className="text-sm text-blue-600">Database Size</p>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl p-6 border border-green-200 dark:border-green-800">
                  <Clock size={32} className="text-green-600 mb-4" />
                  <p className="text-xl font-bold text-green-700 dark:text-green-300 mb-1">
                    {databaseStats.lastBackup}
                  </p>
                  <p className="text-sm text-green-600">Last Backup</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800">
                  <h3 className="font-bold text-lg mb-4">Database Statistics</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-950 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Users size={18} className="text-blue-600" />
                        <span className="text-gray-600 dark:text-gray-400">Users</span>
                      </div>
                      <span className="font-bold text-gray-900 dark:text-white">
                        {databaseStats.users.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-950 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <FileText size={18} className="text-purple-600" />
                        <span className="text-gray-600 dark:text-gray-400">Listings</span>
                      </div>
                      <span className="font-bold text-gray-900 dark:text-white">
                        {databaseStats.listings.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-950 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <BarChart3 size={18} className="text-green-600" />
                        <span className="text-gray-600 dark:text-gray-400">Transactions</span>
                      </div>
                      <span className="font-bold text-gray-900 dark:text-white">
                        {databaseStats.transactions.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800">
                  <h3 className="font-bold text-lg mb-4">Database Operations</h3>
                  <div className="space-y-3">
                    <button
                      onClick={handleDatabaseBackup}
                      className="w-full flex items-center justify-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg font-medium transition-all"
                    >
                      <Download size={18} />
                      <span>Create Backup</span>
                    </button>
                    <button
                      onClick={handleDatabaseRestore}
                      className="w-full flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg font-medium transition-all"
                    >
                      <Upload size={18} />
                      <span>Restore Backup</span>
                    </button>
                    <button
                      onClick={handleExportData}
                      className="w-full flex items-center justify-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-3 rounded-lg font-medium transition-all"
                    >
                      <Download size={18} />
                      <span>Export Data</span>
                    </button>
                    <button
                      onClick={handleImportData}
                      className="w-full flex items-center justify-center space-x-2 bg-orange-600 hover:bg-orange-700 text-white px-4 py-3 rounded-lg font-medium transition-all"
                    >
                      <Upload size={18} />
                      <span>Import Data</span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-xl p-6 border border-yellow-200 dark:border-yellow-800">
                <div className="flex items-start space-x-3">
                  <AlertTriangle size={24} className="text-yellow-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-yellow-900 dark:text-yellow-300 mb-2">
                      Database Maintenance
                    </h3>
                    <p className="text-sm text-yellow-700 dark:text-yellow-400">
                      Regular backups are recommended. Last backup was {databaseStats.lastBackup}.
                      Backup size: {databaseStats.backupSize}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800">
                <h3 className="font-bold text-lg mb-4">Send Notification</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Recipient Type</label>
                    <select className="w-full px-4 py-3 bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-purple-500">
                      <option>All Users</option>
                      <option>Premium Users</option>
                      <option>Basic Users</option>
                      <option>Specific User</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Notification Type</label>
                    <select className="w-full px-4 py-3 bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-purple-500">
                      <option>System Announcement</option>
                      <option>Maintenance Alert</option>
                      <option>Feature Update</option>
                      <option>Promotional</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Title</label>
                    <input
                      type="text"
                      placeholder="Notification title"
                      className="w-full px-4 py-3 bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Message</label>
                    <textarea
                      rows={4}
                      placeholder="Notification message"
                      className="w-full px-4 py-3 bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  <div className="flex items-center space-x-3">
                    <button
                      onClick={handleSendNotification}
                      className="flex-1 flex items-center justify-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl font-semibold transition-all"
                    >
                      <Send size={20} />
                      <span>Send Notification</span>
                    </button>
                    <button className="px-6 py-3 bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 rounded-xl font-semibold transition-all">
                      Preview
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800">
                <h3 className="font-bold text-lg mb-4">Email Campaigns</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button className="flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg font-medium transition-all">
                    <Mail size={18} />
                    <span>Send Newsletter</span>
                  </button>
                  <button className="flex items-center justify-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg font-medium transition-all">
                    <MessageSquare size={18} />
                    <span>SMS Campaign</span>
                  </button>
                  <button className="flex items-center justify-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-3 rounded-lg font-medium transition-all">
                    <Bell size={18} />
                    <span>Push Notifications</span>
                  </button>
                  <button className="flex items-center justify-center space-x-2 bg-orange-600 hover:bg-orange-700 text-white px-4 py-3 rounded-lg font-medium transition-all">
                    <Calendar size={18} />
                    <span>Schedule Campaign</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800">
                  <h3 className="font-bold text-lg mb-4">Access Control</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-950 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Lock size={18} className="text-green-600" />
                        <span className="text-gray-600 dark:text-gray-400">Two-Factor Auth</span>
                      </div>
                      <button className="px-3 py-1 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded-lg text-sm font-medium">
                        Enabled
                      </button>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-950 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Shield size={18} className="text-blue-600" />
                        <span className="text-gray-600 dark:text-gray-400">SSL Certificate</span>
                      </div>
                      <button className="px-3 py-1 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded-lg text-sm font-medium">
                        Valid
                      </button>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-950 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Key size={18} className="text-purple-600" />
                        <span className="text-gray-600 dark:text-gray-400">API Keys</span>
                      </div>
                      <button className="px-3 py-1 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 rounded-lg text-sm font-medium">
                        Manage
                      </button>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800">
                  <h3 className="font-bold text-lg mb-4">Security Actions</h3>
                  <div className="space-y-3">
                    <button className="w-full flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg font-medium transition-all">
                      <Key size={18} />
                      <span>Rotate API Keys</span>
                    </button>
                    <button className="w-full flex items-center justify-center space-x-2 bg-orange-600 hover:bg-orange-700 text-white px-4 py-3 rounded-lg font-medium transition-all">
                      <RefreshCw size={18} />
                      <span>Reset Passwords</span>
                    </button>
                    <button className="w-full flex items-center justify-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-lg font-medium transition-all">
                      <Lock size={18} />
                      <span>Lock All Sessions</span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-6 border border-red-200 dark:border-red-800">
                <div className="flex items-start space-x-3">
                  <AlertTriangle size={24} className="text-red-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-red-900 dark:text-red-300 mb-2">
                      Security Alert
                    </h3>
                    <p className="text-sm text-red-700 dark:text-red-400">
                      No security issues detected. Last security scan: 1 hour ago
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'logs' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="relative flex-1 max-w-md">
                  <Search
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    size={20}
                  />
                  <input
                    type="text"
                    placeholder="Search logs..."
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <select className="px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg text-sm">
                    <option>All Types</option>
                    <option>Errors</option>
                    <option>Warnings</option>
                    <option>Info</option>
                  </select>
                  <button className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-all">
                    <Download size={18} />
                    <span>Export</span>
                  </button>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
                <div className="divide-y divide-gray-200 dark:divide-gray-800">
                  {recentLogs.map((log) => (
                    <div key={log.id} className="p-4 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3 flex-1">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold capitalize ${getLogTypeColor(log.type)}`}>
                            {log.type}
                          </span>
                          <div className="flex-1">
                            <p className="font-medium text-gray-900 dark:text-white mb-1">
                              {log.message}
                            </p>
                            <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                              <span className="flex items-center space-x-1">
                                <Clock size={14} />
                                <span>{log.timestamp}</span>
                              </span>
                              <span className="flex items-center space-x-1">
                                <Terminal size={14} />
                                <span>{log.user}</span>
                              </span>
                            </div>
                          </div>
                        </div>
                        <button className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-all">
                          <Eye size={18} className="text-gray-600 dark:text-gray-400" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {showConfirmModal && confirmAction && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-950 rounded-2xl max-w-md w-full border border-gray-200 dark:border-gray-800 shadow-2xl">
            <div className="p-6">
              <div className="flex items-center justify-center w-16 h-16 bg-orange-100 dark:bg-orange-900/30 rounded-full mx-auto mb-4">
                <AlertTriangle size={32} className="text-orange-600" />
              </div>
              <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-2">
                {confirmAction.title}
              </h2>
              <p className="text-center text-gray-600 dark:text-gray-400 mb-6">
                {confirmAction.message}
              </p>
              <div className="flex items-center space-x-3">
                <button
                  onClick={executeAction}
                  disabled={loading}
                  className="flex-1 bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-xl font-semibold transition-all disabled:opacity-50"
                >
                  {loading ? 'Processing...' : 'Confirm'}
                </button>
                <button
                  onClick={() => setShowConfirmModal(false)}
                  disabled={loading}
                  className="flex-1 bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 px-6 py-3 rounded-xl font-semibold transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
