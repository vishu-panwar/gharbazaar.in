import rateLimit from 'express-rate-limit';
import { Request, Response } from 'express';

/**
 * Rate limiting middleware for chat API endpoints
 */

// Message sending rate limiter: 10 messages per minute per user
export const messageSendLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 10, // 10 requests per window
    message: {
        success: false,
        error: 'Too many messages sent. Please wait before sending more messages.',
    },
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req: Request) => {
        // Rate limit per user
        return (req as any).user?.userId || req.ip || 'anonymous';
    },
    handler: (req: Request, res: Response) => {
        console.warn(`⚠️ Rate limit exceeded for message sending: ${(req as any).user?.email || req.ip}`);
        res.status(429).json({
            success: false,
            error: 'Too many messages sent. Please wait before sending more messages.',
        });
    },
});

// Conversation creation rate limiter: 5 conversations per hour per user
export const conversationCreateLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 5, // 5 requests per window
    message: {
        success: false,
        error: 'Too many conversations created. Please try again later.',
    },
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req: Request) => {
        return (req as any).user?.userId || req.ip || 'anonymous';
    },
    handler: (req: Request, res: Response) => {
        console.warn(`⚠️ Rate limit exceeded for conversation creation: ${(req as any).user?.email || req.ip}`);
        res.status(429).json({
            success: false,
            error: 'Too many conversations created. Please try again later.',
        });
    },
});

// File upload rate limiter: 10 uploads per 5 minutes per user
export const fileUploadLimiter = rateLimit({
    windowMs: 5 * 60 * 1000, // 5 minutes
    max: 10, // 10 requests per window
    message: {
        success: false,
        error: 'Too many file uploads. Please wait before uploading more files.',
    },
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req: Request) => {
        return (req as any).user?.userId || req.ip || 'anonymous';
    },
    handler: (req: Request, res: Response) => {
        console.warn(`⚠️ Rate limit exceeded for file uploads: ${(req as any).user?.email || req.ip}`);
        res.status(429).json({
            success: false,
            error: 'Too many file uploads. Please wait before uploading more files.',
        });
    },
});

// General API rate limiter: 100 requests per 15 minutes per user
export const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 1000, // 1000 requests per window
    message: {
        success: false,
        error: 'Too many requests. Please try again later.',
    },
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req: Request) => {
        return (req as any).user?.userId || req.ip || 'anonymous';
    },
    handler: (req: Request, res: Response) => {
        console.warn(`⚠️ General rate limit exceeded: ${(req as any).user?.email || req.ip}`);
        res.status(429).json({
            success: false,
            error: 'Too many requests. Please try again later.',
        });
    },
});

/**
 * Socket rate limiter - tracks message frequency per socket connection
 */
export class SocketRateLimiter {
    private messageTimestamps: Map<string, number[]> = new Map();
    private readonly maxMessages: number;
    private readonly windowMs: number;

    constructor(maxMessages: number = 10, windowMs: number = 60000) {
        this.maxMessages = maxMessages;
        this.windowMs = windowMs;
    }

    /**
     * Check if user/socket has exceeded rate limit
     */
    checkLimit(userId: string): boolean {
        const now = Date.now();
        const timestamps = this.messageTimestamps.get(userId) || [];

        // Remove timestamps outside the window
        const validTimestamps = timestamps.filter(ts => now - ts < this.windowMs);

        // Check if limit exceeded
        if (validTimestamps.length >= this.maxMessages) {
            console.warn(`⚠️ Socket rate limit exceeded for user: ${userId}`);
            return false; // Limit exceeded
        }

        // Add current timestamp
        validTimestamps.push(now);
        this.messageTimestamps.set(userId, validTimestamps);

        return true; // Within limit
    }

    /**
     * Clean up old entries
     */
    cleanup() {
        const now = Date.now();
        for (const [userId, timestamps] of this.messageTimestamps.entries()) {
            const validTimestamps = timestamps.filter(ts => now - ts < this.windowMs);
            if (validTimestamps.length === 0) {
                this.messageTimestamps.delete(userId);
            } else {
                this.messageTimestamps.set(userId, validTimestamps);
            }
        }
    }

    /**
     * Start cleanup interval
     */
    startCleanup(intervalMs: number = 60000) {
        setInterval(() => this.cleanup(), intervalMs);
    }
}

// Export singleton instance for socket rate limiting
export const socketRateLimiter = new SocketRateLimiter(10, 60000);
socketRateLimiter.startCleanup();
