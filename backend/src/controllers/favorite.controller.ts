import { Request, Response } from 'express';
import Favorite from '../models/favorite.model';
import Property from '../models/property.model';

export const toggleFavorite = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.userId;
        const { propertyId } = req.body;

        if (!propertyId) {
            return res.status(400).json({ success: false, error: 'Property ID is required' });
        }

        const existingFavorite = await Favorite.findOne({ userId, propertyId });

        if (existingFavorite) {
            await Favorite.deleteOne({ _id: existingFavorite._id });
            return res.json({ success: true, message: 'Removed from favorites', action: 'removed' });
        } else {
            await Favorite.create({ userId, propertyId });
            return res.json({ success: true, message: 'Added to favorites', action: 'added' });
        }
    } catch (error) {
        console.error('Error toggling favorite:', error);
        res.status(500).json({ success: false, error: 'Failed to toggle favorite' });
    }
};

export const getFavorites = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.userId;
        const favorites = await Favorite.find({ userId }).populate('propertyId');
        
        // Map to return cleaner property data
        const properties = favorites
            .filter(f => f.propertyId) // Ensure property still exists
            .map(f => f.propertyId);

        res.json({ success: true, properties });
    } catch (error) {
        console.error('Error fetching favorites:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch favorites' });
    }
};

export const syncFavorites = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.userId;
        const { propertyIds } = req.body; // Array of IDs from localStorage

        if (!Array.isArray(propertyIds)) {
            return res.status(400).json({ success: false, error: 'Property IDs must be an array' });
        }

        // Add favorites that don't already exist in the DB
        for (const pid of propertyIds) {
            try {
                // We use try/catch inside to continue even if one fails (e.g. duplicate or invalid ID)
                const exists = await Favorite.findOne({ userId, propertyId: pid });
                if (!exists) {
                    await Favorite.create({ userId, propertyId: pid });
                }
            } catch (e) {
                // Silently skip errors for individual properties
            }
        }

        const updatedFavorites = await Favorite.find({ userId }).populate('propertyId');
        const properties = updatedFavorites
            .filter(f => f.propertyId)
            .map(f => f.propertyId);

        res.json({ success: true, properties, message: 'Favorites synced successfully' });
    } catch (error) {
        console.error('Error syncing favorites:', error);
        res.status(500).json({ success: false, error: 'Failed to sync favorites' });
    }
};
