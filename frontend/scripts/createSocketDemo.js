/**
 * Demo Data Script for Socket.IO Testing
 * Creates sample conversations, tickets, and messages for testing real-time features
 * 
 * Usage: node scripts/createSocketDemo.js
 */

// Demo Users
const demoUsers = {
    buyer1: {
        uid: 'demo_buyer_001',
        email: 'buyer1@gharbazaar.in',
        displayName: 'Rajesh Kumar',
        role: 'buyer',
        photoURL: null
    },
    buyer2: {
        uid: 'demo_buyer_002',
        email: 'buyer2@gharbazaar.in',
        displayName: 'Priya Sharma',
        role: 'buyer',
        photoURL: null
    },
    seller1: {
        uid: 'demo_seller_001',
        email: 'seller1@gharbazaar.in',
        displayName: 'Amit Patel',
        role: 'seller',
        photoURL: null
    },
    seller2: {
        uid: 'demo_seller_002',
        email: 'seller2@gharbazaar.in',
        displayName: 'Sunita Desai',
        role: 'seller',
        photoURL: null
    },
    employee1: {
        uid: 'demo_employee_001',
        email: 'support1@gharbazaar.in',
       displayName: 'Support Agent - Ravi',
        role: 'employee',
        photoURL: null
    },
    employee2: {
        uid: 'demo_employee_002',
        email: 'support2@gharbazaar.in',
        displayName: 'Support Agent - Neha',
        role: 'employee',
        photoURL: null
    },
    customer1: {
        uid: 'demo_customer_001',
        email: 'customer1@example.com',
        displayName: 'Vikram Singh',
        role: 'buyer',
        photoURL: null
    }
};

// Demo Conversations (Buyer-Seller Chats)
const demoConversations = [
    {
        id: 'conv_demo_001',
        participants: ['demo_buyer_001', 'demo_seller_001'],
        property_id: 'prop_demo_123',
        property_title: '3BHK Apartment in Bandra, Mumbai',
        created_at: '2026-01-09T10:00:00Z',
        last_message_at: '2026-01-10T14:30:00Z',
        messages: [
            {
                id: 'msg_001',
                conversation_id: 'conv_demo_001',
                sender_id: 'demo_buyer_001',
                sender_email: 'buyer1@gharbazaar.in',
                content: 'Hi! I\'m interested in viewing this 3BHK apartment. Is it still available?',
                type: 'text',
                read: true,
                created_at: '2026-01-09T10:00:00Z'
            },
            {
                id: 'msg_002',
                conversation_id: 'conv_demo_001',
                sender_id: 'demo_seller_001',
                sender_email: 'seller1@gharbazaar.in',
                content: 'Hello Rajesh! Yes, the property is available. When would you like to schedule a visit?',
                type: 'text',
                read: true,
                created_at: '2026-01-09T10:15:00Z'
            },
            {
                id: 'msg_003',
                conversation_id: 'conv_demo_001',
                sender_id: 'demo_buyer_001',
                sender_email: 'buyer1@gharbazaar.in',
                content: 'Great! How about this weekend? Saturday around 11 AM?',
                type: 'text',
                read: true,
                created_at: '2026-01-09T10:20:00Z'
            },
            {
                id: 'msg_004',
                conversation_id: 'conv_demo_001',
                sender_id: 'demo_seller_001',
                sender_email: 'seller1@gharbazaar.in',
                content: 'Saturday at 11 AM works perfectly. I\'ll share the exact location and meeting point.',
                type: 'text',
                read: true,
                created_at: '2026-01-09T10:25:00Z'
            },
            {
                id: 'msg_005',
                conversation_id: 'conv_demo_001',
                sender_id: 'demo_seller_001',
                sender_email: 'seller1@gharbazaar.in',
                content: 'The property is located at: Plot No. 42, Bandra West, Near Linking Road. I\'ll meet you at the main entrance.',
                type: 'text',
                read: false,
                created_at: '2026-01-10T14:30:00Z'
            }
        ]
    },
    {
        id: 'conv_demo_002',
        participants: ['demo_buyer_002', 'demo_seller_002'],
        property_id: 'prop_demo_456',
        property_title: '2BHK Villa in Goa',
        created_at: '2026-01-10T09:00:00Z',
        last_message_at: '2026-01-10T16:45:00Z',
        messages: [
            {
                id: 'msg_006',
                conversation_id: 'conv_demo_002',
                sender_id: 'demo_buyer_002',
                sender_email: 'buyer2@gharbazaar.in',
                content: 'Hi! I saw your villa listing in Goa. Could you share more details about the amenities?',
                type: 'text',
                read: true,
                created_at: '2026-01-10T09:00:00Z'
            },
            {
                id: 'msg_007',
                conversation_id: 'conv_demo_002',
                sender_id: 'demo_seller_002',
                sender_email: 'seller2@gharbazaar.in',
                content: 'Hello Priya! The villa has a private pool, garden, 24/7 security, and is just 2 km from the beach. It\'s fully furnished with modern amenities.',
                type: 'text',
                read: true,
                created_at: '2026-01-10T09:15:00Z'
            },
            {
                id: 'msg_008',
                conversation_id: 'conv_demo_002',
                sender_id: 'demo_buyer_002',
                sender_email: 'buyer2@gharbazaar.in',
                content: 'Sounds perfect! What\'s the monthly rent?',
                type: 'text',
                read: true,
                created_at: '2026-01-10T09:20:00Z'
            },
            {
                id: 'msg_009',
                conversation_id: 'conv_demo_002',
                sender_id: 'demo_seller_002',
                sender_email: 'seller2@gharbazaar.in',
                content: 'The rent is ₹45,000 per month, including maintenance. Security deposit is 2 months rent.',
                type: 'text',
                read: false,
                created_at: '2026-01-10T16:45:00Z'
            }
        ]
    }
];

