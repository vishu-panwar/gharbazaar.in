'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useBuyerBids, useSellerBids, useUpdateBidStatus, useCounterBid } from '@/hooks/api';
import { LoadingSkeleton } from '@/components/LoadingSkeleton';
import { EmptyState } from '@/components/EmptyState';
import { formatCurrency } from '@/lib/currency';
import {
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  Home,
  MapPin,
  Calendar,
  Eye,
  MessageCircle,
  Send,
  DollarSign,
  TrendingUp,
  Gavel,
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function OffersPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'buyer' | 'seller'>('buyer');
  const [statusFilter, setStatusFilter] = useState<'all' | 'PENDING' | 'ACCEPTED' | 'REJECTED'>('all');
  
  const { data: buyerBids, isLoading: buyerLoading } = useBuyerBids();
  const { data: sellerBids, isLoading: sellerLoading } = useSellerBids();
  const updateBidStatus = useUpdateBidStatus();
  const counterBid = useCounterBid();

  const [counterAmount, setCounterAmount] = useState('');
  const [counteringBidId, setCounteringBidId] = useState<string | null>(null);

  const handleAcceptBid = async (bidId: string) => {
    try {
      await updateBidStatus.mutateAsync({ bidId, status: 'ACCEPTED' });
      toast.success('Bid accepted successfully!');
    } catch (error) {
      toast.error('Failed to accept bid');
    }
  };

  const handleRejectBid = async (bidId: string) => {
    try {
      await updateBidStatus.mutateAsync({ bidId, status: 'REJECTED' });
      toast.success('Bid rejected');
    } catch (error) {
      toast.error('Failed to reject bid');
    }
  };

  const handleCounterBid = async (bidId: string) => {
    if (!counterAmount) {
      toast.error('Enter counter amount');
      return;
    }

    try {
      await counterBid.mutateAsync({ bidId, amount: parseFloat(counterAmount) });
      toast.success('Counter offer sent!');
      setCounteringBidId(null);
      setCounterAmount('');
    } catch (error) {
      toast.error('Failed to send counter offer');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return (
          <span className="flex items-center gap-1 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 px-3 py-1 rounded-full text-xs font-semibold">
            <Clock size={12} />
            Pending
          </span>
        );
      case 'ACCEPTED':
        return (
          <span className="flex items-center gap-1 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 px-3 py-1 rounded-full text-xs font-semibold">
            <CheckCircle size={12} />
            Accepted
          </span>
        );
      case 'REJECTED':
        return (
          <span className="flex items-center gap-1 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-3 py-1 rounded-full text-xs font-semibold">
            <XCircle size={12} />
            Rejected
          </span>
        );
      case 'COUNTERED':
        return (
          <span className="flex items-center gap-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-3 py-1 rounded-full text-xs font-semibold">
            <TrendingUp size={12} />
            Countered
          </span>
        );
      default:
        return null;
    }
  };

  const currentBids = activeTab === 'buyer' ? buyerBids : sellerBids;
  const isLoading = activeTab === 'buyer' ? buyerLoading : sellerLoading;
  
  const filteredBids = statusFilter === 'all' 
    ? currentBids 
    : currentBids?.filter((bid: any) => bid.status === statusFilter);

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Offers</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage your bids and offers
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={() => setActiveTab('buyer')}
          className={`pb-3 px-1 font-semibold transition-colors ${
            activeTab === 'buyer'
              ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
          }`}
        >
          My Bids ({buyerBids?.length || 0})
        </button>
        <button
          onClick={() => setActiveTab('seller')}
          className={`pb-3 px-1 font-semibold transition-colors ${
            activeTab === 'seller'
              ? 'text-emerald-600 dark:text-emerald-400 border-b-2 border-emerald-600 dark:border-emerald-400'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
          }`}
        >
          Received Offers ({sellerBids?.length || 0})
        </button>
      </div>

      {/* Status Filter */}
      <div className="flex gap-2">
        {['all', 'PENDING', 'ACCEPTED', 'REJECTED'].map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status as any)}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
              statusFilter === status
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            {status === 'all' ? 'All' : status}
          </button>
        ))}
      </div>

      {/* Bids List */}
      {isLoading ? (
        <LoadingSkeleton variant="list" count={5} />
      ) : !filteredBids || filteredBids.length === 0 ? (
        <EmptyState
          icon={<Gavel size={48} />}
          title={`No ${activeTab === 'buyer' ? 'bids' : 'offers'} found`}
          description={activeTab === 'buyer' ? 'Make offers on properties you like' : "You'll see buyer offers here"}
        />
      ) : (
        <div className="space-y-4">
          {filteredBids.map((bid: any) => (
            <div
              key={bid.id}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-4">
                  {bid.property?.images?.[0] && (
                    <img
                      src={bid.property.images[0]}
                      alt={bid.property.title}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                  )}
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                      {bid.property?.title || 'Property'}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
                      <MapPin size={14} />
                      {bid.property?.location || 'Location'}
                    </p>
                  </div>
                </div>
                {getStatusBadge(bid.status)}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Your Offer</p>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">
                    {formatCurrency(bid.amount)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Listed Price</p>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">
                    {formatCurrency(bid.property?.price || 0)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Date</p>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {new Date(bid.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {activeTab === 'buyer' ? 'Seller' : 'Buyer'}
                  </p>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {activeTab === 'buyer' ? bid.property?.seller?.name : bid.buyer?.name}
                  </p>
                </div>
              </div>

              {bid.message && (
                <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Message:</p>
                  <p className="text-sm text-gray-900 dark:text-white">{bid.message}</p>
                </div>
              )}

              {/* Actions for sellers */}
              {activeTab === 'seller' && bid.status === 'PENDING' && (
                <div className="flex gap-3 mt-4">
                  <button
                    onClick={() => handleAcceptBid(bid.id)}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                  >
                    <CheckCircle size={16} />
                    Accept
                  </button>
                  
                  {counteringBidId === bid.id ? (
                    <div className="flex-1 flex gap-2">
                      <input
                        type="number"
                        value={counterAmount}
                        onChange={(e) => setCounterAmount(e.target.value)}
                        placeholder="Counter amount"
                        className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                      <button
                        onClick={() => handleCounterBid(bid.id)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
                      >
                        <Send size={16} />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setCounteringBidId(bid.id)}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                    >
                      <TrendingUp size={16} />
                      Counter
                    </button>
                  )}
                  
                  <button
                    onClick={() => handleRejectBid(bid.id)}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                  >
                    <XCircle size={16} />
                    Reject
                  </button>
                </div>
              )}

              {/* View property button */}
              <button
                onClick={() => router.push(`/dashboard/browse/${bid.property?.id}`)}
                className="w-full mt-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white px-4 py-2 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
              >
                <Eye size={16} />
                View Property
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
