import Comment from '../../models/Comment.js';
import Post from '../../models/Post.js';
import { createHttpError } from '../utils/helpers.js';

export async function createComment(req, res, next) {
  try {
    const { post, content, parentComment } = req.body || {};
    if (!post || !content?.trim()) {
      return next(createHttpError(400, 'Post ID and comment content are required'));
    }

    const postDoc = await Post.findById(post).select('_id status').lean();
    if (!postDoc || postDoc.status !== 'published') {
      return next(createHttpError(404, 'Published article not found'));
    }

    let parentId = null;
    if (parentComment) {
      const parentDoc = await Comment.findById(parentComment).select('_id post isActive').lean();
      if (!parentDoc || !parentDoc.isActive || parentDoc.post.toString() !== postDoc._id.toString()) {
        return next(createHttpError(400, 'Parent comment does not belong to this article'));
      }
      parentId = parentDoc._id;
    }

    const comment = await Comment.create({
      post: postDoc._id,
      author: req.user._id,
      content: String(content).trim(),
      parentComment: parentId,
    });

    const populated = await Comment.findById(comment._id)
      .populate('author', 'name avatar role')
      .lean();

    return res.status(201).json({ success: true, comment: populated });
  } catch (error) {
    return next(error);
  }
}

export async function getCommentsByPost(req, res, next) {
  try {
    const comments = await Comment.find({ post: req.params.postId, isActive: true })
      .populate('author', 'name avatar role')
      .sort({ createdAt: 1 })
      .lean();

    return res.json({ success: true, comments });
  } catch (error) {
    return next(error);
  }
}

export async function updateComment(req, res, next) {
  try {
    const { content } = req.body || {};
    if (!content?.trim()) {
      return next(createHttpError(400, 'Comment content cannot be empty'));
    }

    const comment = await Comment.findById(req.params.id);
    if (!comment || !comment.isActive) {
      return next(createHttpError(404, 'Comment not found'));
    }

    const isOwner = comment.author.toString() === req.user._id.toString();
    if (!isOwner && req.user.role !== 'admin') {
      return next(createHttpError(403, 'You can only edit your own comments'));
    }

    comment.content = String(content).trim();
    comment.isEdited = true;
    await comment.save();

    const populated = await Comment.findById(comment._id)
      .populate('author', 'name avatar role')
      .lean();

    return res.json({ success: true, comment: populated });
  } catch (error) {
    return next(error);
  }
}

export async function deleteComment(req, res, next) {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return next(createHttpError(404, 'Comment not found'));
    }

    const isOwner = comment.author.toString() === req.user._id.toString();
    if (!isOwner && req.user.role !== 'admin') {
      return next(createHttpError(403, 'You can only delete your own comments'));
    }

    await Comment.deleteMany({ parentComment: comment._id });
    await comment.deleteOne();

    return res.json({ success: true, message: 'Comment deleted' });
  } catch (error) {
    return next(error);
  }
}

export async function adminListComments(req, res, next) {
  try {
    const comments = await Comment.find()
      .populate('author', 'name email role')
      .populate('post', 'title slug')
      .sort({ createdAt: -1 })
      .limit(100)
      .lean();

    return res.json({ success: true, comments });
  } catch (error) {
    return next(error);
  }
}

export async function moderateComment(req, res, next) {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return next(createHttpError(404, 'Comment not found'));
    }

    comment.isActive = req.body?.isActive !== undefined ? Boolean(req.body.isActive) : !comment.isActive;
    await comment.save();

    return res.json({ success: true, comment });
  } catch (error) {
    return next(error);
  }
}
