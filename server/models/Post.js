import mongoose from 'mongoose';

// Metadata only; recording a reference does not verify its accuracy.
const sourceSchema = new mongoose.Schema({
  title: { type: String, trim: true },
  url: { type: String, trim: true },
  publisher: { type: String, trim: true },
  accessedAt: { type: Date },
}, { _id: false });

const postSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxlength: 200 },
  slug: { type: String, required: true, trim: true, lowercase: true, unique: true },
  excerpt: { type: String, trim: true, default: '', maxlength: 500 },
  content: { type: String, required: true },
  coverImage: { type: String, default: '' },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  tags: { type: [{ type: String, trim: true }], default: [] },
  status: { type: String, enum: ['draft', 'published'], default: 'draft' },
  sources: { type: [sourceSchema], default: [] },
  likes: { type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], default: [] },
  publishedAt: { type: Date, default: null },
  isFeatured: { type: Boolean, default: false },
}, { timestamps: true });

const Post = mongoose.models.Post || mongoose.model('Post', postSchema);

export default Post;
