import { Router } from 'express';
import {
  deleteContactMessage,
  listContactMessages,
  submitContactMessage,
  updateContactMessageStatus,
} from '../controllers/contactController.js';
import { authorize, protect } from '../middleware/authMiddleware.js';

const router = Router();

router.post('/', submitContactMessage);
router.get('/', protect, authorize('admin'), listContactMessages);
router.patch('/:id', protect, authorize('admin'), updateContactMessageStatus);
router.delete('/:id', protect, authorize('admin'), deleteContactMessage);

export default router;
