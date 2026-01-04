import express from 'express';
import {
  register,
  login,
  getMe,
} from '../controllers/auth.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

// Authentication routes use JWT - no API key required for frontend
router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);

export default router;

