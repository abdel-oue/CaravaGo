import mongoose from 'mongoose';
import { dbLogger } from '../utils/logger.js';

// Vehicle Type Schema
const vehicleTypeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  description: {
    type: String,
    default: null
  },
  icon_url: {
    type: String,
    default: null
  }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: false }
});

// Amenity Schema
const amenitySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  icon_url: {
    type: String,
    default: null
  },
  category: {
    type: String,
    enum: ['kitchen', 'bathroom', 'comfort', 'technology', 'entertainment', 'exterior', 'safety', 'other'],
    default: 'other'
  }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: false }
});

// Listing Photo Schema (embedded in Listing)
const listingPhotoSchema = new mongoose.Schema({
  photo_url: {
    type: String,
    required: true
  },
  alt_text: {
    type: String,
    default: null
  },
  is_primary: {
    type: Boolean,
    default: false
  },
  sort_order: {
    type: Number,
    default: 0
  }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: false },
  _id: true
});

// Listing Schema
const listingSchema = new mongoose.Schema({
  owner_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 255
  },
  description: {
    type: String,
    required: true
  },
  vehicle_type_id: {
    type: Number,
    required: true
  },
  make: {
    type: String,
    default: null,
    maxlength: 100
  },
  model: {
    type: String,
    default: null,
    maxlength: 100
  },
  year: {
    type: Number,
    required: true,
    min: 1900,
    max: new Date().getFullYear() + 1
  },
  sleeps: {
    type: Number,
    default: null,
    min: 1
  },
  length_meters: {
    type: Number,
    default: null,
    min: 0,
    max: 99.99
  },
  location_city: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  location_country: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  latitude: {
    type: Number,
    default: null,
    min: -90,
    max: 90
  },
  longitude: {
    type: Number,
    default: null,
    min: -180,
    max: 180
  },
  daily_rate: {
    type: Number,
    required: true,
    min: 0.01
  },
  currency: {
    type: String,
    default: 'EUR',
    maxlength: 3
  },
  min_rental_days: {
    type: Number,
    default: 1,
    min: 1
  },
  max_rental_days: {
    type: Number,
    default: 90,
    min: 1
  },
  status: {
    type: String,
    enum: ['draft', 'pending', 'active', 'inactive', 'suspended'],
    default: 'pending'
  },
  is_featured: {
    type: Boolean,
    default: false
  },
  amenity_ids: [{
  type: mongoose.Schema.Types.ObjectId,  // ← ObjectIds
}],
  photos: [listingPhotoSchema]
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

// Indexes for performance
listingSchema.index({ owner_id: 1 });
listingSchema.index({ status: 1 });
listingSchema.index({ vehicle_type_id: 1 });
listingSchema.index({ location_city: 1, location_country: 1 });
listingSchema.index({ daily_rate: 1 });
listingSchema.index({ created_at: -1 });
listingSchema.index({ latitude: 1, longitude: 1 });

// Virtual for id to return _id as id for frontend compatibility
listingSchema.virtual('id').get(function() {
  return this._id.toHexString();
});

// Ensure virtual fields are serialized
listingSchema.set('toJSON', {
  virtuals: true,
  transform: function(doc, ret) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

// Create models
const VehicleType = mongoose.model('vehicle_types', vehicleTypeSchema);
const Amenity = mongoose.model('amenities', amenitySchema);
const Listing = mongoose.model('listings', listingSchema);

class ListingService {
  // Create a new listing
  static async createListing(listingData) {
    try {
      const {
        owner_id,
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
        currency = 'EUR',
        min_rental_days = 1,
        max_rental_days = 90,
        status = 'pending',
        is_featured = false,
        amenity_ids = [],
        photos = []
      } = listingData;

      dbLogger.info('Creating new listing', { owner_id, title });

      // Convert owner_id to ObjectId if it's a string
      const ownerObjectId = typeof owner_id === 'string' 
        ? new mongoose.Types.ObjectId(owner_id) 
        : owner_id;

      // Convert vehicle_type_id to ObjectId if provided and is a string
      const vehicleTypeObjectId = vehicle_type_id && typeof vehicle_type_id === 'string'
        ? new mongoose.Types.ObjectId(vehicle_type_id)
        : vehicle_type_id;

      // Convert amenity_ids to ObjectIds if they're strings
      const amenityObjectIds = Array.isArray(amenity_ids)
        ? amenity_ids.map(id => typeof id === 'string' ? new mongoose.Types.ObjectId(id) : id)
        : [];

      // Prepare photos array
      const photosArray = photos.map((photo, index) => ({
        photo_url: photo.url || photo,
        alt_text: photo.alt_text || photo.alt || `Listing photo ${index + 1}`,
        is_primary: photo.is_primary || index === 0,
        sort_order: photo.sort_order || index
      }));

      // Create listing
      const listing = new Listing({
        owner_id: ownerObjectId,
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
        amenity_ids: amenityObjectIds,
        photos: photosArray
      });

      const savedListing = await listing.save();

      // Populate relations for response
      const completeListing = await Listing.findById(savedListing._id)
        .populate('owner_id', 'name email avatar_url')
        .populate('vehicle_type_id', 'name description icon_url')
        .populate('amenity_ids', 'name category icon_url')
        .lean();

      dbLogger.success('Listing created successfully', {
        listing_id: savedListing._id.toString(),
        owner_id: owner_id.toString(),
        title: savedListing.title
      });

      // Convert to JSON format with id
      return {
        ...completeListing,
        id: completeListing._id.toString(),
        owner_id: completeListing.owner_id?._id?.toString() || completeListing.owner_id,
        vehicle_type_id: completeListing.vehicle_type_id?._id?.toString() || completeListing.vehicle_type_id
      };
    } catch (error) {
      dbLogger.error('Listing creation failed', { owner_id: listingData?.owner_id }, error);
      throw error;
    }
  }

  // Get all listings with optional filters
  static async getAllListings(filters = {}) {
    try {
      const { status, vehicle_type_id, location_city, location_country, limit = 50, offset = 0 } = filters;

      dbLogger.info('Fetching listings', { filters });

      let query = Listing.find();

      // Apply filters
      if (status) {
        query = query.where('status').equals(status);
      } else {
        // Default to active listings for public access
        query = query.where('status').equals('active');
      }

      if (vehicle_type_id) {
        query = query.where('vehicle_type_id').equals(vehicle_type_id);
      }

      if (location_city) {
        query = query.where('location_city').regex(new RegExp(location_city, 'i'));
      }

      if (location_country) {
        query = query.where('location_country').regex(new RegExp(location_country, 'i'));
      }

      // Populate relations
      query = query
        .populate('owner_id', 'name email avatar_url')
        .populate('vehicle_type_id', 'name description icon_url')
        .populate('amenity_ids', 'name category icon_url')
        .sort({ created_at: -1 })
        .limit(parseInt(limit))
        .skip(parseInt(offset))
        .lean();

      const data = await query;

      dbLogger.success('Listings fetched successfully', {
        count: data?.length || 0,
        filters
      });

      // Transform to include id field
      return data.map(listing => ({
        ...listing,
        id: listing._id.toString(),
        owner_id: listing.owner_id?._id?.toString() || listing.owner_id,
        vehicle_type_id: listing.vehicle_type_id?._id?.toString() || listing.vehicle_type_id
      }));
    } catch (error) {
      dbLogger.error('Failed to fetch listings', { filters }, error);
      throw error;
    }
  }

  // Get listing by ID with relations
  static async getListingById(id) {
    try {
      dbLogger.info('Fetching listing by ID', { listing_id: id });

      const listing = await Listing.findById(id)
        .populate('owner_id', 'name email avatar_url')
        .populate('vehicle_type_id', 'name description icon_url')
        .populate('amenity_ids', 'id name category icon_url')
        .lean();

      if (!listing) {
        dbLogger.warning('Listing not found', { listing_id: id });
        return null;
      }

      dbLogger.success('Listing fetched successfully', {
        listing_id: listing._id.toString(),
        title: listing.title
      });

      // Transform to include id field
      return {
        ...listing,
        id: listing._id.toString(),
        owner_id: listing.owner_id?._id?.toString() || listing.owner_id,
        vehicle_type_id: listing.vehicle_type_id?._id?.toString() || listing.vehicle_type_id
      };
    } catch (error) {
      dbLogger.error('Failed to fetch listing', { listing_id: id }, error);
      throw error;
    }
  }

  // Get listings by owner ID
  static async getListingsByOwnerId(ownerId) {
    try {
      dbLogger.info('Fetching listings by owner ID', { owner_id: ownerId });

      // Convert ownerId to ObjectId if it's a string
      const ownerObjectId = typeof ownerId === 'string' 
        ? new mongoose.Types.ObjectId(ownerId) 
        : ownerId;

      const listings = await Listing.find({ owner_id: ownerObjectId })
        .populate('owner_id', 'name email avatar_url')
        .populate('vehicle_type_id', 'name description icon_url')
        .populate('amenity_ids', 'name category icon_url')
        .sort({ created_at: -1 })
        .lean();

      dbLogger.success('Owner listings fetched successfully', {
        owner_id: ownerId,
        count: listings?.length || 0
      });

      // Transform to include id field
      return listings.map(listing => ({
        ...listing,
        id: listing._id.toString(),
        owner_id: listing.owner_id?._id?.toString() || listing.owner_id,
        vehicle_type_id: listing.vehicle_type_id?._id?.toString() || listing.vehicle_type_id
      }));
    } catch (error) {
      dbLogger.error('Failed to fetch owner listings', { owner_id: ownerId }, error);
      throw error;
    }
  }

  // Update listing
  static async updateListing(id, ownerId, updateData) {
    try {
      dbLogger.info('Updating listing', { listing_id: id, owner_id: ownerId });

      // Convert ownerId to ObjectId if it's a string
      const ownerObjectId = typeof ownerId === 'string' 
        ? new mongoose.Types.ObjectId(ownerId) 
        : ownerId;

      // First verify the listing belongs to the owner
      const existingListing = await Listing.findById(id);
      if (!existingListing) {
        throw new Error('Listing not found');
      }

      if (existingListing.owner_id.toString() !== ownerObjectId.toString()) {
        dbLogger.warning('Unauthorized listing update attempt', {
          listing_id: id,
          owner_id: existingListing.owner_id.toString(),
          requester_id: ownerId
        });
        throw new Error('Not authorized to update this listing');
      }

      // Separate amenities and photos from other update data
      const { amenity_ids, photos, vehicle_type_id, ...listingUpdateData } = updateData;

      // Prepare update data (remove undefined values)
      const updatePayload = Object.fromEntries(
        Object.entries(listingUpdateData).filter(([_, v]) => v !== undefined)
      );

      // Convert vehicle_type_id to ObjectId if provided
      if (vehicle_type_id !== undefined) {
        updatePayload.vehicle_type_id = vehicle_type_id && typeof vehicle_type_id === 'string'
          ? new mongoose.Types.ObjectId(vehicle_type_id)
          : vehicle_type_id;
      }

      // Handle photos if provided
      if (photos !== undefined) {
        if (Array.isArray(photos) && photos.length > 0) {
          updatePayload.photos = photos.map((photo, index) => ({
            photo_url: photo.url || photo,
            alt_text: photo.alt_text || photo.alt || `Listing photo ${index + 1}`,
            is_primary: photo.is_primary || index === 0,
            sort_order: photo.sort_order || index
          }));
        } else {
          updatePayload.photos = [];
        }
      }

      // Handle amenity_ids if provided
      if (amenity_ids !== undefined) {
        updatePayload.amenity_ids = Array.isArray(amenity_ids)
          ? amenity_ids.map(id => typeof id === 'string' ? new mongoose.Types.ObjectId(id) : id)
          : [];
      }

      // Update listing
      const updatedListing = await Listing.findByIdAndUpdate(
        id,
        { $set: updatePayload },
        { new: true, runValidators: true }
      )
        .populate('owner_id', 'name email avatar_url')
        .populate('vehicle_type_id', 'name description icon_url')
        .populate('amenity_ids', 'name category icon_url')
        .lean();

      if (!updatedListing) {
        throw new Error('Listing not found');
      }

      dbLogger.success('Listing updated successfully', {
        listing_id: updatedListing._id.toString(),
        title: updatedListing.title
      });

      // Transform to include id field
      return {
        ...updatedListing,
        id: updatedListing._id.toString(),
        owner_id: updatedListing.owner_id?._id?.toString() || updatedListing.owner_id,
        vehicle_type_id: updatedListing.vehicle_type_id?._id?.toString() || updatedListing.vehicle_type_id
      };
    } catch (error) {
      dbLogger.error('Listing update failed', { listing_id: id, owner_id: ownerId }, error);
      throw error;
    }
  }

  // Delete listing
  static async deleteListing(id, ownerId) {
    try {
      dbLogger.info('Deleting listing', { listing_id: id, owner_id: ownerId });

      // Convert ownerId to ObjectId if it's a string
      const ownerObjectId = typeof ownerId === 'string' 
        ? new mongoose.Types.ObjectId(ownerId) 
        : ownerId;

      // First verify the listing belongs to the owner
      const existingListing = await Listing.findById(id);
      if (!existingListing) {
        throw new Error('Listing not found');
      }

      if (existingListing.owner_id.toString() !== ownerObjectId.toString()) {
        dbLogger.warning('Unauthorized listing deletion attempt', {
          listing_id: id,
          owner_id: existingListing.owner_id.toString(),
          requester_id: ownerId
        });
        throw new Error('Not authorized to delete this listing');
      }

      // Delete listing (photos and amenities are embedded/referenced, so they'll be handled automatically)
      await Listing.findByIdAndDelete(id);

      dbLogger.success('Listing deleted successfully', {
        listing_id: id,
        owner_id: ownerId
      });

      return true;
    } catch (error) {
      dbLogger.error('Listing deletion failed', { listing_id: id, owner_id: ownerId }, error);
      throw error;
    }
  }

  // Get all vehicle types
  static async getVehicleTypes() {
    try {
      dbLogger.info('Fetching vehicle types');

      const data = await VehicleType.find()
        .sort({ name: 1 })
        .lean();

      dbLogger.success('Vehicle types fetched successfully', {
        count: data?.length || 0
      });

      return data.map(vt => ({
        ...vt,
        id: vt._id.toString()
      }));
    } catch (error) {
      dbLogger.error('Failed to fetch vehicle types', null, error);
      throw error;
    }
  }

  // Get all amenities
  static async getAmenities() {
    try {
      dbLogger.info('Fetching amenities');

      const data = await Amenity.find()
        .sort({ category: 1, name: 1 })
        .lean();

      dbLogger.success('Amenities fetched successfully', {
        count: data?.length || 0
      });

      return data.map(amenity => ({
        ...amenity,
        id: amenity._id.toString()
      }));
    } catch (error) {
      dbLogger.error('Failed to fetch amenities', null, error);
      throw error;
    }
  }
}

export default ListingService;
export { Listing, VehicleType, Amenity };