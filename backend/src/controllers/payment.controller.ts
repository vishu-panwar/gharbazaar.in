import { Request, Response } from 'express';
import crypto from 'crypto';
import Razorpay from 'razorpay';
import PaymentTransaction from '../models/paymentTransaction.model';

// Initialize Razorpay client lazily so it can read env vars at runtime
let razorpayInstance: Razorpay | null = null;

const getRazorpay = (): Razorpay => {
    if (!razorpayInstance) {
        const keyId = process.env.RAZORPAY_KEY_ID;
        const keySecret = process.env.RAZORPAY_KEY_SECRET;

        if (!keyId || !keySecret) {
            throw new Error('Razorpay credentials (RAZORPAY_KEY_ID / RAZORPAY_KEY_SECRET) are not set in .env');
        }

        razorpayInstance = new Razorpay({ key_id: keyId, key_secret: keySecret });
    }
    return razorpayInstance;
};

const verifyRazorpaySignature = (orderId: string, paymentId: string, signature: string): boolean => {
    const secret = process.env.RAZORPAY_KEY_SECRET;
    if (!secret) return false;
    const hmac = crypto.createHmac('sha256', secret);
    hmac.update(`${orderId}|${paymentId}`);
    return hmac.digest('hex') === signature;
};

const verifySimulatedSignature = (orderId: string, paymentId: string, signature: string): boolean => {
    if (!signature || !signature.startsWith('sig_')) return false;
    const payload = Buffer.from(`${orderId}|${paymentId}`, 'utf8').toString('base64').substring(0, 20);
    return signature === `sig_${payload}`;
};

/** POST /api/v1/payments/create */
export const createPayment = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.userId;
        if (!userId) return res.status(401).json({ success: false, message: 'User not authenticated' });

        const { amount, currency = 'INR', contractId, serviceId, metadata } = req.body;
        if (!amount || amount <= 0) {
            return res.status(400).json({ success: false, message: 'A valid amount is required' });
        }

        // Create a real Razorpay order when credentials are configured.
        // In non-production environments we allow a mock order fallback.
        let rzpOrder: { id: string; amount: number; currency: string };
        try {
            const razorpay = getRazorpay();
            const created = await razorpay.orders.create({
                amount: Math.round(amount * 100), // Razorpay expects paise (integer)
                currency,
                receipt: `rcpt_${Date.now()}`,
                notes: { userId, serviceId, ...(metadata || {}) },
            });

            rzpOrder = {
                id: created.id,
                amount: Number(created.amount),
                currency: created.currency,
            };
        } catch (error) {
            if (process.env.NODE_ENV === 'production') throw error;

            rzpOrder = {
                id: `order_demo_${Date.now()}`,
                amount: Math.round(amount * 100),
                currency,
            };
        }

        // Persist the order in MongoDB so we can verify it later
        const payment = await PaymentTransaction.create({
            userId,
            contractId,
            serviceId,
            amount,
            currency,
            status: 'created',
            razorpayOrderId: rzpOrder.id,
            metadata,
        });

        return res.status(201).json({
            success: true,
            data: {
                orderId: rzpOrder.id,
                amount: rzpOrder.amount,
                currency: rzpOrder.currency,
                paymentId: payment._id,
            },
        });
    } catch (error: any) {
        console.error('createPayment error:', error);
        return res.status(500).json({ success: false, message: 'Failed to create payment', error: error.message });
    }
};

/** POST /api/v1/payments/verify */
export const verifyPayment = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.userId;
        if (!userId) return res.status(401).json({ success: false, message: 'User not authenticated' });

        const { orderId, paymentId, signature } = req.body;
        if (!orderId || !paymentId) {
            return res.status(400).json({ success: false, message: 'orderId and paymentId are required' });
        }

        const strictValid = signature ? verifyRazorpaySignature(orderId, paymentId, signature) : false;
        const simulatedValid =
            process.env.NODE_ENV !== 'production' && signature
                ? verifySimulatedSignature(orderId, paymentId, signature)
                : false;

        if (!strictValid && !simulatedValid) {
            return res.status(400).json({
                success: false,
                message: 'Invalid payment signature - verification failed',
            });
        }

        const payment = await PaymentTransaction.findOneAndUpdate(
            { razorpayOrderId: orderId, userId },
            {
                status: 'captured',
                razorpayPaymentId: paymentId,
                razorpaySignature: signature,
            },
            { new: true }
        );

        return res.json({ success: true, data: payment, mode: strictValid ? 'razorpay' : 'simulated' });
    } catch (error: any) {
        console.error('verifyPayment error:', error);
        return res.status(500).json({ success: false, message: 'Failed to verify payment', error: error.message });
    }
};

/** GET /api/v1/payments */
export const listPayments = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.userId;
        if (!userId) return res.status(401).json({ success: false, message: 'User not authenticated' });

        const payments = await PaymentTransaction.find({ userId }).sort({ createdAt: -1 });
        return res.json({ success: true, data: payments });
    } catch (error: any) {
        console.error('listPayments error:', error);
        return res.status(500).json({ success: false, message: 'Failed to fetch payments', error: error.message });
    }
};

/** POST /api/v1/payments/webhook  (raw body required - already configured in server.ts) */
export const handleWebhook = async (req: Request, res: Response) => {
    try {
        const signature = req.headers['x-razorpay-signature'] as string | undefined;
        const secret = process.env.RAZORPAY_WEBHOOK_SECRET;

        if (!secret || !signature) {
            return res.status(400).json({ success: false, message: 'Webhook secret or signature missing' });
        }

        const bodyBuffer = req.body as Buffer;
        const expected = crypto.createHmac('sha256', secret).update(bodyBuffer).digest('hex');
        if (expected !== signature) {
            return res.status(400).json({ success: false, message: 'Invalid webhook signature' });
        }

        const payload = JSON.parse(bodyBuffer.toString('utf8'));
        const event = payload.event as string;
        const payment = payload?.payload?.payment?.entity;

        if (!payment) {
            return res.status(200).json({ success: true, message: 'No payment entity in payload' });
        }

        const orderId = payment.order_id as string;
        const paymentId = payment.id as string;

        const statusMap: Record<string, string> = {
            'payment.captured': 'captured',
            'payment.authorized': 'authorized',
            'payment.failed': 'failed',
        };

        const status = statusMap[event];
        if (status) {
            await PaymentTransaction.findOneAndUpdate(
                { razorpayOrderId: orderId },
                { status, razorpayPaymentId: paymentId, metadata: payment },
                { upsert: true }
            );
        }

        return res.json({ success: true });
    } catch (error: any) {
        console.error('Webhook error:', error);
        return res.status(500).json({ success: false, message: 'Webhook processing failed', error: error.message });
    }
};
