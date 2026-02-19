import express from 'express';
import multer from 'multer';
import * as serviceProviderController from '../controllers/serviceProvider.controller';
import { authenticate } from '../middleware/auth.middleware';
import { ALLOWED_FILE_TYPES, MAX_FILE_SIZE } from '../utils/fileStorage';

const router = express.Router();
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: MAX_FILE_SIZE,
        files: 1,
    },
    fileFilter: (req, file, cb) => {
        if (ALLOWED_FILE_TYPES.images.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed'));
        }
    }
});

// Public routes (no authentication required)
router.get('/stats', serviceProviderController.getProviderStats);
router.get('/search', serviceProviderController.searchProviders);
router.get('/category/:category', serviceProviderController.getProvidersByCategory);

// Protected routes (authentication required)
router.get('/me', authenticate, serviceProviderController.getMyProviderProfile);
router.post('/', authenticate, upload.single('profileImage'), serviceProviderController.createProvider);
router.put('/:id', authenticate, serviceProviderController.updateProvider);
router.post('/:id', authenticate, serviceProviderController.updateProvider);
router.post('/:id/book', authenticate, serviceProviderController.bookProvider);
router.delete('/:id', authenticate, serviceProviderController.deleteProvider);

// Keep param routes after specific static paths (e.g., /me)
router.get('/:id', serviceProviderController.getProviderById);
router.get('/', serviceProviderController.getAllProviders);

export default router;
