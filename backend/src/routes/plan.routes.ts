import { Router } from 'express';
import * as planController from '../controllers/plan.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// Public routes
router.get('/plans', planController.getAllPlans);

// Protected routes
router.get('/user/plan', authenticate, planController.getUserPlan);

export default router;
