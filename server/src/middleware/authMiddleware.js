import jwt from 'jsonwebtoken';
import User from '../../models/User.js';
import { createHttpError } from '../utils/helpers.js';

export function getJwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (secret?.trim()) return secret.trim();
  if (process.env.NODE_ENV === 'production') {
    throw new Error('JWT_SECRET must be configured in production.');
  }
  return 'adivasi_chronicles_dev_fallback_secret';
}

function extractBearerToken(req) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) return null;
  const token = header.slice(7).trim();
  return token || null;
}

export async function protect(req, res, next) {
  try {
    const token = extractBearerToken(req);
    if (!token) {
      return next(createHttpError(401, 'Authentication required'));
    }

    const decoded = jwt.verify(token, getJwtSecret());
    const user = await User.findById(decoded.id).select('-password');
    if (!user || !user.isActive) {
      return next(createHttpError(401, 'User account is unavailable'));
    }

    req.user = user;
    return next();
  } catch (error) {
    return next(error);
  }
}

export async function optionalAuth(req, res, next) {
  try {
    const token = extractBearerToken(req);
    if (!token) {
      req.user = null;
      return next();
    }

    const decoded = jwt.verify(token, getJwtSecret());
    const user = await User.findById(decoded.id).select('-password');
    req.user = user && user.isActive ? user : null;
    return next();
  } catch {
    req.user = null;
    return next();
  }
}

export function authorize(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return next(createHttpError(401, 'Authentication required'));
    }
    if (!roles.includes(req.user.role)) {
      return next(createHttpError(403, 'You do not have permission to perform this action'));
    }
    return next();
  };
}
