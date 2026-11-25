import { Router } from 'express';
import {
  createCategory,
  deleteCategory,
  listCategories,
  updateCategory,
} from '../controllers/categoryController.js';
import { authorize, optionalAuth, protect } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/', optionalAuth, listCategories);
router.post('/', protect, authorize('admin', 'author'), createCategory);
router.put('/:id', protect, authorize('admin', 'author'), updateCategory);
router.delete('/:id', protect, authorize('admin'), deleteCategory);

export default router;
