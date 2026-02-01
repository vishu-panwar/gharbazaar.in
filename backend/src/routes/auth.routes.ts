
import express from 'express';
import * as authController from '../controllers/auth.controller';

const router = express.Router();
router.post('/login', authController.login);
router.post('/signup', authController.signup);
router.post('/verify-token', authController.verifyToken);
router.post('/logout', authController.logout);
router.post('/google', authController.googleAuth);
router.post('/forgot-password', authController.forgotPassword);

export default router;

