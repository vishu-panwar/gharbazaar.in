'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Bath,
  Bed,
  Calendar,
  CheckCircle,
  Eye,
  Home,
  Lock,
  MapPin,
  Maximize,
  MessageCircle,
  Star,
} from 'lucide-react';
import { backendApi } from '@/lib/backendApi';
import { usePayment } from '@/contexts/PaymentContext';
import { useAuth } from '@/contexts/AuthContext';
import { useModal } from '@/contexts/ModalContext';
import { useSocket } from '@/contexts/SocketContext';

interface PropertyDetailViewProps {
  isDashboard?: boolean;
  backPath?: string;
}

const getLocationLabel = (listing: any, hasAccess: boolean): string => {
  if (!hasAccess) return 'Location hidden. Upgrade to view full address.';

  if (typeof listing?.location === 'string' && listing.location.trim()) {
    return listing.location;
  }

  const parts = [listing?.address, listing?.city, listing?.state].filter(Boolean);
  if (parts.length > 0) return parts.join(', ');

  const nestedParts = [listing?.location?.address, listing?.location?.city].filter(Boolean);
  if (nestedParts.length > 0) return nestedParts.join(', ');

  return 'Location not provided';
};

export default function PropertyDetailView({ isDashboard = false, backPath = '/listings' }: PropertyDetailViewProps) {
  const params = useParams();
  const router = useRouter();
  const { hasPaid, hasFeature } = usePayment();
  const { user } = useAuth();
  const { showAlert } = useModal();
  const { onPropertyViewUpdate } = useSocket();

  const [listing, setListing] = useState<any>(null);
  const [liveViews, setLiveViews] = useState(0);
  const [loading, setLoading] = useState(true);
  const [bidAmount, setBidAmount] = useState('');
  const [bidMessage, setBidMessage] = useState('');
  const [submittingBid, setSubmittingBid] = useState(false);
  const [startingChat, setStartingChat] = useState(false);
  const [visitDateTime, setVisitDateTime] = useState('');
  const [visitNotes, setVisitNotes] = useState('');
  const [submittingVisit, setSubmittingVisit] = useState(false);

  const trackedRef = useRef<string | null>(null);

  const propertyId = String(params.id || '');
  const userRole = (user?.role || '').toLowerCase();
  const isBuyer = userRole === 'buyer';
  const hasDetailAccess = !isBuyer || hasPaid;
  const canContactSeller = hasFeature('contactAccess');

  useEffect(() => {
    if (!propertyId) return;

    const fetchListing = async () => {
      try {
        setLoading(true);
        const response = await backendApi.properties.getById(propertyId);

        if (!response?.success) {
          if (response?.code === 'PLAN_REQUIRED') {
            router.replace('/dashboard/pricing');
            return;
          }
          throw new Error(response?.error || response?.message || 'Failed to load property');
        }

        const data = response?.data;
        setListing(data);
        setLiveViews(Number(data?.views || 0));
        if (data?.price) {
          setBidAmount(String(Number(data.price)));
        }

        // Track real-time view (deduplicated per session)
        if (trackedRef.current !== propertyId) {
          trackedRef.current = propertyId;
          backendApi.properties.trackView(propertyId).catch(() => null);
        }
      } catch (error: any) {
        console.error('Failed to fetch listing:', error);
        showAlert({
          title: 'Failed to Load',
          message: error?.message || 'Could not fetch property details.',
          type: 'error',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchListing();
  }, [propertyId, router, showAlert]);

  useEffect(() => {
    if (!propertyId) return;

    const unsubscribe = onPropertyViewUpdate((data) => {
      if (data.propertyId === propertyId) {
        setLiveViews(data.views);
      }
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [propertyId, onPropertyViewUpdate]);

  const formatPrice = (price: number, listingType: string) => {
    if (listingType === 'rent') {
      return `INR ${price.toLocaleString('en-IN')}/month`;
    }
    if (price >= 10000000) {
      return `INR ${(price / 10000000).toFixed(2)} Crore`;
    }
    if (price >= 100000) {
      return `INR ${(price / 100000).toFixed(2)} Lakh`;
    }
    return `INR ${price.toLocaleString('en-IN')}`;
  };

  const handlePlaceBid = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!listing?.id) return;

    try {
      setSubmittingBid(true);
      const response = await backendApi.bids.create(listing.id, Number(bidAmount), bidMessage || undefined);

      if (!response?.success) {
        if (response?.code === 'PLAN_REQUIRED') {
          router.push('/dashboard/pricing');
          return;
        }
        throw new Error(response?.error || response?.message || 'Failed to send inquiry');
      }

      showAlert({
        title: 'Inquiry Sent',
        message: 'Your inquiry has been sent to the seller.',
        type: 'success',
      });
      setBidMessage('');
    } catch (error: any) {
      showAlert({
        title: 'Submission Failed',
        message: error?.message || 'Failed to send inquiry.',
        type: 'error',
      });
    } finally {
      setSubmittingBid(false);
    }
  };

  const handleMessageSeller = async () => {
    if (!listing?.sellerId) return;

    try {
      setStartingChat(true);
      const response = await backendApi.chat.createConversation({
        otherUserId: listing.sellerId,
        type: 'buyer-seller',
        propertyId: listing.id,
        propertyTitle: listing.title,
      });

      if (!response?.success) {
        throw new Error(response?.error || response?.message || 'Unable to open chat');
      }

      const conversationId = response?.data?.conversation?.id;
      if (conversationId) {
        router.push(`/dashboard/chat?conversationId=${encodeURIComponent(conversationId)}`);
      } else {
        router.push('/dashboard/chat');
      }
    } catch (error: any) {
      showAlert({
        title: 'Chat Unavailable',
        message: error?.message || 'Could not start chat with seller.',
        type: 'error',
      });
    } finally {
      setStartingChat(false);
    }
  };

  const handleScheduleVisit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!listing?.id) return;

    try {
      setSubmittingVisit(true);

      const response = await backendApi.visits.create({
        propertyId: listing.id,
        scheduledAt: visitDateTime ? new Date(visitDateTime).toISOString() : undefined,
        notes: visitNotes || undefined,
      });

      if (!response?.success) {
        if (response?.code === 'PLAN_REQUIRED') {
          router.push('/dashboard/pricing');
          return;
        }
        throw new Error(response?.error || response?.message || 'Failed to schedule visit');
      }

      showAlert({
        title: 'Visit Scheduled',
        message: 'Your visit request has been sent. Seller has been notified.',
        type: 'success',
      });
      setVisitDateTime('');
      setVisitNotes('');
    } catch (error: any) {
      showAlert({
        title: 'Visit Scheduling Failed',
        message: error?.message || 'Unable to schedule visit.',
        type: 'error',
      });
    } finally {
      setSubmittingVisit(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-600 dark:text-gray-400">Loading property...</p>
        </div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-4">Property not found</p>
          <button onClick={() => router.push(backPath)} className="btn-primary">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const isOwnProperty = Boolean(user?.uid && listing?.sellerId && user.uid === listing.sellerId);
  const canInquiryActions = isBuyer && canContactSeller && !isOwnProperty;

  return (
    <div className={`${isDashboard ? '' : 'min-h-screen bg-gray-50 dark:bg-gray-950 py-8'}`}>
      <div className={`${isDashboard ? '' : 'container mx-auto px-4'}`}>
        <button
          onClick={() => router.push(backPath)}
          className="inline-flex items-center text-primary-600 hover:underline mb-6 group"
        >
          <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform" />
          Back
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="aspect-video bg-gray-200 dark:bg-gray-800 rounded-2xl overflow-hidden relative shadow-inner">
              {listing.featured && (
                <span className="absolute top-4 right-4 bg-accent-500 text-white px-3 py-1 rounded-lg z-10 flex items-center space-x-1 shadow-lg">
                  <Star size={16} className="fill-current" />
                  <span className="font-bold text-xs">Featured</span>
                </span>
              )}
              {listing.verified && (
                <span className="absolute top-4 left-4 bg-green-500 text-white px-3 py-1 rounded-lg z-10 flex items-center space-x-1 shadow-lg">
                  <CheckCircle size={16} />
                  <span className="font-bold text-xs">Verified</span>
                </span>
              )}
              <div className="w-full h-full flex items-center justify-center">
                {listing.images?.[0] || listing.photos?.[0] ? (
                  <img
                    src={listing.images?.[0] || listing.photos?.[0]}
                    alt={listing.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Home size={96} className="text-gray-400 opacity-50" />
                )}
              </div>
            </div>

            <div className="space-y-4">
              <h1 className="font-heading font-bold text-3xl md:text-4xl text-gray-900 dark:text-white">
                {listing.title}
              </h1>
              <div className="flex flex-wrap items-center justify-between gap-4">
                <p className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
                  {formatPrice(Number(listing.price || 0), listing.listingType || listing.category)}
                </p>
                <div className="flex items-center bg-gray-100 dark:bg-gray-800 px-3 py-1.5 rounded-lg text-gray-600 dark:text-gray-400">
                  <Eye size={18} className="mr-2" />
                  <span className="font-medium">{liveViews} views</span>
                </div>
              </div>
              <div className="flex items-center text-gray-600 dark:text-gray-400">
                <MapPin size={20} className="mr-2 text-primary-500" />
                <span className={hasDetailAccess ? '' : 'blur-sm select-none'}>
                  {getLocationLabel(listing, hasDetailAccess)}
                </span>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-xl border border-gray-100 dark:border-gray-800">
              <h2 className="font-heading font-bold text-xl mb-6 text-gray-900 dark:text-white">Property Details</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600">
                    <Bed size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Beds</p>
                    <p className="font-bold text-gray-900 dark:text-white">{listing.bedrooms || 0}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center text-purple-600">
                    <Bath size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Baths</p>
                    <p className="font-bold text-gray-900 dark:text-white">{listing.bathrooms || 0}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-green-50 dark:bg-green-900/30 flex items-center justify-center text-green-600">
                    <Maximize size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Area</p>
                    <p className="font-bold text-gray-900 dark:text-white">{listing.area || 'N/A'}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-orange-50 dark:bg-orange-900/30 flex items-center justify-center text-orange-600">
                    <Calendar size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Status</p>
                    <p className="font-bold text-gray-900 dark:text-white capitalize">{listing.status}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-xl border border-gray-100 dark:border-gray-800">
              <h2 className="font-heading font-bold text-xl mb-4 text-gray-900 dark:text-white">Description</h2>
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line leading-relaxed">
                {listing.description}
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-2xl border border-gray-100 dark:border-gray-800 sticky top-24 space-y-6">
              <h2 className="font-heading font-bold text-xl text-gray-900 dark:text-white">Inquiry & Visit</h2>

              {canInquiryActions ? (
                <>
                  <form onSubmit={handlePlaceBid} className="space-y-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Offer Amount (INR)</label>
                      <input
                        type="number"
                        className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary-500 transition-all font-bold text-lg"
                        value={bidAmount}
                        onChange={(e) => setBidAmount(e.target.value)}
                        min={Number(listing.price || 0)}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Message</label>
                      <textarea
                        className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary-500 transition-all resize-none"
                        rows={3}
                        value={bidMessage}
                        onChange={(e) => setBidMessage(e.target.value)}
                        placeholder="I am interested in this property..."
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full bg-gradient-to-r from-primary-600 to-purple-600 hover:from-primary-700 hover:to-purple-700 text-white py-3 rounded-xl font-bold transition-all disabled:opacity-50"
                      disabled={submittingBid}
                    >
                      {submittingBid ? 'Sending...' : 'Send Inquiry'}
                    </button>
                  </form>

                  <button
                    onClick={handleMessageSeller}
                    className="w-full border border-primary-600 text-primary-700 dark:text-primary-300 py-3 rounded-xl font-semibold inline-flex items-center justify-center gap-2"
                    disabled={startingChat}
                  >
                    <MessageCircle size={16} />
                    {startingChat ? 'Opening Chat...' : 'Message Seller'}
                  </button>

                  <form onSubmit={handleScheduleVisit} className="space-y-3 pt-2 border-t border-gray-200 dark:border-gray-800">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">Schedule a Visit</p>
                    <input
                      type="datetime-local"
                      value={visitDateTime}
                      onChange={(e) => setVisitDateTime(e.target.value)}
                      className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-xl px-4 py-3"
                      required
                    />
                    <textarea
                      value={visitNotes}
                      onChange={(e) => setVisitNotes(e.target.value)}
                      rows={2}
                      placeholder="Preferred timing or notes"
                      className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-xl px-4 py-3 resize-none"
                    />
                    <button
                      type="submit"
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-semibold disabled:opacity-50"
                      disabled={submittingVisit}
                    >
                      {submittingVisit ? 'Scheduling...' : 'Schedule Visit'}
                    </button>
                  </form>
                </>
              ) : (
                <div className="text-center py-6">
                  <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mx-auto mb-4 text-primary-600">
                    <Lock size={32} />
                  </div>
                  <h3 className="font-bold text-gray-900 dark:text-white mb-2">
                    {isOwnProperty ? 'Your Listing' : 'Upgrade Required'}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                    {isOwnProperty
                      ? 'Buyer inquiry tools are shown to property buyers. You can manage incoming inquiries from the Inquiries menu.'
                      : 'Active buyer plan is required to contact seller, negotiate, and schedule visits.'}
                  </p>
                  {!isOwnProperty ? (
                    <Link
                      href={isDashboard || user ? '/dashboard/pricing' : '/pricing'}
                      className="w-full bg-gradient-to-r from-primary-600 to-purple-600 text-white py-3 rounded-xl font-bold shadow-lg inline-block"
                    >
                      Upgrade Now
                    </Link>
                  ) : null}
                </div>
              )}
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-xl border border-gray-100 dark:border-gray-800">
              <h3 className="font-bold text-gray-900 dark:text-white mb-4">Posted By</h3>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 font-bold">
                  {(listing.owner?.name || 'Seller').charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-bold text-gray-900 dark:text-white">{listing.owner?.name || 'Property Seller'}</p>
                  <p className="text-xs text-gray-500">Seller ID: {listing.sellerId || 'N/A'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
