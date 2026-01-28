
import express from 'express';
import * as authController from '../controllers/auth.controller';

const router = express.Router();
router.post('/login', authController.login);
router.post('/register', authController.register);
router.post('/verify-token', authController.verifyToken);
router.post('/logout', authController.logout);
router.post('/forgot-password', (req, res) => {
    res.json({ success: true, message: 'Reset email sent (Mock)' });
});

export default router;

