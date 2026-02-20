# 🔐 GharBazaar - Complete Environment Variables Guide

## 📋 Table of Contents

1. [Quick Setup](#quick-setup)
2. [Required Variables](#required-variables)
3. [Optional Variables](#optional-variables)
4. [How to Get API Keys](#how-to-get-api-keys)
5. [Environment Files Explained](#environment-files-explained)
6. [Security Best Practices](#security-best-practices)

---

## 🚀 Quick Setup

### Step 1: Create `.env.local` file

Copy the template below and save it as `.env.local` in your project root:

```env
# ==================== REQUIRED - BACKEND API ====================
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_APP_URL=http://localhost:3000

# ==================== REQUIRED - PAYMENT GATEWAY ====================
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_SE7UZrAiFH8wSB
RAZORPAY_KEY_SECRET=Rw2UMsYVUXU3iDTHbxPhqOIP

# ==================== OPTIONAL - GOOGLE SERVICES ====================
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id-here.apps.googleusercontent.com

# ==================== OPTIONAL - MAPS SERVICE ====================
NEXT_PUBLIC_MAPPLS_API_KEY=your-mappls-api-key-here
NEXT_PUBLIC_MAPPLS_CLIENT_ID=your-mappls-client-id
NEXT_PUBLIC_MAPPLS_CLIENT_SECRET=your-mappls-client-secret

# ==================== OPTIONAL - CONTACT INFO ====================
NEXT_PUBLIC_SUPPORT_EMAIL=gharbazaarofficial@zohomail.in
NEXT_PUBLIC_WHATSAPP_NUMBER=919800012345
NEXT_PUBLIC_DOMAIN=gharbazaar.in

# ==================== OPTIONAL - FEATURE FLAGS ====================
NEXT_PUBLIC_ENABLE_ANALYTICS=false
NEXT_PUBLIC_ENABLE_LIVE_CHAT=false
NEXT_PUBLIC_ENABLE_NOTIFICATIONS=true

# ==================== OPTIONAL - EXTERNAL SERVICES ====================
NEXT_PUBLIC_QR_API_URL=https://api.qrserver.com/v1/create-qr-code/

# ==================== DEVELOPMENT SETTINGS ====================
NODE_ENV=development
```

### Step 2: Restart Development Server

```bash
npm run dev
```

---

## ✅ Required Variables

### 1. **NEXT_PUBLIC_API_URL**

- **Purpose:** Backend API base URL
- **Used For:** All API calls (properties, users, authentication)
- **Development:** `http://localhost:5000`
- **Production:** `https://api.gharbazaar.in`
- **Location Used:** `src/config/index.ts`, `src/lib/optimizedApi.ts`

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

---

### 2. **NEXT_PUBLIC_APP_URL**

- **Purpose:** Frontend application URL
- **Used For:** CORS headers, redirects, sharing links
- **Development:** `http://localhost:3000`
- **Production:** `https://gharbazaar.in`
- **Location Used:** `src/config/index.ts`, `src/lib/api-utils.ts`

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

### 3. **NEXT_PUBLIC_RAZORPAY_KEY_ID**

- **Purpose:** Razorpay payment gateway public key
- **Used For:** Processing payments for property listings
- **Current Value:** `rzp_live_SE7UZrAiFH8wSB` (Live key)
- **Test Key:** `rzp_test_RuGsetJSwC1LjN`
- **Location Used:** `src/lib/razorpay.ts`, `src/config/index.ts`
- **Get From:** https://dashboard.razorpay.com/app/keys

```env
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_SE7UZrAiFH8wSB
```

**⚠️ Important:** This is a PUBLIC key, safe to expose in browser.

---

### 4. **RAZORPAY_KEY_SECRET**

- **Purpose:** Razorpay payment gateway secret key
- **Used For:** Server-side payment verification
- **Current Value:** `Rw2UMsYVUXU3iDTHbxPhqOIP` (Live secret)
- **Test Secret:** `tOSo8fPBDHowHK82RArlxxe6`
- **Location Used:** Server-side API routes only
- **Get From:** https://dashboard.razorpay.com/app/keys

```env
RAZORPAY_KEY_SECRET=Rw2UMsYVUXU3iDTHbxPhqOIP
```

**🔒 CRITICAL:** This is a SECRET key, NEVER expose in browser or commit to Git!

---

## 🔧 Optional Variables

### 5. **NEXT_PUBLIC_GOOGLE_CLIENT_ID**

- **Purpose:** Google OAuth login
- **Used For:** "Sign in with Google" feature
- **Format:** `xxxxx.apps.googleusercontent.com`
- **Location Used:** `src/lib/firebase.ts`, `src/contexts/AuthContext.tsx`
- **Get From:** https://console.developers.google.com/

```env
NEXT_PUBLIC_GOOGLE_CLIENT_ID=123456789-abcdefg.apps.googleusercontent.com
```

**How to Get:**

1. Go to Google Cloud Console
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs:
   - `http://localhost:3000/auth/google/callback`
   - `https://gharbazaar.in/auth/google/callback`

---

### 6. **NEXT_PUBLIC_MAPPLS_API_KEY**

- **Purpose:** Mappls (MapmyIndia) map integration
- **Used For:** Interactive maps, location search
- **Location Used:** `src/config/index.ts`
- **Get From:** https://apis.mappls.com/console/

```env
NEXT_PUBLIC_MAPPLS_API_KEY=your-mappls-api-key-here
```

**Alternative:** You can use Google Maps API instead:

```env
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-google-maps-api-key
```

---

### 7. **NEXT_PUBLIC_MAPPLS_CLIENT_ID & CLIENT_SECRET**

- **Purpose:** Advanced Mappls features (geocoding, routing)
- **Used For:** Address autocomplete, route planning
- **Location Used:** `src/config/index.ts`

```env
NEXT_PUBLIC_MAPPLS_CLIENT_ID=your-client-id
NEXT_PUBLIC_MAPPLS_CLIENT_SECRET=your-client-secret
```

---

### 8. **NEXT_PUBLIC_SUPPORT_EMAIL**

- **Purpose:** Customer support email
- **Used For:** Contact forms, support links
- **Default:** `gharbazaarofficial@zohomail.in`
- **Location Used:** `src/config/index.ts`

```env
NEXT_PUBLIC_SUPPORT_EMAIL=gharbazaarofficial@zohomail.in
```

---

### 9. **NEXT_PUBLIC_WHATSAPP_NUMBER**

- **Purpose:** WhatsApp support number
- **Used For:** WhatsApp chat button
- **Format:** Country code + number (no + or spaces)
- **Example:** `919800012345` for +91 9800012345
- **Location Used:** `src/config/index.ts`

```env
NEXT_PUBLIC_WHATSAPP_NUMBER=919800012345
```

---

### 10. **NEXT_PUBLIC_DOMAIN**

- **Purpose:** Application domain name
- **Used For:** SEO, OG tags, sharing
- **Default:** `gharbazaar.in`
- **Location Used:** `src/config/index.ts`

```env
NEXT_PUBLIC_DOMAIN=gharbazaar.in
```

---

### 11. **Feature Flags**

- **Purpose:** Enable/disable features without code changes
- **Used For:** A/B testing, gradual rollouts

```env
# Analytics tracking (Google Analytics, etc.)
NEXT_PUBLIC_ENABLE_ANALYTICS=false

# Live chat widget
NEXT_PUBLIC_ENABLE_LIVE_CHAT=false

# Push notifications
NEXT_PUBLIC_ENABLE_NOTIFICATIONS=true
```

---

### 12. **NEXT_PUBLIC_QR_API_URL**

- **Purpose:** QR code generation service
- **Used For:** Property sharing QR codes
- **Default:** `https://api.qrserver.com/v1/create-qr-code/`
- **Location Used:** `src/config/index.ts`

```env
NEXT_PUBLIC_QR_API_URL=https://api.qrserver.com/v1/create-qr-code/
```

---

### 13. **NODE_ENV**

- **Purpose:** Environment mode
- **Values:** `development`, `production`, `test`
- **Auto-set by:** Next.js (usually don't need to set manually)

```env
NODE_ENV=development
```

---

## 🔑 How to Get API Keys

### Razorpay (Payment Gateway)

1. Visit: https://dashboard.razorpay.com/
2. Sign up / Log in
3. Go to Settings → API Keys
4. Generate Test Keys (for development)
5. Generate Live Keys (for production)
6. Copy both Key ID and Key Secret

**Test Mode:**

```env
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_xxxxx
RAZORPAY_KEY_SECRET=test_secret_xxxxx
```

**Live Mode:**

```env
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_xxxxx
RAZORPAY_KEY_SECRET=live_secret_xxxxx
```

---

### Google OAuth (Sign in with Google)

1. Visit: https://console.cloud.google.com/
2. Create a new project
3. Enable "Google+ API"
4. Go to Credentials → Create Credentials → OAuth 2.0 Client ID
5. Application type: Web application
6. Add Authorized redirect URIs:
   - `http://localhost:3000/auth/google/callback`
   - `https://yourdomain.com/auth/google/callback`
7. Copy Client ID

```env
NEXT_PUBLIC_GOOGLE_CLIENT_ID=123456789-abc.apps.googleusercontent.com
```

---

### Mappls (Indian Maps)

1. Visit: https://apis.mappls.com/console/
2. Sign up for free account
3. Create a new project
4. Get API Key, Client ID, Client Secret
5. Enable required APIs (Maps SDK, Geocoding, etc.)

```env
NEXT_PUBLIC_MAPPLS_API_KEY=your-api-key
NEXT_PUBLIC_MAPPLS_CLIENT_ID=your-client-id
NEXT_PUBLIC_MAPPLS_CLIENT_SECRET=your-client-secret
```

**Alternative - Google Maps:**

1. Visit: https://console.cloud.google.com/
2. Enable Maps JavaScript API
3. Create API Key
4. Restrict key to your domain

```env
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

---

## 📁 Environment Files Explained

### `.env.local` (Development - Your Machine)

- **Purpose:** Local development settings
- **Git:** ❌ Never commit (in .gitignore)
- **Priority:** Highest (overrides all other .env files)
- **Use For:** Your personal API keys, local backend URL

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_xxxxx
```

---

### `.env.example` (Template)

- **Purpose:** Template for other developers
- **Git:** ✅ Commit to repository
- **Contains:** Placeholder values, documentation
- **Use For:** Showing what variables are needed

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_RAZORPAY_KEY_ID=your-razorpay-key-here
```

---

### `.env.production` (Production Deployment)

- **Purpose:** Production environment settings
- **Git:** ⚠️ Can commit (but use hosting platform env vars instead)
- **Contains:** Production API URLs, live keys
- **Use For:** Vercel, Netlify, or other hosting platforms

```env
NEXT_PUBLIC_API_URL=https://api.gharbazaar.in
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_xxxxx
```

---

### `.env` (Base - Rarely Used)

- **Purpose:** Default values for all environments
- **Git:** ✅ Can commit
- **Priority:** Lowest
- **Use For:** Non-sensitive defaults

---

## 🔒 Security Best Practices

### ✅ DO's:

1. **Use `.env.local` for development** - Never commit it
2. **Use `NEXT_PUBLIC_` prefix** for browser-accessible variables
3. **Keep secrets server-side** - No `NEXT_PUBLIC_` for secrets
4. **Use test keys in development** - Switch to live keys in production
5. **Rotate keys regularly** - Change secrets every 3-6 months
6. **Use environment variables in hosting** - Vercel, Netlify env settings

### ❌ DON'Ts:

1. **Never commit `.env.local`** to Git
2. **Never expose secret keys** in browser (no `NEXT_PUBLIC_` for secrets)
3. **Never hardcode API keys** in source code
4. **Never share `.env.local`** publicly
5. **Never use production keys** in development

---

## 📞 Support

If you need help with environment configuration:

- **Email:** gharbazaarofficial@zohomail.in
- **WhatsApp:** +91 9800012345

---

**Last Updated:** February 2026  
**Version:** 1.0.0.
