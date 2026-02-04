import mongoose, { Schema, Document } from 'mongoose';

export type PayoutStatus = 'pending' | 'processing' | 'paid' | 'failed';

export interface IPayout extends Document {
    partnerId: string;
    amount: number;
    method: 'bank-transfer' | 'upi' | 'wallet';
    status: PayoutStatus;
    reference?: string;
    periodStart?: Date;
    periodEnd?: Date;
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
}

const PayoutSchema: Schema = new Schema({
    partnerId: { type: String, required: true },
    amount: { type: Number, required: true },
    method: { type: String, enum: ['bank-transfer', 'upi', 'wallet'], default: 'bank-transfer' },
    status: { type: String, enum: ['pending', 'processing', 'paid', 'failed'], default: 'pending' },
    reference: { type: String },
    periodStart: { type: Date },
    periodEnd: { type: Date },
    notes: { type: String }
}, {
    timestamps: true
});

PayoutSchema.index({ partnerId: 1, status: 1, createdAt: -1 });

export default mongoose.model<IPayout>('Payout', PayoutSchema);
