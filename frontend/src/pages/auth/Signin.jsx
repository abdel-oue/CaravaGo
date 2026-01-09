import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import AuthLayout from './AuthLayout';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Notification from '../../components/ui/Notification';
import AlreadyAuthenticatedCard from '../../components/ui/AlreadyAuthenticatedCard';

const Signin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [notification, setNotification] = useState({ message: '', type: 'error', isVisible: false });
  const [loading, setLoading] = useState(false);
  const { login, user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  // If user is already authenticated, show the already authenticated card
  if (!authLoading && user) {
    return <AlreadyAuthenticatedCard />;
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // Clear notification when user starts typing
    setNotification({ message: '', type: 'error', isVisible: false });
  };

  const handleSubmit = (e) => {
    console.log('🔄 Signin handleSubmit called - BEFORE preventDefault');
    e.preventDefault();
    console.log('🔄 Signin handleSubmit called - AFTER preventDefault');
    console.log('📝 Form data:', formData);
    console.log('🔍 Form validity:', e.target.checkValidity());

    // Check form validity
    if (!e.target.checkValidity()) {
      console.log('❌ Form is invalid, showing validation error');
      setNotification({
        message: 'Please fill in all required fields correctly.',
        type: 'error',
        isVisible: true
      });
      return;
    }

    // Clear any existing notification
    setNotification({ message: '', type: 'error', isVisible: false });
    setLoading(true);
    console.log('🔄 Set loading to true, cleared notifications');

    // Wrap the async logic in a separate function to handle errors properly
    (async () => {
    try {
      console.log('📡 Making API call to /auth/login');
      const response = await api.post('/auth/login', formData);
      console.log('📡 API response received:', {
        status: response.status,
        statusText: response.statusText,
        data: response.data,
        headers: response.headers
      });

      // Check if the response indicates an error (like 401 for invalid credentials)
      if (response.status >= 400) {
        console.log('❌ Response status >= 400, showing error notification');
        setNotification({
          message: response.data?.message || 'Login failed. Please check your credentials.',
          type: 'error',
          isVisible: true
        });
        return;
      }

      // Validate that we received a successful response with user data
      if (response.data && response.status === 200) {
        console.log('✅ Successful login, user data received:', response.data);
        setNotification({
          message: 'Welcome back! Successfully signed in.',
          type: 'success',
          isVisible: true
        });

        // Navigate after a brief delay to show success message
        console.log('⏰ Setting timeout for navigation in 1.5 seconds');
        setTimeout(() => {
          console.log('🏠 Navigating to home page');
          login(response.data);
          navigate('/');
        }, 1500);
      } else {
        console.log('⚠️ Unexpected response format - status 200 but no/invalid data');
        // Handle unexpected response format
        setNotification({
          message: 'Login failed. Please try again.',
          type: 'error',
          isVisible: true
        });
      }
    } catch (err) {
      console.log('💥 Catch block triggered - error caught:', err);
      console.log('💥 Error details:', {
        message: err.message,
        response: err.response,
        status: err.response?.status,
        data: err.response?.data
      });

      // Handle authentication errors (like 401 for invalid credentials)
      // Don't let the axios interceptor redirect us on the login page
      if (err.response?.status === 401) {
        console.log('🔐 401 error - invalid credentials');
        setNotification({
          message: 'Invalid email or password. Please try again.',
          type: 'error',
          isVisible: true
        });
      } else {
        console.log('🌐 Other error - network or server issue');
        // Handle other network errors
        setNotification({
          message: err.response?.data?.message || 'Login failed. Please check your connection.',
          type: 'error',
          isVisible: true
        });
      }
    } finally {
      console.log('🏁 Finally block - setting loading to false');
      setLoading(false);
    }
    })().catch((error) => {
      console.error('💥 Unexpected error in handleSubmit:', error);
      setNotification({
        message: 'An unexpected error occurred. Please try again.',
        type: 'error',
        isVisible: true
      });
      setLoading(false);
    });
  };

  const accountLinks = (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.9, duration: 0.4 }}
    >
      <p className="text-sm text-black/70">
        Don't have an account?{' '}
        <Link
          to="/signup"
          className="font-medium text-main hover:text-main-dark transition-colors"
        >
          Sign up
        </Link>
      </p>
    </motion.div>
  );

  return (
    <>
      <AuthLayout accountLinks={accountLinks}>
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.4 }}
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Welcome back!
        </h2>
        <p className="text-xs text-gray-600 mb-4">
          Continue your journey with us
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <motion.form
          className="mt-8 space-y-6"
          onSubmit={handleSubmit}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <div className="space-y-4">
            <Input
              label="Email address"
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
            />
            <Input
              label="Password"
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          <motion.div
            className="flex items-center justify-between"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.4 }}
          >
            <div className="text-sm">
              <Link
                to="/forgot-password"
                className="font-medium text-main hover:text-main-dark transition-colors"
              >
                Forgot your password?
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.4 }}
          >
            <Button
              type="submit"
              loading={loading}
              disabled={loading}
              className="w-full"
              size="default"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </Button>
          </motion.div>

        </motion.form>
      </motion.div>
    </AuthLayout>
    <Notification
      message={notification.message}
      type={notification.type}
      isVisible={notification.isVisible}
      onClose={() => {
        console.log('❌ Notification onClose called');
        setNotification(prev => ({ ...prev, isVisible: false }));
      }}
    />
  </>
  );
};

export default Signin;
