import mongoose, { Schema, Document } from 'mongoose';

export interface IOrganization extends Document {
  name: string;
  slug: string;
  logo?: string;
  description?: string;
  website?: string;
  industry?: string;
  companySize?: string;
  location?: string;
  socialLinks?: {
    linkedin?: string;
    twitter?: string;
    facebook?: string;
  };
  verificationStatus: 'UNVERIFIED' | 'PENDING' | 'VERIFIED' | 'REJECTED' | 'SUSPENDED';
  createdAt: Date;
  updatedAt: Date;
}

const OrganizationSchema = new Schema<IOrganization>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
    logo: { type: String },
    description: { type: String },
    website: { type: String },
    industry: { type: String },
    companySize: { type: String },
    location: { type: String },
    socialLinks: {
      linkedin: String,
      twitter: String,
      facebook: String
    },
    verificationStatus: { 
      type: String, 
      enum: ['UNVERIFIED', 'PENDING', 'VERIFIED', 'REJECTED', 'SUSPENDED'],
      default: 'UNVERIFIED'
    }
  },
  { timestamps: true }
);

export default mongoose.model<IOrganization>('Organization', OrganizationSchema);
