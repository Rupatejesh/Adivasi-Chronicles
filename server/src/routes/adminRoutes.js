import { Router } from 'express';
import { getAdminStats, listUsers, updateUserAccess } from '../controllers/adminController.js';
import { authorize, protect } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/stats', protect, authorize('admin', 'author'), getAdminStats);
router.get('/users', protect, authorize('admin'), listUsers);
router.patch('/users/:id', protect, authorize('admin'), updateUserAccess);

export default router;
