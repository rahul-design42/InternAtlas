import { Router } from 'express';
import { requireAuth, requireCandidate } from '../middleware/authMiddleware';
import { uploadResumeMiddleware } from '../middleware/uploadMiddleware';
import { 
  getDashboard, 
  getProfile, 
  updateProfile, 
  getSavedOpportunities, 
  toggleSaveOpportunity,
  uploadResume,
  getResumes,
  deleteResume,
  applyToOpportunity,
  getApplications,
  getApplicationById,
  getRecommendations
} from '../controllers/candidateController';
import {
  getCandidateConversation,
  getCandidateMessages,
  sendCandidateMessage,
  getCandidateInterview,
  respondToInterview
} from '../controllers/communicationController';

const router = Router();

// Protect all routes
router.use(requireAuth);
router.use(requireCandidate);

router.get('/dashboard', getDashboard);
router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.get('/saved', getSavedOpportunities);
router.post('/saved/toggle', toggleSaveOpportunity);

// Resumes
router.get('/resumes', getResumes);
router.post('/resumes', uploadResumeMiddleware.single('resume'), uploadResume);
router.delete('/resumes/:id', deleteResume);

// Applications
router.get('/applications', getApplications);
router.get('/applications/:id', getApplicationById);
router.post('/opportunities/:id/apply', applyToOpportunity);

// Recommendations
router.get('/recommendations', getRecommendations);

// Communication & Interviews
router.get('/applications/:applicationId/conversation', getCandidateConversation);
router.get('/conversations/:conversationId/messages', getCandidateMessages);
router.post('/applications/:applicationId/messages', sendCandidateMessage);
router.get('/applications/:applicationId/interview', getCandidateInterview);
router.put('/interviews/:interviewId/respond', respondToInterview);

export default router;
