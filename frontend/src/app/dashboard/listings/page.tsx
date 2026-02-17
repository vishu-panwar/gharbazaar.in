'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMyListings, useDeleteProperty, useUpdateProperty, useUpdatePropertyStatus } from '@/hooks/api';
import { LoadingSkeleton } from '@/components/LoadingSkeleton';
import { NoPropertiesFound } from '@/components/EmptyState';
import PropertyCard from '@/components/PropertyCard';
import { formatCurrency } from '@/lib/currency';
import {
  Plus,
  Grid,
  List as ListIcon,
  Edit,
  Trash2,
  Eye,
  BarChart3,
  Play,
  Pause,
  MoreVertical,
  Calendar,
  MapPin,
  Home,
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function MyListingsPage() {
  const router = useRouter();
  const { data: listings, isLoading, error } = useMyListings();
  const deleteProperty = useDeleteProperty();
  const updateStatus = useUpdatePropertyStatus();

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [statusFilter, setStatusFilter] = useState<'all' | 'PENDING' | 'VERIFIED' | 'ACTIVE' | 'SOLD'>('all');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  const handleDelete = async (propertyId: string) => {
    try {
      await deleteProperty.mutateAsync(propertyId);
      toast.success('Property deleted successfully');
      setShowDeleteConfirm(null);
    } catch (error) {
      toast.error('Failed to delete property');
    }
  };

  const handleToggleStatus = async (propertyId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    try {
      await updateStatus.mutateAsync({ propertyId, status: newStatus });
      toast.success(`Property ${newStatus === 'ACTIVE' ? 'activated' : 'paused'}`);
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      PENDING: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
      VERIFIED: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
      ACTIVE: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
      SOLD: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
      INACTIVE: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400',
    };
    return badges[status as keyof typeof badges] || badges.PENDING;
  };

  const filteredListings = statusFilter === 'all'
    ? listings
    : listings?.filter((listing: any) => listing.status === statusFilter);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">My Listings</h1>
        </div>
        <LoadingSkeleton variant="card" count={6} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
          <p className="text-red-600 dark:text-red-400">Failed to load listings</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Listings</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {listings?.length || 0} {listings?.length === 1 ? 'property' : 'properties'}
          </p>
        </div>

        <button
          onClick={() => router.push('/dashboard/listings/new')}
          className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl"
        >
          <Plus size={20} />
          Add Property
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center justify-between gap-4">
        {/* Status Filter */}
        <div className="flex gap-2 flex-wrap">
          {['all', 'PENDING', 'VERIFIED', 'ACTIVE', 'SOLD'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status as any)}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${statusFilter === status
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
            >
              {status === 'all' ? 'All' : status}
            </button>
          ))}
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg transition-colors ${viewMode === 'grid'
                ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400'
                : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800'
              }`}
          >
            <Grid size={20} />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-lg transition-colors ${viewMode === 'list'
                ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400'
                : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800'
              }`}
          >
            <ListIcon size={20} />
          </button>
        </div>
      </div>

      {/* Listings Grid */}
      {!filteredListings || filteredListings.length === 0 ? (
        <NoPropertiesFound
          message="No listings found"
          onBrowse={() => router.push('/dashboard/listings/new')}
          buttonText="Add Property"
        />
      ) : (
        <div
          className={
            viewMode === 'grid'
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
              : 'space-y-4'
          }
        >
          {filteredListings.map((listing: any) => (
            <div key={listing.id} className="relative group">
              <PropertyCard property={listing} />

              {/* Status Badge */}
              <div className="absolute top-3 left-3">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(listing.status)}`}>
                  {listing.status}
                </span>
              </div>

              {/* Action Menu */}
              <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => router.push(`/dashboard/listings/${listing.id}`)}
                    className="p-2 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                    title="Edit"
                  >
                    <Edit size={16} className="text-blue-600 dark:text-blue-400" />
                  </button>

                  <button
                    onClick={() => router.push(`/dashboard/analytics?property=${listing.id}`)}
                    className="p-2 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors"
                    title="Analytics"
                  >
                    <BarChart3 size={16} className="text-purple-600 dark:text-purple-400" />
                  </button>

                  <button
                    onClick={() => handleToggleStatus(listing.id, listing.status)}
                    className="p-2 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-colors"
                    title={listing.status === 'ACTIVE' ? 'Pause' : 'Activate'}
                  >
                    {listing.status === 'ACTIVE' ? (
                      <Pause size={16} className="text-orange-600 dark:text-orange-400" />
                    ) : (
                      <Play size={16} className="text-green-600 dark:text-green-400" />
                    )}
                  </button>

                  <button
                    onClick={() => setShowDeleteConfirm(listing.id)}
                    className="p-2 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                    title="Delete"
                  >
                    <Trash2 size={16} className="text-red-600 dark:text-red-400" />
                  </button>
                </div>
              </div>

              {/* Stats Overlay */}
              <div className="absolute bottom-3 left-3 right-3 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-1">
                    <Eye size={14} className="text-gray-600 dark:text-gray-400" />
                    <span className="text-gray-900 dark:text-white font-semibold">
                      {listing.viewCount || 0}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar size={14} className="text-gray-600 dark:text-gray-400" />
                    <span className="text-gray-900 dark:text-white">
                      {new Date(listing.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Delete Property?
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              This action cannot be undone. The property will be permanently removed.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="flex-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white px-4 py-2 rounded-lg font-semibold transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(showDeleteConfirm)}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
