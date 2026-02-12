
import { Request, Response } from 'express';
import { prisma } from '../utils/database';

export const createPartnerCase = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.userId; // Firebase uid
        if (!userId) return res.status(401).json({ success: false, message: 'User not authenticated' });

        const user = await prisma.user.findUnique({ where: { uid: userId } });
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });

        const { type, title, description, propertyId, buyerId, sellerId, amount, dueDate, metadata } = req.body;
        if (!type || !title) {
            return res.status(400).json({ success: false, message: 'type and title are required' });
        }

        const partnerCase = await prisma.partnerCase.create({
            data: {
                partnerId: user.id, // Internal ID
                type,
                title,
                description,
                propertyId,
                buyerId,
                sellerId,
                amount: amount ? parseFloat(amount) : undefined,
                dueDate: dueDate ? new Date(dueDate) : undefined,
                metadata: metadata || {}
            }
        });

        res.status(201).json({ success: true, data: partnerCase });
    } catch (error: any) {
        console.error('createPartnerCase error:', error);
        res.status(500).json({ success: false, message: 'Failed to create partner case', error: error.message });
    }
};

export const getPartnerCases = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.userId; // Firebase uid
        if (!userId) return res.status(401).json({ success: false, message: 'User not authenticated' });

        const user = await prisma.user.findUnique({ where: { uid: userId } });
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });

        const { status, type } = req.query;
        const where: any = { partnerId: user.id };
        if (status) where.status = status as string;
        if (type) where.type = type as string;

        const include: any = {
            property: true,
            buyer: {
                select: { id: true, name: true, email: true, phone: true }
            }
        };

        const cases = await prisma.partnerCase.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            include
        });

        res.json({ success: true, data: cases });
    } catch (error: any) {
        console.error('getPartnerCases error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch cases', error: error.message });
    }
};

export const updatePartnerCase = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const userId = (req as any).user?.userId; // Firebase uid
        if (!userId) return res.status(401).json({ success: false, message: 'User not authenticated' });

        const user = await prisma.user.findUnique({ where: { uid: userId } });
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });

        const partnerCase = await prisma.partnerCase.findUnique({
            where: { id }
        });

        if (!partnerCase) return res.status(404).json({ success: false, message: 'Case not found' });
        if (partnerCase.partnerId !== user.id && (req as any).user?.role !== 'admin') {
            return res.status(403).json({ success: false, message: 'Not authorized' });
        }

        const { status, description, amount, dueDate, metadata } = req.body;
        const updateData: any = {};
        if (status) updateData.status = status;
        if (description !== undefined) updateData.description = description;
        if (amount !== undefined) updateData.amount = parseFloat(amount);
        if (dueDate !== undefined) updateData.dueDate = dueDate ? new Date(dueDate) : null;
        if (metadata !== undefined) updateData.metadata = metadata;

        const updatedCase = await prisma.partnerCase.update({
            where: { id },
            data: updateData
        });

        res.json({ success: true, data: updatedCase });
    } catch (error: any) {
        console.error('updatePartnerCase error:', error);
        res.status(500).json({ success: false, message: 'Failed to update case', error: error.message });
    }
};

export const createReferral = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.userId; // Firebase uid
        const user = await prisma.user.findUnique({ where: { uid: userId } });
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });

        const { referralCode, leadName, leadContact, metadata } = req.body;
        if (!referralCode || !leadName || !leadContact) {
            return res.status(400).json({ success: false, message: 'referralCode, leadName, leadContact are required' });
        }

        const referral = await prisma.referral.create({
            data: {
                promoterId: user.id,
                referralCode,
                leadName,
                leadContact,
                metadata: metadata || {}
            }
        });

        res.status(201).json({ success: true, data: referral });
    } catch (error: any) {
        console.error('createReferral error:', error);
        res.status(500).json({ success: false, message: 'Failed to create referral' });
    }
};

export const getReferrals = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.userId;
        const user = await prisma.user.findUnique({ where: { uid: userId } });
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });

        const { status } = req.query;
        const where: any = { promoterId: user.id };
        if (status) where.status = status as string;

        const referrals = await prisma.referral.findMany({
            where,
            orderBy: { createdAt: 'desc' }
        });
        res.json({ success: true, data: referrals });
    } catch (error: any) {
        console.error('getReferrals error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch referrals' });
    }
};

export const getPayouts = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.userId;
        const user = await prisma.user.findUnique({ where: { uid: userId } });
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });

        const { status } = req.query;
        const where: any = { partnerId: user.id };
        if (status) where.status = status as string;

        const payouts = await prisma.payout.findMany({
            where,
            orderBy: { createdAt: 'desc' }
        });
        res.json({ success: true, data: payouts });
    } catch (error: any) {
        console.error('getPayouts error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch payouts' });
    }
};

export const createPayout = async (req: Request, res: Response) => {
    try {
        const { partnerId, amount, method, status, reference, periodStart, periodEnd, notes } = req.body;
        if (!partnerId || !amount) {
            return res.status(400).json({ success: false, message: 'partnerId and amount are required' });
        }

        const payout = await prisma.payout.create({
            data: {
                partnerId,
                amount: parseFloat(amount),
                method,
                status,
                reference,
                periodStart: periodStart ? new Date(periodStart) : null,
                periodEnd: periodEnd ? new Date(periodEnd) : null,
                notes
            }
        });

        res.status(201).json({ success: true, data: payout });
    } catch (error: any) {
        console.error('createPayout error:', error);
        res.status(500).json({ success: false, message: 'Failed to create payout' });
    }
};

