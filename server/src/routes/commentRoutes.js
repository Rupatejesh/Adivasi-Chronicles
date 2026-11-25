import { Router } from 'express';
import {
  adminListComments,
  createComment,
  deleteComment,
  getCommentsByPost,
  moderateComment,
  updateComment,
} from '../controllers/commentController.js';
import { authorize, protect } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/admin/all', protect, authorize('admin'), adminListComments);
router.patch('/:id/moderate', protect, authorize('admin'), moderateComment);
router.get('/post/:postId', getCommentsByPost);
router.post('/', protect, createComment);
router.put('/:id', protect, updateComment);
router.delete('/:id', protect, deleteComment);

export default router;
