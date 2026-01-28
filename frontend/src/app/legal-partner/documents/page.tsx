'use client'

import { useState, useEffect } from 'react'
import { 
  FileText, 
  Upload, 
  Download, 
  Eye, 
  Search, 
  Filter, 
  Calendar, 
  Shield, 
  Lock, 
  Star, 
  Folder, 
  FolderOpen, 
  Plus, 
  Edit, 
  Trash2, 
  Share2, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  User, 
  Tag, 
  Archive, 
  ExternalLink,
  FileImage,
  FileVideo,
  File,
  X,
  MoreVertical,
  Copy,
  Move,
  History,
  Info,
  Paperclip,
  Bookmark,
  Grid,
  List
} from 'lucide-react'
import toast from 'react-hot-toast'

interface Document {
  id: string
  name: string
  type: 'pdf' | 'doc' | 'docx' | 'jpg' | 'png' | 'mp4' | 'other'
  category: 'title-documents' | 'agreements' | 'approvals' | 'legal-opinions' | 'correspondence' | 'compliance' | 'court-orders' | 'misc'
  size: number
  uploadedDate: string
  lastModified: string
  uploadedBy: string
  caseId?: string
  propertyId?: string
  status: 'active' | 'archived' | 'under-review' | 'confidential'
  tags: string[]
  version: number
  versions: DocumentVersion[]
  watermarked: boolean
  encrypted: boolean
  accessLevel: 'public' | 'restricted' | 'confidential' | 'top-secret'
  downloadCount: number
  lastAccessed?: string
  description?: string
  isStarred: boolean
}

interface DocumentVersion {
  version: number
  uploadedDate: string
  uploadedBy: string
  changes: string
  size: number
}

