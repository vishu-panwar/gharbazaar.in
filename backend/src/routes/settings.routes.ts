import express from 'express';
import { getSettings, updateSettings } from '../controllers/settings.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = express.Router();

// All settings routes require authentication
router.use(authenticate);

// GET /api/v1/settings - Get user settings
router.get('/', getSettings);

// PUT /api/v1/settings - Update user settings
router.put('/', updateSettings);

export default router;
