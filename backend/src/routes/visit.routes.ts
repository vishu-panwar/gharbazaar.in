import express from 'express';
import { authenticate } from '../middleware/auth.middleware';
import * as visitController from '../controllers/visit.controller';

const router = express.Router();

router.post('/', authenticate, visitController.createVisit);
router.get('/buyer', authenticate, visitController.getBuyerVisits);
router.get('/seller', authenticate, visitController.getSellerVisits);
router.get('/partner', authenticate, visitController.getPartnerVisits);
router.patch('/:id', authenticate, visitController.updateVisit);

export default router;
