import axios from './axios.js';

// Get all vehicle types
export const getVehicleTypes = async () => {
  try {
    const response = await axios.get('/listings/vehicle-types');
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Get all amenities
export const getAmenities = async () => {
  try {
    const response = await axios.get('/listings/amenities');
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Create a new listing
export const createListing = async (listingData) => {
  try {
    const response = await axios.post('/listings', listingData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Get all listings
export const getListings = async (params = {}) => {
  try {
    const response = await axios.get('/listings', { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Get listing by ID
export const getListingById = async (id) => {
  try {
    const response = await axios.get(`/listings/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Get user's listings
export const getMyListings = async () => {
  try {
    const response = await axios.get('/listings/my-listings');
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Update listing
export const updateListing = async (id, updateData) => {
  try {
    const response = await axios.put(`/listings/${id}`, updateData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Delete listing
export const deleteListing = async (id) => {
  try {
    const response = await axios.delete(`/listings/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};