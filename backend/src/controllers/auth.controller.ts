
import { Request, Response } from 'express';
import { generateToken, verifyToken as jwtVerifyToken } from '../utils/jwt';
import { isMongoDBAvailable } from '../utils/memoryStore';
import User from '../models/user.model';

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, error: 'Email and password are required' });
        }

        let userData;

        if (isMongoDBAvailable()) {
            console.log(`🔍 Looking up user in DB: ${email}`);
            // Try to find real user in DB
            const dbUser = await User.findOne({ email }).lean();
            if (dbUser) {
                console.log(`✅ Found user in DB: ${dbUser.name} (${dbUser.uid})`);
                userData = {
                    uid: dbUser.uid,
                    email: dbUser.email,
                    displayName: dbUser.name,
                    role: dbUser.role
                };
            } else {
                userData = {
                    uid: 'demo-buyer-id',
                    email,
                    displayName: email.split('@')[0],
                    role: email.includes('admin') ? 'admin' : email.includes('employee') ? 'employee' : 'buyer'
                };
            }
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
            name: userData.displayName,
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
// Helper to generate custom ID
const generateCustomId = (role: string): string => {
    const randomNum = Math.floor(Math.random() * 9000000) + 1000000; // 7 digit random number
    let prefix = 'gbclient';

    if (role === 'employee') prefix = 'gbemployee';
    else if (role === 'legal_partner') prefix = 'gblegal';
    else if (role === 'ground_partner') prefix = 'gbground';
    else if (role === 'promoter_partner') prefix = 'gbpromoter';

    // Default or buyer/seller -> gbclient
    return `${prefix}${randomNum}`;
};

export const register = async (req: Request, res: Response) => {
    try {
        const { email, password, displayName, role = 'buyer' } = req.body;

        if (!email || !password || !displayName) {
            return res.status(400).json({ success: false, error: 'Missing required fields' });
        }

        // Check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, error: 'Email already registered' });
        }

        const uid = generateCustomId(role);

        // Create new user
        const newUser = new User({
            uid,
            email,
            name: displayName,
            role,
            // Default stats will be handled by schema defaults
        });

        // Save to DB
        if (isMongoDBAvailable()) {
            await newUser.save();
            console.log(`✅ User registered and saved to DB: ${displayName} (${uid})`);
        } else {
            console.log(`⚠️ MongoDB not available, skipping save for: ${displayName} (${uid})`);
        }

        const token = generateToken({
            userId: newUser.uid,
            email: newUser.email,
            name: newUser.name,
            role: newUser.role
        });

        res.status(201).json({
            success: true,
            data: {
                token,
                user: {
                    uid: newUser.uid,
                    email: newUser.email,
                    displayName: newUser.name,
                    role: newUser.role
                }
            }
        });

    } catch (error: any) {
        console.error('❌ Registration error:', error);
        res.status(500).json({ success: false, error: error.message || 'Registration failed' });
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
            displayName: decoded.name || decoded.email?.split('@')[0] || 'User',
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

/**
 * Google OAuth Handler
 * Accepts authorization code and returns token
 * Mock implementation for local development
 */
export const googleAuth = async (req: Request, res: Response) => {
    try {
        const code = req.query.code || req.body.code;

        if (!code) {
            return res.status(400).json({ 
                success: false, 
                error: 'Authorization code is required' 
            });
        }

        console.log(`🔐 Google OAuth request with code: ${String(code).substring(0, 20)}...`);

        // Mock: Extract user info from Google
        // In production, you'd exchange the code for tokens via Google's OAuth API
        // For now, create a user based on the code
        const mockEmail = `google_${Date.now()}@gmail.com`;
        const userData = {
            uid: `google-${Date.now()}`,
            email: mockEmail,
            displayName: mockEmail.split('@')[0],
            role: 'buyer'
        };

        const token = generateToken({
            userId: userData.uid,
            email: userData.email,
            name: userData.displayName,
            role: userData.role
        });

        console.log(`✅ Google OAuth successful for: ${userData.email}${!isMongoDBAvailable() ? ' (Memory Mode)' : ''}`);

        res.json({
            success: true,
            token,
            data: {
                token,
                user: userData
            }
        });

    } catch (error) {
        console.error('❌ Google OAuth error:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Google authentication failed' 
        });
    }
};
