// API Utilities for Backend Routes
import { NextRequest, NextResponse } from 'next/server'

export interface ApiResponse<T = any> {
    success: boolean
    data?: T
    error?: string
    message?: string
}

export interface AuthenticatedRequest extends NextRequest {
    userId?: string
    userEmail?: string
}

/**
 * Create a standardized success response
 */
export function successResponse<T>(data: T, message?: string): NextResponse {
    return NextResponse.json({
        success: true,
        data,
        ...(message && { message })
    } as ApiResponse<T>)
}

/**
 * Create a standardized error response
 */
export function errorResponse(error: string, statusCode: number = 400): NextResponse {
    return NextResponse.json(
        {
            success: false,
            error
        } as ApiResponse,
        { status: statusCode }
    )
}

/**
 * Verify auth token from request headers (using backend JWT tokens)
 */
export async function verifyAuth(request: NextRequest): Promise<{ userId: string; userEmail: string | null } | null> {
    try {
        const authHeader = request.headers.get('Authorization')

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return null
        }

        const token = authHeader.split('Bearer ')[1]

        // Extract user info from headers (set by backend authentication)
        const userId = request.headers.get('X-User-Id')
        const userEmail = request.headers.get('X-User-Email')

        if (!userId) {
            return null
        }

        return { userId, userEmail }
    } catch (error) {
        console.error('Auth verification error:', error)
        return null
    }
}

/**
 * Middleware wrapper for authenticated routes
 */
export function withAuth(
    handler: (request: NextRequest, context: { userId: string; userEmail: string | null }) => Promise<NextResponse>
) {
    return async (request: NextRequest) => {
        const authResult = await verifyAuth(request)

        if (!authResult) {
            return errorResponse('Unauthorized - Please login', 401)
        }

        return handler(request, authResult)
    }
}

/**
 * Validate request body against required fields
 */
export function validateRequestBody(body: any, requiredFields: string[]): string[] {
    const errors: string[] = []

    for (const field of requiredFields) {
        if (!body || body[field] === undefined || body[field] === null || body[field] === '') {
            errors.push(`Missing required field: ${field}`)
        }
    }

    return errors
}

/**
 * Handle async route errors
 */
export async function handleRouteError(error: any): Promise<NextResponse> {
    console.error('API Route Error:', error)

    if (error.code === 'permission-denied') {
        return errorResponse('Permission denied', 403)
    }

    if (error.code === 'not-found') {
        return errorResponse('Resource not found', 404)
    }

    return errorResponse(
        error.message || 'Internal server error',
        error.statusCode || 500
    )
}

/**
 * Rate limiting helper (simple in-memory implementation)
 */
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()

export function checkRateLimit(
    identifier: string,
    maxRequests: number = 100,
    windowMs: number = 60000
): boolean {
    const now = Date.now()
    const record = rateLimitMap.get(identifier)

    if (!record || now > record.resetTime) {
        rateLimitMap.set(identifier, { count: 1, resetTime: now + windowMs })
        return true
    }

    if (record.count >= maxRequests) {
        return false
    }

    record.count++
    return true
}

/**
 * Sanitize input to prevent XSS and injection attacks
 */
export function sanitizeInput(input: string): string {
    if (typeof input !== 'string') return input

    return input
        .replace(/[<>]/g, '') // Remove potential HTML tags
        .trim()
}

/**
 * Parse query parameters safely
 */
export function parseQueryParams(request: NextRequest) {
    const { searchParams } = new URL(request.url)
    const params: Record<string, string> = {}

    searchParams.forEach((value, key) => {
        params[key] = sanitizeInput(value)
    })

    return params
}

/**
 * CORS headers for API routes
 */
export function corsHeaders() {
    return {
        'Access-Control-Allow-Origin': process.env.NEXT_PUBLIC_APP_URL || '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-User-Id, X-User-Email',
    }
}

/**
 * Handle OPTIONS requests for CORS
 */
export function handleOptions(): NextResponse {
    return new NextResponse(null, {
        status: 200,
        headers: corsHeaders()
    })
}
