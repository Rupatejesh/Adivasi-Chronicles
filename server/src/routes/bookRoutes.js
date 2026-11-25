import { Router } from 'express';
import {
  createBook,
  deleteBook,
  getBookBySlug,
  listBooks,
  updateBook,
} from '../controllers/bookController.js';
import { authorize, optionalAuth, protect } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/', optionalAuth, listBooks);
router.get('/slug/:slug', optionalAuth, getBookBySlug);
router.post('/', protect, authorize('admin', 'author'), createBook);
router.put('/:id', protect, authorize('admin', 'author'), updateBook);
router.delete('/:id', protect, authorize('admin'), deleteBook);

export default router;
