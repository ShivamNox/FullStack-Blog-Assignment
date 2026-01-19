import { Router } from 'express';
import {
  createPost,
  getPosts,
  getPost,
  getMyPosts,
  updatePost,
  deletePost,
  getPostsByUsername,
  getStats,
  createPostValidation,
  updatePostValidation,
  getPostsValidation
} from '../controllers/postController.js';
import { protect, optionalAuth } from '../middleware/auth.js';
import { apiLimiter } from '../middleware/rateLimiter.js';

const router = Router();


// Public routes
router.get('/', apiLimiter, getPostsValidation, getPosts);
router.get('/stats', getStats);

// Protected routes - paths before dynamic
router.get('/my-posts', protect, getPostsValidation, getMyPosts);

router.get('/user/:username', getPostsValidation, getPostsByUsername);

// Dynamic route
router.get('/:id', optionalAuth, getPost);

// POST/PUT/DELETE routes
router.post('/', protect, createPostValidation, createPost);
router.put('/:id', protect, updatePostValidation, updatePost);
router.patch('/:id', protect, updatePostValidation, updatePost);
router.delete('/:id', protect, deletePost);

export default router;