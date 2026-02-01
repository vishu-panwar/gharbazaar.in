import mongoose, { Schema, Document } from 'mongoose';

export interface ITicket extends Document {
    userId: string;
    userRole: 'buyer' | 'seller';
    categoryTitle: string;
    subCategoryTitle: string;
    problem: string;
    status: 'open' | 'assigned' | 'in_progress' | 'resolved' | 'closed';
    assignedTo?: string;
    assignedToName?: string;
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
            enum: ['buyer', 'seller'],
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
        closedAt: Date,
    },
    {
        timestamps: true,
    }
);

TicketSchema.index({ status: 1, createdAt: -1 });
TicketSchema.index({ assignedTo: 1, status: 1 });

export default mongoose.model<ITicket>('Ticket', TicketSchema);
