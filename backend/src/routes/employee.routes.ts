import express from 'express';
import * as employeeController from '../controllers/employee.controller';
import { authenticateRequest } from '../middleware/auth.middleware';

const router = express.Router();

router.use(authenticateRequest);

router.get('/tickets', employeeController.getTickets);
router.get('/active-conversations', employeeController.getActiveConversations);
router.post('/quick-response', employeeController.sendQuickResponse);
router.get('/user-history/:userId', employeeController.getUserHistory);
router.get('/stats', employeeController.getEmployeeStats);
router.get('/pending-properties', employeeController.getPendingProperties);
router.get('/approved-properties', employeeController.getApprovedProperties);
router.post('/approve-property/:id', employeeController.approveProperty);
router.post('/reject-property/:id', employeeController.rejectProperty);
router.post('/toggle-property-pause/:id', employeeController.togglePropertyPause);
router.post('/onboarding', employeeController.completeOnboarding);

export default router;
