import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Property from '../models/property.model';

export const createProperty = async (req: Request, res: Response) => {
    try {
        const sellerId = (req as any).user?.userId || 'demo-seller';
        const propertyData = { ...req.body, sellerId };

        const property = await Property.create(propertyData);
        res.status(201).json({ success: true, data: property });
    } catch (error) {
        console.error('createProperty error:', error);
        res.status(500).json({ success: false, error: 'Failed to create property' });
    }
};

export const searchProperties = async (req: Request, res: Response) => {
    try {
        const { limit = 10, city, propertyType, listingType, recommendedFor } = req.query;
        console.log(`🔍 Searching properties:`, { city, propertyType, listingType, recommendedFor });

        // Check DB connection
        if (mongoose.connection.readyState !== 1) {
            console.warn('⚠️  Database not connected (readyState: ' + mongoose.connection.readyState + '). Returning empty results.');
            return res.json({
                success: true,
                properties: [],
                count: 0,
                message: 'Database not ready - returned fallback data'
            });
        }

        const query: any = { status: 'active' };
        if (city) query.city = new RegExp(city as string, 'i');
        if (propertyType && propertyType !== 'all') query.propertyType = propertyType;
        if (listingType && listingType !== 'all') query.listingType = listingType;

        const limitNum = Math.min(Number(limit) || 10, 50);
        const properties = await Property.find(query)
            .limit(limitNum)
            .sort({ createdAt: -1 })
            .lean(); // Use lean for better performance and to avoid toObject issues

        res.json({
            success: true,
            properties,
            count: properties.length
        });
    } catch (error: any) {
        console.error('❌ searchProperties error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to search properties',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

export const getPropertyById = async (req: Request, res: Response) => {
    try {
        const property = await Property.findById(req.params.id);
        if (!property) {
            return res.status(404).json({ success: false, error: 'Property not found' });
        }
        res.json({ success: true, data: property });
    } catch (error) {
        console.error('getPropertyById error:', error);
        res.status(500).json({ success: false, error: 'Failed to get property' });
    }
};

export const getUserProperties = async (req: Request, res: Response) => {
    try {
        const userId = req.params.userId || (req as any).user?.userId;
        const properties = await Property.find({ sellerId: userId });
        res.json({ success: true, properties });
    } catch (error) {
        console.error('getUserProperties error:', error);
        res.status(500).json({ success: false, error: 'Failed to get user properties' });
    }
};
