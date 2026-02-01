
import { Server, Socket } from 'socket.io';
import { getSocketUser } from '../auth.middleware';
import Conversation from '../../models/conversation.model';
import Message from '../../models/message.model';
import { isMongoDBAvailable, memoryConversations, memoryMessages } from '../../utils/memoryStore';
import { v4 as uuidv4 } from 'uuid';
import { socketRateLimiter } from '../../middleware/rateLimiter.middleware';
import { sanitizeMessage, isSpam } from '../../utils/sanitization';
export const registerChatHandlers = (io: Server, socket: Socket) => {
    const user = getSocketUser(socket);

    console.log(`💬 Chat handlers registered for: ${user.email}`);
    socket.on('join_conversation', async (conversationId: string) => {
        try {
            console.log(`📨 ${user.email} joining conversation: ${conversationId}`);
            let conversation;
            if (isMongoDBAvailable()) {
                conversation = await Conversation.findById(conversationId);
            } else {
                conversation = memoryConversations.get(conversationId);
            }

            if (!conversation) {
                socket.emit('error', { message: 'Conversation not found' });
                return;
            }
            const participants = isMongoDBAvailable() ? conversation.participants : conversation.participants;
            if (!participants.includes(user.userId)) {
                console.warn(`⚠️  Unauthorized: ${user.email} not in conversation ${conversationId}`);
                socket.emit('error', { message: 'Not authorized for this conversation' });
                return;
            }
            await socket.join(conversationId);

            console.log(`✅ ${user.email} joined conversation room: ${conversationId}${!isMongoDBAvailable() ? ' (Memory Mode)' : ''}`);

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
        thumbnailUrl?: string;
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

            const { conversationId, content, type = 'text', fileUrl, thumbnailUrl, fileName, fileSize } = data;

            // Sanitize message content
            const sanitizedContent = sanitizeMessage(content);

            // Check for spam
            if (isSpam(sanitizedContent)) {
                socket.emit('error', { message: 'Message appears to be spam' });
                return;
            }

            console.log(`📨 Message from ${user.email} in ${conversationId}`);

            let messageData;
            if (isMongoDBAvailable()) {
                const message = await Message.create({
                    conversationId,
                    senderId: user.userId,
                    senderEmail: user.email,
                    content: sanitizedContent,
                    type,
                    fileUrl,
                    thumbnailUrl,
                    fileName,
                    fileSize,
                    read: false,
                    edited: false,
                    deleted: false,
                });
                await Conversation.findByIdAndUpdate(conversationId, {
                    lastMessage: sanitizedContent.substring(0, 100),  // Preview (max 100 chars)
                    lastMessageAt: new Date(),
                });

                messageData = {
                    id: message._id.toString(),
                    conversationId,
                    senderId: user.userId,
                    senderEmail: user.email,
                    content: sanitizedContent,
                    type,
                    fileUrl,
                    thumbnailUrl,
                    fileName,
                    fileSize,
                    read: false,
                    edited: false,
                    deleted: false,
                    createdAt: message.createdAt.toISOString(),
                };
            } else {
                const messageId = uuidv4();
                const createdAt = new Date();
                messageData = {
                    id: messageId,
                    conversationId,
                    senderId: user.userId,
                    senderEmail: user.email,
                    content: sanitizedContent,
                    type,
                    fileUrl,
                    thumbnailUrl,
                    fileName,
                    fileSize,
                    read: false,
                    edited: false,
                    deleted: false,
                    createdAt: createdAt.toISOString(),
                };
                if (!memoryMessages.has(conversationId)) {
                    memoryMessages.set(conversationId, []);
                }
                memoryMessages.get(conversationId).push(messageData);
                const conversation = memoryConversations.get(conversationId);
                if (conversation) {
                    conversation.lastMessage = sanitizedContent.substring(0, 100);
                    conversation.lastMessageAt = createdAt;
                }
            }
            io.to(conversationId).emit('new_message', messageData);

            console.log(`✅ Message sent in conversation: ${conversationId}${!isMongoDBAvailable() ? ' (Memory Mode)' : ''}`);

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

            if (isMongoDBAvailable()) {
                await Message.updateMany(
                    {
                        conversationId,
                        senderId: { $ne: user.userId },  // Not sent by current user
                        read: false,
                    },
                    {
                        read: true,
                    }
                );
            } else {
                // Memory mode: update read status
                const messages = memoryMessages.get(conversationId);
                if (messages) {
                    messages.forEach((msg: any) => {
                        if (msg.senderId !== user.userId && !msg.read) {
                            msg.read = true;
                        }
                    });
                }
            }

            socket.to(conversationId).emit('messages_read', {
                conversationId,
                userId: user.userId,
            });

            console.log(`✅ Messages marked as read in ${conversationId} by ${user.email}${!isMongoDBAvailable() ? ' (Memory Mode)' : ''}`);

        } catch (error) {
            console.error('❌ Error marking messages as read:', error);
        }
    });
    socket.on('edit_message', async (data: { messageId: string; content: string }) => {
        try {
            const { messageId, content } = data;
            const message = await Message.findById(messageId);

            if (!message) {
                socket.emit('error', { message: 'Message not found' });
                return;
            }
            if (message.senderId !== user.userId) {
                socket.emit('error', { message: 'Not authorized to edit this message' });
                return;
            }
            message.content = content;
            message.edited = true;
            await message.save();
            io.to(message.conversationId.toString()).emit('message_edited', {
                id: message._id.toString(),
                content,
                edited: true,
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
            const message = await Message.findById(messageId);

            if (!message) {
                socket.emit('error', { message: 'Message not found' });
                return;
            }
            if (message.senderId !== user.userId) {
                socket.emit('error', { message: 'Not authorized to delete this message' });
                return;
            }
            message.deleted = true;
            message.content = '[Message deleted]';
            await message.save();
            io.to(message.conversationId.toString()).emit('message_deleted', {
                id: message._id.toString(),
                conversationId: message.conversationId.toString(),
            });

            console.log(`🗑️  Message deleted: ${messageId}`);

        } catch (error) {
            console.error('❌ Error deleting message:', error);
            socket.emit('error', { message: 'Failed to delete message' });
        }
    });
};
