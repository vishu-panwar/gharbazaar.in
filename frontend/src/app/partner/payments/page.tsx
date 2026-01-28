'use client'

import { useState, useEffect } from 'react'
import {
  CreditCard,
  Download,
  Search,
  Filter,
  Calendar,
  CheckCircle,
  Clock,
  AlertCircle,
  XCircle,
  IndianRupee,
  ExternalLink,
  Eye,
  RefreshCw,
  ArrowUpRight,
  ArrowDownLeft,
  Wallet,
  Building,
  User,
  Phone,
  Mail,
  FileText,
  Receipt,
  Printer,
  Share2,
  Copy,
  TrendingUp,
  BarChart3,
  PieChart,
  Target,
  Award,
  Zap,
  Crown,
  Star,
  Gift,
  Sparkles,
  Shield,
  Globe,
  Activity,
  Plus,
  Minus,
  X,
  Smartphone
} from 'lucide-react'
import toast from 'react-hot-toast'

interface PaymentRecord {
  id: string
  type: 'credit' | 'debit' | 'withdrawal' | 'bonus'
  amount: number
  description: string
  status: 'completed' | 'pending' | 'failed' | 'cancelled'
  date: string
  paymentMethod: string
  transactionId: string
  referenceId?: string
  bankDetails?: {
    accountNumber: string
    ifscCode: string
    bankName: string
  }
  upiDetails?: {
    upiId: string
    appName: string
  }
  relatedEarningId?: string
  processingFee?: number
  netAmount?: number
  notes?: string
}

interface PaymentStats {
  totalReceived: number
  totalWithdrawn: number
  currentBalance: number
  pendingAmount: number
  thisMonthReceived: number
  lastMonthReceived: number
  totalTransactions: number
  successfulTransactions: number
  averagePaymentTime: string
}

interface WithdrawalRequest {
  amount: number
  method: 'bank' | 'upi'
  bankDetails?: {
    accountNumber: string
    ifscCode: string
    bankName: string
    accountHolderName: string
  }
  upiDetails?: {
    upiId: string
  }
}

