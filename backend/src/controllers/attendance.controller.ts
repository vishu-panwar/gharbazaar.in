import { Request, Response } from 'express';
import Attendance from '../models/attendance.model';

export const markAttendance = async (req: Request, res: Response) => {
    try {
        const { userId } = (req as any).user; // From auth middleware
        const { status, location, notes, checkOut } = req.body;

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        let attendance = await Attendance.findOne({ userId, date: today });

        if (!attendance) {
            // New entry for today
            attendance = new Attendance({
                userId,
                date: today,
                checkIn: new Date(),
                status: status || 'present',
                location,
                notes
            });
        } else {
            // Update existing entry
            if (checkOut) {
                attendance.checkOut = new Date();
            }
            if (status) attendance.status = status;
            if (location) attendance.location = location;
            if (notes) attendance.notes = notes;
        }

        await attendance.save();
        res.json({ success: true, data: { attendance } });
    } catch (error) {
        console.error('Error marking attendance:', error);
        res.status(500).json({ success: false, error: 'Failed to mark attendance' });
    }
};

export const getAttendanceRecords = async (req: Request, res: Response) => {
    try {
        const { userId, startDate, endDate } = req.query;
        let query: any = {};

        if (userId) query.userId = userId;

        if (startDate || endDate) {
            query.date = {};
            if (startDate) query.date.$gte = new Date(startDate as string);
            if (endDate) query.date.$lte = new Date(endDate as string);
        }

        const records = await Attendance.find(query).sort({ date: -1 });
        res.json({ success: true, data: { records } });
    } catch (error) {
        console.error('Error fetching attendance records:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch attendance records' });
    }
};
