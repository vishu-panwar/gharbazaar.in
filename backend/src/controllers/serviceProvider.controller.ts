import { Request, Response } from 'express';
import { prisma } from '../utils/database';

// Get all service providers with optional filters
export const getAllProviders = async (req: Request, res: Response) => {
    try {
        const { category, verified, available, location, sortBy = 'rating' } = req.query;

        // Build filter where object
        const where: any = {};
        if (category && category !== 'all') where.category = category as string;
        if (verified !== undefined) where.verified = verified === 'true';
        if (available !== undefined) where.available = available === 'true';
        if (location) {
            where.location = {
                contains: location as string,
                mode: 'insensitive'
            };
        }

        // Build orderBy object
        const orderBy: any = {};
        if (sortBy === 'rating') orderBy.rating = 'desc';
        else if (sortBy === 'reviews') orderBy.reviews = 'desc';
        else if (sortBy === 'projects') orderBy.completedProjects = 'desc';
        else if (sortBy === 'rate') orderBy.hourlyRate = 'asc';
        else orderBy.createdAt = 'desc';

        const providers = await prisma.serviceProvider.findMany({
            where,
            include: {
                user: {
                    select: {
                        name: true,
                        email: true
                    }
                }
            },
            orderBy
        });

        res.json({
            success: true,
            providers,
            count: providers.length
        });
    } catch (error: any) {
        console.error('getAllProviders error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch service providers'
        });
    }
};

// Get single provider by ID
export const getProviderById = async (req: Request, res: Response) => {
    try {
        const provider = await prisma.serviceProvider.findUnique({
            where: { id: req.params.id },
            include: {
                user: {
                    select: {
                        name: true,
                        email: true,
                        phone: true
                    }
                }
            }
        });

        if (!provider) {
            return res.status(404).json({
                success: false,
                error: 'Service provider not found'
            });
        }

        res.json({ success: true, data: provider });
    } catch (error: any) {
        console.error('getProviderById error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to get service provider'
        });
    }
};

// Create new service provider profile
export const createProvider = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.userId; // This is the uid from Firebase/Auth

        if (!userId) {
            return res.status(401).json({
                success: false,
                error: 'Authentication required'
            });
        }

        // Check if user exists and get their internal ID
        const user = await prisma.user.findUnique({
            where: { uid: userId }
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'User not found'
            });
        }

        // Check if provider profile already exists for this user
        const existingProvider = await prisma.serviceProvider.findUnique({
            where: { userId: user.id }
        });

        if (existingProvider) {
            return res.status(400).json({
                success: false,
                error: 'Service provider profile already exists for this user'
            });
        }

        const providerData = {
            ...req.body,
            userId: user.id,
            // Numerical conversions
            rating: req.body.rating ? parseFloat(req.body.rating) : 0,
            reviews: req.body.reviews ? parseInt(req.body.reviews) : 0,
            completedProjects: req.body.completedProjects ? parseInt(req.body.completedProjects) : 0,
            hourlyRate: req.body.hourlyRate ? parseFloat(req.body.hourlyRate) : 0,
            experience: req.body.experience ? parseInt(req.body.experience) : 0
        };

        const provider = await prisma.serviceProvider.create({
            data: providerData
        });

        // Update user onboarding status
        await prisma.user.update({
            where: { uid: userId },
            data: { onboardingCompleted: true }
        });

        res.status(201).json({
            success: true,
            data: provider
        });
    } catch (error: any) {
        console.error('createProvider error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to create service provider',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Update provider profile
export const updateProvider = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const userId = (req as any).user?.userId;

        // Find provider and verify ownership
        const provider = await prisma.serviceProvider.findUnique({
            where: { id },
            include: { user: true }
        });

        if (!provider) {
            return res.status(404).json({
                success: false,
                error: 'Service provider not found'
            });
        }

        // Check if user owns this provider profile
        if (provider.user.uid !== userId && (req as any).user?.role !== 'admin') {
            return res.status(403).json({
                success: false,
                error: 'Not authorized to update this profile'
            });
        }

        // Clean up data for update
        const updateData = { ...req.body };
        delete updateData.userId; // Don't allow updating internal userId
        
        if (updateData.rating) updateData.rating = parseFloat(updateData.rating);
        if (updateData.reviews) updateData.reviews = parseInt(updateData.reviews);
        if (updateData.completedProjects) updateData.completedProjects = parseInt(updateData.completedProjects);
        if (updateData.hourlyRate) updateData.hourlyRate = parseFloat(updateData.hourlyRate);
        if (updateData.experience) updateData.experience = parseInt(updateData.experience);

        const updatedProvider = await prisma.serviceProvider.update({
            where: { id },
            data: updateData
        });

        res.json({
            success: true,
            data: updatedProvider
        });
    } catch (error: any) {
        console.error('updateProvider error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to update service provider'
        });
    }
};

// Delete provider profile
export const deleteProvider = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const userId = (req as any).user?.userId;

        // Find provider and verify ownership
        const provider = await prisma.serviceProvider.findUnique({
            where: { id },
            include: { user: true }
        });

        if (!provider) {
            return res.status(404).json({
                success: false,
                error: 'Service provider not found'
            });
        }

        // Check if user owns this provider profile
        if (provider.user.uid !== userId && (req as any).user?.role !== 'admin') {
            return res.status(403).json({
                success: false,
                error: 'Not authorized to delete this profile'
            });
        }

        await prisma.serviceProvider.delete({
            where: { id }
        });

        res.json({
            success: true,
            message: 'Service provider deleted successfully'
        });
    } catch (error: any) {
        console.error('deleteProvider error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to delete service provider'
        });
    }
};

