import mongoose, { Schema, Document } from 'mongoose';

export interface ISkill extends Document {
  name: string;
  slug: string;
  categoryId?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const SkillSchema = new Schema<ISkill>(
  {
    name: { type: String, required: true, unique: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
    categoryId: { type: Schema.Types.ObjectId, ref: 'Category' }
  },
  { timestamps: true }
);

export default mongoose.model<ISkill>('Skill', SkillSchema);
