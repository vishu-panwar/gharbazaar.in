
import { Request, Response } from 'express';
import Conversation from '../models/conversation.model';
import Message from '../models/message.model';
import { isMongoDBAvailable, memoryConversations, memoryMessages } from '../utils/memoryStore';
import { v4 as uuidv4 } from 'uuid';
import { sanitizeMessage, isSpam } from '../utils/sanitization';
export const getConversations = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.userId;

        let conversations = [];
        if (isMongoDBAvailable()) {
            conversations = await Conversation.find({
                participants: userId
            })
                .sort({ lastMessageAt: -1 })  // Most recent first
                .limit(50);  // Limit to last 50 conversations
        } else {
            conversations = Array.from(memoryConversations.values())
                .filter((c: any) => c.participants.includes(userId))
                .sort((a: any, b: any) => b.lastMessageAt - a.lastMessageAt)
                .slice(0, 50);
        }

        console.log(`📋 Fetched ${conversations.length} conversations for user ${userId}${!isMongoDBAvailable() ? ' (Memory Mode)' : ''}`);

        res.json({
            success: true,
            data: { conversations }
        });

    } catch (error) {
        console.error('❌ Error fetching conversations:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch conversations'
        });
    }
};
export const getMessages = async (req: Request, res: Response) => {
    try {
        const { id: conversationId } = req.params;
        const limit = parseInt(req.query.limit as string) || 50;
        const skip = parseInt(req.query.skip as string) || 0;
        const userId = (req as any).user.userId;
        let conversation;
        if (isMongoDBAvailable()) {
            conversation = await Conversation.findById(conversationId);
        } else {
            conversation = memoryConversations.get(conversationId);
        }

        if (!conversation) {
            return res.status(404).json({
                success: false,
                error: 'Conversation not found'
            });
        }

        if (!conversation.participants.includes(userId)) {
            return res.status(403).json({
                success: false,
                error: 'Not authorized to view this conversation'
            });
        }
        let messages = [];
        if (isMongoDBAvailable()) {
            messages = await Message.find({
                conversationId,
                deleted: false  // Don't include deleted messages
            })
                .sort({ createdAt: 1 })  // Oldest first (chronological order)
                .skip(skip)
                .limit(limit);
        } else {
            messages = (memoryMessages.get(conversationId) || [])
                .filter((m: any) => !m.deleted)
                .sort((a: any, b: any) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
                .slice(skip, skip + limit);
        }

        console.log(`💬 Fetched ${messages.length} messages from conversation ${conversationId}${!isMongoDBAvailable() ? ' (Memory Mode)' : ''}`);

        res.json({
            success: true,
            data: { messages }
        });

    } catch (error) {
        console.error('❌ Error fetching messages:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch messages'
        });
    }
};
export const createConversation = async (req: Request, res: Response) => {
    try {
        const { otherUserId, propertyId, propertyTitle, initialMessage } = req.body;
        const userId = (req as any).user.userId;
        const userEmail = (req as any).user.email;

        // Sanitize initial message if provided
        const sanitizedMessage = initialMessage ? sanitizeMessage(initialMessage) : undefined;
        let conversation;
        if (isMongoDBAvailable()) {
            conversation = await Conversation.findOne({
                participants: { $all: [userId, otherUserId] },
                propertyId
            });
        } else {
            conversation = Array.from(memoryConversations.values()).find((c: any) =>
                c.participants.includes(userId) &&
                c.participants.includes(otherUserId) &&
                c.propertyId === propertyId
            );
        }
        if (!conversation) {
            if (isMongoDBAvailable()) {
                conversation = await Conversation.create({
                    participants: [userId, otherUserId],
                    propertyId,
                    propertyTitle,
                    lastMessage: sanitizedMessage || '',
                    lastMessageAt: new Date(),
                });
            } else {
                const conversationId = uuidv4();
                conversation = {
                    _id: conversationId,
                    participants: [userId, otherUserId],
                    propertyId,
                    propertyTitle,
                    lastMessage: sanitizedMessage || '',
                    lastMessageAt: new Date(),
                };
                memoryConversations.set(conversationId, conversation);
            }

            console.log(`✅ New conversation created: ${isMongoDBAvailable() ? conversation._id : conversation._id}${!isMongoDBAvailable() ? ' (Memory Mode)' : ''}`);
        }
        if (sanitizedMessage) {
            if (isMongoDBAvailable()) {
                await Message.create({
                    conversationId: conversation._id,
                    senderId: userId,
                    senderEmail: userEmail,
                    content: sanitizedMessage,
                    type: 'text',
                    read: false,
                });
            } else {
                const messageId = uuidv4();
                const createdAt = new Date();
                const message = {
                    _id: messageId,
                    conversationId: conversation._id,
                    senderId: userId,
                    senderEmail: userEmail,
                    content: sanitizedMessage,
                    type: 'text',
                    read: false,
                    createdAt: createdAt.toISOString()
                };
                if (!memoryMessages.has(conversation._id)) {
                    memoryMessages.set(conversation._id, []);
                }
                memoryMessages.get(conversation._id).push(message);
            }
        }

        res.status(201).json({
            success: true,
            data: { conversation }
        });

    } catch (error) {
        console.error('❌ Error creating conversation:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to create conversation'
        });
    }
};
export const sendMessage = async (req: Request, res: Response) => {
    try {
        const { id: conversationId } = req.params;
        const { content, type = 'text' } = req.body;
        const userId = (req as any).user.userId;
        const userEmail = (req as any).user.email;

        // Sanitize message content
        const sanitizedContent = sanitizeMessage(content);

        // Check for spam
        if (isSpam(sanitizedContent)) {
            return res.status(400).json({
                success: false,
                error: 'Message appears to be spam'
            });
        }
        let conversation;
        if (isMongoDBAvailable()) {
            conversation = await Conversation.findById(conversationId);
        } else {
            conversation = memoryConversations.get(conversationId);
        }

        if (!conversation) {
            return res.status(404).json({
                success: false,
                error: 'Conversation not found'
            });
        }

        if (!conversation.participants.includes(userId)) {
            return res.status(403).json({
                success: false,
                error: 'Not authorized'
            });
        }

        let message;
        if (isMongoDBAvailable()) {
            message = await Message.create({
                conversationId,
                senderId: userId,
                senderEmail: userEmail,
                content: sanitizedContent,
                type,
                read: false,
            });
            await Conversation.findByIdAndUpdate(conversationId, {
                lastMessage: sanitizedContent.substring(0, 100),
                lastMessageAt: new Date(),
            });
        } else {
            const messageId = uuidv4();
            const createdAt = new Date();
            message = {
                _id: messageId,
                conversationId,
                senderId: userId,
                senderEmail: userEmail,
                content: sanitizedContent,
                type,
                read: false,
                createdAt: createdAt.toISOString()
            };

            if (!memoryMessages.has(conversationId)) {
                memoryMessages.set(conversationId, []);
            }
            memoryMessages.get(conversationId).push(message);
            conversation.lastMessage = sanitizedContent.substring(0, 100);
            conversation.lastMessageAt = createdAt;
        }

        res.status(201).json({
            success: true,
            data: { message }
        });

    } catch (error) {
        console.error('❌ Error sending message:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to send message'
        });
    }
};

