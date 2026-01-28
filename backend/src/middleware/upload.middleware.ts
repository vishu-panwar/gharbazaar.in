import multer from 'multer';
import { Request } from 'express';
import { MAX_FILE_SIZE, ALLOWED_FILE_TYPES } from '../utils/fileStorage';

/**
 * Multer configuration for file uploads
 */

// Use memory storage (files stored in buffer, not disk)
const storage = multer.memoryStorage();

// File filter to validate file types
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    const allAllowedTypes = [...ALLOWED_FILE_TYPES.images, ...ALLOWED_FILE_TYPES.documents];

    if (allAllowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only images and documents are allowed.'));
    }
};

// Multer instance
export const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: MAX_FILE_SIZE,
        files: 1, // Only one file at a time
    },
});

/**
 * Error handler for multer errors
 */
export function handleMulterError(error: any, req: Request, res: any, next: any) {
    if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                success: false,
                error: `File too large. Maximum size: ${MAX_FILE_SIZE / (1024 * 1024)}MB`,
            });
        }

        if (error.code === 'LIMIT_FILE_COUNT') {
            return res.status(400).json({
                success: false,
                error: 'Too many files. Only one file allowed per upload.',
            });
        }

        return res.status(400).json({
            success: false,
            error: `Upload error: ${error.message}`,
        });
    }

    if (error) {
        return res.status(400).json({
            success: false,
            error: error.message || 'File upload failed',
        });
    }

    next();
}
