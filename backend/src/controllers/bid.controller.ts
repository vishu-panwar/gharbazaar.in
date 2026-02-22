import { Request, Response } from 'express';
import { prisma } from '../utils/prisma';
import { sendEmail } from '../utils/email.service';

const UUID_REGEX =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const ALLOWED_BID_STATUSES = new Set(['pending', 'accepted', 'rejected', 'countered']);

const resolveInternalUserId = async (uidOrId?: string | null): Promise<string | null> => {
    const value = (uidOrId || '').trim();
    if (!value) return null;

    const byUid = await prisma.user.findUnique({
        where: { uid: value },
        select: { id: true },
    });
    if (byUid) return byUid.id;

    if (!UUID_REGEX.test(value)) return null;

    const byId = await prisma.user.findUnique({
        where: { id: value },
        select: { id: true },
    });

    return byId?.id || null;
};

const resolveUserByUidOrId = async (uidOrId?: string | null) => {
    const value = (uidOrId || '').trim();
    if (!value) return null;

    const byUid = await prisma.user.findUnique({
        where: { uid: value },
        select: { id: true, uid: true, role: true, email: true, name: true },
    });
    if (byUid) return byUid;

    if (!UUID_REGEX.test(value)) return null;

    return prisma.user.findUnique({
        where: { id: value },
        select: { id: true, uid: true, role: true, email: true, name: true },
    });
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

const ensureBuyerSellerConversation = async (params: {
    buyerUid: string;
    sellerUid: string;
    propertyId: string;
    propertyTitle?: string | null;
    initialMessage?: string | null;
}) => {
    const buyer = await prisma.user.findUnique({
        where: { uid: params.buyerUid },
        select: { id: true },
    });
    const seller = await prisma.user.findUnique({
        where: { uid: params.sellerUid },
        select: { id: true },
    });

    if (!buyer || !seller) return null;

    const existingConversations = await prisma.conversation.findMany({
        where: {
            propertyId: params.propertyId,
            conversationType: 'buyer-seller',
            participants: {
                some: {
                    userId: { in: [buyer.id, seller.id] },
                },
            },
        },
        include: {
            participants: {
                select: { userId: true },
            },
        },
    });

    let conversation = existingConversations.find((conv: any) => {
        const participantIds = new Set(conv.participants.map((p: any) => p.userId));
        return participantIds.has(buyer.id) && participantIds.has(seller.id) && participantIds.size === 2;
    });

    if (!conversation) {
        conversation = await prisma.conversation.create({
            data: {
                conversationType: 'buyer-seller',
                propertyId: params.propertyId,
                propertyTitle: params.propertyTitle || null,
                lastMessage: params.initialMessage ? params.initialMessage.slice(0, 100) : '',
                lastMessageAt: new Date(),
                participants: {
                    create: [
                        { user: { connect: { id: buyer.id } } },
                        { user: { connect: { id: seller.id } } },
                    ],
                },
            },
            include: {
                participants: {
                    select: { userId: true },
                },
            },
        });
    }

    if (params.initialMessage) {
        await prisma.message.create({
            data: {
                conversationId: conversation.id,
                senderId: buyer.id,
                content: params.initialMessage,
                messageType: 'text',
                isRead: false,
            },
        });

        await prisma.conversation.update({
            where: { id: conversation.id },
            data: {
                lastMessage: params.initialMessage.slice(0, 100),
                lastMessageAt: new Date(),
            },
        });
    }

    return conversation;
};

/**
 * Create a new bid on a property
 * @route POST /api/v1/bids
 * @access Private (Buyer)
 */
export const createBid = async (req: Request, res: Response) => {
    try {
        const { propertyId, message } = req.body;
        const rawAmount = req.body?.bidAmount ?? req.body?.amount;
        const buyerIdentifier = (req as any).user?.userId;
        const bidAmount = Number(rawAmount);

        if (!buyerIdentifier) {
            return res.status(401).json({
                success: false,
                message: 'User not authenticated',
            });
        }

        if (!propertyId || !Number.isFinite(bidAmount) || bidAmount <= 0) {
            return res.status(400).json({
                success: false,
                message: 'propertyId and a valid bid amount are required',
            });
        }

        const buyer = await resolveUserByUidOrId(buyerIdentifier);
        if (!buyer) {
            return res.status(404).json({
                success: false,
                message: 'Buyer profile not found',
            });
        }

        const canBid = await hasActiveBuyerPlan(buyer.id);
        if (!canBid) {
            return res.status(403).json({
                success: false,
                message: 'Active buyer plan required to send inquiry',
                code: 'PLAN_REQUIRED',
                redirectTo: '/dashboard/pricing',
            });
        }

        const property = await prisma.property.findUnique({
            where: { id: propertyId },
        });

        if (!property) {
            return res.status(404).json({
                success: false,
                message: 'Property not found',
            });
        }

        if (property.sellerId === buyer.uid) {
            return res.status(400).json({
                success: false,
                message: 'You cannot place inquiry on your own property',
            });
        }

        if (property.status !== 'active') {
            return res.status(400).json({
                success: false,
                message: 'This property is not currently accepting inquiries',
            });
        }

        const bid = await prisma.bid.create({
            data: {
                propertyId,
                buyerId: buyer.uid,
                sellerId: property.sellerId,
                bidAmount,
                message: message || null,
                status: 'pending',
            },
        });

        await prisma.property
            .update({
                where: { id: propertyId },
                data: {
                    inquiries: { increment: 1 },
                },
            })
            .catch(() => null);

        const conversation = await ensureBuyerSellerConversation({
            buyerUid: buyer.uid,
            sellerUid: property.sellerId,
            propertyId: property.id,
            propertyTitle: property.title,
            initialMessage: message || `Hi, I am interested in "${property.title}"`,
        });

        const sellerInternalId = await resolveInternalUserId(property.sellerId);
        if (sellerInternalId) {
            await prisma.notification.create({
                data: {
                    userId: sellerInternalId,
                    type: 'inquiry',
                    title: 'New Property Inquiry',
                    message: `You received a new bid of INR ${bidAmount.toLocaleString()} for "${property.title}"`,
                    link: '/dashboard/inquiries',
                    priority: 'high',
                    metadata: JSON.stringify({
                        bidId: bid.id,
                        propertyId: property.id,
                        conversationId: conversation?.id || null,
                    }),
                },
            });
        }

        const seller = await prisma.user.findUnique({ where: { uid: property.sellerId } });
        if (seller?.email) {
            await sendEmail({
                email: seller.email,
                subject: 'New Bid Received - GharBazaar',
                message: `You received a new bid of INR ${bidAmount.toLocaleString()} for "${property.title}"`,
                html: `<h3>New Bid</h3><p>You received a new bid for <b>${property.title}</b>.</p><p>Amount: INR ${bidAmount.toLocaleString()}</p><p><a href="${process.env.FRONTEND_URL}/dashboard/inquiries">View Inquiry</a></p>`,
            }).catch((e) => console.error('Email send failed:', e.message));
        }

        res.status(201).json({
            success: true,
            message: 'Bid placed successfully',
            data: {
                ...bid,
                conversationId: conversation?.id || null,
            },
        });
    } catch (error: any) {
        console.error('Error creating bid:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create bid',
            error: error.message,
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
                message: 'User not authenticated',
            });
        }

        const where: any = { sellerId };
        if (status && ALLOWED_BID_STATUSES.has(String(status))) {
            where.status = status as string;
        }

        const bids = await prisma.bid.findMany({
            where,
            include: {
                buyer: {
                    select: {
                        uid: true,
                        name: true,
                        email: true,
                        phone: true,
                        profilePhoto: true,
                    },
                },
                property: {
                    select: {
                        id: true,
                        title: true,
                        location: true,
                        price: true,
                        images: true,
                        photos: true,
                        city: true,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });

        res.status(200).json({
            success: true,
            data: bids,
        });
    } catch (error: any) {
        console.error('Error fetching seller bids:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch bids',
            error: error.message,
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
                message: 'User not authenticated',
            });
        }

        const where: any = { buyerId };
        if (status && ALLOWED_BID_STATUSES.has(String(status))) {
            where.status = status as string;
        }

        const bids = await prisma.bid.findMany({
            where,
            include: {
                property: {
                    select: {
                        id: true,
                        title: true,
                        location: true,
                        price: true,
                        images: true,
                        photos: true,
                        city: true,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });

        const sellerUids = Array.from(new Set(bids.map((b: any) => b.sellerId).filter(Boolean)));
        const sellers = sellerUids.length
            ? await prisma.user.findMany({
                where: { uid: { in: sellerUids } },
                select: { uid: true, name: true, email: true, phone: true, profilePhoto: true },
            })
            : [];
        const sellerMap = new Map(sellers.map((seller: any) => [seller.uid, seller]));

        const enriched = bids.map((bid: any) => ({
            ...bid,
            seller: sellerMap.get(bid.sellerId) || null,
        }));

        res.status(200).json({
            success: true,
            data: enriched,
        });
    } catch (error: any) {
        console.error('Error fetching buyer bids:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch bids',
            error: error.message,
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
                message: 'User not authenticated',
            });
        }

        if (!status || !ALLOWED_BID_STATUSES.has(String(status))) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status',
            });
        }

        if (status === 'countered' && (!Number.isFinite(Number(counterAmount)) || Number(counterAmount) <= 0)) {
            return res.status(400).json({
                success: false,
                message: 'Valid counter amount is required for counter offer',
            });
        }

        const bid = await prisma.bid.findUnique({
            where: { id },
        });

        if (!bid) {
            return res.status(404).json({
                success: false,
                message: 'Bid not found',
            });
        }

        if (bid.sellerId !== sellerId) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update this bid',
            });
        }

        const updatedBid = await prisma.bid.update({
            where: { id },
            data: {
                status,
                counterAmount: status === 'countered' ? Number(counterAmount) : null,
                counterMessage: status === 'countered' ? counterMessage : null,
            },
        });

        if (status === 'accepted') {
            const existing = await prisma.contract.findUnique({
                where: { bidId: id },
            });

            if (!existing) {
                await prisma.contract.create({
                    data: {
                        propertyId: bid.propertyId,
                        bidId: bid.id,
                        buyerId: bid.buyerId,
                        sellerId: bid.sellerId,
                        agreedPrice: updatedBid.counterAmount || updatedBid.bidAmount,
                    },
                });
            }
        }

        const buyerInternalId = await resolveInternalUserId(bid.buyerId);
        if (buyerInternalId) {
            await prisma.notification.create({
                data: {
                    userId: buyerInternalId,
                    type: status === 'accepted' ? 'bid_accepted' : status === 'rejected' ? 'bid_rejected' : 'bid_received',
                    title: `Bid ${status.charAt(0).toUpperCase() + status.slice(1)}`,
                    message:
                        status === 'accepted'
                            ? 'Congratulations! Your bid for a property has been accepted.'
                            : status === 'rejected'
                                ? 'Your bid for a property has been rejected.'
                                : 'The seller has sent a counter offer for your bid.',
                    link: '/dashboard/proposals',
                    priority: status === 'accepted' ? 'high' : 'medium',
                    metadata: JSON.stringify({ bidId: bid.id, propertyId: bid.propertyId }),
                },
            });
        }

        const buyer = await prisma.user.findUnique({ where: { uid: bid.buyerId } });
        if (buyer?.email) {
            const property = await prisma.property.findUnique({ where: { id: bid.propertyId } });
            const subject = `Bid ${status.charAt(0).toUpperCase() + status.slice(1)} - GharBazaar`;
            await sendEmail({
                email: buyer.email,
                subject,
                message: `Your bid for "${property?.title || 'a property'}" has been ${status}.`,
                html: `<h3>Bid ${status.charAt(0).toUpperCase() + status.slice(1)}</h3><p>Your bid for <b>${property?.title || 'the property'}</b> has been ${status}.</p><p><a href="${process.env.FRONTEND_URL}/dashboard/proposals">View Details</a></p>`,
            }).catch((e) => console.error('Email send failed:', e.message));
        }

        res.status(200).json({
            success: true,
            message: `Bid ${status} successfully`,
            data: updatedBid,
        });
    } catch (error: any) {
        console.error('Error updating bid:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update bid',
            error: error.message,
        });
    }
};

