import express from 'express';
import * as propertyController from '../controllers/property.controller';
import { authenticate } from '../middleware/auth.middleware';
import { upload } from '../middleware/upload.middleware';
import { requireActivePlan } from '../middleware/planGuard.middleware';

const router = express.Router();

// Seller must have active plan to create listings
router.post(
  '/',
  authenticate,
  requireActivePlan({
    planType: 'seller',
    feature: 'listingLimit',
    incrementUsage: 'listingsUsed',
  }),
  propertyController.createProperty
);

router.get('/insights', propertyController.getMarketInsights);
router.get('/search', propertyController.searchProperties);
router.get('/:id', propertyController.getPropertyById);
router.put('/:id', authenticate, propertyController.updateProperty);
router.delete('/:id', authenticate, propertyController.deleteProperty);
router.post('/:id/view', propertyController.trackPropertyView);
router.post(
  '/upload',
  authenticate,
  upload.single('image'),
  propertyController.uploadPropertyImage
);
router.get('/user/:userId', authenticate, propertyController.getUserProperties);

export default router;
