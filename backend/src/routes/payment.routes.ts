import express from 'express';
import { authenticate } from '../middleware/auth.middleware';
import * as paymentController from '../controllers/payment.controller';

const router = express.Router();

router.post('/webhook', express.raw({ type: 'application/json' }), paymentController.handleWebhook);
router.post('/create', authenticate, paymentController.createPayment);
router.post('/verify', authenticate, paymentController.verifyPayment);
router.get('/', authenticate, paymentController.listPayments);

export default router;
