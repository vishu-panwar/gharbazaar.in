import mongoose, { Schema, Document } from 'mongoose';

export type ReferralStatus = 'new' | 'contacted' | 'converted' | 'closed';

export interface IReferral extends Document {
    promoterId: string;
    referralCode: string;
    leadName: string;
    leadContact: string;
    status: ReferralStatus;
    commissionAmount?: number;
    metadata?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}

const ReferralSchema: Schema = new Schema({
    promoterId: { type: String, required: true },
    referralCode: { type: String, required: true },
    leadName: { type: String, required: true },
    leadContact: { type: String, required: true },
    status: { type: String, enum: ['new', 'contacted', 'converted', 'closed'], default: 'new' },
    commissionAmount: { type: Number },
    metadata: { type: Schema.Types.Mixed }
}, {
    timestamps: true
});

ReferralSchema.index({ promoterId: 1, status: 1, createdAt: -1 });
ReferralSchema.index({ referralCode: 1 });

export default mongoose.model<IReferral>('Referral', ReferralSchema);