// Demo Support Tickets (Employee-Customer)
const demoTickets = [
    {
        id: 'ticket_demo_001',
        user_id: 'demo_customer_001',
        user_role: 'buyer',
        category_title: 'Payment Issue',
        sub_category_title: 'Payment Failed',
        problem: 'My payment failed but the amount was deducted from my bank account. Transaction ID: TXN20260110001',
        status: 'open',
        created_at: '2026-01-10T11:00:00Z',
        assigned_to: null,
        assigned_to_name: null,
        messages: [
            {
                id: 'ticket_msg_001',
                ticket_id: 'ticket_demo_001',
                sender_id: 'demo_customer_001',
                sender_type: 'customer',
                message: 'My payment failed but the amount was deducted from my bank account. This happened 2 hours ago. Transaction ID: TXN20260110001',
                timestamp: '2026-01-10T11:00:00Z'
            },
            {
                id: 'ticket_msg_002',
                ticket_id: 'ticket_demo_001',
                sender_id: 'demo_customer_001',
                sender_type: 'customer',
                message: 'I urgently need help as I need to complete my property booking.',
                timestamp: '2026-01-10T11:05:00Z'
            }
        ]
    },
    {
        id: 'ticket_demo_002',
        user_id: 'demo_buyer_001',
        user_role: 'buyer',
        category_title: 'Account Issue',
        sub_category_title: 'Cannot Login',
        problem: 'I am unable to login to my account. Getting "Invalid credentials" error even though my password is correct.',
        status: 'assigned',
        created_at: '2026-01-10T12:00:00Z',
        assigned_to: 'demo_employee_001',
        assigned_to_name: 'Support Agent - Ravi',
        messages: [
            {
                id: 'ticket_msg_003',
                ticket_id: 'ticket_demo_002',
                sender_id: 'demo_buyer_001',
                sender_type: 'customer',
                message: 'I cannot login to my account. I\'m sure my password is correct, but I keep getting "Invalid credentials" error.',
                timestamp: '2026-01-10T12:00:00Z'
            },
            {
                id: 'ticket_msg_004',
                ticket_id: 'ticket_demo_002',
                sender_id: 'demo_employee_001',
                sender_type: 'employee',
                message: 'Hello Rajesh, I\'ve assigned this ticket to myself. Let me check your account status.',
                timestamp: '2026-01-10T12:15:00Z'
            },
            {
                id: 'ticket_msg_005',
                ticket_id: 'ticket_demo_002',
                sender_id: 'demo_employee_001',
                sender_type: 'employee',
                message: 'I see that your account was temporarily locked due to multiple failed login attempts. I\'ve unlocked it now. Please try to login again with your password.',
                timestamp: '2026-01-10T12:20:00Z'
            },
            {
                id: 'ticket_msg_006',
                ticket_id: 'ticket_demo_002',
                sender_id: 'demo_buyer_001',
                sender_type: 'customer',
                message: 'Thank you! I was able to login successfully!',
                timestamp: '2026-01-10T12:25:00Z'
            }
        ]
    },
    {
        id: 'ticket_demo_003',
        user_id: 'demo_seller_001',
        user_role: 'seller',
        category_title: 'Property Listing',
        sub_category_title: 'Unable to Upload Images',
        problem: 'When I try to upload property images, I get an error message "Upload failed". I\'ve tried multiple times.',
        status: 'in_progress',
        created_at: '2026-01-10T13:00:00Z',
        assigned_to: 'demo_employee_002',
        assigned_to_name: 'Support Agent - Neha',
        messages: [
            {
                id: 'ticket_msg_007',
                ticket_id: 'ticket_demo_003',
                sender_id: 'demo_seller_001',
                sender_type: 'customer',
                message: 'I\'m trying to add images to my new property listing, but every time I upload, I get "Upload failed" error.',
                timestamp: '2026-01-10T13:00:00Z'
            },
            {
                id: 'ticket_msg_008',
                ticket_id: 'ticket_demo_003',
                sender_id: 'demo_employee_002',
                sender_type: 'employee',
                message: 'Hi Amit, I\'ll help you with this. What is the file size and format of the images you\'re trying to upload?',
                timestamp: '2026-01-10T13:10:00Z'
            },
            {
                id: 'ticket_msg_009',
                ticket_id: 'ticket_demo_003',
                sender_id: 'demo_seller_001',
                sender_type: 'customer',
                message: 'The images are JPG format, around 8-10 MB each.',
                timestamp: '2026-01-10T13:15:00Z'
            },
            {
                id: 'ticket_msg_010',
                ticket_id: 'ticket_demo_003',
                sender_id: 'demo_employee_002',
                sender_type: 'employee',
                message: 'That\'s the issue. Our system currently supports images up to 5 MB. Please compress your images and try again. I\'ll also escalate this to increase the limit.',
                timestamp: '2026-01-10T13:20:00Z'
            }
        ]
    },
    {
        id: 'ticket_demo_004',
        user_id: 'demo_buyer_002',
        user_role: 'buyer',
        category_title: 'General Inquiry',
        sub_category_title: 'How to Schedule Visit',
        problem: 'I\'m new to the platform. How do I schedule a property visit?',
        status: 'resolved',
        created_at: '2026-01-09T15:00:00Z',
        assigned_to: 'demo_employee_001',
        assigned_to_name: 'Support Agent - Ravi',
        messages: [
            {
                id: 'ticket_msg_011',
                ticket_id: 'ticket_demo_004',
                sender_id: 'demo_buyer_002',
                sender_type: 'customer',
                message: 'Hi,I\'m new here. How can I schedule a visit to view a property?',
                timestamp: '2026-01-09T15:00:00Z'
            },
            {
                id: 'ticket_msg_012',
                ticket_id: 'ticket_demo_004',
                sender_id: 'demo_employee_001',
                sender_type: 'employee',
                message: 'Hello Priya! Welcome to GharBazaar. To schedule a visit:\n1. Find a property you like\n2. Click "Contact Seller"\n3. Send a message requesting a visit\n4. The seller will respond with available dates',
                timestamp: '2026-01-09T15:05:00Z'
            },
            {
                id: 'ticket_msg_013',
                ticket_id: 'ticket_demo_004',
                sender_id: 'demo_buyer_002',
                sender_type: 'customer',
                message: 'Got it! Thank you for the clear explanation!',
                timestamp: '2026-01-09T15:10:00Z'
            }
        ]
    }
];

