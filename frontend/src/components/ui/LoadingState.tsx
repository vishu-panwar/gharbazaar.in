import React from 'react'
import { Loader2 } from 'lucide-react'

interface LoadingStateProps {
    message?: string
    className?: string
}

export const LoadingState = ({
    message = 'Loading...',
    className = ''
}: LoadingStateProps) => {
    return (
        <div className={`flex flex-col items-center justify-center min-h-96 ${className}`}>
            <Loader2 className="w-12 h-12 text-blue-600 dark:text-blue-400 animate-spin mb-4" />
            <p className="text-gray-600 dark:text-gray-400 text-lg">{message}</p>
        </div>
    )
}

export default LoadingState
