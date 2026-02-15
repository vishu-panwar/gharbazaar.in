import express from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/roleGuard.middleware';
import * as partnerController from '../controllers/partner.controller';

const router = express.Router();

// Partner CRUD
router.get('/', authenticate, requireRole(['admin']), partnerController.getAllPartners);
router.get('/:uid', authenticate, requireRole(['admin', 'promoter_partner', 'legal_partner', 'ground_partner']), partnerController.getPartnerByUid);
router.post('/', authenticate, requireRole(['admin']), partnerController.createPartner);
router.put('/:uid', authenticate, requireRole(['admin']), partnerController.updatePartner);
router.delete('/:uid', authenticate, requireRole(['admin']), partnerController.deletePartner);

// Payout Management
router.post('/:uid/payout', authenticate, requireRole(['admin']), partnerController.createPayout);

// Partner Portal Endpoints
router.get('/dashboard', authenticate, requireRole(['promoter_partner', 'legal_partner', 'ground_partner', 'admin']), partnerController.getPartnerDashboard);
router.get('/leads', authenticate, requireRole(['promoter_partner', 'admin']), partnerController.getPartnerLeads);

export default router;
