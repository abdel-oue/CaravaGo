import express from 'express';
import {
  register,
  login,
  getMe,
} from '../controllers/auth.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { validateApiKey } from '../middleware/api.middleware.js';

const router = express.Router();

router.post('/register', validateApiKey, register);
router.post('/login', validateApiKey, login);
router.get('/me', protect, getMe);

export default router;

