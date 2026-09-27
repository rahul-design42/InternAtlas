import { Router } from 'express';
import authRoutes from './authRoutes';
import publicRoutes from './publicRoutes';
import candidateRoutes from './candidateRoutes';
import recruiterRoutes from './recruiterRoutes';
import adminRoutes from './adminRoutes';
import notificationRoutes from './notificationRoutes';

import mongoose from 'mongoose';

const router = Router();

// Health endpoint — reports application and database availability
// Does NOT expose connection strings, secrets, or internal details
router.get('/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'healthy' : 'unhealthy';
  const status = dbStatus === 'healthy' ? 'UP' : 'DEGRADED';
  const httpStatus = dbStatus === 'healthy' ? 200 : 503;
  
  res.status(httpStatus).json({
    status,
    timestamp: new Date().toISOString(),
    services: {
      api: 'healthy',
      database: dbStatus,
    }
  });
});

router.use('/auth', authRoutes);
router.use('/public', publicRoutes);
router.use('/recruiter', recruiterRoutes);
router.use('/candidate', candidateRoutes);
router.use('/admin', adminRoutes);
router.use('/notifications', notificationRoutes);

export default router;
