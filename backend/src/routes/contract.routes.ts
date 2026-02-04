import express from 'express';
import { authenticate } from '../middleware/auth.middleware';
import * as contractController from '../controllers/contract.controller';

const router = express.Router();

router.post('/', authenticate, contractController.createContract);
router.get('/buyer', authenticate, contractController.getBuyerContracts);
router.get('/seller', authenticate, contractController.getSellerContracts);
router.patch('/:id/sign', authenticate, contractController.signContract);

export default router;
