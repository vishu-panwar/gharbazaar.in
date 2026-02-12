import mongoose, { Schema, Document } from 'mongoose';

export interface IServiceProvider extends Document {
    userId: mongoose.Types.ObjectId;
    category: 'lawyer' | 'architect' | 'designer' | 'contractor' | 'photographer' | 'consultant';
    specialization: string;
    rating: number;
    reviews: number;
    completedProjects: number;
    hourlyRate: number;
    location: string;
    verified: boolean;
    available: boolean;
    description: string;
    skills: string[];
    experience: number;
    portfolio: string[];
    profileImage?: string;
    createdAt: Date;
    updatedAt: Date;
}

const ServiceProviderSchema: Schema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    category: {
        type: String,
        required: true,
        enum: ['lawyer', 'architect', 'designer', 'contractor', 'photographer', 'consultant']
    },
    specialization: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },
    reviews: {
        type: Number,
        default: 0
    },
    completedProjects: {
        type: Number,
        default: 0
    },
    hourlyRate: {
        type: Number,
        required: true,
        min: 0
    },
    location: {
        type: String,
        required: true
    },
    verified: {
        type: Boolean,
        default: false
    },
    available: {
        type: Boolean,
        default: true
    },
    description: {
        type: String,
        required: true,
        maxlength: 1000
    },
    skills: {
        type: [String],
        default: []
    },
    experience: {
        type: Number,
        required: true,
        min: 0
    },
    portfolio: {
        type: [String],
        default: []
    },
    profileImage: {
        type: String
    }
}, {
    timestamps: true
});

// Index for efficient queries
ServiceProviderSchema.index({ category: 1, verified: 1, available: 1 });
ServiceProviderSchema.index({ location: 1 });
ServiceProviderSchema.index({ rating: -1 });

export default mongoose.model<IServiceProvider>('ServiceProvider', ServiceProviderSchema);
