import { Request, Response } from 'express';
import Bid from '../models/bid.model';
import Property from '../models/property.model';
import Notification from '../models/notification.model';
import User from '../models/user.model';
import { sendEmail } from '../utils/email.service';

/**
 * Create a new bid on a property
 * @route POST /api/v1/bids
 * @access Private (Buyer)
 */
export const createBid = async (req: Request, res: Response) => {
    try {
        const { propertyId, bidAmount, message } = req.body;
        const buyerId = (req as any).user?.id;

        if (!buyerId) {
            return res.status(401).json({
                success: false,
                message: 'User not authenticated'
            });
        }

        // Get property to find seller
        const property = await Property.findById(propertyId);
        if (!property) {
            return res.status(404).json({
                success: false,
                message: 'Property not found'
            });
        }

        // Create bid
        const bid = await Bid.create({
            propertyId,
            buyerId,
            sellerId: property.sellerId,
            bidAmount,
            message,
            status: 'pending'
        });

        // Create notification for seller
        await Notification.create({
            userId: property.sellerId,
            type: 'bid_received',
            title: 'New Bid Received',
            message: `You received a new bid of ₹${bidAmount.toLocaleString()} for "${property.title}"`,
            link: `/dashboard/bids`,
            priority: 'high',
            metadata: { bidId: bid._id, propertyId: property._id }
        });

        // Send email to seller
        const seller = await User.findOne({ uid: property.sellerId });
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
        const sellerId = (req as any).user?.id;
        const { status } = req.query;

        if (!sellerId) {
            return res.status(401).json({
                success: false,
                message: 'User not authenticated'
            });
        }

        const query: any = { sellerId };
        if (status) {
            query.status = status;
        }

        const bids = await Bid.find(query)
            .populate('propertyId', 'title location price images')
            .sort({ createdAt: -1 });

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
        const buyerId = (req as any).user?.id;
        const { status } = req.query;

        if (!buyerId) {
            return res.status(401).json({
                success: false,
                message: 'User not authenticated'
            });
        }

        const query: any = { buyerId };
        if (status) {
            query.status = status;
        }

        const bids = await Bid.find(query)
            .populate('propertyId', 'title location price images')
            .sort({ createdAt: -1 });

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
        const sellerId = (req as any).user?.id;

        if (!sellerId) {
            return res.status(401).json({
                success: false,
                message: 'User not authenticated'
            });
        }

        const bid = await Bid.findById(id);
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
        bid.status = status;
        if (status === 'countered') {
            bid.counterAmount = counterAmount;
            bid.counterMessage = counterMessage;
        }
        await bid.save();

        // Create notification for buyer
        const buyerNotification = {
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
            metadata: { bidId: bid._id, propertyId: bid.propertyId }
        };
        await Notification.create(buyerNotification);

        // Send email to buyer
        const buyer = await User.findOne({ uid: bid.buyerId });
        if (buyer && buyer.email) {
            const subject = `Bid ${status.charAt(0).toUpperCase() + status.slice(1)} - GharBazaar`;
            const property = await Property.findById(bid.propertyId);
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
            data: bid
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
        const sellerId = (req as any).user?.id;

        if (!sellerId) {
            return res.status(401).json({
                success: false,
                message: 'User not authenticated'
            });
        }

        // Verify seller owns the property
        const property = await Property.findById(propertyId);
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

        const bids = await Bid.find({ propertyId })
            .sort({ createdAt: -1 });

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
