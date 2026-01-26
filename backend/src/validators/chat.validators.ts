import { z } from 'zod';
import { Request, Response, NextFunction } from 'express';

/**
 * Zod validation schemas for chat API endpoints
 */

// Message content schema
export const messageContentSchema = z.object({
    content: z.string()
        .min(1, 'Message cannot be empty')
        .max(10000, 'Message too long (max 10000 characters)')
        .trim(),
    type: z.enum(['text', 'image', 'file']).optional().default('text'),
});

// Create conversation schema
export const createConversationSchema = z.object({
    otherUserId: z.string().min(1, 'Other user ID is required'),
    propertyId: z.string().optional(),
    propertyTitle: z.string().optional(),
    initialMessage: z.string().max(10000).optional(),
});

// Edit message schema
export const editMessageSchema = z.object({
    content: z.string()
        .min(1, 'Message content is required')
        .max(10000, 'Message too long (max 10000 characters)')
        .trim(),
});

// Conversation ID param schema
export const conversationIdSchema = z.string().min(1, 'Conversation ID is required');

// Message ID param schema
export const messageIdSchema = z.string().min(1, 'Message ID is required');

/**
 * Validation middleware factory
 */
export function validateBody(schema: z.ZodSchema) {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const validated = await schema.parseAsync(req.body);
            (req as any).body = validated;
            next();
        } catch (error) {
            if (error instanceof z.ZodError) {
                return res.status(400).json({
                    success: false,
                    error: 'Validation error',
                    details: error.issues.map((err: any) => ({
                        field: err.path.join('.'),
                        message: err.message,
                    })),
                });
            }
            next(error);
        }
    };
}

export function validateParams(schema: z.ZodSchema) {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const validated = await schema.parseAsync(req.params);
            (req as any).params = validated;
            next();
        } catch (error) {
            if (error instanceof z.ZodError) {
                return res.status(400).json({
                    success: false,
                    error: 'Invalid parameters',
                    details: error.issues.map((err: any) => ({
                        field: err.path.join('.'),
                        message: err.message,
                    })),
                });
            }
            next(error);
        }
    };
}
