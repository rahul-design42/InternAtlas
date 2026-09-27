import { Router } from 'express';
import { requireAuth, requireRecruiter, requireOrganization } from '../middleware/authMiddleware';
import { 
  getDashboard,
  createOrganization,
  getOrganization,
  updateOrganization,
  getMembers,
  getOpportunities,
  getOpportunityById,
  createOpportunity,
  updateOpportunity,
  getOpportunityApplications,
  updateApplicationStatus,
  getCandidateProfile
} from '../controllers/recruiterController';
import {
  getRecruiterConversation,
  getRecruiterMessages,
  sendRecruiterMessage,
  getRecruiterInterview,
  proposeInterview
} from '../controllers/communicationController';

const router = Router();

// Protect all routes with recruiter role
router.use(requireAuth);
router.use(requireRecruiter);

// Routes that do NOT require organization (for creation/onboarding)
router.post('/organization', createOrganization);

// Apply organization restriction for all routes below
router.use(requireOrganization);

router.get('/dashboard', getDashboard);
router.get('/organization', getOrganization);
router.put('/organization', updateOrganization);
router.get('/organization/members', getMembers);

router.get('/opportunities', getOpportunities);
router.get('/opportunities/:id', getOpportunityById);
router.post('/opportunities', createOpportunity);
router.put('/opportunities/:id', updateOpportunity);

router.get('/opportunities/:opportunityId/applications', getOpportunityApplications);
router.put('/applications/:id/status', updateApplicationStatus);
router.get('/candidates/:candidateId/profile', getCandidateProfile);

// Communication & Interviews
router.get('/applications/:applicationId/conversation', getRecruiterConversation);
router.get('/conversations/:conversationId/messages', getRecruiterMessages);
router.post('/applications/:applicationId/messages', sendRecruiterMessage);
router.get('/applications/:applicationId/interview', getRecruiterInterview);
router.post('/applications/:applicationId/interviews', proposeInterview);

export default router;
