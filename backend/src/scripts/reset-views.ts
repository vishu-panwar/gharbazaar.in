import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error('❌ MONGODB_URI is not defined in .env');
    process.exit(1);
}

const resetViews = async () => {
    try {
        console.log('🔄 Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        const Property = mongoose.model('Property', new mongoose.Schema({
            views: { type: Number, default: 0 },
            viewedBy: [{ type: String }]
        }), 'properties');

        console.log('📉 Resetting all property views to 0...');
        const result = await Property.updateMany(
            {},
            {
                $set: {
                    views: 0,
                    viewedBy: []
                }
            }
        );

        console.log(`✅ Successfully reset views for ${result.modifiedCount} properties`);

        process.exit(0);
    } catch (error) {
        console.error('❌ Reset error:', error);
        process.exit(1);
    }
};

resetViews();
