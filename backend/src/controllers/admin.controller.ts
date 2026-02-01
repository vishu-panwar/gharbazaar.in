import { Request, Response } from 'express';
import User from '../models/user.model';
import EmployeeProfile from '../models/employeeProfile.model';
import Salary from '../models/salary.model';
import Notification from '../models/notification.model';
import { getNextEmployeeId } from '../utils/idGenerator';
import crypto from 'crypto';
import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import Property from '../models/property.model';
import UserPlan from '../models/userPlan.model';
import Plan from '../models/plan.model';

export const listEmployees = async (req: Request, res: Response) => {
    try {
        const employees = await User.find({ role: 'employee' }).select('-password');
        const profiles = await EmployeeProfile.find();

        // Enumerate profiles and merge with user data
        const detailedEmployees = employees.map(emp => {
            const profile = profiles.find(p => p.userId === emp.uid);
            return {
                ...emp.toObject(),
                profile: profile || null
            };
        });

        res.json({ success: true, data: { employees: detailedEmployees } });
    } catch (error) {
        console.error('Error listing employees:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch employees' });
    }
};

export const addEmployee = async (req: Request, res: Response) => {
    try {
        const { email, password, name, department, designation } = req.body;

        if (!email || !password || !name) {
            return res.status(400).json({ success: false, error: 'Email, password and name are required' });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, error: 'Email already exists' });
        }

        // Create user with employee role
        const uid = `gbemployee${crypto.randomBytes(4).toString('hex').slice(0, 7)}`;
        const user = new User({
            uid,
            email,
            password,
            name,
            role: 'employee',
            onboardingCompleted: true
        });

        await user.save();

        const employeeId = await getNextEmployeeId();
        const profile = new EmployeeProfile({
            userId: uid,
            employeeId,
            department: department || 'Sales',
            designation: designation || 'Support Agent'
        });

        await profile.save();

        res.status(201).json({
            success: true,
            data: {
                user: {
                    uid: user.uid,
                    email: user.email,
                    name: user.name,
                    role: user.role
                },
                profile
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Failed to add employee' });
    }
};

export const removeEmployee = async (req: Request, res: Response) => {
    try {
        const { id } = req.params; // Expecting user.uid

        const user = await User.findOne({ uid: id });
        if (!user) {
            return res.status(404).json({ success: false, error: 'Employee not found' });
        }

        if (user.role !== 'employee') {
            return res.status(400).json({ success: false, error: 'User is not an employee' });
        }

        // We'll perform a soft delete by updating status in profile
        await EmployeeProfile.findOneAndUpdate(
            { userId: id },
            { status: 'terminated' }
        );

        // Optionally update user role or deactivate
        // user.role = 'buyer'; // Downgrade to buyer
        // await user.save();

        res.json({ success: true, message: 'Employee terminated successfully' });
    } catch (error) {
        console.error('Error removing employee:', error);
        res.status(500).json({ success: false, error: 'Failed to remove employee' });
    }
};

export const updateEmployeeProfile = async (req: Request, res: Response) => {
    try {
        const { id } = req.params; // userId
        const updates = req.body;

        const profile = await EmployeeProfile.findOneAndUpdate(
            { userId: id },
            { $set: updates },
            { new: true }
        );

        if (!profile) {
            return res.status(404).json({ success: false, error: 'Employee profile not found' });
        }

        res.json({ success: true, data: { profile } });
    } catch (error) {
        console.error('Error updating employee profile:', error);
        res.status(500).json({ success: false, error: 'Failed to update profile' });
    }
};

export const processSalary = async (req: Request, res: Response) => {
    try {
        const { userId, month, year, baseSalary, allowances, deductions, paymentMethod, transactionReference } = req.body;

        if (!userId || !month || !year || !baseSalary) {
            return res.status(400).json({ success: false, error: 'Missing required salary fields' });
        }

        const netSalary = (Number(baseSalary) + Number(allowances || 0)) - Number(deductions || 0);

        const salary = await Salary.findOneAndUpdate(
            { userId, month, year },
            {
                baseSalary,
                allowances,
                deductions,
                netSalary,
                status: 'paid',
                paymentDate: new Date(),
                paymentMethod,
                transactionReference
            },
            { new: true, upsert: true }
        );

        res.json({ success: true, data: { salary } });
    } catch (error) {
        console.error('Error processing salary:', error);
        res.status(500).json({ success: false, error: 'Failed to process salary' });
    }
};

export const getSalaryRecords = async (req: Request, res: Response) => {
    try {
        const { month, year } = req.query;
        let query: any = {};
        if (month) query.month = month;
        if (year) query.year = year;

        const records = await Salary.find(query).sort({ createdAt: -1 });
        res.json({ success: true, data: { records } });
    } catch (error) {
        console.error('Error fetching salary records:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch salary records' });
    }
};

