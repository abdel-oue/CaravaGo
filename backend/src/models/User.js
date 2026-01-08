import { supabase } from '../config/db.js';
import bcrypt from 'bcrypt';
import { dbLogger } from '../utils/logger.js';

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

      // Hash the password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Insert user into Supabase
      const { data, error } = await supabase
        .from('users')
        .insert([
          {
            name,
            email: email.toLowerCase(),
            password: hashedPassword,
            avatar_url,
            phone,
            bio,
            is_verified,
            is_owner
          }
        ])
        .select()
        .single();

      if (error) {
        // Handle unique constraint violation
        if (error.code === '23505') {
          dbLogger.warning('User creation failed: email already exists', { email });
          throw new Error('User already exists with this email');
        }
        dbLogger.error('Failed to create user', { email, name }, error);
        throw error;
      }

      // Remove password from response
      const { password: _, ...userWithoutPassword } = data;

      dbLogger.success('User created successfully', {
        user_id: userWithoutPassword.id,
        email: userWithoutPassword.email,
        name: userWithoutPassword.name
      });

      return userWithoutPassword;
    } catch (error) {
      dbLogger.error('User creation failed', { email: userData?.email }, error);
      throw error;
    }
  }

  // Find user by email
  static async findByEmail(email) {
    try {
      dbLogger.info('Finding user by email', { email });

      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email.toLowerCase())
        .single();

      if (error && error.code !== 'PGRST116') {
        dbLogger.error('Failed to find user by email', { email }, error);
        throw error;
      }

      if (!data) {
        dbLogger.warning('User not found by email', { email });
        return null;
      }

      dbLogger.success('User found by email', {
        user_id: data.id,
        email: data.email
      });

      return data;
    } catch (error) {
      dbLogger.error('Failed to find user by email', { email }, error);
      throw error;
    }
  }

  // Find user by ID
  static async findById(id) {
    try {
      dbLogger.info('Finding user by ID', { user_id: id });

      const { data, error } = await supabase
        .from('users')
        .select('id, name, email, avatar_url, phone, bio, is_verified, is_owner, stripe_customer_id, created_at, updated_at')
        .eq('id', id)
        .single();

      if (error && error.code !== 'PGRST116') {
        dbLogger.error('Failed to find user by ID', { user_id: id }, error);
        throw error;
      }

      if (!data) {
        dbLogger.warning('User not found by ID', { user_id: id });
        return null;
      }

      dbLogger.success('User found by ID', {
        user_id: data.id,
        email: data.email
      });

      return data;
    } catch (error) {
      dbLogger.error('Failed to find user by ID', { user_id: id }, error);
      throw error;
    }
  }

  // Update user
  static async updateUser(id, updateData) {
    try {
      dbLogger.info('Updating user', { user_id: id });

      // Don't allow updating password through this method (use separate method)
      const { password, ...safeUpdateData } = updateData;

      // Prepare update data (remove undefined values)
      const updatePayload = Object.fromEntries(
        Object.entries(safeUpdateData).filter(([_, v]) => v !== undefined)
      );

      if (Object.keys(updatePayload).length === 0) {
        dbLogger.warning('No data to update', { user_id: id });
        throw new Error('No data provided to update');
      }

      const { data, error } = await supabase
        .from('users')
        .update(updatePayload)
        .eq('id', id)
        .select('id, name, email, avatar_url, phone, bio, is_verified, is_owner, stripe_customer_id, created_at, updated_at')
        .single();

      if (error) {
        dbLogger.error('Failed to update user', { user_id: id }, error);
        throw error;
      }

      dbLogger.success('User updated successfully', {
        user_id: data.id,
        email: data.email
      });

      return data;
    } catch (error) {
      dbLogger.error('User update failed', { user_id: id }, error);
      throw error;
    }
  }

  // Update user password
  static async updatePassword(id, newPassword) {
    try {
      dbLogger.info('Updating user password', { user_id: id });

      // Hash the new password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);

      const { data, error } = await supabase
        .from('users')
        .update({ password: hashedPassword })
        .eq('id', id)
        .select('id, name, email')
        .single();

      if (error) {
        dbLogger.error('Failed to update password', { user_id: id }, error);
        throw error;
      }

      dbLogger.success('Password updated successfully', {
        user_id: data.id,
        email: data.email
      });

      return data;
    } catch (error) {
      dbLogger.error('Password update failed', { user_id: id }, error);
      throw error;
    }
  }

  // Verify password
  static async verifyPassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  // Update stripe customer ID
  static async updateStripeCustomerId(id, stripeCustomerId) {
    try {
      dbLogger.info('Updating Stripe customer ID', { user_id: id });

      const { data, error } = await supabase
        .from('users')
        .update({ stripe_customer_id: stripeCustomerId })
        .eq('id', id)
        .select('id, name, email, stripe_customer_id')
        .single();

      if (error) {
        dbLogger.error('Failed to update Stripe customer ID', { user_id: id }, error);
        throw error;
      }

      dbLogger.success('Stripe customer ID updated successfully', {
        user_id: data.id,
        email: data.email
      });

      return data;
    } catch (error) {
      dbLogger.error('Stripe customer ID update failed', { user_id: id }, error);
      throw error;
    }
  }
}

export default UserService;
