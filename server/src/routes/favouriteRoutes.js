import { Router } from 'express';
import { listFavourites, toggleFavourite } from '../controllers/favouriteController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/', protect, listFavourites);
router.post('/toggle', protect, toggleFavourite);

export default router;
