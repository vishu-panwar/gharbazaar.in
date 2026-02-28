import express from 'express';
import multer from 'multer';
import { authenticate } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/roleGuard.middleware';
import * as partnerController from '../controllers/partner.controller';
import { MAX_FILE_SIZE } from '../utils/fileStorage';

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({
    storage,
    limits: { fileSize: MAX_FILE_SIZE },
});

router.post(
    '/cases',
    authenticate,
    requireRole(['legal_partner', 'ground_partner', 'promoter_partner', 'admin']),
    partnerController.createPartnerCase
);
router.get(
    '/cases',
    authenticate,
    requireRole(['legal_partner', 'ground_partner', 'promoter_partner', 'service_partner', 'admin']),
    partnerController.getPartnerCases
);
router.patch(
    '/cases/:id',
    authenticate,
    requireRole(['legal_partner', 'ground_partner', 'promoter_partner', 'service_partner', 'admin']),
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
    requireRole(['legal_partner', 'ground_partner', 'promoter_partner', 'service_partner', 'admin']),
    partnerController.getPayouts
);
router.post(
    '/payouts',
    authenticate,
    requireRole(['admin']),
    partnerController.createPayout
);

router.post(
    '/upload-document',
    authenticate,
    requireRole(['legal_partner', 'ground_partner', 'promoter_partner', 'service_partner', 'admin']),
    upload.single('file'),
    partnerController.uploadPartnerDocument
);

export default router;
