'use client'

import { useState, useEffect } from 'react'
import { 
  TrendingUp, 
  TrendingDown, 
  Target, 
  Award, 
  Star, 
  Calendar, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  BarChart3,
  PieChart,
  Activity,
  Users,
  MapPin,
  Camera,
  FileText,
  ThumbsUp,
  Zap,
  Trophy,
  Medal,
  Crown,
  Flame,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  Download,
  Filter
} from 'lucide-react'
import toast from 'react-hot-toast'

interface PerformanceMetrics {
  overallRating: number
  totalTasks: number
  completedTasks: number
  completionRate: number
  averageRating: number
  totalEarnings: number
  thisMonthTasks: number
  lastMonthTasks: number
  monthlyGrowth: number
  responseTime: number // in hours
  clientSatisfaction: number
  badges: Badge[]
  rankings: {
    cityRank: number
    totalPartners: number
    percentile: number
  }
}

interface Badge {
  id: string
  name: string
  description: string
  icon: string
  earnedDate: string
  category: 'performance' | 'quality' | 'milestone' | 'special'
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
}

interface TaskPerformance {
  taskType: string
  completed: number
  averageRating: number
  totalEarnings: number
  completionTime: number // in hours
}

interface MonthlyData {
  month: string
  tasks: number
  earnings: number
  rating: number
}

