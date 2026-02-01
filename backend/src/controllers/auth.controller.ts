
import { Request, Response } from 'express';
import { OAuth2Client } from 'google-auth-library';
import crypto from 'crypto';
import { generateToken, verifyToken as jwtVerifyToken } from '../utils/jwt';
import { isMongoDBAvailable } from '../utils/memoryStore';
import User from '../models/user.model';
import EmployeeProfile from '../models/employeeProfile.model';
import { getNextEmployeeId } from '../utils/idGenerator';
import config from '../config';
import { sendPasswordResetEmail } from '../utils/email.service';

const client = new OAuth2Client(config.google.clientId);

// Helper to generate random hex string of 7 chars
const generateRandomHex = (): string => {
    return crypto.randomBytes(4).toString('hex').slice(0, 7);
};

// Helper to generate custom ID
const generateCustomId = (role: string): string => {
    const randomHex = generateRandomHex();
    let prefix = 'gbclient';

    if (role === 'employee') prefix = 'gbemployee';
    else if (role === 'legal_partner') prefix = 'gblegal';
    else if (role === 'ground_partner') prefix = 'gbground';
    else if (role === 'promoter_partner') prefix = 'gbpromoter';

    return `${prefix}${randomHex}`;
};

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, error: 'Email and password are required' });
        }

        // Find user by email
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ success: false, error: 'Invalid credentials' });
        }

        // Check if user has a password (might be an OAuth-only user)
        if (!user.password) {
            return res.status(401).json({
                success: false,
                error: 'This account uses Google Login. Please sign in with Google.'
            });
        }

        // Verify password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ success: false, error: 'Invalid credentials' });
        }

        // Force admin role if applicable
        if (email.toLowerCase() === 'adityaprajapati1234567@gmail.com' && user.role !== 'admin') {
            user.role = 'admin';
            await user.save();
        }

        const userData = {
            uid: user.uid,
            email: user.email,
            displayName: user.name,
            role: user.role,
            buyerClientId: user.buyerClientId,
            sellerClientId: user.sellerClientId,
            onboardingCompleted: user.onboardingCompleted
        };

        const token = generateToken({
            userId: userData.uid,
            email: userData.email,
            name: userData.displayName,
            role: userData.role
        });

        res.json({
            success: true,
            data: {
                token,
                user: userData
            }
        });

    } catch (error) {
        console.error('❌ Login error:', error);
        res.status(500).json({ success: false, error: 'Server error during login' });
    }
};

