import mongoose from 'mongoose';

const songSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxlength: 200 },
  artist: { type: String, required: true, trim: true, maxlength: 200 },
  category: {
    type: String,
    enum: ['ambedkar', 'tribal-folk', 'kesari', 'prabhas', 'allu-arjun', 'other'],
    default: 'other',
  },
  language: { type: String, trim: true, default: '' },
  artwork: { type: String, default: '' },
  // Direct audio requires ownership, permission or a valid playback licence.
  audioUrl: { type: String, default: '' },
  externalUrl: { type: String, default: '' },
  sourceType: {
    type: String,
    enum: ['owned', 'licensed', 'external', 'metadata-only'],
    default: 'metadata-only',
  },
  duration: { type: Number, default: null, min: 0 },
  tags: { type: [{ type: String, trim: true }], default: [] },
  isFeatured: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
}, { timestamps: true });

const Song = mongoose.models.Song || mongoose.model('Song', songSchema);

export default Song;
