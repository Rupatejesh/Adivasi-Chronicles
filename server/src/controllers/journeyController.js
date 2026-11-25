import JourneyEntry from '../../models/JourneyEntry.js';
import { ensureUniqueSlug, isPrivilegedUser } from '../utils/crudHelpers.js';
import { createHttpError, escapeRegex, normalizeStringArray } from '../utils/helpers.js';

export async function listJourneyEntries(req, res, next) {
  try {
    const filter = {};
    const showAll = isPrivilegedUser(req.user) && req.query.all === 'true';
    if (!showAll) filter.isPublished = true;

    if (req.query.interest) filter.interest = String(req.query.interest).trim();
    if (req.query.q?.trim()) {
      const regex = new RegExp(escapeRegex(req.query.q.trim()), 'i');
      filter.$or = [{ title: regex }, { summary: regex }, { location: regex }];
    }

    const entries = await JourneyEntry.find(filter)
      .sort({ entryDate: -1, createdAt: -1 })
      .lean();
    return res.json({ success: true, entries });
  } catch (error) {
    return next(error);
  }
}

export async function createJourneyEntry(req, res, next) {
  try {
    const body = req.body || {};
    if (!body.title?.trim() || !body.summary?.trim()) {
      return next(createHttpError(400, 'Title and summary are required'));
    }

    const slug = await ensureUniqueSlug(JourneyEntry, body.slug, body.title);
    const entry = await JourneyEntry.create({
      title: String(body.title).trim(),
      slug,
      interest: body.interest || 'general',
      summary: String(body.summary).trim(),
      content: body.content || '',
      location: body.location ? String(body.location).trim() : '',
      entryDate: body.entryDate || null,
      coverImage: body.coverImage ? String(body.coverImage).trim() : '',
      tags: normalizeStringArray(body.tags),
      isPublished: Boolean(body.isPublished),
      author: req.user._id,
    });

    return res.status(201).json({ success: true, entry });
  } catch (error) {
    return next(error);
  }
}

export async function updateJourneyEntry(req, res, next) {
  try {
    const entry = await JourneyEntry.findById(req.params.id);
    if (!entry) {
      return next(createHttpError(404, 'Journey entry not found'));
    }

    const body = req.body || {};
    if (body.title !== undefined) entry.title = String(body.title).trim();
    if (body.slug !== undefined || body.title !== undefined) {
      entry.slug = await ensureUniqueSlug(JourneyEntry, body.slug || entry.slug, entry.title, entry._id);
    }
    if (body.interest !== undefined) entry.interest = body.interest;
    if (body.summary !== undefined) entry.summary = String(body.summary).trim();
    if (body.content !== undefined) entry.content = String(body.content);
    if (body.location !== undefined) entry.location = String(body.location).trim();
    if (body.entryDate !== undefined) entry.entryDate = body.entryDate || null;
    if (body.coverImage !== undefined) entry.coverImage = String(body.coverImage).trim();
    if (body.tags !== undefined) entry.tags = normalizeStringArray(body.tags);
    if (body.isPublished !== undefined) entry.isPublished = Boolean(body.isPublished);

    await entry.save();
    return res.json({ success: true, entry });
  } catch (error) {
    return next(error);
  }
}

export async function deleteJourneyEntry(req, res, next) {
  try {
    const entry = await JourneyEntry.findByIdAndDelete(req.params.id);
    if (!entry) {
      return next(createHttpError(404, 'Journey entry not found'));
    }
    return res.json({ success: true, message: 'Journey entry deleted' });
  } catch (error) {
    return next(error);
  }
}
