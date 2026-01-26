import mongoose from 'mongoose';
import config from '../config';

export const connectDatabase = async (): Promise<void> => {
    try {
        const options = {
            autoIndex: true,
            maxPoolSize: 10,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        };

        await mongoose.connect(config.mongodbUri, options);

        console.log('✅ MongoDB connected successfully');
        console.log(`📊 Database: ${mongoose.connection.db?.databaseName || 'gharbazaar'}`);

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
        console.warn('⚠️  Running in MEMORY-ONLY mode');
        console.warn('💡 Chat and ticket data will NOT persist between restarts\n');
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
