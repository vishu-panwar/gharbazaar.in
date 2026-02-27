import { Request, Response } from 'express';
import { prisma } from '../utils/prisma';
import { sendEmail } from '../utils/email.service';
import config from '../config';

/**
 * Get user settings
 * GET /api/v1/settings
 */
export const getSettings = async (req: Request, res: Response) => {
    try {
        const userUid = (req as any).user?.userId;
        if (!userUid) {
            return res.status(401).json({ success: false, message: 'User not authenticated' });
        }

        // First check if user exists and get their ID
        const user = await prisma.user.findUnique({
            where: { uid: userUid },
            select: { id: true }
        });

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Use the user's actual ID (not uid) for UserSettings
        const userId = user.id;

        let settings = await prisma.userSettings.findUnique({
            where: { userId }
        });

        // Create default settings if none exist
        if (!settings) {
            try {
                settings = await prisma.userSettings.create({
                    data: {
                        userId
                    }
                });
            } catch (error: any) {
                // If creation fails (e.g., race condition), try to fetch again
                console.error('Error creating settings, attempting to fetch:', error);
                settings = await prisma.userSettings.findUnique({
                    where: { userId }
                });
                
                // If still no settings, return default values without saving
                if (!settings) {
                    return res.json({
                        success: true,
                        data: {
                            id: null,
                            userId,
                            theme: 'system',
                            language: 'en',
                            currency: 'INR',
                            timezone: 'Asia/Kolkata',
                            emailFrequency: 'realtime',
                            notificationPreferences: {
                                push: true,
                                email: true,
                                sms: false
                            }
                        }
                    });
                }
            }
        }

        res.json({ success: true, data: settings });
    } catch (error: any) {
        console.error('getSettings error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch settings', error: error.message });
    }
};

/**
 * Update user settings
 * PUT /api/v1/settings
 */
export const updateSettings = async (req: Request, res: Response) => {
    try {
        const userUid = (req as any).user?.userId;
        if (!userUid) {
            return res.status(401).json({ success: false, message: 'User not authenticated' });
        }

        // Get user by uid and retrieve their actual ID
        const user = await prisma.user.findUnique({
            where: { uid: userUid },
            select: { id: true, email: true, name: true }
        });

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const userId = user.id;

        const {
            theme,
            language,
            currency,
            timezone,
            emailFrequency,
            notificationPreferences
        } = req.body;

        // Build update data object (only include provided fields)
        const updateData: any = {};
        if (theme !== undefined) updateData.theme = theme;
        if (language !== undefined) updateData.language = language;
        if (currency !== undefined) updateData.currency = currency;
        if (timezone !== undefined) updateData.timezone = timezone;
        if (emailFrequency !== undefined) updateData.emailFrequency = emailFrequency;
        if (notificationPreferences !== undefined) updateData.notificationPreferences = notificationPreferences;

        // Upsert settings
        const settings = await prisma.userSettings.upsert({
            where: { userId },
            update: updateData,
            create: {
                userId,
                ...updateData
            }
        });

        // Send email notification if user has email (user already fetched above)
        if (user?.email) {
            const changedFields = Object.keys(updateData)
                .map(key => `${key}: ${JSON.stringify(updateData[key])}`)
                .join('\n');

            const userName = user.name || 'User';

            await sendEmail({
                email: user.email,
                subject: 'Settings Updated - GharBazaar',
                message: `Settings updated: ${changedFields}`,
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <h2 style="color: #10b981;">Settings Updated Successfully</h2>
                        <p>Hi ${userName},</p>
                        <p>Your account settings have been updated:</p>
                        <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
                            <pre style="margin: 0; font-size: 14px;">${changedFields}</pre>
                        </div>
                        <p>If you didn't make these changes, please contact support immediately.</p>
                        <p style="margin-top: 30px;">
                            <a href="${config.frontendUrl}/dashboard/settings" 
                               style="background: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">
                                Review Settings
                            </a>
                        </p>
                        <p style="color: #6b7280; font-size: 12px; margin-top: 30px;">
                            © ${new Date().getFullYear()} GharBazaar. All rights reserved.
                        </p>
                    </div>
                `
            }).catch((emailError) => {
                console.error('Failed to send settings update email:', emailError);
                // Don't fail the request if email fails
            });
        }

        res.json({ success: true, data: settings });
    } catch (error: any) {
        console.error('updateSettings error:', error);
        res.status(500).json({ success: false, message: 'Failed to update settings', error: error.message });
    }
};
