import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';
import config from '../config';

interface EmailData {
    username: string;
    userEmail: string;
    phone: string;
    subject: string;
    message: string;
    submittedAt: string;
    submissionId: string;
}

class EmailService {
    private transporter: nodemailer.Transporter | null = null;

    constructor() {
        this.initialize();
    }

    private initialize() {
        try {
            // Check if SMTP credentials are configured
            const smtpHost = process.env.SMTP_HOST;
            const smtpPort = process.env.SMTP_PORT;
            const smtpUser = process.env.SMTP_USER;
            const smtpPass = process.env.SMTP_PASS;

            if (!smtpHost || !smtpUser || !smtpPass) {
                console.warn('⚠️  SMTP credentials not configured. Email service will not send emails.');
                return;
            }

            this.transporter = nodemailer.createTransport({
                host: smtpHost,
                port: parseInt(smtpPort || '587'),
                secure: parseInt(smtpPort || '587') === 465, // true for 465, false for other ports
                auth: {
                    user: smtpUser,
                    pass: smtpPass,
                },
            });

            console.log('✅ Email service initialized successfully');
        } catch (error) {
            console.error('❌ Failed to initialize email service:', error);
        }
    }

    /**
     * Load HTML template from file and replace placeholders with data
     */
    private loadTemplate(templateName: string, data: EmailData): string {
        try {
            const templatePath = path.join(__dirname, '../../templates', templateName);
            let template = fs.readFileSync(templatePath, 'utf-8');

            // Replace all placeholders
            template = template
                .replace(/\$\{username\}/g, data.username)
                .replace(/\$\{userEmail\}/g, data.userEmail)
                .replace(/\$\{phone\}/g, data.phone || 'Not provided')
                .replace(/\$\{subject\}/g, data.subject)
                .replace(/\$\{message\}/g, data.message)
                .replace(/\$\{submittedAt\}/g, data.submittedAt)
                .replace(/\$\{submissionId\}/g, data.submissionId);

            return template;
        } catch (error) {
            console.error(`❌ Failed to load template ${templateName}:`, error);
            throw new Error(`Failed to load email template: ${templateName}`);
        }
    }

    /**
     * Send contact form confirmation email to user
     */
    async sendUserConfirmation(data: EmailData): Promise<void> {
        if (!this.transporter) {
            console.warn('⚠️  Email service not configured. Skipping user confirmation email.');
            return;
        }

        try {
            const htmlContent = this.loadTemplate('contact-form-user-confirmation.html', data);

            await this.transporter.sendMail({
                from: `"GharBazaar Support" <${process.env.SMTP_USER}>`,
                to: data.userEmail,
                subject: 'Thank You for Contacting GharBazaar',
                html: htmlContent,
            });

            console.log(`✅ User confirmation email sent to ${data.userEmail}`);
        } catch (error) {
            console.error('❌ Failed to send user confirmation email:', error);
            throw error;
        }
    }

    /**
     * Send contact form notification email to admin
     */
    async sendAdminNotification(data: EmailData): Promise<void> {
        if (!this.transporter) {
            console.warn('⚠️  Email service not configured. Skipping admin notification email.');
            return;
        }

        try {
            const adminEmail = process.env.ADMIN_EMAIL || 'admin@gharbazaar.in';
            const htmlContent = this.loadTemplate('contact-form-admin-notification.html', data);

            await this.transporter.sendMail({
                from: `"GharBazaar Contact Form" <${process.env.SMTP_USER}>`,
                to: adminEmail,
                subject: `New Contact Form Submission - ${data.subject}`,
                html: htmlContent,
                replyTo: data.userEmail,
            });

            console.log(`✅ Admin notification email sent to ${adminEmail}`);
        } catch (error) {
            console.error('❌ Failed to send admin notification email:', error);
            throw error;
        }
    }

    /**
     * Send both user confirmation and admin notification emails
     */
    async sendContactFormEmails(data: EmailData): Promise<void> {
        const errors: Error[] = [];

        try {
            await this.sendUserConfirmation(data);
        } catch (error) {
            errors.push(error as Error);
        }

        try {
            await this.sendAdminNotification(data);
        } catch (error) {
            errors.push(error as Error);
        }

        if (errors.length > 0) {
            console.error(`⚠️  ${errors.length} email(s) failed to send`);
            // Don't throw error if at least one email was sent
            if (errors.length === 2) {
                throw new Error('Failed to send both confirmation and notification emails');
            }
        }
    }
}

// Export singleton instance
export const emailService = new EmailService();
