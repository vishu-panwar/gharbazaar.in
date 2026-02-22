'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  CheckCircle,
  Clock,
  MessageCircle,
  RefreshCw,
  Send,
  XCircle,
} from 'lucide-react';
import { backendApi } from '@/lib/backendApi';
import { useModal } from '@/contexts/ModalContext';

const STATUS_TABS = ['all', 'pending', 'accepted', 'rejected', 'countered'] as const;
type StatusTab = (typeof STATUS_TABS)[number];

export default function InquiriesPage() {
  const router = useRouter();
  const { showAlert } = useModal();

  const [statusFilter, setStatusFilter] = useState<StatusTab>('all');
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [counterValues, setCounterValues] = useState<Record<string, string>>({});

  const fetchInquiries = async () => {
    try {
      setLoading(true);
      const response = await backendApi.bids.getSellerBids(
        statusFilter === 'all' ? undefined : statusFilter
      );

      if (!response?.success) {
        throw new Error(response?.error || response?.message || 'Failed to load inquiries');
      }

      setInquiries(Array.isArray(response.data) ? response.data : []);
    } catch (error: any) {
      showAlert({
        title: 'Load Failed',
        message: error?.message || 'Unable to load inquiries',
        type: 'error',
      });
      setInquiries([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  const summary = useMemo(() => {
    const all = inquiries.length;
    const pending = inquiries.filter((q) => q.status === 'pending').length;
    const accepted = inquiries.filter((q) => q.status === 'accepted').length;
    const rejected = inquiries.filter((q) => q.status === 'rejected').length;
    const countered = inquiries.filter((q) => q.status === 'countered').length;
    return { all, pending, accepted, rejected, countered };
  }, [inquiries]);

  const updateInquiry = async (
    id: string,
    payload: { status: 'accepted' | 'rejected' | 'countered'; counterAmount?: number; counterMessage?: string }
  ) => {
    try {
      setUpdatingId(id);
      const response = await backendApi.bids.updateStatus(id, payload);
      if (!response?.success) {
        throw new Error(response?.error || response?.message || 'Failed to update inquiry');
      }
      await fetchInquiries();
    } catch (error: any) {
      showAlert({
        title: 'Update Failed',
        message: error?.message || 'Unable to update inquiry',
        type: 'error',
      });
    } finally {
      setUpdatingId(null);
    }
  };

  const handleCounter = async (bid: any) => {
    const value = Number(counterValues[bid.id] || 0);
    if (!Number.isFinite(value) || value <= 0) {
      showAlert({
        title: 'Invalid Amount',
        message: 'Enter a valid counter amount.',
        type: 'error',
      });
      return;
    }

    await updateInquiry(bid.id, {
      status: 'countered',
      counterAmount: value,
      counterMessage: `Counter offer: INR ${value.toLocaleString('en-IN')}`,
    });
  };

  const handleMessageBuyer = async (bid: any) => {
    try {
      const buyerUid = bid?.buyer?.uid || bid?.buyerId;
      if (!buyerUid) throw new Error('Buyer ID missing');

      const response = await backendApi.chat.createConversation({
        otherUserId: buyerUid,
        type: 'buyer-seller',
        propertyId: bid.propertyId,
        propertyTitle: bid?.property?.title,
      });

      if (!response?.success) {
        throw new Error(response?.error || response?.message || 'Failed to open chat');
      }

      const conversationId = response?.data?.conversation?.id;
      if (conversationId) {
        router.push(`/dashboard/chat?conversationId=${encodeURIComponent(conversationId)}`);
      } else {
        router.push('/dashboard/chat');
      }
    } catch (error: any) {
      showAlert({
        title: 'Chat Failed',
        message: error?.message || 'Could not start chat with buyer',
        type: 'error',
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Inquiries</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Respond to buyer inquiries and negotiate offers.
          </p>
        </div>
        <button
          onClick={fetchInquiries}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700"
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setStatusFilter(tab)}
            className={`rounded-xl p-4 border text-left ${
              statusFilter === tab
                ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                : 'border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900'
            }`}
          >
            <p className="text-xs uppercase text-gray-500">{tab}</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{summary[tab]}</p>
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="bg-white dark:bg-gray-900 rounded-xl p-8 border border-gray-200 dark:border-gray-800 text-center">
            Loading inquiries...
          </div>
        ) : inquiries.length === 0 ? (
          <div className="bg-white dark:bg-gray-900 rounded-xl p-8 border border-gray-200 dark:border-gray-800 text-center text-gray-500">
            No inquiries found for this filter.
          </div>
        ) : (
          inquiries.map((bid) => (
            <div
              key={bid.id}
              className="bg-white dark:bg-gray-900 rounded-xl p-5 border border-gray-200 dark:border-gray-800 space-y-4"
            >
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-3">
                <div>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">{bid?.property?.title || 'Property'}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Buyer: {bid?.buyer?.name || bid?.buyerId}</p>
                  <p className="text-sm text-gray-500">
                    Received: {new Date(bid.createdAt).toLocaleString('en-IN')}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Offer</p>
                  <p className="text-xl font-bold text-purple-600">
                    INR {Number(bid.bidAmount || 0).toLocaleString('en-IN')}
                  </p>
                  <p className="text-xs uppercase text-gray-500 mt-1">{bid.status}</p>
                </div>
              </div>

              {bid.message ? (
                <p className="text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                  {bid.message}
                </p>
              ) : null}

              {bid.status === 'countered' && bid.counterAmount ? (
                <p className="text-sm text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-900/20 rounded-lg p-3">
                  Counter sent: INR {Number(bid.counterAmount).toLocaleString('en-IN')}
                </p>
              ) : null}

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleMessageBuyer(bid)}
                  className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 inline-flex items-center gap-2"
                >
                  <MessageCircle size={16} />
                  Chat
                </button>

                {bid.status === 'pending' ? (
                  <>
                    <button
                      onClick={() => updateInquiry(bid.id, { status: 'accepted' })}
                      disabled={updatingId === bid.id}
                      className="px-3 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white inline-flex items-center gap-2 disabled:opacity-50"
                    >
                      <CheckCircle size={16} />
                      Accept
                    </button>
                    <button
                      onClick={() => updateInquiry(bid.id, { status: 'rejected' })}
                      disabled={updatingId === bid.id}
                      className="px-3 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white inline-flex items-center gap-2 disabled:opacity-50"
                    >
                      <XCircle size={16} />
                      Reject
                    </button>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min={0}
                        placeholder="Counter INR"
                        value={counterValues[bid.id] || ''}
                        onChange={(e) =>
                          setCounterValues((prev) => ({ ...prev, [bid.id]: e.target.value }))
                        }
                        className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent w-36"
                      />
                      <button
                        onClick={() => handleCounter(bid)}
                        disabled={updatingId === bid.id}
                        className="px-3 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white inline-flex items-center gap-2 disabled:opacity-50"
                      >
                        <Send size={16} />
                        Counter
                      </button>
                    </div>
                  </>
                ) : (
                  <span className="px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 inline-flex items-center gap-2">
                    <Clock size={16} />
                    {bid.status}
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
