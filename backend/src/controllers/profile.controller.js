import UserService from '../models/User.js';
import { logger } from '../utils/logger.js';

// @desc    Update user profile
// @route   PUT /api/profile
// @access  Private
export const updateProfile = async (req, res) => {
    try {
      const userId = req.user.id;
      const { firstName, lastName, phone, address, bio } = req.body;
    
      // Validation - ensure at least one field is provided
      if (!firstName && !lastName && !phone && !address && !bio) {
        return res.status(400).json({ message: 'Please provide at least one field to update' });
      }
  
      // Validate phone format if provided
      if (phone && phone.trim()) {
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        if (!phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''))) {
          return res.status(400).json({ message: 'Please provide a valid phone number' });
        }
      }
  
      // Validate name lengths if provided
      if (firstName && firstName.length > 50) {
        return res.status(400).json({ message: 'First name must be less than 50 characters' });
      }
      if (lastName && lastName.length > 50) {
        return res.status(400).json({ message: 'Last name must be less than 50 characters' });
      }
  
      // Validate bio length if provided
      if (bio && bio.length > 500) {
        return res.status(400).json({ message: 'Bio must be less than 500 characters' });
      }
  
      // Update profile
      const updatedUser = await UserService.updateProfile(userId, {
        firstName: firstName?.trim(),
        lastName: lastName?.trim(),
        phone: phone?.trim(),
        address: address?.trim(),
        bio: bio?.trim()
      });
  
      res.json({
        message: 'Profile updated successfully',
        user: {
          id: updatedUser.id,
          firstName: updatedUser.firstName,
          lastName: updatedUser.lastName,
          name: updatedUser.name,
          email: updatedUser.email,
          phone: updatedUser.phone,
          address: updatedUser.address,
          bio: updatedUser.bio,
          avatar_url: updatedUser.avatar_url,
          is_verified: updatedUser.is_verified,
          is_owner: updatedUser.is_owner
        }
      });
    } catch (error) {
      res.status(500).json({ message: 'Server error occurred while updating profile' });
    }
};