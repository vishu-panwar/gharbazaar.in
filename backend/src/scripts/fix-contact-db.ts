import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

// Load env
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error('❌ MONGODB_URI not found in .env');
    process.exit(1);
}

async function fixDatabase() {
    try {
        console.log('📡 Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI!);
        console.log('✅ Connected.');

        const collections = ['contacts', 'counters'];

        for (const colName of collections) {
            console.log(`🧹 Clearing collection: ${colName}...`);
            if (!mongoose.connection.db) {
                console.error('❌ Mongoose connection DB is undefined');
                continue;
            }
            await mongoose.connection.db.collection(colName).deleteMany({});
            console.log(`✅ ${colName} cleared.`);
        }

        console.log('🚀 Database is now clean and ready for new Contact submissions.');
        process.exit(0);
    } catch (error) {
        console.error('❌ Database fix failed:', error);
        process.exit(1);
    }
}

fixDatabase();
