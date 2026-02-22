import { Request, Response } from 'express';
import { prisma } from '../utils/database';
import { sanitizeMessage, isSpam } from '../utils/sanitization';

const UUID_REGEX =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const getSnippet = (text: string) => text.replace(/<[^>]*>?/gm, '').substring(0, 100);

const resolveUserByUidOrId = async (identifier?: string | null) => {
    const value = (identifier || '').trim();
    if (!value) return null;

    const byUid = await prisma.user.findUnique({
        where: { uid: value },
        select: { id: true, uid: true, name: true, email: true, profilePhoto: true, role: true },
    });
    if (byUid) return byUid;

    if (!UUID_REGEX.test(value)) return null;

    return prisma.user.findUnique({
        where: { id: value },
        select: { id: true, uid: true, name: true, email: true, profilePhoto: true, role: true },
    });
};

const resolveConversationType = (
    requestedType: string | undefined,
    currentUserRole?: string | null,
    otherUserRole?: string | null
) => {
    const requested = String(requestedType || '').trim().toLowerCase();
    if (requested === 'support') return 'support-ticket';
    if (requested === 'service-buyer') return 'service-buyer';

    if (requested === 'direct') {
        const roles = [currentUserRole, otherUserRole].map((role) => String(role || '').toLowerCase());
        if (roles.includes('service_partner')) return 'service-buyer';
    }

    return 'buyer-seller';
};

const mapMessage = (message: any) => ({
    id: message.id,
    conversationId: message.conversationId,
    senderId: message.sender?.uid || message.senderId,
    senderEmail: message.sender?.email || '',
    senderName: message.sender?.name || '',
    senderPhoto: message.sender?.profilePhoto || null,
    content: message.content,
    type: message.messageType || 'text',
    read: Boolean(message.isRead),
    edited: Boolean(message.isEdited),
    deleted: Boolean(message.isDeleted),
    fileUrl: message.fileUrl || null,
    fileName: message.fileName || null,
    fileSize: message.fileSize || null,
    createdAt: message.createdAt,
    updatedAt: message.updatedAt,
});

const mapConversation = (conversation: any, currentUserInternalId: string, unreadCount: number) => {
    const otherParticipant = (conversation.participants || []).find(
        (p: any) => p.userId !== currentUserInternalId
    );

    const otherUser = otherParticipant?.user
        ? {
              id: otherParticipant.user.uid || otherParticipant.user.id,
              name: otherParticipant.user.name || 'User',
              email: otherParticipant.user.email || '',
              avatar: otherParticipant.user.profilePhoto || undefined,
              onlineStatus: 'offline',
          }
        : {
              id: '',
              name: 'Unknown User',
              email: '',
              avatar: undefined,
              onlineStatus: 'offline',
          };

    return {
        id: conversation.id,
        type: conversation.conversationType,
        conversationType: conversation.conversationType,
        propertyId: conversation.propertyId,
        propertyTitle: conversation.propertyTitle,
        lastMessage: conversation.lastMessage || '',
        lastMessageAt: conversation.lastMessageAt,
        participants: conversation.participants.map((p: any) => p.user?.uid || p.userId),
        otherUser,
        unreadCount,
        createdAt: conversation.createdAt,
        updatedAt: conversation.updatedAt,
    };
};

const ensureParticipant = async (conversationId: string, userInternalId: string) => {
    return prisma.conversationParticipant.findUnique({
        where: {
            conversationId_userId: {
                conversationId,
                userId: userInternalId,
            },
        },
    });
};

export const getConversations = async (req: Request, res: Response) => {
    try {
        const userIdentifier = (req as any).user?.userId || (req as any).user?.id;
        const currentUser = await resolveUserByUidOrId(userIdentifier);
        if (!currentUser) {
            return res.status(401).json({ success: false, error: 'Unauthorized' });
        }

        const conversations = await prisma.conversation.findMany({
            where: {
                participants: {
                    some: { userId: currentUser.id },
                },
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
                                profilePhoto: true,
                            },
                        },
                    },
                },
            },
            orderBy: { lastMessageAt: 'desc' },
            take: 50,
        });

        const conversationIds = conversations.map((c) => c.id);
        const unreadGroups = conversationIds.length
            ? await prisma.message.groupBy({
                  by: ['conversationId'],
                  where: {
                      conversationId: { in: conversationIds },
                      isDeleted: false,
                      isRead: false,
                      senderId: { not: currentUser.id },
                  },
                  _count: { _all: true },
              })
            : [];

        const unreadMap = new Map(unreadGroups.map((item) => [item.conversationId, item._count._all]));

        const mapped = conversations.map((conversation) =>
            mapConversation(conversation, currentUser.id, unreadMap.get(conversation.id) || 0)
        );

        res.json({
            success: true,
            data: { conversations: mapped },
        });
    } catch (error: any) {
        console.error('Error fetching conversations:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch conversations',
            details: error.message,
        });
    }
};

