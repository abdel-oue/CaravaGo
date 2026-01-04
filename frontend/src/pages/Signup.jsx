import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { logger } from '../utils/logger';
import backgroundImage from '../public/auth-background.jpg';
import logo from '../public/logo-cropped.png';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    logger.info('Starting user registration process');

    // Validation
    if (formData.password.length < 6) {
      const errorMsg = 'Password must be at least 6 characters long';
      logger.warning('Password validation failed', { passwordLength: formData.password.length });
      setError(errorMsg);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      const errorMsg = 'Passwords do not match';
      logger.warning('Password confirmation failed');
      setError(errorMsg);
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

      login(response.data);
      navigate('/');
    } catch (err) {
      const errorMessage = getUserFriendlyError(err);
      logger.error('Registration failed', {
        error: err.response?.data || err.message,
        status: err.response?.status
      });

      setError(errorMessage);
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

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src={backgroundImage} 
          alt="Background" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-main/40"></div>
      </div>

      <div className={`relative z-10 max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-2xl transform transition-all duration-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <div className="text-center">
          <Link to="/" className="inline-block mb-4">
            <img src={logo} alt="CaravaGo" className="h-12 w-auto mx-auto" />
          </Link>
          <h2 className="text-3xl font-extrabold text-gray-900 mb-2 animate-fade-in">
            Start your journey
          </h2>
          <p className="text-sm text-gray-600">
            Create an account to begin your adventure
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded animate-shake">
              <div className="flex">
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}
          <div className="space-y-4">
            <div className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
              <label htmlFor="name" className="block text-sm font-medium text-black mb-1">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-400 text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-main focus:border-transparent transition-all duration-200 hover:border-main/50"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
              />
            </div>
            <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <label htmlFor="email" className="block text-sm font-medium text-black mb-1">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-400 text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-main focus:border-transparent transition-all duration-200 hover:border-main/50"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div className="animate-slide-up" style={{ animationDelay: '0.3s' }}>
              <label htmlFor="password" className="block text-sm font-medium text-black mb-1">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                minLength={6}
                className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-400 text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-main focus:border-transparent transition-all duration-200 hover:border-main/50"
                placeholder="At least 6 characters"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
            <div className="animate-slide-up" style={{ animationDelay: '0.4s' }}>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-black mb-1">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-400 text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-main focus:border-transparent transition-all duration-200 hover:border-main/50"
                placeholder="Re-enter your password"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="animate-slide-up" style={{ animationDelay: '0.5s' }}>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
            >
              {loading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating account...
                </span>
              ) : (
                'Sign up'
              )}
            </button>
          </div>

          <div className="text-center animate-slide-up" style={{ animationDelay: '0.6s' }}>
            <p className="text-sm text-black/70">
              Already have an account?{' '}
              <Link
                to="/signin"
                className="font-medium text-main hover:text-main-dark transition-colors"
              >
                Sign in
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;

