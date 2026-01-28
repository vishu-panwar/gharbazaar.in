import express from 'express';
import authRoutes from './auth.routes';
import chatRoutes from './chat.routes';
import ticketRoutes from './ticket.routes';
import employeeRoutes from './employee.routes';
<<<<<<< HEAD
import contactRoutes from './contact.routes';
import userRoutes from './user.routes';
import propertyRoutes from './property.routes';
import notificationRoutes from './notification.routes';
=======
>>>>>>> 27e598ded527a2c61948df157c36da50b6ff83d8

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/chat', chatRoutes);
router.use('/tickets', ticketRoutes);
router.use('/employee', employeeRoutes);
<<<<<<< HEAD
router.use('/contact', contactRoutes);
router.use('/users', userRoutes);
router.use('/properties', propertyRoutes);
router.use('/notifications', notificationRoutes);
=======
>>>>>>> 27e598ded527a2c61948df157c36da50b6ff83d8

router.get('/health', (req, res) => {
    res.json({ success: true, message: 'API is healthy', timestamp: new Date().toISOString() });
});

export default router;
