'use client';

/**
 * 👔 EMPLOYEE CHAT DASHBOARD
 * 
 * Comprehensive employee interface for managing support tickets.
 * Features ticket queue, active conversations, user history, and quick responses.
 * 
 * @author GharBazaar Frontend Team
 */

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useSocket } from '@/contexts/SocketContext';
import { useToast } from '@/components/Toast/ToastProvider';
import { backendApi } from '@/lib/backendApi';
import {
    Users,
    Clock,
    CheckCircle,
    AlertCircle,
    MessageSquare,
    TrendingUp,
    Filter,
    Search,
    Mail,
    Phone,
} from 'lucide-react';
import PresenceIndicator from '@/components/Chat/PresenceIndicator';

interface Ticket {
    _id: string;
    userId: string;
    userRole: 'buyer' | 'seller';
    categoryTitle: string;
    subCategoryTitle: string;
    problem: string;
    status: 'open' | 'assigned' | 'in_progress' | 'resolved' | 'closed';
    assignedTo?: string;
    assignedToName?: string;
    createdAt: string;
    updatedAt: string;
}

interface EmployeeStats {
    activeTickets: number;
    resolvedToday: number;
    averageResponseTime: number;
    totalAssigned: number;
}

export default function EmployeeChatDashboard() {
    const { user } = useAuth();
    const { socket, connected } = useSocket();
    const toast = useToast();

    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
    const [stats, setStats] = useState<EmployeeStats>({
        activeTickets: 0,
        resolvedToday: 0,
        averageResponseTime: 0,
        totalAssigned: 0,
    });
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);

    // Fetch tickets and stats
    useEffect(() => {
        fetchTickets();
        fetchStats();
    }, [statusFilter]);

    // Socket.io listeners for real-time updates
    useEffect(() => {
        if (!socket || !connected) return;

        socket.on('ticket:new-message', () => {
            fetchTickets();
        });

        socket.on('ticket:status-changed', () => {
            fetchTickets();
            fetchStats();
        });

        return () => {
            socket.off('ticket:new-message');
            socket.off('ticket:status-changed');
        };
    }, [socket, connected]);

    const fetchTickets = async () => {
        try {
            const response = await backendApi.employee.getTickets(statusFilter);
            if (response.success) {
                setTickets(response.data.tickets || []);
            }
        } catch (error) {
            console.error('Error fetching tickets:', error);
            toast.error('Failed to load tickets');
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            const response = await backendApi.employee.getStats();
            if (response.success) {
                setStats(response.data.stats);
            }
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    };

    const handleAssignTicket = async (ticketId: string) => {
        if (!socket || !connected) {
            toast.error('Not connected to server');
            return;
        }

        socket.emit('assign_ticket', { ticketId });
        toast.success('Ticket assigned to you');
        fetchTickets();
        fetchStats();
    };

    const handleCloseTicket = async (ticketId: string) => {
        if (!socket || !connected) {
            toast.error('Not connected to server');
            return;
        }

        socket.emit('close_ticket', { ticketId });
        toast.success('Ticket closed');
        fetchTickets();
        fetchStats();
    };

    const getPriorityColor = (status: string) => {
        switch (status) {
            case 'open':
                return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
            case 'assigned':
                return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
            case 'in_progress':
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
            case 'resolved':
                return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
            case 'closed':
                return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const filteredTickets = tickets.filter(ticket =>
        ticket.problem.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ticket.categoryTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ticket.subCategoryTitle.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="h-full flex flex-col bg-gray-50 dark:bg-gray-900">
            {/* Header */}
            <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                            Employee Dashboard
                        </h1>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            Manage support tickets and customer conversations
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="px-3 py-1 bg-green-100 dark:bg-green-900 rounded-full text-sm font-medium text-green-800 dark:text-green-200">
                            {connected ? '🟢 Online' : '🔴 Offline'}
                        </div>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-4 gap-4 mt-6">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-500 rounded-lg">
                                <Users size={20} className="text-white" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                                    {stats.activeTickets}
                                </p>
                                <p className="text-xs text-blue-700 dark:text-blue-300">Active Tickets</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-green-500 rounded-lg">
                                <CheckCircle size={20} className="text-white" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-green-900 dark:text-green-100">
                                    {stats.resolvedToday}
                                </p>
                                <p className="text-xs text-green-700 dark:text-green-300">Resolved Today</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-purple-500 rounded-lg">
                                <TrendingUp size={20} className="text-white" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                                    {stats.totalAssigned}
                                </p>
                                <p className="text-xs text-purple-700 dark:text-purple-300">Total Assigned</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 p-4 rounded-lg border border-orange-200 dark:border-orange-800">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-orange-500 rounded-lg">
                                <Clock size={20} className="text-white" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-orange-900 dark:text-orange-100">
                                    {stats.averageResponseTime}m
                                </p>
                                <p className="text-xs text-orange-700 dark:text-orange-300">Avg Response</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters and Search */}
            <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-3">
                <div className="flex items-center gap-4">
                    {/* Status Filter */}
                    <div className="flex items-center gap-2">
                        <Filter size={18} className="text-gray-500" />
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="all">All Tickets</option>
                            <option value="open">Open</option>
                            <option value="assigned">Assigned</option>
                            <option value="in_progress">In Progress</option>
                            <option value="resolved">Resolved</option>
                            <option value="closed">Closed</option>
                        </select>
                    </div>

                    {/* Search */}
                    <div className="flex-1 relative">
                        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search tickets..."
                            className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>
            </div>

            {/* Ticket List */}
            <div className="flex-1 overflow-y-auto p-6">
                {loading ? (
                    <div className="flex items-center justify-center h-full">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                    </div>
                ) : filteredTickets.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center">
                        <MessageSquare size={64} className="text-gray-300 dark:text-gray-600 mb-4" />
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                            No tickets found
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400">
                            {searchQuery ? 'Try adjusting your search' : 'All tickets are handled!'}
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                        {filteredTickets.map((ticket) => (
                            <div
                                key={ticket._id}
                                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-lg transition-shadow cursor-pointer"
                                onClick={() => setSelectedTicket(ticket)}
                            >
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-center gap-2">
                                        <span
                                            className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(
                                                ticket.status
                                            )}`}
                                        >
                                            {ticket.status.replace('_', ' ')}
                                        </span>
                                        <PresenceIndicator userId={ticket.userId} size="sm" />
                                    </div>
                                    <span className="text-xs text-gray-500">
                                        {new Date(ticket.createdAt).toLocaleDateString()}
                                    </span>
                                </div>

                                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                                    {ticket.categoryTitle}
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                    {ticket.subCategoryTitle}
                                </p>
                                <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2 mb-3">
                                    {ticket.problem}
                                </p>

                                <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
                                    <span className="text-xs text-gray-500 capitalize">
                                        {ticket.userRole}
                                    </span>
                                    {ticket.assignedTo === user?.uid ? (
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleCloseTicket(ticket._id);
                                            }}
                                            className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white text-xs rounded transition-colors"
                                        >
                                            Close Ticket
                                        </button>
                                    ) : ticket.status === 'open' ? (
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleAssignTicket(ticket._id);
                                            }}
                                            className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white text-xs rounded transition-colors"
                                        >
                                            Assign to Me
                                        </button>
                                    ) : (
                                        <span className="text-xs text-gray-500">
                                            {ticket.assignedToName || 'Unassigned'}
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
