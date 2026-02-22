import { Request, Response } from 'express';
import Ticket from '../models/ticket.model';
import TicketMessage from '../models/ticketMessage.model';
import Conversation from '../models/conversation.model';
import { isMongoDBAvailable, memoryTickets, memoryConversations } from '../utils/memoryStore';
import { prisma } from '../utils/database';

const UUID_REGEX =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const resolveInternalUserId = async (uidOrId?: string | null): Promise<string | null> => {
    const value = (uidOrId || '').trim();
    if (!value) return null;

    const byUid = await prisma.user.findUnique({
        where: { uid: value },
        select: { id: true },
    });
    if (byUid) return byUid.id;

    if (!UUID_REGEX.test(value)) return null;

    const byId = await prisma.user.findUnique({
        where: { id: value },
        select: { id: true },
    });
    return byId?.id || null;
};

export const getPendingProperties = async (req: Request, res: Response) => {
    try {
        const properties = await prisma.property.findMany({
            where: { status: 'pending' },
            include: {
                seller: {
                    select: {
                        uid: true,
                        name: true,
                        email: true,
                        sellerClientId: true,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
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
        const existing = await prisma.property.findUnique({
            where: { id },
            select: { id: true, sellerId: true, title: true },
        });

        if (!existing) {
            return res.status(404).json({ success: false, error: 'Property not found' });
        }

        const property = await prisma.property.update({
            where: { id },
            data: {
                status: 'active',
                verified: true,
            },
        });

        const seller = await prisma.user.findUnique({
            where: { uid: existing.sellerId },
            select: { id: true },
        });
        if (seller) {
            await prisma.sellerProfile.updateMany({
                where: { userId: seller.id },
                data: { activeListings: { increment: 1 } },
            });

            await prisma.notification.create({
                data: {
                    userId: seller.id,
                    type: 'listing_update',
                    title: 'Property Approved',
                    message: `Your property "${existing.title}" has been approved and is now live.`,
                    link: `/dashboard/listings/${existing.id}`,
                    priority: 'medium',
                },
            });
        }

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

        const existing = await prisma.property.findUnique({
            where: { id },
            select: { id: true, title: true, sellerId: true },
        });
        if (!existing) {
            return res.status(404).json({ success: false, error: 'Property not found' });
        }

        const property = await prisma.property.update({
            where: { id },
            data: { status: 'rejected' },
        });

        const sellerUserId = await resolveInternalUserId(property.sellerId);
        if (sellerUserId) {
            await prisma.notification.create({
                data: {
                    userId: sellerUserId,
                    type: 'listing_update',
                    title: 'Property Rejected',
                    message: `Your property "${property.title}" was rejected.${reason ? ` Reason: ${reason}` : ''}`,
                    link: `/dashboard/listings/${property.id}`,
                    priority: 'high',
                },
            });
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
                status: { in: ['active', 'inactive'] }
            },
            include: {
                seller: {
                    select: {
                        uid: true,
                        name: true,
                        email: true,
                        sellerClientId: true,
                    },
                },
            },
            orderBy: { updatedAt: 'desc' },
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
        const property = await prisma.property.findUnique({
            where: { id },
            select: { id: true, status: true, sellerId: true, title: true },
        });

        if (!property) {
            return res.status(404).json({ success: false, error: 'Property not found' });
        }

        if (property.status !== 'active' && property.status !== 'inactive') {
            return res.status(400).json({ success: false, error: 'Only approved properties can be paused/resumed' });
        }

        const oldStatus = property.status;
        const updated = await prisma.property.update({
            where: { id },
            data: { status: oldStatus === 'active' ? 'inactive' : 'active' },
        });

        const action = updated.status === 'active' ? 'resumed' : 'paused';

        const sellerUserId = await resolveInternalUserId(property.sellerId);
        if (sellerUserId) {
            await prisma.notification.create({
                data: {
                    userId: sellerUserId,
                    type: 'listing_update',
                    title: `Property ${action.charAt(0).toUpperCase() + action.slice(1)}`,
                    message: `Your property "${property.title}" has been ${action} by our moderation team.`,
                    priority: 'medium',
                    link: `/dashboard/listings/${property.id}`,
                    metadata: JSON.stringify({ propertyId: property.id, action }),
                },
            });
        }

        res.json({
            success: true,
            message: `Property ${action} successfully`,
            data: { property: updated }
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

export const getReferralLeads = async (req: Request, res: Response) => {
    try {
        const status = (req.query.status as string) || 'all';
        const where = status !== 'all' ? { status } : undefined;

        const leads = await prisma.referral.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            take: 200,
        });

        const promoterIds = Array.from(new Set(leads.map((lead) => lead.promoterId).filter(Boolean)));
        const promoters = promoterIds.length > 0
            ? await prisma.user.findMany({
                where: { id: { in: promoterIds } },
                select: { id: true, uid: true, name: true, email: true },
            })
            : [];
        const promoterMap = new Map(promoters.map((promoter) => [promoter.id, promoter]));

        const enrichedLeads = leads.map((lead) => ({
            ...lead,
            promoter: promoterMap.get(lead.promoterId) || null,
        }));

        res.json({ success: true, data: { leads: enrichedLeads } });
    } catch (error) {
        console.error('Error fetching referral leads:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch referral leads' });
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

        const existingUser = await prisma.user.findUnique({
            where: { uid: userId },
            select: { id: true },
        });
        if (!existingUser) {
            return res.status(404).json({ success: false, error: 'User not found' });
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
