import { Request, Response } from 'express';
import { prisma } from '../utils/prisma';
import { uploadFile } from '../utils/fileStorage';

const UUID_REGEX =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const resolveUserByUidOrId = async (identifier?: string | null) => {
    const value = (identifier || '').trim();
    if (!value) return null;

    const byUid = await prisma.user.findUnique({
        where: { uid: value },
        select: { id: true, uid: true, role: true, sellerClientId: true },
    });
    if (byUid) return byUid;

    if (UUID_REGEX.test(value)) {
        return prisma.user.findUnique({
            where: { id: value },
            select: { id: true, uid: true, role: true, sellerClientId: true },
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

export const createProperty = async (req: Request, res: Response) => {
    try {
        const authUserId = (req as any).user?.userId;
        if (!authUserId) {
            return res.status(401).json({ success: false, error: 'User not authenticated' });
        }

        // Resolve authenticated user identity so Property.sellerId always stores User.uid.
        const user = await resolveUserByUidOrId(authUserId);
        if (!user) {
            return res.status(404).json({ success: false, error: 'Seller profile not found' });
        }

        const {
            price,
            bedrooms,
            bathrooms,
            area,
            squareFeet,
            carpetArea,
            photos,
            images,
            status,
            ...rest
        } = req.body || {};

        const requiredFields = ['title', 'description', 'propertyType', 'listingType', 'address', 'city'];
        const missingField = requiredFields.find((field) => !rest?.[field]);
        if (missingField) {
            return res.status(400).json({
                success: false,
                error: `${missingField} is required`,
            });
        }

        const numericPrice = Number(price);
        if (!Number.isFinite(numericPrice) || numericPrice <= 0) {
            return res.status(400).json({ success: false, error: 'A valid price is required' });
        }

        const normalizedArea = area || squareFeet || carpetArea;
        if (!normalizedArea) {
            return res.status(400).json({ success: false, error: 'area (or squareFeet/carpetArea) is required' });
        }

        const normalizedPhotos = Array.isArray(photos)
            ? photos.filter(Boolean)
            : Array.isArray(images)
              ? images.filter(Boolean)
              : [];

        const normalizedImages = Array.isArray(images)
            ? images.filter(Boolean)
            : Array.isArray(photos)
              ? photos.filter(Boolean)
              : [];

        const property = await prisma.property.create({
            data: {
                ...rest,
                price: numericPrice,
                bedrooms: Number(bedrooms) || 0,
                bathrooms: Number(bathrooms) || 0,
                area: String(normalizedArea),
                photos: normalizedPhotos,
                images: normalizedImages,
                sellerId: user.uid,
                sellerClientId: user.sellerClientId,
                // Paid seller flow: listing becomes visible immediately unless caller overrides.
                status: typeof status === 'string' && status.trim() ? status : 'active',
            },
        });

        const userPlanId = (req as any).userPlan?.id as string | undefined;
        if (userPlanId) {
            const usageStats = ((req as any).userPlan?.usageStats as Record<string, any> | null) || {};
            await prisma.subscription
                .update({
                    where: { id: userPlanId },
                    data: {
                        usageStats: {
                            ...usageStats,
                            listingsUsed: Number(usageStats.listingsUsed || 0) + 1,
                        },
                    },
                })
                .catch(() => null);
        }

        res.status(201).json({ success: true, data: property });
    } catch (error) {
        console.error('createProperty error:', error);
        res.status(500).json({ success: false, error: 'Failed to create property' });
    }
};

export const searchProperties = async (req: Request, res: Response) => {
    try {
        const { limit = 10, city, propertyType, listingType, recommendedFor } = req.query;
        console.log('Searching properties:', { city, propertyType, listingType, recommendedFor });

        const where: any = { status: 'active' };

        if (city) {
            where.city = {
                contains: String(city),
                mode: 'insensitive',
            };
        }

        if (propertyType && propertyType !== 'all') {
            where.propertyType = String(propertyType);
        }

        if (listingType && listingType !== 'all') {
            where.listingType = String(listingType);
        }

        const limitNum = Math.min(Number(limit) || 10, 50);

        const properties = await prisma.property.findMany({
            where,
            take: limitNum,
            orderBy: { createdAt: 'desc' },
        });

        res.json({
            success: true,
            properties,
            count: properties.length,
        });
    } catch (error: any) {
        console.error('searchProperties error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to search properties',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined,
        });
    }
};

export const getPropertyById = async (req: Request, res: Response) => {
    try {
        const property = await prisma.property.findUnique({
            where: { id: req.params.id },
        });

        if (!property) {
            return res.status(404).json({ success: false, error: 'Property not found' });
        }

        const authUserId = (req as any).user?.userId || (req as any).user?.id;
        if (!authUserId) {
            // Public route support (marketing pages).
            return res.json({ success: true, data: property });
        }

        const requester = await resolveUserByUidOrId(authUserId);
        if (!requester) {
            return res.status(401).json({ success: false, error: 'User not authenticated' });
        }

        const role = String(requester.role || '').toLowerCase();
        const isOwner = requester.uid === property.sellerId;
        const isPrivileged = role === 'admin' || role === 'employee';

        if (!isOwner && !isPrivileged && role === 'buyer') {
            const canView = await hasActiveBuyerPlan(requester.id);
            if (!canView) {
                return res.status(403).json({
                    success: false,
                    error: 'Active buyer plan required to view property details',
                    code: 'PLAN_REQUIRED',
                    redirectTo: '/dashboard/pricing',
                });
            }
        }

        res.json({ success: true, data: property });
    } catch (error) {
        console.error('getPropertyById error:', error);
        res.status(500).json({ success: false, error: 'Failed to get property' });
    }
};

export const getUserProperties = async (req: Request, res: Response) => {
    try {
        const requestedUserId = req.params.userId || (req as any).user?.userId;
        const user = await resolveUserByUidOrId(requestedUserId);
        const sellerUid = user?.uid || requestedUserId;

        const properties = await prisma.property.findMany({
            where: { sellerId: sellerUid },
            orderBy: { createdAt: 'desc' },
        });
        res.json({ success: true, properties });
    } catch (error) {
        console.error('getUserProperties error:', error);
        res.status(500).json({ success: false, error: 'Failed to get user properties' });
    }
};

export const trackPropertyView = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const authHeader = req.headers.authorization;
        let userId = 'guest-' + (req.ip || 'unknown');

        if (authHeader && authHeader.startsWith('Bearer ')) {
            try {
                const token = authHeader.substring(7);
                if (token !== 'demo-token') {
                    const { verifyToken } = require('../utils/jwt');
                    const decoded = verifyToken(token);
                    if (decoded && decoded.userId) {
                        userId = decoded.userId;
                    }
                } else {
                    userId = 'demo-buyer';
                }
            } catch {
                // Ignore invalid tokens
            }
        }

        const property = await prisma.property.findUnique({
            where: { id },
            select: { viewedBy: true, views: true },
        });

        if (!property) {
            return res.status(404).json({ success: false, error: 'Property not found' });
        }

        if (!property.viewedBy.includes(userId)) {
            const updatedProperty = await prisma.property.update({
                where: { id },
                data: {
                    views: { increment: 1 },
                    viewedBy: { push: userId },
                },
            });

            const io = req.app.get('io');
            if (io) {
                io.emit('property:view_update', {
                    propertyId: id,
                    views: updatedProperty?.views,
                });
            }

            return res.json({ success: true, views: updatedProperty?.views, updated: true });
        }

        res.json({ success: true, views: property.views, updated: false });
    } catch (error) {
        console.error('trackPropertyView error:', error);
        res.status(500).json({ success: false, error: 'Failed to track view' });
    }
};

export const uploadPropertyImage = async (req: Request, res: Response) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, error: 'No image file provided' });
        }

        const result = await uploadFile(
            req.file.buffer,
            req.file.originalname,
            req.file.mimetype
        );

        res.json({
            success: true,
            url: result.url,
            thumbnailUrl: result.thumbnailUrl,
        });
    } catch (error: any) {
        console.error('uploadPropertyImage error:', error);
        res.status(500).json({ success: false, error: error.message || 'Failed to upload image' });
    }
};

