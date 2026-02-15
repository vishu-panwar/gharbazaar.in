import { Request, Response } from 'express';
import { prisma } from '../utils/prisma';

export const createVerificationTask = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.userId;
        const { propertyId, assignedTo, taskType, checklist, dueDate, notes } = req.body;

        if (!userId) return res.status(401).json({ success: false, message: 'User not authenticated' });
        if (!propertyId) return res.status(400).json({ success: false, message: 'propertyId is required' });

        const property = await prisma.property.findUnique({
            where: { id: propertyId }
        });
        if (!property) return res.status(404).json({ success: false, message: 'Property not found' });

        const task = await prisma.verificationTask.create({
            data: {
                propertyId,
                assignedTo,
                createdBy: userId,
                taskType,
                checklist: checklist || [],
                dueDate: dueDate ? new Date(dueDate) : null,
                notes
            }
        });

        res.status(201).json({ success: true, data: task });
    } catch (error: any) {
        console.error('createVerificationTask error:', error);
        res.status(500).json({ success: false, message: 'Failed to create task', error: error.message });
    }
};

export const getVerificationTasks = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.userId;
        if (!userId) return res.status(401).json({ success: false, message: 'User not authenticated' });

        const { assignedTo, propertyId, status } = req.query;
        const where: any = {};
        if (assignedTo) where.assignedTo = assignedTo as string;
        if (propertyId) where.propertyId = propertyId as string;
        if (status) where.status = status as string;

        const tasks = await prisma.verificationTask.findMany({
            where,
            include: {
                property: {
                    select: {
                        title: true,
                        location: true,
                        price: true,
                        photos: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        res.json({ success: true, data: tasks });
    } catch (error: any) {
        console.error('getVerificationTasks error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch tasks', error: error.message });
    }
};

export const updateVerificationTask = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const userId = (req as any).user?.userId;
        if (!userId) return res.status(401).json({ success: false, message: 'User not authenticated' });

        const task = await prisma.verificationTask.findUnique({
            where: { id }
        });
        if (!task) return res.status(404).json({ success: false, message: 'Task not found' });

        const { status, assignedTo, checklist, dueDate, notes } = req.body;

        const updateData: any = {};
        if (status !== undefined) updateData.status = status;
        if (assignedTo !== undefined) updateData.assignedTo = assignedTo;
        if (checklist !== undefined) updateData.checklist = checklist;
        if (dueDate !== undefined) updateData.dueDate = dueDate ? new Date(dueDate) : null;
        if (notes !== undefined) updateData.notes = notes;

        const updatedTask = await prisma.verificationTask.update({
            where: { id },
            data: updateData
        });

        // Update property verification status based on task status
        if (status === 'verified') {
            await prisma.property.update({
                where: { id: task.propertyId },
                data: { verified: true, status: 'active' }
            });
        } else if (status === 'rejected') {
            await prisma.property.update({
                where: { id: task.propertyId },
                data: { verified: false, status: 'rejected' }
            });
        }

        res.json({ success: true, data: updatedTask });
    } catch (error: any) {
        console.error('updateVerificationTask error:', error);
        res.status(500).json({ success: false, message: 'Failed to update task', error: error.message });
    }
};

export const createVerificationReport = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.userId;
        if (!userId) return res.status(401).json({ success: false, message: 'User not authenticated' });

        const { taskId, propertyId, reportType, findings, recommendation, uploadedFiles, notes } = req.body;
        if (!taskId || !propertyId) {
            return res.status(400).json({ success: false, message: 'taskId and propertyId are required' });
        }

        const report = await prisma.verificationReport.create({
            data: {
                taskId,
                propertyId,
                reportType,
                findings: findings || [],
                recommendation,
                uploadedFiles: uploadedFiles || [],
                notes
            }
        });

        res.status(201).json({ success: true, data: report });
    } catch (error: any) {
        console.error('createVerificationReport error:', error);
        res.status(500).json({ success: false, message: 'Failed to create report', error: error.message });
    }
};

export const getVerificationReports = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.userId;
        if (!userId) return res.status(401).json({ success: false, message: 'User not authenticated' });

        const { taskId, propertyId } = req.query;
        const where: any = {};
        if (taskId) where.taskId = taskId as string;
        if (propertyId) where.propertyId = propertyId as string;

        const reports = await prisma.verificationReport.findMany({
            where,
            orderBy: { createdAt: 'desc' }
        });

        res.json({ success: true, data: reports });
    } catch (error: any) {
        console.error('getVerificationReports error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch reports', error: error.message });
    }
};
