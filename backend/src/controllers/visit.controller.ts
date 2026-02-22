import { Request, Response } from 'express';
import { prisma } from '../utils/database';

const UUID_REGEX =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const resolveUserByUidOrId = async (identifier?: string | null) => {
    const value = (identifier || '').trim();
    if (!value) return null;

    const byUid = await prisma.user.findUnique({
        where: { uid: value },
        select: { id: true, uid: true, role: true, name: true },
    });
    if (byUid) return byUid;

    if (UUID_REGEX.test(value)) {
        return prisma.user.findUnique({
            where: { id: value },
            select: { id: true, uid: true, role: true, name: true },
        });
    }

    return null;
};

const hasActiveBuyerPlan = async (userInternalId: string): Promise<boolean> => {
    const subscription = await prisma.subscription.findFirst({
        where: {
            userId: userInternalId,
            status: 'active',
            endDate: { gt: new Date() },
            plan: {
                OR: [{ type: 'buyer' }, { type: 'combined' }],
            },
        },
        select: { id: true },
    });

    return Boolean(subscription);
};

const createUserNotification = async (params: {
    userId: string;
    type: string;
    title: string;
    message: string;
    link?: string;
    priority?: string;
    metadata?: Record<string, any>;
}) => {
    const notification = await prisma.notification.create({
        data: {
            userId: params.userId,
            type: params.type,
            title: params.title,
            message: params.message,
            link: params.link,
            priority: params.priority || 'medium',
            metadata: params.metadata ? JSON.stringify(params.metadata) : null,
        },
    });

    return notification;
};

const emitNotification = (req: Request, targetUserUid: string, notification: any) => {
    try {
        const io = req.app.get('io');
        if (!io) return;
        io.to(`notifications:${targetUserUid}`).emit('new_notification', notification);
    } catch {
        // Non-fatal: REST response should not fail if socket emit fails.
    }
};

export const createVisit = async (req: Request, res: Response) => {
    try {
        const authUserIdentifier = (req as any).user?.userId || (req as any).user?.id;
        const { propertyId, scheduledAt, notes, address, location, buyerId: bodyBuyerId, partnerId } = req.body;

        if (!propertyId) {
            return res.status(400).json({ success: false, message: 'propertyId is required' });
        }

        const requester = await resolveUserByUidOrId(authUserIdentifier);
        if (!requester) {
            return res.status(401).json({ success: false, message: 'User not authenticated' });
        }

        const property = await prisma.property.findUnique({
            where: { id: propertyId },
            select: { id: true, title: true, sellerId: true, status: true },
        });

        if (!property) {
            return res.status(404).json({ success: false, message: 'Property not found' });
        }

        if (property.status !== 'active') {
            return res.status(400).json({ success: false, message: 'This property is not available for visit scheduling' });
        }

        const seller = await prisma.user.findUnique({
            where: { uid: property.sellerId },
            select: { id: true, uid: true, name: true },
        });
        if (!seller) {
            return res.status(404).json({ success: false, message: 'Seller not found for this property' });
        }

        let buyer = requester;
        if (bodyBuyerId) {
            const resolvedBuyer = await resolveUserByUidOrId(bodyBuyerId);
            if (!resolvedBuyer) {
                return res.status(400).json({ success: false, message: 'Invalid buyerId' });
            }
            buyer = resolvedBuyer;
        }

        if (buyer.uid !== seller.uid) {
            const hasBuyerPlan = await hasActiveBuyerPlan(buyer.id);
            if (!hasBuyerPlan) {
                return res.status(403).json({
                    success: false,
                    message: 'Active buyer plan required to schedule visit',
                    code: 'PLAN_REQUIRED',
                    redirectTo: '/dashboard/pricing',
                });
            }
        }

        let resolvedPartnerId: string | null = null;
        if (partnerId) {
            const partner = await resolveUserByUidOrId(partnerId);
            if (!partner) {
                return res.status(400).json({ success: false, message: 'Invalid partnerId' });
            }
            resolvedPartnerId = partner.id;
        }

        const visit = await prisma.visit.create({
            data: {
                propertyId,
                buyerId: buyer.id,
                sellerId: seller.id,
                partnerId: resolvedPartnerId,
                scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
                status: scheduledAt ? 'scheduled' : 'pending',
                notes: notes || null,
                address: address || null,
                location: location || null,
            },
        });

        const sellerNotification = await createUserNotification({
            userId: seller.id,
            type: 'visit',
            title: 'New Visit Scheduled',
            message: `${buyer.name || 'A buyer'} scheduled a visit for "${property.title}"`,
            link: '/dashboard/inquiries',
            priority: 'high',
            metadata: { visitId: visit.id, propertyId: property.id, buyerId: buyer.uid },
        });

        const buyerNotification = await createUserNotification({
            userId: buyer.id,
            type: 'visit',
            title: 'Visit Request Submitted',
            message: `Your visit request for "${property.title}" has been submitted`,
            link: '/dashboard/favorites',
            priority: 'medium',
            metadata: { visitId: visit.id, propertyId: property.id, sellerId: seller.uid },
        });

        emitNotification(req, seller.uid, {
            id: sellerNotification.id,
            type: sellerNotification.type,
            title: sellerNotification.title,
            message: sellerNotification.message,
            link: sellerNotification.link,
            isRead: false,
            createdAt: sellerNotification.createdAt,
        });

        emitNotification(req, buyer.uid, {
            id: buyerNotification.id,
            type: buyerNotification.type,
            title: buyerNotification.title,
            message: buyerNotification.message,
            link: buyerNotification.link,
            isRead: false,
            createdAt: buyerNotification.createdAt,
        });

        res.status(201).json({ success: true, data: visit });
    } catch (error: any) {
        console.error('createVisit error:', error);
        res.status(500).json({ success: false, message: 'Failed to create visit', error: error.message });
    }
};

