import mongoose, { Schema, Document } from 'mongoose';

export interface IOrganizationMember extends Document {
  organizationId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  role: 'OWNER' | 'ADMIN' | 'RECRUITER' | 'HIRING_MANAGER';
  status: 'ACTIVE' | 'INVITED' | 'SUSPENDED';
  createdAt: Date;
  updatedAt: Date;
}

const OrganizationMemberSchema = new Schema<IOrganizationMember>(
  {
    organizationId: { type: Schema.Types.ObjectId, ref: 'Organization', required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    role: { type: String, enum: ['OWNER', 'ADMIN', 'RECRUITER', 'HIRING_MANAGER'], default: 'RECRUITER' },
    status: { type: String, enum: ['ACTIVE', 'INVITED', 'SUSPENDED'], default: 'INVITED' }
  },
  { timestamps: true }
);

OrganizationMemberSchema.index({ organizationId: 1, userId: 1 }, { unique: true });

export default mongoose.model<IOrganizationMember>('OrganizationMember', OrganizationMemberSchema);
