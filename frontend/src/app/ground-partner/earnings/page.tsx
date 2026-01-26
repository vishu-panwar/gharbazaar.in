'use client'

import { useState, useEffect } from 'react'
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Calendar, 
  Download, 
  Filter, 
  Search, 
  Eye, 
  CreditCard,
  Wallet,
  PiggyBank,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  CheckCircle,
  AlertCircle,
  MapPin,
  FileText,
  Star,
  Target,
  Award,
  Banknote,
  Receipt,
  Calculator
} from 'lucide-react'
import toast from 'react-hot-toast'

interface Earning {
  id: string
  visitId: string
  propertyTitle: string
  propertyType: string
  address: string
  clientName: string
  taskType: 'site-visit' | 'verification' | 'inspection' | 'documentation' | 'photography'
  baseAmount: number
  bonusAmount: number
  totalAmount: number
  status: 'pending' | 'processing' | 'paid' | 'on-hold'
  completedDate: string
  paidDate?: string
  paymentMethod: 'bank-transfer' | 'upi' | 'wallet'
  transactionId?: string
  rating?: number
  notes?: string
}

interface EarningsSummary {
  totalEarnings: number
  thisMonth: number
  lastMonth: number
  pendingAmount: number
  paidAmount: number
  averagePerTask: number
  totalTasks: number
  monthlyGrowth: number
}

