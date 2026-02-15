import { Router } from 'express';
import {
    createInquiry,
    getInquiries,
    getInquiryById,
    updateInquiryStatus,
    respondToInquiry,
    deleteInquiry,
} from '../controllers/propertyInquiry.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// Public route - anyone can create an inquiry
router.post('/properties/:id/inquiries', createInquiry);

// Protected routes - require authentication
router.use(authenticate);

router.get('/inquiries', getInquiries);
router.get('/inquiries/:id', getInquiryById);
router.patch('/inquiries/:id/status', updateInquiryStatus);
router.patch('/inquiries/:id/respond', respondToInquiry);
router.delete('/inquiries/:id', deleteInquiry);

export default router;
