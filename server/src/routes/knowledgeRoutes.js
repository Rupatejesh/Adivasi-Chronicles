import { Router } from 'express';
import {
  createKnowledgeArticle,
  deleteKnowledgeArticle,
  getKnowledgeArticleBySlug,
  listKnowledgeArticles,
  updateKnowledgeArticle,
} from '../controllers/knowledgeController.js';
import { authorize, optionalAuth, protect } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/', optionalAuth, listKnowledgeArticles);
router.get('/slug/:slug', optionalAuth, getKnowledgeArticleBySlug);
router.post('/', protect, authorize('admin', 'author'), createKnowledgeArticle);
router.put('/:id', protect, authorize('admin', 'author'), updateKnowledgeArticle);
router.delete('/:id', protect, authorize('admin'), deleteKnowledgeArticle);

export default router;
