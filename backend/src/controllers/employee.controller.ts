import { Request, Response } from 'express';
import { prisma } from '../utils/prisma';
import { emailService } from '../utils/email.service';

export const getPendingProperties = async (req: Request, res: Response) => {
    try {
        const properties = await prisma.property.findMany({
            where: { status: 'pending' },
            orderBy: { createdAt: 'desc' }
        });
        res.json({ success: true, data: { properties } });
    } catch (error) {
        console.error('Error fetching pending properties:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch pending properties' });
    }
};

export const approveProperty = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        // Update property
        const property = await prisma.property.update({
            where: { id },
            data: {
                status: 'active',
                verified: true
            }
        });

        if (!property) {
            return res.status(404).json({ success: false, error: 'Property not found' });
        }

        // Increment activeListings for seller's profile
        await prisma.sellerProfile.updateMany({
            where: { userId: property.sellerId },
            data: {
                activeListings: {
                    increment: 1
                }
            }
        });

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

        const property = await prisma.property.update({
            where: { id },
            data: { status: 'rejected' }
        });

        if (!property) {
            return res.status(404).json({ success: false, error: 'Property not found' });
        }

        res.json({ success: true, data: { property } });
    } catch (error) {
        console.error('Error rejecting property:', error);
        res.status(500).json({ success: false, error: 'Failed to reject property' });
    }
};

export const getApprovedProperties = async (req: Request, res: Response) => {
    try {
        const properties = await prisma.property.findMany({
            where: {
                status: {
                    in: ['active', 'inactive']
                }
            },
            orderBy: { updatedAt: 'desc' }
        });

        res.json({ success: true, data: { properties } });
    } catch (error) {
        console.error('Error fetching approved properties:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch approved properties' });
    }
};

export const togglePropertyPause = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const property = await prisma.property.findUnique({ where: { id } });

        if (!property) {
            return res.status(404).json({ success: false, error: 'Property not found' });
        }

        if (property.status !== 'active' && property.status !== 'inactive') {
            return res.status(400).json({ success: false, error: 'Only approved properties can be paused/resumed' });
        }

        const newStatus = property.status === 'active' ? 'inactive' : 'active';
        const updatedProperty = await prisma.property.update({
            where: { id },
            data: { status: newStatus }
        });

        const action = newStatus === 'active' ? 'resumed' : 'paused';

        // Create notification for seller
        await prisma.notification.create({
            data: {
                userId: property.sellerId,
                type: 'system',
                title: `Property ${action.charAt(0).toUpperCase() + action.slice(1)}`,
                message: `Your property "${property.title}" has been ${action} by our moderation team.`,
                priority: 'medium',
                metadata: JSON.stringify({ propertyId: property.id, action })
            }
        });

        res.json({
            success: true,
            message: `Property ${action} successfully`,
            data: { property: updatedProperty }
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

        const where: any = {};
        if (status && status !== 'all') {
            where.status = status;
        }

        const tickets = await prisma.ticket.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            skip,
            take: limit
        });

        res.json({ success: true, data: { tickets } });
    } catch (error) {
        console.error('Error fetching tickets:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch tickets' });
    }
};

export const getActiveConversations = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.userId;

        const conversations = await prisma.conversation.findMany({
            where: {
                conversationType: 'support-ticket',
                OR: [
                    { propertyTitle: userId }, // Using propertyTitle field as proxy for assignedEmployee
                    { propertyTitle: null }
                ]
            },
            orderBy: { lastMessageAt: 'desc' },
            take: 50
        });

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

        await prisma.ticketMessage.create({
            data: {
                ticketId,
                senderId: userId,
                content: message,
                isInternal: false
            }
        });

        res.json({ success: true, data: { message: 'Quick response sent' } });
    } catch (error) {
        console.error('Error sending quick response:', error);
        res.status(500).json({ success: false, error: 'Failed to send quick response' });
    }
};

export const getUserHistory = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;

        const tickets = await prisma.ticket.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            take: 20
        });

        res.json({ success: true, data: { tickets } });
    } catch (error) {
        console.error('Error fetching user history:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch user history' });
    }
};

export const getEmployeeStats = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.userId;

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const [activeTickets, resolvedToday, totalAssigned] = await Promise.all([
            prisma.ticket.count({
                where: {
                    assignedTo: userId,
                    status: { in: ['in_progress', 'open'] }
                }
            }),
            prisma.ticket.count({
                where: {
                    assignedTo: userId,
                    status: 'resolved',
                    updatedAt: { gte: today }
                }
            }),
            prisma.ticket.count({
                where: { assignedTo: userId }
            })
        ]);

        const stats = {
            activeTickets,
            resolvedToday,
            averageResponseTime: 0,
            totalAssigned
        };

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
        const phoneRegex = /^(?:(?:\+|0{0,2})91[\s-]?)?[6789]\d{9}$/;
        if (!phoneRegex.test(phone)) {
            return res.status(400).json({ success: false, error: 'Please provide a valid Indian phone number' });
        }

        const user = await prisma.user.update({
            where: { uid: userId },
            data: {
                name,
                phone,
                address,
                branch,
                office,
                branchManagerName,
                onboardingCompleted: true
            }
        });

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
