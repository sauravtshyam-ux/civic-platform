import { Router } from 'express';
import {
  getBillsFeed,
  getBillById,
  voteBill,
  saveBill,
  unsaveBill,
} from '../controllers/billsController';
import {
  createAmendment,
  getAmendments,
  voteAmendment,
} from '../controllers/amendmentsController';
import { authenticate } from '../middleware/auth';

const router = Router();

// Bill routes
router.get('/feed', getBillsFeed);
router.get('/:billId', getBillById);
router.post('/:billId/vote', authenticate, voteBill);
router.post('/:billId/save', authenticate, saveBill);
router.delete('/:billId/save', authenticate, unsaveBill);

// Amendment routes
router.post('/:billId/amendments', authenticate, createAmendment);
router.get('/:billId/amendments', getAmendments);

export default router;