export const getMarketInsights = async (req: Request, res: Response) => {
    try {
        const totalProperties = await prisma.property.count({
            where: { status: 'active' },
        });

        const cityStatsSummary = await prisma.property.groupBy({
            by: ['city'],
            where: { status: 'active' },
            _avg: { price: true },
            _count: { _all: true },
            orderBy: { _count: { city: 'desc' } },
            take: 5,
        });

        const cityStats = cityStatsSummary.map((s: any) => ({
            _id: s.city,
            avgPrice: s._avg.price,
            count: s._count._all,
        }));

        const trends = [
            { month: 'Jan', count: Math.floor(totalProperties * 0.8) },
            { month: 'Feb', count: Math.floor(totalProperties * 0.9) },
            { month: 'Mar', count: totalProperties },
        ];

        res.json({
            success: true,
            totalProperties,
            cityStats,
            trends,
            marketStatus: totalProperties > 10 ? 'High Activity' : 'Moderate Activity',
        });
    } catch (error: any) {
        console.error('getMarketInsights error:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch market insights' });
    }
};

export const updateProperty = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const authUserId = (req as any).user?.userId || (req as any).user?.id;
        const requester = await resolveUserByUidOrId(authUserId);
        if (!requester) {
            return res.status(401).json({ success: false, error: 'User not authenticated' });
        }

        const property = await prisma.property.findUnique({ where: { id } });
        if (!property) {
            return res.status(404).json({ success: false, error: 'Property not found' });
        }

        const role = String(requester.role || '').toLowerCase();
        const isPrivileged = role === 'admin' || role === 'employee';
        if (!isPrivileged && property.sellerId !== requester.uid) {
            return res.status(403).json({ success: false, error: 'Not authorized to update this property' });
        }

        const payload = { ...(req.body || {}) };
        if (payload.price !== undefined) payload.price = Number(payload.price);
        if (payload.bedrooms !== undefined) payload.bedrooms = Number(payload.bedrooms);
        if (payload.bathrooms !== undefined) payload.bathrooms = Number(payload.bathrooms);
        if (payload.area !== undefined) payload.area = String(payload.area);

        const updated = await prisma.property.update({
            where: { id },
            data: payload,
        });

        res.json({ success: true, data: updated });
    } catch (error) {
        console.error('updateProperty error:', error);
        res.status(500).json({ success: false, error: 'Failed to update property' });
    }
};

export const deleteProperty = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const authUserId = (req as any).user?.userId || (req as any).user?.id;
        const requester = await resolveUserByUidOrId(authUserId);
        if (!requester) {
            return res.status(401).json({ success: false, error: 'User not authenticated' });
        }

        const property = await prisma.property.findUnique({ where: { id } });
        if (!property) {
            return res.status(404).json({ success: false, error: 'Property not found' });
        }

        const role = String(requester.role || '').toLowerCase();
        const isPrivileged = role === 'admin' || role === 'employee';
        if (!isPrivileged && property.sellerId !== requester.uid) {
            return res.status(403).json({ success: false, error: 'Not authorized to delete this property' });
        }

        await prisma.property.delete({ where: { id } });
        res.json({ success: true, message: 'Property deleted successfully' });
    } catch (error) {
        console.error('deleteProperty error:', error);
        res.status(500).json({ success: false, error: 'Failed to delete property' });
    }
};
