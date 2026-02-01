import mongoose, { Schema, Document } from 'mongoose';

/**
 * Bid Model
 * Tracks buyer bids/offers on properties
 */

export interface IBid extends Document {
    propertyId: mongoose.Types.ObjectId;
    buyerId: string;
    sellerId: string;
    bidAmount: number;
    message?: string;
    status: 'pending' | 'accepted' | 'rejected' | 'countered';
    counterAmount?: number;
    counterMessage?: string;
    createdAt: Date;
    updatedAt: Date;
}

const BidSchema: Schema = new Schema({
    propertyId: {
        type: Schema.Types.ObjectId,
        ref: 'Property',
        required: true,
        index: true
    },
    buyerId: {
        type: String,
        required: true,
        index: true
    },
    sellerId: {
        type: String,
        required: true,
        index: true
    },
    bidAmount: {
        type: Number,
        required: true,
        min: 0
    },
    message: {
        type: String,
        trim: true,
        maxlength: 500
    },
    status: {
        type: String,
        required: true,
        enum: ['pending', 'accepted', 'rejected', 'countered'],
        default: 'pending',
        index: true
    },
    counterAmount: {
        type: Number,
        min: 0
    },
    counterMessage: {
        type: String,
        trim: true,
        maxlength: 500
    }
}, {
    timestamps: true
});

// Compound indexes for efficient queries
BidSchema.index({ propertyId: 1, status: 1 });
BidSchema.index({ buyerId: 1, status: 1 });
BidSchema.index({ sellerId: 1, status: 1 });
BidSchema.index({ createdAt: -1 });

export default mongoose.model<IBid>('Bid', BidSchema);
