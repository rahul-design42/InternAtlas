import mongoose, { Schema, Document } from 'mongoose';

export interface IOpportunity extends Document {
  organizationId: mongoose.Types.ObjectId;
  createdBy: mongoose.Types.ObjectId;
  title: string;
  slug: string;
  description: string;
  type: 'INTERNSHIP' | 'JOB' | 'COMPETITION' | 'HACKATHON' | 'CONTEST' | 'QUIZ' | 'EVENT' | 'SCHOLARSHIP' | 'WORKSHOP' | 'RESOURCE';
  categoryId?: mongoose.Types.ObjectId;
  location?: string;
  workMode?: 'REMOTE' | 'HYBRID' | 'ON_SITE';
  duration?: string;
  stipend?: string;
  salary?: string;
  eligibility?: string;
  requirements: string[];
  responsibilities: string[];
  benefits: string[];
  skills: mongoose.Types.ObjectId[];
  applicationDeadline?: Date;
  startDate?: Date;
  endDate?: Date;
  applicationMethod: 'EXTERNAL' | 'INTERNAL';
  applicationUrl?: string;
  status: 'DRAFT' | 'SUBMITTED' | 'UNDER_REVIEW' | 'APPROVED' | 'PUBLISHED' | 'CLOSING_SOON' | 'CLOSED' | 'REJECTED' | 'SUSPENDED' | 'ARCHIVED';
  isFeatured: boolean;
  isVerified: boolean;
  views: number;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const OpportunitySchema = new Schema<IOpportunity>(
  {
    organizationId: { type: Schema.Types.ObjectId, ref: 'Organization', required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
    description: { type: String, required: true },
    type: { 
      type: String, 
      enum: ['INTERNSHIP', 'JOB', 'COMPETITION', 'HACKATHON', 'CONTEST', 'QUIZ', 'EVENT', 'SCHOLARSHIP', 'WORKSHOP', 'RESOURCE'],
      required: true 
    },
    categoryId: { type: Schema.Types.ObjectId, ref: 'Category' },
    location: { type: String },
    workMode: { type: String, enum: ['REMOTE', 'HYBRID', 'ON_SITE'] },
    duration: { type: String },
    stipend: { type: String },
    salary: { type: String },
    eligibility: { type: String },
    requirements: [{ type: String }],
    responsibilities: [{ type: String }],
    benefits: [{ type: String }],
    skills: [{ type: Schema.Types.ObjectId, ref: 'Skill' }],
    applicationDeadline: { type: Date },
    startDate: { type: Date },
    endDate: { type: Date },
    applicationMethod: { type: String, enum: ['EXTERNAL', 'INTERNAL'], default: 'INTERNAL' },
    applicationUrl: { type: String },
    status: { 
      type: String, 
      enum: ['DRAFT', 'SUBMITTED', 'UNDER_REVIEW', 'APPROVED', 'PUBLISHED', 'CLOSING_SOON', 'CLOSED', 'REJECTED', 'SUSPENDED', 'ARCHIVED'],
      default: 'DRAFT' 
    },
    isFeatured: { type: Boolean, default: false },
    isVerified: { type: Boolean, default: false },
    views: { type: Number, default: 0 },
    publishedAt: { type: Date }
  },
  { timestamps: true }
);

OpportunitySchema.index({ status: 1, type: 1 });
OpportunitySchema.index({ organizationId: 1 });
OpportunitySchema.index(
  { title: 'text', description: 'text', location: 'text' },
  { weights: { title: 10, location: 5, description: 1 }, name: 'opportunity_text_index' }
);

export default mongoose.model<IOpportunity>('Opportunity', OpportunitySchema);
