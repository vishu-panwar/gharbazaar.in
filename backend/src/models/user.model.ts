import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
    uid: string;
    email: string;
    name: string;
    role: 'buyer' | 'seller' | 'admin' | 'employee' | 'legal_partner' | 'ground_partner' | 'promoter_partner';
    // Stats for dashboards
    propertiesViewed?: number;
    savedProperties?: number;
    activeOffers?: number;
    budget?: string;
    // Seller stats
    activeListings?: number;
    totalViews?: number;
    inquiries?: number;
    revenue?: string;
    // Subscription info
    planType?: string;
    planProgress?: number;
    daysLeft?: number;
    viewLimit?: number;
    consultationLimit?: number;
    consultationsUsed?: number;
    listingLimit?: number;
}

const UserSchema: Schema = new Schema({
    uid: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    role: {
        type: String,
        required: true,
        enum: ['buyer', 'seller', 'admin', 'employee', 'legal_partner', 'ground_partner', 'promoter_partner'],
        default: 'buyer'
    },
    // Stats
    propertiesViewed: { type: Number, default: 0 },
    savedProperties: { type: Number, default: 0 },
    activeOffers: { type: Number, default: 0 },
    budget: { type: String, default: '₹0' },
    // Seller stats
    activeListings: { type: Number, default: 0 },
    totalViews: { type: Number, default: 0 },
    inquiries: { type: Number, default: 0 },
    revenue: { type: String, default: '₹0' },
    // Subscription info
    planType: { type: String, default: 'Free' },
    planProgress: { type: Number, default: 0 },
    daysLeft: { type: Number, default: 0 },
    viewLimit: { type: Number, default: 10 },
    consultationLimit: { type: Number, default: 0 },
    consultationsUsed: { type: Number, default: 0 },
    listingLimit: { type: Number, default: 3 }
}, {
    timestamps: true
});

export default mongoose.model<IUser>('User', UserSchema);
