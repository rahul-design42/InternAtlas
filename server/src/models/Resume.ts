import mongoose, { Schema, Document } from 'mongoose';

export interface IResume extends Document {
  candidateId: mongoose.Types.ObjectId;
  fileName: string;
  fileUrl: string;
  storageKey: string;
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ResumeSchema = new Schema<IResume>(
  {
    candidateId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    fileName: { type: String, required: true },
    fileUrl: { type: String, required: true },
    storageKey: { type: String, required: true },
    isDefault: { type: Boolean, default: false }
  },
  { timestamps: true }
);

ResumeSchema.index({ candidateId: 1 });

export default mongoose.model<IResume>('Resume', ResumeSchema);
