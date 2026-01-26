/**
 * 🌱 DATABASE SEED SCRIPT
 * 
 * Seeds demo data into MongoDB for testing Socket.IO features.
 * Run this after starting the backend to populate demo conversations and tickets.
 * 
 * Usage: ts-node src/scripts/seed.ts
 * 
 * @author GharBazaar Backend Team
 */

import mongoose from 'mongoose';
import config from '../config';
import Conversation from '../models/conversation.model';
import Message from '../models/message.model';
import Ticket from '../models/ticket.model';
import TicketMessage from '../models/ticketMessage.model';

/**
 * Demo data - matches frontend demo script
 */
const demoData = {
    conversations: [
        {
            participants: ['demo_buyer_001', 'demo_seller_001'],
            propertyId: 'prop_demo_123',
            propertyTitle: '3BHK Apartment in Bandra, Mumbai',
            lastMessage: 'The property is located at: Plot No. 42...',
            lastMessageAt: new Date('2026-01-10T14:30:00Z'),
        },
        {
            participants: ['demo_buyer_002', 'demo_seller_002'],
            propertyId: 'prop_demo_456',
            propertyTitle: '2BHK Villa in Goa',
            lastMessage: 'The rent is ₹45,000 per month...',
            lastMessageAt: new Date('2026-01-10T16:45:00Z'),
        }
    ],

    tickets: [
        {
            userId: 'demo_customer_001',
            userRole: 'buyer',
            categoryTitle: 'Payment Issue',
            subCategoryTitle: 'Payment Failed',
            problem: 'My payment failed but the amount was deducted from my bank account. Transaction ID: TXN20260110001',
            status: 'open',
            createdAt: new Date('2026-01-10T11:00:00Z'),
        },
        {
            userId: 'demo_buyer_001',
            userRole: 'buyer',
            categoryTitle: 'Account Issue',
            subCategoryTitle: 'Cannot Login',
            problem: 'I am unable to login to my account. Getting "Invalid credentials" error.',
            status: 'assigned',
            assignedTo: 'demo_employee_001',
            assignedToName: 'Support Agent - Ravi',
            createdAt: new Date('2026-01-10T12:00:00Z'),
        }
    ]
};

/**
 * 🌱 Seed the database
 */
const seedDatabase = async () => {
    try {
        console.log('🌱 Starting database seeding...\n');

        // Connect to MongoDB
        await mongoose.connect(config.mongodbUri);
        console.log('✅ Connected to MongoDB\n');

        // Clear existing demo data
        console.log('🗑️  Clearing existing demo data...');
        await Conversation.deleteMany({ propertyId: /^prop_demo_/ });
        await Message.deleteMany({});
        await Ticket.deleteMany({ userId: /^demo_/ });
        await TicketMessage.deleteMany({});
        console.log('✅ Cleared old data\n');

        // Seed conversations
        console.log('💬 Seeding conversations...');
        for (const conv of demoData.conversations) {
            const conversation = await Conversation.create(conv);
            console.log(`   ✅ Created conversation: ${conversation.propertyTitle}`);

            // Add demo messages
            await Message.create({
                conversationId: conversation._id,
                senderId: conv.participants[0],
                senderEmail: `${conv.participants[0]}@gharbazaar.in`,
                content: 'Hi! Is this property still available?',
                type: 'text',
                read: true,
                createdAt: new Date(Date.now() - 3600000), // 1 hour ago
            });

            await Message.create({
                conversationId: conversation._id,
                senderId: conv.participants[1],
                senderEmail: `${conv.participants[1]}@gharbazaar.in`,
                content: 'Yes, it is! Would you like to schedule a visit?',
                type: 'text',
                read: false,
                createdAt: new Date(),
            });
        }
        console.log(`✅ Created ${demoData.conversations.length} conversations with messages\n`);

        // Seed tickets
        console.log('🎫 Seeding tickets...');
        for (const ticketData of demoData.tickets) {
            const ticket = await Ticket.create(ticketData);
            console.log(`   ✅ Created ticket: ${ticket.categoryTitle}`);

            // Add initial message
            await TicketMessage.create({
                ticketId: ticket._id,
                senderId: ticketData.userId,
                senderType: 'customer',
                message: ticketData.problem,
                timestamp: ticketData.createdAt,
            });
        }
        console.log(`✅ Created ${demoData.tickets.length} tickets with messages\n`);

        console.log('🎉 Database seeding completed successfully!\n');
        console.log('📊 Summary:');
        console.log(`   - ${demoData.conversations.length} conversations`);
        console.log(`   - ${demoData.conversations.length * 2} messages`);
        console.log(`   - ${demoData.tickets.length} tickets`);
        console.log(`   - ${demoData.tickets.length} ticket messages\n`);

        await mongoose.disconnect();
        console.log('📴 Disconnected from MongoDB');
        process.exit(0);

    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
};

// Run the seed function
seedDatabase();
