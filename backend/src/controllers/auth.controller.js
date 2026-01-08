import UserService from '../models/User.js';
import jwt from 'jsonwebtoken';
import { authLogger } from '../utils/logger.js';

import dotenv from 'dotenv';

dotenv.config({ path: '../.env' });

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res) => {
  try {
    const {
      name: userName,
      email,
      password,
      avatar_url,
      phone,
      bio,
      is_owner = false
    } = req.body;

    authLogger.info('Registration attempt started', { email, userName });

    // Validation
    if (!userName || !email || !password) {
      authLogger.warning('Registration validation failed: missing required fields', {
        userName: !!userName,
        email: !!email,
        password: !!password
      });
      return res.status(400).json({ message: 'Please add all required fields: name, email, and password' });
    }

    if (password.length < 6) {
      authLogger.warning('Registration validation failed: password too short', {
        passwordLength: password.length
      });
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      authLogger.warning('Registration validation failed: invalid email format', { email });
      return res.status(400).json({ message: 'Please provide a valid email address' });
    }

    // Validate phone format if provided (basic validation)
    if (phone && phone.length > 20) {
      authLogger.warning('Registration validation failed: phone too long', { phone });
      return res.status(400).json({ message: 'Phone number must be 20 characters or less' });
    }

    // Check if user exists
    const userExists = await UserService.findByEmail(email);
    if (userExists) {
      authLogger.warning('Registration failed: user already exists', {
        email,
        existingUserId: userExists.id
      });
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create user
    authLogger.info('Creating new user account', { email, userName });
    const user = await UserService.createUser({
      name: userName,
      email,
      password,
      avatar_url,
      phone,
      bio,
      is_owner
    });

    if (user) {
      authLogger.success('User registration successful', {
        userId: user.id,
        email: user.email,
        userName: user.name,
        is_owner: user.is_owner
      });

      res.status(201).json({
        id: user.id,
        name: user.name,
        email: user.email,
        avatar_url: user.avatar_url,
        phone: user.phone,
        bio: user.bio,
        is_verified: user.is_verified,
        is_owner: user.is_owner,
        token: generateToken(user.id),
      });
    } else {
      authLogger.error('User creation failed: invalid user data returned', { email, userName });
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    if (error.message === 'User already exists with this email') {
      authLogger.warning('Registration failed: email already exists', { email: req.body?.email });
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    authLogger.error('Registration process failed with exception', {
      email: req.body?.email,
      userName: req.body?.name
    }, error);
    res.status(500).json({
      message: 'Server error occurred during registration',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    authLogger.info('Login attempt started', { email });

    // Validation
    if (!email || !password) {
      authLogger.warning('Login validation failed: missing credentials', {
        hasEmail: !!email,
        hasPassword: !!password
      });
      return res.status(400).json({ message: 'Please add email and password' });
    }

    // Check for user email
    const user = await UserService.findByEmail(email);
    if (!user) {
      authLogger.warning('Login failed: user not found', { email });
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    authLogger.info('User found, verifying password', { userId: user.id, email });

    // Check password
    const isMatch = await UserService.verifyPassword(password, user.password);
    if (!isMatch) {
      authLogger.warning('Login failed: incorrect password', { userId: user.id, email });
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    authLogger.success('User login successful', {
      userId: user.id,
      email: user.email,
      name: user.name
    });

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      avatar_url: user.avatar_url,
      phone: user.phone,
      bio: user.bio,
      is_verified: user.is_verified,
      is_owner: user.is_owner,
      token: generateToken(user.id),
    });
  } catch (error) {
    authLogger.error('Login process failed with exception', { email }, error);
    res.status(500).json({
      message: 'Server error occurred during login',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res) => {
  try {
    const userId = req.user.id;
    authLogger.info('Fetching current user data', { userId });

    const user = await UserService.findById(userId);
    if (!user) {
      authLogger.warning('Current user not found', { userId });
      return res.status(404).json({ message: 'User not found' });
    }

    authLogger.success('Current user data retrieved', {
      userId: user.id,
      email: user.email,
      name: user.name
    });

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      avatar_url: user.avatar_url,
      phone: user.phone,
      bio: user.bio,
      is_verified: user.is_verified,
      is_owner: user.is_owner,
      stripe_customer_id: user.stripe_customer_id,
      created_at: user.created_at,
      updated_at: user.updated_at
    });
  } catch (error) {
    authLogger.error('Failed to retrieve current user data', { userId: req.user?.id }, error);
    res.status(500).json({
      message: 'Server error occurred while retrieving user data',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, avatar_url, phone, bio, is_owner } = req.body;

    authLogger.info('Profile update attempt started', { userId });

    // Prepare update data
    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (avatar_url !== undefined) updateData.avatar_url = avatar_url;
    if (phone !== undefined) {
      // Validate phone format if provided
      if (phone && phone.length > 20) {
        authLogger.warning('Profile update validation failed: phone too long', { userId, phone });
        return res.status(400).json({ message: 'Phone number must be 20 characters or less' });
      }
      updateData.phone = phone;
    }
    if (bio !== undefined) updateData.bio = bio;
    if (is_owner !== undefined) {
      // Only allow setting is_owner, not unsetting it (business logic)
      if (is_owner === true) {
        updateData.is_owner = true;
      }
    }

    if (Object.keys(updateData).length === 0) {
      authLogger.warning('Profile update failed: no data provided', { userId });
      return res.status(400).json({ message: 'No data provided to update' });
    }

    const updatedUser = await UserService.updateUser(userId, updateData);

    authLogger.success('Profile updated successfully', {
      userId: updatedUser.id,
      email: updatedUser.email
    });

    res.json({
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      avatar_url: updatedUser.avatar_url,
      phone: updatedUser.phone,
      bio: updatedUser.bio,
      is_verified: updatedUser.is_verified,
      is_owner: updatedUser.is_owner,
      stripe_customer_id: updatedUser.stripe_customer_id,
      created_at: updatedUser.created_at,
      updated_at: updatedUser.updated_at
    });
  } catch (error) {
    if (error.message === 'No data provided to update') {
      authLogger.warning('Profile update failed: no data', { userId: req.user?.id });
      return res.status(400).json({ message: error.message });
    }

    authLogger.error('Profile update failed with exception', { userId: req.user?.id }, error);
    res.status(500).json({
      message: 'Server error occurred during profile update',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Update user password
// @route   PUT /api/auth/password
// @access  Private
export const updatePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;

    authLogger.info('Password update attempt started', { userId });

    // Validation
    if (!currentPassword || !newPassword) {
      authLogger.warning('Password update validation failed: missing fields', {
        userId,
        hasCurrentPassword: !!currentPassword,
        hasNewPassword: !!newPassword
      });
      return res.status(400).json({
        message: 'Please provide both current password and new password'
      });
    }

    if (newPassword.length < 6) {
      authLogger.warning('Password update validation failed: new password too short', {
        userId,
        passwordLength: newPassword.length
      });
      return res.status(400).json({
        message: 'New password must be at least 6 characters long'
      });
    }

    // Get current user to verify current password
    const user = await UserService.findByEmail(req.user.email);
    if (!user) {
      authLogger.warning('Password update failed: user not found', { userId });
      return res.status(404).json({ message: 'User not found' });
    }

    // Verify current password
    const isMatch = await UserService.verifyPassword(currentPassword, user.password);
    if (!isMatch) {
      authLogger.warning('Password update failed: incorrect current password', { userId });
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    // Update password
    await UserService.updatePassword(userId, newPassword);

    authLogger.success('Password updated successfully', {
      userId,
      email: user.email
    });

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    authLogger.error('Password update failed with exception', { userId: req.user?.id }, error);
    res.status(500).json({
      message: 'Server error occurred during password update',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};