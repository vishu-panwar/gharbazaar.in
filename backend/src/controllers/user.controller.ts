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

        // Check if user is soft deleted
        if (user?.deletedAt) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }

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

        // Check if user is soft deleted
        if (user?.deletedAt) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }

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
            prisma.property.count({ where: { sellerId: userId, status: 'active', deletedAt: null } }),
            prisma.property.findMany({ where: { sellerId: userId, deletedAt: null } }),
            prisma.bid.count({ where: { buyerId: userId } }),
            prisma.bid.findMany({ where: { sellerId: userId } }),
            prisma.notification.count({ where: { userId, isRead: false } })
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

// @desc    Soft delete a user
// @route   DELETE /api/v1/users/:id
// @access  Private (Admin only)
export const softDeleteUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const adminId = (req as any).user?.uid;

        // Verify user exists
        const user = await prisma.user.findUnique({
            where: { uid: id },
            select: { uid: true, deletedAt: true, email: true },
        });

        if (!user || user.deletedAt) {
            return res.status(404).json({
                success: false,
                error: 'User not found',
            });
        }

        // Soft delete the user
        const updatedUser = await prisma.user.update({
            where: { uid: id },
            data: {
                deletedAt: new Date(),
                deletedBy: adminId,
            },
        });

        res.json({
            success: true,
            message: 'User deleted successfully',
            data: { uid: updatedUser.uid, email: updatedUser.email },
        });
    } catch (error: any) {
        console.error('softDeleteUser error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to delete user',
        });
    }
};

// @desc    Restore a soft-deleted user
// @route   POST /api/v1/users/:id/restore
// @access  Private (Admin only)
export const restoreUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        // Verify user exists and is deleted
        const user = await prisma.user.findUnique({
            where: { uid: id },
            select: { uid: true, deletedAt: true, email: true },
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'User not found',
            });
        }

        if (!user.deletedAt) {
            return res.status(400).json({
                success: false,
                error: 'User is not deleted',
            });
        }

        // Restore the user
        const restoredUser = await prisma.user.update({
            where: { uid: id },
            data: {
                deletedAt: null,
                deletedBy: null,
            },
        });

        res.json({
            success: true,
            message: 'User restored successfully',
            data: { uid: restoredUser.uid, email: restoredUser.email },
        });
    } catch (error: any) {
        console.error('restoreUser error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to restore user',
        });
    }
};
