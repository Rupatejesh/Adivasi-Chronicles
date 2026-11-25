import { Router } from 'express';
import { createSong, deleteSong, listSongs, updateSong } from '../controllers/songController.js';
import { authorize, optionalAuth, protect } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/', optionalAuth, listSongs);
router.post('/', protect, authorize('admin', 'author'), createSong);
router.put('/:id', protect, authorize('admin', 'author'), updateSong);
router.delete('/:id', protect, authorize('admin'), deleteSong);

export default router;
