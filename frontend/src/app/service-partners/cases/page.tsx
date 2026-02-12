'use client'

import { useState, useEffect } from 'react'
import { 
  Briefcase, 
  Search, 
  Filter, 
  Calendar, 
  MapPin, 
  DollarSign, 
  Clock, 
  Eye, 
  FileText, 
  CheckCircle, 
  AlertTriangle,
  User,
  Building,
  Scale,
  Download,
  Upload,
  MessageSquare,
  Star,
  ArrowRight,
  Plus,
  Gavel,
  Shield,
  Target
} from 'lucide-react'
import toast from 'react-hot-toast'

interface LegalCase {
  id: string
  title: string
  description: string
  propertyType: 'residential' | 'commercial' | 'industrial' | 'agricultural'
  propertyDetails: {
    address: string
    area: string
    value: number
    registrationNumber?: string
  }
  clientType: 'individual-buyer' | 'individual-seller' | 'developer' | 'investor'
  clientName: string
  clientContact: string
  scopeOfWork: string[]
  priority: 'low' | 'medium' | 'high' | 'urgent'
  status: 'assigned' | 'under-review' | 'clarification-needed' | 'approved' | 'rejected' | 'completed'
  assignedDate: string
  dueDate: string
  completedDate?: string
  fee: number
  documents: string[]
  legalOpinion?: string
  riskGrade?: 'low' | 'medium' | 'high'
  complianceStatus: {
    titleVerification: boolean
    encumbranceCheck: boolean
    reraCompliance: boolean
    governmentApprovals: boolean
  }
  timeline: {
    assigned: string
    started?: string
    reviewed?: string
    completed?: string
  }
  rating?: number
  feedback?: string
}

