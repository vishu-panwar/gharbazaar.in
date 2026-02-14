import { Request, Response } from 'express';
import { prisma } from '../utils/prisma';
import { sendEmail } from '../utils/email.service';

/**
 * Create a new bid on a property
 * @route POST /api/v1/bids
 * @access Private (Buyer)
 */
export const createBid = async (req: Request, res: Response) => {
    try {
        const { propertyId, bidAmount, message } = req.body;
        const buyerId = (req as any).user?.userId; // Note: using userId from token which should be uid

        if (!buyerId) {
            return res.status(401).json({
                success: false,
                message: 'User not authenticated'
            });
        }

        // Get property to find seller
        const property = await prisma.property.findUnique({
            where: { id: propertyId }
        });

        if (!property) {
            return res.status(404).json({
                success: false,
                message: 'Property not found'
            });
        }

        // Create bid
        const bid = await prisma.bid.create({
            data: {
                propertyId,
                buyerId,
                sellerId: property.sellerId,
                bidAmount,
                message,
                status: 'pending'
            }
        });

        // Create notification for seller
        await prisma.notification.create({
            data: {
                userId: property.sellerId,
                type: 'bid_received',
                title: 'New Bid Received',
                message: `You received a new bid of ₹${bidAmount.toLocaleString()} for "${property.title}"`,
                link: `/dashboard/bids`,
                priority: 'high',
                metadata: JSON.stringify({ bidId: bid.id, propertyId: property.id })
            }
        });

        // Send email to seller
        const seller = await prisma.user.findUnique({ where: { uid: property.sellerId } });
        if (seller && seller.email) {
            await sendEmail({
                email: seller.email,
                subject: 'New Bid Received - GharBazaar',
                message: `You received a new bid of ₹${bidAmount.toLocaleString()} for "${property.title}"`,
                html: `<h3>New Bid!</h3><p>You received a new bid for <b>${property.title}</b>.</p><p>Amount: ₹${bidAmount.toLocaleString()}</p><p><a href="${process.env.FRONTEND_URL}/dashboard/bids">View Bid</a></p>`
            }).catch(e => console.error('Email send failed:', e.message));
        }

        res.status(201).json({
            success: true,
            message: 'Bid placed successfully',
            data: bid
        });
    } catch (error: any) {
        console.error('Error creating bid:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create bid',
            error: error.message
        });
    }
};

/**
 * Get bids for seller's properties
 * @route GET /api/v1/bids/seller
 * @access Private (Seller)
 */
