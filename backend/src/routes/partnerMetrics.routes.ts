import { Router } from 'express';
import {
    getPartnerMetrics,
    getMonthMetrics,
    calculateMetrics,
    getLeaderboard,
} from '../controllers/partnerMetrics.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// Public leaderboard
router.get('/metrics/leaderboard', getLeaderboard);

// Protected routes - require authentication
router.use(authenticate);

router.get('/partners/:id/metrics', getPartnerMetrics);
router.get('/partners/:id/metrics/:year/:month', getMonthMetrics);
router.post('/partners/:id/metrics/calculate', calculateMetrics);

export default router;
