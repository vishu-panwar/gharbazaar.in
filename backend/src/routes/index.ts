import express from 'express';
import { sendContactForm } from '../controllers/contact.controller';
import logger from '../utils/logger';
import authRoutes from './auth.routes';
import contactRoutes from './contact.routes';
import planRoutes from './plan.routes';
import analyticsRoutes from './analytics.routes';
import adminRoutes from './admin.routes';
import attendanceRoutes from './attendance.routes';
import chatRoutes from './chat.routes';
import ticketRoutes from './ticket.routes';
import employeeRoutes from './employee.routes';
import userRoutes from './user.routes';
import propertyRoutes from './property.routes';
import notificationRoutes from './notification.routes';
import bidRoutes from './bid.routes';
import verifyRoutes from './verify.routes';
import favoriteRoutes from './favorite.routes';
import visitRoutes from './visit.routes';
import verificationRoutes from './verification.routes';
import contractRoutes from './contract.routes';
import paymentRoutes from './payment.routes';
import partnerRoutes from './partner.routes';
import serviceProviderRoutes from './serviceProvider.routes';
import kycRoutes from './kyc.routes';
import locationRequestRoutes from './locationRequest.routes';
import expandRequestRoutes from './expandRequest.routes';
import settingsRoutes from './settings.routes';
import propertyInquiryRoutes from './propertyInquiry.routes';
import partnerMetricsRoutes from './partnerMetrics.routes';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/contact', contactRoutes);
// Alias for compatibility with external Koyeb API paths
router.post('/forms', sendContactForm);
router.use('/', planRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/admin', adminRoutes);
router.use('/attendance', attendanceRoutes);
router.use('/chat', chatRoutes);
router.use('/tickets', ticketRoutes);
router.use('/employee', employeeRoutes);
router.use('/users', userRoutes);
router.use('/properties', propertyRoutes);
router.use('/notifications', notificationRoutes);
router.use('/bids', bidRoutes);
router.use('/verify', verifyRoutes);
router.use('/favorites', favoriteRoutes);
router.use('/visits', visitRoutes);
router.use('/verification', verificationRoutes);
router.use('/contracts', contractRoutes);
router.use('/payments', paymentRoutes);
router.use('/partners', partnerRoutes);
router.use('/service-providers', serviceProviderRoutes);
router.use('/kyc', kycRoutes);
router.use('/location-requests', locationRequestRoutes);
router.use('/expand-requests', expandRequestRoutes);
router.use('/settings', settingsRoutes);

// Phase 2 Routes
router.use('/', propertyInquiryRoutes); // Includes /properties/:id/inquiries and /inquiries
router.use('/', partnerMetricsRoutes); // Includes /partners/:id/metrics and /metrics/leaderboard

router.get('/health', (req, res) => {
    res.json({ success: true, message: 'API is healthy', timestamp: new Date().toISOString() });
});

// Endpoint for receiving frontend error logs
router.post('/logs/error', (req, res) => {
    try {
        const payload = req.body || {}
        // Log at error level with payload
        logger.error('Frontend error log received', { payload })
        return res.status(200).json({ success: true })
    } catch (err) {
        logger.error('Failed to process frontend error log', { error: err })
        return res.status(500).json({ success: false, error: 'Failed to process log' })
    }
})

export default router;
