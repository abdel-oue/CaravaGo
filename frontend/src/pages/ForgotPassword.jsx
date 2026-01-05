import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import authBackground from '../public/auth-background.jpg';
import logo from '../public/logo-cropped.png';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // TODO: Implement password reset API call
      // const response = await api.post('/auth/forgot-password', { email });

      // For now, simulate success
      setTimeout(() => {
        setSuccess(true);
        setLoading(false);
      }, 1000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send reset email. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={authBackground}
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
            Reset your password
          </h2>
          <p className="text-sm text-gray-600">
            Enter your email address and we'll send you a link to reset your password
          </p>
        </div>

        {!success ? (
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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
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
                    Sending reset link...
                  </span>
                ) : (
                  'Send reset link'
                )}
              </button>
            </div>

            <div className="text-center animate-slide-up" style={{ animationDelay: '0.3s' }}>
              <p className="text-sm text-black/70">
                Remember your password?{' '}
                <Link
                  to="/signin"
                  className="font-medium text-main hover:text-main-dark transition-colors"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </form>
        ) : (
          <div className="mt-8 space-y-6">
            <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded">
              <div className="flex">
                <div className="ml-3">
                  <p className="text-sm text-green-700">
                    Password reset link sent! Check your email for instructions to reset your password.
                  </p>
                </div>
              </div>
            </div>

            <div className="text-center">
              <Link
                to="/signin"
                className="font-medium text-main hover:text-main-dark transition-colors"
              >
                Back to sign in
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
