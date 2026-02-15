import { Request, Response } from 'express';
import { prisma } from '../utils/prisma';
import { sendEmail } from '../utils/email.service';

/**
 * Get user settings
 * GET /api/v1/settings
 */
export const getSettings = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.userId;
        if (!userId) {
            return res.status(401).json({ success: false, message: 'User not authenticated' });
        }

        let settings = await prisma.userSettings.findUnique({
            where: { userId }
        });

        // Create default settings if none exist
        if (!settings) {
            settings = await prisma.userSettings.create({
                data: {
                    userId
                }
            });
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
        const userId = (req as any).user?.userId;
        if (!userId) {
            return res.status(401).json({ success: false, message: 'User not authenticated' });
        }

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

        // Get user details for email notification
        const user = await prisma.user.findUnique({
            where: { uid: userId },
            select: { email: true, name: true }
        });

        // Send email notification if user has email
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
                            <a href="http://localhost:3000/dashboard/settings" 
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
