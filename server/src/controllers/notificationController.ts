import { Request, Response } from 'express';
import { Notification } from '../models';

export const getNotifications = async (req: Request, res: Response): Promise<void> => {
  try {
    const notifications = await Notification.find({ userId: req.user!.id })
      .sort({ createdAt: -1 })
      .limit(50);
    
    const unreadCount = await Notification.countDocuments({ userId: req.user!.id, isRead: false });

    res.status(200).json({ success: true, data: notifications, meta: { unreadCount } });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const markAsRead = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    if (id === 'all') {
      await Notification.updateMany({ userId: req.user!.id, isRead: false }, { isRead: true });
    } else {
      await Notification.findOneAndUpdate({ _id: id, userId: req.user!.id }, { isRead: true });
    }
    
    res.status(200).json({ success: true });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
