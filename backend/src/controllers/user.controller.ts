import { Request, Response } from 'express';
import mongoose from 'mongoose';
import User from '../models/user.model';
import Notification from '../models/notification.model';

export const getProfile = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.userId;
        const userPayload = (req as any).user;

        if (!userId) {
            return res.status(401).json({ success: false, error: 'Unauthorized' });
        }

        // Check if DB is connected
        const isDbConnected = mongoose.connection.readyState === 1;

        if (isDbConnected) {
            const user = await User.findOne({ uid: userId });
            if (user) {
                return res.json({
                    success: true,
                    data: user
                });
            }
        }

        console.log(`👤 DB disconnected or user not found, returning fallback from payload for ${userId}`);

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

        // Check DB connection
        const isDbConnected = mongoose.connection.readyState === 1;

        if (!userId || !isDbConnected) {
            console.log(`📊 Returning fallback stats (userId: ${userId}, dbConnected: ${isDbConnected})`);
            // Fallback for demo users or if DB is down
            return res.json({
                success: true,
                propertiesViewed: 0,
                savedProperties: 0,
                activeOffers: 0,
                budget: '₹0',
                newMatches: 0,
                priceDrops: 0,
                activeListings: 0,
                totalViews: 0,
                inquiries: 0,
                newInquiries: 0,
                negotiationsValue: '₹0',
                revenue: '₹0',
                planType: 'Free',
                planProgress: 0,
                daysLeft: 0,
                viewLimit: 10,
                consultationLimit: 0,
                consultationsUsed: 0,
                listingLimit: 1
            });
        }

        const user = await User.findOne({ uid: userId }).lean();
        if (!user) {
            return res.status(404).json({ success: false, error: 'User not found in database' });
        }

        // --- Fetch real-time counts ---
        const [
            activeListings,
            myProperties,
            myBids,
            receivedBids,
            unreadNotifications
        ] = await Promise.all([
            mongoose.model('Property').countDocuments({ sellerId: userId, status: 'active' }),
            mongoose.model('Property').find({ sellerId: userId }).lean(),
            mongoose.model('Bid').countDocuments({ buyerId: userId }),
            mongoose.model('Bid').find({ sellerId: userId }).lean(),
            Notification.countDocuments({ userId, isRead: false })
        ]);

        // Calculate total views and revenue for seller
        const totalViews = myProperties.reduce((acc: number, p: any) => acc + (p.views || 0), 0);
        const inquiries = receivedBids.length;
        const revenue = receivedBids
            .filter((b: any) => b.status === 'accepted')
            .reduce((acc: number, b: any) => acc + (b.bidAmount || 0), 0);

        const stats = {
            success: true,
            propertiesViewed: user.propertiesViewed || 0,
            savedProperties: user.savedProperties || 0,
            activeOffers: myBids,
            budget: user.budget || '₹0',
            newMatches: 0, // Logic for new matches can be added later
            priceDrops: 0,
            activeListings,
            totalViews,
            inquiries,
            newInquiries: unreadNotifications, // Using notifications as a proxy for new activity
            negotiationsValue: `₹${(revenue / 10000000).toFixed(2)} Cr`,
            revenue: `₹${(revenue / 10000000).toFixed(2)} Cr`,
            planType: user.planType || 'Free',
            planProgress: user.planProgress || 0,
            daysLeft: user.daysLeft || 0,
            viewLimit: user.viewLimit || 10,
            consultationLimit: user.consultationLimit || 0,
            consultationsUsed: user.consultationsUsed || 0,
            listingLimit: user.listingLimit || 3
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
