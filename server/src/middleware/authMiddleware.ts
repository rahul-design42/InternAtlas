import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/jwt';

export const requireAuth = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ success: false, message: 'Authentication required. Token missing.' });
      return;
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyAccessToken(token);

    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: 'Invalid or expired token.' });
  }
};

export const requireRole = (roles: string | string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Authentication required.' });
      return;
    }

    const allowedRoles = Array.isArray(roles) ? roles : [roles];
    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({ success: false, message: 'Access denied. Insufficient permissions.' });
      return;
    }

    next();
  };
};

export const requireCandidate = requireRole('CANDIDATE');
export const requireRecruiter = requireRole('RECRUITER');
export const requireAdmin = requireRole('ADMIN');

import { OrganizationMember } from '../models';

export const requireOrganization = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user || req.user.role !== 'RECRUITER') {
      res.status(403).json({ success: false, message: 'Recruiter access required.' });
      return;
    }

    const membership = await OrganizationMember.findOne({ 
      userId: req.user.id,
      status: 'ACTIVE'
    });

    if (!membership) {
      res.status(403).json({ 
        success: false, 
        message: 'You are not part of an active organization.',
        code: 'NO_ORGANIZATION'
      });
      return;
    }

    req.user.organizationId = membership.organizationId.toString();
    req.user.orgRole = membership.role;
    next();
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error verifying organization status.' });
  }
};
