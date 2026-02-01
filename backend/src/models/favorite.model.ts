import mongoose, { Schema, Document } from 'mongoose';

export interface IFavorite extends Document {
  userId: string;
  propertyId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const FavoriteSchema: Schema = new Schema({
  userId: { type: String, required: true, index: true },
  propertyId: { type: Schema.Types.ObjectId, ref: 'Property', required: true }
}, {
  timestamps: true
});

// Compound index for uniqueness: a user can favorite a property only once
FavoriteSchema.index({ userId: 1, propertyId: 1 }, { unique: true });

export default mongoose.model<IFavorite>('Favorite', FavoriteSchema);
