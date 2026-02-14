import { Request, Response, NextFunction } from 'express';
import { prisma } from '../utils/database';

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
                userId: user.userId || null,
                role: user.role || null,
                method,
                path: req.originalUrl,
                status: res.statusCode,
                ipAddress: req.ip,
                userAgent: req.headers['user-agent'] || null
            };

            await prisma.auditLog.create({
                data: log
            });
        } catch (error) {
            console.warn('Audit log failed:', (error as Error).message);
        }
    });

    next();
};
