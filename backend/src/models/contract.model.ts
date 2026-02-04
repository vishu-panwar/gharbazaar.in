import mongoose, { Schema, Document } from 'mongoose';

export type ContractStatus = 'draft' | 'signed_buyer' | 'signed_seller' | 'executed' | 'cancelled';

export interface IContract extends Document {
    propertyId: mongoose.Types.ObjectId;
    bidId?: mongoose.Types.ObjectId;
    buyerId: string;
    sellerId: string;
    status: ContractStatus;
    agreedPrice: number;
    signedBuyerAt?: Date;
    signedSellerAt?: Date;
    terms?: string;
    createdAt: Date;
    updatedAt: Date;
}

const ContractSchema: Schema = new Schema({
    propertyId: { type: Schema.Types.ObjectId, ref: 'Property', required: true },
    bidId: { type: Schema.Types.ObjectId, ref: 'Bid' },
    buyerId: { type: String, required: true },
    sellerId: { type: String, required: true },
    status: {
        type: String,
        enum: ['draft', 'signed_buyer', 'signed_seller', 'executed', 'cancelled'],
        default: 'draft'
    },
    agreedPrice: { type: Number, required: true },
    signedBuyerAt: { type: Date },
    signedSellerAt: { type: Date },
    terms: { type: String }
}, {
    timestamps: true
});

ContractSchema.index({ buyerId: 1, status: 1, createdAt: -1 });
ContractSchema.index({ sellerId: 1, status: 1, createdAt: -1 });
ContractSchema.index({ propertyId: 1, createdAt: -1 });

export default mongoose.model<IContract>('Contract', ContractSchema);
