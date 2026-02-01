'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, AlertCircle, Crown, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { CONFIG } from '@/config';

interface PlanUsage {
    plan: {
        _id: string;
        name: string;
        type: 'buyer' | 'seller';
        price: number;
        features: {
            viewLimit?: number;
            contactAccess?: boolean;
            listingLimit?: number;
            premiumSupport?: boolean;
            bidAccess?: boolean;
        };
    };
    usageStats: {
        viewsUsed: number;
        contactsUsed: number;
        listingsUsed: number;
        bidsUsed: number;
    };
    startDate: string;
    endDate: string;
}

export default function PlanUsageWidget() {
    const [usage, setUsage] = useState<PlanUsage | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUsage();
    }, []);

    const fetchUsage = async () => {
        try {
            const token = localStorage.getItem('auth_token');
            const response = await fetch(`${CONFIG.API.FULL_URL}/user/plan`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                setUsage(data.data);
            }
        } catch (error) {
            console.error('Error fetching plan usage:', error);
        } finally {
            setLoading(false);
        }
    };

    const getProgressColor = (percentage: number) => {
        if (percentage < 50) return 'bg-green-500';
        if (percentage < 80) return 'bg-yellow-500';
        return 'bg-red-500';
    };

    const getWarningLevel = (percentage: number) => {
        if (percentage >= 90) return 'critical';
        if (percentage >= 75) return 'warning';
        return 'normal';
    };

    if (loading) {
        return (
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-xl animate-pulse">
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
                <div className="space-y-3">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
            </div>
        );
    }

    if (!usage) {
        return (
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 rounded-3xl p-6 shadow-xl border border-blue-200 dark:border-gray-700">
                <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Crown className="text-white" size={28} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No Active Plan</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                        Subscribe to a plan to start listing properties
                    </p>
                    <Link
                        href="/dashboard/pricing"
                        className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition"
                    >
                        <span>View Plans</span>
                        <ArrowRight size={18} />
                    </Link>
                </div>
            </div>
        );
    }

    const stats = [
        {
            label: 'Listings Used',
            used: usage.usageStats.listingsUsed,
            limit: usage.plan.features.listingLimit || 0,
            show: usage.plan.type === 'seller' && usage.plan.features.listingLimit
        },
        {
            label: 'Property Views',
            used: usage.usageStats.viewsUsed,
            limit: usage.plan.features.viewLimit || 0,
            show: usage.plan.type === 'buyer' && usage.plan.features.viewLimit
        },
        {
            label: 'Seller Contacts',
            used: usage.usageStats.contactsUsed,
            limit: usage.plan.features.contactAccess ? 999 : 0,
            show: usage.plan.type === 'buyer'
        },
        {
            label: 'Bids Placed',
            used: usage.usageStats.bidsUsed,
            limit: usage.plan.features.bidAccess ? 999 : 0,
            show: usage.plan.type === 'buyer'
        }
    ].filter(stat => stat.show);

    return (
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-xl border border-gray-200 dark:border-gray-700">
            {/* Plan Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                        {usage.plan.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        Plan Usage · {usage.plan.type.charAt(0).toUpperCase() + usage.plan.type.slice(1)}
                    </p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center">
                    <Crown className="text-white" size={20} />
                </div>
            </div>

            {/* Usage Stats */}
            <div className="space-y-4 mb-6">
                {stats.map((stat, index) => {
                    const percentage = stat.limit > 0 ? (stat.used / stat.limit) * 100 : 0;
                    const warningLevel = getWarningLevel(percentage);

                    return (
                        <div key={index}>
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                    {stat.label}
                                </span>
                                <span className="text-sm font-bold text-gray-900 dark:text-white">
                                    {stat.used} / {stat.limit === 999 ? '∞' : stat.limit}
                                </span>
                            </div>

                            <div className="relative w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                <div
                                    className={`h-full transition-all duration-500 ${getProgressColor(percentage)}`}
                                    style={{ width: `${Math.min(percentage, 100)}%` }}
                                ></div>
                            </div>

                            {warningLevel === 'critical' && (
                                <div className="flex items-center space-x-2 mt-2 text-red-600 dark:text-red-400 text-xs">
                                    <AlertCircle size={14} />
                                    <span>Limit almost reached - upgrade recommended</span>
                                </div>
                            )}

                            {warningLevel === 'warning' && (
                                <div className="flex items-center space-x-2 mt-2 text-yellow-600 dark:text-yellow-400 text-xs">
                                    <AlertCircle size={14} />
                                    <span>Approaching limit</span>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Renewal Date */}
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 mb-4">
                <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Renews on</span>
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                        {new Date(usage.endDate).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                        })}
                    </span>
                </div>
            </div>

            {/* Upgrade Button */}
            <Link
                href="/dashboard/pricing"
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white py-3 rounded-xl font-semibold transition flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl"
            >
                <TrendingUp size={18} />
                <span>Upgrade Plan</span>
            </Link>
        </div>
    );
}
