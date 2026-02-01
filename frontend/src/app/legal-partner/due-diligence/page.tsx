'use client'

import { useState, useEffect } from 'react'
import { 
  FileCheck, 
  Search, 
  Filter, 
  Calendar, 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  Eye, 
  Download, 
  Upload, 
  Shield, 
  Scale, 
  Gavel, 
  Building, 
  MapPin, 
  User, 
  Star, 
  Target, 
  FileText, 
  Plus, 
  Edit, 
  Save, 
  X, 
  AlertCircle,
  Info,
  ExternalLink
} from 'lucide-react'
import toast from 'react-hot-toast'

interface DueDiligenceCase {
  id: string
  caseId: string
  propertyTitle: string
  propertyType: string
  clientName: string
  assignedDate: string
  dueDate: string
  status: 'pending' | 'in-progress' | 'completed' | 'requires-clarification'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  checklist: ChecklistItem[]
  legalOpinion: string
  riskGrade: 'low' | 'medium' | 'high' | null
  recommendations: string[]
  complianceScore: number
  lastUpdated: string
}

interface ChecklistItem {
  id: string
  category: 'title' | 'encumbrance' | 'rera' | 'approvals' | 'documentation'
  item: string
  description: string
  status: 'pending' | 'verified' | 'issues-found' | 'not-applicable'
  notes: string
  documents: string[]
  verifiedDate?: string
  verifiedBy?: string
  priority: 'critical' | 'important' | 'standard'
}

