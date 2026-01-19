import { body } from 'express-validator';
import User from '../models/User.js';
import { generateToken } from '../utils/jwt.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';
import validate from '../middleware/validate.js';

// Validation rules
export const registerValidation = validate([
  body('username')
    .trim()
    .isLength({ min: 3, max: 30 })
    .withMessage('Username must be 3-30 characters')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username can only contain letters, numbers, and underscores')
    .custom(async (value) => {
      const existingUser = await User.findOne({ username: value });
      if (existingUser) {
        throw new Error('Username already taken');
      }
      return true;
    }),
  body('email')
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail()
    .custom(async (value) => {
      const existingUser = await User.findOne({ email: value.toLowerCase() });
      if (existingUser) {
        throw new Error('Email already registered');
      }
      return true;
    }),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters')
    .matches(/\d/)
    .withMessage('Password must contain at least one number')
]);

export const loginValidation = validate([
  body('login')
    .trim()
    .notEmpty()
    .withMessage('Email or username is required'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
]);

// Controllers
export const register = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  const user = await User.create({ username, email, password });
  const token = generateToken(user._id);

  res.status(201).json({
    success: true,
    message: 'Registration successful',
    data: {
      user,
      token
    }
  });
});

export const login = asyncHandler(async (req, res) => {
  const { login, password } = req.body;

  // Find user by email or username
  const user = await User.findOne({
    $or: [{ email: login.toLowerCase() }, { username: login }]
  }).select('+password');

  if (!user || !(await user.comparePassword(password))) {
    throw new ApiError(401, 'Invalid credentials');
  }

  const token = generateToken(user._id);

  res.json({
    success: true,
    message: 'Login successful',
    data: {
      user,
      token
    }
  });
});

export const getMe = asyncHandler(async (req, res) => {
  res.json({
    success: true,
    data: {
      user: req.user
    }
  });
});

export const updateProfile = asyncHandler(async (req, res) => {
  const { username, email } = req.body;
  const userId = req.user._id;

  // Check for duplicates excluding current user
  if (username) {
    const existingUsername = await User.findOne({ 
      username, 
      _id: { $ne: userId } 
    });
    if (existingUsername) {
      throw new ApiError(400, 'Username already taken');
    }
  }

  if (email) {
    const existingEmail = await User.findOne({ 
      email: email.toLowerCase(), 
      _id: { $ne: userId } 
    });
    if (existingEmail) {
      throw new ApiError(400, 'Email already registered');
    }
  }

  const user = await User.findByIdAndUpdate(
    userId,
    { 
      ...(username && { username }),
      ...(email && { email: email.toLowerCase() })
    },
    { new: true, runValidators: true }
  );

  // Update username in all user's posts
  if (username) {
    await Post.updateMany(
      { author: userId },
      { username }
    );
  }

  res.json({
    success: true,
    message: 'Profile updated successfully',
    data: { user }
  });
});

export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(req.user._id).select('+password');

  if (!(await user.comparePassword(currentPassword))) {
    throw new ApiError(400, 'Current password is incorrect');
  }

  user.password = newPassword;
  await user.save();

  const token = generateToken(user._id);

  res.json({
    success: true,
    message: 'Password changed successfully',
    data: { token }
  });
});