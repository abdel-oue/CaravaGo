import { supabase } from '../config/db.js';
import bcrypt from 'bcrypt';

class UserService {
  // Create a new user
  static async createUser(userData) {
    try {
      const { name, email, password } = userData;

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
            created_at: new Date(),
            updated_at: new Date()
          }
        ])
        .select()
        .single();

      if (error) {
        // Handle unique constraint violation
        if (error.code === '23505') {
          throw new Error('User already exists with this email');
        }
        throw error;
      }

      // Remove password from response
      const { password: _, ...userWithoutPassword } = data;
      return userWithoutPassword;
    } catch (error) {
      throw error;
    }
  }

  // Find user by email
  static async findByEmail(email) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email.toLowerCase())
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      return data;
    } catch (error) {
      throw error;
    }
  }

  // Find user by ID
  static async findById(id) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('id, name, email, created_at, updated_at')
        .eq('id', id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      return data;
    } catch (error) {
      throw error;
    }
  }

  // Verify password
  static async verifyPassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }
}

export default UserService;

