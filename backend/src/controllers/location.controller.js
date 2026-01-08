import LocationService from '../models/Location.js';
import { dbLogger } from '../utils/logger.js';

// Get location by ID
export const getLocationById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: 'Location ID is required' });
    }

    const location = await LocationService.getLocationById(id);

    if (!location) {
      return res.status(404).json({ message: 'Location not found' });
    }

    res.json({
      success: true,
      location
    });
  } catch (error) {
    dbLogger.error('Get location by ID failed', { location_id: req.params.id }, error);
    res.status(500).json({ message: 'Failed to get location' });
  }
};

// Get many locations with optional filters
export const getLocations = async (req, res) => {
  try {
    const {
      country,
      region,
      popular,
      search,
      limit,
      offset,
      sort
    } = req.query;

    // Parse query parameters
    const filters = {
      country,
      region,
      is_popular: popular === 'true' ? true : popular === 'false' ? false : undefined,
      search,
      limit: limit ? parseInt(limit) : undefined,
      offset: offset ? parseInt(offset) : undefined,
      sort: sort ? JSON.parse(sort) : undefined
    };

    const result = await LocationService.getLocations(filters);

    res.json({
      success: true,
      ...result
    });
  } catch (error) {
    dbLogger.error('Get locations failed', { query: req.query }, error);
    res.status(500).json({ message: 'Failed to get locations' });
  }
};

// Get popular locations
export const getPopularLocations = async (req, res) => {
  try {
    const { limit } = req.query;
    const limitNum = limit ? parseInt(limit) : 20;

    const locations = await LocationService.getPopularLocations(limitNum);

    res.json({
      success: true,
      locations,
      count: locations.length
    });
  } catch (error) {
    dbLogger.error('Get popular locations failed', null, error);
    res.status(500).json({ message: 'Failed to get popular locations' });
  }
};

// Get locations by country
export const getLocationsByCountry = async (req, res) => {
  try {
    const { country } = req.params;
    const { limit, sort } = req.query;

    if (!country) {
      return res.status(400).json({ message: 'Country is required' });
    }

    const options = {
      limit: limit ? parseInt(limit) : undefined,
      sort: sort ? JSON.parse(sort) : undefined
    };

    const locations = await LocationService.getLocationsByCountry(country, options);

    res.json({
      success: true,
      locations,
      count: locations.length,
      country
    });
  } catch (error) {
    dbLogger.error('Get locations by country failed', { country: req.params.country }, error);
    res.status(500).json({ message: 'Failed to get locations by country' });
  }
};

// Get locations by region
export const getLocationsByRegion = async (req, res) => {
  try {
    const { region } = req.params;
    const { limit, sort } = req.query;

    if (!region) {
      return res.status(400).json({ message: 'Region is required' });
    }

    const options = {
      limit: limit ? parseInt(limit) : undefined,
      sort: sort ? JSON.parse(sort) : undefined
    };

    const locations = await LocationService.getLocationsByRegion(region, options);

    res.json({
      success: true,
      locations,
      count: locations.length,
      region
    });
  } catch (error) {
    dbLogger.error('Get locations by region failed', { region: req.params.region }, error);
    res.status(500).json({ message: 'Failed to get locations by region' });
  }
};

// Search locations (autocomplete)
export const searchLocations = async (req, res) => {
  try {
    const { q: query, limit } = req.query;

    if (!query) {
      return res.status(400).json({ message: 'Search query is required' });
    }

    const limitNum = limit ? parseInt(limit) : 10;
    const locations = await LocationService.searchLocations(query, limitNum);

    res.json({
      success: true,
      locations,
      count: locations.length,
      query
    });
  } catch (error) {
    dbLogger.error('Search locations failed', { query: req.query.q }, error);
    res.status(500).json({ message: 'Failed to search locations' });
  }
};