export default function LegalCasesPage() {
  const [cases, setCases] = useState<LegalCase[]>([])
  const [filteredCases, setFilteredCases] = useState<LegalCase[]>([])
  const [selectedCase, setSelectedCase] = useState<LegalCase | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [activeTab, setActiveTab] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterPriority, setFilterPriority] = useState('all')
  const [filterPropertyType, setFilterPropertyType] = useState('all')
  const [isLoading, setIsLoading] = useState(true)

  // Mock data
  useEffect(() => {
    const mockCases: LegalCase[] = [
      {
        id: 'LC001',
        title: 'Property Title Verification - Luxury Apartment',
        description: 'Complete legal due diligence for a 3BHK luxury apartment purchase including title verification, encumbrance check, and RERA compliance.',
        propertyType: 'residential',
        propertyDetails: {
          address: 'Tower A, Lodha Park, Worli, Mumbai',
          area: '1,250 sq ft',
          value: 45000000,
          registrationNumber: 'MH/RERA/2019/P52100012345'
        },
        clientType: 'individual-buyer',
        clientName: 'Mr. Arjun Mehta',
        clientContact: '+91 98765 43210',
        scopeOfWork: [
          'Title verification and chain of ownership',
          'Encumbrance certificate review',
          'RERA compliance check',
          'Government approvals verification',
          'Legal opinion and risk assessment'
        ],
        priority: 'high',
        status: 'assigned',
        assignedDate: '2024-12-30T10:00:00Z',
        dueDate: '2025-01-05T18:00:00Z',
        fee: 25000,
        documents: [
          'Sale Deed',
          'Agreement to Sell',
          'Encumbrance Certificate',
          'RERA Certificate',
          'Approved Building Plan'
        ],
        complianceStatus: {
          titleVerification: false,
          encumbranceCheck: false,
          reraCompliance: false,
          governmentApprovals: false
        },
        timeline: {
          assigned: '2024-12-30T10:00:00Z'
        }
      },
      {
        id: 'LC002',
        title: 'RERA Compliance Audit - Commercial Complex',
        description: 'Comprehensive RERA compliance audit for a commercial complex development project.',
        propertyType: 'commercial',
        propertyDetails: {
          address: 'Andheri Kurla Road, Andheri East, Mumbai',
          area: '50,000 sq ft',
          value: 150000000,
          registrationNumber: 'MH/RERA/2020/P52100067890'
        },
        clientType: 'developer',
        clientName: 'Prestige Constructions Pvt Ltd',
        clientContact: '+91 87654 32109',
        scopeOfWork: [
          'RERA registration verification',
          'Project approval status check',
          'Compliance with RERA guidelines',
          'Escrow account verification',
          'Marketing material compliance'
        ],
        priority: 'urgent',
        status: 'under-review',
        assignedDate: '2024-12-28T14:30:00Z',
        dueDate: '2025-01-02T18:00:00Z',
        fee: 45000,
        documents: [
          'RERA Registration Certificate',
          'Project Approval Letter',
          'Sanctioned Building Plan',
          'Environmental Clearance',
          'Marketing Brochures'
        ],
        legalOpinion: 'Initial review shows compliance with major RERA requirements. Minor documentation gaps identified.',
        riskGrade: 'medium',
        complianceStatus: {
          titleVerification: true,
          encumbranceCheck: true,
          reraCompliance: false,
          governmentApprovals: true
        },
        timeline: {
          assigned: '2024-12-28T14:30:00Z',
          started: '2024-12-28T16:00:00Z',
          reviewed: '2024-12-29T11:30:00Z'
        }
      },
      {
        id: 'LC003',
        title: 'Legal Due Diligence - Villa Purchase',
        description: 'Complete legal verification for an independent villa purchase in Juhu.',
        propertyType: 'residential',
        propertyDetails: {
          address: 'Juhu Tara Road, Juhu, Mumbai',
          area: '3,500 sq ft',
          value: 85000000
        },
        clientType: 'individual-buyer',
        clientName: 'Mrs. Kavita Sharma',
        clientContact: '+91 76543 21098',
        scopeOfWork: [
          'Title verification',
          'Encumbrance check (30 years)',
          'Municipal approvals verification',
          'Coastal regulation zone clearance',
          'Property tax verification'
        ],
        priority: 'medium',
        status: 'clarification-needed',
        assignedDate: '2024-12-25T09:15:00Z',
        dueDate: '2025-01-08T18:00:00Z',
        fee: 35000,
        documents: [
          'Original Sale Deed',
          'Property Card',
          'Mutation Documents',
          'Property Tax Receipts',
          'CRZ Clearance'
        ],
        legalOpinion: 'Property has clear title. Clarification needed on CRZ compliance for recent renovations.',
        riskGrade: 'low',
        complianceStatus: {
          titleVerification: true,
          encumbranceCheck: true,
          reraCompliance: true,
          governmentApprovals: false
        },
        timeline: {
          assigned: '2024-12-25T09:15:00Z',
          started: '2024-12-25T14:00:00Z',
          reviewed: '2024-12-27T16:30:00Z'
        }
      },
      {
        id: 'LC004',
        title: 'Property Documentation Review - Completed',
        description: 'Legal review of property documents for a residential flat purchase.',
        propertyType: 'residential',
        propertyDetails: {
          address: 'Hiranandani Gardens, Powai, Mumbai',
          area: '1,100 sq ft',
          value: 32000000
        },
        clientType: 'individual-buyer',
        clientName: 'Mr. Rohit Patel',
        clientContact: '+91 65432 10987',
        scopeOfWork: [
          'Document verification',
          'Title clearance',
          'Society NOC verification',
          'Legal opinion'
        ],
        priority: 'medium',
        status: 'completed',
        assignedDate: '2024-12-20T11:00:00Z',
        dueDate: '2024-12-28T18:00:00Z',
        completedDate: '2024-12-27T15:30:00Z',
        fee: 18000,
        documents: [
          'Sale Agreement',
          'Society Share Certificate',
          'NOC from Society',
          'Property Tax Receipts'
        ],
        legalOpinion: 'All documents are in order. Property has clear and marketable title. Recommended for purchase.',
        riskGrade: 'low',
        complianceStatus: {
          titleVerification: true,
          encumbranceCheck: true,
          reraCompliance: true,
          governmentApprovals: true
        },
        timeline: {
          assigned: '2024-12-20T11:00:00Z',
          started: '2024-12-20T14:00:00Z',
          reviewed: '2024-12-25T10:00:00Z',
          completed: '2024-12-27T15:30:00Z'
        },
        rating: 5,
        feedback: 'Excellent work. Very thorough analysis and clear recommendations.'
      }
    ]

    setTimeout(() => {
      setCases(mockCases)
      setFilteredCases(mockCases)
      setIsLoading(false)
    }, 1000)
  }, [])

  // Filter cases
  useEffect(() => {
    let filtered = cases

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(case_ => 
        case_.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        case_.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        case_.propertyDetails.address.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter(case_ => case_.status === filterStatus)
    }

    // Priority filter
    if (filterPriority !== 'all') {
      filtered = filtered.filter(case_ => case_.priority === filterPriority)
    }

    // Property type filter
    if (filterPropertyType !== 'all') {
      filtered = filtered.filter(case_ => case_.propertyType === filterPropertyType)
    }

    // Tab filter
    if (activeTab !== 'all') {
      switch (activeTab) {
        case 'active':
          filtered = filtered.filter(case_ => ['assigned', 'under-review', 'clarification-needed'].includes(case_.status))
          break
        case 'completed':
          filtered = filtered.filter(case_ => case_.status === 'completed')
          break
        case 'urgent':
          filtered = filtered.filter(case_ => case_.priority === 'urgent')
          break
      }
    }

    setFilteredCases(filtered)
  }, [cases, searchQuery, filterStatus, filterPriority, filterPropertyType, activeTab])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'assigned': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
      case 'under-review': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
      case 'clarification-needed': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400'
      case 'approved': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
      case 'rejected': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
      case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low': return 'text-green-600 dark:text-green-400'
      case 'medium': return 'text-yellow-600 dark:text-yellow-400'
      case 'high': return 'text-orange-600 dark:text-orange-400'
      case 'urgent': return 'text-red-600 dark:text-red-400'
      default: return 'text-gray-600 dark:text-gray-400'
    }
  }

  const getRiskGradeColor = (grade?: string) => {
    switch (grade) {
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
      case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
    }
  }

  const acceptCase = (caseId: string) => {
    setCases(prev => prev.map(case_ => 
      case_.id === caseId 
        ? { 
            ...case_, 
            status: 'under-review' as const,
            timeline: { ...case_.timeline, started: new Date().toISOString() }
          }
        : case_
    ))
    toast.success('Case accepted and started!')
  }

  const submitOpinion = (caseId: string) => {
    toast.success('Legal opinion submitted for review!')
  }

  const tabs = [
    { id: 'all', label: 'All Cases', count: cases.length },
    { id: 'active', label: 'Active', count: cases.filter(c => ['assigned', 'under-review', 'clarification-needed'].includes(c.status)).length },
    { id: 'completed', label: 'Completed', count: cases.filter(c => c.status === 'completed').length },
    { id: 'urgent', label: 'Urgent', count: cases.filter(c => c.priority === 'urgent').length }
  ]

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading cases...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Legal Cases</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage your legal assignments and due diligence cases
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-950 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Cases</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{cases.length}</p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-2xl">
              <Briefcase className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-950 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Cases</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {cases.filter(c => ['assigned', 'under-review', 'clarification-needed'].includes(c.status)).length}
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
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Completed</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {cases.filter(c => c.status === 'completed').length}
              </p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-2xl">
              <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-950 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Earnings</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                ₹{cases.reduce((sum, c) => sum + c.fee, 0).toLocaleString()}
              </p>
            </div>
            <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-2xl">
              <DollarSign className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>
      </div>

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
                  ? 'bg-blue-600 text-white shadow-lg'
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
              placeholder="Search cases, clients, properties..."
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
            <option value="assigned">Assigned</option>
            <option value="under-review">Under Review</option>
            <option value="clarification-needed">Clarification Needed</option>
            <option value="completed">Completed</option>
          </select>

          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          >
            <option value="all">All Priority</option>
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>

          <select
            value={filterPropertyType}
            onChange={(e) => setFilterPropertyType(e.target.value)}
            className="px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          >
            <option value="all">All Property Types</option>
            <option value="residential">Residential</option>
            <option value="commercial">Commercial</option>
            <option value="industrial">Industrial</option>
            <option value="agricultural">Agricultural</option>
          </select>
        </div>
      </div>

      {/* Cases List */}
      <div className="space-y-4">
        {filteredCases.length === 0 ? (
          <div className="bg-white dark:bg-gray-950 rounded-2xl p-12 border border-gray-200 dark:border-gray-800 shadow-sm text-center">
            <Scale className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No cases found</h3>
            <p className="text-gray-600 dark:text-gray-400">
              {searchQuery || filterStatus !== 'all' || filterPriority !== 'all' || filterPropertyType !== 'all'
                ? 'Try adjusting your search or filters'
                : 'No legal cases assigned yet'
              }
            </p>
          </div>
        ) : (
          filteredCases.map(case_ => (
            <div key={case_.id} className="bg-white dark:bg-gray-950 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-all">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {case_.title}
                        </h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(case_.status)}`}>
                          {case_.status.replace('-', ' ').toUpperCase()}
                        </span>
                        <span className={`text-sm font-medium ${getPriorityColor(case_.priority)} capitalize`}>
                          {case_.priority} Priority
                        </span>
                        {case_.riskGrade && (
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getRiskGradeColor(case_.riskGrade)}`}>
                            {case_.riskGrade.toUpperCase()} RISK
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        Case ID: {case_.id}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                        <User size={16} className="text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{case_.clientName}</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400 capitalize">{case_.clientType.replace('-', ' ')}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                        <Building size={16} className="text-green-600 dark:text-green-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white capitalize">{case_.propertyType}</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">{case_.propertyDetails.area}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                        <DollarSign size={16} className="text-purple-600 dark:text-purple-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">₹{case_.fee.toLocaleString()}</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">Legal Fee</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
                    <div className="flex items-center space-x-1">
                      <MapPin size={16} />
                      <span>{case_.propertyDetails.address}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar size={16} />
                      <span>Due: {new Date(case_.dueDate).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {case_.legalOpinion && (
                    <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg mb-4">
                      <p className="text-sm text-blue-900 dark:text-blue-100">
                        <strong>Legal Opinion:</strong> {case_.legalOpinion}
                      </p>
                    </div>
                  )}

                  {case_.rating && (
                    <div className="flex items-center space-x-2 mb-4">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Client Rating:</span>
                      <div className="flex items-center space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={16}
                            className={i < case_.rating! ? 'text-yellow-400 fill-current' : 'text-gray-300 dark:text-gray-600'}
                          />
                        ))}
                      </div>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">{case_.rating}/5</span>
                    </div>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row lg:flex-col gap-3 mt-4 lg:mt-0 lg:ml-6">
                  <button
                    onClick={() => {
                      setSelectedCase(case_)
                      setShowModal(true)
                    }}
                    className="flex items-center justify-center space-x-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/40 rounded-xl transition-all"
                  >
                    <Eye size={16} />
                    <span>View Details</span>
                  </button>

                  {case_.status === 'assigned' && (
                    <button
                      onClick={() => acceptCase(case_.id)}
                      className="flex items-center justify-center space-x-2 px-4 py-2 bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/40 rounded-xl transition-all"
                    >
                      <CheckCircle size={16} />
                      <span>Accept Case</span>
                    </button>
                  )}

                  {['under-review', 'clarification-needed'].includes(case_.status) && (
                    <button
                      onClick={() => submitOpinion(case_.id)}
                      className="flex items-center justify-center space-x-2 px-4 py-2 bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 hover:bg-purple-200 dark:hover:bg-purple-900/40 rounded-xl transition-all"
                    >
                      <Upload size={16} />
                      <span>Submit Opinion</span>
                    </button>
                  )}

                  <button className="flex items-center justify-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-xl transition-all">
                    <MessageSquare size={16} />
                    <span>Message</span>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Case Details Modal */}
      {showModal && selectedCase && (
        <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-950 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 dark:border-gray-800">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Case Details - {selectedCase.id}
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
              {/* Case Overview */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Case Overview</h3>
                <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">{selectedCase.title}</h4>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">{selectedCase.description}</p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">Status</span>
                      <p className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedCase.status)}`}>
                        {selectedCase.status.replace('-', ' ').toUpperCase()}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">Priority</span>
                      <p className={`font-medium capitalize ${getPriorityColor(selectedCase.priority)}`}>
                        {selectedCase.priority}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">Fee</span>
                      <p className="font-medium text-gray-900 dark:text-white">₹{selectedCase.fee.toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">Due Date</span>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {new Date(selectedCase.dueDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Property Details */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Property Information</h3>
                <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4 space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">Address</span>
                      <p className="font-medium text-gray-900 dark:text-white">{selectedCase.propertyDetails.address}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">Type</span>
                      <p className="font-medium text-gray-900 dark:text-white capitalize">{selectedCase.propertyType}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">Area</span>
                      <p className="font-medium text-gray-900 dark:text-white">{selectedCase.propertyDetails.area}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">Value</span>
                      <p className="font-medium text-gray-900 dark:text-white">₹{selectedCase.propertyDetails.value.toLocaleString()}</p>
                    </div>
                  </div>
                  {selectedCase.propertyDetails.registrationNumber && (
                    <div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">RERA Registration</span>
                      <p className="font-medium text-gray-900 dark:text-white">{selectedCase.propertyDetails.registrationNumber}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Scope of Work */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Scope of Work</h3>
                <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4">
                  <ul className="space-y-2">
                    {selectedCase.scopeOfWork.map((item, index) => (
                      <li key={index} className="flex items-center space-x-2">
                        <CheckCircle size={16} className="text-green-500" />
                        <span className="text-gray-900 dark:text-white">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Compliance Status */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Compliance Status</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Object.entries(selectedCase.complianceStatus).map(([key, value]) => (
                    <div key={key} className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                      <div className="flex items-center space-x-2">
                        {value ? (
                          <CheckCircle size={16} className="text-green-500" />
                        ) : (
                          <AlertTriangle size={16} className="text-yellow-500" />
                        )}
                        <span className="text-sm font-medium text-gray-900 dark:text-white capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Documents */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Documents</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {selectedCase.documents.map((doc, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                      <FileText size={16} className="text-blue-600 dark:text-blue-400" />
                      <span className="text-sm text-gray-900 dark:text-white">{doc}</span>
                      <button className="ml-auto p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                        <Download size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Legal Opinion */}
              {selectedCase.legalOpinion && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Legal Opinion</h3>
                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4">
                    <p className="text-blue-900 dark:text-blue-100">{selectedCase.legalOpinion}</p>
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