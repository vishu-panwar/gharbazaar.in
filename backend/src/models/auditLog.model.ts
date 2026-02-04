import mongoose, { Schema, Document } from 'mongoose';

export interface IAuditLog extends Document {
    userId?: string;
    role?: string;
    method: string;
    path: string;
    status?: number;
    ip?: string;
    userAgent?: string;
    metadata?: Record<string, any>;
    createdAt: Date;
}

const AuditLogSchema: Schema = new Schema({
    userId: { type: String },
    role: { type: String },
    method: { type: String, required: true },
    path: { type: String, required: true },
    status: { type: Number },
    ip: { type: String },
    userAgent: { type: String },
    metadata: { type: Schema.Types.Mixed }
}, {
    timestamps: { createdAt: true, updatedAt: false }
});

AuditLogSchema.index({ userId: 1, createdAt: -1 });
AuditLogSchema.index({ path: 1, createdAt: -1 });

export default mongoose.model<IAuditLog>('AuditLog', AuditLogSchema);
