import { Request, Response } from 'express';
import { prisma } from '../utils/database';
import { getNextEmployeeId } from '../utils/idGenerator';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { Decimal } from '@prisma/client/runtime/library';
import { Prisma } from '@prisma/client';
import PaymentTransaction from '../models/paymentTransaction.model';

const UUID_REGEX =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const resolveInternalUserId = async (uidOrId?: string | null): Promise<string | null> => {
    const value = (uidOrId || '').trim();
    if (!value) return null;

    const byUid = await prisma.user.findUnique({
        where: { uid: value },
        select: { id: true },
    });
    if (byUid) return byUid.id;

    if (!UUID_REGEX.test(value)) return null;

    const byId = await prisma.user.findUnique({
        where: { id: value },
        select: { id: true },
    });

    return byId?.id || null;
};

export const listEmployees = async (req: Request, res: Response) => {
    try {
        const employees = await prisma.user.findMany({
            where: { role: 'employee' },
            select: {
                id: true,
                uid: true,
                email: true,
                name: true,
                role: true,
                branch: true,
                office: true,
                employeeProfile: true
            }
        });

        res.json({ success: true, data: { employees } });
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

        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            return res.status(400).json({ success: false, error: 'Email already exists' });
        }

        // Create user with employee role
        const uid = `gbemployee${crypto.randomBytes(4).toString('hex').slice(0, 7)}`;
        const employeeId = await getNextEmployeeId();

        const result = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
            const user = await tx.user.create({
                data: {
                    uid,
                    email,
                    password, // Note: Should be hashed in a real app, but preserving existing logic
                    name,
                    role: 'employee',
                    onboardingCompleted: true
                }
            });

            const profile = await tx.employeeProfile.create({
                data: {
                    userId: user.id,
                    employeeId,
                    department: department || 'Sales',
                    designation: designation || 'Support Agent'
                }
            });

            return { user, profile };
        });

        res.status(201).json({
            success: true,
            data: {
                user: {
                    uid: result.user.uid,
                    email: result.user.email,
                    name: result.user.name,
                    role: result.user.role
                },
                profile: result.profile
            }
        });
    } catch (error) {
        console.error('Error adding employee:', error);
        res.status(500).json({ success: false, error: 'Failed to add employee' });
    }
};

export const removeEmployee = async (req: Request, res: Response) => {
    try {
        const { id } = req.params; // Expecting user.uid

        const user = await prisma.user.findUnique({
            where: { uid: id }
        });

        if (!user) {
            return res.status(404).json({ success: false, error: 'Employee not found' });
        }

        if (user.role !== 'employee') {
            return res.status(400).json({ success: false, error: 'User is not an employee' });
        }

        // We'll perform a soft delete by updating status in profile
        await prisma.employeeProfile.update({
            where: { userId: user.id },
            data: { isActive: false }
        });

        res.json({ success: true, message: 'Employee deactivated successfully' });
    } catch (error) {
        console.error('Error removing employee:', error);
        res.status(500).json({ success: false, error: 'Failed to remove employee' });
    }
};

export const updateEmployeeProfile = async (req: Request, res: Response) => {
    try {
        const { id } = req.params; // This is the user.uid from the route usually, let's verify if it's uid or id
        const updates = req.body;

        const user = await prisma.user.findUnique({
            where: { uid: id }
        });

        if (!user) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }

        const profile = await prisma.employeeProfile.update({
            where: { userId: user.id },
            data: updates
        });

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

        const salary = await prisma.salary.upsert({
            where: {
                userId_month_year: {
                    userId,
                    month,
                    year: Number(year)
                }
            },
            update: {
                baseSalary: new Decimal(baseSalary),
                allowances: new Decimal(allowances || 0),
                deductions: new Decimal(deductions || 0),
                netSalary: new Decimal(netSalary),
                status: 'paid',
                paymentDate: new Date(),
                paymentMethod,
                transactionReference
            },
            create: {
                userId,
                month,
                year: Number(year),
                baseSalary: new Decimal(baseSalary),
                allowances: new Decimal(allowances || 0),
                deductions: new Decimal(deductions || 0),
                netSalary: new Decimal(netSalary),
                status: 'paid',
                paymentDate: new Date(),
                paymentMethod,
                transactionReference
            }
        });

        res.json({ success: true, data: { salary } });
    } catch (error) {
        console.error('Error processing salary:', error);
        res.status(500).json({ success: false, error: 'Failed to process salary' });
    }
};

export const approvePayout = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { reference, status } = req.body;

        const payout = await prisma.payout.update({
            where: { id },
            data: {
                status: status || 'paid',
                reference: reference || undefined
            }
        });

        res.json({ success: true, data: payout });
    } catch (error) {
        console.error('Error approving payout:', error);
        res.status(500).json({ success: false, error: 'Failed to approve payout' });
    }
};

