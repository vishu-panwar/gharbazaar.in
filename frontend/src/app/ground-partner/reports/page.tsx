'use client'

import { useState, useEffect } from 'react'
import { 
  FileText, 
  Download, 
  Calendar, 
  Filter, 
  Search, 
  Eye, 
  Upload, 
  Camera, 
  MapPin, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Star,
  TrendingUp,
  BarChart3,
  PieChart,
  FileCheck,
  Image,
  Video,
  Paperclip,
  Plus,
  Edit,
  Trash2,
  Share
} from 'lucide-react'
import toast from 'react-hot-toast'

interface Report {
  id: string
  visitId: string
  propertyTitle: string
  propertyType: string
  address: string
  clientName: string
  reportType: 'site-visit' | 'verification' | 'inspection' | 'documentation'
  status: 'draft' | 'submitted' | 'approved' | 'rejected'
  createdAt: string
  submittedAt?: string
  approvedAt?: string
  rating?: number
  earnings: number
  photos: string[]
  videos: string[]
  documents: string[]
  notes: string
  findings: {
    propertyCondition: string
    legalStatus: string
    marketValue: string
    recommendations: string[]
  }
  checklist: {
    item: string
    status: 'completed' | 'pending' | 'na'
    notes?: string
  }[]
}

export default function ReportsPage() {
  const [reports, setReports] = useState<Report[]>([])
  const [filteredReports, setFilteredReports] = useState<Report[]>([])
  const [selectedReport, setSelectedReport] = useState<Report | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [activeTab, setActiveTab] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterType, setFilterType] = useState('all')
  const [dateRange, setDateRange] = useState({ from: '', to: '' })
  const [isLoading, setIsLoading] = useState(true)

  // Mock data
  useEffect(() => {
    const mockReports: Report[] = [
      {
        id: 'R001',
        visitId: 'V001',
        propertyTitle: '3BHK Apartment in Bandra West',
        propertyType: 'Apartment',
        address: 'Hill Road, Bandra West, Mumbai',
        clientName: 'Priya Sharma',
        reportType: 'site-visit',
        status: 'approved',
        createdAt: '2024-12-29T10:00:00Z',
        submittedAt: '2024-12-29T14:30:00Z',
        approvedAt: '2024-12-29T16:00:00Z',
        rating: 5,
        earnings: 800,
        photos: ['photo1.jpg', 'photo2.jpg', 'photo3.jpg'],
        videos: ['video1.mp4'],
        documents: ['legal_doc.pdf'],
        notes: 'Property is in excellent condition with all amenities working properly.',
        findings: {
          propertyCondition: 'Excellent',
          legalStatus: 'Clear',
          marketValue: '₹1.2 Crores',
          recommendations: ['Ready for immediate possession', 'Good investment opportunity']
        },
        checklist: [
          { item: 'Property Structure', status: 'completed', notes: 'No structural issues found' },
          { item: 'Electrical Systems', status: 'completed', notes: 'All systems working' },
          { item: 'Plumbing', status: 'completed', notes: 'No leakage issues' },
          { item: 'Legal Documents', status: 'completed', notes: 'All documents verified' }
        ]
      },
      {
        id: 'R002',
        visitId: 'V002',
        propertyTitle: '2BHK Villa in Andheri East',
        propertyType: 'Villa',
        address: 'Chakala, Andheri East, Mumbai',
        clientName: 'Rahul Gupta',
        reportType: 'inspection',
        status: 'submitted',
        createdAt: '2024-12-30T09:00:00Z',
        submittedAt: '2024-12-30T15:00:00Z',
        rating: 4,
        earnings: 600,
        photos: ['photo4.jpg', 'photo5.jpg'],
        videos: [],
        documents: ['inspection_report.pdf'],
        notes: 'Minor maintenance required in kitchen area.',
        findings: {
          propertyCondition: 'Good',
          legalStatus: 'Clear',
          marketValue: '₹85 Lakhs',
          recommendations: ['Minor repairs needed', 'Good for rental investment']
        },
        checklist: [
          { item: 'Property Structure', status: 'completed', notes: 'Minor cracks in wall' },
          { item: 'Electrical Systems', status: 'completed', notes: 'Working properly' },
          { item: 'Plumbing', status: 'pending', notes: 'Kitchen tap needs repair' },
          { item: 'Legal Documents', status: 'completed', notes: 'Verified' }
        ]
      },
      {
        id: 'R003',
        visitId: 'V003',
        propertyTitle: 'Commercial Space in Lower Parel',
        propertyType: 'Commercial',
        address: 'Senapati Bapat Marg, Lower Parel, Mumbai',
        clientName: 'Amit Patel',
        reportType: 'verification',
        status: 'draft',
        createdAt: '2024-12-31T08:00:00Z',
        earnings: 500,
        photos: ['photo6.jpg'],
        videos: [],
        documents: [],
        notes: 'Initial verification completed, pending final documentation.',
        findings: {
          propertyCondition: 'Average',
          legalStatus: 'Under Review',
          marketValue: '₹2.5 Crores',
          recommendations: ['Requires legal clearance', 'Commercial potential is high']
        },
        checklist: [
          { item: 'Property Structure', status: 'completed', notes: 'Commercial grade structure' },
          { item: 'Electrical Systems', status: 'completed', notes: 'Industrial grade wiring' },
          { item: 'Fire Safety', status: 'pending', notes: 'NOC pending' },
          { item: 'Legal Documents', status: 'pending', notes: 'Under verification' }
        ]
      }
    ]

    setTimeout(() => {
      setReports(mockReports)
      setFilteredReports(mockReports)
      setIsLoading(false)
    }, 1000)
  }, [])

  // Filter reports
  useEffect(() => {
    let filtered = reports

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(report => 
        report.propertyTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        report.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        report.clientName.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter(report => report.status === filterStatus)
    }

    // Type filter
    if (filterType !== 'all') {
      filtered = filtered.filter(report => report.reportType === filterType)
    }

    // Date range filter
    if (dateRange.from && dateRange.to) {
      filtered = filtered.filter(report => {
        const reportDate = new Date(report.createdAt).toISOString().split('T')[0]
        return reportDate >= dateRange.from && reportDate <= dateRange.to
      })
    }

    // Tab filter
    if (activeTab !== 'all') {
      filtered = filtered.filter(report => report.status === activeTab)
    }

    setFilteredReports(filtered)
  }, [reports, searchQuery, filterStatus, filterType, dateRange, activeTab])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
      case 'submitted': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
      case 'approved': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
      case 'rejected': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'site-visit': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
      case 'verification': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400'
      case 'inspection': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400'
      case 'documentation': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
    }
  }

  const downloadReport = (reportId: string) => {
    toast.success('Report downloaded successfully!')
  }

  const shareReport = (reportId: string) => {
    toast.success('Report shared successfully!')
  }

  const tabs = [
    { id: 'all', label: 'All Reports', count: reports.length },
    { id: 'draft', label: 'Drafts', count: reports.filter(r => r.status === 'draft').length },
    { id: 'submitted', label: 'Submitted', count: reports.filter(r => r.status === 'submitted').length },
    { id: 'approved', label: 'Approved', count: reports.filter(r => r.status === 'approved').length }
  ]

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading reports...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Reports</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage your site visit reports and documentation
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex items-center space-x-3">
          <button className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-medium rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl">
            <Plus size={20} />
            <span>New Report</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-950 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Reports</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{reports.length}</p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-2xl">
              <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-950 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Approved</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {reports.filter(r => r.status === 'approved').length}
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
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pending</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {reports.filter(r => r.status === 'submitted').length}
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
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Earnings</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                ₹{reports.reduce((sum, r) => sum + r.earnings, 0).toLocaleString()}
              </p>
            </div>
            <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-2xl">
              <TrendingUp className="w-6 h-6 text-purple-600 dark:text-purple-400" />
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
              placeholder="Search reports..."
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
            <option value="draft">Draft</option>
            <option value="submitted">Submitted</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
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
          </select>

          <button className="flex items-center justify-center space-x-2 px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all">
            <Calendar size={20} className="text-gray-600 dark:text-gray-400" />
            <span className="text-gray-600 dark:text-gray-400">Date Range</span>
          </button>
        </div>
      </div>

      {/* Reports List */}
      <div className="space-y-4">
        {filteredReports.length === 0 ? (
          <div className="bg-white dark:bg-gray-950 rounded-2xl p-12 border border-gray-200 dark:border-gray-800 shadow-sm text-center">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No reports found</h3>
            <p className="text-gray-600 dark:text-gray-400">
              {searchQuery || filterStatus !== 'all' || filterType !== 'all'
                ? 'Try adjusting your search or filters'
                : 'You haven\'t created any reports yet'
              }
            </p>
          </div>
        ) : (
          filteredReports.map(report => (
            <div key={report.id} className="bg-white dark:bg-gray-950 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-all">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {report.propertyTitle}
                        </h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                          {report.status.toUpperCase()}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getTypeColor(report.reportType)}`}>
                          {report.reportType.replace('-', ' ').toUpperCase()}
                        </span>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                        <div className="flex items-center space-x-1">
                          <MapPin size={16} />
                          <span>{report.address}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar size={16} />
                          <span>{new Date(report.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                        <FileCheck size={16} className="text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{report.clientName}</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">Client</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                        <Camera size={16} className="text-green-600 dark:text-green-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{report.photos.length} Photos</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">{report.videos.length} Videos</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                        <TrendingUp size={16} className="text-purple-600 dark:text-purple-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">₹{report.earnings}</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">Earnings</p>
                      </div>
                    </div>

                    {report.rating && (
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
                          <Star size={16} className="text-yellow-600 dark:text-yellow-400" />
                        </div>
                        <div>
                          <div className="flex items-center space-x-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                size={12}
                                className={i < report.rating! ? 'text-yellow-400 fill-current' : 'text-gray-300 dark:text-gray-600'}
                              />
                            ))}
                          </div>
                          <p className="text-xs text-gray-600 dark:text-gray-400">Rating</p>
                        </div>
                      </div>
                    )}
                  </div>

                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                    {report.notes}
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row lg:flex-col gap-3 mt-4 lg:mt-0 lg:ml-6">
                  <button
                    onClick={() => {
                      setSelectedReport(report)
                      setShowModal(true)
                    }}
                    className="flex items-center justify-center space-x-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/40 rounded-xl transition-all"
                  >
                    <Eye size={16} />
                    <span>View</span>
                  </button>

                  <button
                    onClick={() => downloadReport(report.id)}
                    className="flex items-center justify-center space-x-2 px-4 py-2 bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/40 rounded-xl transition-all"
                  >
                    <Download size={16} />
                    <span>Download</span>
                  </button>

                  <button
                    onClick={() => shareReport(report.id)}
                    className="flex items-center justify-center space-x-2 px-4 py-2 bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 hover:bg-purple-200 dark:hover:bg-purple-900/40 rounded-xl transition-all"
                  >
                    <Share size={16} />
                    <span>Share</span>
                  </button>

                  {report.status === 'draft' && (
                    <button className="flex items-center justify-center space-x-2 px-4 py-2 bg-orange-100 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 hover:bg-orange-200 dark:hover:bg-orange-900/40 rounded-xl transition-all">
                      <Edit size={16} />
                      <span>Edit</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Report Details Modal */}
      {showModal && selectedReport && (
        <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-950 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 dark:border-gray-800">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Report Details - {selectedReport.id}
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
              {/* Property & Client Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Property Information</h3>
                  <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4 space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Property:</span>
                      <span className="font-medium text-gray-900 dark:text-white">{selectedReport.propertyTitle}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Type:</span>
                      <span className="font-medium text-gray-900 dark:text-white">{selectedReport.propertyType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Address:</span>
                      <span className="font-medium text-gray-900 dark:text-white text-right">{selectedReport.address}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Report Information</h3>
                  <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4 space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Client:</span>
                      <span className="font-medium text-gray-900 dark:text-white">{selectedReport.clientName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Type:</span>
                      <span className="font-medium text-gray-900 dark:text-white capitalize">{selectedReport.reportType.replace('-', ' ')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Status:</span>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedReport.status)}`}>
                        {selectedReport.status.toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Findings */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Key Findings</h3>
                <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4 space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">Property Condition</span>
                      <p className="font-medium text-gray-900 dark:text-white">{selectedReport.findings.propertyCondition}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">Legal Status</span>
                      <p className="font-medium text-gray-900 dark:text-white">{selectedReport.findings.legalStatus}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">Market Value</span>
                      <p className="font-medium text-gray-900 dark:text-white">{selectedReport.findings.marketValue}</p>
                    </div>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">Recommendations</span>
                    <ul className="mt-2 space-y-1">
                      {selectedReport.findings.recommendations.map((rec, index) => (
                        <li key={index} className="flex items-center space-x-2">
                          <CheckCircle size={16} className="text-green-500" />
                          <span className="text-gray-900 dark:text-white">{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Checklist */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Inspection Checklist</h3>
                <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4">
                  <div className="space-y-3">
                    {selectedReport.checklist.map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg">
                        <div className="flex items-center space-x-3">
                          {item.status === 'completed' ? (
                            <CheckCircle size={20} className="text-green-500" />
                          ) : item.status === 'pending' ? (
                            <Clock size={20} className="text-yellow-500" />
                          ) : (
                            <AlertCircle size={20} className="text-gray-400" />
                          )}
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">{item.item}</p>
                            {item.notes && (
                              <p className="text-sm text-gray-600 dark:text-gray-400">{item.notes}</p>
                            )}
                          </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          item.status === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' :
                          item.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400' :
                          'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
                        }`}>
                          {item.status.toUpperCase()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Media */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Media & Documents</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4">
                    <div className="flex items-center space-x-2 mb-3">
                      <Image size={20} className="text-blue-600 dark:text-blue-400" />
                      <span className="font-medium text-gray-900 dark:text-white">Photos ({selectedReport.photos.length})</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {selectedReport.photos.slice(0, 4).map((photo, index) => (
                        <div key={index} className="aspect-square bg-gray-200 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                          <Camera className="w-6 h-6 text-gray-400" />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4">
                    <div className="flex items-center space-x-2 mb-3">
                      <Video size={20} className="text-purple-600 dark:text-purple-400" />
                      <span className="font-medium text-gray-900 dark:text-white">Videos ({selectedReport.videos.length})</span>
                    </div>
                    <div className="space-y-2">
                      {selectedReport.videos.map((video, index) => (
                        <div key={index} className="p-3 bg-white dark:bg-gray-800 rounded-lg flex items-center space-x-2">
                          <Video size={16} className="text-purple-600 dark:text-purple-400" />
                          <span className="text-sm text-gray-900 dark:text-white">Video {index + 1}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4">
                    <div className="flex items-center space-x-2 mb-3">
                      <Paperclip size={20} className="text-green-600 dark:text-green-400" />
                      <span className="font-medium text-gray-900 dark:text-white">Documents ({selectedReport.documents.length})</span>
                    </div>
                    <div className="space-y-2">
                      {selectedReport.documents.map((doc, index) => (
                        <div key={index} className="p-3 bg-white dark:bg-gray-800 rounded-lg flex items-center space-x-2">
                          <FileText size={16} className="text-green-600 dark:text-green-400" />
                          <span className="text-sm text-gray-900 dark:text-white">{doc}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Notes</h3>
                <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4">
                  <p className="text-gray-900 dark:text-white">{selectedReport.notes}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}