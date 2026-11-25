import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, unique: true },
  slug: { type: String, required: true, trim: true, lowercase: true, unique: true },
  description: { type: String, trim: true, default: '', maxlength: 1000 },
  type: {
    type: String,
    enum: [
      'blog', 'history', 'biography', 'books', 'constitution', 'rights',
      'itda', 'schemes', 'music', 'gallery', 'journey', 'general',
    ],
    default: 'general',
  },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

const Category = mongoose.models.Category || mongoose.model('Category', categorySchema);

export default Category;
