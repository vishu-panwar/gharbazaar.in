import mongoose, { Schema, Document, Model } from 'mongoose';

/**
 * UserPlan Model
 * Tracks user subscriptions and plan usage
 * Links users to plans without modifying user.model.ts
 */

export interface IUsageStats {
    // Buyer Usage
    viewsUsed?: number;
    consultationsUsed?: number;
    favoritesUsed?: number;
    
    // Seller Usage
    listingsUsed?: number;
    featuredListingsUsed?: number;
    
    lastResetDate?: Date;
}

export interface IUserPlan extends Document {
    userId: string;
    planId: mongoose.Types.ObjectId;
    status: 'active' | 'expired' | 'cancelled' | 'pending';
    paymentId?: string;
    orderId?: string;
    startDate: Date;
    expiryDate: Date;
    usageStats: IUsageStats;
    autoRenew: boolean;
    createdAt: Date;
    updatedAt: Date;
    isValid(): boolean;
    hasReachedLimit(feature: keyof IUsageStats, limit: number): boolean;
}

export interface IUserPlanModel extends Model<IUserPlan> {
    getActivePlan(userId: string, planType?: 'buyer' | 'seller'): Promise<IUserPlan | null>;
}

const UserPlanSchema: Schema = new Schema({
    userId: {
        type: String,
        required: true,
        index: true
    },
    planId: {
        type: Schema.Types.ObjectId,
        ref: 'Plan',
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: ['active', 'expired', 'cancelled', 'pending'],
        default: 'pending'
    },
    paymentId: {
        type: String,
        trim: true
    },
    orderId: {
        type: String,
        trim: true
    },
    startDate: {
        type: Date,
        required: true,
        default: Date.now
    },
    expiryDate: {
        type: Date,
        required: true
    },
    usageStats: {
        // Buyer Usage
        viewsUsed: { type: Number, default: 0 },
        consultationsUsed: { type: Number, default: 0 },
        favoritesUsed: { type: Number, default: 0 },
        
        // Seller Usage
        listingsUsed: { type: Number, default: 0 },
        featuredListingsUsed: { type: Number, default: 0 },
        
        lastResetDate: { type: Date, default: Date.now }
    },
    autoRenew: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

// Compound indexes for efficient queries
UserPlanSchema.index({ userId: 1, status: 1 });
UserPlanSchema.index({ expiryDate: 1, status: 1 });
UserPlanSchema.index({ userId: 1, planId: 1 });

// Method to check if plan is still valid
UserPlanSchema.methods.isValid = function(): boolean {
    return this.status === 'active' && this.expiryDate > new Date();
};

// Method to check if user has reached limit for a feature
UserPlanSchema.methods.hasReachedLimit = function(feature: keyof IUsageStats, limit: number): boolean {
    const used = this.usageStats[feature] || 0;
    return used >= limit;
};

// Static method to get active plan for user
UserPlanSchema.statics.getActivePlan = async function(userId: string, planType?: 'buyer' | 'seller') {
    const query: any = {
        userId,
        status: 'active',
        expiryDate: { $gt: new Date() }
    };
    
    const userPlan = await this.findOne(query).exec();
    
    // If planType is specified and plan doesn't match, return null
    if (userPlan && planType) {
        const plan = await mongoose.model('Plan').findById(userPlan.planId);
        if (plan && plan.type !== planType) {
            return null;
        }
    }
    
    return userPlan;
};

export default mongoose.model<IUserPlan, IUserPlanModel>('UserPlan', UserPlanSchema);
