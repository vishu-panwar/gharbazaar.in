// Error handling utilities for the entire application

export class AppError extends Error {
    constructor(
        message: string,
        public statusCode: number = 500,
        public code?: string
    ) {
        super(message)
        this.name = 'AppError'
    }
}

export interface ErrorLog {
    message: string
    stack?: string
    code?: string
    timestamp: string
    userId?: string
    url?: string
    userAgent?: string
    additionalInfo?: any
}

/**
 * Parse backend API errors into user-friendly messages
 * (Previously parseFirebaseError - updated for backend API)
 */
export function parseApiError(error: any): { message: string; code: string } {
    const errorMap: Record<string, string> = {
        'auth/user-not-found': 'No account found with this email',
        'auth/wrong-password': 'Incorrect password',
        'auth/email-already-in-use': 'Email is already registered',
        'auth/weak-password': 'Password should be at least 6 characters',
        'auth/invalid-email': 'Invalid email address',
        'auth/too-many-requests': 'Too many attempts. Please try again later',
        'auth/network-request-failed': 'Network error. Please check your connection',
        'permission-denied': 'You don\'t have permission to perform this action',
        'not-found': 'The requested resource was not found',
        'already-exists': 'This resource already exists',
        'failed-precondition': 'Operation cannot be performed in the current state',
        'aborted': 'Operation was aborted. Please try again',
        'out-of-range': 'Invalid input range',
        'unimplemented': 'This feature is not yet implemented',
        'internal': 'Internal server error. Please try again',
        'unavailable': 'Service temporarily unavailable',
        'unauthenticated': 'Please log in to continue',
    }

    const code = error?.code || error?.error?.code || 'unknown'
    return {
        message: errorMap[code] || error?.message || 'An unexpected error occurred',
        code
    }
}

/**
 * Log errors for monitoring and debugging
 */
export async function logError(error: Error | AppError, additionalInfo?: any): Promise<void> {
    const errorLog: ErrorLog = {
        message: error.message,
        stack: error.stack,
        code: error instanceof AppError ? error.code : undefined,
        timestamp: new Date().toISOString(),
        url: typeof window !== 'undefined' ? window.location.href : undefined,
        userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
        additionalInfo,
    }

    // Console log in development
    if (process.env.NODE_ENV === 'development') {
        console.error('Error logged:', errorLog)
    }

    // In production, send to error tracking service (e.g., Sentry)
    if (process.env.NODE_ENV === 'production') {
        try {
            // Example: Send to Sentry
            // Sentry.captureException(error, { extra: additionalInfo })

            // Or send to custom logging endpoint
            await fetch('/api/logs/error', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(errorLog),
            })
        } catch (loggingError) {
            console.error('Failed to log error:', loggingError)
        }
    }
}

/**
 * Handle errors with user-friendly messages and logging
 */
export async function handleError(
    error: unknown,
    context?: string
): Promise<{ message: string; code?: string }> {
    let errorMessage = 'An unexpected error occurred'
    let errorCode: string | undefined

    // Parse different error types
    if (error instanceof AppError) {
        errorMessage = error.message
        errorCode = error.code
    } else if (error && typeof error === 'object' && 'code' in error) {
        // Handle API errors (including former Firebase errors)
        const parsed = parseApiError(error)
        errorMessage = parsed.message
        errorCode = parsed.code
    } else if (error instanceof Error) {
        errorMessage = error.message
    } else if (typeof error === 'string') {
        errorMessage = error
    }

    // Log the error
    await logError(
        error instanceof Error ? error : new Error(String(error)),
        { context }
    )

    return { message: errorMessage, code: errorCode }
}

/**
 * Retry a function with exponential backoff
 */
export async function retryWithBackoff<T>(
    fn: () => Promise<T>,
    maxRetries: number = 3,
    baseDelay: number = 1000
): Promise<T> {
    for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
            return await fn()
        } catch (error) {
            const isLastAttempt = attempt === maxRetries - 1

            if (isLastAttempt) {
                throw error
            }

            // Exponential backoff: 1s, 2s, 4s, etc.
            const delay = baseDelay * Math.pow(2, attempt)
            await new Promise(resolve => setTimeout(resolve, delay))

            console.log(`Retry attempt ${attempt + 1}/${maxRetries} after ${delay}ms`)
        }
    }

    throw new Error('Max retries exceeded')
}

/**
 * Safely execute async function with error handling
 */
export async function safeAsync<T>(
    fn: () => Promise<T>,
    fallback?: T,
    onError?: (error: Error) => void
): Promise<T | undefined> {
    try {
        return await fn()
    } catch (error) {
        if (onError) {
            onError(error instanceof Error ? error : new Error(String(error)))
        } else {
            await handleError(error, 'safeAsync')
        }
        return fallback
    }
}

/**
 * Validate and sanitize user input
 */
export function validateInput(input: any, rules: {
    required?: boolean
    type?: 'string' | 'number' | 'email' | 'url' | 'phone'
    minLength?: number
    maxLength?: number
    min?: number
    max?: number
    pattern?: RegExp
}): { valid: boolean; error?: string } {
    if (rules.required && (input === undefined || input === null || input === '')) {
        return { valid: false, error: 'This field is required' }
    }

    if (!input && !rules.required) {
        return { valid: true }
    }

    // Type validation
    if (rules.type) {
        switch (rules.type) {
            case 'string':
                if (typeof input !== 'string') {
                    return { valid: false, error: 'Must be a string' }
                }
                break
            case 'number':
                if (typeof input !== 'number' || isNaN(input)) {
                    return { valid: false, error: 'Must be a valid number' }
                }
                break
            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
                if (!emailRegex.test(input)) {
                    return { valid: false, error: 'Must be a valid email address' }
                }
                break
            case 'url':
                try {
                    new URL(input)
                } catch {
                    return { valid: false, error: 'Must be a valid URL' }
                }
                break
            case 'phone':
                const phoneRegex = /^[6-9]\d{9}$/
                if (!phoneRegex.test(input.replace(/\D/g, ''))) {
                    return { valid: false, error: 'Must be a valid 10-digit phone number' }
                }
                break
        }
    }

    // Length validation for strings
    if (typeof input === 'string') {
        if (rules.minLength && input.length < rules.minLength) {
            return { valid: false, error: `Must be at least ${rules.minLength} characters` }
        }
        if (rules.maxLength && input.length > rules.maxLength) {
            return { valid: false, error: `Must be at most ${rules.maxLength} characters` }
        }
    }

    // Range validation for numbers
    if (typeof input === 'number') {
        if (rules.min !== undefined && input < rules.min) {
            return { valid: false, error: `Must be at least ${rules.min}` }
        }
        if (rules.max !== undefined && input > rules.max) {
            return { valid: false, error: `Must be at most ${rules.max}` }
        }
    }

    // Pattern validation
    if (rules.pattern && !rules.pattern.test(input)) {
        return { valid: false, error: 'Invalid format' }
    }

    return { valid: true }
}
