import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('token');
      const storedUserId = localStorage.getItem('userId');

      if (storedToken && storedUserId) {
        try {
          // Verify token and get user data from API
          const response = await api.post('/auth/verify-token', { token: storedToken });
          if (response.data.valid) {
            setUser(response.data.user);
          } else {
            // Token is invalid, remove stored data
            localStorage.removeItem('token');
            localStorage.removeItem('userId');
          }
        } catch (error) {
          console.error('Token verification failed:', error);
          localStorage.removeItem('token');
          localStorage.removeItem('userId');
        }
      } else if (storedToken || storedUserId) {
        // If only one exists, clear both to be safe
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = (userData) => {
    // Store both token and user ID in localStorage
    localStorage.setItem('token', userData.token);
    localStorage.setItem('userId', userData.id);
    // Remove token from userData before setting it in state
    const { token, ...userWithoutToken } = userData;
    setUser(userWithoutToken);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    setUser(null);
  };

  const value = {
    user,
    login,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

