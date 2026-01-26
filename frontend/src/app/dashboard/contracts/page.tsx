'use client'

import { useState } from 'react'
import {
  FileText,
  Download,
  Eye,
  CheckCircle,
  Clock,
  AlertCircle,
  XCircle,
  Search,
  Filter,
  Calendar,
  User,
  Home,
  DollarSign,
  Edit,
  Send,
  Upload,
  Printer,
  Share2,
  Building2,
  Key,
  Users,
  Target,
  Receipt,
  Shield,
  MapPin,
  Phone,
  Mail
} from 'lucide-react'

interface BaseContract {
  id: number
  contractNumber: string
  contractType: string
  property: string
  propertyLocation: string
  propertyType: string
  area: string
  status: string
  progress: number
  documents: string[]
}

interface SellerContract extends BaseContract {
  buyer: string
  buyerEmail: string
  buyerPhone: string
  amount: string
  amountValue: number
  commission: string
  commissionValue: number
  startDate: string
  completionDate: string
  registryDate: string
  paymentSchedule: any[]
}

interface RenterContract extends BaseContract {
  tenant: string
  tenantEmail: string
  tenantPhone: string
  monthlyRent: number
  securityDeposit: number
  leaseStart: string
  leaseEnd: string
  maintenanceCharges: string
  utilities: string
  amenities: string[]
  renewalDate: string
}

