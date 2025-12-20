import { Router } from 'express';
import { voteAmendment } from '../controllers/amendmentsController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.post('/:id/vote', authenticate, voteAmendment);

export default router;
