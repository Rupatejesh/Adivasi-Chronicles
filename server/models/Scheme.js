import mongoose from 'mongoose';

const schemeSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 200 },
  slug: { type: String, required: true, unique: true, lowercase: true, trim: true, maxlength: 220 },
  department: { type: String, required: true, trim: true, maxlength: 200 },
  category: {
    type: String,
    enum: [
      'education',
      'health',
      'livelihoods',
      'agriculture-forest',
      'housing-infrastructure',
      'women-community',
      'financial-support',
      'tricor',
      'other',
    ],
    default: 'other',
  },
  purpose: { type: String, required: true, trim: true, maxlength: 1500 },
  eligibility: { type: String, default: '' },
  benefits: { type: String, default: '' },
  applicationInfo: { type: String, default: '' },
  officialSource: { type: String, trim: true, default: '' },
  officialSourceUrl: { type: String, trim: true, default: '' },
  relevantYear: { type: String, trim: true, default: '' },
  lastVerifiedAt: { type: Date, default: null },
  isFeatured: { type: Boolean, default: false },
  isPublished: { type: Boolean, default: false },
  addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
}, { timestamps: true });

const Scheme = mongoose.models.Scheme || mongoose.model('Scheme', schemeSchema);

export default Scheme;
