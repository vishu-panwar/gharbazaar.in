import express from 'express';
import * as authController from '../controllers/auth.controller';

const router = express.Router();

// Align with Koyeb Swagger: PUT /verify/reset-password
router.put('/reset-password', authController.resetPassword);

// Align with Koyeb Swagger: PUT /verify/email
router.put('/email', (req, res) => {
    res.json({ success: true, message: 'Email verified (Mock/Parity)' });
});

export default router;
