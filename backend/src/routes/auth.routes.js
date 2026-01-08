import express from 'express';
import {
  register,
  login,
  forgotPassword,
  resetPassword,
  verifyEmail,
  verifyToken
} from '../controllers/auth.controller.js';

const router = express.Router();

// Authentication routes use JWT - no API key required for frontend
router.post('/register', register);
router.post('/verify-email', verifyEmail);
router.post('/login', login);
router.post('/verify-token', verifyToken); // Public route for token verification
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

export default router;

