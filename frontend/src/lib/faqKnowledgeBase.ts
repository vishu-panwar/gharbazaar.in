// FAQ Knowledge Base for Chatbot Support System

export interface FAQCategory {
    id: string;
    title: string;
    icon: string;
    subCategories: FAQSubCategory[];
}

export interface FAQSubCategory {
    id: string;
    title: string;
    resolution: string;
    buyerSpecific?: boolean;
    sellerSpecific?: boolean;
}

export const faqKnowledgeBase: FAQCategory[] = [
    {
        id: 'account-auth',
        title: 'Account & Authentication',
        icon: '👤',
        subCategories: [
            {
                id: 'login-issues',
                title: 'Cannot log in to my account',
                resolution: `If you're having trouble logging in, please try these steps:\n\n1. **Verify your credentials**: Double-check that you're using the correct email and password. Remember, passwords are case-sensitive.\n\n2. **Reset your password**: Click on the "Forgot Password" link on the login page. You'll receive a password reset email within 5 minutes. Check your spam folder if you don't see it in your inbox.\n\n3. **Clear browser cache**: Sometimes cached data can cause login issues. Clear your browser cache and cookies, then try logging in again.\n\n4. **Check your email verification**: If you recently signed up, make sure you've verified your email address by clicking the link we sent you.\n\n5. **Try a different browser**: Sometimes browser extensions or settings can interfere with login. Try using an incognito/private window or a different browser.\n\nIf you're still experiencing issues after trying these steps, our support team can help you regain access to your account.`
            },
            {
                id: 'password-reset',
                title: 'How to reset my password',
                resolution: `Resetting your password is quick and easy:\n\n1. **Go to the login page**: Navigate to the GharBazaar login page.\n\n2. **Click "Forgot Password"**: You'll find this link below the password field.\n\n3. **Enter your email**: Provide the email address associated with your account.\n\n4. **Check your email**: Within 5 minutes, you'll receive a password reset link. The link is valid for 1 hour.\n\n5. **Create new password**: Click the link and enter your new password. Make sure it's at least 8 characters long and includes a mix of letters, numbers, and symbols for security.\n\n6. **Log in**: Use your new password to log in immediately.\n\n**Important Security Tips:**\n- Don't share your password with anyone\n- Use a unique password for GharBazaar\n- Consider using a password manager\n- If you didn't request a password reset, ignore the email and contact support immediately`
            },
            {
                id: 'email-verification',
                title: 'Email verification not received',
                resolution: `If you haven't received your verification email:\n\n1. **Check spam/junk folder**: Verification emails sometimes end up in spam. Add noreply@gharbazaar.in to your contacts to prevent this.\n\n2. **Wait a few minutes**: Email delivery can take up to 10 minutes during high-traffic periods.\n\n3. **Verify email address**: Make sure you entered the correct email address during signup. Check for typos.\n\n4. **Resend verification email**: Log in to your account and look for the "Resend Verification Email" button in your profile settings.\n\n5. **Check email filters**: Some email providers have aggressive filters. Check your email settings to ensure GharBazaar emails aren't being blocked.\n\n6. **Try a different email**: If you continue having issues, you can update your email address in settings and verify the new one.\n\nNote: You can still browse properties without email verification, but you'll need to verify your email to list properties, send messages, or make bids.`
            },
            {
                id: 'account-security',
                title: 'Suspicious activity on my account',
                resolution: `If you notice suspicious activity on your account, take immediate action:\n\n1. **Change your password immediately**: Go to Settings > Security and change your password right away.\n\n2. **Review recent activity**: Check your account activity log in Settings to see recent logins and actions.\n\n3. **Check active sessions**: Review all active sessions and log out any unrecognized devices.\n\n4. **Review account changes**: Verify your profile information, payment methods, and listings haven't been modified.\n\n5. **Enable two-factor authentication**: Add an extra layer of security to your account in Settings > Security.\n\n**What we do to protect you:**\n- We monitor for unusual login patterns\n- We encrypt all sensitive data\n- We never ask for your password via email or phone\n- We send notifications for important account changes\n\nIf you believe your account has been compromised, contact our security team immediately for assistance.`
            },
            {
                id: 'update-profile',
                title: 'How to update my profile information',
                resolution: `Updating your profile is simple:\n\n1. **Navigate to Settings**: Click your profile picture in the top-right corner and select "Settings".\n\n2. **Edit Profile section**: You can update:\n   - Name and display name\n   - Email address (requires verification)\n   - Phone number (requires OTP verification)\n   - Profile picture\n   - Bio and description\n\n3. **Save changes**: Click "Save Changes" at the bottom of the page.\n\n4. **Verification for sensitive changes**: If you change your email or phone, you'll need to verify the new information before it takes effect.\n\n**Profile Tips:**\n- Use a clear profile picture to build trust\n- Buyers: Add your property preferences\n- Sellers: Include information about why you're selling\n- Keep your contact information up to date for smooth communication\n\nYour profile information helps other users connect with you and builds trust in the GharBazaar community.`
            },
            {
                id: 'delete-account',
                title: 'How to delete my account',
                resolution: `We're sorry to see you go. Here's how to delete your account:\n\n1. **Go to Settings > Account**: Navigate to the Account section in your settings.\n\n2. **Click "Delete Account"**: You'll find this option at the bottom of the page.\n\n3. **Understand what happens**: Before deleting:\n   - All your listings will be permanently removed\n   - Your bids and messages will be deleted\n   - Active subscriptions will be cancelled (no refunds for partial periods)\n   - Your profile data will be permanently deleted\n   - This action cannot be undone\n\n4. **Confirm deletion**: Enter your password and click "Permanently Delete Account".\n\n5. **Complete any pending transactions**: Make sure you have no active contracts or pending payments before deleting.\n\n**Alternatives to consider:**\n- **Deactivate instead**: Temporarily disable your account without losing data\n- **Pause listings**: Keep your account but hide all listings\n- **Contact support**: Let us know why you're leaving - we might be able to help\n\nYou'll receive a confirmation email once your account is deleted.`
            }
        ]
    },
    {
        id: 'property-listings',
        title: 'Property Listings',
        icon: '🏠',
        subCategories: [
            {
                id: 'create-listing',
                title: 'How to create a new property listing',
                resolution: `Creating a property listing on GharBazaar is easy:\n\n1. **Check your subscription**: Ensure you have an active seller plan. Go to Dashboard > Seller Pricing to subscribe if needed.\n\n2. **Click "Add Listing"**: Find this button in your seller dashboard header or on the My Listings page.\n\n3. **Fill in property details**:\n   - Property type (House, Apartment, Plot, etc.)\n   - Location with full address\n   - Price and currency\n   - Area/size and dimensions\n   - Number of bedrooms, bathrooms\n   - Amenities and features\n\n4. **Upload photos**: Add at least 5 high-quality photos. First photo becomes the main image.\n\n5. **Add description**: Write a detailed, honest description highlighting key features.\n\n6. **Set preferences**: Choose visibility settings and contact preferences.\n\n7. **Review and publish**: Double-check all information and click "Publish Listing".\n\n**Tips for great listings:**\n- Use well-lit, high-resolution photos\n- Be honest and detailed in descriptions\n- Include nearby landmarks and amenities\n- Set a competitive, realistic price\n- Respond quickly to inquiries\n\nYour listing will be live within 24 hours after admin verification!`,
                sellerSpecific: true
            },
            {
                id: 'edit-listing',
                title: 'How to edit an existing listing',
                resolution: `Need to update your listing? Here's how:\n\n1. **Go to My Listings**: Navigate to Dashboard > My Listings.\n\n2. **Find your property**: Use the search or filter to locate the listing you want to edit.\n\n3. **Click "Edit"**: Click the edit icon or "Edit Listing" button.\n\n4. **Make your changes**: Update any information:\n   - Price adjustments\n   - Photo additions or removals\n   - Description updates\n   - Availability status\n   - Amenities or features\n\n5. **Save changes**: Click "Save Changes" when done.\n\n6. **Re-verification**: Major changes (price, location, property type) may require admin re-verification.\n\n**What you can edit anytime:**\n- Description and details\n- Photos (add/remove/reorder)\n- Availability status\n- Contact preferences\n\n**What requires verification:**\n- Price changes over 20%\n- Location changes\n- Property type changes\n\n**Pro tip**: Keep your listing updated with current information to maintain buyer trust and improve visibility in search results.`,
                sellerSpecific: true
            },
            {
                id: 'listing-not-visible',
                title: 'My listing is not showing in search',
                resolution: `If your listing isn't appearing in search results:\n\n1. **Check listing status**: Go to My Listings and verify your listing status is "Active" not "Draft" or "Under Review".\n\n2. **Verify admin approval**: New listings require admin verification (usually within 24 hours). Check for any verification pending notices.\n\n3. **Check subscription status**: Ensure your seller subscription is active. Expired subscriptions hide all listings.\n\n4. **Review visibility settings**: Make sure you didn't accidentally set the listing to "Private" or "Hidden".\n\n5. **Search filters**: Try different search filters. Your property might not match certain filter criteria buyers are using.\n\n6. **Complete all required fields**: Listings with incomplete information may have reduced visibility. Fill in all optional fields for better ranking.\n\n7. **Quality score**: Listings with good photos, detailed descriptions, and quick response rates rank higher in search.\n\n**Boost your visibility:**\n- Add more high-quality photos (aim for 10+)\n- Write detailed, keyword-rich descriptions\n- Respond quickly to inquiries\n- Keep pricing competitive\n- Update listing regularly\n\nIf your listing is still not visible after 24 hours, contact support for manual review.`,
                sellerSpecific: true
            },
            {
                id: 'delete-listing',
                title: 'How to delete or deactivate a listing',
                resolution: `You can either deactivate (pause) or permanently delete a listing:\n\n**To Deactivate (Recommended):**\n1. Go to My Listings\n2. Find the property\n3. Toggle the "Active" switch to OFF\n4. Your listing is hidden but data is preserved\n5. Reactivate anytime by toggling back ON\n\n**To Permanently Delete:**\n1. Go to My Listings\n2. Click the three-dot menu on the listing\n3. Select "Delete Listing"\n4. Confirm deletion (this cannot be undone)\n5. All data, photos, and inquiry history will be permanently removed\n\n**What happens when you delete:**\n- Listing removed from search immediately\n- All photos and documents deleted\n- Inquiry history removed\n- Active bids cancelled\n- Cannot be recovered\n\n**When to deactivate vs delete:**\n- **Deactivate**: Property sold but might list another soon, temporary off-market\n- **Delete**: Never listing this property again, permanently sold\n\n**Note**: Deleted listings don't count toward your subscription limit, but deactivated ones do. Consider deleting if you need space for new listings.`,
                sellerSpecific: true
            },
            {
                id: 'subscription-limits',
                title: 'Understanding listing limits and subscriptions',
                resolution: `GharBazaar offers tiered subscription plans for sellers:\n\n**Basic Seller Plan - ₹1,000/month:**\n- Up to 3 active listings\n- Basic analytics\n- Standard support\n- 30-day duration\n\n**Premium Seller Plan - ₹3,500/3 months:**\n- Up to 10 active listings\n- Advanced analytics\n- Priority support\n- Featured listing badge\n- 90-day duration\n\n**Pro Seller Plan - ₹6,000/6 months:**\n- Unlimited listings\n- Premium analytics with insights\n- 24/7 priority support\n- Featured in search results\n- Verified seller badge\n- 180-day duration\n\n**How limits work:**\n- Only "Active" listings count toward your limit\n- Deactivated listings still count\n- Deleted listings don't count\n- You'll be redirected to pricing page when limit reached\n\n**Managing your listings:**\n- Delete sold properties to free up slots\n- Upgrade plan for more listings\n- Deactivate temporarily unavailable properties\n\n**Auto-renewal**: Subscriptions auto-renew unless cancelled. Manage in Settings > Subscriptions.\n\nNeed help choosing? Contact support for personalized recommendations!`,
                sellerSpecific: true
            },
            {
                id: 'featured-listings',
                title: 'How to feature my listing',
                resolution: `Featured listings get premium visibility:\n\n**What are featured listings:**\n- Appear at top of search results\n- Highlighted with special badge\n- Shown in homepage featured section\n- 3x more views on average\n- Priority in category browsing\n\n**How to get featured:**\n1. **Premium/Pro subscription**: Automatically included in Premium and Pro seller plans\n2. **One-time boost**: Purchase a 7-day featured boost for ₹500 per listing\n3. **Quality promotion**: High-quality listings may be featured by admins for free\n\n**To purchase featured boost:**\n1. Go to My Listings\n2. Click on the listing you want to feature\n3. Click "Boost Listing"\n4. Select duration (7, 14, or 30 days)\n5. Complete payment\n6. Your listing goes live in featured section within 1 hour\n\n**Maximize featured listing impact:**\n- Ensure you have great photos\n- Write compelling headlines\n- Price competitively\n- Respond to inquiries within 1 hour\n- Keep listing information current\n\n**Featured listing metrics:**\nTrack performance in Dashboard > Analytics to see views, inquiries, and conversion rates.\n\nNote: Featured status doesn't guarantee sales - quality and pricing still matter!`,
                sellerSpecific: true
            }
        ]
    },
    {
        id: 'search-browse',
        title: 'Search & Browse',
        icon: '🔍',
        subCategories: [
            {
                id: 'search-filters',
                title: 'How to use search filters',
                resolution: `GharBazaar's powerful search filters help you find your perfect property:\n\n**Basic Filters:**\n- **Location**: Search by city, area, or pin code\n- **Property Type**: House, Apartment, Villa, Plot, Commercial\n- **Price Range**: Set minimum and maximum budget\n- **Area/Size**: Filter by square feet or square meters\n\n**Advanced Filters:**\n- **Bedrooms/Bathrooms**: Exact count or minimum\n- **Furnishing**: Fully furnished, semi-furnished, unfurnished\n- **Parking**: Car/bike parking availability\n- **Age of Property**: New, 1-5 years, 5-10 years, 10+ years\n- **Floor**: Specific floor preferences\n- **Facing**: North, South, East, West\n- **Amenities**: Pool, gym, garden, security, etc.\n\n**How to apply filters:**\n1. Click "Filters" button on Browse page\n2. Select your preferences\n3. Click "Apply Filters"\n4. Results update automatically\n5. Refine by adjusting filters\n\n**Saving searches:**\n- Click "Save Search" to save filter combinations\n- Get email alerts when new properties match\n- Access saved searches in Dashboard\n\n**Tips for better results:**\n- Start broad, then narrow down\n- Use location wisely - try nearby areas\n- Be flexible with price range (±10%)\n- Prioritize must-have features\n\nClear all filters anytime to start fresh!`,
                buyerSpecific: true
            },
            {
                id: 'saved-searches',
                title: 'Managing saved searches and alerts',
                resolution: `Saved searches help you track new properties automatically:\n\n**Creating a saved search:**\n1. Apply your desired filters on Browse page\n2. Click "Save Search" button\n3. Name your search (e.g., "3BHK South Mumbai")\n4. Choose alert preferences:\n   - Instant email (immediately)\n   - Daily digest (once per day)\n   - Weekly summary (once per week)\n   - No alerts (manual check only)\n5. Click "Save"\n\n**Managing saved searches:**\n- **View all**: Dashboard > Saved Searches\n- **Edit**: Click edit icon to modify filters or alerts\n- **Run search**: Click to see current matching properties\n- **Delete**: Remove searches you no longer need\n- **Pause alerts**: Keep search but stop notifications\n\n**Alert notifications include:**\n- Number of new properties\n- Featured properties matching criteria\n- Price changes on matching properties\n- Direct links to new listings\n\n**Best practices:**\n- Create multiple searches for different preferences\n- Use specific names for easy identification\n- Set realistic criteria to avoid too many/few alerts\n- Update searches as your preferences change\n- Maximum 10 saved searches per account\n\n**Pro tip**: Combine saved searches with favorites to track properties you're seriously considering vs. general market research.`,
                buyerSpecific: true
            },
            {
                id: 'favorites-not-saved',
                title: 'My favorite properties disappeared',
                resolution: `If your favorited properties are missing:\n\n**Common causes and solutions:**\n\n1. **Browser data cleared**: Favorites are stored locally and in your account.\n   - **Solution**: Log in to see cloud-saved favorites\n   - Enable "Sync favorites" in Settings\n\n2. **Different device/browser**: Not logged in on new device.\n   - **Solution**: Log in to access your favorites across devices\n\n3. **Property removed**: Seller deleted the listing.\n   - **Solution**: Check "Recently removed" in Favorites page\n   - You'll see a notice if property was deleted\n\n4. **Logged out session**: Browsing as guest doesn't save favorites.\n   - **Solution**: Always log in before favoriting\n\n5. **Account sync issue**: Temporary sync failure.\n   - **Solution**: Refresh page or log out and back in\n\n**Preventing future loss:**\n- Always log in before favoriting\n- Enable favorite sync in Settings\n- Export favorites list (Dashboard > Favorites > Export)\n- Use "Share Collection" to email yourself the list\n\n**Recovering favorites:**\n- Check browser history if recently viewed\n- Review "Recently Viewed" in Dashboard\n- Contact support with approximate dates\n\nNote: We keep deleted property info for 30 days to help recover lost favorites.`,
                buyerSpecific: true
            },
            {
                id: 'browse-by-location',
                title: 'Finding properties in specific locations',
                resolution: `GharBazaar offers multiple ways to search by location:\n\n**Method 1: Search Bar**\n1. Type location in main search bar\n2. Auto-suggestions appear\n3. Select exact area, landmark, or pin code\n4. View all properties in that location\n\n**Method 2: Map View**\n1. Click "Map View" on Browse page\n2. Navigate to your preferred area\n3. Zoom in for specific neighborhoods\n4. Click property markers for details\n5. Properties load as you move the map\n\n**Method 3: Browse by City**\n1. Homepage > Select city\n2. Choose area from list\n3. Further narrow by sub-locality\n\n**Method 4: Advanced Location Filters**\n- Distance from landmark (e.g., "within 2km of station")\n- Multiple locations (OR search)\n- Exclude specific areas\n\n**Location tips:**\n- Use pin codes for exact areas\n- Try alternate area names (common spellings)\n- Search nearby areas for more options\n- Check "Include surrounding areas" option\n- Use landmarks (schools, hospitals, stations)\n\n**Location-based features:**\n- Walking score and transit access\n- Nearby amenities (schools, hospitals, malls)\n- Distance to major landmarks\n- Neighborhood information\n\n**Can't find a location?** Contact support to add new areas to our database!`
            },
            {
                id: 'property-recommendations',
                title: 'Getting personalized property recommendations',
                resolution: `GharBazaar's AI learns your preferences to suggest perfect properties:\n\n**How recommendations work:**\n1. **Activity tracking**: We analyze:\n   - Properties you view and favorite\n   - Search patterns and filters used\n   - Time spent on different listings\n   - Properties you inquire about\n   - Your saved searches\n\n2. **Preference learning**: System identifies:\n   - Preferred locations and neighborhoods\n   - Budget patterns\n   - Property type preferences\n   - Must-have amenities\n   - Size and layout preferences\n\n3. **Smart suggestions**: Receive:\n   - Similar properties\n   - Alternative neighborhoods\n   - Properties slightly above/below budget\n   - New listings matching your profile\n\n**Improving recommendations:**\n- **Complete your profile**: Add preferences in Settings\n- **Use favorites**: Favorite properties you like\n- **Active search**: More activity = better suggestions\n- **Provide feedback**: Rate recommendations (thumbs up/down)\n- **Update preferences**: Keep profile current\n\n**Where to find recommendations:**\n- Dashboard > Recommended for You\n- Email notifications (if enabled)\n- Top of search results\n- After viewing property details\n\n**Privacy**: Your activity stays private. We use it only for recommendations, never share with third parties.\n\n**Reset recommendations**: Settings > Clear recommendation history to start fresh.`,
                buyerSpecific: true
            },
            {
                id: 'compare-properties',
                title: 'How to compare multiple properties',
                resolution: `Compare up to 4 properties side-by-side:\n\n**Adding to comparison:**\n1. **From search results**: Click "Compare" checkbox on property cards\n2. **From property details**: Click "Add to Compare" button\n3. **From favorites**: Select properties and click "Compare Selected"\n\n**Viewing comparison:**\n1. Compare bar appears at bottom showing selected properties\n2. Click "Compare" button to open full comparison\n3. Side-by-side view shows all details\n\n**What you can compare:**\n- **Price**: Absolute price and price per sq ft\n- **Location**: Area, address, distance metrics\n- **Size**: Total area, room counts, dimensions\n- **Amenities**: Full amenities checklist\n- **Features**: Age, facing, floor, parking\n- **Seller**: Response rate, ratings, verification\n- **Photos**: Gallery view for each property\n- **Financial**: EMI calculator comparisons\n\n**Comparison features:**\n- **Highlight differences**: Toggle to show only differing attributes\n- **Export**: Download comparison as PDF\n- **Share**: Email comparison to family/friends\n- **Schedule visits**: Book visits for all properties at once\n- **Notes**: Add personal notes to each property\n\n**Best practices:**\n- Compare similar property types\n- Focus on your must-have features\n- Consider location vs. amenities trade-offs\n- Use price per sq ft for fair comparison\n\nMaximum 4 properties at once. Remove one to add another.`,
                buyerSpecific: true
            }
        ]
    },
    {
        id: 'payments-pricing',
        title: 'Payments & Pricing',
        icon: '💳',
        subCategories: [
            {
                id: 'payment-methods',
                title: 'Available payment methods',
                resolution: `GharBazaar supports multiple secure payment options:\n\n**For Subscriptions & Services:**\n\n1. **Credit/Debit Cards**:\n   - Visa, Mastercard, RuPay, American Express\n   - Instant processing\n   - Saved cards for quick checkout\n   - Secure 3D authentication\n\n2. **UPI (Unified Payments Interface)**:\n   - Google Pay, PhonePe, Paytm, BHIM\n   - Instant payment confirmation\n   - No additional charges\n   - Scan QR or enter VPA\n\n3. **Net Banking**:\n   - All major Indian banks supported\n   - Secure bank gateway redirect\n   - Instant confirmation\n\n4. **Digital Wallets**:\n   - Paytm, PhonePe, Amazon Pay\n   - Quick one-click payments\n\n**Payment Security:**\n- PCI DSS compliant\n- 256-bit SSL encryption\n- No card details stored on our servers\n- Razorpay secure payment gateway\n- Two-factor authentication\n\n**Saved Payment Methods:**\n- Save cards for future use\n- Remove anytime from Settings > Payment Methods\n- All saved data is encrypted\n\n**International Payments:**\n- International cards accepted\n- Currency auto-conversion\n- DCC (Dynamic Currency Conversion) available\n\nAll payments are processed securely through our certified payment partners. We never see or store your complete card details.`
            },
            {
                id: 'payment-failed',
                title: 'Payment failed or declined',
                resolution: `If your payment was declined, here's what to do:\n\n**Common Reasons:**\n\n1. **Insufficient Funds**: Check account balance\n   - **Solution**: Add funds or use different payment method\n\n2. **Card Expired**: Check card expiry date\n   - **Solution**: Use a valid card or update card details\n\n3. **Incorrect CVV/OTP**: Wrong security code entered\n   - **Solution**: Double-check CVV (3 digits on back) and OTP\n\n4. **Bank Decline**: Bank blocked transaction\n   - **Solution**: Contact your bank to enable online transactions\n   - Enable international transactions if applicable\n\n5. **Daily Limit Exceeded**: Transaction exceeds daily limit\n   - **Solution**: Try smaller amount or wait 24 hours\n   - Contact bank to increase limit\n\n6. **Network Issues**: Payment gateway timeout\n   - **Solution**: Check internet connection and retry\n\n**Important: Check for Duplicate Charges**\n- If payment failed, check bank statement\n- Amount may be on hold temporarily\n- Auto-refunded within 5-7 business days\n- Contact support if charged but subscription not active\n\n**Retrying Payment:**\n1. Wait 5 minutes before retrying\n2. Use different payment method\n3. Clear browser cache\n4. Try incognito/private mode\n5. Contact your bank if issue persists\n\n**Still Having Issues?**\nContact support with:\n- Transaction ID (if available)\n- Payment method used\n- Error message screenshot\n- Date and time of attempt`
            },
            {
                id: 'refund-policy',
                title: 'Refund policy and process',
                resolution: `GharBazaar refund policy:\n\n**Subscription Refunds:**\n\n**Eligible for Refund:**\n- Payment error/duplicate charge: Full refund\n- Service not activated within 48 hours: Full refund\n- Technical issues preventing usage: Prorated refund\n- Within 7 days of purchase with no listings published: Full refund\n\n**NOT Eligible for Refund:**\n- Changed mind after 7 days\n- Already published listings\n- Subscription period partially used\n- Auto-renewal charges (if not cancelled before renewal)\n\n**Refund Process:**\n1. **Request refund**: Settings > Subscriptions > Request Refund\n2. **Provide reason**: Select cancellation reason\n3. **Review period**: 2-3 business days\n4. **Approval**: Notified via email\n5. **Refund processed**: 5-7 business days to original payment method\n\n**Refund Timeline:**\n- Credit/Debit Card: 5-7 business days\n- UPI/Net Banking: 3-5 business days\n- Wallet: Instant to 24 hours\n\n**Prorated Refunds:**\nFor technical issues:\n- Unused days calculated\n- Processing fee may apply\n- Minimum refund: ₹50\n\n**Cancellation vs Refund:**\n- **Cancel**: Stops auto-renewal, no refund, service continues till period end\n- **Refund request**: May get partial/full refund, service stops immediately\n\n**Dispute Resolution:**\nIf refund request denied, contact support with:\n- Order ID\n- Reason for refund\n- Supporting documentation\n\nAll refund decisions are final.`
            },
            {
                id: 'subscription-management',
                title: 'Managing my subscription',
                resolution: `Complete guide to managing your GharBazaar subscription:\n\n**Viewing Subscription Status:**\n- Dashboard > Seller Pricing\n- Settings > Subscriptions\n- Shows: Plan type, expiry date, listings used, auto-renewal status\n\n**Upgrading Your Plan:**\n1. Go to Dashboard > Seller Pricing\n2. Select higher tier plan\n3. Pay the difference (prorated)\n4. New benefits activate immediately\n5. Listing limits update instantly\n\n**Downgrading Your Plan:**\n- Not available mid-cycle\n- Let current plan expire, then purchase lower tier\n- Or cancel and buy new plan (loses remaining days)\n\n**Cancelling Auto-Renewal:**\n1. Settings > Subscriptions\n2. Click "Cancel Auto-Renewal"\n3. Confirm cancellation\n4. Service continues until current period ends\n5. No charges on renewal date\n\n**Reactivating Auto-Renewal:**\n1. Settings > Subscriptions\n2. Click "Enable Auto-Renewal"\n3. Confirm payment method\n4. Will auto-renew on next cycle\n\n**Manual Renewal:**\n- If auto-renewal off, renew manually before expiry\n- Go to Seller Pricing page\n- Purchase same or different plan\n- No gap in service if renewed before expiry\n\n**Subscription Benefits:**\n- Check Settings > Subscriptions for current features\n- Compare plans to see upgrade benefits\n\n**Expiry Notifications:**\n- Email 7 days before expiry\n- Dashboard notification 3 days before\n- Final reminder 1 day before\n\n**After Expiry:**\n- Listings automatically hidden\n- Data preserved for 30 days\n- Renew anytime to restore listings`,
                sellerSpecific: true
            },
            {
                id: 'invoice-receipt',
                title: 'Getting payment receipts and invoices',
                resolution: `Access your payment receipts and tax invoices:\n\n**Downloading Receipts:**\n\n1. **From Settings:**\n   - Settings > Billing History\n   - View all past payments\n   - Click "Download Receipt" for any transaction\n\n2. **From Email:**\n   - Check email after each payment\n   - Subject: "Payment Receipt - GharBazaar"\n   - Download PDF attachment\n\n3. **From Dashboard:**\n   - Dashboard > Subscriptions\n   - "View Invoice" link next to active subscription\n\n**Receipt Contents:**\n- Transaction ID\n- Date and time\n- Plan purchased\n- Amount paid (including taxes)\n- Payment method\n- GST breakdown (if applicable)\n- Billing address\n\n**GST Invoices:**\nFor businesses needing GST invoices:\n1. Settings > Billing Settings\n2. Add GST number and company details\n3. Future invoices will include GST\n4. Request updated invoices for past 30 days\n\n**Bulk Download:**\n- Settings > Billing History\n- Select date range\n- Click "Download All Receipts"\n- Receives ZIP file via email\n\n**Lost Receipt:**\n- Check spam/junk folder\n- Settings > Billing History > Resend Receipt\n- Contact support with transaction ID\n\n**What if details are wrong:**\n- Contact support within 7 days\n- Provide correct billing information  \n- Revised invoice issued within 3 business days\n\n**Accounting Integration:**\n- Export as CSV for accounting software\n- API available for automated receipt fetching (Enterprise plans)`
            },
            {
                id: 'pricing-comparison',
                title: 'Understanding different pricing plans',
                resolution: `Detailed comparison of GharBazaar seller plans:\n\n**Basic Seller Plan - ₹1,000/month**\n\nBest for: New sellers, testing the platform\n\n**Features:**\n- 3 active listings maximum\n- Basic property analytics (views, inquiries)\n- Standard search visibility\n- Email support (48-hour response)\n- Standard listing duration\n- Inquiry management\n- Photo uploads (up to 10 per listing)\n\n**Premium Seller Plan - ₹3,500/3 months (₹1,167/month)**\n\nBest for: Active sellers with multiple properties\n\n**Features:**\n- 10 active listings maximum\n- Advanced analytics (visitor demographics, heat maps)\n- Priority search ranking\n- Featured listing badge\n- Email + chat support (24-hour response)\n- Extended listing duration\n- Unlimited photo uploads\n- Promoted in weekly newsletter\n- Lead management tools\n\n**Pro Seller Plan - ₹6,000/6 months (₹1,000/month)**\n\nBest for: Professional sellers, real estate agents\n\n**Features:**\n- Unlimited listings\n- Premium analytics + AI insights\n- Top search placement\n- "Verified Seller" badge\n- 24/7 priority support (phone + chat + email)\n- Dedicated account manager\n- API access for bulk operations\n- Custom branding on listings\n- Social media auto-sharing\n- Early access to new features\n\n**ROI Comparison:**\n- Basic: ₹333 per listing/month\n- Premium: ₹117 per listing/month\n- Pro: Unlimited at ₹1,000/month\n\n**Choosing the Right Plan:**\n- **1-2 properties**: Basic\n- **3-8 properties**: Premium (best value)\n- **9+ properties or agency**: Pro\n\n**All Plans Include:**\n- Inquiry management\n- Secure messaging\n- Visit scheduling\n- Document sharing\n- Mobile app access\n- Analytics dashboard\n\nUpgrade or downgrade anytime!`,
                sellerSpecific: true
            }
        ]
    },
    {
        id: 'messages-communication',
        title: 'Messages & Communication',
        icon: '💬',
        subCategories: [
            {
                id: 'send-message',
                title: 'How to contact a property seller',
                resolution: `Contacting sellers on GharBazaar is easy and secure:\n\n**From Property Listing:**\n1. Open the property details page\n2. Click "Contact Seller" button\n3. Choose contact method:\n   - **Send Message**: In-platform secure messaging\n   - **Request Call**: Seller calls you at convenient time\n   - **Share Phone**: Reveal your number to seller\n   - **Schedule Visit**: Direct visit booking\n\n**Sending Your First Message:**\n1. Write a clear, polite message\n2. Include:\n   - Your interest level\n   - Preferred viewing time\n   - Specific questions about property\n   - Budget confirmation (if comfortable)\n3. Click "Send Message"\n4. Seller receives instant notification\n\n**Message Templates:**\nUse quick message templates:\n- "I'm interested in viewing this property"\n- "Is this property still available?"\n- "Can we schedule a visit this weekend?"\n- "I have questions about the amenities"\n\n**Best Practices:**\n- Be specific about your requirements\n- Be respectful and professional\n- Respond promptly to seller replies\n- Use in-platform messaging for safety\n- Don't share financial details initially\n\n**Privacy & Safety:**\n- Phone numbers hidden until you choose to share\n- Report inappropriate messages\n- All conversations logged for security\n- Block users if needed\n\n**Response Time:**\n- Most sellers respond within 4 hours\n- Check seller's average response time on profile\n- Send follow-up after 24 hours if no response\n\n**Tracking Conversations:**\nAll messages saved in Dashboard > Messages`,
                buyerSpecific: true
            },
            {
                id: 'message-notifications',
                title: 'Not receiving message notifications',
                resolution: `Fix message notification issues:\n\n**Check Notification Settings:**\n\n1. **In-App Settings:**\n   - Settings > Notifications\n   - Enable "Message Notifications"\n   - Enable "Email Notifications"\n   - Enable "Push Notifications" (mobile app)\n\n2. **Email Notifications:**\n   - Check spam/junk folder\n   - Add noreply@gharbazaar.in to contacts\n   - Verify email address in Settings > Profile\n   - Check email provider's filters\n\n3. **Browser Notifications:**\n   - Allow browser notification permissions\n   - Check browser settings for GharBazaar\n   - Enable desktop notifications\n\n4. **Mobile App Notifications:**\n   - Allow notifications in phone settings\n   - Enable background app refresh\n   - Check Do Not Disturb mode\n\n**Notification Preferences:**\n\nCustomize what you receive:\n- **Instant**: Immediate notification for each message\n- **Batched**: Digest every 2 hours\n- **Daily Summary**: Once per day\n- **Off**: No notifications (check manually)\n\n**Troubleshooting:**\n\n1. **Test notification**: Settings > Send Test Notification\n2. **Clear app data**: Logout and login again\n3. **Update app**: Check for latest version\n4. **Check connection**: Verify internet connectivity\n5. **Re-enable permissions**: Phone settings > Apps > GharBazaar\n\n**Common Issues:**\n- **Battery Saver**: May block notifications\n- **Data Saver**: May delay notifications\n- **Quiet Hours**: Check if enabled\n\n**Still Not Working?**\n- Uninstall and reinstall app\n- Use different browser\n- Contact support with device details\n\nNotifications typically arrive within seconds of message send.`
            },
            {
                id: 'message-history',
                title: 'Finding and searching message history',
                resolution: `Access and search your message history:\n\n**Viewing Messages:**\n\n1. **Dashboard > Messages**\n   - All conversations in one place\n   - Left sidebar: List of conversations\n   - Right panel: Selected conversation\n   - Newest messages on top\n\n2. **Organization:**\n   - **Unread**: Messages you haven't opened\n   - **Active**: Ongoing conversations\n   - **Archived**: Old conversations\n   - **Starred**: Important conversations\n\n**Search Messages:**\n\n1. **Search Bar**: Top of Messages page\n   - Search by: property name, seller name, message content\n   - Real-time results as you type\n   - Click result to jump to conversation\n\n2. **Filters:**\n   - Filter by date range\n   - Filter by property\n   - Filter by sender\n   - Unread only\n   - Attachments only\n\n**Managing Conversations:**\n\n- **Star Important**: Click star icon to mark important\n- **Archive Old Chats**: Hide without deleting\n- **Delete Conversation**: Permanently remove (can't undo)\n- **Mute Notifications**: Stop alerts for specific chat\n- **Block User**: Prevent further messages\n\n**Export Messages:**\n1. Open conversation\n2. Click three-dot menu\n3. Select "Export Chat"\n4. Download as PDF or TXT file\n5. Includes all messages and timestamps\n\n**Message Retention:**\n- Messages stored indefinitely\n- Deleted conversations removed after 30 days\n- Download important conversations before deleting\n\n**Privacy:**\n- Only you can see your messages\n- Messages encrypted in transit\n- Deleted messages removed from both sides\n\n**Quick Actions:**\n- Press '/' to open search\n- Press 'e' to archive\n- Press 's' to star\n- Keyboard shortcuts in Settings`
            },
            {
                id: 'block-user',
                title: 'How to block or report users',
                resolution: `Stay safe by blocking or reporting problematic users:\n\n**Blocking a User:**\n\n**From Messages:**\n1. Open conversation with user\n2. Click three-dot menu (top right)\n3. Select "Block User"\n4. Confirm blocking\n\n**From Property Listing:**\n1. Open seller's profile\n2. Click "Report/Block"\n3. Select "Block User"\n4. Confirm\n\n**What Happens When You Block:**\n- User can't send you messages\n- User can't see your contact info\n- User's listings hidden from your search\n- You won't see their bids or offers\n- Existing conversations archived\n- User is NOT notified of blocking\n\n**Unblocking:**\n- Settings > Privacy > Blocked Users\n- Find user and click "Unblock"\n\n**Reporting a User:**\n\n**When to Report:**\n- Spam or scam attempts\n- Fake listings or fraud\n- Harassment or abusive behavior\n- Inappropriate messages\n- Privacy violations\n- Impersonation\n\n**How to Report:**\n1. Click "Report User" button\n2. Select reason from dropdown:\n   - Spam\n   - Fake listing\n   - Harassment\n   - Fraud/Scam\n   - Other (specify)\n3. Provide details and evidence\n4. Attach screenshots if available\n5. Submit report\n\n**What Happens After Reporting:**\n- Support team reviews within 24 hours\n- Investigation conducted\n- Action taken based on severity:\n   - Warning to user\n   - Temporary suspension\n   - Permanent ban\n   - Legal action (if needed)\n- You receive outcome notification\n- Your identity kept confidential\n\n**Emergency Issues:**\n- Threats or serious harassment: Report immediately + contact local authorities\n- Financial fraud: Report to cyber crime cell + our support\n\n**Difference Between Block and Report:**\n- **Block**: Personal protection, no review needed\n- **Report**: Triggers investigation, protects community\n- You can do both simultaneously\n\nYour safety is our priority!`
            },
            {
                id: 'share-phone',
                title: 'When should I share my phone number',
                resolution: `Guidelines for safely sharing contact information:\n\n**When It's Safe to Share:**\n\n✅ **Good Signs:**\n- After meaningful conversation on platform\n- Seller verified with badge\n- High seller ratings (4+ stars)\n- Ready to schedule property visit\n- Serious negotiation stage\n- Both parties verified users\n- Discussed sufficient details\n\n✅ **Good Timing:**\n- After 3-5 message exchanges\n- When scheduling visit\n- At bid/offer stage\n- For quick logistical coordination\n\n**When NOT to Share:**\n\n❌ **Red Flags:**\n- First message exchange\n- Seller seems pushy or urgent\n- Unverified seller account\n- Poor grammar or suspicious messages\n- Requests for advance payment\n- Unusual or off-topic questions\n- New account with no history\n\n**Safer Alternatives:**\n\n1. **Use Platform Messaging**: Keep all communication on GharBazaar initially\n2. **Request Call Feature**: Let seller call you without seeing number\n3. **Video Call**: Use in-platform video chat\n4. **Schedule Visit**: Book through platform (tracks appointment)\n\n**Best Practices:**\n\n1. **Vet the Other Party:**\n   - Check profile completeness\n   - Read reviews/ratings\n   - Verify seller badge status\n   - Look at listing quality\n\n2. **Use Secondary Number:**\n   - Consider temporary number apps\n   - Use office number, not personal\n   - Google Voice or similar service\n\n3. **Set Boundaries:**\n   - Specify call time preferences\n   - Mention "no WhatsApp/Telegram initially"\n   - Professional hours only\n\n**If Things Go Wrong:**\n- Block user immediately\n- Report to GharBazaar\n- Don't engage further\n- Register complaint with local police if harassment\n\n**Privacy Settings:**\n- Settings > Privacy > "Show phone number to"\n  - No one (default)\n  - Verified users only\n  - Everyone\n\n**Remember**: Platform messaging provides:\n- Complete conversation history\n- Evidence if disputes arise\n- Protection from spam\n- Report abuse features\n\nTake your time, trust your instincts!`
            },
            {
                id: 'seller-not-responding',
                title: 'Seller is not responding to my messages',
                resolution: `What to do when sellers don't respond:\n\n**Check These First:**\n\n1. **Message Sent Successfully**: Verify message has checkmark (delivered)\n2. **Seller Active**: Check "last active" timestamp on profile\n3. **Wait Time**: Give at least 24-48 hours for response\n4. **Spam Folder**: Your first message might be in their spam (rare)\n\n**Why Sellers May Not Respond:**\n\n- **Property Already Sold**: Forgot to mark listing as sold\n- **Overwhelmed with Inquiries**: High-demand property\n- **Inactive Seller**: Hasn't logged in recently\n- **Vacation/Busy**: Life circumstances\n- **Price Mention**: If you mentioned very low budget\n- **Message Quality**: Too brief or unclear interest\n\n**Actions You Can Take:**\n\n**1. Send Follow-Up (After 24-48 hours)**\n   - Polite reminder\n   - Specific question about property\n   - Mention your seriousness\n   - Template: "Hi, following up on my message from [date]. Still very interested in viewing the property this weekend. Please let me know your availability."\n\n**2. Try Alternative Contact**\n   - Click "Request Call" button\n   - Use "Schedule Visit" feature (auto-notifies seller)\n   - Check if phone number is visible\n\n**3. Check Property Status**\n   - Verify listing still active\n   - Check if price/details recently updated (shows activity)\n   - Look for "Responds within X hours" on profile\n\n**4. Look at Similar Properties**\n   - Click "Similar Properties" on listing page\n   - Contact alternative sellers\n   - Don't wait indefinitely for one property\n\n**5. Report Unresponsive Seller**\n   - After 1 week of no response\n   - Settings > Report Inactive Listing\n   - Helps improve platform quality\n\n**Improving Your Response Rate:**\n\n**Better Initial Messages:**\n- Introduce yourself briefly\n- Specify exactly what you're looking for\n- Ask 1-2 specific questions\n- Mention your visit availability\n- Show genuine interest\n\n**Example Good Message:**\n"Hello, I'm interested in your 3BHK apartment in [Area]. I'm looking for a family home in this location and appreciate the amenities you've listed. Would it be possible to schedule a viewing this Saturday or Sunday? I'm pre-approved for a loan and ready to move quickly for the right property. Looking forward to hearing from you!"\n\n**Platform Help:**\n- Dashboard > Messages > Conversation > "Seller Not Responding"\n- We'll send automated reminder to seller\n- Check if listing should be marked inactive\n\n**Remember**: Good sellers respond within 24 hours. If no response after 1 week and 2 follow-ups, move on to other properties.\n\nDon't take it personally - focus on responsive sellers who value your interest!`,
                buyerSpecific: true
            }
        ]
    },
    {
        id: 'visits-appointments',
        title: 'Visits & Appointments',
        icon: '📅',
        subCategories: [
            {
                id: 'schedule-visit',
                title: 'How to schedule a property visit',
                resolution: `Schedule property visits directly on GharBazaar:\n\n1. **From Property Listing**: Click "Schedule Visit" button\n2. **Choose Date & Time**: Select from seller's available slots\n3. **Provide Details**: Add your phone number and any special requests\n4. **Confirm Booking**: You'll receive confirmation via email and SMS\n5. **Add to Calendar**: Calendar invite sent automatically\n\n**Visit Types:**\n- **Physical Visit**: In-person property viewing\n- **Virtual Tour**: Video call with seller/agent\n- **Group Visit**: Schedule with family/friends\n\n**Before the Visit:**\n- Confirm appointment 24 hours before\n- Prepare questions for the seller\n- Check property location and directions\n- Bring ID and notepad\n\n**Best Practices:**\n- Book at least 2-3 days in advance\n- Be punctual\n- Respect the property inspect thoroughly\n- Take photos/notes (with permission)\n- Ask about neighborhood, maintenance, etc.\n\n**Seller No-Show:**\n- Wait 15 minutes and try calling\n- Report no-show in Dashboard > Visits\n- Reschedule or find alternative properties\n\nYou can schedule multiple property visits on the same day!`,
                buyerSpecific: true
            },
            {
                id: 'reschedule-visit',
                title: 'Rescheduling or cancelling a visit',
                resolution: `Need to change your visit plans?\n\n**Rescheduling:**\n1. Dashboard > My Visits\n2. Find the appointment\n3. Click "Reschedule"\n4. Choose new date/time from available slots\n5. Confirm change\n6. Both parties notified automatically\n\n**Cancellation:**\n1. Dashboard > My Visits\n2. Find the appointment\n3. Click "Cancel Visit"\n4. Provide reason (optional but appreciated)\n5. Confirm cancellation\n6. Seller receives notification\n\n**Cancellation Policy:**\n- **Free cancellation**: Up to 6 hours before visit\n- **Late cancellation**: Within 6 hours (may affect your reliability score)\n- **No-show**: Doesn't show up (affects account standing)\n\n**Seller Cancellation:**\nIf seller cancels:\n- You'll receive immediate notification\n- Offered alternative time slots\n- Can rate the experience\n- Support team notified of seller behavior\n\n**Emergency Change:**\nIf you need to cancel last minute:\n- Call seller directly if number shared\n- Send message explaining situation\n- Cancel through platform immediately\n- Apologize and offer to reschedule\n\n**Visit History:**\nAll past and upcoming visits tracked in Dashboard > My Visits with statuses:\n- Upcoming\n- Completed\n- Cancelled\n- Rescheduled\n- No-show\n\n**Pro tip**: Schedule backup properties in case one doesn't work out!`
            }
        ]
    },
    {
        id: 'bids-offers',
        title: 'Bids & Offers',
        icon: '💰',
        subCategories: [
            {
                id: 'make-bid',
                title: 'How to make a bid on a property',
                resolution: `Making bids on GharBazaar:\n\n1. **Open Property**: Navigate to listing details\n2. **Click "Make Offer"**: Button below property price\n3. **Enter Bid Amount**: Your proposed price\n4. **Add Terms** (optional):\n   - Payment timeline\n   - Conditions (loan approval, inspection, etc.)\n   - Move-in date preference\n5. **Include Message**: Explain your offer\n6. **Submit Bid**: Seller receives notification\n\n**Bid Guidelines:**\n- Be realistic (within 5-15% of asking price typically)\n- Explain any lowball offers\n- Show seriousness with pre-approval mention\n- Include decision timeline\n\n**What Happens Next:**\n- Seller reviews your bid within 48 hours\n- Seller can: Accept, Reject, or Counter-offer\n- You'll receive notification of decision\n- If accepted, move to contract phase\n\n**Counter-Offers:**\n- Seller proposes different amount/terms\n- You can accept, reject, or counter back\n- Maximum 3 rounds of negotiation\n\n**Bid Status Tracking:**\nDashboard > My Bids shows:\n- Pending (awaiting seller response)\n- Accepted (move forward)\n- Rejected (move on)\n- Countered (negotiation active)\n- Withdrawn (you cancelled)\n\n**Multiple Bids:**\n- You can bid on multiple properties\n- Withdraw bids you're no longer interested in\n- Each bid tracked separately\n\n**Bid Etiquette:**\n- Don't lowball without reason\n- Respond to counter-offers within 24 hours\n- Withdraw if no longer interested\n- Honor accepted bids\n\n**Note**: Making a bid shows serious intent. Be ready to proceed if accepted!`,
                buyerSpecific: true
            },
            {
                id: 'manage-offers',
                title: 'Managing received offers (for sellers)',
                resolution: `Handle buyer offers effectively:\n\n**Viewing Offers:**\n1. Dashboard > My Listings\n2. Click listing with "New Offer" badge\n3. See all offers in chronological order\n\n**Each Offer Shows:**\n- Buyer's bid amount\n- Offer terms and conditions\n- Buyer's message\n- Buyer's profile and verification status\n- Offer timestamp\n\n**Your Options:**\n\n**1. Accept Offer:**\n- Click "Accept"\n- Proceed to contract negotiation\n- Other offers automatically rejected\n- Cannot back out without consequences\n\n**2. Reject Offer:**\n- Click "Reject"\n- Provide reason (helps buyer)\n- Offer marked as rejected\n- Buyer can make new offer\n\n**3. Counter-Offer:**\n- Click "Counter"\n- Enter your counter price/terms\n- Add message explaining\n- Ball returns to buyer's court\n\n**4. Request More Info:**\n- Message buyer for clarification\n- Ask about financing, timeline, etc.\n- Keep offer pending\n\n**Evaluation Tips:**\n- Don't just look at price\n- Consider buyer reliability\n- Check verification status\n- Evaluate proposed timeline\n- Review contingencies\n\n**Multiple Offers:**\nIf you receive multiple offers:\n- Compare all offers\n- Can counter multiple buyers\n- First accepted offer wins\n- Be transparent about competition\n\n**Offer Expiry:**\n- Offers valid for 7 days default\n- Buyers can withdraw anytime before acceptance\n- Respond promptly to maintain interest\n\n**Analytics:**\nDashboard > Analytics shows:\n- Total offers received\n- Average bid vs listing price\n- Acceptance rate\n- Time to accept\n\n**Remember**: Good buyers are valuable. Even if offer is low, counter-offer shows willingness to negotiate!`,
                sellerSpecific: true
            }
        ]
    },
    {
        id: 'documents-contracts',
        title: 'Documents & Contracts',
        icon: '📄',
        subCategories: [
            {
                id: 'required-documents',
                title: 'What documents do I need',
                resolution: `Document requirements for property transactions:\n\n**For Buyers:**\n\n**Identity Proof:**\n- PAN Card (mandatory)\n- Aadhaar Card\n- Passport or Driver's License\n\n**Address Proof:**\n- Utility bill (electricity/water)\n- Aadhaar Card\n- Rental agreement\n\n**Financial Documents:**\n- Loan pre-approval letter\n- Bank statements (3-6 months)\n- Income proof (salary slips/IT returns)\n\n**For Sellers:**\n\n**Property Documents:**\n- Sale Deed/Title Deed\n- Encumbrance Certificate\n- Property Tax receipts (last 3 years)\n- Society NOC (for apartments)\n- Occupancy Certificate\n- Approved building plans\n\n**Ownership Proof:**\n- Chain of title documents\n- Will/Inheritance papers (if applicable)\n- Power of Attorney (if selling on behalf)\n\n**Compliance Documents:**\n- Khata Certificate\n- Building Completion Certificate\n- NOC from authorities\n\n**Upload Process:**\n1. Dashboard > Documents\n2. Click "Upload Document"\n3. Select document type\n4. Upload clear scans/photos\n5. Add description\n6. Submit for verification\n\n**Document Verification:**\n- Admin team reviews within 48 hours\n- Verified documents get green checkmark\n- Invalid documents flagged for correction\n\n**Security:**\n- All documents encrypted\n- Only shared with serious buyers\n- Watermarked automatically\n- Can revoke access anytime\n\n**Pro Tip**: Keep digital copies ready for quick sharing!`
            }
        ]
    },
    {
        id: 'partner-programs',
        title: 'Partner Programs',
        icon: '🤝',
        subCategories: [
            {
                id: 'become-promoter',
                title: 'Joining as a Promoter Partner',
                resolution: `Earn commissions by referring buyers and sellers:\n\n**What is a Promoter Partner?**\n- Refer people to GharBazaar\n- Earn commission on successful transactions\n- No property ownership needed\n- Flexible work from anywhere\n\n**How to Join:**\n1. Navigate to "Partner Portal" in footer\n2. Click "Become Promoter Partner"\n3. Fill application form:\n   - Personal details\n   - Experience (if any)\n   - Network/audience info\n   - Preferred areas\n4. Submit for review\n5. Approval within 3-5 business days\n\n**Commission Structure:**\n- Buyer referral: 0.5% of property value\n- Seller referral: 1% of subscription amount\n- Both parties transact: Bonus 2%\n- Top performers: Up to 3% commission\n\n**How It Works:**\n1. Receive unique referral link\n2. Share with your network\n3. Track clicks and signups\n4. Earn when they transact\n5. Payment monthly to your account\n\n**Tools Provided:**\n- Personalized referral dashboard\n- Marketing materials\n- Social media templates\n- Performance analytics\n- Training resources\n\n**Requirements:**\n- Age 18+\n- Valid ID and bank account\n- Basic knowledge of real estate\n- Active social media or network\n\n**Best For:**\n- Real estate agents\n- Social media influencers\n- Community leaders\n- Anyone with a network\n\n**Support:**\n- Dedicated partner manager\n- Monthly training webinars\n- 24/7 partner support helpline\n\nStart earning today!`
            },
            {
                id: 'legal-partner',
                title: 'Becoming a Legal Partner',
                resolution: `Join as a legal expert for property transactions:\n\n**Who Can Join:**\n- Practicing lawyers\n- Legal consultants\n- Notaries\n- Property law specialists\n\n**Services You'll Provide:**\n- Document verification\n- Title searches\n- Contract drafting\n- Legal due diligence\n- Court case consultation\n- Registration assistance\n\n**Application Process:**\n1. Partner Portal > Legal Partner\n2. Submit credentials:\n   - Bar Council registration\n   - Years of experience\n   - Specialization areas\n   - Sample work\n   - References\n3. Background verification\n4. Interview with GharBazaar legal team\n5. Approval and onboarding\n\n**Earnings:**\n- Document verification: ₹500-2000 per case\n- Full due diligence: ₹5000-15000\n- Contract drafting: ₹3000-10000\n- Consultation: ₹1000/hour\n- Monthly retainer: Up to ₹50,000 for top partners\n\n**How You Get Cases:**\n- Buyers/sellers request legal help\n- You receive notification\n- Accept cases in your area\n- Complete work within timeline\n- Get paid after verified completion\n\n**Platform Benefits:**\n- Steady flow of clients\n- Transparent pricing\n- Secure payments\n- Professional insurance\n- Rating and review system\n\n**Requirements:**\n- Valid Bar Council enrollment\n- 2+ years experience\n- Professional indemnity insurance\n- Clean record\n- Available for consultations\n\n**Verification Process:**\n- Credentials checked thoroughly\n- References contacted\n- Sample work evaluated\n- May take 7-10 days\n\nJoin India's growing legal-tech platform!`
            },
            {
                id: 'ground-partner',
                title: 'Ground Partner program details',
                resolution: `Be our on-ground representative:\n\n**Role Overview:**\n-Conduct property inspections\n- Verify property details\n- Coordinate site visits\n- Take photos/videos\n- Provide area insights\n- Assist in documentation\n\n**Who Should Apply:**\n- Local real estate professionals\n- Property inspectors\n- Photographers/videographers\n- Retired professionals\n- Anyone with local area knowledge\n\n**Coverage Areas:**\n- Assigned specific localities\n- Must be available in that area\n- Flexible scheduling\n- Part-time or full-time\n\n**Application:**\n1. Partner Portal > Ground Partner\n2. Fill application:\n   - Location preference\n   - Availability\n   - Skills (photography, etc.)\n   - Own vehicle (optional but preferred)\n   - References\n3. Interview (phone/video)\n4. Training program (2 days)\n5. Start accepting tasks\n\n**Earnings:**\n- Property inspection: ₹300-800\n- Photography: ₹500-1500\n- Videography: ₹1000-3000\n- Coordination fee: ₹200 per visit\n- Monthly potential: ₹20,000-60,000\n\n**Tools Provided:**\n- Mobile app for task management\n- Inspection checklists\n- Photography guidelines\n- Company ID card\n- Marketing materials\n\n**Workflow:**\n1. Receive task notification\n2. Accept based on availability\n3. Visit property at scheduled time\n4. Complete inspection/photography\n5. Upload details to app\n6. Quality check by admin\n7. Payment processed weekly\n\n**Requirements:**\n- Smartphone with good camera\n- Two-wheeler/car (preferred)\n- Local area knowledge\n- Professional behavior\n- Flexible daytime availability\n\n**Benefits:**\n- Flexible hours\n- Work in your area\n- Weekly payments\n- Performance bonuses\n- Growth to senior partner\n\nBe the face of GharBazaar in your locality!`
            }
        ]
    },
    {
        id: 'platform-features',
        title: 'Platform Features',
        icon: '⚙️',
        subCategories: [
            {
                id: 'dashboard-navigation',
                title: 'Understanding the dashboard',
                resolution: `Navigate your GharBazaar dashboard:\n\n**Dashboard Overview:**\n\n**Top Section:**\n- Quick stats (favorites, messages, visits)\n- Active subscription status\n- Verification status\n- Quick actions\n\n**Main Sections:**\n\n**For Buyers:**\n1. **Overview**: Activity summary, recent views\n2. **Browse**: Search and filter properties\n3. **Favorites**: Saved properties\n4. **Messages**: All conversations\n5. **My Visits**: Scheduled appointments\n6. **My Bids**: Offers you've made\n7. **Contracts**: Active deals\n8. **Profile**: Account settings\n\n**For Sellers:**\n1. **Overview**: Listing performance\n2. **My Listings**: All your properties\n3. **Inquiries**: Buyer questions\n4. **Messages**: Conversations\n5. **Offers Received**: Buyer bids\n6. **Analytics**: Detailed insights\n7. **Earnings**: Revenue tracking\n8. **Subscription**: Plan management\n\n**Sidebar Navigation:**\n- Collapsed/expanded view\n- Icons with labels\n- Active page highlighted\n- Mobile: Bottom navigation\n\n**Search & Filters:**\n- Global search (top bar)\n- Quick filters on each page\n- Saved filter combinations\n\n**Notifications:**\n- Bell icon (top right)\n- Shows: Messages, offers, visits, system alerts\n- Mark as read/unread\n- Notification settings\n\n**Profile Menu:**\n- Settings\n- Help & Support\n- Logout\n- Switch role (if applicable)\n\n**Mobile App Differences:**\n- Bottom tab navigation\n- Swipe gestures\n- Offline mode for favorites\n - Push notifications\n\n**Customization:**\n- Settings > Dashboard Preferences\n- Reorder sections\n- Show/hide widgets\n- Dark/light mode\n\n**Keyboard Shortcuts:**\n- Press '?' to see all shortcuts\n- Navigate faster with keys\n\nExplore each section to maximize your experience!`
            },
            {
                id: 'favorites-system',
                title: 'Using the favorites feature',
                resolution: `Master the favorites system:\n\n**Adding Favorites:**\n- Click heart icon on any property card\n- From property details page\n- Instantly saved to your account\n- Synced across all devices\n\n**Managing Favorites:**\nDashboard > Favorites shows:\n- Grid/list view toggle\n- Sort by: Date added, price, location\n- Filter by property type\n- Search saved properties\n\n**Favorites Features:**\n\n**1. Collections:**\n- Organize into custom folders\n- "Shortlist", "Maybe", "Top Choices"\n- Move between collections\n- Share entire collection\n\n**2. Compare:**\n- Select multiple favorites\n- Side-by-side comparison\n- Export comparison PDF\n\n**3. Schedule All Visits:**\n- Bulk visit scheduling\n- See all on calendar\n- Coordinate multiple viewings\n\n**4. Share Collection:**\n- Email to family/friends\n- Generates sharable link\n- Recipients see all details\n- No account needed to view\n\n**5. Price Alerts:**\n- Get notified of price drops\n- Automatic monitoring\n- Email/SMS alerts\n\n**6. Notes:**\n- Add personal notes to each\n- Pros/cons lists\n- Remember visit impressions\n\n**Favorites Limit:**\n- No limit on favorites\n- Older favorites auto-archived after 6 months\n- Restore archived anytime\n\n**Sync & Backup:**\n- Cloud synced automatically\n- Access from any device\n- Export as CSV/PDF\n- Import from other platforms\n\n**Privacy:**\n- Favorites are private\n- Sellers don't see who favorited\n- Share only if you choose\n\n**Smart Features:**\n- "Similar to favorites" suggestions\n- Notify when favorite gets new photos\n- Alert if favorite becomes unavailable\n\n**Best Practices:**\n- Favorite liberally while browsing\n- Review and narrow down weekly\n- Use collections to organize\n- Set price alerts on top choices\n- Share shortlist with family for input\n\nFavorites help you track your property search journey!`
            }
        ]
    },
    {
        id: 'technical-issues',
        title: 'Technical Issues',
        icon: '🔧',
        subCategories: [
            {
                id: 'page-not-loading',
                title: 'Pages not loading or errors',
                resolution: `Fix common loading issues:\n\n**Quick Fixes:**\n\n**1. Refresh the Page:**\n- Press F5 or Ctrl+R (Cmd+R on Mac)\n- Hard refresh: Ctrl+Shift+R\n- Clears temporary glitches\n\n**2. Clear Browser Cache:**\n- Chrome: Settings > Privacy > Clear browsing data\n- Firefox: Options > Privacy > Clear Data\n- Safari: Preferences > Privacy > Manage Website Data\n- Select "Cached images and files"\n- Time range: Last 24 hours\n\n**3. Try Incognito/Private Mode:**\n- Rules out extension conflicts\n- Tests with fresh cache\n- Chrome: Ctrl+Shift+N\n- Firefox: Ctrl+Shift+P\n\n**4. Check Internet Connection:**\n- Test other websites\n- Reset router if needed\n- Switch to mobile data to test\n- Run speed test\n\n**5. Update Browser:**\n- Use latest Chrome, Firefox, or Safari\n- GharBazaar works best on modern browsers\n- Check for pending updates\n\n**6. Disable Extensions:**\n- Ad blockers may interfere\n- Privacy extensions\n- Try disabling temporarily\n\n**7. Different Browser:**\n- Test on alternate browser\n- Isolates browser-specific issues\n\n**Specific Error Messages:**\n\n**"Server Error 500":**\n- Temporary server issue\n- Wait 5-10 minutes\n- Try again\n- If persists, contact support\n\n**"Page Not Found 404":**\n- Check URL spelling\n- Property may be removed\n- Use search to find property\n\n**"Session Expired":**\n- Log out and log back in\n- Clear cookies\n- Fresh login\n\n**Images Not Loading:**\n- Check internet speed\n- Allow images in browser settings\n- Disable data saver mode\n\n**Infinite Loading:**\n- Stop page load (ESC key)\n- Refresh page\n- Clear cache\n- Check firewall/antivirus settings\n\n**Mobile App Issues:**\n- Force close app\n- Clear app cache\n- Update to latest version\n- Reinstall if necessary\n\n**Still Having Issues?**\nContact support with:\n- Browser and version\n- Operating system\n- Screenshot of error\n- Steps to reproduce\n- Error message (if any)\n\n**System Status:**\nCheck status.gharbazaar.in for:\n- Known issues\n- Scheduled maintenance\n- Service status\n\nMost issues resolve with a simple cache clear and refresh!`
            },
            {
                id: 'upload-failing',
                title: 'Photo or document upload failures',
                resolution: `Resolve upload issues:\n\n**Common Causes:**\n\n**1. File Too Large:**\n- **Images**: Max 10MB per photo\n- **Documents**: Max 25MB per file\n- **Videos**: Max 100MB\n\n**Solution:**\n- Compress images before upload\n- Use online tools like TinyPNG\n- Reduce video quality/length\n\n**2. Wrong File Format:**\n\n**Accepted Formats:**\n- **Images**: JPG, PNG, WEBP, HEIC\n- **Documents**: PDF, DOC, DOCX\n- **Videos**: MP4, MOV, AVI\n\n**Solution:**\n- Convert using free tools\n- Check file extension\n\n**3. Slow/Unstable Connection:**\n- Upload fails mid-way\n- Timeout errors\n\n**Solution:**\n- Use stable Wi-Fi\n- Avoid mobile data for large files\n- Upload one file at a time\n- Wait for each to complete\n\n**4. Browser Issues:**\n- Outdated browser\n- Conflicting extensions\n\n**Solution:**\n- Update browser\n- Try incognito mode\n- Disable ad blockers\n- Use different browser\n\n**5. Multiple Uploads:**\n- Uploading too many at once\n- System overload\n\n**Solution:**\n- Upload in batches of 5\n- Wait for each batch to complete\n- Use bulk upload feature\n\n**Upload Best Practices:**\n\n**For Property Photos:**\n- Landscape orientation preferred\n- Minimum 1200x800 pixels\n- Good lighting, clear focus\n- Compress without quality loss\n- Name files descriptively\n\n**For Documents:**\n- Scan in color (for originals)\n- 300 DPI for clarity\n- Single PDF for multi-page docs\n- Ensure text is readable\n- Remove passwords before upload\n\n**Step-by-Step Troubleshooting:**\n\n1. **Check file size & format**: Verify meets requirements\n2. **Test with one file**: Upload single file first\n3. **Check upload progress**: Watch progress bar\n4. **Clear browser cache**: If repeated failures\n5. **Try mobile app**: Sometimes works when web doesn't\n6. **Different network**: Switch Wi-Fi or use mobile data\n7. **Different device**: Try computer vs phone\n\n**Error Messages:**\n\n**"Upload Failed":**\n- Generic error\n- Check all requirements\n- Retry after 5 minutes\n\n**"Invalid File Type":**\n- Wrong format\n- Convert and retry\n\n**"File Too Large":**\n- Compress or reduce quality\n- Split into multiple files\n\n**"Network Error":**\n- Connection interrupted\n- Check internet\n- Retry upload\n\n**Bulk Upload:**\nFor many files:\n1. Dashboard > Listings > Bulk Upload\n2. Prepare ZIP file\n3. All files must meet requirements\n4. Upload ZIP\n5. System processes automatically\n\n**Mobile App Upload:**\n- Often faster than web\n- Direct camera integration\n- Background upload continues even if app closed\n- Better for slow connections\n\n**Still Failing?**\nContact support with:\n- File size and format\n- Error message screenshot\n- Browser/device info\n- Internet speed\n\nWe can help troubleshoot or provide alternative upload method!`
            }
        ]
    },
    {
        id: 'policies-guidelines',
        title: 'Policies & Guidelines',
        icon: '📋',
        subCategories: [
            {
                id: 'listing-guidelines',
                title: 'Property listing guidelines and rules',
                resolution: `Follow these guidelines for approval:\n\n**Listing Requirements:**\n\n**Accurate Information:**\n- Correct property address\n- Actual price (no bait pricing)\n- True property size\n- Honest description\n- Real, recent photos\n\n**Prohibited Content:**\n\n**Not Allowed:**\n- Fake or stock photos\n- Misleading descriptions\n- Discriminatory language\n- Contact info in title/description\n- External website links\n- Duplicate listings\n- Under-construction (unless disclosed)\n- Illegal properties\n- Encroached land\n\n**Photo Guidelines:**\n- Minimum 5 photos required\n- Must be of actual property\n- No watermarks (except GharBazaar's)\n- No text overlays with contact info\n- Recent photos (within 6 months)\n- Show property accurately\n- Include: exterior, rooms, kitchen, bathroom, amenities\n\n**Description Rules:**\n- Minimum 100 words\n- Clear, honest language\n- Highlight key features\n- Mention any issues (honesty appreciated)\n- No ALL CAPS\n- No spam keywords\n- Proper grammar preferred\n\n**Pricing Guidelines:**\n- Market-realistic pricing\n- Include all costs clearly\n- Mention if negotiable\n- No fake \"reduced price\" claims\n\n**Verification Requirements:**\n- Ownership proof required\n- Valid identity documents\n- Active subscription\n- Verified email and phone\n\n**What Gets Rejected:**\n- Incomplete information\n- Poor quality photos\n- Suspicious pricing (too low/high)\n- Duplicate of existing listing\n- Property not ready for sale\n- Missing required documents\n- Violates any policy\n\n**Approval Timeline:**\n- Basic check: 2-4 hours\n- Full verification: 24-48 hours\n- Document verification: Up to 3 days\n\n**After Approval:**\n- Listing goes live\n- Appears in search\n- Can receive inquiries\n- Edit anytime (re-verification for major changes)\n\n**Maintaining Active Listings:**\n- Update regularly\n- Respond to inquiries promptly\n- Mark as sold when applicable\n- Refresh listing monthly\n\n**Consequences of Violations:**\n- First time: Warning + required fixes\n- Repeated: Listing removal\n- Serious violations: Account suspension\n- Fraud: Permanent ban + legal action\n\n**Best Practices:**\n- Be honest and transparent\n- Use high-quality photos\n- Detailed descriptions\n- Competitive pricing\n- Quick responses\n- Regular updates\n\n**Questions Before Listing?**\n- Use chatbot for quick answers\n- Check listing examples\n- Contact support for guidance\n\nQuality listings get better visibility and faster sales!`
            },
            {
                id: 'community-guidelines',
                title: 'Community behavior and conduct',
                resolution: `GharBazaar community standards:\n\n**Core Values:**\n- Respect and professionalism\n- Honesty and transparency\n- Safety and trust\n- Inclusive environment\n\n**Expected Behavior:**\n\n**Be Respectful:**\n- Polite communication\n- Professional tone\n- Prompt responses\n- Honor commitments\n\n**Be Honest:**\n- Accurate property information\n- Truthful about intentions\n- Disclose material facts\n- Transparent pricing\n\n**Be Safe:**\n- Meet in public for first time\n- Don't share sensitive info early\n- Report suspicious behavior\n- Verify before trusting\n\n**Prohibited Behavior:**\n\n**Absolutely Not Allowed:**\n- Harassment or bullying\n- Discriminatory language/actions\n- Spam or scams\n- Fake listings or fraud\n- Impersonation\n- Offensive language\n- Threats or intimidation\n- Privacy violations\n- Manipulation or coercion\n- Off-platform transactions (to avoid fees)\n\n**Communication Standards:**\n\n**In Messages:**\n- Professional language\n- No offensive content\n- Respect privacy\n- No unsolicited promotions\n- Stay on topic\n\n**In Reviews:**\n- Honest but respectful\n- Fact-based feedback\n- No personal attacks\n- Constructive criticism\n\n**Discrimination Policy:**\n\nZero tolerance for discrimination based on:\n- Religion\n- Caste\n- Gender\n- Sexual orientation\n- Age\n- Disability\n-Marital status\n- Nationality\n- Any other protected class\n\n**Reporting Violations:**\n\nIf you encounter:\n- Report immediately\n- Provide details/evidence\n- Block user if needed\n- Support reviews within 24 hours\n\n**Consequences:**\n\n**Warning:** First minor violation\n**Suspension:** Repeated or moderate violations (7-30 days)\n**Permanent Ban:** Serious violations (harassment, fraud, threats)\n**Legal Action:** For illegal activities\n\n**Your Rights:**\n- Safe platform experience\n- Fair treatment\n- Privacy protection\n- Report without retaliation\n- Appeal decisions\n\n**Your Responsibilities:**\n- Follow all guidelines\n- Report violations\n- Treat others respectfully\n- Provide accurate information\n- Honor agreements\n\n**Dispute Resolution:**\n\n**For Conflicts:**\n1. Try resolving directly (politely)\n2. Use mediation feature\n3. Contact support for help\n4. Escalate if needed\n\n**Appeals:**\nIf your account is suspended:\n- Review reason carefully\n- Submit appeal with explanation\n- Provide evidence\n- Response within 5 business days\n\n**Building Trust:**\n- Complete profile\n- Verify identity\n- Get good reviews\n- Respond promptly\n- Be transparent\n- Follow through\n\n**For Professionals:**\nHigher standards expected:\n- Licensing compliance\n- Professional ethics\n- Industry regulations\n- Code of conduct\n\n**Remember:**\nYour behavior affects:\n- Your rating\n- Account standing\n- Business success\n- Community quality\n\nLet's build a trustworthy real estate community together!`
            }
        ]
    }
];

