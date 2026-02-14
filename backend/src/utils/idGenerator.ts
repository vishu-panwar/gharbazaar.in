import { prisma } from './database';

/**
 * Generates a professional sequential Employee ID
 * Format: GB-EMP-YYYY-NNN (e.g., GB-EMP-2026-001)
 */
export const getNextEmployeeId = async (): Promise<string> => {
    const year = new Date().getFullYear();
    
    const counter = await prisma.counter.upsert({
        where: { id: 'employeeId' },
        update: {
            seq: {
                increment: 1
            }
        },
        create: {
            id: 'employeeId',
            seq: 1
        }
    });

    const sequenceNumber = String(counter.seq).padStart(3, '0');
    return `GB-EMP-${year}-${sequenceNumber}`;
};
