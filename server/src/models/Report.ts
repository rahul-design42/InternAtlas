import mongoose, { Schema, Document } from 'mongoose';

export interface IReport extends Document {
  reporterId: mongoose.Types.ObjectId;
  reportedEntityId: mongoose.Types.ObjectId;
  entityModel: 'User' | 'Organization' | 'Opportunity';
  reason: string;
  details?: string;
  status: 'PENDING' | 'INVESTIGATING' | 'RESOLVED' | 'DISMISSED';
  createdAt: Date;
  updatedAt: Date;
}

const ReportSchema = new Schema<IReport>(
  {
    reporterId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    reportedEntityId: { type: Schema.Types.ObjectId, required: true },
    entityModel: { type: String, enum: ['User', 'Organization', 'Opportunity'], required: true },
    reason: { type: String, required: true },
    details: { type: String },
    status: { 
      type: String, 
      enum: ['PENDING', 'INVESTIGATING', 'RESOLVED', 'DISMISSED'], 
      default: 'PENDING' 
    }
  },
  { timestamps: true }
);

export default mongoose.model<IReport>('Report', ReportSchema);
