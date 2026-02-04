import { Request, Response } from 'express';
import PartnerCase from '../models/partnerCase.model';
import Referral from '../models/referral.model';
import Payout from '../models/payout.model';

export const createPartnerCase = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.userId;
        if (!userId) return res.status(401).json({ success: false, message: 'User not authenticated' });

        const { type, title, description, propertyId, buyerId, sellerId, amount, dueDate, metadata } = req.body;
        if (!type || !title) {
            return res.status(400).json({ success: false, message: 'type and title are required' });
        }

        const partnerCase = await PartnerCase.create({
            partnerId: userId,
            type,
            title,
            description,
            propertyId,
            buyerId,
            sellerId,
            amount,
            dueDate: dueDate ? new Date(dueDate) : undefined,
            metadata
        });

        res.status(201).json({ success: true, data: partnerCase });
    } catch (error: any) {
        console.error('createPartnerCase error:', error);
        res.status(500).json({ success: false, message: 'Failed to create partner case', error: error.message });
    }
};

export const getPartnerCases = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.userId;
        if (!userId) return res.status(401).json({ success: false, message: 'User not authenticated' });

        const { status, type } = req.query;
        const query: any = { partnerId: userId };
        if (status) query.status = status;
        if (type) query.type = type;

        const cases = await PartnerCase.find(query).sort({ createdAt: -1 });
        res.json({ success: true, data: cases });
    } catch (error: any) {
        console.error('getPartnerCases error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch cases', error: error.message });
    }
};

export const updatePartnerCase = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const userId = (req as any).user?.userId;
        if (!userId) return res.status(401).json({ success: false, message: 'User not authenticated' });

        const partnerCase = await PartnerCase.findById(id);
        if (!partnerCase) return res.status(404).json({ success: false, message: 'Case not found' });
        if (partnerCase.partnerId !== userId) return res.status(403).json({ success: false, message: 'Not authorized' });

        const { status, description, amount, dueDate, metadata } = req.body;
        if (status) partnerCase.status = status;
        if (description !== undefined) partnerCase.description = description;
        if (amount !== undefined) partnerCase.amount = amount;
        if (dueDate !== undefined) partnerCase.dueDate = dueDate ? new Date(dueDate) : undefined;
        if (metadata !== undefined) partnerCase.metadata = metadata;

        await partnerCase.save();
        res.json({ success: true, data: partnerCase });
    } catch (error: any) {
        console.error('updatePartnerCase error:', error);
        res.status(500).json({ success: false, message: 'Failed to update case', error: error.message });
    }
};

export const createReferral = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.userId;
        if (!userId) return res.status(401).json({ success: false, message: 'User not authenticated' });

        const { referralCode, leadName, leadContact, metadata } = req.body;
        if (!referralCode || !leadName || !leadContact) {
            return res.status(400).json({ success: false, message: 'referralCode, leadName, leadContact are required' });
        }

        const referral = await Referral.create({
            promoterId: userId,
            referralCode,
            leadName,
            leadContact,
            metadata
        });

        res.status(201).json({ success: true, data: referral });
    } catch (error: any) {
        console.error('createReferral error:', error);
        res.status(500).json({ success: false, message: 'Failed to create referral', error: error.message });
    }
};

export const getReferrals = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.userId;
        if (!userId) return res.status(401).json({ success: false, message: 'User not authenticated' });

        const { status } = req.query;
        const query: any = { promoterId: userId };
        if (status) query.status = status;

        const referrals = await Referral.find(query).sort({ createdAt: -1 });
        res.json({ success: true, data: referrals });
    } catch (error: any) {
        console.error('getReferrals error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch referrals', error: error.message });
    }
};

export const getPayouts = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.userId;
        if (!userId) return res.status(401).json({ success: false, message: 'User not authenticated' });

        const { status } = req.query;
        const query: any = { partnerId: userId };
        if (status) query.status = status;

        const payouts = await Payout.find(query).sort({ createdAt: -1 });
        res.json({ success: true, data: payouts });
    } catch (error: any) {
        console.error('getPayouts error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch payouts', error: error.message });
    }
};

export const createPayout = async (req: Request, res: Response) => {
    try {
        const { partnerId, amount, method, status, reference, periodStart, periodEnd, notes } = req.body;
        if (!partnerId || !amount) {
            return res.status(400).json({ success: false, message: 'partnerId and amount are required' });
        }

        const payout = await Payout.create({
            partnerId,
            amount,
            method,
            status,
            reference,
            periodStart: periodStart ? new Date(periodStart) : undefined,
            periodEnd: periodEnd ? new Date(periodEnd) : undefined,
            notes
        });

        res.status(201).json({ success: true, data: payout });
    } catch (error: any) {
        console.error('createPayout error:', error);
        res.status(500).json({ success: false, message: 'Failed to create payout', error: error.message });
    }
};
