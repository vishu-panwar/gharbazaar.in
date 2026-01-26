'use client'

import { useState, useEffect } from 'react'
import { 
  BookOpen, 
  Play, 
  Download, 
  Clock, 
  CheckCircle, 
  Star, 
  Award, 
  Users, 
  FileText, 
  Video, 
  Headphones,
  Search,
  Filter,
  Eye,
  PlayCircle,
  PauseCircle,
  Volume2,
  Bookmark,
  Share,
  ThumbsUp,
  MessageSquare,
  Calendar,
  Target,
  TrendingUp,
  Lightbulb,
  Shield,
  Camera,
  MapPin,
  Gavel,
  Home,
  Calculator,
  Smartphone
} from 'lucide-react'
import toast from 'react-hot-toast'

interface Course {
  id: string
  title: string
  description: string
  category: 'basics' | 'advanced' | 'legal' | 'technology' | 'safety'
  type: 'video' | 'document' | 'interactive' | 'webinar'
  duration: number // in minutes
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  instructor: string
  rating: number
  enrolledCount: number
  completionRate: number
  isCompleted: boolean
  isBookmarked: boolean
  progress: number // percentage
  thumbnail: string
  tags: string[]
  createdAt: string
  updatedAt: string
}

interface LearningPath {
  id: string
  title: string
  description: string
  courses: string[]
  estimatedTime: number
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  completedCourses: number
  totalCourses: number
  progress: number
}

interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  unlockedAt?: string
  progress: number
  target: number
}

