// Seed script for dashboard demo data using Prisma
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

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
        state: 'Maharashtra',
        country: 'India',
        bedrooms: 4,
        bathrooms: 5,
        area: '3200',
        areaUnit: 'sqft',
        amenities: ['Sea View', 'Swimming Pool', 'Gym', 'Parking', 'Security'],
        status: 'active',
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
        state: 'Karnataka',
        country: 'India',
        bedrooms: 3,
        bathrooms: 4,
        area: '2100',
        areaUnit: 'sqft',
        amenities: ['Private Garden', 'Parking', 'Security', 'Club House'],
        status: 'active',
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
        state: 'Maharashtra',
        country: 'India',
        bedrooms: 3,
        bathrooms: 3,
        area: '1800',
        areaUnit: 'sqft',
        amenities: ['Furnished', 'AC', 'Gym', 'Parking'],
        status: 'active',
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

async function seedData() {
    try {
        console.log('🌱 Starting Prisma seed for dashboard data...');

        // Create demo users
        const hashedPassword = await bcrypt.hash('demo123', 10);

        const buyerUser = await prisma.user.upsert({
            where: { email: 'buyer@demo.com' },
            update: {},
            create: {
                uid: 'demo-buyer-id',
                email: 'buyer@demo.com',
                name: 'Demo Buyer',
                password: hashedPassword,
                role: 'buyer',
                buyerClientId: 'gbclientdemo1',
                sellerClientId: 'gbclientdemo2',
                onboardingCompleted: true
            }
        });

        // Create buyer profile
        await prisma.buyerProfile.upsert({
            where: { userId: buyerUser.id },
            update: {},
            create: {
                userId: buyerUser.id,
                propertiesViewed: 124,
                savedProperties: 42,
                budget: '₹4.5 Cr',
                preferredCities: ['Mumbai', 'Bangalore', 'Pune'],
                preferredTypes: ['Apartment', 'Villa']
            }
        });

        const sellerUser = await prisma.user.upsert({
            where: { email: 'seller@demo.com' },
            update: {},
            create: {
                uid: 'demo_seller_001',
                email: 'seller@demo.com',
                name: 'Demo Seller',
                password: hashedPassword,
                role: 'seller',
                buyerClientId: 'gbclientdemo3',
                sellerClientId: 'gbclientdemo4',
                onboardingCompleted: true
            }
        });

        // Create seller profile
        await prisma.sellerProfile.upsert({
            where: { userId: sellerUser.id },
            update: {},
            create: {
                userId: sellerUser.id,
                activeListings: 24,
                totalViews: 12450,
                inquiries: 156,
                revenue: '₹12.5 Cr',
                companyName: 'Demo Real Estate'
            }
        });

        console.log('✅ Seeded demo users');

        // Clear existing properties and seed new ones
        for (const prop of demoProperties) {
            await prisma.property.upsert({
                where: { id: `demo-${prop.city?.toLowerCase()}-${prop.propertyType?.toLowerCase()}-1` },
                update: {},
                create: {
                    id: `demo-${prop.city?.toLowerCase()}-${prop.propertyType?.toLowerCase()}-1`,
                    ...prop,
                    sellerId: sellerUser.id,
                    createdAt: new Date(),
                    updatedAt: new Date()
                }
            });
        }

        console.log('✅ Seeded demo properties');
        console.log('👋 Seeding complete');

    } catch (error) {
        console.error('❌ Seeding error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

seedData();
