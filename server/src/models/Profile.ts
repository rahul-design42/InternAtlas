import mongoose, { Schema, Document } from 'mongoose';

export interface IEducation {
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startDate: Date;
  endDate?: Date;
  currentlyStudying: boolean;
}

export interface IExperience {
  company: string;
  title: string;
  employmentType: string;
  location: string;
  startDate: Date;
  endDate?: Date;
  currentlyWorking: boolean;
  description?: string;
}

export interface IProject {
  title: string;
  description: string;
  technologies: string[];
  projectUrl?: string;
  repositoryUrl?: string;
}

export interface IAchievement {
  title: string;
  description?: string;
  date?: Date;
  issuingOrganization?: string;
}

export interface IProfile extends Document {
  userId: mongoose.Types.ObjectId;
  firstName: string;
  lastName: string;
  username: string;
  headline?: string;
  bio?: string;
  location?: string;
  avatarUrl?: string;
  education: IEducation[];
  experience: IExperience[];
  projects: IProject[];
  achievements: IAchievement[];
  skills: mongoose.Types.ObjectId[];
  preferences?: {
    types?: string[];
    locations?: string[];
    workModes?: string[];
  };
  links: {
    github?: string;
    linkedin?: string;
    portfolio?: string;
    other?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const EducationSchema = new Schema<IEducation>({
  institution: { type: String, required: true },
  degree: { type: String, required: true },
  fieldOfStudy: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date },
  currentlyStudying: { type: Boolean, default: false }
});

const ExperienceSchema = new Schema<IExperience>({
  company: { type: String, required: true },
  title: { type: String, required: true },
  employmentType: { type: String, required: true },
  location: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date },
  currentlyWorking: { type: Boolean, default: false },
  description: { type: String }
});

const ProjectSchema = new Schema<IProject>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  technologies: [{ type: String }],
  projectUrl: { type: String },
  repositoryUrl: { type: String }
});

const AchievementSchema = new Schema<IAchievement>({
  title: { type: String, required: true },
  description: { type: String },
  date: { type: Date },
  issuingOrganization: { type: String }
});

const ProfileSchema = new Schema<IProfile>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    headline: { type: String },
    bio: { type: String },
    location: { type: String },
    avatarUrl: { type: String },
    education: [EducationSchema],
    experience: [ExperienceSchema],
    projects: [ProjectSchema],
    achievements: [AchievementSchema],
    skills: [{ type: Schema.Types.ObjectId, ref: 'Skill' }],
    preferences: {
      types: [{ type: String }],
      locations: [{ type: String }],
      workModes: [{ type: String }]
    },
    links: {
      github: { type: String },
      linkedin: { type: String },
      portfolio: { type: String },
      other: { type: String }
    }
  },
  { timestamps: true }
);

export default mongoose.model<IProfile>('Profile', ProfileSchema);
