import mongoose, { Schema, Document } from 'mongoose';

export type PaymentStatus = 'created' | 'authorized' | 'captured' | 'failed' | 'refunded';

export interface IPaymentTransaction extends Document {
    userId: string;
    contractId?: mongoose.Types.ObjectId;
    serviceId?: string;
    amount: number;
    currency: string;
    status: PaymentStatus;
    razorpayOrderId?: string;
    razorpayPaymentId?: string;
    razorpaySignature?: string;
    metadata?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}

const PaymentTransactionSchema: Schema = new Schema({
    userId: { type: String, required: true },
    contractId: { type: Schema.Types.ObjectId, ref: 'Contract' },
    serviceId: { type: String },
    amount: { type: Number, required: true },
    currency: { type: String, default: 'INR' },
    status: {
        type: String,
        enum: ['created', 'authorized', 'captured', 'failed', 'refunded'],
        default: 'created'
    },
    razorpayOrderId: { type: String },
    razorpayPaymentId: { type: String },
    razorpaySignature: { type: String },
    metadata: { type: Schema.Types.Mixed }
}, {
    timestamps: true
});

PaymentTransactionSchema.index({ userId: 1, status: 1, createdAt: -1 });
PaymentTransactionSchema.index({ contractId: 1 });
PaymentTransactionSchema.index({ razorpayOrderId: 1 });

export default mongoose.model<IPaymentTransaction>('PaymentTransaction', PaymentTransactionSchema);
