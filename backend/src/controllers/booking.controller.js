import BookingService from '../models/Booking.js';
import { logger } from '../utils/logger.js';

// @desc    Create a new booking
// @route   POST /api/bookings
// @access  Private
export const createBooking = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      listing_id,
      start_date,
      end_date,
      total_days,
      total_price,
      currency,
      special_requests
    } = req.body;

    logger.info('Booking creation attempt started', { userId, listing_id, start_date });

    // Validation - Required fields
    if (!listing_id || !start_date || !end_date || !total_price) {
      logger.warning('Booking validation failed: missing required fields', {
        userId,
        hasListingId: !!listing_id,
        hasStartDate: !!start_date,
        hasEndDate: !!end_date,
        hasTotalPrice: !!total_price
      });
      return res.status(400).json({
        message: 'Please provide all required fields: listing_id, start_date, end_date, and total_price'
      });
    }

    // Validate dates
    const startDate = new Date(start_date);
    const endDate = new Date(end_date);
    const now = new Date();

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      logger.warning('Booking validation failed: invalid date format', { userId, start_date, end_date });
      return res.status(400).json({
        message: 'Please provide valid dates in ISO format'
      });
    }

    if (startDate <= now) {
      logger.warning('Booking validation failed: start date in past', { userId, start_date });
      return res.status(400).json({
        message: 'Start date must be in the future'
      });
    }

    if (endDate <= startDate) {
      logger.warning('Booking validation failed: end date before start date', { userId, start_date, end_date });
      return res.status(400).json({
        message: 'End date must be after start date'
      });
    }

    // Validate total_price
    if (total_price <= 0) {
      logger.warning('Booking validation failed: invalid total price', { userId, total_price });
      return res.status(400).json({
        message: 'Total price must be greater than 0'
      });
    }

    // Check availability
    const availability = await BookingService.checkAvailability(listing_id, start_date, end_date);
    if (!availability.available) {
      logger.warning('Booking validation failed: dates not available', {
        userId,
        listing_id,
        start_date,
        end_date,
        conflicting_bookings: availability.conflicting_bookings.length
      });
      return res.status(409).json({
        message: 'Selected dates are not available',
        conflicting_dates: availability.conflicting_bookings
      });
    }

    // Get listing details to get owner_id
    const ListingService = (await import('../models/Listing.js')).default;
    const listing = await ListingService.getListingById(listing_id);

    if (!listing) {
      logger.warning('Booking validation failed: listing not found', { userId, listing_id });
      return res.status(404).json({ message: 'Listing not found' });
    }

    // Create booking
    const booking = await BookingService.createBooking({
      listing_id,
      renter_id: userId,
      owner_id: listing.owner_id,
      start_date,
      end_date,
      total_days,
      total_price,
      currency: currency || 'EUR',
      special_requests
    });

    logger.success('Booking created successfully', {
      booking_id: booking.id,
      userId,
      listing_id,
      start_date,
      end_date
    });

    res.status(201).json(booking);
  } catch (error) {
    logger.error('Booking creation failed with exception', { userId: req.user?.id }, error);
    res.status(500).json({
      message: 'Server error occurred during booking creation',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Get all bookings
// @route   GET /api/bookings
// @access  Private (Admin only - or modify for different access levels)
export const getAllBookings = async (req, res) => {
  try {
    const { status, renter_id, owner_id, listing_id, limit, offset } = req.query;

    logger.info('Fetching all bookings', { status, renter_id, owner_id, listing_id });

    const filters = {
      status,
      renter_id,
      owner_id,
      listing_id,
      limit: limit ? parseInt(limit) : 50,
      offset: offset ? parseInt(offset) : 0
    };

    const bookings = await BookingService.getAllBookings(filters);

    logger.success('Bookings fetched successfully', {
      count: bookings.length,
      filters
    });

    res.json({
      bookings,
      count: bookings.length,
      filters
    });
  } catch (error) {
    logger.error('Failed to fetch bookings', null, error);
    res.status(500).json({
      message: 'Server error occurred while fetching bookings',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Get booking by ID
// @route   GET /api/bookings/:id
// @access  Private (renter or owner only)
export const getBookingById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    logger.info('Fetching booking by ID', { booking_id: id, userId });

    const booking = await BookingService.getBookingById(id);

    if (!booking) {
      logger.warning('Booking not found', { booking_id: id, userId });
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if user is renter or owner
    if (booking.renter_id !== userId && booking.owner_id !== userId) {
      logger.warning('Unauthorized booking access attempt', {
        booking_id: id,
        userId,
        renter_id: booking.renter_id,
        owner_id: booking.owner_id
      });
      return res.status(403).json({ message: 'Not authorized to view this booking' });
    }

    logger.success('Booking fetched successfully', {
      booking_id: booking.id,
      userId,
      status: booking.status
    });

    res.json(booking);
  } catch (error) {
    logger.error('Failed to fetch booking', { booking_id: req.params?.id, userId: req.user?.id }, error);
    res.status(500).json({
      message: 'Server error occurred while fetching booking',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Get current user's bookings (as renter)
// @route   GET /api/bookings/my-bookings
// @access  Private
export const getMyBookings = async (req, res) => {
  try {
    const userId = req.user.id;

    logger.info('Fetching user bookings (as renter)', { userId });

    const bookings = await BookingService.getBookingsByRenterId(userId);

    logger.success('User bookings fetched successfully', {
      userId,
      count: bookings.length
    });

    res.json({
      bookings,
      count: bookings.length
    });
  } catch (error) {
    logger.error('Failed to fetch user bookings', { userId: req.user?.id }, error);
    res.status(500).json({
      message: 'Server error occurred while fetching your bookings',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Get current user's bookings (as owner)
// @route   GET /api/bookings/owner-bookings
// @access  Private
export const getOwnerBookings = async (req, res) => {
  try {
    const userId = req.user.id;

    logger.info('Fetching owner bookings', { userId });

    const bookings = await BookingService.getBookingsByOwnerId(userId);

    logger.success('Owner bookings fetched successfully', {
      userId,
      count: bookings.length
    });

    res.json({
      bookings,
      count: bookings.length
    });
  } catch (error) {
    logger.error('Failed to fetch owner bookings', { userId: req.user?.id }, error);
    res.status(500).json({
      message: 'Server error occurred while fetching owner bookings',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Get bookings for a specific listing
// @route   GET /api/bookings/listing/:listingId
// @access  Private (owner only)
export const getListingBookings = async (req, res) => {
  try {
    const { listingId } = req.params;
    const userId = req.user.id;

    logger.info('Fetching listing bookings', { listing_id: listingId, userId });

    // Verify user owns the listing
    const ListingService = (await import('../models/Listing.js')).default;
    const listing = await ListingService.getListingById(listingId);

    if (!listing) {
      logger.warning('Listing not found for bookings', { listing_id: listingId, userId });
      return res.status(404).json({ message: 'Listing not found' });
    }

    if (listing.owner_id !== userId) {
      logger.warning('Unauthorized listing bookings access', {
        listing_id: listingId,
        userId,
        owner_id: listing.owner_id
      });
      return res.status(403).json({ message: 'Not authorized to view bookings for this listing' });
    }

    const bookings = await BookingService.getBookingsByListingId(listingId);

    logger.success('Listing bookings fetched successfully', {
      listing_id: listingId,
      userId,
      count: bookings.length
    });

    res.json({
      bookings,
      count: bookings.length,
      listing: {
        id: listing.id,
        title: listing.title
      }
    });
  } catch (error) {
    logger.error('Failed to fetch listing bookings', {
      listing_id: req.params?.listingId,
      userId: req.user?.id
    }, error);
    res.status(500).json({
      message: 'Server error occurred while fetching listing bookings',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Update booking
// @route   PUT /api/bookings/:id
// @access  Private (renter or owner only)
export const updateBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const updateData = req.body;

    logger.info('Booking update attempt started', { booking_id: id, userId });

    // Validate status if provided
    if (updateData.status) {
      const validStatuses = ['pending', 'confirmed', 'cancelled', 'completed', 'refunded'];
      if (!validStatuses.includes(updateData.status)) {
        logger.warning('Booking update validation failed: invalid status', {
          userId,
          booking_id: id,
          status: updateData.status
        });
        return res.status(400).json({
          message: `Status must be one of: ${validStatuses.join(', ')}`
        });
      }
    }

    // Validate dates if provided
    if (updateData.start_date || updateData.end_date) {
      const booking = await BookingService.getBookingById(id);
      if (!booking) {
        return res.status(404).json({ message: 'Booking not found' });
      }

      const startDate = updateData.start_date ? new Date(updateData.start_date) : new Date(booking.start_date);
      const endDate = updateData.end_date ? new Date(updateData.end_date) : new Date(booking.end_date);

      if (endDate <= startDate) {
        logger.warning('Booking update validation failed: invalid dates', {
          userId,
          booking_id: id,
          start_date: updateData.start_date,
          end_date: updateData.end_date
        });
        return res.status(400).json({
          message: 'End date must be after start date'
        });
      }

      // Check availability for date changes
      if (updateData.start_date || updateData.end_date) {
        const availability = await BookingService.checkAvailability(
          booking.listing_id,
          startDate.toISOString().split('T')[0],
          endDate.toISOString().split('T')[0]
        );

        // Filter out current booking from conflicts
        const otherConflicts = availability.conflicting_bookings.filter(
          conflict => conflict.id !== id
        );

        if (otherConflicts.length > 0) {
          logger.warning('Booking update validation failed: dates conflict', {
            userId,
            booking_id: id,
            conflicts: otherConflicts.length
          });
          return res.status(409).json({
            message: 'Updated dates conflict with existing bookings',
            conflicting_dates: otherConflicts
          });
        }
      }
    }

    const updatedBooking = await BookingService.updateBooking(id, userId, updateData);

    logger.success('Booking updated successfully', {
      booking_id: updatedBooking.id,
      userId,
      status: updatedBooking.status
    });

    res.json(updatedBooking);
  } catch (error) {
    if (error.message === 'Booking not found') {
      logger.warning('Booking not found for update', {
        booking_id: req.params?.id,
        userId: req.user?.id
      });
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (error.message === 'Not authorized to update this booking') {
      logger.warning('Unauthorized booking update attempt', {
        booking_id: req.params?.id,
        userId: req.user?.id
      });
      return res.status(403).json({ message: 'Not authorized to update this booking' });
    }

    logger.error('Booking update failed with exception', {
      booking_id: req.params?.id,
      userId: req.user?.id
    }, error);
    res.status(500).json({
      message: 'Server error occurred during booking update',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Delete booking
// @route   DELETE /api/bookings/:id
// @access  Private (renter or owner only, pending bookings only)
export const deleteBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    logger.info('Booking deletion attempt started', { booking_id: id, userId });

    await BookingService.deleteBooking(id, userId);

    logger.success('Booking deleted successfully', {
      booking_id: id,
      userId
    });

    res.json({ message: 'Booking deleted successfully' });
  } catch (error) {
    if (error.message === 'Booking not found') {
      logger.warning('Booking not found for deletion', {
        booking_id: req.params?.id,
        userId: req.user?.id
      });
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (error.message === 'Not authorized to delete this booking') {
      logger.warning('Unauthorized booking deletion attempt', {
        booking_id: req.params?.id,
        userId: req.user?.id
      });
      return res.status(403).json({ message: 'Not authorized to delete this booking' });
    }

    if (error.message === 'Cannot delete a booking that is not pending') {
      logger.warning('Cannot delete non-pending booking', {
        booking_id: req.params?.id,
        userId: req.user?.id
      });
      return res.status(400).json({ message: 'Cannot delete a booking that is not pending' });
    }

    logger.error('Booking deletion failed with exception', {
      booking_id: req.params?.id,
      userId: req.user?.id
    }, error);
    res.status(500).json({
      message: 'Server error occurred during booking deletion',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Check availability for a listing
// @route   GET /api/bookings/check-availability
// @access  Public
export const checkAvailability = async (req, res) => {
  try {
    const { listing_id, start_date, end_date } = req.query;

    logger.info('Checking availability', { listing_id, start_date, end_date });

    // Validation
    if (!listing_id || !start_date || !end_date) {
      logger.warning('Availability check validation failed: missing parameters', {
        hasListingId: !!listing_id,
        hasStartDate: !!start_date,
        hasEndDate: !!end_date
      });
      return res.status(400).json({
        message: 'Please provide listing_id, start_date, and end_date'
      });
    }

    // Validate dates
    const startDate = new Date(start_date);
    const endDate = new Date(end_date);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      logger.warning('Availability check validation failed: invalid date format', {
        start_date,
        end_date
      });
      return res.status(400).json({
        message: 'Please provide valid dates in ISO format'
      });
    }

    if (endDate <= startDate) {
      logger.warning('Availability check validation failed: invalid date range', {
        start_date,
        end_date
      });
      return res.status(400).json({
        message: 'End date must be after start date'
      });
    }

    const availability = await BookingService.checkAvailability(listing_id, start_date, end_date);

    logger.success('Availability checked successfully', {
      listing_id,
      available: availability.available,
      conflicting_bookings: availability.conflicting_bookings.length
    });

    res.json({
      listing_id,
      start_date,
      end_date,
      available: availability.available,
      conflicting_bookings: availability.conflicting_bookings
    });
  } catch (error) {
    logger.error('Availability check failed with exception', {
      listing_id: req.query?.listing_id
    }, error);
    res.status(500).json({
      message: 'Server error occurred while checking availability',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
