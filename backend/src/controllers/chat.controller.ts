import { Request, Response } from 'express';
import { prisma } from '../utils/prisma';
import { sanitizeMessage, isSpam } from '../utils/sanitization';

// Helper to sanitize HTML content for snippets
const getSnippet = (text: string) => text.replace(/<[^>]*>?/gm, '').substring(0, 100);

export const getConversations = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.userId || (req as any).user?.id;
        if (!userId) {
            return res.status(401).json({ success: false, error: 'Unauthorized' });
        }

        const conversations = await prisma.conversation.findMany({
            where: {
                participants: {
                    some: {
                        user: {
                            OR: [
                                { id: userId },
                                { uid: userId }
                            ]
                        }
                    }
                }
            },
            include: {
                participants: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                uid: true,
                                name: true,
                                email: true,
                                profilePhoto: true
                            }
                        }
                    }
                }
            },
            orderBy: {
                lastMessageAt: 'desc'
            },
            take: 50
        });

        console.log(`📋 Fetched ${conversations.length} conversations for user ${userId}`);

        res.json({
            success: true,
            data: { conversations }
        });

    } catch (error: any) {
        console.error('❌ Error fetching conversations:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch conversations',
            details: error.message
        });
    }
};

export const getMessages = async (req: Request, res: Response) => {
    try {
        const { id: conversationId } = req.params;
        const limit = parseInt(req.query.limit as string) || 50;
        const skip = parseInt(req.query.skip as string) || 0;
        const userId = (req as any).user?.userId || (req as any).user?.id;

        const conversation = await prisma.conversation.findUnique({
            where: { id: conversationId },
            include: {
                participants: {
                    include: {
                        user: { select: { id: true, uid: true } }
                    }
                }
            }
        });

        if (!conversation) {
            return res.status(404).json({
                success: false,
                error: 'Conversation not found'
            });
        }

        const isParticipant = conversation.participants.some((p: any) => p.user.id === userId || p.user.uid === userId);
        if (!isParticipant) {
            return res.status(403).json({
                success: false,
                error: 'Not authorized to view this conversation'
            });
        }

        const messages = await prisma.message.findMany({
            where: {
                conversationId,
                isDeleted: false
            },
            include: {
                sender: {
                    select: {
                        id: true,
                        name: true,
                        profilePhoto: true
                    }
                }
            },
            orderBy: {
                createdAt: 'asc'
            },
            skip: skip,
            take: limit
        });

        console.log(`💬 Fetched ${messages.length} messages from conversation ${conversationId}`);

        res.json({
            success: true,
            data: { messages }
        });

    } catch (error: any) {
        console.error('❌ Error fetching messages:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch messages',
            details: error.message
        });
    }
};

export const createConversation = async (req: Request, res: Response) => {
    try {
        const { otherUserId, propertyId, propertyTitle, initialMessage } = req.body;
        const userId = (req as any).user?.userId || (req as any).user?.id;

        if (!otherUserId) {
            return res.status(400).json({ success: false, error: 'Recipient ID is required' });
        }

        // Sanitize initial message if provided
        const sanitizedMessage = initialMessage ? sanitizeMessage(initialMessage) : undefined;

        // Check for existing conversation with these participants and property
        let conversation = await prisma.conversation.findFirst({
            where: {
                AND: [
                    { participants: { some: { user: { OR: [{ id: userId }, { uid: userId }] } } } },
                    { participants: { some: { user: { OR: [{ id: otherUserId }, { uid: otherUserId }] } } } },
                    { propertyId: propertyId || null }
                ]
            },
            include: {
                participants: {
                    include: { user: true }
                }
            }
        });

        if (!conversation) {
            // Find both users in DB
            const users = await prisma.user.findMany({
                where: {
                    OR: [
                        { id: userId }, { uid: userId },
                        { id: otherUserId }, { uid: otherUserId }
                    ]
                }
            });

            if (users.length < 2 && userId !== otherUserId) {
                return res.status(404).json({ success: false, error: 'One or more users not found' });
            }

            conversation = await prisma.conversation.create({
                data: {
                    propertyId: propertyId || null,
                    propertyTitle: propertyTitle || null,
                    lastMessage: sanitizedMessage || '',
                    lastMessageAt: new Date(),
                    participants: {
                        create: users.map(u => ({
                            user: { connect: { id: u.id } }
                        }))
                    }
                },
                include: {
                    participants: {
                        include: { user: true }
                    }
                }
            });

            console.log(`✅ New conversation created: ${conversation.id}`);
        }

        if (sanitizedMessage) {
            // Get actual user record for foreign key
            const currentUser = await prisma.user.findFirst({
                where: { OR: [{ id: userId }, { uid: userId }] }
            });

            if (currentUser) {
                await prisma.message.create({
                    data: {
                        conversationId: conversation.id,
                        senderId: currentUser.id,
                        content: sanitizedMessage,
                        messageType: 'text',
                        isRead: false
                    }
                });

                // Update last message in conversation
                await prisma.conversation.update({
                    where: { id: conversation.id },
                    data: {
                        lastMessage: getSnippet(sanitizedMessage),
                        lastMessageAt: new Date()
                    }
                });
            }
        }

        res.status(201).json({
            success: true,
            data: { conversation }
        });

    } catch (error: any) {
        console.error('❌ Error creating conversation:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to create conversation',
            details: error.message
        });
    }
};

