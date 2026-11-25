import KnowledgeArticle from '../../models/KnowledgeArticle.js';
import { ensureUniqueSlug, isPrivilegedUser } from '../utils/crudHelpers.js';
import { createHttpError, escapeRegex, normalizeStringArray } from '../utils/helpers.js';

function normalizeSources(sources) {
  if (!Array.isArray(sources)) return [];
  return sources
    .filter((s) => s && (s.title?.trim() || s.url?.trim() || s.publisher?.trim()))
    .map((s) => ({
      title: s.title?.trim(),
      publisher: s.publisher?.trim(),
      url: s.url?.trim(),
      accessedAt: s.accessedAt ? new Date(s.accessedAt) : undefined,
    }));
}

function normalizeTimeline(timeline) {
  if (!Array.isArray(timeline)) return [];
  return timeline
    .filter((item) => item && (item.year?.trim() || item.title?.trim() || item.detail?.trim()))
    .map((item) => ({
      year: item.year?.trim() || '',
      title: item.title?.trim() || '',
      detail: item.detail?.trim() || '',
    }));
}

export async function listKnowledgeArticles(req, res, next) {
  try {
    const filter = {};
    const showAll = isPrivilegedUser(req.user) && req.query.all === 'true';
    if (!showAll) filter.isPublished = true;

    if (req.query.section) filter.section = String(req.query.section).trim();
    if (req.query.category) filter.category = String(req.query.category).trim();
    if (req.query.q?.trim()) {
      const regex = new RegExp(escapeRegex(req.query.q.trim()), 'i');
      filter.$or = [
        { title: regex },
        { summary: regex },
        { content: regex },
        { provisionOrArticle: regex },
        { location: regex },
      ];
    }

    const articles = await KnowledgeArticle.find(filter)
      .sort({ isFeatured: -1, createdAt: -1 })
      .lean();
    return res.json({ success: true, articles });
  } catch (error) {
    return next(error);
  }
}

export async function getKnowledgeArticleBySlug(req, res, next) {
  try {
    const filter = { slug: String(req.params.slug).toLowerCase() };
    if (req.query.section) filter.section = String(req.query.section).trim();

    const article = await KnowledgeArticle.findOne(filter)
      .populate('author', 'name role')
      .lean();
    if (!article) {
      return next(createHttpError(404, 'Knowledge article not found'));
    }
    if (!article.isPublished && !isPrivilegedUser(req.user)) {
      return next(createHttpError(404, 'Knowledge article not found'));
    }
    return res.json({ success: true, article });
  } catch (error) {
    return next(error);
  }
}

export async function createKnowledgeArticle(req, res, next) {
  try {
    const body = req.body || {};
    if (!body.title?.trim() || !body.section || !body.summary?.trim()) {
      return next(createHttpError(400, 'Title, section and summary are required'));
    }

    const slug = await ensureUniqueSlug(KnowledgeArticle, body.slug, body.title);
    const article = await KnowledgeArticle.create({
      title: String(body.title).trim(),
      slug,
      section: body.section,
      category: body.category ? String(body.category).trim() : '',
      summary: String(body.summary).trim(),
      content: body.content || '',
      provisionOrArticle: body.provisionOrArticle ? String(body.provisionOrArticle).trim() : '',
      plainExplanation: body.plainExplanation || '',
      historicalContext: body.historicalContext || '',
      location: body.location ? String(body.location).trim() : '',
      movement: body.movement ? String(body.movement).trim() : '',
      timeline: normalizeTimeline(body.timeline),
      relatedPeople: normalizeStringArray(body.relatedPeople),
      tags: normalizeStringArray(body.tags),
      coverImage: body.coverImage ? String(body.coverImage).trim() : '',
      officialSource: body.officialSource ? String(body.officialSource).trim() : '',
      officialSourceUrl: body.officialSourceUrl ? String(body.officialSourceUrl).trim() : '',
      sources: normalizeSources(body.sources),
      verificationStatus: body.verificationStatus || 'pending',
      relevantYear: body.relevantYear ? String(body.relevantYear).trim() : '',
      lastVerifiedAt: body.lastVerifiedAt || null,
      isFeatured: Boolean(body.isFeatured),
      isPublished: Boolean(body.isPublished),
      author: req.user._id,
    });

    return res.status(201).json({ success: true, article });
  } catch (error) {
    return next(error);
  }
}

export async function updateKnowledgeArticle(req, res, next) {
  try {
    const article = await KnowledgeArticle.findById(req.params.id);
    if (!article) {
      return next(createHttpError(404, 'Knowledge article not found'));
    }

    const body = req.body || {};
    if (body.title !== undefined) article.title = String(body.title).trim();
    if (body.slug !== undefined || body.title !== undefined) {
      article.slug = await ensureUniqueSlug(KnowledgeArticle, body.slug || article.slug, article.title, article._id);
    }
    if (body.section !== undefined) article.section = body.section;
    if (body.category !== undefined) article.category = String(body.category).trim();
    if (body.summary !== undefined) article.summary = String(body.summary).trim();
    if (body.content !== undefined) article.content = String(body.content);
    if (body.provisionOrArticle !== undefined) article.provisionOrArticle = String(body.provisionOrArticle).trim();
    if (body.plainExplanation !== undefined) article.plainExplanation = String(body.plainExplanation);
    if (body.historicalContext !== undefined) article.historicalContext = String(body.historicalContext);
    if (body.location !== undefined) article.location = String(body.location).trim();
    if (body.movement !== undefined) article.movement = String(body.movement).trim();
    if (body.timeline !== undefined) article.timeline = normalizeTimeline(body.timeline);
    if (body.relatedPeople !== undefined) article.relatedPeople = normalizeStringArray(body.relatedPeople);
    if (body.tags !== undefined) article.tags = normalizeStringArray(body.tags);
    if (body.coverImage !== undefined) article.coverImage = String(body.coverImage).trim();
    if (body.officialSource !== undefined) article.officialSource = String(body.officialSource).trim();
    if (body.officialSourceUrl !== undefined) article.officialSourceUrl = String(body.officialSourceUrl).trim();
    if (body.sources !== undefined) article.sources = normalizeSources(body.sources);
    if (body.verificationStatus !== undefined) article.verificationStatus = body.verificationStatus;
    if (body.relevantYear !== undefined) article.relevantYear = String(body.relevantYear).trim();
    if (body.lastVerifiedAt !== undefined) article.lastVerifiedAt = body.lastVerifiedAt || null;
    if (body.isFeatured !== undefined) article.isFeatured = Boolean(body.isFeatured);
    if (body.isPublished !== undefined) article.isPublished = Boolean(body.isPublished);

    await article.save();
    return res.json({ success: true, article });
  } catch (error) {
    return next(error);
  }
}

export async function deleteKnowledgeArticle(req, res, next) {
  try {
    const article = await KnowledgeArticle.findByIdAndDelete(req.params.id);
    if (!article) {
      return next(createHttpError(404, 'Knowledge article not found'));
    }
    return res.json({ success: true, message: 'Knowledge article deleted' });
  } catch (error) {
    return next(error);
  }
}
