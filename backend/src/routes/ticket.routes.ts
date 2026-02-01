
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
import { authenticateRequest } from '../middleware/auth.middleware';
import { upload } from '../middleware/upload.middleware';

const router = express.Router();
router.use(authenticateRequest);
router.get('/', getUserTickets);
router.get('/employee/all', getAllTickets);
router.get('/:id', getTicketDetails);
router.post('/', createTicket);
router.post('/:id/assign', assignTicket);
router.post('/:id/messages', sendTicketMessage);
router.put('/:id/close', closeTicket);
router.post('/:id/upload', upload.single('file'), uploadTicketFile);

export default router;

