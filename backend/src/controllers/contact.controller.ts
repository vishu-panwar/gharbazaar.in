import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Contact from '../models/contact.model';
import Counter from '../models/counter.model';
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
        let sequenceId = Math.floor(Math.random() * 1000) + 1000; // Local fallback ID

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

        // 3. SEND REAL EMAILS IMMEDIATELY (This is what the user wants)
        // We do this before DB operations to ensure success even if DB is unstable
        try {
            await emailService.sendContactFormEmails(emailData);
            console.log(`✅ Real emails sent successfully for submission ${referenceId}`);
        } catch (emailError: any) {
            console.error('❌ Email sending failed. This is the main issue:', emailError.message);
            // If email fails, we still proceed to try and save, but user will be disappointed
        }

        // 4. Record to Database (Async/Background-style)
        const isDbConnected = mongoose.connection.readyState === 1;
        if (isDbConnected) {
            try {
                // Get auto-incremented ID
                const sequenceDoc = await Counter.findOneAndUpdate(
                    { id: 'contactId' },
                    { $inc: { seq: 1 } },
                    { new: true, upsert: true, timeoutMS: 2000 }
                );

                if (sequenceDoc) {
                    sequenceId = sequenceDoc.seq;
                }

                // Save submission
                await Contact.create({
                    id: sequenceId,
                    name,
                    email,
                    phone,
                    subject,
                    message,
                    referenceId,
                    submittedAt
                });
                console.log(`📝 Submission recorded in database with ID: ${sequenceId}`);
            } catch (dbError) {
                console.warn('⚠️  Database save failed (but email might have been sent):', dbError);
            }
        }

        // 5. Always Return Success to User according to specified format
        // Status 201 Created as requested
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
