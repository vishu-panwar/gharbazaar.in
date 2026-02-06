import express from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/roleGuard.middleware';
import * as partnerController from '../controllers/partner.controller';

const router = express.Router();

router.post(
    '/cases',
    authenticate,
    requireRole(['legal_partner', 'ground_partner', 'promoter_partner', 'admin']),
    partnerController.createPartnerCase
);
router.get(
    '/cases',
    authenticate,
    requireRole(['legal_partner', 'ground_partner', 'promoter_partner', 'admin']),
    partnerController.getPartnerCases
);
router.patch(
    '/cases/:id',
    authenticate,
    requireRole(['legal_partner', 'ground_partner', 'promoter_partner', 'admin']),
    partnerController.updatePartnerCase
);

router.post(
    '/referrals',
    authenticate,
    requireRole(['promoter_partner', 'admin']),
    partnerController.createReferral
);
router.get(
    '/referrals',
    authenticate,
    requireRole(['promoter_partner', 'admin']),
    partnerController.getReferrals
);

router.get(
    '/payouts',
    authenticate,
    requireRole(['legal_partner', 'ground_partner', 'promoter_partner', 'admin']),
    partnerController.getPayouts
);
router.post(
    '/payouts',
    authenticate,
    requireRole(['admin']),
    partnerController.createPayout
);

export default router;
