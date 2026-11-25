import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../../models/User.js';
import { getJwtSecret } from '../middleware/authMiddleware.js';
import { createHttpError } from '../utils/helpers.js';

export function sanitizeUser(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    avatar: user.avatar,
    bio: user.bio,
    isActive: user.isActive,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

function signToken(user) {
  return jwt.sign(
    { id: user._id.toString(), role: user.role },
    getJwtSecret(),
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' },
  );
}

export async function register(req, res, next) {
  try {
    const { name, email, password } = req.body || {};
    if (!name?.trim() || !email?.trim() || !password) {
      return next(createHttpError(400, 'Name, email and password are required'));
    }
    if (String(password).length < 6) {
      return next(createHttpError(400, 'Password must be at least 6 characters long'));
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) {
      return next(createHttpError(409, 'An account with this email already exists'));
    }

    const hashedPassword = await bcrypt.hash(String(password), 12);
    const user = await User.create({
      name: String(name).trim(),
      email: normalizedEmail,
      password: hashedPassword,
      role: 'user',
    });

    const token = signToken(user);
    return res.status(201).json({
      success: true,
      token,
      user: sanitizeUser(user),
    });
  } catch (error) {
    return next(error);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body || {};
    if (!email?.trim() || !password) {
      return next(createHttpError(400, 'Email and password are required'));
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail }).select('+password');
    if (!user) {
      return next(createHttpError(401, 'Invalid email or password'));
    }

    if (!user.isActive) {
      return next(createHttpError(403, 'This account has been deactivated'));
    }

    const isMatch = await bcrypt.compare(String(password), user.password);
    if (!isMatch) {
      return next(createHttpError(401, 'Invalid email or password'));
    }

    const token = signToken(user);
    return res.json({
      success: true,
      token,
      user: sanitizeUser(user),
    });
  } catch (error) {
    return next(error);
  }
}

export async function getMe(req, res) {
  return res.json({
    success: true,
    user: sanitizeUser(req.user),
  });
}

export async function updateMe(req, res, next) {
  try {
    const { name, bio, avatar } = req.body || {};
    const updates = {};

    if (name !== undefined) {
      if (!String(name).trim()) {
        return next(createHttpError(400, 'Name cannot be empty'));
      }
      updates.name = String(name).trim();
    }
    if (bio !== undefined) updates.bio = String(bio).trim();
    if (avatar !== undefined) updates.avatar = String(avatar).trim();

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updates,
      { new: true, runValidators: true },
    ).select('-password');

    return res.json({
      success: true,
      user: sanitizeUser(user),
    });
  } catch (error) {
    return next(error);
  }
}
