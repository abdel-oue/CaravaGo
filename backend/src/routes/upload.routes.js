import express from 'express';
import { protect } from '../middleware/auth.middleware.js';
import { upload } from '../middleware/upload.middleware.js';
import {
  uploadProfilePicture,
  uploadImage,
  uploadImages,
  deleteUploadedFile
} from '../controllers/upload.controller.js';

const router = express.Router();

// Profile picture upload
router.post('/profile', protect, upload.single('profile'), uploadProfilePicture);

// General image upload (for listings, etc.)
router.post('/image', protect, upload.single('image'), uploadImage);

// Multiple images upload (for listings with multiple photos)
router.post('/images', protect, upload.array('images', 10), uploadImages);

// Delete uploaded file
router.delete('/file', protect, deleteUploadedFile);

export default router;