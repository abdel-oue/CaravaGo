import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import { logger } from '../../utils/logger';
import AuthLayout from './AuthLayout';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Notification from '../../components/ui/Notification';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [notification, setNotification] = useState({ message: '', type: 'error', isVisible: false });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // Clear notification when user starts typing
    setNotification({ message: '', type: 'error', isVisible: false });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Clear any existing notification
    setNotification({ message: '', type: 'error', isVisible: false });

    logger.info('Starting user registration process');

    // Validation
    if (formData.password.length < 6) {
      const errorMsg = 'Password must be at least 6 characters long';
      logger.warning('Password validation failed', { passwordLength: formData.password.length });
      setNotification({ message: errorMsg, type: 'error', isVisible: true });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      const errorMsg = 'Passwords do not match';
      logger.warning('Password confirmation failed');
      setNotification({ message: errorMsg, type: 'error', isVisible: true });
      return;
    }

    setLoading(true);

    try {
      const { confirmPassword, ...registerData } = formData;
      logger.info('Sending registration request to server');

      const response = await api.post('/auth/register', registerData);

      logger.success('Registration successful', {
        userId: response.data.id,
        email: response.data.email
      });

      setNotification({
        message: response.data.message || 'Account created successfully! Please check your email to verify your account.',
        type: 'success',
        isVisible: true
      });

      // Don't auto-login - user needs to verify email first
      // Show verification message for longer
      setTimeout(() => {
        navigate('/verify-email');
      }, 3000);
    } catch (err) {
      const errorMessage = getUserFriendlyError(err);
      logger.error('Registration failed', {
        error: err.response?.data || err.message,
        status: err.response?.status
      });

      setNotification({ message: errorMessage, type: 'error', isVisible: true });
    } finally {
      setLoading(false);
    }
  };

  // Convert API errors to user-friendly messages
  const getUserFriendlyError = (err) => {
    const status = err.response?.status;
    const apiMessage = err.response?.data?.message;

    switch (status) {
      case 400:
        if (apiMessage?.includes('already exists')) {
          return 'An account with this email already exists. Please try signing in instead.';
        }
        if (apiMessage?.includes('Password must be')) {
          return 'Password must be at least 6 characters long.';
        }
        return 'Please check your information and try again.';

      case 401:
        if (apiMessage?.includes('API key')) {
          return 'There was a connection issue. Please refresh the page and try again.';
        }
        return 'Authentication failed. Please try again.';

      case 403:
        return 'Access denied. Please try again later.';

      case 500:
        return 'Server error. Please try again in a few moments.';

      default:
        return 'Something went wrong. Please check your internet connection and try again.';
    }
  };

  const accountLinks = (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1, duration: 0.4 }}
    >
      <p className="text-sm text-black/70">
        Already have an account?{' '}
        <Link
          to="/signin"
          className="font-medium text-main hover:text-main-dark transition-colors"
        >
          Sign in
        </Link>
      </p>
    </motion.div>
  );

  const handleNotificationClose = () => {
    setNotification(prev => ({ ...prev, isVisible: false }));
  };

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
          Create an account
        </h2>
        <p className="text-xs text-gray-600 mb-4">
          Start your RV adventure today
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <motion.form
          className="mt-2 space-y-6"
          onSubmit={handleSubmit}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <div className="space-y-4">
            <Input
              label="Full Name"
              id="name"
              name="name"
              type="text"
              required
              placeholder="John Doe"
              value={formData.name}
              onChange={handleChange}
            />
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
              autoComplete="new-password"
              required
              minLength={6}
              placeholder="At least 6 characters"
              value={formData.password}
              onChange={handleChange}
            />
            <Input
              label="Confirm Password"
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              required
              placeholder="Re-enter your password"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.4 }}
          >
            <Button
              type="submit"
              loading={loading}
              disabled={loading}
              className="w-full"
              size="default"
            >
              {loading ? 'Creating account...' : 'Sign up'}
            </Button>
          </motion.div>

        </motion.form>
      </motion.div>
    </AuthLayout>
    <Notification
      message={notification.message}
      type={notification.type}
      isVisible={notification.isVisible}
      onClose={handleNotificationClose}
    />
  </>
  );
};

export default Signup;

