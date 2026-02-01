'use client'

import React, { useState, useEffect } from 'react'
import {
  BookOpen,
  Search,
  Filter,
  Download,
  Eye,
  Star,
  Clock,
  Calendar,
  FileText,
  Video,
  Headphones,
  ExternalLink,
  Bookmark,
  Share2,
  Play,
  Pause,
  Volume2,
  ChevronRight,
  ChevronDown,
  Tag,
  User,
  Award,
  CheckCircle,
  AlertCircle,
  Info,
  Lightbulb,
  Scale,
  Shield,
  Building,
  Gavel,
  FileCheck,
  Globe,
  Newspaper,
  Bell,
  TrendingUp,
  Plus,
  X,
  Edit,
  Trash2,
  Archive,
  RefreshCw,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  Flag
} from 'lucide-react'
import toast from 'react-hot-toast'

interface KnowledgeItem {
  id: string
  title: string
  description: string
  type: 'article' | 'video' | 'audio' | 'document' | 'course' | 'webinar' | 'case-study'
  category: 'property-law' | 'rera' | 'documentation' | 'compliance' | 'procedures' | 'updates' | 'best-practices'
  content?: string
  url?: string
  duration?: number
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  tags: string[]
  author: string
  publishedDate: string
  lastUpdated: string
  views: number
  likes: number
  isBookmarked: boolean
  isCompleted: boolean
  progress?: number
  rating: number
  totalRatings: number
  fileSize?: number
  language: string
}

interface Category {
  id: string
  name: string
  description: string
  icon: any
  count: number
  color: string
}

interface Course {
  id: string
  title: string
  description: string
  instructor: string
  duration: number
  modules: number
  enrolled: number
  rating: number
  difficulty: string
  thumbnail: string
  progress: number
  isEnrolled: boolean
  price: number
  category: string
}

