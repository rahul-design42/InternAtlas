import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { Profile, SavedOpportunity, Application, Opportunity, Skill, Notification } from '../models';
import { notifyUser } from '../utils/notificationService';

export const getDashboard = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;

    const applicationsCount = await Application.countDocuments({ candidateId: userId });
    const savedCount = await SavedOpportunity.countDocuments({ userId });
    
    // Aggregate application statuses
    const stats = await Application.aggregate([
      { $match: { candidateId: userId } },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    res.status(200).json({
      success: true,
      data: {
        applicationsCount,
        savedCount,
        stats
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const profile = await Profile.findOne({ userId: req.user!.id }).populate('skills', 'name');
    if (!profile) {
      res.status(404).json({ success: false, message: 'Profile not found' });
      return;
    }
    res.status(200).json({ success: true, data: profile });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const { 
      firstName, lastName, headline, bio, location, 
      education, experience, projects, achievements, 
      links, skills, avatarUrl 
    } = req.body;

    let skillIds: mongoose.Types.ObjectId[] | undefined = undefined;

    if (skills && Array.isArray(skills)) {
      skillIds = [];
      for (const skillName of skills) {
        if (typeof skillName !== 'string' || !skillName.trim()) continue;
        const name = skillName.trim();
        const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
        
        let skillDoc = await Skill.findOne({ slug });
        if (!skillDoc) {
          skillDoc = await Skill.create({ name, slug });
        }
        skillIds.push(skillDoc._id as mongoose.Types.ObjectId);
      }
    }

    const updateData = {
      ...(firstName && { firstName }),
      ...(lastName && { lastName }),
      ...(headline !== undefined && { headline }),
      ...(bio !== undefined && { bio }),
      ...(location !== undefined && { location }),
      ...(education && { education }),
      ...(experience && { experience }),
      ...(projects && { projects }),
      ...(achievements && { achievements }),
      ...(links && { links }),
      ...(skillIds && { skills: skillIds }),
      ...(avatarUrl && { avatarUrl }),
    };

    const profile = await Profile.findOneAndUpdate(
      { userId: req.user!.id },
      { $set: updateData },
      { new: true, runValidators: true }
    ).populate('skills', 'name');

    res.status(200).json({ success: true, data: profile });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getSavedOpportunities = async (req: Request, res: Response): Promise<void> => {
  try {
    const saved = await SavedOpportunity.find({ userId: req.user!.id })
      .populate({
        path: 'opportunityId',
        populate: { path: 'organizationId', select: 'name logo isVerified' }
      })
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: saved });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const toggleSaveOpportunity = async (req: Request, res: Response): Promise<void> => {
  try {
    const { opportunityId } = req.body;
    if (!opportunityId) {
      res.status(400).json({ success: false, message: 'Opportunity ID required' });
      return;
    }

    const existing = await SavedOpportunity.findOne({ userId: req.user!.id, opportunityId });
    if (existing) {
      await existing.deleteOne();
      res.status(200).json({ success: true, message: 'Opportunity removed from saved list', saved: false });
    } else {
      await SavedOpportunity.create({ userId: req.user!.id, opportunityId });
      res.status(201).json({ success: true, message: 'Opportunity saved', saved: true });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

import { storageService } from '../services/storageService';
import { Resume } from '../models';

export const uploadResume = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ success: false, message: 'No file uploaded' });
      return;
    }

    const { originalname, mimetype, buffer } = req.file;
    const { url, key } = await storageService.uploadFile(buffer, originalname, mimetype, 'resumes');

    // Make this the default if it's their first resume
    const count = await Resume.countDocuments({ candidateId: req.user!.id });
    const isDefault = count === 0;

    const resume = await Resume.create({
      candidateId: req.user!.id,
      fileName: originalname,
      fileUrl: url,
      storageKey: key,
      isDefault
    });

    res.status(201).json({ success: true, data: resume });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getResumes = async (req: Request, res: Response): Promise<void> => {
  try {
    const resumes = await Resume.find({ candidateId: req.user!.id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: resumes });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteResume = async (req: Request, res: Response): Promise<void> => {
  try {
    const resume = await Resume.findOne({ _id: req.params.id, candidateId: req.user!.id });
    if (!resume) {
      res.status(404).json({ success: false, message: 'Resume not found' });
      return;
    }

    await storageService.deleteFile(resume.storageKey);
    await resume.deleteOne();

    res.status(200).json({ success: true, message: 'Resume deleted' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const applyToOpportunity = async (req: Request, res: Response): Promise<void> => {
  try {
    const opportunityId = req.params.id;
    const { resumeId, answers } = req.body;

    const opportunity = await Opportunity.findById(opportunityId);
    if (!opportunity || opportunity.status !== 'PUBLISHED') {
      res.status(404).json({ success: false, message: 'Opportunity not found or not open' });
      return;
    }

    // Check if already applied
    const existingApplication = await Application.findOne({ candidateId: req.user!.id, opportunityId });
    if (existingApplication) {
      res.status(400).json({ success: false, message: 'You have already applied to this opportunity' });
      return;
    }

    let validResumeId = resumeId;
    if (!validResumeId) {
      const defaultResume = await Resume.findOne({ candidateId: req.user!.id, isDefault: true });
      if (!defaultResume) {
         res.status(400).json({ success: false, message: 'A resume is required to apply' });
         return;
      }
      validResumeId = defaultResume._id;
    } else {
      const resume = await Resume.findOne({ _id: validResumeId, candidateId: req.user!.id });
      if (!resume) {
        res.status(400).json({ success: false, message: 'Invalid resume selected' });
        return;
      }
    }

    const application = await Application.create({
      candidateId: new mongoose.Types.ObjectId(req.user!.id),
      opportunityId: new mongoose.Types.ObjectId(opportunityId as string),
      organizationId: new mongoose.Types.ObjectId(opportunity.organizationId as any),
      resumeId: new mongoose.Types.ObjectId(validResumeId as string),
      answers: answers || [],
      status: 'SUBMITTED'
    });

    await notifyUser(
      opportunity.createdBy,
      'NEW_APPLICATION',
      `New Application: ${opportunity.title}`,
      `A new candidate has applied to your opportunity.`,
      `/recruiter/opportunities/${opportunity._id}/applications`
    );

    res.status(201).json({ success: true, message: 'Application submitted successfully', data: application });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getApplications = async (req: Request, res: Response): Promise<void> => {
  try {
    const applications = await Application.find({ candidateId: req.user!.id })
      .populate({
        path: 'opportunityId',
        select: 'title location workMode stipend type slug',
        populate: { path: 'organizationId', select: 'name logo' }
      })
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: applications });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getApplicationById = async (req: Request, res: Response): Promise<void> => {
  try {
    const application = await Application.findOne({ 
      _id: req.params.id, 
      candidateId: req.user!.id 
    })
    .populate({
      path: 'opportunityId',
      select: 'title location workMode stipend type slug description requirements',
      populate: { path: 'organizationId', select: 'name logo description websiteUrl' }
    })
    .populate('resumeId', 'fileName fileUrl');

    if (!application) {
      res.status(404).json({ success: false, message: 'Application not found' });
      return;
    }

    res.status(200).json({ success: true, data: application });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getRecommendations = async (req: Request, res: Response): Promise<void> => {
  try {
    const profile = await Profile.findOne({ userId: req.user!.id });
    const appliedApps = await Application.find({ candidateId: req.user!.id }).select('opportunityId');
    const appliedIds = appliedApps.map(app => app.opportunityId);

    const matchQuery: any = {
      status: 'PUBLISHED',
      _id: { $nin: appliedIds }
    };

    let opportunities: any[] = await Opportunity.find(matchQuery)
      .populate('organizationId', 'name logo')
      .populate('categoryId', 'name')
      .lean(); // Use lean to add custom score property

    // Scoring logic
    if (profile) {
      const userSkills = profile.skills?.map(s => s.toString()) || [];
      const prefTypes = profile.preferences?.types || [];
      const prefLocations = profile.preferences?.locations?.map(l => l.toLowerCase()) || [];
      const prefWorkModes = profile.preferences?.workModes || [];

      opportunities = opportunities.map(opp => {
        let score = 0;
        
        // 1. Skill Match (highest weight)
        if (userSkills.length > 0 && opp.skills) {
          const oppSkills = opp.skills.map((s: any) => s.toString());
          const common = oppSkills.filter((s: any) => userSkills.includes(s));
          score += common.length * 10;
        }

        // 2. Type Match
        if (prefTypes.length > 0 && prefTypes.includes(opp.type)) {
          score += 15;
        }

        // 3. Work Mode Match
        if (prefWorkModes.length > 0 && opp.workMode && prefWorkModes.includes(opp.workMode)) {
          score += 15;
        }

        // 4. Location Match
        if (prefLocations.length > 0 && opp.location && prefLocations.some(l => opp.location!.toLowerCase().includes(l))) {
          score += 10;
        }

        return { ...opp, recommendationScore: score };
      });

      // Filter out zero score if we want strictly matches, or just sort
      // We will sort by score descending, then by publishedAt
      opportunities.sort((a: any, b: any) => {
        if (b.recommendationScore !== a.recommendationScore) {
          return b.recommendationScore - a.recommendationScore;
        }
        return (b.publishedAt?.getTime() || 0) - (a.publishedAt?.getTime() || 0);
      });
    } else {
      opportunities.sort((a: any, b: any) => (b.publishedAt?.getTime() || 0) - (a.publishedAt?.getTime() || 0));
    }

    const recommendations = opportunities.slice(0, 10);

    // If no recommendations found at all (empty db or all applied)
    if (recommendations.length === 0) {
      res.status(200).json({ success: true, data: [] });
      return;
    }

    res.status(200).json({ success: true, data: recommendations });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Notifications moved to notificationController.ts
