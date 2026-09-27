import mongoose, { Schema, Document } from 'mongoose';

export interface IAuditLog extends Document {
  actorId: mongoose.Types.ObjectId;
  action: string;
  resourceId?: mongoose.Types.ObjectId;
  resourceModel?: string;
  metadata?: any;
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
}

const AuditLogSchema = new Schema<IAuditLog>(
  {
    actorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    action: { type: String, required: true },
    resourceId: { type: Schema.Types.ObjectId },
    resourceModel: { type: String },
    metadata: { type: Schema.Types.Mixed },
    ipAddress: { type: String },
    userAgent: { type: String }
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export default mongoose.model<IAuditLog>('AuditLog', AuditLogSchema);