// Export for backend usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        demoUsers,
        demoConversations,
        demoTickets
    };
}

// For frontend localStorage usage
if (typeof window !== 'undefined') {
    window.demoSocketData = {
        users: demoUsers,
        conversations: demoConversations,
        tickets: demoTickets
    };

    console.log('✅ Demo Socket.IO data loaded');
    console.log(`📨 ${demoConversations.length} conversations`);
    console.log(`🎫 ${demoTickets.length} tickets`);
    console.log(`👥 ${Object.keys(demoUsers).length} demo users`);
}

/**
 * Instructions for Testing:
 * 
 * 1. BUYER-SELLER CHAT:
 *    - Login as buyer1@gharbazaar.in
 *    - Navigate to Messages/Chat
 *    - Select conversation with Amit Patel
 *    - Send a message in real-time
 *    - Login as seller1@gharbazaar.in in another browser
 *    - See the message appear instantly
 * 
 * 2. EMPLOYEE-CUSTOMER TICKETS:
 *    - Login as support1@gharbazaar.in (employee)
 *    - Navigate to Employee > Tickets
 *    - See all open tickets
 *    - Assign ticket_demo_001 to yourself
 *    - Send a message to the customer
 *    - Login as customer1@example.com in another browser/tab
 *    - Navigate to Support/Help
 *    - See the employee's message appear in real-time
 * 
 * 3. TYPING INDICATORS:
 *    - Open chat in two browsers
 *    - Type in one browser
 *    - See "typing..." indicator in the other
 * 
 * 4. READ RECEIPTS:
 *    - Send a message from one user
 *    - Open the conversation as the other user
 *    - See single checkmark (✓) change to double (✓✓)
 */
