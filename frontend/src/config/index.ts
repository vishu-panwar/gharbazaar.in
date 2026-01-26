/**
 * Centralized Configuration File
 * All API endpoints, external URLs, and service configurations are defined here
 * Managed entirely through environment variables
 */

// ==================== API Configuration ====================

/**
 * Backend API Configuration
 * NOTE: Backend has been removed. This configuration is kept for reference only.
 * Consider removing API calls that depend on this configuration.
 */
export const API_CONFIG = {
    // Base URL for backend API
    BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000',

    // API version path
    VERSION: '/api/v1',

    // Full API base URL
    get FULL_URL() {
        return `${this.BASE_URL}${this.VERSION}`
    },

    // Socket.io server URL (removes /api/v1 from base URL)
    get SOCKET_URL() {
        return this.BASE_URL.replace('/api/v1', '')
    },

    // Request timeout (milliseconds)
    TIMEOUT: 30000,

    // Retry configuration
    MAX_RETRIES: 3,
    RETRY_DELAY: 1000,
} as const

// ==================== Firebase Configuration ====================

/**
 * Firebase Authentication & Services
 * DISABLED - Firebase has been removed to prevent backend connection disruptions
 */
export const FIREBASE_CONFIG = {
    apiKey: '', // process.env.NEXT_PUBLIC_FIREBASE_API_KEY || '',
    authDomain: '', // process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || '',
    projectId: '', // process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || '',
    storageBucket: '', // process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || '',
    messagingSenderId: '', // process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '',
    appId: '', // process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '',
    measurementId: '', // process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || '',
} as const

// ==================== Maps Configuration ====================

/**
 * Mappls (Ola Maps) Configuration
 */
export const MAPS_CONFIG = {
    // Mappls API Key
    API_KEY: process.env.NEXT_PUBLIC_MAPPLS_API_KEY || '',

    // Mappls Client ID (for advanced features)
    CLIENT_ID: process.env.NEXT_PUBLIC_MAPPLS_CLIENT_ID || '',

    // Mappls Client Secret (for advanced features)
    CLIENT_SECRET: process.env.NEXT_PUBLIC_MAPPLS_CLIENT_SECRET || '',

    // SDK URL template
    get SDK_URL() {
        return `https://apis.mappls.com/advancedmaps/api/${this.API_KEY}/map_sdk?layer=vector&v=3.0`
    },

    // Default map center (India)
    DEFAULT_CENTER: {
        lat: 20.5937,
        lng: 78.9629,
    },

    // Default zoom level
    DEFAULT_ZOOM: 5,

    // Check if Mappls is configured
    get isConfigured() {
        return Boolean(this.API_KEY && this.API_KEY !== 'your_mappls_api_key_here')
    },
} as const

// ==================== Payment Gateway Configuration ====================

/**
 * Razorpay Payment Gateway
 */
export const PAYMENT_CONFIG = {
    // Razorpay Key ID
    KEY_ID: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || '',

    // Razorpay SDK URL
    SDK_URL: 'https://checkout.razorpay.com/v1/checkout.js',

    // Check if Razorpay is configured
    get isConfigured() {
        return Boolean(this.KEY_ID)
    },
} as const

// ==================== Application URLs ====================

/**
 * Application and External URLs
 */
export const APP_CONFIG = {
    // Application base URL
    APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',

    // Application domain (for sharing, OG tags, etc.)
    DOMAIN: process.env.NEXT_PUBLIC_DOMAIN || 'gharbazaar.in',

    // Get full URL for a path
    getFullUrl(path: string) {
        return `${this.APP_URL}${path.startsWith('/') ? path : `/${path}`}`
    },
} as const

// ==================== Contact & Support Configuration ====================

/**
 * Contact Information
 */
export const CONTACT_CONFIG = {
    // Support email
    EMAIL: process.env.NEXT_PUBLIC_SUPPORT_EMAIL || 'gharbazaarofficial@zohomail.in',

    // Support WhatsApp number (with country code, no +)
    WHATSAPP: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '919800012345',

    // Get WhatsApp URL with custom message
    getWhatsAppUrl(message: string) {
        return `https://wa.me/${this.WHATSAPP}?text=${encodeURIComponent(message)}`
    },

    // Get email compose URL
    getEmailUrl(subject?: string, body?: string) {
        let url = `https://mail.google.com/mail/?view=cm&fs=1&to=${this.EMAIL}`
        if (subject) url += `&su=${encodeURIComponent(subject)}`
        if (body) url += `&body=${encodeURIComponent(body)}`
        return url
    },
} as const

