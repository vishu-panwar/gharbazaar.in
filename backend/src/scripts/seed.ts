/**
 * 🌱 DATABASE SEED SCRIPT (PostgreSQL/Prisma)
 *
 * Seeds demo data into PostgreSQL for testing features.
 * Usage: npx ts-node src/scripts/seed.ts
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const demoData = {
    users: [
        {
            uid: 'demo_buyer_001',
            email: 'demo_buyer_001@gharbazaar.in',
            name: 'Demo Buyer 1',
            role: 'buyer',
            buyerClientId: 'gbclient_b1',
            sellerClientId: 'gbclient_b1_seller'
        },
        {
            uid: 'demo_seller_001',
            email: 'demo_seller_001@gharbazaar.in',
            name: 'Demo Seller 1',
            role: 'seller',
            buyerClientId: 'gbclient_s1_buyer',
            sellerClientId: 'gbclient_s1'
        }
    ],
    properties: [
        {
            id: 'prop_demo_123',
            title: '3BHK Apartment in Bandra, Mumbai',
            description: 'Beautiful apartment in the heart of the city with modern amenities.',
            price: 25000000,
            propertyType: 'Apartment',
            listingType: 'sale',
            address: 'Bandra West, Mumbai',
            city: 'Mumbai',
            state: 'Maharashtra',
            country: 'India',
            bedrooms: 3,
            bathrooms: 3,
            area: '1500',
            areaUnit: 'sqft',
            status: 'active',
            featured: true,
            verified: true
        }
    ]
};

async function seedDatabase() {
    try {
        console.log('🌱 Starting database seeding (Prisma)...');

        // Upsert demo users
        for (const userData of demoData.users) {
            const user = await prisma.user.upsert({
                where: { email: userData.email },
                update: {},
                create: {
                    uid: userData.uid,
                    email: userData.email,
                    name: userData.name,
                    role: userData.role,
                    buyerClientId: userData.buyerClientId,
                    sellerClientId: userData.sellerClientId,
                    onboardingCompleted: true
                }
            });

            // Ensure profiles exist
            await prisma.buyerProfile.upsert({
                where: { userId: user.id },
                update: {},
                create: { userId: user.id }
            });
            await prisma.sellerProfile.upsert({
                where: { userId: user.id },
                update: {},
                create: { userId: user.id }
            });

            console.log(`   ✅ Handled user: ${user.email}`);
        }

        // Get the seller user
        const seller = await prisma.user.findUnique({
            where: { uid: 'demo_seller_001' }
        });

        if (!seller) {
            throw new Error('Demo seller user not found');
        }

        // Seed properties
        for (const propData of demoData.properties) {
            await prisma.property.upsert({
                where: { id: propData.id },
                update: {},
                create: {
                    id: propData.id,
                    title: propData.title,
                    description: propData.description,
                    price: propData.price,
                    propertyType: propData.propertyType,
                    listingType: propData.listingType,
                    address: propData.address,
                    city: propData.city,
                    state: propData.state,
                    bedrooms: propData.bedrooms,
                    bathrooms: propData.bathrooms,
                    area: propData.area,
                    areaUnit: propData.areaUnit,
                    status: propData.status,
                    featured: propData.featured,
                    verified: propData.verified,
                    sellerId: seller.id,
                    sellerClientId: seller.sellerClientId || undefined
                }
            });
            console.log(`   ✅ Handled property: ${propData.title}`);
        }

        console.log('🎉 Seeding completed!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Seeding error:', error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

seedDatabase();
