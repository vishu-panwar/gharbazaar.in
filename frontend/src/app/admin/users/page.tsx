'use client'

import { useState } from 'react'
import { 
  Users, 
  Search, 
  Filter, 
  Eye, 
  Ban, 
  CheckCircle,
  XCircle,
  RefreshCw,
  Trash2,
  Mail,
  Phone,
  MapPin,
  Calendar,
  CreditCard,
  FileText,
  AlertTriangle,
  Download,
  Edit
} from 'lucide-react'
import toast from 'react-hot-toast'

export default function UserManagementPage() {
  const [filter, setFilter] = useState('all')
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const [showModal, setShowModal] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const users = [
    {
      id: 1,
      userId: 'USR001',
      name: 'Rajesh Kumar',
      email: 'rajesh@example.com',
      phone: '+91 98765 43210',
      status: 'active',
      kycStatus: 'approved',
      subscription: 'Premium',
      registeredDate: '2024-01-15',
      lastActive: '2 hours ago',
      totalListings: 3,
      totalBids: 12,
      totalSpent: 15000,
      fraudScore: 0.95,
      location: 'Mumbai, Maharashtra',
      avatar: 'RK'
    },
    {
      id: 2,
      userId: 'USR002',
      name: 'Priya Sharma',
      email: 'priya@example.com',
      phone: '+91 98765 43211',
      status: 'active',
      kycStatus: 'pending',
      subscription: 'Basic',
      registeredDate: '2024-01-18',
      lastActive: '1 day ago',
      totalListings: 1,
      totalBids: 5,
      totalSpent: 1000,
      fraudScore: 0.88,
      location: 'Delhi, Delhi',
      avatar: 'PS'
    },
    {
      id: 3,
      userId: 'USR003',
      name: 'Amit Patel',
      email: 'amit@example.com',
      phone: '+91 98765 43212',
      status: 'blocked',
      kycStatus: 'rejected',
      subscription: 'None',
      registeredDate: '2024-01-10',
      lastActive: '1 week ago',
      totalListings: 0,
      totalBids: 2,
      totalSpent: 0,
      fraudScore: 0.45,
      location: 'Bangalore, Karnataka',
      avatar: 'AP'
    },
  ]

  const stats = {
    total: 10234,
    active: 8956,
    blocked: 45,
    pendingKYC: 123
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
      case 'blocked':
        return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
      case 'inactive':
        return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
    }
  }

  const getKYCStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
      case 'pending':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
      case 'rejected':
        return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
    }
  }

  const handleBlockUser = (userId: string) => {
    toast.success('User blocked successfully')
    setShowModal(false)
  }

  const handleUnblockUser = (userId: string) => {
    toast.success('User unblocked successfully')
    setShowModal(false)
  }

  const handleResetPassword = (userId: string) => {
    toast.success('Password reset email sent')
  }

  const handleDeleteUser = (userId: string) => {
    toast.error('User deleted')
    setShowModal(false)
  }

  const filteredUsers = users.filter(user => {
    const matchesFilter = filter === 'all' || user.status === filter || user.kycStatus === filter
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.userId.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesFilter && matchesSearch
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">User Management</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage all platform users
          </p>
        </div>
        <button className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-lg">
          <Download size={20} />
          <span>Export Users</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <Users size={32} className="opacity-80" />
            <div className="text-right">
              <p className="text-3xl font-bold">{stats.total.toLocaleString()}</p>
              <p className="text-sm opacity-80">Total Users</p>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <CheckCircle size={32} className="opacity-80" />
            <div className="text-right">
              <p className="text-3xl font-bold">{stats.active.toLocaleString()}</p>
              <p className="text-sm opacity-80">Active Users</p>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <Ban size={32} className="opacity-80" />
            <div className="text-right">
              <p className="text-3xl font-bold">{stats.blocked}</p>
              <p className="text-sm opacity-80">Blocked Users</p>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <FileText size={32} className="opacity-80" />
            <div className="text-right">
              <p className="text-3xl font-bold">{stats.pendingKYC}</p>
              <p className="text-sm opacity-80">Pending KYC</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-950 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by name, email, or ID..."
              className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex items-center space-x-2 overflow-x-auto">
            {['all', 'active', 'blocked', 'pending', 'approved', 'rejected'].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`
                  px-4 py-2 rounded-lg text-sm font-medium transition-all capitalize whitespace-nowrap
                  ${filter === status 
                    ? 'bg-purple-600 text-white shadow-lg' 
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }
                `}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white dark:bg-gray-950 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">User</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">KYC</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Subscription</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Activity</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                        {user.avatar}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">{user.name}</p>
                        <p className="text-xs text-gray-500">{user.userId}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center space-x-1">
                        <Mail size={14} />
                        <span>{user.email}</span>
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center space-x-1">
                        <Phone size={14} />
                        <span>{user.phone}</span>
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold capitalize ${getStatusColor(user.status)}`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold capitalize ${getKYCStatusColor(user.kycStatus)}`}>
                      {user.kycStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <CreditCard size={16} className="text-purple-600" />
                      <span className="text-sm font-medium text-gray-900 dark:text-white">{user.subscription}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <p className="text-sm text-gray-600 dark:text-gray-400">{user.lastActive}</p>
                      <p className="text-xs text-gray-500">{user.totalListings} listings • {user.totalBids} bids</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => {
                        setSelectedUser(user)
                        setShowModal(true)
                      }}
                      className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-all text-sm"
                    >
                      <Eye size={16} />
                      <span>View</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Detail Modal */}
      {showModal && selectedUser && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-950 rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto border border-gray-200 dark:border-gray-800 shadow-2xl">
            {/* Modal Header */}
            <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-pink-600 p-6 z-10">
              <div className="flex items-center justify-between text-white">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-2xl font-bold">
                    {selectedUser.avatar}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">{selectedUser.name}</h2>
                    <p className="text-purple-100">{selectedUser.userId}</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 hover:bg-white/20 rounded-lg transition-all"
                >
                  <XCircle size={24} />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Quick Stats */}
              <div className="grid grid-cols-4 gap-4">
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
                  <p className="text-sm text-blue-600 dark:text-blue-400 mb-1">Listings</p>
                  <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">{selectedUser.totalListings}</p>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4 border border-green-200 dark:border-green-800">
                  <p className="text-sm text-green-600 dark:text-green-400 mb-1">Bids</p>
                  <p className="text-2xl font-bold text-green-700 dark:text-green-300">{selectedUser.totalBids}</p>
                </div>
                <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4 border border-purple-200 dark:border-purple-800">
                  <p className="text-sm text-purple-600 dark:text-purple-400 mb-1">Total Spent</p>
                  <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">₹{selectedUser.totalSpent.toLocaleString()}</p>
                </div>
                <div className="bg-orange-50 dark:bg-orange-900/20 rounded-xl p-4 border border-orange-200 dark:border-orange-800">
                  <p className="text-sm text-orange-600 dark:text-orange-400 mb-1">Fraud Score</p>
                  <p className="text-2xl font-bold text-orange-700 dark:text-orange-300">{(selectedUser.fraudScore * 100).toFixed(0)}%</p>
                </div>
              </div>

              {/* User Information */}
              <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800">
                <h3 className="font-bold text-lg mb-4 text-gray-900 dark:text-white">User Information</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Email</p>
                    <p className="font-semibold text-gray-900 dark:text-white">{selectedUser.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Phone</p>
                    <p className="font-semibold text-gray-900 dark:text-white">{selectedUser.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Location</p>
                    <p className="font-semibold text-gray-900 dark:text-white">{selectedUser.location}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Registered</p>
                    <p className="font-semibold text-gray-900 dark:text-white">{selectedUser.registeredDate}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Status</p>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold capitalize ${getStatusColor(selectedUser.status)}`}>
                      {selectedUser.status}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">KYC Status</p>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold capitalize ${getKYCStatusColor(selectedUser.kycStatus)}`}>
                      {selectedUser.kycStatus}
                    </span>
                  </div>
                </div>
              </div>

              {/* Admin Notes */}
              <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-xl p-6 border border-yellow-200 dark:border-yellow-800">
                <h3 className="font-bold text-lg mb-4 text-gray-900 dark:text-white">Admin Notes</h3>
                <textarea
                  rows={4}
                  className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 resize-none"
                  placeholder="Add notes about this user..."
                />
              </div>

              {/* Actions */}
              <div className="flex items-center space-x-3 pt-6 border-t border-gray-200 dark:border-gray-800">
                {selectedUser.status === 'active' ? (
                  <button
                    onClick={() => handleBlockUser(selectedUser.userId)}
                    className="flex-1 flex items-center justify-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-semibold transition-all"
                  >
                    <Ban size={20} />
                    <span>Block User</span>
                  </button>
                ) : (
                  <button
                    onClick={() => handleUnblockUser(selectedUser.userId)}
                    className="flex-1 flex items-center justify-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-semibold transition-all"
                  >
                    <CheckCircle size={20} />
                    <span>Unblock User</span>
                  </button>
                )}
                <button
                  onClick={() => handleResetPassword(selectedUser.userId)}
                  className="flex-1 flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-all"
                >
                  <RefreshCw size={20} />
                  <span>Reset Password</span>
                </button>
                <button
                  onClick={() => handleDeleteUser(selectedUser.userId)}
                  className="flex items-center justify-center space-x-2 bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-xl font-semibold transition-all"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
