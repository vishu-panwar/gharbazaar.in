import express from 'express';
import { authenticate } from '../middleware/auth.middleware';
import * as verificationController from '../controllers/verification.controller';

const router = express.Router();

router.post('/tasks', authenticate, verificationController.createVerificationTask);
router.get('/tasks', authenticate, verificationController.getVerificationTasks);
router.patch('/tasks/:id', authenticate, verificationController.updateVerificationTask);

router.post('/reports', authenticate, verificationController.createVerificationReport);
router.get('/reports', authenticate, verificationController.getVerificationReports);

export default router;