export const getBuyerVisits = async (req: Request, res: Response) => {
    try {
        const userIdentifier = (req as any).user?.userId || (req as any).user?.id;
        const { status } = req.query;
        const user = await resolveUserByUidOrId(userIdentifier);
        if (!user) return res.status(401).json({ success: false, message: 'User not authenticated' });

        const visits = await prisma.visit.findMany({
            where: {
                buyerId: user.id,
                ...(status ? { status: status as string } : {}),
            },
            include: {
                property: {
                    select: {
                        id: true,
                        title: true,
                        location: true,
                        price: true,
                        photos: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        res.json({ success: true, data: visits });
    } catch (error: any) {
        console.error('getBuyerVisits error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch visits', error: error.message });
    }
};

export const getSellerVisits = async (req: Request, res: Response) => {
    try {
        const userIdentifier = (req as any).user?.userId || (req as any).user?.id;
        const { status } = req.query;
        const user = await resolveUserByUidOrId(userIdentifier);
        if (!user) return res.status(401).json({ success: false, message: 'User not authenticated' });

        const visits = await prisma.visit.findMany({
            where: {
                sellerId: user.id,
                ...(status ? { status: status as string } : {}),
            },
            include: {
                property: {
                    select: {
                        id: true,
                        title: true,
                        location: true,
                        price: true,
                        photos: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        res.json({ success: true, data: visits });
    } catch (error: any) {
        console.error('getSellerVisits error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch visits', error: error.message });
    }
};

export const getPartnerVisits = async (req: Request, res: Response) => {
    try {
        const userIdentifier = (req as any).user?.userId || (req as any).user?.id;
        const { status } = req.query;
        const user = await resolveUserByUidOrId(userIdentifier);
        if (!user) return res.status(401).json({ success: false, message: 'User not authenticated' });

        const visits = await prisma.visit.findMany({
            where: {
                partnerId: user.id,
                ...(status ? { status: status as string } : {}),
            },
            include: {
                property: {
                    select: {
                        id: true,
                        title: true,
                        location: true,
                        price: true,
                        photos: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
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
        const userIdentifier = (req as any).user?.userId || (req as any).user?.id;
        const user = await resolveUserByUidOrId(userIdentifier);
        if (!user) return res.status(401).json({ success: false, message: 'User not authenticated' });

        const visit = await prisma.visit.findUnique({
            where: { id },
            include: {
                buyer: { select: { id: true, uid: true, name: true } },
                seller: { select: { id: true, uid: true, name: true } },
                property: { select: { id: true, title: true } },
            },
        });

        if (!visit) return res.status(404).json({ success: false, message: 'Visit not found' });

        if (visit.buyerId !== user.id && visit.sellerId !== user.id && visit.partnerId !== user.id) {
            return res.status(403).json({ success: false, message: 'Not authorized to update this visit' });
        }

        const { status, scheduledAt, notes, partnerId, feedback } = req.body;
        let resolvedPartnerId: string | null | undefined = undefined;
        if (partnerId !== undefined) {
            if (partnerId === null || partnerId === '') {
                resolvedPartnerId = null;
            } else {
                const partner = await resolveUserByUidOrId(partnerId);
                if (!partner) {
                    return res.status(400).json({ success: false, message: 'Invalid partnerId' });
                }
                resolvedPartnerId = partner.id;
            }
        }

        const updatedVisit = await prisma.visit.update({
            where: { id },
            data: {
                ...(status && { status }),
                ...(scheduledAt && { scheduledAt: new Date(scheduledAt) }),
                ...(notes !== undefined && { notes }),
                ...(resolvedPartnerId !== undefined && { partnerId: resolvedPartnerId }),
                ...(feedback !== undefined && { feedback }),
            },
        });

        if (status && status !== visit.status) {
            const buyerNotification = await createUserNotification({
                userId: visit.buyer.id,
                type: 'visit',
                title: 'Visit Status Updated',
                message: `Your visit for "${visit.property.title}" is now ${status}`,
                link: '/dashboard/favorites',
                metadata: { visitId: visit.id, propertyId: visit.property.id, status },
            });

            const sellerNotification = await createUserNotification({
                userId: visit.seller.id,
                type: 'visit',
                title: 'Visit Status Updated',
                message: `Visit for "${visit.property.title}" is now ${status}`,
                link: '/dashboard/inquiries',
                metadata: { visitId: visit.id, propertyId: visit.property.id, status },
            });

            emitNotification(req, visit.buyer.uid, {
                id: buyerNotification.id,
                type: buyerNotification.type,
                title: buyerNotification.title,
                message: buyerNotification.message,
                link: buyerNotification.link,
                isRead: false,
                createdAt: buyerNotification.createdAt,
            });

            emitNotification(req, visit.seller.uid, {
                id: sellerNotification.id,
                type: sellerNotification.type,
                title: sellerNotification.title,
                message: sellerNotification.message,
                link: sellerNotification.link,
                isRead: false,
                createdAt: sellerNotification.createdAt,
            });
        }

        res.json({ success: true, data: updatedVisit });
    } catch (error: any) {
        console.error('updateVisit error:', error);
        res.status(500).json({ success: false, message: 'Failed to update visit', error: error.message });
    }
};
