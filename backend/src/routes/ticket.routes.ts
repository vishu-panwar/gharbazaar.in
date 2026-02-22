
import express from 'express';
import {
    getUserTickets,
    getAllTickets,
    getTicketDetails,
    createTicket,
    assignTicket,
    sendTicketMessage,
    closeTicket,
    uploadTicketFile,
} from '../controllers/ticket.controller';
import { authenticateRequest, authorizeRoles } from '../middleware/auth.middleware';
import { upload } from '../middleware/upload.middleware';

const router = express.Router();
router.use(authenticateRequest);
router.get('/', getUserTickets);
router.get('/employee/all', authorizeRoles('employee', 'admin'), getAllTickets);
router.get('/:id', getTicketDetails);
router.post('/', createTicket);
router.post('/:id/assign', authorizeRoles('employee', 'admin'), assignTicket);
router.post('/:id/messages', sendTicketMessage);
router.put('/:id/close', authorizeRoles('employee', 'admin'), closeTicket);
router.post('/:id/upload', upload.single('file'), uploadTicketFile);

export default router;

