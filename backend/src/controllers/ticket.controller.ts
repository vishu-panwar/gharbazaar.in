import { Request, Response } from 'express';
import { prisma } from '../utils/prisma';
import { v4 as uuidv4 } from 'uuid';
import { addToWaitingQueue } from '../socket/handlers/agent.handler';
import { uploadFile } from '../utils/fileStorage';

export const getUserTickets = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.userId;

        const tickets = await prisma.ticket.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            take: 50
        });

        res.json({ success: true, data: { tickets } });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Failed to fetch tickets' });
    }
};

export const getAllTickets = async (req: Request, res: Response) => {
    try {
        const { status } = req.query;
        const filter: any = status && status !== 'all' ? { status: status as string } : {};

        const tickets = await prisma.ticket.findMany({
            where: filter,
            orderBy: { createdAt: 'desc' },
            take: 100
        });

        res.json({ success: true, data: { tickets } });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Failed to fetch tickets' });
    }
};

export const getTicketDetails = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const ticket = await prisma.ticket.findUnique({
            where: { id }
        });

        if (!ticket) {
            return res.status(404).json({ success: false, error: 'Ticket not found' });
        }

        const messages = await prisma.ticketMessage.findMany({
            where: { ticketId: id },
            orderBy: { createdAt: 'asc' }
        });

        res.json({ success: true, data: { ticket, messages } });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Failed to fetch ticket' });
    }
};

export const createTicket = async (req: Request, res: Response) => {
    try {
        const { categoryTitle, subCategoryTitle, problem } = req.body;
        const userId = (req as any).user.userId;
        const userRole = (req as any).user.role || 'buyer';

        // Create ticket
        const ticket = await prisma.ticket.create({
            data: {
                userId,
                subject: categoryTitle || 'Support Request',
                category: subCategoryTitle || 'general',
                status: 'open'
            }
        });

        // Create first message
        await prisma.ticketMessage.create({
            data: {
                ticketId: ticket.id,
                senderId: userId,
                content: problem,
                isInternal: false
            }
        });

        // Emit Socket.IO event to notify employees about new ticket
        const io = (req.app as any).get('io');
        if (io) {
            const ticketData = {
                id: ticket.id,
                userId,
                userRole,
                categoryTitle,
                subCategoryTitle,
                problem,
                status: 'open',
                createdAt: ticket.createdAt
            };

            // Notify all connected employees about the new ticket
            io.to('employees').emit('ticket:new', ticketData);

            // Add to live chat queue for immediate agent support
            const userEmail = (req as any).user.email;
            const userName = (req as any).user.name || userEmail.split('@')[0];
            addToWaitingQueue(ticket, { name: userName, email: userEmail }, io);

            console.log(`📢 New ticket broadcast to employees: ${ticketData.id}`);
        }

        res.status(201).json({ success: true, data: { ticket } });
    } catch (error) {
        console.error('createTicket error:', error);
        res.status(500).json({ success: false, error: 'Failed to create ticket' });
    }
};

export const assignTicket = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const userId = (req as any).user.userId;
        const userEmail = (req as any).user.email;

        const ticket = await prisma.ticket.update({
            where: { id },
            data: {
                assignedTo: userId,
                status: 'in_progress',
                assignedAt: new Date()
            }
        });

        res.json({ success: true, data: { ticket } });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Failed to assign ticket' });
    }
};

export const sendTicketMessage = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { message } = req.body;
        const userId = (req as any).user.userId;
        const userRole = (req as any).user.role;

        const isEmployee = userRole === 'employee' || userRole === 'admin';

        const ticketMessage = await prisma.ticketMessage.create({
            data: {
                ticketId: id,
                senderId: userId,
                content: message,
                isInternal: false
            }
        });

        // Emit Socket.IO event for real-time update
        const io = (req.app as any).get('io');
        if (io) {
            const messageData = {
                sessionId: id,
                message: {
                    role: isEmployee ? 'agent' : 'user',
                    content: message,
                    timestamp: ticketMessage.createdAt.toISOString(),
                    senderId: userId
                }
            };

            // Emit to the ticket room
            io.to(id).emit(isEmployee ? 'ticket:message' : 'customer_message', messageData);

            // Also emit to SupportChatbot expected event if it's an employee message
            if (isEmployee) {
                io.to(id).emit('ticket:message', {
                    ticketId: id,
                    message,
                    role: 'agent',
                    timestamp: messageData.message.timestamp
                });
            }
        }

        res.status(201).json({ success: true, data: { message: ticketMessage } });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Failed to send message' });
    }
};

export const closeTicket = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const ticket = await prisma.ticket.update({
            where: { id },
            data: {
                status: 'closed',
                closedAt: new Date()
            }
        });

        res.json({ success: true, data: { ticket } });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Failed to close ticket' });
    }
};

export const uploadTicketFile = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        if (!req.file) {
            return res.status(400).json({ success: false, error: 'No file provided' });
        }

        const result = await uploadFile(
            req.file.buffer,
            req.file.originalname,
            req.file.mimetype
        );

        res.json({
            success: true,
            data: {
                url: result.url,
                fileName: req.file.originalname,
                fileType: req.file.mimetype
            }
        });
    } catch (error: any) {
        console.error('uploadTicketFile error:', error);
        res.status(500).json({ success: false, error: error.message || 'Failed to upload file' });
    }
};