export const sendMessage = async (req: Request, res: Response) => {
    try {
        const { id: conversationId } = req.params;
        const { content, type = 'text', fileUrl, fileName, fileSize } = req.body;
        const userId = (req as any).user?.userId || (req as any).user?.id;

        // Sanitize message content
        const sanitizedData = sanitizeMessage(content || '');

        // Check for spam
        if (type === 'text' && isSpam(sanitizedData)) {
            return res.status(400).json({
                success: false,
                error: 'Message appears to be spam'
            });
        }

        const conversation = await prisma.conversation.findUnique({
            where: { id: conversationId },
            include: {
                participants: {
                    include: { user: { select: { id: true, uid: true } } }
                }
            }
        });

        if (!conversation) {
            return res.status(404).json({
                success: false,
                error: 'Conversation not found'
            });
        }

        const isParticipant = conversation.participants.some((p: any) => p.user.id === userId || p.user.uid === userId);
        if (!isParticipant) {
            return res.status(403).json({
                success: false,
                error: 'Not authorized'
            });
        }

        // Get actual user record for foreign key
        const user = await prisma.user.findFirst({
            where: { OR: [{ id: userId }, { uid: userId }] }
        });

        if (!user) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }

        const message = await prisma.message.create({
            data: {
                conversationId,
                senderId: user.id,
                content: sanitizedData,
                messageType: type,
                fileUrl,
                fileName,
                fileSize: fileSize ? parseInt(fileSize) : undefined,
                isRead: false
            }
        });

        await prisma.conversation.update({
            where: { id: conversationId },
            data: {
                lastMessage: type === 'text' ? getSnippet(sanitizedData) : `[${type}]`,
                lastMessageAt: new Date()
            }
        });

        res.status(201).json({
            success: true,
            data: { message }
        });

    } catch (error: any) {
        console.error('❌ Error sending message:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to send message',
            details: error.message
        });
    }
};

export const editMessage = async (req: Request, res: Response) => {
    try {
        const { id: messageId } = req.params;
        const { content } = req.body;
        const userId = (req as any).user?.userId || (req as any).user?.id;

        if (!content || !content.trim()) {
            return res.status(400).json({
                success: false,
                error: 'Message content is required'
            });
        }

        const sanitizedData = sanitizeMessage(content);

        if (isSpam(sanitizedData)) {
            return res.status(400).json({
                success: false,
                error: 'Message appears to be spam'
            });
        }

        const message = await prisma.message.findUnique({
            where: { id: messageId },
            include: { sender: { select: { id: true, uid: true } } }
        });

        if (!message) {
            return res.status(404).json({
                success: false,
                error: 'Message not found'
            });
        }

        if (message.sender.id !== userId && message.sender.uid !== userId) {
            return res.status(403).json({
                success: false,
                error: 'Not authorized to edit this message'
            });
        }

        const updatedMessage = await prisma.message.update({
            where: { id: messageId },
            data: {
                content: sanitizedData,
                isEdited: true
            }
        });

        console.log(`✏️ Message edited: ${messageId} by ${userId}`);

        res.json({
            success: true,
            data: { message: updatedMessage }
        });

    } catch (error: any) {
        console.error('❌ Error editing message:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to edit message',
            details: error.message
        });
    }
};

export const deleteMessage = async (req: Request, res: Response) => {
    try {
        const { id: messageId } = req.params;
        const userId = (req as any).user?.userId || (req as any).user?.id;

        const message = await prisma.message.findUnique({
            where: { id: messageId },
            include: { sender: { select: { id: true, uid: true } } }
        });

        if (!message) {
            return res.status(404).json({
                success: false,
                error: 'Message not found'
            });
        }

        if (message.sender.id !== userId && message.sender.uid !== userId) {
            return res.status(403).json({
                success: false,
                error: 'Not authorized to delete this message'
            });
        }

        const updatedMessage = await prisma.message.update({
            where: { id: messageId },
            data: {
                isDeleted: true,
                content: '[Message deleted]'
            }
        });

        console.log(`🗑️ Message deleted: ${messageId} by ${userId}`);

        res.json({
            success: true,
            data: { message: updatedMessage }
        });

    } catch (error: any) {
        console.error('❌ Error deleting message:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to delete message',
            details: error.message
        });
    }
};

export const deleteConversation = async (req: Request, res: Response) => {
    try {
        const { id: conversationId } = req.params;
        const userId = (req as any).user?.userId || (req as any).user?.id;

        const conversation = await prisma.conversation.findUnique({
            where: { id: conversationId },
            include: {
                participants: {
                    include: { user: { select: { id: true, uid: true } } }
                }
            }
        });

        if (!conversation) {
            return res.status(404).json({
                success: false,
                error: 'Conversation not found'
            });
        }

        const isParticipant = conversation.participants.some((p: any) => p.user.id === userId || p.user.uid === userId);
        if (!isParticipant) {
            return res.status(403).json({
                success: false,
                error: 'Not authorized to delete this conversation'
            });
        }

        // Delete conversation (cascade will handle messages)
        await prisma.conversation.delete({
            where: { id: conversationId }
        });

        console.log(`🗑️ Conversation deleted: ${conversationId} by ${userId}`);

        res.json({
            success: true,
            message: 'Conversation deleted successfully'
        });

    } catch (error: any) {
        console.error('❌ Error deleting conversation:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to delete conversation',
            details: error.message
        });
    }
};
