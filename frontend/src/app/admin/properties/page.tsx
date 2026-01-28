'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { backendApi } from '@/lib/backendApi';
import {
    CheckCircle,
    XCircle,
    Clock,
    Eye,
    MessageCircle,
    AlertCircle,
    Home
} from 'lucide-react';

interface Property {
    id: string;
    title: string;
    city: string;
    price: number;
    sellerEmail: string;
    status: 'pending' | 'active' | 'rejected';
    createdAt: string;
    beds?: number;
    baths?: number;
    area?: number;
    [key: string]: any;
}

export default function AdminPropertiesPage() {
    const { user } = useAuth();
    const [properties, setProperties] = useState<Property[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'pending' | 'active' | 'rejected'>('pending');

    useEffect(() => {
        fetchProperties();
    }, []);

    const fetchProperties = async () => {
        try {
            setLoading(true);
            const response = await backendApi.admin.getAllProperties();

            if (response.success) {
                setProperties(response.data.properties || []);
            } else {
                console.error('Failed to fetch properties:', response.error);
            }
        } catch (error) {
            console.error('Error fetching properties:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (propertyId: string) => {
        if (!confirm('Approve this property? Seller will be notified.')) return;

        try {
            const response = await backendApi.admin.approveProperty(propertyId);

            if (response.success) {
                alert('✅ Property approved! Seller has been notified.');
                fetchProperties(); // Refresh list
            } else {
                alert('❌ Failed to approve property: ' + response.error);
            }
        } catch (error) {
            console.error('Error approving property:', error);
            alert('❌ Error approving property');
        }
    };

    const handleReject = async (propertyId: string) => {
        const reason = prompt('Enter rejection reason:');
        if (!reason) return;

        try {
            const response = await backendApi.admin.rejectProperty(propertyId, reason);

            if (response.success) {
                alert('✅ Property rejected. Seller has been notified with the reason.');
                fetchProperties(); // Refresh list
            } else {
                alert('❌ Failed to reject property: ' + response.error);
            }
        } catch (error) {
            console.error('Error rejecting property:', error);
            alert('❌ Error rejecting property');
        }
    };

    const filteredProperties = properties.filter(p =>
        filter === 'all' ? true : p.status === filter
    );

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'pending':
                return (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800 border border-yellow-200">
                        <Clock size={12} className="mr-1" />
                        Pending
                    </span>
                );
            case 'active':
                return (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800 border border-green-200">
                        <CheckCircle size={12} className="mr-1" />
                        Active
                    </span>
                );
            case 'rejected':
                return (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800 border border-red-200">
                        <XCircle size={12} className="mr-1" />
                        Rejected
                    </span>
                );
            default:
                return null;
        }
    };

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
                        <Home className="mr-3 text-green-500" size={32} />
                        Property Moderation
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                        Review and approve property listings
                    </p>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {['all', 'pending', 'active', 'rejected'].map((status) => (
                    <button
                        key={status}
                        onClick={() => setFilter(status as any)}
                        className={`p-4 rounded-xl border-2 transition-all ${filter === status
                                ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                                : 'border-gray-200 dark:border-gray-700 hover:border-green-300'
                            }`}
                    >
                        <p className="text-sm text-gray-600 dark:text-gray-400 capitalize">{status}</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                            {status === 'all'
                                ? properties.length
                                : properties.filter(p => p.status === status).length
                            }
                        </p>
                    </button>
                ))}
            </div>

            {/* Properties List */}
            {loading ? (
                <div className="text-center py-12">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
                    <p className="mt-4 text-gray-600">Loading properties...</p>
                </div>
            ) : filteredProperties.length === 0 ? (
                <div className="text-center py-12 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
                    <AlertCircle size={48} className="mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-600 dark:text-gray-400">
                        No {filter !== 'all' ? filter : ''} properties found
                    </p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {filteredProperties.map((property) => (
                        <div
                            key={property.id}
                            className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 hover:shadow-lg transition-all"
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                                            {property.title}
                                        </h3>
                                        {getStatusBadge(property.status)}
                                    </div>

                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 text-sm">
                                        <div>
                                            <p className="text-gray-500">Location</p>
                                            <p className="font-semibold text-gray-900 dark:text-white">{property.city}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-500">Price</p>
                                            <p className="font-semibold text-green-600">₹{property.price.toLocaleString()}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-500">Seller</p>
                                            <p className="font-semibold text-gray-900 dark:text-white">{property.sellerEmail}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-500">Listed</p>
                                            <p className="font-semibold text-gray-900 dark:text-white">
                                                {new Date(property.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>

                                    {property.beds && (
                                        <div className="flex gap-4 mt-3 text-sm text-gray-600">
                                            <span>{property.beds} Beds</span>
                                            <span>{property.baths} Baths</span>
                                            <span>{property.area} sq ft</span>
                                        </div>
                                    )}
                                </div>

                                {/* Actions */}
                                {property.status === 'pending' && (
                                    <div className="flex gap-2 ml-4">
                                        <button
                                            onClick={() => handleApprove(property.id)}
                                            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-all flex items-center gap-2"
                                        >
                                            <CheckCircle size={18} />
                                            Approve
                                        </button>
                                        <button
                                            onClick={() => handleReject(property.id)}
                                            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-all flex items-center gap-2"
                                        >
                                            <XCircle size={18} />
                                            Reject
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
