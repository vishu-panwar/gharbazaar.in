/**
 * 📊 LOGGER UTILITY
 * 
 * Centralized logging for better debugging and monitoring.
 * Uses Winston for production-grade logging.
 * 
 * @author GharBazaar Backend Team
 */

import winston from 'winston';
import config from '../config';

/**
 * Winston logger configuration
 */
const logger = winston.createLogger({
    level: config.logLevel,
    format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.errors({ stack: true }),
        winston.format.splat(),
        winston.format.json()
    ),
    defaultMeta: { service: 'gharbazaar-socket-backend' },
    transports: [
        // Write all logs to console (for development)
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.printf(({ timestamp, level, message, ...meta }) => {
                    return `${timestamp} [${level}]: ${message} ${Object.keys(meta).length ? JSON.stringify(meta, null, 2) : ''}`;
                })
            )
        }),

        // Write errors to error.log file (for production)
        new winston.transports.File({
            filename: 'logs/error.log',
            level: 'error',
            maxsize: 5242880, // 5MB
            maxFiles: 5,
        }),

        // Write all logs to combined.log (for production)
        new winston.transports.File({
            filename: 'logs/combined.log',
            maxsize: 5242880, // 5MB
            maxFiles: 5,
        })
    ]
});

/**
 * Log levels:
 * - error: Critical errors
 * - warn: Warning messages
 * - info: General information
 * - http: HTTP request logs
 * - debug: Debug information
 */

export default logger;
