'use client'

import { useState, useEffect } from 'react'
import { 
  TrendingUp, 
  Award, 
  Target, 
  Clock, 
  Star, 
  Trophy, 
  Medal, 
  Zap, 
  CheckCircle, 
  Calendar, 
  BarChart3, 
  PieChart, 
  Activity, 
  Users, 
  FileText, 
  Shield, 
  Briefcase, 
  Timer, 
  ThumbsUp, 
  Eye, 
  Download, 
  Filter, 
  RefreshCw,
  ArrowUp,
  ArrowDown,
  Minus,
  Plus,
  Info,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Crown,
  Flame,
  Sparkles,
  Rocket,
  Heart,
  Brain
} from 'lucide-react'
import toast from 'react-hot-toast'

interface PerformanceMetric {
  id: string
  name: string
  value: number
  target: number
  unit: string
  trend: 'up' | 'down' | 'stable'
  trendValue: number
  category: 'quality' | 'efficiency' | 'client-satisfaction' | 'compliance'
  description: string
  lastUpdated: string
}

interface Achievement {
  id: string
  title: string
  description: string
  icon: any
  category: 'milestone' | 'quality' | 'speed' | 'client' | 'compliance'
  earnedDate: string
  points: number
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
  progress?: number
  maxProgress?: number
}

interface Ranking {
  rank: number
  totalPartners: number
  category: string
  percentile: number
  improvement: number
}

interface CasePerformance {
  caseId: string
  caseName: string
  clientName: string
  completionTime: number
  targetTime: number
  qualityScore: number
  clientRating: number
  complexity: 'low' | 'medium' | 'high'
  completedDate: string
  earnings: number
}

