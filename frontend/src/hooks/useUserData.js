import { useState, useEffect } from 'react';
import api from '../api/axios';
import { getStoredUserId, getStoredToken } from '../utils/auth';

export const useUserBookings = (enablePolling = false) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBookings = async () => {
    try {
      const userId = getStoredUserId();
      const token = getStoredToken();

      if (!userId || !token) {
        setError('No authentication data found');
        setLoading(false);
        return;
      }

      const response = await api.get('/user/bookings');
      setBookings(response.data.data || []);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const userId = getStoredUserId();
    const token = getStoredToken();

    if (userId && token) {
      fetchBookings();

      if (enablePolling) {
        // Poll every 30 seconds for real-time updates
        const interval = setInterval(fetchBookings, 30000);
        return () => clearInterval(interval);
      }
    } else {
      setLoading(false);
      setError('Authentication required');
    }
  }, [enablePolling]);

  return { bookings, loading, error, refetch: fetchBookings };
};

export const useUserListings = (enablePolling = false) => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchListings = async () => {
    try {
      const userId = getStoredUserId();
      const token = getStoredToken();

      if (!userId || !token) {
        setError('No authentication data found');
        setLoading(false);
        return;
      }

      const response = await api.get('/user/listings');
      setListings(response.data.data || []);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching listings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const userId = getStoredUserId();
    const token = getStoredToken();

    if (userId && token) {
      fetchListings();

      if (enablePolling) {
        // Poll every 30 seconds for real-time updates
        const interval = setInterval(fetchListings, 30000);
        return () => clearInterval(interval);
      }
    } else {
      setLoading(false);
      setError('Authentication required');
    }
  }, [enablePolling]);

  return { listings, loading, error, refetch: fetchListings };
};

export const useUserReviews = (enablePolling = false) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchReviews = async () => {
    try {
      const userId = getStoredUserId();
      const token = getStoredToken();

      if (!userId || !token) {
        setError('No authentication data found');
        setLoading(false);
        return;
      }

      const response = await api.get('/user/reviews');
      setReviews(response.data.data || []);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching reviews:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const userId = getStoredUserId();
    const token = getStoredToken();

    if (userId && token) {
      fetchReviews();

      if (enablePolling) {
        // Poll every 30 seconds for real-time updates
        const interval = setInterval(fetchReviews, 30000);
        return () => clearInterval(interval);
      }
    } else {
      setLoading(false);
      setError('Authentication required');
    }
  }, [enablePolling]);

  return { reviews, loading, error, refetch: fetchReviews };
};

export const useUserFavorites = (enablePolling = false) => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchFavorites = async () => {
    try {
      const userId = getStoredUserId();
      const token = getStoredToken();

      if (!userId || !token) {
        setError('No authentication data found');
        setLoading(false);
        return;
      }

      const response = await api.get('/user/favorites');
      setFavorites(response.data.data || []);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching favorites:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const userId = getStoredUserId();
    const token = getStoredToken();

    if (userId && token) {
      fetchFavorites();

      if (enablePolling) {
        // Poll every 30 seconds for real-time updates
        const interval = setInterval(fetchFavorites, 30000);
        return () => clearInterval(interval);
      }
    } else {
      setLoading(false);
      setError('Authentication required');
    }
  }, [enablePolling]);

  return { favorites, loading, error, refetch: fetchFavorites };
};

export const useUserMessages = (enablePolling = false) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMessages = async () => {
    try {
      const userId = getStoredUserId();
      const token = getStoredToken();

      if (!userId || !token) {
        setError('No authentication data found');
        setLoading(false);
        return;
      }

      const response = await api.get('/user/messages');
      setMessages(response.data.data || []);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching messages:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const userId = getStoredUserId();
    const token = getStoredToken();

    if (userId && token) {
      fetchMessages();

      if (enablePolling) {
        // Poll every 30 seconds for real-time updates
        const interval = setInterval(fetchMessages, 30000);
        return () => clearInterval(interval);
      }
    } else {
      setLoading(false);
      setError('Authentication required');
    }
  }, [enablePolling]);

  return { messages, loading, error, refetch: fetchMessages };
};

export const useUserNotifications = (enablePolling = true) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchNotifications = async () => {
    try {
      const userId = getStoredUserId();
      const token = getStoredToken();

      if (!userId || !token) {
        setError('No authentication data found');
        setLoading(false);
        return;
      }

      const response = await api.get('/user/notifications');
      setNotifications(response.data.data || []);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      await api.put(`/user/notifications/${notificationId}/read`);
      // Update local state
      setNotifications(prev =>
        prev.map(notification =>
          notification.id === notificationId
            ? { ...notification, is_read: true }
            : notification
        )
      );
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  };

  useEffect(() => {
    const userId = getStoredUserId();
    const token = getStoredToken();

    if (userId && token) {
      fetchNotifications();

      if (enablePolling) {
        // Poll every 15 seconds for notifications (more frequent since they change often)
        const interval = setInterval(fetchNotifications, 15000);
        return () => clearInterval(interval);
      }
    } else {
      setLoading(false);
      setError('Authentication required');
    }
  }, [enablePolling]);

  return {
    notifications,
    loading,
    error,
    refetch: fetchNotifications,
    markAsRead
  };
};
