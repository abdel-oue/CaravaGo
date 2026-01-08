import express from 'express';
import { updateProfile } from '../controllers/profile.controller.js';
import { protect } from '../middleware/auth.middleware.js'

const router = express.Router();

router.put('/profile', protect, updateProfile); // Protected route - requires authentication

export default router;