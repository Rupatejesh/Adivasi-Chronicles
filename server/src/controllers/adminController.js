import User from '../../models/User.js';
import Post from '../../models/Post.js';
import Comment from '../../models/Comment.js';
import Category from '../../models/Category.js';
import Biography from '../../models/Biography.js';
import BookEntry from '../../models/BookEntry.js';
import KnowledgeArticle from '../../models/KnowledgeArticle.js';
import Scheme from '../../models/Scheme.js';
import Song from '../../models/Song.js';
import GalleryItem from '../../models/GalleryItem.js';
import JourneyEntry from '../../models/JourneyEntry.js';
import ContactMessage from '../../models/ContactMessage.js';
import { createHttpError } from '../utils/helpers.js';

export async function getAdminStats(req, res, next) {
  try {
    const [
      users,
      publishedPosts,
      draftPosts,
      comments,
      categories,
      biographies,
      books,
      knowledgeArticles,
      schemes,
      songs,
      galleryItems,
      journeyEntries,
      unreadMessages,
    ] = await Promise.all([
      User.countDocuments(),
      Post.countDocuments({ status: 'published' }),
      Post.countDocuments({ status: 'draft' }),
      Comment.countDocuments(),
      Category.countDocuments(),
      Biography.countDocuments(),
      BookEntry.countDocuments(),
      KnowledgeArticle.countDocuments(),
      Scheme.countDocuments(),
      Song.countDocuments(),
      GalleryItem.countDocuments(),
      JourneyEntry.countDocuments(),
      ContactMessage.countDocuments({ status: 'new' }),
    ]);

    return res.json({
      success: true,
      stats: {
        users,
        publishedPosts,
        draftPosts,
        comments,
        categories,
        biographies,
        books,
        knowledgeArticles,
        schemes,
        songs,
        galleryItems,
        journeyEntries,
        unreadMessages,
      },
    });
  } catch (error) {
    return next(error);
  }
}

export async function listUsers(req, res, next) {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 }).lean();
    return res.json({ success: true, users });
  } catch (error) {
    return next(error);
  }
}

export async function updateUserAccess(req, res, next) {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return next(createHttpError(404, 'User not found'));
    }

    const { role, isActive } = req.body || {};
    if (role !== undefined) {
      if (!['user', 'author', 'admin'].includes(role)) {
        return next(createHttpError(400, 'Invalid user role'));
      }
      if (user._id.toString() === req.user._id.toString() && role !== 'admin') {
        return next(createHttpError(400, 'You cannot remove your own admin role'));
      }
      user.role = role;
    }

    if (isActive !== undefined) {
      if (user._id.toString() === req.user._id.toString() && !isActive) {
        return next(createHttpError(400, 'You cannot deactivate your own account'));
      }
      user.isActive = Boolean(isActive);
    }

    await user.save();
    return res.json({ success: true, user });
  } catch (error) {
    return next(error);
  }
}