export default function EarningsPage() {
  const [earnings, setEarnings] = useState<Earning[]>([])
  const [filteredEarnings, setFilteredEarnings] = useState<Earning[]>([])
  const [summary, setSummary] = useState<EarningsSummary | null>(null)
  const [selectedEarning, setSelectedEarning] = useState<Earning | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [activeTab, setActiveTab] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterType, setFilterType] = useState('all')
  const [dateRange, setDateRange] = useState({ from: '', to: '' })
  const [isLoading, setIsLoading] = useState(true)

  // Mock data
  useEffect(() => {
    const mockEarnings: Earning[] = [
      {
        id: 'E001',
        visitId: 'V001',
        propertyTitle: '3BHK Apartment in Bandra West',
        propertyType: 'Apartment',
        address: 'Hill Road, Bandra West, Mumbai',
        clientName: 'Priya Sharma',
        taskType: 'site-visit',
        baseAmount: 700,
        bonusAmount: 100,
        totalAmount: 800,
        status: 'paid',
        completedDate: '2024-12-29T14:30:00Z',
        paidDate: '2024-12-30T10:00:00Z',
        paymentMethod: 'bank-transfer',
        transactionId: 'TXN123456789',
        rating: 5,
        notes: 'Excellent work on property verification'
      },
      {
        id: 'E002',
        visitId: 'V002',
        propertyTitle: '2BHK Villa in Andheri East',
        propertyType: 'Villa',
        address: 'Chakala, Andheri East, Mumbai',
        clientName: 'Rahul Gupta',
        taskType: 'inspection',
        baseAmount: 500,
        bonusAmount: 100,
        totalAmount: 600,
        status: 'processing',
        completedDate: '2024-12-30T16:00:00Z',
        paymentMethod: 'upi',
        rating: 4
      },
      {
        id: 'E003',
        visitId: 'V003',
        propertyTitle: 'Commercial Space in Lower Parel',
        propertyType: 'Commercial',
        address: 'Senapati Bapat Marg, Lower Parel, Mumbai',
        clientName: 'Amit Patel',
        taskType: 'verification',
        baseAmount: 450,
        bonusAmount: 50,
        totalAmount: 500,
        status: 'pending',
        completedDate: '2024-12-31T12:00:00Z',
        paymentMethod: 'bank-transfer',
        rating: 4
      },
      {
        id: 'E004',
        visitId: 'V004',
        propertyTitle: '1BHK Flat in Thane',
        propertyType: 'Apartment',
        address: 'Ghodbunder Road, Thane, Mumbai',
        clientName: 'Sneha Joshi',
        taskType: 'photography',
        baseAmount: 300,
        bonusAmount: 0,
        totalAmount: 300,
        status: 'paid',
        completedDate: '2024-12-28T11:00:00Z',
        paidDate: '2024-12-29T09:00:00Z',
        paymentMethod: 'upi',
        transactionId: 'UPI987654321',
        rating: 5
      },
      {
        id: 'E005',
        visitId: 'V005',
        propertyTitle: 'Office Space in BKC',
        propertyType: 'Commercial',
        address: 'Bandra Kurla Complex, Mumbai',
        clientName: 'Tech Solutions Pvt Ltd',
        taskType: 'documentation',
        baseAmount: 600,
        bonusAmount: 150,
        totalAmount: 750,
        status: 'on-hold',
        completedDate: '2024-12-27T15:30:00Z',
        paymentMethod: 'bank-transfer',
        rating: 3,
        notes: 'Payment on hold due to document verification'
      }
    ]

    const mockSummary: EarningsSummary = {
      totalEarnings: 2950,
      thisMonth: 2950,
      lastMonth: 2400,
      pendingAmount: 1100,
      paidAmount: 1850,
      averagePerTask: 590,
      totalTasks: 5,
      monthlyGrowth: 22.9
    }

    setTimeout(() => {
      setEarnings(mockEarnings)
      setFilteredEarnings(mockEarnings)
      setSummary(mockSummary)
      setIsLoading(false)
    }, 1000)
  }, [])

  // Filter earnings
  useEffect(() => {
    let filtered = earnings

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(earning => 
        earning.propertyTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        earning.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        earning.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        earning.transactionId?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter(earning => earning.status === filterStatus)
    }

    // Type filter
    if (filterType !== 'all') {
      filtered = filtered.filter(earning => earning.taskType === filterType)
    }

    // Date range filter
    if (dateRange.from && dateRange.to) {
      filtered = filtered.filter(earning => {
        const earningDate = new Date(earning.completedDate).toISOString().split('T')[0]
        return earningDate >= dateRange.from && earningDate <= dateRange.to
      })
    }

    // Tab filter
    if (activeTab !== 'all') {
      filtered = filtered.filter(earning => earning.status === activeTab)
    }

    setFilteredEarnings(filtered)
  }, [earnings, searchQuery, filterStatus, filterType, dateRange, activeTab])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
      case 'processing': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
      case 'paid': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
      case 'on-hold': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
    }
  }

  const getTaskTypeColor = (type: string) => {
    switch (type) {
      case 'site-visit': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
      case 'verification': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400'
      case 'inspection': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400'
      case 'documentation': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
      case 'photography': return 'bg-pink-100 text-pink-800 dark:bg-pink-900/20 dark:text-pink-400'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
    }
  }

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case 'bank-transfer': return <CreditCard size={16} />
      case 'upi': return <Wallet size={16} />
      case 'wallet': return <PiggyBank size={16} />
      default: return <DollarSign size={16} />
    }
  }

  const downloadStatement = () => {
    toast.success('Earnings statement downloaded!')
  }

  const requestPayment = (earningId: string) => {
    toast.success('Payment request submitted!')
  }

  const tabs = [
    { id: 'all', label: 'All Earnings', count: earnings.length },
    { id: 'paid', label: 'Paid', count: earnings.filter(e => e.status === 'paid').length },
    { id: 'processing', label: 'Processing', count: earnings.filter(e => e.status === 'processing').length },
    { id: 'pending', label: 'Pending', count: earnings.filter(e => e.status === 'pending').length }
  ]

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading earnings...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Earnings</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Track your payments and financial performance
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex items-center space-x-3">
          <button
            onClick={downloadStatement}
            className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-medium rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            <Download size={20} />
            <span>Download Statement</span>
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Total Earnings</p>
                <p className="text-3xl font-bold">₹{summary.totalEarnings.toLocaleString()}</p>
                <div className="flex items-center space-x-1 mt-2">
                  {summary.monthlyGrowth > 0 ? (
                    <ArrowUpRight size={16} className="text-green-300" />
                  ) : (
                    <ArrowDownRight size={16} className="text-red-300" />
                  )}
                  <span className="text-sm text-blue-100">
                    {summary.monthlyGrowth > 0 ? '+' : ''}{summary.monthlyGrowth}% from last month
                  </span>
                </div>
              </div>
              <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl">
                <DollarSign className="w-8 h-8" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-950 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">This Month</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">₹{summary.thisMonth.toLocaleString()}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {summary.totalTasks} tasks completed
                </p>
              </div>
              <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-2xl">
                <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-950 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pending Amount</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">₹{summary.pendingAmount.toLocaleString()}</p>
                <p className="text-sm text-yellow-600 dark:text-yellow-400 mt-1">
                  Processing payment
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
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Average Per Task</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">₹{summary.averagePerTask}</p>
                <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                  Great performance!
                </p>
              </div>
              <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-2xl">
                <Target className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white dark:bg-gray-950 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all
                ${activeTab === tab.id
                  ? 'bg-blue-500 text-white shadow-lg'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                }
              `}
            >
              <span>{tab.label}</span>
              <span className={`
                px-2 py-1 rounded-full text-xs font-bold
                ${activeTab === tab.id
                  ? 'bg-white/20 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                }
              `}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Search and Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="lg:col-span-2 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search earnings..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
          
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="paid">Paid</option>
            <option value="on-hold">On Hold</option>
          </select>

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          >
            <option value="all">All Types</option>
            <option value="site-visit">Site Visit</option>
            <option value="verification">Verification</option>
            <option value="inspection">Inspection</option>
            <option value="documentation">Documentation</option>
            <option value="photography">Photography</option>
          </select>

          <button className="flex items-center justify-center space-x-2 px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all">
            <Calendar size={20} className="text-gray-600 dark:text-gray-400" />
            <span className="text-gray-600 dark:text-gray-400">Date Range</span>
          </button>
        </div>
      </div>

      {/* Earnings List */}
      <div className="space-y-4">
        {filteredEarnings.length === 0 ? (
          <div className="bg-white dark:bg-gray-950 rounded-2xl p-12 border border-gray-200 dark:border-gray-800 shadow-sm text-center">
            <DollarSign className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No earnings found</h3>
            <p className="text-gray-600 dark:text-gray-400">
              {searchQuery || filterStatus !== 'all' || filterType !== 'all'
                ? 'Try adjusting your search or filters'
                : 'Complete tasks to start earning'
              }
            </p>
          </div>
        ) : (
          filteredEarnings.map(earning => (
            <div key={earning.id} className="bg-white dark:bg-gray-950 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-all">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {earning.propertyTitle}
                        </h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(earning.status)}`}>
                          {earning.status.toUpperCase()}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getTaskTypeColor(earning.taskType)}`}>
                          {earning.taskType.replace('-', ' ').toUpperCase()}
                        </span>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                        <div className="flex items-center space-x-1">
                          <MapPin size={16} />
                          <span>{earning.address}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar size={16} />
                          <span>{new Date(earning.completedDate).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                        <Banknote size={16} className="text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">₹{earning.baseAmount}</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">Base Amount</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                        <Award size={16} className="text-green-600 dark:text-green-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">₹{earning.bonusAmount}</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">Bonus</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                        <Calculator size={16} className="text-purple-600 dark:text-purple-400" />
                      </div>
                      <div>
                        <p className="text-lg font-bold text-gray-900 dark:text-white">₹{earning.totalAmount}</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">Total</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
                        {getPaymentMethodIcon(earning.paymentMethod)}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white capitalize">
                          {earning.paymentMethod.replace('-', ' ')}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">Payment Method</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Client: {earning.clientName}</span>
                      {earning.rating && (
                        <div className="flex items-center space-x-1">
                          <Star size={16} className="text-yellow-400 fill-current" />
                          <span className="text-sm font-medium text-gray-900 dark:text-white">{earning.rating}/5</span>
                        </div>
                      )}
                      {earning.transactionId && (
                        <span className="text-xs text-green-600 dark:text-green-400 font-mono">
                          ID: {earning.transactionId}
                        </span>
                      )}
                    </div>
                  </div>

                  {earning.notes && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                      {earning.notes}
                    </p>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row lg:flex-col gap-3 mt-4 lg:mt-0 lg:ml-6">
                  <button
                    onClick={() => {
                      setSelectedEarning(earning)
                      setShowModal(true)
                    }}
                    className="flex items-center justify-center space-x-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/40 rounded-xl transition-all"
                  >
                    <Eye size={16} />
                    <span>Details</span>
                  </button>

                  {earning.status === 'pending' && (
                    <button
                      onClick={() => requestPayment(earning.id)}
                      className="flex items-center justify-center space-x-2 px-4 py-2 bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/40 rounded-xl transition-all"
                    >
                      <DollarSign size={16} />
                      <span>Request</span>
                    </button>
                  )}

                  {earning.status === 'paid' && (
                    <button className="flex items-center justify-center space-x-2 px-4 py-2 bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 hover:bg-purple-200 dark:hover:bg-purple-900/40 rounded-xl transition-all">
                      <Receipt size={16} />
                      <span>Receipt</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Earning Details Modal */}
      {showModal && selectedEarning && (
        <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-950 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 dark:border-gray-800">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Earning Details - {selectedEarning.id}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Property & Task Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Property Information</h3>
                  <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4 space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Property:</span>
                      <span className="font-medium text-gray-900 dark:text-white">{selectedEarning.propertyTitle}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Type:</span>
                      <span className="font-medium text-gray-900 dark:text-white">{selectedEarning.propertyType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Client:</span>
                      <span className="font-medium text-gray-900 dark:text-white">{selectedEarning.clientName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Address:</span>
                      <span className="font-medium text-gray-900 dark:text-white text-right">{selectedEarning.address}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Task Information</h3>
                  <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4 space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Task Type:</span>
                      <span className="font-medium text-gray-900 dark:text-white capitalize">{selectedEarning.taskType.replace('-', ' ')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Completed:</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {new Date(selectedEarning.completedDate).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Status:</span>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedEarning.status)}`}>
                        {selectedEarning.status.toUpperCase()}
                      </span>
                    </div>
                    {selectedEarning.rating && (
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Rating:</span>
                        <div className="flex items-center space-x-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={16}
                              className={i < selectedEarning.rating! ? 'text-yellow-400 fill-current' : 'text-gray-300 dark:text-gray-600'}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Payment Breakdown */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Payment Breakdown</h3>
                <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4 space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">Base Amount:</span>
                    <span className="font-medium text-gray-900 dark:text-white">₹{selectedEarning.baseAmount}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">Bonus Amount:</span>
                    <span className="font-medium text-green-600 dark:text-green-400">+₹{selectedEarning.bonusAmount}</span>
                  </div>
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold text-gray-900 dark:text-white">Total Amount:</span>
                      <span className="text-2xl font-bold text-gray-900 dark:text-white">₹{selectedEarning.totalAmount}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Details */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Payment Details</h3>
                <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Payment Method:</span>
                    <div className="flex items-center space-x-2">
                      {getPaymentMethodIcon(selectedEarning.paymentMethod)}
                      <span className="font-medium text-gray-900 dark:text-white capitalize">
                        {selectedEarning.paymentMethod.replace('-', ' ')}
                      </span>
                    </div>
                  </div>
                  {selectedEarning.transactionId && (
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Transaction ID:</span>
                      <span className="font-mono text-sm text-gray-900 dark:text-white">{selectedEarning.transactionId}</span>
                    </div>
                  )}
                  {selectedEarning.paidDate && (
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Paid Date:</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {new Date(selectedEarning.paidDate).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Notes */}
              {selectedEarning.notes && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Notes</h3>
                  <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4">
                    <p className="text-gray-900 dark:text-white">{selectedEarning.notes}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}