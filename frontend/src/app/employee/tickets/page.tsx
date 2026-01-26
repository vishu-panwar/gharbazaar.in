'use client';

import React, { useState, useEffect } from 'react';
import { MessageSquare, Clock, CheckCircle, X, Send, Paperclip, Star } from 'lucide-react';
import { useSocket } from '@/contexts/SocketContext';
import { useAuth } from '@/contexts/AuthContext';

interface Ticket {
    id: string;
    userId: string;
    userRole: 'buyer' | 'seller';
    categoryTitle: string;
    subCategoryTitle: string;
    problem: string;
    status: 'open' | 'assigned' | 'in_progress' | 'resolved' | 'closed';
    createdAt: any;
    assignedTo?: string;
    assignedToName?: string;
}

interface TicketMessage {
    id: string;
    ticketId: string;
    senderId: string;
    senderType: 'customer' | 'employee';
    message: string;
    fileUrl?: string;
    fileName?: string;
    timestamp: any;
}

export default function EmployeeTicketsPage() {
    const { socket, connected } = useSocket();
    const { user } = useAuth();

    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
    const [messages, setMessages] = useState<TicketMessage[]>([]);
    const [inputMessage, setInputMessage] = useState('');
    const [filter, setFilter] = useState<'all' | 'open' | 'assigned' | 'closed'>('all');
    const [loading, setLoading] = useState(true);

    // Fetch tickets
    useEffect(() => {
        fetchTickets();
    }, [filter]);

    // Socket.IO setup for employees
    useEffect(() => {
        if (!socket || !connected) return;

        // Join employees room to receive ticket notifications
        socket.emit('join_employee_room');

        // Listen for new ticket notifications
        socket.on('ticket:created', (data: any) => {
            console.log('New ticket created:', data);
            fetchTickets();
        });

        socket.on('ticket:customer-message', (data: any) => {
            if (selectedTicket && data.ticketId === selectedTicket.id) {
                fetchMessages(selectedTicket.id);
            }
            fetchTickets(); // Update last message  time
        });

        return () => {
            socket.off('ticket:created');
            socket.off('ticket:customer-message');
        };
    }, [socket, connected, selectedTicket]);

    const fetchTickets = async () => {
        try {
            const queryParam = filter === 'all' ? '?all=true' : filter === 'open' ? '?status=open' : '';
            const response = await fetch(`/api/v1/tickets/employee/all${queryParam}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
                }
            });

            if (!response.ok) throw new Error('Failed to fetch tickets');

            const data = await response.json();
            setTickets(data.tickets || []);
        } catch (error) {
            console.error('Error fetching tickets:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchMessages = async (ticketId: string) => {
        try {
            const response = await fetch(`/api/v1/tickets/${ticketId}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
                }
            });

            if (!response.ok) throw new Error('Failed to fetch messages');

            const data = await response.json();
            setMessages(data.messages || []);
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    };

    const handleSelectTicket = async (ticket: Ticket) => {
        setSelectedTicket(ticket);
        await fetchMessages(ticket.id);

        // Join ticket room for real-time updates
        if (socket) {
            socket.emit('join_ticket', { ticketId: ticket.id });
        }
    };

    const handleAssignTicket = async (ticketId: string) => {
        try {
            const response = await fetch(`/api/v1/tickets/${ticketId}/assign`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) throw new Error('Failed to assign ticket');

            fetchTickets();
            if (selectedTicket?.id === ticketId) {
                const updatedTicket = tickets.find(t => t.id === ticketId);
                if (updatedTicket) {
                    setSelectedTicket({ ...updatedTicket, assignedTo: user?.uid, assignedToName: user?.displayName || 'You' });
                }
            }
        } catch (error) {
            console.error('Error assigning ticket:', error);
            alert('Failed to assign ticket');
        }
    };

    const handleSendMessage = async () => {
        if (!inputMessage.trim() || !selectedTicket) return;

        try {
            const response = await fetch(`/api/v1/tickets/${selectedTicket.id}/messages`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ message: inputMessage })
            });

            if (!response.ok) throw new Error('Failed to send message');

            setInputMessage('');
            await fetchMessages(selectedTicket.id);
        } catch (error) {
            console.error('Error sending message:', error);
            alert('Failed to send message');
        }
    };

    const handleCloseTicket = async () => {
        if (!selectedTicket || !confirm('Are you sure you want to close this ticket?')) return;

        try {
            const response = await fetch(`/api/v1/tickets/${selectedTicket.id}/close`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
                }
            });

            if (!response.ok) throw new Error('Failed to close ticket');

            alert('Ticket closed successfully. Customer will be prompted for feedback.');
            setSelectedTicket(null);
            fetchTickets();
        } catch (error) {
            console.error('Error closing ticket:', error);
            alert('Failed to close ticket');
        }
    };

    const filteredTickets = tickets.filter(ticket => {
        if (filter === 'all') return true;
        if (filter === 'open') return ticket.status === 'open';
        if (filter === 'assigned') return ticket.assignedTo === user?.uid;
        if (filter === 'closed') return ticket.status === 'closed';
        return true;
    });

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="max-w-7xl mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Support Tickets</h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Tickets List */}
                    <div className="lg:col-span-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
                        {/* Filter Tabs */}
                        <div className="border-b border-gray-200 dark:border-gray-700">
                            <div className="flex">
                                {['all', 'open', 'assigned', 'closed'].map((tab) => (
                                    <button
                                        key={tab}
                                        onClick={() => setFilter(tab as any)}
                                        className={`flex-1 px-4 py-3 text-sm font-medium capitalize ${filter === tab
                                            ? 'border-b-2 border-purple-500 text-purple-600 dark:text-purple-400'
                                            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                                            }`}
                                    >
                                        {tab}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Tickets */}
                        <div className="overflow-y-auto max-h-[calc(100vh-250px)]">
                            {loading ? (
                                <div className="p-8 text-center text-gray-500">Loading tickets...</div>
                            ) : filteredTickets.length === 0 ? (
                                <div className="p-8 text-center text-gray-500">No tickets found</div>
                            ) : (
                                filteredTickets.map((ticket) => (
                                    <button
                                        key={ticket.id}
                                        onClick={() => handleSelectTicket(ticket)}
                                        className={`w-full text-left p-4 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${selectedTicket?.id === ticket.id ? 'bg-purple-50 dark:bg-purple-900/20' : ''
                                            }`}
                                    >
                                        <div className="flex items-start justify-between mb-2">
                                            <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
                                                {ticket.categoryTitle}
                                            </h3>
                                            <span className={`text-xs px-2 py-1 rounded-full ${ticket.status === 'open' ? 'bg-yellow-100 text-yellow-800' :
                                                ticket.status === 'assigned' || ticket.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                                                    'bg-green-100 text-green-800'
                                                }`}>
                                                {ticket.status}
                                            </span>
                                        </div>
                                        <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">{ticket.subCategoryTitle}</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-500 line-clamp-2">{ticket.problem}</p>
                                        <div className="flex items-center mt-2 text-xs text-gray-500">
                                            <Clock size={12} className="mr-1" />
                                            {new Date(ticket.createdAt?.toDate ? ticket.createdAt.toDate() : ticket.createdAt).toLocaleString()}
                                        </div>
                                    </button>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Ticket Details & Chat */}
                    <div className="lg:col-span-2">
                        {selectedTicket ? (
                            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden flex flex-col" style={{ height: 'calc(100vh - 200px)' }}>
                                {/* Header */}
                                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                                                {selectedTicket.categoryTitle}: {selectedTicket.subCategoryTitle}
                                            </h2>
                                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                                                <strong>Problem:</strong> {selectedTicket.problem}
                                            </p>
                                            <div className="flex items-center gap-4 text-sm">
                                                <span className="text-gray-500">User Role: <strong>{selectedTicket.userRole}</strong></span>
                                                <span className="text-gray-500">
                                                    Created: {new Date(selectedTicket.createdAt?.toDate ? selectedTicket.createdAt.toDate() : selectedTicket.createdAt).toLocaleString()}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            {selectedTicket.status === 'open' && !selectedTicket.assignedTo && (
                                                <button
                                                    onClick={() => handleAssignTicket(selectedTicket.id)}
                                                    className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg text-sm font-medium transition-colors"
                                                >
                                                    Assign to Me
                                                </button>
                                            )}
                                            {selectedTicket.assignedTo === user?.uid && selectedTicket.status !== 'closed' && (
                                                <button
                                                    onClick={handleCloseTicket}
                                                    className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-medium transition-colors"
                                                >
                                                    Close Ticket
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Messages */}
                                <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50 dark:bg-gray-900">
                                    {messages.map((msg) => (
                                        <div
                                            key={msg.id}
                                            className={`flex ${msg.senderType === 'employee' ? 'justify-end' : 'justify-start'}`}
                                        >
                                            <div className={`max-w-[70%] px-4 py-3 rounded-2xl ${msg.senderType === 'employee'
                                                ? 'bg-purple-500 text-white rounded-tr-none'
                                                : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-tl-none'
                                                }`}>
                                                <p className="whitespace-pre-wrap">{msg.message}</p>
                                                {msg.fileUrl && (
                                                    <a
                                                        href={msg.fileUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-sm underline flex items-center gap-1 mt-2"
                                                    >
                                                        <Paperclip size={14} />
                                                        {msg.fileName || 'View File'}
                                                    </a>
                                                )}
                                                <p className="text-xs opacity-75 mt-1">
                                                    {new Date(msg.timestamp?.toDate ? msg.timestamp.toDate() : msg.timestamp).toLocaleTimeString()}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Input */}
                                {selectedTicket.assignedTo === user?.uid && selectedTicket.status !== 'closed' && (
                                    <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                value={inputMessage}
                                                onChange={(e) => setInputMessage(e.target.value)}
                                                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                                placeholder="Type your message..."
                                                className="flex-1 px-4 py-3 bg-gray-100 dark:bg-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 dark:text-white"
                                            />
                                            <button
                                                onClick={handleSendMessage}
                                                disabled={!inputMessage.trim()}
                                                className="px-6 py-3 bg-purple-500 hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl transition-all font-medium"
                                            >
                                                <Send size={20} />
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-12 text-center">
                                <MessageSquare size={64} className="mx-auto text-gray-400 mb-4" />
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No Ticket Selected</h3>
                                <p className="text-gray-600 dark:text-gray-400">Select a ticket from the list to view details and chat with the customer</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
