'use client'

import { useState } from 'react'
import {
  UserCog,
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  CheckCircle,
  XCircle,
  Mail,
  Phone,
  Briefcase,
  Calendar,
  BarChart3,
  TrendingUp,
  Award,
  Clock,
} from 'lucide-react'
import toast from 'react-hot-toast'

export default function EmployeeManagementPage() {
  const [showAddModal, setShowAddModal] = useState(false)
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [filter, setFilter] = useState('all')

  const employees = [
    {
      id: 1,
      empId: 'EMP001',
      name: 'Rahul Verma',
      email: 'rahul@gharbazaar.in',
      phone: '+91 98765 43210',
      department: 'KYC Verification',
      role: 'kyc-staff',
      status: 'active',
      joiningDate: '2023-06-15',
      performance: {
        tasksCompleted: 245,
        accuracyRate: 96,
        hoursActive: 8,
        avgResponseTime: 2.5,
      },
      avatar: 'RV',
    },
    {
      id: 2,
      empId: 'EMP002',
      name: 'Sneha Reddy',
      email: 'sneha@gharbazaar.in',
      phone: '+91 98765 43211',
      department: 'Property Verification',
      role: 'property-verifier',
      status: 'active',
      joiningDate: '2023-08-20',
      performance: {
        tasksCompleted: 189,
        accuracyRate: 98,
        hoursActive: 7.5,
        avgResponseTime: 3.2,
      },
      avatar: 'SR',
    },
    {
      id: 3,
      empId: 'EMP003',
      name: 'Amit Kumar',
      email: 'amit@gharbazaar.in',
      phone: '+91 98765 43212',
      department: 'Customer Support',
      role: 'support-staff',
      status: 'inactive',
      joiningDate: '2023-04-10',
      performance: {
        tasksCompleted: 567,
        accuracyRate: 94,
        hoursActive: 0,
        avgResponseTime: 1.8,
      },
      avatar: 'AK',
    },
  ]

  const stats = {
    total: 48,
    active: 42,
    inactive: 6,
    avgPerformance: 95,
  }

  const getStatusColor = (status: string) => {
    if (status === 'active') {
      return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
    }
    return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
  }

  const handleEdit = (employee: any) => {
    setSelectedEmployee(employee)
    setShowAddModal(true)
  }

  const handleDelete = () => {
    toast.success('Employee removed successfully')
  }

  const handleViewDetails = (employee: any) => {
    setSelectedEmployee(employee)
    setShowDetailModal(true)
  }

  const filteredEmployees = employees.filter((emp) =>
    filter === 'all' ? true : emp.status === filter
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Employee Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage your team members
          </p>
        </div>
        <button
          onClick={() => {
            setSelectedEmployee(null)
            setShowAddModal(true)
          }}
          className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-lg"
        >
          <Plus size={20} />
          <span>Add Employee</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <UserCog size={32} className="opacity-80" />
            <div className="text-right">
              <p className="text-3xl font-bold">{stats.total}</p>
              <p className="text-sm opacity-80">Total Employees</p>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <CheckCircle size={32} className="opacity-80" />
            <div className="text-right">
              <p className="text-3xl font-bold">{stats.active}</p>
              <p className="text-sm opacity-80">Active</p>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-gray-500 to-gray-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <XCircle size={32} className="opacity-80" />
            <div className="text-right">
              <p className="text-3xl font-bold">{stats.inactive}</p>
              <p className="text-sm opacity-80">Inactive</p>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <TrendingUp size={32} className="opacity-80" />
            <div className="text-right">
              <p className="text-3xl font-bold">{stats.avgPerformance}%</p>
              <p className="text-sm opacity-80">Avg Performance</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-950 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Search employees..."
              className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div className="flex items-center space-x-2">
            {['all', 'active', 'inactive'].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all capitalize ${filter === status ? 'bg-purple-600 text-white shadow-lg' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'}`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEmployees.map((employee) => (
          <div
            key={employee.id}
            className="bg-white dark:bg-gray-950 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-xl transition-all"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-white font-bold">
                  {employee.avatar}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white">
                    {employee.name}
                  </h3>
                  <p className="text-sm text-gray-500">{employee.empId}</p>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-lg text-xs font-bold capitalize ${getStatusColor(employee.status)}`}>
                {employee.status}
              </span>
            </div>

            <div className="space-y-2 mb-4 pb-4 border-b border-gray-200 dark:border-gray-800">
              <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                <Briefcase size={16} />
                <span>{employee.department}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                <Mail size={16} />
                <span className="truncate">{employee.email}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                <Phone size={16} />
                <span>{employee.phone}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                <Calendar size={16} />
                <span>Joined {employee.joiningDate}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 border border-blue-200 dark:border-blue-800">
                <p className="text-xs text-blue-600 dark:text-blue-400 mb-1">
                  Tasks
                </p>
                <p className="text-lg font-bold text-blue-700 dark:text-blue-300">
                  {employee.performance.tasksCompleted}
                </p>
              </div>
              <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3 border border-green-200 dark:border-green-800">
                <p className="text-xs text-green-600 dark:text-green-400 mb-1">
                  Accuracy
                </p>
                <p className="text-lg font-bold text-green-700 dark:text-green-300">
                  {employee.performance.accuracyRate}%
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleViewDetails(employee)}
                className="flex-1 flex items-center justify-center space-x-1 bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg font-medium transition-all"
              >
                <Eye size={16} />
                <span>View</span>
              </button>
              <button
                onClick={() => handleEdit(employee)}
                className="flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition-all"
              >
                <Edit size={16} />
              </button>
              <button
                onClick={() => handleDelete()}
                className="flex items-center justify-center bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg transition-all"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-950 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-200 dark:border-gray-800 shadow-2xl">
            <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-pink-600 p-6 z-10">
              <div className="flex items-center justify-between text-white">
                <h2 className="text-2xl font-bold">
                  {selectedEmployee ? 'Edit Employee' : 'Add New Employee'}
                </h2>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-2 hover:bg-white/20 rounded-lg transition-all"
                >
                  <XCircle size={24} />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    defaultValue={selectedEmployee?.name}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-purple-500"
                    placeholder="Enter full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Employee ID
                  </label>
                  <input
                    type="text"
                    defaultValue={selectedEmployee?.empId}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-purple-500"
                    placeholder="EMP001"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <input
                    type="email"
                    defaultValue={selectedEmployee?.email}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-purple-500"
                    placeholder="email@gharbazaar.in"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Phone</label>
                  <input
                    type="tel"
                    defaultValue={selectedEmployee?.phone}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-purple-500"
                    placeholder="+91 98765 43210"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-3 pt-6 border-t border-gray-200 dark:border-gray-800">
                <button
                  onClick={() => {
                    toast.success(selectedEmployee ? 'Employee updated successfully' : 'Employee added successfully')
                    setShowAddModal(false)
                  }}
                  className="flex-1 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl font-semibold transition-all"
                >
                  {selectedEmployee ? 'Update Employee' : 'Add Employee'}
                </button>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="px-6 py-3 bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 rounded-xl font-semibold transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showDetailModal && selectedEmployee && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-950 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-gray-200 dark:border-gray-800 shadow-2xl">
            <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-pink-600 p-6 z-10">
              <div className="flex items-center justify-between text-white">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center text-2xl font-bold">
                    {selectedEmployee.avatar}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">{selectedEmployee.name}</h2>
                    <p className="text-purple-100">
                      {selectedEmployee.empId} • {selectedEmployee.department}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="p-2 hover:bg-white/20 rounded-lg transition-all"
                >
                  <XCircle size={24} />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-4 gap-4">
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
                  <div className="flex items-center space-x-2 text-blue-600 dark:text-blue-400 mb-2">
                    <BarChart3 size={20} />
                    <p className="text-sm font-medium">Tasks</p>
                  </div>
                  <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                    {selectedEmployee.performance.tasksCompleted}
                  </p>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4 border border-green-200 dark:border-green-800">
                  <div className="flex items-center space-x-2 text-green-600 dark:text-green-400 mb-2">
                    <Award size={20} />
                    <p className="text-sm font-medium">Accuracy</p>
                  </div>
                  <p className="text-2xl font-bold text-green-700 dark:text-green-300">
                    {selectedEmployee.performance.accuracyRate}%
                  </p>
                </div>
                <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4 border border-purple-200 dark:border-purple-800">
                  <div className="flex items-center space-x-2 text-purple-600 dark:text-purple-400 mb-2">
                    <Clock size={20} />
                    <p className="text-sm font-medium">Hours</p>
                  </div>
                  <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">
                    {selectedEmployee.performance.hoursActive}h
                  </p>
                </div>
                <div className="bg-orange-50 dark:bg-orange-900/20 rounded-xl p-4 border border-orange-200 dark:border-orange-800">
                  <div className="flex items-center space-x-2 text-orange-600 dark:text-orange-400 mb-2">
                    <TrendingUp size={20} />
                    <p className="text-sm font-medium">Response</p>
                  </div>
                  <p className="text-2xl font-bold text-orange-700 dark:text-orange-300">
                    {selectedEmployee.performance.avgResponseTime}h
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3 pt-6 border-t border-gray-200 dark:border-gray-800">
                <button
                  onClick={() => {
                    setShowDetailModal(false)
                    handleEdit(selectedEmployee)
                  }}
                  className="flex-1 flex items-center justify-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl font-semibold transition-all"
                >
                  <Edit size={20} />
                  <span>Edit Employee</span>
                </button>
                <button
                  onClick={() => {
                    setShowDetailModal(false)
                    handleDelete()
                  }}
                  className="flex items-center justify-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-semibold transition-all"
                >
                  <Trash2 size={20} />
                  <span>Remove</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
