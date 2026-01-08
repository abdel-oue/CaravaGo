import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import logo from '../../public/logo-cropped.png';
import Button from './Button';

const AlreadyAuthenticatedCard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleContinue = () => {
    navigate('/');
  };

  const handleDisconnect = () => {
    logout();
    // User will be redirected to signin page after logout
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white/60 via-white/40 to-primary/25 px-4 py-8">
      <motion.div
        className="w-full max-w-md bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-6 md:p-8 text-center border border-primary/15"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Logo */}
        <motion.div
          className="flex justify-center mb-4"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          <img src={logo} alt="CaravaGo" className="h-10 w-auto" />
        </motion.div>

        {/* Success Icon */}
        <motion.div
          className="mb-4"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.4 }}
        >
          <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary-dark rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2 font-lexend">
            Already Connected
          </h2>
          <p className="text-gray-600">
            Welcome back, <strong className="text-primary">{user?.name || user?.email}</strong>!
          </p>
          <p className="text-gray-500 text-sm mt-1">
            You're already signed in to your account
          </p>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          className="space-y-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.4 }}
        >
          <Button
            onClick={handleContinue}
            variant="primary"
            className="text-sm w-full"
            size="lg"
          >
            Continue Your Journey
          </Button>

          <Button
            onClick={handleDisconnect}
            variant="outline"
            className="text-sm w-full"
            size="lg"
          >
            Sign Out
          </Button>
        </motion.div>

        {/* Additional Info */}
        <motion.p
          className="text-xs text-gray-500 mt-4 px-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.4 }}
        >
          Want to sign in with a different account? Sign out first.
        </motion.p>
      </motion.div>
    </div>
  );
};

export default AlreadyAuthenticatedCard;
