
import { Server, Socket } from 'socket.io';
import { getSocketUser } from '../auth.middleware';
import Ticket from '../../models/ticket.model';
import TicketMessage from '../../models/ticketMessage.model';
import { isMongoDBAvailable, memoryTickets, memoryTicketMessages } from '../../utils/memoryStore';
import { v4 as uuidv4 } from 'uuid';
export const registerTicketHandlers = (io: Server, socket: Socket) => {
    const user = getSocketUser(socket);

    console.log(`🎫 Ticket handlers registered for: ${user.email}`);
    socket.on('join_employee_room', () => {
        if (user.role !== 'employee' && user.role !== 'admin') {
            socket.emit('error', { message: 'Only employees can join employee room' });
            return;
        }

        const employeeRoom = 'employees';
        socket.join(employeeRoom);

        console.log(`👔 Employee ${user.email} joined employee broadcast room`);
    });
    socket.on('join_ticket', async (data: { ticketId: string }) => {
        try {
            const { ticketId } = data;
            let ticket;
            if (isMongoDBAvailable()) {
                ticket = await Ticket.findById(ticketId);
            } else {
                ticket = memoryTickets.get(ticketId);
            }

            if (!ticket) {
                socket.emit('error', { message: 'Ticket not found' });
                return;
            }
            const isOwner = ticket.userId === user.userId;
            const isAssignedEmployee = ticket.assignedTo === user.userId;
            const isEmployee = user.role === 'employee' || user.role === 'admin';

            if (!isOwner && !isAssignedEmployee && !isEmployee) {
                socket.emit('error', { message: 'Not authorized for this ticket' });
                return;
            }
            await socket.join(ticketId);

            console.log(`✅ ${user.email} joined ticket: ${ticketId}${!isMongoDBAvailable() ? ' (Memory Mode)' : ''}`);

        } catch (error) {
            console.error('❌ Error joining ticket:', error);
            socket.emit('error', { message: 'Failed to join ticket' });
        }
    });
    socket.on('leave_ticket', (data: { ticketId: string }) => {
        const { ticketId } = data;
        socket.leave(ticketId);
        console.log(`📤 ${user.email} left ticket: ${ticketId}`);
    });
    socket.on('ticket_message', async (data: {
        ticketId: string;
        message: string;
        fileUrl?: string;
        fileName?: string;
    }) => {
        try {
            const { ticketId, message, fileUrl, fileName } = data;
            let ticket;
            if (isMongoDBAvailable()) {
                ticket = await Ticket.findById(ticketId);
            } else {
                ticket = memoryTickets.get(ticketId);
            }

            if (!ticket) {
                socket.emit('error', { message: 'Ticket not found' });
                return;
            }
            const isEmployee = user.role === 'employee' || user.role === 'admin';
            const senderType = isEmployee ? 'employee' : 'customer';

            let ticketMessage;
            if (isMongoDBAvailable()) {
                ticketMessage = await TicketMessage.create({
                    ticketId,
                    senderId: user.userId,
                    senderType,
                    message,
                    fileUrl,
                    fileName,
                    timestamp: new Date(),
                });
                if (isEmployee && ticket.status === 'assigned') {
                    ticket.status = 'in_progress';
                    await ticket.save();
                }
            } else {
                const messageId = uuidv4();
                const timestamp = new Date();
                ticketMessage = {
                    _id: messageId,
                    ticketId,
                    senderId: user.userId,
                    senderType,
                    message,
                    fileUrl,
                    fileName,
                    timestamp,
                };
                if (!memoryTicketMessages.has(ticketId)) {
                    memoryTicketMessages.set(ticketId, []);
                }
                memoryTicketMessages.get(ticketId).push(ticketMessage);
                if (isEmployee && ticket.status === 'assigned') {
                    ticket.status = 'in_progress';
                }
            }
            const messageData = {
                id: isMongoDBAvailable() ? ticketMessage._id.toString() : ticketMessage._id,
                ticketId,
                senderId: user.userId,
                senderType,
                message,
                fileUrl,
                fileName,
                timestamp: isMongoDBAvailable() ? ticketMessage.timestamp.toISOString() : ticketMessage.timestamp.toISOString(),
            };
            io.to(ticketId).emit('ticket:message', messageData);
            if (senderType === 'customer') {
                io.to('employees').emit('ticket:new-message', {
                    ticketId,
                    userId: user.userId,
                    preview: message.substring(0, 50),
                });
            }

            console.log(`✅ Ticket message sent: ${ticketId} by ${senderType}`);

        } catch (error) {
            console.error('❌ Error sending ticket message:', error);
            socket.emit('error', { message: 'Failed to send message' });
        }
    });
    socket.on('assign_ticket', async (data: { ticketId: string }) => {
        try {
            const { ticketId } = data;
            if (user.role !== 'employee' && user.role !== 'admin') {
                socket.emit('error', { message: 'Only employees can assign tickets' });
                return;
            }

            let ticket;
            if (isMongoDBAvailable()) {
                ticket = await Ticket.findByIdAndUpdate(
                    ticketId,
                    {
                        assignedTo: user.userId,
                        assignedToName: user.email.split('@')[0], // Simple name from email
                        status: 'assigned',
                    },
                    { new: true }
                );
            } else {
                ticket = memoryTickets.get(ticketId);
                if (ticket) {
                    ticket.assignedTo = user.userId;
                    ticket.assignedToName = user.email.split('@')[0];
                    ticket.status = 'assigned';
                }
            }

            if (!ticket) {
                socket.emit('error', { message: 'Ticket not found' });
                return;
            }
            io.to(ticketId).emit('ticket:assigned', {
                ticketId,
                assignedTo: user.userId,
                assignedToName: user.email.split('@')[0],
                status: 'assigned',
            });
            io.to('employees').emit('ticket:status-changed', {
                ticketId,
                status: 'assigned',
                assignedTo: user.userId,
            });

            console.log(`✅ Ticket ${ticketId} assigned to ${user.email}`);

        } catch (error) {
            console.error('❌ Error assigning ticket:', error);
            socket.emit('error', { message: 'Failed to assign ticket' });
        }
    });
    socket.on('close_ticket', async (data: { ticketId: string }) => {
        try {
            const { ticketId } = data;
            const ticket = await Ticket.findById(ticketId);

            if (!ticket) {
                socket.emit('error', { message: 'Ticket not found' });
                return;
            }

            if (ticket.assignedTo !== user.userId) {
                socket.emit('error', { message: 'Only assigned employee can close this ticket' });
                return;
            }
            ticket.status = 'closed';
            ticket.closedAt = new Date();
            await ticket.save();
            io.to(ticketId).emit('ticket:closed', {
                ticketId,
                status: 'closed',
                closedAt: ticket.closedAt.toISOString(),
            });

            console.log(`✅ Ticket ${ticketId} closed by ${user.email}`);

        } catch (error) {
            console.error('❌ Error closing ticket:', error);
            socket.emit('error', { message: 'Failed to close ticket' });
        }
    });
};

