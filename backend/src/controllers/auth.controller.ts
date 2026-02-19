import { Request, Response } from 'express';
import { OAuth2Client } from 'google-auth-library';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { generateToken, verifyToken as jwtVerifyToken } from '../utils/jwt';
import { prisma } from '../utils/prisma';
import { getNextEmployeeId } from '../utils/idGenerator';
import config from '../config';
import { sendPasswordResetEmail } from '../utils/email.service';

// Initialize OAuth2 client
const client = new OAuth2Client({
    clientId: config.google.clientId,
    clientSecret: config.google.clientSecret,
});

const generateRandomHex = (): string => {
    return crypto.randomBytes(4).toString('hex').slice(0, 7);
};

const generateCustomId = (role: string): string => {
    const randomHex = generateRandomHex();
    let prefix = 'gbclient';

    if (role === 'employee') prefix = 'gbemployee';
    else if (role === 'legal_partner') prefix = 'gblegal';
    else if (role === 'service_partner') prefix = 'gbservice';
    else if (role === 'ground_partner') prefix = 'gbground';
    else if (role === 'promoter_partner') prefix = 'gbpromoter';

    return `${prefix}${randomHex}`;
};

// Helper function to check if email is admin
const isAdminEmail = (email: string): boolean => {
    const adminEmails = (process.env.ADMIN_EMAILS || '')
        .split(',')
        .map(e => e.trim().toLowerCase())
        .filter(e => e.length > 0);
    return adminEmails.includes(email.toLowerCase());
};

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, error: 'Email and password are required' });
        }

        // Find user by email
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            return res.status(401).json({ success: false, error: 'Invalid credentials' });
        }

        if (!user.password) {
            return res.status(401).json({
                success: false,
                error: 'This account uses Google Login. Please sign in with Google.'
            });
        }

        // Verify password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, error: 'Invalid credentials' });
        }

        // AUTO-PATCH: If user has a service provider profile but role is still 'buyer', update it
        // Fetch with profile to check
        const userWithProfile = await prisma.user.findUnique({
            where: { id: user.id },
            include: { serviceProviderProfile: true }
        });

        let finalRole = user.role;
        if (isAdminEmail(email) && user.role !== 'admin') {
            const updatedUser = await prisma.user.update({
                where: { id: user.id },
                data: { role: 'admin' }
            });
            finalRole = 'admin';
        } else if (user.role === 'buyer' && userWithProfile?.serviceProviderProfile) {
            console.log(`🔄 Auto-patching role for ${user.email} to service_partner`);
            await prisma.user.update({
                where: { id: user.id },
                data: { role: 'service_partner' }
            });
            finalRole = 'service_partner';
        }

        const userData = {
            uid: user.uid,
            email: user.email,
            displayName: user.name,
            role: finalRole,
            buyerClientId: user.buyerClientId,
            sellerClientId: user.sellerClientId,
            onboardingCompleted: user.onboardingCompleted
        };

        const token = generateToken({
            userId: userData.uid,
            email: userData.email,
            name: userData.displayName,
            role: finalRole,
            onboardingCompleted: user.onboardingCompleted
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

        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ success: false, error: 'Email already registered' });
        }

        const finalRole = isAdminEmail(email) ? 'admin' : role;
        const uid = generateCustomId(finalRole);
        const buyerClientId = `gbclient${generateRandomHex()}`;
        const sellerClientId = `gbclient${generateRandomHex()}`;

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user with profiles in transaction
        const result = await prisma.$transaction(async (tx: any) => {
            const user = await tx.user.create({
                data: {
                    uid,
                    email,
                    password: hashedPassword,
                    name: displayName,
                    role: finalRole as any,
                    buyerClientId,
                    sellerClientId,
                    onboardingCompleted: ['buyer', 'admin'].includes(finalRole) // Only buyers/admins skip onboarding
                }
            });

            // Create employee profile if needed
            if (finalRole === 'employee') {
                const employeeId = await getNextEmployeeId();
                await tx.employeeProfile.create({
                    data: {
                        userId: user.id,
                        employeeId: employeeId,
                        isActive: true
                    }
                });
                console.log(`👷 Professional Employee ID ${employeeId} assigned to ${email}`);
            }

            // Create default profiles
            await tx.buyerProfile.create({
                data: { userId: user.id }
            });
            await tx.sellerProfile.create({
                data: { userId: user.id }
            });

            return user;
        });

        const token = generateToken({
            userId: result.uid,
            email: result.email,
            name: result.name,
            role: result.role,
            onboardingCompleted: result.onboardingCompleted
        });

        res.status(201).json({
            success: true,
            data: {
                token,
                user: {
                    uid: result.uid,
                    email: result.email,
                    displayName: result.name,
                    role: result.role,
                    buyerClientId: result.buyerClientId,
                    sellerClientId: result.sellerClientId,
                    onboardingCompleted: result.onboardingCompleted
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

        // Fetch latest user data from DB to ensure onboarding status is up to date
        // Include serviceProviderProfile to catch existing partners with buyer role
        const user = await prisma.user.findUnique({
            where: { uid: decoded.userId },
            include: { serviceProviderProfile: true }
        });

        if (!user) {
            return res.status(404).json({ success: false, error: 'User no longer exists' });
        }

        // AUTO-PATCH: If user has a service provider profile but role is still 'buyer', update it
        let effectiveRole = user.role;
        if (user.role === 'buyer' && user.serviceProviderProfile) {
            console.log(`🔄 Auto-patching role for ${user.email} to service_partner`);
            await prisma.user.update({
                where: { id: user.id },
                data: { role: 'service_partner' }
            });
            effectiveRole = 'service_partner';
        }

        const userData = {
            uid: user.uid,
            email: user.email,
            displayName: user.name,
            role: effectiveRole,
            onboardingCompleted: user.onboardingCompleted
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

export const googleAuth = async (req: Request, res: Response) => {
    try {
        const code = req.query.code || req.body.code;
        const idToken = req.body.idToken;
        const requestedRole = (req.query.role as string) || (req.body.role as string) || 'buyer';

        let finalIdToken = idToken;

        if (code && !finalIdToken) {
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

        const userIsAdmin = isAdminEmail(email);
        const finalRole = userIsAdmin ? 'admin' : requestedRole;

        // Upsert user
        const uid = generateCustomId(finalRole);
        const buyerClientId = `gbclient${generateRandomHex()}`;
        const sellerClientId = `gbclient${generateRandomHex()}`;

        // Check if user has a service provider profile to auto-set role
        const existingUserWithProfile = await prisma.user.findUnique({
            where: { email },
            include: { serviceProviderProfile: true }
        });

        const user = await prisma.user.upsert({
            where: { email },
            update: {
                googleId,
                role: userIsAdmin ? 'admin' : (existingUserWithProfile?.serviceProviderProfile ? 'service_partner' : undefined)
            },
            create: {
                uid,
                email,
                name: name || email.split('@')[0],
                googleId,
                role: finalRole,
                buyerClientId,
                sellerClientId,
                onboardingCompleted: ['buyer', 'admin'].includes(finalRole) // Only buyers/admins skip onboarding
            }
        });

        const token = generateToken({
            userId: user.uid,
            email: user.email,
            name: user.name,
            role: user.role as any,
            onboardingCompleted: user.onboardingCompleted
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
        console.error('❌ Google OAuth error:', error?.message || error);
        res.status(500).json({
            success: false,
            error: error.message || 'Google authentication failed'
        });
    }
};

export const forgotPassword = async (req: Request, res: Response) => {
    try {
        const { email } = req.body;

        const user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
            return res.status(200).json({
                success: true,
                message: 'If an account exists with that email, a reset link has been sent.'
            });
        }

        const resetToken = crypto.randomBytes(32).toString('hex');
        const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');
        const expireDate = new Date(Date.now() + 3600000);

        await prisma.user.update({
            where: { id: user.id },
            data: {
                resetPasswordToken: hashedToken,
                resetPasswordExpires: expireDate
            }
        });

        try {
            await sendPasswordResetEmail(user.email, resetToken);
            res.status(200).json({ success: true, data: 'Email sent' });
        } catch (err) {
            await prisma.user.update({
                where: { id: user.id },
                data: {
                    resetPasswordToken: null,
                    resetPasswordExpires: null
                }
            });
            return res.status(500).json({ success: false, error: 'Email could not be sent' });
        }

    } catch (error) {
        console.error('❌ Forgot password error:', error);
        res.status(500).json({ success: false, error: 'Server error' });
    }
};

export const resetPassword = async (req: Request, res: Response) => {
    try {
        const { token, password } = req.body;

        if (!token || !password) {
            return res.status(400).json({ success: false, error: 'Token and password are required' });
        }

        const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

        const user = await prisma.user.findFirst({
            where: {
                resetPasswordToken: hashedToken,
                resetPasswordExpires: { gt: new Date() }
            }
        });

        if (!user) {
            return res.status(400).json({ success: false, error: 'Invalid or expired token' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        await prisma.user.update({
            where: { id: user.id },
            data: {
                password: hashedPassword,
                resetPasswordToken: null,
                resetPasswordExpires: null
            }
        });

        res.status(200).json({ success: true, data: 'Password reset successful' });

    } catch (error) {
        console.error('❌ Reset password error:', error);
        res.status(500).json({ success: false, error: 'Server error' });
    }
};
