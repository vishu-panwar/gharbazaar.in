import { PrismaClient } from '@prisma/client';
import config from '../config';

const prisma = new PrismaClient({
  log: ['error', 'warn'],
});

export const connectDatabase = async (): Promise<void> => {
  try {
    console.log('🔄 Attempting to connect to PostgreSQL database...');
    // Mask password in log
    console.log(`📍 Database URL: ${config.databaseUrl.replace(/\/\/.*@/, '//***:***@')}`);

    await prisma.$connect();

    console.log('✅ PostgreSQL connected successfully');
    console.log(`🌐 Host: ${process.env.DATABASE_HOST || 'Koyeb PostgreSQL'}`);
    
    // Test the connection
    const result = await prisma.$queryRaw`SELECT NOW()`;
    console.log(`📊 Database Time: ${result}`);

  } catch (error) {
    console.error('❌ Failed to connect to PostgreSQL:', error);
    console.warn('\n⚠️  Cannot start without database connection');
    console.warn('💡 Please check your DATABASE_URL in .env file');
    console.warn('💡 Example: postgresql://user:password@host:5432/database\n');
    throw error;
  }
};

export const disconnectDatabase = async (): Promise<void> => {
  try {
    await prisma.$disconnect();
    console.log('📴 PostgreSQL connection closed');
  } catch (error) {
    console.error('❌ Error closing PostgreSQL connection:', error);
  }
};

// Export Prisma client for use in controllers
export { prisma };
export default { prisma, connectDatabase, disconnectDatabase };
