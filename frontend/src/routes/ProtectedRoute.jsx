import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from 'react';
import api from '../api/axios';

const ProtectedRoute = ({ children }) => {
  const { logout } = useAuth();
  const [isVerifying, setIsVerifying] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  useEffect(() => {
    const verifyUser = async () => {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');

      if (!token || !userId) {
        setIsVerifying(false);
        setIsAuthenticated(false);
        return;
      }

      try {
        // Make POST request to verify-token endpoint with token in body
        const response = await api.post('/auth/verify-token', { token });

        if (response.status === 200 && response.data.valid) {
          setIsAuthenticated(true);
        } else {
          throw new Error('Invalid token');
        }
      } catch (error) {
        console.error('Authentication verification failed:', error);
        // Clear invalid token and userId
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        logout(); // Clear user from context
        setIsAuthenticated(false);
      } finally {
        setIsVerifying(false);
      }
    };

    verifyUser();
  }, []);

  // Show loading while verifying
  if (isVerifying) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
      </div>
    );
  }

  // Redirect if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/signin" replace />;
  }

  return children;
};

export default ProtectedRoute;

