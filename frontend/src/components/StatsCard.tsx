import React, { ReactNode } from 'react';
import { LoadingSkeleton } from './LoadingSkeleton';

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    trend: 'up' | 'down';
    label?: string;
  };
  icon?: ReactNode;
  isLoading?: boolean;
  error?: Error | null;
  className?: string;
  onClick?: () => void;
}

/**
 * Reusable stats card component with loading and error states
 * Used in dashboards to display metrics
 */
export function StatsCard({
  title,
  value,
  change,
  icon,
  isLoading = false,
  error = null,
  className = '',
  onClick,
}: StatsCardProps) {
  if (isLoading) {
    return (
      <div className={`bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md ${className}`}>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 mb-4" />
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-32 mb-2" />
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-20" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border-l-4 border-red-500 ${className}`}>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{title}</p>
        <p className="text-sm text-red-600 dark:text-red-400">Error loading data</p>
      </div>
    );
  }

  return (
    <div
      className={`bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow ${
        onClick ? 'cursor-pointer' : ''
      } ${className}`}
      onClick={onClick}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
            {title}
          </p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
            {value}
          </p>
          {change && (
            <div className="flex items-center gap-1">
              <span
                className={`text-sm font-medium ${
                  change.trend === 'up'
                    ? 'text-green-600 dark:text-green-400'
                    : 'text-red-600 dark:text-red-400'
                }`}
              >
                {change.trend === 'up' ? '↑' : '↓'} {Math.abs(change.value)}%
              </span>
              {change.label && (
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {change.label}
                </span>
              )}
            </div>
          )}
        </div>
        {icon && (
          <div className="flex-shrink-0 ml-4">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center text-blue-600 dark:text-blue-400">
              {icon}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Grid layout for multiple stats cards
 */
export function StatsGrid({ 
  children, 
  cols = 4 
}: { 
  children: ReactNode; 
  cols?: 1 | 2 | 3 | 4 
}) {
  const colsClass = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  };

  return (
    <div className={`grid ${colsClass[cols]} gap-6`}>
      {children}
    </div>
  );
}
