import { Request, Response } from 'express';
import Contract from '../models/contract.model';
import Property from '../models/property.model';
import Bid from '../models/bid.model';

export const createContract = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.userId;
        if (!userId) return res.status(401).json({ success: false, message: 'User not authenticated' });

        const { propertyId, bidId, buyerId, sellerId, agreedPrice, terms } = req.body;
        if (!propertyId || !agreedPrice) {
            return res.status(400).json({ success: false, message: 'propertyId and agreedPrice are required' });
        }

        const property = await Property.findById(propertyId);
        if (!property) return res.status(404).json({ success: false, message: 'Property not found' });

        let finalBuyerId = buyerId;
        let finalSellerId = sellerId || property.sellerId;
        let finalPrice = agreedPrice;

        if (bidId) {
            const bid = await Bid.findById(bidId);
            if (bid) {
                finalBuyerId = bid.buyerId;
                finalSellerId = bid.sellerId;
                finalPrice = bid.status === 'countered' && bid.counterAmount ? bid.counterAmount : bid.bidAmount;
            }
        }

        if (!finalBuyerId || !finalSellerId) {
            return res.status(400).json({ success: false, message: 'buyerId and sellerId are required' });
        }

        const contract = await Contract.create({
            propertyId,
            bidId,
            buyerId: finalBuyerId,
            sellerId: finalSellerId,
            agreedPrice: finalPrice,
            terms
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
        const query: any = { buyerId: userId };
        if (status) query.status = status;

        const contracts = await Contract.find(query)
            .populate('propertyId', 'title location price photos propertyType area')
            .sort({ createdAt: -1 });

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
        const query: any = { sellerId: userId };
        if (status) query.status = status;

        const contracts = await Contract.find(query)
            .populate('propertyId', 'title location price photos propertyType area')
            .sort({ createdAt: -1 });

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

        const contract = await Contract.findById(id);
        if (!contract) return res.status(404).json({ success: false, message: 'Contract not found' });

        if (![contract.buyerId, contract.sellerId].includes(userId)) {
            return res.status(403).json({ success: false, message: 'Not authorized to sign this contract' });
        }

        if (userId === contract.buyerId && !contract.signedBuyerAt) {
            contract.signedBuyerAt = new Date();
            contract.status = contract.signedSellerAt ? 'executed' : 'signed_buyer';
        }

        if (userId === contract.sellerId && !contract.signedSellerAt) {
            contract.signedSellerAt = new Date();
            contract.status = contract.signedBuyerAt ? 'executed' : 'signed_seller';
        }

        await contract.save();
        res.json({ success: true, data: contract });
    } catch (error: any) {
        console.error('signContract error:', error);
        res.status(500).json({ success: false, message: 'Failed to sign contract', error: error.message });
    }
};
