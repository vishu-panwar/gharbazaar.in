import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Property from '../models/property.model';
import User from '../models/user.model';
import Notification from '../models/notification.model';
import { uploadFile } from '../utils/fileStorage';

export const createProperty = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.userId || 'demo-seller';

        // Find user to get sellerClientId
        const user = await User.findOne({ uid: userId });
        const sellerClientId = user?.sellerClientId;

        const propertyData = {
            ...req.body,
            sellerId: userId,
            sellerClientId,
            status: 'pending' // Ensure it's pending initially
        };

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

export const trackPropertyView = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const authHeader = req.headers.authorization;
        let userId = 'guest-' + (req.ip || 'unknown');

        // If user is logged in, use their real userId
        if (authHeader && authHeader.startsWith('Bearer ')) {
            try {
                const token = authHeader.substring(7);
                if (token !== 'demo-token') {
                    const { verifyToken } = require('../utils/jwt');
                    const decoded = verifyToken(token);
                    if (decoded && decoded.userId) {
                        userId = decoded.userId;
                    }
                } else {
                    userId = 'demo-buyer';
                }
            } catch (e) {
                // Ignore invalid tokens for view tracking
            }
        }

        // Find property to check if user already viewed it
        const property = await Property.findById(id);
        if (!property) {
            return res.status(404).json({ success: false, error: 'Property not found' });
        }

        // Only increment if user hasn't viewed it yet
        if (!property.viewedBy.includes(userId)) {
            const updatedProperty = await Property.findByIdAndUpdate(
                id,
                {
                    $inc: { views: 1 },
                    $push: { viewedBy: userId }
                },
                { new: true }
            );

            // Emit real-time update via Socket.IO
            const io = req.app.get('io');
            if (io) {
                io.emit('property:view_update', {
                    propertyId: id,
                    views: updatedProperty?.views
                });
            }

            return res.json({ success: true, views: updatedProperty?.views, updated: true });
        }

        res.json({ success: true, views: property.views, updated: false });
    } catch (error) {
        console.error('trackPropertyView error:', error);
        res.status(500).json({ success: false, error: 'Failed to track view' });
    }
};

export const uploadPropertyImage = async (req: Request, res: Response) => {
    try {
        console.log('📸 uploadPropertyImage called');
        console.log('File present:', !!req.file);
        if (req.file) {
            console.log('File details:', {
                originalname: req.file.originalname,
                mimetype: req.file.mimetype,
                size: req.file.size
            });
        }

        if (!req.file) {
            console.error('❌ No file in request');
            return res.status(400).json({ success: false, error: 'No image file provided' });
        }

        const result = await uploadFile(
            req.file.buffer,
            req.file.originalname,
            req.file.mimetype
        );

        res.json({
            success: true,
            url: result.url,
            thumbnailUrl: result.thumbnailUrl
        });
    } catch (error: any) {
        console.error('uploadPropertyImage error:', error);
        res.status(500).json({ success: false, error: error.message || 'Failed to upload image' });
    }
};

export const getMarketInsights = async (req: Request, res: Response) => {
    try {
        // Simple market insights logic
        const totalProperties = await Property.countDocuments({ status: 'active' });

        // Average price by city
        const cityStats = await Property.aggregate([
            { $match: { status: 'active' } },
            {
                $group: {
                    _id: '$city',
                    avgPrice: { $avg: '$price' },
                    count: { $sum: 1 }
                }
            },
            { $sort: { count: -1 } },
            { $limit: 5 }
        ]);

        // Monthly trends (mocked until we have more historical data)
        const trends = [
            { month: 'Jan', count: Math.floor(totalProperties * 0.8) },
            { month: 'Feb', count: Math.floor(totalProperties * 0.9) },
            { month: 'Mar', count: totalProperties }
        ];

        res.json({
            success: true,
            totalProperties,
            cityStats,
            trends,
            marketStatus: totalProperties > 10 ? 'High Activity' : 'Moderate Activity'
        });
    } catch (error: any) {
        console.error('getMarketInsights error:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch market insights' });
    }
};