/**
 * Buyer responds to seller counter-offer
 * @route PATCH /api/v1/bids/:id/buyer-response
 * @access Private (Buyer)
 */
export const respondToCounter = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { action, amount, message } = req.body;
        const buyerId = (req as any).user?.userId;

        if (!buyerId) {
            return res.status(401).json({
                success: false,
                message: 'User not authenticated',
            });
        }

        if (!action || !['accept', 'reject', 'counter'].includes(String(action))) {
            return res.status(400).json({
                success: false,
                message: 'Invalid action. Use accept, reject, or counter.',
            });
        }

        const bid = await prisma.bid.findUnique({
            where: { id },
            include: {
                property: {
                    select: { id: true, title: true },
                },
            },
        });

        if (!bid) {
            return res.status(404).json({
                success: false,
                message: 'Bid not found',
            });
        }

        if (bid.buyerId !== buyerId) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to respond to this bid',
            });
        }

        let updatedBid: any;
        let newStatus = bid.status;

        if (action === 'accept') {
            if (bid.status !== 'countered' && bid.status !== 'pending') {
                return res.status(400).json({
                    success: false,
                    message: 'Bid cannot be accepted in its current state',
                });
            }

            newStatus = 'accepted';
            updatedBid = await prisma.bid.update({
                where: { id },
                data: { status: newStatus },
            });

            const existingContract = await prisma.contract.findUnique({
                where: { bidId: bid.id },
            });

            if (!existingContract) {
                await prisma.contract.create({
                    data: {
                        propertyId: bid.propertyId,
                        bidId: bid.id,
                        buyerId: bid.buyerId,
                        sellerId: bid.sellerId,
                        agreedPrice: bid.counterAmount || bid.bidAmount,
                    },
                });
            }
        } else if (action === 'reject') {
            newStatus = 'rejected';
            updatedBid = await prisma.bid.update({
                where: { id },
                data: { status: newStatus },
            });
        } else {
            const revisedAmount = Number(amount);
            if (!Number.isFinite(revisedAmount) || revisedAmount <= 0) {
                return res.status(400).json({
                    success: false,
                    message: 'Valid revised amount is required for counter action',
                });
            }

            // Buyer re-negotiates by revising offer and moving state back to pending.
            newStatus = 'pending';
            updatedBid = await prisma.bid.update({
                where: { id },
                data: {
                    status: newStatus,
                    bidAmount: revisedAmount,
                    message: message || bid.message,
                    counterAmount: null,
                    counterMessage: null,
                },
            });
        }

        const sellerInternalId = await resolveInternalUserId(bid.sellerId);
        if (sellerInternalId) {
            await prisma.notification.create({
                data: {
                    userId: sellerInternalId,
                    type: 'inquiry',
                    title:
                        action === 'accept'
                            ? 'Buyer Accepted Offer'
                            : action === 'reject'
                                ? 'Buyer Rejected Offer'
                                : 'Buyer Sent Revised Offer',
                    message:
                        action === 'accept'
                            ? `Buyer accepted your offer for "${bid.property?.title || 'property'}".`
                            : action === 'reject'
                                ? `Buyer rejected your offer for "${bid.property?.title || 'property'}".`
                                : `Buyer sent a revised offer for "${bid.property?.title || 'property'}".`,
                    link: '/dashboard/inquiries',
                    priority: action === 'accept' ? 'high' : 'medium',
                    metadata: JSON.stringify({ bidId: bid.id, propertyId: bid.propertyId, status: newStatus }),
                },
            });
        }

        res.status(200).json({
            success: true,
            message: `Bid ${action} action completed successfully`,
            data: updatedBid,
        });
    } catch (error: any) {
        console.error('Error responding to counter offer:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to process buyer response',
            error: error.message,
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
                message: 'User not authenticated',
            });
        }

        const property = await prisma.property.findUnique({
            where: { id: propertyId },
        });

        if (!property) {
            return res.status(404).json({
                success: false,
                message: 'Property not found',
            });
        }

        if (property.sellerId !== sellerId) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to view bids for this property',
            });
        }

        const bids = await prisma.bid.findMany({
            where: { propertyId },
            include: {
                buyer: {
                    select: {
                        uid: true,
                        name: true,
                        email: true,
                        phone: true,
                        profilePhoto: true,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });

        res.status(200).json({
            success: true,
            data: bids,
        });
    } catch (error: any) {
        console.error('Error fetching property bids:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch property bids',
            error: error.message,
        });
    }
};
