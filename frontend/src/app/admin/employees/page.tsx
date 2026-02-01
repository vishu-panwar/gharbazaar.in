'use client'

import { useEffect, useState } from 'react'
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
  Loader2,
  CreditCard,
} from 'lucide-react'
import toast from 'react-hot-toast'
import { backendApi } from '@/lib/backendApi'

export default function EmployeeManagementPage() {
  const [showAddModal, setShowAddModal] = useState(false)
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [filter, setFilter] = useState('all')
  const [loading, setLoading] = useState(true)
  const [employees, setEmployees] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState('')

  // New employee form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    department: 'Sales',
    designation: 'Support Agent'
  })

  const [showEditModal, setShowEditModal] = useState(false)
  const [editFormData, setEditFormData] = useState<any>({
    department: '',
    designation: '',
    baseSalary: 0,
    allowances: 0,
    deductions: 0,
    bankDetails: { accountNumber: '', ifscCode: '', bankName: '' },
    govtIds: { aadharNumber: '', panNumber: '' },
    currentAddress: '',
    permanentAddress: '',
    emergencyContact: { name: '', relationship: '', phone: '' }
  })

  useEffect(() => {
    fetchEmployees()
  }, [])

  const fetchEmployees = async () => {
    setLoading(true)
    try {
      const response = await backendApi.admin.listEmployees()
      if (response.success) {
        setEmployees(response.data.employees)
      } else {
        toast.error(response.error || 'Failed to fetch employees')
      }
    } catch (error) {
      console.error('Error fetching employees:', error)
      toast.error('Connection error')
    } finally {
      setLoading(false)
    }
  }

  const handleAddEmployee = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await backendApi.admin.addEmployee(formData)
      if (response.success) {
        toast.success('Employee added successfully')
        setShowAddModal(false)
        fetchEmployees()
        setFormData({
          name: '',
          email: '',
          password: '',
          department: 'Sales',
          designation: 'Support Agent'
        })
      } else {
        toast.error(response.error || 'Failed to add employee')
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to add employee')
    }
  }

  const handleDelete = async (uid: string) => {
    if (!confirm('Are you sure you want to remove this employee?')) return

    try {
      const response = await backendApi.admin.removeEmployee(uid)
      if (response.success) {
        toast.success('Employee removed successfully')
        fetchEmployees()
        if (showDetailModal) setShowDetailModal(false)
      } else {
        toast.error(response.error || 'Failed to remove employee')
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to remove employee')
    }
  }

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedEmployee) return
    try {
      const response = await backendApi.admin.updateEmployeeProfile(selectedEmployee.uid, editFormData)
      if (response.success) {
        toast.success('Profile updated successfully')
        setShowEditModal(false)
        fetchEmployees()
      } else {
        toast.error(response.error || 'Failed to update profile')
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to update profile')
    }
  }

  const stats = {
    total: employees.length,
    active: employees.filter(e => e.profile?.status === 'active').length,
    inactive: employees.filter(e => e.profile?.status === 'terminated').length,
    avgPerformance: 95,
  }

  const getStatusColor = (status: string) => {
    if (status === 'active') {
      return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
    }
    if (status === 'terminated') {
      return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
    }
    return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
  }

  const handleEdit = (employee: any) => {
    setSelectedEmployee(employee)
    const profile = employee.profile || {}
    setEditFormData({
      department: profile.department || 'Sales',
      designation: profile.designation || 'Support Agent',
      baseSalary: profile.baseSalary || 25000,
      allowances: profile.allowances || 0,
      deductions: profile.deductions || 0,
      bankDetails: profile.bankDetails || { accountNumber: '', ifscCode: '', bankName: '' },
      govtIds: profile.govtIds || { aadharNumber: '', panNumber: '' },
      currentAddress: profile.currentAddress || '',
      permanentAddress: profile.permanentAddress || '',
      emergencyContact: profile.emergencyContact || { name: '', relationship: '', phone: '' }
    })
    setShowEditModal(true)
  }

  const handleViewDetails = (employee: any) => {
    setSelectedEmployee(employee)
    setShowDetailModal(true)
  }

  const filteredEmployees = employees.filter((emp) => {
    const matchesFilter = filter === 'all' ? true : emp.profile?.status === filter
    const matchesSearch = emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.profile?.employeeId?.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesFilter && matchesSearch
  })

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
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div className="flex items-center space-x-2">
            {['all', 'active', 'terminated'].map((status) => (
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

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="animate-spin text-purple-600" size={48} />
        </div>
      ) : filteredEmployees.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-gray-950 rounded-2xl border border-dashed border-gray-300 dark:border-gray-700">
          <p className="text-gray-500">No employees found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEmployees.map((employee) => (
            <div
              key={employee.uid}
              className="bg-white dark:bg-gray-950 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-xl transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-white font-bold">
                    {employee.name.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white">
                      {employee.name}
                    </h3>
                    <p className="text-sm text-gray-500">{employee.profile?.employeeId || 'No ID'}</p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-lg text-xs font-bold capitalize ${getStatusColor(employee.profile?.status || 'active')}`}>
                  {employee.profile?.status || 'active'}
                </span>
              </div>

              <div className="space-y-2 mb-4 pb-4 border-b border-gray-200 dark:border-gray-800">
                <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                  <Briefcase size={16} />
                  <span>{employee.profile?.designation || 'Support Agent'}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                  <Mail size={16} />
                  <span className="truncate">{employee.email}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                  <Phone size={16} />
                  <span>{employee.phone || 'No phone'}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                  <Calendar size={16} />
                  <span>Joined {employee.profile?.joiningDate ? new Date(employee.profile.joiningDate).toLocaleDateString() : 'N/A'}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 border border-blue-200 dark:border-blue-800">
                  <p className="text-xs text-blue-600 dark:text-blue-400 mb-1">
                    Department
                  </p>
                  <p className="text-sm font-bold text-blue-700 dark:text-blue-300">
                    {employee.profile?.department || 'Sales'}
                  </p>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3 border border-green-200 dark:border-green-800">
                  <p className="text-xs text-green-600 dark:text-green-400 mb-1">
                    Rating
                  </p>
                  <p className="text-lg font-bold text-green-700 dark:text-green-300">
                    {employee.profile?.performanceRating || 5}/5
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
                  title="Edit Profile"
                >
                  <Edit size={16} />
                </button>
                <button
                  onClick={() => handleDelete(employee.uid)}
                  className="flex items-center justify-center bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg transition-all"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

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

            <form onSubmit={handleAddEmployee} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-purple-500"
                    placeholder="Enter full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Department
                  </label>
                  <select
                    value={formData.department}
                    onChange={e => setFormData({ ...formData, department: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="Sales">Sales</option>
                    <option value="KYC Verification">KYC Verification</option>
                    <option value="Property Verification">Property Verification</option>
                    <option value="Customer Support">Customer Support</option>
                    <option value="Legal">Legal</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-purple-500"
                    placeholder="email@gharbazaar.in"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Password</label>
                  <input
                    type="password"
                    required={!selectedEmployee}
                    value={formData.password}
                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-purple-500"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Designation</label>
                <input
                  type="text"
                  value={formData.designation}
                  onChange={e => setFormData({ ...formData, designation: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-purple-500"
                  placeholder="Support Agent"
                />
              </div>

              <div className="flex items-center space-x-3 pt-6 border-t border-gray-200 dark:border-gray-800">
                <button
                  type="submit"
                  className="flex-1 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl font-semibold transition-all"
                >
                  {selectedEmployee ? 'Update Employee' : 'Add Employee'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-6 py-3 bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 rounded-xl font-semibold transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
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
                    {selectedEmployee.name.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">{selectedEmployee.name}</h2>
                    <p className="text-purple-100">
                      {selectedEmployee.profile?.employeeId || 'No ID'} • {selectedEmployee.profile?.department || 'Sales'}
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

            <div className="p-6 space-y-8">
              <div className="grid grid-cols-4 gap-4">
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
                  <div className="flex items-center space-x-2 text-blue-600 dark:text-blue-400 mb-2">
                    <BarChart3 size={20} />
                    <p className="text-sm font-medium">Department</p>
                  </div>
                  <p className="text-lg font-bold text-blue-700 dark:text-blue-300">
                    {selectedEmployee.profile?.department || 'Sales'}
                  </p>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4 border border-green-200 dark:border-green-800">
                  <div className="flex items-center space-x-2 text-green-600 dark:text-green-400 mb-2">
                    <Award size={20} />
                    <p className="text-sm font-medium">Rating</p>
                  </div>
                  <p className="text-2xl font-bold text-green-700 dark:text-green-300">
                    {selectedEmployee.profile?.performanceRating || 5}/5
                  </p>
                </div>
                <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4 border border-purple-200 dark:border-purple-800">
                  <div className="flex items-center space-x-2 text-purple-600 dark:text-purple-400 mb-2">
                    <Clock size={20} />
                    <p className="text-sm font-medium">Joined</p>
                  </div>
                  <p className="text-sm font-bold text-purple-700 dark:text-purple-300">
                    {selectedEmployee.profile?.joiningDate ? new Date(selectedEmployee.profile.joiningDate).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
                <div className="bg-orange-50 dark:bg-orange-900/20 rounded-xl p-4 border border-orange-200 dark:border-orange-800">
                  <div className="flex items-center space-x-2 text-orange-600 dark:text-orange-400 mb-2">
                    <TrendingUp size={20} />
                    <p className="text-sm font-medium">Status</p>
                  </div>
                  <p className="text-2xl font-bold text-orange-700 dark:text-orange-300 capitalize">
                    {selectedEmployee.profile?.status || 'active'}
                  </p>
                </div>
              </div>

              {/* HR Details Row */}
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
                  <h3 className="text-lg font-bold mb-4 flex items-center space-x-2">
                    <CreditCard size={20} className="text-blue-600" />
                    <span>Financial & Bank Information</span>
                  </h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-gray-500 uppercase">Base Salary</p>
                        <p className="font-bold">₹{selectedEmployee.profile?.baseSalary?.toLocaleString() || 0}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase">Allowances</p>
                        <p className="font-bold text-green-600">+₹{selectedEmployee.profile?.allowances?.toLocaleString() || 0}</p>
                      </div>
                    </div>
                    <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
                      <p className="text-xs text-gray-500 uppercase mb-1">Bank Account</p>
                      <p className="font-medium text-sm">{selectedEmployee.profile?.bankDetails?.bankName || 'N/A'}</p>
                      <p className="text-lg font-mono font-bold">{selectedEmployee.profile?.bankDetails?.accountNumber || 'xxxx xxxx xxxx'}</p>
                      <p className="text-xs text-gray-400">IFSC: {selectedEmployee.profile?.bankDetails?.ifscCode || 'N/A'}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
                  <h3 className="text-lg font-bold mb-4 flex items-center space-x-2">
                    <UserCog size={20} className="text-purple-600" />
                    <span>Identity & Verification</span>
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-xs text-gray-500 uppercase">Aadhar Number</p>
                      <p className="font-bold font-mono tracking-widest">{selectedEmployee.profile?.govtIds?.aadharNumber || 'xxxx-xxxx-xxxx'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase">PAN Number</p>
                      <p className="font-bold font-mono">{selectedEmployee.profile?.govtIds?.panNumber || 'N/A'}</p>
                    </div>
                    <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
                      <p className="text-xs text-gray-500 uppercase">Address</p>
                      <p className="text-sm font-medium line-clamp-2">{selectedEmployee.profile?.currentAddress || 'No current address provided'}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3 pt-6 border-t border-gray-200 dark:border-gray-800">
                <button
                  onClick={() => {
                    handleEdit(selectedEmployee);
                    setShowDetailModal(false);
                  }}
                  className="flex-1 flex items-center justify-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl font-semibold transition-all"
                >
                  <Edit size={20} />
                  <span>Edit Profile</span>
                </button>
                <button
                  onClick={() => {
                    handleDelete(selectedEmployee.uid)
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
      {showEditModal && selectedEmployee && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-950 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-gray-200 dark:border-gray-800 shadow-2xl">
            <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-indigo-600 p-6 z-10">
              <div className="flex items-center justify-between text-white">
                <div>
                  <h2 className="text-2xl font-bold">Edit HR Profile</h2>
                  <p className="text-blue-100">{selectedEmployee.name} • {selectedEmployee.profile?.employeeId}</p>
                </div>
                <button onClick={() => setShowEditModal(false)} className="p-2 hover:bg-white/20 rounded-lg transition-all">
                  <XCircle size={24} />
                </button>
              </div>
            </div>

            <form onSubmit={handleUpdateProfile} className="p-6 space-y-8">
              {/* Financial Section */}
              <div>
                <h3 className="text-lg font-bold mb-4 flex items-center space-x-2">
                  <TrendingUp className="text-blue-600" size={20} />
                  <span>Financial Details</span>
                </h3>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Base Salary (₹)</label>
                    <input
                      type="number"
                      value={editFormData.baseSalary}
                      onChange={e => setEditFormData({ ...editFormData, baseSalary: parseInt(e.target.value) })}
                      className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Allowances (₹)</label>
                    <input
                      type="number"
                      value={editFormData.allowances}
                      onChange={e => setEditFormData({ ...editFormData, allowances: parseInt(e.target.value) })}
                      className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Deductions (₹)</label>
                    <input
                      type="number"
                      value={editFormData.deductions}
                      onChange={e => setEditFormData({ ...editFormData, deductions: parseInt(e.target.value) })}
                      className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg"
                    />
                  </div>
                </div>
              </div>

              {/* Bank Details */}
              <div>
                <h3 className="text-lg font-bold mb-4 flex items-center space-x-2">
                  <CreditCard className="text-green-600" size={20} />
                  <span>Bank Information</span>
                </h3>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Account Number</label>
                    <input
                      type="text"
                      value={editFormData.bankDetails.accountNumber}
                      onChange={e => setEditFormData({ ...editFormData, bankDetails: { ...editFormData.bankDetails, accountNumber: e.target.value } })}
                      className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">IFSC Code</label>
                    <input
                      type="text"
                      value={editFormData.bankDetails.ifscCode}
                      onChange={e => setEditFormData({ ...editFormData, bankDetails: { ...editFormData.bankDetails, ifscCode: e.target.value } })}
                      className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Bank Name</label>
                    <input
                      type="text"
                      value={editFormData.bankDetails.bankName}
                      onChange={e => setEditFormData({ ...editFormData, bankDetails: { ...editFormData.bankDetails, bankName: e.target.value } })}
                      className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg"
                    />
                  </div>
                </div>
              </div>

              {/* Govt IDs & Address */}
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-bold mb-4">Identification</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Aadhar Number</label>
                      <input
                        type="text"
                        value={editFormData.govtIds.aadharNumber}
                        onChange={e => setEditFormData({ ...editFormData, govtIds: { ...editFormData.govtIds, aadharNumber: e.target.value } })}
                        className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">PAN Number</label>
                      <input
                        type="text"
                        value={editFormData.govtIds.panNumber}
                        onChange={e => setEditFormData({ ...editFormData, govtIds: { ...editFormData.govtIds, panNumber: e.target.value } })}
                        className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg"
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-4">Address</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Current Address</label>
                      <textarea
                        value={editFormData.currentAddress}
                        onChange={e => setEditFormData({ ...editFormData, currentAddress: e.target.value })}
                        className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg"
                        rows={2}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Permanent Address</label>
                      <textarea
                        value={editFormData.permanentAddress}
                        onChange={e => setEditFormData({ ...editFormData, permanentAddress: e.target.value })}
                        className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg"
                        rows={2}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3 pt-6 border-t border-gray-200 dark:border-gray-800">
                <button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-lg">
                  Save Changes
                </button>
                <button type="button" onClick={() => setShowEditModal(false)} className="px-6 py-3 bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 rounded-xl font-semibold transition-all">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
