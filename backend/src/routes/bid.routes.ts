import express from 'express';
import { authenticate } from '../middleware/auth.middleware';
import {
    createBid,
    getSellerBids,
    getBuyerBids,
    updateBidStatus,
    getPropertyBids
} from '../controllers/bid.controller';

const router = express.Router();

// Create bid (buyer)
router.post('/', authenticate, createBid);

// Get bids for seller's properties
router.get('/seller', authenticate, getSellerBids);

// Get bids placed by buyer
router.get('/buyer', authenticate, getBuyerBids);

// Get bids for specific property (seller)
router.get('/property/:propertyId', authenticate, getPropertyBids);

// Update bid status (seller)
router.patch('/:id', authenticate, updateBidStatus);

export default router;
