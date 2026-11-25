import { Router } from 'express';
import {
  createGalleryItem,
  deleteGalleryItem,
  listGalleryItems,
  updateGalleryItem,
} from '../controllers/galleryController.js';
import { authorize, optionalAuth, protect } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/', optionalAuth, listGalleryItems);
router.post('/', protect, authorize('admin', 'author'), createGalleryItem);
router.put('/:id', protect, authorize('admin', 'author'), updateGalleryItem);
router.delete('/:id', protect, authorize('admin'), deleteGalleryItem);

export default router;
