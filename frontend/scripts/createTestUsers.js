/**
 * Firebase Admin Script to Create Test Users
 * 
 * Prerequisites:
 * 1. Install firebase-admin: npm install firebase-admin
 * 2. Download service account key from Firebase Console
 * 3. Place it as 'serviceAccountKey.json' in the same directory
 * 
 * Run: node scripts/createTestUsers.js
 */

const admin = require('firebase-admin');

// Initialize Firebase Admin
// Replace with your service account key path
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const auth = admin.auth();
const db = admin.firestore();

// Test users configuration
const testUsers = [
  {
    email: 'Gharbazaarofficial@zohomail.in',
    password: 'Admin@123',
    role: 'admin',
    name: 'Test Admin',
    displayName: 'Test Admin'
  },
  {
    email: 'Gharbazaarofficial@zohomail.in',
    password: 'Employee@123',
    role: 'employee',
    name: 'Test Employee',
    displayName: 'Test Employee'
  },
  {
    email: 'Gharbazaarofficial@zohomail.in',
    password: 'Legal@123',
    role: 'legal-partner',
    name: 'Test Legal Partner',
    displayName: 'Test Legal Partner'
  },
  {
    email: 'Gharbazaarofficial@zohomail.in',
    password: 'Ground@123',
    role: 'ground-partner',
    name: 'Test Ground Partner',
    displayName: 'Test Ground Partner'
  },
  {
    email: 'Gharbazaarofficial@zohomail.in',
    password: 'Partner@123',
    role: 'partner',
    name: 'Test Partner',
    displayName: 'Test Partner'
  },
  {
    email: 'Gharbazaarofficial@zohomail.in',
    password: 'Founder@123',
    role: 'founder',
    name: 'Test Founder',
    displayName: 'Test Founder'
  },
  {
    email: 'Gharbazaarofficial@zohomail.in',
    password: 'User@123',
    role: 'user',
    name: 'Test User',
    displayName: 'Test User'
  }
];

async function createTestUsers() {
  console.log('🚀 Starting test user creation...\n');

  for (const user of testUsers) {
    try {
      // Check if user already exists
      let userRecord;
      try {
        userRecord = await auth.getUserByEmail(user.email);
        console.log(`ℹ️  User ${user.email} already exists, updating...`);
        
        // Update existing user
        userRecord = await auth.updateUser(userRecord.uid, {
          displayName: user.displayName,
          password: user.password
        });
      } catch (error) {
        // User doesn't exist, create new
        userRecord = await auth.createUser({
          email: user.email,
          password: user.password,
          displayName: user.displayName,
          emailVerified: true // Auto-verify for testing
        });
        console.log(`✅ Created authentication user: ${user.email}`);
      }

      // Create/Update Firestore document
      await db.collection('users').doc(userRecord.uid).set({
        email: user.email,
        name: user.name,
        role: user.role,
        displayName: user.displayName,
        emailVerified: true,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      }, { merge: true });

      console.log(`✅ Created/Updated Firestore document for: ${user.email}`);
      console.log(`   Role: ${user.role}`);
      console.log(`   UID: ${userRecord.uid}\n`);

    } catch (error) {
      console.error(`❌ Error processing ${user.email}:`, error.message);
      console.log('');
    }
  }

  console.log('🎉 Test user creation complete!\n');
  console.log('📋 You can now log in with any of these credentials:\n');
  
  testUsers.forEach(user => {
    console.log(`   ${user.role.toUpperCase().padEnd(20)} → ${user.email} / ${user.password}`);
  });
  
  process.exit(0);
}

// Run the script
createTestUsers().catch(error => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});
