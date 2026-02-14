import { prisma } from '../utils/prisma';

async function clearData() {
    try {
        console.log('🧹 Clearing all demo data from PostgreSQL...');

        // Clear everything in the correct order to avoid foreign key constraints
        // We delete from child tables first
        
        await prisma.message.deleteMany({});
        await prisma.conversationParticipant.deleteMany({});
        await prisma.conversation.deleteMany({});
        console.log('✅ Cleared chats (conversations and messages)');

        await prisma.bid.deleteMany({});
        await prisma.favorite.deleteMany({});
        await prisma.property.deleteMany({});
        console.log('✅ Cleared properties, bids, and favorites');

        await prisma.ticketMessage.deleteMany({});
        await prisma.ticket.deleteMany({});
        console.log('✅ Cleared support tickets');

        await prisma.notification.deleteMany({});
        await prisma.paymentTransaction.deleteMany({});
        console.log('✅ Cleared notifications and payments');

        // Reset user stats in Buyer/Seller profiles instead of a single Mongoose model
        await prisma.buyerProfile.updateMany({
            data: {
                propertiesViewed: 0,
                savedProperties: 0,
            }
        });
        
        await prisma.sellerProfile.updateMany({
            data: {
                activeListings: 0,
                totalViews: 0,
                inquiries: 0,
            }
        });

        console.log('✅ Reset all user statistics to 0');

        console.log('👋 Backend is now CLEAN');
        process.exit(0);
    } catch (error) {
        console.error('❌ Clearing error:', error);
        process.exit(1);
    }
}

clearData();
