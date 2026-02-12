import nodemailer from 'nodemailer';
import config from '../config';
import logger from './logger'; // Using centralized logger

export const sendEmail = async (options: {
    email: string;
    subject: string;
    message: string;
    html?: string;
    replyTo?: string;
}) => {
    try {
        // Create a transporter
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST || 'smtp.zoho.in',
            port: parseInt(process.env.SMTP_PORT || '587'),
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });

        // Define email options
        const mailOptions = {
            from: `"${config.appName}" <${process.env.SMTP_USER}>`,
            to: options.email,
            subject: options.subject,
            text: options.message,
            html: options.html,
            replyTo: options.replyTo
        };

        // Send the email
        const info = await transporter.sendMail(mailOptions);
        logger.info(`✅ Email successfully delivered: ${info.messageId}`);
        return info;
    } catch (error: any) {
        // LOG LOUDLY SO USER SEES IT IN DEV
        console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.error('❌ EMAIL SENDING FAILED!');
        console.error(`Error: ${error.message}`);
        if (error.code) console.error(`Code: ${error.code}`);
        if (error.command) console.error(`Command: ${error.command}`);
        console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        
        logger.error(`Error sending email: ${error.message}`);
        
        // In development, we still return null to avoid crashing the whole process, 
        // but we don't throw away the error's visibility.
        if (process.env.NODE_ENV === 'development') {
            return null;
        } else {
            throw error;
        }
    }
};

export const sendPasswordResetEmail = async (email: string, resetToken: string) => {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password`;

    const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a put request to: \n\n ${resetUrl} with token: ${resetToken}`;

    const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
            <h2 style="color: #333; text-align: center;">GharBazaar Password Reset</h2>
            <p>You requested a password reset for your GharBazaar account.</p>
            <p>Please use the token below to reset your password. This link is valid for 1 hour.</p>
            <div style="text-align: center; margin: 30px 0;">
                <div style="display: inline-block; background-color: #f3f4f6; padding: 12px 24px; border-radius: 6px; font-family: monospace; font-size: 18px; letter-spacing: 2px; color: #0d9488; font-weight: bold;">
                    ${resetToken}
                </div>
            </div>
            <p>Alternatively, click the button below to go to the reset page:</p>
            <div style="text-align: center; margin: 30px 0;">
                <a href="${resetUrl}?token=${resetToken}" style="background-color: #0d9488; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">Reset Password</a>
            </div>
            <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
            <p style="font-size: 12px; color: #666; text-align: center;">&copy; 2026 GharBazaar. All rights reserved.</p>
        </div>
    `;

    return sendEmail({
        email,
        subject: 'Password Reset Request - GharBazaar',
        message,
        html,
    });
};

/**
 * Send contact form emails to both admin and user
 */
export const sendContactFormEmails = async (data: any) => {
    const fs = await import('fs');
    const path = await import('path');

    // Determine template paths
    const userTemplatePath = path.join(process.cwd(), 'src/templates/emails/contact-form-user.html');
    const adminTemplatePath = path.join(process.cwd(), 'src/templates/emails/contact-form-admin.html');

    let userHtml = '';
    let adminHtml = '';

    try {
        userHtml = fs.readFileSync(userTemplatePath, 'utf8');
        adminHtml = fs.readFileSync(adminTemplatePath, 'utf8');
    } catch (error) {
        console.warn('⚠️  Could not load high-fidelity email templates, falling back to basic layout:', error);
    }

    const replacePlaceholders = (template: string, data: any) => {
        let result = template;
        for (const [key, value] of Object.entries(data)) {
            const placeholder = `\${${key}}`;
            result = result.split(placeholder).join(String(value));
        }
        return result;
    };

    const commonData = {
        userName: data.username,
        userEmail: data.userEmail,
        phone: data.phone,
        subject: data.subject,
        message: data.message,
        referenceId: data.submissionId,
        submittedAt: data.submittedAt,
        currentYear: new Date().getFullYear(),
        userPhone: data.phone, // template uses userPhone
        priority: 'Normal',
        ipAddress: 'N/A',
        userAgent: 'Browser/Web',
        sourcePage: 'Contact Form',
        todayCount: '1',
        weekCount: '1',
        pendingCount: '1'
    };

    // Check for placeholder credentials to help user debug
    if (!process.env.SMTP_PASS || process.env.SMTP_PASS === 'replace_with_app_password') {
        logger.warn('⚠️ SMTP_PASS is using a placeholder. Emails will likely fail.');
    }

    // 1. Prepare Admin Email
    const adminEmailContent = adminHtml
        ? replacePlaceholders(adminHtml, commonData)
        : `<h2>New Inquiry from ${data.username}</h2><p>${data.message}</p>`;

    const adminMailOptions = {
        email: config.adminEmail,
        subject: `New Contact Submission: ${data.subject} [${data.submissionId}]`,
        message: `From: ${data.username} (${data.userEmail})\nPhone: ${data.phone}\nMessage: ${data.message}`,
        html: adminEmailContent,
        replyTo: data.userEmail
    };

    // 2. Prepare User Email
    const userEmailContent = userHtml
        ? replacePlaceholders(userHtml, commonData)
        : `<h2>Hi ${data.username}</h2><p>We've received your message regarding "${data.subject}".</p>`;

    const userMailOptions = {
        email: data.userEmail,
        subject: `We've received your message - GharBazaar [${data.submissionId}]`,
        message: `Hi ${data.username},\n\nThank you for reaching out. We have received your message and will get back to you shortly.`,
        html: userEmailContent
    };

    // 3. Send both in parallel (allSettled ensures both are attempted)
    logger.info(`📧 Attempting to send dual contact emails to: Admin(${config.adminEmail}) and Client(${data.userEmail})`);
    
    const results = await Promise.allSettled([
        sendEmail(adminMailOptions as any),
        sendEmail(userMailOptions)
    ]);

    results.forEach((result, index) => {
        const type = index === 0 ? 'Admin' : 'Client';
        const target = index === 0 ? config.adminEmail : data.userEmail;
        
        if (result.status === 'fulfilled') {
            logger.info(`✅ ${type} email delivered successfully to ${target}`);
        } else {
            logger.error(`❌ ${type} email FAILED for ${target}: ${result.reason?.message || 'Unknown error'}`);
        }
    });
};

// Export as object for backward compatibility with existing controllers
export const emailService = {
    sendEmail,
    sendPasswordResetEmail,
    sendContactFormEmails
};
