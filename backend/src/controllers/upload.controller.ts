import { Request, Response } from 'express';
import { uploadFile } from '../utils/fileStorage';

/**
 * Upload file for chat
 */
export const uploadChatFile = async (req: Request, res: Response) => {
    try {
        // Check if file exists
        if (!req.file) {
            return res.status(400).json({
                success: false,
                error: 'No file uploaded',
            });
        }

        const { conversationId } = req.body;
        const userId = (req as any).user.userId;

        if (!conversationId) {
            return res.status(400).json({
                success: false,
                error: 'Conversation ID is required',
            });
        }

        // TODO: Verify user has access to this conversation
        // This should check if the user is a participant

        // Upload file
        const result = await uploadFile(
            req.file.buffer,
            req.file.originalname,
            req.file.mimetype
        );

        console.log(`📎 File uploaded by ${userId} for conversation ${conversationId}`);

        res.status(200).json({
            success: true,
            data: {
                url: result.url,
                thumbnailUrl: result.thumbnailUrl,
                metadata: {
                    fileName: result.fileName,
                    fileSize: result.fileSize,
                    fileType: result.fileType,
                },
            },
        });
    } catch (error) {
        console.error('❌ Error uploading file:', error);

        const errorMessage = error instanceof Error ? error.message : 'Failed to upload file';

        res.status(500).json({
            success: false,
            error: errorMessage,
        });
    }
};
