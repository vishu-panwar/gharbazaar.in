'use client'

import { useState, useEffect } from 'react'
import {
  IndianRupee,
  TrendingUp,
  TrendingDown,
  Calendar,
  Eye,
  Download,
  Filter,
  Search,
  BarChart3,
  PieChart,
  Target,
  Award,
  Wallet,
  Clock,
  CheckCircle,
  AlertCircle,
  Users,
  Star,
  Gift,
  Zap,
  Crown,
  ArrowUp,
  ArrowDown,
  RefreshCw,
  ExternalLink,
  Plus,
  Minus,
  DollarSign,
  CreditCard,
  Building,
  Home,
  MapPin,
  Phone,
  User,
  Briefcase,
  Globe,
  Activity,
  Sparkles,
  X
} from 'lucide-react'

interface EarningRecord {
  id: string
  leadId: string
  customerName: string
  propertyType: string
  location: string
  type: 'buyer' | 'seller'
  commissionAmount: number
  commissionRate: number
  propertyValue: number
  status: 'pending' | 'approved' | 'paid' | 'disputed'
  earnedDate: string
  paidDate?: string
  paymentMethod?: string
  transactionId?: string
  notes?: string
}

interface EarningsStats {
  totalEarnings: number
  thisMonthEarnings: number
  lastMonthEarnings: number
  pendingEarnings: number
  paidEarnings: number
  avgCommissionRate: number
  totalLeadsConverted: number
  topEarningMonth: string
  topEarningAmount: number
  conversionRate: number
}

interface MonthlyEarning {
  month: string
  earnings: number
  leads: number
  avgCommission: number
}

