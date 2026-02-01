import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

interface Config {
    port: number;
    nodeEnv: string;
    jwtSecret: string;
    jwtExpiresIn: string;
    mongodbUri: string;
    frontendUrl: string;
    appName: string;
    google: {
        clientId: string;
        clientSecret: string;
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
}

const config: Config = {
    port: parseInt(process.env.PORT || '5000', 10),
    nodeEnv: process.env.NODE_ENV || 'development',
    jwtSecret: process.env.JWT_SECRET || 'change_this_secret_key_in_production',
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
    mongodbUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/gharbazaar',
    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
    appName: process.env.APP_NAME || 'GharBazaar',
    google: {
        clientId: process.env.GOOGLE_CLIENT_ID || '',
        clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    },
    allowedOrigins: (process.env.FRONTEND_URL || 'http://localhost:3000')
        .split(',')
        .map(url => url.trim()),
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
        max: parseInt(process.env.RATE_LIMIT_MAX || '100', 10),
        windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '15', 10) * 60 * 1000,
    },
    logLevel: process.env.LOG_LEVEL || 'info',
    adminEmail: process.env.ADMIN_EMAIL || 'gharbazaarofficial@zohomail.in',
};

export const validateConfig = (): void => {
    const requiredVars = ['JWT_SECRET', 'MONGODB_URI'];
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
