import { Router } from 'express';
import {
  createScheme,
  deleteScheme,
  getSchemeBySlug,
  listSchemes,
  updateScheme,
} from '../controllers/schemeController.js';
import { authorize, optionalAuth, protect } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/', optionalAuth, listSchemes);
router.get('/slug/:slug', optionalAuth, getSchemeBySlug);
router.post('/', protect, authorize('admin', 'author'), createScheme);
router.put('/:id', protect, authorize('admin', 'author'), updateScheme);
router.delete('/:id', protect, authorize('admin'), deleteScheme);

export default router;