export default function ContractsPage() {
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'pending' | 'completed' | 'cancelled'>('all')
  const [userRole, setUserRole] = useState<'seller' | 'renter'>('seller')

  // Sample contracts data for sellers (sale agreements)
  const sellerContracts = [
    {
      id: 1,
      contractNumber: 'SA-2024-001',
      contractType: 'Sale Agreement',
      property: 'Luxury Penthouse',
      propertyLocation: 'Worli, Mumbai',
      propertyType: 'Penthouse',
      area: '3500 sq ft',
      buyer: 'Rahul Sharma',
      buyerEmail: 'rahul.sharma@email.com',
      buyerPhone: '+91 98765 43210',
      amount: '₹8.5 Cr',
      amountValue: 85000000,
      commission: '₹42.5L',
      commissionValue: 4250000,
      status: 'active',
      startDate: '2024-11-15',
      completionDate: '2025-02-15',
      registryDate: '2025-01-30',
      progress: 75,
      documents: ['Sale Agreement', 'KYC Documents', 'Token Payment Receipt', 'NOC'],
      nextMilestone: 'Final Payment & Registry',
      milestoneDate: '2024-12-15',
      paymentSchedule: [
        { stage: 'Token Amount', amount: 850000, status: 'completed', date: '2024-11-15' },
        { stage: 'Agreement Amount', amount: 8500000, status: 'completed', date: '2024-11-20' },
        { stage: 'Construction Linked', amount: 42500000, status: 'pending', date: '2024-12-15' },
        { stage: 'Final Payment', amount: 33150000, status: 'pending', date: '2025-01-30' }
      ]
    },
    {
      id: 2,
      contractNumber: 'SA-2024-002',
      contractType: 'Sale Agreement',
      property: 'Modern Villa',
      propertyLocation: 'Whitefield, Bangalore',
      propertyType: 'Villa',
      area: '2800 sq ft',
      buyer: 'Priya Patel',
      buyerEmail: 'priya.patel@email.com',
      buyerPhone: '+91 87654 32109',
      amount: '₹3.8 Cr',
      amountValue: 38000000,
      commission: '₹19L',
      commissionValue: 1900000,
      status: 'pending',
      startDate: '2024-12-01',
      completionDate: '2025-03-01',
      registryDate: '2025-02-15',
      progress: 25,
      documents: ['Draft Agreement', 'Property Documents'],
      nextMilestone: 'Buyer Signature & Token',
      milestoneDate: '2024-12-05',
      paymentSchedule: [
        { stage: 'Token Amount', amount: 380000, status: 'pending', date: '2024-12-05' },
        { stage: 'Agreement Amount', amount: 3800000, status: 'pending', date: '2024-12-10' },
        { stage: 'Possession Amount', amount: 19000000, status: 'pending', date: '2025-01-15' },
        { stage: 'Final Payment', amount: 14820000, status: 'pending', date: '2025-02-15' }
      ]
    },
    {
      id: 3,
      contractNumber: 'SA-2024-003',
      contractType: 'Sale Agreement',
      property: 'Sea View Apartment',
      propertyLocation: 'Marine Drive, Mumbai',
      propertyType: 'Apartment',
      area: '2200 sq ft',
      buyer: 'Amit Kumar',
      buyerEmail: 'amit.kumar@email.com',
      buyerPhone: '+91 76543 21098',
      amount: '₹6.2 Cr',
      amountValue: 62000000,
      commission: '₹31L',
      commissionValue: 3100000,
      status: 'completed',
      startDate: '2024-09-01',
      completionDate: '2024-11-30',
      registryDate: '2024-11-30',
      progress: 100,
      documents: ['Sale Agreement', 'KYC Documents', 'Payment Receipts', 'Registry Documents', 'Possession Letter'],
      nextMilestone: 'Completed',
      milestoneDate: '2024-11-30',
      paymentSchedule: [
        { stage: 'Token Amount', amount: 620000, status: 'completed', date: '2024-09-01' },
        { stage: 'Agreement Amount', amount: 6200000, status: 'completed', date: '2024-09-05' },
        { stage: 'Possession Amount', amount: 31000000, status: 'completed', date: '2024-10-15' },
        { stage: 'Final Payment', amount: 24180000, status: 'completed', date: '2024-11-30' }
      ]
    }
  ]

  // Sample contracts data for renters (lease agreements)
  const renterContracts = [
    {
      id: 1,
      contractNumber: 'LA-2024-001',
      contractType: 'Lease Agreement',
      property: 'Premium 3BHK Apartment',
      propertyLocation: 'Bandra West, Mumbai',
      propertyType: '3BHK Apartment',
      area: '1800 sq ft',
      tenant: 'Sneha Sharma',
      tenantEmail: 'sneha.sharma@email.com',
      tenantPhone: '+91 98765 43210',
      monthlyRent: 85000,
      securityDeposit: 255000,
      totalValue: 1020000, // 12 months rent
      status: 'active',
      leaseStart: '2024-11-01',
      leaseEnd: '2025-10-31',
      renewalDate: '2025-09-01',
      progress: 15, // 2 months out of 12
      documents: ['Lease Agreement', 'Tenant KYC', 'Security Deposit Receipt', 'Police Verification'],
      nextMilestone: 'Monthly Rent Collection',
      milestoneDate: '2025-01-01',
      rentSchedule: [
        { month: 'November 2024', amount: 85000, status: 'completed', date: '2024-11-01' },
        { month: 'December 2024', amount: 85000, status: 'completed', date: '2024-12-01' },
        { month: 'January 2025', amount: 85000, status: 'pending', date: '2025-01-01' },
        { month: 'February 2025', amount: 85000, status: 'pending', date: '2025-02-01' }
      ],
      maintenanceCharges: 3500,
      utilities: ['Electricity', 'Water', 'Gas'],
      amenities: ['Parking', 'Gym', 'Swimming Pool', 'Security']
    },
    {
      id: 2,
      contractNumber: 'LA-2024-002',
      contractType: 'Lease Agreement',
      property: 'Cozy 2BHK Flat',
      propertyLocation: 'Koramangala, Bangalore',
      propertyType: '2BHK Apartment',
      area: '1200 sq ft',
      tenant: 'Rajesh Patel',
      tenantEmail: 'rajesh.patel@email.com',
      tenantPhone: '+91 87654 32109',
      monthlyRent: 35000,
      securityDeposit: 105000,
      totalValue: 385000, // 11 months rent
      status: 'active',
      leaseStart: '2024-10-15',
      leaseEnd: '2025-09-14',
      renewalDate: '2025-08-15',
      progress: 25, // 2.5 months out of 11
      documents: ['Lease Agreement', 'Tenant KYC', 'Security Deposit Receipt'],
      nextMilestone: 'Monthly Rent Collection',
      milestoneDate: '2025-01-15',
      rentSchedule: [
        { month: 'October 2024', amount: 35000, status: 'completed', date: '2024-10-15' },
        { month: 'November 2024', amount: 35000, status: 'completed', date: '2024-11-15' },
        { month: 'December 2024', amount: 35000, status: 'completed', date: '2024-12-15' },
        { month: 'January 2025', amount: 35000, status: 'pending', date: '2025-01-15' }
      ],
      maintenanceCharges: 2500,
      utilities: ['Electricity', 'Water'],
      amenities: ['Parking', 'Security']
    },
    {
      id: 3,
      contractNumber: 'LA-2024-003',
      contractType: 'Lease Agreement',
      property: 'Studio Apartment',
      propertyLocation: 'Powai, Mumbai',
      propertyType: 'Studio',
      area: '650 sq ft',
      tenant: 'Vacant',
      tenantEmail: '-',
      tenantPhone: '-',
      monthlyRent: 28000,
      securityDeposit: 84000,
      totalValue: 0,
      status: 'cancelled',
      leaseStart: '2024-09-01',
      leaseEnd: '2024-09-30',
      renewalDate: '-',
      progress: 0,
      documents: ['Draft Agreement'],
      nextMilestone: 'Find New Tenant',
      milestoneDate: '2025-01-01',
      rentSchedule: [],
      maintenanceCharges: 2000,
      utilities: ['Electricity'],
      amenities: ['Security']
    }
  ]

  const currentContracts = userRole === 'seller' ? sellerContracts : renterContracts

  const filteredContracts = activeTab === 'all'
    ? currentContracts
    : currentContracts.filter(contract => contract.status === activeTab)

  const stats = {
    all: currentContracts.length,
    active: currentContracts.filter(c => c.status === 'active').length,
    pending: currentContracts.filter(c => c.status === 'pending').length,
    completed: currentContracts.filter(c => c.status === 'completed').length,
    cancelled: currentContracts.filter(c => c.status === 'cancelled').length
  }

  const getStatusBadge = (status: string) => {
    const badges = {
      active: { color: 'blue', icon: Clock, label: 'Active' },
      pending: { color: 'yellow', icon: AlertCircle, label: 'Pending' },
      completed: { color: 'green', icon: CheckCircle, label: 'Completed' },
      cancelled: { color: 'red', icon: XCircle, label: 'Cancelled' }
    }
    const badge = badges[status as keyof typeof badges]
    return (
      <div className={`flex items-center space-x-1 bg-${badge.color}-100 dark:bg-${badge.color}-900/30 text-${badge.color}-600 dark:text-${badge.color}-400 px-3 py-1 rounded-full text-xs font-semibold`}>
        <badge.icon size={12} />
        <span>{badge.label}</span>
      </div>
    )
  }

  const formatCurrency = (amount: number) => {
    if (amount >= 10000000) {
      return `₹${(amount / 10000000).toFixed(1)}Cr`
    } else if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(1)}L`
    } else {
      return `₹${(amount / 1000).toFixed(0)}K`
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white flex items-center">
            <FileText className="mr-3 text-blue-500" size={28} />
            {userRole === 'seller' ? 'Sale Contracts' : 'Lease Agreements'}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {userRole === 'seller'
              ? 'Manage property sale agreements and documentation'
              : 'Manage rental lease agreements and tenant contracts'
            }
          </p>
        </div>

        <div className="flex items-center space-x-3">
          {/* User Role Selector */}
          <select
            value={userRole}
            onChange={(e) => setUserRole(e.target.value as 'seller' | 'renter')}
            className="px-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
          >
            <option value="seller">🏢 Property Seller</option>
            <option value="renter">🏠 Property Owner</option>
          </select>

          <button className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-all shadow-lg">
            <Upload size={20} />
            <span>{userRole === 'seller' ? 'New Sale Contract' : 'New Lease Agreement'}</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { label: 'Total', value: stats.all, icon: FileText, color: 'gray' },
          { label: 'Active', value: stats.active, icon: Clock, color: 'blue' },
          { label: 'Pending', value: stats.pending, icon: AlertCircle, color: 'yellow' },
          { label: 'Completed', value: stats.completed, icon: CheckCircle, color: 'green' },
          { label: 'Cancelled', value: stats.cancelled, icon: XCircle, color: 'red' }
        ].map((stat, index) => (
          <div key={index} className="bg-white dark:bg-gray-900 rounded-xl p-5 shadow-lg border border-gray-200 dark:border-gray-800">
            <div className="flex items-center justify-between mb-2">
              <div className={`w-10 h-10 bg-${stat.color}-100 dark:bg-${stat.color}-900/30 rounded-lg flex items-center justify-center`}>
                <stat.icon className={`text-${stat.color}-600`} size={20} />
              </div>
              <span className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Search & Tabs */}
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 p-4">
        <div className="flex flex-col lg:flex-row gap-4 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search contracts..."
              className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button className="flex items-center space-x-2 px-4 py-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-all">
            <Filter size={20} />
            <span>Filters</span>
          </button>
        </div>

        <div className="flex space-x-2 overflow-x-auto">
          {[
            { key: 'all', label: 'All', count: stats.all },
            { key: 'active', label: 'Active', count: stats.active },
            { key: 'pending', label: 'Pending', count: stats.pending },
            { key: 'completed', label: 'Completed', count: stats.completed },
            { key: 'cancelled', label: 'Cancelled', count: stats.cancelled }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex-1 min-w-[100px] px-4 py-3 rounded-lg font-medium transition-all ${activeTab === tab.key
                ? 'bg-blue-600 text-white shadow-lg'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>
      </div>

      {/* Contracts List */}
      <div className="space-y-4">
        {filteredContracts.map((contract: any) => (
          <div
            key={contract.id}
            className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 overflow-hidden hover:shadow-2xl hover:border-blue-500 transition-all"
          >
            <div className="p-6">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      {contract.contractNumber}
                    </h3>
                    {getStatusBadge(contract.status)}
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${userRole === 'seller'
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                      : 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400'
                      }`}>
                      {contract.contractType}
                    </span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center text-gray-600 dark:text-gray-400">
                      <Building2 size={16} className="mr-2" />
                      <span className="font-medium">{contract.property}</span>
                      <span className="mx-2">•</span>
                      <span className="text-sm">{contract.propertyType}</span>
                      <span className="mx-2">•</span>
                      <span className="text-sm">{contract.area}</span>
                    </div>
                    <div className="flex items-center text-gray-600 dark:text-gray-400">
                      <MapPin size={16} className="mr-2" />
                      <span>{contract.propertyLocation}</span>
                    </div>
                    <div className="flex items-center text-gray-600 dark:text-gray-400">
                      <User size={16} className="mr-2" />
                      <span>{userRole === 'seller' ? contract.buyer : contract.tenant}</span>
                      {userRole === 'seller' && contract.buyerEmail && (
                        <>
                          <span className="mx-2">•</span>
                          <Mail size={12} className="mr-1" />
                          <span className="text-sm">{contract.buyerEmail}</span>
                        </>
                      )}
                      {userRole === 'renter' && contract.tenantEmail && contract.tenantEmail !== '-' && (
                        <>
                          <span className="mx-2">•</span>
                          <Mail size={12} className="mr-1" />
                          <span className="text-sm">{contract.tenantEmail}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                    {userRole === 'seller' ? 'Sale Value' : 'Monthly Rent'}
                  </p>
                  <p className="text-2xl font-bold text-blue-600">
                    {userRole === 'seller'
                      ? contract.amount
                      : `₹${contract.monthlyRent?.toLocaleString()}/month`
                    }
                  </p>
                  {userRole === 'seller' && (
                    <p className="text-sm text-green-600 font-semibold">
                      Commission: {contract.commission}
                    </p>
                  )}
                  {userRole === 'renter' && contract.securityDeposit && (
                    <p className="text-sm text-purple-600 font-semibold">
                      Security: ₹{contract.securityDeposit.toLocaleString()}
                    </p>
                  )}
                </div>
              </div>

              {/* Progress Bar */}
              {contract.status !== 'cancelled' && (
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {userRole === 'seller' ? 'Sale Progress' : 'Lease Progress'}
                    </span>
                    <span className="text-sm font-bold text-gray-900 dark:text-white">
                      {contract.progress}%
                    </span>
                  </div>
                  <div className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${contract.status === 'completed' ? 'bg-green-500' :
                        contract.status === 'active' ? 'bg-blue-500' : 'bg-yellow-500'
                        }`}
                      style={{ width: `${contract.progress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Calendar size={16} className="text-blue-600" />
                    <span className="text-xs text-gray-600 dark:text-gray-400">
                      {userRole === 'seller' ? 'Agreement Date' : 'Lease Start'}
                    </span>
                  </div>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {new Date(userRole === 'seller' ? contract.startDate : contract.leaseStart).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </p>
                </div>

                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Calendar size={16} className="text-green-600" />
                    <span className="text-xs text-gray-600 dark:text-gray-400">
                      {userRole === 'seller' ? 'Registry Date' : 'Lease End'}
                    </span>
                  </div>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {new Date(userRole === 'seller' ? contract.registryDate : contract.leaseEnd).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </p>
                </div>

                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Clock size={16} className="text-purple-600" />
                    <span className="text-xs text-gray-600 dark:text-gray-400">Next Milestone</span>
                  </div>
                  <p className="font-semibold text-gray-900 dark:text-white text-sm">
                    {contract.nextMilestone}
                  </p>
                  {contract.status !== 'completed' && contract.status !== 'cancelled' && (
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      Due: {new Date(contract.milestoneDate).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short'
                      })}
                    </p>
                  )}
                </div>
              </div>

              {/* Role-specific additional info */}
              {userRole === 'renter' && contract.status === 'active' && (
                <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                    Property Details
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600 dark:text-gray-400">Maintenance</p>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        ₹{contract.maintenanceCharges?.toLocaleString()}/month
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600 dark:text-gray-400">Utilities</p>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {contract.utilities?.join(', ')}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600 dark:text-gray-400">Amenities</p>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {contract.amenities?.slice(0, 2).join(', ')}
                        {contract.amenities && contract.amenities.length > 2 && ` +${contract.amenities.length - 2}`}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600 dark:text-gray-400">Renewal Due</p>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {contract.renewalDate !== '-'
                          ? new Date(contract.renewalDate).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })
                          : 'N/A'
                        }
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Documents */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  Documents ({contract.documents.length})
                </h4>
                <div className="flex flex-wrap gap-2">
                  {contract.documents.map((doc: string, index: number) => (
                    <div
                      key={index}
                      className="flex items-center space-x-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 px-3 py-2 rounded-lg text-sm"
                    >
                      <FileText size={14} />
                      <span>{doc}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
                <button className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-all">
                  <Eye size={18} />
                  <span>View Details</span>
                </button>
                <button className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-white px-4 py-2 rounded-lg font-medium transition-all">
                  <Download size={18} />
                  <span>Download</span>
                </button>
                {contract.status === 'active' && (
                  <>
                    <button className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-all">
                      <Edit size={18} />
                      <span>Update</span>
                    </button>
                    <button className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-all">
                      <Send size={18} />
                      <span>{userRole === 'seller' ? 'Send to Buyer' : 'Send to Tenant'}</span>
                    </button>
                  </>
                )}
                {userRole === 'renter' && contract.status === 'active' && (
                  <button className="flex items-center space-x-2 bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg font-medium transition-all">
                    <Receipt size={18} />
                    <span>Collect Rent</span>
                  </button>
                )}
                <button className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-white px-4 py-2 rounded-lg font-medium transition-all">
                  <Printer size={18} />
                  <span>Print</span>
                </button>
                <button className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-white px-4 py-2 rounded-lg font-medium transition-all">
                  <Share2 size={18} />
                  <span>Share</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary Card */}
      <div className={`bg-gradient-to-r ${userRole === 'seller'
        ? 'from-green-600 to-emerald-600'
        : 'from-purple-600 to-indigo-600'
        } rounded-xl p-6 text-white`}>
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold mb-2">
              {userRole === 'seller' ? 'Sales Contract Summary' : 'Lease Agreement Summary'}
            </h3>
            <p className={userRole === 'seller' ? 'text-green-100' : 'text-purple-100'}>
              {userRole === 'seller'
                ? 'Total contract value and commission across all sales'
                : 'Total rental income and property portfolio overview'
              }
            </p>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="text-center">
              <p className="text-3xl font-bold">
                {userRole === 'seller'
                  ? `₹${(currentContracts.reduce((sum, c: any) => sum + (c.amountValue || 0), 0) / 10000000).toFixed(1)}Cr`
                  : `₹${(currentContracts.reduce((sum, c: any) => sum + (c.monthlyRent || 0), 0) / 100000).toFixed(1)}L`
                }
              </p>
              <p className={`text-sm ${userRole === 'seller' ? 'text-green-100' : 'text-purple-100'}`}>
                {userRole === 'seller' ? 'Total Sales Value' : 'Monthly Rental Income'}
              </p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold">
                {userRole === 'seller'
                  ? `₹${(currentContracts.reduce((sum, c: any) => sum + (c.commissionValue || 0), 0) / 100000).toFixed(1)}L`
                  : `₹${(currentContracts.reduce((sum, c: any) => sum + (c.securityDeposit || 0), 0) / 100000).toFixed(1)}L`
                }
              </p>
              <p className={`text-sm ${userRole === 'seller' ? 'text-green-100' : 'text-purple-100'}`}>
                {userRole === 'seller' ? 'Total Commission' : 'Security Deposits'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