export const broadcastAnnouncement = async (req: Request, res: Response) => {
    try {
        const { target, title, message, link, priority } = req.body;

        if (!title || !message) {
            return res.status(400).json({ success: false, error: 'Title and message are required' });
        }

        // 1. Identify target users
        let userQuery: any = {};
        if (target && target !== 'all') {
            userQuery.role = target; // e.g., 'buyer', 'seller', 'ground_partner'
        }

        const users = await User.find(userQuery).select('uid');
        if (users.length === 0) {
            return res.json({ success: true, message: 'No users found for this target' });
        }

        // 2. Create notification records
        const notifications = users.map(user => ({
            userId: user.uid,
            type: 'system',
            title,
            message,
            link,
            priority: priority || 'medium',
            isRead: false
        }));

        await Notification.insertMany(notifications);

        // 3. Emit via Socket.io if available
        const io = req.app.get('io');
        if (io) {
            // If target is specific role, we can emit to a room if we implement role-based rooms,
            // otherwise we can emit a general broadcast and clients can filter or we emit to everyone.
            // Best: Emit 'new_announcement' to all, with target info
            io.emit('new_announcement', {
                target,
                title,
                message,
                link,
                priority: priority || 'medium',
                createdAt: new Date()
            });
        }

        res.json({
            success: true,
            message: `Announcement broadcasted to ${users.length} users`,
            recipientCount: users.length
        });
    } catch (error) {
        console.error('Error broadcasting announcement:', error);
        res.status(500).json({ success: false, error: 'Failed to broadcast announcement' });
    }
};

// Database Administration Controls

export const exportDatabase = async (req: Request, res: Response) => {
    try {
        const collections = mongoose.connection.collections;
        const backup: any = {};

        for (const key in collections) {
            const data = await collections[key].find({}).toArray();
            backup[key] = data;
        }

        res.json({ success: true, data: backup });
    } catch (error) {
        console.error('Error exporting database:', error);
        res.status(500).json({ success: false, error: 'Failed to export database' });
    }
};

export const importDatabase = async (req: Request, res: Response) => {
    try {
        const { backupData } = req.body;
        if (!backupData) {
            return res.status(400).json({ success: false, error: 'Backup data is required' });
        }

        const collections = mongoose.connection.collections;

        for (const key in backupData) {
            if (collections[key]) {
                await collections[key].deleteMany({});
                if (backupData[key].length > 0) {
                    await collections[key].insertMany(backupData[key]);
                }
            }
        }

        res.json({ success: true, message: 'Database imported successfully' });
    } catch (error) {
        console.error('Error importing database:', error);
        res.status(500).json({ success: false, error: 'Failed to import database' });
    }
};

export const createBackup = async (req: Request, res: Response) => {
    try {
        const collections = mongoose.connection.collections;
        const backup: any = {};

        for (const key in collections) {
            const data = await collections[key].find({}).toArray();
            backup[key] = data;
        }

        const backupDir = path.join(process.cwd(), 'backups');
        if (!fs.existsSync(backupDir)) {
            fs.mkdirSync(backupDir);
        }

        const fileName = `backup_${new Date().toISOString().replace(/[:.]/g, '-')}.json`;
        const filePath = path.join(backupDir, fileName);

        fs.writeFileSync(filePath, JSON.stringify(backup, null, 2));

        res.json({
            success: true,
            message: 'Backup created successfully',
            data: { fileName, filePath, createdAt: new Date() }
        });
    } catch (error) {
        console.error('Error creating backup:', error);
        res.status(500).json({ success: false, error: 'Failed to create backup' });
    }
};

