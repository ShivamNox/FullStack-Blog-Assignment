import { body, query } from 'express-validator';
import Post from '../models/Post.js';
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';
import validate from '../middleware/validate.js';

// Validation rules
export const createPostValidation = validate([
  body('title')
    .trim()
    .isLength({ min: 5, max: 120 })
    .withMessage('Title must be 5-120 characters'),
  body('imageURL')
    .optional({ checkFalsy: true })
    .trim()
    .isURL()
    .withMessage('Please provide a valid URL'),
  body('content')
    .trim()
    .isLength({ min: 50 })
    .withMessage('Content must be at least 50 characters')
]);

export const updatePostValidation = validate([
  body('title')
    .optional()
    .trim()
    .isLength({ min: 5, max: 120 })
    .withMessage('Title must be 5-120 characters'),
  body('imageURL')
    .optional({ checkFalsy: true })
    .trim()
    .isURL()
    .withMessage('Please provide a valid URL'),
  body('content')
    .optional()
    .trim()
    .isLength({ min: 50 })
    .withMessage('Content must be at least 50 characters')
]);

export const getPostsValidation = validate([
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage('Limit must be between 1 and 50'),
  query('sortBy')
    .optional()
    .isIn(['createdAt', 'title', 'updatedAt'])
    .withMessage('Invalid sort field'),
  query('order')
    .optional()
    .isIn(['asc', 'desc'])
    .withMessage('Order must be asc or desc')
]);

// Controllers
export const createPost = asyncHandler(async (req, res) => {
  const { title, imageURL, content } = req.body;

  const post = await Post.create({
    title,
    imageURL: imageURL || undefined,
    content,
    username: req.user.username,
    author: req.user._id
  });

  res.status(201).json({
    success: true,
    message: 'Post created successfully',
    data: { post }
  });
});

export const getPosts = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  const search = req.query.search?.trim();
  const sortBy = req.query.sortBy || 'createdAt';
  const order = req.query.order === 'asc' ? 1 : -1;

  let query = {};

  if (search) {
    query = {
      $or: [
        { title: { $regex: search, $options: 'i' } },
        { username: { $regex: search, $options: 'i' } }
      ]
    };
  }

  const [posts, total] = await Promise.all([
    Post.find(query)
      .sort({ [sortBy]: order })
      .skip(skip)
      .limit(limit)
      .populate('author', 'username email')
      .lean(),
    Post.countDocuments(query)
  ]);

  const totalPages = Math.ceil(total / limit);

  res.json({
    success: true,
    data: {
      posts,
      pagination: {
        currentPage: page,
        totalPages,
        totalPosts: total,
        limit,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    }
  });
});

export const getPost = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Try to find by slug first, then by ID
  let post = await Post.findOne({ slug: id })
    .populate('author', 'username email')
    .lean();

  if (!post && id.match(/^[0-9a-fA-F]{24}$/)) {
    post = await Post.findById(id)
      .populate('author', 'username email')
      .lean();
  }

  if (!post) {
    throw new ApiError(404, 'Post not found');
  }

  res.json({
    success: true,
    data: { post }
  });
});

export const getMyPosts = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const [posts, total] = await Promise.all([
    Post.find({ author: req.user._id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Post.countDocuments({ author: req.user._id })
  ]);

  const totalPages = Math.ceil(total / limit);

  res.json({
    success: true,
    data: {
      posts,
      pagination: {
        currentPage: page,
        totalPages,
        totalPosts: total,
        limit,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    }
  });
});

export const updatePost = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, imageURL, content } = req.body;

  const post = await Post.findById(id);

  if (!post) {
    throw new ApiError(404, 'Post not found');
  }

  if (post.author.toString() !== req.user._id.toString()) {
    throw new ApiError(403, 'You are not authorized to update this post');
  }

  if (title !== undefined) post.title = title;
  if (imageURL !== undefined) post.imageURL = imageURL || undefined;
  if (content !== undefined) post.content = content;

  await post.save();

  res.json({
    success: true,
    message: 'Post updated successfully',
    data: { post }
  });
});

export const deletePost = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const post = await Post.findById(id);

  if (!post) {
    throw new ApiError(404, 'Post not found');
  }

  if (post.author.toString() !== req.user._id.toString()) {
    throw new ApiError(403, 'You are not authorized to delete this post');
  }

  await post.deleteOne();

  res.json({
    success: true,
    message: 'Post deleted successfully',
    data: { id }
  });
});

// Get posts by username
export const getPostsByUsername = asyncHandler(async (req, res) => {
  const { username } = req.params;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const [posts, total] = await Promise.all([
    Post.find({ username })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('author', 'username')
      .lean(),
    Post.countDocuments({ username })
  ]);

  const totalPages = Math.ceil(total / limit);

  res.json({
    success: true,
    data: {
      posts,
      pagination: {
        currentPage: page,
        totalPages,
        totalPosts: total,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    }
  });
});

// Get post statistics
export const getStats = asyncHandler(async (req, res) => {
  const [totalPosts, totalUsers, recentPosts] = await Promise.all([
    Post.countDocuments(),
    Post.distinct('author').then(authors => authors.length),
    Post.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('title slug createdAt username')
      .lean()
  ]);

  res.json({
    success: true,
    data: {
      totalPosts,
      totalUsers,
      recentPosts
    }
  });
});