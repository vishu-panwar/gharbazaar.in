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

export default router;
