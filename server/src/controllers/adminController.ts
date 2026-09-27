import { Request, Response } from 'express';
import { 
  User, 
  Organization, 
  Opportunity, 
  Report, 
  Category, 
  Skill,
  Application,
  AuditLog
} from '../models';

export const getDashboardStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const totalUsers = await User.countDocuments();
    const totalCandidates = await User.countDocuments({ role: 'CANDIDATE' });
    const totalRecruiters = await User.countDocuments({ role: 'RECRUITER' });
    const totalOrganizations = await Organization.countDocuments();
    const totalOpportunities = await Opportunity.countDocuments();
    const totalApplications = await Application.countDocuments();
    
    // Unverified orgs
    const pendingOrganizations = await Organization.countDocuments({ verificationStatus: 'PENDING' });

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalCandidates,
        totalRecruiters,
        totalOrganizations,
        totalOpportunities,
        totalApplications,
        pendingOrganizations
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Users
export const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const { role } = req.query;
    const query: any = role ? { role: role as string } : {};
    const users = await User.find(query).select('-passwordHash').sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: users });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateUserStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { status } = req.body;
    const user = await User.findByIdAndUpdate(req.params.id, { status }, { new: true }).select('-passwordHash');
    
    if (user) {
      await AuditLog.create({
        actorId: req.user!.id,
        action: 'UPDATE_USER_STATUS',
        resourceId: user._id,
        resourceModel: 'User',
        metadata: { newStatus: status }
      });
    }

    res.status(200).json({ success: true, data: user });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Organizations
export const getOrganizations = async (req: Request, res: Response): Promise<void> => {
  try {
    const orgs = await Organization.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: orgs });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const verifyOrganization = async (req: Request, res: Response): Promise<void> => {
  try {
    const { status } = req.body; // 'VERIFIED' | 'REJECTED' | 'SUSPENDED'
    const org = await Organization.findByIdAndUpdate(
      req.params.id, 
      { verificationStatus: status }, 
      { new: true }
    );

    if (org) {
      await AuditLog.create({
        actorId: req.user!.id,
        action: 'UPDATE_ORG_VERIFICATION',
        resourceId: org._id,
        resourceModel: 'Organization',
        metadata: { newStatus: status }
      });
    }

    res.status(200).json({ success: true, data: org });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Opportunities Moderation
export const getOpportunities = async (req: Request, res: Response): Promise<void> => {
  try {
    const opps = await Opportunity.find().populate('organizationId', 'name').sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: opps });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

import { notifyUser } from '../utils/notificationService';

export const moderateOpportunity = async (req: Request, res: Response): Promise<void> => {
  try {
    const { status, isVerified, isFeatured } = req.body;
    const opp = await Opportunity.findByIdAndUpdate(
      req.params.id, 
      { 
        ...(status && { status }),
        ...(isVerified !== undefined && { isVerified }),
        ...(isFeatured !== undefined && { isFeatured })
      }, 
      { new: true }
    );

    if (!opp) {
      res.status(404).json({ success: false, message: 'Opportunity not found' });
      return;
    }

    await AuditLog.create({
      actorId: req.user!.id,
      action: 'MODERATE_OPPORTUNITY',
      resourceId: opp._id,
      resourceModel: 'Opportunity',
      metadata: { status, isVerified, isFeatured }
    });

    if (status) {
      await notifyUser(
        opp.createdBy,
        'SYSTEM_ALERT',
        `Listing Update: ${opp.title}`,
        `Your opportunity listing status has been changed to: ${status} by an administrator.`,
        `/recruiter/opportunities`
      );
    }

    res.status(200).json({ success: true, data: opp });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
