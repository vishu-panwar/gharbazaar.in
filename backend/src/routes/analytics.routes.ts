import express from 'express';
import { authenticate } from '../middleware/auth.middleware';
import * as analyticsController from '../controllers/analytics.controller';

const router = express.Router();

router.get('/admin/dashboard', authenticate, analyticsController.getAdminDashboard);
router.get('/seller/insights', authenticate, analyticsController.getSellerInsights);
router.get('/search/suggestions', analyticsController.getSearchSuggestions);
router.post('/search/track', analyticsController.trackSearch);
router.get('/search/popular', analyticsController.getPopularSearches);
router.get('/property/:propertyId/performance', analyticsController.getPropertyPerformance);
router.get('/citywise', analyticsController.getCitywiseAnalytics);

export default router;
