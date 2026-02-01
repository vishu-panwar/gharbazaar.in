
import mongoose from 'mongoose';
import User from '../models/user.model';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

// Load env vars
dotenv.config({ path: path.join(__dirname, '../../.env') });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/gharbazaar';

// Mock generation logic to verify against (duplicate of controller logic for assertion)
const getExpectedPrefix = (role: string) => {
    if (role === 'employee') return 'gbemployee';
    if (role === 'legal_partner') return 'gblegal';
    if (role === 'ground_partner') return 'gbground';
    if (role === 'promoter_partner') return 'gbpromoter';
    return 'gbclient';
};

const generateRandomHex = (): string => {
    return require('crypto').randomBytes(4).toString('hex').slice(0, 7);
};

const log = (msg: string) => {
    console.log(msg);
    fs.appendFileSync('test_results.log', msg + '\n');
};

const testRegistration = async () => {
    try {
        fs.writeFileSync('test_results.log', ''); // Clear log
        log('🔄 Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI);
        log('✅ Connected to MongoDB');

        const testRoles = [
            'buyer',
            'seller',
            'employee',
            'legal_partner',
            'ground_partner',
            'promoter_partner'
        ];

        log('\n🧪 Testing User Registration for Roles...');

        for (const role of testRoles) {
            const email = `test-${role}-${Date.now()}@example.com`;
            const name = `Test ${role}`;

            // Re-implement ID generation here to test if Model accepts it
            const randomHex = generateRandomHex();
            const prefix = getExpectedPrefix(role);
            const uid = `${prefix}${randomHex}`;
            const buyerClientId = `gbclient${generateRandomHex()}`;
            const sellerClientId = `gbclient${generateRandomHex()}`;

            log(`\nTesting Role: ${role}`);
            log(`Generated UID: ${uid}`);

            const newUser = new User({
                uid,
                email,
                name,
                role,
                buyerClientId,
                sellerClientId
            });

            await newUser.save();
            log(`✅ Saved user to DB`);

            // Verify fetching
            const savedUser = await User.findOne({ email });
            if (!savedUser) {
                log(`❌ Failed to fetch saved user`);
                continue;
            }

            if (savedUser.uid !== uid) {
                log(`❌ UID mismatch! Expected ${uid}, got ${savedUser.uid}`);
            } else {
                log(`✅ Verified UID and Persistence: ${savedUser.uid}`);
            }

            if (savedUser.buyerClientId !== buyerClientId) {
                log(`❌ buyerClientId mismatch!`);
            } else {
                log(`✅ Verified buyerClientId: ${savedUser.buyerClientId}`);
            }

            if (savedUser.sellerClientId !== sellerClientId) {
                log(`❌ sellerClientId mismatch!`);
            } else {
                log(`✅ Verified sellerClientId: ${savedUser.sellerClientId}`);
            }

            if (savedUser.role !== role) {
                log(`❌ Role mismatch! Expected ${role}, got ${savedUser.role}`);
            } else {
                log(`✅ Verified Role: ${savedUser.role}`);
            }

            // Clean up
            await User.deleteOne({ email });
            log(`🧹 Cleaned up test user`);
        }

    } catch (error) {
        log(`❌ Test failed: ${error}`);
    } finally {
        await mongoose.disconnect();
        log('\n👋 Disconnected from MongoDB');
    }
};

testRegistration();
