
import express from 'express';
import {
    getConversations,
    getMessages,
    createConversation,
    sendMessage,
    editMessage,
    deleteMessage,
    deleteConversation,
} from '../controllers/chat.controller';
import { uploadChatFile } from '../controllers/upload.controller';
import { authenticateRequest } from '../middleware/auth.middleware';
import { upload, handleMulterError } from '../middleware/upload.middleware';
import {
    messageSendLimiter,
    conversationCreateLimiter,
    fileUploadLimiter,
    apiLimiter,
} from '../middleware/rateLimiter.middleware';
import {
    validateBody,
    createConversationSchema,
    messageContentSchema,
    editMessageSchema,
} from '../validators/chat.validators';

const router = express.Router();
router.use(authenticateRequest);
router.use(apiLimiter); // Apply general rate limit to all chat endpoints

// Conversation routes
router.get('/conversations', getConversations);
router.post('/conversations', conversationCreateLimiter, validateBody(createConversationSchema), createConversation);
router.delete('/conversations/:id', deleteConversation);
router.get('/conversations/:id/messages', getMessages);
router.post('/conversations/:id/messages', messageSendLimiter, validateBody(messageContentSchema), sendMessage);

// Message routes
router.put('/messages/:id', validateBody(editMessageSchema), editMessage);
router.delete('/messages/:id', deleteMessage);

// File upload route
router.post('/upload', fileUploadLimiter, upload.single('file'), handleMulterError, uploadChatFile);

export default router;

