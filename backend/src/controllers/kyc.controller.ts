import { Request, Response } from 'express';
import { prisma } from '../utils/prisma';
import { uploadFile } from '../utils/fileStorage';

/**
 * Generate a unique Partner ID like gb2110e34
 */
async function generatePartnerId(): Promise<string> {
    const counter = await prisma.counter.upsert({
        where: { id: 'partner_id' },
        update: { seq: { increment: 1 } },
        create: { id: 'partner_id', seq: 1 },
    });

    const prefix = 'gb';
    const date = new Date();
    const yearMonth = `${date.getFullYear().toString().slice(-2)}${(date.getMonth() + 1).toString().padStart(2, '0')}`;
    const seq = counter.seq.toString().padStart(4, '0'); // gb24020001
    
    return `${prefix}${yearMonth}${seq}`;
}

async function resolveAuthenticatedUser(req: Request) {
    const authUserId = (req as any).user?.userId as string | undefined;
    if (!authUserId) return null;

    // JWT userId is typically uid. Fallback to internal id for compatibility.
    const byUid = await prisma.user.findUnique({
        where: { uid: authUserId },
        select: {
            id: true,
            uid: true,
            email: true,
            role: true,
            kycStatus: true,
            kycId: true,
            isVerified: true,
        },
    });
    if (byUid) return byUid;

    return prisma.user.findUnique({
        where: { id: authUserId },
        select: {
            id: true,
            uid: true,
            email: true,
            role: true,
            kycStatus: true,
            kycId: true,
            isVerified: true,
        },
    });
}

export const submitKyc = async (req: Request, res: Response) => {
    try {
        const user = await resolveAuthenticatedUser(req);
        if (!user) {
            return res.status(401).json({ success: false, error: 'Authentication required' });
        }

        const { fullName, contactNumber, address, aadharNumber } = req.body;
        const files = req.files as { [fieldname: string]: Express.Multer.File[] };

        if (!fullName || !contactNumber || !address || !aadharNumber) {
            return res.status(400).json({ success: false, error: 'All KYC fields are required' });
        }

        if (!files || !files['profileImage'] || !files['aadharImage']) {
            return res.status(400).json({ success: false, error: 'Both profile image and Aadhar image are required' });
        }

        // Upload images
        const profileImageUrl = await uploadFile(
            files['profileImage'][0].buffer,
            files['profileImage'][0].originalname,
            files['profileImage'][0].mimetype
        );

        const aadharImageUrl = await uploadFile(
            files['aadharImage'][0].buffer,
            files['aadharImage'][0].originalname,
            files['aadharImage'][0].mimetype
        );

        const existingRequest = await prisma.kycRequest.findUnique({
            where: { userId: user.id },
            select: { partnerId: true },
        });

        const partnerId = existingRequest?.partnerId || await generatePartnerId();

        // Create or update KYC request
        const kycRequest = await prisma.kycRequest.upsert({
            where: { userId: user.id },
            update: {
                fullName,
                contactNumber,
                address,
                aadharNumber,
                profileImage: profileImageUrl.url,
                aadharImage: aadharImageUrl.url,
                status: 'pending',
                reviewedBy: null,
                reviewComments: null,
                updatedAt: new Date(),
            },
            create: {
                userId: user.id,
                partnerId,
                fullName,
                contactNumber,
                address,
                aadharNumber,
                profileImage: profileImageUrl.url,
                aadharImage: aadharImageUrl.url,
                status: 'pending',
            },
        });

        // Update user status
        await prisma.user.update({
            where: { id: user.id },
            data: {
                kycStatus: 'pending',
                isVerified: false,
                onboardingCompleted: false,
            },
        });

        res.status(201).json({ success: true, data: kycRequest });
    } catch (error: any) {
        console.error('KYC Submission Error:', error);
        res.status(500).json({ success: false, error: error.message || 'Failed to submit KYC' });
    }
};

export const getKycRequests = async (req: Request, res: Response) => {
    try {
        const { status } = req.query;
        const requests = await prisma.kycRequest.findMany({
            where: status ? { status: String(status) } : undefined,
            include: {
                user: {
                    select: {
                        uid: true,
                        name: true,
                        email: true,
                        role: true,
                        phone: true,
                        kycStatus: true,
                        isVerified: true,
                    }
                }
            },
            orderBy: { createdAt: 'desc' },
        });

        res.json({ success: true, data: requests });
    } catch (error: any) {
        res.status(500).json({ success: false, error: 'Failed to fetch KYC requests' });
    }
};

export const reviewKyc = async (req: Request, res: Response) => {
    try {
        const { id } = req.params; // KycRequest ID
        const { status, reviewComments } = req.body; // 'approved' or 'rejected'
        const reviewer = await resolveAuthenticatedUser(req);
        if (!reviewer) {
            return res.status(401).json({ success: false, error: 'Authentication required' });
        }

        if (!['approved', 'rejected'].includes(status)) {
            return res.status(400).json({ success: false, error: 'Invalid status' });
        }

        const kycRequest = await prisma.kycRequest.findUnique({
            where: { id },
            include: { user: true }
        });

        if (!kycRequest) {
            return res.status(404).json({ success: false, error: 'KYC request not found' });
        }

        const reviewedRequest = await prisma.kycRequest.update({
            where: { id },
            data: {
                status,
                reviewedBy: reviewer.uid,
                reviewComments: reviewComments?.trim() || null,
            },
        });

        if (status === 'approved') {
            await prisma.user.update({
                where: { id: kycRequest.userId },
                data: {
                    isVerified: true,
                    kycStatus: 'approved',
                    kycId: kycRequest.partnerId,
                    onboardingCompleted: true,
                    name: kycRequest.fullName,
                    phone: kycRequest.contactNumber,
                    role: ['buyer', 'seller', 'user', 'client'].includes((kycRequest.user.role || '').toLowerCase())
                        ? 'service_partner'
                        : kycRequest.user.role,
                },
            });

            return res.json({
                success: true,
                message: 'KYC approved successfully',
                data: reviewedRequest,
            });
        }

        await prisma.user.update({
            where: { id: kycRequest.userId },
            data: {
                isVerified: false,
                kycStatus: 'rejected',
                kycId: null,
                onboardingCompleted: false,
            },
        });

        return res.json({
            success: true,
            message: 'KYC rejected successfully',
            data: reviewedRequest,
        });
    } catch (error: any) {
        console.error('KYC Review Error:', error);
        res.status(500).json({ success: false, error: 'Failed to review KYC' });
    }
};

export const getMyKycStatus = async (req: Request, res: Response) => {
    try {
        const user = await resolveAuthenticatedUser(req);
        if (!user) {
            return res.status(401).json({ success: false, error: 'Authentication required' });
        }
        
        const kycRequest = await prisma.kycRequest.findUnique({
            where: { userId: user.id }
        });

        res.json({ 
            success: true, 
            data: { 
                status: user.kycStatus,
                kycId: user.kycId,
                isVerified: user.isVerified,
                user: {
                    uid: user.uid,
                    email: user.email,
                    role: user.role,
                },
                request: kycRequest 
            } 
        });
    } catch (error: any) {
        res.status(500).json({ success: false, error: 'Failed to fetch KYC status' });
    }
};
