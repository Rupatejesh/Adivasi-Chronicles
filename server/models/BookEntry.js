import mongoose from 'mongoose';

const sourceSchema = new mongoose.Schema({
  title: { type: String, trim: true },
  publisher: { type: String, trim: true },
  url: { type: String, trim: true },
  accessedAt: { type: Date },
}, { _id: false });

const bookEntrySchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxlength: 200 },
  slug: { type: String, required: true, unique: true, lowercase: true, trim: true, maxlength: 220 },
  author: { type: String, required: true, trim: true, maxlength: 150 },
  publicationContext: { type: String, trim: true, default: '' },
  overview: { type: String, required: true, trim: true, maxlength: 2500 },
  historicalContext: { type: String, default: '' },
  themes: { type: [{ type: String, trim: true }], default: [] },
  personalNotes: { type: String, default: '' },
  coverImage: { type: String, default: '' },
  category: { type: String, trim: true, default: 'Social Thought' },
  sources: { type: [sourceSchema], default: [] },
  isFeatured: { type: Boolean, default: false },
  isPublished: { type: Boolean, default: false },
  addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
}, { timestamps: true });

const BookEntry = mongoose.models.BookEntry || mongoose.model('BookEntry', bookEntrySchema);

export default BookEntry;
