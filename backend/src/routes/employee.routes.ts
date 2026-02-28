import express from 'express';
import * as employeeController from '../controllers/employee.controller';
import { authenticateRequest, authorizeRoles } from '../middleware/auth.middleware';

const router = express.Router();

router.use(authenticateRequest);
router.use(authorizeRoles('employee', 'admin'));

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
router.post('/schedule-visit', employeeController.scheduleVisit);
router.post('/verify-property/:id', employeeController.verifyProperty);
router.post('/unverify-property/:id', employeeController.unverifyProperty);
router.get('/leads', employeeController.getReferralLeads);
router.post('/onboarding', employeeController.completeOnboarding);

export default router;
