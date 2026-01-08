import axios from './axios.js';

// Get many locations with optional filters
export const getLocations = async (params = {}) => {
  try {
    const response = await axios.get('/locations', { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Get location by ID
export const getLocationById = async (id) => {
  try {
    const response = await axios.get(`/locations/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Get popular locations
export const getPopularLocations = async (limit = 20) => {
  try {
    const response = await axios.get('/locations/popular', {
      params: { limit }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Get locations by country
export const getLocationsByCountry = async (country, params = {}) => {
  try {
    const response = await axios.get(`/locations/country/${country}`, {
      params
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Get locations by region
export const getLocationsByRegion = async (region, params = {}) => {
  try {
    const response = await axios.get(`/locations/region/${region}`, {
      params
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Search locations (autocomplete)
export const searchLocations = async (query, limit = 10) => {
  try {
    const response = await axios.get('/locations/search', {
      params: { q: query, limit }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};