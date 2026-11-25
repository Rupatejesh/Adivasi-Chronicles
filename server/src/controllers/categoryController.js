import Category from '../../models/Category.js';
import { ensureUniqueSlug, isPrivilegedUser } from '../utils/crudHelpers.js';
import { createHttpError } from '../utils/helpers.js';

export async function listCategories(req, res, next) {
  try {
    const filter = {};
    if (req.query.type) filter.type = String(req.query.type).trim();

    const showAll = req.query.includeInactive === 'true' && isPrivilegedUser(req.user);
    if (!showAll) filter.isActive = true;

    const categories = await Category.find(filter).sort({ type: 1, name: 1 }).lean();
    return res.json({ success: true, categories });
  } catch (error) {
    return next(error);
  }
}

export async function createCategory(req, res, next) {
  try {
    const { name, slug, description, type, isActive } = req.body || {};
    if (!name?.trim()) {
      return next(createHttpError(400, 'Category name is required'));
    }

    const resolvedSlug = await ensureUniqueSlug(Category, slug, name);
    const category = await Category.create({
      name: String(name).trim(),
      slug: resolvedSlug,
      description: description !== undefined ? String(description).trim() : '',
      type: type || 'general',
      isActive: isActive !== undefined ? Boolean(isActive) : true,
    });

    return res.status(201).json({ success: true, category });
  } catch (error) {
    return next(error);
  }
}

export async function updateCategory(req, res, next) {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return next(createHttpError(404, 'Category not found'));
    }

    const { name, slug, description, type, isActive } = req.body || {};
    if (name !== undefined) category.name = String(name).trim();
    if (slug !== undefined || name !== undefined) {
      category.slug = await ensureUniqueSlug(Category, slug || category.slug, category.name, category._id);
    }
    if (description !== undefined) category.description = String(description).trim();
    if (type !== undefined) category.type = type;
    if (isActive !== undefined) category.isActive = Boolean(isActive);

    await category.save();
    return res.json({ success: true, category });
  } catch (error) {
    return next(error);
  }
}

export async function deleteCategory(req, res, next) {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) {
      return next(createHttpError(404, 'Category not found'));
    }
    return res.json({ success: true, message: 'Category deleted' });
  } catch (error) {
    return next(error);
  }
}