// ==================== External Services ====================

/**
 * External Service URLs
 */
export const EXTERNAL_SERVICES = {
    // QR Code Generator API
    QR_CODE_API: process.env.NEXT_PUBLIC_QR_API_URL || 'https://api.qrserver.com/v1/create-qr-code/',

    // Image CDN
    IMAGE_CDN: process.env.NEXT_PUBLIC_IMAGE_CDN || '',

    // Get QR code URL for data
    getQRCodeUrl(data: string, size: number = 200) {
        return `${this.QR_CODE_API}?size=${size}x${size}&data=${encodeURIComponent(data)}`
    },
} as const

// ==================== Social Media Configuration ====================

/**
 * Social Media Sharing URLs
 */
export const SOCIAL_CONFIG = {
    // WhatsApp share
    getWhatsAppShareUrl(text: string, url?: string) {
        const message = url ? `${text}\n\n${url}` : text
        return `https://wa.me/?text=${encodeURIComponent(message)}`
    },

    // Facebook share
    getFacebookShareUrl(url: string, quote?: string) {
        let shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
        if (quote) shareUrl += `&quote=${encodeURIComponent(quote)}`
        return shareUrl
    },

    // Twitter share
    getTwitterShareUrl(text: string, url?: string) {
        let shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`
        if (url) shareUrl += `&url=${encodeURIComponent(url)}`
        return shareUrl
    },

    // LinkedIn share
    getLinkedInShareUrl(url: string) {
        return `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
    },

    // Google Maps directions
    getGoogleMapsDirectionsUrl(lat: number, lng: number, address?: string) {
        let url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`
        if (address) url += `&destination_place_id=${encodeURIComponent(address)}`
        return url
    },
} as const

// ==================== Feature Flags ====================

/**
 * Feature toggles
 */
export const FEATURE_FLAGS = {
    // Enable/disable features based on environment
    ENABLE_ANALYTICS: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true',
    ENABLE_LIVE_CHAT: process.env.NEXT_PUBLIC_ENABLE_LIVE_CHAT === 'true',
    ENABLE_NOTIFICATIONS: process.env.NEXT_PUBLIC_ENABLE_NOTIFICATIONS === 'true',
    ENABLE_MAPS: MAPS_CONFIG.isConfigured,
    ENABLE_PAYMENTS: PAYMENT_CONFIG.isConfigured,
} as const

// ==================== Environment Info ====================

/**
 * Environment information
 */
export const ENV_INFO = {
    // Current environment
    ENV: process.env.NODE_ENV || 'development',

    // Check environment
    get isDevelopment() {
        return this.ENV === 'development'
    },

    get isProduction() {
        return this.ENV === 'production'
    },

    get isTest() {
        return this.ENV === 'test'
    },
} as const

// ==================== Validation ====================

/**
 * Validate configuration on load (only in development)
 */
export function validateConfig() {
    if (!ENV_INFO.isDevelopment) return

    const warnings: string[] = []

    // Check Firebase
    if (!FIREBASE_CONFIG.apiKey) {
        warnings.push('Firebase API key not configured')
    }

    // Check Maps
    if (!MAPS_CONFIG.isConfigured) {
        warnings.push('Mappls (Ola Maps) not configured - map features will be disabled')
    }

    // Check Payments
    if (!PAYMENT_CONFIG.isConfigured) {
        warnings.push('Razorpay not configured - payment features will be disabled')
    }

    if (warnings.length > 0) {
        console.warn('⚠️ Configuration Warnings:')
        warnings.forEach(warning => console.warn(`  - ${warning}`))
        console.warn('\nSee .env.local.example for setup instructions')
    }
}

// ==================== Export All ====================

/**
 * Single export object for easy access
 */
export const CONFIG = {
    API: API_CONFIG,
    FIREBASE: FIREBASE_CONFIG,
    MAPS: MAPS_CONFIG,
    PAYMENT: PAYMENT_CONFIG,
    APP: APP_CONFIG,
    CONTACT: CONTACT_CONFIG,
    EXTERNAL: EXTERNAL_SERVICES,
    SOCIAL: SOCIAL_CONFIG,
    FEATURES: FEATURE_FLAGS,
    ENV: ENV_INFO,
    validate: validateConfig,
} as const

// Run validation on load (development only)
if (typeof window !== 'undefined') {
    validateConfig()
}

export default CONFIG
