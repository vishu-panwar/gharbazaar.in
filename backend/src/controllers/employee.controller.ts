import { Request, Response } from 'express';
import Ticket from '../models/ticket.model';
import TicketMessage from '../models/ticketMessage.model';
import Conversation from '../models/conversation.model';
import Message from '../models/message.model';
import Property from '../models/property.model';
import User from '../models/user.model';
import { isMongoDBAvailable, memoryTickets, memoryConversations } from '../utils/memoryStore';
import { emailService } from '../utils/email.service';
import Notification from '../models/notification.model';

export const getPendingProperties = async (req: Request, res: Response) => {
    try {
        const properties = await Property.find({ status: 'pending' }).sort({ createdAt: -1 });
        res.json({ success: true, data: { properties } });
    } catch (error) {
        console.error('Error fetching pending properties:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch pending properties' });
    }
};

export const approveProperty = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const property = await Property.findById(id);

        if (!property) {
            return res.status(404).json({ success: false, error: 'Property not found' });
        }

        // Update property
        property.status = 'active';
        property.verified = true;
        await property.save();

        // Increment activeListings for seller
        await User.findOneAndUpdate(
            { uid: property.sellerId },
            { $inc: { activeListings: 1 } }
        );

        // Ideally send email notification to seller
        // await emailService.sendEmail(sellerEmail, 'Property Approved', ...);

        res.json({ success: true, data: { property } });
    } catch (error) {
        console.error('Error approving property:', error);
        res.status(500).json({ success: false, error: 'Failed to approve property' });
    }
};

export const rejectProperty = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { reason } = req.body;

        const property = await Property.findByIdAndUpdate(id, { status: 'rejected' }, { new: true });

        if (!property) {
            return res.status(404).json({ success: false, error: 'Property not found' });
        }

        // TODO: Get seller email from User model using property.sellerId and send notification
        // For now, assuming rejection is logged/handled
        // await emailService.sendEmail(sellerEmail, 'Property Rejected', ...);

        res.json({ success: true, data: { property } });
    } catch (error) {
        console.error('Error rejecting property:', error);
        res.status(500).json({ success: false, error: 'Failed to reject property' });
    }
};

export const getApprovedProperties = async (req: Request, res: Response) => {
    try {
        const properties = await Property.find({
            status: { $in: ['active', 'inactive'] }
        }).sort({ updatedAt: -1 });

        res.json({ success: true, data: { properties } });
    } catch (error) {
        console.error('Error fetching approved properties:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch approved properties' });
    }
};

export const togglePropertyPause = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const property = await Property.findById(id);

        if (!property) {
            return res.status(404).json({ success: false, error: 'Property not found' });
        }

        if (property.status !== 'active' && property.status !== 'inactive') {
            return res.status(400).json({ success: false, error: 'Only approved properties can be paused/resumed' });
        }

        const oldStatus = property.status;
        property.status = oldStatus === 'active' ? 'inactive' : 'active';
        await property.save();

        const action = property.status === 'active' ? 'resumed' : 'paused';

        // Create notification for seller
        await Notification.create({
            userId: property.sellerId,
            type: 'system',
            title: `Property ${action.charAt(0).toUpperCase() + action.slice(1)}`,
            message: `Your property "${property.title}" has been ${action} by our moderation team.`,
            priority: 'medium',
            metadata: { propertyId: property._id, action }
        });

        res.json({
            success: true,
            message: `Property ${action} successfully`,
            data: { property }
        });
    } catch (error) {
        console.error('Error toggling property pause:', error);
        res.status(500).json({ success: false, error: 'Failed to toggle property visibility' });
    }
};

export const getTickets = async (req: Request, res: Response) => {
    try {
        const status = req.query.status as string;
        const limit = parseInt(req.query.limit as string) || 50;
        const skip = parseInt(req.query.skip as string) || 0;

        let query: any = {};
        if (status && status !== 'all') {
            query.status = status;
        }

        let tickets = [];
        if (isMongoDBAvailable()) {
            tickets = await Ticket.find(query)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit);
        } else {
            tickets = Array.from(memoryTickets.values())
                .filter((t: any) => !status || status === 'all' || t.status === status)
                .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                .slice(skip, skip + limit);
        }

        res.json({ success: true, data: { tickets } });
    } catch (error) {
        console.error('Error fetching tickets:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch tickets' });
    }
};

