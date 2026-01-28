import mongoose, { Schema, Document } from 'mongoose';

export interface ITicketMessage extends Document {
    ticketId: mongoose.Types.ObjectId;
    senderId: string;
    senderType: 'customer' | 'employee';
    message: string;
    fileUrl?: string;
    fileName?: string;
    timestamp: Date;
}

const TicketMessageSchema = new Schema<ITicketMessage>(
    {
        ticketId: {
            type: Schema.Types.ObjectId,
            ref: 'Ticket',
            required: true,
            index: true,
        },
        senderId: {
            type: String,
            required: true,
        },
        senderType: {
            type: String,
            enum: ['customer', 'employee'],
            required: true,
        },
        message: {
            type: String,
            required: true,
            maxlength: 3000,
        },
        fileUrl: String,
        fileName: String,
        timestamp: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: false,
    }
);

TicketMessageSchema.index({ ticketId: 1, timestamp: 1 });

export default mongoose.model<ITicketMessage>('TicketMessage', TicketMessageSchema);
