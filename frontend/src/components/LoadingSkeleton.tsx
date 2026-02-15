import React from 'react';

interface LoadingSkeletonProps {
  variant?: 'card' | 'list' | 'table' | 'dashboard' | 'text';
  count?: number;
  className?: string;
}

/**
 * Reusable loading skeleton component with multiple variants
 * for consistent loading states across the application
 */
export function LoadingSkeleton({ 
  variant = 'card', 
  count = 1,
  className = '' 
}: LoadingSkeletonProps) {
  const skeletons = Array.from({ length: count }, (_, i) => i);

  const baseClass = 'animate-pulse bg-gray-200 dark:bg-gray-700 rounded';

  if (variant === 'card') {
    return (
      <div className={`grid gap-6 ${className}`}>
        {skeletons.map((i) => (
          <div key={i} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            {/* Image placeholder */}
            <div className={`${baseClass} h-48 w-full mb-4`} />
            {/* Title */}
            <div className={`${baseClass} h-6 w-3/4 mb-3`} />
            {/* Description lines */}
            <div className={`${baseClass} h-4 w-full mb-2`} />
            <div className={`${baseClass} h-4 w-5/6`} />
            {/* Footer */}
            <div className="flex gap-4 mt-4">
              <div className={`${baseClass} h-8 w-20`} />
              <div className={`${baseClass} h-8 w-20`} />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (variant === 'list') {
    return (
      <div className={`space-y-4 ${className}`}>
        {skeletons.map((i) => (
          <div key={i} className="flex items-center gap-4 p-4 bg-white dark:bg-gray-800 rounded-lg">
            <div className={`${baseClass} h-12 w-12 rounded-full flex-shrink-0`} />
            <div className="flex-1">
              <div className={`${baseClass} h-5 w-1/3 mb-2`} />
              <div className={`${baseClass} h-4 w-2/3`} />
            </div>
            <div className={`${baseClass} h-8 w-24`} />
          </div>
        ))}
      </div>
    );
  }

  if (variant === 'table') {
    return (
      <div className={`bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden ${className}`}>
        {/* Table header */}
        <div className="border-b border-gray-200 dark:border-gray-700 p-4">
          <div className="flex gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className={`${baseClass} h-5 flex-1`} />
            ))}
          </div>
        </div>
        {/* Table rows */}
        {skeletons.map((i) => (
          <div key={i} className="border-b border-gray-100 dark:border-gray-700 p-4">
            <div className="flex gap-4">
              {[1, 2, 3, 4].map((j) => (
                <div key={j} className={`${baseClass} h-4 flex-1`} />
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (variant === 'dashboard') {
    return (
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 ${className}`}>
        {skeletons.map((i) => (
          <div key={i} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <div className={`${baseClass} h-4 w-24 mb-4`} />
            <div className={`${baseClass} h-10 w-32 mb-2`} />
            <div className={`${baseClass} h-3 w-20`} />
          </div>
        ))}
      </div>
    );
  }

  if (variant === 'text') {
    return (
      <div className={`space-y-2 ${className}`}>
        {skeletons.map((i) => (
          <div key={i} className={`${baseClass} h-4 w-full`} />
        ))}
      </div>
    );
  }

  return null;
}

/**
 * Specific skeleton variants for common use cases
 */
export function PropertyCardSkeleton({ count = 3 }: { count?: number }) {
  return <LoadingSkeleton variant="card" count={count} className="grid-cols-1 md:grid-cols-2 lg:grid-cols-3" />;
}

export function DashboardStatsSkeleton() {
  return <LoadingSkeleton variant="dashboard" count={4} />;
}

export function DataTableSkeleton({ rows = 5 }: { rows?: number }) {
  return <LoadingSkeleton variant="table" count={rows} />;
}

export function ListItemSkeleton({ count = 5 }: { count?: number }) {
  return <LoadingSkeleton variant="list" count={count} />;
}
