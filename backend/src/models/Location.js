import mongoose from 'mongoose';
import { dbLogger } from '../utils/logger.js';

// Location Schema
const locationSchema = new mongoose.Schema({
  city: {
    type: String,
    required: true,
    trim: true
  },
  region: {
    type: String,
    trim: true
  },
  country: {
    type: String,
    required: true,
    trim: true
  },
  country_code: {
    type: String,
    maxlength: 3,
    uppercase: true
  },
  latitude: {
    type: Number,
    min: -90,
    max: 90
  },
  longitude: {
    type: Number,
    min: -180,
    max: 180
  },
  timezone: {
    type: String,
    trim: true
  },
  is_popular: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true // This creates createdAt and updatedAt automatically
});

// Indexes for better query performance
locationSchema.index({ city: 1, country: 1 }, { unique: true }); // Unique constraint
locationSchema.index({ country: 1 });
locationSchema.index({ region: 1 });
locationSchema.index({ is_popular: 1 });
locationSchema.index({ latitude: 1, longitude: 1 }); // For geospatial queries

// Virtual for id to return _id as id for frontend compatibility
locationSchema.virtual('id').get(function() {
  return this._id.toHexString();
});

// Ensure virtual fields are serialised
locationSchema.set('toJSON', {
  virtuals: true,
});

// Create the model
const Location = mongoose.model('locations', locationSchema);

class LocationService {
  // Get location by ID
  static async getLocationById(id) {
    try {
      const location = await Location.findById(id);

      if (!location) {
        dbLogger.warning('Location not found', { location_id: id });
        return null;
      }

      dbLogger.success('Location retrieved by ID', {
        location_id: location._id,
        city: location.city
      });

      return location;
    } catch (error) {
      dbLogger.error('Failed to get location by ID', { location_id: id }, error);
      throw error;
    }
  }

  // Get many locations with optional filters
  static async getLocations(filters = {}, options = {}) {
    try {
      const {
        country,
        region,
        is_popular,
        search,
        limit = 50,
        offset = 0,
        sort = { createdAt: -1 }
      } = filters;

      dbLogger.info('Fetching locations', { filters, options });

      let query = {};

      // Apply filters
      if (country) {
        query.country = new RegExp(country, 'i');
      }

      if (region) {
        query.region = new RegExp(region, 'i');
      }

      if (typeof is_popular === 'boolean') {
        query.is_popular = is_popular;
      }

      // Search in city or country
      if (search) {
        query.$or = [
          { city: new RegExp(search, 'i') },
          { country: new RegExp(search, 'i') },
          { region: new RegExp(search, 'i') }
        ];
      }

      const locations = await Location
        .find(query)
        .sort(sort)
        .limit(limit)
        .skip(offset)
        .exec();

      const total = await Location.countDocuments(query);

      dbLogger.success('Locations fetched successfully', {
        count: locations.length,
        total: total,
        filters
      });

      return {
        locations,
        total,
        limit,
        offset,
        hasMore: offset + locations.length < total
      };
    } catch (error) {
      dbLogger.error('Failed to fetch locations', { filters }, error);
      throw error;
    }
  }

  // Get popular locations
  static async getPopularLocations(limit = 20) {
    try {
      const locations = await Location
        .find({ is_popular: true })
        .sort({ city: 1 })
        .limit(limit)
        .exec();

      dbLogger.success('Popular locations fetched', {
        count: locations.length
      });

      return locations;
    } catch (error) {
      dbLogger.error('Failed to fetch popular locations', null, error);
      throw error;
    }
  }

  // Get locations by country
  static async getLocationsByCountry(country, options = {}) {
    try {
      const { limit = 50, sort = { city: 1 } } = options;

      const locations = await Location
        .find({ country: new RegExp(country, 'i') })
        .sort(sort)
        .limit(limit)
        .exec();

      dbLogger.success('Locations fetched by country', {
        country,
        count: locations.length
      });

      return locations;
    } catch (error) {
      dbLogger.error('Failed to fetch locations by country', { country }, error);
      throw error;
    }
  }

  // Get locations by region
  static async getLocationsByRegion(region, options = {}) {
    try {
      const { limit = 50, sort = { city: 1 } } = options;

      const locations = await Location
        .find({ region: new RegExp(region, 'i') })
        .sort(sort)
        .limit(limit)
        .exec();

      dbLogger.success('Locations fetched by region', {
        region,
        count: locations.length
      });

      return locations;
    } catch (error) {
      dbLogger.error('Failed to fetch locations by region', { region }, error);
      throw error;
    }
  }

  // Search locations (autocomplete)
  static async searchLocations(query, limit = 10) {
    try {
      const locations = await Location
        .find({
          $or: [
            { city: new RegExp(query, 'i') },
            { country: new RegExp(query, 'i') },
            { region: new RegExp(query, 'i') }
          ]
        })
        .limit(limit)
        .sort({ is_popular: -1, city: 1 })
        .exec();

      dbLogger.success('Location search completed', {
        query,
        count: locations.length
      });

      return locations;
    } catch (error) {
      dbLogger.error('Location search failed', { query }, error);
      throw error;
    }
  }
}

export default LocationService;
export { Location };