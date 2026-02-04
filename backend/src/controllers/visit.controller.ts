import { Request, Response } from 'express';
import Visit from '../models/visit.model';
import Property from '../models/property.model';

export const createVisit = async (req: Request, res: Response) => {
    try {
        const user = (req as any).user || {};
        const { propertyId, scheduledAt, notes, address, location, buyerId: bodyBuyerId, partnerId } = req.body;

        if (!propertyId) {
            return res.status(400).json({ success: false, message: 'propertyId is required' });
        }

        const property = await Property.findById(propertyId);
        if (!property) {
            return res.status(404).json({ success: false, message: 'Property not found' });
        }

        const buyerId = bodyBuyerId || user.userId;
        if (!buyerId) {
            return res.status(401).json({ success: false, message: 'User not authenticated' });
        }

        const visit = await Visit.create({
            propertyId,
            buyerId,
            sellerId: property.sellerId,
            partnerId,
            scheduledAt: scheduledAt ? new Date(scheduledAt) : undefined,
            status: scheduledAt ? 'scheduled' : 'requested',
            notes,
            address,
            location
        });

        res.status(201).json({ success: true, data: visit });
    } catch (error: any) {
        console.error('createVisit error:', error);
        res.status(500).json({ success: false, message: 'Failed to create visit', error: error.message });
    }
};

export const getBuyerVisits = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.userId;
        const { status } = req.query;
        if (!userId) return res.status(401).json({ success: false, message: 'User not authenticated' });

        const query: any = { buyerId: userId };
        if (status) query.status = status;

        const visits = await Visit.find(query)
            .populate('propertyId', 'title location price photos')
            .sort({ createdAt: -1 });

        res.json({ success: true, data: visits });
    } catch (error: any) {
        console.error('getBuyerVisits error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch visits', error: error.message });
    }
};

export const getSellerVisits = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.userId;
        const { status } = req.query;
        if (!userId) return res.status(401).json({ success: false, message: 'User not authenticated' });

        const query: any = { sellerId: userId };
        if (status) query.status = status;

        const visits = await Visit.find(query)
            .populate('propertyId', 'title location price photos')
            .sort({ createdAt: -1 });

        res.json({ success: true, data: visits });
    } catch (error: any) {
        console.error('getSellerVisits error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch visits', error: error.message });
    }
};

export const getPartnerVisits = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.userId;
        const { status } = req.query;
        if (!userId) return res.status(401).json({ success: false, message: 'User not authenticated' });

        const query: any = { partnerId: userId };
        if (status) query.status = status;

        const visits = await Visit.find(query)
            .populate('propertyId', 'title location price photos')
            .sort({ createdAt: -1 });

        res.json({ success: true, data: visits });
    } catch (error: any) {
        console.error('getPartnerVisits error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch visits', error: error.message });
    }
};

export const updateVisit = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const userId = (req as any).user?.userId;
        if (!userId) return res.status(401).json({ success: false, message: 'User not authenticated' });

        const visit = await Visit.findById(id);
        if (!visit) return res.status(404).json({ success: false, message: 'Visit not found' });

        if (![visit.buyerId, visit.sellerId, visit.partnerId].includes(userId)) {
            return res.status(403).json({ success: false, message: 'Not authorized to update this visit' });
        }

        const { status, scheduledAt, notes, partnerId } = req.body;
        if (status) visit.status = status;
        if (scheduledAt) visit.scheduledAt = new Date(scheduledAt);
        if (notes !== undefined) visit.notes = notes;
        if (partnerId !== undefined) visit.partnerId = partnerId;

        await visit.save();
        res.json({ success: true, data: visit });
    } catch (error: any) {
        console.error('updateVisit error:', error);
        res.status(500).json({ success: false, message: 'Failed to update visit', error: error.message });
    }
};
