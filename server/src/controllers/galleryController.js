import GalleryItem from '../../models/GalleryItem.js';
import { isPrivilegedUser } from '../utils/crudHelpers.js';
import { createHttpError, escapeRegex, normalizeStringArray } from '../utils/helpers.js';

export async function listGalleryItems(req, res, next) {
  try {
    const filter = {};
    const showAll = isPrivilegedUser(req.user) && req.query.all === 'true';
    if (!showAll) filter.isActive = true;

    if (req.query.category) filter.category = String(req.query.category).trim();
    if (req.query.q?.trim()) {
      const regex = new RegExp(escapeRegex(req.query.q.trim()), 'i');
      filter.$or = [{ title: regex }, { caption: regex }, { location: regex }, { photographerCredit: regex }];
    }

    const items = await GalleryItem.find(filter).sort({ isFeatured: -1, createdAt: -1 }).lean();
    return res.json({ success: true, items });
  } catch (error) {
    return next(error);
  }
}

export async function createGalleryItem(req, res, next) {
  try {
    const body = req.body || {};
    if (!body.title?.trim() || !body.imageUrl?.trim()) {
      return next(createHttpError(400, 'Title and imageUrl are required'));
    }

    const item = await GalleryItem.create({
      title: String(body.title).trim(),
      category: body.category || 'landscapes',
      imageUrl: String(body.imageUrl).trim(),
      caption: body.caption ? String(body.caption).trim() : '',
      description: body.description ? String(body.description).trim() : '',
      location: body.location ? String(body.location).trim() : '',
      capturedDate: body.capturedDate || null,
      photographerCredit: body.photographerCredit ? String(body.photographerCredit).trim() : '',
      tags: normalizeStringArray(body.tags),
      isFeatured: Boolean(body.isFeatured),
      isActive: body.isActive !== undefined ? Boolean(body.isActive) : true,
      addedBy: req.user._id,
    });

    return res.status(201).json({ success: true, item });
  } catch (error) {
    return next(error);
  }
}

export async function updateGalleryItem(req, res, next) {
  try {
    const item = await GalleryItem.findById(req.params.id);
    if (!item) {
      return next(createHttpError(404, 'Gallery item not found'));
    }

    const body = req.body || {};
    if (body.title !== undefined) item.title = String(body.title).trim();
    if (body.category !== undefined) item.category = body.category;
    if (body.imageUrl !== undefined) item.imageUrl = String(body.imageUrl).trim();
    if (body.caption !== undefined) item.caption = String(body.caption).trim();
    if (body.description !== undefined) item.description = String(body.description).trim();
    if (body.location !== undefined) item.location = String(body.location).trim();
    if (body.capturedDate !== undefined) item.capturedDate = body.capturedDate || null;
    if (body.photographerCredit !== undefined) item.photographerCredit = String(body.photographerCredit).trim();
    if (body.tags !== undefined) item.tags = normalizeStringArray(body.tags);
    if (body.isFeatured !== undefined) item.isFeatured = Boolean(body.isFeatured);
    if (body.isActive !== undefined) item.isActive = Boolean(body.isActive);

    await item.save();
    return res.json({ success: true, item });
  } catch (error) {
    return next(error);
  }
}

export async function deleteGalleryItem(req, res, next) {
  try {
    const item = await GalleryItem.findByIdAndDelete(req.params.id);
    if (!item) {
      return next(createHttpError(404, 'Gallery item not found'));
    }
    return res.json({ success: true, message: 'Gallery item deleted' });
  } catch (error) {
    return next(error);
  }
}
