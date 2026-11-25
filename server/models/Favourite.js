import mongoose from 'mongoose';

const favouriteSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  itemType: {
    type: String,
    required: true,
    enum: ['post', 'song', 'biography', 'book', 'article'],
  },
  itemId: { type: mongoose.Schema.Types.ObjectId, required: true },
}, { timestamps: true });

favouriteSchema.index({ user: 1, itemType: 1, itemId: 1 }, { unique: true });

const Favourite = mongoose.models.Favourite || mongoose.model('Favourite', favouriteSchema);

export default Favourite;
