'use client'

import { useState } from 'react'
import {
  DollarSign,
  Search,
  Filter,
  Download,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
  TrendingDown,
  CreditCard,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  User,
  FileText,
  AlertCircle,
  RefreshCw,
} from 'lucide-react'
import toast from 'react-hot-toast'

export default function PaymentManagementPage() {
  const [filter, setFilter] = useState('all')
  const [selectedPayment, setSelectedPayment] = useState<any>(null)
  const [showModal, setShowModal] = useState(false)
  const [dateRange, setDateRange] = useState('7days')

  const payments = [
    {
      id: 1,
      transactionId: 'TXN001234567',
      userId: 'USR001',
      userName: 'Rajesh Kumar',
      type: 'subscription',
      plan: 'Premium',
      amount: 2999,
      status: 'completed',
      method: 'UPI',
      date: '2024-01-20 14:30',
      description: 'Premium Plan - Monthly',
      gateway: 'Razorpay',
      gatewayTxnId: 'pay_MHgPx7Qx8Zy9Kl',
    },
    {
      id: 2,
      transactionId: 'TXN001234568',
      userId: 'USR002',
      userName: 'Priya Sharma',
      type: 'listing_fee',
      plan: null,
      amount: 499,
      status: 'completed',
      method: 'Credit Card',
      date: '2024-01-20 13:15',
      description: 'Property Listing Fee',
      gateway: 'Razorpay',
      gatewayTxnId: 'pay_MHgPx7Qx8Zy9Km',
    },
    {
      id: 3,
      transactionId: 'TXN001234569',
      userId: 'USR003',
      userName: 'Amit Patel',
      type: 'subscription',
      plan: 'Basic',
      amount: 999,
      status: 'pending',
      method: 'Net Banking',
      date: '2024-01-20 12:45',
      description: 'Basic Plan - Monthly',
      gateway: 'Razorpay',
      gatewayTxnId: 'pay_MHgPx7Qx8Zy9Kn',
    },
    {
      id: 4,
      transactionId: 'TXN001234570',
      userId: 'USR004',
      userName: 'Sneha Reddy',
      type: 'refund',
      plan: null,
      amount: -2999,
      status: 'completed',
      method: 'UPI',
      date: '2024-01-20 11:20',
      description: 'Refund - Premium Plan',
      gateway: 'Razorpay',
      gatewayTxnId: 'rfnd_MHgPx7Qx8Zy9Ko',
    },
    {
      id: 5,
      transactionId: 'TXN001234571',
      userId: 'USR005',
      userName: 'Vikram Singh',
      type: 'subscription',
      plan: 'Enterprise',
      amount: 9999,
      status: 'failed',
      method: 'Credit Card',
      date: '2024-01-20 10:00',
      description: 'Enterprise Plan - Monthly',
      gateway: 'Razorpay',
      gatewayTxnId: 'pay_MHgPx7Qx8Zy9Kp',
    },
  ]

  const stats = {
    totalRevenue: 2456789,
    todayRevenue: 45678,
    pendingPayments: 12,
    failedPayments: 8,
    revenueGrowth: 12.5,
    transactionCount: 1234,
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
      case 'pending':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
      case 'failed':
        return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'subscription':
        return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
      case 'listing_fee':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
      case 'refund':
        return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
    }
  }

  const formatAmount = (amount: number) => {
    const absAmount = Math.abs(amount)
    return `₹${absAmount.toLocaleString('en-IN')}`
  }

  const handleViewDetails = (payment: any) => {
    setSelectedPayment(payment)
    setShowModal(true)
  }

  const handleRefund = (id: number) => {
    toast.success('Refund initiated successfully')
  }

  const handleRetry = (id: number) => {
    toast.success('Payment retry initiated')
  }

  const handleExport = () => {
    toast.success('Exporting payment data...')
  }

  const filteredPayments = payments.filter((payment) =>
    filter === 'all' ? true : payment.status === filter
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Payment Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Track and manage all transactions
          </p>
        </div>
        <button
          onClick={handleExport}
          className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-lg"
        >
          <Download size={20} />
          <span>Export Data</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/20 rounded-xl">
              <DollarSign size={24} />
            </div>
            <div className="flex items-center space-x-1 text-sm bg-white/20 px-3 py-1 rounded-full">
              <TrendingUp size={16} />
              <span>{stats.revenueGrowth}%</span>
            </div>
          </div>
          <p className="text-3xl font-bold mb-1">
            ₹{(stats.totalRevenue / 100000).toFixed(2)}L
          </p>
          <p className="text-sm opacity-80">Total Revenue</p>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/20 rounded-xl">
              <ArrowUpRight size={24} />
            </div>
          </div>
          <p className="text-3xl font-bold mb-1">
            ₹{(stats.todayRevenue / 1000).toFixed(1)}K
          </p>
          <p className="text-sm opacity-80">Today's Revenue</p>
        </div>

        <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/20 rounded-xl">
              <Clock size={24} />
            </div>
          </div>
          <p className="text-3xl font-bold mb-1">{stats.pendingPayments}</p>
          <p className="text-sm opacity-80">Pending Payments</p>
        </div>

        <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/20 rounded-xl">
              <XCircle size={24} />
            </div>
          </div>
          <p className="text-3xl font-bold mb-1">{stats.failedPayments}</p>
          <p className="text-sm opacity-80">Failed Payments</p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-950 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Search by transaction ID, user, or amount..."
              className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div className="flex items-center space-x-2">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm"
            >
              <option value="today">Today</option>
              <option value="7days">Last 7 Days</option>
              <option value="30days">Last 30 Days</option>
              <option value="90days">Last 90 Days</option>
              <option value="custom">Custom Range</option>
            </select>

            {['all', 'completed', 'pending', 'failed'].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all capitalize ${
                  filter === status
                    ? 'bg-purple-600 text-white shadow-lg'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-950 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  Transaction
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  Method
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
              {filteredPayments.map((payment) => (
                <tr
                  key={payment.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {payment.transactionId}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {payment.description}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {payment.userName.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {payment.userName}
                        </p>
                        <p className="text-sm text-gray-500">{payment.userId}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold capitalize ${getTypeColor(
                        payment.type
                      )}`}
                    >
                      {payment.type.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-1">
                      {payment.amount < 0 ? (
                        <ArrowDownRight size={16} className="text-red-500" />
                      ) : (
                        <ArrowUpRight size={16} className="text-green-500" />
                      )}
                      <span
                        className={`font-bold ${
                          payment.amount < 0 ? 'text-red-600' : 'text-green-600'
                        }`}
                      >
                        {formatAmount(payment.amount)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <CreditCard size={16} className="text-gray-400" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {payment.method}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold capitalize ${getStatusColor(
                        payment.status
                      )}`}
                    >
                      {payment.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {payment.date}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleViewDetails(payment)}
                        className="p-2 hover:bg-purple-100 dark:hover:bg-purple-900/30 rounded-lg transition-all"
                        title="View Details"
                      >
                        <Eye size={18} className="text-purple-600" />
                      </button>
                      {payment.status === 'completed' && payment.type !== 'refund' && (
                        <button
                          onClick={() => handleRefund(payment.id)}
                          className="p-2 hover:bg-orange-100 dark:hover:bg-orange-900/30 rounded-lg transition-all"
                          title="Initiate Refund"
                        >
                          <RefreshCw size={18} className="text-orange-600" />
                        </button>
                      )}
                      {payment.status === 'failed' && (
                        <button
                          onClick={() => handleRetry(payment.id)}
                          className="p-2 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-all"
                          title="Retry Payment"
                        >
                          <RefreshCw size={18} className="text-blue-600" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && selectedPayment && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-950 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-gray-200 dark:border-gray-800 shadow-2xl">
            <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-pink-600 p-6 z-10">
              <div className="flex items-center justify-between text-white">
                <div>
                  <h2 className="text-2xl font-bold">Payment Details</h2>
                  <p className="text-purple-100">{selectedPayment.transactionId}</p>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 hover:bg-white/20 rounded-lg transition-all"
                >
                  <XCircle size={24} />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="col-span-2 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-6 border border-purple-200 dark:border-purple-800">
                  <p className="text-sm text-purple-600 dark:text-purple-400 mb-2">
                    Transaction Amount
                  </p>
                  <p className="text-4xl font-bold text-purple-700 dark:text-purple-300">
                    {formatAmount(selectedPayment.amount)}
                  </p>
                  <div className="flex items-center space-x-2 mt-2">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(
                        selectedPayment.status
                      )}`}
                    >
                      {selectedPayment.status}
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${getTypeColor(
                        selectedPayment.type
                      )}`}
                    >
                      {selectedPayment.type.replace('_', ' ')}
                    </span>
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4 border border-gray-200 dark:border-gray-800">
                  <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 mb-2">
                    <User size={18} />
                    <p className="text-sm font-medium">Customer</p>
                  </div>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {selectedPayment.userName}
                  </p>
                  <p className="text-sm text-gray-500">{selectedPayment.userId}</p>
                </div>

                <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4 border border-gray-200 dark:border-gray-800">
                  <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 mb-2">
                    <Calendar size={18} />
                    <p className="text-sm font-medium">Date & Time</p>
                  </div>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {selectedPayment.date}
                  </p>
                </div>

                <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4 border border-gray-200 dark:border-gray-800">
                  <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 mb-2">
                    <CreditCard size={18} />
                    <p className="text-sm font-medium">Payment Method</p>
                  </div>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {selectedPayment.method}
                  </p>
                </div>

                <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4 border border-gray-200 dark:border-gray-800">
                  <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 mb-2">
                    <Wallet size={18} />
                    <p className="text-sm font-medium">Payment Gateway</p>
                  </div>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {selectedPayment.gateway}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {selectedPayment.gatewayTxnId}
                  </p>
                </div>

                {selectedPayment.plan && (
                  <div className="col-span-2 bg-gray-50 dark:bg-gray-900 rounded-xl p-4 border border-gray-200 dark:border-gray-800">
                    <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 mb-2">
                      <FileText size={18} />
                      <p className="text-sm font-medium">Plan Details</p>
                    </div>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {selectedPayment.plan} Plan
                    </p>
                    <p className="text-sm text-gray-500">{selectedPayment.description}</p>
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-3 pt-6 border-t border-gray-200 dark:border-gray-800">
                {selectedPayment.status === 'completed' &&
                  selectedPayment.type !== 'refund' && (
                    <button
                      onClick={() => {
                        handleRefund(selectedPayment.id)
                        setShowModal(false)
                      }}
                      className="flex-1 flex items-center justify-center space-x-2 bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-xl font-semibold transition-all"
                    >
                      <RefreshCw size={20} />
                      <span>Initiate Refund</span>
                    </button>
                  )}
                {selectedPayment.status === 'failed' && (
                  <button
                    onClick={() => {
                      handleRetry(selectedPayment.id)
                      setShowModal(false)
                    }}
                    className="flex-1 flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-all"
                  >
                    <RefreshCw size={20} />
                    <span>Retry Payment</span>
                  </button>
                )}
                <button
                  onClick={handleExport}
                  className="flex items-center justify-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl font-semibold transition-all"
                >
                  <Download size={20} />
                  <span>Download Receipt</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