export default function DueDiligencePage() {
  const [cases, setCases] = useState<DueDiligenceCase[]>([])
  const [filteredCases, setFilteredCases] = useState<DueDiligenceCase[]>([])
  const [selectedCase, setSelectedCase] = useState<DueDiligenceCase | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [activeTab, setActiveTab] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [editingOpinion, setEditingOpinion] = useState(false)
  const [tempOpinion, setTempOpinion] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  // Mock data
  useEffect(() => {
    const mockCases: DueDiligenceCase[] = [
      {
        id: 'DD001',
        caseId: 'LC001',
        propertyTitle: 'Luxury Apartment - Worli',
        propertyType: 'Residential',
        clientName: 'Mr. Arjun Mehta',
        assignedDate: '2024-12-30T10:00:00Z',
        dueDate: '2025-01-05T18:00:00Z',
        status: 'in-progress',
        priority: 'high',
        legalOpinion: '',
        riskGrade: null,
        recommendations: [],
        complianceScore: 65,
        lastUpdated: '2024-12-31T14:30:00Z',
        checklist: [
          {
            id: 'C001',
            category: 'title',
            item: 'Title Deed Verification',
            description: 'Verify the authenticity and validity of the title deed',
            status: 'verified',
            notes: 'Title deed is clear and authentic. No encumbrances found.',
            documents: ['title_deed.pdf', 'survey_settlement.pdf'],
            verifiedDate: '2024-12-31T10:00:00Z',
            verifiedBy: 'Advocate Rajesh Kumar',
            priority: 'critical'
          },
          {
            id: 'C002',
            category: 'title',
            item: 'Chain of Ownership',
            description: 'Verify the complete chain of ownership for the past 30 years',
            status: 'verified',
            notes: 'Complete chain verified. All transfers are legitimate.',
            documents: ['ownership_chain.pdf'],
            verifiedDate: '2024-12-31T11:30:00Z',
            verifiedBy: 'Advocate Rajesh Kumar',
            priority: 'critical'
          },
          {
            id: 'C003',
            category: 'encumbrance',
            item: 'Encumbrance Certificate',
            description: 'Check for any encumbrances, mortgages, or liens',
            status: 'verified',
            notes: 'No encumbrances found in the past 30 years.',
            documents: ['encumbrance_cert.pdf'],
            verifiedDate: '2024-12-31T12:00:00Z',
            verifiedBy: 'Advocate Rajesh Kumar',
            priority: 'critical'
          },
          {
            id: 'C004',
            category: 'rera',
            item: 'RERA Registration',
            description: 'Verify RERA registration and compliance',
            status: 'pending',
            notes: '',
            documents: [],
            priority: 'important'
          },
          {
            id: 'C005',
            category: 'approvals',
            item: 'Building Approvals',
            description: 'Verify municipal building approvals and NOCs',
            status: 'issues-found',
            notes: 'Minor discrepancy in approved vs actual construction. Seeking clarification.',
            documents: ['building_approval.pdf'],
            priority: 'important'
          }
        ]
      },
      {
        id: 'DD002',
        caseId: 'LC002',
        propertyTitle: 'Commercial Complex - Andheri',
        propertyType: 'Commercial',
        clientName: 'Prestige Constructions',
        assignedDate: '2024-12-28T14:30:00Z',
        dueDate: '2025-01-02T18:00:00Z',
        status: 'requires-clarification',
        priority: 'urgent',
        legalOpinion: 'Property shows good compliance with RERA requirements. Minor documentation gaps identified that need developer clarification.',
        riskGrade: 'medium',
        recommendations: [
          'Obtain updated RERA compliance certificate',
          'Clarify environmental clearance status',
          'Update project completion timeline'
        ],
        complianceScore: 78,
        lastUpdated: '2024-12-30T16:45:00Z',
        checklist: [
          {
            id: 'C006',
            category: 'rera',
            item: 'RERA Project Registration',
            description: 'Verify project registration with RERA authority',
            status: 'verified',
            notes: 'Project properly registered with MahaRERA.',
            documents: ['rera_registration.pdf'],
            verifiedDate: '2024-12-29T09:00:00Z',
            verifiedBy: 'Advocate Rajesh Kumar',
            priority: 'critical'
          },
          {
            id: 'C007',
            category: 'approvals',
            item: 'Environmental Clearance',
            description: 'Check environmental clearance and compliance',
            status: 'issues-found',
            notes: 'Environmental clearance expires soon. Need updated certificate.',
            documents: ['env_clearance.pdf'],
            priority: 'critical'
          }
        ]
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

    if (searchQuery) {
      filtered = filtered.filter(case_ => 
        case_.propertyTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        case_.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        case_.caseId.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    if (filterStatus !== 'all') {
      filtered = filtered.filter(case_ => case_.status === filterStatus)
    }

    if (activeTab !== 'all') {
      switch (activeTab) {
        case 'pending':
          filtered = filtered.filter(case_ => case_.status === 'pending')
          break
        case 'in-progress':
          filtered = filtered.filter(case_ => case_.status === 'in-progress')
          break
        case 'completed':
          filtered = filtered.filter(case_ => case_.status === 'completed')
          break
      }
    }

    setFilteredCases(filtered)
  }, [cases, searchQuery, filterStatus, activeTab])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
      case 'in-progress': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
      case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
      case 'requires-clarification': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
    }
  }

  const getChecklistStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
      case 'verified': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
      case 'issues-found': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
      case 'not-applicable': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
    }
  }

  const getRiskGradeColor = (grade: string | null) => {
    switch (grade) {
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
      case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'title': return <Scale size={16} />
      case 'encumbrance': return <Shield size={16} />
      case 'rera': return <Building size={16} />
      case 'approvals': return <Gavel size={16} />
      case 'documentation': return <FileText size={16} />
      default: return <FileCheck size={16} />
    }
  }

  const updateChecklistItem = (caseId: string, itemId: string, updates: Partial<ChecklistItem>) => {
    setCases(prev => prev.map(case_ => 
      case_.id === caseId 
        ? {
            ...case_,
            checklist: case_.checklist.map(item => 
              item.id === itemId ? { ...item, ...updates } : item
            ),
            lastUpdated: new Date().toISOString()
          }
        : case_
    ))
    toast.success('Checklist item updated!')
  }

  const saveLegalOpinion = () => {
    if (selectedCase) {
      setCases(prev => prev.map(case_ => 
        case_.id === selectedCase.id 
          ? { ...case_, legalOpinion: tempOpinion, lastUpdated: new Date().toISOString() }
          : case_
      ))
      setSelectedCase({ ...selectedCase, legalOpinion: tempOpinion })
      setEditingOpinion(false)
      toast.success('Legal opinion saved!')
    }
  }

  const tabs = [
    { id: 'all', label: 'All Cases', count: cases.length },
    { id: 'pending', label: 'Pending', count: cases.filter(c => c.status === 'pending').length },
    { id: 'in-progress', label: 'In Progress', count: cases.filter(c => c.status === 'in-progress').length },
    { id: 'completed', label: 'Completed', count: cases.filter(c => c.status === 'completed').length }
  ]

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading due diligence cases...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Legal Due Diligence</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Comprehensive legal verification and compliance checks
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
              <FileCheck className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-950 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">In Progress</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {cases.filter(c => c.status === 'in-progress').length}
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
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg Compliance</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {Math.round(cases.reduce((sum, c) => sum + c.complianceScore, 0) / cases.length)}%
              </p>
            </div>
            <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-2xl">
              <Target className="w-6 h-6 text-purple-600 dark:text-purple-400" />
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
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search cases..."
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
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="requires-clarification">Requires Clarification</option>
          </select>
        </div>
      </div>

      {/* Cases List */}
      <div className="space-y-4">
        {filteredCases.length === 0 ? (
          <div className="bg-white dark:bg-gray-950 rounded-2xl p-12 border border-gray-200 dark:border-gray-800 shadow-sm text-center">
            <FileCheck className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No cases found</h3>
            <p className="text-gray-600 dark:text-gray-400">
              No due diligence cases match your current filters
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
                          {case_.propertyTitle}
                        </h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(case_.status)}`}>
                          {case_.status.replace('-', ' ').toUpperCase()}
                        </span>
                        {case_.riskGrade && (
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getRiskGradeColor(case_.riskGrade)}`}>
                            {case_.riskGrade.toUpperCase()} RISK
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Case ID: {case_.caseId} • Client: {case_.clientName}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                        <Target size={16} className="text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{case_.complianceScore}%</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">Compliance Score</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                        <CheckCircle size={16} className="text-green-600 dark:text-green-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {case_.checklist.filter(item => item.status === 'verified').length}/{case_.checklist.length}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">Items Verified</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
                        <Calendar size={16} className="text-orange-600 dark:text-orange-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {new Date(case_.dueDate).toLocaleDateString()}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">Due Date</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                    <span>Last Updated: {new Date(case_.lastUpdated).toLocaleDateString()}</span>
                    {case_.recommendations.length > 0 && (
                      <span>{case_.recommendations.length} recommendations</span>
                    )}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row lg:flex-col gap-3 mt-4 lg:mt-0 lg:ml-6">
                  <button
                    onClick={() => {
                      setSelectedCase(case_)
                      setTempOpinion(case_.legalOpinion)
                      setShowModal(true)
                    }}
                    className="flex items-center justify-center space-x-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/40 rounded-xl transition-all"
                  >
                    <Eye size={16} />
                    <span>Review</span>
                  </button>

                  <button className="flex items-center justify-center space-x-2 px-4 py-2 bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/40 rounded-xl transition-all">
                    <Download size={16} />
                    <span>Export</span>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Due Diligence Modal */}
      {showModal && selectedCase && (
        <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-950 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 dark:border-gray-800">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Due Diligence - {selectedCase.propertyTitle}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Case Overview */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Target className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    <span className="font-medium text-blue-900 dark:text-blue-100">Compliance Score</span>
                  </div>
                  <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">{selectedCase.complianceScore}%</div>
                </div>

                <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                    <span className="font-medium text-green-900 dark:text-green-100">Verified Items</span>
                  </div>
                  <div className="text-2xl font-bold text-green-900 dark:text-green-100">
                    {selectedCase.checklist.filter(item => item.status === 'verified').length}/{selectedCase.checklist.length}
                  </div>
                </div>

                <div className="bg-orange-50 dark:bg-orange-900/20 rounded-xl p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <AlertTriangle className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                    <span className="font-medium text-orange-900 dark:text-orange-100">Issues Found</span>
                  </div>
                  <div className="text-2xl font-bold text-orange-900 dark:text-orange-100">
                    {selectedCase.checklist.filter(item => item.status === 'issues-found').length}
                  </div>
                </div>
              </div>

              {/* Checklist */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Legal Checklist</h3>
                <div className="space-y-4">
                  {selectedCase.checklist.map(item => (
                    <div key={item.id} className="border border-gray-200 dark:border-gray-800 rounded-xl p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-start space-x-3">
                          <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                            {getCategoryIcon(item.category)}
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900 dark:text-white">{item.item}</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{item.description}</p>
                            {item.priority === 'critical' && (
                              <span className="inline-flex items-center space-x-1 text-xs text-red-600 dark:text-red-400 mt-1">
                                <AlertCircle size={12} />
                                <span>Critical</span>
                              </span>
                            )}
                          </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getChecklistStatusColor(item.status)}`}>
                          {item.status.replace('-', ' ').toUpperCase()}
                        </span>
                      </div>

                      {item.notes && (
                        <div className="mb-3 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                          <p className="text-sm text-gray-900 dark:text-white">{item.notes}</p>
                        </div>
                      )}

                      {item.documents.length > 0 && (
                        <div className="mb-3">
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Documents:</span>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {item.documents.map((doc, index) => (
                              <span key={index} className="inline-flex items-center space-x-1 px-2 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded text-xs">
                                <FileText size={12} />
                                <span>{doc}</span>
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {item.verifiedDate && (
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          Verified on {new Date(item.verifiedDate).toLocaleDateString()} by {item.verifiedBy}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Legal Opinion */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Legal Opinion</h3>
                  {!editingOpinion && (
                    <button
                      onClick={() => setEditingOpinion(true)}
                      className="flex items-center space-x-2 px-3 py-2 bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/40 rounded-lg transition-all"
                    >
                      <Edit size={16} />
                      <span>Edit</span>
                    </button>
                  )}
                </div>

                {editingOpinion ? (
                  <div className="space-y-4">
                    <textarea
                      value={tempOpinion}
                      onChange={(e) => setTempOpinion(e.target.value)}
                      className="w-full h-32 px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                      placeholder="Enter your legal opinion and recommendations..."
                    />
                    <div className="flex space-x-3">
                      <button
                        onClick={saveLegalOpinion}
                        className="flex items-center space-x-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-all"
                      >
                        <Save size={16} />
                        <span>Save Opinion</span>
                      </button>
                      <button
                        onClick={() => {
                          setEditingOpinion(false)
                          setTempOpinion(selectedCase.legalOpinion)
                        }}
                        className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-all"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4">
                    {selectedCase.legalOpinion ? (
                      <p className="text-gray-900 dark:text-white">{selectedCase.legalOpinion}</p>
                    ) : (
                      <p className="text-gray-500 dark:text-gray-400 italic">No legal opinion provided yet.</p>
                    )}
                  </div>
                )}
              </div>

              {/* Recommendations */}
              {selectedCase.recommendations.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recommendations</h3>
                  <div className="space-y-2">
                    {selectedCase.recommendations.map((rec, index) => (
                      <div key={index} className="flex items-center space-x-2 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                        <Info size={16} className="text-yellow-600 dark:text-yellow-400" />
                        <span className="text-yellow-900 dark:text-yellow-100">{rec}</span>
                      </div>
                    ))}
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