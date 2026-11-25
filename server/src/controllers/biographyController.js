import Biography from '../../models/Biography.js';
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

function normalizeQuotations(quotations) {
  if (!Array.isArray(quotations)) return [];
  return quotations
    .filter((q) => q && q.text?.trim())
    .map((q) => ({
      text: q.text.trim(),
      sourceTitle: q.sourceTitle?.trim(),
      sourceUrl: q.sourceUrl?.trim(),
      // Only verify when matching source citation exists and reviewer explicitly confirms.
      verified: Boolean(q.verified && q.sourceTitle?.trim()),
      verificationNote: q.verificationNote?.trim(),
    }));
}

export async function listBiographies(req, res, next) {
  try {
    const filter = {};
    const showAll = isPrivilegedUser(req.user) && req.query.all === 'true';
    if (!showAll) filter.isPublished = true;

    if (req.query.category) filter.categories = req.query.category;
    if (req.query.featured === 'true') filter.isFeatured = true;
    if (req.query.q?.trim()) {
      const regex = new RegExp(escapeRegex(req.query.q.trim()), 'i');
      filter.$or = [{ name: regex }, { summary: regex }, { region: regex }, { community: regex }];
    }

    const biographies = await Biography.find(filter)
      .sort({ isFeatured: -1, createdAt: -1 })
      .lean();
    return res.json({ success: true, biographies });
  } catch (error) {
    return next(error);
  }
}

export async function getBiographyBySlug(req, res, next) {
  try {
    const biography = await Biography.findOne({ slug: String(req.params.slug).toLowerCase() })
      .populate('author', 'name role')
      .lean();
    if (!biography) {
      return next(createHttpError(404, 'Biography not found'));
    }
    if (!biography.isPublished && !isPrivilegedUser(req.user)) {
      return next(createHttpError(404, 'Biography not found'));
    }
    return res.json({ success: true, biography });
  } catch (error) {
    return next(error);
  }
}

export async function createBiography(req, res, next) {
  try {
    const body = req.body || {};
    if (!body.name?.trim() || !body.summary?.trim()) {
      return next(createHttpError(400, 'Name and summary are required'));
    }

    const slug = await ensureUniqueSlug(Biography, body.slug, body.name);
    const biography = await Biography.create({
      name: String(body.name).trim(),
      slug,
      alternateNames: normalizeStringArray(body.alternateNames),
      summary: String(body.summary).trim(),
      biography: body.biography || '',
      portrait: body.portrait ? String(body.portrait).trim() : '',
      birthDate: body.birthDate || null,
      deathDate: body.deathDate || null,
      region: body.region ? String(body.region).trim() : '',
      community: body.community ? String(body.community).trim() : '',
      categories: normalizeStringArray(body.categories),
      keyContributions: normalizeStringArray(body.keyContributions),
      sources: normalizeSources(body.sources),
      quotations: normalizeQuotations(body.quotations),
      verificationStatus: body.verificationStatus || 'pending',
      lastVerifiedAt: body.lastVerifiedAt || null,
      isFeatured: Boolean(body.isFeatured),
      isPublished: Boolean(body.isPublished),
      author: req.user._id,
    });

    return res.status(201).json({ success: true, biography });
  } catch (error) {
    return next(error);
  }
}

export async function updateBiography(req, res, next) {
  try {
    const biography = await Biography.findById(req.params.id);
    if (!biography) {
      return next(createHttpError(404, 'Biography not found'));
    }

    const body = req.body || {};
    if (body.name !== undefined) biography.name = String(body.name).trim();
    if (body.slug !== undefined || body.name !== undefined) {
      biography.slug = await ensureUniqueSlug(Biography, body.slug || biography.slug, biography.name, biography._id);
    }
    if (body.alternateNames !== undefined) biography.alternateNames = normalizeStringArray(body.alternateNames);
    if (body.summary !== undefined) biography.summary = String(body.summary).trim();
    if (body.biography !== undefined) biography.biography = String(body.biography);
    if (body.portrait !== undefined) biography.portrait = String(body.portrait).trim();
    if (body.birthDate !== undefined) biography.birthDate = body.birthDate || null;
    if (body.deathDate !== undefined) biography.deathDate = body.deathDate || null;
    if (body.region !== undefined) biography.region = String(body.region).trim();
    if (body.community !== undefined) biography.community = String(body.community).trim();
    if (body.categories !== undefined) biography.categories = normalizeStringArray(body.categories);
    if (body.keyContributions !== undefined) biography.keyContributions = normalizeStringArray(body.keyContributions);
    if (body.sources !== undefined) biography.sources = normalizeSources(body.sources);
    if (body.quotations !== undefined) biography.quotations = normalizeQuotations(body.quotations);
    if (body.verificationStatus !== undefined) biography.verificationStatus = body.verificationStatus;
    if (body.lastVerifiedAt !== undefined) biography.lastVerifiedAt = body.lastVerifiedAt || null;
    if (body.isFeatured !== undefined) biography.isFeatured = Boolean(body.isFeatured);
    if (body.isPublished !== undefined) biography.isPublished = Boolean(body.isPublished);

    await biography.save();
    return res.json({ success: true, biography });
  } catch (error) {
    return next(error);
  }
}

export async function deleteBiography(req, res, next) {
  try {
    const biography = await Biography.findByIdAndDelete(req.params.id);
    if (!biography) {
      return next(createHttpError(404, 'Biography not found'));
    }
    return res.json({ success: true, message: 'Biography deleted' });
  } catch (error) {
    return next(error);
  }
}
