import { Request, Response } from 'express';
import { prisma } from '../utils/prisma';
import ipGeolocationService from '../utils/ipGeolocation.service';

/**
 * Create a new expand request
 */
export const createExpandRequest = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.userId || (req as any).user?.id;
        if (!userId) {
            return res.status(401).json({
                success: false,
                error: 'Unauthorized'
            });
        }

        // Check if user already has a request
        const existingRequest = await prisma.expandRequest.findUnique({
            where: { userId }
        });

        if (existingRequest) {
            return res.status(400).json({
                success: false,
                error: 'You have already submitted an expand request'
            });
        }

        const { name, city, state, additionalInfo } = req.body;

        // Validation
        if (!name || !city || !state) {
            return res.status(400).json({
                success: false,
                error: 'Name, city, and state are required'
            });
        }

        // Get user details
        const user = await prisma.user.findFirst({
            where: {
                OR: [
                    { id: userId },
                    { uid: userId }
                ]
            }
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'User not found'
            });
        }

        // Get IP address and user agent
        const ipAddress = req.ip || req.headers['x-forwarded-for'] as string || req.socket.remoteAddress || '';
        const userAgent = (req.headers['user-agent'] as string) || '';

        // Create expand request
        const expandRequest = await prisma.expandRequest.create({
            data: {
                userId: user.id, // Use the actual DB ID
                name: name.trim(),
                email: user.email,
                city: city.trim(),
                state: state.trim(),
                additionalInfo: additionalInfo?.trim(),
                ipAddress,
                userAgent,
                status: 'pending',
                priority: false
            }
        });

        return res.status(201).json({
            success: true,
            message: 'Expand request submitted successfully',
            data: expandRequest
        });
    } catch (error: any) {
        console.error('Create expand request error:', error);
        return res.status(500).json({
            success: false,
            error: 'Failed to create expand request'
        });
    }
};

/**
 * Check if user already has a request
 */
export const checkExistingRequest = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.userId || (req as any).user?.id;
        if (!userId) {
            return res.status(401).json({
                success: false,
                error: 'Unauthorized'
            });
        }

        // Try both ID and UID
        const existingRequest = await prisma.expandRequest.findFirst({
            where: {
                OR: [
                    { userId: userId },
                    { user: { uid: userId } }
                ]
            }
        });

        return res.status(200).json({
            success: true,
            hasRequest: !!existingRequest,
            data: existingRequest || null
        });
    } catch (error: any) {
        console.error('Check existing request error:', error);
        return res.status(500).json({
            success: false,
            error: 'Failed to check request status'
        });
    }
};

/**
 * Get user's own expand request
 */
export const getMyRequest = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.userId || (req as any).user?.id;
        if (!userId) {
            return res.status(401).json({
                success: false,
                error: 'Unauthorized'
            });
        }

        const request = await prisma.expandRequest.findFirst({
            where: {
                OR: [
                    { userId: userId },
                    { user: { uid: userId } }
                ]
            }
        });

        return res.status(200).json({
            success: true,
            data: request
        });
    } catch (error: any) {
        console.error('Get my request error:', error);
        return res.status(500).json({
            success: false,
            error: 'Failed to get request'
        });
    }
};

/**
 * Check user's location from IP
 */
export const checkUserLocation = async (req: Request, res: Response) => {
    try {
        const ipAddress = req.ip || req.headers['x-forwarded-for'] as string || req.socket.remoteAddress || '';

        const location = await ipGeolocationService.getLocation(ipAddress);
        const isInOperatingCity = await ipGeolocationService.isInOperatingCity(ipAddress);

        return res.status(200).json({
            success: true,
            data: {
                location,
                isInOperatingCity,
                shouldShowBanner: !isInOperatingCity
            }
        });
    } catch (error: any) {
        console.error('Check user location error:', error);
        return res.status(500).json({
            success: false,
            error: 'Failed to check location'
        });
    }
};

/**
 * Get city-wise request statistics (Employee only)
 */
