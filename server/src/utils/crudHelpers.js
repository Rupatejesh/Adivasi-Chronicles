import { slugify } from './helpers.js';

export async function ensureUniqueSlug(Model, rawSlug, fallbackTitle, excludeId = null) {
  const base = slugify(rawSlug || fallbackTitle) || `entry-${Date.now()}`;
  let candidate = base;
  let counter = 1;

  while (true) {
    const query = { slug: candidate };
    if (excludeId) query._id = { $ne: excludeId };
    const existing = await Model.findOne(query).select('_id').lean();
    if (!existing) return candidate;
    counter += 1;
    candidate = `${base}-${counter}`;
  }
}

export function isPrivilegedUser(user) {
  return Boolean(user && (user.role === 'admin' || user.role === 'author'));
}

export function parsePagination(query = {}) {
  const page = Math.max(1, Number.parseInt(query.page, 10) || 1);
  const limit = Math.min(100, Math.max(1, Number.parseInt(query.limit, 10) || 24));
  return { page, limit, skip: (page - 1) * limit };
}
