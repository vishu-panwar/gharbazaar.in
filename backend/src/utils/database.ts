import mongoose from 'mongoose';
import config from '../config';

export const connectDatabase = async (): Promise<void> => {
    try {
        const options = {
            autoIndex: true,
            maxPoolSize: 10,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
            family: 4, // Use IPv4, skip trying IPv6
        };

        console.log('🔄 Attempting to connect to MongoDB...');
        console.log(`📍 URI: ${config.mongodbUri.replace(/\/\/.*@/, '//***:***@')}`);

        await mongoose.connect(config.mongodbUri, options);

        console.log('✅ MongoDB connected successfully');
        console.log(`📊 Database: ${mongoose.connection.db?.databaseName || 'gharbazaar'}`);
        console.log(`🌐 Host: ${mongoose.connection.host}\n`);

        mongoose.connection.on('error', (error) => {
            console.error('❌ MongoDB connection error:', error);
        });

        mongoose.connection.on('disconnected', () => {
            console.warn('⚠️  MongoDB disconnected. Attempting to reconnect...');
        });

        mongoose.connection.on('reconnected', () => {
            console.log('✅ MongoDB reconnected');
        });
    } catch (error) {
        console.error('❌ Failed to connect to MongoDB:', error);
        console.warn('\n⚠️  Running in MEMORY-ONLY mode');
        console.warn('💡 Properties, users, and chat data will NOT persist');
        console.warn('💡 To enable database:');
        console.warn('   1. Install MongoDB locally, OR');
        console.warn('   2. Create free MongoDB Atlas cluster at https://mongodb.com/atlas');
        console.warn('   3. Update MONGODB_URI in .env file\n');
    }
};

export const disconnectDatabase = async (): Promise<void> => {
    try {
        await mongoose.connection.close();
        console.log('📴 MongoDB connection closed');
    } catch (error) {
        console.error('❌ Error closing MongoDB connection:', error);
    }
};
