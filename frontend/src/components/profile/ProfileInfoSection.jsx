import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import Button from '../ui/Button';
import Notification from '../ui/Notification';

const ProfileInfoSection = () => {
  const { user, login } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({ message: '', type: 'error', isVisible: false });
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    address: '',
    bio: ''
  });

  // Initialize form data when user data is available or when entering edit mode
  useEffect(() => {
    if (user && isEditing) {
      // Split the full name into first and last name on first edit
      let firstName = user.firstName || '';
      let lastName = user.lastName || '';

      // If we don't have separate first/last names but have a full name, split it
      if ((!firstName || !lastName) && user.name && !user.firstName && !user.lastName) {
        const nameParts = user.name.trim().split(' ');
        if (nameParts.length >= 2) {
          firstName = nameParts[0];
          lastName = nameParts.slice(1).join(' ');
        } else {
          firstName = user.name;
        }
      }

      setFormData({
        firstName: firstName,
        lastName: lastName,
        phone: user.phone || '',
        address: user.address || '',
        bio: user.bio || ''
      });
    }
  }, [user, isEditing]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEdit = () => {
    setIsEditing(true);
    setNotification({ message: '', type: 'error', isVisible: false });
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      phone: user?.phone || '',
      address: user?.address || '',
      bio: user?.bio || ''
    });
  };

  const handleSave = async () => {
    setLoading(true);
    setNotification({ message: '', type: 'error', isVisible: false });

    try {
      const response = await api.put('/auth/profile', formData);

      // Update the user context with new data
      login(response.data.user);

      setNotification({
        message: 'Profile updated successfully!',
        type: 'success',
        isVisible: true
      });

      setIsEditing(false);

      // Hide notification after 3 seconds
      setTimeout(() => {
        setNotification({ ...notification, isVisible: false });
      }, 3000);

    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to update profile';
      setNotification({
        message: errorMessage,
        type: 'error',
        isVisible: true
      });
    } finally {
      setLoading(false);
    }
  };

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
          {/* First Name */}
          <div className={`${isEditing ? '' : 'bg-gray-50'} rounded-lg p-4`}>
            {isEditing ? (
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-2">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  placeholder="Enter first name"
                  maxLength="50"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            ) : (
              <>
                <label className="block text-xs font-bold text-gray-600 mb-1">First Name</label>
                <p className="text-gray-900 text-sm">{formData.firstName || 'Not provided'}</p>
              </>
            )}
          </div>

          {/* Last Name */}
          <div className={`${isEditing ? '' : 'bg-gray-50'} rounded-lg p-4`}>
            {isEditing ? (
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-2">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  placeholder="Enter last name"
                  maxLength="50"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            ) : (
              <>
                <label className="block text-xs font-bold text-gray-600 mb-1">Last Name</label>
                <p className="text-gray-900 text-sm">{formData.lastName || 'Not provided'}</p>
              </>
            )}
          </div>

          {/* Email - Read only */}
          <div className="bg-gray-50 rounded-lg p-4">
            <label className="block text-xs font-bold text-gray-600 mb-1">Email</label>
            <p className="text-gray-900 text-sm">{user?.email}</p>
          </div>

          {/* Phone */}
          <div className={`${isEditing ? '' : 'bg-gray-50'} rounded-lg p-4`}>
            {isEditing ? (
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-2">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Enter phone number"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            ) : (
              <>
                <label className="block text-xs font-bold text-gray-600 mb-1">Phone</label>
                <p className="text-gray-900 text-sm">{user?.phone || 'Not provided'}</p>
              </>
            )}
          </div>

          {/* Address */}
          <div className={`${isEditing ? '' : 'bg-gray-50'} rounded-lg p-4 md:col-span-2`}>
            {isEditing ? (
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-2">Address</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Enter address"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            ) : (
              <>
                <label className="block text-xs font-bold text-gray-600 mb-1">Address</label>
                <p className="text-gray-900 text-sm">{user?.address || 'Not provided'}</p>
              </>
            )}
          </div>

          {/* Bio/About */}
          <div className={`${isEditing ? '' : 'bg-gray-50'} rounded-lg p-4 md:col-span-2`}>
            {isEditing ? (
              <div>
                <label htmlFor="bio" className="block text-xs font-bold text-gray-600 mb-2">
                  About
                </label>
                <textarea
                  id="bio"
                  name="bio"
                  rows="3"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                  value={formData.bio}
                  onChange={handleInputChange}
                  placeholder="Tell us about yourself..."
                  maxLength="500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  {formData.bio.length}/500 characters
                </p>
              </div>
            ) : (
              <>
                <label className="block text-xs font-bold text-gray-600 mb-1">About</label>
                <p className="text-gray-900 text-sm">{user?.bio || 'No bio provided yet.'}</p>
              </>
            )}
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-gray-200">
          {isEditing ? (
            <div className="flex space-x-3">
              <Button
                onClick={handleCancel}
                variant="outline"
                className="text-sm flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                loading={loading}
                className="text-sm flex-1"
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          ) : (
            <button
              onClick={handleEdit}
              className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg font-semibold transition-colors text-sm"
            >
              Edit Profile
            </button>
          )}
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
        </div>
      </div>

      <Notification
        message={notification.message}
        type={notification.type}
        isVisible={notification.isVisible}
        onClose={() => setNotification({ ...notification, isVisible: false })}
      />
    </motion.div>
  );
};

export default ProfileInfoSection;