export const restoreBackup = async (req: Request, res: Response) => {
    try {
        const { fileName } = req.body;
        if (!fileName) {
            return res.status(400).json({ success: false, error: 'Filename is required' });
        }

        const filePath = path.join(process.cwd(), 'backups', fileName);
        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ success: false, error: 'Backup file not found' });
        }

        const backupData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        const collections = mongoose.connection.collections;

        for (const key in backupData) {
            if (collections[key]) {
                await collections[key].deleteMany({});
                if (backupData[key].length > 0) {
                    await collections[key].insertMany(backupData[key]);
                }
            }
        }

        res.json({ success: true, message: 'Database restored successfully' });
    } catch (error) {
        console.error('Error restoring backup:', error);
        res.status(500).json({ success: false, error: 'Failed to restore backup' });
    }
};

export const listBackups = async (req: Request, res: Response) => {
    try {
        const backupDir = path.join(process.cwd(), 'backups');
        if (!fs.existsSync(backupDir)) {
            return res.json({ success: true, data: { backups: [] } });
        }

        const files = fs.readdirSync(backupDir);
        const backups = files.filter(f => f.endsWith('.json')).map(f => {
            const stats = fs.statSync(path.join(backupDir, f));
            return {
                fileName: f,
                size: stats.size,
                createdAt: stats.birthtime
            };
        });

        res.json({ success: true, data: { backups: backups.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()) } });
    } catch (error) {
        console.error('Error listing backups:', error);
        res.status(500).json({ success: false, error: 'Failed to list backups' });
    }
};

export const getAllClients = async (req: Request, res: Response) => {
    try {
        const users = await User.find({ role: { $in: ['buyer', 'seller'] } }).select('-password').sort({ createdAt: -1 });
        res.json({ success: true, data: { users } });
    } catch (error) {
        console.error('Error fetching clients:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch clients' });
    }
};

