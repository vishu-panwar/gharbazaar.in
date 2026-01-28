import mongoose from 'mongoose';
import config from '../config';
import Property from '../models/property.model';
import User from '../models/user.model';
import Conversation from '../models/conversation.model';
import Message from '../models/message.model';
import Ticket from '../models/ticket.model';
import TicketMessage from '../models/ticketMessage.model';

async function clearData() {
    try {
        await mongoose.connect(config.mongodbUri);
        console.log('🧹 Connected to MongoDB for clearing all demo data...');

        // Clear everything
        await Property.deleteMany({});
        console.log('✅ Cleared properties');

        // Clear conversations and messages
        await Conversation.deleteMany({});
        await Message.deleteMany({});
        console.log('✅ Cleared chats (conversations and messages)');

        // Clear tickets
        await Ticket.deleteMany({});
        await TicketMessage.deleteMany({});
        console.log('✅ Cleared support tickets');

        // Optional: keep users but reset their stats? 
        // Usually, users want to keep their account but clear the "demo" activity.
        // For now, let's just clear everything except the users themselves, 
        // but reset user stats to 0.
        await User.updateMany({}, {
            $set: {
                propertiesViewed: 0,
                savedProperties: 0,
                activeOffers: 0,
                activeListings: 0,
                totalViews: 0,
                inquiries: 0,
                revenue: '₹0'
            }
        });
        console.log('✅ Reset all user statistics to 0');

        await mongoose.disconnect();
        console.log('👋 Backend is now CLEAN');
    } catch (error) {
        console.error('❌ Clearing error:', error);
    }
}

clearData();
