import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
    uid: string;
    email: string;
    name: string;
    role: 'buyer' | 'seller' | 'admin' | 'employee' | 'legal_partner' | 'ground_partner' | 'promoter_partner';
    buyerClientId?: string;
    sellerClientId?: string;
    // Stats for dashboards
    propertiesViewed?: number;
    savedProperties?: number;
    activeOffers?: number;
    budget?: string;
    // Employee details
    phone?: string;
    address?: string;
    branch?: string;
    office?: string;
    branchManagerName?: string;
    onboardingCompleted?: boolean;
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
    // Auth info
    password?: string;
    googleId?: string;
    resetPasswordToken?: string;
    resetPasswordExpires?: Date;
    comparePassword: (password: string) => Promise<boolean>;
    createdAt: Date;
    updatedAt: Date;
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
    buyerClientId: { type: String, unique: true, sparse: true },
    sellerClientId: { type: String, unique: true, sparse: true },
    // Auth
    password: { type: String },
    googleId: { type: String, unique: true, sparse: true },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
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
    // Employee details
    phone: { type: String },
    address: { type: String },
    branch: { type: String },
    office: { type: String },
    branchManagerName: { type: String },
    onboardingCompleted: { type: Boolean, default: false },
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

// Pre-save hook to hash password
UserSchema.pre('save', async function (next) {
    const user = this as any;
    if (!user.isModified('password')) return next();

    try {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
        next();
    } catch (error: any) {
        next(error);
    }
});

// Password comparison method
UserSchema.methods.comparePassword = async function (password: string): Promise<boolean> {
    if (!this.password) return false;
    return bcrypt.compare(password, this.password);
};

export default mongoose.model<IUser>('User', UserSchema);
