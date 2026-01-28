'use client'

import { useState } from 'react'
import {
  DollarSign,
  Search,
  Plus,
  Edit,
  Eye,
  Download,
  Upload,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
  TrendingDown,
  Calendar,
  User,
  Briefcase,
  CreditCard,
  FileText,
  AlertCircle,
  Filter,
  Send,
  Receipt,
} from 'lucide-react'
import toast from 'react-hot-toast'

export default function SalaryManagementPage() {
  const [filter, setFilter] = useState('all')
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null)
  const [showModal, setShowModal] = useState(false)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [selectedMonth, setSelectedMonth] = useState('2024-01')

  const salaryRecords = [
    {
      id: 1,
      empId: 'EMP001',
      name: 'Rahul Verma',
      department: 'KYC Verification',
      designation: 'Senior Verifier',
      baseSalary: 45000,
      allowances: 5000,
      deductions: 2000,
      netSalary: 48000,
      status: 'paid',
      paymentDate: '2024-01-05',
      paymentMethod: 'Bank Transfer',
      month: '2024-01',
      avatar: 'RV',
    },
    {
      id: 2,
      empId: 'EMP002',
      name: 'Sneha Reddy',
      department: 'Property Verification',
      designation: 'Property Inspector',
      baseSalary: 50000,
      allowances: 6000,
      deductions: 2500,
      netSalary: 53500,
      status: 'paid',
      paymentDate: '2024-01-05',
      paymentMethod: 'Bank Transfer',
      month: '2024-01',
      avatar: 'SR',
    },
    {
      id: 3,
      empId: 'EMP003',
      name: 'Amit Kumar',
      department: 'Customer Support',
      designation: 'Support Executive',
      baseSalary: 35000,
      allowances: 3000,
      deductions: 1500,
      netSalary: 36500,
      status: 'pending',
      paymentDate: null,
      paymentMethod: null,
      month: '2024-01',
      avatar: 'AK',
    },
    {
      id: 4,
      empId: 'EMP004',
      name: 'Priya Sharma',
      department: 'Legal Team',
      designation: 'Legal Advisor',
      baseSalary: 75000,
      allowances: 10000,
      deductions: 5000,
      netSalary: 80000,
      status: 'processing',
      paymentDate: null,
      paymentMethod: 'Bank Transfer',
      month: '2024-01',
      avatar: 'PS',
    },
  ]

  const stats = {
    totalPayroll: 2456789,
    paidThisMonth: 1856789,
    pendingPayments: 12,
    averageSalary: 52340,
    payrollGrowth: 8.5,
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
      case 'pending':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
      case 'processing':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
      case 'failed':
        return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
    }
  }

  const handleViewDetails = (employee: any) => {
    setSelectedEmployee(employee)
    setShowModal(true)
  }

  const handleProcessPayment = (employee: any) => {
    setSelectedEmployee(employee)
    setShowPaymentModal(true)
  }

  const handlePaySalary = () => {
    toast.success('Salary payment processed successfully')
    setShowPaymentModal(false)
  }

  const handleExportPayroll = () => {
    toast.success('Exporting payroll data...')
  }

  const handleBulkPayment = () => {
    toast.success('Processing bulk payments...')
  }

  const filteredRecords = salaryRecords.filter((record) =>
    filter === 'all' ? true : record.status === filter
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Salary Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage employee salaries and payroll
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={handleBulkPayment}
            className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-lg"
          >
            <Send size={20} />
            <span>Process All</span>
          </button>
          <button
            onClick={handleExportPayroll}
            className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-lg"
          >
            <Download size={20} />
            <span>Export</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/20 rounded-xl">
              <DollarSign size={24} />
            </div>
            <div className="flex items-center space-x-1 text-sm bg-white/20 px-3 py-1 rounded-full">
              <TrendingUp size={16} />
              <span>{stats.payrollGrowth}%</span>
            </div>
          </div>
          <p className="text-3xl font-bold mb-1">
            ₹{(stats.totalPayroll / 100000).toFixed(2)}L
          </p>
          <p className="text-sm opacity-80">Total Payroll</p>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/20 rounded-xl">
              <CheckCircle size={24} />
            </div>
          </div>
          <p className="text-3xl font-bold mb-1">
            ₹{(stats.paidThisMonth / 100000).toFixed(2)}L
          </p>
          <p className="text-sm opacity-80">Paid This Month</p>
        </div>

        <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/20 rounded-xl">
              <Clock size={24} />
            </div>
          </div>
          <p className="text-3xl font-bold mb-1">{stats.pendingPayments}</p>
          <p className="text-sm opacity-80">Pending Payments</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/20 rounded-xl">
              <TrendingUp size={24} />
            </div>
          </div>
          <p className="text-3xl font-bold mb-1">
            ₹{stats.averageSalary.toLocaleString()}
          </p>
          <p className="text-sm opacity-80">Average Salary</p>
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
              placeholder="Search by employee name or ID..."
              className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg text-sm"
            />
            {['all', 'paid', 'pending', 'processing'].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all capitalize ${
                  filter === status
                    ? 'bg-purple-600 text-white shadow-lg'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-950 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  Employee
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  Department
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  Base Salary
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  Allowances
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  Deductions
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  Net Salary
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
              {filteredRecords.map((record) => (
                <tr
                  key={record.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {record.avatar}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {record.name}
                        </p>
                        <p className="text-sm text-gray-500">{record.empId}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {record.department}
                      </p>
                      <p className="text-sm text-gray-500">{record.designation}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-bold text-gray-900 dark:text-white">
                      ₹{record.baseSalary.toLocaleString()}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-medium text-green-600">
                      +₹{record.allowances.toLocaleString()}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-medium text-red-600">
                      -₹{record.deductions.toLocaleString()}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-bold text-purple-600 text-lg">
                      ₹{record.netSalary.toLocaleString()}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold capitalize ${getStatusColor(
                        record.status
                      )}`}
                    >
                      {record.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleViewDetails(record)}
                        className="p-2 hover:bg-purple-100 dark:hover:bg-purple-900/30 rounded-lg transition-all"
                        title="View Details"
                      >
                        <Eye size={18} className="text-purple-600" />
                      </button>
                      {record.status === 'pending' && (
                        <button
                          onClick={() => handleProcessPayment(record)}
                          className="p-2 hover:bg-green-100 dark:hover:bg-green-900/30 rounded-lg transition-all"
                          title="Process Payment"
                        >
                          <Send size={18} className="text-green-600" />
                        </button>
                      )}
                      <button
                        onClick={() => toast.success('Downloading payslip...')}
                        className="p-2 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-all"
                        title="Download Payslip"
                      >
                        <Receipt size={18} className="text-blue-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && selectedEmployee && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-950 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-gray-200 dark:border-gray-800 shadow-2xl">
            <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-pink-600 p-6 z-10">
              <div className="flex items-center justify-between text-white">
                <div>
                  <h2 className="text-2xl font-bold">Salary Details</h2>
                  <p className="text-purple-100">{selectedEmployee.name}</p>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 hover:bg-white/20 rounded-lg transition-all"
                >
                  <XCircle size={24} />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="col-span-2 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-6 border border-purple-200 dark:border-purple-800">
                  <p className="text-sm text-purple-600 dark:text-purple-400 mb-2">
                    Net Salary
                  </p>
                  <p className="text-4xl font-bold text-purple-700 dark:text-purple-300 mb-2">
                    ₹{selectedEmployee.netSalary.toLocaleString()}
                  </p>
                  <div className="flex items-center space-x-2">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(
                        selectedEmployee.status
                      )}`}
                    >
                      {selectedEmployee.status}
                    </span>
                    <span className="text-sm text-purple-600 dark:text-purple-400">
                      {selectedEmployee.month}
                    </span>
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4 border border-gray-200 dark:border-gray-800">
                  <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 mb-2">
                    <User size={18} />
                    <p className="text-sm font-medium">Employee ID</p>
                  </div>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {selectedEmployee.empId}
                  </p>
                </div>

                <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4 border border-gray-200 dark:border-gray-800">
                  <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 mb-2">
                    <Briefcase size={18} />
                    <p className="text-sm font-medium">Department</p>
                  </div>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {selectedEmployee.department}
                  </p>
                </div>

                <div className="col-span-2 bg-gray-50 dark:bg-gray-900 rounded-xl p-4 border border-gray-200 dark:border-gray-800">
                  <h3 className="font-bold text-lg mb-4">Salary Breakdown</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-950 rounded-lg">
                      <span className="text-gray-600 dark:text-gray-400">Base Salary</span>
                      <span className="font-bold text-gray-900 dark:text-white">
                        ₹{selectedEmployee.baseSalary.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <span className="text-green-600 dark:text-green-400">Allowances</span>
                      <span className="font-bold text-green-600">
                        +₹{selectedEmployee.allowances.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                      <span className="text-red-600 dark:text-red-400">Deductions</span>
                      <span className="font-bold text-red-600">
                        -₹{selectedEmployee.deductions.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border-2 border-purple-200 dark:border-purple-800">
                      <span className="font-bold text-purple-700 dark:text-purple-300">
                        Net Salary
                      </span>
                      <span className="font-bold text-purple-700 dark:text-purple-300 text-xl">
                        ₹{selectedEmployee.netSalary.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                {selectedEmployee.paymentDate && (
                  <div className="col-span-2 bg-gray-50 dark:bg-gray-900 rounded-xl p-4 border border-gray-200 dark:border-gray-800">
                    <h3 className="font-bold text-lg mb-4">Payment Information</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                          Payment Date
                        </p>
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {selectedEmployee.paymentDate}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                          Payment Method
                        </p>
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {selectedEmployee.paymentMethod}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-3 pt-6 border-t border-gray-200 dark:border-gray-800">
                <button
                  onClick={() => toast.success('Downloading payslip...')}
                  className="flex-1 flex items-center justify-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl font-semibold transition-all"
                >
                  <Download size={20} />
                  <span>Download Payslip</span>
                </button>
                {selectedEmployee.status === 'pending' && (
                  <button
                    onClick={() => {
                      setShowModal(false)
                      handleProcessPayment(selectedEmployee)
                    }}
                    className="flex-1 flex items-center justify-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-semibold transition-all"
                  >
                    <Send size={20} />
                    <span>Process Payment</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {showPaymentModal && selectedEmployee && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-950 rounded-2xl max-w-2xl w-full border border-gray-200 dark:border-gray-800 shadow-2xl">
            <div className="sticky top-0 bg-gradient-to-r from-green-600 to-green-700 p-6">
              <div className="flex items-center justify-between text-white">
                <h2 className="text-2xl font-bold">Process Salary Payment</h2>
                <button
                  onClick={() => setShowPaymentModal(false)}
                  className="p-2 hover:bg-white/20 rounded-lg transition-all"
                >
                  <XCircle size={24} />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Employee</p>
                    <p className="font-bold text-lg text-gray-900 dark:text-white">
                      {selectedEmployee.name}
                    </p>
                    <p className="text-sm text-gray-500">{selectedEmployee.empId}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Net Salary</p>
                    <p className="font-bold text-2xl text-green-600">
                      ₹{selectedEmployee.netSalary.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Payment Method</label>
                  <select className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-green-500">
                    <option>Bank Transfer</option>
                    <option>Cheque</option>
                    <option>Cash</option>
                    <option>UPI</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Payment Date</label>
                  <input
                    type="date"
                    defaultValue={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Transaction Reference</label>
                  <input
                    type="text"
                    placeholder="Enter transaction reference number"
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Notes (Optional)</label>
                  <textarea
                    rows={3}
                    placeholder="Add any notes about this payment"
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>

              <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-xl p-4 border border-yellow-200 dark:border-yellow-800">
                <div className="flex items-start space-x-3">
                  <AlertCircle size={20} className="text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-yellow-700 dark:text-yellow-400">
                      Please verify all payment details before processing. This action cannot be
                      undone.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3 pt-6 border-t border-gray-200 dark:border-gray-800">
                <button
                  onClick={handlePaySalary}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-semibold transition-all"
                >
                  Confirm Payment
                </button>
                <button
                  onClick={() => setShowPaymentModal(false)}
                  className="px-6 py-3 bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 rounded-xl font-semibold transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
