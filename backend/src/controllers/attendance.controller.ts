import { Request, Response } from 'express';
import { prisma } from '../utils/prisma';

export const markAttendance = async (req: Request, res: Response) => {
    try {
        const { userId } = (req as any).user; // From auth middleware
        const { status, latitude, longitude, address, notes, checkOut } = req.body;

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        // Try to find existing attendance for today
        let attendance = await prisma.attendance.findFirst({
            where: {
                userId,
                date: {
                    gte: today,
                    lt: tomorrow
                }
            }
        });

        if (!attendance) {
            // Create new entry for today
            attendance = await prisma.attendance.create({
                data: {
                    userId,
                    date: today,
                    checkIn: new Date(),
                    status: status || 'present',
                    latitude,
                    longitude,
                    address,
                    notes
                }
            });
        } else {
            // Update existing entry
            const updateData: any = {};
            if (checkOut) updateData.checkOut = new Date();
            if (status) updateData.status = status;
            if (latitude) updateData.latitude = latitude;
            if (longitude) updateData.longitude = longitude;
            if (address) updateData.address = address;
            if (notes) updateData.notes = notes;

            attendance = await prisma.attendance.update({
                where: { id: attendance.id },
                data: updateData
            });
        }

        res.json({ success: true, data: { attendance } });
    } catch (error) {
        console.error('Error marking attendance:', error);
        res.status(500).json({ success: false, error: 'Failed to mark attendance' });
    }
};

export const getAttendanceRecords = async (req: Request, res: Response) => {
    try {
        const { userId, startDate, endDate } = req.query;
        const where: any = {};

        if (userId) where.userId = userId as string;

        if (startDate || endDate) {
            where.date = {};
            if (startDate) where.date.gte = new Date(startDate as string);
            if (endDate) where.date.lte = new Date(endDate as string);
        }

        const records = await prisma.attendance.findMany({
            where,
            orderBy: { date: 'desc' }
        });

        res.json({ success: true, data: { records } });
    } catch (error) {
        console.error('Error fetching attendance records:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch attendance records' });
    }
};