export default function PaymentHistoryPage() {
  const [user, setUser] = useState<any>(null)
  const [payments, setPayments] = useState<PaymentRecord[]>([])
  const [stats, setStats] = useState<PaymentStats | null>(null)
  const [filteredPayments, setFilteredPayments] = useState<PaymentRecord[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedType, setSelectedType] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [dateRange, setDateRange] = useState('all')
  const [isLoading, setIsLoading] = useState(true)
  const [selectedPayment, setSelectedPayment] = useState<PaymentRecord | null>(null)
  const [showWithdrawalModal, setShowWithdrawalModal] = useState(false)
  const [withdrawalRequest, setWithdrawalRequest] = useState<WithdrawalRequest>({
    amount: 0,
    method: 'bank'
  })

  useEffect(() => {
    // Get user data
    const userData = localStorage.getItem('user')
    if (userData) {
      setUser(JSON.parse(userData))
    }

    // Mock payment data
    const mockPayments: PaymentRecord[] = [
      {
        id: 'PAY001',
        type: 'credit',
        amount: 75000,
        description: 'Commission payment for Priya Patel villa sale',
        status: 'completed',
        date: '2024-12-29T15:45:00Z',
        paymentMethod: 'Bank Transfer',
        transactionId: 'TXN789012345',
        referenceId: 'E001',
        bankDetails: {
          accountNumber: '****1234',
          ifscCode: 'HDFC0001234',
          bankName: 'HDFC Bank'
        },
        relatedEarningId: 'E001',
        processingFee: 0,
        netAmount: 75000,
        notes: 'Premium villa sale commission - 2.5% of ₹30,00,000'
      },
      {
        id: 'PAY002',
        type: 'credit',
        amount: 120000,
        description: 'Commission payment for Rajesh Kumar penthouse sale',
        status: 'completed',
        date: '2024-12-22T10:30:00Z',
        paymentMethod: 'UPI',
        transactionId: 'UPI567890123',
        referenceId: 'E004',
        upiDetails: {
          upiId: 'partner@paytm',
          appName: 'Paytm'
        },
        relatedEarningId: 'E004',
        processingFee: 0,
        netAmount: 120000,
        notes: 'Luxury penthouse commission - 3% of ₹40,00,000'
      },
      {
        id: 'PAY003',
        type: 'credit',
        amount: 45000,
        description: 'Commission payment for Suresh Joshi apartment sale',
        status: 'completed',
        date: '2024-12-12T14:15:00Z',
        paymentMethod: 'Bank Transfer',
        transactionId: 'TXN345678901',
        referenceId: 'E006',
        bankDetails: {
          accountNumber: '****1234',
          ifscCode: 'HDFC0001234',
          bankName: 'HDFC Bank'
        },
        relatedEarningId: 'E006',
        processingFee: 0,
        netAmount: 45000,
        notes: 'Quick apartment sale - 2.25% of ₹20,00,000'
      },
      {
        id: 'PAY004',
        type: 'withdrawal',
        amount: 50000,
        description: 'Withdrawal to bank account',
        status: 'completed',
        date: '2024-12-15T09:20:00Z',
        paymentMethod: 'Bank Transfer',
        transactionId: 'WTH123456789',
        bankDetails: {
          accountNumber: '****1234',
          ifscCode: 'HDFC0001234',
          bankName: 'HDFC Bank'
        },
        processingFee: 25,
        netAmount: 49975,
        notes: 'Personal withdrawal request'
      },
      {
        id: 'PAY005',
        type: 'bonus',
        amount: 5000,
        description: 'Monthly performance bonus',
        status: 'completed',
        date: '2024-12-01T00:00:00Z',
        paymentMethod: 'Direct Credit',
        transactionId: 'BON987654321',
        processingFee: 0,
        netAmount: 5000,
        notes: 'Bonus for achieving 5+ conversions in November'
      },
      {
        id: 'PAY006',
        type: 'credit',
        amount: 25000,
        description: 'Commission payment for Amit Sharma apartment purchase',
        status: 'pending',
        date: '2024-12-27T14:20:00Z',
        paymentMethod: 'Bank Transfer',
        transactionId: 'PEN456789012',
        referenceId: 'E002',
        bankDetails: {
          accountNumber: '****1234',
          ifscCode: 'HDFC0001234',
          bankName: 'HDFC Bank'
        },
        relatedEarningId: 'E002',
        processingFee: 0,
        netAmount: 25000,
        notes: 'Pending approval - documentation verification in progress'
      },
      {
        id: 'PAY007',
        type: 'withdrawal',
        amount: 30000,
        description: 'UPI withdrawal request',
        status: 'failed',
        date: '2024-12-20T16:30:00Z',
        paymentMethod: 'UPI',
        transactionId: 'FAIL789012345',
        upiDetails: {
          upiId: 'partner@paytm',
          appName: 'Paytm'
        },
        processingFee: 15,
        netAmount: 29985,
        notes: 'Failed due to UPI server timeout - amount refunded to wallet'
      }
    ]

    const mockStats: PaymentStats = {
      totalReceived: 270000,
      totalWithdrawn: 50000,
      currentBalance: 235000,
      pendingAmount: 25000,
      thisMonthReceived: 220000,
      lastMonthReceived: 50000,
      totalTransactions: 7,
      successfulTransactions: 5,
      averagePaymentTime: '24 hours'
    }

    setTimeout(() => {
      setPayments(mockPayments)
      setFilteredPayments(mockPayments)
      setStats(mockStats)
      setIsLoading(false)
    }, 1000)
  }, [])

  // Filter payments
  useEffect(() => {
    let filtered = payments.filter(payment => {
      const searchMatch = !searchQuery ||
        payment.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        payment.transactionId.toLowerCase().includes(searchQuery.toLowerCase())

      const typeMatch = selectedType === 'all' || payment.type === selectedType
      const statusMatch = selectedStatus === 'all' || payment.status === selectedStatus

      return searchMatch && typeMatch && statusMatch
    })

    // Sort by date (newest first)
    filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

    setFilteredPayments(filtered)
  }, [payments, searchQuery, selectedType, selectedStatus])

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'credit': return 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400'
      case 'debit': return 'bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400'
      case 'withdrawal': return 'bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
      case 'bonus': return 'bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400'
      default: return 'bg-gray-100 text-gray-600 dark:bg-gray-900/20 dark:text-gray-400'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'credit': return <ArrowDownLeft className="w-4 h-4" />
      case 'debit': return <ArrowUpRight className="w-4 h-4" />
      case 'withdrawal': return <ArrowUpRight className="w-4 h-4" />
      case 'bonus': return <Gift className="w-4 h-4" />
      default: return <IndianRupee className="w-4 h-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400'
      case 'pending': return 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400'
      case 'failed': return 'bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400'
      case 'cancelled': return 'bg-gray-100 text-gray-600 dark:bg-gray-900/20 dark:text-gray-400'
      default: return 'bg-gray-100 text-gray-600 dark:bg-gray-900/20 dark:text-gray-400'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4" />
      case 'pending': return <Clock className="w-4 h-4" />
      case 'failed': return <XCircle className="w-4 h-4" />
      case 'cancelled': return <XCircle className="w-4 h-4" />
      default: return <AlertCircle className="w-4 h-4" />
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const handleWithdrawal = () => {
    // In a real app, this would make an API call
    toast.success('Withdrawal request submitted successfully!')
    setShowWithdrawalModal(false)
    setWithdrawalRequest({ amount: 0, method: 'bank' })
  }

  const copyTransactionId = (transactionId: string) => {
    navigator.clipboard.writeText(transactionId)
    toast.success('Transaction ID copied to clipboard!')
  }

  const downloadReceipt = (payment: PaymentRecord) => {
    // In a real app, this would generate and download a PDF receipt
    toast.success('Receipt downloaded successfully!')
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading payment history...</p>
        </div>
      </div>
    )
  }
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Payment History
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-xl max-w-3xl mx-auto">
          Track all your payments, withdrawals, and manage your wallet balance
        </p>
      </div>

      {/* Wallet Balance Card */}
      <div className="bg-gradient-to-br from-blue-600 to-purple-700 rounded-3xl p-8 text-white shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold mb-2">Wallet Balance</h2>
            <p className="text-blue-100">Available for withdrawal</p>
          </div>
          <div className="p-4 bg-white/20 rounded-2xl">
            <Wallet className="w-10 h-10" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div>
            <p className="text-blue-100 text-sm mb-1">Current Balance</p>
            <p className="text-4xl font-bold">₹{stats?.currentBalance?.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-blue-100 text-sm mb-1">Pending Amount</p>
            <p className="text-2xl font-semibold">₹{stats?.pendingAmount?.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-blue-100 text-sm mb-1">This Month</p>
            <p className="text-2xl font-semibold">₹{stats?.thisMonthReceived?.toLocaleString()}</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => setShowWithdrawalModal(true)}
            className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 bg-white text-blue-600 rounded-xl font-semibold hover:bg-blue-50 transition-all"
          >
            <ArrowUpRight className="w-5 h-5" />
            <span>Withdraw Money</span>
          </button>
          <button className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 bg-white/20 text-white rounded-xl font-semibold hover:bg-white/30 transition-all">
            <Download className="w-5 h-5" />
            <span>Download Statement</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-950 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Received</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">₹{stats?.totalReceived?.toLocaleString()}</p>
              <p className="text-sm text-green-600 dark:text-green-400 mt-1">All time earnings</p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-2xl">
              <TrendingUp className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-950 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Withdrawn</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">₹{stats?.totalWithdrawn?.toLocaleString()}</p>
              <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">Successfully transferred</p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-2xl">
              <ArrowUpRight className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-950 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Success Rate</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {stats ? Math.round((stats.successfulTransactions / stats.totalTransactions) * 100) : 0}%
              </p>
              <p className="text-sm text-purple-600 dark:text-purple-400 mt-1">
                {stats?.successfulTransactions}/{stats?.totalTransactions} transactions
              </p>
            </div>
            <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-2xl">
              <Target className="w-8 h-8 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-950 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg Processing</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats?.averagePaymentTime}</p>
              <p className="text-sm text-orange-600 dark:text-orange-400 mt-1">Payment time</p>
            </div>
            <div className="p-3 bg-orange-100 dark:bg-orange-900/20 rounded-2xl">
              <Clock className="w-8 h-8 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search by description or transaction ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>

        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">All Types</option>
          <option value="credit">Credits</option>
          <option value="debit">Debits</option>
          <option value="withdrawal">Withdrawals</option>
          <option value="bonus">Bonuses</option>
        </select>

        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">All Status</option>
          <option value="completed">Completed</option>
          <option value="pending">Pending</option>
          <option value="failed">Failed</option>
          <option value="cancelled">Cancelled</option>
        </select>

        <button className="flex items-center space-x-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all">
          <Download size={20} />
          <span>Export</span>
        </button>
      </div>

      {/* Payment History List */}
      <div className="bg-white dark:bg-gray-950 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-gray-800">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Transaction History</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Showing {filteredPayments.length} of {payments.length} transactions
          </p>
        </div>

        <div className="divide-y divide-gray-200 dark:divide-gray-800">
          {filteredPayments.map((payment) => (
            <div
              key={payment.id}
              className="p-6 hover:bg-gray-50 dark:hover:bg-gray-900/50 cursor-pointer transition-all"
              onClick={() => setSelectedPayment(payment)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`p-3 rounded-2xl ${getTypeColor(payment.type)}`}>
                    {getTypeIcon(payment.type)}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {payment.description}
                    </h3>
                    <div className="flex items-center space-x-4 mt-1">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {formatDate(payment.date)}
                      </p>
                      <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(payment.status)}`}>
                        {getStatusIcon(payment.status)}
                        <span className="capitalize">{payment.status}</span>
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getTypeColor(payment.type)}`}>
                        {payment.type}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 font-mono">
                      ID: {payment.transactionId}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-2xl font-bold ${payment.type === 'credit' || payment.type === 'bonus'
                      ? 'text-green-600 dark:text-green-400'
                      : 'text-red-600 dark:text-red-400'
                    }`}>
                    {payment.type === 'credit' || payment.type === 'bonus' ? '+' : '-'}₹{payment.amount.toLocaleString()}
                  </p>
                  {payment.processingFee && payment.processingFee > 0 && (
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Fee: ₹{payment.processingFee}
                    </p>
                  )}
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {payment.paymentMethod}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Payment Detail Modal */}
      {selectedPayment && (
        <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-950 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Transaction Details
                </h2>
                <p className="text-gray-600 dark:text-gray-400">ID: {selectedPayment.transactionId}</p>
              </div>
              <button
                onClick={() => setSelectedPayment(null)}
                className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto">
              {/* Status and Amount */}
              <div className="text-center mb-8">
                <span className={`inline-flex items-center space-x-2 px-4 py-2 rounded-xl text-lg font-medium mb-4 ${getStatusColor(selectedPayment.status)}`}>
                  {getStatusIcon(selectedPayment.status)}
                  <span className="capitalize">{selectedPayment.status}</span>
                </span>

                <p className={`text-5xl font-bold mb-2 ${selectedPayment.type === 'credit' || selectedPayment.type === 'bonus'
                    ? 'text-green-600 dark:text-green-400'
                    : 'text-red-600 dark:text-red-400'
                  }`}>
                  {selectedPayment.type === 'credit' || selectedPayment.type === 'bonus' ? '+' : '-'}₹{selectedPayment.amount.toLocaleString()}
                </p>

                <p className="text-gray-600 dark:text-gray-400 text-lg">
                  {selectedPayment.description}
                </p>
              </div>

              {/* Transaction Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Transaction Info</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Date & Time</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {formatDate(selectedPayment.date)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Type</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getTypeColor(selectedPayment.type)}`}>
                        {selectedPayment.type}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Method</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {selectedPayment.paymentMethod}
                      </span>
                    </div>
                    {selectedPayment.referenceId && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Reference</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {selectedPayment.referenceId}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Payment Details</h3>
                  <div className="space-y-3">
                    {selectedPayment.bankDetails && (
                      <>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600 dark:text-gray-400">Bank</span>
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {selectedPayment.bankDetails.bankName}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600 dark:text-gray-400">Account</span>
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {selectedPayment.bankDetails.accountNumber}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600 dark:text-gray-400">IFSC</span>
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {selectedPayment.bankDetails.ifscCode}
                          </span>
                        </div>
                      </>
                    )}
                    {selectedPayment.upiDetails && (
                      <>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600 dark:text-gray-400">UPI ID</span>
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {selectedPayment.upiDetails.upiId}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600 dark:text-gray-400">App</span>
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {selectedPayment.upiDetails.appName}
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Amount Breakdown */}
              {selectedPayment.processingFee && selectedPayment.processingFee > 0 && (
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-4 mb-6">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Amount Breakdown</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Transaction Amount</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        ₹{selectedPayment.amount.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Processing Fee</span>
                      <span className="text-sm font-medium text-red-600 dark:text-red-400">
                        -₹{selectedPayment.processingFee.toLocaleString()}
                      </span>
                    </div>
                    <div className="border-t border-gray-200 dark:border-gray-700 pt-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-gray-900 dark:text-white">Net Amount</span>
                        <span className="text-sm font-bold text-gray-900 dark:text-white">
                          ₹{selectedPayment.netAmount?.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Notes */}
              {selectedPayment.notes && (
                <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-4 mb-6">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Notes</h3>
                  <p className="text-sm text-gray-700 dark:text-gray-300">{selectedPayment.notes}</p>
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => copyTransactionId(selectedPayment.transactionId)}
                  className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all"
                >
                  <Copy className="w-4 h-4" />
                  <span>Copy Transaction ID</span>
                </button>
                <button
                  onClick={() => downloadReceipt(selectedPayment)}
                  className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl transition-all"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Receipt</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Withdrawal Modal */}
      {showWithdrawalModal && (
        <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-950 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-2xl max-w-lg w-full">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Withdraw Money
              </h2>
              <button
                onClick={() => setShowWithdrawalModal(false)}
                className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6">
              <div className="mb-6">
                <p className="text-gray-600 dark:text-gray-400 mb-2">Available Balance</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  ₹{stats?.currentBalance?.toLocaleString()}
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Withdrawal Amount
                  </label>
                  <input
                    type="number"
                    value={withdrawalRequest.amount || ''}
                    onChange={(e) => setWithdrawalRequest(prev => ({ ...prev, amount: Number(e.target.value) }))}
                    placeholder="Enter amount"
                    className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Payment Method
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setWithdrawalRequest(prev => ({ ...prev, method: 'bank' }))}
                      className={`p-4 border-2 rounded-xl transition-all ${withdrawalRequest.method === 'bank'
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-blue-300'
                        }`}
                    >
                      <Building className="w-6 h-6 mx-auto mb-2 text-blue-600 dark:text-blue-400" />
                      <p className="text-sm font-medium">Bank Transfer</p>
                    </button>
                    <button
                      onClick={() => setWithdrawalRequest(prev => ({ ...prev, method: 'upi' }))}
                      className={`p-4 border-2 rounded-xl transition-all ${withdrawalRequest.method === 'upi'
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-blue-300'
                        }`}
                    >
                      <Smartphone className="w-6 h-6 mx-auto mb-2 text-blue-600 dark:text-blue-400" />
                      <p className="text-sm font-medium">UPI</p>
                    </button>
                  </div>
                </div>

                {withdrawalRequest.method === 'bank' && (
                  <div className="space-y-3">
                    <input
                      type="text"
                      placeholder="Account Holder Name"
                      className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                    <input
                      type="text"
                      placeholder="Account Number"
                      className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                    <input
                      type="text"
                      placeholder="IFSC Code"
                      className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                    <input
                      type="text"
                      placeholder="Bank Name"
                      className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>
                )}

                {withdrawalRequest.method === 'upi' && (
                  <input
                    type="text"
                    placeholder="UPI ID (e.g., yourname@paytm)"
                    className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                )}

                <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-xl p-4">
                  <p className="text-sm text-yellow-800 dark:text-yellow-200">
                    <strong>Note:</strong> Withdrawals are processed within 24-48 hours. A processing fee of ₹25 applies for bank transfers and ₹15 for UPI transfers.
                  </p>
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowWithdrawalModal(false)}
                    className="flex-1 px-4 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleWithdrawal}
                    disabled={!withdrawalRequest.amount || withdrawalRequest.amount <= 0}
                    className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-xl transition-all"
                  >
                    Submit Request
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {filteredPayments.length === 0 && (
        <div className="text-center py-12">
          <CreditCard className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            No transactions found
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {searchQuery || selectedType !== 'all' || selectedStatus !== 'all'
              ? 'Try adjusting your search or filters'
              : 'Your payment history will appear here once you start earning commissions'
            }
          </p>
        </div>
      )}
    </div>
  )
}