export default function EarningsPage() {
  const [user, setUser] = useState<any>(null)
  const [earnings, setEarnings] = useState<EarningRecord[]>([])
  const [stats, setStats] = useState<EarningsStats | null>(null)
  const [monthlyData, setMonthlyData] = useState<MonthlyEarning[]>([])
  const [filteredEarnings, setFilteredEarnings] = useState<EarningRecord[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [selectedType, setSelectedType] = useState('all')
  const [dateRange, setDateRange] = useState('all')
  const [isLoading, setIsLoading] = useState(true)
  const [selectedEarning, setSelectedEarning] = useState<EarningRecord | null>(null)

  useEffect(() => {
    // Get user data
    const userData = localStorage.getItem('user')
    if (userData) {
      setUser(JSON.parse(userData))
    }

    // Mock earnings data
    const mockEarnings: EarningRecord[] = [
      {
        id: 'E001',
        leadId: 'LD002',
        customerName: 'Priya Patel',
        propertyType: '3 BHK Villa',
        location: 'Bandra East, Mumbai',
        type: 'seller',
        commissionAmount: 75000,
        commissionRate: 2.5,
        propertyValue: 3000000,
        status: 'paid',
        earnedDate: '2024-12-28T11:30:00Z',
        paidDate: '2024-12-29T15:45:00Z',
        paymentMethod: 'Bank Transfer',
        transactionId: 'TXN789012345',
        notes: 'Premium villa sale commission'
      },
      {
        id: 'E002',
        leadId: 'LD006',
        customerName: 'Amit Sharma',
        propertyType: '2 BHK Apartment',
        location: 'Andheri West, Mumbai',
        type: 'buyer',
        commissionAmount: 25000,
        commissionRate: 2.0,
        propertyValue: 1250000,
        status: 'approved',
        earnedDate: '2024-12-27T14:20:00Z',
        notes: 'Ready-to-move apartment purchase'
      },
      {
        id: 'E003',
        leadId: 'LD007',
        customerName: 'Neha Gupta',
        propertyType: '1 BHK Apartment',
        location: 'Thane West, Mumbai',
        type: 'buyer',
        commissionAmount: 15000,
        commissionRate: 2.5,
        propertyValue: 600000,
        status: 'pending',
        earnedDate: '2024-12-26T09:15:00Z',
        notes: 'First-time buyer, documentation in progress'
      },
      {
        id: 'E004',
        leadId: 'LD008',
        customerName: 'Rajesh Kumar',
        propertyType: '4 BHK Penthouse',
        location: 'Powai, Mumbai',
        type: 'seller',
        commissionAmount: 120000,
        commissionRate: 3.0,
        propertyValue: 4000000,
        status: 'paid',
        earnedDate: '2024-12-20T16:45:00Z',
        paidDate: '2024-12-22T10:30:00Z',
        paymentMethod: 'UPI',
        transactionId: 'UPI567890123',
        notes: 'Luxury penthouse with premium location'
      },
      {
        id: 'E005',
        leadId: 'LD009',
        customerName: 'Kavya Reddy',
        propertyType: '2 BHK Apartment',
        location: 'Goregaon West, Mumbai',
        type: 'buyer',
        commissionAmount: 18000,
        commissionRate: 1.8,
        propertyValue: 1000000,
        status: 'disputed',
        earnedDate: '2024-12-15T12:00:00Z',
        notes: 'Commission under review due to documentation issues'
      },
      {
        id: 'E006',
        leadId: 'LD010',
        customerName: 'Suresh Joshi',
        propertyType: '3 BHK Apartment',
        location: 'Malad East, Mumbai',
        type: 'seller',
        commissionAmount: 45000,
        commissionRate: 2.25,
        propertyValue: 2000000,
        status: 'paid',
        earnedDate: '2024-12-10T08:30:00Z',
        paidDate: '2024-12-12T14:15:00Z',
        paymentMethod: 'Bank Transfer',
        transactionId: 'TXN345678901',
        notes: 'Quick sale with competitive pricing'
      }
    ]

    const mockStats: EarningsStats = {
      totalEarnings: 298000,
      thisMonthEarnings: 118000,
      lastMonthEarnings: 85000,
      pendingEarnings: 15000,
      paidEarnings: 283000,
      avgCommissionRate: 2.3,
      totalLeadsConverted: 6,
      topEarningMonth: 'December 2024',
      topEarningAmount: 120000,
      conversionRate: 18.5
    }

    const mockMonthlyData: MonthlyEarning[] = [
      { month: 'Jul 2024', earnings: 45000, leads: 2, avgCommission: 22500 },
      { month: 'Aug 2024', earnings: 62000, leads: 3, avgCommission: 20667 },
      { month: 'Sep 2024', earnings: 38000, leads: 2, avgCommission: 19000 },
      { month: 'Oct 2024', earnings: 71000, leads: 4, avgCommission: 17750 },
      { month: 'Nov 2024', earnings: 85000, leads: 3, avgCommission: 28333 },
      { month: 'Dec 2024', earnings: 118000, leads: 5, avgCommission: 23600 }
    ]

    setTimeout(() => {
      setEarnings(mockEarnings)
      setFilteredEarnings(mockEarnings)
      setStats(mockStats)
      setMonthlyData(mockMonthlyData)
      setIsLoading(false)
    }, 1000)
  }, [])

  // Filter earnings
  useEffect(() => {
    let filtered = earnings.filter(earning => {
      const searchMatch = !searchQuery ||
        earning.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        earning.propertyType.toLowerCase().includes(searchQuery.toLowerCase()) ||
        earning.location.toLowerCase().includes(searchQuery.toLowerCase())

      const statusMatch = selectedStatus === 'all' || earning.status === selectedStatus
      const typeMatch = selectedType === 'all' || earning.type === selectedType

      return searchMatch && statusMatch && typeMatch
    })

    setFilteredEarnings(filtered)
  }, [earnings, searchQuery, selectedStatus, selectedType])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400'
      case 'approved': return 'bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
      case 'pending': return 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400'
      case 'disputed': return 'bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400'
      default: return 'bg-gray-100 text-gray-600 dark:bg-gray-900/20 dark:text-gray-400'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid': return <CheckCircle className="w-4 h-4" />
      case 'approved': return <Clock className="w-4 h-4" />
      case 'pending': return <AlertCircle className="w-4 h-4" />
      case 'disputed': return <AlertCircle className="w-4 h-4" />
      default: return <Clock className="w-4 h-4" />
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const calculateGrowth = () => {
    if (!stats) return 0
    if (stats.lastMonthEarnings === 0) return 100
    return ((stats.thisMonthEarnings - stats.lastMonthEarnings) / stats.lastMonthEarnings * 100)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading earnings...</p>
        </div>
      </div>
    )
  }
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Earnings Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-xl max-w-3xl mx-auto">
          Track your commission earnings and analyze your performance over time
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">Total Earnings</p>
              <p className="text-3xl font-bold">₹{stats?.totalEarnings?.toLocaleString()}</p>
              <div className="flex items-center space-x-1 mt-2">
                {calculateGrowth() >= 0 ? (
                  <ArrowUp className="w-4 h-4 text-green-200" />
                ) : (
                  <ArrowDown className="w-4 h-4 text-red-200" />
                )}
                <span className="text-sm text-green-100">
                  {Math.abs(calculateGrowth()).toFixed(1)}% from last month
                </span>
              </div>
            </div>
            <div className="p-3 bg-white/20 rounded-2xl">
              <IndianRupee className="w-8 h-8" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-950 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">This Month</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">₹{stats?.thisMonthEarnings?.toLocaleString()}</p>
              <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">
                {stats?.totalLeadsConverted} conversions
              </p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-2xl">
              <Calendar className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-950 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pending</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">₹{stats?.pendingEarnings?.toLocaleString()}</p>
              <p className="text-sm text-yellow-600 dark:text-yellow-400 mt-1">Awaiting approval</p>
            </div>
            <div className="p-3 bg-yellow-100 dark:bg-yellow-900/20 rounded-2xl">
              <Clock className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-950 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg Commission</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats?.avgCommissionRate}%</p>
              <p className="text-sm text-purple-600 dark:text-purple-400 mt-1">Per transaction</p>
            </div>
            <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-2xl">
              <Target className="w-8 h-8 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Monthly Earnings Chart */}
      <div className="bg-white dark:bg-gray-950 rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Monthly Earnings Trend</h2>
          <div className="flex items-center space-x-2">
            <BarChart3 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <span className="text-sm text-gray-600 dark:text-gray-400">Last 6 months</span>
          </div>
        </div>

        <div className="space-y-4">
          {monthlyData.map((month, index) => {
            const maxEarning = Math.max(...monthlyData.map(m => m.earnings))
            const widthPercentage = (month.earnings / maxEarning) * 100

            return (
              <div key={month.month} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{month.month}</span>
                  <span className="text-sm font-bold text-gray-900 dark:text-white">₹{month.earnings.toLocaleString()}</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${widthPercentage}%` }}
                  ></div>
                </div>
                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                  <span>{month.leads} leads converted</span>
                  <span>Avg: ₹{month.avgCommission.toLocaleString()}</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search by customer, property, or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>

        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">All Status</option>
          <option value="paid">Paid</option>
          <option value="approved">Approved</option>
          <option value="pending">Pending</option>
          <option value="disputed">Disputed</option>
        </select>

        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">All Types</option>
          <option value="buyer">Buyer</option>
          <option value="seller">Seller</option>
        </select>

        <button className="flex items-center space-x-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all">
          <Download size={20} />
          <span>Export</span>
        </button>
      </div>
      {/* Earnings List */}
      <div className="bg-white dark:bg-gray-950 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-gray-800">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Commission History</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Showing {filteredEarnings.length} of {earnings.length} earnings
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Customer & Property
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Commission
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Date Earned
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
              {filteredEarnings.map((earning) => (
                <tr
                  key={earning.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-900/50 cursor-pointer"
                  onClick={() => setSelectedEarning(earning)}
                >
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {earning.customerName}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {earning.propertyType}
                      </div>
                      <div className="text-xs text-gray-400 dark:text-gray-500 flex items-center mt-1">
                        <MapPin className="w-3 h-3 mr-1" />
                        {earning.location}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${earning.type === 'buyer'
                        ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
                        : 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400'
                      }`}>
                      {earning.type === 'buyer' ? 'Buyer' : 'Seller'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-bold text-gray-900 dark:text-white">
                      ₹{earning.commissionAmount.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {earning.commissionRate}% of ₹{earning.propertyValue.toLocaleString()}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(earning.status)}`}>
                      {getStatusIcon(earning.status)}
                      <span className="capitalize">{earning.status}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                    {formatDate(earning.earnedDate)}
                    {earning.paidDate && (
                      <div className="text-xs text-green-600 dark:text-green-400">
                        Paid: {formatDate(earning.paidDate)}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <button className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Earning Detail Modal */}
      {selectedEarning && (
        <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-950 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Commission Details
                </h2>
                <p className="text-gray-600 dark:text-gray-400">Earning ID: {selectedEarning.id}</p>
              </div>
              <button
                onClick={() => setSelectedEarning(null)}
                className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto">
              {/* Status Badge */}
              <div className="flex items-center justify-center mb-6">
                <span className={`inline-flex items-center space-x-2 px-4 py-2 rounded-xl text-lg font-medium ${getStatusColor(selectedEarning.status)}`}>
                  {getStatusIcon(selectedEarning.status)}
                  <span className="capitalize">{selectedEarning.status}</span>
                </span>
              </div>

              {/* Commission Amount */}
              <div className="text-center mb-8">
                <p className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                  ₹{selectedEarning.commissionAmount.toLocaleString()}
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  {selectedEarning.commissionRate}% commission on property value of ₹{selectedEarning.propertyValue.toLocaleString()}
                </p>
              </div>

              {/* Customer & Property Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Customer Details</h3>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <User className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">{selectedEarning.customerName}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Briefcase className="w-4 h-4 text-green-600 dark:text-green-400" />
                      <span className="text-sm text-gray-700 dark:text-gray-300 capitalize">{selectedEarning.type}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Property Details</h3>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Home className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">{selectedEarning.propertyType}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">{selectedEarning.location}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Details */}
              {selectedEarning.status === 'paid' && (
                <div className="bg-green-50 dark:bg-green-900/20 rounded-2xl p-4 mb-6">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Payment Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-green-600 dark:text-green-400" />
                      <div>
                        <p className="text-xs text-gray-600 dark:text-gray-400">Paid Date</p>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {selectedEarning.paidDate && formatDate(selectedEarning.paidDate)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CreditCard className="w-4 h-4 text-green-600 dark:text-green-400" />
                      <div>
                        <p className="text-xs text-gray-600 dark:text-gray-400">Payment Method</p>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{selectedEarning.paymentMethod}</p>
                      </div>
                    </div>
                    {selectedEarning.transactionId && (
                      <div className="md:col-span-2 flex items-center space-x-2">
                        <ExternalLink className="w-4 h-4 text-green-600 dark:text-green-400" />
                        <div>
                          <p className="text-xs text-gray-600 dark:text-gray-400">Transaction ID</p>
                          <p className="text-sm font-mono text-gray-900 dark:text-white">{selectedEarning.transactionId}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Timeline */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Timeline</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                      <Calendar className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Commission Earned</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">{formatDate(selectedEarning.earnedDate)}</p>
                    </div>
                  </div>
                  {selectedEarning.paidDate && (
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">Payment Processed</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">{formatDate(selectedEarning.paidDate)}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Notes */}
              {selectedEarning.notes && (
                <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Notes</h3>
                  <p className="text-sm text-gray-700 dark:text-gray-300">{selectedEarning.notes}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {filteredEarnings.length === 0 && (
        <div className="text-center py-12">
          <IndianRupee className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            No earnings found
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {searchQuery || selectedStatus !== 'all' || selectedType !== 'all'
              ? 'Try adjusting your search or filters'
              : 'Start referring customers to earn your first commission'
            }
          </p>
        </div>
      )}
    </div>
  )
}