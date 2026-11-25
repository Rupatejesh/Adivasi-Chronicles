import { Router } from 'express';
import {
  createBiography,
  deleteBiography,
  getBiographyBySlug,
  listBiographies,
  updateBiography,
} from '../controllers/biographyController.js';
import { authorize, optionalAuth, protect } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/', optionalAuth, listBiographies);
router.get('/slug/:slug', optionalAuth, getBiographyBySlug);
router.post('/', protect, authorize('admin', 'author'), createBiography);
router.put('/:id', protect, authorize('admin', 'author'), updateBiography);
router.delete('/:id', protect, authorize('admin'), deleteBiography);

export default router;
