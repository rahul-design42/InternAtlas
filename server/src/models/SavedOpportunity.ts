import mongoose, { Schema, Document } from 'mongoose';

export interface ISavedOpportunity extends Document {
  userId: mongoose.Types.ObjectId;
  opportunityId: mongoose.Types.ObjectId;
  collectionName?: string;
  createdAt: Date;
  updatedAt: Date;
}

const SavedOpportunitySchema = new Schema<ISavedOpportunity>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    opportunityId: { type: Schema.Types.ObjectId, ref: 'Opportunity', required: true },
    collectionName: { type: String }
  },
  { timestamps: true }
);

SavedOpportunitySchema.index({ userId: 1, opportunityId: 1 }, { unique: true });

export default mongoose.model<ISavedOpportunity>('SavedOpportunity', SavedOpportunitySchema);
