import mongoose, { Schema, Document } from 'mongoose';

export interface IConversation extends Document {
    participants: string[];
    conversationType: 'buyer-seller' | 'support-ticket' | 'employee-direct';
    propertyId?: string;
    propertyTitle?: string;
    lastMessage?: string;
    lastMessageAt?: Date;
    assignedEmployee?: string;
    assignedEmployeeName?: string;
    priority?: 'low' | 'medium' | 'high' | 'urgent';
    createdAt: Date;
    updatedAt: Date;
}

const ConversationSchema = new Schema<IConversation>(
    {
        participants: {
            type: [String],
            required: true,
            validate: {
                validator: function (v: string[]) {
                    return v.length >= 2;
                },
                message: 'Conversation must have at least 2 participants',
            },
        },
        conversationType: {
            type: String,
            enum: ['buyer-seller', 'support-ticket', 'employee-direct'],
            default: 'buyer-seller',
            index: true,
        },
        propertyId: {
            type: String,
            index: true,
        },
        propertyTitle: String,
        lastMessage: {
            type: String,
            maxlength: 200,
        },
        lastMessageAt: {
            type: Date,
            default: Date.now,
        },
        assignedEmployee: {
            type: String,
            index: true,
        },
        assignedEmployeeName: String,
        priority: {
            type: String,
            enum: ['low', 'medium', 'high', 'urgent'],
            default: 'medium',
        },
    },
    {
        timestamps: true,
    }
);

ConversationSchema.index({ participants: 1, lastMessageAt: -1 });
ConversationSchema.index({ conversationType: 1, assignedEmployee: 1 });

export default mongoose.model<IConversation>('Conversation', ConversationSchema);