interface DocumentCategory {
  id: string
  name: string
  description: string
  icon: any
  count: number
  color: string
}

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([])
  const [filteredDocuments, setFilteredDocuments] = useState<Document[]>([])
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null)
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [showPreviewModal, setShowPreviewModal] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [dragOver, setDragOver] = useState(false)

  const categories: DocumentCategory[] = [
    {
      id: 'all',
      name: 'All Documents',
      description: 'View all documents',
      icon: FileText,
      count: 0,
      color: 'blue'
    },
    {
      id: 'title-documents',
      name: 'Title Documents',
      description: 'Property titles, deeds, ownership papers',
      icon: Shield,
      count: 0,
      color: 'green'
    },
    {
      id: 'agreements',
      name: 'Agreements',
      description: 'Sale agreements, MOUs, contracts',
      icon: FileText,
      count: 0,
      color: 'purple'
    },
    {
      id: 'approvals',
      name: 'Approvals & NOCs',
      description: 'Government approvals, clearances',
      icon: CheckCircle,
      count: 0,
      color: 'orange'
    },
    {
      id: 'legal-opinions',
      name: 'Legal Opinions',
      description: 'Legal reports, due diligence reports',
      icon: Star,
      count: 0,
      color: 'yellow'
    },
    {
      id: 'correspondence',
      name: 'Correspondence',
      description: 'Letters, emails, communications',
      icon: FileText,
      count: 0,
      color: 'indigo'
    },
    {
      id: 'compliance',
      name: 'Compliance',
      description: 'RERA, tax, regulatory documents',
      icon: Lock,
      count: 0,
      color: 'red'
    },
    {
      id: 'court-orders',
      name: 'Court Orders',
      description: 'Court judgments, orders, legal notices',
      icon: AlertTriangle,
      count: 0,
      color: 'gray'
    }
  ]

  // Mock data
  useEffect(() => {
    const mockDocuments: Document[] = [
      {
        id: 'DOC001',
        name: 'Property_Title_Deed_Worli.pdf',
        type: 'pdf',
        category: 'title-documents',
        size: 2048576, // 2MB
        uploadedDate: '2024-12-30T10:00:00Z',
        lastModified: '2024-12-30T10:00:00Z',
        uploadedBy: 'Advocate Rajesh Kumar',
        caseId: 'LC001',
        propertyId: 'PROP001',
        status: 'active',
        tags: ['title', 'worli', 'residential'],
        version: 1,
        versions: [
          {
            version: 1,
            uploadedDate: '2024-12-30T10:00:00Z',
            uploadedBy: 'Advocate Rajesh Kumar',
            changes: 'Initial upload',
            size: 2048576
          }
        ],
        watermarked: true,
        encrypted: true,
        accessLevel: 'confidential',
        downloadCount: 5,
        lastAccessed: '2024-12-31T14:30:00Z',
        description: 'Original title deed for luxury apartment in Worli',
        isStarred: true
      },
      {
        id: 'DOC002',
        name: 'Sale_Agreement_Draft_v2.docx',
        type: 'docx',
        category: 'agreements',
        size: 1024000, // 1MB
        uploadedDate: '2024-12-29T15:30:00Z',
        lastModified: '2024-12-30T09:15:00Z',
        uploadedBy: 'Legal Team',
        caseId: 'LC001',
        status: 'under-review',
        tags: ['agreement', 'draft', 'sale'],
        version: 2,
        versions: [
          {
            version: 1,
            uploadedDate: '2024-12-29T15:30:00Z',
            uploadedBy: 'Legal Team',
            changes: 'Initial draft',
            size: 980000
          },
          {
            version: 2,
            uploadedDate: '2024-12-30T09:15:00Z',
            uploadedBy: 'Advocate Rajesh Kumar',
            changes: 'Updated terms and conditions',
            size: 1024000
          }
        ],
        watermarked: true,
        encrypted: true,
        accessLevel: 'restricted',
        downloadCount: 12,
        lastAccessed: '2024-12-31T11:20:00Z',
        description: 'Sale agreement draft with updated terms',
        isStarred: false
      },
      {
        id: 'DOC003',
        name: 'RERA_Certificate_MahaRERA.pdf',
        type: 'pdf',
        category: 'compliance',
        size: 512000, // 512KB
        uploadedDate: '2024-12-28T11:45:00Z',
        lastModified: '2024-12-28T11:45:00Z',
        uploadedBy: 'Developer',
        caseId: 'LC002',
        status: 'active',
        tags: ['rera', 'compliance', 'maharera'],
        version: 1,
        versions: [
          {
            version: 1,
            uploadedDate: '2024-12-28T11:45:00Z',
            uploadedBy: 'Developer',
            changes: 'Initial upload',
            size: 512000
          }
        ],
        watermarked: true,
        encrypted: true,
        accessLevel: 'public',
        downloadCount: 8,
        lastAccessed: '2024-12-30T16:45:00Z',
        description: 'RERA registration certificate from MahaRERA',
        isStarred: false
      },
      {
        id: 'DOC004',
        name: 'Legal_Opinion_Property_Verification.pdf',
        type: 'pdf',
        category: 'legal-opinions',
        size: 3072000, // 3MB
        uploadedDate: '2024-12-31T14:00:00Z',
        lastModified: '2024-12-31T14:00:00Z',
        uploadedBy: 'Advocate Rajesh Kumar',
        caseId: 'LC001',
        status: 'confidential',
        tags: ['legal-opinion', 'verification', 'due-diligence'],
        version: 1,
        versions: [
          {
            version: 1,
            uploadedDate: '2024-12-31T14:00:00Z',
            uploadedBy: 'Advocate Rajesh Kumar',
            changes: 'Initial legal opinion',
            size: 3072000
          }
        ],
        watermarked: true,
        encrypted: true,
        accessLevel: 'top-secret',
        downloadCount: 2,
        lastAccessed: '2024-12-31T14:30:00Z',
        description: 'Comprehensive legal opinion on property verification',
        isStarred: true
      },
      {
        id: 'DOC005',
        name: 'Building_Approval_Plan.jpg',
        type: 'jpg',
        category: 'approvals',
        size: 4096000, // 4MB
        uploadedDate: '2024-12-27T09:20:00Z',
        lastModified: '2024-12-27T09:20:00Z',
        uploadedBy: 'Municipal Authority',
        caseId: 'LC002',
        status: 'active',
        tags: ['building', 'approval', 'plan'],
        version: 1,
        versions: [
          {
            version: 1,
            uploadedDate: '2024-12-27T09:20:00Z',
            uploadedBy: 'Municipal Authority',
            changes: 'Initial upload',
            size: 4096000
          }
        ],
        watermarked: true,
        encrypted: false,
        accessLevel: 'restricted',
        downloadCount: 15,
        lastAccessed: '2024-12-30T12:10:00Z',
        description: 'Approved building plan from municipal authority',
        isStarred: false
      }
    ]

    setTimeout(() => {
      setDocuments(mockDocuments)
      setFilteredDocuments(mockDocuments)
      setIsLoading(false)
    }, 1000)
  }, [])

  // Update category counts
  useEffect(() => {
    categories.forEach(category => {
      if (category.id === 'all') {
        category.count = documents.length
      } else {
        category.count = documents.filter(doc => doc.category === category.id).length
      }
    })
  }, [documents])

  // Filter documents
  useEffect(() => {
    let filtered = documents

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(doc => doc.category === selectedCategory)
    }

    if (searchQuery) {
      filtered = filtered.filter(doc => 
        doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
        doc.caseId?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    setFilteredDocuments(filtered)
  }, [documents, selectedCategory, searchQuery])

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf':
        return <FileText className="w-8 h-8 text-red-500" />
      case 'doc':
      case 'docx':
        return <FileText className="w-8 h-8 text-blue-500" />
      case 'jpg':
      case 'png':
        return <FileImage className="w-8 h-8 text-green-500" />
      case 'mp4':
        return <FileVideo className="w-8 h-8 text-purple-500" />
      default:
        return <File className="w-8 h-8 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
      case 'archived': return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
      case 'under-review': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
      case 'confidential': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
    }
  }

  const getAccessLevelColor = (level: string) => {
    switch (level) {
      case 'public': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
      case 'restricted': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
      case 'confidential': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400'
      case 'top-secret': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const handleFileUpload = (files: FileList | null) => {
    if (!files) return

    Array.from(files).forEach(file => {
      // Simulate upload progress
      setUploadProgress(0)
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval)
            toast.success(`${file.name} uploaded successfully!`)
            return 100
          }
          return prev + 10
        })
      }, 200)
    })
  }

  const toggleStar = (docId: string) => {
    setDocuments(prev => prev.map(doc => 
      doc.id === docId ? { ...doc, isStarred: !doc.isStarred } : doc
    ))
    toast.success('Document updated!')
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading documents...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Document Management</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Secure document storage with version control and encryption
          </p>
        </div>
        <button
          onClick={() => setShowUploadModal(true)}
          className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl hover:shadow-lg transition-all duration-300"
        >
          <Upload size={20} />
          <span>Upload Documents</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-950 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Documents</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{documents.length}</p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-2xl">
              <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-950 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Encrypted</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {documents.filter(d => d.encrypted).length}
              </p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-2xl">
              <Shield className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-950 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Starred</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {documents.filter(d => d.isStarred).length}
              </p>
            </div>
            <div className="p-3 bg-yellow-100 dark:bg-yellow-900/20 rounded-2xl">
              <Star className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-950 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Size</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatFileSize(documents.reduce((sum, doc) => sum + doc.size, 0))}
              </p>
            </div>
            <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-2xl">
              <Archive className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Categories Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-950 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Categories</h3>
            <div className="space-y-2">
              {categories.map(category => {
                const Icon = category.icon
                const isActive = selectedCategory === category.id
                return (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`
                      w-full flex items-center justify-between p-3 rounded-xl transition-all
                      ${isActive 
                        ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' 
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                      }
                    `}
                  >
                    <div className="flex items-center space-x-3">
                      <Icon size={18} />
                      <span className="font-medium text-sm">{category.name}</span>
                    </div>
                    <span className={`
                      px-2 py-1 rounded-full text-xs font-bold
                      ${isActive 
                        ? 'bg-blue-200 dark:bg-blue-800 text-blue-700 dark:text-blue-300' 
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                      }
                    `}>
                      {category.count}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Documents Area */}
        <div className="lg:col-span-3 space-y-6">
          {/* Search and Filters */}
          <div className="bg-white dark:bg-gray-950 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search documents, tags, case IDs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
              
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                  className="flex items-center space-x-2 px-4 py-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-xl transition-all"
                >
                  {viewMode === 'grid' ? <List size={20} /> : <Grid size={20} />}
                  <span className="hidden sm:inline">{viewMode === 'grid' ? 'List' : 'Grid'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Documents Grid/List */}
          {filteredDocuments.length === 0 ? (
            <div className="bg-white dark:bg-gray-950 rounded-2xl p-12 border border-gray-200 dark:border-gray-800 shadow-sm text-center">
              <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No documents found</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                No documents match your current search and filters
              </p>
              <button
                onClick={() => setShowUploadModal(true)}
                className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all mx-auto"
              >
                <Upload size={20} />
                <span>Upload First Document</span>
              </button>
            </div>
          ) : (
            <div className={`
              ${viewMode === 'grid' 
                ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6' 
                : 'space-y-4'
              }
            `}>
              {filteredDocuments.map(doc => (
                <div key={doc.id} className={`
                  bg-white dark:bg-gray-950 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-all
                  ${viewMode === 'grid' ? 'p-6' : 'p-4'}
                `}>
                  {viewMode === 'grid' ? (
                    // Grid View
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          {getFileIcon(doc.type)}
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-gray-900 dark:text-white truncate text-sm">
                              {doc.name}
                            </h3>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {formatFileSize(doc.size)} • v{doc.version}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => toggleStar(doc.id)}
                          className={`p-2 rounded-lg transition-all ${
                            doc.isStarred 
                              ? 'text-yellow-500 hover:text-yellow-600' 
                              : 'text-gray-400 hover:text-yellow-500'
                          }`}
                        >
                          <Star size={16} fill={doc.isStarred ? 'currentColor' : 'none'} />
                        </button>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(doc.status)}`}>
                            {doc.status.replace('-', ' ').toUpperCase()}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getAccessLevelColor(doc.accessLevel)}`}>
                            {doc.accessLevel.replace('-', ' ').toUpperCase()}
                          </span>
                        </div>

                        {doc.encrypted && (
                          <div className="flex items-center space-x-1 text-green-600 dark:text-green-400">
                            <Lock size={12} />
                            <span className="text-xs font-medium">Encrypted</span>
                          </div>
                        )}

                        {doc.watermarked && (
                          <div className="flex items-center space-x-1 text-blue-600 dark:text-blue-400">
                            <Shield size={12} />
                            <span className="text-xs font-medium">Watermarked</span>
                          </div>
                        )}
                      </div>

                      {doc.description && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                          {doc.description}
                        </p>
                      )}

                      {doc.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {doc.tags.slice(0, 3).map(tag => (
                            <span key={tag} className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded text-xs">
                              {tag}
                            </span>
                          ))}
                          {doc.tags.length > 3 && (
                            <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded text-xs">
                              +{doc.tags.length - 3}
                            </span>
                          )}
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-800">
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(doc.uploadedDate).toLocaleDateString()}
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => {
                              setSelectedDocument(doc)
                              setShowPreviewModal(true)
                            }}
                            className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/20 rounded-lg transition-all"
                          >
                            <Eye size={16} />
                          </button>
                          <button className="p-2 text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/20 rounded-lg transition-all">
                            <Download size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    // List View
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 flex-1 min-w-0">
                        {getFileIcon(doc.type)}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2">
                            <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                              {doc.name}
                            </h3>
                            {doc.isStarred && (
                              <Star size={16} className="text-yellow-500" fill="currentColor" />
                            )}
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                            <span>{formatFileSize(doc.size)}</span>
                            <span>v{doc.version}</span>
                            <span>{new Date(doc.uploadedDate).toLocaleDateString()}</span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(doc.status)}`}>
                              {doc.status.replace('-', ' ').toUpperCase()}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => {
                            setSelectedDocument(doc)
                            setShowPreviewModal(true)
                          }}
                          className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/20 rounded-lg transition-all"
                        >
                          <Eye size={16} />
                        </button>
                        <button className="p-2 text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/20 rounded-lg transition-all">
                          <Download size={16} />
                        </button>
                        <button className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all">
                          <MoreVertical size={16} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-950 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 max-w-2xl w-full">
            <div className="p-6 border-b border-gray-200 dark:border-gray-800">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Upload Documents</h2>
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            <div className="p-6">
              <div
                className={`
                  border-2 border-dashed rounded-2xl p-8 text-center transition-all
                  ${dragOver 
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                    : 'border-gray-300 dark:border-gray-700 hover:border-blue-400'
                  }
                `}
                onDragOver={(e) => {
                  e.preventDefault()
                  setDragOver(true)
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={(e) => {
                  e.preventDefault()
                  setDragOver(false)
                  handleFileUpload(e.dataTransfer.files)
                }}
              >
                <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Drop files here or click to browse
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Support for PDF, DOC, DOCX, JPG, PNG files up to 10MB
                </p>
                <input
                  type="file"
                  multiple
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  onChange={(e) => handleFileUpload(e.target.files)}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="inline-flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all cursor-pointer"
                >
                  <Plus size={20} />
                  <span>Select Files</span>
                </label>
              </div>

              {uploadProgress > 0 && uploadProgress < 100 && (
                <div className="mt-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Uploading...</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                </div>
              )}

              <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl border border-yellow-200 dark:border-yellow-800">
                <div className="flex items-start space-x-2">
                  <Shield className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-yellow-800 dark:text-yellow-200">Security Notice</h4>
                    <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                      All uploaded documents are automatically encrypted and watermarked for security. 
                      Confidential documents require additional access approval.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Document Preview Modal */}
      {showPreviewModal && selectedDocument && (
        <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-950 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 dark:border-gray-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {getFileIcon(selectedDocument.type)}
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                      {selectedDocument.name}
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {formatFileSize(selectedDocument.size)} • Version {selectedDocument.version}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowPreviewModal(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Document Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
                    <div className="mt-1">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedDocument.status)}`}>
                        {selectedDocument.status.replace('-', ' ').toUpperCase()}
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Access Level</label>
                    <div className="mt-1">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getAccessLevelColor(selectedDocument.accessLevel)}`}>
                        {selectedDocument.accessLevel.replace('-', ' ').toUpperCase()}
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Uploaded By</label>
                    <p className="text-gray-900 dark:text-white">{selectedDocument.uploadedBy}</p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Upload Date</label>
                    <p className="text-gray-900 dark:text-white">
                      {new Date(selectedDocument.uploadedDate).toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Security Features</label>
                    <div className="mt-1 space-y-2">
                      {selectedDocument.encrypted && (
                        <div className="flex items-center space-x-2 text-green-600 dark:text-green-400">
                          <Lock size={16} />
                          <span className="text-sm">End-to-end encrypted</span>
                        </div>
                      )}
                      {selectedDocument.watermarked && (
                        <div className="flex items-center space-x-2 text-blue-600 dark:text-blue-400">
                          <Shield size={16} />
                          <span className="text-sm">Watermarked</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Download Count</label>
                    <p className="text-gray-900 dark:text-white">{selectedDocument.downloadCount} times</p>
                  </div>

                  {selectedDocument.lastAccessed && (
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Last Accessed</label>
                      <p className="text-gray-900 dark:text-white">
                        {new Date(selectedDocument.lastAccessed).toLocaleString()}
                      </p>
                    </div>
                  )}

                  {selectedDocument.caseId && (
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Case ID</label>
                      <p className="text-gray-900 dark:text-white">{selectedDocument.caseId}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Description */}
              {selectedDocument.description && (
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
                  <p className="mt-1 text-gray-900 dark:text-white">{selectedDocument.description}</p>
                </div>
              )}

              {/* Tags */}
              {selectedDocument.tags.length > 0 && (
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Tags</label>
                  <div className="mt-1 flex flex-wrap gap-2">
                    {selectedDocument.tags.map(tag => (
                      <span key={tag} className="px-3 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-full text-sm">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Version History */}
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 block">Version History</label>
                <div className="space-y-3">
                  {selectedDocument.versions.map(version => (
                    <div key={version.version} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-xl">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-gray-900 dark:text-white">
                            Version {version.version}
                          </span>
                          {version.version === selectedDocument.version && (
                            <span className="px-2 py-1 bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded text-xs font-medium">
                              Current
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {version.changes} • {formatFileSize(version.size)}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(version.uploadedDate).toLocaleString()} by {version.uploadedBy}
                        </p>
                      </div>
                      <button className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/20 rounded-lg transition-all">
                        <Download size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200 dark:border-gray-800">
                <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all">
                  <Download size={16} />
                  <span>Download</span>
                </button>
                <button className="flex items-center space-x-2 px-4 py-2 bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/40 rounded-xl transition-all">
                  <Share2 size={16} />
                  <span>Share</span>
                </button>
                <button className="flex items-center space-x-2 px-4 py-2 bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400 hover:bg-yellow-200 dark:hover:bg-yellow-900/40 rounded-xl transition-all">
                  <Edit size={16} />
                  <span>Edit Details</span>
                </button>
                <button
                  onClick={() => toggleStar(selectedDocument.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all ${
                    selectedDocument.isStarred
                      ? 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400 hover:bg-yellow-200 dark:hover:bg-yellow-900/40'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  <Star size={16} fill={selectedDocument.isStarred ? 'currentColor' : 'none'} />
                  <span>{selectedDocument.isStarred ? 'Unstar' : 'Star'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}