// Helper function to get categories by user role
export function getCategoriesByRole(role: 'buyer' | 'seller' | 'admin'): FAQCategory[] {
    if (role === 'admin') {
        return faqKnowledgeBase; // Admins see everything
    }

    return faqKnowledgeBase.map(category => ({
        ...category,
        subCategories: category.subCategories.filter(sub => {
            // If no role specified, show to everyone
            if (!sub.buyerSpecific && !sub.sellerSpecific) return true;

            // Show role-specific content
            if (role === 'buyer') return !sub.sellerSpecific;
            if (role === 'seller') return !sub.buyerSpecific;

            return true;
        })
    })).filter(cat => cat.subCategories.length > 0); // Remove empty categories
}

// Helper to get specific category
export function getCategory(categoryId: string): FAQCategory | undefined {
    return faqKnowledgeBase.find(cat => cat.id === categoryId);
}

// Helper to get specific subcategory
export function getSubCategory(categoryId: string, subCategoryId: string): FAQSubCategory | undefined {
    const category = getCategory(categoryId);
    return category?.subCategories.find(sub => sub.id === subCategoryId);
}

// Search across all FAQs
export function searchFAQs(query: string, role: 'buyer' | 'seller' | 'admin' = 'buyer'): {
    category: FAQCategory;
    subCategory: FAQSubCategory;
    relevance: number;
}[] {
    const results: { category: FAQCategory; subCategory: FAQSubCategory; relevance: number }[] = [];
    const normalizedQuery = query.toLowerCase().trim();

    const categories = getCategoriesByRole(role);

    categories.forEach(category => {
        category.subCategories.forEach(subCategory => {
            let relevance = 0;

            // Check title match (higher weight)
            if (subCategory.title.toLowerCase().includes(normalizedQuery)) {
                relevance += 10;
            }

            // Check resolution content match
            if (subCategory.resolution.toLowerCase().includes(normalizedQuery)) {
                relevance += 5;
            }

            // Check category title match
            if (category.title.toLowerCase().includes(normalizedQuery)) {
                relevance += 3;
            }

            // Add word-by-word matching for better results
            const queryWords = normalizedQuery.split(' ');
            queryWords.forEach(word => {
                if (word.length > 3) { // Ignore small words
                    if (subCategory.title.toLowerCase().includes(word)) relevance += 2;
                    if (subCategory.resolution.toLowerCase().includes(word)) relevance += 1;
                }
            });

            if (relevance > 0) {
                results.push({ category, subCategory, relevance });
            }
        });
    });

    // Sort by relevance (highest first)
    return results.sort((a, b) => b.relevance - a.relevance);
}
