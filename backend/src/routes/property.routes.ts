import express from 'express';
import * as propertyController from '../controllers/property.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = express.Router();

router.post('/', authenticate, propertyController.createProperty);
router.get('/search', propertyController.searchProperties);
router.get('/:id', propertyController.getPropertyById);
router.get('/user/:userId', authenticate, propertyController.getUserProperties);

export default router;
