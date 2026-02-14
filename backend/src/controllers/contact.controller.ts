import { Request, Response } from 'express';
import { prisma } from '../utils/prisma';
import { emailService } from '../utils/email.service';

const generateReferenceId = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let randomPart = '';
    for (let i = 0; i < 6; i++) {
        randomPart += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return `CF-${randomPart}`;
};

const formatSubmittedAt = (date: Date) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const year = date.getFullYear();
    const month = months[date.getMonth()];
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year} ${month} ${day} ${hours}:${minutes}`;
};

/**
 * Handle contact form submission
 * POST /api/v1/contact/send
 */
export const sendContactForm = async (req: Request, res: Response) => {
    try {
        const { name, email, phone, subject, message } = req.body;

        // 1. Basic Validation
        if (!name || !email || !subject || !message) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields',
            });
        }

        // 2. Prepare Data
        const now = new Date();
        const referenceId = generateReferenceId();
        const submittedAt = formatSubmittedAt(now);
        
        // Counter logic for legacy sequence ID (if needed, mainly for reference)
        // We'll use Prisma to manage the counter if strictly required, or just rely on UUIDs for main IDs
        // For 'sequenceId' in the response, we can maintain the counter logic with Prisma
        
        let sequenceId = Math.floor(Math.random() * 1000) + 1000; // Fallback

        const emailData = {
            username: name,
            userEmail: email,
            phone: phone || 'Not provided',
            subject,
            message,
            submittedAt,
            submissionId: referenceId,
        };

        console.log(`📡 Processing contact submission for: ${email}`);

        // 3. SEND REAL EMAILS IMMEDIATELY
        try {
            await emailService.sendContactFormEmails(emailData);
            console.log(`✅ Real emails sent successfully for submission ${referenceId}`);
        } catch (emailError: any) {
            console.error('❌ Email sending failed:', emailError.message);
        }

        // 4. Record to Database (Using Prisma)
        try {
            // Update counter for readable ID
            const counter = await prisma.counter.upsert({
                where: { id: 'contact_id' },
                update: { seq: { increment: 1 } },
                create: { id: 'contact_id', seq: 1000 },
            });
            sequenceId = counter.seq;

            // Save submission
            await prisma.contact.create({
                data: {
                    name,
                    email,
                    phone,
                    subject,
                    message,
                    referenceId,
                    // Prisma handles createdAt/updatedAt automatically
                    submittedAt: now 
                }
            });
            console.log(`📝 Submission recorded in database with Sequence ID: ${sequenceId}`);
        } catch (dbError) {
            console.warn('⚠️  Database save failed:', dbError);
        }

        // 5. Return Success
        return res.status(201).json({
            id: sequenceId,
            name,
            email,
            phone,
            subject,
            message,
            referenceId,
            submittedAt
        });

    } catch (error: any) {
        console.error('❌ Fatal error in contact form handler:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to submit contact form. Please try again later.',
            details: error.message
        });
    }
};
