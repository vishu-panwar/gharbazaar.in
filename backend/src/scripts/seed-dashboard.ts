import mongoose from 'mongoose';
import config from '../config';
import Property from '../models/property.model';
import User from '../models/user.model';

const demoProperties = [
    {
        title: 'Luxury 4BHK Penthouse with Panoramic Sea Views',
        description: 'Breathtaking sea views, premium amenities, and modern architecture.',
        propertyType: 'Apartment',
        listingType: 'sale',
        price: 85000000,
        originalPrice: 92000000,
        location: 'Worli, Mumbai',
        address: 'Bandra-Worli Sea Link Road',
        city: 'Mumbai',
        bedrooms: 4,
        bathrooms: 5,
        area: '3200 sq ft',
        amenities: ['Sea View', 'Swimming Pool', 'Gym', 'Parking', 'Security'],
        status: 'active',
        sellerId: 'demo_seller_001',
        featured: true,
        verified: true,
        views: 1234,
        likes: 45,
        inquiries: 23,
        virtualTour: true,
        matchScore: 98
    },
    {
        title: 'Modern 3BHK Villa with Private Garden',
        description: 'Beautiful villa with private garden, modern interiors, and excellent connectivity.',
        propertyType: 'Villa',
        listingType: 'sale',
        price: 38000000,
        location: 'Whitefield, Bangalore',
        address: 'Outer Ring Road, Whitefield',
        city: 'Bangalore',
        bedrooms: 3,
        bathrooms: 4,
        area: '2100 sq ft',
        amenities: ['Private Garden', 'Parking', 'Security', 'Club House'],
        status: 'active',
        sellerId: 'demo_seller_002',
        featured: false,
        verified: true,
        views: 892,
        likes: 28,
        inquiries: 15,
        virtualTour: false,
        matchScore: 92
    },
    {
        title: 'Premium 3BHK Apartment for Rent',
        description: 'Fully furnished premium apartment in prime Bandra location.',
        propertyType: 'Apartment',
        listingType: 'rent',
        price: 85000,
        originalPrice: 90000,
        location: 'Bandra West, Mumbai',
        address: 'Linking Road, Bandra West',
        city: 'Mumbai',
        bedrooms: 3,
        bathrooms: 3,
        area: '1800 sq ft',
        amenities: ['Furnished', 'AC', 'Gym', 'Parking'],
        status: 'active',
        sellerId: 'demo_seller_001',
        featured: true,
        verified: true,
        views: 743,
        likes: 32,
        inquiries: 18,
        virtualTour: true,
        matchScore: 88,
        priceDropped: true
    }
];

const demoUsers = [
    {
        uid: 'demo-buyer-id',
        email: 'buyer@demo.com',
        name: 'Demo Buyer',
        role: 'buyer',
        propertiesViewed: 124,
        savedProperties: 42,
        activeOffers: 3,
        budget: '₹4.5 Cr',
        planType: 'Premium',
        planProgress: 68,
        daysLeft: 12,
        viewLimit: 500,
        consultationLimit: 15,
        consultationsUsed: 8
    },
    {
        uid: 'demo_seller_001',
        email: 'seller@demo.com',
        name: 'Demo Seller',
        role: 'seller',
        activeListings: 24,
        totalViews: 12450,
        inquiries: 156,
        revenue: '₹12.5 Cr',
        planType: 'Ultimate',
        planProgress: 75,
        daysLeft: 18,
        listingLimit: 50
    }
];

async function seedData() {
    try {
        await mongoose.connect(config.mongodbUri);
        console.log('🌱 Connected to MongoDB for seeding dashboard data...');

        // Clear and seed properties
        await Property.deleteMany({});
        await Property.create(demoProperties);
        console.log('✅ Seeded demo properties');

        // Clear and seed users
        await User.deleteMany({});
        await User.create(demoUsers);
        console.log('✅ Seeded demo users');

        await mongoose.disconnect();
        console.log('👋 Seeding complete');
    } catch (error) {
        console.error('❌ Seeding error:', error);
    }
}

seedData();
