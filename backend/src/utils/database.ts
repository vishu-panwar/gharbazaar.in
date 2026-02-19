import { PrismaClient } from '@prisma/client';
import mongoose from 'mongoose';
import config from '../config';

const prisma = new PrismaClient({
  log: ['error', 'warn'],
});

export const connectDatabase = async (): Promise<void> => {
  try {
    // 1. Connect to PostgreSQL via Prisma
    console.log('🔄 Attempting to connect to PostgreSQL database...');
    console.log(`📍 PostgreSQL URL: ${config.databaseUrl.replace(/\/\/.*@/, '//***:***@')}`);
    await prisma.$connect();
    console.log('✅ PostgreSQL connected successfully');
    
    // Test PostgreSQL connection
    const pgResult = await prisma.$queryRaw`SELECT NOW()`;
    console.log(`📊 PostgreSQL Time: ${JSON.stringify(pgResult)}`);

    // 2. Connect to MongoDB via Mongoose
    if (config.mongodbUri) {
      console.log('\n🔄 Attempting to connect to MongoDB database...');
      console.log(`📍 MongoDB URI: ${config.mongodbUri.replace(/\/\/.*@/, '//***:***@')}`);
      
      await mongoose.connect(config.mongodbUri, {
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
      });

      console.log('✅ MongoDB connected successfully');
      console.log(`📊 MongoDB Connection: ${mongoose.connection.host}`);
    } else {
      console.warn('\n⚠️  MONGODB_URI not found in configuration. MongoDB-based features (like payments) may not work.');
    }

  } catch (error) {
    console.error('❌ Database Connection Error:', error);
    throw error;
  }
};

export const disconnectDatabase = async (): Promise<void> => {
  try {
    await prisma.$disconnect();
    console.log('📴 PostgreSQL connection closed');
    
    await mongoose.disconnect();
    console.log('📴 MongoDB connection closed');
  } catch (error) {
    console.error('❌ Error closing database connections:', error);
  }
};

// Export Prisma client for use in controllers
export { prisma };
export default { prisma, connectDatabase, disconnectDatabase };