export const getSalaryRecords = async (req: Request, res: Response) => {
    try {
        const { month, year } = req.query;
        let where: any = {};
        if (month) where.month = month as string;
        if (year) where.year = Number(year);

        const records = await prisma.salary.findMany({
            where,
            orderBy: { createdAt: 'desc' }
        });
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
        let where: any = {};
        if (target && target !== 'all') {
            where.role = target; // e.g., 'buyer', 'seller', 'ground_partner'
        }

        const users = await prisma.user.findMany({
            where,
            select: { id: true }
        });

        if (users.length === 0) {
            return res.json({ success: true, message: 'No users found for this target' });
        }

        // 2. Create notification records
        const notificationData = users.map(user => ({
            userId: user.id,
            type: 'system',
            title,
            message,
            link,
            priority: priority || 'medium',
            isRead: false
        }));

        await prisma.notification.createMany({
            data: notificationData
        });

        // 3. Emit via Socket.io if available
        const io = req.app.get('io');
        if (io) {
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

// Database Administration Controls (Refactored for Prisma/PostgreSQL)

export const exportDatabase = async (req: Request, res: Response) => {
    try {
        // Simple JSON export of main tables
        const backup: any = {
            users: await prisma.user.findMany(),
            properties: await prisma.property.findMany(),
            subscriptions: await prisma.subscription.findMany(),
            plans: await prisma.plan.findMany(),
            serviceProviders: await prisma.serviceProvider.findMany(),
            employeeProfiles: await prisma.employeeProfile.findMany()
        };

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

        // WARNING: This is a destructive operation!
        // For Prisma/PostgreSQL, we should be very careful.
        // This is a simplified implementation.
        
        await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
            // Delete in order to respect dependencies
            await tx.serviceProvider.deleteMany({});
            await tx.employeeProfile.deleteMany({});
            await tx.subscription.deleteMany({});
            await tx.property.deleteMany({});
            await tx.user.deleteMany({});
            await tx.plan.deleteMany({});

            // Re-insert
            if (backupData.plans) await tx.plan.createMany({ data: backupData.plans });
            if (backupData.users) await tx.user.createMany({ data: backupData.users });
            if (backupData.properties) await tx.property.createMany({ data: backupData.properties });
            if (backupData.subscriptions) await tx.subscription.createMany({ data: backupData.subscriptions });
            if (backupData.employeeProfiles) await tx.employeeProfile.createMany({ data: backupData.employeeProfiles });
            if (backupData.serviceProviders) await tx.serviceProvider.createMany({ data: backupData.serviceProviders });
        });

        res.json({ success: true, message: 'Database imported successfully' });
    } catch (error) {
        console.error('Error importing database:', error);
        res.status(500).json({ success: false, error: 'Failed to import database' });
    }
};

export const createBackup = async (req: Request, res: Response) => {
    try {
        const backup: any = {
            users: await prisma.user.findMany(),
            properties: await prisma.property.findMany(),
            subscriptions: await prisma.subscription.findMany(),
            plans: await prisma.plan.findMany()
        };

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
        
        await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
            // Destructive restore
            await tx.subscription.deleteMany({});
            await tx.property.deleteMany({});
            await tx.user.deleteMany({});
            await tx.plan.deleteMany({});

            if (backupData.plans) await tx.plan.createMany({ data: backupData.plans });
            if (backupData.users) await tx.user.createMany({ data: backupData.users });
            if (backupData.properties) await tx.property.createMany({ data: backupData.properties });
            if (backupData.subscriptions) await tx.subscription.createMany({ data: backupData.subscriptions });
        });

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
        const users = await prisma.user.findMany({
            where: {
                role: { in: ['buyer', 'seller'] }
            },
            orderBy: { createdAt: 'desc' }
        });
        res.json({ success: true, data: { users } });
    } catch (error) {
        console.error('Error fetching clients:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch clients' });
    }
};

