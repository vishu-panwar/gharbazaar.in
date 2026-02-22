import { Request, Response } from 'express';
import { prisma } from '../utils/prisma';

export const getProfile = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.userId;
        const userPayload = (req as any).user;

        if (!userId) {
            return res.status(401).json({ success: false, error: 'Unauthorized' });
        }

        const user = await prisma.user.findUnique({
            where: { uid: userId },
            include: {
                buyerProfile: true,
                sellerProfile: true,
                employeeProfile: true
            }
        });

        if (user) {
            return res.json({
                success: true,
                data: user
            });
        }

        console.log(`👤 User not found in database, returning fallback from payload for ${userId}`);

        // Fallback: Return what we have from the JWT payload
        const email = userPayload.email || userPayload.emailAddress || userPayload.unique_name || 'user@example.com';
        const name = userPayload.name || userPayload.displayName || userPayload.fullName || email.split('@')[0] || 'User';

        res.json({
            success: true,
            data: {
                uid: userId,
                email: email,
                displayName: name,
                name: name,
                role: (userPayload.role || 'buyer').toLowerCase()
            }
        });
    } catch (error) {
        console.error('getProfile error:', error);
        res.status(500).json({ success: false, error: 'Failed to get profile' });
    }
};

export const getStats = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.userId;

        if (!userId) {
            return res.status(401).json({ success: false, error: 'Unauthorized' });
        }

        const user = await prisma.user.findUnique({
            where: { uid: userId },
            include: {
                buyerProfile: true,
                sellerProfile: true
            }
        });

        if (!user) {
            return res.status(404).json({ success: false, error: 'User not found in database' });
        }

        // --- Fetch real-time counts using Prisma ---
        const [
            activeListingsCount,
            myProperties,
            myBidsCount,
            receivedBids,
            unreadNotificationsCount
        ] = await Promise.all([
            prisma.property.count({ where: { sellerId: userId, status: 'active' } }),
            prisma.property.findMany({ where: { sellerId: userId } }),
            prisma.bid.count({ where: { buyerId: userId } }),
            prisma.bid.findMany({ where: { sellerId: userId } }),
            prisma.notification.count({ where: { userId: user.id, isRead: false } })
        ]);

        // Calculate total views and revenue for seller
        const totalViews = myProperties.reduce((acc: number, p: any) => acc + (p.views || 0), 0);
        const inquiries = receivedBids.length;
        const revenue = receivedBids
            .filter((b: any) => b.status === 'accepted')
            .reduce((acc: number, b: any) => acc + Number(b.bidAmount || 0), 0);

        const stats = {
            success: true,
            propertiesViewed: user.buyerProfile?.propertiesViewed || 0,
            savedProperties: user.buyerProfile?.savedProperties || 0,
            activeOffers: myBidsCount,
            budget: user.buyerProfile?.budget || '₹0',
            newMatches: 0,
            priceDrops: 0,
            activeListings: activeListingsCount,
            totalViews,
            inquiries,
            newInquiries: unreadNotificationsCount,
            negotiationsValue: `₹${(revenue / 10000000).toFixed(2)} Cr`,
            revenue: `₹${(revenue / 10000000).toFixed(2)} Cr`,
            planType: 'Free', // Defaults for now, can be linked to Subscription model later
            planProgress: 0,
            daysLeft: 0,
            viewLimit: 10,
            consultationLimit: 0,
            consultationsUsed: 0,
            listingLimit: 3
        };

        res.json(stats);
    } catch (error: any) {
        console.error('❌ getStats error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to get stats',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};
