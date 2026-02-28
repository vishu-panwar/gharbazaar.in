
import { Request, Response } from 'express';
import { prisma } from '../utils/database';
import { uploadFile } from '../utils/fileStorage';

const ALLOWED_CASE_STATUSES = new Set([
    'open',
    'pending',
    'new',
    'accepted',
    'rejected',
    'in_progress',
    'completed',
    'cancelled',
]);

export const createPartnerCase = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.userId; // Firebase uid
        if (!userId) return res.status(401).json({ success: false, message: 'User not authenticated' });

        const user = await prisma.user.findUnique({ where: { uid: userId } });
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });

        const { type, title, description, propertyId, buyerId, sellerId, amount, dueDate, metadata } = req.body;
        if (!type || !title) {
            return res.status(400).json({ success: false, message: 'type and title are required' });
        }

        const partnerCase = await prisma.partnerCase.create({
            data: {
                partnerId: user.id, // Internal ID
                type,
                title,
                description,
                propertyId,
                buyerId,
                sellerId,
                amount: amount ? parseFloat(amount) : undefined,
                dueDate: dueDate ? new Date(dueDate) : undefined,
                metadata: metadata || {}
            }
        });

        res.status(201).json({ success: true, data: partnerCase });
    } catch (error: any) {
        console.error('createPartnerCase error:', error);
        res.status(500).json({ success: false, message: 'Failed to create partner case', error: error.message });
    }
};

export const getPartnerCases = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.userId; // Firebase uid
        if (!userId) return res.status(401).json({ success: false, message: 'User not authenticated' });

        const user = await prisma.user.findUnique({ where: { uid: userId } });
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });

        const { status, type } = req.query;
        const where: any = { partnerId: user.id };
        if (status) where.status = status as string;
        if (type) where.type = type as string;

        const include: any = {
            property: true,
            buyer: {
                select: { id: true, name: true, email: true, phone: true }
            }
        };

        const cases = await prisma.partnerCase.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            include
        });

        res.json({ success: true, data: cases });
    } catch (error: any) {
        console.error('getPartnerCases error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch cases', error: error.message });
    }
};

export const updatePartnerCase = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const userId = (req as any).user?.userId; // Firebase uid
        if (!userId) return res.status(401).json({ success: false, message: 'User not authenticated' });

        const user = await prisma.user.findUnique({ where: { uid: userId } });
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });

        const partnerCase = await prisma.partnerCase.findUnique({
            where: { id }
        });

        if (!partnerCase) return res.status(404).json({ success: false, message: 'Case not found' });
        if (partnerCase.partnerId !== user.id && (req as any).user?.role !== 'admin') {
            return res.status(403).json({ success: false, message: 'Not authorized' });
        }

        const { status, description, amount, dueDate, metadata } = req.body;
        const updateData: any = {};
        if (status) {
            const normalizedStatus = String(status).toLowerCase();
            if (!ALLOWED_CASE_STATUSES.has(normalizedStatus)) {
                return res.status(400).json({ success: false, message: 'Invalid case status' });
            }
            updateData.status = normalizedStatus;
        }
        if (description !== undefined) updateData.description = description;
        if (amount !== undefined) updateData.amount = parseFloat(amount);
        if (dueDate !== undefined) updateData.dueDate = dueDate ? new Date(dueDate) : null;
        if (metadata !== undefined) updateData.metadata = metadata;

        const updatedCase = await prisma.partnerCase.update({
            where: { id },
            data: updateData
        });

        if (updatedCase.buyerId && updateData.status && updateData.status !== partnerCase.status) {
            const buyer = await prisma.user.findUnique({
                where: { id: updatedCase.buyerId },
                select: { id: true, uid: true }
            });

            if (buyer) {
                const providerName = user.name || 'Service Partner';
                const statusLabelMap: Record<string, string> = {
                    accepted: 'accepted',
                    rejected: 'rejected',
                    in_progress: 'started',
                    completed: 'completed',
                    cancelled: 'cancelled',
                };
                const statusLabel = statusLabelMap[updateData.status] || updateData.status;

                const notification = await prisma.notification.create({
                    data: {
                        userId: buyer.id,
                        type: 'service_offer_status',
                        title: 'Service Offer Updated',
                        message: `${providerName} has ${statusLabel} your service offer.`,
                        priority: updateData.status === 'rejected' ? 'high' : 'medium',
                        link: '/dashboard/messages',
                        metadata: JSON.stringify({
                            caseId: updatedCase.id,
                            status: updateData.status,
                            partnerId: updatedCase.partnerId,
                        }),
                    }
                });

                const io = req.app.get('io');
                if (io) {
                    const buyerIdentity = buyer.uid || buyer.id;
                    io.to(`notifications:${buyerIdentity}`).emit('new_notification', notification);
                }
            }
        }

        res.json({ success: true, data: updatedCase });
    } catch (error: any) {
        console.error('updatePartnerCase error:', error);
        res.status(500).json({ success: false, message: 'Failed to update case', error: error.message });
    }
};

