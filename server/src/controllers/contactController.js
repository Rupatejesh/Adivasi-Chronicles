import ContactMessage from '../../models/ContactMessage.js';
import { createHttpError } from '../utils/helpers.js';

export async function submitContactMessage(req, res, next) {
  try {
    const { name, email, subject, message } = req.body || {};
    if (!name?.trim() || !email?.trim() || !subject?.trim() || !message?.trim()) {
      return next(createHttpError(400, 'Name, email, subject and message are required'));
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(String(email).trim())) {
      return next(createHttpError(400, 'Please enter a valid email address'));
    }

    const saved = await ContactMessage.create({
      name: String(name).trim(),
      email: String(email).trim().toLowerCase(),
      subject: String(subject).trim(),
      message: String(message).trim(),
    });

    return res.status(201).json({
      success: true,
      message: 'Your message has been received and saved for review.',
      id: saved._id,
    });
  } catch (error) {
    return next(error);
  }
}

export async function listContactMessages(req, res, next) {
  try {
    const messages = await ContactMessage.find().sort({ createdAt: -1 }).limit(100).lean();
    return res.json({ success: true, messages });
  } catch (error) {
    return next(error);
  }
}

export async function updateContactMessageStatus(req, res, next) {
  try {
    const msg = await ContactMessage.findById(req.params.id);
    if (!msg) {
      return next(createHttpError(404, 'Contact message not found'));
    }
    if (req.body?.status && ['new', 'reviewed', 'archived'].includes(req.body.status)) {
      msg.status = req.body.status;
      await msg.save();
    }
    return res.json({ success: true, message: msg });
  } catch (error) {
    return next(error);
  }
}

export async function deleteContactMessage(req, res, next) {
  try {
    const msg = await ContactMessage.findByIdAndDelete(req.params.id);
    if (!msg) {
      return next(createHttpError(404, 'Contact message not found'));
    }
    return res.json({ success: true, message: 'Contact message deleted' });
  } catch (error) {
    return next(error);
  }
}
