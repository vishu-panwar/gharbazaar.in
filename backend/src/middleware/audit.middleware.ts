import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import AuditLog from '../models/auditLog.model';

export const auditMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const method = req.method.toUpperCase();
    const shouldLog = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method);

    if (!shouldLog) {
        return next();
    }

    res.on('finish', async () => {
        try {
            const user = (req as any).user || {};
            const log = {
                userId: user.userId,
                role: user.role,
                method,
                path: req.originalUrl,
                status: res.statusCode,
                ip: req.ip,
                userAgent: req.headers['user-agent']
            };

            if (mongoose.connection.readyState === 1) {
                await AuditLog.create(log);
            } else {
                console.log('🧾 AuditLog (memory mode):', log);
            }
        } catch (error) {
            console.warn('Audit log failed:', (error as Error).message);
        }
    });

    next();
};
