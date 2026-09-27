import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { 
  Organization, 
  OrganizationMember, 
  Opportunity, 
  Application,
  User,
  Profile
} from '../models';

export const getDashboard = async (req: Request, res: Response): Promise<void> => {
  try {
    const orgId = req.user!.organizationId;

    const activeOpportunities = await Opportunity.countDocuments({ organizationId: orgId, status: 'PUBLISHED' });
    const totalApplications = await Application.countDocuments({ organizationId: orgId });
    const newApplications = await Application.countDocuments({ organizationId: orgId, status: 'SUBMITTED' });

    res.status(200).json({
      success: true,
      data: {
        activeOpportunities,
        totalApplications,
        newApplications
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Organization Management (No requireOrganization middleware on this endpoint if creating)
export const createOrganization = async (req: Request, res: Response): Promise<void> => {
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    const existingMember = await OrganizationMember.findOne({ userId: req.user!.id, status: 'ACTIVE' });
    if (existingMember) {
      res.status(400).json({ success: false, message: 'You are already part of an organization.' });
      return;
    }

    const { name, description, website, industry, companySize, location } = req.body;
    
    if (!name) {
      res.status(400).json({ success: false, message: 'Organization name is required.' });
      return;
    }

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    
    // Create organization
    const org = await Organization.create([{
      name,
      slug: `${slug}-${Math.floor(Math.random() * 1000)}`,
      description,
      website,
      industry,
      companySize,
      location,
      verificationStatus: 'PENDING'
    }], { session });

    // Create owner membership
    await OrganizationMember.create([{
      organizationId: org[0]._id,
      userId: req.user!.id,
      role: 'OWNER',
      status: 'ACTIVE'
    }], { session });

    await session.commitTransaction();
    res.status(201).json({ success: true, data: org[0] });
  } catch (error: any) {
    await session.abortTransaction();
    res.status(500).json({ success: false, message: error.message });
  } finally {
    session.endSession();
  }
};

export const getOrganization = async (req: Request, res: Response): Promise<void> => {
  try {
    const org = await Organization.findById(req.user!.organizationId);
    if (!org) {
      res.status(404).json({ success: false, message: 'Organization not found' });
      return;
    }
    res.status(200).json({ success: true, data: org });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateOrganization = async (req: Request, res: Response): Promise<void> => {
  try {
    if (req.user!.orgRole !== 'OWNER' && req.user!.orgRole !== 'ADMIN') {
      res.status(403).json({ success: false, message: 'Insufficient permissions to update organization.' });
      return;
    }

    const { description, website, industry, companySize, location, socialLinks } = req.body;

    const org = await Organization.findByIdAndUpdate(
      req.user!.organizationId,
      {
        $set: {
          ...(description !== undefined && { description }),
          ...(website !== undefined && { website }),
          ...(industry !== undefined && { industry }),
          ...(companySize !== undefined && { companySize }),
          ...(location !== undefined && { location }),
          ...(socialLinks !== undefined && { socialLinks }),
        }
      },
      { new: true, runValidators: true }
    );

    res.status(200).json({ success: true, data: org });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Members
export const getMembers = async (req: Request, res: Response): Promise<void> => {
  try {
    const members = await OrganizationMember.find({ organizationId: req.user!.organizationId })
      .populate('userId', 'email status lastLoginAt')
      .sort({ createdAt: 1 });
      
    res.status(200).json({ success: true, data: members });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Opportunities
export const getOpportunities = async (req: Request, res: Response): Promise<void> => {
  try {
    const opps = await Opportunity.find({ organizationId: req.user!.organizationId })
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: opps });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getOpportunityById = async (req: Request, res: Response): Promise<void> => {
  try {
    const opp = await Opportunity.findOne({ 
      _id: req.params.id, 
      organizationId: req.user!.organizationId 
    });
    if (!opp) {
      res.status(404).json({ success: false, message: 'Opportunity not found' });
      return;
    }
    res.status(200).json({ success: true, data: opp });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createOpportunity = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, type, location, workMode, description, requirements, responsibilities, stipend, deadline, status, categoryId, skills, questions } = req.body;

    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') + '-' + Math.floor(Math.random() * 10000);

    const locationStr = typeof location === 'object' ? location.city : location;
    const workModeMapped = workMode === 'ONSITE' ? 'ON_SITE' : workMode;
    const stipendStr = typeof stipend === 'object' ? `${stipend.amount} ${stipend.currency} / ${stipend.type}` : stipend;

    const opp = await Opportunity.create({
      title,
      slug,
      organizationId: req.user!.organizationId,
      createdBy: req.user!.id,
      type,
      location: locationStr,
      workMode: workModeMapped,
      description,
      requirements,
      responsibilities: responsibilities || [],
      stipend: stipendStr,
      applicationDeadline: deadline,
      status: status || 'DRAFT',
      categoryId,
      skills
    });

    res.status(201).json({ success: true, data: opp });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateOpportunity = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, type, location, workMode, description, requirements, responsibilities, stipend, deadline, status, categoryId, skills, applicationMethod, applicationUrl } = req.body;
    
    // Build update object securely
    const updateData: any = {};
    if (title !== undefined) updateData.title = title;
    if (type !== undefined) updateData.type = type;
    if (location !== undefined) updateData.location = location;
    if (workMode !== undefined) updateData.workMode = workMode;
    if (description !== undefined) updateData.description = description;
    if (requirements !== undefined) updateData.requirements = requirements;
    if (responsibilities !== undefined) updateData.responsibilities = responsibilities;
    if (stipend !== undefined) updateData.stipend = stipend;
    if (deadline !== undefined) updateData.applicationDeadline = deadline;
    if (status !== undefined) updateData.status = status;
    if (categoryId !== undefined) updateData.categoryId = categoryId;
    if (skills !== undefined) updateData.skills = skills;
    if (applicationMethod !== undefined) updateData.applicationMethod = applicationMethod;
    if (applicationUrl !== undefined) updateData.applicationUrl = applicationUrl;

    const opp = await Opportunity.findOneAndUpdate(
      { _id: req.params.id, organizationId: req.user!.organizationId },
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!opp) {
      res.status(404).json({ success: false, message: 'Opportunity not found' });
      return;
    }
    res.status(200).json({ success: true, data: opp });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Applications
export const getOpportunityApplications = async (req: Request, res: Response): Promise<void> => {
  try {
    const applications = await Application.find({ 
      opportunityId: req.params.opportunityId,
      organizationId: req.user!.organizationId 
    })
    .populate('candidateId', 'email')
    .populate('resumeId', 'fileName fileUrl')
    .sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: applications });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

import { notifyUser } from '../utils/notificationService';

export const updateApplicationStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { status } = req.body;
    
    if (!['SUBMITTED', 'UNDER_REVIEW', 'SHORTLISTED', 'INTERVIEW', 'OFFER', 'ACCEPTED', 'REJECTED'].includes(status)) {
      res.status(400).json({ success: false, message: 'Invalid status' });
      return;
    }

    const application = await Application.findOneAndUpdate(
      { _id: req.params.id, organizationId: req.user!.organizationId },
      { $set: { status } },
      { new: true }
    ).populate('opportunityId', 'title');

    if (!application) {
      res.status(404).json({ success: false, message: 'Application not found' });
      return;
    }

    // Trigger Notification & Email
    const opp: any = application.opportunityId;
    await notifyUser(
      application.candidateId,
      'APPLICATION_UPDATE',
      `Application Update: ${opp?.title || 'Opportunity'}`,
      `Your application status has been updated to: ${status.replace('_', ' ')}.`,
      `/candidate/applications/${application._id}`
    );

    res.status(200).json({ success: true, data: application });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getCandidateProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const hasApplied = await Application.exists({
      candidateId: req.params.candidateId,
      organizationId: req.user!.organizationId
    });

    if (!hasApplied) {
      res.status(403).json({ success: false, message: 'You do not have access to this candidate profile' });
      return;
    }

    const profile = await Profile.findOne({ userId: req.params.candidateId }).populate('skills', 'name');
    res.status(200).json({ success: true, data: profile });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
