import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  email: string;
  passwordHash: string;
  role: 'CANDIDATE' | 'RECRUITER' | 'ADMIN';
  status: 'ACTIVE' | 'SUSPENDED' | 'BANNED' | 'DEACTIVATED' | 'PENDING_VERIFICATION';
  emailVerified: boolean;
  lastLoginAt?: Date;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ['CANDIDATE', 'RECRUITER', 'ADMIN'], default: 'CANDIDATE' },
    status: { 
      type: String, 
      enum: ['ACTIVE', 'SUSPENDED', 'BANNED', 'DEACTIVATED', 'PENDING_VERIFICATION'],
      default: 'PENDING_VERIFICATION' 
    },
    emailVerified: { type: Boolean, default: false },
    lastLoginAt: { type: Date },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date }
  },
  { timestamps: true }
);

export default mongoose.model<IUser>('User', UserSchema);
