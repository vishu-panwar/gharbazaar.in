import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

interface Config {
    port: number;
    nodeEnv: string;
    jwtSecret: string;
    jwtExpiresIn: string;
    databaseUrl: string;
    mongodbUri: string;
    frontendUrl: string;
    appName: string;
    google: {
        clientId: string;
        clientSecret: string;
        redirectUri: string;
    };
    razorpay: {
        keyId: string;
        keySecret: string;
    };
    smtp: {
        host: string;
        port: number;
        user: string;
        pass: string;
    };
    allowedOrigins: string[];
    socket: {
        pingTimeout: number;
        pingInterval: number;
        reconnectionAttempts: number;
    };
    upload: {
        maxFileSize: number;
        uploadDir: string;
    };
    rateLimit: {
        max: number;
        windowMs: number;
    };
    logLevel: string;
    adminEmail: string;
    isOriginAllowed: (origin?: string) => boolean;
}

const rawAllowedOrigins = (process.env.FRONTEND_URL || 'http://localhost:3000')
    .split(',')
    .map((url: string) => url.trim())
    .filter(Boolean);

const defaultDevOrigins = [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'http://localhost:3001',
    'http://127.0.0.1:3001',
];

const isProduction = (process.env.NODE_ENV || 'development') === 'production';

const allowedOrigins = Array.from(
    new Set([
        ...rawAllowedOrigins,
        ...(isProduction ? [] : defaultDevOrigins),
    ])
);

const localhostOriginRegex = /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i;

const isOriginAllowed = (origin?: string): boolean => {
    // Allow non-browser clients (no Origin header), e.g. curl/health checks.
    if (!origin) return true;
    if (allowedOrigins.includes(origin)) return true;
    if (!isProduction && localhostOriginRegex.test(origin)) return true;
    return false;
};

const config: Config = {
    port: parseInt(process.env.PORT || '5000', 10),
    nodeEnv: process.env.NODE_ENV || 'development',
    jwtSecret: process.env.JWT_SECRET || 'change_this_secret_key_in_production',
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
    databaseUrl: process.env.DATABASE_URL || 'postgresql://localhost:5432/gharbazaar',
    mongodbUri: process.env.MONGODB_URI || '',
    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
    appName: process.env.APP_NAME || 'GharBazaar',
    google: {
        clientId: process.env.GOOGLE_CLIENT_ID || '',
        clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
        redirectUri: process.env.GOOGLE_REDIRECT_URI || '',
    },
    razorpay: {
        keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || '',
        keySecret: process.env.RAZORPAY_KEY_SECRET || '',
    },
    smtp: {
        host: process.env.SMTP_HOST || 'smtp.zoho.com',
        port: parseInt(process.env.SMTP_PORT || '587', 10),
        user: process.env.SMTP_USER || '',
        pass: process.env.SMTP_PASS || '',
    },
    allowedOrigins,
    socket: {
        pingTimeout: parseInt(process.env.SOCKET_PING_TIMEOUT || '60000', 10),
        pingInterval: parseInt(process.env.SOCKET_PING_INTERVAL || '25000', 10),
        reconnectionAttempts: parseInt(process.env.SOCKET_RECONNECTION_ATTEMPTS || '5', 10),
    },
    upload: {
        maxFileSize: parseInt(process.env.MAX_FILE_SIZE || '5242880', 10),
        uploadDir: process.env.UPLOAD_DIR || path.join(__dirname, '../../uploads'),
    },
    rateLimit: {
        max: parseInt(process.env.RATE_LIMIT_MAX || '1000', 10),
        windowMs: (() => {
            const raw = parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10);
            if (raw > 0 && raw < 1000) return raw * 60 * 1000;
            return raw;
        })(),
    },
    logLevel: process.env.LOG_LEVEL || 'info',
    adminEmail: process.env.ADMIN_EMAIL || 'gharbazaarofficial@zohomail.in',
    isOriginAllowed,
};

export const validateConfig = (): void => {
    const requiredVars = ['JWT_SECRET', 'DATABASE_URL', 'MONGODB_URI'];
    const missing = requiredVars.filter(varName => !process.env[varName]);

    if (missing.length > 0) {
        console.error('❌ Missing required environment variables:', missing.join(', '));
        console.error('💡 Please check your .env file');
        process.exit(1);
    }

    if (config.nodeEnv === 'production' && config.jwtSecret === 'change_this_secret_key_in_production') {
        console.error('❌ SECURITY WARNING: Using default JWT secret in production!');
        console.error('💡 Please set a strong JWT_SECRET in your environment variables');
        process.exit(1);
    }

    console.log('✅ Configuration validated successfully');
};

export default config;