export const getMessages = async (req: Request, res: Response) => {
    try {
        const { id: conversationId } = req.params;
        const limit = parseInt(req.query.limit as string, 10) || 50;
        const skip = parseInt(req.query.skip as string, 10) || 0;

        const userIdentifier = (req as any).user?.userId || (req as any).user?.id;
        const currentUser = await resolveUserByUidOrId(userIdentifier);
        if (!currentUser) {
            return res.status(401).json({ success: false, error: 'Unauthorized' });
        }

        const conversation = await prisma.conversation.findUnique({ where: { id: conversationId } });
        if (!conversation) {
            return res.status(404).json({ success: false, error: 'Conversation not found' });
        }

        const participant = await ensureParticipant(conversationId, currentUser.id);
        if (!participant) {
            return res.status(403).json({ success: false, error: 'Not authorized to view this conversation' });
        }

        const messages = await prisma.message.findMany({
            where: { conversationId, isDeleted: false },
            include: {
                sender: {
                    select: {
                        id: true,
                        uid: true,
                        email: true,
                        name: true,
                        profilePhoto: true,
                    },
                },
            },
            orderBy: { createdAt: 'asc' },
            skip,
            take: limit,
        });

        await prisma.message.updateMany({
            where: {
                conversationId,
                senderId: { not: currentUser.id },
                isRead: false,
            },
            data: { isRead: true },
        });

        await prisma.conversationParticipant.update({
            where: {
                conversationId_userId: {
                    conversationId,
                    userId: currentUser.id,
                },
            },
            data: { lastReadAt: new Date() },
        }).catch(() => null);

        res.json({
            success: true,
            data: { messages: messages.map(mapMessage) },
        });
    } catch (error: any) {
        console.error('Error fetching messages:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch messages',
            details: error.message,
        });
    }
};

export const createConversation = async (req: Request, res: Response) => {
    try {
        const { otherUserId, propertyId, propertyTitle, initialMessage, type } = req.body;
        const userIdentifier = (req as any).user?.userId || (req as any).user?.id;

        const currentUser = await resolveUserByUidOrId(userIdentifier);
        const otherUser = await resolveUserByUidOrId(otherUserId);

        if (!currentUser || !otherUser) {
            return res.status(404).json({ success: false, error: 'One or more users not found' });
        }

        if (currentUser.id === otherUser.id) {
            return res.status(400).json({ success: false, error: 'Cannot create conversation with yourself' });
        }

        const sanitizedMessage = initialMessage ? sanitizeMessage(initialMessage) : undefined;
        const conversationType = resolveConversationType(type, currentUser.role, otherUser.role);

        const existingConversations = await prisma.conversation.findMany({
            where: {
                conversationType,
                propertyId: propertyId || null,
                participants: {
                    some: {
                        userId: { in: [currentUser.id, otherUser.id] },
                    },
                },
            },
            include: {
                participants: {
                    include: {
                        user: {
                            select: { id: true, uid: true, name: true, email: true, profilePhoto: true },
                        },
                    },
                },
            },
            orderBy: { updatedAt: 'desc' },
        });

        let conversation = existingConversations.find((conv: any) => {
            const ids = new Set(conv.participants.map((p: any) => p.userId));
            return ids.has(currentUser.id) && ids.has(otherUser.id) && ids.size === 2;
        });

        if (!conversation) {
            conversation = await prisma.conversation.create({
                data: {
                    conversationType,
                    propertyId: propertyId || null,
                    propertyTitle: propertyTitle || null,
                    lastMessage: sanitizedMessage || '',
                    lastMessageAt: new Date(),
                    participants: {
                        create: [
                            { user: { connect: { id: currentUser.id } } },
                            { user: { connect: { id: otherUser.id } } },
                        ],
                    },
                },
                include: {
                    participants: {
                        include: {
                            user: {
                                select: { id: true, uid: true, name: true, email: true, profilePhoto: true },
                            },
                        },
                    },
                },
            });
        }

        if (sanitizedMessage) {
            await prisma.message.create({
                data: {
                    conversationId: conversation.id,
                    senderId: currentUser.id,
                    content: sanitizedMessage,
                    messageType: 'text',
                    isRead: false,
                },
            });

            await prisma.conversation.update({
                where: { id: conversation.id },
                data: {
                    lastMessage: getSnippet(sanitizedMessage),
                    lastMessageAt: new Date(),
                },
            });
        }

        const mapped = mapConversation(conversation, currentUser.id, 0);

        res.status(201).json({
            success: true,
            data: { conversation: mapped },
        });
    } catch (error: any) {
        console.error('Error creating conversation:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to create conversation',
            details: error.message,
        });
    }
};