export const getSellerBids = async (req: Request, res: Response) => {
    try {
        const sellerId = (req as any).user?.userId;
        const { status } = req.query;

        if (!sellerId) {
            return res.status(401).json({
                success: false,
                message: 'User not authenticated'
            });
        }

        const where: any = { sellerId };
        if (status) {
            where.status = status as string;
        }

        const bids = await prisma.bid.findMany({
            where,
            include: {
                property: {
                    select: {
                        title: true,
                        location: true,
                        price: true,
                        images: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        res.status(200).json({
            success: true,
            data: bids
        });
    } catch (error: any) {
        console.error('Error fetching seller bids:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch bids',
            error: error.message
        });
    }
};

/**
 * Get bids placed by buyer
 * @route GET /api/v1/bids/buyer
 * @access Private (Buyer)
 */
export const getBuyerBids = async (req: Request, res: Response) => {
    try {
        const buyerId = (req as any).user?.userId;
        const { status } = req.query;

        if (!buyerId) {
            return res.status(401).json({
                success: false,
                message: 'User not authenticated'
            });
        }

        const where: any = { buyerId };
        if (status) {
            where.status = status as string;
        }

        const bids = await prisma.bid.findMany({
            where,
            include: {
                property: {
                    select: {
                        title: true,
                        location: true,
                        price: true,
                        images: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        res.status(200).json({
            success: true,
            data: bids
        });
    } catch (error: any) {
        console.error('Error fetching buyer bids:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch bids',
            error: error.message
        });
    }
};

/**
 * Update bid status (accept/reject/counter)
 * @route PATCH /api/v1/bids/:id
 * @access Private (Seller)
 */
export const updateBidStatus = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { status, counterAmount, counterMessage } = req.body;
        const sellerId = (req as any).user?.userId;

        if (!sellerId) {
            return res.status(401).json({
                success: false,
                message: 'User not authenticated'
            });
        }

        const bid = await prisma.bid.findUnique({
            where: { id }
        });

        if (!bid) {
            return res.status(404).json({
                success: false,
                message: 'Bid not found'
            });
        }

        // Verify seller owns this bid
        if (bid.sellerId !== sellerId) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update this bid'
            });
        }

        // Update bid
        const updatedBid = await prisma.bid.update({
            where: { id },
            data: {
                status,
                counterAmount: status === 'countered' ? counterAmount : undefined,
                counterMessage: status === 'countered' ? counterMessage : undefined
            }
        });

        if (status === 'accepted') {
            const existing = await prisma.contract.findUnique({
                where: { bidId: id }
            });

            if (!existing) {
                await prisma.contract.create({
                    data: {
                        propertyId: bid.propertyId,
                        bidId: bid.id,
                        buyerId: bid.buyerId,
                        sellerId: bid.sellerId,
                        agreedPrice: bid.counterAmount || bid.bidAmount
                    }
                });
            }
        }

        // Create notification for buyer
        await prisma.notification.create({
            data: {
                userId: bid.buyerId,
                type: status === 'accepted' ? 'bid_accepted' : status === 'rejected' ? 'bid_rejected' : 'bid_received',
                title: `Bid ${status.charAt(0).toUpperCase() + status.slice(1)}`,
                message: status === 'accepted'
                    ? `Congratulations! Your bid for a property has been accepted.`
                    : status === 'rejected'
                        ? `Your bid for a property has been rejected.`
                        : `The seller has sent a counter offer for your bid.`,
                link: `/dashboard/bids`,
                priority: status === 'accepted' ? 'high' : 'medium',
                metadata: JSON.stringify({ bidId: bid.id, propertyId: bid.propertyId })
            }
        });

        // Send email to buyer
        const buyer = await prisma.user.findUnique({ where: { uid: bid.buyerId } });
        if (buyer && buyer.email) {
            const subject = `Bid ${status.charAt(0).toUpperCase() + status.slice(1)} - GharBazaar`;
            const property = await prisma.property.findUnique({ where: { id: bid.propertyId } });
            await sendEmail({
                email: buyer.email,
                subject,
                message: `Your bid for "${property?.title || 'a property'}" has been ${status}.`,
                html: `<h3>Bid ${status.charAt(0).toUpperCase() + status.slice(1)}</h3><p>Your bid for <b>${property?.title || 'the property'}</b> has been ${status}.</p><p><a href="${process.env.FRONTEND_URL}/dashboard/bids">View Details</a></p>`
            }).catch(e => console.error('Email send failed:', e.message));
        }

        res.status(200).json({
            success: true,
            message: `Bid ${status} successfully`,
            data: updatedBid
        });
    } catch (error: any) {
        console.error('Error updating bid:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update bid',
            error: error.message
        });
    }
};

/**
 * Get bids for a specific property
 * @route GET /api/v1/bids/property/:propertyId
 * @access Private (Seller who owns the property)
 */
export const getPropertyBids = async (req: Request, res: Response) => {
    try {
        const { propertyId } = req.params;
        const sellerId = (req as any).user?.userId;

        if (!sellerId) {
            return res.status(401).json({
                success: false,
                message: 'User not authenticated'
            });
        }

        // Verify seller owns the property
        const property = await prisma.property.findUnique({
            where: { id: propertyId }
        });

        if (!property) {
            return res.status(404).json({
                success: false,
                message: 'Property not found'
            });
        }

        if (property.sellerId !== sellerId) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to view bids for this property'
            });
        }

        const bids = await prisma.bid.findMany({
            where: { propertyId },
            orderBy: { createdAt: 'desc' }
        });

        res.status(200).json({
            success: true,
            data: bids
        });
    } catch (error: any) {
        console.error('Error fetching property bids:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch property bids',
            error: error.message
        });
    }
};
