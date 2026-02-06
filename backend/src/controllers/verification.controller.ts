import { Request, Response } from 'express';
import VerificationTask from '../models/verificationTask.model';
import VerificationReport from '../models/verificationReport.model';
import Property from '../models/property.model';

export const createVerificationTask = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.userId;
        const { propertyId, assignedTo, taskType, checklist, dueDate, notes } = req.body;

        if (!userId) return res.status(401).json({ success: false, message: 'User not authenticated' });
        if (!propertyId) return res.status(400).json({ success: false, message: 'propertyId is required' });

        const property = await Property.findById(propertyId);
        if (!property) return res.status(404).json({ success: false, message: 'Property not found' });

        const task = await VerificationTask.create({
            propertyId,
            assignedTo,
            createdBy: userId,
            taskType,
            checklist,
            dueDate: dueDate ? new Date(dueDate) : undefined,
            notes
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
        const query: any = {};
        if (assignedTo) query.assignedTo = assignedTo;
        if (propertyId) query.propertyId = propertyId;
        if (status) query.status = status;

        const tasks = await VerificationTask.find(query)
            .populate('propertyId', 'title location price photos')
            .sort({ createdAt: -1 });

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

        const task = await VerificationTask.findById(id);
        if (!task) return res.status(404).json({ success: false, message: 'Task not found' });

        const { status, assignedTo, checklist, dueDate, notes } = req.body;
        if (status) task.status = status;
        if (assignedTo !== undefined) task.assignedTo = assignedTo;
        if (checklist !== undefined) task.checklist = checklist;
        if (dueDate !== undefined) task.dueDate = dueDate ? new Date(dueDate) : undefined;
        if (notes !== undefined) task.notes = notes;

        await task.save();

        if (status === 'verified') {
            await Property.findByIdAndUpdate(task.propertyId, { verified: true, status: 'active' });
        } else if (status === 'rejected') {
            await Property.findByIdAndUpdate(task.propertyId, { verified: false, status: 'rejected' });
        }

        res.json({ success: true, data: task });
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

        const report = await VerificationReport.create({
            taskId,
            propertyId,
            reportType,
            findings,
            recommendation,
            uploadedFiles,
            notes
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
        const query: any = {};
        if (taskId) query.taskId = taskId;
        if (propertyId) query.propertyId = propertyId;

        const reports = await VerificationReport.find(query)
            .sort({ createdAt: -1 });

        res.json({ success: true, data: reports });
    } catch (error: any) {
        console.error('getVerificationReports error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch reports', error: error.message });
    }
};
