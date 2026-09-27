import mongoose, { Schema, Document } from 'mongoose';

export interface IConversation extends Document {
  applicationId: mongoose.Types.ObjectId;
  candidateId: mongoose.Types.ObjectId;
  organizationId: mongoose.Types.ObjectId;
  recruiterId?: mongoose.Types.ObjectId; // Optional primary contact
  status: 'OPEN' | 'CLOSED';
  lastMessageAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ConversationSchema = new Schema<IConversation>(
  {
    applicationId: { type: Schema.Types.ObjectId, ref: 'Application', required: true, unique: true },
    candidateId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    organizationId: { type: Schema.Types.ObjectId, ref: 'Organization', required: true },
    recruiterId: { type: Schema.Types.ObjectId, ref: 'User' },
    status: { type: String, enum: ['OPEN', 'CLOSED'], default: 'OPEN' },
    lastMessageAt: { type: Date }
  },
  { timestamps: true }
);

ConversationSchema.index({ candidateId: 1 });
ConversationSchema.index({ organizationId: 1 });
ConversationSchema.index({ lastMessageAt: -1 });

export default mongoose.model<IConversation>('Conversation', ConversationSchema);
