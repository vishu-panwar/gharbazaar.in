import { Server, Socket } from 'socket.io';
import { getSocketUser } from '../auth.middleware';
import { prisma } from '../../utils/prisma';
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
            const ticket = await prisma.ticket.findUnique({
                where: { id: ticketId }
            });

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

            console.log(`✅ ${user.email} joined ticket: ${ticketId}`);

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

            const ticket = await prisma.ticket.findUnique({
                where: { id: ticketId }
            });

            if (!ticket) {
                socket.emit('error', { message: 'Ticket not found' });
                return;
            }

            const isEmployee = user.role === 'employee' || user.role === 'admin';

            // Create ticket message
            const ticketMessage = await prisma.ticketMessage.create({
                data: {
                    ticketId,
                    senderId: user.userId,
                    content: message,
                    isInternal: false,
                    attachments: fileUrl ? [fileUrl] : []
                }
            });

            // If employee is responding and ticket is assigned, mark as in_progress
            if (isEmployee && ticket.status === 'open') {
                await prisma.ticket.update({
                    where: { id: ticketId },
                    data: { status: 'in_progress' }
                });
            }

            const messageData = {
                id: ticketMessage.id,
                ticketId,
                senderId: user.userId,
                senderType: isEmployee ? 'employee' : 'customer',
                message,
                fileUrl,
                fileName,
                timestamp: ticketMessage.createdAt.toISOString()
            };

            io.to(ticketId).emit('ticket:message', messageData);

            if (!isEmployee) {
                io.to('employees').emit('ticket:new-message', {
                    ticketId,
                    userId: user.userId,
                    preview: message.substring(0, 50)
                });
            }

            console.log(`✅ Ticket message sent: ${ticketId} by ${isEmployee ? 'employee' : 'customer'}`);

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

            const ticket = await prisma.ticket.update({
                where: { id: ticketId },
                data: {
                    assignedTo: user.userId,
                    status: 'in_progress',
                    assignedAt: new Date()
                }
            });

            if (!ticket) {
                socket.emit('error', { message: 'Ticket not found' });
                return;
            }

            io.to(ticketId).emit('ticket:assigned', {
                ticketId,
                assignedTo: user.userId,
                assignedToName: user.email.split('@')[0],
                status: 'in_progress'
            });

            io.to('employees').emit('ticket:status-changed', {
                ticketId,
                status: 'in_progress',
                assignedTo: user.userId
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
            const ticket = await prisma.ticket.findUnique({
                where: { id: ticketId }
            });

            if (!ticket) {
                socket.emit('error', { message: 'Ticket not found' });
                return;
            }

            if (ticket.assignedTo !== user.userId) {
                socket.emit('error', { message: 'Only assigned employee can close this ticket' });
                return;
            }

            const updatedTicket = await prisma.ticket.update({
                where: { id: ticketId },
                data: {
                    status: 'closed',
                    closedAt: new Date()
                }
            });

            io.to(ticketId).emit('ticket:closed', {
                ticketId,
                status: 'closed',
                closedAt: updatedTicket.closedAt?.toISOString()
            });

            console.log(`✅ Ticket ${ticketId} closed by ${user.email}`);

        } catch (error) {
            console.error('❌ Error closing ticket:', error);
            socket.emit('error', { message: 'Failed to close ticket' });
        }
    });
};
