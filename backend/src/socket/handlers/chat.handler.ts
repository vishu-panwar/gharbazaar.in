import { Server, Socket } from 'socket.io';
import { getSocketUser } from '../auth.middleware';
import { prisma } from '../../utils/database';
import { socketRateLimiter } from '../../middleware/rateLimiter.middleware';
import { sanitizeMessage, isSpam } from '../../utils/sanitization';

const UUID_REGEX =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const resolveUserByUidOrId = async (identifier?: string | null) => {
    const value = (identifier || '').trim();
    if (!value) return null;

    const byUid = await prisma.user.findUnique({
        where: { uid: value },
        select: { id: true, uid: true, email: true, name: true, profilePhoto: true },
    });
    if (byUid) return byUid;

    if (!UUID_REGEX.test(value)) return null;

    return prisma.user.findUnique({
        where: { id: value },
        select: { id: true, uid: true, email: true, name: true, profilePhoto: true },
    });
};

export const registerChatHandlers = (io: Server, socket: Socket) => {
    const authUser = getSocketUser(socket);

    const getCurrentUser = async () => {
        return resolveUserByUidOrId(authUser.userId);
    };

    socket.on('join_conversation', async (conversationId: string) => {
        try {
            const currentUser = await getCurrentUser();
            if (!currentUser) {
                socket.emit('error', { message: 'User profile not found' });
                return;
            }

            const participant = await prisma.conversationParticipant.findUnique({
                where: {
                    conversationId_userId: {
                        conversationId,
                        userId: currentUser.id,
                    },
                },
            });

            if (!participant) {
                socket.emit('error', { message: 'Not authorized for this conversation' });
                return;
            }

            await socket.join(conversationId);
        } catch (error) {
            console.error('Error joining conversation:', error);
            socket.emit('error', { message: 'Failed to join conversation' });
        }
    });

    socket.on('leave_conversation', (conversationId: string) => {
        socket.leave(conversationId);
    });

    socket.on('send_message', async (data: {
        conversationId: string;
        content: string;
        type?: 'text' | 'image' | 'file';
        fileUrl?: string;
        fileName?: string;
        fileSize?: number;
        thumbnailUrl?: string;
    }) => {
        try {
            // Rate limiting check (key by stable user UID/id from token)
            if (!socketRateLimiter.checkLimit(authUser.userId)) {
                socket.emit('error', {
                    message: 'Too many messages. Please slow down.',
                    rateLimitExceeded: true,
                });
                return;
            }

            const currentUser = await getCurrentUser();
            if (!currentUser) {
                socket.emit('error', { message: 'User profile not found' });
                return;
            }

            const { conversationId, content, type = 'text', fileUrl, fileName, fileSize, thumbnailUrl } = data;
            const sanitizedContent = sanitizeMessage(content || '');

            if (type === 'text' && isSpam(sanitizedContent)) {
                socket.emit('error', { message: 'Message appears to be spam' });
                return;
            }

            const participant = await prisma.conversationParticipant.findUnique({
                where: {
                    conversationId_userId: {
                        conversationId,
                        userId: currentUser.id,
                    },
                },
            });

            if (!participant) {
                socket.emit('error', { message: 'Not authorized for this conversation' });
                return;
            }

            const [message] = await prisma.$transaction([
                prisma.message.create({
                    data: {
                        conversationId,
                        senderId: currentUser.id,
                        content: sanitizedContent,
                        messageType: type,
                        fileUrl,
                        fileName,
                        fileSize,
                        isRead: false,
                    },
                    include: {
                        sender: {
                            select: {
                                id: true,
                                uid: true,
                                name: true,
                                email: true,
                                profilePhoto: true,
                            },
                        },
                    },
                }),
                prisma.conversation.update({
                    where: { id: conversationId },
                    data: {
                        lastMessage: type === 'text' ? sanitizedContent.substring(0, 100) : `[${type}]`,
                        lastMessageAt: new Date(),
                    },
                }),
            ]);

            const messageData = {
                id: message.id,
                conversationId,
                senderId: message.sender.uid || message.sender.id,
                senderEmail: message.sender.email,
                senderName: message.sender.name,
                senderPhoto: message.sender.profilePhoto,
                content: sanitizedContent,
                type: message.messageType,
                fileUrl: message.fileUrl,
                fileName: message.fileName,
                fileSize: message.fileSize,
                thumbnailUrl: thumbnailUrl || null,
                read: message.isRead,
                edited: message.isEdited,
                deleted: message.isDeleted,
                createdAt: message.createdAt.toISOString(),
            };

            io.to(conversationId).emit('new_message', messageData);

            const participants = await prisma.conversationParticipant.findMany({
                where: { conversationId },
                include: { user: { select: { id: true, uid: true } } },
            });

            participants.forEach((p) => {
                if (p.userId === currentUser.id) return;
                const targetIdentity = p.user.uid || p.user.id;
                io.to(`notifications:${targetIdentity}`).emit('message_notification', {
                    conversationId,
                    message: messageData,
                });
            });
        } catch (error) {
            console.error('Error sending message:', error);
            socket.emit('error', { message: 'Failed to send message' });
        }
    });

    socket.on('typing', async (data: { conversationId: string; isTyping: boolean }) => {
        const { conversationId, isTyping } = data;
        const currentUser = await resolveUserByUidOrId(authUser.userId);
        socket.to(conversationId).emit('user_typing', {
            userId: currentUser?.uid || authUser.userId,
            isTyping,
        });
    });

    socket.on('mark_as_read', async (data: { conversationId: string }) => {
        try {
            const currentUser = await getCurrentUser();
            if (!currentUser) return;

            const { conversationId } = data;

            await prisma.message.updateMany({
                where: {
                    conversationId,
                    senderId: { not: currentUser.id },
                    isRead: false,
                },
                data: {
                    isRead: true,
                },
            });

            await prisma.conversationParticipant.update({
                where: {
                    conversationId_userId: {
                        conversationId,
                        userId: currentUser.id,
                    },
                },
                data: {
                    lastReadAt: new Date(),
                },
            }).catch(() => null);

            socket.to(conversationId).emit('messages_read', {
                conversationId,
                userId: currentUser.uid || currentUser.id,
            });
        } catch (error) {
            console.error('Error marking messages as read:', error);
        }
    });

    socket.on('edit_message', async (data: { messageId: string; content: string }) => {
        try {
            const currentUser = await getCurrentUser();
            if (!currentUser) {
                socket.emit('error', { message: 'User profile not found' });
                return;
            }

            const { messageId, content } = data;
            const sanitizedContent = sanitizeMessage(content || '');

            if (isSpam(sanitizedContent)) {
                socket.emit('error', { message: 'Message appears to be spam' });
                return;
            }

            const message = await prisma.message.findUnique({
                where: { id: messageId },
            });

            if (!message) {
                socket.emit('error', { message: 'Message not found' });
                return;
            }
            if (message.senderId !== currentUser.id) {
                socket.emit('error', { message: 'Not authorized to edit this message' });
                return;
            }

            const updatedMessage = await prisma.message.update({
                where: { id: messageId },
                data: {
                    content: sanitizedContent,
                    isEdited: true,
                },
            });

            io.to(message.conversationId).emit('message_edited', {
                id: updatedMessage.id,
                content: updatedMessage.content,
                edited: true,
            });
        } catch (error) {
            console.error('Error editing message:', error);
            socket.emit('error', { message: 'Failed to edit message' });
        }
    });

    socket.on('delete_message', async (data: { messageId: string }) => {
        try {
            const currentUser = await getCurrentUser();
            if (!currentUser) {
                socket.emit('error', { message: 'User profile not found' });
                return;
            }

            const { messageId } = data;

            const message = await prisma.message.findUnique({
                where: { id: messageId },
            });

            if (!message) {
                socket.emit('error', { message: 'Message not found' });
                return;
            }
            if (message.senderId !== currentUser.id) {
                socket.emit('error', { message: 'Not authorized to delete this message' });
                return;
            }

            await prisma.message.update({
                where: { id: messageId },
                data: {
                    isDeleted: true,
                    content: '[Message deleted]',
                },
            });

            io.to(message.conversationId).emit('message_deleted', {
                id: message.id,
                conversationId: message.conversationId,
            });
        } catch (error) {
            console.error('Error deleting message:', error);
            socket.emit('error', { message: 'Failed to delete message' });
        }
    });
};
