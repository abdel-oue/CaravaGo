import express from 'express';
import {
  register,
  login,
  logout,
  forgotPassword,
  resetPassword,
  verifyEmail,
  updateProfile,
  verifyToken
} from '../controllers/auth.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

// Authentication routes use JWT - no API key required for frontend
router.post('/register', register);
router.post('/verify-email', verifyEmail);
router.post('/login', login);
router.post('/verify-token', verifyToken); // Public route for token verification
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.put('/profile', protect, updateProfile); // Protected route - requires authentication
router.post('/logout', protect, logout); // Protected route - requires authentication

export default router;

