import { prisma } from './database';

export const memoryConversations = new Map();
export const memoryMessages = new Map();
export const memoryTickets = new Map();
export const memoryTicketMessages = new Map();

/**
 * Check if the database connection is active
 */
export const isDatabaseAvailable = async (): Promise<boolean> => {
    try {
        await prisma.$connect();
        return true;
    } catch {
        return false;
    }
};

// Alias for compatibility with existing code during migration
export const isMongoDBAvailable = () => true; // Assume true if we reach here and prisma is connected

export const logMemoryOnlyMode = async () => {
    const available = await isDatabaseAvailable();
    if (!available) {
        console.warn('⚠️  Database connection unavailable - Data will not persist!');
    }
};

