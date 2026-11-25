import Post from '../../models/Post.js';
import Biography from '../../models/Biography.js';
import BookEntry from '../../models/BookEntry.js';
import KnowledgeArticle from '../../models/KnowledgeArticle.js';
import Scheme from '../../models/Scheme.js';
import Song from '../../models/Song.js';
import GalleryItem from '../../models/GalleryItem.js';
import JourneyEntry from '../../models/JourneyEntry.js';
import { escapeRegex } from '../utils/helpers.js';

function articleLink(article) {
  if (article.section === 'constitution') return `/constitution/${article.slug}`;
  if (article.section === 'rights') return `/rights/${article.slug}`;
  if (article.section === 'itda') return '/itda';
  return '/tribal-history';
}

export async function globalSearch(req, res, next) {
  try {
    const q = req.query.q?.trim();
    if (!q) {
      return res.json({ success: true, query: '', results: [] });
    }

    const regex = new RegExp(escapeRegex(q), 'i');

    const [posts, biographies, books, knowledge, schemes, songs, gallery, journey] = await Promise.all([
      Post.find({
        status: 'published',
        $or: [{ title: regex }, { excerpt: regex }, { content: regex }, { tags: regex }],
      }).select('title slug excerpt').limit(10).lean(),

      Biography.find({
        isPublished: true,
        $or: [{ name: regex }, { summary: regex }, { region: regex }, { community: regex }],
      }).select('name slug summary').limit(10).lean(),

      BookEntry.find({
        isPublished: true,
        $or: [{ title: regex }, { author: regex }, { overview: regex }, { themes: regex }],
      }).select('title slug author overview').limit(10).lean(),

      KnowledgeArticle.find({
        isPublished: true,
        $or: [{ title: regex }, { summary: regex }, { provisionOrArticle: regex }, { content: regex }],
      }).select('title slug section summary').limit(12).lean(),

      Scheme.find({
        isPublished: true,
        $or: [{ name: regex }, { department: regex }, { purpose: regex }],
      }).select('name slug department purpose').limit(10).lean(),

      Song.find({
        isActive: true,
        $or: [{ title: regex }, { artist: regex }, { tags: regex }],
      }).select('title artist category').limit(10).lean(),

      GalleryItem.find({
        isActive: true,
        $or: [{ title: regex }, { caption: regex }, { location: regex }],
      }).select('title caption location').limit(10).lean(),

      JourneyEntry.find({
        isPublished: true,
        $or: [{ title: regex }, { summary: regex }, { interest: regex }],
      }).select('title slug summary interest').limit(10).lean(),
    ]);

    const results = [
      ...posts.map((item) => ({
        id: item._id,
        title: item.title,
        type: 'Blog',
        description: item.excerpt || 'Published blog article',
        link: `/blog/${item.slug}`,
      })),
      ...biographies.map((item) => ({
        id: item._id,
        title: item.name,
        type: 'Biography',
        description: item.summary,
        link: `/heroes/${item.slug}`,
      })),
      ...books.map((item) => ({
        id: item._id,
        title: `${item.title} — ${item.author}`,
        type: 'Book & Ideas',
        description: item.overview,
        link: `/books/${item.slug}`,
      })),
      ...knowledge.map((item) => ({
        id: item._id,
        title: item.title,
        type: item.section === 'tribal-history'
          ? 'Tribal History'
          : item.section === 'constitution'
            ? 'Constitution'
            : item.section === 'rights'
              ? 'Tribal Rights'
              : 'ITDA',
        description: item.summary,
        link: articleLink(item),
      })),
      ...schemes.map((item) => ({
        id: item._id,
        title: item.name,
        type: 'Scheme',
        description: `${item.department}: ${item.purpose}`,
        link: '/schemes',
      })),
      ...songs.map((item) => ({
        id: item._id,
        title: `${item.title} — ${item.artist}`,
        type: 'Music',
        description: `Category: ${item.category}`,
        link: '/music',
      })),
      ...gallery.map((item) => ({
        id: item._id,
        title: item.title,
        type: 'Gallery',
        description: item.caption || item.location || 'Gallery photograph',
        link: '/gallery',
      })),
      ...journey.map((item) => ({
        id: item._id,
        title: item.title,
        type: 'My Journey',
        description: item.summary,
        link: '/my-journey',
      })),
    ];

    return res.json({ success: true, query: q, results });
  } catch (error) {
    return next(error);
  }
}
