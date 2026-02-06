import mongoose, { Schema, Document } from 'mongoose';

export type VerificationTaskStatus = 'assigned' | 'in_review' | 'verified' | 'rejected';

export interface IVerificationTask extends Document {
    propertyId: mongoose.Types.ObjectId;
    assignedTo?: string;
    createdBy: string;
    taskType: 'property' | 'documents' | 'site_visit';
    status: VerificationTaskStatus;
    checklist?: string[];
    dueDate?: Date;
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
}

const VerificationTaskSchema: Schema = new Schema({
    propertyId: { type: Schema.Types.ObjectId, ref: 'Property', required: true },
    assignedTo: { type: String },
    createdBy: { type: String, required: true },
    taskType: { type: String, enum: ['property', 'documents', 'site_visit'], default: 'property' },
    status: { type: String, enum: ['assigned', 'in_review', 'verified', 'rejected'], default: 'assigned' },
    checklist: [{ type: String }],
    dueDate: { type: Date },
    notes: { type: String }
}, {
    timestamps: true
});

VerificationTaskSchema.index({ assignedTo: 1, status: 1, createdAt: -1 });
VerificationTaskSchema.index({ propertyId: 1, status: 1 });

export default mongoose.model<IVerificationTask>('VerificationTask', VerificationTaskSchema);
