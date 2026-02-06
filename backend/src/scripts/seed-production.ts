import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Plan from '../models/plan.model';
import UserPlan from '../models/userPlan.model';
import Bid from '../models/bid.model';
import Contract from '../models/contract.model';
import Visit from '../models/visit.model';
import VerificationTask from '../models/verificationTask.model';
import VerificationReport from '../models/verificationReport.model';
import PaymentTransaction from '../models/paymentTransaction.model';
import PartnerCase from '../models/partnerCase.model';
import Referral from '../models/referral.model';
import Payout from '../models/payout.model';
import Notification from '../models/notification.model';
import Property from '../models/property.model';
import User from '../models/user.model';
import Conversation from '../models/conversation.model';
import Ticket from '../models/ticket.model';
import TicketMessage from '../models/ticketMessage.model';
import Message from '../models/message.model';
import Favorite from '../models/favorite.model';
import Attendance from '../models/attendance.model';
import Presence from '../models/presence.model';
import Salary from '../models/salary.model';
import AuditLog from '../models/auditLog.model';

dotenv.config();

const plans = [
    // Buyer Plans
    {
        name: 'Basic Buyer Access',
        slug: 'basic-buyer',
        type: 'buyer',
        price: 599,
        duration: 30,
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
        duration: 180,
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
        duration: 365,
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
        duration: 30,
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
        duration: 180,
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
        duration: 365,
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

const ensureCollection = async (model: mongoose.Model<any>, name: string) => {
    try {
        await model.createCollection();
        await model.syncIndexes();
        console.log(`✅ Collection ready: ${name}`);
    } catch (error: any) {
        console.warn(`⚠️  Collection ensure failed: ${name} - ${error.message}`);
    }
};

async function seedProduction() {
    console.log('🚀 Production seed starting...');
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
        throw new Error('MONGODB_URI is not set');
    }

    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');

    // Ensure collections and indexes exist
    await ensureCollection(User, 'users');
    await ensureCollection(Property, 'properties');
    await ensureCollection(Plan, 'plans');
    await ensureCollection(UserPlan, 'userplans');
    await ensureCollection(Bid, 'bids');
    await ensureCollection(Contract, 'contracts');
    await ensureCollection(Visit, 'visits');
    await ensureCollection(VerificationTask, 'verificationtasks');
    await ensureCollection(VerificationReport, 'verificationreports');
    await ensureCollection(PaymentTransaction, 'paymenttransactions');
    await ensureCollection(PartnerCase, 'partnercases');
    await ensureCollection(Referral, 'referrals');
    await ensureCollection(Payout, 'payouts');
    await ensureCollection(Notification, 'notifications');
    await ensureCollection(Conversation, 'conversations');
    await ensureCollection(Ticket, 'tickets');
    await ensureCollection(TicketMessage, 'ticketmessages');
    await ensureCollection(Message, 'messages');
    await ensureCollection(Favorite, 'favorites');
    await ensureCollection(Attendance, 'attendance');
    await ensureCollection(Presence, 'presences');
    await ensureCollection(Salary, 'salary');
    await ensureCollection(AuditLog, 'auditlogs');

    const planCount = await Plan.countDocuments({});
    if (planCount === 0) {
        await Plan.insertMany(plans);
        console.log(`✅ Seeded ${plans.length} plans`);
    } else {
        console.log(`ℹ️  Plans already exist (${planCount}) - skipping seed`);
    }

    console.log('✅ Production seed completed');
    await mongoose.disconnect();
}

if (require.main === module) {
    seedProduction()
        .then(() => process.exit(0))
        .catch((error) => {
            console.error('❌ Production seed failed:', error);
            process.exit(1);
        });
}

export default seedProduction;
