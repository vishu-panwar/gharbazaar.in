import mongoose from 'mongoose';
import Plan from '../models/plan.model';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Seed Plans Script
 * Populates initial plan data based on pricing page structure
 * Run with: ts-node src/scripts/seed-plans.ts
 */

const plans = [
    // Buyer Plans
    {
        name: 'Basic Buyer Access',
        slug: 'basic-buyer',
        type: 'buyer',
        price: 599,
        duration: 30, // 1 month
        description: 'Perfect for casual property seekers',
        badge: 'AFFORDABLE',
        isPopular: false,
        features: {
            viewLimit: 50,
            contactAccess: true,
            mapAccess: false,
            bidAccess: false,
            consultationLimit: 1,
            favoritesLimit: 2
        }
    },
    {
        name: 'Smart Buyer Plan',
        slug: 'smart-buyer',
        type: 'buyer',
        price: 2999,
        originalPrice: 3600,
        duration: 180, // 6 months
        description: 'Perfect for agents and professionals',
        badge: 'MOST POPULAR',
        isPopular: true,
        features: {
            viewLimit: 300,
            contactAccess: true,
            mapAccess: true,
            bidAccess: true,
            consultationLimit: 5,
            favoritesLimit: 10
        }
    },
    {
        name: 'Pro Buyer Plan',
        slug: 'pro-buyer',
        type: 'buyer',
        price: 4999,
        originalPrice: 7200,
        duration: 365, // 1 year
        description: 'Perfect for investors & committed buyers',
        badge: 'BEST VALUE',
        isPopular: false,
        features: {
            viewLimit: 1000,
            contactAccess: true,
            mapAccess: true,
            bidAccess: true,
            consultationLimit: 12,
            favoritesLimit: 50
        }
    },
    
    // Seller Plans
    {
        name: 'Basic Seller',
        slug: 'basic-seller',
        type: 'seller',
        price: 999,
        duration: 30, // 1 month
        description: 'For individual sellers',
        badge: 'STARTER',
        isPopular: false,
        features: {
            listingLimit: 3,
            featuredListings: 0,
            analyticsAccess: false,
            prioritySupport: false,
            verificationBadge: false
        }
    },
    {
        name: 'Professional Seller',
        slug: 'professional-seller',
        type: 'seller',
        price: 4999,
        originalPrice: 6000,
        duration: 180, // 6 months
        description: 'For professional agents',
        badge: 'POPULAR',
        isPopular: true,
        features: {
            listingLimit: 15,
            featuredListings: 3,
            analyticsAccess: true,
            prioritySupport: true,
            verificationBadge: true
        }
    },
    {
        name: 'Enterprise Seller',
        slug: 'enterprise-seller',
        type: 'seller',
        price: 9999,
        originalPrice: 14400,
        duration: 365, // 1 year
        description: 'For agencies and developers',
        badge: 'BEST VALUE',
        isPopular: false,
        features: {
            listingLimit: 50,
            featuredListings: 10,
            analyticsAccess: true,
            prioritySupport: true,
            verificationBadge: true
        }
    }
];

async function seedPlans() {
    try {
        console.log('🌱 Starting plan seeding...');
        
        // Connect to database
        const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/gharbazaar';
        await mongoose.connect(mongoUri);
        console.log('✅ Connected to MongoDB');

        // Clear existing plans
        await Plan.deleteMany({});
        console.log('🗑️  Cleared existing plans');

        // Insert new plans
        const insertedPlans = await Plan.insertMany(plans);
        console.log(`✅ Inserted ${insertedPlans.length} plans`);

        // Display results
        console.log('\n📊 Created Plans:');
        insertedPlans.forEach(plan => {
            console.log(`   - ${plan.name} (${plan.type}) - ₹${plan.price} for ${plan.duration} days`);
        });

        console.log('\n✅ Plan seeding completed successfully!');
        
    } catch (error) {
        console.error('❌ Error seeding plans:', error);
        throw error;
    } finally {
        await mongoose.connection.close();
        console.log('👋 Database connection closed');
    }
}

// Run if executed directly
if (require.main === module) {
    seedPlans()
        .then(() => process.exit(0))
        .catch((error) => {
            console.error(error);
            process.exit(1);
        });
}

export default seedPlans;
