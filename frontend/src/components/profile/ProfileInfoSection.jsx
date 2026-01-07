import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';

const ProfileInfoSection = () => {
  const { user } = useAuth();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-4"
    >
      {/* Profile Header */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary-dark rounded-xl flex items-center justify-center">
            {user?.avatar_url ? (
              <img src={user.avatar_url} alt={user.name} className="w-16 h-16 rounded-xl object-cover" />
            ) : (
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
            )}
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 font-lexend">{user?.name}</h2>
            <p className="text-gray-600 text-sm">{user?.is_owner ? 'RV Owner' : 'Traveler'}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <label className="block text-xs font-bold text-gray-600 mb-1">Email</label>
            <p className="text-gray-900 text-sm">{user?.email}</p>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <label className="block text-xs font-bold text-gray-600 mb-1">Phone</label>
            <p className="text-gray-900 text-sm">{user?.phone || 'Not provided'}</p>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 md:col-span-2">
            <label className="block text-xs font-bold text-gray-600 mb-1">About</label>
            <p className="text-gray-900 text-sm">{user?.bio || 'No bio provided yet.'}</p>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-gray-200">
          <button className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg font-semibold transition-colors text-sm">
            Edit Profile
          </button>
        </div>
      </div>

      {/* Account Details */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4 font-lexend">Account Details</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
            <span className="text-sm font-medium text-gray-600">Member Since</span>
            <span className="text-sm text-gray-900">Jan 2025</span>
          </div>

          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
            <span className="text-sm font-medium text-gray-600">Account Type</span>
            <span className="text-sm text-gray-900">{user?.is_owner ? 'Owner' : 'Renter'}</span>
          </div>

          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
            <span className="text-sm font-medium text-gray-600">Verification</span>
            <span className={`text-sm font-medium ${user?.is_verified ? 'text-green-700' : 'text-yellow-700'}`}>
              {user?.is_verified ? 'Verified' : 'Pending'}
            </span>
          </div>

          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
            <span className="text-sm font-medium text-gray-600">Stripe ID</span>
            <span className="text-sm text-gray-900">{user?.stripe_customer_id ? 'Connected' : 'Not set'}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProfileInfoSection;