export const createReferral = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.userId; // Firebase uid
        const user = await prisma.user.findUnique({ where: { uid: userId } });
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });

        const { referralCode, leadName, leadContact, metadata } = req.body;
        if (!referralCode || !leadName || !leadContact) {
            return res.status(400).json({ success: false, message: 'referralCode, leadName, leadContact are required' });
        }

        const referral = await prisma.referral.create({
            data: {
                promoterId: user.id,
                referralCode,
                leadName,
                leadContact,
                metadata: metadata || {}
            }
        });

        res.status(201).json({ success: true, data: referral });
    } catch (error: any) {
        console.error('createReferral error:', error);
        res.status(500).json({ success: false, message: 'Failed to create referral' });
    }
};

export const getReferrals = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.userId;
        const user = await prisma.user.findUnique({ where: { uid: userId } });
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });

        const { status } = req.query;
        const where: any = { promoterId: user.id };
        if (status) where.status = status as string;

        const referrals = await prisma.referral.findMany({
            where,
            orderBy: { createdAt: 'desc' }
        });
        res.json({ success: true, data: referrals });
    } catch (error: any) {
        console.error('getReferrals error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch referrals' });
    }
};

export const getPayouts = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.userId;
        const user = await prisma.user.findUnique({ where: { uid: userId } });
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });

        const { status } = req.query;
        const where: any = { partnerId: user.id };
        if (status) where.status = status as string;

        const payouts = await prisma.payout.findMany({
            where,
            orderBy: { createdAt: 'desc' }
        });
        res.json({ success: true, data: payouts });
    } catch (error: any) {
        console.error('getPayouts error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch payouts' });
    }
};

export const createPayout = async (req: Request, res: Response) => {
    try {
        const { partnerId, amount, method, status, reference, periodStart, periodEnd, notes } = req.body;
        if (!partnerId || !amount) {
            return res.status(400).json({ success: false, message: 'partnerId and amount are required' });
        }

        const payout = await prisma.payout.create({
            data: {
                partnerId,
                amount: parseFloat(amount),
                method,
                status,
                reference,
                periodStart: periodStart ? new Date(periodStart) : null,
                periodEnd: periodEnd ? new Date(periodEnd) : null,
                notes
            }
        });

        res.status(201).json({ success: true, data: payout });
    } catch (error: any) {
        console.error('createPayout error:', error);
        res.status(500).json({ success: false, message: 'Failed to create payout' });
    }
};


export const uploadPartnerDocument = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.userId; // Firebase uid
        const user = await prisma.user.findUnique({ where: { uid: userId } });
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });

        const { caseId, category, name, description, tags, status, accessLevel } = req.body;
        const file = req.file;

        if (!file) {
            return res.status(400).json({ success: false, error: 'No file uploaded' });
        }

        // Upload file to storage
        const uploadResult = await uploadFile(file.buffer, file.originalname, file.mimetype);

        const newDocument = {
            id: `DOC-${Date.now()}`,
            name: name || file.originalname,
            url: uploadResult.url,
            type: file.mimetype.split('/')[1] || 'other',
            category: category || 'misc',
            size: file.size,
            uploadedBy: user.name || 'Partner',
            uploadedDate: new Date().toISOString(),
            status: status || 'active',
            accessLevel: accessLevel || 'restricted',
            description: description || '',
            tags: tags ? (Array.isArray(tags) ? tags : String(tags).split(',').map((t: string) => t.trim())) : [],
            version: 1
        };

        if (caseId) {
            // Add to PartnerCase metadata
            const partnerCase = await prisma.partnerCase.findUnique({
                where: { id: caseId }
            });

            if (!partnerCase) {
                return res.status(404).json({ success: false, error: 'Case not found' });
            }

            const metadata = (partnerCase.metadata as any) || {};
            const documents = metadata.documents || [];
            documents.push(newDocument);

            await prisma.partnerCase.update({
                where: { id: caseId },
                data: {
                    metadata: {
                        ...metadata,
                        documents
                    }
                }
            });
        } else {
            // Optional: Store in User metadata if caseId is missing
            // For now, let's just return the uploaded doc info
        }

        res.status(200).json({ success: true, data: newDocument });
    } catch (error: any) {
        console.error('uploadPartnerDocument error:', error);
        res.status(500).json({ success: false, message: 'Failed to upload document', error: error.message });
    }
};
