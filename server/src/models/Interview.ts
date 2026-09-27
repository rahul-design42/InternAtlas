import mongoose, { Schema, Document } from 'mongoose';

export interface IInterview extends Document {
  applicationId: mongoose.Types.ObjectId;
  conversationId?: mongoose.Types.ObjectId;
  proposedBy: mongoose.Types.ObjectId; // recruiter userId
  startAt: Date;
  endAt: Date;
  timezone: string;
  status: 'PROPOSED' | 'ACCEPTED' | 'DECLINED' | 'CANCELLED';
  note?: string;
  createdAt: Date;
  updatedAt: Date;
}

const InterviewSchema = new Schema<IInterview>(
  {
    applicationId: { type: Schema.Types.ObjectId, ref: 'Application', required: true },
    conversationId: { type: Schema.Types.ObjectId, ref: 'Conversation' },
    proposedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    startAt: { type: Date, required: true },
    endAt: { type: Date, required: true },
    timezone: { type: String, required: true },
    status: { 
      type: String, 
      enum: ['PROPOSED', 'ACCEPTED', 'DECLINED', 'CANCELLED'], 
      default: 'PROPOSED' 
    },
    note: { type: String, maxlength: 1000 }
  },
  { timestamps: true }
);

InterviewSchema.index({ applicationId: 1 });
InterviewSchema.index({ status: 1 });
InterviewSchema.index({ startAt: 1 });

export default mongoose.model<IInterview>('Interview', InterviewSchema);
