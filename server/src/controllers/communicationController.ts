import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { Application, Conversation, Message, Interview } from '../models';
import { notifyUser } from '../utils/notificationService';

// ==========================================
// CANDIDATE ENDPOINTS
// ==========================================

export const getCandidateConversation = async (req: Request, res: Response): Promise<void> => {
  try {
    const applicationId = req.params.applicationId;
    const application = await Application.findOne({ _id: applicationId, candidateId: req.user!.id });
    
    if (!application) {
      res.status(404).json({ success: false, message: 'Application not found' });
      return;
    }

    const conversation = await Conversation.findOne({ applicationId });
    // It's okay if conversation is null, it means no messages yet
    res.status(200).json({ success: true, data: conversation });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getCandidateMessages = async (req: Request, res: Response): Promise<void> => {
  try {
    const conversationId = req.params.conversationId;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 50;

    const conversation = await Conversation.findOne({ _id: conversationId, candidateId: req.user!.id });
    if (!conversation) {
      res.status(404).json({ success: false, message: 'Conversation not found' });
      return;
    }

    const messages = await Message.find({ conversationId })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    // Mark as read if not sent by candidate
    const unreadMessages = messages.filter(m => !m.readAt && m.senderId.toString() !== req.user!.id);
    if (unreadMessages.length > 0) {
      await Message.updateMany(
        { _id: { $in: unreadMessages.map(m => m._id) } },
        { $set: { readAt: new Date() } }
      );
    }

    res.status(200).json({ success: true, data: messages.reverse(), page, limit });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const sendCandidateMessage = async (req: Request, res: Response): Promise<void> => {
  try {
    const applicationId = req.params.applicationId;
    let body = req.body.body;

    if (!body || typeof body !== 'string') {
      res.status(400).json({ success: false, message: 'Message body is required' });
      return;
    }
    body = body.trim();
    if (!body || body.length > 5000) {
      res.status(400).json({ success: false, message: 'Invalid message length' });
      return;
    }

    const application = await Application.findOne({ _id: applicationId, candidateId: req.user!.id });
    if (!application) {
      res.status(404).json({ success: false, message: 'Application not found' });
      return;
    }

    // Must be in a valid state (e.g. not REJECTED... but maybe let them talk if UNDER_REVIEW or beyond)
    if (application.status === 'REJECTED') {
      res.status(400).json({ success: false, message: 'Cannot message on a rejected application' });
      return;
    }

    let conversation = await Conversation.findOne({ applicationId });
    
    // Auto-create conversation if candidate messages first? Usually recruiter initiates, but let candidate initiate if they want
    if (!conversation) {
      conversation = await Conversation.create({
        applicationId: application._id,
        candidateId: application.candidateId,
        organizationId: application.organizationId,
        lastMessageAt: new Date()
      });
    }

    const message = await Message.create({
      conversationId: conversation._id,
      senderId: req.user!.id,
      body
    });

    conversation.lastMessageAt = new Date();
    await conversation.save();

    // Notify organization members (or specifically the recruiter if known, for now we will just assume recruiterId is set, or skip direct user notify if complex)
    // For now, if recruiterId is set on conversation, notify them.
    if (conversation.recruiterId) {
      await notifyUser(
        conversation.recruiterId.toString(),
        'NEW_MESSAGE',
        'New Message from Candidate',
        `A candidate sent a message regarding their application.`,
        `/recruiter/applications/${application._id}`
      );
    }

    res.status(201).json({ success: true, data: message });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getCandidateInterview = async (req: Request, res: Response): Promise<void> => {
  try {
    const applicationId = req.params.applicationId;
    const application = await Application.findOne({ _id: applicationId, candidateId: req.user!.id });
    
    if (!application) {
      res.status(404).json({ success: false, message: 'Application not found' });
      return;
    }

    const interview = await Interview.findOne({ applicationId }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: interview });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}

export const respondToInterview = async (req: Request, res: Response): Promise<void> => {
  try {
    const interviewId = req.params.interviewId;
    const { status } = req.body; // ACCEPTED or DECLINED

    if (!['ACCEPTED', 'DECLINED'].includes(status)) {
      res.status(400).json({ success: false, message: 'Status must be ACCEPTED or DECLINED' });
      return;
    }

    const interview = await Interview.findById(interviewId).populate('applicationId');
    if (!interview) {
      res.status(404).json({ success: false, message: 'Interview not found' });
      return;
    }

    const app = interview.applicationId as any;
    if (app.candidateId.toString() !== req.user!.id) {
      res.status(403).json({ success: false, message: 'Forbidden' });
      return;
    }

    if (interview.status !== 'PROPOSED') {
      res.status(409).json({ success: false, message: `Interview is already ${interview.status}` });
      return;
    }

    interview.status = status;
    await interview.save();

    if (status === 'ACCEPTED') {
      await Application.findByIdAndUpdate(app._id, { status: 'INTERVIEW' });
    }

    await notifyUser(
      interview.proposedBy.toString(),
      'APPLICATION_UPDATE',
      `Interview ${status}`,
      `The candidate has ${status.toLowerCase()} the proposed interview.`,
      `/recruiter/applications/${app._id}`
    );

    res.status(200).json({ success: true, data: interview });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================================
// RECRUITER ENDPOINTS
// ==========================================

export const getRecruiterConversation = async (req: Request, res: Response): Promise<void> => {
  try {
    const applicationId = req.params.applicationId;
    const application = await Application.findOne({ _id: applicationId, organizationId: req.user!.organizationId });
    
    if (!application) {
      res.status(404).json({ success: false, message: 'Application not found' });
      return;
    }

    const conversation = await Conversation.findOne({ applicationId });
    res.status(200).json({ success: true, data: conversation });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getRecruiterMessages = async (req: Request, res: Response): Promise<void> => {
  try {
    const conversationId = req.params.conversationId;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 50;

    const conversation = await Conversation.findOne({ _id: conversationId, organizationId: req.user!.organizationId });
    if (!conversation) {
      res.status(404).json({ success: false, message: 'Conversation not found' });
      return;
    }

    const messages = await Message.find({ conversationId })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    // Mark as read
    const unreadMessages = messages.filter(m => !m.readAt && m.senderId.toString() !== req.user!.id);
    if (unreadMessages.length > 0) {
      await Message.updateMany(
        { _id: { $in: unreadMessages.map(m => m._id) } },
        { $set: { readAt: new Date() } }
      );
    }

    res.status(200).json({ success: true, data: messages.reverse(), page, limit });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const sendRecruiterMessage = async (req: Request, res: Response): Promise<void> => {
  try {
    const applicationId = req.params.applicationId;
    let body = req.body.body;

    if (!body || typeof body !== 'string') {
      res.status(400).json({ success: false, message: 'Message body is required' });
      return;
    }
    body = body.trim();
    if (!body || body.length > 5000) {
      res.status(400).json({ success: false, message: 'Invalid message length' });
      return;
    }

    const application = await Application.findOne({ _id: applicationId, organizationId: req.user!.organizationId });
    if (!application) {
      res.status(404).json({ success: false, message: 'Application not found' });
      return;
    }

    let conversation = await Conversation.findOne({ applicationId });
    
    if (!conversation) {
      conversation = await Conversation.create({
        applicationId: application._id,
        candidateId: application.candidateId,
        organizationId: application.organizationId,
        recruiterId: req.user!.id,
        lastMessageAt: new Date()
      });
    } else if (!conversation.recruiterId) {
      // claim it if not claimed
      conversation.recruiterId = new mongoose.Types.ObjectId(req.user!.id);
    }

    const message = await Message.create({
      conversationId: conversation._id,
      senderId: req.user!.id,
      body
    });

    conversation.lastMessageAt = new Date();
    await conversation.save();

    await notifyUser(
      conversation.candidateId.toString(),
      'NEW_MESSAGE',
      'New Message from Recruiter',
      `A recruiter sent you a message regarding your application.`,
      `/student/applications/${application._id}` // Link to candidate dashboard
    );

    res.status(201).json({ success: true, data: message });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getRecruiterInterview = async (req: Request, res: Response): Promise<void> => {
  try {
    const applicationId = req.params.applicationId;
    const application = await Application.findOne({ _id: applicationId, organizationId: req.user!.organizationId });
    
    if (!application) {
      res.status(404).json({ success: false, message: 'Application not found' });
      return;
    }

    const interview = await Interview.findOne({ applicationId }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: interview });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}

export const proposeInterview = async (req: Request, res: Response): Promise<void> => {
  try {
    const applicationId = req.params.applicationId;
    const { startAt, endAt, timezone, note } = req.body;

    if (!startAt || !endAt || !timezone) {
      res.status(400).json({ success: false, message: 'startAt, endAt, and timezone are required' });
      return;
    }

    const start = new Date(startAt);
    const end = new Date(endAt);

    if (isNaN(start.getTime()) || isNaN(end.getTime()) || start >= end) {
      res.status(400).json({ success: false, message: 'Invalid start or end time' });
      return;
    }

    const application = await Application.findOne({ _id: applicationId, organizationId: req.user!.organizationId });
    if (!application) {
      res.status(404).json({ success: false, message: 'Application not found' });
      return;
    }

    let conversation = await Conversation.findOne({ applicationId });

    // Cancel any existing proposed interview for this app
    await Interview.updateMany(
      { applicationId: application._id, status: 'PROPOSED' },
      { $set: { status: 'CANCELLED' } }
    );

    const interview = await Interview.create({
      applicationId: application._id,
      conversationId: conversation?._id,
      proposedBy: req.user!.id,
      startAt: start,
      endAt: end,
      timezone,
      note: note ? note.substring(0, 1000) : undefined,
      status: 'PROPOSED'
    });

    await notifyUser(
      application.candidateId.toString(),
      'SYSTEM_ALERT',
      'Interview Proposed',
      `A recruiter proposed an interview time for your application.`,
      `/student/applications/${application._id}`
    );

    res.status(201).json({ success: true, data: interview });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