export const signup = async (req: Request, res: Response) => {
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

        const finalRole = email.toLowerCase() === 'adityaprajapati1234567@gmail.com' ? 'admin' : role;
        const uid = generateCustomId(finalRole);
        const buyerClientId = `gbclient${generateRandomHex()}`;
        const sellerClientId = `gbclient${generateRandomHex()}`;


        // Create new user
        const newUser = new User({
            uid,
            email,
            password, // Will be hashed by pre-save hook
            name: displayName,
            role: finalRole,
            buyerClientId,
            sellerClientId
        });

        await newUser.save();

        // If employee, create professional ID and profile
        if (role === 'employee') {
            try {
                const employeeId = await getNextEmployeeId();
                const profile = new EmployeeProfile({
                    userId: newUser.uid,
                    employeeId: employeeId
                });
                await profile.save();

                // Update user with professional ID if needed, 
                // but user.uid is already the lookup key. 
                // We'll keep user.uid as is for auth, but the profile carries the professional ID.
                console.log(`👷 Professional Employee ID ${employeeId} assigned to ${email}`);
            } catch (err) {
                console.error('⚠️ Failed to create employee profile:', err);
            }
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
                    role: newUser.role,
                    buyerClientId: newUser.buyerClientId,
                    sellerClientId: newUser.sellerClientId,
                    onboardingCompleted: newUser.onboardingCompleted
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
            role: decoded.role || 'buyer',
            onboardingCompleted: decoded.onboardingCompleted || false
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
 * Accepts authorization code or ID token and logs in user
 */
export const googleAuth = async (req: Request, res: Response) => {
    try {
        const code = req.query.code || req.body.code;
        const idToken = req.body.idToken;
        const requestedRole = (req.query.role as string) || (req.body.role as string) || 'buyer';

        let finalIdToken = idToken;

        // If we have a code, exchange it for tokens
        if (code && !finalIdToken) {
            console.log(`🔐 Exchanging Google code for tokens...`);
            // Note: redirect_uri must match EXACTLY what was sent to Google from frontend
            const redirectUri = `${config.frontendUrl}/auth/google/callback`;
            const { tokens } = await client.getToken({
                code: String(code),
                redirect_uri: redirectUri
            });
            finalIdToken = tokens.id_token;
        }

        if (!finalIdToken) {
            return res.status(400).json({
                success: false,
                error: 'Google ID Token or code is required'
            });
        }

        // Verify Google token
        const ticket = await client.verifyIdToken({
            idToken: finalIdToken,
            audience: config.google.clientId,
        });

        const payload = ticket.getPayload();
        if (!payload) {
            return res.status(400).json({ success: false, error: 'Invalid Google token' });
        }

        const { sub: googleId, email, name, picture } = payload;

        if (!email) {
            return res.status(400).json({ success: false, error: 'Email not provided by Google' });
        }

        const isAdminEmail = email.toLowerCase() === 'adityaprajapati1234567@gmail.com';
        const finalRole = isAdminEmail ? 'admin' : requestedRole;

        // Find or create user
        let user = await User.findOne({ email });

        if (!user) {
            const uid = generateCustomId(finalRole);
            const buyerClientId = `gbclient${generateRandomHex()}`;
            const sellerClientId = `gbclient${generateRandomHex()}`;

            user = new User({
                uid,
                email,
                name: name || email.split('@')[0],
                googleId,
                role: finalRole,
                buyerClientId,
                sellerClientId,
                onboardingCompleted: finalRole !== 'employee' // Employees need onboarding
            });
            await user.save();
        } else {
            let modified = false;
            if (!user.googleId) {
                user.googleId = googleId;
                modified = true;
            }
            if (isAdminEmail && user.role !== 'admin') {
                user.role = 'admin';
                modified = true;
            }
            if (modified) await user.save();
        }

        const token = generateToken({
            userId: user.uid,
            email: user.email,
            name: user.name,
            role: user.role
        });

        res.json({
            success: true,
            data: {
                token,
                user: {
                    uid: user.uid,
                    email: user.email,
                    displayName: user.name,
                    role: user.role,
                    photoURL: picture,
                    buyerClientId: user.buyerClientId,
                    sellerClientId: user.sellerClientId,
                    onboardingCompleted: user.onboardingCompleted
                }
            }
        });

    } catch (error: any) {
        console.error('❌ Google OAuth error:', error);
        res.status(500).json({
            success: false,
            error: error.message || 'Google authentication failed'
        });
    }
};

/**
 * Forgot Password
 * Generates reset token and sends email
 */
export const forgotPassword = async (req: Request, res: Response) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            // Don't reveal if user exists or not for security, but we'll be helpful in dev
            return res.status(200).json({
                success: true,
                message: 'If an account exists with that email, a reset link has been sent.'
            });
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(32).toString('hex');

        // Hash token and set to user field
        user.resetPasswordToken = crypto
            .createHash('sha256')
            .update(resetToken)
            .digest('hex');

        // Set expire (1 hour)
        user.resetPasswordExpires = new Date(Date.now() + 3600000);

        await user.save();

        try {
            await sendPasswordResetEmail(user.email, resetToken);
            res.status(200).json({ success: true, data: 'Email sent' });
        } catch (err) {
            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;
            await user.save();

            return res.status(500).json({ success: false, error: 'Email could not be sent' });
        }

    } catch (error) {
        console.error('❌ Forgot password error:', error);
        res.status(500).json({ success: false, error: 'Server error' });
    }
};

/**
 * Reset Password
 * Verifies reset token and updates password
 */
export const resetPassword = async (req: Request, res: Response) => {
    try {
        const { token, password } = req.body;

        if (!token || !password) {
            return res.status(400).json({ success: false, error: 'Token and password are required' });
        }

        // Get hashed token
        const resetPasswordToken = crypto
            .createHash('sha256')
            .update(token)
            .digest('hex');

        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ success: false, error: 'Invalid or expired token' });
        }

        // Set new password
        user.password = password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        await user.save();

        res.status(200).json({ success: true, data: 'Password reset successful' });

    } catch (error) {
        console.error('❌ Reset password error:', error);
        res.status(500).json({ success: false, error: 'Server error' });
    }
};
