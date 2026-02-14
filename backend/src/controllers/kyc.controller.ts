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

export const submitKyc = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.userId;
        const { fullName, contactNumber, address, aadharNumber } = req.body;
        const files = req.files as { [fieldname: string]: Express.Multer.File[] };

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

        const partnerId = await generatePartnerId();

        // Create or update KYC request
        const kycRequest = await prisma.kycRequest.upsert({
            where: { userId },
            update: {
                fullName,
                contactNumber,
                address,
                aadharNumber,
                profileImage: profileImageUrl.url,
                aadharImage: aadharImageUrl.url,
                status: 'pending',
                updatedAt: new Date(),
            },
            create: {
                userId,
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
            where: { id: userId },
            data: { kycStatus: 'submitted' },
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
            where: status ? { status: String(status) } : {},
            include: {
                user: {
                    select: {
                        email: true,
                        role: true,
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
        const reviewerId = (req as any).user.userId;

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

        if (status === 'approved') {
            // Permanently update user
            await prisma.user.update({
                where: { id: kycRequest.userId },
                data: {
                    isVerified: true,
                    kycStatus: 'approved',
                    kycId: kycRequest.partnerId,
                    // Optionally update more fields from kycRequest if needed
                    name: kycRequest.fullName,
                    phone: kycRequest.contactNumber,
                },
            });

            // Delete temporary request
            await prisma.kycRequest.delete({ where: { id } });

            res.json({ success: true, message: 'KYC approved successfully' });
        } else {
            // Rejected
            await prisma.user.update({
                where: { id: kycRequest.userId },
                data: { kycStatus: 'rejected' },
            });

            // Delete temporary request as per requirement
            await prisma.kycRequest.delete({ where: { id } });

            res.json({ success: true, message: 'KYC rejected and request data deleted' });
        }
    } catch (error: any) {
        console.error('KYC Review Error:', error);
        res.status(500).json({ success: false, error: 'Failed to review KYC' });
    }
};

export const getMyKycStatus = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user.userId;
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { kycStatus: true, kycId: true, isVerified: true }
        });
        
        const kycRequest = await prisma.kycRequest.findUnique({
            where: { userId }
        });

        res.json({ 
            success: true, 
            data: { 
                status: user?.kycStatus, 
                kycId: user?.kycId, 
                isVerified: user?.isVerified,
                request: kycRequest 
            } 
        });
    } catch (error: any) {
        res.status(500).json({ success: false, error: 'Failed to fetch KYC status' });
    }
};
