import { Request, Response } from 'express';
import { prisma } from '../utils/database';

export const getAdminDashboard = async (_req: Request, res: Response) => {
    try {
        const totalUsers = await prisma.user.count();
        const totalListings = await prisma.property.count();
        const activeSubscriptions = await prisma.subscription.count({ where: { status: 'active' } });

        // Calculate revenue
        const subscriptions = await prisma.subscription.findMany({
            include: { plan: true }
        });

        const totalRevenue = subscriptions.reduce((sum: number, sub: any) => {
            // Check if plan exists and has a price
            if (sub.plan && sub.plan.price) {
                return sum + Number(sub.plan.price);
            }
            return sum;
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

        // Need internal ID for proper querying if userId is UID
        // But the schema says sellerId in Property refers to user.uid
        // "sellerId" in Propery model: seller    User     @relation(fields: [sellerId], references: [uid], onDelete: Cascade)
        // So we can use userId directly if it is the UID.
        
        const listings = await prisma.property.count({ where: { sellerId: userId } });
        const bids = await prisma.bid.count({ where: { sellerId: userId } });
        
        const viewsAgg = await prisma.property.aggregate({
            where: { sellerId: userId },
            _sum: { views: true }
        });

        res.json({
            success: true,
            data: {
                listings,
                bids,
                views: viewsAgg._sum.views || 0
            }
        });
    } catch (error: any) {
        console.error('getSellerInsights error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch seller insights', error: error.message });
    }
};

export const getSearchSuggestions = async (req: Request, res: Response) => {
    try {
        const { q } = req.query;
        const query = (q || '').toString().trim();
        if (!query) return res.json({ success: true, data: [] });

        const cities = await prisma.property.findMany({
            where: {
                city: {
                    contains: query,
                    mode: 'insensitive'
                }
            },
            select: { city: true },
            distinct: ['city'],
            take: 5
        });

        res.json({ success: true, data: cities.map((c: any) => c.city) });
    } catch (error: any) {
        console.error('getSearchSuggestions error:', error);
        res.json({ success: true, data: [] });
    }
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

        const property = await prisma.property.findUnique({
            where: { id: propertyId }
        });
        
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
        // Group by city and count
        const cityStats = await prisma.property.groupBy({
            by: ['city'],
            _count: {
                city: true // Count occurrences
            },
            orderBy: {
                _count: {
                    city: 'desc'
                }
            },
            take: 10
        });

        res.json({ 
            success: true, 
            data: cityStats.map((c: any) => ({ 
                city: c.city, 
                listings: c._count.city 
            })) 
        });
    } catch (error: any) {
        console.error('getCitywiseAnalytics error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch citywise analytics', error: error.message });
    }
};
