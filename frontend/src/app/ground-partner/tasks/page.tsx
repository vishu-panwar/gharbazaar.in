'use client'

import { useState } from 'react'
import { 
  CheckSquare, 
  Search, 
  Filter, 
  MapPin, 
  Clock, 
  User, 
  Phone,
  Calendar,
  Navigation,
  Camera,
  FileText,
  AlertCircle,
  CheckCircle,
  XCircle,
  Eye,
  Play,
  Pause
} from 'lucide-react'
import toast from 'react-hot-toast'

export default function TasksPage() {
  const [filter, setFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTask, setSelectedTask] = useState<any>(null)
  const [showModal, setShowModal] = useState(false)

  const taskStats = [
    { label: 'Total Tasks', value: '32', change: '+8 this week', icon: CheckSquare, color: 'blue' },
    { label: 'In Progress', value: '8', change: '+3 today', icon: Clock, color: 'orange' },
    { label: 'Completed', value: '24', change: '+6 this week', icon: CheckCircle, color: 'green' },
    { label: 'Success Rate', value: '94%', change: '+2%', icon: AlertCircle, color: 'purple' }
  ]

  const tasks = [
    {
      id: 1,
      taskId: 'TSK001',
      type: 'Site Visit',
      property: '3BHK Apartment, Bandra West',
      client: {
        name: 'Priya Sharma',
        phone: '+91 98765 43210',
        email: 'priya@example.com'
      },
      address: 'Hill Road, Bandra West, Mumbai - 400050',
      coordinates: { lat: 19.0596, lng: 72.8295 },
      priority: 'high',
      status: 'assigned',
      deadline: '2024-01-15T14:00:00Z',
      assignedAt: '2024-01-14T09:00:00Z',
      estimatedDuration: '2 hours',
      payment: '₹800',
      description: 'Complete property verification and documentation for 3BHK apartment. Take photos of all rooms, check legal documents, and verify property details.',
      requirements: ['Property photos', 'Document verification', 'Area measurement', 'Neighborhood check'],
      checklist: [
        { item: 'Exterior photos', completed: false },
        { item: 'Interior photos (all rooms)', completed: false },
        { item: 'Document verification', completed: false },
        { item: 'Area measurement', completed: false },
        { item: 'Utilities check', completed: false }
      ]
    },
    {
      id: 2,
      taskId: 'TSK002',
      type: 'Documentation',
      property: 'Commercial Space, Andheri East',
      client: {
        name: 'Rajesh Patel',
        phone: '+91 98765 43211',
        email: 'rajesh@example.com'
      },
      address: 'Chakala, Andheri East, Mumbai - 400099',
      coordinates: { lat: 19.1136, lng: 72.8697 },
      priority: 'medium',
      status: 'in-progress',
      deadline: '2024-01-16T16:00:00Z',
      assignedAt: '2024-01-14T10:30:00Z',
      estimatedDuration: '3 hours',
      payment: '₹1200',
      description: 'Assist with legal documentation and verification for commercial property lease agreement.',
      requirements: ['Legal document review', 'Property registration check', 'Compliance verification'],
      checklist: [
        { item: 'Property registration documents', completed: true },
        { item: 'NOC verification', completed: true },
        { item: 'Compliance check', completed: false },
        { item: 'Final documentation', completed: false }
      ]
    },
    {
      id: 3,
      taskId: 'TSK003',
      type: 'Verification',
      property: '2BHK Flat, Powai',
      client: {
        name: 'Amit Kumar',
        phone: '+91 98765 43212',
        email: 'amit@example.com'
      },
      address: 'Hiranandani Gardens, Powai, Mumbai - 400076',
      coordinates: { lat: 19.1197, lng: 72.9073 },
      priority: 'low',
      status: 'pending',
      deadline: '2024-01-17T12:00:00Z',
      assignedAt: '2024-01-14T11:00:00Z',
      estimatedDuration: '1.5 hours',
      payment: '₹600',
      description: 'Property verification for potential buyer. Check property condition and surrounding area.',
      requirements: ['Property condition check', 'Area verification', 'Amenities check'],
      checklist: [
        { item: 'Property condition assessment', completed: false },
        { item: 'Amenities verification', completed: false },
        { item: 'Area and locality check', completed: false },
        { item: 'Report submission', completed: false }
      ]
    },
    {
      id: 4,
      taskId: 'TSK004',
      type: 'Site Visit',
      property: 'Villa, Juhu',
      client: {
        name: 'Sneha Reddy',
        phone: '+91 98765 43213',
        email: 'sneha@example.com'
      },
      address: 'Juhu Tara Road, Juhu, Mumbai - 400049',
      coordinates: { lat: 19.0990, lng: 72.8258 },
      priority: 'high',
      status: 'completed',
      deadline: '2024-01-13T15:00:00Z',
      assignedAt: '2024-01-12T09:00:00Z',
      completedAt: '2024-01-13T14:30:00Z',
      estimatedDuration: '3 hours',
      payment: '₹1500',
      description: 'Luxury villa inspection and documentation for high-value property transaction.',
      requirements: ['Detailed photography', 'Luxury amenities check', 'Security verification'],
      checklist: [
        { item: 'Exterior and interior photos', completed: true },
        { item: 'Luxury amenities check', completed: true },
        { item: 'Security systems verification', completed: true },
        { item: 'Garden and outdoor areas', completed: true },
        { item: 'Final report submission', completed: true }
      ]
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'assigned':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
      case 'in-progress':
        return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
      case 'completed':
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
      case 'pending':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
      case 'rejected':
        return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
      case 'medium':
        return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
      case 'low':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Site Visit':
        return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
      case 'Documentation':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
      case 'Verification':
        return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
    }
  }

  const handleTaskAction = (taskId: string, action: string) => {
    toast.success(`Task ${action} successfully`)
  }

  const handleViewTask = (task: any) => {
    setSelectedTask(task)
    setShowModal(true)
  }

  const filteredTasks = tasks.filter(task => {
    const matchesFilter = filter === 'all' || task.status === filter
    const matchesSearch = task.property.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.taskId.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesFilter && matchesSearch
  })

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-blue-700 rounded-3xl p-8 text-white">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full animate-pulse"></div>
          <div className="absolute top-1/2 -left-8 w-32 h-32 bg-white/5 rounded-full animate-bounce"></div>
        </div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl">
                  <CheckSquare size={32} className="text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold">Task Management</h1>
                  <p className="text-blue-100 text-lg">Manage your assigned tasks and site visits</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {taskStats.map((stat, index) => (
          <div key={index} className="group bg-white dark:bg-gray-950 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 bg-gradient-to-br ${
                stat.color === 'blue' ? 'from-blue-500 to-blue-600' :
                stat.color === 'orange' ? 'from-orange-500 to-orange-600' :
                stat.color === 'green' ? 'from-green-500 to-green-600' :
                'from-purple-500 to-purple-600'
              } rounded-2xl group-hover:scale-110 transition-transform duration-300`}>
                <stat.icon size={24} className="text-white" />
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
              </div>
            </div>
            <p className="text-sm text-green-600 font-medium">{stat.change}</p>
          </div>
        ))}
      </div>

      {/* Search & Filter Section */}
      <div className="bg-white dark:bg-gray-950 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="flex-1 max-w-2xl">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search tasks by property, client, or task ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-lg"
              />
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {['all', 'assigned', 'in-progress', 'completed', 'pending'].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-6 py-3 rounded-2xl text-sm font-semibold transition-all duration-300 capitalize ${
                  filter === status
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg shadow-blue-500/25'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {status === 'all' ? 'All Tasks' : status.replace('-', ' ')}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tasks Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredTasks.map((task) => (
          <div
            key={task.id}
            className="group bg-white dark:bg-gray-950 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl">
                  <CheckSquare size={20} className="text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white text-lg group-hover:text-blue-600 transition-colors">
                    {task.property}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{task.taskId}</p>
                </div>
              </div>
              <div className="flex flex-col items-end space-y-2">
                <span className={`px-3 py-1 rounded-2xl text-xs font-bold ${getStatusColor(task.status)}`}>
                  {task.status}
                </span>
                <span className={`px-3 py-1 rounded-2xl text-xs font-bold ${getPriorityColor(task.priority)}`}>
                  {task.priority}
                </span>
              </div>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex items-center space-x-3 text-sm">
                <span className={`px-3 py-1 rounded-2xl text-xs font-bold ${getTypeColor(task.type)}`}>
                  {task.type}
                </span>
                <span className="font-bold text-green-600">{task.payment}</span>
              </div>
              
              <div className="flex items-center space-x-3 text-sm text-gray-600 dark:text-gray-400">
                <User size={16} className="text-blue-500" />
                <span className="font-medium">{task.client.name}</span>
                <Phone size={16} className="text-green-500" />
                <span>{task.client.phone}</span>
              </div>
              
              <div className="flex items-center space-x-3 text-sm text-gray-600 dark:text-gray-400">
                <MapPin size={16} className="text-red-500" />
                <span className="font-medium">{task.address}</span>
              </div>
              
              <div className="flex items-center space-x-3 text-sm text-gray-600 dark:text-gray-400">
                <Clock size={16} className="text-orange-500" />
                <span>Deadline: {new Date(task.deadline).toLocaleDateString()} at {new Date(task.deadline).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={() => handleViewTask(task)}
                className="flex-1 flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white py-3 rounded-2xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <Eye size={18} />
                <span>View Details</span>
              </button>
              
              {task.status === 'assigned' && (
                <button
                  onClick={() => handleTaskAction(task.taskId, 'started')}
                  className="flex items-center justify-center bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white p-3 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl"
                  title="Start Task"
                >
                  <Play size={18} />
                </button>
              )}
              
              {task.status === 'in-progress' && (
                <button
                  onClick={() => handleTaskAction(task.taskId, 'paused')}
                  className="flex items-center justify-center bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white p-3 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl"
                  title="Pause Task"
                >
                  <Pause size={18} />
                </button>
              )}
              
              <button
                onClick={() => toast.success('Opening navigation...')}
                className="flex items-center justify-center bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white p-3 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl"
                title="Navigate"
              >
                <Navigation size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Task Detail Modal */}
      {showModal && selectedTask && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-gray-950 rounded-3xl max-w-4xl w-full my-8 border border-gray-200 dark:border-gray-800 shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 p-8 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-bold">{selectedTask.property}</h2>
                  <p className="text-blue-100 text-lg">{selectedTask.taskId} • {selectedTask.type}</p>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-3 hover:bg-white/20 rounded-2xl transition-all"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="p-8 space-y-8">
              {/* Task Overview */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Task Details</h3>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{selectedTask.description}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white mb-3">Requirements</h4>
                    <ul className="space-y-2">
                      {selectedTask.requirements.map((req: string, index: number) => (
                        <li key={index} className="flex items-center space-x-2">
                          <CheckCircle size={16} className="text-green-500" />
                          <span className="text-gray-600 dark:text-gray-400">{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-6">
                    <h4 className="font-bold text-gray-900 dark:text-white mb-4">Client Information</h4>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <User size={20} className="text-blue-500" />
                        <span className="font-medium text-gray-900 dark:text-white">{selectedTask.client.name}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Phone size={20} className="text-green-500" />
                        <span className="text-gray-600 dark:text-gray-400">{selectedTask.client.phone}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <MapPin size={20} className="text-red-500" />
                        <span className="text-gray-600 dark:text-gray-400">{selectedTask.address}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-6">
                    <h4 className="font-bold text-blue-700 dark:text-blue-300 mb-4">Task Information</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-blue-600 dark:text-blue-400">Payment</span>
                        <span className="font-bold text-blue-700 dark:text-blue-300">{selectedTask.payment}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-blue-600 dark:text-blue-400">Duration</span>
                        <span className="font-bold text-blue-700 dark:text-blue-300">{selectedTask.estimatedDuration}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-blue-600 dark:text-blue-400">Priority</span>
                        <span className={`px-3 py-1 rounded-2xl text-xs font-bold ${getPriorityColor(selectedTask.priority)}`}>
                          {selectedTask.priority}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Checklist */}
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Task Checklist</h3>
                <div className="space-y-3">
                  {selectedTask.checklist.map((item: any, index: number) => (
                    <div key={index} className="flex items-center space-x-3 p-4 bg-gray-50 dark:bg-gray-900 rounded-xl">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                        item.completed ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'
                      }`}>
                        {item.completed && <CheckCircle size={16} className="text-white" />}
                      </div>
                      <span className={`font-medium ${
                        item.completed ? 'text-green-600 line-through' : 'text-gray-900 dark:text-white'
                      }`}>
                        {item.item}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center space-x-4 pt-6 border-t border-gray-200 dark:border-gray-800">
                <button
                  onClick={() => toast.success('Task started successfully')}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white py-3 px-6 rounded-2xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  Start Task
                </button>
                <button
                  onClick={() => toast.success('Opening navigation...')}
                  className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-3 px-6 rounded-2xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  Navigate
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  className="px-6 py-3 bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-2xl font-semibold transition-all hover:bg-gray-300 dark:hover:bg-gray-700"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}