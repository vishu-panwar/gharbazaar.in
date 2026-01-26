import express from 'express';
import authRoutes from './auth.routes';
import chatRoutes from './chat.routes';
import ticketRoutes from './ticket.routes';
import employeeRoutes from './employee.routes';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/chat', chatRoutes);
router.use('/tickets', ticketRoutes);
router.use('/employee', employeeRoutes);

router.get('/health', (req, res) => {
    res.json({ success: true, message: 'API is healthy', timestamp: new Date().toISOString() });
});

export default router;
