import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { sendPasswordResetEmail, sendPasswordResetSuccessEmail } from '../utils/email.js';

// User Schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  avatar_url: {
    type: String,
    default: null
  },
  phone: {
    type: String,
    default: null
  },
  address: {
    type: String,
    default: null,
    trim: true
  },
  bio: {
    type: String,
    default: null
  },
  is_verified: {
    type: Boolean,
    default: false
  },
  is_owner: {
    type: Boolean,
    default: false
  },
  stripe_customer_id: {
    type: String,
    default: null
  },
  passwordResetToken: {
    type: String,
    default: null
  },
  passwordResetExpires: {
    type: Date,
    default: null
  },
  emailVerificationToken: {
    type: String,
    default: null
  },
  emailVerificationCode: {
    type: String,
    default: null
  },
  emailVerificationExpires: {
    type: Date,
    default: null
  }
}, {
  timestamps: true // This creates createdAt and updatedAt automatically
});

// Index for email lookups
userSchema.index({ email: 1 });

// Pre-save middleware to hash password
userSchema.pre('save', async function(next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) return next();

  try {
    // Hash password with cost of 12
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Instance method to check password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Static method to find user by email
userSchema.statics.findByEmail = function(email) {
  return this.findOne({ email: email.toLowerCase() });
};

// Static method to find user by ID (excluding password)
userSchema.statics.findByIdSafe = function(id) {
  return this.findById(id).select('-password');
};

// Virtual for id to return _id as id for frontend compatibility
userSchema.virtual('id').get(function() {
  return this._id.toHexString();
});

// Ensure virtual fields are serialised
userSchema.set('toJSON', {
  virtuals: true,
});

// Create the model
const User = mongoose.model('User', userSchema);

class UserService {
  // Create a new user
  static async createUser(userData) {
    try {
      const {
        name,
        email,
        password,
        avatar_url,
        phone,
        bio,
        is_verified = false,
        is_owner = false
      } = userData;

      dbLogger.info('Creating new user', { email, name });

      // Create new user (password will be hashed by pre-save middleware)
      const user = new User({
        name,
        email: email.toLowerCase(),
        password
      });

      // Save user (this will trigger the pre-save middleware)
      const savedUser = await user.save();

      // Return user without password
      const userWithoutPassword = savedUser.toObject();
      delete userWithoutPassword.password;

      return userWithoutPassword;
    } catch (error) {
      // Handle duplicate key error
      if (error.code === 11000) {
        throw new Error('User already exists with this email');
      }
      throw error;
    }
  }

  // Create user with email verification
  static async createUserWithEmailVerification(userData) {
    try {
      const { name, email, password } = userData;

      // Generate email verification token
      const verificationToken = crypto.randomBytes(32).toString('hex');

      // Generate 6-digit verification code
      const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

      // Create new user (password will be hashed by pre-save middleware)
      const user = new User({
        name,
        email: email.toLowerCase(),
        password,
        emailVerificationToken: crypto.createHash('sha256').update(verificationToken).digest('hex'),
        emailVerificationCode: verificationCode,
        emailVerificationExpires: Date.now() + 24 * 60 * 60 * 1000 // 24 hours
      });

      // Save user (this will trigger the pre-save middleware)
      const savedUser = await user.save();

      // Return user data needed for email
      return {
        user: {
          id: savedUser._id,
          name: savedUser.name,
          email: savedUser.email
        },
        verificationToken,
        verificationCode
      };
    } catch (error) {
      // Handle duplicate key error
      if (error.code === 11000) {
        throw new Error('User already exists with this email');
      }
      throw error;
    }
  }

  // Verify email using token or 6-digit code
  static async verifyEmail(tokenOrCode) {
    try {
      let user;

      // Check if it's a 6-digit code or a token
      if (/^\d{6}$/.test(tokenOrCode)) {
        // It's a 6-digit code
        user = await User.findOne({
          emailVerificationCode: tokenOrCode,
          emailVerificationExpires: { $gt: Date.now() }
        });
      } else {
        // It's a token - hash it and compare
        const hashedToken = crypto.createHash('sha256').update(tokenOrCode).digest('hex');
        user = await User.findOne({
          emailVerificationToken: hashedToken,
          emailVerificationExpires: { $gt: Date.now() }
        });
      }

      if (!user) {
        throw new Error('Verification code/token is invalid or has expired');
      }

      if (user.is_verified) {
        throw new Error('Email is already verified');
      }

      // Mark email as verified
      user.is_verified = true;
      user.emailVerificationToken = null;
      user.emailVerificationCode = null;
      user.emailVerificationExpires = null;

      await user.save();

      // Return user without password - ensure virtuals are included
      const userWithoutPassword = user.toJSON({ virtuals: true });
      delete userWithoutPassword.password;
      delete userWithoutPassword.emailVerificationToken;
      delete userWithoutPassword.emailVerificationCode;
      delete userWithoutPassword.emailVerificationExpires;

      // Ensure id is available as a string
      userWithoutPassword.id = user._id.toString();

      return userWithoutPassword;
    } catch (error) {
      dbLogger.error('User creation failed', { email: userData?.email }, error);
      throw error;
    }
  }

  // Find user by email
  static async findByEmail(email) {
    try {
      return await User.findByEmail(email);
    } catch (error) {
      dbLogger.error('Failed to find user by email', { email }, error);
      throw error;
    }
  }

  // Find user by ID (excluding password)
  static async findById(id) {
    try {
      return await User.findByIdSafe(id);
    } catch (error) {
      throw error;
    }
  }

  // Find user by ID with password (for authentication)
  static async findByIdWithPassword(id) {
    try {
      return await User.findById(id);
    } catch (error) {
      dbLogger.error('Password update failed', { user_id: id }, error);
      throw error;
    }
  }

  // Verify password
  static async verifyPassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  // Update user profile
  static async updateProfile(userId, profileData) {
    try {
      const { firstName, lastName, phone, address, bio, avatar_url } = profileData;

      // Build update object with only provided fields
      const updateData = {};
      if (firstName !== undefined) updateData.firstName = firstName;
      if (lastName !== undefined) updateData.lastName = lastName;
      if (phone !== undefined) updateData.phone = phone;
      if (address !== undefined) updateData.address = address;
      if (bio !== undefined) updateData.bio = bio;
      if (avatar_url !== undefined) updateData.avatar_url = avatar_url;

      // If firstName or lastName is being updated, also update the main name field
      if (firstName !== undefined || lastName !== undefined) {
        // Get current user to check existing values
        const currentUser = await User.findById(userId);
        if (currentUser) {
          const newFirstName = firstName !== undefined ? firstName : currentUser.firstName || '';
          const newLastName = lastName !== undefined ? lastName : currentUser.lastName || '';

          // Update the main name field by combining firstName and lastName
          if (newFirstName || newLastName) {
            updateData.name = `${newFirstName} ${newLastName}`.trim();
          }
        }
      }

      // Update user
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        updateData,
        {
          new: true,
          runValidators: true,
          select: '-password -passwordResetToken -passwordResetExpires -emailVerificationToken -emailVerificationCode -emailVerificationExpires'
        }
      );

      if (!updatedUser) {
        throw new Error('User not found');
      }

      // Return user with virtuals
      return updatedUser.toJSON({ virtuals: true });
    } catch (error) {
      throw error;
    }
  }

  // Instance method access
  static async comparePassword(user, candidatePassword) {
    return await user.comparePassword(candidatePassword);
  }

  // Forgot password - generate token and send email
  static async forgotPassword(email) {
    try {
      const user = await User.findByEmail(email);
      if (!user) {
        // Don't reveal if user exists or not for security
        return { success: true, message: 'If an account with that email exists, a password reset link has been sent.' };
      }

      // Generate reset token
      const resetToken = crypto.randomBytes(32).toString('hex');

      // Hash token and set to resetPasswordToken field
      user.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');

      // Set expire time (10 minutes)
      user.passwordResetExpires = Date.now() + 10 * 60 * 1000;

      await user.save();

      // Send password reset email
      await sendPasswordResetEmail(email, resetToken);

      return { success: true, message: 'Password reset link sent to your email.' };
    } catch (error) {
      throw error;
    }
  }

  // Reset password using token
  static async resetPassword(token, newPassword) {
    try {
      // Hash the token to compare with stored hash
      const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

      // Find user with valid token that hasn't expired
      const user = await User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: { $gt: Date.now() }
      });

      if (!user) {
        throw new Error('Token is invalid or has expired');
      }

      // Set new password (will be hashed by pre-save middleware)
      user.password = newPassword;
      user.passwordResetToken = null;
      user.passwordResetExpires = null;

      await user.save();

      // Send password reset success email
      await sendPasswordResetSuccessEmail(user.email);

      return user;
    } catch (error) {
      throw error;
    }
  }

  // Get user bookings (as renter)
  static async getUserBookings(userId) {
    try {
      // Since we're using MongoDB but the schema shows SQL,
      // I'll implement basic MongoDB queries for now
      // In a real implementation, you'd have separate models for Bookings, etc.

      // For now, return empty array - this would be implemented with proper models
      return [];
    } catch (error) {
      throw error;
    }
  }

  // Get user listings (as owner)
  static async getUserListings(userId) {
    try {
      // Return empty array - this would be implemented with proper Listing model
      return [];
    } catch (error) {
      throw error;
    }
  }

  // Get user reviews (received reviews)
  static async getUserReviews(userId) {
    try {
      // Return empty array - this would be implemented with proper Review model
      return [];
    } catch (error) {
      throw error;
    }
  }

  // Get user favorites
  static async getUserFavorites(userId) {
    try {
      // Return empty array - this would be implemented with proper Favorite model
      return [];
    } catch (error) {
      throw error;
    }
  }

  // Get user messages
  static async getUserMessages(userId) {
    try {
      // Return empty array - this would be implemented with proper Message model
      return [];
    } catch (error) {
      throw error;
    }
  }

  // Get user notifications
  static async getUserNotifications(userId) {
    try {
      // Return empty array - this would be implemented with proper Notification model
      return [];
    } catch (error) {
      throw error;
    }
  }

  // Mark notification as read
  static async markNotificationAsRead(userId, notificationId) {
    try {
      // Return false - this would be implemented with proper Notification model
      return false;
    } catch (error) {
      throw error;
    }
  }
}

export default UserService;
export { User };