// Search providers with advanced filtering
export const searchProviders = async (req: Request, res: Response) => {
    try {
        const { 
            search, 
            category, 
            minRating, 
            maxRate, 
            verified, 
            available,
            skills 
        } = req.query;

        const where: any = {};

        // Text search in specialization, description, and skills
        if (search) {
            where.OR = [
                { specialization: { contains: search as string, mode: 'insensitive' } },
                { description: { contains: search as string, mode: 'insensitive' } },
                { skills: { hasSome: [search as string] } }
            ];
        }

        if (category && category !== 'all') where.category = category as string;
        if (verified !== undefined) where.verified = verified === 'true';
        if (available !== undefined) where.available = available === 'true';
        if (minRating) where.rating = { gte: Number(minRating) };
        if (maxRate) where.hourlyRate = { lte: Number(maxRate) };
        if (skills) {
            const skillsArray = (skills as string).split(',');
            where.skills = { hasSome: skillsArray };
        }

        const providers = await prisma.serviceProvider.findMany({
            where,
            include: {
                user: {
                    select: {
                        name: true,
                        email: true
                    }
                }
            },
            orderBy: [
                { rating: 'desc' },
                { reviews: 'desc' }
            ]
        });

        res.json({
            success: true,
            providers,
            count: providers.length
        });
    } catch (error: any) {
        console.error('searchProviders error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to search service providers'
        });
    }
};

// Get providers by category
export const getProvidersByCategory = async (req: Request, res: Response) => {
    try {
        const { category } = req.params;

        const providers = await prisma.serviceProvider.findMany({
            where: { category },
            include: {
                user: {
                    select: {
                        name: true,
                        email: true
                    }
                }
            },
            orderBy: [
                { rating: 'desc' },
                { reviews: 'desc' }
            ]
        });

        res.json({
            success: true,
            category,
            providers,
            count: providers.length
        });
    } catch (error: any) {
        console.error('getProvidersByCategory error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch providers by category'
        });
    }
};

// Get provider stats (for dashboard)
export const getProviderStats = async (req: Request, res: Response) => {
    try {
        const totalProviders = await prisma.serviceProvider.count();
        const verifiedProviders = await prisma.serviceProvider.count({ where: { verified: true } });
        const availableProviders = await prisma.serviceProvider.count({ where: { available: true } });

        // Average rating
        const ratingAgg = await prisma.serviceProvider.aggregate({
            _avg: {
                rating: true
            }
        });
        const avgRating = ratingAgg._avg.rating || 0;

        // Providers by category
        const categoryStats = await prisma.serviceProvider.groupBy({
            by: ['category'],
            _count: {
                _all: true
            },
            orderBy: {
                _count: {
                    category: 'desc'
                }
            }
        });

        res.json({
            success: true,
            stats: {
                total: totalProviders,
                verified: verifiedProviders,
                available: availableProviders,
                avgRating: Math.round(avgRating * 10) / 10,
                byCategory: categoryStats.map(s => ({ _id: s.category, count: s._count._all }))
            }
        });
    } catch (error: any) {
        console.error('getProviderStats error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch provider stats'
        });
    }
};
// Get current user's provider profile
export const getMyProviderProfile = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.userId; // Firebase uid

        if (!userId) {
            return res.status(401).json({
                success: false,
                error: 'Authentication required'
            });
        }

        const provider = await prisma.serviceProvider.findFirst({
            where: {
                user: {
                    uid: userId
                }
            },
            include: {
                user: {
                    select: {
                        name: true,
                        email: true,
                        role: true,
                        onboardingCompleted: true
                    }
                }
            }
        });

        if (!provider) {
            return res.status(404).json({
                success: false,
                error: 'Service provider profile not found'
            });
        }

        res.json({
            success: true,
            data: provider
        });
    } catch (error: any) {
        console.error('getMyProviderProfile error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch your profile'
        });
    }
};

// Book a service provider
export const bookProvider = async (req: Request, res: Response) => {
    try {
        const { id: providerId } = req.params;
        const buyerId = (req as any).user?.userId; // Firebase uid
        const { formData, message } = req.body;

        if (!buyerId) {
            return res.status(401).json({
                success: false,
                error: 'Authentication required'
            });
        }

        // Get internal IDs
        const buyer = await prisma.user.findUnique({ where: { uid: buyerId } });
        const provider = await prisma.serviceProvider.findUnique({ 
            where: { id: providerId },
            include: { user: true }
        });

        if (!buyer || !provider) {
            return res.status(404).json({
                success: false,
                error: 'Buyer or Provider not found'
            });
        }

        // Create PartnerCase (Task)
        const partnerCase = await prisma.partnerCase.create({
            data: {
                partnerId: provider.id,
                buyerId: buyer.id,
                type: 'Service Request',
                title: `New Service Request: ${provider.category}`,
                description: message || `Service request from ${buyer.name}`,
                status: 'new',
                metadata: formData || {}
            }
        });

        // Create Notification for Provider
        const notification = await prisma.notification.create({
            data: {
                userId: provider.userId,
                type: 'new_task',
                title: 'New Service Request',
                message: `You have a new service request from ${buyer.name}.`,
                priority: 'high',
                link: `/service-partners/tasks/${partnerCase.id}`,
                metadata: JSON.stringify({ caseId: partnerCase.id })
            }
        });

        // Trigger real-time notification if socket is available
        const io = req.app.get('io');
        if (io) {
            io.to(`notifications:${provider.userId}`).emit('new_notification', notification);
        }

        res.status(201).json({
            success: true,
            message: 'Service booked successfully',
            data: partnerCase
        });
    } catch (error: any) {
        console.error('bookProvider error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to book service provider'
        });
    }
};
