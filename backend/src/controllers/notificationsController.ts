import { Response } from 'express';
import prisma from '../config/database';
import { AppError, asyncHandler } from '../middleware/errorHandler';
import { AuthRequest } from '../types';

export const getNotifications = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user?.userId;

  if (!userId) {
    throw new AppError('Unauthorized', 401);
  }

  const notifications = await prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: 50,
  });

  const unreadCount = await prisma.notification.count({
    where: { userId, read: false },
  });

  res.json({
    success: true,
    data: {
      notifications,
      unreadCount,
    },
  });
});

export const markAsRead = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user?.userId;
  const { notificationIds } = req.body;

  if (!userId) {
    throw new AppError('Unauthorized', 401);
  }

  // If no specific IDs provided, mark all as read
  if (!notificationIds || notificationIds.length === 0) {
    await prisma.notification.updateMany({
      where: { userId, read: false },
      data: { read: true },
    });

    return res.json({
      success: true,
      message: 'All notifications marked as read',
    });
  }

  // Mark specific notifications as read
  await prisma.notification.updateMany({
    where: {
      id: { in: notificationIds },
      userId, // Ensure user owns these notifications
    },
    data: { read: true },
  });

  res.json({
    success: true,
    message: 'Notifications marked as read',
  });
});

/**
 * Helper function to create notifications (called by other services)
 */
export const createNotification = async (
  userId: string,
  type: string,
  title: string,
  message: string,
  data?: any
) => {
  return await prisma.notification.create({
    data: {
      userId,
      type,
      title,
      message,
      data,
    },
  });
};
