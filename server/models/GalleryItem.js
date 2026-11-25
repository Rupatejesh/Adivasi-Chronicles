import mongoose from 'mongoose';

const galleryItemSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxlength: 200 },
  category: {
    type: String,
    enum: [
      'tribal-culture',
      'landscapes',
      'eastern-ghats',
      'personal-photography',
      'historical-places',
      'events',
      'social-activities',
    ],
    default: 'landscapes',
  },
  imageUrl: { type: String, required: true, trim: true },
  caption: { type: String, trim: true, default: '', maxlength: 500 },
  description: { type: String, trim: true, default: '', maxlength: 2000 },
  location: { type: String, trim: true, default: '' },
  capturedDate: { type: Date, default: null },
  photographerCredit: { type: String, trim: true, default: '' },
  tags: { type: [{ type: String, trim: true }], default: [] },
  isFeatured: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
}, { timestamps: true });

const GalleryItem = mongoose.models.GalleryItem
  || mongoose.model('GalleryItem', galleryItemSchema);

export default GalleryItem;