export const getActiveConversations = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.userId;

        let conversations = [];
        if (isMongoDBAvailable()) {
            conversations = await Conversation.find({
                conversationType: 'support-ticket',
                $or: [
                    { assignedEmployee: userId },
                    { assignedEmployee: { $exists: false } }
                ]
            })
                .sort({ lastMessageAt: -1 })
                .limit(50);
        } else {
            conversations = Array.from(memoryConversations.values())
                .filter((c: any) =>
                    c.conversationType === 'support-ticket' &&
                    (c.assignedEmployee === userId || !c.assignedEmployee)
                )
                .sort((a: any, b: any) =>
                    new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime()
                )
                .slice(0, 50);
        }

        res.json({ success: true, data: { conversations } });
    } catch (error) {
        console.error('Error fetching conversations:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch conversations' });
    }
};

export const sendQuickResponse = async (req: Request, res: Response) => {
    try {
        const { ticketId, templateId } = req.body;
        const userId = (req as any).user.userId;

        const templates: Record<string, string> = {
            'greeting': 'Hello! Thank you for contacting GharBazaar support. I\'ll be happy to help you with your issue.',
            'investigating': 'I\'m currently investigating this issue. I\'ll get back to you shortly with more information.',
            'resolved': 'Great! I\'m glad we could resolve your issue. Is there anything else I can help you with?',
            'followup': 'Just following up on your request. Do you need any additional assistance?',
            'closing': 'Thank you for using GharBazaar! If you need any further help, feel free to reach out.'
        };

        const message = templates[templateId];
        if (!message) {
            return res.status(400).json({ success: false, error: 'Invalid template ID' });
        }

        if (isMongoDBAvailable()) {
            await TicketMessage.create({
                ticketId,
                senderId: userId,
                senderType: 'employee',
                message,
                timestamp: new Date(),
            });
        }

        res.json({ success: true, data: { message: 'Quick response sent' } });
    } catch (error) {
        console.error('Error sending quick response:', error);
        res.status(500).json({ success: false, error: 'Failed to send quick response' });
    }
};

export const getUserHistory = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;

        let tickets = [];
        if (isMongoDBAvailable()) {
            tickets = await Ticket.find({ userId })
                .sort({ createdAt: -1 })
                .limit(20);
        } else {
            tickets = Array.from(memoryTickets.values())
                .filter((t: any) => t.userId === userId)
                .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                .slice(0, 20);
        }

        res.json({ success: true, data: { tickets } });
    } catch (error) {
        console.error('Error fetching user history:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch user history' });
    }
};

export const getEmployeeStats = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.userId;

        let stats = {
            activeTickets: 0,
            resolvedToday: 0,
            averageResponseTime: 0,
            totalAssigned: 0
        };

        if (isMongoDBAvailable()) {
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            stats.activeTickets = await Ticket.countDocuments({
                assignedTo: userId,
                status: { $in: ['assigned', 'in_progress'] }
            });

            stats.resolvedToday = await Ticket.countDocuments({
                assignedTo: userId,
                status: 'resolved',
                updatedAt: { $gte: today }
            });

            stats.totalAssigned = await Ticket.countDocuments({ assignedTo: userId });
        } else {
            const tickets = Array.from(memoryTickets.values());
            stats.activeTickets = tickets.filter((t: any) =>
                t.assignedTo === userId && ['assigned', 'in_progress'].includes(t.status)
            ).length;

            const today = new Date();
            today.setHours(0, 0, 0, 0);
            stats.resolvedToday = tickets.filter((t: any) =>
                t.assignedTo === userId &&
                t.status === 'resolved' &&
                new Date(t.updatedAt) >= today
            ).length;

            stats.totalAssigned = tickets.filter((t: any) => t.assignedTo === userId).length;
        }

        res.json({ success: true, data: { stats } });
    } catch (error) {
        console.error('Error fetching stats:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch stats' });
    }
};

export const completeOnboarding = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.userId;
        const { name, phone, address, branch, office, branchManagerName } = req.body;

        if (!name || !phone || !address || !branch || !office || !branchManagerName) {
            return res.status(400).json({ success: false, error: 'All fields are required' });
        }

        // Indian Phone Number Validation
        // Matches 10 digits, optional +91, 91, or 0 prefix
        const phoneRegex = /^(?:(?:\+|0{0,2})91[\s-]?)?[6789]\d{9}$/;
        if (!phoneRegex.test(phone)) {
            return res.status(400).json({ success: false, error: 'Please provide a valid Indian phone number' });
        }

        const user = await User.findOneAndUpdate(
            { uid: userId },
            {
                name,
                phone,
                address,
                branch,
                office,
                branchManagerName,
                onboardingCompleted: true
            },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }

        res.json({
            success: true,
            message: 'Onboarding completed successfully',
            data: {
                user: {
                    uid: user.uid,
                    email: user.email,
                    displayName: user.name,
                    role: user.role,
                    onboardingCompleted: user.onboardingCompleted
                }
            }
        });

    } catch (error: any) {
        console.error('❌ Onboarding error:', error);
        res.status(500).json({ success: false, error: error.message || 'Failed to complete onboarding' });
    }
};
