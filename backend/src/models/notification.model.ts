
import mongoose, { Schema, Document } from 'mongoose';

export interface INotification extends Document {
    userId: string;
    type: 'price_drop' | 'new_match' | 'bid_received' | 'bid_accepted' | 'bid_rejected' | 'property_approved' | 'system';
    title: string;
    message: string;
    link?: string;
    isRead: boolean;
    priority: 'low' | 'medium' | 'high';
    metadata?: any;
    createdAt: Date;
    updatedAt: Date;
}

const NotificationSchema: Schema = new Schema({
    userId: { type: String, required: true, index: true },
    type: {
        type: String,
        required: true,
        enum: ['price_drop', 'new_match', 'bid_received', 'bid_accepted', 'bid_rejected', 'property_approved', 'system']
    },
    title: { type: String, required: true },
    message: { type: String, required: true },
    link: { type: String },
    isRead: { type: Boolean, default: false },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'medium'
    },
    metadata: { type: Schema.Types.Mixed },
}, {
    timestamps: true
});

// Index for getting unread notifications quickly
NotificationSchema.index({ userId: 1, isRead: 1 });
NotificationSchema.index({ createdAt: -1 });

export default mongoose.model<INotification>('Notification', NotificationSchema);
