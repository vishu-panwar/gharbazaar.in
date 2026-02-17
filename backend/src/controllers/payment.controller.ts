import { Request, Response } from 'express';
import crypto from 'crypto';
import { prisma } from '../utils/prisma';

const generateOrderId = () => `order_demo_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

const verifyRazorpaySignature = (orderId: string, paymentId: string, signature: string) => {
    const secret = process.env.RAZORPAY_KEY_SECRET;
    if (!secret) return false;
    const hmac = crypto.createHmac('sha256', secret);
    hmac.update(`${orderId}|${paymentId}`);
    const digest = hmac.digest('hex');
    return digest === signature;
};

export const createPayment = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.userId;
        if (!userId) return res.status(401).json({ success: false, message: 'User not authenticated' });

        const { amount, currency = 'INR', type, planId, propertyId, notes } = req.body;
        if (!amount) {
            return res.status(400).json({ success: false, message: 'amount is required' });
        }

        const orderId = generateOrderId();

        const payment = await prisma.paymentTransaction.create({
            data: {
                userId,
                amount,
                currency,
                type: type || 'subscription',
                planId,
                propertyId,
                status: 'pending',
                razorpayOrderId: orderId,
                notes
            }
        });

        res.status(201).json({
            success: true,
            data: {
                orderId,
                amount,
                currency,
                paymentId: payment.id
            }
        });
    } catch (error: any) {
        console.error('createPayment error:', error);
        res.status(500).json({ success: false, message: 'Failed to create payment', error: error.message });
    }
};

export const verifyPayment = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.userId;
        if (!userId) return res.status(401).json({ success: false, message: 'User not authenticated' });

        const { orderId, paymentId, signature } = req.body;
        if (!orderId || !paymentId) {
            return res.status(400).json({ success: false, message: 'orderId and paymentId are required' });
        }

        const isSignatureValid = signature ? verifyRazorpaySignature(orderId, paymentId, signature) : false;
        const isDemoValid = paymentId.startsWith('pay_') || paymentId === 'demo-payment';

        const isValid = isSignatureValid || isDemoValid;
        if (!isValid) {
            return res.status(400).json({ success: false, message: 'Invalid payment verification' });
        }

        const payment = await prisma.paymentTransaction.updateMany({
            where: {
                razorpayOrderId: orderId,
                userId
            },
            data: {
                status: 'captured',
                razorpayPaymentId: paymentId,
                razorpaySignature: signature
            }
        });

        // Fetch the updated payment to return
        const updatedPayment = await prisma.paymentTransaction.findFirst({
            where: {
                razorpayOrderId: orderId,
                userId
            }
        });

        res.json({ success: true, data: updatedPayment });
    } catch (error: any) {
        console.error('verifyPayment error:', error);
        res.status(500).json({ success: false, message: 'Failed to verify payment', error: error.message });
    }
};

export const listPayments = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.userId;
        if (!userId) return res.status(401).json({ success: false, message: 'User not authenticated' });

        const payments = await prisma.paymentTransaction.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' }
        });

        res.json({ success: true, data: payments });
    } catch (error: any) {
        console.error('listPayments error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch payments', error: error.message });
    }
};

export const handleWebhook = async (req: Request, res: Response) => {
    try {
        const signature = req.headers['x-razorpay-signature'] as string | undefined;
        const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
        if (!secret || !signature) {
            return res.status(400).json({ success: false, message: 'Webhook signature missing' });
        }

        const bodyBuffer = req.body as Buffer;
        const expected = crypto.createHmac('sha256', secret).update(bodyBuffer).digest('hex');
        if (expected !== signature) {
            return res.status(400).json({ success: false, message: 'Invalid webhook signature' });
        }

        const payload = JSON.parse(bodyBuffer.toString('utf8'));
        const event = payload.event;
        const payment = payload?.payload?.payment?.entity;

        if (!payment) {
            return res.status(200).json({ success: true, message: 'No payment entity' });
        }

        const orderId = payment.order_id;
        const paymentId = payment.id;

        let status: any = undefined;
        if (event === 'payment.captured') status = 'captured';
        if (event === 'payment.authorized') status = 'authorized';
        if (event === 'payment.failed') status = 'failed';

        if (status) {
            await prisma.paymentTransaction.updateMany({
                where: { razorpayOrderId: orderId },
                data: {
                    status,
                    razorpayPaymentId: paymentId,
                    paidAt: new Date()
                }
            });
        }

        res.json({ success: true });
    } catch (error: any) {
        console.error('Webhook error:', error);
        res.status(500).json({ success: false, message: 'Webhook processing failed', error: error.message });
    }
};
