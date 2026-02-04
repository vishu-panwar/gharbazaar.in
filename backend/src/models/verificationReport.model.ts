import mongoose, { Schema, Document } from 'mongoose';

export interface IVerificationReport extends Document {
    taskId: mongoose.Types.ObjectId;
    propertyId: mongoose.Types.ObjectId;
    reportType: 'site_visit' | 'verification' | 'inspection' | 'documentation';
    findings?: string;
    recommendation?: 'approve' | 'reject' | 'needs_followup';
    uploadedFiles?: string[];
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
}

const VerificationReportSchema: Schema = new Schema({
    taskId: { type: Schema.Types.ObjectId, ref: 'VerificationTask', required: true },
    propertyId: { type: Schema.Types.ObjectId, ref: 'Property', required: true },
    reportType: { type: String, enum: ['site_visit', 'verification', 'inspection', 'documentation'], default: 'verification' },
    findings: { type: String },
    recommendation: { type: String, enum: ['approve', 'reject', 'needs_followup'] },
    uploadedFiles: [{ type: String }],
    notes: { type: String }
}, {
    timestamps: true
});

VerificationReportSchema.index({ taskId: 1, createdAt: -1 });
VerificationReportSchema.index({ propertyId: 1, createdAt: -1 });

export default mongoose.model<IVerificationReport>('VerificationReport', VerificationReportSchema);
