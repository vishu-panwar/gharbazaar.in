import mongoose, { Schema, Document } from 'mongoose';

export interface IAttendance extends Document {
    userId: string; // Linked to User.uid
    date: Date;
    checkIn?: Date;
    checkOut?: Date;
    status: 'present' | 'absent' | 'leave' | 'half_day';
    location?: {
        latitude: number;
        longitude: number;
        address?: string;
    };
    notes?: string;
}

const AttendanceSchema: Schema = new Schema({
    userId: { type: String, required: true, index: true },
    date: { type: Date, required: true, index: true },
    checkIn: { type: Date },
    checkOut: { type: Date },
    status: {
        type: String,
        enum: ['present', 'absent', 'leave', 'half_day'],
        default: 'present'
    },
    location: {
        latitude: Number,
        longitude: Number,
        address: String
    },
    notes: { type: String }
}, {
    timestamps: true
});

// Ensure unique entry per user per day
AttendanceSchema.index({ userId: 1, date: 1 }, { unique: true });

export default mongoose.model<IAttendance>('Attendance', AttendanceSchema);
