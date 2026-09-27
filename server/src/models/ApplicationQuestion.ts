import mongoose, { Schema, Document } from 'mongoose';

export interface IApplicationQuestion extends Document {
  opportunityId: mongoose.Types.ObjectId;
  question: string;
  type: 'SHORT_TEXT' | 'LONG_TEXT' | 'YES_NO' | 'SINGLE_CHOICE' | 'MULTIPLE_CHOICE' | 'NUMBER';
  isRequired: boolean;
  options?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const ApplicationQuestionSchema = new Schema<IApplicationQuestion>(
  {
    opportunityId: { type: Schema.Types.ObjectId, ref: 'Opportunity', required: true },
    question: { type: String, required: true },
    type: { 
      type: String, 
      enum: ['SHORT_TEXT', 'LONG_TEXT', 'YES_NO', 'SINGLE_CHOICE', 'MULTIPLE_CHOICE', 'NUMBER'],
      required: true
    },
    isRequired: { type: Boolean, default: false },
    options: [{ type: String }]
  },
  { timestamps: true }
);

export default mongoose.model<IApplicationQuestion>('ApplicationQuestion', ApplicationQuestionSchema);