export const getCityStats = async (req: Request, res: Response) => {
    try {
        const userRole = (req as any).user?.role;
        if (userRole !== 'employee' && userRole !== 'admin') {
            return res.status(403).json({
                success: false,
                error: 'Access denied'
            });
        }

        // In Prisma, we can group by
        const stats = await prisma.expandRequest.groupBy({
            by: ['city', 'state'],
            where: { status: 'pending' },
            _count: {
                _all: true
            },
            orderBy: {
                _count: {
                    city: 'desc'
                }
            }
        });

        // Map to the format the frontend expects or just return as is
        const mappedStats = await Promise.all(stats.map(async (stat) => {
            const requests = await prisma.expandRequest.findMany({
                where: {
                    city: stat.city,
                    state: stat.state,
                    status: 'pending'
                },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    additionalInfo: true,
                    createdAt: true,
                    priority: true
                }
            });

            return {
                city: stat.city,
                state: stat.state,
                count: stat._count._all,
                requests
            };
        }));

        return res.status(200).json({
            success: true,
            data: mappedStats
        });
    } catch (error: any) {
        console.error('Get city stats error:', error);
        return res.status(500).json({
            success: false,
            error: 'Failed to get city statistics'
        });
    }
};

/**
 * Get priority requests (Admin only)
 */
export const getPriorityRequests = async (req: Request, res: Response) => {
    try {
        const userRole = (req as any).user?.role;
        if (userRole !== 'admin') {
            return res.status(403).json({
                success: false,
                error: 'Access denied'
            });
        }

        const stats = await prisma.expandRequest.groupBy({
            by: ['city', 'state'],
            where: {
                priority: true,
                status: 'pending'
            },
            _count: {
                _all: true
            },
            _max: {
                prioritySetAt: true
            },
            orderBy: {
                _max: {
                    prioritySetAt: 'desc'
                }
            }
        });

        const mappedPriority = await Promise.all(stats.map(async (stat) => {
            const requests = await prisma.expandRequest.findMany({
                where: {
                    city: stat.city,
                    state: stat.state,
                    priority: true,
                    status: 'pending'
                },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    additionalInfo: true,
                    createdAt: true,
                    prioritySetAt: true
                }
            });

            return {
                city: stat.city,
                state: stat.state,
                count: stat._count._all,
                requests,
                latestPriorityDate: stat._max.prioritySetAt
            };
        }));

        return res.status(200).json({
            success: true,
            data: mappedPriority
        });
    } catch (error: any) {
        console.error('Get priority requests error:', error);
        return res.status(500).json({
            success: false,
            error: 'Failed to get priority requests'
        });
    }
};

/**
 * Set priority for a city (Employee only)
 */
export const setPriority = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.userId || (req as any).user?.id;
        const userRole = (req as any).user?.role;

        if (userRole !== 'employee' && userRole !== 'admin') {
            return res.status(403).json({
                success: false,
                error: 'Access denied'
            });
        }

        const { city, state } = req.body;

        if (!city || !state) {
            return res.status(400).json({
                success: false,
                error: 'City and state are required'
            });
        }

        // Set priority for all requests from this city
        const result = await prisma.expandRequest.updateMany({
            where: {
                city: city.trim(),
                state: state.trim(),
                status: 'pending'
            },
            data: {
                priority: true,
                prioritySetBy: userId,
                prioritySetAt: new Date()
            }
        });

        return res.status(200).json({
            success: true,
            message: `Priority set for ${result.count} requests from ${city}, ${state}`,
            data: {
                modifiedCount: result.count
            }
        });
    } catch (error: any) {
        console.error('Set priority error:', error);
        return res.status(500).json({
            success: false,
            error: 'Failed to set priority'
        });
    }
};

/**
 * Remove priority for a city (Employee/Admin only)
 */
export const removePriority = async (req: Request, res: Response) => {
    try {
        const userRole = (req as any).user?.role;

        if (userRole !== 'employee' && userRole !== 'admin') {
            return res.status(403).json({
                success: false,
                error: 'Access denied'
            });
        }

        const { city, state } = req.body;

        if (!city || !state) {
            return res.status(400).json({
                success: false,
                error: 'City and state are required'
            });
        }

        // Remove priority for all requests from this city
        const result = await prisma.expandRequest.updateMany({
            where: {
                city: city.trim(),
                state: state.trim()
            },
            data: {
                priority: false,
                prioritySetBy: null,
                prioritySetAt: null
            }
        });

        return res.status(200).json({
            success: true,
            message: `Priority removed for ${result.count} requests from ${city}, ${state}`,
            data: {
                modifiedCount: result.count
            }
        });
    } catch (error: any) {
        console.error('Remove priority error:', error);
        return res.status(500).json({
            success: false,
            error: 'Failed to remove priority'
        });
    }
};
