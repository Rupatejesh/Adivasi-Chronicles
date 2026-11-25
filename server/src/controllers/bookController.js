import BookEntry from '../../models/BookEntry.js';
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

export async function listBooks(req, res, next) {
  try {
    const filter = {};
    const showAll = isPrivilegedUser(req.user) && req.query.all === 'true';
    if (!showAll) filter.isPublished = true;

    if (req.query.category) filter.category = String(req.query.category).trim();
    if (req.query.q?.trim()) {
      const regex = new RegExp(escapeRegex(req.query.q.trim()), 'i');
      filter.$or = [{ title: regex }, { author: regex }, { overview: regex }, { themes: regex }];
    }

    const books = await BookEntry.find(filter).sort({ isFeatured: -1, createdAt: -1 }).lean();
    return res.json({ success: true, books });
  } catch (error) {
    return next(error);
  }
}

export async function getBookBySlug(req, res, next) {
  try {
    const book = await BookEntry.findOne({ slug: String(req.params.slug).toLowerCase() }).lean();
    if (!book) {
      return next(createHttpError(404, 'Book entry not found'));
    }
    if (!book.isPublished && !isPrivilegedUser(req.user)) {
      return next(createHttpError(404, 'Book entry not found'));
    }
    return res.json({ success: true, book });
  } catch (error) {
    return next(error);
  }
}

export async function createBook(req, res, next) {
  try {
    const body = req.body || {};
    if (!body.title?.trim() || !body.author?.trim() || !body.overview?.trim()) {
      return next(createHttpError(400, 'Title, author and overview are required'));
    }

    const slug = await ensureUniqueSlug(BookEntry, body.slug, body.title);
    const book = await BookEntry.create({
      title: String(body.title).trim(),
      slug,
      author: String(body.author).trim(),
      publicationContext: body.publicationContext ? String(body.publicationContext).trim() : '',
      overview: String(body.overview).trim(),
      historicalContext: body.historicalContext || '',
      themes: normalizeStringArray(body.themes),
      personalNotes: body.personalNotes || '',
      coverImage: body.coverImage ? String(body.coverImage).trim() : '',
      category: body.category ? String(body.category).trim() : 'Social Thought',
      sources: normalizeSources(body.sources),
      isFeatured: Boolean(body.isFeatured),
      isPublished: Boolean(body.isPublished),
      addedBy: req.user._id,
    });

    return res.status(201).json({ success: true, book });
  } catch (error) {
    return next(error);
  }
}

export async function updateBook(req, res, next) {
  try {
    const book = await BookEntry.findById(req.params.id);
    if (!book) {
      return next(createHttpError(404, 'Book entry not found'));
    }

    const body = req.body || {};
    if (body.title !== undefined) book.title = String(body.title).trim();
    if (body.slug !== undefined || body.title !== undefined) {
      book.slug = await ensureUniqueSlug(BookEntry, body.slug || book.slug, book.title, book._id);
    }
    if (body.author !== undefined) book.author = String(body.author).trim();
    if (body.publicationContext !== undefined) book.publicationContext = String(body.publicationContext).trim();
    if (body.overview !== undefined) book.overview = String(body.overview).trim();
    if (body.historicalContext !== undefined) book.historicalContext = String(body.historicalContext);
    if (body.themes !== undefined) book.themes = normalizeStringArray(body.themes);
    if (body.personalNotes !== undefined) book.personalNotes = String(body.personalNotes);
    if (body.coverImage !== undefined) book.coverImage = String(body.coverImage).trim();
    if (body.category !== undefined) book.category = String(body.category).trim();
    if (body.sources !== undefined) book.sources = normalizeSources(body.sources);
    if (body.isFeatured !== undefined) book.isFeatured = Boolean(body.isFeatured);
    if (body.isPublished !== undefined) book.isPublished = Boolean(body.isPublished);

    await book.save();
    return res.json({ success: true, book });
  } catch (error) {
    return next(error);
  }
}

export async function deleteBook(req, res, next) {
  try {
    const book = await BookEntry.findByIdAndDelete(req.params.id);
    if (!book) {
      return next(createHttpError(404, 'Book entry not found'));
    }
    return res.json({ success: true, message: 'Book entry deleted' });
  } catch (error) {
    return next(error);
  }
}