export default function PerformancePage() {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null)
  const [taskPerformance, setTaskPerformance] = useState<TaskPerformance[]>([])
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([])
  const [selectedPeriod, setSelectedPeriod] = useState('6months')
  const [isLoading, setIsLoading] = useState(true)

  // Mock data
  useEffect(() => {
    const mockMetrics: PerformanceMetrics = {
      overallRating: 4.8,
      totalTasks: 47,
      completedTasks: 45,
      completionRate: 95.7,
      averageRating: 4.6,
      totalEarnings: 28500,
      thisMonthTasks: 12,
      lastMonthTasks: 8,
      monthlyGrowth: 50,
      responseTime: 2.3,
      clientSatisfaction: 96,
      badges: [
        {
          id: 'B001',
          name: 'Top Performer',
          description: 'Completed 50+ tasks with 4.5+ rating',
          icon: '🏆',
          earnedDate: '2024-12-15T00:00:00Z',
          category: 'performance',
          rarity: 'epic'
        },
        {
          id: 'B002',
          name: 'Quality Expert',
          description: 'Maintained 4.8+ average rating for 3 months',
          icon: '⭐',
          earnedDate: '2024-12-01T00:00:00Z',
          category: 'quality',
          rarity: 'rare'
        },
        {
          id: 'B003',
          name: 'Speed Demon',
          description: 'Average response time under 3 hours',
          icon: '⚡',
          earnedDate: '2024-11-20T00:00:00Z',
          category: 'performance',
          rarity: 'rare'
        },
        {
          id: 'B004',
          name: 'Client Favorite',
          description: '95%+ client satisfaction rate',
          icon: '💝',
          earnedDate: '2024-11-10T00:00:00Z',
          category: 'quality',
          rarity: 'common'
        }
      ],
      rankings: {
        cityRank: 3,
        totalPartners: 150,
        percentile: 98
      }
    }

    const mockTaskPerformance: TaskPerformance[] = [
      {
        taskType: 'Site Visit',
        completed: 18,
        averageRating: 4.7,
        totalEarnings: 14400,
        completionTime: 3.2
      },
      {
        taskType: 'Verification',
        completed: 12,
        averageRating: 4.8,
        totalEarnings: 6000,
        completionTime: 2.1
      },
      {
        taskType: 'Inspection',
        completed: 8,
        averageRating: 4.5,
        totalEarnings: 4800,
        completionTime: 4.5
      },
      {
        taskType: 'Documentation',
        completed: 5,
        averageRating: 4.6,
        totalEarnings: 2250,
        completionTime: 2.8
      },
      {
        taskType: 'Photography',
        completed: 4,
        averageRating: 4.9,
        totalEarnings: 1200,
        completionTime: 1.5
      }
    ]

    const mockMonthlyData: MonthlyData[] = [
      { month: 'Jul', tasks: 6, earnings: 3600, rating: 4.4 },
      { month: 'Aug', tasks: 8, earnings: 4800, rating: 4.5 },
      { month: 'Sep', tasks: 7, earnings: 4200, rating: 4.6 },
      { month: 'Oct', tasks: 9, earnings: 5400, rating: 4.7 },
      { month: 'Nov', tasks: 8, earnings: 4800, rating: 4.6 },
      { month: 'Dec', tasks: 12, earnings: 7200, rating: 4.8 }
    ]

    setTimeout(() => {
      setMetrics(mockMetrics)
      setTaskPerformance(mockTaskPerformance)
      setMonthlyData(mockMonthlyData)
      setIsLoading(false)
    }, 1000)
  }, [])

  const getBadgeRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'bg-gray-100 text-gray-800 border-gray-300 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600'
      case 'rare': return 'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-600'
      case 'epic': return 'bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-900/20 dark:text-purple-300 dark:border-purple-600'
      case 'legendary': return 'bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-900/20 dark:text-yellow-300 dark:border-yellow-600'
      default: return 'bg-gray-100 text-gray-800 border-gray-300 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600'
    }
  }

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Crown className="w-6 h-6 text-yellow-500" />
      case 2: return <Medal className="w-6 h-6 text-gray-400" />
      case 3: return <Trophy className="w-6 h-6 text-orange-500" />
      default: return <Award className="w-6 h-6 text-blue-500" />
    }
  }

  const downloadReport = () => {
    toast.success('Performance report downloaded!')
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading performance data...</p>
        </div>
      </div>
    )
  }

  if (!metrics) return null

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Performance</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Track your performance metrics and achievements
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex items-center space-x-3">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          >
            <option value="1month">Last Month</option>
            <option value="3months">Last 3 Months</option>
            <option value="6months">Last 6 Months</option>
            <option value="1year">Last Year</option>
          </select>
          <button
            onClick={downloadReport}
            className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-medium rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            <Download size={20} />
            <span>Download Report</span>
          </button>
        </div>
      </div>

      {/* Overall Performance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Overall Rating</p>
              <div className="flex items-center space-x-2">
                <p className="text-3xl font-bold">{metrics.overallRating}</p>
                <Star className="w-6 h-6 text-yellow-300 fill-current" />
              </div>
              <p className="text-blue-100 text-sm mt-1">Top {100 - metrics.rankings.percentile}% performer</p>
            </div>
            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl">
              <Trophy className="w-8 h-8" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-950 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Completion Rate</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{metrics.completionRate}%</p>
              <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                {metrics.completedTasks}/{metrics.totalTasks} tasks
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
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Monthly Growth</p>
              <div className="flex items-center space-x-2">
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{metrics.monthlyGrowth}%</p>
                {metrics.monthlyGrowth > 0 ? (
                  <ArrowUpRight className="w-6 h-6 text-green-500" />
                ) : (
                  <ArrowDownRight className="w-6 h-6 text-red-500" />
                )}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {metrics.thisMonthTasks} tasks this month
              </p>
            </div>
            <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-2xl">
              <TrendingUp className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-950 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Response Time</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{metrics.responseTime}h</p>
              <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">
                {metrics.clientSatisfaction}% satisfaction
              </p>
            </div>
            <div className="p-3 bg-orange-100 dark:bg-orange-900/20 rounded-2xl">
              <Zap className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Rankings & Badges */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* City Ranking */}
        <div className="bg-white dark:bg-gray-950 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">City Ranking</h3>
            <div className="flex items-center space-x-2">
              {getRankIcon(metrics.rankings.cityRank)}
              <span className="text-2xl font-bold text-gray-900 dark:text-white">#{metrics.rankings.cityRank}</span>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Your Rank:</span>
              <span className="font-semibold text-gray-900 dark:text-white">#{metrics.rankings.cityRank} of {metrics.rankings.totalPartners}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Percentile:</span>
              <span className="font-semibold text-green-600 dark:text-green-400">Top {100 - metrics.rankings.percentile}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Total Partners:</span>
              <span className="font-semibold text-gray-900 dark:text-white">{metrics.rankings.totalPartners}</span>
            </div>
          </div>

          <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl">
            <div className="flex items-center space-x-3">
              <Flame className="w-8 h-8 text-orange-500" />
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">Keep it up!</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">You're in the top 2% of ground partners</p>
              </div>
            </div>
          </div>
        </div>

        {/* Badges & Achievements */}
        <div className="bg-white dark:bg-gray-950 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Badges & Achievements</h3>
            <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-full text-sm font-medium">
              {metrics.badges.length} Earned
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {metrics.badges.map(badge => (
              <div
                key={badge.id}
                className={`p-4 rounded-xl border-2 ${getBadgeRarityColor(badge.rarity)} transition-all hover:scale-105`}
              >
                <div className="text-center">
                  <div className="text-3xl mb-2">{badge.icon}</div>
                  <h4 className="font-semibold text-sm mb-1">{badge.name}</h4>
                  <p className="text-xs opacity-80 mb-2">{badge.description}</p>
                  <span className="text-xs font-medium capitalize">{badge.rarity}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 text-center">
            <button className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium">
              View All Badges →
            </button>
          </div>
        </div>
      </div>

      {/* Performance Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Performance Trend */}
        <div className="bg-white dark:bg-gray-950 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Monthly Performance</h3>
            <BarChart3 className="w-6 h-6 text-gray-400" />
          </div>

          <div className="space-y-4">
            {monthlyData.map((data, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400 w-8">{data.month}</span>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${(data.tasks / 15) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">{data.tasks}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-600 dark:text-gray-400">₹{data.earnings.toLocaleString()}</span>
                  <div className="flex items-center space-x-1">
                    <Star size={14} className="text-yellow-400 fill-current" />
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{data.rating}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Task Type Performance */}
        <div className="bg-white dark:bg-gray-950 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Task Performance</h3>
            <PieChart className="w-6 h-6 text-gray-400" />
          </div>

          <div className="space-y-4">
            {taskPerformance.map((task, index) => (
              <div key={index} className="p-4 bg-gray-50 dark:bg-gray-900 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-gray-900 dark:text-white">{task.taskType}</h4>
                  <span className="text-sm text-gray-600 dark:text-gray-400">{task.completed} tasks</span>
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600 dark:text-gray-400">Rating</p>
                    <div className="flex items-center space-x-1">
                      <Star size={14} className="text-yellow-400 fill-current" />
                      <span className="font-medium text-gray-900 dark:text-white">{task.averageRating}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-gray-600 dark:text-gray-400">Earnings</p>
                    <p className="font-medium text-gray-900 dark:text-white">₹{task.totalEarnings.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 dark:text-gray-400">Avg Time</p>
                    <p className="font-medium text-gray-900 dark:text-white">{task.completionTime}h</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Performance Insights */}
      <div className="bg-white dark:bg-gray-950 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Performance Insights</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6 bg-green-50 dark:bg-green-900/20 rounded-xl">
            <ThumbsUp className="w-12 h-12 text-green-600 dark:text-green-400 mx-auto mb-4" />
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Strengths</h4>
            <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
              <li>• Excellent client ratings</li>
              <li>• Fast response times</li>
              <li>• High completion rate</li>
            </ul>
          </div>

          <div className="text-center p-6 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
            <Target className="w-12 h-12 text-blue-600 dark:text-blue-400 mx-auto mb-4" />
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Opportunities</h4>
            <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
              <li>• Increase task volume</li>
              <li>• Expand service areas</li>
              <li>• Try new task types</li>
            </ul>
          </div>

          <div className="text-center p-6 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
            <Award className="w-12 h-12 text-purple-600 dark:text-purple-400 mx-auto mb-4" />
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Next Goals</h4>
            <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
              <li>• Reach 50 total tasks</li>
              <li>• Maintain 4.8+ rating</li>
              <li>• Earn "Expert" badge</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}