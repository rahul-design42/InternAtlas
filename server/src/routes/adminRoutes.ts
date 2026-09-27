import { Router } from 'express';
import { requireAuth, requireAdmin } from '../middleware/authMiddleware';
import { 
  getDashboardStats,
  getUsers,
  updateUserStatus,
  getOrganizations,
  verifyOrganization,
  getOpportunities,
  moderateOpportunity
} from '../controllers/adminController';

const router = Router();

// Protect all routes with admin role
router.use(requireAuth);
router.use(requireAdmin);

router.get('/dashboard', getDashboardStats);

router.get('/users', getUsers);
router.put('/users/:id/status', updateUserStatus);

router.get('/organizations', getOrganizations);
router.put('/organizations/:id/verify', verifyOrganization);

router.get('/opportunities', getOpportunities);
router.put('/opportunities/:id/moderate', moderateOpportunity);

export default router;
