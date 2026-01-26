export const memoryConversations = new Map();
export const memoryMessages = new Map();
export const memoryTickets = new Map();
export const memoryTicketMessages = new Map();
import mongoose from 'mongoose';

export const isMongoDBAvailable = (): boolean => {
    return mongoose.connection.readyState === 1; // 1 = connected
};
export const logMemoryOnlyMode = () => {
    if (!isMongoDBAvailable()) {
        console.warn('⚠️  Using IN-MEMORY storage - Data will not persist!');
    }
};

