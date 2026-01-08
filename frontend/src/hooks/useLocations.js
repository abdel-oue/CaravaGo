import { useState, useEffect, useCallback } from 'react';
import {
  getLocations,
  getPopularLocations,
  getLocationsByCountry,
  searchLocations
} from '../api/locations';

export const useLocations = () => {
  const [locations, setLocations] = useState([]);
  const [popularLocations, setPopularLocations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch locations with optional filters
  const fetchLocations = useCallback(async (filters = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await getLocations(filters);
      setLocations(response.locations || []);
      return response;
    } catch (err) {
      setError(err.message || 'Failed to fetch locations');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch popular locations
  const fetchPopularLocations = useCallback(async (limit = 6) => {
    setLoading(true);
    setError(null);
    try {
      const response = await getPopularLocations(limit);
      setPopularLocations(response.locations || []);
      return response.locations || [];
    } catch (err) {
      setError(err.message || 'Failed to fetch popular locations');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Search locations (autocomplete)
  const searchLocationQuery = useCallback(async (query, limit = 5) => {
    if (!query || query.length < 2) return [];

    setLoading(true);
    try {
      const response = await searchLocations(query, limit);
      return response.locations || [];
    } catch (err) {
      console.error('Search failed:', err);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Get locations by country
  const getLocationsByCountryQuery = useCallback(async (country, limit = 20) => {
    setLoading(true);
    try {
      const response = await getLocationsByCountry(country, { limit });
      return response.locations || [];
    } catch (err) {
      console.error('Failed to fetch locations by country:', err);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Initialize popular locations on mount
  useEffect(() => {
    fetchPopularLocations(6);
  }, [fetchPopularLocations]);

  return {
    locations,
    popularLocations,
    loading,
    error,
    fetchLocations,
    fetchPopularLocations,
    searchLocationQuery,
    getLocationsByCountryQuery,
    setLocations,
    setError
  };
};

// Hook for location autocomplete
export const useLocationAutocomplete = () => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);

  const searchSuggestions = useCallback(async (searchQuery) => {
    if (!searchQuery || searchQuery.length < 2) {
      setSuggestions([]);
      return;
    }

    setLoading(true);
    try {
      const results = await searchLocations(searchQuery, 8);
      setSuggestions(results.locations || []);
      setShowDropdown(true);
    } catch (error) {
      console.error('Autocomplete search failed:', error);
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const showPopularLocations = useCallback(async () => {
    setLoading(true);
    try {
      const results = await getPopularLocations(8);
      setSuggestions(results.locations || []);
      setShowDropdown(true);
    } catch (error) {
      console.error('Failed to load popular locations:', error);
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const selectLocation = useCallback((location) => {
    setSelectedLocation(location);
    setQuery(`${location.city}, ${location.country}`);
    setSuggestions([]);
    setShowDropdown(false);
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedLocation(null);
    setQuery('');
    setSuggestions([]);
    setShowDropdown(false);
  }, []);

  const handleInputFocus = useCallback(() => {
    if (!query && !selectedLocation) {
      // Show popular locations when input is focused and empty
      showPopularLocations();
    } else if (query && query.length >= 2) {
      // Show search results if there's a query
      searchSuggestions(query);
    }
  }, [query, selectedLocation, showPopularLocations, searchSuggestions]);

  const handleInputBlur = useCallback(() => {
    // Delay hiding dropdown to allow click events on suggestions
    setTimeout(() => {
      setShowDropdown(false);
    }, 150);
  }, []);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (query && query.length >= 2) {
        searchSuggestions(query);
      } else if (!query) {
        setSuggestions([]);
        setShowDropdown(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query, searchSuggestions]);

  return {
    query,
    setQuery,
    suggestions,
    loading,
    selectedLocation,
    selectLocation,
    clearSelection,
    showDropdown,
    handleInputFocus,
    handleInputBlur
  };
};