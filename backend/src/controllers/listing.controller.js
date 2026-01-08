import ListingService from '../models/Listing.js';
import { logger } from '../utils/logger.js';

// @desc    Create a new listing
// @route   POST /api/listings
// @access  Private
export const createListing = async (req, res) => {
  try {
    const ownerId = req.user.id;
    const {
      title,
      description,
      vehicle_type_id,
      make,
      model,
      year,
      sleeps,
      length_meters,
      location_city,
      location_country,
      latitude,
      longitude,
      daily_rate,
      currency,
      min_rental_days,
      max_rental_days,
      status,
      is_featured,
      amenity_ids,
      photos
    } = req.body;

    logger.info('Listing creation attempt started', { ownerId, title });

    // Validation - Required fields
    if (!title || !description || !vehicle_type_id || !location_city || !location_country || !year || !daily_rate) {
      logger.warning('Listing validation failed: missing required fields', {
        ownerId,
        hasTitle: !!title,
        hasDescription: !!description,
        hasVehicleTypeId: !!vehicle_type_id,
        hasLocationCity: !!location_city,
        hasLocationCountry: !!location_country,
        hasYear: !!year,
        hasDailyRate: !!daily_rate
      });
      return res.status(400).json({
        message: 'Please provide all required fields: title, description, vehicle_type_id, location_city, location_country, year, and daily_rate'
      });
    }

    // Validate year
    const currentYear = new Date().getFullYear();
    if (year < 1900 || year > currentYear + 1) {
      logger.warning('Listing validation failed: invalid year', { ownerId, year });
      return res.status(400).json({
        message: `Year must be between 1900 and ${currentYear + 1}`
      });
    }

    // Validate daily_rate
    if (daily_rate <= 0 || daily_rate > 10000) {
      logger.warning('Listing validation failed: invalid daily rate', { ownerId, daily_rate });
      return res.status(400).json({
        message: 'Daily rate must be between 1 and 10000'
      });
    }

    // Validate sleeps if provided
    if (sleeps !== undefined && sleeps <= 0) {
      logger.warning('Listing validation failed: invalid sleeps', { ownerId, sleeps });
      return res.status(400).json({
        message: 'Sleeps must be greater than 0'
      });
    }

    // Validate min_rental_days if provided
    if (min_rental_days !== undefined && min_rental_days <= 0) {
      logger.warning('Listing validation failed: invalid min_rental_days', { ownerId, min_rental_days });
      return res.status(400).json({
        message: 'Minimum rental days must be greater than 0'
      });
    }

    // Validate max_rental_days if provided
    if (max_rental_days !== undefined && max_rental_days <= 0) {
      logger.warning('Listing validation failed: invalid max_rental_days', { ownerId, max_rental_days });
      return res.status(400).json({
        message: 'Maximum rental days must be greater than 0'
      });
    }

    // Validate min_rental_days <= max_rental_days
    if (min_rental_days && max_rental_days && min_rental_days > max_rental_days) {
      logger.warning('Listing validation failed: min_rental_days > max_rental_days', {
        ownerId,
        min_rental_days,
        max_rental_days
      });
      return res.status(400).json({
        message: 'Minimum rental days cannot be greater than maximum rental days'
      });
    }

    // Validate status if provided
    const validStatuses = ['draft', 'pending', 'active', 'inactive', 'suspended'];
    if (status && !validStatuses.includes(status)) {
      logger.warning('Listing validation failed: invalid status', { ownerId, status });
      return res.status(400).json({
        message: `Status must be one of: ${validStatuses.join(', ')}`
      });
    }

    // Validate currency if provided
    if (currency && currency.length !== 3) {
      logger.warning('Listing validation failed: invalid currency', { ownerId, currency });
      return res.status(400).json({
        message: 'Currency must be a 3-letter code (e.g., EUR, USD)'
      });
    }

    // Create listing
    const listing = await ListingService.createListing({
      owner_id: ownerId,
      title,
      description,
      vehicle_type_id,
      make,
      model,
      year,
      sleeps,
      length_meters,
      location_city,
      location_country,
      latitude,
      longitude,
      daily_rate,
      currency: currency || 'EUR',
      min_rental_days: min_rental_days || 1,
      max_rental_days: max_rental_days || 90,
      status: status || 'pending',
      is_featured: is_featured || false,
      amenity_ids: Array.isArray(amenity_ids) ? amenity_ids : [],
      photos: Array.isArray(photos) ? photos : []
    });

    logger.success('Listing created successfully', {
      listing_id: listing.id,
      ownerId,
      title: listing.title
    });

    res.status(201).json(listing);
  } catch (error) {
    logger.error('Listing creation failed with exception', { ownerId: req.user?.id }, error);
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
    const { status, vehicle_type_id, location_city, location_country, limit, offset } = req.query;

    logger.info('Fetching all listings', { status, vehicle_type_id, location_city, location_country });

    const filters = {
      status: status || 'active', // Default to active listings
      vehicle_type_id: vehicle_type_id ? parseInt(vehicle_type_id) : undefined,
      location_city,
      location_country,
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
    const ownerId = req.user.id;

    logger.info('Fetching user listings', { ownerId });

    const listings = await ListingService.getListingsByOwnerId(ownerId);

    logger.success('User listings fetched successfully', {
      ownerId,
      count: listings.length
    });

    res.json({
      listings,
      count: listings.length
    });
  } catch (error) {
    logger.error('Failed to fetch user listings', { ownerId: req.user?.id }, error);
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
    const ownerId = req.user.id;
    const updateData = req.body;

    logger.info('Listing update attempt started', { listing_id: id, ownerId });

    // Validate year if provided
    if (updateData.year !== undefined) {
      const currentYear = new Date().getFullYear();
      if (updateData.year < 1900 || updateData.year > currentYear + 1) {
        logger.warning('Listing update validation failed: invalid year', {
          ownerId,
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
          ownerId,
          listing_id: id,
          daily_rate: updateData.daily_rate
        });
        return res.status(400).json({
          message: 'Daily rate must be between 1 and 10000'
        });
      }
    }

    // Validate sleeps if provided
    if (updateData.sleeps !== undefined && updateData.sleeps <= 0) {
      logger.warning('Listing update validation failed: invalid sleeps', {
        ownerId,
        listing_id: id,
        sleeps: updateData.sleeps
      });
      return res.status(400).json({
        message: 'Sleeps must be greater than 0'
      });
    }

    // Validate min_rental_days if provided
    if (updateData.min_rental_days !== undefined && updateData.min_rental_days <= 0) {
      logger.warning('Listing update validation failed: invalid min_rental_days', {
        ownerId,
        listing_id: id,
        min_rental_days: updateData.min_rental_days
      });
      return res.status(400).json({
        message: 'Minimum rental days must be greater than 0'
      });
    }

    // Validate max_rental_days if provided
    if (updateData.max_rental_days !== undefined && updateData.max_rental_days <= 0) {
      logger.warning('Listing update validation failed: invalid max_rental_days', {
        ownerId,
        listing_id: id,
        max_rental_days: updateData.max_rental_days
      });
      return res.status(400).json({
        message: 'Maximum rental days must be greater than 0'
      });
    }

    // Validate min_rental_days <= max_rental_days
    if (updateData.min_rental_days && updateData.max_rental_days &&
        updateData.min_rental_days > updateData.max_rental_days) {
      logger.warning('Listing update validation failed: min_rental_days > max_rental_days', {
        ownerId,
        listing_id: id,
        min_rental_days: updateData.min_rental_days,
        max_rental_days: updateData.max_rental_days
      });
      return res.status(400).json({
        message: 'Minimum rental days cannot be greater than maximum rental days'
      });
    }

    // Validate status if provided
    if (updateData.status) {
      const validStatuses = ['draft', 'pending', 'active', 'inactive', 'suspended'];
      if (!validStatuses.includes(updateData.status)) {
        logger.warning('Listing update validation failed: invalid status', {
          ownerId,
          listing_id: id,
          status: updateData.status
        });
        return res.status(400).json({
          message: `Status must be one of: ${validStatuses.join(', ')}`
        });
      }
    }

    // Validate currency if provided
    if (updateData.currency && updateData.currency.length !== 3) {
      logger.warning('Listing update validation failed: invalid currency', {
        ownerId,
        listing_id: id,
        currency: updateData.currency
      });
      return res.status(400).json({
        message: 'Currency must be a 3-letter code (e.g., EUR, USD)'
      });
    }

    // Ensure arrays are arrays
    if (updateData.amenity_ids !== undefined && !Array.isArray(updateData.amenity_ids)) {
      updateData.amenity_ids = [];
    }
    if (updateData.photos !== undefined && !Array.isArray(updateData.photos)) {
      updateData.photos = [];
    }

    const updatedListing = await ListingService.updateListing(id, ownerId, updateData);

    logger.success('Listing updated successfully', {
      listing_id: updatedListing.id,
      ownerId,
      title: updatedListing.title
    });

    res.json(updatedListing);
  } catch (error) {
    if (error.message === 'Listing not found') {
      logger.warning('Listing not found for update', {
        listing_id: req.params?.id,
        ownerId: req.user?.id
      });
      return res.status(404).json({ message: 'Listing not found' });
    }

    if (error.message === 'Not authorized to update this listing') {
      logger.warning('Unauthorized listing update attempt', {
        listing_id: req.params?.id,
        ownerId: req.user?.id
      });
      return res.status(403).json({ message: 'Not authorized to update this listing' });
    }

    logger.error('Listing update failed with exception', {
      listing_id: req.params?.id,
      ownerId: req.user?.id
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
    const ownerId = req.user.id;

    logger.info('Listing deletion attempt started', { listing_id: id, ownerId });

    await ListingService.deleteListing(id, ownerId);

    logger.success('Listing deleted successfully', {
      listing_id: id,
      ownerId
    });

    res.json({ message: 'Listing deleted successfully' });
  } catch (error) {
    if (error.message === 'Listing not found') {
      logger.warning('Listing not found for deletion', {
        listing_id: req.params?.id,
        ownerId: req.user?.id
      });
      return res.status(404).json({ message: 'Listing not found' });
    }

    if (error.message === 'Not authorized to delete this listing') {
      logger.warning('Unauthorized listing deletion attempt', {
        listing_id: req.params?.id,
        ownerId: req.user?.id
      });
      return res.status(403).json({ message: 'Not authorized to delete this listing' });
    }

    logger.error('Listing deletion failed with exception', {
      listing_id: req.params?.id,
      ownerId: req.user?.id
    }, error);
    res.status(500).json({
      message: 'Server error occurred during listing deletion',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Get all vehicle types
// @route   GET /api/listings/vehicle-types
// @access  Public
export const getVehicleTypes = async (req, res) => {
  try {
    logger.info('Fetching vehicle types');

    const vehicleTypes = await ListingService.getVehicleTypes();

    logger.success('Vehicle types fetched successfully', {
      count: vehicleTypes.length
    });

    res.json({
      vehicle_types: vehicleTypes,
      count: vehicleTypes.length
    });
  } catch (error) {
    logger.error('Failed to fetch vehicle types', null, error);
    res.status(500).json({
      message: 'Server error occurred while fetching vehicle types',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Get all amenities
// @route   GET /api/listings/amenities
// @access  Public
export const getAmenities = async (req, res) => {
  try {
    logger.info('Fetching amenities');

    const amenities = await ListingService.getAmenities();

    logger.success('Amenities fetched successfully', {
      count: amenities.length
    });

    res.json({
      amenities: amenities,
      count: amenities.length
    });
  } catch (error) {
    logger.error('Failed to fetch amenities', null, error);
    res.status(500).json({
      message: 'Server error occurred while fetching amenities',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
