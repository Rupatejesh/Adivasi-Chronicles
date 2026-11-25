import mongoose from 'mongoose';

const sourceSchema = new mongoose.Schema({
  title: { type: String, trim: true },
  publisher: { type: String, trim: true },
  url: { type: String, trim: true },
  accessedAt: { type: Date },
}, { _id: false });

const timelineItemSchema = new mongoose.Schema({
  year: { type: String, trim: true },
  title: { type: String, trim: true },
  detail: { type: String, trim: true },
}, { _id: false });

const knowledgeArticleSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxlength: 200 },
  slug: { type: String, required: true, unique: true, lowercase: true, trim: true, maxlength: 220 },
  section: {
    type: String,
    required: true,
    enum: ['tribal-history', 'constitution', 'rights', 'itda'],
  },
  category: { type: String, trim: true, default: '' },
  summary: { type: String, required: true, trim: true, maxlength: 1000 },
  content: { type: String, default: '' },
  provisionOrArticle: { type: String, trim: true, default: '' },
  plainExplanation: { type: String, default: '' },
  historicalContext: { type: String, default: '' },
  location: { type: String, trim: true, default: '' },
  movement: { type: String, trim: true, default: '' },
  timeline: { type: [timelineItemSchema], default: [] },
  relatedPeople: { type: [{ type: String, trim: true }], default: [] },
  tags: { type: [{ type: String, trim: true }], default: [] },
  coverImage: { type: String, default: '' },
  officialSource: { type: String, trim: true, default: '' },
  officialSourceUrl: { type: String, trim: true, default: '' },
  sources: { type: [sourceSchema], default: [] },
  verificationStatus: {
    type: String,
    enum: ['pending', 'reviewed', 'verified'],
    default: 'pending',
  },
  relevantYear: { type: String, trim: true, default: '' },
  lastVerifiedAt: { type: Date, default: null },
  isFeatured: { type: Boolean, default: false },
  isPublished: { type: Boolean, default: false },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
}, { timestamps: true });

const KnowledgeArticle = mongoose.models.KnowledgeArticle
  || mongoose.model('KnowledgeArticle', knowledgeArticleSchema);

export default KnowledgeArticle;