export default function PerformancePage() {
  const [metrics, setMetrics] = useState<PerformanceMetric[]>([])
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [ranking, setRanking] = useState<Ranking | null>(null)
  const [casePerformance, setCasePerformance] = useState<CasePerformance[]>([])
  const [selectedPeriod, setSelectedPeriod] = useState('current-month')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [isLoading, setIsLoading] = useState(true)

  // Mock data
  useEffect(() => {
    const mockMetrics: PerformanceMetric[] = [
      {
        id: 'M001',
        name: 'Case Completion Rate',
        value: 95,
        target: 90,
        unit: '%',
        trend: 'up',
        trendValue: 5,
        category: 'efficiency',
        description: 'Percentage of cases completed on time',
        lastUpdated: '2024-12-31T15:30:00Z'
      },
      {
        id: 'M002',
        name: 'Average Quality Score',
        value: 4.8,
        target: 4.5,
        unit: '/5',
        trend: 'up',
        trendValue: 0.3,
        category: 'quality',
        description: 'Average quality rating from admin reviews',
        lastUpdated: '2024-12-31T15:30:00Z'
      },
      {
        id: 'M003',
        name: 'Client Satisfaction',
        value: 4.9,
        target: 4.0,
        unit: '/5',
        trend: 'up',
        trendValue: 0.2,
        category: 'client-satisfaction',
        description: 'Average client rating and feedback',
        lastUpdated: '2024-12-31T15:30:00Z'
      },
      {
        id: 'M004',
        name: 'Response Time',
        value: 2.5,
        target: 4.0,
        unit: 'hrs',
        trend: 'down',
        trendValue: -1.5,
        category: 'efficiency',
        description: 'Average response time to queries',
        lastUpdated: '2024-12-31T15:30:00Z'
      },
      {
        id: 'M005',
        name: 'Compliance Score',
        value: 98,
        target: 95,
        unit: '%',
        trend: 'up',
        trendValue: 3,
        category: 'compliance',
        description: 'Adherence to legal and regulatory standards',
        lastUpdated: '2024-12-31T15:30:00Z'
      },
      {
        id: 'M006',
        name: 'Document Accuracy',
        value: 99.2,
        target: 98.0,
        unit: '%',
        trend: 'up',
        trendValue: 1.2,
        category: 'quality',
        description: 'Accuracy rate in document reviews',
        lastUpdated: '2024-12-31T15:30:00Z'
      }
    ]

    const mockAchievements: Achievement[] = [
      {
        id: 'A001',
        title: 'Speed Demon',
        description: 'Complete 10 cases ahead of schedule',
        icon: Zap,
        category: 'speed',
        earnedDate: '2024-12-30T10:00:00Z',
        points: 500,
        rarity: 'rare',
        progress: 10,
        maxProgress: 10
      },
      {
        id: 'A002',
        title: 'Quality Champion',
        description: 'Maintain 4.8+ quality score for 3 months',
        icon: Trophy,
        category: 'quality',
        earnedDate: '2024-12-31T15:30:00Z',
        points: 1000,
        rarity: 'epic',
        progress: 3,
        maxProgress: 3
      },
      {
        id: 'A003',
        title: 'Client Favorite',
        description: 'Receive 5-star rating from 20 clients',
        icon: Heart,
        category: 'client',
        earnedDate: '2024-12-25T12:00:00Z',
        points: 750,
        rarity: 'rare',
        progress: 20,
        maxProgress: 20
      },
      {
        id: 'A004',
        title: 'Compliance Master',
        description: 'Perfect compliance score for 6 months',
        icon: Shield,
        category: 'compliance',
        earnedDate: '2024-12-31T16:00:00Z',
        points: 1500,
        rarity: 'legendary',
        progress: 6,
        maxProgress: 6
      },
      {
        id: 'A005',
        title: 'Century Club',
        description: 'Complete 100 cases successfully',
        icon: Crown,
        category: 'milestone',
        earnedDate: '2024-12-28T14:20:00Z',
        points: 2000,
        rarity: 'legendary',
        progress: 100,
        maxProgress: 100
      },
      {
        id: 'A006',
        title: 'Rising Star',
        description: 'Achieve top 10% ranking in first year',
        icon: Star,
        category: 'milestone',
        earnedDate: '2024-12-20T09:30:00Z',
        points: 1200,
        rarity: 'epic',
        progress: 1,
        maxProgress: 1
      }
    ]

    const mockRanking: Ranking = {
      rank: 8,
      totalPartners: 150,
      category: 'Overall Performance',
      percentile: 95,
      improvement: 3
    }

    const mockCasePerformance: CasePerformance[] = [
      {
        caseId: 'LC001',
        caseName: 'Luxury Apartment - Worli',
        clientName: 'Mr. Arjun Mehta',
        completionTime: 48,
        targetTime: 72,
        qualityScore: 4.9,
        clientRating: 5.0,
        complexity: 'high',
        completedDate: '2024-12-31T15:30:00Z',
        earnings: 25000
      },
      {
        caseId: 'LC002',
        caseName: 'Commercial Complex - Andheri',
        clientName: 'Prestige Constructions',
        completionTime: 60,
        targetTime: 96,
        qualityScore: 4.8,
        clientRating: 4.8,
        complexity: 'high',
        completedDate: '2024-12-30T14:20:00Z',
        earnings: 35000
      },
      {
        caseId: 'LC003',
        caseName: 'Residential Plot - Pune',
        clientName: 'Ms. Priya Sharma',
        completionTime: 24,
        targetTime: 48,
        qualityScore: 4.7,
        clientRating: 4.9,
        complexity: 'medium',
        completedDate: '2024-12-29T11:45:00Z',
        earnings: 15000
      },
      {
        caseId: 'LC004',
        caseName: 'Villa Project - Goa',
        clientName: 'Coastal Developers',
        completionTime: 120,
        targetTime: 144,
        qualityScore: 4.9,
        clientRating: 5.0,
        complexity: 'high',
        completedDate: '2024-12-28T16:30:00Z',
        earnings: 50000
      }
    ]

    setTimeout(() => {
      setMetrics(mockMetrics)
      setAchievements(mockAchievements)
      setRanking(mockRanking)
      setCasePerformance(mockCasePerformance)
      setIsLoading(false)
    }, 1000)
  }, [])

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'quality': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
      case 'efficiency': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
      case 'client-satisfaction': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400'
      case 'compliance': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
    }
  }

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
      case 'rare': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
      case 'epic': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400'
      case 'legendary': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
    }
  }

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
      case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
    }
  }

  const getTrendIcon = (trend: string, value: number) => {
    if (trend === 'up') return <ArrowUp size={16} className="text-green-500" />
    if (trend === 'down') return <ArrowDown size={16} className="text-red-500" />
    return <Minus size={16} className="text-gray-500" />
  }

  const formatDuration = (hours: number) => {
    if (hours < 24) return `${hours}h`
    const days = Math.floor(hours / 24)
    const remainingHours = hours % 24
    return `${days}d ${remainingHours}h`
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading performance data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Performance Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Track your achievements, rankings, and performance metrics
          </p>
        </div>
        <div className="flex items-center space-x-3 mt-4 sm:mt-0">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          >
            <option value="current-month">This Month</option>
            <option value="last-month">Last Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
          </select>
          <button className="flex items-center space-x-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/40 rounded-xl transition-all">
            <Download size={20} />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* Ranking Card */}
      {ranking && (
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-white/20 rounded-2xl">
                <Trophy className="w-8 h-8" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Rank #{ranking.rank}</h2>
                <p className="text-blue-100">out of {ranking.totalPartners} legal partners</p>
                <p className="text-sm text-blue-200 mt-1">
                  Top {100 - ranking.percentile}% • {ranking.category}
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center space-x-2 mb-2">
                <ArrowUp size={20} className="text-green-300" />
                <span className="text-xl font-bold">+{ranking.improvement}</span>
              </div>
              <p className="text-blue-200 text-sm">positions this month</p>
            </div>
          </div>
        </div>
      )}

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {metrics.map(metric => (
          <div key={metric.id} className="bg-white dark:bg-gray-950 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">{metric.name}</h3>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(metric.category)}`}>
                  {metric.category.replace('-', ' ').toUpperCase()}
                </span>
              </div>
              {getTrendIcon(metric.trend, metric.trendValue)}
            </div>

            <div className="space-y-3">
              <div className="flex items-end space-x-2">
                <span className="text-3xl font-bold text-gray-900 dark:text-white">
                  {metric.value}
                </span>
                <span className="text-gray-600 dark:text-gray-400 mb-1">
                  {metric.unit}
                </span>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Target: {metric.target}{metric.unit}</span>
                  <span className={`font-medium ${
                    metric.value >= metric.target ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                  }`}>
                    {metric.value >= metric.target ? 'Achieved' : 'Below Target'}
                  </span>
                </div>
                
                <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-500 ${
                      metric.value >= metric.target ? 'bg-green-500' : 'bg-blue-500'
                    }`}
                    style={{ width: `${Math.min((metric.value / metric.target) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>

              <div className="flex items-center space-x-2 text-sm">
                {getTrendIcon(metric.trend, metric.trendValue)}
                <span className={`font-medium ${
                  metric.trend === 'up' ? 'text-green-600 dark:text-green-400' : 
                  metric.trend === 'down' ? 'text-red-600 dark:text-red-400' : 
                  'text-gray-600 dark:text-gray-400'
                }`}>
                  {Math.abs(metric.trendValue)}{metric.unit} from last period
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Achievements Section */}
      <div className="bg-white dark:bg-gray-950 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
        <div className="p-6 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Achievements</h3>
            <div className="flex items-center space-x-2">
              <Award className="w-5 h-5 text-yellow-500" />
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {achievements.reduce((sum, a) => sum + a.points, 0)} Total Points
              </span>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {achievements.map(achievement => {
              const Icon = achievement.icon
              return (
                <div key={achievement.id} className="relative p-4 border border-gray-200 dark:border-gray-800 rounded-xl hover:shadow-md transition-all">
                  <div className="flex items-start space-x-3">
                    <div className={`p-2 rounded-lg ${
                      achievement.rarity === 'legendary' ? 'bg-yellow-100 dark:bg-yellow-900/20' :
                      achievement.rarity === 'epic' ? 'bg-purple-100 dark:bg-purple-900/20' :
                      achievement.rarity === 'rare' ? 'bg-blue-100 dark:bg-blue-900/20' :
                      'bg-gray-100 dark:bg-gray-800'
                    }`}>
                      <Icon size={24} className={
                        achievement.rarity === 'legendary' ? 'text-yellow-600 dark:text-yellow-400' :
                        achievement.rarity === 'epic' ? 'text-purple-600 dark:text-purple-400' :
                        achievement.rarity === 'rare' ? 'text-blue-600 dark:text-blue-400' :
                        'text-gray-600 dark:text-gray-400'
                      } />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="font-semibold text-gray-900 dark:text-white text-sm">
                          {achievement.title}
                        </h4>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRarityColor(achievement.rarity)}`}>
                          {achievement.rarity.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {achievement.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(achievement.earnedDate).toLocaleDateString()}
                        </span>
                        <span className="text-sm font-bold text-yellow-600 dark:text-yellow-400">
                          +{achievement.points} pts
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {achievement.rarity === 'legendary' && (
                    <div className="absolute -top-1 -right-1">
                      <Sparkles size={16} className="text-yellow-500" />
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Case Performance */}
      <div className="bg-white dark:bg-gray-950 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
        <div className="p-6 border-b border-gray-200 dark:border-gray-800">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Case Performance</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-900/50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Case Details
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Completion Time
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Quality Score
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Client Rating
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Earnings
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
              {casePerformance.map(case_ => (
                <tr key={case_.caseId} className="hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white text-sm">
                        {case_.caseName}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {case_.clientName} • {case_.caseId}
                      </p>
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-1 ${getComplexityColor(case_.complexity)}`}>
                        {case_.complexity.toUpperCase()} COMPLEXITY
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold text-gray-900 dark:text-white">
                          {formatDuration(case_.completionTime)}
                        </span>
                        {case_.completionTime <= case_.targetTime ? (
                          <CheckCircle2 size={16} className="text-green-500" />
                        ) : (
                          <XCircle size={16} className="text-red-500" />
                        )}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Target: {formatDuration(case_.targetTime)}
                      </p>
                      <div className="w-20 bg-gray-200 dark:bg-gray-800 rounded-full h-1 mt-1">
                        <div 
                          className={`h-1 rounded-full ${
                            case_.completionTime <= case_.targetTime ? 'bg-green-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${Math.min((case_.targetTime / case_.completionTime) * 100, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {case_.qualityScore}/5
                      </span>
                      <div className="flex space-x-1">
                        {[1, 2, 3, 4, 5].map(star => (
                          <Star 
                            key={star} 
                            size={14} 
                            className={star <= case_.qualityScore ? 'text-yellow-400 fill-current' : 'text-gray-300 dark:text-gray-600'} 
                          />
                        ))}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {case_.clientRating}/5
                      </span>
                      <div className="flex space-x-1">
                        {[1, 2, 3, 4, 5].map(star => (
                          <Heart 
                            key={star} 
                            size={14} 
                            className={star <= case_.clientRating ? 'text-red-400 fill-current' : 'text-gray-300 dark:text-gray-600'} 
                          />
                        ))}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-semibold text-green-600 dark:text-green-400">
                      ₹{case_.earnings.toLocaleString()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Performance Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-950 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Performance Insights</h3>
          <div className="space-y-4">
            <div className="flex items-start space-x-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
              <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
              <div>
                <h4 className="font-medium text-green-900 dark:text-green-100">Excellent Quality</h4>
                <p className="text-sm text-green-700 dark:text-green-300">
                  Your quality score is 6.7% above the platform average. Keep up the great work!
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
              <Zap className="w-5 h-5 text-blue-500 mt-0.5" />
              <div>
                <h4 className="font-medium text-blue-900 dark:text-blue-100">Speed Improvement</h4>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  You're completing cases 25% faster than your target time on average.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
              <Brain className="w-5 h-5 text-purple-500 mt-0.5" />
              <div>
                <h4 className="font-medium text-purple-900 dark:text-purple-100">Skill Development</h4>
                <p className="text-sm text-purple-700 dark:text-purple-300">
                  Consider taking advanced RERA compliance courses to boost your expertise.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-950 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Goals & Targets</h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Monthly Case Target</span>
                <span className="text-sm text-gray-600 dark:text-gray-400">8/10</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '80%' }}></div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Quality Score Goal</span>
                <span className="text-sm text-gray-600 dark:text-gray-400">4.8/4.5</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '100%' }}></div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Client Satisfaction</span>
                <span className="text-sm text-gray-600 dark:text-gray-400">4.9/4.0</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '100%' }}></div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Earnings Target</span>
                <span className="text-sm text-gray-600 dark:text-gray-400">₹85k/₹100k</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-2">
                <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '85%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}