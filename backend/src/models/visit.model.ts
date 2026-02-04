import mongoose, { Schema, Document } from 'mongoose';

export type VisitStatus = 'requested' | 'scheduled' | 'in_progress' | 'completed' | 'cancelled';

export interface IVisit extends Document {
    propertyId: mongoose.Types.ObjectId;
    buyerId: string;
    sellerId: string;
    partnerId?: string;
    scheduledAt?: Date;
    status: VisitStatus;
    notes?: string;
    address?: string;
    location?: {
        lat?: number;
        lng?: number;
    };
    createdAt: Date;
    updatedAt: Date;
}

const VisitSchema: Schema = new Schema({
    propertyId: { type: Schema.Types.ObjectId, ref: 'Property', required: true },
    buyerId: { type: String, required: true },
    sellerId: { type: String, required: true },
    partnerId: { type: String },
    scheduledAt: { type: Date },
    status: {
        type: String,
        enum: ['requested', 'scheduled', 'in_progress', 'completed', 'cancelled'],
        default: 'requested'
    },
    notes: { type: String },
    address: { type: String },
    location: {
        lat: { type: Number },
        lng: { type: Number }
    }
}, {
    timestamps: true
});

VisitSchema.index({ buyerId: 1, status: 1, createdAt: -1 });
VisitSchema.index({ sellerId: 1, status: 1, createdAt: -1 });
VisitSchema.index({ partnerId: 1, status: 1, createdAt: -1 });
VisitSchema.index({ propertyId: 1, createdAt: -1 });

export default mongoose.model<IVisit>('Visit', VisitSchema);
