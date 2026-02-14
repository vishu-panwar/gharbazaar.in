
import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';

export const authenticate = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                error: 'No token provided. Please login.'
            });
        }
        const token = authHeader.substring(7);

        // Support formatted demo tokens: demo-token:role:userId
        if (token.startsWith('demo-token')) {
            if (process.env.NODE_ENV === 'development') {
                const parts = token.split(':');
                const role = parts[1] || 'buyer';
                const userId = parts[2] || 'demo-user';
                
                (req as any).user = {
                    userId: userId,
                    role: role,
                    email: `${role}@demo.com`
                };
                return next();
            } else {
                return res.status(401).json({
                    success: false,
                    error: 'Demo mode not available in production.'
                });
            }
        }

        const decoded = verifyToken(token);
        (req as any).user = decoded;
        next();

    } catch (error) {
        return res.status(401).json({
            success: false,
            error: 'Invalid or expired token. Please login again.'
        });
    }
};

export const authenticateRequest = authenticate;
export const authenticateUser = authenticate;

export const authorizeRoles = (...roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const user = (req as any).user;
        if (!user || !roles.includes(user.role)) {
            return res.status(403).json({
                success: false,
                error: 'Access denied. Unauthorized role.'
            });
        }
        next();
    };
};

