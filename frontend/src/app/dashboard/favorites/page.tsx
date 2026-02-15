'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useFavorites, useRemoveFavorite } from '@/hooks/api';
import { LoadingSkeleton } from '@/components/LoadingSkeleton';
import { NoFavoritesYet } from '@/components/EmptyState';
import PropertyCard from '@/components/PropertyCard';
import {
  Heart,
  Grid,
  List as ListIcon,
  Share2,
  Trash2,
  X,
  Copy,
  Check,
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function FavoritesPage() {
  const router = useRouter();
  const { data: favorites, isLoading, error } = useFavorites();
  const removeFromFavorites = useRemoveFavorite();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareProperty, setShareProperty] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  const handleRemove = async (propertyId: string) => {
    try {
      await removeFromFavorites.mutateAsync(propertyId);
      toast.success('Removed from favorites');
    } catch (error) {
      toast.error('Failed to remove favorite');
    }
  };

  const handleShare = (property: any) => {
    setShareProperty(property);
    setShowShareModal(true);
  };

  const copyLink = () => {
    if (shareProperty) {
      const link = `${window.location.origin}/dashboard/browse/${shareProperty.id}`;
      navigator.clipboard.writeText(link);
      setCopied(true);
      toast.success('Link copied!');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const shareViaWhatsApp = () => {
    if (shareProperty) {
      const text = `Check out this property: ${shareProperty.title}\n${window.location.origin}/dashboard/browse/${shareProperty.id}`;
      window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
    }
  };

  const shareViaEmail = () => {
    if (shareProperty) {
      const subject = `Check out this property: ${shareProperty.title}`;
      const body = `I found this property:\n\n${shareProperty.title}\nLocation: ${shareProperty.location}\n\nView here: ${window.location.origin}/dashboard/browse/${shareProperty.id}`;
      window.open(`mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">My Favorites</h1>
        </div>
        <LoadingSkeleton variant="card" count={6} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
          <p className="text-red-600 dark:text-red-400">Failed to load favorites</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Favorites</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {favorites?.length || 0} saved {favorites?.length === 1 ? 'property' : 'properties'}
          </p>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg transition-colors ${viewMode === 'grid'
              ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
              : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800'
              }`}
          >
            <Grid size={20} />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-lg transition-colors ${viewMode === 'list'
              ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
              : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800'
              }`}
          >
            <ListIcon size={20} />
          </button>
        </div>
      </div>

      {/* Favorites Grid */}
      {!favorites || favorites.length === 0 ? (
        <NoFavoritesYet onBrowse={() => router.push('/dashboard/browse')} />
      ) : (
        <div
          className={
            viewMode === 'grid'
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
              : 'space-y-4'
          }
        >
          {favorites.map((property: any) => (
            <div key={property.id} className="relative group">
              <PropertyCard property={property} />

              {/* Action Buttons */}
              <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => handleShare(property)}
                  className="p-2 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  title="Share"
                >
                  <Share2 size={16} className="text-gray-600 dark:text-gray-400" />
                </button>
                <button
                  onClick={() => handleRemove(property.id)}
                  className="p-2 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                  title="Remove"
                >
                  <Trash2 size={16} className="text-red-600 dark:text-red-400" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Share Modal */}
      {showShareModal && shareProperty && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Share Property
              </h3>
              <button
                onClick={() => setShowShareModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-3">
              <button
                onClick={copyLink}
                className="w-full flex items-center gap-3 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                {copied ? <Check size={20} className="text-green-600" /> : <Copy size={20} />}
                <span className="font-semibold">{copied ? 'Copied!' : 'Copy Link'}</span>
              </button>

              <button
                onClick={shareViaWhatsApp}
                className="w-full flex items-center gap-3 p-4 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-lg hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors"
              >
                <Share2 size={20} />
                <span className="font-semibold">Share via WhatsApp</span>
              </button>

              <button
                onClick={shareViaEmail}
                className="w-full flex items-center gap-3 p-4 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
              >
                <Share2 size={20} />
                <span className="font-semibold">Share via Email</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