export const editMessage = async (req: Request, res: Response) => {
    try {
        const { id: messageId } = req.params;
        const { content } = req.body;
        const userId = (req as any).user.userId;

        if (!content || !content.trim()) {
            return res.status(400).json({
                success: false,
                error: 'Message content is required'
            });
        }

        // Sanitize edited content
        const sanitizedContent = sanitizeMessage(content);

        // Check for spam
        if (isSpam(sanitizedContent)) {
            return res.status(400).json({
                success: false,
                error: 'Message appears to be spam'
            });
        }

        let message;
        if (isMongoDBAvailable()) {
            message = await Message.findById(messageId);
        } else {
            // Find message in memory store
            for (const [convId, messages] of memoryMessages.entries()) {
                const found = messages.find((m: any) => m._id === messageId);
                if (found) {
                    message = found;
                    break;
                }
            }
        }

        if (!message) {
            return res.status(404).json({
                success: false,
                error: 'Message not found'
            });
        }

        if (message.senderId !== userId) {
            return res.status(403).json({
                success: false,
                error: 'Not authorized to edit this message'
            });
        }

        if (isMongoDBAvailable()) {
            message.content = sanitizedContent;
            message.edited = true;
            await message.save();
        } else {
            message.content = sanitizedContent;
            message.edited = true;
        }

        console.log(`✏️ Message edited: ${messageId} by ${userId}`);

        res.json({
            success: true,
            data: { message }
        });

    } catch (error) {
        console.error('❌ Error editing message:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to edit message'
        });
    }
};

export const deleteMessage = async (req: Request, res: Response) => {
    try {
        const { id: messageId } = req.params;
        const userId = (req as any).user.userId;

        let message;
        if (isMongoDBAvailable()) {
            message = await Message.findById(messageId);
        } else {
            // Find message in memory store
            for (const [convId, messages] of memoryMessages.entries()) {
                const found = messages.find((m: any) => m._id === messageId);
                if (found) {
                    message = found;
                    break;
                }
            }
        }

        if (!message) {
            return res.status(404).json({
                success: false,
                error: 'Message not found'
            });
        }

        if (message.senderId !== userId) {
            return res.status(403).json({
                success: false,
                error: 'Not authorized to delete this message'
            });
        }

        if (isMongoDBAvailable()) {
            message.deleted = true;
            message.content = '[Message deleted]';
            await message.save();
        } else {
            message.deleted = true;
            message.content = '[Message deleted]';
        }

        console.log(`🗑️ Message deleted: ${messageId} by ${userId}`);

        res.json({
            success: true,
            data: { message }
        });

    } catch (error) {
        console.error('❌ Error deleting message:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to delete message'
        });
    }
};

export const deleteConversation = async (req: Request, res: Response) => {
    try {
        const { id: conversationId } = req.params;
        const userId = (req as any).user.userId;

        let conversation;
        if (isMongoDBAvailable()) {
            conversation = await Conversation.findById(conversationId);
        } else {
            conversation = memoryConversations.get(conversationId);
        }

        if (!conversation) {
            return res.status(404).json({
                success: false,
                error: 'Conversation not found'
            });
        }

        if (!conversation.participants.includes(userId)) {
            return res.status(403).json({
                success: false,
                error: 'Not authorized to delete this conversation'
            });
        }

        if (isMongoDBAvailable()) {
            // Delete all messages in the conversation
            await Message.deleteMany({ conversationId });
            // Delete the conversation
            await Conversation.findByIdAndDelete(conversationId);
        } else {
            // Delete from memory stores
            memoryMessages.delete(conversationId);
            memoryConversations.delete(conversationId);
        }

        console.log(`🗑️ Conversation deleted: ${conversationId} by ${userId}`);

        res.json({
            success: true,
            message: 'Conversation deleted successfully'
        });

    } catch (error) {
        console.error('❌ Error deleting conversation:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to delete conversation'
        });
    }
};
