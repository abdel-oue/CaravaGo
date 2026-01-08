import express from 'express';
import { updateProfile } from '../controllers/auth.controller.js';

const router = express.Router();

router.put('/profile', protect, updateProfile); // Protected route - requires authentication

export default router;