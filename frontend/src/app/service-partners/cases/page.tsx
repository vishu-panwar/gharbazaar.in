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
  Target,
  ShieldCheck,
  ChevronRight,
  X
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

import { backendApi, isBackendUnavailableError } from '@/lib/backendApi'

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
  const [kycStatus, setKycStatus] = useState<string | null>(null)
  const [showAddServiceModal, setShowAddServiceModal] = useState(false)
  const [serviceFormData, setServiceFormData] = useState({
    category: 'lawyer',
    specialization: '',
    hourlyRate: '',
    location: '',
    description: '',
    skills: '',
    experience: '',
    name: '',
    contact: '',
    email: '',
    address: ''
  })
  const [isSubmittingService, setIsSubmittingService] = useState(false)

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true)

      try {
        const response = await backendApi.partners.getCases()
        if (response?.success) {
          const caseData = response.data || []

          const mappedCases: LegalCase[] = caseData.map((c: any) => ({
            id: c.id,
            title: c.description || 'Property Service Case',
            description: c.details || c.description || 'No detailed description provided.',
            propertyType: (c.propertyType?.toLowerCase() as any) || 'residential',
            propertyDetails: {
              address: c.propertyName || 'N/A',
              area: 'N/A',
              value: c.amount || 0,
              registrationNumber: c.id
            },
            clientType: 'individual-buyer',
            clientName: c.clientName || 'GharBazaar Client',
            clientContact: c.clientPhone || 'N/A',
            scopeOfWork: ['Legal Due Diligence', 'Verification'],
            priority: (c.priority?.toLowerCase() as any) || 'medium',
            status: (c.status?.toLowerCase() as any) || 'assigned',
            assignedDate: c.createdAt,
            dueDate: c.updatedAt,
            fee: c.amount || 0,
            documents: [],
            complianceStatus: {
              titleVerification: false,
              encumbranceCheck: false,
              reraCompliance: false,
              governmentApprovals: false
            },
            timeline: {
              assigned: c.createdAt
            }
          }))

          setCases(mappedCases)
          setFilteredCases(mappedCases)
        } else {
          setCases([])
          setFilteredCases([])
        }
      } catch (error) {
        setCases([])
        setFilteredCases([])
        if (!isBackendUnavailableError(error)) {
          console.error('Error fetching cases:', error)
          toast.error('Failed to load cases')
        }
      }

      try {
        const kycResponse = await backendApi.kyc.getStatus()
        if (kycResponse?.success) {
          setKycStatus(kycResponse.data.status)
          // Pre-fill form with user info if available
          const profile = kycResponse.data.request || {}
          setServiceFormData(prev => ({
            ...prev,
            name: profile.fullName || '',
            contact: profile.contactNumber || '',
            email: kycResponse.data.user?.email || '',
            address: profile.address || ''
          }))
        } else {
          setKycStatus(null)
        }
      } catch (error) {
        setKycStatus(null)
        if (!isBackendUnavailableError(error)) {
          console.error('Error fetching KYC status:', error)
        }
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
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

  const handleAddService = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmittingService(true)
    try {
      const payload = {
        ...serviceFormData,
        skills: serviceFormData.skills.split(',').map(s => s.trim()).filter(s => s),
        hourlyRate: parseFloat(serviceFormData.hourlyRate) || 0,
        experience: parseInt(serviceFormData.experience) || 0
      }
      const response = await backendApi.serviceProvider.create(payload)
      if (response?.success) {
        toast.success('Service added successfully!')
        setShowAddServiceModal(false)
        setServiceFormData({
          category: 'lawyer',
          specialization: '',
          hourlyRate: '',
          location: '',
          description: '',
          skills: '',
          experience: '',
          name: serviceFormData.name,
          contact: serviceFormData.contact,
          email: serviceFormData.email,
          address: serviceFormData.address
        })
      } else {
        const details = response?.details ? ` ${response.details}` : ''
        toast.error((response?.error || 'Failed to add service') + details)
      }
    } catch (error) {
      console.error('Error adding service:', error)
      toast.error('Something went wrong')
    } finally {
      setIsSubmittingService(false)
    }
  }

  const tabs = [
    { id: 'all', label: 'All Cases', count: cases.length },
    { id: 'active', label: 'Active', count: cases.filter(c => ['assigned', 'under-review', 'clarification-needed'].includes(c.status)).length },
    { id: 'completed', label: 'Completed', count: cases.filter(c => c.status === 'completed').length },
    { id: 'urgent', label: 'Urgent', count: cases.filter(c => c.priority === 'urgent').length }
  ]
  const handleAddServiceClick = () => {
    setShowAddServiceModal(true)
  }

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
        <div className="mt-4 sm:mt-0 flex flex-col sm:items-end gap-2">
          <button
            onClick={handleAddServiceClick}
            className="flex items-center space-x-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl font-semibold shadow-md hover:bg-blue-700 transition-all"
          >
            <Plus size={20} />
            <span>Add Service</span>
          </button>
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
      {/* Add Service Modal */}
      {showAddServiceModal && (
        <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-950 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white">
                  <Briefcase size={20} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">Add Your Professional Service</h2>
                  <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">List your expertise on GharBazaar Marketplace</p>
                </div>
              </div>
              <button
                onClick={() => setShowAddServiceModal(false)}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddService} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Service Category</label>
                  <select
                    value={serviceFormData.category}
                    onChange={(e) => setServiceFormData({...serviceFormData, category: e.target.value})}
                    className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="lawyer">Property Lawyer</option>
                    <option value="architect">Architect</option>
                    <option value="interior-designer">Interior Designer</option>
                    <option value="painter">Painter</option>
                    <option value="contractor">Civil Contractor</option>
                    <option value="vastu">Vastu Consultant</option>
                    <option value="inspector">Property Inspector</option>
                    <option value="movers">Packers & Movers</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Specialization</label>
                  <input
                    type="text"
                    value={serviceFormData.specialization}
                    onChange={(e) => setServiceFormData({...serviceFormData, specialization: e.target.value})}
                    placeholder="e.g. Real Estate Law, Modern Architecture"
                    className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Hourly Rate (₹)</label>
                  <input
                    type="number"
                    value={serviceFormData.hourlyRate}
                    onChange={(e) => setServiceFormData({...serviceFormData, hourlyRate: e.target.value})}
                    placeholder="500"
                    className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Years of Experience</label>
                  <input
                    type="number"
                    value={serviceFormData.experience}
                    onChange={(e) => setServiceFormData({...serviceFormData, experience: e.target.value})}
                    placeholder="5"
                    className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Location</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    type="text"
                    value={serviceFormData.location}
                    onChange={(e) => setServiceFormData({...serviceFormData, location: e.target.value})}
                    placeholder="City, State"
                    className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Skills (Comma separated)</label>
                <input
                  type="text"
                  value={serviceFormData.skills}
                  onChange={(e) => setServiceFormData({...serviceFormData, skills: e.target.value})}
                  placeholder="Java, Python, React (comma separated)"
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Service Description</label>
                <textarea
                  value={serviceFormData.description}
                  onChange={(e) => setServiceFormData({...serviceFormData, description: e.target.value})}
                  rows={4}
                  placeholder="Describe your services, approach and what clients can expect..."
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="pt-4 border-t border-gray-200 dark:border-gray-800 flex gap-4">
                <button
                  type="button"
                  onClick={() => setShowAddServiceModal(false)}
                  className="flex-1 px-6 py-3 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-2xl font-bold hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingService}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-bold shadow-lg hover:shadow-xl disabled:opacity-50 transition-all flex items-center justify-center space-x-2"
                >
                  {isSubmittingService ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <CheckCircle size={20} />
                      <span>Post Service</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
