'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { backendApi } from '@/lib/backendApi';
import { useModal } from '@/contexts/ModalContext';
import {
    CheckCircle,
    XCircle,
    Clock,
    Eye,
    MessageCircle,
    AlertCircle,
    Home,
    Pause,
    Trash2
} from 'lucide-react';

interface Property {
    id: string;
    _id?: string;
    title: string;
    city: string;
    price: number;
    sellerEmail: string;
    status: 'pending' | 'active' | 'rejected' | 'paused' | 'cancelled' | 'deleted';
    createdAt: string;
    beds?: number;
    baths?: number;
    area?: number;
    [key: string]: any;
}

export default function AdminPropertiesPage() {
    const { user } = useAuth();
    const { showAlert } = useModal();
    const [properties, setProperties] = useState<Property[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'pending' | 'active' | 'rejected' | 'paused' | 'cancelled' | 'deleted'>('all');

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
        // Since we don't have a confirm modal yet, we'll proceed directly but typically we'd show a confirmation modal first.
        // For now, let's just do the action and show success/error.

        try {
            const response = await backendApi.admin.approveProperty(propertyId);

            if (response.success) {
                showAlert({
                    title: 'Property Approved',
                    message: 'The property has been successfully approved and the seller has been notified.',
                    type: 'success'
                });
                fetchProperties(); // Refresh list
            } else {
                showAlert({
                    title: 'Approval Failed',
                    message: `Failed to approve property: ${response.error}`,
                    type: 'error'
                });
            }
        } catch (error) {
            console.error('Error approving property:', error);
            showAlert({
                title: 'Error',
                message: 'An unexpected error occurred while approving the property.',
                type: 'error'
            });
        }
    };

    const handleUpdateStatus = async (propertyId: string, status: string, reason?: string) => {
        try {
            const response = await backendApi.admin.updatePropertyStatus(propertyId, status, reason);

            if (response.success) {
                showAlert({
                    title: `Property ${status.toUpperCase()}`,
                    message: `The property has been marked as ${status}.`,
                    type: 'success'
                });
                fetchProperties();
            } else {
                showAlert({
                    title: 'Update Failed',
                    message: `Failed to update status: ${response.error}`,
                    type: 'error'
                });
            }
        } catch (error) {
            console.error('Error updating property status:', error);
            showAlert({
                title: 'Error',
                message: 'An unexpected error occurred.',
                type: 'error'
            });
        }
    };

    const handleDelete = async (propertyId: string) => {
        if (!confirm('Are you sure you want to delete this property? This action cannot be undone.')) return;

        try {
            const response = await backendApi.admin.deleteProperty(propertyId);

            if (response.success) {
                showAlert({
                    title: 'Property Deleted',
                    message: 'The property has been successfully deleted.',
                    type: 'success'
                });
                fetchProperties();
            } else {
                showAlert({
                    title: 'Delete Failed',
                    message: `Failed to delete property: ${response.error}`,
                    type: 'error'
                });
            }
        } catch (error) {
            console.error('Error deleting property:', error);
            showAlert({
                title: 'Error',
                message: 'An unexpected error occurred while deleting the property.',
                type: 'error'
            });
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
            case 'paused':
                return (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200">
                        <Pause size={12} className="mr-1" />
                        Paused
                    </span>
                );
            case 'cancelled':
                return (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-800 border border-gray-200">
                        <XCircle size={12} className="mr-1" />
                        Cancelled
                    </span>
                );
            case 'deleted':
                return (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gray-900 text-white border border-gray-700">
                        <Trash2 size={12} className="mr-1" />
                        Deleted
                    </span>
                );
            default:
                return (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-800 border border-gray-200">
                        {status}
                    </span>
                );
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
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                {['all', 'pending', 'active', 'rejected', 'paused', 'cancelled', 'deleted'].map((status) => (
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
                                {/* Actions - Refactored for guaranteed visibility */}
                                <div className="flex gap-2 ml-4 self-start">
                                    {(property.status === 'pending') && (
                                        <>
                                            <button
                                                onClick={() => handleApprove(property._id || property.id)}
                                                className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-all flex items-center gap-1.5 text-sm"
                                                title="Approve Listing"
                                            >
                                                <CheckCircle size={16} />
                                                Approve
                                            </button>
                                            <button
                                                onClick={() => {
                                                    const reason = prompt('Enter rejection reason:');
                                                    if (reason) handleUpdateStatus(property._id || property.id, 'rejected', reason);
                                                }}
                                                className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-all flex items-center gap-1.5 text-sm"
                                                title="Reject Listing"
                                            >
                                                <XCircle size={16} />
                                                Reject
                                            </button>
                                        </>
                                    )}

                                    {(property.status === 'active') && (
                                        <>
                                            <button
                                                onClick={() => handleUpdateStatus(property._id || property.id, 'paused')}
                                                className="p-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition-all"
                                                title="Pause - Temporarily hide listing"
                                            >
                                                <Pause size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleUpdateStatus(property._id || property.id, 'cancelled')}
                                                className="p-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-all"
                                                title="Cancel - Permanently stop listing"
                                            >
                                                <XCircle size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(property._id || property.id)}
                                                className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all"
                                                title="Delete - Remove listing"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </>
                                    )}

                                    {/* Actions for Inactive states (Paused, Cancelled, Rejected, Deleted, Inactive) */}
                                    {['paused', 'cancelled', 'rejected', 'deleted', 'inactive'].includes(property.status) && (
                                        <>
                                            <button
                                                onClick={() => handleUpdateStatus(property._id || property.id, 'active')}
                                                className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-all flex items-center gap-1.5 text-sm"
                                                title="Resume/Activate Listing"
                                            >
                                                <CheckCircle size={16} />
                                                {property.status === 'deleted' ? 'Restore' : 'Resume'}
                                            </button>
                                            
                                            {/* Allow Deleting even if paused/cancelled (unless already deleted) */}
                                            {property.status !== 'deleted' && (
                                                <button
                                                    onClick={() => handleDelete(property._id || property.id)}
                                                    className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all"
                                                    title="Delete Listing"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            )}
                                        </>
                                    )}

                                    {/* Fallback for unknown statuses */}
                                    {!['pending', 'active', 'paused', 'cancelled', 'rejected', 'deleted', 'inactive', 'sold'].includes(property.status) && (
                                         <span className="text-xs text-red-500 border border-red-200 bg-red-50 px-2 py-1 rounded">
                                            Unknown Status: {property.status}
                                         </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