export const deleteClient = async (req: Request, res: Response) => {
    try {
        const { id } = req.params; // Expecting user.uid

        const user = await prisma.user.findUnique({
            where: { uid: id }
        });
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

        await prisma.user.delete({
            where: { uid: id }
        });
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
        const totalUsers = await prisma.user.count({
            where: { role: { in: ['buyer', 'seller'] } }
        });
        const activeListings = await prisma.property.count({
            where: { status: 'active' }
        });
        const totalEmployees = await prisma.user.count({
            where: { role: 'employee' }
        });

        // 2. Revenue Calculation (Estimate based on Subscriptions)
        const allSubscriptions = await prisma.subscription.findMany({
            include: { plan: true }
        });
        const totalRevenue = allSubscriptions.reduce((sum: number, sub: any) => {
            return sum + (sub.plan.price ? Number(sub.plan.price) : 0);
        }, 0);

        // 3. Quick Stats (New Users & Revenue today)
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        const newUsersToday = await prisma.user.count({
            where: {
                role: { in: ['buyer', 'seller'] },
                createdAt: { gte: startOfDay }
            }
        });

        // Revenue today
        const newSubscriptionsToday = await prisma.subscription.findMany({
            where: { createdAt: { gte: startOfDay } },
            include: { plan: true }
        });
        const revenueToday = newSubscriptionsToday.reduce((sum: number, sub: any) => {
            return sum + (sub.plan.price ? Number(sub.plan.price) : 0);
        }, 0);

        // Pending Approvals (Properties pending)
        const pendingApprovals = await prisma.property.count({
            where: { status: 'pending' }
        });

        // 4. Recent Activities
        // Fetch last 5 users
        const recentUsers = await prisma.user.findMany({
            where: { role: { in: ['buyer', 'seller'] } },
            orderBy: { createdAt: 'desc' },
            take: 5,
            select: { id: true, name: true, role: true, createdAt: true }
        });

        // Fetch last 5 properties
        const recentProperties = await prisma.property.findMany({
            orderBy: { createdAt: 'desc' },
            take: 5,
            select: { id: true, title: true, propertyType: true, createdAt: true }
        });

        // Normalize and merge
        const activities = [
            ...recentUsers.map((u: any) => ({
                id: u.id,
                type: 'user',
                title: 'New User Registration',
                description: `${u.name} joined as ${u.role}`,
                time: u.createdAt,
                createdAt: u.createdAt
            })),
            ...recentProperties.map((p: any) => ({
                id: p.id,
                type: 'listing',
                title: 'New Property Listed',
                description: p.title,
                time: p.createdAt,
                createdAt: p.createdAt
            }))
        ]
            .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
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
        const properties = await prisma.property.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                seller: {
                    select: {
                        id: true,
                        uid: true,
                        name: true,
                        email: true,
                    },
                },
            },
        });
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

        const property = await prisma.property.update({
            where: { id },
            data: { status }
        });

        const sellerUserId = await resolveInternalUserId(property.sellerId);
        if (sellerUserId) {
            await prisma.notification.create({
                data: {
                    userId: sellerUserId,
                    type: 'listing_update',
                    title: `Listing Status Updated: ${status.toUpperCase()}`,
                    message: `Your listing "${property.title}" has been ${status} by admin.${reason ? ` Reason: ${reason}` : ''}`,
                    link: `/dashboard/listings/${property.id}`,
                    priority: 'medium'
                }
            });
        }

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
        const property = await prisma.property.update({
            where: { id },
            data: { status: 'deleted' }
        });

        const sellerUserId = await resolveInternalUserId(property.sellerId);
        if (sellerUserId) {
            await prisma.notification.create({
                data: {
                    userId: sellerUserId,
                    type: 'listing_update',
                    title: 'Listing Deleted by Admin',
                    message: `Your listing "${property.title}" has been deleted by admin.`,
                    priority: 'high'
                }
            });
        }

        res.json({ success: true, message: 'Property deleted successfully' });
    } catch (error) {
        console.error('Error deleting property:', error);
        res.status(500).json({ success: false, error: 'Failed to delete property' });
    }
};

export const getAllPayments = async (req: Request, res: Response) => {
    try {
        const payments = await PaymentTransaction.find({}).sort({ createdAt: -1 }).lean();

        const userUids = Array.from(
            new Set((payments || []).map((payment: any) => String(payment.userId || '')).filter(Boolean))
        );

        const users = userUids.length > 0
            ? await prisma.user.findMany({
                where: { uid: { in: userUids } },
                select: { uid: true, name: true, email: true, role: true },
            })
            : [];

        const userMap = new Map(users.map((user) => [user.uid, user]));

        const enrichedPayments = payments.map((payment: any) => ({
            ...payment,
            user: userMap.get(String(payment.userId)) || null,
        }));

        res.json({ success: true, data: { payments: enrichedPayments } });
    } catch (error) {
        console.error('Error fetching payments:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch payments' });
    }
};

export const getAllSubscriptions = async (req: Request, res: Response) => {
    try {
        const { status } = req.query;

        const subscriptions = await prisma.subscription.findMany({
            where: status ? { status: String(status) } : undefined,
            include: {
                user: {
                    select: {
                        id: true,
                        uid: true,
                        name: true,
                        email: true,
                        role: true,
                    },
                },
                plan: true,
            },
            orderBy: { createdAt: 'desc' },
        });

        res.json({ success: true, data: { subscriptions } });
    } catch (error) {
        console.error('Error fetching subscriptions:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch subscriptions' });
    }
};

export const updateSubscriptionStatus = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const allowedStatuses = ['active', 'expired', 'cancelled', 'paused'];
        if (!allowedStatuses.includes(String(status))) {
            return res.status(400).json({ success: false, error: 'Invalid subscription status' });
        }

        const subscription = await prisma.subscription.update({
            where: { id },
            data: { status: String(status) },
            include: {
                user: { select: { id: true, uid: true, name: true } },
                plan: { select: { name: true } },
            },
        });

        await prisma.notification.create({
            data: {
                userId: subscription.user.id,
                type: 'system',
                title: 'Subscription Status Updated',
                message: `Your ${subscription.plan.name} plan is now ${String(status).toUpperCase()}.`,
                priority: 'medium',
            },
        });

        res.json({ success: true, data: { subscription } });
    } catch (error) {
        console.error('Error updating subscription status:', error);
        res.status(500).json({ success: false, error: 'Failed to update subscription status' });
    }
};
