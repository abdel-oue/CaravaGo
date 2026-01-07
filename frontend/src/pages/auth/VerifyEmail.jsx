import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import AuthLayout from './AuthLayout';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Notification from '../../components/ui/Notification';

const VerifyEmail = () => {
  const [formData, setFormData] = useState({
    verificationCode: '',
  });
  const [notification, setNotification] = useState({ message: '', type: 'error', isVisible: false });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [token, setToken] = useState('');
  const [email, setEmail] = useState('');
  const { login, user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // If user is already authenticated and verified, show the already authenticated card
  if (!authLoading && user && user.is_verified) {
    return <AlreadyAuthenticatedCard />;
  }

  useEffect(() => {
    // Get token from URL parameters
    const urlToken = searchParams.get('token');
    if (urlToken) {
      setToken(urlToken);
      // Auto-verify if token is in URL
      handleAutoVerification(urlToken);
    }
  }, [searchParams]);

  const handleAutoVerification = async (urlToken) => {
    setLoading(true);
    try {
      const response = await api.post('/auth/verify-email', { token: urlToken });

      setSuccess(true);
      login(response.data);

      setNotification({
        message: 'Email verified successfully! Welcome to CaravaGo.',
        type: 'success',
        isVisible: true
      });

      // Redirect to home after 3 seconds
      setTimeout(() => {
        navigate('/');
      }, 3000);
    } catch (err) {
      setNotification({
        message: err.response?.data?.message || 'Verification failed. Please try again.',
        type: 'error',
        isVisible: true
      });
    } finally {
      setLoading(false);
    }
  };

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

    try {
      const response = await api.post('/auth/verify-email', {
        code: formData.verificationCode
      });

      setSuccess(true);
      login(response.data);

      setNotification({
        message: 'Email verified successfully! Welcome to CaravaGo.',
        type: 'success',
        isVisible: true
      });

      // Redirect to home after 3 seconds
      setTimeout(() => {
        navigate('/');
      }, 3000);
    } catch (err) {
      setNotification({
        message: err.response?.data?.message || 'Verification failed. Please try again.',
        type: 'error',
        isVisible: true
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResendEmail = async () => {
    // This would typically require the user's email
    // For now, just show a message
    setNotification({
      message: 'Please check your email for the verification link, or contact support if you need help.',
      type: 'info',
      isVisible: true
    });
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
            Verify Your Email
          </h2>
          <p className="text-xs text-gray-600 mb-4">
            {token ? 'Verifying your email automatically...' : 'Enter the 6-digit code from your email'}
          </p>
        </motion.div>

        <Notification
          message={notification.message}
          type={notification.type}
          isVisible={notification.isVisible}
          onClose={() => setNotification({ ...notification, isVisible: false })}
        />

        {!success && !token && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-4">
                <Input
                  label="6-digit verification code"
                  id="verificationCode"
                  name="verificationCode"
                  type="text"
                  autoComplete="one-time-code"
                  required
                  placeholder="Enter the 6-digit code"
                  value={formData.verificationCode}
                  onChange={handleChange}
                  maxLength="6"
                  pattern="[0-9]{6}"
                />
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.4 }}
              >
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full"
                >
                  {loading ? 'Verifying...' : 'Verify Email'}
                </Button>
              </motion.div>
            </form>

            <motion.div
              className="mt-6 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9, duration: 0.4 }}
            >
              <p className="text-sm text-gray-600 mb-2">
                Didn't receive the code?{' '}
                <button
                  onClick={handleResendEmail}
                  className="font-medium text-main hover:text-main-dark transition-colors"
                >
                  Resend verification email
                </button>
              </p>
              <p className="text-sm text-gray-600">
                <Link
                  to="/signin"
                  className="font-medium text-main hover:text-main-dark transition-colors"
                >
                  Back to Sign In
                </Link>
              </p>
            </motion.div>
          </motion.div>
        )}

        {success && (
          <motion.div
            className="text-center mt-8"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Email Verified!</h3>
            <p className="text-sm text-gray-600">Redirecting you to your dashboard...</p>
          </motion.div>
        )}

        {token && !success && (
          <motion.div
            className="text-center mt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-spin">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
              </svg>
            </div>
            <p className="text-sm text-gray-600">Verifying your email...</p>
          </motion.div>
        )}
      </AuthLayout>
    </>
  );
};

export default VerifyEmail;
