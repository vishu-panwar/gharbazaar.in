import express from 'express';
import {
    createExpandRequest,
    checkExistingRequest,
    getMyRequest,
    checkUserLocation,
    getCityStats,
    getPriorityRequests,
    setPriority,
    removePriority
} from '../controllers/expandRequest.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = express.Router();

// Public route - check user location from IP
router.get('/check-location', checkUserLocation);

// Protected routes - require authentication
router.use(authenticate);

// User routes
router.post('/', createExpandRequest);
router.get('/check', checkExistingRequest);
router.get('/my', getMyRequest);

// Employee/Admin routes
router.get('/stats', getCityStats); // Employee & Admin
router.get('/priority', getPriorityRequests); // Admin only
router.post('/priority', setPriority); // Employee & Admin
router.delete('/priority', removePriority); // Employee & Admin

export default router;
