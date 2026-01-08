import express from 'express';
import { protect } from '../middleware/auth.middleware.js';
import { authLogger } from '../utils/logger.js';
import UserService from '../models/User.js';

const router = express.Router();

// All routes in this file require authentication
router.use(protect);

// @desc    Get user bookings (as renter)
// @route   GET /api/user/bookings
// @access  Private
router.get('/bookings', async (req, res) => {
  try {
    const userId = req.user.id;
    authLogger.info('Fetching user bookings', { userId });

    // Get bookings where user is the renter
    const bookings = await UserService.getUserBookings(userId);

    authLogger.success('User bookings retrieved', {
      userId,
      bookingCount: bookings.length
    });

    res.json({
      success: true,
      data: bookings,
      count: bookings.length
    });
  } catch (error) {
    authLogger.error('Failed to fetch user bookings', { userId: req.user?.id }, error);
    res.status(500).json({
      message: 'Failed to retrieve bookings',
      error: 'DATABASE_ERROR'
    });
  }
});

// @desc    Get user listings (as owner)
// @route   GET /api/user/listings
// @access  Private
router.get('/listings', async (req, res) => {
  try {
    const userId = req.user.id;
    authLogger.info('Fetching user listings', { userId });

    // Get listings where user is the owner
    const listings = await UserService.getUserListings(userId);

    authLogger.success('User listings retrieved', {
      userId,
      listingCount: listings.length
    });

    res.json({
      success: true,
      data: listings,
      count: listings.length
    });
  } catch (error) {
    authLogger.error('Failed to fetch user listings', { userId: req.user?.id }, error);
    res.status(500).json({
      message: 'Failed to retrieve listings',
      error: 'DATABASE_ERROR'
    });
  }
});

// @desc    Get user reviews (received reviews)
// @route   GET /api/user/reviews
// @access  Private
router.get('/reviews', async (req, res) => {
  try {
    const userId = req.user.id;
    authLogger.info('Fetching user reviews', { userId });

    // Get reviews where user is the reviewee
    const reviews = await UserService.getUserReviews(userId);

    authLogger.success('User reviews retrieved', {
      userId,
      reviewCount: reviews.length
    });

    res.json({
      success: true,
      data: reviews,
      count: reviews.length
    });
  } catch (error) {
    authLogger.error('Failed to fetch user reviews', { userId: req.user?.id }, error);
    res.status(500).json({
      message: 'Failed to retrieve reviews',
      error: 'DATABASE_ERROR'
    });
  }
});

// @desc    Get user favorites
// @route   GET /api/user/favorites
// @access  Private
router.get('/favorites', async (req, res) => {
  try {
    const userId = req.user.id;
    authLogger.info('Fetching user favorites', { userId });

    // Get user's favorite listings
    const favorites = await UserService.getUserFavorites(userId);

    authLogger.success('User favorites retrieved', {
      userId,
      favoriteCount: favorites.length
    });

    res.json({
      success: true,
      data: favorites,
      count: favorites.length
    });
  } catch (error) {
    authLogger.error('Failed to fetch user favorites', { userId: req.user?.id }, error);
    res.status(500).json({
      message: 'Failed to retrieve favorites',
      error: 'DATABASE_ERROR'
    });
  }
});

// @desc    Get user messages
// @route   GET /api/user/messages
// @access  Private
router.get('/messages', async (req, res) => {
  try {
    const userId = req.user.id;
    authLogger.info('Fetching user messages', { userId });

    // Get messages where user is sender or receiver
    const messages = await UserService.getUserMessages(userId);

    authLogger.success('User messages retrieved', {
      userId,
      messageCount: messages.length
    });

    res.json({
      success: true,
      data: messages,
      count: messages.length
    });
  } catch (error) {
    authLogger.error('Failed to fetch user messages', { userId: req.user?.id }, error);
    res.status(500).json({
      message: 'Failed to retrieve messages',
      error: 'DATABASE_ERROR'
    });
  }
});

// @desc    Get user notifications
// @route   GET /api/user/notifications
// @access  Private
router.get('/notifications', async (req, res) => {
  try {
    const userId = req.user.id;
    authLogger.info('Fetching user notifications', { userId });

    // Get notifications for the user
    const notifications = await UserService.getUserNotifications(userId);

    authLogger.success('User notifications retrieved', {
      userId,
      notificationCount: notifications.length
    });

    res.json({
      success: true,
      data: notifications,
      count: notifications.length
    });
  } catch (error) {
    authLogger.error('Failed to fetch user notifications', { userId: req.user?.id }, error);
    res.status(500).json({
      message: 'Failed to retrieve notifications',
      error: 'DATABASE_ERROR'
    });
  }
});

// @desc    Mark notification as read
// @route   PUT /api/user/notifications/:id/read
// @access  Private
router.put('/notifications/:id/read', async (req, res) => {
  try {
    const userId = req.user.id;
    const notificationId = req.params.id;

    authLogger.info('Marking notification as read', { userId, notificationId });

    // Mark notification as read
    const result = await UserService.markNotificationAsRead(userId, notificationId);

    if (!result) {
      return res.status(404).json({
        message: 'Notification not found',
        error: 'NOTIFICATION_NOT_FOUND'
      });
    }

    authLogger.success('Notification marked as read', { userId, notificationId });

    res.json({
      success: true,
      message: 'Notification marked as read'
    });
  } catch (error) {
    authLogger.error('Failed to mark notification as read', {
      userId: req.user?.id,
      notificationId: req.params?.id
    }, error);
    res.status(500).json({
      message: 'Failed to update notification',
      error: 'DATABASE_ERROR'
    });
  }
});

export default router;
