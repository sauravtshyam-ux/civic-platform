import { Router } from 'express';
import { getNotifications, markAsRead } from '../controllers/notificationsController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.get('/', authenticate, getNotifications);
router.post('/mark-read', authenticate, markAsRead);

export default router;
