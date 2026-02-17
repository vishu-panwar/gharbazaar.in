import React from 'react'
import { LucideIcon } from 'lucide-react'
import { Button } from './button'

interface EmptyStateProps {
    icon: LucideIcon
    title: string
    description: string
    action?: {
        label: string
        onClick: () => void
    }
    className?: string
}

export const EmptyState = ({
    icon: Icon,
    title,
    description,
    action,
    className = ''
}: EmptyStateProps) => {
    return (
        <div className={`flex flex-col items-center justify-center text-center py-12 px-4 ${className}`}>
            <Icon className="w-16 h-16 text-gray-400 dark:text-gray-600 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {title}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md">
                {description}
            </p>
            {action && (
                <Button onClick={action.onClick}>
                    {action.label}
                </Button>
            )}
        </div>
    )
}

export default EmptyState
