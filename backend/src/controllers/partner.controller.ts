import { Request, Response } from 'express';
import { prisma } from '../utils/prisma';

/**
 * Get all partners
 * GET /api/v1/partners
 */
export const getAllPartners = async (req: Request, res: Response) => {
    try {
        const partners = await prisma.user.findMany({
            where: {
                role: { in: ['promoter_partner', 'legal_partner', 'ground_partner'] }
            },
            select: {
                id: true,
                uid: true,
                name: true,
                email: true,
                phone: true,
                role: true,
                createdAt: true
            }
        });

        res.json({ success: true, data: partners });
    } catch (error: any) {
        console.error('Error fetching partners:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch partners', error: error.message });
    }
};

/**
 * Get a single partner by UID
 * GET /api/v1/partners/:uid
 */
export const getPartnerByUid = async (req: Request, res: Response) => {
    try {
        const { uid } = req.params;

        const partner = await prisma.user.findUnique({
            where: { uid },
            select: {
                id: true,
                uid: true,
                name: true,
                email: true,
                phone: true,
                role: true,
                createdAt: true
            }
        });

        if (!partner) {
            return res.status(404).json({ success: false, message: 'Partner not found' });
        }

        res.json({ success: true, data: partner });
    } catch (error: any) {
        console.error('Error fetching partner:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch partner', error: error.message });
    }
};

/**
 * Create a new partner
 * POST /api/v1/partners
 */
export const createPartner = async (req: Request, res: Response) => {
    try {
        const { uid, name, email, phone, role } = req.body;

        // Check if partner already exists
        const existingPartner = await prisma.user.findUnique({ where: { uid } });
        if (existingPartner) {
            return res.status(400).json({ success: false, message: 'Partner already exists' });
        }

        const partner = await prisma.user.create({
            data: {
                uid,
                name,
                email,
                phone,
                role
            }
        });

        res.status(201).json({ success: true, data: partner });
    } catch (error: any) {
        console.error('Error creating partner:', error);
        res.status(500).json({ success: false, message: 'Failed to create partner', error: error.message });
    }
};

/**
 * Update a partner by UID
 * PUT /api/v1/partners/:uid
 */
export const updatePartner = async (req: Request, res: Response) => {
    try {
        const { uid } = req.params;
        const { name, email, phone, role } = req.body;

        const partner = await prisma.user.update({
            where: { uid },
            data: {
                ...(name && { name }),
                ...(email && { email }),
                ...(phone && { phone }),
                ...(role && { role })
            }
        });

        res.json({ success: true, data: partner });
    } catch (error: any) {
        console.error('Error updating partner:', error);
        res.status(500).json({ success: false, message: 'Failed to update partner', error: error.message });
    }
};

/**
 * Delete a partner by UID
 * DELETE /api/v1/partners/:uid
 */
export const deletePartner = async (req: Request, res: Response) => {
    try {
        const { uid } = req.params;

        await prisma.user.delete({ where: { uid } });

        res.json({ success: true, message: 'Partner deleted successfully' });
    } catch (error: any) {
        console.error('Error deleting partner:', error);
        res.status(500).json({ success: false, message: 'Failed to delete partner', error: error.message });
    }
};

/**
 * Create a payout for a partner
 * POST /api/v1/partners/:uid/payout
 */
export const createPayout = async (req: Request, res: Response) => {
    try {
        const { uid } = req.params;
        const { amount, notes } = req.body;

        const partner = await prisma.user.findUnique({ where: { uid } });
        if (!partner) {
            return res.status(404).json({ success: false, message: 'Partner not found' });
        }

        const payout = await prisma.payout.create({
            data: {
                partnerId: partner.id,
                amount,
                notes,
                status: 'pending'
            }
        });

        res.status(201).json({ success: true, data: payout });
    } catch (error: any) {
        console.error('Error creating payout:', error);
        res.status(500).json({ success: false, message: 'Failed to create payout', error: error.message });
    }
};

/**
 * Get partner dashboard stats
 * GET /api/v1/partners/dashboard
 */
export const getPartnerDashboard = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.userId;
        const user = await prisma.user.findUnique({ where: { uid: userId } });
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });

        // Calculate stats from actual data
        const totalReferrals = await prisma.referral.count({ where: { promoterId: user.id } });
        const convertedLeads = await prisma.referral.count({ where: { promoterId: user.id, status: 'converted' } });
        const activeLeads = await prisma.referral.count({ where: { promoterId: user.id, status: { in: ['pending', 'contacted'] } } });

        const payouts = await prisma.payout.findMany({ where: { partnerId: user.id } });
        const totalEarnings = payouts.reduce((sum, p) => sum + Number(p.amount || 0), 0);
        const pendingPayouts = payouts.filter(p => p.status === 'pending');
        const pendingPayments = pendingPayouts.reduce((sum, p) => sum + Number(p.amount || 0), 0);

        const stats = {
            totalReferrals,
            activeLeads,
            convertedLeads,
            totalEarnings,
            thisMonthEarnings: 0, // Calculate from current month payouts
            lastMonthEarnings: 0, // Calculate from last month payouts
            pendingPayments,
            conversionRate: totalReferrals > 0 ? (convertedLeads / totalReferrals) * 100 : 0,
            avgResponseTime: '2.5 hours',
            partnerRank: 0, // Calculate based on performance
            totalPartners: await prisma.user.count({ where: { role: 'promoter_partner' } })
        };

        res.json({ success: true, data: stats });
    } catch (error: any) {
        console.error('getPartnerDashboard error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch dashboard', error: error.message });
    }
};

/**
 * Get partner leads
 * GET /api/v1/partners/leads
 */
export const getPartnerLeads = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.userId;
        const user = await prisma.user.findUnique({ where: { uid: userId } });
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });

        const leads = await prisma.referral.findMany({
            where: { promoterId: user.id },
            orderBy: { createdAt: 'desc' },
            take: 20
        });

        res.json({ success: true, data: leads });
    } catch (error: any) {
        console.error('getPartnerLeads error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch leads', error: error.message });
    }
};