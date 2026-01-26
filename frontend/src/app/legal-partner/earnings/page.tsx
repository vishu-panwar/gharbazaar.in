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

interface Payment {
  id: string
  caseId: string
  caseName: string
  clientName: string
  amount: number
  type: 'due-diligence' | 'legal-opinion' | 'document-review' | 'consultation' | 'court-representation' | 'bonus'
  status: 'pending' | 'processing' | 'paid' | 'failed' | 'disputed'
  invoiceDate: string
  dueDate: string
  paidDate?: string
  paymentMethod?: 'bank-transfer' | 'upi' | 'cheque' | 'cash'
  transactionId?: string
  invoiceNumber: string
  taxAmount: number
  netAmount: number
  description: string
  workHours?: number
  hourlyRate?: number
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

  // Mock data
  useEffect(() => {
    const mockPayments: Payment[] = [
      {
        id: 'PAY001',
        caseId: 'LC001',
        caseName: 'Luxury Apartment - Worli',
        clientName: 'Mr. Arjun Mehta',
        amount: 25000,
        type: 'due-diligence',
        status: 'paid',
        invoiceDate: '2024-12-30T00:00:00Z',
        dueDate: '2025-01-05T00:00:00Z',
        paidDate: '2024-12-31T14:30:00Z',
        paymentMethod: 'bank-transfer',
        transactionId: 'TXN001234567',
        invoiceNumber: 'INV-2024-001',
        taxAmount: 4500,
        netAmount: 20500,
        description: 'Legal due diligence for property verification',
        workHours: 12,
        hourlyRate: 2083
      },
      {
        id: 'PAY002',
        caseId: 'LC002',
        caseName: 'Commercial Complex - Andheri',
        clientName: 'Prestige Constructions',
        amount: 35000,
        type: 'legal-opinion',
        status: 'processing',
        invoiceDate: '2024-12-28T00:00:00Z',
        dueDate: '2025-01-02T00:00:00Z',
        paymentMethod: 'bank-transfer',
        invoiceNumber: 'INV-2024-002',
        taxAmount: 6300,
        netAmount: 28700,
        description: 'Comprehensive legal opinion and compliance review',
        workHours: 18,
        hourlyRate: 1944
      },
      {
        id: 'PAY003',
        caseId: 'LC003',
        caseName: 'Residential Plot - Pune',
        clientName: 'Ms. Priya Sharma',
        amount: 15000,
        type: 'document-review',
        status: 'pending',
        invoiceDate: '2024-12-29T00:00:00Z',
        dueDate: '2025-01-03T00:00:00Z',
        invoiceNumber: 'INV-2024-003',
        taxAmount: 2700,
        netAmount: 12300,
        description: 'Document verification and title clearance',
        workHours: 8,
        hourlyRate: 1875
      },
      {
        id: 'PAY004',
        caseId: 'LC004',
        caseName: 'Villa Project - Goa',
        clientName: 'Coastal Developers',
        amount: 50000,
        type: 'consultation',
        status: 'paid',
        invoiceDate: '2024-12-25T00:00:00Z',
        dueDate: '2024-12-30T00:00:00Z',
        paidDate: '2024-12-29T10:15:00Z',
        paymentMethod: 'upi',
        transactionId: 'UPI987654321',
        invoiceNumber: 'INV-2024-004',
        taxAmount: 9000,
        netAmount: 41000,
        description: 'Legal consultation for RERA compliance',
        workHours: 25,
        hourlyRate: 2000
      },
      {
        id: 'PAY005',
        caseId: 'BONUS001',
        caseName: 'Performance Bonus',
        clientName: 'GharBazaar Admin',
        amount: 10000,
        type: 'bonus',
        status: 'paid',
        invoiceDate: '2024-12-31T00:00:00Z',
        dueDate: '2024-12-31T00:00:00Z',
        paidDate: '2024-12-31T16:00:00Z',
        paymentMethod: 'bank-transfer',
        transactionId: 'BONUS123456',
        invoiceNumber: 'BONUS-2024-001',
        taxAmount: 1800,
        netAmount: 8200,
        description: 'Monthly performance bonus for excellent service'
      }
    ]

    const mockStats: EarningsStats = {
      totalEarnings: 135000,
      monthlyEarnings: 85000,
      pendingAmount: 15000,
      completedCases: 4,
      averagePerCase: 33750,
      taxDeducted: 24300,
      netReceived: 110700,
      growthRate: 15.5
    }

    const mockMonthlyData: MonthlyData[] = [
      { month: 'Jul', earnings: 45000, cases: 2, hours: 35 },
      { month: 'Aug', earnings: 62000, cases: 3, hours: 48 },
      { month: 'Sep', earnings: 38000, cases: 2, hours: 28 },
      { month: 'Oct', earnings: 71000, cases: 4, hours: 55 },
      { month: 'Nov', earnings: 54000, cases: 3, hours: 42 },
      { month: 'Dec', earnings: 85000, cases: 5, hours: 63 }
    ]

    setTimeout(() => {
      setPayments(mockPayments)
      setFilteredPayments(mockPayments)
      setStats(mockStats)
      setMonthlyData(mockMonthlyData)
      setIsLoading(false)
    }, 1000)
  }, [])

  // Filter payments
  useEffect(() => {
    let filtered = payments

    if (statusFilter !== 'all') {
      filtered = filtered.filter(payment => payment.status === statusFilter)
    }

    if (searchQuery) {
      filtered = filtered.filter(payment =>
        payment.caseName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        payment.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        payment.caseId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        payment.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase())
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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Earnings & Payments</h1>
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
                          {payment.caseName}
                        </h4>
                        {payment.type === 'bonus' && (
                          <Star size={14} className="text-yellow-500" />
                        )}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {payment.clientName} • {payment.caseId}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {payment.invoiceNumber}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getTypeColor(payment.type)}`}>
                      {payment.type.replace('-', ' ').toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {formatCurrency(payment.amount)}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Net: {formatCurrency(payment.netAmount)}
                      </p>
                      {payment.workHours && (
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {payment.workHours}h @ {formatCurrency(payment.hourlyRate || 0)}/h
                        </p>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(payment.status)}
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(payment.status)}`}>
                        {payment.status.toUpperCase()}
                      </span>
                    </div>
                    {payment.paidDate && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Paid: {formatDate(payment.paidDate)}
                      </p>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm">
                      <p className="text-gray-900 dark:text-white">
                        Invoice: {formatDate(payment.invoiceDate)}
                      </p>
                      <p className="text-gray-600 dark:text-gray-400">
                        Due: {formatDate(payment.dueDate)}
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