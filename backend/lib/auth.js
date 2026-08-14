import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const JWT_SECRET = process.env.JWT_SECRET || 'sofo-projectos-secret-key-production-ready-2026';

export async function hashPassword(password) {
  return await bcrypt.hash(password, 10);
}

export async function comparePassword(password, hashedPassword) {
  return await bcrypt.compare(password, hashedPassword);
}

export function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

export function authMiddleware(req, res, next) {
  const token = req.cookies?.sofo_session || req.headers.authorization?.replace('Bearer ', '');
  
  if (!token) {
    req.user = null;
    return next();
  }

  const decoded = verifyToken(token);
  if (decoded) {
    req.user = decoded;
  } else {
    req.user = null;
  }
  next();
}

export function requireAuth(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required. Please log in.' });
  }
  next();
}
