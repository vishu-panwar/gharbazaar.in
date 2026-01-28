import mongoose, { Schema, Document } from 'mongoose';

export interface IPresence extends Document {
    userId: string;
    status: 'online' | 'away' | 'offline';
    lastSeen: Date;
    socketId?: string;
    deviceInfo?: string;
    createdAt: Date;
    updatedAt: Date;
}

const PresenceSchema = new Schema<IPresence>(
    {
        userId: {
            type: String,
            required: true,
            unique: true,
            index: true,
        },
        status: {
            type: String,
            enum: ['online', 'away', 'offline'],
            default: 'offline',
            index: true,
        },
        lastSeen: {
            type: Date,
            default: Date.now,
            index: true,
        },
        socketId: String,
        deviceInfo: String,
    },
    {
        timestamps: true,
    }
);

PresenceSchema.index({ status: 1, lastSeen: -1 });
PresenceSchema.index({ lastSeen: 1 }, { expireAfterSeconds: 2592000 }); // Auto-delete after 30 days

export default mongoose.model<IPresence>('Presence', PresenceSchema);
