import Song from '../../models/Song.js';
import { isPrivilegedUser } from '../utils/crudHelpers.js';
import { createHttpError, escapeRegex, normalizeStringArray } from '../utils/helpers.js';

function validateCopyrightSafeAudio(sourceType, audioUrl) {
  const hasDirectAudio = Boolean(audioUrl?.trim());
  const effectiveType = sourceType || 'metadata-only';
  if (hasDirectAudio && !['owned', 'licensed'].includes(effectiveType)) {
    throw createHttpError(
      400,
      'Direct audio URLs are permitted only for owned or licensed recordings; use externalUrl for commercial music.',
    );
  }
}

export async function listSongs(req, res, next) {
  try {
    const filter = {};
    const showAll = isPrivilegedUser(req.user) && req.query.all === 'true';
    if (!showAll) filter.isActive = true;

    if (req.query.category) filter.category = String(req.query.category).trim();
    if (req.query.q?.trim()) {
      const regex = new RegExp(escapeRegex(req.query.q.trim()), 'i');
      filter.$or = [{ title: regex }, { artist: regex }, { language: regex }, { tags: regex }];
    }

    const songs = await Song.find(filter).sort({ isFeatured: -1, createdAt: -1 }).lean();
    return res.json({ success: true, songs });
  } catch (error) {
    return next(error);
  }
}

export async function createSong(req, res, next) {
  try {
    const body = req.body || {};
    if (!body.title?.trim() || !body.artist?.trim()) {
      return next(createHttpError(400, 'Song title and artist are required'));
    }

    validateCopyrightSafeAudio(body.sourceType, body.audioUrl);

    const song = await Song.create({
      title: String(body.title).trim(),
      artist: String(body.artist).trim(),
      category: body.category || 'other',
      language: body.language ? String(body.language).trim() : '',
      artwork: body.artwork ? String(body.artwork).trim() : '',
      audioUrl: body.audioUrl ? String(body.audioUrl).trim() : '',
      externalUrl: body.externalUrl ? String(body.externalUrl).trim() : '',
      sourceType: body.sourceType || 'metadata-only',
      duration: body.duration !== undefined && body.duration !== '' && body.duration !== null
        ? Number(body.duration)
        : null,
      tags: normalizeStringArray(body.tags),
      isFeatured: Boolean(body.isFeatured),
      isActive: body.isActive !== undefined ? Boolean(body.isActive) : true,
      addedBy: req.user._id,
    });

    return res.status(201).json({ success: true, song });
  } catch (error) {
    return next(error);
  }
}

export async function updateSong(req, res, next) {
  try {
    const song = await Song.findById(req.params.id);
    if (!song) {
      return next(createHttpError(404, 'Song not found'));
    }

    const body = req.body || {};
    const nextSourceType = body.sourceType !== undefined ? body.sourceType : song.sourceType;
    const nextAudioUrl = body.audioUrl !== undefined ? body.audioUrl : song.audioUrl;
    validateCopyrightSafeAudio(nextSourceType, nextAudioUrl);

    if (body.title !== undefined) song.title = String(body.title).trim();
    if (body.artist !== undefined) song.artist = String(body.artist).trim();
    if (body.category !== undefined) song.category = body.category;
    if (body.language !== undefined) song.language = String(body.language).trim();
    if (body.artwork !== undefined) song.artwork = String(body.artwork).trim();
    if (body.audioUrl !== undefined) song.audioUrl = String(body.audioUrl).trim();
    if (body.externalUrl !== undefined) song.externalUrl = String(body.externalUrl).trim();
    if (body.sourceType !== undefined) song.sourceType = body.sourceType;
    if (body.duration !== undefined) {
      song.duration = body.duration === '' || body.duration === null ? null : Number(body.duration);
    }
    if (body.tags !== undefined) song.tags = normalizeStringArray(body.tags);
    if (body.isFeatured !== undefined) song.isFeatured = Boolean(body.isFeatured);
    if (body.isActive !== undefined) song.isActive = Boolean(body.isActive);

    await song.save();
    return res.json({ success: true, song });
  } catch (error) {
    return next(error);
  }
}

export async function deleteSong(req, res, next) {
  try {
    const song = await Song.findByIdAndDelete(req.params.id);
    if (!song) {
      return next(createHttpError(404, 'Song not found'));
    }
    return res.json({ success: true, message: 'Song deleted' });
  } catch (error) {
    return next(error);
  }
}
