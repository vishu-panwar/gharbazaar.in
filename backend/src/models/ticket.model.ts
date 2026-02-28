import mongoose, { Schema, Document } from 'mongoose';

export interface ITicket extends Document {
    userId: string;
    userRole:
        | 'buyer'
        | 'seller'
        | 'employee'
        | 'admin'
        | 'service_partner'
        | 'ground_partner'
        | 'promoter_partner'
        | 'legal_partner';
    categoryTitle: string;
    subCategoryTitle: string;
    problem: string;
    status: 'open' | 'assigned' | 'in_progress' | 'resolved' | 'closed';
    assignedTo?: string;
    assignedToName?: string;
    feedback?: {
        rating: number;
        remarks?: string;
        employeeId?: string;
        employeeName?: string;
        submittedAt?: Date;
    };
    createdAt: Date;
    updatedAt: Date;
    closedAt?: Date;
}

const TicketSchema = new Schema<ITicket>(
    {
        userId: {
            type: String,
            required: true,
            index: true,
        },
        userRole: {
            type: String,
            enum: ['buyer', 'seller', 'employee', 'admin', 'service_partner', 'ground_partner', 'promoter_partner', 'legal_partner'],
            required: true,
        },
        categoryTitle: {
            type: String,
            required: true,
        },
        subCategoryTitle: {
            type: String,
            required: true,
        },
        problem: {
            type: String,
            required: true,
            maxlength: 5000,
        },
        status: {
            type: String,
            enum: ['open', 'assigned', 'in_progress', 'resolved', 'closed'],
            default: 'open',
            index: true,
        },
        assignedTo: {
            type: String,
            index: true,
        },
        assignedToName: String,
        feedback: {
            rating: { type: Number, min: 1, max: 5 },
            remarks: { type: String, maxlength: 1000 },
            employeeId: String,
            employeeName: String,
            submittedAt: Date,
        },
        closedAt: Date,
    },
    {
        timestamps: true,
    }
);

TicketSchema.index({ status: 1, createdAt: -1 });
TicketSchema.index({ assignedTo: 1, status: 1 });

export default mongoose.model<ITicket>('Ticket', TicketSchema);
