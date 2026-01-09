import { useState, useEffect } from 'react';
import { getVehicleTypes, getAmenities } from '../api/listings';

// Hook for vehicle types
export const useVehicleTypes = () => {
  const [vehicleTypes, setVehicleTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVehicleTypes = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getVehicleTypes();
        setVehicleTypes(response.vehicle_types || []);
      } catch (err) {
        setError(err.message || 'Failed to fetch vehicle types');
        console.error('Failed to fetch vehicle types:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchVehicleTypes();
  }, []);

  return {
    vehicleTypes,
    loading,
    error,
    refetch: () => {
      setLoading(true);
      setError(null);
      getVehicleTypes()
        .then(response => setVehicleTypes(response.vehicle_types || []))
        .catch(err => {
          setError(err.message || 'Failed to fetch vehicle types');
          console.error('Failed to fetch vehicle types:', err);
        })
        .finally(() => setLoading(false));
    }
  };
};

// Hook for amenities
export const useAmenities = () => {
  const [amenities, setAmenities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAmenities = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getAmenities();
        setAmenities(response.amenities || []);
      } catch (err) {
        setError(err.message || 'Failed to fetch amenities');
        console.error('Failed to fetch amenities:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAmenities();
  }, []);

  return {
    amenities,
    loading,
    error,
    refetch: () => {
      setLoading(true);
      setError(null);
      getAmenities()
        .then(response => setAmenities(response.amenities || []))
        .catch(err => {
          setError(err.message || 'Failed to fetch amenities');
          console.error('Failed to fetch amenities:', err);
        })
        .finally(() => setLoading(false));
    }
  };
};