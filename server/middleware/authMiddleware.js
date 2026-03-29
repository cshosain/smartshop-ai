import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json({ message: 'Not authorized, no token' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
    next();
  } catch {
    res.status(401).json({ message: 'Token expired or invalid' });
  }
};

export const adminOnly = (req, res, next) => {
  if (req.user?.role === 'admin') return next();
  res.status(403).json({ message: 'Admin access only' });
};
// Optional protect — attaches user if token exists, but doesn't block
export const optionalProtect = async (req, res, next) => {
  const token = req.cookies.accessToken;
  if (!token) return next();
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
  } catch { /* ignore */ }
  next();
};