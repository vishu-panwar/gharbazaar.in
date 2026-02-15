import { Request, Response } from 'express';
import { prisma } from '../utils/prisma';

export const createContract = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.userId;
        if (!userId) return res.status(401).json({ success: false, message: 'User not authenticated' });

        const { propertyId, bidId, buyerId, sellerId, agreedPrice, terms } = req.body;
        if (!propertyId || !agreedPrice) {
            return res.status(400).json({ success: false, message: 'propertyId and agreedPrice are required' });
        }

        const property = await prisma.property.findUnique({
            where: { id: propertyId }
        });
        if (!property) return res.status(404).json({ success: false, message: 'Property not found' });

        let finalBuyerId = buyerId;
        let finalSellerId = sellerId || property.sellerId;
        let finalPrice = agreedPrice;

        // If bidId is provided, fetch bid details
        if (bidId) {
            const bid = await prisma.bid.findUnique({
                where: { id: bidId }
            });
            if (bid) {
                finalBuyerId = bid.buyerId;
                finalSellerId = bid.sellerId;
                finalPrice = bid.status === 'countered' && bid.counterAmount ? bid.counterAmount : bid.bidAmount;
            }
        }

        if (!finalBuyerId || !finalSellerId) {
            return res.status(400).json({ success: false, message: 'buyerId and sellerId are required' });
        }

        const contract = await prisma.contract.create({
            data: {
                propertyId,
                bidId,
                buyerId: finalBuyerId,
                sellerId: finalSellerId,
                agreedPrice: finalPrice,
                terms: terms || []
            }
        });

        res.status(201).json({ success: true, data: contract });
    } catch (error: any) {
        console.error('createContract error:', error);
        res.status(500).json({ success: false, message: 'Failed to create contract', error: error.message });
    }
};

export const getBuyerContracts = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.userId;
        if (!userId) return res.status(401).json({ success: false, message: 'User not authenticated' });

        const { status } = req.query;
        const where: any = { buyerId: userId, deletedAt: null };
        if (status) where.status = status as string;

        const contracts = await prisma.contract.findMany({
            where,
            include: {
                property: {
                    select: {
                        title: true,
                        location: true,
                        price: true,
                        photos: true,
                        propertyType: true,
                        area: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        res.json({ success: true, data: contracts });
    } catch (error: any) {
        console.error('getBuyerContracts error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch contracts', error: error.message });
    }
};

export const getSellerContracts = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.userId;
        if (!userId) return res.status(401).json({ success: false, message: 'User not authenticated' });

        const { status } = req.query;
        const where: any = { sellerId: userId, deletedAt: null };
        if (status) where.status = status as string;

        const contracts = await prisma.contract.findMany({
            where,
            include: {
                property: {
                    select: {
                        title: true,
                        location: true,
                        price: true,
                        photos: true,
                        propertyType: true,
                        area: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        res.json({ success: true, data: contracts });
    } catch (error: any) {
        console.error('getSellerContracts error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch contracts', error: error.message });
    }
};

export const signContract = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const userId = (req as any).user?.userId;
        if (!userId) return res.status(401).json({ success: false, message: 'User not authenticated' });

        const contract = await prisma.contract.findUnique({
            where: { id }
        });
        if (!contract) return res.status(404).json({ success: false, message: 'Contract not found' });

        if (![contract.buyerId, contract.sellerId].includes(userId)) {
            return res.status(403).json({ success: false, message: 'Not authorized to sign this contract' });
        }

        const updateData: any = {};

        if (userId === contract.buyerId && !contract.signedBuyerAt) {
            updateData.signedBuyerAt = new Date();
            updateData.status = contract.signedSellerAt ? 'executed' : 'signed_buyer';
        }

        if (userId === contract.sellerId && !contract.signedSellerAt) {
            updateData.signedSellerAt = new Date();
            updateData.status = contract.signedBuyerAt ? 'executed' : 'signed_seller';
        }

        const updatedContract = await prisma.contract.update({
            where: { id },
            data: updateData
        });

        res.json({ success: true, data: updatedContract });
    } catch (error: any) {
        console.error('signContract error:', error);
        res.status(500).json({ success: false, message: 'Failed to sign contract', error: error.message });
    }
};

// @desc    Soft delete a contract
// @route   DELETE /api/v1/contracts/:id
// @access  Private (Buyer/Seller/Admin)
export const softDeleteContract = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const userId = (req as any).user?.uid;

        // Verify contract exists
        const contract = await prisma.contract.findUnique({
            where: { id },
            select: { id: true, buyerId: true, sellerId: true, deletedAt: true },
        });

        if (!contract || contract.deletedAt) {
            return res.status(404).json({
                success: false,
                message: 'Contract not found',
            });
        }

        // Soft delete the contract
        const updatedContract = await prisma.contract.update({
            where: { id },
            data: {
                deletedAt: new Date(),
                deletedBy: userId,
            },
        });

        res.json({
            success: true,
            message: 'Contract deleted successfully',
            data: updatedContract,
        });
    } catch (error: any) {
        console.error('softDeleteContract error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete contract',
            error: error.message,
        });
    }
};

// @desc    Restore a soft-deleted contract
// @route   POST /api/v1/contracts/:id/restore
// @access  Private (Admin)
export const restoreContract = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        // Verify contract exists and is deleted
        const contract = await prisma.contract.findUnique({
            where: { id },
            select: { id: true, deletedAt: true },
        });

        if (!contract) {
            return res.status(404).json({
                success: false,
                message: 'Contract not found',
            });
        }

        if (!contract.deletedAt) {
            return res.status(400).json({
                success: false,
                message: 'Contract is not deleted',
            });
        }

        // Restore the contract
        const restoredContract = await prisma.contract.update({
            where: { id },
            data: {
                deletedAt: null,
                deletedBy: null,
            },
        });

        res.json({
            success: true,
            message: 'Contract restored successfully',
            data: restoredContract,
        });
    } catch (error: any) {
        console.error('restoreContract error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to restore contract',
            error: error.message,
        });
    }
};
