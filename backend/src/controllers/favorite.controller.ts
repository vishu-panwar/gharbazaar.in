import { Request, Response } from 'express';
import { prisma } from '../utils/database';

export const toggleFavorite = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.userId || (req as any).user?.id;
        const { propertyId } = req.body;

        if (!propertyId) {
            return res.status(400).json({ success: false, error: 'Property ID is required' });
        }

        // Check if favorite exists
        const existingFavorite = await prisma.favorite.findUnique({
            where: {
                userId_propertyId: {
                    userId,
                    propertyId
                }
            }
        });

        if (existingFavorite) {
            await prisma.favorite.delete({
                where: {
                    id: existingFavorite.id
                }
            });
            return res.json({ success: true, message: 'Removed from favorites', action: 'removed' });
        } else {
            await prisma.favorite.create({
                data: {
                    userId,
                    propertyId
                }
            });
            return res.json({ success: true, message: 'Added to favorites', action: 'added' });
        }
    } catch (error) {
        console.error('Error toggling favorite:', error);
        res.status(500).json({ success: false, error: 'Failed to toggle favorite' });
    }
};

export const getFavorites = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.userId || (req as any).user?.id;
        const favorites = await prisma.favorite.findMany({
            where: { userId },
            include: {
                property: true
            }
        });
        
        // Map to return cleaner property data
        const properties = favorites
            .filter(f => f.property) // Ensure property still exists
            .map(f => f.property);

        res.json({ success: true, properties });
    } catch (error) {
        console.error('Error fetching favorites:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch favorites' });
    }
};

export const syncFavorites = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.userId || (req as any).user?.id;
        const { propertyIds } = req.body; // Array of IDs from localStorage

        if (!Array.isArray(propertyIds)) {
            return res.status(400).json({ success: false, error: 'Property IDs must be an array' });
        }

        // Add favorites that don't already exist in the DB
        for (const pid of propertyIds) {
            try {
                await prisma.favorite.upsert({
                    where: {
                        userId_propertyId: {
                            userId,
                            propertyId: pid
                        }
                    },
                    create: {
                        userId,
                        propertyId: pid
                    },
                    update: {} // Do nothing if exists
                });
            } catch (e) {
                // Silently skip errors for individual properties
            }
        }

        const updatedFavorites = await prisma.favorite.findMany({
            where: { userId },
            include: {
                property: true
            }
        });
        
        const properties = updatedFavorites
            .filter(f => f.property)
            .map(f => f.property);

        res.json({ success: true, properties, message: 'Favorites synced successfully' });
    } catch (error) {
        console.error('Error syncing favorites:', error);
        res.status(500).json({ success: false, error: 'Failed to sync favorites' });
    }
};
