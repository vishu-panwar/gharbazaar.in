import mongoose, { Schema, Document } from 'mongoose';

export interface IEmployeeProfile extends Document {
    userId: string; // Linked to User.uid
    employeeId: string; // Formatted professional ID (e.g. GB-EMP-2026-001)
    department: string;
    designation: string;
    joiningDate: Date;
    status: 'active' | 'on_leave' | 'terminated';
    performanceRating?: number;
    emergencyContact?: {
        name: string;
        relationship: string;
        phone: string;
    };
    bankDetails?: {
        accountNumber: string;
        ifscCode: string;
        bankName: string;
    };
    govtIds?: {
        aadharNumber: string;
        panNumber: string;
    };
    currentAddress?: string;
    permanentAddress?: string;
    baseSalary?: number;
    allowances?: number;
    deductions?: number;
}

const EmployeeProfileSchema: Schema = new Schema({
    userId: { type: String, required: true, unique: true, index: true },
    employeeId: { type: String, required: true, unique: true, index: true },
    department: { type: String, required: true, default: 'Sales' },
    designation: { type: String, required: true, default: 'Support Agent' },
    joiningDate: { type: Date, default: Date.now },
    status: {
        type: String,
        enum: ['active', 'on_leave', 'terminated'],
        default: 'active'
    },
    performanceRating: { type: Number, default: 5 },
    emergencyContact: {
        name: String,
        relationship: String,
        phone: String
    },
    bankDetails: {
        accountNumber: String,
        ifscCode: String,
        bankName: String
    },
    govtIds: {
        aadharNumber: String,
        panNumber: String
    },
    currentAddress: String,
    permanentAddress: String,
    baseSalary: { type: Number, default: 0 },
    allowances: { type: Number, default: 0 },
    deductions: { type: Number, default: 0 }
}, {
    timestamps: true
});

export default mongoose.model<IEmployeeProfile>('EmployeeProfile', EmployeeProfileSchema);
