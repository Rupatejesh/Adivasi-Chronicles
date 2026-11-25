import { Router } from 'express';
import {
  createPost,
  deletePost,
  getPostById,
  getPostBySlug,
  getPostsByAuthor,
  listPosts,
  searchPosts,
  toggleLikePost,
  updatePost,
} from '../controllers/postController.js';
import { authorize, optionalAuth, protect } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/search', searchPosts);
router.get('/slug/:slug', optionalAuth, getPostBySlug);
router.get('/author/:userId', optionalAuth, getPostsByAuthor);
router.get('/', optionalAuth, listPosts);
router.post('/', protect, authorize('admin', 'author'), createPost);
router.post('/:id/like', protect, toggleLikePost);
router.get('/:id', optionalAuth, getPostById);
router.put('/:id', protect, authorize('admin', 'author'), updatePost);
router.delete('/:id', protect, authorize('admin', 'author'), deletePost);

export default router;
