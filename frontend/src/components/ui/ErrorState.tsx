import React from 'react'
import { AlertCircle, RefreshCw } from 'lucide-react'
import { Button } from './button'

interface ErrorStateProps {
    error?: string | Error
    title?: string
    retry?: () => void
    className?: string
}

export const ErrorState = ({
    error,
    title = 'Something went wrong',
    retry,
    className = ''
}: ErrorStateProps) => {
    const errorMessage = typeof error === 'string' ? error : error?.message || 'An unexpected error occurred'

    return (
        <div className={`flex flex-col items-center justify-center text-center py-12 px-4 ${className}`}>
            <AlertCircle className="w-16 h-16 text-red-500 dark:text-red-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {title}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md">
                {errorMessage}
            </p>
            {retry && (
                <Button onClick={retry} variant="outline">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Try Again
                </Button>
            )}
        </div>
    )
}

export default ErrorState
