import Post from '../../models/Post.js';
import Category from '../../models/Category.js';
import Comment from '../../models/Comment.js';
import { ensureUniqueSlug, isPrivilegedUser, parsePagination } from '../utils/crudHelpers.js';
import { createHttpError, escapeRegex, normalizeStringArray } from '../utils/helpers.js';

function normalizeSources(sources) {
  if (!Array.isArray(sources)) return [];
  return sources
    .filter((item) => item && (item.title?.trim() || item.url?.trim() || item.publisher?.trim()))
    .map((item) => ({
      title: item.title ? String(item.title).trim() : undefined,
      url: item.url ? String(item.url).trim() : undefined,
      publisher: item.publisher ? String(item.publisher).trim() : undefined,
      accessedAt: item.accessedAt ? new Date(item.accessedAt) : undefined,
    }));
}

export async function createPost(req, res, next) {
  try {
    const {
      title,
      slug,
      excerpt,
      content,
      coverImage,
      category,
      tags,
      status,
      sources,
      isFeatured,
    } = req.body || {};

    if (!title?.trim() || !content?.trim() || !category) {
      return next(createHttpError(400, 'Title, content and category are required'));
    }

    const categoryDoc = await Category.findById(category).select('_id').lean();
    if (!categoryDoc) {
      return next(createHttpError(400, 'Selected category does not exist'));
    }

    const resolvedStatus = status === 'published' ? 'published' : 'draft';
    const resolvedSlug = await ensureUniqueSlug(Post, slug, title);

    const post = await Post.create({
      title: String(title).trim(),
      slug: resolvedSlug,
      excerpt: excerpt ? String(excerpt).trim() : '',
      content: String(content),
      coverImage: coverImage ? String(coverImage).trim() : '',
      author: req.user._id,
      category: categoryDoc._id,
      tags: normalizeStringArray(tags),
      status: resolvedStatus,
      sources: normalizeSources(sources),
      publishedAt: resolvedStatus === 'published' ? new Date() : null,
      isFeatured: Boolean(isFeatured),
    });

    const populated = await Post.findById(post._id)
      .populate('author', 'name avatar role bio')
      .populate('category', 'name slug type')
      .lean();

    return res.status(201).json({ success: true, post: populated });
  } catch (error) {
    return next(error);
  }
}

export async function listPosts(req, res, next) {
  try {
    const { page, limit, skip } = parsePagination(req.query);
    const filter = {};

    const canSeeDrafts = isPrivilegedUser(req.user) && req.query.all === 'true';
    if (!canSeeDrafts) {
      filter.status = 'published';
    } else if (req.query.status && ['draft', 'published'].includes(req.query.status)) {
      filter.status = req.query.status;
    }

    if (req.query.category) {
      filter.category = req.query.category;
    }
    if (req.query.tag) {
      filter.tags = { $in: [String(req.query.tag).trim()] };
    }
    if (req.query.featured === 'true') {
      filter.isFeatured = true;
    }
    if (req.query.q?.trim()) {
      const regex = new RegExp(escapeRegex(req.query.q.trim()), 'i');
      filter.$or = [{ title: regex }, { excerpt: regex }, { content: regex }, { tags: regex }];
    }

    const [posts, total] = await Promise.all([
      Post.find(filter)
        .populate('author', 'name avatar role bio')
        .populate('category', 'name slug type')
        .sort({ isFeatured: -1, publishedAt: -1, createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Post.countDocuments(filter),
    ]);

    return res.json({
      success: true,
      posts,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) || 1 },
    });
  } catch (error) {
    return next(error);
  }
}

export async function searchPosts(req, res, next) {
  try {
    const queryText = req.query.q?.trim();
    if (!queryText) {
      return res.json({ success: true, posts: [] });
    }

    const regex = new RegExp(escapeRegex(queryText), 'i');
    const posts = await Post.find({
      status: 'published',
      $or: [{ title: regex }, { excerpt: regex }, { content: regex }, { tags: regex }],
    })
      .populate('author', 'name avatar role')
      .populate('category', 'name slug type')
      .sort({ publishedAt: -1, createdAt: -1 })
      .limit(30)
      .lean();

    return res.json({ success: true, posts });
  } catch (error) {
    return next(error);
  }
}

