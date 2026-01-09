import express from 'express';
import {
  createBooking,
  getAllBookings,
  getBookingById,
  getMyBookings,
  getOwnerBookings,
  getListingBookings,
  updateBooking,
  deleteBooking,
  checkAvailability
} from '../controllers/booking.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

// Public routes
router.get('/check-availability', checkAvailability);

// Protected routes (require JWT authentication)
router.post('/', protect, createBooking);

// Routes that need specific ordering (more specific before general)
router.get('/my-bookings', protect, getMyBookings);
router.get('/owner-bookings', protect, getOwnerBookings);
router.get('/listing/:listingId', protect, getListingBookings);

// General routes
router.get('/', protect, getAllBookings); // Admin route - could be restricted further
router.get('/:id', protect, getBookingById);
router.put('/:id', protect, updateBooking);
router.delete('/:id', protect, deleteBooking);

export default router;
