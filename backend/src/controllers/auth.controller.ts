
import { Request, Response } from 'express';
import { generateToken, verifyToken as jwtVerifyToken } from '../utils/jwt';
import { isMongoDBAvailable } from '../utils/memoryStore';
export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, error: 'Email and password are required' });
        }

        let userData;

        if (isMongoDBAvailable()) {
            userData = {
                uid: 'demo-buyer-id',
                email,
                displayName: email.split('@')[0],
                role: email.includes('admin') ? 'admin' : email.includes('employee') ? 'employee' : 'buyer'
            };
        } else {
            // Mock authentication - accept any password for testing
            userData = {
                uid: email === 'buyer@demo.com' ? 'demo-buyer-id' : 'demo-user-id',
                email,
                displayName: email.split('@')[0],
                role: email.includes('admin') ? 'admin' : email.includes('employee') ? 'employee' : 'buyer'
            };
        }
        const token = generateToken({
            userId: userData.uid,
            email: userData.email,
            role: userData.role
        });

        console.log(`✅ Login successful for: ${email}${!isMongoDBAvailable() ? ' (Memory Mode)' : ''}`);

        res.json({
            success: true,
            data: {
                token,
                user: userData
            }
        });

    } catch (error) {
        console.error('❌ Login error:', error);
        res.status(500).json({ success: false, error: 'Login failed' });
    }
};
export const register = async (req: Request, res: Response) => {
    try {
        const { email, password, displayName, role = 'buyer' } = req.body;

        if (!email || !password || !displayName) {
            return res.status(400).json({ success: false, error: 'Missing required fields' });
        }

        const userData = {
            uid: `user-${Date.now()}`,
            email,
            displayName,
            role
        };

        const token = generateToken({
            userId: userData.uid,
            email: userData.email,
            role: userData.role
        });

        console.log(`✅ Registration successful for: ${email}${!isMongoDBAvailable() ? ' (Memory Mode)' : ''}`);

        res.status(201).json({
            success: true,
            data: {
                token,
                user: userData
            }
        });

    } catch (error) {
        console.error('❌ Registration error:', error);
        res.status(500).json({ success: false, error: 'Registration failed' });
    }
};
export const verifyToken = async (req: Request, res: Response) => {
    try {
        const { token } = req.body;

        if (!token) {
            return res.status(400).json({ success: false, error: 'Token is required' });
        }

        const decoded = jwtVerifyToken(token);

        if (!decoded) {
            return res.status(401).json({ success: false, error: 'Invalid or expired token' });
        }

        const userData = {
            uid: decoded.userId,
            email: decoded.email,
            displayName: decoded.email?.split('@')[0] || 'User',
            role: decoded.role || 'buyer'
        };

        res.json({
            success: true,
            data: {
                user: userData
            }
        });

    } catch (error) {
        console.error('❌ Token verification error:', error);
        res.status(401).json({ success: false, error: 'Verification failed' });
    }
};
export const logout = async (req: Request, res: Response) => {
    res.json({ success: true, message: 'Logged out successfully' });
};

