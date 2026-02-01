import mongoose, { Schema, Document } from 'mongoose';

/**
 * Plan Model
 * Defines subscription plans for buyers and sellers
 * This is a NEW model - does not modify existing user authentication
 */

export interface IPlanFeatures {
    // Buyer Features
    viewLimit?: number;
    contactAccess?: boolean;
    mapAccess?: boolean;
    bidAccess?: boolean;
    consultationLimit?: number;
    favoritesLimit?: number;
    
    // Seller Features
    listingLimit?: number;
    featuredListings?: number;
    analyticsAccess?: boolean;
    prioritySupport?: boolean;
    verificationBadge?: boolean;
}

export interface IPlan extends Document {
    name: string;
    slug: string;
    type: 'buyer' | 'seller';
    price: number;
    originalPrice?: number;
    duration: number; // in days
    description: string;
    features: IPlanFeatures;
    isActive: boolean;
    isPopular: boolean;
    badge?: string;
    createdAt: Date;
    updatedAt: Date;
}

const PlanSchema: Schema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    type: {
        type: String,
        required: true,
        enum: ['buyer', 'seller']
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    originalPrice: {
        type: Number,
        min: 0
    },
    duration: {
        type: Number,
        required: true,
        min: 1
    },
    description: {
        type: String,
        required: true
    },
    features: {
        // Buyer Features
        viewLimit: { type: Number },
        contactAccess: { type: Boolean, default: false },
        mapAccess: { type: Boolean, default: false },
        bidAccess: { type: Boolean, default: false },
        consultationLimit: { type: Number, default: 0 },
        favoritesLimit: { type: Number, default: 2 },
        
        // Seller Features
        listingLimit: { type: Number },
        featuredListings: { type: Number, default: 0 },
        analyticsAccess: { type: Boolean, default: false },
        prioritySupport: { type: Boolean, default: false },
        verificationBadge: { type: Boolean, default: false }
    },
    isActive: {
        type: Boolean,
        default: true
    },
    isPopular: {
        type: Boolean,
        default: false
    },
    badge: {
        type: String,
        trim: true
    }
}, {
    timestamps: true
});

// Index for faster queries
PlanSchema.index({ type: 1, isActive: 1 });
PlanSchema.index({ slug: 1 });

export default mongoose.model<IPlan>('Plan', PlanSchema);
