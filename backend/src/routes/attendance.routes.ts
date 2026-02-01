import express from 'express';
import * as attendanceController from '../controllers/attendance.controller';
import { authenticateRequest } from '../middleware/auth.middleware';

const router = express.Router();

router.use(authenticateRequest);

router.post('/mark', attendanceController.markAttendance);
router.get('/history', attendanceController.getAttendanceRecords);

export default router;
