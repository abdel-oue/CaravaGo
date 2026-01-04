import express from 'express';
import {
  register,
  login,
  getMe,
} from '../controllers/auth.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { validateApiKey } from '../middleware/api.middleware.js';

const router = express.Router();

router.use(validateApiKey); // Apply API key validation to all routes in this router

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);

export default router;

