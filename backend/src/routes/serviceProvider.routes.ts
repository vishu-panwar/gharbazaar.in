import express from 'express';
import * as serviceProviderController from '../controllers/serviceProvider.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = express.Router();

// Public routes (no authentication required)
router.get('/stats', serviceProviderController.getProviderStats);
router.get('/search', serviceProviderController.searchProviders);
router.get('/category/:category', serviceProviderController.getProvidersByCategory);
router.get('/:id', serviceProviderController.getProviderById);
router.get('/', serviceProviderController.getAllProviders);

// Protected routes (authentication required)
router.get('/me', authenticate, serviceProviderController.getMyProviderProfile);
router.post('/', authenticate, serviceProviderController.createProvider);
router.post('/:id', authenticate, serviceProviderController.updateProvider);
router.post('/:id/book', authenticate, serviceProviderController.bookProvider);
router.delete('/:id', authenticate, serviceProviderController.deleteProvider);

export default router;
