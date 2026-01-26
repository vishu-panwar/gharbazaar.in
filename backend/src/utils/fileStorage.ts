import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';

/**
 * File Storage Utility
 * Handles file uploads with support for both local storage and cloud storage (Cloudinary)
 */

// Allowed file types for chat uploads
export const ALLOWED_FILE_TYPES = {
    images: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    documents: [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'text/plain',
    ],
};

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

/**
 * Validate file type
 */
export function isValidFileType(mimetype: string): boolean {
    const allAllowedTypes = [...ALLOWED_FILE_TYPES.images, ...ALLOWED_FILE_TYPES.documents];
    return allAllowedTypes.includes(mimetype);
}

/**
 * Validate file size
 */
export function isValidFileSize(size: number): boolean {
    return size <= MAX_FILE_SIZE;
}

/**
 * Get file type category
 */
export function getFileTypeCategory(mimetype: string): 'image' | 'document' | 'unknown' {
    if (ALLOWED_FILE_TYPES.images.includes(mimetype)) return 'image';
    if (ALLOWED_FILE_TYPES.documents.includes(mimetype)) return 'document';
    return 'unknown';
}

/**
 * Generate unique filename
 */
export function generateUniqueFilename(originalFilename: string): string {
    const ext = path.extname(originalFilename);
    const uniqueId = uuidv4();
    const timestamp = Date.now();
    return `${timestamp}-${uniqueId}${ext}`;
}

/**
 * Get upload directory path
 */
export function getUploadDir(): string {
    const uploadDir = process.env.UPLOAD_DIR || path.join(__dirname, '../../uploads');

    // Ensure directory exists
    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
    }

    return uploadDir;
}

/**
 * Save file locally (fallback when cloud storage is not configured)
 */
export async function saveFileLocally(
    fileBuffer: Buffer,
    filename: string,
    mimetype: string
): Promise<{ url: string; path: string }> {
    const uploadDir = getUploadDir();
    const filePath = path.join(uploadDir, filename);

    // Write file to disk
    await fs.promises.writeFile(filePath, fileBuffer);

    // Return relative URL (will be served by Express static middleware)
    const url = `/uploads/${filename}`;

    return { url, path: filePath };
}

/**
 * Upload file to Cloudinary (if configured)
 */
export async function uploadToCloudinary(
    fileBuffer: Buffer,
    filename: string,
    mimetype: string
): Promise<{ url: string; publicId: string; thumbnailUrl?: string }> {
    // Check if Cloudinary is configured
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
        throw new Error('Cloudinary not configured');
    }

    // Import cloudinary dynamically
    const cloudinary = require('cloudinary').v2;

    cloudinary.config({
        cloud_name: cloudName,
        api_key: apiKey,
        api_secret: apiSecret,
    });

    // Upload to Cloudinary
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder: 'chat-uploads',
                resource_type: 'auto',
                public_id: path.parse(filename).name,
            },
            (error: any, result: any) => {
                if (error) {
                    reject(error);
                } else {
                    const response: any = {
                        url: result.secure_url,
                        publicId: result.public_id,
                    };

                    // Generate thumbnail URL for images
                    if (getFileTypeCategory(mimetype) === 'image') {
                        response.thumbnailUrl = cloudinary.url(result.public_id, {
                            width: 400,
                            height: 400,
                            crop: 'limit',
                            quality: 'auto',
                            fetch_format: 'auto',
                        });
                    }

                    resolve(response);
                }
            }
        );

        uploadStream.end(fileBuffer);
    });
}

/**
 * Main file upload handler
 * Tries Cloudinary first, falls back to local storage
 */
export async function uploadFile(
    fileBuffer: Buffer,
    originalFilename: string,
    mimetype: string
): Promise<{
    url: string;
    thumbnailUrl?: string;
    fileName: string;
    fileSize: number;
    fileType: 'image' | 'document' | 'unknown';
    storage: 'cloudinary' | 'local';
}> {
    // Validate file
    if (!isValidFileType(mimetype)) {
        throw new Error('Invalid file type. Allowed: images and documents only.');
    }

    if (!isValidFileSize(fileBuffer.length)) {
        throw new Error(`File too large. Maximum size: ${MAX_FILE_SIZE / (1024 * 1024)}MB`);
    }

    const uniqueFilename = generateUniqueFilename(originalFilename);
    const fileType = getFileTypeCategory(mimetype);

    try {
        // Try Cloudinary first
        const cloudinaryResult = await uploadToCloudinary(fileBuffer, uniqueFilename, mimetype);

        console.log(`✅ File uploaded to Cloudinary: ${uniqueFilename}`);

        return {
            url: cloudinaryResult.url,
            thumbnailUrl: cloudinaryResult.thumbnailUrl,
            fileName: originalFilename,
            fileSize: fileBuffer.length,
            fileType,
            storage: 'cloudinary',
        };
    } catch (cloudinaryError) {
        // Fallback to local storage
        console.warn('⚠️ Cloudinary upload failed, using local storage:', cloudinaryError);

        const localResult = await saveFileLocally(fileBuffer, uniqueFilename, mimetype);

        return {
            url: localResult.url,
            fileName: originalFilename,
            fileSize: fileBuffer.length,
            fileType,
            storage: 'local',
        };
    }
}

/**
 * Delete file from storage
 */
export async function deleteFile(url: string, storage: 'cloudinary' | 'local'): Promise<void> {
    if (storage === 'cloudinary') {
        // Extract public_id from URL and delete from Cloudinary
        const cloudinary = require('cloudinary').v2;
        const publicId = url.split('/').slice(-2).join('/').split('.')[0];
        await cloudinary.uploader.destroy(publicId);
    } else {
        // Delete from local storage
        const filename = path.basename(url);
        const filePath = path.join(getUploadDir(), filename);
        if (fs.existsSync(filePath)) {
            await fs.promises.unlink(filePath);
        }
    }
}
