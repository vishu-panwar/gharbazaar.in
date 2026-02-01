const mongoose = require('mongoose');
const dotenv = require('dotenv');

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
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected.');

        const collections = ['contacts', 'counters'];
        
        for (const colName of collections) {
            console.log(`🧹 Clearing collection: ${colName}...`);
            try {
                if (!mongoose.connection.db) {
                    console.error('❌ Mongoose connection DB is undefined');
                    continue;
                }
                const count = await mongoose.connection.db.collection(colName).countDocuments();
                console.log(`Found ${count} documents in ${colName}`);
                await mongoose.connection.db.collection(colName).deleteMany({});
                console.log(`✅ ${colName} cleared.`);
            } catch (e) {
                console.log(`⚠️  Collection ${colName} might not exist yet: ${e.message}`);
            }
        }

        console.log('🚀 Database is now clean and ready.');
        process.exit(0);
    } catch (error) {
        console.error('❌ Database fix failed:', error);
        process.exit(1);
    }
}

fixDatabase();
