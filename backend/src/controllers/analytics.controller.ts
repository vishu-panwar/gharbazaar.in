import { Request, Response } from 'express';
import mongoose from 'mongoose';
import User from '../models/user.model';
import Property from '../models/property.model';
import Bid from '../models/bid.model';
import UserPlan from '../models/userPlan.model';
import Plan from '../models/plan.model';

const isDbReady = () => mongoose.connection.readyState === 1;

export const getAdminDashboard = async (_req: Request, res: Response) => {
    try {
        if (!isDbReady()) {
            return res.json({
                success: true,
                data: {
                    overviewStats: {
                        totalRevenue: 0,
                        revenueGrowth: 0,
                        totalUsers: 0,
                        userGrowth: 0,
                        totalListings: 0,
                        listingGrowth: 0,
                        activeSubscriptions: 0,
                        subscriptionGrowth: 0
                    },
                    revenueData: [],
                    userGrowthData: [],
                    topCities: [],
                    subscriptionBreakdown: [],
                    trafficSources: [],
                    recentActivity: []
                },
                message: 'Database not ready - returning empty analytics'
            });
        }

        const totalUsers = await User.countDocuments({});
        const totalListings = await Property.countDocuments({});
        const activeSubscriptions = await UserPlan.countDocuments({ status: 'active' });

        const plans = await Plan.find({});
        const planPriceMap = plans.reduce((acc: any, plan) => {
            acc[plan._id.toString()] = plan.price || 0;
            return acc;
        }, {});

        const allUserPlans = await UserPlan.find({});
        const totalRevenue = allUserPlans.reduce((sum, userPlan) => {
            const price = planPriceMap[userPlan.planId.toString()] || 0;
            return sum + price;
        }, 0);

        return res.json({
            success: true,
            data: {
                overviewStats: {
                    totalRevenue,
                    revenueGrowth: 0,
                    totalUsers,
                    userGrowth: 0,
                    totalListings,
                    listingGrowth: 0,
                    activeSubscriptions,
                    subscriptionGrowth: 0
                },
                revenueData: [],
                userGrowthData: [],
                topCities: [],
                subscriptionBreakdown: [],
                trafficSources: [],
                recentActivity: []
            }
        });
    } catch (error: any) {
        console.error('getAdminDashboard error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch admin analytics', error: error.message });
    }
};

export const getSellerInsights = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.userId;
        if (!userId) return res.status(401).json({ success: false, message: 'User not authenticated' });

        if (!isDbReady()) {
            return res.json({ success: true, data: { listings: 0, bids: 0, views: 0 } });
        }

        const listings = await Property.countDocuments({ sellerId: userId });
        const bids = await Bid.countDocuments({ sellerId: userId });
        const viewsAgg = await Property.aggregate([
            { $match: { sellerId: userId } },
            { $group: { _id: null, totalViews: { $sum: '$views' } } }
        ]);

        res.json({
            success: true,
            data: {
                listings,
                bids,
                views: viewsAgg[0]?.totalViews || 0
            }
        });
    } catch (error: any) {
        console.error('getSellerInsights error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch seller insights', error: error.message });
    }
};

export const getSearchSuggestions = async (req: Request, res: Response) => {
    const { q } = req.query;
    const query = (q || '').toString().trim();
    if (!query) return res.json({ success: true, data: [] });

    if (!isDbReady()) {
        return res.json({ success: true, data: [] });
    }

    const cities = await Property.find({ city: new RegExp(query, 'i') })
        .limit(5)
        .distinct('city');

    res.json({ success: true, data: cities });
};

export const trackSearch = async (_req: Request, res: Response) => {
    res.json({ success: true, message: 'Search tracked' });
};

export const getPopularSearches = async (_req: Request, res: Response) => {
    res.json({ success: true, data: [] });
};

export const getPropertyPerformance = async (req: Request, res: Response) => {
    try {
        const { propertyId } = req.params;
        if (!isDbReady()) return res.json({ success: true, data: null });

        const property = await Property.findById(propertyId);
        if (!property) return res.status(404).json({ success: false, message: 'Property not found' });

        res.json({
            success: true,
            data: {
                views: property.views,
                likes: property.likes,
                inquiries: property.inquiries
            }
        });
    } catch (error: any) {
        console.error('getPropertyPerformance error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch property performance', error: error.message });
    }
};

export const getCitywiseAnalytics = async (_req: Request, res: Response) => {
    try {
        if (!isDbReady()) return res.json({ success: true, data: [] });

        const cityStats = await Property.aggregate([
            { $group: { _id: '$city', listings: { $sum: 1 } } },
            { $sort: { listings: -1 } },
            { $limit: 10 }
        ]);

        res.json({ success: true, data: cityStats.map(c => ({ city: c._id, listings: c.listings })) });
    } catch (error: any) {
        console.error('getCitywiseAnalytics error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch citywise analytics', error: error.message });
    }
};