export async function getPostBySlug(req, res, next) {
  try {
    const post = await Post.findOne({ slug: String(req.params.slug).toLowerCase() })
      .populate('author', 'name avatar role bio')
      .populate('category', 'name slug type')
      .lean();

    if (!post) {
      return next(createHttpError(404, 'Article not found'));
    }

    const isOwner = req.user && post.author?._id?.toString() === req.user._id.toString();
    if (post.status !== 'published' && !isOwner && req.user?.role !== 'admin') {
      return next(createHttpError(404, 'Article not found'));
    }

    return res.json({ success: true, post });
  } catch (error) {
    return next(error);
  }
}

export async function getPostById(req, res, next) {
  try {
    const post = await Post.findById(req.params.id)
      .populate('author', 'name avatar role bio')
      .populate('category', 'name slug type')
      .lean();

    if (!post) {
      return next(createHttpError(404, 'Article not found'));
    }

    const isOwner = req.user && post.author?._id?.toString() === req.user._id.toString();
    if (post.status !== 'published' && !isOwner && req.user?.role !== 'admin') {
      return next(createHttpError(404, 'Article not found'));
    }

    return res.json({ success: true, post });
  } catch (error) {
    return next(error);
  }
}

export async function getPostsByAuthor(req, res, next) {
  try {
    const filter = { author: req.params.userId };
    const isSelfOrAdmin = req.user && (req.user.role === 'admin' || req.user._id.toString() === req.params.userId);
    if (!isSelfOrAdmin) {
      filter.status = 'published';
    }

    const posts = await Post.find(filter)
      .populate('author', 'name avatar role')
      .populate('category', 'name slug type')
      .sort({ createdAt: -1 })
      .lean();

    return res.json({ success: true, posts });
  } catch (error) {
    return next(error);
  }
}

export async function updatePost(req, res, next) {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return next(createHttpError(404, 'Article not found'));
    }

    const isOwner = post.author.toString() === req.user._id.toString();
    if (!isOwner && req.user.role !== 'admin') {
      return next(createHttpError(403, 'You can only edit your own articles'));
    }

    const {
      title,
      slug,
      excerpt,
      content,
      coverImage,
      category,
      tags,
      status,
      sources,
      isFeatured,
    } = req.body || {};

    if (category !== undefined) {
      const categoryDoc = await Category.findById(category).select('_id').lean();
      if (!categoryDoc) {
        return next(createHttpError(400, 'Selected category does not exist'));
      }
      post.category = categoryDoc._id;
    }

    if (title !== undefined) post.title = String(title).trim();
    if (slug !== undefined || title !== undefined) {
      post.slug = await ensureUniqueSlug(Post, slug || post.slug, post.title, post._id);
    }
    if (excerpt !== undefined) post.excerpt = String(excerpt).trim();
    if (content !== undefined) post.content = String(content);
    if (coverImage !== undefined) post.coverImage = String(coverImage).trim();
    if (tags !== undefined) post.tags = normalizeStringArray(tags);
    if (sources !== undefined) post.sources = normalizeSources(sources);
    if (isFeatured !== undefined) post.isFeatured = Boolean(isFeatured);

    if (status !== undefined && ['draft', 'published'].includes(status)) {
      if (status === 'published' && post.status !== 'published' && !post.publishedAt) {
        post.publishedAt = new Date();
      }
      post.status = status;
    }

    await post.save();
    const populated = await Post.findById(post._id)
      .populate('author', 'name avatar role bio')
      .populate('category', 'name slug type')
      .lean();

    return res.json({ success: true, post: populated });
  } catch (error) {
    return next(error);
  }
}

export async function deletePost(req, res, next) {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return next(createHttpError(404, 'Article not found'));
    }

    const isOwner = post.author.toString() === req.user._id.toString();
    if (!isOwner && req.user.role !== 'admin') {
      return next(createHttpError(403, 'You can only delete your own articles'));
    }

    await Comment.deleteMany({ post: post._id });
    await post.deleteOne();

    return res.json({ success: true, message: 'Article deleted' });
  } catch (error) {
    return next(error);
  }
}

export async function toggleLikePost(req, res, next) {
  try {
    const post = await Post.findById(req.params.id);
    if (!post || post.status !== 'published') {
      return next(createHttpError(404, 'Article not found'));
    }

    const userId = req.user._id.toString();
    const existingIndex = post.likes.findIndex((id) => id.toString() === userId);
    let liked = false;

    if (existingIndex === -1) {
      post.likes.push(req.user._id);
      liked = true;
    } else {
      post.likes.splice(existingIndex, 1);
      liked = false;
    }

    await post.save();
    return res.json({
      success: true,
      liked,
      likesCount: post.likes.length,
      likes: post.likes,
    });
  } catch (error) {
    return next(error);
  }
}
