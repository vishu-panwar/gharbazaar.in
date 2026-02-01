import Counter from '../models/counter.model';

/**
 * Generates a professional sequential Employee ID
 * Format: GB-EMP-YYYY-NNN (e.g., GB-EMP-2026-001)
 */
export const getNextEmployeeId = async (): Promise<string> => {
    const year = new Date().getFullYear();
    const counter = await Counter.findOneAndUpdate(
        { id: 'employeeId' },
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
    );

    const sequenceNumber = String(counter.seq).padStart(3, '0');
    return `GB-EMP-${year}-${sequenceNumber}`;
};
