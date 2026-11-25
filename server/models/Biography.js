import mongoose from 'mongoose';

const sourceSchema = new mongoose.Schema({
  title: { type: String, trim: true },
  publisher: { type: String, trim: true },
  url: { type: String, trim: true },
  accessedAt: { type: Date },
}, { _id: false });

const quotationSchema = new mongoose.Schema({
  text: { type: String, trim: true },
  sourceTitle: { type: String, trim: true },
  sourceUrl: { type: String, trim: true },
  // Requires matching source evidence; storing a quotation does not verify it.
  verified: { type: Boolean, default: false },
  verificationNote: { type: String, trim: true },
}, { _id: false });

const biographySchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 150 },
  slug: { type: String, required: true, unique: true, lowercase: true, trim: true, maxlength: 180 },
  alternateNames: { type: [{ type: String, trim: true }], default: [] },
  summary: { type: String, required: true, trim: true, maxlength: 1000 },
  biography: { type: String, default: '' },
  portrait: { type: String, default: '' },
  birthDate: { type: Date, default: null },
  deathDate: { type: Date, default: null },
  region: { type: String, trim: true, default: '' },
  community: { type: String, trim: true, default: '' },
  categories: { type: [String], default: [] },
  keyContributions: { type: [String], default: [] },
  sources: { type: [sourceSchema], default: [] },
  quotations: { type: [quotationSchema], default: [] },
  // Editorial tracking only, never proof of historical accuracy by itself.
  verificationStatus: { type: String, enum: ['pending', 'reviewed', 'verified'], default: 'pending' },
  lastVerifiedAt: { type: Date, default: null },
  isFeatured: { type: Boolean, default: false },
  isPublished: { type: Boolean, default: false },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
}, { timestamps: true });

const Biography = mongoose.models.Biography || mongoose.model('Biography', biographySchema);

export default Biography;
