import UserService from '../models/User.js';
import jwt from 'jsonwebtoken';
import { authLogger } from '../utils/logger.js';
import { sendEmailVerificationEmail } from '../utils/email.js';

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
    const { name: userName, email, password } = req.body;

    authLogger.info('Registration attempt started', { email, userName });

    // Validation
    if (!userName || !email || !password) {
      authLogger.warning('Registration validation failed: missing required fields', { userName: !!userName, email: !!email, password: !!password });
      return res.status(400).json({ message: 'Please add all fields' });
    }

    if (password.length < 6) {
      authLogger.warning('Registration validation failed: password too short', { passwordLength: password.length });
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    // Check if user exists
    const userExists = await UserService.findByEmail(email);
    if (userExists) {
      authLogger.warning('Registration failed: user already exists', { email, existingUserId: userExists.id });
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create user with email verification
    authLogger.info('Creating new user account with email verification', { email, userName });
    const result = await UserService.createUserWithEmailVerification({
      name: userName,
      email,
      password,
    });

    if (result) {
      authLogger.success('User registration initiated, verification email sent', {
        userId: result.user.id,
        email: result.user.email,
        userName: result.user.name
      });

      // Send email verification
      try {
        await sendEmailVerificationEmail(
          result.user.email,
          result.verificationToken,
          result.verificationCode,
          result.user.name
        );
        authLogger.info('Email verification sent successfully', { email: result.user.email });
      } catch (emailError) {
        authLogger.error('Failed to send verification email, but user created', { email: result.user.email, error: emailError.message });
        // Don't fail registration if email fails, but log it
      }

      res.status(201).json({
        message: 'Registration successful! Please check your email to verify your account.',
        user: {
          id: result.user.id,
          name: result.user.name,
          email: result.user.email,
          is_verified: false
        }
      });
    } else {
      authLogger.error('User creation failed: invalid user data returned', { email, userName });
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    authLogger.error('Registration process failed with exception', { email, userName }, error);
    res.status(500).json({ message: 'Server error occurred during registration' });
  }
};

// @desc    Verify email using token or 6-digit code
// @route   POST /api/auth/verify-email
// @access  Public
export const verifyEmail = async (req, res) => {
  try {
    const { token, code } = req.body;
    const tokenOrCode = token || code;

    authLogger.info('Email verification attempt started', { hasToken: !!token, hasCode: !!code });

    // Validation
    if (!tokenOrCode) {
      authLogger.warning('Email verification validation failed: missing token or code');
      return res.status(400).json({ message: 'Please provide verification token or 6-digit code' });
    }

    // Verify email
    const user = await UserService.verifyEmail(tokenOrCode);

    authLogger.success('Email verification successful', {
      userId: user.id,
      name: user.name,
      email: user.email,
      method: /^\d{6}$/.test(tokenOrCode) ? 'code' : 'token'
    });

    // Generate JWT token for immediate login after verification
    const jwtToken = generateToken(user.id);

    res.json({
      message: 'Email verified successfully! Welcome to CaravaGo.',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        is_verified: user.is_verified
      },
      token: jwtToken
    });
  } catch (error) {
    authLogger.error('Email verification failed', { token: !!req.body.token, code: !!req.body.code }, error);
    res.status(400).json({ message: error.message });
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
      authLogger.warning('Login validation failed: missing credentials', { hasEmail: !!email, hasPassword: !!password });
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

    const token = generateToken(user.id);

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      token: token,
    });
  } catch (error) {
    authLogger.error('Login process failed with exception', { email }, error);
    res.status(500).json({ message: 'Server error occurred during login' });
  }
};

// @desc    Logout user / clear cookie
// @route   POST /api/auth/logout
// @access  Public
export const logout = async (req, res) => {
  try {
    authLogger.info('User logout initiated', { userId: req.user?.id });

    authLogger.success('User logout successful', { userId: req.user?.id });

    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    authLogger.error('Logout process failed with exception', { userId: req.user?.id }, error);
    res.status(500).json({ message: 'Server error occurred during logout' });
  }
};

