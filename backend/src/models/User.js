import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

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
      const { name, email, password } = userData;

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

  // Find user by email
  static async findByEmail(email) {
    try {
      return await User.findByEmail(email);
    } catch (error) {
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
      throw error;
    }
  }

  // Verify password
  static async verifyPassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  // Instance method access
  static async comparePassword(user, candidatePassword) {
    return await user.comparePassword(candidatePassword);
  }
}

export default UserService;
export { User };

