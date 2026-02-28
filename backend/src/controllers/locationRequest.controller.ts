import { Request, Response } from 'express';
import { prisma } from '../utils/database';

// Create a new location request
export const createLocationRequest = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.userId;
        const { city } = req.body;

        if (!city) {
            return res.status(400).json({ success: false, error: 'City is required' });
        }

        // Check if user already has a request
        const existingRequest = await prisma.locationRequest.findUnique({
            where: { userId }
        });

        if (existingRequest) {
            return res.status(400).json({ 
                success: false, 
                error: 'You have already submitted a location request.',
                existingRequest 
            });
        }

        const newRequest = await prisma.locationRequest.create({
            data: {
                userId,
                city,
                status: 'pending'
            }
        });

        res.status(201).json({ success: true, data: newRequest });
    } catch (error) {
        console.error('Error creating location request:', error);
        res.status(500).json({ success: false, error: 'Failed to submit request' });
    }
};

// Get aggregated stats for employees (city, count)
export const getLocationRequestStats = async (req: Request, res: Response) => {
    try {
        // Group by city and count, filter by status 'pending'
        const stats = await prisma.locationRequest.groupBy({
            by: ['city'],
            where: {
                status: 'pending' // Only show pending requests to employees to act on
            },
            _count: {
                city: true
            },
            orderBy: {
                _count: {
                    city: 'desc'
                }
            }
        });

        // Format for frontend
        const formattedStats = stats.map((stat: any) => ({
            city: stat.city,
            count: stat._count.city
        }));

        res.json({ success: true, data: formattedStats });
    } catch (error) {
        console.error('Error getting location stats:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch stats' });
    }
};

// Send requests for a city to Admin
export const sendToAdmin = async (req: Request, res: Response) => {
    try {
        const { city } = req.body;

        if (!city) {
            return res.status(400).json({ success: false, error: 'City is required' });
        }

        // Update all pending requests for this city to 'sent_to_admin'
        const result = await prisma.locationRequest.updateMany({
            where: {
                city,
                status: 'pending'
            },
            data: {
                status: 'sent_to_admin'
            }
        });

        res.json({ 
            success: true, 
            message: `Successfully forwarded ${result.count} requests to Admin`,
            count: result.count 
        });
    } catch (error) {
        console.error('Error forwarding to admin:', error);
        res.status(500).json({ success: false, error: 'Failed to forward requests' });
    }
};

// Get requests forwarded to Admin
export const getAdminRequests = async (req: Request, res: Response) => {
    try {
        const stats = await prisma.locationRequest.groupBy({
            by: ['city'],
            where: {
                status: 'sent_to_admin'
            },
            _count: {
                city: true
            },
            orderBy: {
                _count: {
                    city: 'desc'
                }
            }
        });

        const formattedStats = stats.map((stat: any) => ({
            city: stat.city,
            count: stat._count.city
        }));

        res.json({ success: true, data: formattedStats });
    } catch (error) {
        console.error('Error getting admin requests:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch admin requests' });
    }
};

// Check if current user has a request
export const getMyRequest = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.userId;
        
        const request = await prisma.locationRequest.findUnique({
            where: { userId }
        });

        res.json({ success: true, data: request });
    } catch (error) {
        console.error('Error getting my request:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch request' });
    }
};
