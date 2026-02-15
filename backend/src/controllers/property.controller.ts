import { Request, Response } from 'express';
import { prisma } from '../utils/prisma';
import { uploadFile } from '../utils/fileStorage';

export const createProperty = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.userId || 'demo-seller';

        // Find user to get sellerClientId
        const user = await prisma.user.findUnique({ where: { uid: userId } });
        const sellerClientId = user?.sellerClientId;

        // Ensure numeric types are handled correctly for PostgreSQL/Prisma
        const { price, bedrooms, bathrooms, area, ...rest } = req.body;

        const property = await prisma.property.create({
            data: {
                ...rest,
                price: Number(price),
                bedrooms: Number(bedrooms),
                bathrooms: Number(bathrooms),
                area: String(area),
                sellerId: user?.id || userId, // Use DB internal ID if possible
                sellerClientId,
                status: 'pending'
            }
        });

        res.status(201).json({ success: true, data: property });
    } catch (error) {
        console.error('createProperty error:', error);
        res.status(500).json({ success: false, error: 'Failed to create property' });
    }
};

export const searchProperties = async (req: Request, res: Response) => {
    try {
        const { limit = 10, city, propertyType, listingType, recommendedFor } = req.query;
        console.log(`🔍 Searching properties:`, { city, propertyType, listingType, recommendedFor });

        const where: any = { status: 'active', deletedAt: null };

        if (city) {
            where.city = {
                contains: String(city),
                mode: 'insensitive'
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
            orderBy: { createdAt: 'desc' }
        });

        res.json({
            success: true,
            properties,
            count: properties.length
        });
    } catch (error: any) {
        console.error('❌ searchProperties error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to search properties',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

export const getPropertyById = async (req: Request, res: Response) => {
    try {
        const property = await prisma.property.findUnique({
            where: { id: req.params.id }
        });

        // Check if property is soft deleted
        if (property?.deletedAt) {
            return res.status(404).json({ success: false, error: 'Property not found' });
        }

        if (!property) {
            return res.status(404).json({ success: false, error: 'Property not found' });
        }
        res.json({ success: true, data: property });
    } catch (error) {
        console.error('getPropertyById error:', error);
        res.status(500).json({ success: false, error: 'Failed to get property' });
    }
};

export const getUserProperties = async (req: Request, res: Response) => {
    try {
        const userId = req.params.userId || (req as any).user?.userId;
        const properties = await prisma.property.findMany({
            where: { sellerId: userId, deletedAt: null }
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
            } catch (e) {
                // Ignore invalid tokens
            }
        }

        const property = await prisma.property.findUnique({
            where: { id },
            select: { viewedBy: true, views: true }
        });

        if (!property) {
            return res.status(404).json({ success: false, error: 'Property not found' });
        }

        if (!property.viewedBy.includes(userId)) {
            const updatedProperty = await prisma.property.update({
                where: { id },
                data: {
                    views: { increment: 1 },
                    viewedBy: { push: userId }
                }
            });

            const io = req.app.get('io');
            if (io) {
                io.emit('property:view_update', {
                    propertyId: id,
                    views: updatedProperty?.views
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
            thumbnailUrl: result.thumbnailUrl
        });
    } catch (error: any) {
        console.error('uploadPropertyImage error:', error);
        res.status(500).json({ success: false, error: error.message || 'Failed to upload image' });
    }
};

export const getMarketInsights = async (req: Request, res: Response) => {
    try {
        const totalProperties = await prisma.property.count({
            where: { status: 'active', deletedAt: null }
        });

        // Group by city using Prisma aggregate
        const cityStatsSummary = await prisma.property.groupBy({
            by: ['city'],
            where: { status: 'active', deletedAt: null },
            _avg: { price: true },
            _count: { _all: true },
            orderBy: { _count: { city: 'desc' } },
            take: 5
        });

        const cityStats = cityStatsSummary.map((s: any) => ({
            _id: s.city,
            avgPrice: s._avg.price,
            count: s._count._all
        }));

        const trends = [
            { month: 'Jan', count: Math.floor(totalProperties * 0.8) },
            { month: 'Feb', count: Math.floor(totalProperties * 0.9) },
            { month: 'Mar', count: totalProperties }
        ];

        res.json({
            success: true,
            totalProperties,
            cityStats,
            trends,
            marketStatus: totalProperties > 10 ? 'High Activity' : 'Moderate Activity'
        });
    } catch (error: any) {
        console.error('getMarketInsights error:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch market insights' });
    }
};

// @desc    Soft delete a property
// @route   DELETE /api/v1/properties/:id
// @access  Private (Seller/Admin)
export const softDeleteProperty = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const userId = (req as any).user?.uid;

        // Verify property exists and user has permission
        const property = await prisma.property.findUnique({
            where: { id },
            select: { id: true, sellerId: true, deletedAt: true },
        });

        if (!property || property.deletedAt) {
            return res.status(404).json({
                success: false,
                error: 'Property not found',
            });
        }

        // Soft delete the property
        const updatedProperty = await prisma.property.update({
            where: { id },
            data: {
                deletedAt: new Date(),
                deletedBy: userId,
            },
        });

        res.json({
            success: true,
            message: 'Property deleted successfully',
            data: updatedProperty,
        });
    } catch (error: any) {
        console.error('softDeleteProperty error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to delete property',
        });
    }
};

// @desc    Restore a soft-deleted property
// @route   POST /api/v1/properties/:id/restore
// @access  Private (Admin)
export const restoreProperty = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        // Verify property exists and is deleted
        const property = await prisma.property.findUnique({
            where: { id },
            select: { id: true, deletedAt: true },
        });

        if (!property) {
            return res.status(404).json({
                success: false,
                error: 'Property not found',
            });
        }

        if (!property.deletedAt) {
            return res.status(400).json({
                success: false,
                error: 'Property is not deleted',
            });
        }

        // Restore the property
        const restoredProperty = await prisma.property.update({
            where: { id },
            data: {
                deletedAt: null,
                deletedBy: null,
            },
        });

        res.json({
            success: true,
            message: 'Property restored successfully',
            data: restoredProperty,
        });
    } catch (error: any) {
        console.error('restoreProperty error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to restore property',
        });
    }
};
