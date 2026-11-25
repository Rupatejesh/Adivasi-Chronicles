import mongoose from 'mongoose';

const contactMessageSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 120 },
  email: { type: String, required: true, trim: true, lowercase: true, maxlength: 254 },
  subject: { type: String, required: true, trim: true, maxlength: 120 },
  message: { type: String, required: true, trim: true, maxlength: 5000 },
  status: { type: String, enum: ['new', 'reviewed', 'archived'], default: 'new' },
}, { timestamps: true });

const ContactMessage = mongoose.models.ContactMessage
  || mongoose.model('ContactMessage', contactMessageSchema);

export default ContactMessage;
