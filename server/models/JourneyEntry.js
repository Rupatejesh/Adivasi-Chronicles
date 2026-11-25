import mongoose from 'mongoose';

const journeyEntrySchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxlength: 200 },
  slug: { type: String, required: true, unique: true, lowercase: true, trim: true, maxlength: 220 },
  interest: {
    type: String,
    enum: ['horses', 'football', 'archery', 'learning', 'writing', 'photography', 'general'],
    default: 'general',
  },
  summary: { type: String, required: true, trim: true, maxlength: 1000 },
  content: { type: String, default: '' },
  location: { type: String, trim: true, default: '' },
  entryDate: { type: Date, default: null },
  coverImage: { type: String, default: '' },
  tags: { type: [{ type: String, trim: true }], default: [] },
  isPublished: { type: Boolean, default: false },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
}, { timestamps: true });

const JourneyEntry = mongoose.models.JourneyEntry
  || mongoose.model('JourneyEntry', journeyEntrySchema);

export default JourneyEntry;