export const sendMessage = async (req: Request, res: Response) => {
    try {
        const { id: conversationId } = req.params;
        const { content, type = 'text', fileUrl, fileName, fileSize } = req.body;
        const userIdentifier = (req as any).user?.userId || (req as any).user?.id;

        const currentUser = await resolveUserByUidOrId(userIdentifier);
        if (!currentUser) {
            return res.status(401).json({ success: false, error: 'Unauthorized' });
        }

        const participant = await ensureParticipant(conversationId, currentUser.id);
        if (!participant) {
            return res.status(403).json({ success: false, error: 'Not authorized' });
        }

        const sanitizedContent = sanitizeMessage(content || '');
        if (type === 'text' && isSpam(sanitizedContent)) {
            return res.status(400).json({
                success: false,
                error: 'Message appears to be spam',
            });
        }

        const message = await prisma.message.create({
            data: {
                conversationId,
                senderId: currentUser.id,
                content: sanitizedContent,
                messageType: type,
                fileUrl,
                fileName,
                fileSize: fileSize ? parseInt(String(fileSize), 10) : undefined,
                isRead: false,
            },
            include: {
                sender: {
                    select: {
                        id: true,
                        uid: true,
                        email: true,
                        name: true,
                        profilePhoto: true,
                    },
                },
            },
        });

        await prisma.conversation.update({
            where: { id: conversationId },
            data: {
                lastMessage: type === 'text' ? getSnippet(sanitizedContent) : `[${type}]`,
                lastMessageAt: new Date(),
            },
        });

        res.status(201).json({
            success: true,
            data: { message: mapMessage(message) },
        });
    } catch (error: any) {
        console.error('Error sending message:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to send message',
            details: error.message,
        });
    }
};

export const editMessage = async (req: Request, res: Response) => {
    try {
        const { id: messageId } = req.params;
        const { content } = req.body;
        const userIdentifier = (req as any).user?.userId || (req as any).user?.id;

        if (!content || !content.trim()) {
            return res.status(400).json({
                success: false,
                error: 'Message content is required',
            });
        }

        const currentUser = await resolveUserByUidOrId(userIdentifier);
        if (!currentUser) {
            return res.status(401).json({ success: false, error: 'Unauthorized' });
        }

        const sanitizedData = sanitizeMessage(content);
        if (isSpam(sanitizedData)) {
            return res.status(400).json({
                success: false,
                error: 'Message appears to be spam',
            });
        }

        const message = await prisma.message.findUnique({
            where: { id: messageId },
        });

        if (!message) {
            return res.status(404).json({ success: false, error: 'Message not found' });
        }

        if (message.senderId !== currentUser.id) {
            return res.status(403).json({
                success: false,
                error: 'Not authorized to edit this message',
            });
        }

        const updatedMessage = await prisma.message.update({
            where: { id: messageId },
            data: {
                content: sanitizedData,
                isEdited: true,
            },
            include: {
                sender: {
                    select: {
                        id: true,
                        uid: true,
                        email: true,
                        name: true,
                        profilePhoto: true,
                    },
                },
            },
        });

        res.json({
            success: true,
            data: { message: mapMessage(updatedMessage) },
        });
    } catch (error: any) {
        console.error('Error editing message:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to edit message',
            details: error.message,
        });
    }
};

export const deleteMessage = async (req: Request, res: Response) => {
    try {
        const { id: messageId } = req.params;
        const userIdentifier = (req as any).user?.userId || (req as any).user?.id;
        const currentUser = await resolveUserByUidOrId(userIdentifier);

        if (!currentUser) {
            return res.status(401).json({ success: false, error: 'Unauthorized' });
        }

        const message = await prisma.message.findUnique({ where: { id: messageId } });

        if (!message) {
            return res.status(404).json({
                success: false,
                error: 'Message not found',
            });
        }

        if (message.senderId !== currentUser.id) {
            return res.status(403).json({
                success: false,
                error: 'Not authorized to delete this message',
            });
        }

        const updatedMessage = await prisma.message.update({
            where: { id: messageId },
            data: {
                isDeleted: true,
                content: '[Message deleted]',
            },
            include: {
                sender: {
                    select: {
                        id: true,
                        uid: true,
                        email: true,
                        name: true,
                        profilePhoto: true,
                    },
                },
            },
        });

        res.json({
            success: true,
            data: { message: mapMessage(updatedMessage) },
        });
    } catch (error: any) {
        console.error('Error deleting message:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to delete message',
            details: error.message,
        });
    }
};

export const deleteConversation = async (req: Request, res: Response) => {
    try {
        const { id: conversationId } = req.params;
        const userIdentifier = (req as any).user?.userId || (req as any).user?.id;
        const currentUser = await resolveUserByUidOrId(userIdentifier);

        if (!currentUser) {
            return res.status(401).json({ success: false, error: 'Unauthorized' });
        }

        const participant = await ensureParticipant(conversationId, currentUser.id);
        if (!participant) {
            return res.status(403).json({ success: false, error: 'Not authorized to delete this conversation' });
        }

        await prisma.conversation.delete({ where: { id: conversationId } });

        res.json({
            success: true,
            message: 'Conversation deleted successfully',
        });
    } catch (error: any) {
        console.error('Error deleting conversation:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to delete conversation',
            details: error.message,
        });
    }
};
