import express from 'express';
import * as propertyController from '../controllers/property.controller';
import { authenticate } from '../middleware/auth.middleware';
import { requireActivePlan, incrementPlanUsage } from '../middleware/planGuard.middleware';

const router = express.Router();

// Seller must have active plan to create listings
router.post('/', 
    authenticate, 
    requireActivePlan({ planType: 'seller', feature: 'listingLimit', incrementUsage: 'listingsUsed' }),
    propertyController.createProperty,
    incrementPlanUsage('listingsUsed')
);
router.get('/search', propertyController.searchProperties);
router.get('/:id', propertyController.getPropertyById);
router.get('/user/:userId', authenticate, propertyController.getUserProperties);

export default router;
