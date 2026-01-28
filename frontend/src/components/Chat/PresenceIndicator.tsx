'use client';

/**
 * 👤 PRESENCE INDICATOR COMPONENT
 * 
 * Shows real-time online/offline status with color-coded badges.
 * 
 * @author GharBazaar Frontend Team
 */

import React from 'react';
import { usePresence } from '@/contexts/PresenceContext';
import { formatDistanceToNow } from 'date-fns';

interface PresenceIndicatorProps {
    userId: string;
    showLabel?: boolean;
    showLastSeen?: boolean;
    size?: 'sm' | 'md' | 'lg';
}

export default function PresenceIndicator({
    userId,
    showLabel = false,
    showLastSeen = false,
    size = 'md'
}: PresenceIndicatorProps) {
    const { getUserStatus, getLastSeen } = usePresence();

    const status = getUserStatus(userId);
    const lastSeen = getLastSeen(userId);

    const sizeClasses = {
        sm: 'w-2 h-2',
        md: 'w-3 h-3',
        lg: 'w-4 h-4'
    };

    const statusColors = {
        online: 'bg-green-500',
        away: 'bg-yellow-500',
        offline: 'bg-gray-400 dark:bg-gray-600'
    };

    const statusLabels = {
        online: 'Online',
        away: 'Away',
        offline: 'Offline'
    };

    const getLastSeenText = () => {
        if (status !== 'offline' || !lastSeen) return null;

        try {
            return `Last seen ${formatDistanceToNow(lastSeen, { addSuffix: true })}`;
        } catch {
            return null;
        }
    };

    return (
        <div className="flex items-center gap-2">
            <div className="relative">
                <div
                    className={`${sizeClasses[size]} ${statusColors[status]} rounded-full border-2 border-white dark:border-gray-800 ${status === 'online' ? 'animate-pulse' : ''
                        }`}
                    title={statusLabels[status]}
                />
            </div>

            {showLabel && (
                <span className="text-xs text-gray-600 dark:text-gray-400">
                    {statusLabels[status]}
                </span>
            )}

            {showLastSeen && getLastSeenText() && (
                <span className="text-xs text-gray-500 dark:text-gray-500">
                    {getLastSeenText()}
                </span>
            )}
        </div>
    );
}
