import mongoose from 'mongoose';
import { dbLogger } from '../utils/logger.js';
import dotenv from 'dotenv';
dotenv.config({ path: '../.env' });

const mongoUrl = process.env.MONGO_URL;

if (!mongoUrl) {
  const error = new Error('Missing MongoDB environment variable: MONGO_URL');
  dbLogger.error('Database configuration failed', null, error);
  throw error;
}

const connectDB = async () => {
  try {
    dbLogger.info('Attempting to connect to MongoDB database');

    // Connect to MongoDB
    await mongoose.connect(mongoUrl, {
      // Modern Mongoose connection options
      serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
      bufferCommands: false, // Disable mongoose buffering
      bufferMaxEntries: 0, // Disable mongoose buffering
    });

    dbLogger.success('Database connection established successfully');
  } catch (error) {
    dbLogger.error('Database connection failed', null, error);
    process.exit(1);
  }
};

// Handle connection events
mongoose.connection.on('connected', () => {
  dbLogger.info('Mongoose connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  dbLogger.error('Mongoose connection error', null, err);
});

mongoose.connection.on('disconnected', () => {
  dbLogger.warn('Mongoose disconnected from MongoDB');
});

// Graceful shutdown
process.on('SIGINT', async () => {
  dbLogger.info('Received SIGINT, closing MongoDB connection...');
  await mongoose.connection.close();
  process.exit(0);
});

export { mongoose };
export default connectDB;