export const deleteClient = async (req: Request, res: Response) => {
    try {
        const { id } = req.params; // Expecting user.uid

        const user = await User.findOne({ uid: id });
        if (!user) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }

        if (user.role === 'admin' || user.role === 'employee') {
            return res.status(403).json({ success: false, error: 'Cannot delete admins or employees via this endpoint' });
        }

        // Emit force_logout event BEFORE deleting to ensure socket is still mapped (if using DB presence)
        // or just emit to the room/user.
        const io = req.app.get('io');
        if (io) {
            // We can emit to a room named by userId if proper room joining is implemented,
            // OR we can iterate connected sockets.
            // Based on socket/presence handlers, we might not have direct userId rooms guaranteed unless we check implementation.
            // However, `initializeSocket` usually doesn't auto-join uid rooms unless specified.
            // But let's check if we can filter sockets by user.
            // A common pattern is loop or map.
            // Let's rely on a broadcast with data payload that clients listen to?
            // No, that's inefficient.
            // Let's assume we can emit to specific socket IDs found in Presence.

            // We can try to get socketId from Presence model if MongoDB is available.
            // Or just emit a 'force_logout:user_id' event to everyone and client checks if it matches them?
            // Better: 'force_logout' to a specific socket.

            // Let's find the socket ID for this user.
            // We can use the Presence model or memory map if exported, but here we are in a controller.
            // Simplest approach for "Real Time" without complex socket stores: export a helper or use the io instance to find sockets.

            // For now, I will use a broadcast event 'admin:force_logout' with userId payload.
            // All connected clients listen, check if their ID matches, and logout if so.
            io.emit('admin:force_logout', { userId: id });
        }

        await User.deleteOne({ uid: id });
        // Also clean up related profiles if any? (e.g. if we had buyer/seller specific profiles)
        // For now, User document is the main one.

        res.json({ success: true, message: 'User deleted and logged out successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ success: false, error: 'Failed to delete user' });
    }
};

export const getDashboardStats = async (req: Request, res: Response) => {
    try {
        // 1. Counts
        const totalUsers = await User.countDocuments({ role: { $in: ['buyer', 'seller'] } });
        const activeListings = await Property.countDocuments({ status: 'active' });
        const totalEmployees = await User.countDocuments({ role: 'employee' });

        // 2. Revenue Calculation (Estimate based on UserPlans)
        // Find all plans to create a map of price
        const plans = await Plan.find({});
        const planPriceMap = plans.reduce((acc: any, plan) => {
            acc[plan._id.toString()] = plan.price;
            return acc;
        }, {});

        const allUserPlans = await UserPlan.find({});
        const totalRevenue = allUserPlans.reduce((sum, userPlan) => {
            const price = planPriceMap[userPlan.planId.toString()] || 0;
            return sum + price;
        }, 0);

        // 3. Quick Stats (New Users & Revenue today)
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        const newUsersToday = await User.countDocuments({
            role: { $in: ['buyer', 'seller'] },
            createdAt: { $gte: startOfDay }
        });

        // Revenue today
        const newPlansToday = await UserPlan.find({ createdAt: { $gte: startOfDay } });
        const revenueToday = newPlansToday.reduce((sum, userPlan) => {
            const price = planPriceMap[userPlan.planId.toString()] || 0;
            return sum + price;
        }, 0);

        // Pending Approvals (Properties pending)
        const pendingApprovals = await Property.countDocuments({ status: 'pending' });

        // 4. Recent Activities
        // Fetch last 5 users
        const recentUsers = await User.find({ role: { $in: ['buyer', 'seller'] } })
            .sort({ createdAt: -1 })
            .limit(5)
            .select('name role createdAt');

        // Fetch last 5 properties
        const recentProperties = await Property.find({})
            .sort({ createdAt: -1 })
            .limit(5)
            .select('title propertyType createdAt');

        // Normalize and merge
        const activities = [
            ...recentUsers.map(u => ({
                id: u._id,
                type: 'user',
                title: 'New User Registration',
                description: `${u.name} joined as ${u.role}`,
                time: u.createdAt,
                createdAt: u.createdAt
            })),
            ...recentProperties.map(p => ({
                id: p._id,
                type: 'listing',
                title: 'New Property Listed',
                description: p.title,
                time: p.createdAt,
                createdAt: p.createdAt
            }))
        ]
            .sort((a: any, b: any) => b.createdAt - a.createdAt)
            .slice(0, 10); // Last 10 mixed activities

        // Helper to format currency
        const formatCurrency = (amount: number) => {
            if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(2)}Cr`;
            if (amount >= 100000) return `₹${(amount / 100000).toFixed(2)}L`;
            return `₹${amount.toLocaleString('en-IN')}`;
        };

        res.json({
            success: true,
            data: {
                counts: {
                    totalUsers,
                    activeListings,
                    totalEmployees,
                    totalRevenue: formatCurrency(totalRevenue)
                },
                quickStats: {
                    revenueToday: formatCurrency(revenueToday),
                    newUsersToday,
                    pendingApprovals
                },
                recentActivities: activities
            }
        });

    } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch dashboard stats' });
    }
};


export const getAllProperties = async (req: Request, res: Response) => {
    try {
        const properties = await Property.find().sort({ createdAt: -1 });
        res.json({ success: true, data: { properties } });
    } catch (error) {
        console.error('Error fetching properties:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch properties' });
    }
};

export const updatePropertyStatus = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { status, reason } = req.body;

        const allowedStatuses = ['active', 'pending', 'rejected', 'paused', 'cancelled', 'deleted'];
        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({ success: false, error: 'Invalid status' });
        }

        const property = await Property.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        );

        if (!property) {
            return res.status(404).json({ success: false, error: 'Property not found' });
        }

        // Notify seller
        await Notification.create({
            userId: property.sellerId,
            type: 'listing_update',
            title: `Listing Status Updated: ${status.toUpperCase()}`,
            message: `Your listing "${property.title}" has been ${status} by admin.${reason ? ` Reason: ${reason}` : ''}`,
            link: `/dashboard/listings/${property._id}`,
            priority: 'medium'
        });

        res.json({ success: true, data: { property } });
    } catch (error) {
        console.error('Error updating property status:', error);
        res.status(500).json({ success: false, error: 'Failed to update property status' });
    }
};

export const deleteProperty = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        // Soft delete: Update status to 'deleted'
        const property = await Property.findByIdAndUpdate(
            id,
            { status: 'deleted' },
            { new: true }
        );

        if (!property) {
            return res.status(404).json({ success: false, error: 'Property not found' });
        }

        // Notify seller
        await Notification.create({
            userId: property.sellerId,
            type: 'listing_update',
            title: 'Listing Deleted by Admin',
            message: `Your listing "${property.title}" has been deleted by admin.`,
            priority: 'high'
        });

        res.json({ success: true, message: 'Property deleted successfully' });
    } catch (error) {
        console.error('Error deleting property:', error);
        res.status(500).json({ success: false, error: 'Failed to delete property' });
    }
};
