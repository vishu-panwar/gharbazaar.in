import express from 'express';
import { 
    createLocationRequest, 
    getLocationRequestStats, 
    sendToAdmin,
    getAdminRequests,
    getMyRequest
} from '../controllers/locationRequest.controller';
import { authenticateUser, authorizeRoles } from '../middleware/auth.middleware';

const router = express.Router();

// Public routes (none for now)

// Authenticated routes
router.use(authenticateUser);

// User routes
router.post('/', createLocationRequest);
router.get('/me', getMyRequest);

// Employee routes
router.get('/stats', authorizeRoles('employee', 'admin'), getLocationRequestStats);
router.post('/send-to-admin', authorizeRoles('employee', 'admin'), sendToAdmin);

// Admin routes
router.get('/admin-requests', authorizeRoles('admin'), getAdminRequests);

export default router;
