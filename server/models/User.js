import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  // Hashing belongs to Phase 12, before any real users are saved.
  password: { type: String, required: true, select: false },
  role: { type: String, enum: ['user', 'author', 'admin'], default: 'user' },
  avatar: { type: String, default: '' },
  bio: { type: String, default: '', maxlength: 500 },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;
