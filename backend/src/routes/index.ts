import express from 'express';
import authRoutes from './auth.routes';
import adminRoutes from './admin.routes';
import attendanceRoutes from './attendance.routes';
import chatRoutes from './chat.routes';
import ticketRoutes from './ticket.routes';
import employeeRoutes from './employee.routes';
import contactRoutes from './contact.routes';
import userRoutes from './user.routes';
import propertyRoutes from './property.routes';
import notificationRoutes from './notification.routes';
import planRoutes from './plan.routes';
import bidRoutes from './bid.routes';
import verifyRoutes from './verify.routes';
import favoriteRoutes from './favorite.routes';
import visitRoutes from './visit.routes';
import verificationRoutes from './verification.routes';
import contractRoutes from './contract.routes';
import paymentRoutes from './payment.routes';
import partnerRoutes from './partner.routes';
import analyticsRoutes from './analytics.routes';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/admin', adminRoutes);
router.use('/attendance', attendanceRoutes);
router.use('/chat', chatRoutes);
router.use('/tickets', ticketRoutes);
router.use('/employee', employeeRoutes);
router.use('/contact', contactRoutes);
router.use('/users', userRoutes);
router.use('/properties', propertyRoutes);
router.use('/notifications', notificationRoutes);
router.use('/verify', verifyRoutes);
router.use('/', planRoutes);
router.use('/bids', bidRoutes);
router.use('/favorites', favoriteRoutes);
router.use('/visits', visitRoutes);
router.use('/verification', verificationRoutes);
router.use('/contracts', contractRoutes);
router.use('/payments', paymentRoutes);
router.use('/partners', partnerRoutes);
router.use('/analytics', analyticsRoutes);

router.get('/health', (req, res) => {
    res.json({ success: true, message: 'API is healthy', timestamp: new Date().toISOString() });
});

export default router;
