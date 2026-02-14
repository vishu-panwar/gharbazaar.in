import { Request, Response } from 'express';
import { prisma } from '../utils/database';

export const createVisit = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.userId || (req as any).user?.id;
        const { propertyId, scheduledAt, notes, address, location, buyerId: bodyBuyerId, partnerId } = req.body;

        if (!propertyId) {
            return res.status(400).json({ success: false, message: 'propertyId is required' });
        }

        const property = await prisma.property.findUnique({
            where: { id: propertyId }
        });

        if (!property) {
            return res.status(404).json({ success: false, message: 'Property not found' });
        }

        const buyerId = bodyBuyerId || userId;
        if (!buyerId) {
            return res.status(401).json({ success: false, message: 'User not authenticated' });
        }

        const visit = await prisma.visit.create({
            data: {
                propertyId,
                buyerId,
                sellerId: property.sellerId,
                partnerId: partnerId || null,
                scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
                status: scheduledAt ? 'scheduled' : 'pending',
                notes: notes || null,
                address: address || null,
                location: location || null
            }
        });

        res.status(201).json({ success: true, data: visit });
    } catch (error: any) {
        console.error('createVisit error:', error);
        res.status(500).json({ success: false, message: 'Failed to create visit', error: error.message });
    }
};

export const getBuyerVisits = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.userId || (req as any).user?.id;
        const { status } = req.query;
        if (!userId) return res.status(401).json({ success: false, message: 'User not authenticated' });

        const visits = await prisma.visit.findMany({
            where: {
                buyerId: userId,
                ...(status ? { status: status as string } : {})
            },
            include: {
                property: {
                    select: {
                        id: true,
                        title: true,
                        location: true,
                        price: true,
                        photos: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        res.json({ success: true, data: visits });
    } catch (error: any) {
        console.error('getBuyerVisits error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch visits', error: error.message });
    }
};

export const getSellerVisits = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.userId || (req as any).user?.id;
        const { status } = req.query;
        if (!userId) return res.status(401).json({ success: false, message: 'User not authenticated' });

        const visits = await prisma.visit.findMany({
            where: {
                sellerId: userId,
                ...(status ? { status: status as string } : {})
            },
            include: {
                property: {
                    select: {
                        id: true,
                        title: true,
                        location: true,
                        price: true,
                        photos: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        res.json({ success: true, data: visits });
    } catch (error: any) {
        console.error('getSellerVisits error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch visits', error: error.message });
    }
};

export const getPartnerVisits = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.userId || (req as any).user?.id;
        const { status } = req.query;
        if (!userId) return res.status(401).json({ success: false, message: 'User not authenticated' });

        const visits = await prisma.visit.findMany({
            where: {
                partnerId: userId,
                ...(status ? { status: status as string } : {})
            },
            include: {
                property: {
                    select: {
                        id: true,
                        title: true,
                        location: true,
                        price: true,
                        photos: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        res.json({ success: true, data: visits });
    } catch (error: any) {
        console.error('getPartnerVisits error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch visits', error: error.message });
    }
};

export const updateVisit = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const userId = (req as any).user?.userId || (req as any).user?.id;
        if (!userId) return res.status(401).json({ success: false, message: 'User not authenticated' });

        const visit = await prisma.visit.findUnique({
            where: { id }
        });
        
        if (!visit) return res.status(404).json({ success: false, message: 'Visit not found' });

        // Check if user is buyer, seller, or partner
        if (visit.buyerId !== userId && visit.sellerId !== userId && visit.partnerId !== userId) {
            return res.status(403).json({ success: false, message: 'Not authorized to update this visit' });
        }

        const { status, scheduledAt, notes, partnerId, feedback } = req.body;
        
        const updatedVisit = await prisma.visit.update({
            where: { id },
            data: {
                ...(status && { status }),
                ...(scheduledAt && { scheduledAt: new Date(scheduledAt) }),
                ...(notes !== undefined && { notes }),
                ...(partnerId !== undefined && { partnerId }),
                ...(feedback !== undefined && { feedback })
            }
        });

        res.json({ success: true, data: updatedVisit });
    } catch (error: any) {
        console.error('updateVisit error:', error);
        res.status(500).json({ success: false, message: 'Failed to update visit', error: error.message });
    }
};
