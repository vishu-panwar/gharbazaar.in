import mongoose, { Schema, Document } from 'mongoose';

export interface IProperty extends Document {
    title: string;
    description: string;
    propertyType: string; // Apartment, Villa, House, etc.
    listingType: string; // sale, rent
    price: number;
    originalPrice?: number;
    location: string;
    address: string;
    city: string;
    bedrooms: number;
    bathrooms: number;
    area: string; // e.g., "1200 sq ft"
    amenities: string[];
    photos: string[];
    status: 'active' | 'pending' | 'rejected' | 'sold' | 'inactive' | 'paused' | 'cancelled' | 'deleted';
    sellerId: string;
    sellerClientId?: string;
    views: number;
    likes: number;
    inquiries: number;
    featured: boolean;
    verified: boolean;
    virtualTour: boolean;
    viewedBy: string[];
    matchScore?: number;
    readyToMove: boolean;
    newListing: boolean;
    priceDropped: boolean;
    updatedAt: Date;
    createdAt: Date;
}

const PropertySchema: Schema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    propertyType: { type: String, required: true },
    listingType: { type: String, required: true, enum: ['sale', 'rent'] },
    price: { type: Number, required: true },
    originalPrice: { type: Number },
    location: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    bedrooms: { type: Number, required: true },
    bathrooms: { type: Number, required: true },
    area: { type: String, required: true },
    amenities: [{ type: String }],
    photos: [{ type: String }],
    status: { type: String, required: true, enum: ['active', 'pending', 'rejected', 'sold', 'inactive', 'paused', 'cancelled', 'deleted'], default: 'pending' },
    sellerId: { type: String, required: true },
    sellerClientId: { type: String },
    views: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    inquiries: { type: Number, default: 0 },
    featured: { type: Boolean, default: false },
    verified: { type: Boolean, default: false },
    virtualTour: { type: Boolean, default: false },
    viewedBy: [{ type: String }],
    matchScore: { type: Number, default: 85 },
    readyToMove: { type: Boolean, default: true },
    newListing: { type: Boolean, default: true },
    priceDropped: { type: Boolean, default: false }
}, {
    timestamps: true
});

export default mongoose.model<IProperty>('Property', PropertySchema);
