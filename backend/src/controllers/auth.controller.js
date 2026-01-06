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

    // Create user
    authLogger.info('Creating new user account', { email, userName });
    const user = await UserService.createUser({
      name: userName,
      email,
      password,
    });

    if (user) {
      authLogger.success('User registration successful', {
        userId: user.id,
        email: user.email,
        userName: user.name
      });

      const token = generateToken(user.id);

      // Set HTTP-only cookie with JWT token
      res.cookie('token', token, {
        httpOnly: true, // Prevents JavaScript access to the cookie
        secure: process.env.NODE_ENV === 'production', // HTTPS only in production
        sameSite: 'strict', // CSRF protection
        maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days in milliseconds
      });

      res.status(201).json({
        id: user.id,
        name: user.name,
        email: user.email,
        token: token, // Still return token in response for frontend flexibility
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

    // Set HTTP-only cookie with JWT token
    res.cookie('token', token, {
      httpOnly: true, // Prevents JavaScript access to the cookie
      secure: process.env.NODE_ENV === 'production', // HTTPS only in production
      sameSite: 'strict', // CSRF protection
      maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days in milliseconds
    });

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      token: token, // Still return token in response for frontend flexibility
    });
  } catch (error) {
    authLogger.error('Login process failed with exception', { email }, error);
    res.status(500).json({ message: 'Server error occurred during login' });
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
    });
  } catch (error) {
    authLogger.error('Failed to retrieve current user data', { userId: req.user?.id }, error);
    res.status(500).json({ message: 'Server error occurred while retrieving user data' });
  }
};

// @desc    Logout user / clear cookie
// @route   POST /api/auth/logout
// @access  Public
export const logout = async (req, res) => {
  try {
    authLogger.info('User logout initiated', { userId: req.user?.id });

    // Clear the authentication cookie
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    });

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

    // Set HTTP-only cookie with new JWT token
    res.cookie('token', newToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days in milliseconds
    });

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

