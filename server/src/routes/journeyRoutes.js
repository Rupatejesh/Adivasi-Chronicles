import { Router } from 'express';
import {
  createJourneyEntry,
  deleteJourneyEntry,
  listJourneyEntries,
  updateJourneyEntry,
} from '../controllers/journeyController.js';
import { authorize, optionalAuth, protect } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/', optionalAuth, listJourneyEntries);
router.post('/', protect, authorize('admin', 'author'), createJourneyEntry);
router.put('/:id', protect, authorize('admin', 'author'), updateJourneyEntry);
router.delete('/:id', protect, authorize('admin'), deleteJourneyEntry);

export default router;