// @desc    Forgot password - send reset email
// @route   POST /api/auth/forgot-password
// @access  Public
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    authLogger.info('Forgot password request started', { email });

    // Validation
    if (!email) {
      authLogger.warning('Forgot password validation failed: missing email');
      return res.status(400).json({ message: 'Please provide an email address' });
    }

    // Check if email format is valid
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      authLogger.warning('Forgot password validation failed: invalid email format', { email });
      return res.status(400).json({ message: 'Please provide a valid email address' });
    }

    // Generate reset token and send email
    const result = await UserService.forgotPassword(email);

    authLogger.success('Forgot password request processed', {
      email,
      success: result.success,
      message: result.message
    });

    res.json({ message: result.message });
  } catch (error) {
    authLogger.error('Forgot password process failed with exception', { email: req.body.email }, error);
    res.status(500).json({ message: 'Server error occurred during password reset request' });
  }
};

// @desc    Reset password using token
// @route   POST /api/auth/reset-password
// @access  Public
export const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;

    authLogger.info('Password reset request started');

    // Validation
    if (!token || !password) {
      authLogger.warning('Password reset validation failed: missing token or password');
      return res.status(400).json({ message: 'Please provide token and new password' });
    }

    if (password.length < 6) {
      authLogger.warning('Password reset validation failed: password too short');
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    // Reset password
    const user = await UserService.resetPassword(token, password);

    authLogger.success('Password reset successful', {
      userId: user.id,
      email: user.email
    });

    // Generate new JWT token for the user
    const newToken = generateToken(user.id);

    res.json({
      message: 'Password reset successful',
      id: user.id,
      name: user.name,
      email: user.email,
      token: newToken
    });
  } catch (error) {
    authLogger.error('Password reset process failed with exception', null, error);
    res.status(400).json({ message: error.message || 'Server error occurred during password reset' });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { firstName, lastName, phone, address, bio } = req.body;

    authLogger.info('Profile update attempt started', { userId });

    // Validation - ensure at least one field is provided
    if (!firstName && !lastName && !phone && !address && !bio) {
      authLogger.warning('Profile update validation failed: no fields provided', { userId });
      return res.status(400).json({ message: 'Please provide at least one field to update' });
    }

    // Validate phone format if provided
    if (phone && phone.trim()) {
      const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
      if (!phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''))) {
        authLogger.warning('Profile update validation failed: invalid phone format', { userId, phone });
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

    authLogger.success('Profile update successful', {
      userId: updatedUser.id,
      email: updatedUser.email,
      updatedFields: Object.keys(req.body)
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
    authLogger.error('Profile update failed with exception', { userId: req.user?.id }, error);
    res.status(500).json({ message: 'Server error occurred while updating profile' });
  }
};

// @desc    Verify JWT token
// @route   POST /api/auth/verify-token
// @access  Public
export const verifyToken = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      authLogger.warning('Token verification failed: no token provided');
      return res.status(400).json({
        valid: false,
        message: 'No token provided'
      });
    }

    authLogger.info('Token verification attempt started');

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get user from the token
    const user = await UserService.findById(decoded.id);

    if (!user) {
      authLogger.warning('Token verification failed: user not found', { userId: decoded.id });
      return res.status(401).json({
        valid: false,
        message: 'User not found'
      });
    }

    authLogger.success('Token verification successful', {
      userId: user.id,
      email: user.email,
      name: user.name
    });

    res.json({
      valid: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        is_verified: user.is_verified,
        is_owner: user.is_owner
      },
      message: 'Token is valid'
    });

  } catch (error) {
    authLogger.error('Token verification failed with exception', error);

    // Handle specific JWT errors
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        valid: false,
        message: 'Invalid token format'
      });
    }

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        valid: false,
        message: 'Token has expired'
      });
    }

    res.status(500).json({
      valid: false,
      message: 'Server error occurred during token verification'
    });
  }
};

