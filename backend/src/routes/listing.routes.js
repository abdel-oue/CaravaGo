import express from 'express';
import {
  createListing,
  getAllListings,
  getListingById,
  getMyListings,
  updateListing,
  deleteListing
} from '../controllers/listing.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

// Public routes
router.get('/', getAllListings);
router.get('/:id', getListingById);

// Protected routes (require JWT authentication)
router.post('/', protect, createListing);
router.get('/my-listings', protect, getMyListings);
router.put('/:id', protect, updateListing);
router.delete('/:id', protect, deleteListing);

export default router;
