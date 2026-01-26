'use client'

import { useState } from 'react'
import { Search, HelpCircle, ChevronDown, ChevronUp, Home, DollarSign, MessageCircle, Shield, Settings as SettingsIcon, Zap } from 'lucide-react'
import Link from 'next/link'

export default function HelpCenterPage() {
    const [searchQuery, setSearchQuery] = useState('')
    const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null)
    const [selectedCategory, setSelectedCategory] = useState<string>('all')

    const categories = [
        { id: 'all', name: 'All Topics', icon: HelpCircle, color: 'text-blue-600' },
        { id: 'account', name: 'Account & Profile', icon: SettingsIcon, color: 'text-purple-600' },
        { id: 'properties', name: 'Property Listings', icon: Home, color: 'text-green-600' },
        { id: 'payments', name: 'Payments & Billing', icon: DollarSign, color: 'text-orange-600' },
        { id: 'messages', name: 'Messages & Communication', icon: MessageCircle, color: 'text-pink-600' },
        { id: 'legal', name: 'Legal & Compliance', icon: Shield, color: 'text-red-600' },
        { id: 'technical', name: 'Technical Support', icon: Zap, color: 'text-yellow-600' }
    ]

    const faqs = [
        // Account & Profile (5 FAQs)
        {
            id: 'acc1',
            category: 'account',
            question: 'How do I create an account on GharBazaar?',
            answer: `Creating an account on GharBazaar is simple and free! Here's how:

1. **Click "Sign Up"** in the top right corner of the homepage
2. **Choose your role**: Select whether you're a Buyer, Seller, or both
3. **Enter your details**: Provide your name, email address, and create a strong password
4. **Verify your email**: Check your inbox for a verification link and click it
5. **Complete your profile**: Add your phone number, location, and profile picture (optional but recommended)
6. **Set your preferences**: Choose your  preferred language (English, Hindi, Marathi, Tamil) and currency (INR, USD, GBP)

Your account will be activated immediately after email verification. You can then browse properties, save favorites, and start messaging sellers. For sellers, you'll need to complete additional verification steps before listing properties.`
        },
        {
            id: 'acc2',
            category: 'account',
            question: 'How do I change my language and currency settings?',
            answer: `You can customize your language and currency preferences anytime from your dashboard settings:

**To Change Language:**
1. Navigate to **Dashboard → Settings**
2. Click on **"Preferences"** in the left sidebar
3. Select your preferred language from the dropdown (English, हिंदी, मराठी, தமிழ்)
4. The page will reload automatically to apply changes throughout the entire website

**To Change Currency:**
1. Go to **Dashboard → Settings → Preferences**
2. Select your currency:
   - **₹ INR** - Shows prices in Crores/Lakhs format (default)
   - **$ USD** - Shows prices in Million format
   - **£ GBP** - Shows prices in Million format
3. The conversion applies instantly across all property listings

All your preferences are saved to your browser and will persist across sessions.`
        },
        {
            id: 'acc3',
            category: 'account',
            question: 'What should I do if I forget my password?',
            answer: `If you've forgotten your password, don't worry! Follow these steps to reset it:

1. **Click "Forgot Password?"** on the login page
2. **Enter your registered email address**
3. **Check your email** - You'll receive a password reset link within 5 minutes (check spam folder if needed)
4. **Click the reset link** - This link is valid for 1 hour for security reasons
5. **Create a new password** - Make it strong with at least 8 characters, including uppercase, lowercase, numbers, and special characters
6. **Log in** with your new password

**Security Tips:**
- Never share your password with anyone
- Use a unique password that you don't use on other websites
- Enable two-factor authentication from Settings → Privacy & Security for extra protection
- If you don't receive the email, check that you entered the correct email address`
        },
        {
            id: 'acc4',
            category: 'account',
            question: 'How do I enable push notifications for new property listings?',
            answer: `Push notifications help you never miss new properties that match your preferences. Here's how to enable them:

**Enable in Settings:**
1. Go to **Dashboard → Settings → Notifications**
2. Toggle ON **"Push Notifications"** under Notification Channels
3. Toggle ON **"New Properties"** under What to Notify
4. **Grant browser permission** when prompted by your browser

**Browser Permission:**
- Your browser will ask for permission to show notifications
- Click **"Allow"** to receive real-time notifications
- You can revoke this permission anytime from browser settings

**What You'll Be Notified About:**
- **New Property Listings** - When admin approves listings matching your search criteria
- **Chatbot Messages** - When an employee responds to your support ticket
- **Admin Notices** - Important announcements (these are ALWAYS shown regardless of settings)
- **Price Changes** - When saved properties have price updates
- **Messages** - New messages from sellers or buyers

Notifications work even when you're not on the GharBazaar website!`
        },
        {
            id: 'acc5',
            category: 'account',
            question: 'How can I download all my data from GharBazaar?',
            answer: `In compliance with GDPR and data privacy regulations, you can download all your data anytime:

**Download Process:**
1. Go to **Dashboard → Settings → Privacy & Security**
2. Click **"Download My Data"** button
3. The system will compile all your information (this may take a minute)
4. A PDF file will automatically download to your device

**What's Included in the Download:**
- **Profile Information** - Name, email, phone, address, verification status
- **Property Listings** - All your listed properties with full details
- **Messages History** - Chat conversations with buyers/sellers
- **Transaction History** - All payments, bids, and purchases
- **Favorites** - Saved properties and searches
- **Search History** - Your recent property searches
- **Support Tickets** - All chatbot conversations and support interactions
- **Account Activity** - Login history and settings changes

The PDF is formatted for easy readability and can be used for your records or to transfer data to another platform.`
        },

        // Property Listings (5 FAQs)
        {
            id: 'prop1',
            category: 'properties',
            question: 'How do I list a property for sale or rent on GharBazaar?',
            answer: `Listing your property is easy! Follow these steps:

**Prerequisites:**
- Verified seller account
- Active subscription plan (Basic: 3 listings, Premium: 10 listings, Pro: Unlimited)

**Steps to List:**
1. **Navigate to Listings**: Go to Dashboard → My Listings → Add New Listing
2. **Property Type**: Select Apartment, Villa, House, Commercial, or Plot
3. **Transaction Type**: Choose Sale or Rent
4. **Basic Details**:
   - Property title (be descriptive!)
   - Full address with landmark
   - Area/Size in sq ft
   - Number of bedrooms and bathrooms
5. **Pricing**:
   - Set your price (for sale) or monthly rent
   - Add maintenance charges if applicable
6. **Amenities**: Select all available amenities (Pool, Gym, Parking, etc.)
7. **Photos**: Upload at least 5 high-quality photos (max 20)
8. **Description**: Write a detailed description highlighting key features
9. **Documents**: Upload ownership proof (Title Deed, Sale Agreement, or Encumbrance Certificate)
10. **Submit for Review**: Admin will review within 24-48 hours

**After Approval:**
- Your listing goes live immediately
- You'll receive notifications for inquiries
- Track views, favorites, and inquiries from your dashboard`
        },
        {
            id: 'prop2',
            category: 'properties',
            question: 'Why was my property listing rejected?',
            answer: `Property listings may be rejected for several reasons. Here are the most common:

**Common Rejection Reasons:**

**1. Incomplete Information**
- Missing required fields (price, address, area)
- Insufficient property description
- Less than 5 photos uploaded

**2. Low Quality Photos**
- Blurry or dark images
- Photos don't clearly show the property
- Watermarked images from other websites

**3. Document Issues**
- Missing ownership proof
- Documents are unclear or illegible
- Documents don't match property details

**4. Policy Violations**
- Duplicate listings
- Misleading information
- Inappropriate content in description
- Incorrect property category

**5. Pricing Issues**
- Price significantly above or below market rate
- Suspicious pricing that suggests fraud

**What to Do:**
1. **Check Your Email** - Admin sends detailed rejection reasons
2. **Edit Your Listing** - Go to My Listings → Edit
3. **Fix the Issues** - Address all points mentioned in rejection email
4. **Resubmit** - Submit again for review

If you believe your listing was rejected in error, contact support via the chatbot for manual review.`
        },
        {
            id: 'prop3',
            category: 'properties',
            question: 'What are the different seller subscription plans?',
            answer: `GharBazaar offers three subscription tiers to suit different seller needs:

**Basic Seller Plan - ₹999/month**
- List up to **3 properties**
- **1 month** validity
- Basic property analytics
- Standard listing priority
- Email support
- **Best for**: Individual sellers with few properties

**Premium Seller Plan - ₹2,499/3 months**
- List up to **10 properties**
- **3 months** validity
- Advanced analytics with insights
- Higher listing priority
- **Featured badge** on listings
- Priority email & chat support
- **Best for**: Serious  sellers and small agents

**Pro Seller Plan - ₹6,999/6 months**
- **Unlimited property listings**
- **6 months** validity
- Comprehensive analytics dashboard
- **Top priority** in search results
- **Featured + Verified badges**
- Dedicated account manager
- Premium 24/7 support
- API access for bulk uploads
- **Best for**: Professional agents and property dealers

**How Subscriptions Work:**
- Subscribe from Dashboard → Seller Pricing
- First property listing? You'll be redirected to pricing automatically
- Payments via Razorpay (all major cards, UPI, Net Banking)
- Auto-renewal available
- Cancel anytime - unused months are refunded proportionally`
        },
        {
            id: 'prop4',
            category: 'properties',
            question: 'How do I edit or delete my property listing?',
            answer: `Managing your listings is simple from your seller dashboard:

**To Edit a Listing:**
1. Go to **Dashboard → My Listings**
2. Find the property you want to edit
3. Click the **pencil/edit icon** on the property card
4. Make your changes (you can update everything except property type)
5. Click **Save Changes**
6. If changes are significant, listing may go to admin review again

**What You Can Edit:**
- Price and rent amount
- Description and title
- Photos (add/remove)
- Amenities
- Contact preferences
- Availability status

**To Delete a Listing:**
1. Go to **My Listings**
2. Click the **three-dot menu** on the property
3. Select **"Delete Listing"**
4. Confirm deletion
5. Listing is removed immediately

**Important Notes:**
- Deleted listings cannot be recovered
- If your listing has active inquiries, you'll be notified
- Closing a listing frees up a spot in your subscription quota
- For sold properties, click "Mark as Sold" instead of deleting to maintain transaction history`
        },
        {
            id: 'prop5',
            category: 'properties',
            question: 'How does the property search and filtering work?',
            answer: `GharBazaar provides powerful search tools to help you find your perfect property:

**Basic Search:**
- **Location Search**: Type city, locality, or landmark
- **Quick Filters**: Price range, property type (Apartment/Villa/House)
- **Transaction Type**: Sale or Rent

**Advanced Filters** (Click "More Filters"):
- **Budget**: Custom min-max range
- **Bedrooms**: Studio to 5+ BHK
- **Bathrooms**: 1 to 5+
- **Area Size**: Minimum and maximum sq ft
- **Property Age**: New/1-5 years/5-10 years/10+ years
- **Furnishing**: Unfurnished/Semi-furnished/Fully furnished
- **Amenities**: Pool, Gym, Parking, Security, Power Backup, etc.
- **Floor Preference**: Ground floor, specific floor range
- **Facing**: North, South, East, West
- **Availability**: Immediate, 1 month, 3 months, 6 months

**Sorting Options:**
- Price: Low to High / High to Low
- Newest First
- Most Viewed
- Most Favorited
- Area: Small to Large / Large to Small

**Saving Searches:**
- Click "Save this Search" after applying filters
- Get notifications when new properties match your criteria
- Access saved searches from Dashboard

**Map View:**
- Toggle between List and Map view
- See properties plotted on interactive map
- Zoom and pan to explore neighborhoods
- Click markers for quick property preview`
        },

        // Payments & Billing (3 FAQs)
        {
            id: 'pay1',
            category: 'payments',
            question: 'What payment methods are accepted on GharBazaar?',
            answer: `GharBazaar uses Razorpay as our payment gateway, accepting all major payment methods:

**Credit & Debit Cards:**
- Visa
- Mastercard
- American Express
- RuPay
- Maestro

**Net Banking:**
- All major Indian banks
- Instant payment confirmation

**UPI:**
- Google Pay
- PhonePe
- Paytm
- BHIM UPI
- Any UPI app

**Wallets:**
- Paytm Wallet
- PhonePe Wallet
- Mobikwik

**EMI Options:**
- No-cost EMI on select plans
- Card EMI (3, 6, 9, 12 months)
- Available for Premium and Pro subscriptions

**Saved Payment Methods:**
- Save cards for faster checkout
- Manage from Settings → Billing & Payments
- Add multiple payment methods
- First successful payment auto-saves card (if enabled)
- Secure tokenization (we never store full card details)

**Payment Security:**
- All payments are PCI-DSS compliant
- 256-bit SSL encryption
- Two-factor authentication
- 100% secure and verified by Razorpay`
        },
        {
            id: 'pay2',
            category: 'payments',
            question: 'How do refunds work?',
            answer: `Our refund policy is designed to be fair and transparent:

**Subscription Refunds:**

**Within 7 Days of Purchase:**
- **Full refund** if no properties listed
- **Proportional refund** if properties listed (minus usage days)
- Processed within 5-7 business days

**After 7 Days:**
- No refund for monthly plans
- Proportional refund for unused months in quarterly/semi-annual plans
- Calculated as: (Remaining Days / Total Days) × Amount Paid

**Cancellation:**
- Cancel anytime from Settings → Billing
- Access continues until subscription end date
- No auto-renewal after cancellation

**Refund Process:**
1. Go to Settings → Billing & Payments
2. Click "Request Refund" next to your subscription
3. Select reason for refund
4. Submit request
5. Admin reviews within 24 hours
6. Refund credited to original payment method

**Refund Timeline:**
- **Cards**: 5-7 business days
- **UPI/Net Banking**: 3-5 business days
- **Wallets**: 1-2 business days

**Non-Refundable:**
- Transaction fees (Razorpay charges)
- Partially used monthly subscriptions after 7 days
- Promotional discounts (discount amount deducted from refund)

**Contact Support:**
If your refund is delayed beyond 7 business days, contact support via chatbot with your transaction ID.`
        },
        {
            id: 'pay3',
            category: 'payments',
            question: 'How do I add or manage payment methods?',
            answer: `Managing your payment methods is easy and secure:

**Add a New Payment Method:**
1. Go to **Dashboard → Settings → Billing & Payments**
2. Click **"Add Payment Method"** button
3. Choose method type (Card/UPI/Net Banking)
4. For cards: Enter card details (securely tokenized by Razorpay)
5. For UPI: Link your UPI ID
6. **Verify**: Small verification charge (₹1-2, refunded immediately)
7. Set as default (optional)

**Auto-Add on Payment:**
- After any successful payment, you'll be asked:
  - "Save this card for future use?"
- Click "Yes" to auto-save
- Saves time on future purchases

**Manage Existing Methods:**
- View all saved payment methods in Settings
- See last 4 digits only (full card never shown)
- Set any card as default
- Delete unused payment methods
- Update card expiry date

**Security Features:**
- Cards are tokenized (Razorpay stores encrypted tokens, not actual card numbers)
- CVV is NEVER stored (you'll enter it for each payment)
- Two-factor authentication (3D Secure)
- You can delete payment methods anytime

**Supported Cards:**
- Credit cards (Visa, Mastercard, Amex, RuPay)
- Debit cards (all major banks)
- International cards accepted
- Multiple cards can be saved

**Default Payment Method:**
- Used automatically at checkout
- You can override and choose different method at payment time
- Change default anytime from settings`
        },

        // Messages & Communication (3 FAQs)
        {
            id: 'msg1',
            category: 'messages',
            question: 'How do I message a seller about a property?',
            answer: `Connecting with sellers is simple and secure through our integrated messaging system:

**Initiate Contact:**
1. **From Property Page**: Click "Contact Seller" or "Send Message" button
2. **Automatic Conversation**: A new conversation is created automatically
3. **Pre-filled Context**: Property details are shared in the conversation

**Message Features:**
- **Real-time Chat**: Instant messaging with typing indicators
- **Read Receipts**: See when seller reads your message
- **Rich Media**: Send photos, PDFs, documents
- **Emoji Support**: Express yourself with emojis
- **Property Context**: Property details always visible in chat sidebar

**What to Include in First Message:**
- Your interest level (viewing, serious buyer, etc.)
- Preferred time for site visit
- Any specific questions about the property
- Your budget range if negotiating

**Best Practices:**
- Be specific and respectful
- Ask clear questions
- Respond promptly to seller replies
- Use the message history to track all communications

**Privacy & Safety:**
- Phone numbers are hidden initially
- Exchange contact after establishing trust
- Report suspicious accounts
- Never share financial information via messages

**Notifications:**
- Instant push notifications for new messages (if enabled)
- Email summaries (configurable frequency)
- SMS alerts for important messages (optional)`
        },
        {
            id: 'msg2',
            category: 'messages',
            question: 'What is the chatbot and how can it help me?',
            answer: `Our AI-powered chatbot provides instant support 24/7:

**How to Access:**
- Click the **chatbot button** (bottom-right corner on any page)
- Or go to Dashboard → Settings → Help → Contact Support

**What the Chatbot Can Do:**

**1. FAQ Mode:**
- Browse categories: Account, Property Listing, Payments, etc.
- Click on questions for instant answers
- Navigate through subcategories
- Search for specific topics

**2. Agent Help Mode:**
- Click "Need Agent Help?" for human support
- Describe your issue in detail
- Submit screenshots or documents
- Create a support ticket automatically

**3. Live Agent Chat:**
- Employee agents pick up tickets from queue
- Real-time conversation with human agent
- Upload files during chat
- Rate your experience after resolution

**Response Times:**
- **FAQ Answers**: Instant
- **Agent Assignment**: Typically 5-15 minutes during business hours
- **Emergency Issues**: Flagged for immediate attention

**Types of Issues We Handle:**
- Account problems
- Payment failures
- Listing issues
- Technical errors
- Feature requests
- General inquiries

**After Chat:**
- Full conversation history saved
- Accessible from Dashboard → Support
- Email transcript sent to you
- Follow-up notifications

**Pro Tips:**
- Be specific about your issue
- Include error messages or screenshots
- Mention your account email
- Check FAQ first for instant answers`
        },
        {
            id: 'msg3',
            category: 'messages',
            question: 'How do I manage my conversations and notifications?',
            answer: `Take control of your messaging experience with these settings:

**Message Organization:**
- **Dashboard → Messages**: All conversations in one place
- **Filter Options**: Active, Archived, Unread
- **Search**: Find conversations by name or property
- **Archive**: Move old conversations to archive
- **Delete**: Permanently remove conversations

**Notification Settings** (Dashboard → Settings → Notifications):

**Email Notifications:**
- **Real-time**: Instant email for each message
- **Daily Digest**: Summary once per day
- **Weekly Summary**: All messages in weekly email
- **Never**: Disable email notifications

**Push Notifications:**
- **Enable/Disable**: Toggle in browser
- **New Messages**: Get notified instantly
- **Chatbot Responses**: Employee replies
- **Quiet Hours**: Set do-not-disturb times (coming soon)

**SMS Notifications** (Optional):
- Add phone number in Settings → Profile
- Verify number with OTP
- Enable SMS for:
  - Important messages only
  - All new messages
  - Emergency notifications

**Managing Specific Conversations:**
- **Mute**: Stop notifications for specific sellers
- **Block**: Prevent seller from messaging you
- **Report**: Flag suspicious or spam messages
- **Star**: Mark important conversations

**Privacy Controls:**
- Hide online status (Settings → Privacy)
- Disable read receipts
- Control who can message you (Public/Contacts Only)

**Conversation Features:**
- **Edit Messages**: Fix typos (within 5 minutes)
- **Delete Messages**: Remove sent messages
- **Forward**: Share property details with friends
- **Export**: Download conversation as PDF`
        },

        // Legal & Compliance (2 FAQs)
        {
            id: 'legal1',
            category: 'legal',
            question: 'What documents do I need to list my property?',
            answer: `Proper documentation ensures trust and legal compliance:

**Mandatory Documents for Sellers:**

**For Sale Properties:**
1. **Ownership Proof** (Any one):
   - Title Deed / Sale Deed
   - Registered Sale Agreement
   - Allotment Letter (for new properties)
   - Property Tax Receipts

2. **Encumbrance Certificate** (EC):
   - Shows property is free from legal dues
   - Obtained from Sub-Registrar office
   - Should cover last 13-30 years

3. **Latest Property Tax Receipt**:
   - Proves taxes are paid
   - Updated within last year

4. **Building Approval Plan**:
   - Sanctioned by municipal authority
   - Shows property is legally constructed

**For Rental Properties:**
1. **Ownership Proof** (as above)
2. **NOC from Society** (if applicable)
3. **Property Tax Receipt**
4. **Rental Agreement** Template (we provide)

**Additional Documents** (Recommended):
- Occupancy Certificate
- Electrical Safety Certificate
- Water Connection Documents
- Society/Builder  NOC
- Floor Plan of Property

**Document Upload Process:**
1. Scan or photograph documents clearly
2. PDF format preferred (max 5MB per file)
3. Upload during listing creation
4. Admin verifies within 24-48 hours

**Privacy & Security:**
- All documents are encrypted
- Visible only to verified buyers who express serious interest
- Watermarked with your consent before sharing
- Never shared publicly

**Document Verification:**
- Admin team verifies authenticity
- Spot checks with government records
- Verified listings get special badge
- Increases buyer trust and inquiries

**Help with Documents:**
Contact our legal partner network for assistance in obtaining any missing documents.`
        },
        {
            id: 'legal2',
            category: 'legal',
            question: 'What are GharBazaar\'s privacy and data policies?',
            answer: `We take your privacy seriously and comply with all applicable data protection laws:

**Data We Collect:**

**Personal Information:**
- Name, email, phone number
- Profile picture (optional)
- Address and location
- Government ID for verification (encrypted)

**Usage Data:**
- Properties viewed and favorited
- Search history
- Messages and conversations
- Login activity and device information

**Financial Data:**
- Payment methods (tokenized, not raw card details)
- Transaction history
- Subscription information

**How We Use Your Data:**

**To Provide Services:**
- Match you with relevant properties
- Enable messaging between buyers and sellers
- Process payments and subscriptions
- Send notifications you've enabled

**To Improve Platform:**
- Analyze user behavior (anonymized)
- Fix bugs and technical issues
- Develop new features
- Personalize recommendations

**What We DON'T Do:**
- ❌ Sell your data to third parties
- ❌ Share without your consent
- ❌ Use data for unrelated marketing
- ❌ Store payment card details (Razorpay handles this securely)

**Your Rights:**

**Access**: Request copy of all your data (Settings → Download My Data)
**Correction**: Update any incorrect information anytime
**Deletion**: Request account deletion (data erased within 30 days)
**Portability**: Download data in standard formats
**Opt-Out**: Unsubscribe from marketing communications

**Security Measures:**
- 256-bit SSL encryption
- Two-factor authentication available
- Regular security audits
- PCI-DSS compliant payment processing
- Secure data centers in India

**Third-Party Sharing:**
We share data only with trusted partners:
- **Razorpay**: Payment processing (PCI-compliant)
- **Firebase**: Database and authentication
- **SMS Gateway**: OTP and notifications
- **Email Service**: Transactional emails
- All partners bound by strict NDAs

**Data Retention:**
- Active accounts: Data kept as long as account exists
- Deleted accounts: Data purged within 30 days
- Legal requirements: Some data kept for 7 years (tax, transactions)

**Updates to Policy:**
- Notified via email for major changes
- Always reviewable at gharbazaar.in/privacy
- You can export data before policy changes

**Contact:**
For privacy questions: privacy@gharbazaar.in
Data Protection Officer: dpo@gharbazaar.in`
        },

        // Technical Support (2 FAQs)
        {
            id: 'tech1',
            category: 'technical',
            question: 'The website is slow or not loading properly. What should I do?',
            answer: `Experiencing performance issues? Try these troubleshooting steps:

**Quick Fixes:**

**1. Refresh the Page**
- Press Ctrl+R (Windows) or Cmd+R (Mac)
- Or click the refresh button in your browser
- This clears temporary glitches

**2. Clear Browser Cache**
- Chrome: Settings → Privacy → Clear browsing data
- Firefox: Options → Privacy → Clear Data
- Safari: Preferences → Privacy → Manage Website Data
- Select "Cached images and files" and clear

**3. Check Internet Connection**
- Run speed test (Fast.com or Speedtest.net)
- Minimum required: 2 Mbps for smooth experience
- Try switching between WiFi and mobile data
- Restart your router if on WiFi

**4. Try Different Browser**
- We support: Chrome, Firefox, Safari, Edge
- Best performance: Chrome (latest version)
- Update your browser to latest version

**5. Disable Browser Extensions**
- Ad blockers may interfere with functionality
- Temporarily disable extensions and test
- Add GharBazaar to allowed sites if needed

**Still Having Issues?**

**Check Our Status Page:**
- Visit status.gharbazaar.in
- See if there's ongoing maintenance
- Scheduled downtime is announced 24 hours in advance

**Specific Issues:**

**Images Not Loading:**
- Check if you have data saver mode enabled
- Try loading images on different network
- Report specific property IDs with image issues

**Videos/Virtual Tours Not Playing:**
- Ensure JavaScript is enabled
- Update Adobe Flash Player (if prompted)
- Try different browser

**Payment Page Not Loading:**
- Disable browser popup blocker
- Clear cookies and try again
- Check if your bank is performing maintenance

**Chat/Messages Not Working:**
- Check browser console for errors (F12)
- Ensure cookies are enabled
- Try incognito/private browsing mode

**Report Performance Issues:**
1. Open chatbot
2. Select "Technical Support"
3. Include:
   - Your browser and version
   - Operating system
   - Screenshot of error (if any)
   - What you were trying to do
   - Time when issue occurred

Our tech team typically responds within 1 hour during business hours.`
        },
        {
            id: 'tech2',
            category: 'technical',
            question: 'Which devices and browsers are supported?',
            answer: `GharBazaar is optimized for modern devices and browsers:

**Supported Browsers:**

**Desktop:**
- ✅ **Google Chrome** 90+ (Recommended)
- ✅ **Mozilla Firefox** 88+
- ✅ **Microsoft Edge** 90+
- ✅ **Safari** 14+ (macOS)
- ⚠️ **Internet Explorer**: NOT supported (use Edge instead)

**Mobile:**
- ✅ **Chrome** for Android
- ✅ **Safari** for iOS
- ✅ **Firefox** for Android
- ✅ **Samsung Internet Browser**

**Operating Systems:**

**Desktop:**
- Windows 10/11
- macOS 10.14+
- Ubuntu 18.04+
- Chrome OS

**Mobile:**
- Android 8.0+
- iOS 13.0+

**Screen Resolutions:**
- **Minimum**: 1024x768
- **Optimal**: 1920x1080 or higher
- **Mobile**: Fully responsive from 320px width

**Features by Device:**

**Desktop/Laptop:**
- ✅ Full property search and filters
- ✅ Advanced map view
- ✅ Bulk photo upload
- ✅ Document management
- ✅ Detailed analytics dashboard
- ✅ Multi-window messaging

**Tablet:**
- ✅ Touch-optimized interface
- ✅ All major features
- ✅ Landscape and portrait modes
- ⚠️ Bulk uploads may be slower

**Mobile Phone:**
- ✅ Optimized mobile layout
- ✅ Touch gestures
- ✅ Camera integration (photo uploads)
- ✅ Location services
- ⚠️ Analytics in simplified view
- ⚠️ Advanced filters in drawer

**Accessibility:**
- Screen reader compatible
- Keyboard navigation supported
- High contrast mode
- Text resizing (up to 200%)
- Alt text on all images

**Progressive Web App (PWA):**
- Add to home screen on mobile
- Works offline (limited features)
- Fast loading with caching
- Push notifications

**Recommended Setup:**
- **Browser**: Latest Chrome
- **RAM**: 4GB+ for smooth experience
- **Internet**: 5 Mbps+ for best performance
- **Screen**: 13\" or larger for optimal dashboard use

**Not Working on Your Device?**
Contact support with your device details:
- Device model
- Browser and version
- Operating system version
- Screenshot of issue

We'll help optimize your experience!`
        }
    ]

    // Filter FAQs based on search query and category
    const filteredFAQs = faqs.filter(faq => {
        const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory
        const matchesSearch = searchQuery === '' ||
            faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
            faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
        return matchesCategory && matchesSearch
    })

    const toggleFAQ = (id: string) => {
        setExpandedFAQ(expandedFAQ === id ? null : id)
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <div className="flex items-center space-x-2">
                    <Link href="/dashboard/settings" className="text-gray-600 dark:text-gray-400 hover:text-blue-600">
                        Settings
                    </Link>
                    <span className="text-gray-400">/</span>
                    <span className="text-gray-900 dark:text-white font-medium">Help Center</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white flex items-center mt-2">
                    <HelpCircle className="mr-3 text-blue-500" size={28} />
                    Help Center
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                    Find answers to common questions about using GharBazaar
                </p>
            </div>

            {/* Search Bar */}
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 p-6">
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search for help..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>
            </div>

            {/* Category Pills */}
            <div className="flex gap-3 overflow-x-auto pb-2">
                {categories.map((cat) => {
                    const Icon = cat.icon
                    return (
                        <button
                            key={cat.id}
                            onClick={() => setSelectedCategory(cat.id)}
                            className={`flex items-center space-x-2 px-4 py-2 rounded-full font-medium whitespace-nowrap transition-all ${selectedCategory === cat.id
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                                }`}
                        >
                            <Icon size={18} className={selectedCategory === cat.id ? 'text-white' : cat.color} />
                            <span>{cat.name}</span>
                            <span className="text-xs opacity-75">
                                ({faqs.filter(f => cat.id === 'all' || f.category === cat.id).length})
                            </span>
                        </button>
                    )
                })}
            </div>

            {/* Results Count */}
            <div className="text-sm text-gray-600 dark:text-gray-400">
                Showing <span className="font-semibold">{filteredFAQs.length}</span> result{filteredFAQs.length !== 1 ? 's' : ''}
            </div>

            {/* FAQ List */}
            <div className="space-y-3">
                {filteredFAQs.map((faq) => (
                    <div
                        key={faq.id}
                        className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 overflow-hidden"
                    >
                        <button
                            onClick={() => toggleFAQ(faq.id)}
                            className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
                        >
                            <div className="flex-1 pr-4">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                    {faq.question}
                                </h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 capitalize">
                                    {categories.find(c => c.id === faq.category)?.name}
                                </p>
                            </div>
                            {expandedFAQ === faq.id ? (
                                <ChevronUp size={20} className="text-gray-400 flex-shrink-0" />
                            ) : (
                                <ChevronDown size={20} className="text-gray-400 flex-shrink-0" />
                            )}
                        </button>

                        {expandedFAQ === faq.id && (
                            <div className="px-5 pb-5 border-t border-gray-200 dark:border-gray-700 pt-4">
                                <div className="prose prose-sm dark:prose-invert max-w-none">
                                    {faq.answer.split('\n\n').map((paragraph, idx) => {
                                        // Handle bold headers (lines starting with **)
                                        if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
                                            return (
                                                <h4 key={idx} className="text-base font-bold text-gray-900 dark:text-white mt-4 mb-2">
                                                    {paragraph.replace(/\*\*/g, '')}
                                                </h4>
                                            )
                                        }
                                        // Handle numbered lists
                                        if (/^\d+\./.test(paragraph)) {
                                            return (
                                                <p key={idx} className="text-gray-700 dark:text-gray-300 ml-4">
                                                    {paragraph}
                                                </p>
                                            )
                                        }
                                        // Handle bullet points
                                        if (paragraph.startsWith('-') || paragraph.startsWith('•')) {
                                            return (
                                                <p key={idx} className="text-gray-700 dark:text-gray-300 ml-4">
                                                    {paragraph}
                                                </p>
                                            )
                                        }
                                        // Handle checkmarks and crosses
                                        if (paragraph.includes('✅') || paragraph.includes('❌') || paragraph.includes('⚠️')) {
                                            return (
                                                <p key={idx} className="text-gray-700 dark:text-gray-300">
                                                    {paragraph}
                                                </p>
                                            )
                                        }
                                        // Regular paragraphs
                                        return (
                                            <p key={idx} className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                                {paragraph}
                                            </p>
                                        )
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* No Results */}
            {filteredFAQs.length === 0 && (
                <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 p-12 text-center">
                    <HelpCircle size={64} className="mx-auto text-gray-400 mb-4" />
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                        No results found
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                        Try different keywords or browse all categories
                    </p>
                    <button
                        onClick={() => {
                            setSearchQuery('')
                            setSelectedCategory('all')
                        }}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-all"
                    >
                        View All FAQs
                    </button>
                </div>
            )}

            {/* Still Need Help */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg p-8 text-center text-white">
                <h2 className="text-2xl font-bold mb-2">Still need help?</h2>
                <p className="mb-6 opacity-90">
                    Can't find the answer you're looking for? Our support team is here to help!
                </p>
                <Link
                    href="/dashboard/settings"
                    className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-all"
                >
                    Contact Support
                </Link>
            </div>
        </div>
    )
}