export default function KnowledgeBasePage() {
  const [knowledgeItems, setKnowledgeItems] = useState<KnowledgeItem[]>([])
  const [filteredItems, setFilteredItems] = useState<KnowledgeItem[]>([])
  const [courses, setCourses] = useState<Course[]>([])
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedType, setSelectedType] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [selectedItem, setSelectedItem] = useState<KnowledgeItem | null>(null)
  const [showItemModal, setShowItemModal] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const categories: Category[] = [
    {
      id: 'all',
      name: 'All Resources',
      description: 'Browse all knowledge resources',
      icon: BookOpen,
      count: 0,
      color: 'blue'
    },
    {
      id: 'property-law',
      name: 'Property Law',
      description: 'Real estate legal fundamentals',
      icon: Scale,
      count: 0,
      color: 'green'
    },
    {
      id: 'rera',
      name: 'RERA Compliance',
      description: 'Real Estate Regulatory Authority',
      icon: Building,
      count: 0,
      color: 'purple'
    },
    {
      id: 'documentation',
      name: 'Documentation',
      description: 'Legal document templates and guides',
      icon: FileText,
      count: 0,
      color: 'orange'
    },
    {
      id: 'compliance',
      name: 'Compliance',
      description: 'Regulatory compliance guidelines',
      icon: Shield,
      count: 0,
      color: 'red'
    },
    {
      id: 'procedures',
      name: 'Procedures',
      description: 'Step-by-step legal procedures',
      icon: FileCheck,
      count: 0,
      color: 'indigo'
    },
    {
      id: 'updates',
      name: 'Legal Updates',
      description: 'Latest legal news and changes',
      icon: Newspaper,
      count: 0,
      color: 'yellow'
    },
    {
      id: 'best-practices',
      name: 'Best Practices',
      description: 'Industry best practices and tips',
      icon: Lightbulb,
      count: 0,
      color: 'pink'
    }
  ]

  // Mock data
  useEffect(() => {
    const mockKnowledgeItems: KnowledgeItem[] = [
      {
        id: 'KB001',
        title: 'Complete Guide to RERA Compliance 2024',
        description: 'Comprehensive guide covering all aspects of RERA compliance for real estate transactions',
        type: 'article',
        category: 'rera',
        content: 'Detailed article content...',
        difficulty: 'intermediate',
        tags: ['rera', 'compliance', '2024', 'real-estate'],
        author: 'Legal Expert Team',
        publishedDate: '2024-12-30T00:00:00Z',
        lastUpdated: '2024-12-31T00:00:00Z',
        views: 1250,
        likes: 89,
        isBookmarked: true,
        isCompleted: false,
        rating: 4.8,
        totalRatings: 45,
        language: 'English'
      },
      {
        id: 'KB002',
        title: 'Property Due Diligence Checklist',
        description: 'Essential checklist for conducting thorough property due diligence',
        type: 'document',
        category: 'procedures',
        url: '/documents/due-diligence-checklist.pdf',
        difficulty: 'beginner',
        tags: ['due-diligence', 'checklist', 'property'],
        author: 'Advocate Rajesh Kumar',
        publishedDate: '2024-12-28T00:00:00Z',
        lastUpdated: '2024-12-28T00:00:00Z',
        views: 890,
        likes: 67,
        isBookmarked: false,
        isCompleted: true,
        rating: 4.6,
        totalRatings: 32,
        fileSize: 2048000,
        language: 'English'
      },
      {
        id: 'KB003',
        title: 'Understanding Title Verification Process',
        description: 'Step-by-step video guide on property title verification',
        type: 'video',
        category: 'property-law',
        url: '/videos/title-verification.mp4',
        duration: 1800, // 30 minutes
        difficulty: 'intermediate',
        tags: ['title', 'verification', 'property-law'],
        author: 'Senior Legal Advisor',
        publishedDate: '2024-12-25T00:00:00Z',
        lastUpdated: '2024-12-25T00:00:00Z',
        views: 2100,
        likes: 156,
        isBookmarked: true,
        isCompleted: false,
        progress: 65,
        rating: 4.9,
        totalRatings: 78,
        language: 'English'
      },
      {
        id: 'KB004',
        title: 'Latest Supreme Court Judgments on Property Law',
        description: 'Recent landmark judgments affecting real estate transactions',
        type: 'article',
        category: 'updates',
        content: 'Recent judgments analysis...',
        difficulty: 'advanced',
        tags: ['supreme-court', 'judgments', 'property-law', 'updates'],
        author: 'Legal Research Team',
        publishedDate: '2024-12-31T00:00:00Z',
        lastUpdated: '2024-12-31T00:00:00Z',
        views: 567,
        likes: 43,
        isBookmarked: false,
        isCompleted: false,
        rating: 4.7,
        totalRatings: 23,
        language: 'English'
      },
      {
        id: 'KB005',
        title: 'RERA Registration Process Webinar',
        description: 'Live webinar on RERA project registration procedures',
        type: 'webinar',
        category: 'rera',
        url: '/webinars/rera-registration.html',
        duration: 3600, // 60 minutes
        difficulty: 'intermediate',
        tags: ['rera', 'registration', 'webinar', 'live'],
        author: 'RERA Expert Panel',
        publishedDate: '2024-12-29T00:00:00Z',
        lastUpdated: '2024-12-29T00:00:00Z',
        views: 1890,
        likes: 134,
        isBookmarked: true,
        isCompleted: true,
        rating: 4.8,
        totalRatings: 67,
        language: 'English'
      },
      {
        id: 'KB006',
        title: 'Document Templates Collection',
        description: 'Ready-to-use legal document templates for property transactions',
        type: 'document',
        category: 'documentation',
        url: '/templates/legal-documents.zip',
        difficulty: 'beginner',
        tags: ['templates', 'documents', 'legal', 'property'],
        author: 'Template Library',
        publishedDate: '2024-12-27T00:00:00Z',
        lastUpdated: '2024-12-30T00:00:00Z',
        views: 1456,
        likes: 98,
        isBookmarked: false,
        isCompleted: false,
        rating: 4.5,
        totalRatings: 56,
        fileSize: 15728640, // 15MB
        language: 'English'
      }
    ]

    const mockCourses: Course[] = [
      {
        id: 'C001',
        title: 'Advanced Property Law Certification',
        description: 'Comprehensive certification course covering all aspects of property law',
        instructor: 'Prof. Anil Sharma',
        duration: 40,
        modules: 12,
        enrolled: 234,
        rating: 4.9,
        difficulty: 'Advanced',
        thumbnail: '/courses/property-law.jpg',
        progress: 0,
        isEnrolled: false,
        price: 15000,
        category: 'property-law'
      },
      {
        id: 'C002',
        title: 'RERA Compliance Masterclass',
        description: 'Master RERA regulations and compliance requirements',
        instructor: 'Advocate Priya Mehta',
        duration: 25,
        modules: 8,
        enrolled: 189,
        rating: 4.8,
        difficulty: 'Intermediate',
        thumbnail: '/courses/rera-compliance.jpg',
        progress: 75,
        isEnrolled: true,
        price: 12000,
        category: 'rera'
      },
      {
        id: 'C003',
        title: 'Legal Documentation Best Practices',
        description: 'Learn to create and review legal documents effectively',
        instructor: 'Senior Advocate Kumar',
        duration: 18,
        modules: 6,
        enrolled: 156,
        rating: 4.7,
        difficulty: 'Beginner',
        thumbnail: '/courses/documentation.jpg',
        progress: 100,
        isEnrolled: true,
        price: 8000,
        category: 'documentation'
      }
    ]

    setTimeout(() => {
      setKnowledgeItems(mockKnowledgeItems)
      setFilteredItems(mockKnowledgeItems)
      setCourses(mockCourses)
      setIsLoading(false)
    }, 1000)
  }, [])

  // Update category counts
  useEffect(() => {
    categories.forEach(category => {
      if (category.id === 'all') {
        category.count = knowledgeItems.length
      } else {
        category.count = knowledgeItems.filter((item: KnowledgeItem) => item.category === category.id).length
      }
    })
  }, [knowledgeItems])

  // Filter items
  useEffect(() => {
    let filtered = knowledgeItems

    if (selectedCategory !== 'all') {
      filtered = filtered.filter((item: KnowledgeItem) => item.category === selectedCategory)
    }

    if (selectedType !== 'all') {
      filtered = filtered.filter((item: KnowledgeItem) => item.type === selectedType)
    }

    if (searchQuery) {
      filtered = filtered.filter((item: KnowledgeItem) =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.tags.some((tag: string) => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
        item.author.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    setFilteredItems(filtered)
  }, [knowledgeItems, selectedCategory, selectedType, searchQuery])

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'article': return <FileText className="w-5 h-5 text-blue-500" />
      case 'video': return <Video className="w-5 h-5 text-red-500" />
      case 'audio': return <Headphones className="w-5 h-5 text-green-500" />
      case 'document': return <FileText className="w-5 h-5 text-purple-500" />
      case 'course': return <BookOpen className="w-5 h-5 text-orange-500" />
      case 'webinar': return <Video className="w-5 h-5 text-indigo-500" />
      case 'case-study': return <FileCheck className="w-5 h-5 text-pink-500" />
      default: return <FileText className="w-5 h-5 text-gray-500" />
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
      case 'intermediate': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
      case 'advanced': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
    }
  }

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    if (hours > 0) return `${hours}h ${minutes}m`
    return `${minutes}m`
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const toggleBookmark = (itemId: string) => {
    setKnowledgeItems((prev: KnowledgeItem[]) => prev.map((item: KnowledgeItem) =>
      item.id === itemId ? { ...item, isBookmarked: !item.isBookmarked } : item
    ))
    toast.success('Bookmark updated!')
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading knowledge base...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Knowledge Base</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Access legal resources, courses, and documentation
          </p>
        </div>
        <div className="flex items-center space-x-3 mt-4 sm:mt-0">
          <button className="flex items-center space-x-2 px-4 py-2 bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/40 rounded-xl transition-all">
            <Plus size={20} />
            <span>Suggest Resource</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/40 rounded-xl transition-all">
            <Bell size={20} />
            <span>Subscribe Updates</span>
          </button>
        </div>
      </div>

      {/* Featured Courses */}
      <div className="bg-white dark:bg-gray-950 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Featured Courses</h3>
          <button className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium">
            View All Courses
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course: Course) => (
            <div key={course.id} className="border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden hover:shadow-md transition-all">
              <div className="h-32 bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                <BookOpen className="w-12 h-12 text-white" />
              </div>

              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(course.difficulty.toLowerCase())}`}>
                    {course.difficulty}
                  </span>
                  <div className="flex items-center space-x-1">
                    <Star size={14} className="text-yellow-400 fill-current" />
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      {course.rating}
                    </span>
                  </div>
                </div>

                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">{course.title}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                  {course.description}
                </p>

                <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-3">
                  <span>{course.instructor}</span>
                  <span>{course.duration}h • {course.modules} modules</span>
                </div>

                {course.isEnrolled ? (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Progress</span>
                      <span className="font-medium text-gray-900 dark:text-white">{course.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${course.progress}%` }}
                      ></div>
                    </div>
                    <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all">
                      {course.progress === 100 ? 'Review Course' : 'Continue Learning'}
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-gray-900 dark:text-white">
                        ₹{course.price.toLocaleString()}
                      </span>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {course.enrolled} enrolled
                      </span>
                    </div>
                    <button className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all">
                      Enroll Now
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
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

            {/* Quick Stats */}
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-800">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Your Progress</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Completed</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {knowledgeItems.filter((item: KnowledgeItem) => item.isCompleted).length}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Bookmarked</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {knowledgeItems.filter((item: KnowledgeItem) => item.isBookmarked).length}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">In Progress</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {knowledgeItems.filter((item: KnowledgeItem) => item.progress && item.progress > 0 && item.progress < 100).length}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Knowledge Items */}
        <div className="lg:col-span-3 space-y-6">
          {/* Search and Filters */}
          <div className="bg-white dark:bg-gray-950 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search resources, topics, authors..."
                  value={searchQuery}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>

              <select
                value={selectedType}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedType(e.target.value)}
                className="px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                <option value="all">All Types</option>
                <option value="article">Articles</option>
                <option value="video">Videos</option>
                <option value="document">Documents</option>
                <option value="webinar">Webinars</option>
                <option value="case-study">Case Studies</option>
              </select>
            </div>
          </div>

          {/* Knowledge Items Grid */}
          {filteredItems.length === 0 ? (
            <div className="bg-white dark:bg-gray-950 rounded-2xl p-12 border border-gray-200 dark:border-gray-800 shadow-sm text-center">
              <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No resources found</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                No resources match your current search and filters
              </p>
              <button className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all mx-auto">
                <Plus size={20} />
                <span>Suggest a Resource</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredItems.map((item: KnowledgeItem) => (
                <div key={item.id} className="bg-white dark:bg-gray-950 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-all">
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        {getTypeIcon(item.type)}
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-white text-sm line-clamp-2">
                            {item.title}
                          </h3>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            by {item.author}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => toggleBookmark(item.id)}
                        className={`p-2 rounded-lg transition-all ${item.isBookmarked
                          ? 'text-yellow-500 hover:text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20'
                          : 'text-gray-400 hover:text-yellow-500 hover:bg-yellow-50 dark:hover:bg-yellow-900/20'
                          }`}
                      >
                        <Bookmark size={16} fill={item.isBookmarked ? 'currentColor' : 'none'} />
                      </button>
                    </div>

                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
                      {item.description}
                    </p>

                    <div className="flex items-center space-x-2 mb-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(item.difficulty)}`}>
                        {item.difficulty.toUpperCase()}
                      </span>
                      <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-full text-xs">
                        {item.type.replace('-', ' ').toUpperCase()}
                      </span>
                      {item.isCompleted && (
                        <CheckCircle size={16} className="text-green-500" />
                      )}
                    </div>

                    {item.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-4">
                        {item.tags.slice(0, 3).map((tag: string) => (
                          <span key={tag} className="px-2 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded text-xs">
                            #{tag}
                          </span>
                        ))}
                        {item.tags.length > 3 && (
                          <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded text-xs">
                            +{item.tags.length - 3}
                          </span>
                        )}
                      </div>
                    )}

                    {item.progress !== undefined && item.progress > 0 && (
                      <div className="mb-4">
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="text-gray-600 dark:text-gray-400">Progress</span>
                          <span className="font-medium text-gray-900 dark:text-white">{item.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-1">
                          <div
                            className="bg-blue-500 h-1 rounded-full transition-all duration-500"
                            style={{ width: `${item.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-4">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1">
                          <Eye size={14} />
                          <span>{item.views}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <ThumbsUp size={14} />
                          <span>{item.likes}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Star size={14} className="text-yellow-400" />
                          <span>{item.rating}</span>
                        </div>
                      </div>
                      {item.duration && (
                        <span>{formatDuration(item.duration)}</span>
                      )}
                      {item.fileSize && (
                        <span>{formatFileSize(item.fileSize)}</span>
                      )}
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => {
                          setSelectedItem(item)
                          setShowItemModal(true)
                        }}
                        className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all"
                      >
                        <Eye size={16} />
                        <span>View</span>
                      </button>
                      {item.url && (
                        <button className="p-2 text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/20 rounded-xl transition-all">
                          <Download size={16} />
                        </button>
                      )}
                      <button className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all">
                        <Share2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Item Detail Modal */}
      {showItemModal && selectedItem && (
        <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-950 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 dark:border-gray-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {getTypeIcon(selectedItem.type)}
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                      {selectedItem.title}
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      by {selectedItem.author} • {new Date(selectedItem.publishedDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowItemModal(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Item Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                  <p className="text-gray-900 dark:text-white mb-4">
                    {selectedItem.description}
                  </p>

                  {selectedItem.content && (
                    <div className="prose dark:prose-invert max-w-none">
                      <p>{selectedItem.content}</p>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Details</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Type:</span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {selectedItem.type.replace('-', ' ').toUpperCase()}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Difficulty:</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(selectedItem.difficulty)}`}>
                          {selectedItem.difficulty.toUpperCase()}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Views:</span>
                        <span className="font-medium text-gray-900 dark:text-white">{selectedItem.views}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Rating:</span>
                        <div className="flex items-center space-x-1">
                          <Star size={14} className="text-yellow-400 fill-current" />
                          <span className="font-medium text-gray-900 dark:text-white">
                            {selectedItem.rating} ({selectedItem.totalRatings})
                          </span>
                        </div>
                      </div>
                      {selectedItem.duration && (
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Duration:</span>
                          <span className="font-medium text-gray-900 dark:text-white">
                            {formatDuration(selectedItem.duration)}
                          </span>
                        </div>
                      )}
                      {selectedItem.fileSize && (
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600 dark:text-gray-400">File Size:</span>
                          <span className="font-medium text-gray-900 dark:text-white">
                            {formatFileSize(selectedItem.fileSize)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {selectedItem.tags.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Tags</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedItem.tags.map((tag: string) => (
                          <span key={tag} className="px-3 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-full text-sm">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200 dark:border-gray-800">
                {selectedItem.url && (
                  <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all">
                    <ExternalLink size={16} />
                    <span>Open Resource</span>
                  </button>
                )}
                <button className="flex items-center space-x-2 px-4 py-2 bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/40 rounded-xl transition-all">
                  <Download size={16} />
                  <span>Download</span>
                </button>
                <button
                  onClick={() => toggleBookmark(selectedItem.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all ${selectedItem.isBookmarked
                    ? 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400 hover:bg-yellow-200 dark:hover:bg-yellow-900/40'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                >
                  <Bookmark size={16} fill={selectedItem.isBookmarked ? 'currentColor' : 'none'} />
                  <span>{selectedItem.isBookmarked ? 'Bookmarked' : 'Bookmark'}</span>
                </button>
                <button className="flex items-center space-x-2 px-4 py-2 bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 hover:bg-purple-200 dark:hover:bg-purple-900/40 rounded-xl transition-all">
                  <Share2 size={16} />
                  <span>Share</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}