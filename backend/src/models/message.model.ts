import mongoose, { Schema, Document } from 'mongoose';

export interface IMessage extends Document {
    conversationId: mongoose.Types.ObjectId;
    senderId: string;
    senderEmail: string;
    content: string;
    type: 'text' | 'image' | 'file';
    fileUrl?: string;
    thumbnailUrl?: string;
    fileName?: string;
    fileSize?: number;
    read: boolean;
    edited: boolean;
    deleted: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const MessageSchema = new Schema<IMessage>(
    {
        conversationId: {
            type: Schema.Types.ObjectId,
            ref: 'Conversation',
            required: true,
            index: true,
        },
        senderId: {
            type: String,
            required: true,
            index: true,
        },
        senderEmail: {
            type: String,
            required: true,
        },
        content: {
            type: String,
            required: true,
            maxlength: 10000,
        },
        type: {
            type: String,
            enum: ['text', 'image', 'file'],
            default: 'text',
        },
        fileUrl: String,
        thumbnailUrl: String,
        fileName: String,
        fileSize: Number,
        read: {
            type: Boolean,
            default: false,
            index: true,
        },
        edited: {
            type: Boolean,
            default: false,
        },
        deleted: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

MessageSchema.index({ conversationId: 1, createdAt: -1 });
MessageSchema.index({ conversationId: 1, read: 1 });

export default mongoose.model<IMessage>('Message', MessageSchema);
