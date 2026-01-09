import mongoose from 'mongoose';
import { VehicleType, Amenity } from '../models/Listing.js';
import { dbLogger } from './logger.js';
import dotenv from 'dotenv';
dotenv.config({ path: '../../.env' });

// Debug: Check environment variables
console.log('MONGO_URI:', process.env.MONGO_URI ? 'SET' : 'NOT SET');
console.log('MONGO_URL:', process.env.MONGO_URL ? 'SET' : 'NOT SET');

const mongoUrl = process.env.MONGO_URI || process.env.MONGO_URL;

if (!mongoUrl) {
  const error = new Error('Missing MongoDB environment variable: MONGO_URI or MONGO_URL');
  console.error(error.message);
  process.exit(1);
}

console.log('Using MongoDB URL:', mongoUrl.substring(0, 50) + '...');

// Vehicle types data from SQL schema
const vehicleTypesData = [
  {
    name: 'Campervan',
    description: 'Compact and maneuverable campervans perfect for city exploration'
  },
  {
    name: 'Motorhome',
    description: 'Full-featured motorhomes with all the comforts of home'
  },
  {
    name: 'RV',
    description: 'Recreational vehicles offering luxury camping experiences'
  },
  {
    name: 'Caravan',
    description: 'Towable caravans for those who prefer driving their own vehicle'
  },
  {
    name: 'Other',
    description: 'Other types of camping vehicles'
  }
];

// Amenities data from SQL schema
const amenitiesData = [
  { name: 'Kitchen', category: 'kitchen' },
  { name: 'Bathroom', category: 'bathroom' },
  { name: 'Air Conditioning', category: 'comfort' },
  { name: 'Heating', category: 'comfort' },
  { name: 'WiFi', category: 'technology' },
  { name: 'TV', category: 'entertainment' },
  { name: 'Fridge', category: 'kitchen' },
  { name: 'Microwave', category: 'kitchen' },
  { name: 'Awning', category: 'exterior' },
  { name: 'Bike Rack', category: 'exterior' },
  { name: 'Solar Panels', category: 'technology' },
  { name: 'Generator', category: 'technology' },
  { name: 'Pet Friendly', category: 'other' },
  { name: 'Smoking Allowed', category: 'other' }
];

const seedDatabase = async () => {
  try {
    dbLogger.info('Starting database seeding...');

    // Connect to MongoDB
    await mongoose.connect(mongoUrl);
    dbLogger.success('Connected to MongoDB');

    // Seed vehicle types
    dbLogger.info('Seeding vehicle types...');
    for (const vehicleType of vehicleTypesData) {
      await VehicleType.findOneAndUpdate(
        { name: vehicleType.name },
        vehicleType,
        { upsert: true, new: true }
      );
    }
    dbLogger.success(`Seeded ${vehicleTypesData.length} vehicle types`);

    // Seed amenities
    dbLogger.info('Seeding amenities...');
    for (const amenity of amenitiesData) {
      await Amenity.findOneAndUpdate(
        { name: amenity.name },
        amenity,
        { upsert: true, new: true }
      );
    }
    dbLogger.success(`Seeded ${amenitiesData.length} amenities`);

    dbLogger.success('Database seeding completed successfully!');
  } catch (error) {
    dbLogger.error('Database seeding failed', null, error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    dbLogger.info('Database connection closed');
  }
};

// Run seeder if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedDatabase();
}

export { seedDatabase, vehicleTypesData, amenitiesData };
