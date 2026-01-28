
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

        // Bypass for demo mode in development
        if (token === 'demo-token') {
            (req as any).user = {
                userId: 'demo-buyer',
                role: 'buyer',
                email: 'demo@gharbazaar.in'
            };
            return next();
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

