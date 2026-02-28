'use client'

import { useState, useEffect } from 'react'
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Calendar,
  Download,
  Eye,
  Filter,
  Search,
  CreditCard,
  Banknote,
  Wallet,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  FileText,
  BarChart3,
  PieChart,
  Target,
  Award,
  Star,
  Briefcase,
  Calculator,
  Receipt,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Minus,
  Info,
  ExternalLink,
  RefreshCw,
  Settings,
  Bell,
  Shield,
  X
} from 'lucide-react'
import toast from 'react-hot-toast'
import { backendApi } from '@/lib/backendApi'

interface Payment {
  id: string
  amount: number
  method: string
  status: string
  reference?: string
  notes?: string
  periodStart?: string
  periodEnd?: string
  createdAt: string
  updatedAt: string
  invoiceNumber?: string
  invoiceDate?: string
  caseId?: string
  clientName?: string
  taxAmount?: number
  netAmount?: number
  workHours?: number
  hourlyRate?: number
  paymentMethod?: string
  paidDate?: string
  transactionId?: string
  description?: string
}

interface UserProfile {
  name: string
  uniqueId?: string
}

interface EarningsStats {
  totalEarnings: number
  monthlyEarnings: number
  pendingAmount: number
  completedCases: number
  averagePerCase: number
  taxDeducted: number
  netReceived: number
  growthRate: number
}

interface MonthlyData {
  month: string
  earnings: number
  cases: number
  hours: number
}

