import express from 'express';
import multer from 'multer';
import * as kycController from '../controllers/kyc.controller';
import { authenticate, authorizeRoles } from '../middleware/auth.middleware';
import { MAX_FILE_SIZE, ALLOWED_FILE_TYPES } from '../utils/fileStorage';

const router = express.Router();

// Custom multer instance for KYC with multiple fields
const storage = multer.memoryStorage();
const upload = multer({
    storage,
    limits: {
        fileSize: MAX_FILE_SIZE,
        files: 5, // Allow multiple files
    },
    fileFilter: (req, file, cb) => {
        if (ALLOWED_FILE_TYPES.images.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Only images are allowed for KYC (Profile and Aadhar)'));
        }
    }
});

const kycUpload = upload.fields([
    { name: 'profileImage', maxCount: 1 },
    { name: 'aadharImage', maxCount: 1 }
]);

// Partner routes
router.post('/submit', authenticate, kycUpload, kycController.submitKyc);
router.get('/status', authenticate, kycController.getMyKycStatus);

// Employee routes
router.get('/requests', authenticate, authorizeRoles('employee', 'admin'), kycController.getKycRequests);
router.post('/review/:id', authenticate, authorizeRoles('employee', 'admin'), kycController.reviewKyc);

export default router;
