import mongoose, { Schema, Document } from 'mongoose';

export type PartnerCaseStatus = 'open' | 'in_progress' | 'completed' | 'cancelled';
export type PartnerCaseType = 'legal' | 'ground' | 'promoter';

export interface IPartnerCase extends Document {
    partnerId: string;
    type: PartnerCaseType;
    title: string;
    description?: string;
    status: PartnerCaseStatus;
    propertyId?: mongoose.Types.ObjectId;
    buyerId?: string;
    sellerId?: string;
    amount?: number;
    dueDate?: Date;
    metadata?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}

const PartnerCaseSchema: Schema = new Schema({
    partnerId: { type: String, required: true },
    type: { type: String, enum: ['legal', 'ground', 'promoter'], required: true },
    title: { type: String, required: true },
    description: { type: String },
    status: { type: String, enum: ['open', 'in_progress', 'completed', 'cancelled'], default: 'open' },
    propertyId: { type: Schema.Types.ObjectId, ref: 'Property' },
    buyerId: { type: String },
    sellerId: { type: String },
    amount: { type: Number },
    dueDate: { type: Date },
    metadata: { type: Schema.Types.Mixed }
}, {
    timestamps: true
});

PartnerCaseSchema.index({ partnerId: 1, status: 1, createdAt: -1 });
PartnerCaseSchema.index({ type: 1, status: 1, createdAt: -1 });

export default mongoose.model<IPartnerCase>('PartnerCase', PartnerCaseSchema);
