import ListingService from '../models/Listing.js';
import { logger } from '../utils/logger.js';

// @desc    Create a new listing
// @route   POST /api/listings
// @access  Private
export const createListing = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      title,
      vehicle_type,
      location,
      year,
      description,
      make,
      model,
      sleeps,
      length,
      amenities,
      daily_rate,
      minimum_rental_period,
      images,
      status
    } = req.body;

    logger.info('Listing creation attempt started', { userId, title });

    // Validation
    if (!title || !vehicle_type || !location || !year || !description || !daily_rate) {
      logger.warning('Listing validation failed: missing required fields', {
        userId,
        hasTitle: !!title,
        hasVehicleType: !!vehicle_type,
        hasLocation: !!location,
        hasYear: !!year,
        hasDescription: !!description,
        hasDailyRate: !!daily_rate
      });
      return res.status(400).json({
        message: 'Please provide all required fields: title, vehicle_type, location, year, description, and daily_rate'
      });
    }

    // Validate vehicle_type
    const validVehicleTypes = ['Campervan', 'Motorhome', 'Caravan', 'RV', 'Other'];
    if (!validVehicleTypes.includes(vehicle_type)) {
      logger.warning('Listing validation failed: invalid vehicle type', { userId, vehicle_type });
      return res.status(400).json({
        message: `Vehicle type must be one of: ${validVehicleTypes.join(', ')}`
      });
    }

    // Validate year
    const currentYear = new Date().getFullYear();
    if (year < 1900 || year > currentYear + 1) {
      logger.warning('Listing validation failed: invalid year', { userId, year });
      return res.status(400).json({
        message: `Year must be between 1900 and ${currentYear + 1}`
      });
    }

    // Validate daily_rate
    if (daily_rate <= 0 || daily_rate > 10000) {
      logger.warning('Listing validation failed: invalid daily rate', { userId, daily_rate });
      return res.status(400).json({
        message: 'Daily rate must be between 1 and 10000'
      });
    }

    // Create listing
    const listing = await ListingService.createListing({
      user_id: userId,
      title,
      vehicle_type,
      location,
      year,
      description,
      make,
      model,
      sleeps,
      length,
      amenities: Array.isArray(amenities) ? amenities : [],
      daily_rate,
      minimum_rental_period,
      images: Array.isArray(images) ? images : [],
      status: status || 'draft'
    });

    logger.success('Listing created successfully', {
      listing_id: listing.id,
      userId,
      title: listing.title
    });

    res.status(201).json(listing);
  } catch (error) {
    logger.error('Listing creation failed with exception', { userId: req.user?.id }, error);
    res.status(500).json({
      message: 'Server error occurred during listing creation',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Get all listings
// @route   GET /api/listings
// @access  Public
export const getAllListings = async (req, res) => {
  try {
    const { status, vehicle_type, location, limit, offset } = req.query;

    logger.info('Fetching all listings', { status, vehicle_type, location });

    const filters = {
      status: status || 'published', // Default to published listings
      vehicle_type,
      location,
      limit: limit ? parseInt(limit) : 50,
      offset: offset ? parseInt(offset) : 0
    };

    const listings = await ListingService.getAllListings(filters);

    logger.success('Listings fetched successfully', {
      count: listings.length,
      filters
    });

    res.json({
      listings,
      count: listings.length,
      filters
    });
  } catch (error) {
    logger.error('Failed to fetch listings', null, error);
    res.status(500).json({
      message: 'Server error occurred while fetching listings',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Get listing by ID
// @route   GET /api/listings/:id
// @access  Public
export const getListingById = async (req, res) => {
  try {
    const { id } = req.params;

    logger.info('Fetching listing by ID', { listing_id: id });

    const listing = await ListingService.getListingById(id);

    if (!listing) {
      logger.warning('Listing not found', { listing_id: id });
      return res.status(404).json({ message: 'Listing not found' });
    }

    logger.success('Listing fetched successfully', {
      listing_id: listing.id,
      title: listing.title
    });

    res.json(listing);
  } catch (error) {
    logger.error('Failed to fetch listing', { listing_id: req.params?.id }, error);
    res.status(500).json({
      message: 'Server error occurred while fetching listing',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Get current user's listings
// @route   GET /api/listings/my-listings
// @access  Private
export const getMyListings = async (req, res) => {
  try {
    const userId = req.user.id;

    logger.info('Fetching user listings', { userId });

    const listings = await ListingService.getListingsByUserId(userId);

    logger.success('User listings fetched successfully', {
      userId,
      count: listings.length
    });

    res.json({
      listings,
      count: listings.length
    });
  } catch (error) {
    logger.error('Failed to fetch user listings', { userId: req.user?.id }, error);
    res.status(500).json({
      message: 'Server error occurred while fetching your listings',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Update listing
// @route   PUT /api/listings/:id
// @access  Private
export const updateListing = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const updateData = req.body;

    logger.info('Listing update attempt started', { listing_id: id, userId });

    // Validate vehicle_type if provided
    if (updateData.vehicle_type) {
      const validVehicleTypes = ['Campervan', 'Motorhome', 'Caravan', 'RV', 'Other'];
      if (!validVehicleTypes.includes(updateData.vehicle_type)) {
        logger.warning('Listing update validation failed: invalid vehicle type', {
          userId,
          listing_id: id,
          vehicle_type: updateData.vehicle_type
        });
        return res.status(400).json({
          message: `Vehicle type must be one of: ${validVehicleTypes.join(', ')}`
        });
      }
    }

    // Validate year if provided
    if (updateData.year) {
      const currentYear = new Date().getFullYear();
      if (updateData.year < 1900 || updateData.year > currentYear + 1) {
        logger.warning('Listing update validation failed: invalid year', {
          userId,
          listing_id: id,
          year: updateData.year
        });
        return res.status(400).json({
          message: `Year must be between 1900 and ${currentYear + 1}`
        });
      }
    }

    // Validate daily_rate if provided
    if (updateData.daily_rate !== undefined) {
      if (updateData.daily_rate <= 0 || updateData.daily_rate > 10000) {
        logger.warning('Listing update validation failed: invalid daily rate', {
          userId,
          listing_id: id,
          daily_rate: updateData.daily_rate
        });
        return res.status(400).json({
          message: 'Daily rate must be between 1 and 10000'
        });
      }
    }

    // Ensure arrays are arrays
    if (updateData.amenities && !Array.isArray(updateData.amenities)) {
      updateData.amenities = [];
    }
    if (updateData.images && !Array.isArray(updateData.images)) {
      updateData.images = [];
    }

    const updatedListing = await ListingService.updateListing(id, userId, updateData);

    logger.success('Listing updated successfully', {
      listing_id: updatedListing.id,
      userId,
      title: updatedListing.title
    });

    res.json(updatedListing);
  } catch (error) {
    if (error.message === 'Listing not found') {
      logger.warning('Listing not found for update', {
        listing_id: req.params?.id,
        userId: req.user?.id
      });
      return res.status(404).json({ message: 'Listing not found' });
    }

    if (error.message === 'Not authorized to update this listing') {
      logger.warning('Unauthorized listing update attempt', {
        listing_id: req.params?.id,
        userId: req.user?.id
      });
      return res.status(403).json({ message: 'Not authorized to update this listing' });
    }

    logger.error('Listing update failed with exception', {
      listing_id: req.params?.id,
      userId: req.user?.id
    }, error);
    res.status(500).json({
      message: 'Server error occurred during listing update',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Delete listing
// @route   DELETE /api/listings/:id
// @access  Private
export const deleteListing = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    logger.info('Listing deletion attempt started', { listing_id: id, userId });

    await ListingService.deleteListing(id, userId);

    logger.success('Listing deleted successfully', {
      listing_id: id,
      userId
    });

    res.json({ message: 'Listing deleted successfully' });
  } catch (error) {
    if (error.message === 'Listing not found') {
      logger.warning('Listing not found for deletion', {
        listing_id: req.params?.id,
        userId: req.user?.id
      });
      return res.status(404).json({ message: 'Listing not found' });
    }

    if (error.message === 'Not authorized to delete this listing') {
      logger.warning('Unauthorized listing deletion attempt', {
        listing_id: req.params?.id,
        userId: req.user?.id
      });
      return res.status(403).json({ message: 'Not authorized to delete this listing' });
    }

    logger.error('Listing deletion failed with exception', {
      listing_id: req.params?.id,
      userId: req.user?.id
    }, error);
    res.status(500).json({
      message: 'Server error occurred during listing deletion',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
