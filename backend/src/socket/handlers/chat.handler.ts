
import { Server, Socket } from 'socket.io';
import { getSocketUser } from '../auth.middleware';
import { prisma } from '../../utils/prisma';
import { v4 as uuidv4 } from 'uuid';
import { socketRateLimiter } from '../../middleware/rateLimiter.middleware';
import { sanitizeMessage, isSpam } from '../../utils/sanitization';

export const registerChatHandlers = (io: Server, socket: Socket) => {
    const user = getSocketUser(socket);

    console.log(`💬 Chat handlers registered for: ${user.email}`);

    socket.on('join_conversation', async (conversationId: string) => {
        try {
            console.log(`📨 ${user.email} joining conversation: ${conversationId}`);

            const participant = await prisma.conversationParticipant.findUnique({
                where: {
                    conversationId_userId: {
                        conversationId,
                        userId: user.userId
                    }
                }
            });

            if (!participant) {
                console.warn(`⚠️  Unauthorized: ${user.email} not in conversation ${conversationId}`);
                socket.emit('error', { message: 'Not authorized for this conversation' });
                return;
            }

            await socket.join(conversationId);
            console.log(`✅ ${user.email} joined conversation room: ${conversationId}`);

        } catch (error) {
            console.error('❌ Error joining conversation:', error);
            socket.emit('error', { message: 'Failed to join conversation' });
        }
    });

    socket.on('leave_conversation', (conversationId: string) => {
        socket.leave(conversationId);
        console.log(`📤 ${user.email} left conversation: ${conversationId}`);
    });

    socket.on('send_message', async (data: {
        conversationId: string;
        content: string;
        type?: 'text' | 'image' | 'file';
        fileUrl?: string;
        fileName?: string;
        fileSize?: number;
    }) => {
        try {
            // Rate limiting check
            if (!socketRateLimiter.checkLimit(user.userId)) {
                socket.emit('error', {
                    message: 'Too many messages. Please slow down.',
                    rateLimitExceeded: true
                });
                return;
            }

            const { conversationId, content, type = 'text', fileUrl, fileName, fileSize } = data;

            // Sanitize message content
            const sanitizedContent = sanitizeMessage(content);

            // Check for spam
            if (isSpam(sanitizedContent)) {
                socket.emit('error', { message: 'Message appears to be spam' });
                return;
            }

            console.log(`📨 Message from ${user.email} in ${conversationId}`);

            // Verify participation
            const participant = await prisma.conversationParticipant.findUnique({
                where: {
                    conversationId_userId: {
                        conversationId,
                        userId: user.userId
                    }
                }
            });

            if (!participant) {
                socket.emit('error', { message: 'Not authorized for this conversation' });
                return;
            }

            // Create message and update conversation in a transaction
            const [message] = await prisma.$transaction([
                prisma.message.create({
                    data: {
                        conversationId,
                        senderId: user.userId,
                        content: sanitizedContent,
                        messageType: type,
                        fileUrl,
                        fileName,
                        fileSize,
                        isRead: false
                    },
                    include: {
                        sender: {
                            select: {
                                name: true,
                                email: true,
                                profilePhoto: true
                            }
                        }
                    }
                }),
                prisma.conversation.update({
                    where: { id: conversationId },
                    data: {
                        lastMessage: sanitizedContent.substring(0, 100),
                        lastMessageAt: new Date(),
                    }
                })
            ]);

            const messageData = {
                id: message.id,
                conversationId,
                senderId: user.userId,
                senderEmail: message.sender.email,
                senderName: message.sender.name,
                senderPhoto: message.sender.profilePhoto,
                content: sanitizedContent,
                type: message.messageType,
                fileUrl: message.fileUrl,
                fileName: message.fileName,
                fileSize: message.fileSize,
                isRead: message.isRead,
                isEdited: message.isEdited,
                isDeleted: message.isDeleted,
                createdAt: message.createdAt.toISOString(),
            };

            io.to(conversationId).emit('new_message', messageData);

            // Notify participants who are NOT in the room via generic notification system
            const participants = await prisma.conversationParticipant.findMany({
                where: { conversationId },
                include: { user: { select: { id: true, uid: true } } }
            });

            participants.forEach(p => {
                const targetId = p.user.uid || p.user.id;
                if (targetId !== user.userId) {
                    io.to(`notifications:${targetId}`).emit('message_notification', {
                        conversationId,
                        message: messageData
                    });
                }
            });

            console.log(`✅ Message sent in conversation: ${conversationId}`);

        } catch (error) {
            console.error('❌ Error sending message:', error);
            socket.emit('error', { message: 'Failed to send message' });
        }
    });

    socket.on('typing', (data: { conversationId: string; isTyping: boolean }) => {
        const { conversationId, isTyping } = data;
        socket.to(conversationId).emit('user_typing', {
            userId: user.userId,
            isTyping,
        });
    });

    socket.on('mark_as_read', async (data: { conversationId: string }) => {
        try {
            const { conversationId } = data;

            await prisma.message.updateMany({
                where: {
                    conversationId,
                    senderId: { not: user.userId },
                    isRead: false,
                },
                data: {
                    isRead: true,
                }
            });

            // Update participant's lastReadAt
            await prisma.conversationParticipant.update({
                where: {
                    conversationId_userId: {
                        conversationId,
                        userId: user.userId
                    }
                },
                data: {
                    lastReadAt: new Date()
                }
            });

            socket.to(conversationId).emit('messages_read', {
                conversationId,
                userId: user.userId,
            });

            console.log(`✅ Messages marked as read in ${conversationId} by ${user.email}`);

        } catch (error) {
            console.error('❌ Error marking messages as read:', error);
        }
    });

    socket.on('edit_message', async (data: { messageId: string; content: string }) => {
        try {
            const { messageId, content } = data;

            const message = await prisma.message.findUnique({
                where: { id: messageId }
            });

            if (!message) {
                socket.emit('error', { message: 'Message not found' });
                return;
            }
            if (message.senderId !== user.userId) {
                socket.emit('error', { message: 'Not authorized to edit this message' });
                return;
            }

            const updatedMessage = await prisma.message.update({
                where: { id: messageId },
                data: {
                    content,
                    isEdited: true
                }
            });

            io.to(message.conversationId).emit('message_edited', {
                id: updatedMessage.id,
                content: updatedMessage.content,
                isEdited: true,
            });

            console.log(`✏️  Message edited: ${messageId}`);

        } catch (error) {
            console.error('❌ Error editing message:', error);
            socket.emit('error', { message: 'Failed to edit message' });
        }
    });

    socket.on('delete_message', async (data: { messageId: string }) => {
        try {
            const { messageId } = data;

            const message = await prisma.message.findUnique({
                where: { id: messageId }
            });

            if (!message) {
                socket.emit('error', { message: 'Message not found' });
                return;
            }
            if (message.senderId !== user.userId) {
                socket.emit('error', { message: 'Not authorized to delete this message' });
                return;
            }

            await prisma.message.update({
                where: { id: messageId },
                data: {
                    isDeleted: true,
                    content: '[Message deleted]'
                }
            });

            io.to(message.conversationId).emit('message_deleted', {
                id: message.id,
                conversationId: message.conversationId,
            });

            console.log(`🗑️  Message deleted: ${messageId}`);

        } catch (error) {
            console.error('❌ Error deleting message:', error);
            socket.emit('error', { message: 'Failed to delete message' });
        }
    });
};

