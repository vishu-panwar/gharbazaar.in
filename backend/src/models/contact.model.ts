import mongoose, { Schema, Document } from 'mongoose';

export interface IContact extends Document {
    id: number;
    name: string;
    email: string;
    phone?: string;
    subject: string;
    message: string;
    referenceId: string;
    submittedAt: string;
}

const ContactSchema: Schema = new Schema({
    id: { type: Number, unique: true, sparse: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    subject: { type: String, required: true },
    message: { type: String, required: true },
    referenceId: { type: String, required: true, unique: true },
    submittedAt: { type: String, required: true }
}, {
    timestamps: true
});

export default mongoose.model<IContact>('Contact', ContactSchema);
