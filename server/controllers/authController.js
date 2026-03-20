import User from '../models/User.js';
import { generateAccessToken, generateRefreshToken, setTokenCookies } from '../utils/generateToken.js';
import jwt from 'jsonwebtoken';

// @POST /api/auth/register
export const register = async (req, res) => {
  const { name, email, password } = req.body;
  const exists = await User.findOne({ email });
  if (exists) return res.status(400).json({ message: 'Email already registered' });
  const user = await User.create({ name, email, password });
  const accessToken  = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);
  setTokenCookies(res, accessToken, refreshToken);
  res.status(201).json({ _id: user._id, name: user.name, email: user.email, role: user.role });
};

// @POST /api/auth/login
export const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await user.matchPassword(password)))
    return res.status(401).json({ message: 'Invalid email or password' });
  const accessToken  = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);
  setTokenCookies(res, accessToken, refreshToken);
  res.json({ _id: user._id, name: user.name, email: user.email, role: user.role });
};

// @POST /api/auth/logout
export const logout = (req, res) => {
  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');
  res.json({ message: 'Logged out successfully' });
};

// @POST /api/auth/refresh
export const refreshToken = (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token) return res.status(401).json({ message: 'No refresh token' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const accessToken = generateAccessToken(decoded.id);
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000,
    });
    res.json({ message: 'Token refreshed' });
  } catch {
    res.status(401).json({ message: 'Invalid refresh token' });
  }
};