'use client';

import { useState } from 'react';
import Link from 'next/link';
import PlanUsageWidget from '@/components/Dashboard/PlanUsageWidget';
import UpgradeBanner from '@/components/Dashboard/UpgradeBanner';
import ExpandRequestModal from '@/components/ExpandRequest/RequestModal';
import PropertyCard from '@/components/PropertyCard';
import { StatsCard, StatsGrid } from '@/components/StatsCard';
import { LoadingSkeleton, DashboardStatsSkeleton, PropertyCardSkeleton } from '@/components/LoadingSkeleton';
import { EmptyState, NoPropertiesFound, NoNotifications } from '@/components/EmptyState';
import {
  useMyListings,
  useSellerBids,
  useEarnings,
  useNotifications,
  usePropertyStats,
  useUnreadNotificationCount,
} from '@/hooks/api';
import { formatCurrency } from '@/lib/currency';
import {
  Home,
  Gavel,
  Eye,
  Wallet,
  TrendingUp,
  Plus,
  ChevronRight,
  Bell,
  BarChart3,
  FileText,
  Calendar,
  Clock,
} from 'lucide-react';

interface SellerDashboardProps {
  user: any;
  currentTime: Date;
}

export default function SellerDashboard({ user, currentTime }: SellerDashboardProps) {
  const userName = user?.name || user?.displayName || user?.email?.split('@')[0] || 'User';
  const [activeTab, setActiveTab] = useState('overview');
  const [showExpandModal, setShowExpandModal] = useState(false);

  // Fetch real data using React Query hooks
  const { data: myListings, isLoading: listingsLoading } = useMyListings();
  const { data: sellerBids, isLoading: bidsLoading } = useSellerBids();
  const { data: earnings, isLoading: earningsLoading } = useEarnings();
  const { data: propertyAnalytics } = usePropertyStats();
  const { data: notifications } = useNotifications();
  const { data: unreadCount } = useUnreadNotificationCount();

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const getStatusBadge = (status: string) => {
    const statusClasses = {
      PENDING: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
      VERIFIED: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
      ACTIVE: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
      SOLD: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
      REJECTED: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
    };
    return statusClasses[status as keyof typeof statusClasses] || statusClasses.PENDING;
  };

  const isLoading = listingsLoading || bidsLoading || earningsLoading;

  // Calculate stats from real data
  const activeListings = myListings?.filter((p: any) => p.status === 'ACTIVE' || p.status === 'VERIFIED').length || 0;
  const pendingBids = sellerBids?.filter((b: any) => b.status === 'PENDING').length || 0;
  const totalViews = propertyAnalytics?.totalViews || 0;
  const totalEarnings = earnings?.totalEarnings || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-teal-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8 space-y-8">
        {/* Header */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-3xl p-6 md:p-8 shadow-xl border border-white/20">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                {getGreeting()}, {userName}! 🏡
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Manage your properties and track performance
              </p>
            </div>

            <Link
              href="/dashboard/listings/new"
              className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl"
            >
              <Plus size={20} />
              Add Property
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        {isLoading ? (
          <DashboardStatsSkeleton />
        ) : (
          <StatsGrid cols={4}>
            <StatsCard
              title="Active Listings"
              value={activeListings}
              icon={<Home size={24} />}
              change={{ value: 8, trend: 'up', label: 'vs last month' }}
            />
            <StatsCard
              title="Pending Bids"
              value={pendingBids}
              icon={<Gavel size={24} />}
              onClick={() => (window.location.href = '/dashboard/offers')}
            />
            <StatsCard
              title="Total Views"
              value={totalViews}
              icon={<Eye size={24} />}
              change={{ value: 15, trend: 'up', label: 'this week' }}
            />
            <StatsCard
              title="Total Earnings"
              value={formatCurrency(totalEarnings)}
              icon={<Wallet size={24} />}
              change={{ value: 12, trend: 'up', label: 'vs last month' }}
            />
          </StatsGrid>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link
            href="/dashboard/listings"
            className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all group"
          >
            <Home className="text-emerald-500 mb-3 group-hover:scale-110 transition-transform" size={32} />
            <h3 className="font-semibold text-gray-900 dark:text-white">My Listings</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Manage properties</p>
          </Link>

          <Link
            href="/dashboard/offers"
            className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all group"
          >
            <Gavel className="text-orange-500 mb-3 group-hover:scale-110 transition-transform" size={32} />
            <h3 className="font-semibold text-gray-900 dark:text-white">Offers</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Review bids</p>
          </Link>

          <Link
            href="/dashboard/analytics"
            className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all group"
          >
            <BarChart3 className="text-blue-500 mb-3 group-hover:scale-110 transition-transform" size={32} />
            <h3 className="font-semibold text-gray-900 dark:text-white">Analytics</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">View insights</p>
          </Link>

          <Link
            href="/dashboard/earnings"
            className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all group"
          >
            <Wallet className="text-green-500 mb-3 group-hover:scale-110 transition-transform" size={32} />
            <h3 className="font-semibold text-gray-900 dark:text-white">Earnings</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Track income</p>
          </Link>
        </div>

        {/* My Properties */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-3xl p-6 md:p-8 shadow-xl border border-white/20">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              My Properties
            </h2>
            <Link
              href="/dashboard/listings"
              className="text-emerald-600 hover:text-emerald-700 font-semibold flex items-center gap-1"
            >
              View All <ChevronRight size={16} />
            </Link>
          </div>

          {listingsLoading ? (
            <PropertyCardSkeleton count={3} />
          ) : !myListings || myListings.length === 0 ? (
            <NoPropertiesFound
              message="You haven't listed any properties yet"
              onBrowse={() => (window.location.href = '/dashboard/listings/new')}
              buttonText="Add Property"
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myListings.slice(0, 6).map((property: any) => (
                <div key={property.id} className="relative">
                  <PropertyCard property={property} />
                  <div className="absolute top-3 right-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(property.status)}`}>
                      {property.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Bids/Offers */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-3xl p-6 md:p-8 shadow-xl border border-white/20">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Recent Offers
            </h2>
            <Link
              href="/dashboard/offers"
              className="text-emerald-600 hover:text-emerald-700 font-semibold flex items-center gap-1"
            >
              View All <ChevronRight size={16} />
            </Link>
          </div>

          {bidsLoading ? (
            <LoadingSkeleton variant="list" count={3} />
          ) : !sellerBids || sellerBids.length === 0 ? (
            <EmptyState
              icon={<Gavel size={48} />}
              title="No offers yet"
              description="You'll see buyer offers here"
            />
          ) : (
            <div className="space-y-3">
              {sellerBids.slice(0, 5).map((bid: any) => (
                <div
                  key={bid.id}
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {bid.property?.title || 'Property'}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {formatCurrency(bid.amount)} • {bid.status}
                    </p>
                  </div>
                  <Link
                    href={`/dashboard/offers?bid=${bid.id}`}
                    className="text-emerald-600 hover:text-emerald-700 font-semibold"
                  >
                    Review
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Activity/Notifications */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-3xl p-6 md:p-8 shadow-xl border border-white/20">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Recent Activity
            </h2>
            <Link
              href="/dashboard/notifications"
              className="text-emerald-600 hover:text-emerald-700 font-semibold flex items-center gap-1"
            >
              View All <ChevronRight size={16} />
            </Link>
          </div>

          {!notifications || !Array.isArray(notifications) || notifications.length === 0 ? (
            <NoNotifications />
          ) : (
            <div className="space-y-3">
              {notifications.slice(0, 5).map((notification: any) => (
                <div
                  key={notification.id}
                  className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="flex-shrink-0 mt-1">
                    <Bell className="text-emerald-500" size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      {notification.title}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                      {notification.message}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                      {notification.createdAt}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Plan Usage */}
        <PlanUsageWidget />

        {/* Expand Request Modal */}
        {showExpandModal && <ExpandRequestModal isOpen={showExpandModal} onClose={() => setShowExpandModal(false)} />}
      </div>
    </div>
  );
}
