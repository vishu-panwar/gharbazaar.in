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

const STATUS_TABS = ['all', 'pending', 'countered', 'accepted', 'rejected'] as const;
type StatusTab = (typeof STATUS_TABS)[number];

export default function MyProposalsPage() {
  const router = useRouter();
  const { showAlert } = useModal();

  const [statusFilter, setStatusFilter] = useState<StatusTab>('all');
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [proposals, setProposals] = useState<any[]>([]);
  const [revisedValues, setRevisedValues] = useState<Record<string, string>>({});

  const fetchProposals = async () => {
    try {
      setLoading(true);
      const response = await backendApi.bids.getBuyerBids(
        statusFilter === 'all' ? undefined : statusFilter
      );

      if (!response?.success) {
        throw new Error(response?.error || response?.message || 'Failed to load proposals');
      }

      setProposals(Array.isArray(response.data) ? response.data : []);
    } catch (error: any) {
      showAlert({
        title: 'Load Failed',
        message: error?.message || 'Unable to load proposals',
        type: 'error',
      });
      setProposals([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProposals();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  const summary = useMemo(() => {
    const all = proposals.length;
    const pending = proposals.filter((q) => q.status === 'pending').length;
    const countered = proposals.filter((q) => q.status === 'countered').length;
    const accepted = proposals.filter((q) => q.status === 'accepted').length;
    const rejected = proposals.filter((q) => q.status === 'rejected').length;
    return { all, pending, countered, accepted, rejected };
  }, [proposals]);

  const respond = async (
    id: string,
    data: { action: 'accept' | 'reject' | 'counter'; amount?: number; message?: string }
  ) => {
    try {
      setUpdatingId(id);
      const response = await backendApi.bids.buyerResponse(id, data);
      if (!response?.success) {
        throw new Error(response?.error || response?.message || 'Failed to process action');
      }
      await fetchProposals();
    } catch (error: any) {
      showAlert({
        title: 'Action Failed',
        message: error?.message || 'Unable to process proposal action',
        type: 'error',
      });
    } finally {
      setUpdatingId(null);
    }
  };

  const handleNegotiate = async (proposal: any) => {
    const revised = Number(revisedValues[proposal.id] || 0);
    if (!Number.isFinite(revised) || revised <= 0) {
      showAlert({
        title: 'Invalid Amount',
        message: 'Enter a valid revised offer amount.',
        type: 'error',
      });
      return;
    }

    await respond(proposal.id, {
      action: 'counter',
      amount: revised,
      message: `Revised offer: INR ${revised.toLocaleString('en-IN')}`,
    });
  };

  const handleMessageSeller = async (proposal: any) => {
    try {
      const sellerUid = proposal?.seller?.uid || proposal?.sellerId;
      if (!sellerUid) throw new Error('Seller ID missing');

      const response = await backendApi.chat.createConversation({
        otherUserId: sellerUid,
        type: 'buyer-seller',
        propertyId: proposal.propertyId,
        propertyTitle: proposal?.property?.title,
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
        message: error?.message || 'Unable to open seller chat',
        type: 'error',
      });
    }
  };

  const handleScheduleVisit = async (proposal: any) => {
    const raw = window.prompt('Enter visit date and time in this format: YYYY-MM-DDTHH:mm');
    if (!raw) return;

    try {
      const response = await backendApi.visits.create({
        propertyId: proposal.propertyId,
        scheduledAt: new Date(raw).toISOString(),
        notes: 'Visit scheduled from buyer proposals page',
      });

      if (!response?.success) {
        throw new Error(response?.error || response?.message || 'Failed to schedule visit');
      }

      showAlert({
        title: 'Visit Scheduled',
        message: 'Visit request sent. Seller has been notified.',
        type: 'success',
      });
    } catch (error: any) {
      showAlert({
        title: 'Visit Failed',
        message: error?.message || 'Unable to schedule visit',
        type: 'error',
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">My Proposals</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Track offers, negotiate with sellers, and schedule property visits.
          </p>
        </div>
        <button
          onClick={fetchProposals}
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
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
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
            Loading proposals...
          </div>
        ) : proposals.length === 0 ? (
          <div className="bg-white dark:bg-gray-900 rounded-xl p-8 border border-gray-200 dark:border-gray-800 text-center text-gray-500">
            No proposals found for this filter.
          </div>
        ) : (
          proposals.map((proposal) => (
            <div
              key={proposal.id}
              className="bg-white dark:bg-gray-900 rounded-xl p-5 border border-gray-200 dark:border-gray-800 space-y-4"
            >
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-3">
                <div>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">
                    {proposal?.property?.title || 'Property'}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Seller: {proposal?.seller?.name || proposal?.sellerId}
                  </p>
                  <p className="text-sm text-gray-500">
                    Sent: {new Date(proposal.createdAt).toLocaleString('en-IN')}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Your Offer</p>
                  <p className="text-xl font-bold text-blue-600">
                    INR {Number(proposal.bidAmount || 0).toLocaleString('en-IN')}
                  </p>
                  <p className="text-xs uppercase text-gray-500 mt-1">{proposal.status}</p>
                </div>
              </div>

              {proposal.counterAmount ? (
                <p className="text-sm text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-900/20 rounded-lg p-3">
                  Seller counter offer: INR {Number(proposal.counterAmount).toLocaleString('en-IN')}
                </p>
              ) : null}

              {proposal.message ? (
                <p className="text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                  {proposal.message}
                </p>
              ) : null}

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleMessageSeller(proposal)}
                  className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 inline-flex items-center gap-2"
                >
                  <MessageCircle size={16} />
                  Chat Seller
                </button>

                <button
                  onClick={() => handleScheduleVisit(proposal)}
                  className="px-3 py-2 rounded-lg border border-emerald-300 text-emerald-700 dark:text-emerald-300 inline-flex items-center gap-2"
                >
                  <Clock size={16} />
                  Schedule Visit
                </button>

                {proposal.status === 'countered' ? (
                  <>
                    <button
                      onClick={() => respond(proposal.id, { action: 'accept' })}
                      disabled={updatingId === proposal.id}
                      className="px-3 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white inline-flex items-center gap-2 disabled:opacity-50"
                    >
                      <CheckCircle size={16} />
                      Accept
                    </button>
                    <button
                      onClick={() => respond(proposal.id, { action: 'reject' })}
                      disabled={updatingId === proposal.id}
                      className="px-3 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white inline-flex items-center gap-2 disabled:opacity-50"
                    >
                      <XCircle size={16} />
                      Reject
                    </button>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min={0}
                        placeholder="Revised INR"
                        value={revisedValues[proposal.id] || ''}
                        onChange={(e) =>
                          setRevisedValues((prev) => ({ ...prev, [proposal.id]: e.target.value }))
                        }
                        className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent w-36"
                      />
                      <button
                        onClick={() => handleNegotiate(proposal)}
                        disabled={updatingId === proposal.id}
                        className="px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white inline-flex items-center gap-2 disabled:opacity-50"
                      >
                        <Send size={16} />
                        Negotiate
                      </button>
                    </div>
                  </>
                ) : proposal.status === 'pending' ? (
                  <span className="px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 inline-flex items-center gap-2">
                    <Clock size={16} />
                    Awaiting seller response
                  </span>
                ) : null}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