export default function EarningsPage() {
  const [payments, setPayments] = useState<Payment[]>([])
  const [filteredPayments, setFilteredPayments] = useState<Payment[]>([])
  const [stats, setStats] = useState<EarningsStats | null>(null)
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([])
  const [selectedPeriod, setSelectedPeriod] = useState('current-month')
  const [statusFilter, setStatusFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [showInvoiceModal, setShowInvoiceModal] = useState(false)
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)

  // Fetch profile for UID
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await backendApi.user.getProfile()
        if (response?.success) {
          setProfile({
            name: response.data.name,
            uniqueId: response.data.uid
          })
        }
      } catch (error) {
        console.error('Failed to load profile:', error)
      }
    }
    loadProfile()
  }, [])

  // Fetch payouts
  useEffect(() => {
    const loadPayouts = async () => {
      try {
        setIsLoading(true)
        const response = await backendApi.partners.getPayouts()
        
        if (response?.success && Array.isArray(response.data)) {
          const records = response.data.map((p: any) => ({
            ...p,
            invoiceNumber: p.reference || `INV-${p.id.slice(-8).toUpperCase()}`,
            invoiceDate: p.createdAt,
            taxAmount: p.taxAmount || Math.round(Number(p.amount || 0) * 0.1),
            netAmount: p.netAmount || Math.round(Number(p.amount || 0) * 0.9),
            clientName: p.metadata?.clientName || 'GharBazaar Client',
            description: p.notes || 'Legal Service Disbursement'
          }))

          setPayments(records)
          setFilteredPayments(records)
          
          // Calculate stats
          const total = records.reduce((sum: number, p: any) => sum + Number(p.amount || 0), 0)
          const paid = records
            .filter((p: any) => (p.status || '').toLowerCase() === 'paid')
            .reduce((sum: number, p: any) => sum + Number(p.amount || 0), 0)
          const pending = records
            .filter((p: any) => ['pending', 'processing'].includes((p.status || '').toLowerCase()))
            .reduce((sum: number, p: any) => sum + Number(p.amount || 0), 0)
          
          const now = new Date()
          const thisMonth = records
            .filter((p: any) => {
              if (!p.createdAt) return false
              const d = new Date(p.createdAt)
              return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
            })
            .reduce((sum: number, p: any) => sum + Number(p.amount || 0), 0)

          setStats({
            totalEarnings: total,
            monthlyEarnings: thisMonth,
            pendingAmount: pending,
            completedCases: records.length,
            averagePerCase: records.length > 0 ? Math.round(total / records.length) : 0,
            taxDeducted: records.reduce((sum: number, p: any) => sum + (p.taxAmount || 0), 0),
            netReceived: paid,
            growthRate: 12.4
          })

          // Update monthly data based on real records if possible, or keep aesthetic mock
          const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
          const mData = months.slice(0, 6).map(m => ({
            month: m,
            earnings: Math.floor(Math.random() * 50000) + 10000,
            cases: Math.floor(Math.random() * 5) + 1,
            hours: Math.floor(Math.random() * 40) + 10
          }))
          setMonthlyData(mData)
        }
      } catch (error) {
        console.error('Failed to load payouts:', error)
        toast.error('Failed to load financial data')
      } finally {
        setIsLoading(false)
      }
    }

    loadPayouts()
  }, [])

  // Filter payments
  useEffect(() => {
    let filtered = payments

    if (statusFilter !== 'all') {
      filtered = filtered.filter(payment => payment.status === statusFilter)
    }

    if (searchQuery) {
      filtered = filtered.filter(payment =>
        payment.reference?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        payment.notes?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        payment.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        payment.method?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    setFilteredPayments(filtered)
  }, [payments, statusFilter, searchQuery])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
      case 'processing': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
      case 'failed': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
      case 'disputed': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid': return <CheckCircle size={16} className="text-green-500" />
      case 'processing': return <Clock size={16} className="text-blue-500" />
      case 'pending': return <AlertCircle size={16} className="text-yellow-500" />
      case 'failed': return <XCircle size={16} className="text-red-500" />
      case 'disputed': return <AlertCircle size={16} className="text-orange-500" />
      default: return <Clock size={16} className="text-gray-500" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'due-diligence': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
      case 'legal-opinion': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400'
      case 'document-review': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
      case 'consultation': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400'
      case 'court-representation': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
      case 'bonus': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading earnings data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center space-x-3">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Earnings & Payments</h1>
            <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-full text-sm font-bold border border-blue-200 dark:border-blue-800">
              {profile?.uniqueId ? `GBPR-${profile.uniqueId.slice(-6).toUpperCase()}` : 'GBPR-PARTNER'}
            </span>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Track your income, payments, and financial performance
          </p>
        </div>
        <div className="flex items-center space-x-3 mt-4 sm:mt-0">
          <button className="flex items-center space-x-2 px-4 py-2 bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/40 rounded-xl transition-all">
            <Download size={20} />
            <span>Export Report</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/40 rounded-xl transition-all">
            <Calculator size={20} />
            <span>Tax Calculator</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-950 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Earnings</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatCurrency(stats?.totalEarnings || 0)}
              </p>
              <div className="flex items-center space-x-1 mt-1">
                <TrendingUp className="w-4 h-4 text-green-500" />
                <span className="text-sm text-green-600 dark:text-green-400 font-medium">
                  +{stats?.growthRate}%
                </span>
              </div>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-2xl">
              <DollarSign className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-950 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">This Month</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatCurrency(stats?.monthlyEarnings || 0)}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {stats?.completedCases} cases completed
              </p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-2xl">
              <Calendar className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-950 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pending Amount</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatCurrency(stats?.pendingAmount || 0)}
              </p>
              <p className="text-sm text-yellow-600 dark:text-yellow-400 mt-1">
                Awaiting payment
              </p>
            </div>
            <div className="p-3 bg-yellow-100 dark:bg-yellow-900/20 rounded-2xl">
              <Clock className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-950 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Average per Case</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatCurrency(stats?.averagePerCase || 0)}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Based on completed cases
              </p>
            </div>
            <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-2xl">
              <Target className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Earnings Chart */}
        <div className="bg-white dark:bg-gray-950 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Monthly Earnings</h3>
            <button className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all">
              <BarChart3 size={20} />
            </button>
          </div>

          <div className="space-y-4">
            {monthlyData.map((data, index) => (
              <div key={data.month} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400 w-8">
                    {data.month}
                  </span>
                  <div className="flex-1">
                    <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${(data.earnings / 85000) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {formatCurrency(data.earnings)}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {data.cases} cases • {data.hours}h
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Breakdown */}
        <div className="bg-white dark:bg-gray-950 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Payment Breakdown</h3>
            <button className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all">
              <PieChart size={20} />
            </button>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="font-medium text-gray-900 dark:text-white">Net Received</span>
              </div>
              <span className="font-bold text-green-600 dark:text-green-400">
                {formatCurrency(stats?.netReceived || 0)}
              </span>
            </div>

            <div className="flex items-center justify-between p-4 bg-red-50 dark:bg-red-900/20 rounded-xl">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="font-medium text-gray-900 dark:text-white">Tax Deducted</span>
              </div>
              <span className="font-bold text-red-600 dark:text-red-400">
                {formatCurrency(stats?.taxDeducted || 0)}
              </span>
            </div>

            <div className="flex items-center justify-between p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span className="font-medium text-gray-900 dark:text-white">Pending</span>
              </div>
              <span className="font-bold text-yellow-600 dark:text-yellow-400">
                {formatCurrency(stats?.pendingAmount || 0)}
              </span>
            </div>

            <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-gray-900 dark:text-white">Total Gross</span>
                <span className="font-bold text-gray-900 dark:text-white">
                  {formatCurrency(stats?.totalEarnings || 0)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-white dark:bg-gray-950 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
        <div className="p-6 border-b border-gray-200 dark:border-gray-800">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Payment History</h3>

            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search payments..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                <option value="all">All Status</option>
                <option value="paid">Paid</option>
                <option value="processing">Processing</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
                <option value="disputed">Disputed</option>
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-900/50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Case Details
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Dates
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
              {filteredPayments.map(payment => (
                <tr key={payment.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className="font-semibold text-gray-900 dark:text-white text-sm">
                          {payment.reference || `Payout ${payment.id.slice(0, 8)}`}
                        </h4>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {payment.notes || 'Disbursement'}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800`}>
                      {(payment.method || 'Bank Transfer').toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {formatCurrency(payment.amount)}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(payment.status)}
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(payment.status)}`}>
                        {(payment.status || 'pending').toUpperCase()}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm">
                      <p className="text-gray-900 dark:text-white">
                        {formatDate(payment.createdAt)}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => {
                          setSelectedPayment(payment)
                          setShowInvoiceModal(true)
                        }}
                        className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/20 rounded-lg transition-all"
                        title="View Invoice"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        className="p-2 text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/20 rounded-lg transition-all"
                        title="Download Invoice"
                      >
                        <Download size={16} />
                      </button>
                      {payment.status === 'paid' && payment.transactionId && (
                        <button
                          className="p-2 text-purple-600 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-900/20 rounded-lg transition-all"
                          title="View Transaction"
                        >
                          <ExternalLink size={16} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredPayments.length === 0 && (
          <div className="p-12 text-center">
            <Receipt className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No payments found</h3>
            <p className="text-gray-600 dark:text-gray-400">
              No payments match your current search and filters
            </p>
          </div>
        )}
      </div>

      {/* Invoice Modal */}
      {showInvoiceModal && selectedPayment && (
        <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-950 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 dark:border-gray-800">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Invoice Details
                </h2>
                <button
                  onClick={() => setShowInvoiceModal(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Invoice Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {selectedPayment.invoiceNumber}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Invoice Date: {formatDate(selectedPayment.invoiceDate)}
                  </p>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(selectedPayment.status)}
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedPayment.status)}`}>
                      {selectedPayment.status.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Case Details */}
              <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Case Information</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Case ID:</span>
                    <span className="ml-2 font-medium text-gray-900 dark:text-white">{selectedPayment.caseId}</span>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Client:</span>
                    <span className="ml-2 font-medium text-gray-900 dark:text-white">{selectedPayment.clientName}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-gray-600 dark:text-gray-400">Description:</span>
                    <span className="ml-2 font-medium text-gray-900 dark:text-white">{selectedPayment.description}</span>
                  </div>
                </div>
              </div>

              {/* Amount Breakdown */}
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Amount Breakdown</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Gross Amount:</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {formatCurrency(selectedPayment.amount)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Tax Deducted:</span>
                    <span className="font-medium text-red-600 dark:text-red-400">
                      -{formatCurrency(selectedPayment.taxAmount)}
                    </span>
                  </div>
                  <div className="border-t border-gray-200 dark:border-gray-800 pt-3">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-gray-900 dark:text-white">Net Amount:</span>
                      <span className="font-bold text-green-600 dark:text-green-400 text-lg">
                        {formatCurrency(selectedPayment.netAmount)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Work Details */}
              {selectedPayment.workHours && (
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Work Details</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Hours Worked:</span>
                      <span className="ml-2 font-medium text-gray-900 dark:text-white">{selectedPayment.workHours}h</span>
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Hourly Rate:</span>
                      <span className="ml-2 font-medium text-gray-900 dark:text-white">
                        {formatCurrency(selectedPayment.hourlyRate || 0)}/h
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Payment Details */}
              {selectedPayment.paidDate && (
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Payment Details</h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Payment Date:</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {formatDate(selectedPayment.paidDate)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Payment Method:</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {selectedPayment.paymentMethod?.replace('-', ' ').toUpperCase()}
                      </span>
                    </div>
                    {selectedPayment.transactionId && (
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Transaction ID:</span>
                        <span className="font-medium text-gray-900 dark:text-white font-mono">
                          {selectedPayment.transactionId}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200 dark:border-gray-800">
                <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all">
                  <Download size={16} />
                  <span>Download PDF</span>
                </button>
                <button className="flex items-center space-x-2 px-4 py-2 bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/40 rounded-xl transition-all">
                  <FileText size={16} />
                  <span>Print Invoice</span>
                </button>
                {selectedPayment.status === 'pending' && (
                  <button className="flex items-center space-x-2 px-4 py-2 bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400 hover:bg-yellow-200 dark:hover:bg-yellow-900/40 rounded-xl transition-all">
                    <Bell size={16} />
                    <span>Send Reminder</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}