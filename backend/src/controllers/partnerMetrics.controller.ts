import { Request, Response } from 'express';
import { prisma } from '../utils/prisma';

// @desc    Get partner metrics
// @route   GET /api/v1/partners/:id/metrics
// @access  Private (Partner/Admin)
export const getPartnerMetrics = async (req: Request, res: Response) => {
    try {
        const { id: partnerId } = req.params;
        const { year, month, limit = '12' } = req.query;

        const where: any = { partnerId };

        if (year) where.year = parseInt(year as string, 10);
        if (month) where.month = parseInt(month as string, 10);

        const metrics = await prisma.partnerMetrics.findMany({
            where,
            orderBy: [{ year: 'desc' }, { month: 'desc' }],
            take: parseInt(limit as string, 10),
            include: {
                partner: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        role: true,
                    },
                },
            },
        });

        res.json({
            success: true,
            data: metrics,
        });
    } catch (error: any) {
        console.error('Get partner metrics error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch partner metrics',
            error: error.message,
        });
    }
};

// @desc    Get specific month metrics
// @route   GET /api/v1/partners/:id/metrics/:year/:month
// @access  Private (Partner/Admin)
export const getMonthMetrics = async (req: Request, res: Response) => {
    try {
        const { id: partnerId, year, month } = req.params;

        const metrics = await prisma.partnerMetrics.findUnique({
            where: {
                partnerId_month_year: {
                    partnerId,
                    month: parseInt(month, 10),
                    year: parseInt(year, 10),
                },
            },
            include: {
                partner: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        role: true,
                    },
                },
            },
        });

        if (!metrics) {
            return res.status(404).json({
                success: false,
                message: 'Metrics not found for this period',
            });
        }

        res.json({
            success: true,
            data: metrics,
        });
    } catch (error: any) {
        console.error('Get month metrics error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch metrics',
            error: error.message,
        });
    }
};

// @desc    Calculate/update partner metrics
// @route   POST /api/v1/partners/:id/metrics/calculate
// @access  Private (Admin)
export const calculateMetrics = async (req: Request, res: Response) => {
    try {
        const { id: partnerId } = req.params;
        const { year, month } = req.body;

        const currentDate = new Date();
        const targetYear = year || currentDate.getFullYear();
        const targetMonth = month || currentDate.getMonth() + 1;

        // Calculate date range for the month
        const startDate = new Date(targetYear, targetMonth - 1, 1);
        const endDate = new Date(targetYear, targetMonth, 0, 23, 59, 59);

        // Get partner's referrals for the month
        const referrals = await prisma.referral.findMany({
            where: {
                promoterId: partnerId,
                createdAt: {
                    gte: startDate,
                    lte: endDate,
                },
            },
        });

        const leadsGenerated = referrals.length;
        const leadsConverted = referrals.filter((r) => r.status === 'converted').length;

        // Get partner's payouts for commission total
        const payouts = await prisma.payout.findMany({
            where: {
                partnerId,
                createdAt: {
                    gte: startDate,
                    lte: endDate,
                },
            },
        });

        const totalCommission = payouts.reduce(
            (sum, payout) => sum + parseFloat(payout.amount.toString()),
            0
        );

        // Calculate tier based on performance
        let tier = 'bronze';
        if (leadsConverted >= 20) tier = 'platinum';
        else if (leadsConverted >= 10) tier = 'gold';
        else if (leadsConverted >= 5) tier = 'silver';

        // Upsert metrics
        const metrics = await prisma.partnerMetrics.upsert({
            where: {
                partnerId_month_year: {
                    partnerId,
                    month: targetMonth,
                    year: targetYear,
                },
            },
            update: {
                leadsGenerated,
                leadsConverted,
                totalCommission,
                tier,
            },
            create: {
                partnerId,
                month: targetMonth,
                year: targetYear,
                leadsGenerated,
                leadsConverted,
                propertiesListed: 0,
                propertiesSold: 0,
                totalCommission,
                tier,
            },
        });

        res.json({
            success: true,
            message: 'Metrics calculated successfully',
            data: metrics,
        });
    } catch (error: any) {
        console.error('Calculate metrics error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to calculate metrics',
            error: error.message,
        });
    }
};

// @desc    Get partner leaderboard
// @route   GET /api/v1/metrics/leaderboard
// @access  Public/Private
export const getLeaderboard = async (req: Request, res: Response) => {
    try {
        const { year, month, limit = '10' } = req.query;

        const currentDate = new Date();
        const targetYear = year ? parseInt(year as string, 10) : currentDate.getFullYear();
        const targetMonth = month ? parseInt(month as string, 10) : currentDate.getMonth() + 1;

        const leaderboard = await prisma.partnerMetrics.findMany({
            where: {
                year: targetYear,
                month: targetMonth,
            },
            include: {
                partner: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
            orderBy: [
                { leadsConverted: 'desc' },
                { totalCommission: 'desc' },
            ],
            take: parseInt(limit as string, 10),
        });

        res.json({
            success: true,
            data: leaderboard,
            meta: {
                year: targetYear,
                month: targetMonth,
            },
        });
    } catch (error: any) {
        console.error('Get leaderboard error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch leaderboard',
            error: error.message,
        });
    }
};
