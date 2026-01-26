
import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';
export const authenticateRequest = async (
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

