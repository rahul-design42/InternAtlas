import mongoose, { Schema, Document } from 'mongoose';

export interface IApplication extends Document {
  candidateId: mongoose.Types.ObjectId;
  opportunityId: mongoose.Types.ObjectId;
  organizationId: mongoose.Types.ObjectId;
  resumeId?: mongoose.Types.ObjectId;
  coverLetter?: string;
  answers: any[];
  status: 'SUBMITTED' | 'UNDER_REVIEW' | 'SHORTLISTED' | 'INTERVIEW' | 'OFFER' | 'ACCEPTED' | 'REJECTED';
  submittedAt: Date;
  updatedAt: Date;
}

const ApplicationSchema = new Schema<IApplication>(
  {
    candidateId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    opportunityId: { type: Schema.Types.ObjectId, ref: 'Opportunity', required: true },
    organizationId: { type: Schema.Types.ObjectId, ref: 'Organization', required: true },
    resumeId: { type: Schema.Types.ObjectId, ref: 'Resume' },
    coverLetter: { type: String },
    answers: [{ type: Schema.Types.Mixed }],
    status: { 
      type: String, 
      enum: ['SUBMITTED', 'UNDER_REVIEW', 'SHORTLISTED', 'INTERVIEW', 'OFFER', 'ACCEPTED', 'REJECTED'],
      default: 'SUBMITTED'
    },
    submittedAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

ApplicationSchema.index({ candidateId: 1, opportunityId: 1 }, { unique: true });
ApplicationSchema.index({ organizationId: 1, status: 1 });

export default mongoose.model<IApplication>('Application', ApplicationSchema);
