import mongoose from 'mongoose';
import Favourite from '../../models/Favourite.js';
import Post from '../../models/Post.js';
import Song from '../../models/Song.js';
import Biography from '../../models/Biography.js';
import BookEntry from '../../models/BookEntry.js';
import KnowledgeArticle from '../../models/KnowledgeArticle.js';
import { createHttpError } from '../utils/helpers.js';

const MODEL_MAP = {
  post: { Model: Post, select: 'title slug excerpt status', routePrefix: '/blog' },
  song: { Model: Song, select: 'title artist category sourceType isActive', routePrefix: '/music' },
  biography: { Model: Biography, select: 'name slug summary isPublished', routePrefix: '/heroes' },
  book: { Model: BookEntry, select: 'title slug author overview isPublished', routePrefix: '/books' },
  article: { Model: KnowledgeArticle, select: 'title slug section summary isPublished', routePrefix: null },
};

export async function listFavourites(req, res, next) {
  try {
    const filter = { user: req.user._id };
    if (req.query.itemType) filter.itemType = String(req.query.itemType).trim();

    const raw = await Favourite.find(filter).sort({ createdAt: -1 }).lean();

    const populated = await Promise.all(raw.map(async (fav) => {
      const config = MODEL_MAP[fav.itemType];
      if (!config) return fav;
      const doc = await config.Model.findById(fav.itemId).select(config.select).lean();
      if (!doc) return null;
      if (fav.itemType === 'post' && doc.status !== 'published') return null;
      if (fav.itemType === 'song' && !doc.isActive) return null;
      if (['biography', 'book', 'article'].includes(fav.itemType) && !doc.isPublished) return null;

      let link = config.routePrefix ? `${config.routePrefix}/${doc.slug || ''}` : '/';
      if (fav.itemType === 'song') link = '/music';
      if (fav.itemType === 'article') {
        if (doc.section === 'constitution') link = `/constitution/${doc.slug}`;
        else if (doc.section === 'rights') link = `/rights/${doc.slug}`;
        else if (doc.section === 'itda') link = '/itda';
        else link = '/tribal-history';
      }

      return {
        ...fav,
        item: {
          title: doc.title || doc.name,
          subtitle: doc.artist || doc.author || doc.excerpt || doc.summary || '',
          slug: doc.slug || null,
          link,
        },
      };
    }));

    return res.json({ success: true, favourites: populated.filter(Boolean) });
  } catch (error) {
    return next(error);
  }
}

export async function toggleFavourite(req, res, next) {
  try {
    const { itemType, itemId } = req.body || {};
    if (!itemType || !MODEL_MAP[itemType] || !itemId || !mongoose.Types.ObjectId.isValid(itemId)) {
      return next(createHttpError(400, 'Valid itemType and itemId are required'));
    }

    const existing = await Favourite.findOne({ user: req.user._id, itemType, itemId });
    if (existing) {
      await existing.deleteOne();
      return res.json({ success: true, saved: false });
    }

    const target = await MODEL_MAP[itemType].Model.findById(itemId).select('_id').lean();
    if (!target) {
      return next(createHttpError(404, 'Referenced item not found'));
    }

    await Favourite.create({ user: req.user._id, itemType, itemId });
    return res.status(201).json({ success: true, saved: true });
  } catch (error) {
    return next(error);
  }
}
