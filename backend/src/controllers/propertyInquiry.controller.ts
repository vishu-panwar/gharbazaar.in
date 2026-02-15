import { Request, Response } from 'express';
import { prisma } from '../utils/prisma';

// @desc    Create property inquiry
// @route   POST /api/v1/properties/:id/inquiries
// @access  Public/Private
export const createInquiry = async (req: Request, res: Response) => {
    try {
        const { id: propertyId } = req.params;
        const { name, email, phone, message, inquiryType } = req.body;
        const userId = (req as any).user?.uid;

        // Validate required fields
        if (!name || !email || !phone) {
            return res.status(400).json({
                success: false,
                message: 'Name, email, and phone are required',
            });
        }

        // Get property to validate and get seller ID
        const property = await prisma.property.findUnique({
            where: { id: propertyId },
            select: { sellerId: true, deletedAt: true },
        });

        if (!property || property.deletedAt) {
            return res.status(404).json({
                success: false,
                message: 'Property not found',
            });
        }

        // Create inquiry
        const inquiry = await prisma.propertyInquiry.create({
            data: {
                propertyId,
                sellerId: property.sellerId,
                buyerId: userId || null,
                name,
                email,
                phone,
                message,
                inquiryType: inquiryType || 'general',
                source: 'website',
                leadScore: 50, // Default lead score
            },
            include: {
                property: {
                    select: {
                        id: true,
                        title: true,
                        price: true,
                        city: true,
                    },
                },
                buyer: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
        });

        // Increment property inquiries count
        await prisma.property.update({
            where: { id: propertyId },
            data: { inquiries: { increment: 1 } },
        });

        res.status(201).json({
            success: true,
            message: 'Inquiry created successfully',
            data: inquiry,
        });
    } catch (error: any) {
        console.error('Create inquiry error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create inquiry',
            error: error.message,
        });
    }
};

// @desc    Get all inquiries (with filters)
// @route   GET /api/v1/inquiries
// @access  Private
export const getInquiries = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.uid;
        const userRole = (req as any).user?.role;
        const {
            status,
            propertyId,
            sellerId,
            buyerId,
            priority,
            page = '1',
            limit = '10',
        } = req.query;

        const pageNum = parseInt(page as string, 10);
        const limitNum = parseInt(limit as string, 10);
        const skip = (pageNum - 1) * limitNum;

        // Build filter
        const where: any = {};

        // Role-based filtering
        if (userRole === 'seller') {
            where.sellerId = userId;
        } else if (userRole === 'buyer') {
            where.OR = [{ buyerId: userId }, { email: (req as any).user?.email }];
        }

        // Additional filters
        if (status) where.status = status;
        if (propertyId) where.propertyId = propertyId;
        if (sellerId) where.sellerId = sellerId;
        if (buyerId) where.buyerId = buyerId;
        if (priority) where.priority = priority;

        const [inquiries, total] = await Promise.all([
            prisma.propertyInquiry.findMany({
                where,
                include: {
                    property: {
                        select: {
                            id: true,
                            title: true,
                            price: true,
                            city: true,
                            images: true,
                        },
                    },
                    buyer: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                        },
                    },
                    seller: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                        },
                    },
                },
                orderBy: { createdAt: 'desc' },
                skip,
                take: limitNum,
            }),
            prisma.propertyInquiry.count({ where }),
        ]);

        res.json({
            success: true,
            data: inquiries,
            pagination: {
                page: pageNum,
                limit: limitNum,
                total,
                pages: Math.ceil(total / limitNum),
            },
        });
    } catch (error: any) {
        console.error('Get inquiries error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch inquiries',
            error: error.message,
        });
    }
};

// @desc    Get inquiry by ID
// @route   GET /api/v1/inquiries/:id
// @access  Private
export const getInquiryById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const inquiry = await prisma.propertyInquiry.findUnique({
            where: { id },
            include: {
                property: {
                    select: {
                        id: true,
                        title: true,
                        price: true,
                        city: true,
                        address: true,
                        images: true,
                        propertyType: true,
                        bedrooms: true,
                        bathrooms: true,
                    },
                },
                buyer: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        phone: true,
                    },
                },
                seller: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        phone: true,
                    },
                },
            },
        });

        if (!inquiry) {
            return res.status(404).json({
                success: false,
                message: 'Inquiry not found',
            });
        }

        res.json({
            success: true,
            data: inquiry,
        });
    } catch (error: any) {
        console.error('Get inquiry error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch inquiry',
            error: error.message,
        });
    }
};

// @desc    Update inquiry status
// @route   PATCH /api/v1/inquiries/:id/status
// @access  Private (Seller/Admin)
export const updateInquiryStatus = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const userId = (req as any).user?.uid;

        const validStatuses = ['new', 'contacted', 'interested', 'not_interested', 'converted'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status',
            });
        }

        const inquiry = await prisma.propertyInquiry.update({
            where: { id },
            data: {
                status,
                respondedAt: status !== 'new' ? new Date() : undefined,
                respondedBy: status !== 'new' ? userId : undefined,
            },
            include: {
                property: {
                    select: {
                        id: true,
                        title: true,
                    },
                },
            },
        });

        res.json({
            success: true,
            message: 'Inquiry status updated',
            data: inquiry,
        });
    } catch (error: any) {
        console.error('Update inquiry status error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update inquiry status',
            error: error.message,
        });
    }
};

// @desc    Record inquiry response
// @route   PATCH /api/v1/inquiries/:id/respond
// @access  Private (Seller/Admin)
export const respondToInquiry = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { priority, leadScore, notes } = req.body;
        const userId = (req as any).user?.uid;

        const updateData: any = {
            respondedAt: new Date(),
            respondedBy: userId,
        };

        if (priority) updateData.priority = priority;
        if (leadScore !== undefined) updateData.leadScore = leadScore;
        if (notes !== undefined) {
            updateData.metadata = {
                notes,
            };
        }

        const inquiry = await prisma.propertyInquiry.update({
            where: { id },
            data: updateData,
        });

        res.json({
            success: true,
            message: 'Response recorded',
            data: inquiry,
        });
    } catch (error: any) {
        console.error('Respond to inquiry error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to record response',
            error: error.message,
        });
    }
};

// @desc    Delete inquiry
// @route   DELETE /api/v1/inquiries/:id
// @access  Private (Admin/Seller)
export const deleteInquiry = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        await prisma.propertyInquiry.delete({
            where: { id },
        });

        res.json({
            success: true,
            message: 'Inquiry deleted successfully',
        });
    } catch (error: any) {
        console.error('Delete inquiry error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete inquiry',
            error: error.message,
        });
    }
};
