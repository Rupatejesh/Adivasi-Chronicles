import Scheme from '../../models/Scheme.js';
import { ensureUniqueSlug, isPrivilegedUser } from '../utils/crudHelpers.js';
import { createHttpError, escapeRegex } from '../utils/helpers.js';

export async function listSchemes(req, res, next) {
  try {
    const filter = {};
    const showAll = isPrivilegedUser(req.user) && req.query.all === 'true';
    if (!showAll) filter.isPublished = true;

    if (req.query.category) filter.category = String(req.query.category).trim();
    if (req.query.q?.trim()) {
      const regex = new RegExp(escapeRegex(req.query.q.trim()), 'i');
      filter.$or = [{ name: regex }, { department: regex }, { purpose: regex }, { benefits: regex }];
    }

    const schemes = await Scheme.find(filter).sort({ isFeatured: -1, createdAt: -1 }).lean();
    return res.json({ success: true, schemes });
  } catch (error) {
    return next(error);
  }
}

export async function getSchemeBySlug(req, res, next) {
  try {
    const scheme = await Scheme.findOne({ slug: String(req.params.slug).toLowerCase() }).lean();
    if (!scheme) {
      return next(createHttpError(404, 'Scheme not found'));
    }
    if (!scheme.isPublished && !isPrivilegedUser(req.user)) {
      return next(createHttpError(404, 'Scheme not found'));
    }
    return res.json({ success: true, scheme });
  } catch (error) {
    return next(error);
  }
}

export async function createScheme(req, res, next) {
  try {
    const body = req.body || {};
    if (!body.name?.trim() || !body.department?.trim() || !body.purpose?.trim()) {
      return next(createHttpError(400, 'Scheme name, department and purpose are required'));
    }

    const slug = await ensureUniqueSlug(Scheme, body.slug, body.name);
    const scheme = await Scheme.create({
      name: String(body.name).trim(),
      slug,
      department: String(body.department).trim(),
      category: body.category || 'other',
      purpose: String(body.purpose).trim(),
      eligibility: body.eligibility || '',
      benefits: body.benefits || '',
      applicationInfo: body.applicationInfo || '',
      officialSource: body.officialSource ? String(body.officialSource).trim() : '',
      officialSourceUrl: body.officialSourceUrl ? String(body.officialSourceUrl).trim() : '',
      relevantYear: body.relevantYear ? String(body.relevantYear).trim() : '',
      lastVerifiedAt: body.lastVerifiedAt || null,
      isFeatured: Boolean(body.isFeatured),
      isPublished: Boolean(body.isPublished),
      addedBy: req.user._id,
    });

    return res.status(201).json({ success: true, scheme });
  } catch (error) {
    return next(error);
  }
}

export async function updateScheme(req, res, next) {
  try {
    const scheme = await Scheme.findById(req.params.id);
    if (!scheme) {
      return next(createHttpError(404, 'Scheme not found'));
    }

    const body = req.body || {};
    if (body.name !== undefined) scheme.name = String(body.name).trim();
    if (body.slug !== undefined || body.name !== undefined) {
      scheme.slug = await ensureUniqueSlug(Scheme, body.slug || scheme.slug, scheme.name, scheme._id);
    }
    if (body.department !== undefined) scheme.department = String(body.department).trim();
    if (body.category !== undefined) scheme.category = body.category;
    if (body.purpose !== undefined) scheme.purpose = String(body.purpose).trim();
    if (body.eligibility !== undefined) scheme.eligibility = String(body.eligibility);
    if (body.benefits !== undefined) scheme.benefits = String(body.benefits);
    if (body.applicationInfo !== undefined) scheme.applicationInfo = String(body.applicationInfo);
    if (body.officialSource !== undefined) scheme.officialSource = String(body.officialSource).trim();
    if (body.officialSourceUrl !== undefined) scheme.officialSourceUrl = String(body.officialSourceUrl).trim();
    if (body.relevantYear !== undefined) scheme.relevantYear = String(body.relevantYear).trim();
    if (body.lastVerifiedAt !== undefined) scheme.lastVerifiedAt = body.lastVerifiedAt || null;
    if (body.isFeatured !== undefined) scheme.isFeatured = Boolean(body.isFeatured);
    if (body.isPublished !== undefined) scheme.isPublished = Boolean(body.isPublished);

    await scheme.save();
    return res.json({ success: true, scheme });
  } catch (error) {
    return next(error);
  }
}

export async function deleteScheme(req, res, next) {
  try {
    const scheme = await Scheme.findByIdAndDelete(req.params.id);
    if (!scheme) {
      return next(createHttpError(404, 'Scheme not found'));
    }
    return res.json({ success: true, message: 'Scheme deleted' });
  } catch (error) {
    return next(error);
  }
}
