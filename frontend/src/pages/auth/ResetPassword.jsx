import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import AuthLayout from './AuthLayout';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Notification from '../../components/ui/Notification';
import AlreadyAuthenticatedCard from '../../components/ui/AlreadyAuthenticatedCard';

const ResetPassword = () => {
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });
  const [notification, setNotification] = useState({ message: '', type: 'error', isVisible: false });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [token, setToken] = useState('');
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // If user is already authenticated and not using a reset token, show the already authenticated card
  if (!authLoading && user && !searchParams.get('token')) {
    return <AlreadyAuthenticatedCard />;
  }

  useEffect(() => {
    // Get token from URL parameters
    const urlToken = searchParams.get('token');
    if (urlToken) {
      setToken(urlToken);
    } else {
      setNotification({
        message: 'Invalid reset link. Please request a new password reset.',
        type: 'error',
        isVisible: true
      });
    }
  }, [searchParams]);

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
    setNotification({ message: '', type: 'error', isVisible: false });
    setLoading(true);

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setNotification({
        message: 'Passwords do not match.',
        type: 'error',
        isVisible: true
      });
      setLoading(false);
      return;
    }

    // Validate password length
    if (formData.password.length < 6) {
      setNotification({
        message: 'Password must be at least 6 characters long.',
        type: 'error',
        isVisible: true
      });
      setLoading(false);
      return;
    }

    try {
      await api.post('/auth/reset-password', {
        token,
        password: formData.password,
      });

      setSuccess(true);
      setNotification({
        message: 'Password reset successful! Redirecting to sign in...',
        type: 'success',
        isVisible: true
      });

      // Redirect to sign in after 3 seconds
      setTimeout(() => {
        navigate('/signin');
      }, 3000);
    } catch (err) {
      setNotification({
        message: err.response?.data?.message || 'Failed to reset password. Please try again.',
        type: 'error',
        isVisible: true
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AuthLayout>
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.4 }}
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Reset your password
        </h2>
        <p className="text-xs text-gray-600 mb-4">
          Choose a secure password for your account
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        {!success ? (
          <motion.form
            className="mt-8 space-y-6"
            onSubmit={handleSubmit}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >

            <div className="space-y-4">
              <Input
                label="New password"
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                placeholder="Enter your new password"
                value={formData.password}
                onChange={handleChange}
              />
              <Input
                label="Confirm new password"
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                placeholder="Confirm your new password"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.4 }}
            >
              <Button
                type="submit"
                loading={loading}
                disabled={loading || !token || token === ''}
                className="w-full"
                size="default"
              >
                {loading ? 'Resetting password...' : 'Reset password'}
              </Button>
            </motion.div>

            <motion.div
              className="text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.4 }}
            >
              <p className="text-sm text-black/70">
                Remember your password?{' '}
                <Link
                  to="/signin"
                  className="font-medium text-main hover:text-main-dark transition-colors"
                >
                  Sign in
                </Link>
              </p>
            </motion.div>
          </motion.form>
        ) : (
          <motion.div
            className="mt-8 space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded">
              <div className="flex">
                <div className="ml-3">
                  <p className="text-sm text-green-700">
                    Password reset successful! You will be redirected to the sign in page.
                  </p>
                </div>
              </div>
            </div>

            <motion.div
              className="text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.4 }}
            >
              <Link
                to="/signin"
                className="font-medium text-main hover:text-main-dark transition-colors"
              >
                Go to sign in
              </Link>
            </motion.div>
          </motion.div>
        )}
      </motion.div>
    </AuthLayout>
    <Notification
      message={notification.message}
      type={notification.type}
      isVisible={notification.isVisible}
      onClose={() => setNotification(prev => ({ ...prev, isVisible: false }))}
    />
  </>
  );
};

export default ResetPassword;
