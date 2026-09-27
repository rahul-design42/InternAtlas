import mongoose, { Schema, Document } from 'mongoose';

export interface INotification extends Document {
  userId: mongoose.Types.ObjectId;
  type: 'APPLICATION_UPDATE' | 'NEW_MESSAGE' | 'SYSTEM_ALERT' | 'OPPORTUNITY_MATCH' | 'NEW_APPLICATION';
  title: string;
  message: string;
  link?: string;
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const NotificationSchema = new Schema<INotification>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    type: { 
      type: String, 
      enum: ['APPLICATION_UPDATE', 'NEW_MESSAGE', 'SYSTEM_ALERT', 'OPPORTUNITY_MATCH', 'NEW_APPLICATION'],
      required: true
    },
    title: { type: String, required: true },
    message: { type: String, required: true },
    link: { type: String },
    isRead: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export default mongoose.model<INotification>('Notification', NotificationSchema);
