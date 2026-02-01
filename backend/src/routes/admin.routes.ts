import express from 'express';
import * as adminController from '../controllers/admin.controller';
import { authenticateRequest } from '../middleware/auth.middleware';

const router = express.Router();

// Middleware to check if user is admin
const isAdmin = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const user = (req as any).user;
    if (user && user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ success: false, error: 'Access denied. Admin role required.' });
    }
};

router.use(authenticateRequest);
router.use(isAdmin);

router.get('/employees', adminController.listEmployees);
router.post('/employees', adminController.addEmployee);
router.put('/employees/:id/profile', adminController.updateEmployeeProfile);
router.delete('/employees/:id', adminController.removeEmployee);

// User Management
router.get('/users', adminController.getAllClients);
router.delete('/users/:id', adminController.deleteClient);

// Dashboard Stats
router.get('/stats', adminController.getDashboardStats);

// Property Management
router.get('/properties', adminController.getAllProperties);
router.put('/properties/:id/status', adminController.updatePropertyStatus);
router.delete('/properties/:id', adminController.deleteProperty);

router.get('/salary', adminController.getSalaryRecords);
router.post('/salary/process', adminController.processSalary);
router.post('/announcements', adminController.broadcastAnnouncement);

// Database Administration
router.get('/database/export', adminController.exportDatabase);
router.post('/database/import', adminController.importDatabase);
router.get('/database/backups', adminController.listBackups);
router.post('/database/backup', adminController.createBackup);
router.post('/database/restore', adminController.restoreBackup);

export default router;
