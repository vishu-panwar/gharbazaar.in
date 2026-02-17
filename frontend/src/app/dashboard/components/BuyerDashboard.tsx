'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useLocale } from '@/contexts/LocaleContext';
import PlanUsageWidget from '@/components/Dashboard/PlanUsageWidget';
import UpgradeBanner from '@/components/Dashboard/UpgradeBanner';
import ExpandRequestModal from '@/components/ExpandRequest/RequestModal';
import PropertyCard from '@/components/PropertyCard';
import { StatsCard, StatsGrid } from '@/components/StatsCard';
import { LoadingSkeleton, DashboardStatsSkeleton, PropertyCardSkeleton } from '@/components/LoadingSkeleton';
import { EmptyState, NoPropertiesFound, NoNotifications } from '@/components/EmptyState';
import {
  useFavorites,
  useUpcomingVisits,
  useActiveBidsCount,
  useProperties,
  useNotifications,
  useUnreadNotificationCount,
} from '@/hooks/api';
import {
  Eye,
  Heart,
  Gavel,
  MapPin,
  Wallet,
  MessageCircle,
  Calendar,
  Shield,
  TrendingUp,
  Target,
  Bell,
  Home,
  ChevronRight,
  Plus,
} from 'lucide-react';

interface BuyerDashboardProps {
  user: any;
  currentTime: Date;
}

export default function BuyerDashboard({ user, currentTime }: BuyerDashboardProps) {
  const { formatPrice } = useLocale();
  const userName = user?.name || user?.displayName || user?.email?.split('@')[0] || 'User';
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [showExpandModal, setShowExpandModal] = useState(false);

  // Fetch real data using React Query hooks
  const { data: favorites, isLoading: favoritesLoading } = useFavorites();
  const { data: upcomingVisits, isLoading: visitsLoading } = useUpcomingVisits();
  const { count: activeBidsCount } = useActiveBidsCount();
  const { data: propertiesData, isLoading: propertiesLoading } = useProperties();
  const { data: notificationsData } = useNotifications();
  const { data: unreadCount } = useUnreadNotificationCount();
  
  // Extract notifications array from response with defensive checks
  const notifications = useMemo(() => {
    if (!notificationsData) return [];
    if (Array.isArray(notificationsData)) return notificationsData;
    if (notificationsData.notifications && Array.isArray(notificationsData.notifications)) {
      return notificationsData.notifications;
    }
    return [];
  }, [notificationsData]);

  // Extract properties array from response with defensive checks
  const recommendedProperties = useMemo(() => {
    if (!propertiesData) return [];
    if (Array.isArray(propertiesData)) return propertiesData;
    if (propertiesData.properties && Array.isArray(propertiesData.properties)) {
      return propertiesData.properties;
    }
    if (propertiesData.data && Array.isArray(propertiesData.data)) {
      return propertiesData.data;
    }
    return [];
  }, [propertiesData]);

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const isLoading = favoritesLoading || visitsLoading || propertiesLoading;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8 space-y-8">
        {/* Header */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-3xl p-6 md:p-8 shadow-xl border border-white/20">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {getGreeting()}, {userName}! 👋
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Ready to find your dream property?
              </p>
            </div>

            <Link
              href="/dashboard/browse"
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl"
            >
              <Home size={20} />
              Browse Properties
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        {isLoading ? (
          <DashboardStatsSkeleton />
        ) : (
          <StatsGrid cols={4}>
            <StatsCard
              title="Saved Properties"
              value={favorites?.length || 0}
              icon={<Heart size={24} />}
              change={{ value: 12, trend: 'up', label: 'vs last week' }}
            />
            <StatsCard
              title="Upcoming Visits"
              value={upcomingVisits?.length || 0}
              icon={<Calendar size={24} />}
            />
            <StatsCard
              title="Active Bids"
              value={activeBidsCount}
              icon={<Gavel size={24} />}
              change={{ value: 5, trend: 'up', label: 'new this week' }}
            />
            <StatsCard
              title="Notifications"
              value={unreadCount || 0}
              icon={<Bell size={24} />}
              onClick={() => (window.location.href = '/dashboard/notifications')}
            />
          </StatsGrid>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link
            href="/dashboard/favorites"
            className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all group"
          >
            <Heart className="text-pink-500 mb-3 group-hover:scale-110 transition-transform" size={32} />
            <h3 className="font-semibold text-gray-900 dark:text-white">Favorites</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">View saved</p>
          </Link>

          <Link
            href="/dashboard/offers"
            className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all group"
          >
            <Gavel className="text-orange-500 mb-3 group-hover:scale-110 transition-transform" size={32} />
            <h3 className="font-semibold text-gray-900 dark:text-white">My Bids</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Track offers</p>
          </Link>

          <Link
            href="/dashboard/chat"
            className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all group"
          >
            <MessageCircle className="text-blue-500 mb-3 group-hover:scale-110 transition-transform" size={32} />
            <h3 className="font-semibold text-gray-900 dark:text-white">Messages</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Chat now</p>
          </Link>

          <Link
            href="/dashboard/visits"
            className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all group"
          >
            <Calendar className="text-green-500 mb-3 group-hover:scale-110 transition-transform" size={32} />
            <h3 className="font-semibold text-gray-900 dark:text-white">Visits</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Schedule</p>
          </Link>
        </div>

        {/* Recommended Properties */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-3xl p-6 md:p-8 shadow-xl border border-white/20">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Recommended for You
            </h2>
            <Link
              href="/dashboard/browse"
              className="text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1"
            >
              View All <ChevronRight size={16} />
            </Link>
          </div>

          {propertiesLoading ? (
            <PropertyCardSkeleton count={3} />
          ) : !recommendedProperties || recommendedProperties.length === 0 ? (
            <NoPropertiesFound onBrowse={() => (window.location.href = '/dashboard/browse')} />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendedProperties.slice(0, 6).map((property: any) => (
                <PropertyCard key={property.id} property={property} />
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
              className="text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1"
            >
              View All <ChevronRight size={16} />
            </Link>
          </div>

          {notifications.length === 0 ? (
            <NoNotifications />
          ) : (
            <div className="space-y-3">
              {notifications.slice(0, 5).map((notification: any) => (
                <div
                  key={notification.id}
                  className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="flex-shrink-0 mt-1">
                    <Bell className="text-blue-500" size={20} />
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
