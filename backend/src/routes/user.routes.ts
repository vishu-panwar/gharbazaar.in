import express from 'express';
import * as userController from '../controllers/user.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = express.Router();

router.get('/', authenticate, userController.getProfile);
router.get('/profile', authenticate, userController.getProfile);
router.get('/stats', authenticate, userController.getStats);

export default router;
