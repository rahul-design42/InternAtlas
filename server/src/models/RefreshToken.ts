import mongoose, { Schema, Document } from 'mongoose';

export interface IRefreshToken extends Document {
  token: string;
  userId: mongoose.Types.ObjectId;
  expiresAt: Date;
  isRevoked: boolean;
  replacedByToken?: string;
  family?: string;
  createdAt: Date;
  updatedAt: Date;
}

const RefreshTokenSchema = new Schema<IRefreshToken>(
  {
    token: { type: String, required: true, unique: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    expiresAt: { type: Date, required: true },
    isRevoked: { type: Boolean, default: false },
    replacedByToken: { type: String },
    family: { type: String }
  },
  { timestamps: true }
);

RefreshTokenSchema.index({ userId: 1 });

export default mongoose.model<IRefreshToken>('RefreshToken', RefreshTokenSchema);
