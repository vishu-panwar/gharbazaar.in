
import { Request, Response } from 'express';
import Ticket from '../models/ticket.model';
import TicketMessage from '../models/ticketMessage.model';
import { isMongoDBAvailable, memoryTickets, memoryTicketMessages } from '../utils/memoryStore';
import { v4 as uuidv4 } from 'uuid';
import { addToWaitingQueue } from '../socket/handlers/agent.handler';
import { uploadFile } from '../utils/fileStorage';
export const getUserTickets = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.userId;

        let tickets = [];
        if (isMongoDBAvailable()) {
            tickets = await Ticket.find({ userId })
                .sort({ createdAt: -1 })
                .limit(50);
        } else {
            tickets = Array.from(memoryTickets.values())
                .filter((t: any) => t.userId === userId)
                .sort((a: any, b: any) => b.createdAt - a.createdAt)
                .slice(0, 50);
        }

        res.json({ success: true, data: { tickets } });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Failed to fetch tickets' });
    }
};
export const getAllTickets = async (req: Request, res: Response) => {
    try {
        const { status } = req.query;
        const filter: any = status && status !== 'all' ? { status } : {};

        let tickets = [];
        if (isMongoDBAvailable()) {
            tickets = await Ticket.find(filter)
                .sort({ createdAt: -1 })
                .limit(100);
        } else {
            tickets = Array.from(memoryTickets.values())
                .filter((t: any) => !status || status === 'all' || t.status === status)
                .sort((a: any, b: any) => b.createdAt - a.createdAt)
                .slice(0, 100);
        }

        res.json({ success: true, data: { tickets } });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Failed to fetch tickets' });
    }
};
export const getTicketDetails = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        let ticket;
        if (isMongoDBAvailable()) {
            ticket = await Ticket.findById(id);
        } else {
            ticket = memoryTickets.get(id);
        }

        if (!ticket) {
            return res.status(404).json({ success: false, error: 'Ticket not found' });
        }

        let messages = [];
        if (isMongoDBAvailable()) {
            messages = await TicketMessage.find({ ticketId: id })
                .sort({ timestamp: 1 });
        } else {
            messages = (memoryTicketMessages.get(id) || [])
                .sort((a: any, b: any) => a.timestamp.getTime() - b.timestamp.getTime());
        }

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

        let ticket;
        if (isMongoDBAvailable()) {
            ticket = await Ticket.create({
                userId,
                userRole,
                categoryTitle,
                subCategoryTitle,
                problem,
                status: 'open',
            });
            await TicketMessage.create({
                ticketId: ticket._id,
                senderId: userId,
                senderType: 'customer',
                message: problem,
            });
        } else {
            const ticketId = uuidv4();
            const createdAt = new Date();
            ticket = {
                _id: ticketId,
                userId,
                userRole,
                categoryTitle,
                subCategoryTitle,
                problem,
                status: 'open',
                createdAt,
            };
            memoryTickets.set(ticketId, ticket);
            const messageId = uuidv4();
            const ticketMessage = {
                _id: messageId,
                ticketId,
                senderId: userId,
                senderType: 'customer',
                message: problem,
                timestamp: createdAt,
            };
            memoryTicketMessages.set(ticketId, [ticketMessage]);
        }

        // Emit Socket.IO event to notify employees about new ticket
        const io = (req.app as any).get('io');
        if (io) {
            const ticketData = {
                id: isMongoDBAvailable() ? ticket._id.toString() : ticket._id,
                userId,
                userRole,
                categoryTitle,
                subCategoryTitle,
                problem,
                status: 'open',
                createdAt: isMongoDBAvailable() ? ticket.createdAt : ticket.createdAt,
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
        res.status(500).json({ success: false, error: 'Failed to create ticket' });
    }
};
export const assignTicket = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const userId = (req as any).user.userId;
        const userEmail = (req as any).user.email;

        let ticket;
        if (isMongoDBAvailable()) {
            ticket = await Ticket.findByIdAndUpdate(
                id,
                {
                    assignedTo: userId,
                    assignedToName: userEmail.split('@')[0],
                    status: 'assigned',
                },
                { new: true }
            );
        } else {
            ticket = memoryTickets.get(id);
            if (ticket) {
                ticket.assignedTo = userId;
                ticket.assignedToName = userEmail.split('@')[0];
                ticket.status = 'assigned';
            }
        }

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

        const senderType = userRole === 'employee' ? 'employee' : 'customer';

        let ticketMessage;
        if (isMongoDBAvailable()) {
            ticketMessage = await TicketMessage.create({
                ticketId: id,
                senderId: userId,
                senderType,
                message,
            });
        } else {
            const messageId = uuidv4();
            const timestamp = new Date();
            ticketMessage = {
                _id: messageId,
                ticketId: id,
                senderId: userId,
                senderType,
                message,
                timestamp,
            };
            if (!memoryTicketMessages.has(id)) {
                memoryTicketMessages.set(id, []);
            }
            memoryTicketMessages.get(id).push(ticketMessage);
        }

        // Emit Socket.IO event for real-time update
        const io = (req.app as any).get('io');
        if (io) {
            const messageData = {
                sessionId: id,
                message: {
                    role: senderType === 'employee' ? 'agent' : 'user',
                    content: message,
                    timestamp: new Date().toISOString(),
                    senderId: userId
                }
            };

            // Emit to the ticket room
            io.to(id).emit(senderType === 'employee' ? 'ticket:message' : 'customer_message', messageData);

            // Also emit to SupportChatbot expected event if it's an employee message
            if (senderType === 'employee') {
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

        let ticket;
        if (isMongoDBAvailable()) {
            ticket = await Ticket.findByIdAndUpdate(
                id,
                { status: 'closed', closedAt: new Date() },
                { new: true }
            );
        } else {
            ticket = memoryTickets.get(id);
            if (ticket) {
                ticket.status = 'closed';
                ticket.closedAt = new Date();
            }
        }

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

