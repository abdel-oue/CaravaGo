import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import AuthLayout from './AuthLayout';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Notification from '../../components/ui/Notification';
import AlreadyAuthenticatedCard from '../../components/ui/AlreadyAuthenticatedCard';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [notification, setNotification] = useState({ message: '', type: 'error', isVisible: false });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const { user, loading: authLoading } = useAuth();

  // If user is already authenticated, show the already authenticated card
  if (!authLoading && user) {
    return <AlreadyAuthenticatedCard />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setNotification({ message: '', type: 'error', isVisible: false });
    setLoading(true);

    try {
      const response = await api.post('/auth/forgot-password', { email });
      setSuccessMessage(response.data.message);
      setSuccess(true);
      setNotification({
        message: 'Password reset email sent! Check your inbox.',
        type: 'success',
        isVisible: true
      });
    } catch (err) {
      setNotification({
        message: err.response?.data?.message || 'Failed to send reset email. Please try again.',
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
        Let's get you back on the road, Enter your email address and we'll send you a link to reset your password
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
              label="Email address"
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.4 }}
            >
              <Button
                type="submit"
                loading={loading}
                disabled={loading}
                className="w-full"
                size="default"
              >
                {loading ? 'Sending reset link...' : 'Send reset link'}
              </Button>
            </motion.div>

            <motion.div
              className="text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.4 }}
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
                    {successMessage}
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
                Back to sign in
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

export default ForgotPassword;
