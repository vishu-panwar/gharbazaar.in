import mongoose, { Schema, Document } from 'mongoose';

export interface ISalary extends Document {
    userId: string; // Linked to User.uid
    month: string; // e.g. "January" or "2024-01"
    year: number;
    baseSalary: number;
    allowances: number;
    deductions: number;
    netSalary: number;
    status: 'pending' | 'processing' | 'paid' | 'failed';
    paymentDate?: Date;
    paymentMethod?: string;
    transactionReference?: string;
}

const SalarySchema: Schema = new Schema({
    userId: { type: String, required: true, index: true },
    month: { type: String, required: true },
    year: { type: Number, required: true },
    baseSalary: { type: Number, required: true },
    allowances: { type: Number, default: 0 },
    deductions: { type: Number, default: 0 },
    netSalary: { type: Number, required: true },
    status: {
        type: String,
        enum: ['pending', 'processing', 'paid', 'failed'],
        default: 'pending'
    },
    paymentDate: { type: Date },
    paymentMethod: { type: String },
    transactionReference: { type: String }
}, {
    timestamps: true
});

// Compound index to ensure uniqueness per user per month/year
SalarySchema.index({ userId: 1, month: 1, year: 1 }, { unique: true });

export default mongoose.model<ISalary>('Salary', SalarySchema);
