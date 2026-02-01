'use client'

import { useState, useEffect } from 'react'
import {
    Calendar,
    Clock,
    CheckCircle,
    XCircle,
    Search,
    Filter,
    Download,
    User,
    MapPin,
    AlertCircle,
    Loader2,
    ChevronLeft,
    ChevronRight,
} from 'lucide-react'
import toast from 'react-hot-toast'
import { backendApi } from '@/lib/backendApi'

export default function AttendanceManagementPage() {
    const [loading, setLoading] = useState(false)
    const [employees, setEmployees] = useState<any[]>([])
    const [attendanceRecords, setAttendanceRecords] = useState<any[]>([])
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
    const [searchQuery, setSearchQuery] = useState('')

    useEffect(() => {
        fetchData()
    }, [selectedDate])

    const fetchData = async () => {
        setLoading(true)
        try {
            const [empRes, attRes] = await Promise.all([
                backendApi.admin.listEmployees(),
                backendApi.attendance.getHistory({ startDate: selectedDate, endDate: selectedDate })
            ])

            if (empRes.success) setEmployees(empRes.data.employees)
            if (attRes.success) setAttendanceRecords(attRes.data.records)
        } catch (error) {
            console.error('Error fetching attendance:', error)
            toast.error('Failed to load attendance data')
        } finally {
            setLoading(false)
        }
    }

    const combinedRecords = employees.map(emp => {
        const record = attendanceRecords.find(r => r.userId === emp.uid)
        return {
            id: emp.uid,
            empId: emp.employeeProfile?.employeeId || 'N/A',
            name: emp.name,
            department: emp.employeeProfile?.department || 'Sales',
            designation: emp.employeeProfile?.designation || 'Agent',
            status: record ? record.status : 'absent',
            checkIn: record?.checkIn ? new Date(record.checkIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-',
            checkOut: record?.checkOut ? new Date(record.checkOut).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-',
            location: record?.location?.address || 'N/A',
            notes: record?.notes || '',
        }
    })

    const stats = {
        present: combinedRecords.filter(r => r.status === 'present').length,
        absent: combinedRecords.filter(r => r.status === 'absent').length,
        leave: combinedRecords.filter(r => r.status === 'leave').length,
        total: combinedRecords.length
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'present': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
            case 'absent': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
            case 'leave': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
            default: return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
        }
    }

    const filteredRecords = combinedRecords.filter(r =>
        r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.empId.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Attendance Tracking</h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">Monitor daily presence and work hours</p>
                </div>
                <div className="flex items-center space-x-3">
                    <div className="flex items-center bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl px-3 py-2 shadow-sm">
                        <button onClick={() => {
                            const d = new Date(selectedDate);
                            d.setDate(d.getDate() - 1);
                            setSelectedDate(d.toISOString().split('T')[0]);
                        }} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
                            <ChevronLeft size={20} />
                        </button>
                        <input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className="bg-transparent border-none focus:ring-0 text-sm font-semibold mx-2"
                        />
                        <button onClick={() => {
                            const d = new Date(selectedDate);
                            d.setDate(d.getDate() + 1);
                            setSelectedDate(d.toISOString().split('T')[0]);
                        }} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
                            <ChevronRight size={20} />
                        </button>
                    </div>
                    <button className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-lg">
                        <Download size={20} />
                        <span>Export Report</span>
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white dark:bg-gray-950 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                        <div className="p-3 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl">
                            <User size={24} />
                        </div>
                        <span className="text-sm font-medium text-gray-500">Total</span>
                    </div>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
                    <p className="text-sm text-gray-500 mt-1">Employees Tracked</p>
                </div>

                <div className="bg-white dark:bg-gray-950 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                        <div className="p-3 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-xl">
                            <CheckCircle size={24} />
                        </div>
                        <span className="text-sm font-medium text-gray-500">Present</span>
                    </div>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.present}</p>
                    <p className="text-sm text-gray-500 mt-1">{((stats.present / stats.total) * 100 || 0).toFixed(1)}% Attendance Rate</p>
                </div>

                <div className="bg-white dark:bg-gray-950 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                        <div className="p-3 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-xl">
                            <XCircle size={24} />
                        </div>
                        <span className="text-sm font-medium text-gray-500">Absent</span>
                    </div>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.absent}</p>
                    <p className="text-sm text-gray-500 mt-1">Needs Attention</p>
                </div>

                <div className="bg-white dark:bg-gray-950 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                        <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 rounded-xl">
                            <Calendar size={24} />
                        </div>
                        <span className="text-sm font-medium text-gray-500">On Leave</span>
                    </div>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.leave}</p>
                    <p className="text-sm text-gray-500 mt-1">Approved Time-off</p>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-950 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
                <div className="relative max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search employee or ID..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-purple-500"
                    />
                </div>
            </div>

            <div className="bg-white dark:bg-gray-950 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Employee</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Department</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Check In</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Check Out</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Region</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                            {loading ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                                        <Loader2 className="animate-spin mx-auto mb-2" size={32} />
                                        Loading attendance...
                                    </td>
                                </tr>
                            ) : filteredRecords.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-12 text-center text-gray-500">No records found.</td>
                                </tr>
                            ) : (
                                filteredRecords.map((record: any) => (
                                    <tr key={record.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                                                    {record.name.split(' ').map((n: any) => n[0]).join('')}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900 dark:text-white">{record.name}</p>
                                                    <p className="text-sm text-gray-500">{record.empId}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{record.department}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold capitalize ${getStatusColor(record.status)}`}>
                                                {record.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm font-semibold text-gray-900 dark:text-white">{record.checkIn}</td>
                                        <td className="px-6 py-4 text-sm font-semibold text-gray-900 dark:text-white">{record.checkOut}</td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            <div className="flex items-center space-x-1">
                                                <MapPin size={14} />
                                                <span>{record.location}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all text-purple-600">
                                                View Details
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
