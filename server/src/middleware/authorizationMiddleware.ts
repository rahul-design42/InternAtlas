import { Request, Response, NextFunction } from 'express';
import { OrganizationMember } from '../models';

export const requireOrganizationMember = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
    }

    const organizationId = req.params.organizationId || req.body.organizationId || req.query.organizationId;
    if (!organizationId) {
      res.status(400).json({ success: false, message: 'Organization ID is missing in the request' });
      return;
    }

    const membership = await OrganizationMember.findOne({
      organizationId,
      userId: req.user.id,
      status: 'ACTIVE'
    });

    if (!membership) {
      res.status(403).json({ success: false, message: 'Access denied. Not an active member of this organization.' });
      return;
    }

    // Attach membership info to request for subsequent handlers if needed
    (req as any).organizationRole = membership.role;
    next();
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error during authorization verification' });
  }
};

export const requireOrganizationRole = (allowedRoles: string | string[]) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, message: 'Authentication required' });
        return;
      }

      const organizationId = req.params.organizationId || req.body.organizationId || req.query.organizationId;
      if (!organizationId) {
        res.status(400).json({ success: false, message: 'Organization ID is missing in the request' });
        return;
      }

      const membership = await OrganizationMember.findOne({
        organizationId,
        userId: req.user.id,
        status: 'ACTIVE'
      });

      if (!membership) {
        res.status(403).json({ success: false, message: 'Access denied. Not an active member of this organization.' });
        return;
      }

      const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
      if (!roles.includes(membership.role)) {
        res.status(403).json({ success: false, message: 'Access denied. Insufficient organization permissions.' });
        return;
      }

      (req as any).organizationRole = membership.role;
      next();
    } catch (error) {
      res.status(500).json({ success: false, message: 'Server error during authorization verification' });
    }
  };
};
