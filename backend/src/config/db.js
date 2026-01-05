import { createClient } from '@supabase/supabase-js';
import { dbLogger } from '../utils/logger.js';
import dotenv from 'dotenv';
dotenv.config({ path: '../.env' });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  const error = new Error('Missing Supabase environment variables');
  dbLogger.error('Database configuration failed', null, error);
  throw error;
}

const supabase = createClient(supabaseUrl, supabaseKey);

const connectDB = async () => {
  try {
    dbLogger.info('Attempting to connect to Supabase database');

    // Test the connection
    const { error } = await supabase.from('users').select('count').limit(1);
    if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned" which is expected
      throw error;
    }

    dbLogger.success('Database connection established successfully');
  } catch (error) {
    dbLogger.error('Database connection failed', null, error);
    process.exit(1);
  }
};

export { supabase };
export default connectDB;