export default function LearningPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [learningPaths, setLearningPaths] = useState<LearningPath[]>([])
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([])
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [activeTab, setActiveTab] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [filterCategory, setFilterCategory] = useState('all')
  const [filterType, setFilterType] = useState('all')
  const [isLoading, setIsLoading] = useState(true)

  // Mock data
  useEffect(() => {
    const mockCourses: Course[] = [
      {
        id: 'C001',
        title: 'Property Verification Fundamentals',
        description: 'Learn the basics of property verification, documentation requirements, and legal compliance.',
        category: 'basics',
        type: 'video',
        duration: 45,
        difficulty: 'beginner',
        instructor: 'Rajesh Kumar',
        rating: 4.8,
        enrolledCount: 1250,
        completionRate: 89,
        isCompleted: true,
        isBookmarked: false,
        progress: 100,
        thumbnail: '/course1.jpg',
        tags: ['verification', 'documentation', 'legal'],
        createdAt: '2024-11-15T00:00:00Z',
        updatedAt: '2024-12-01T00:00:00Z'
      },
      {
        id: 'C002',
        title: 'Advanced Site Inspection Techniques',
        description: 'Master advanced inspection methods, quality assessment, and detailed reporting.',
        category: 'advanced',
        type: 'video',
        duration: 60,
        difficulty: 'advanced',
        instructor: 'Priya Sharma',
        rating: 4.9,
        enrolledCount: 850,
        completionRate: 76,
        isCompleted: false,
        isBookmarked: true,
        progress: 65,
        thumbnail: '/course2.jpg',
        tags: ['inspection', 'quality', 'reporting'],
        createdAt: '2024-11-20T00:00:00Z',
        updatedAt: '2024-12-05T00:00:00Z'
      },
      {
        id: 'C003',
        title: 'Legal Documentation & Compliance',
        description: 'Understanding legal requirements, document verification, and compliance procedures.',
        category: 'legal',
        type: 'document',
        duration: 30,
        difficulty: 'intermediate',
        instructor: 'Advocate Mehta',
        rating: 4.7,
        enrolledCount: 950,
        completionRate: 82,
        isCompleted: false,
        isBookmarked: false,
        progress: 0,
        thumbnail: '/course3.jpg',
        tags: ['legal', 'compliance', 'documentation'],
        createdAt: '2024-11-25T00:00:00Z',
        updatedAt: '2024-12-10T00:00:00Z'
      },
      {
        id: 'C004',
        title: 'Mobile App & Technology Tools',
        description: 'Learn to use GharBazaar mobile app, GPS tools, and digital documentation.',
        category: 'technology',
        type: 'interactive',
        duration: 25,
        difficulty: 'beginner',
        instructor: 'Tech Team',
        rating: 4.6,
        enrolledCount: 1100,
        completionRate: 91,
        isCompleted: true,
        isBookmarked: true,
        progress: 100,
        thumbnail: '/course4.jpg',
        tags: ['mobile', 'gps', 'digital'],
        createdAt: '2024-12-01T00:00:00Z',
        updatedAt: '2024-12-15T00:00:00Z'
      },
      {
        id: 'C005',
        title: 'Safety Protocols & Risk Management',
        description: 'Essential safety guidelines, risk assessment, and emergency procedures for field work.',
        category: 'safety',
        type: 'video',
        duration: 35,
        difficulty: 'beginner',
        instructor: 'Safety Officer',
        rating: 4.8,
        enrolledCount: 1300,
        completionRate: 94,
        isCompleted: false,
        isBookmarked: false,
        progress: 20,
        thumbnail: '/course5.jpg',
        tags: ['safety', 'risk', 'emergency'],
        createdAt: '2024-12-05T00:00:00Z',
        updatedAt: '2024-12-20T00:00:00Z'
      }
    ]

    const mockLearningPaths: LearningPath[] = [
      {
        id: 'LP001',
        title: 'Ground Partner Certification',
        description: 'Complete certification program for new ground partners',
        courses: ['C001', 'C004', 'C005'],
        estimatedTime: 105,
        difficulty: 'beginner',
        completedCourses: 2,
        totalCourses: 3,
        progress: 67
      },
      {
        id: 'LP002',
        title: 'Advanced Property Expert',
        description: 'Advanced training for experienced ground partners',
        courses: ['C002', 'C003'],
        estimatedTime: 90,
        difficulty: 'advanced',
        completedCourses: 0,
        totalCourses: 2,
        progress: 33
      }
    ]

    const mockAchievements: Achievement[] = [
      {
        id: 'A001',
        title: 'First Course Completed',
        description: 'Complete your first learning course',
        icon: '🎓',
        unlockedAt: '2024-12-01T00:00:00Z',
        progress: 1,
        target: 1
      },
      {
        id: 'A002',
        title: 'Learning Enthusiast',
        description: 'Complete 5 courses',
        icon: '📚',
        progress: 2,
        target: 5
      },
      {
        id: 'A003',
        title: 'Expert Learner',
        description: 'Complete 10 courses with 90%+ score',
        icon: '🏆',
        progress: 1,
        target: 10
      }
    ]

    setTimeout(() => {
      setCourses(mockCourses)
      setLearningPaths(mockLearningPaths)
      setAchievements(mockAchievements)
      setFilteredCourses(mockCourses)
      setIsLoading(false)
    }, 1000)
  }, [])

  // Filter courses
  useEffect(() => {
    let filtered = courses

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(course => 
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    }

    // Category filter
    if (filterCategory !== 'all') {
      filtered = filtered.filter(course => course.category === filterCategory)
    }

    // Type filter
    if (filterType !== 'all') {
      filtered = filtered.filter(course => course.type === filterType)
    }

    // Tab filter
    if (activeTab !== 'all') {
      switch (activeTab) {
        case 'completed':
          filtered = filtered.filter(course => course.isCompleted)
          break
        case 'in-progress':
          filtered = filtered.filter(course => course.progress > 0 && !course.isCompleted)
          break
        case 'bookmarked':
          filtered = filtered.filter(course => course.isBookmarked)
          break
      }
    }

    setFilteredCourses(filtered)
  }, [courses, searchQuery, filterCategory, filterType, activeTab])

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'basics': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
      case 'advanced': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400'
      case 'legal': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
      case 'technology': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
      case 'safety': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'text-green-600 dark:text-green-400'
      case 'intermediate': return 'text-yellow-600 dark:text-yellow-400'
      case 'advanced': return 'text-red-600 dark:text-red-400'
      default: return 'text-gray-600 dark:text-gray-400'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return <Video size={16} />
      case 'document': return <FileText size={16} />
      case 'interactive': return <Smartphone size={16} />
      case 'webinar': return <Users size={16} />
      default: return <BookOpen size={16} />
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'basics': return <BookOpen size={20} />
      case 'advanced': return <TrendingUp size={20} />
      case 'legal': return <Gavel size={20} />
      case 'technology': return <Smartphone size={20} />
      case 'safety': return <Shield size={20} />
      default: return <BookOpen size={20} />
    }
  }

  const toggleBookmark = (courseId: string) => {
    setCourses(prev => prev.map(course => 
      course.id === courseId 
        ? { ...course, isBookmarked: !course.isBookmarked }
        : course
    ))
    toast.success('Bookmark updated!')
  }

  const startCourse = (courseId: string) => {
    toast.success('Course started! Redirecting to content...')
  }

  const tabs = [
    { id: 'all', label: 'All Courses', count: courses.length },
    { id: 'completed', label: 'Completed', count: courses.filter(c => c.isCompleted).length },
    { id: 'in-progress', label: 'In Progress', count: courses.filter(c => c.progress > 0 && !c.isCompleted).length },
    { id: 'bookmarked', label: 'Bookmarked', count: courses.filter(c => c.isBookmarked).length }
  ]

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading learning content...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Learning Center</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Enhance your skills and knowledge with our training programs
          </p>
        </div>
      </div>

      {/* Learning Progress Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Courses Completed</p>
              <p className="text-3xl font-bold">{courses.filter(c => c.isCompleted).length}</p>
              <p className="text-blue-100 text-sm mt-1">of {courses.length} available</p>
            </div>
            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl">
              <CheckCircle className="w-8 h-8" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-950 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Learning Hours</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {Math.round(courses.filter(c => c.isCompleted).reduce((sum, c) => sum + c.duration, 0) / 60)}h
              </p>
              <p className="text-sm text-green-600 dark:text-green-400 mt-1">This month</p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-2xl">
              <Clock className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-950 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Achievements</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {achievements.filter(a => a.unlockedAt).length}
              </p>
              <p className="text-sm text-purple-600 dark:text-purple-400 mt-1">Badges earned</p>
            </div>
            <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-2xl">
              <Award className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-950 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg. Rating</p>
              <div className="flex items-center space-x-2">
                <p className="text-2xl font-bold text-gray-900 dark:text-white">4.8</p>
                <Star className="w-5 h-5 text-yellow-400 fill-current" />
              </div>
              <p className="text-sm text-yellow-600 dark:text-yellow-400 mt-1">Course ratings</p>
            </div>
            <div className="p-3 bg-yellow-100 dark:bg-yellow-900/20 rounded-2xl">
              <Star className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Learning Paths */}
      <div className="bg-white dark:bg-gray-950 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Learning Paths</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {learningPaths.map(path => (
            <div key={path.id} className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white">{path.title}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{path.description}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(path.difficulty)} bg-white dark:bg-gray-800`}>
                  {path.difficulty}
                </span>
              </div>
              
              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Progress</span>
                  <span className="font-medium text-gray-900 dark:text-white">{path.completedCourses}/{path.totalCourses} courses</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${path.progress}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                  <span>~{path.estimatedTime} minutes</span>
                  <span>{path.progress}% complete</span>
                </div>
              </div>

              <button className="w-full px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-xl transition-all">
                Continue Learning
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Achievements */}
      <div className="bg-white dark:bg-gray-950 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Achievements</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {achievements.map(achievement => (
            <div 
              key={achievement.id} 
              className={`p-4 rounded-xl border-2 transition-all ${
                achievement.unlockedAt 
                  ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800' 
                  : 'bg-gray-50 border-gray-200 dark:bg-gray-900 dark:border-gray-700'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className="text-3xl">{achievement.icon}</div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 dark:text-white">{achievement.title}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{achievement.description}</p>
                  <div className="mt-2">
                    <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                      <span>Progress</span>
                      <span>{achievement.progress}/{achievement.target}</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1">
                      <div 
                        className={`h-1 rounded-full transition-all duration-300 ${
                          achievement.unlockedAt ? 'bg-green-500' : 'bg-blue-500'
                        }`}
                        style={{ width: `${(achievement.progress / achievement.target) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="lg:col-span-2 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
          
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          >
            <option value="all">All Categories</option>
            <option value="basics">Basics</option>
            <option value="advanced">Advanced</option>
            <option value="legal">Legal</option>
            <option value="technology">Technology</option>
            <option value="safety">Safety</option>
          </select>

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          >
            <option value="all">All Types</option>
            <option value="video">Video</option>
            <option value="document">Document</option>
            <option value="interactive">Interactive</option>
            <option value="webinar">Webinar</option>
          </select>
        </div>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.length === 0 ? (
          <div className="col-span-full bg-white dark:bg-gray-950 rounded-2xl p-12 border border-gray-200 dark:border-gray-800 shadow-sm text-center">
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No courses found</h3>
            <p className="text-gray-600 dark:text-gray-400">
              {searchQuery || filterCategory !== 'all' || filterType !== 'all'
                ? 'Try adjusting your search or filters'
                : 'No courses available in this category'
              }
            </p>
          </div>
        ) : (
          filteredCourses.map(course => (
            <div key={course.id} className="bg-white dark:bg-gray-950 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-all overflow-hidden">
              {/* Course Thumbnail */}
              <div className="relative h-48 bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                {getCategoryIcon(course.category)}
                <div className="absolute top-4 left-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(course.category)}`}>
                    {course.category}
                  </span>
                </div>
                <div className="absolute top-4 right-4">
                  <button
                    onClick={() => toggleBookmark(course.id)}
                    className={`p-2 rounded-full transition-all ${
                      course.isBookmarked 
                        ? 'bg-yellow-500 text-white' 
                        : 'bg-white/20 text-white hover:bg-white/30'
                    }`}
                  >
                    <Bookmark size={16} />
                  </button>
                </div>
                {course.progress > 0 && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
                    <div 
                      className="h-1 bg-white transition-all duration-300"
                      style={{ width: `${course.progress}%` }}
                    ></div>
                  </div>
                )}
              </div>

              {/* Course Content */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-2">
                    {course.title}
                  </h3>
                  {course.isCompleted && (
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 ml-2" />
                  )}
                </div>

                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                  {course.description}
                </p>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center space-x-1">
                      {getTypeIcon(course.type)}
                      <span className="capitalize">{course.type}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock size={16} />
                      <span>{course.duration}m</span>
                    </div>
                  </div>
                  <span className={`text-sm font-medium ${getDifficultyColor(course.difficulty)} capitalize`}>
                    {course.difficulty}
                  </span>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-1">
                      <Star size={16} className="text-yellow-400 fill-current" />
                      <span className="text-sm font-medium text-gray-900 dark:text-white">{course.rating}</span>
                    </div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      ({course.enrolledCount.toLocaleString()})
                    </span>
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {course.completionRate}% completion
                  </span>
                </div>

                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => startCourse(course.id)}
                    className={`flex-1 px-4 py-2 font-medium rounded-xl transition-all ${
                      course.isCompleted
                        ? 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400'
                        : course.progress > 0
                        ? 'bg-blue-500 hover:bg-blue-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                  >
                    {course.isCompleted ? 'Review' : course.progress > 0 ? 'Continue' : 'Start'}
                  </button>
                  <button
                    onClick={() => {
                      setSelectedCourse(course)
                      setShowModal(true)
                    }}
                    className="p-2 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-xl transition-all"
                  >
                    <Eye size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Course Details Modal */}
      {showModal && selectedCourse && (
        <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-950 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 dark:border-gray-800">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Course Details
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
              {/* Course Header */}
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                      {selectedCourse.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {selectedCourse.description}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(selectedCourse.category)}`}>
                    {selectedCourse.category}
                  </span>
                </div>

                <div className="flex items-center space-x-6 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center space-x-1">
                    {getTypeIcon(selectedCourse.type)}
                    <span className="capitalize">{selectedCourse.type}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock size={16} />
                    <span>{selectedCourse.duration} minutes</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Target size={16} />
                    <span className="capitalize">{selectedCourse.difficulty}</span>
                  </div>
                </div>
              </div>

              {/* Course Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-900 rounded-xl">
                  <div className="flex items-center justify-center space-x-1 mb-1">
                    <Star size={16} className="text-yellow-400 fill-current" />
                    <span className="font-bold text-gray-900 dark:text-white">{selectedCourse.rating}</span>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Rating</p>
                </div>
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-900 rounded-xl">
                  <p className="font-bold text-gray-900 dark:text-white">{selectedCourse.enrolledCount.toLocaleString()}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Enrolled</p>
                </div>
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-900 rounded-xl">
                  <p className="font-bold text-gray-900 dark:text-white">{selectedCourse.completionRate}%</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Completion</p>
                </div>
              </div>

              {/* Instructor */}
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Instructor</h4>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                    {selectedCourse.instructor.charAt(0)}
                  </div>
                  <span className="font-medium text-gray-900 dark:text-white">{selectedCourse.instructor}</span>
                </div>
              </div>

              {/* Tags */}
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Topics Covered</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedCourse.tags.map(tag => (
                    <span key={tag} className="px-3 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-full text-sm">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Progress */}
              {selectedCourse.progress > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Your Progress</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Completed</span>
                      <span className="font-medium text-gray-900 dark:text-white">{selectedCourse.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${selectedCourse.progress}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex space-x-3 pt-4 border-t border-gray-200 dark:border-gray-800">
                <button
                  onClick={() => startCourse(selectedCourse.id)}
                  className="flex-1 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-xl transition-all"
                >
                  {selectedCourse.isCompleted ? 'Review Course' : selectedCourse.progress > 0 ? 'Continue Learning' : 'Start Course'}
                </button>
                <button
                  onClick={() => toggleBookmark(selectedCourse.id)}
                  className={`px-6 py-3 font-medium rounded-xl transition-all ${
                    selectedCourse.isBookmarked
                      ? 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  {selectedCourse.isBookmarked ? 'Bookmarked' : 'Bookmark'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}